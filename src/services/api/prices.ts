import {
  getCoinGeckoConfig,
  getNextCoinGeckoApiKey,
  getRandomCoinGeckoApiKey,
} from '../../utils/config/coingecko';
import { getPriceProvider } from '../../utils/config/prices';
import { getCmcConfig, getRandomCmcApiKey } from '../../utils/config/cmc';

export interface PriceResult {
  price: number;
  lastUpdated: number;
}

const fetchJson = async (url: string, apiKey?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey && !/REPLACE_ME/i.test(apiKey)) {
    // Support both free and pro header names
    headers['x-cg-pro-api-key'] = apiKey;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    console.log('[prices] HTTP error', res.status, 'URL', url, 'Body', body);
    throw new Error(`Price fetch failed: ${res.status}`);
  }
  return res.json();
};

// CoinMarketCap fetch helper
const fetchJsonCmc = async (url: string, apiKey?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey && !/REPLACE_ME/i.test(apiKey)) {
    // Proper CMC header name
    headers['X-CMC_PRO_API_KEY'] = apiKey;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    console.log(
      '[prices][cmc] HTTP error',
      res.status,
      'URL',
      url,
      'Body',
      body,
    );
    throw new Error(`Price fetch failed: ${res.status}`);
  }
  return res.json();
};

export const fetchEthPriceUsd = async (): Promise<PriceResult> => {
  if (getPriceProvider() === 'coinmarketcap') {
    const { baseUrl, vsCurrency } = getCmcConfig();
    const convert = (vsCurrency || 'USD').toUpperCase();
    const url = `${baseUrl}/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=${encodeURIComponent(
      convert,
    )}`;
    const json = await fetchJsonCmc(url, getRandomCmcApiKey());
    const data =
      (json && (json as any).data && ((json as any).data as any).ETH) ||
      ((json &&
        (json as any).data &&
        Object.values((json as any).data)[0]) as any);
    const value = Number(data?.quote?.[convert]?.price);
    if (!isFinite(value)) throw new Error('Invalid price response');
    return { price: value, lastUpdated: Date.now() };
  }

  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  const url = `${baseUrl}/simple/price?ids=ethereum&vs_currencies=${vsCurrency}`;
  const json = await fetchJson(url, getRandomCoinGeckoApiKey());
  // Debug log payload for troubleshooting (non-sensitive)
  try {
    console.log(
      '[prices] token price response size',
      typeof json === 'object' && json ? Object.keys(json).length : 'n/a',
    );
  } catch {}
  const value = Number(json?.ethereum?.[vsCurrency]);
  if (!isFinite(value)) throw new Error('Invalid price response');
  return { price: value, lastUpdated: Date.now() };
};

export interface MarketResult extends PriceResult {
  changePct24h: number;
}

export const fetchEthMarketData = async (): Promise<MarketResult> => {
  if (getPriceProvider() === 'coinmarketcap') {
    try {
      const { baseUrl, vsCurrency } = getCmcConfig();
      const convert = (vsCurrency || 'USD').toUpperCase();
      const url = `${baseUrl}/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=${encodeURIComponent(
        convert,
      )}`;
      const json = await fetchJsonCmc(url, getRandomCmcApiKey());
      const data =
        (json && (json as any).data && ((json as any).data as any).ETH) ||
        ((json &&
          (json as any).data &&
          Object.values((json as any).data)[0]) as any);
      const price = Number(data?.quote?.[convert]?.price);
      const change = Number(data?.quote?.[convert]?.percent_change_24h);
      if (!isFinite(price)) throw new Error('Invalid market price');
      return {
        price,
        changePct24h: isFinite(change) ? change : 0,
        lastUpdated: Date.now(),
      };
    } catch (_e) {
      // Fallback to CoinGecko if CMC fails
    }
  }

  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  const url = `${baseUrl}/coins/markets?vs_currency=${vsCurrency}&ids=ethereum&sparkline=false&price_change_percentage=24h`;
  const json = await fetchJson(url, getRandomCoinGeckoApiKey());
  const item = Array.isArray(json) ? json[0] : undefined;
  if (!item) throw new Error('Market data not available');
  const price = Number(item?.current_price);
  const change = Number(
    item?.price_change_percentage_24h_in_currency ??
      item?.price_change_percentage_24h,
  );
  if (!isFinite(price)) throw new Error('Invalid market price');
  return {
    price,
    changePct24h: isFinite(change) ? change : 0,
    lastUpdated: Date.now(),
  };
};

// ===== Native coin market data by chain =====

const cmcSymbolByChainId: Record<number, string> = {
  1: 'ETH',
  56: 'BNB',
  // Polygon native token rebrand MATIC -> POL. Try POL first, then MATIC.
  137: 'POL',
};

const coingeckoIdByChainId: Record<number, string> = {
  1: 'ethereum',
  56: 'binancecoin',
  // Prefer POL id when available, fallback to historical MATIC id
  137: 'polygon-ecosystem-token',
};

export const fetchNativeMarketData = async (
  chainId: number,
): Promise<MarketResult> => {
  if (getPriceProvider() === 'coinmarketcap') {
    // Try multiple symbols when rebrands occur (e.g., MATIC -> POL)
    const candidates: string[] = (() => {
      if (chainId === 137) return ['POL', 'MATIC'];
      const sym = cmcSymbolByChainId[chainId] || 'ETH';
      return [sym];
    })();
    const { baseUrl, vsCurrency } = getCmcConfig();
    const convert = (vsCurrency || 'USD').toUpperCase();
    for (const symbol of candidates) {
      try {
        const url = `${baseUrl}/v1/cryptocurrency/quotes/latest?symbol=${encodeURIComponent(
          symbol,
        )}&convert=${encodeURIComponent(convert)}`;
        const json = await fetchJsonCmc(url, getRandomCmcApiKey());
        const data =
          (json && (json as any).data && ((json as any).data as any)[symbol]) ||
          ((json &&
            (json as any).data &&
            Object.values((json as any).data)[0]) as any);
        const price = Number(data?.quote?.[convert]?.price);
        const change = Number(data?.quote?.[convert]?.percent_change_24h);
        if (!isFinite(price)) throw new Error('Invalid market price');
        return {
          price,
          changePct24h: isFinite(change) ? change : 0,
          lastUpdated: Date.now(),
        };
      } catch (_e) {
        // try next candidate; continue
      }
    }
    // If all candidates fail, fall through to CoinGecko
  }

  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  const cgCandidates: string[] = (() => {
    if (chainId === 137) return ['polygon-ecosystem-token', 'matic-network'];
    const id = coingeckoIdByChainId[chainId] || 'ethereum';
    return [id];
  })();
  for (const cgId of cgCandidates) {
    try {
      const url = `${baseUrl}/coins/markets?vs_currency=${vsCurrency}&ids=${cgId}&sparkline=false&price_change_percentage=24h`;
      const json = await fetchJson(url, getRandomCoinGeckoApiKey());
      const item = Array.isArray(json) ? json[0] : undefined;
      if (!item) throw new Error('Market data not available');
      const price = Number(item?.current_price);
      const change = Number(
        item?.price_change_percentage_24h_in_currency ??
          item?.price_change_percentage_24h,
      );
      if (!isFinite(price)) throw new Error('Invalid market price');
      return {
        price,
        changePct24h: isFinite(change) ? change : 0,
        lastUpdated: Date.now(),
      };
    } catch (_e) {
      // try next candidate
    }
  }
  throw new Error('Market data not available');
};

// ===== ERC-20 token market data (by contract address) =====

export interface TokenMarketResult extends PriceResult {
  changePct24h: number;
}

const platformByChainId: Record<number, string> = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'polygon-pos',
};

/**
 * Fetch market data for multiple ERC-20 tokens by contract addresses on a given chain.
 * Currently supports Ethereum via CoinGecko's simple token price endpoint.
 */
export const fetchErc20MarketData = async (
  chainId: number,
  contractAddresses: string[],
): Promise<Record<string, TokenMarketResult>> => {
  if (getPriceProvider() === 'coinmarketcap') {
    const { baseUrl, vsCurrency } = getCmcConfig();
    const convert = (vsCurrency || 'USD').toUpperCase();
    const unique = Array.from(
      new Set(contractAddresses.map(a => a.trim()).filter(Boolean)),
    );
    if (unique.length === 0) return {};

    // For CMC, we resolve each contract address to a CMC ID regardless of chain

    const result: Record<string, TokenMarketResult> = {};
    for (const checksumAddr of unique) {
      const lower = checksumAddr.toLowerCase();
      try {
        // 1) Resolve contract address -> CMC ID
        const infoUrl = `${baseUrl}/v2/cryptocurrency/info?address=${encodeURIComponent(
          checksumAddr,
        )}&skip_invalid=true`;
        const infoJson = await fetchJsonCmc(infoUrl, getRandomCmcApiKey());
        let cmcId: number | undefined;
        const data = (infoJson as any)?.data;
        if (data) {
          if (data[lower]) {
            const entry = Array.isArray(data[lower])
              ? data[lower][0]
              : data[lower];
            cmcId = Number(entry?.id);
          } else if (typeof data === 'object') {
            const match = Object.values(data).find((v: any) => {
              const platformAddr =
                v?.platform?.token_address ||
                v?.contract_address?.[0]?.contract_address;
              return (
                (platformAddr &&
                  String(platformAddr).toLowerCase() === lower) ||
                (Array.isArray(v?.contract_address) &&
                  v.contract_address.some(
                    (c: any) =>
                      String(c?.contract_address).toLowerCase() === lower,
                  ))
              );
            });
            if (match) cmcId = Number((match as any)?.id);
          }
        }

        if (!cmcId || !isFinite(cmcId)) {
          console.log(
            '[prices][cmc] could not resolve CMC id for',
            checksumAddr,
            'info:',
            infoJson,
          );
          continue;
        }

        // 2) Fetch quote by ID
        const quoteUrl = `${baseUrl}/v2/cryptocurrency/quotes/latest?id=${encodeURIComponent(
          String(cmcId),
        )}&convert=${encodeURIComponent(convert)}`;
        const quoteJson = await fetchJsonCmc(quoteUrl, getRandomCmcApiKey());
        const qData =
          (quoteJson as any)?.data?.[String(cmcId)] ||
          ((quoteJson as any)?.data &&
            Object.values((quoteJson as any).data)[0]);
        const quote = (qData as any)?.quote?.[convert];
        const price = Number(quote?.price);
        const change = Number(quote?.percent_change_24h ?? 0);
        if (isFinite(price)) {
          result[lower] = {
            price,
            changePct24h: isFinite(change) ? change : 0,
            lastUpdated: Date.now(),
          };
        } else {
          console.log(
            '[prices][cmc] missing token price for',
            checksumAddr,
            'quote:',
            quoteJson,
          );
        }
      } catch (e) {
        console.log('[prices][cmc] token fetch failed for', checksumAddr, e);
        // Fallback to CoinGecko single-token endpoint when CMC can't resolve
        try {
          const { baseUrl, vsCurrency } = getCoinGeckoConfig();
          const platform = platformByChainId[chainId];
          if (platform) {
            const singleUrl =
              `${baseUrl}/simple/token_price/${platform}` +
              `?contract_addresses=${encodeURIComponent(checksumAddr)}` +
              `&vs_currencies=${encodeURIComponent(vsCurrency)}` +
              `&include_24hr_change=true&precision=2`;
            const key = getNextCoinGeckoApiKey();
            const j = await fetchJson(singleUrl, key);
            const entry = j?.[lower];
            const price = Number(entry?.[vsCurrency]);
            const change = Number(entry?.[`${vsCurrency}_24h_change`] ?? 0);
            if (isFinite(price)) {
              result[lower] = {
                price,
                changePct24h: isFinite(change) ? change : 0,
                lastUpdated: Date.now(),
              };
            } else {
              console.log(
                '[prices][cmc->cg] missing price for',
                checksumAddr,
                'json:',
                j,
              );
            }
          }
        } catch (cgErr) {
          console.log(
            '[prices][cmc->cg] fallback failed for',
            checksumAddr,
            cgErr,
          );
        }
      }
    }

    return result;
  }

  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  const platform = platformByChainId[chainId];
  if (!platform) {
    throw new Error(`Unsupported chainId for token prices: ${chainId}`);
  }

  const unique = Array.from(
    new Set(contractAddresses.map(a => a.trim()).filter(Boolean)),
  );
  if (unique.length === 0) return {};

  // Call CoinGecko first; on failure or missing data, fallback to CoinMarketCap
  const result: Record<string, TokenMarketResult> = {};
  for (const checksumAddr of unique) {
    const lower = checksumAddr.toLowerCase();
    const cgUrl =
      `${baseUrl}/simple/token_price/${platform}` +
      `?contract_addresses=${encodeURIComponent(checksumAddr)}` +
      `&vs_currencies=${encodeURIComponent(vsCurrency)}` +
      `&include_24hr_change=true&precision=2`;
    let havePrice = false;
    try {
      const key = getNextCoinGeckoApiKey();
      const j = await fetchJson(cgUrl, key);
      const entry = j?.[lower];
      const price = Number(entry?.[vsCurrency]);
      const change = Number(entry?.[`${vsCurrency}_24h_change`] ?? 0);
      if (isFinite(price)) {
        result[lower] = {
          price,
          changePct24h: isFinite(change) ? change : 0,
          lastUpdated: Date.now(),
        };
        havePrice = true;
      }
    } catch (_e) {
      // fall through to CMC
    }

    if (!havePrice) {
      try {
        const { baseUrl: cmcBase, vsCurrency: vsCur } = getCmcConfig();
        const convert = (vsCur || 'USD').toUpperCase();
        // Resolve contract -> CMC id
        const infoUrl = `${cmcBase}/v2/cryptocurrency/info?address=${encodeURIComponent(
          checksumAddr,
        )}&skip_invalid=true`;
        const infoJson = await fetchJsonCmc(infoUrl, getRandomCmcApiKey());
        let cmcId: number | undefined;
        const data = (infoJson as any)?.data;
        if (data) {
          if (data[lower]) {
            const entry = Array.isArray(data[lower])
              ? data[lower][0]
              : data[lower];
            cmcId = Number(entry?.id);
          } else if (typeof data === 'object') {
            const match = Object.values(data)[0] as any;
            cmcId = Number(match?.id);
          }
        }
        if (cmcId && isFinite(cmcId)) {
          const quoteUrl = `${cmcBase}/v2/cryptocurrency/quotes/latest?id=${encodeURIComponent(
            String(cmcId),
          )}&convert=${encodeURIComponent(convert)}`;
          const quoteJson = await fetchJsonCmc(quoteUrl, getRandomCmcApiKey());
          const qData =
            (quoteJson as any)?.data?.[String(cmcId)] ||
            ((quoteJson as any)?.data &&
              Object.values((quoteJson as any).data)[0]);
          const q = (qData as any)?.quote?.[convert];
          const price = Number(q?.price);
          const change = Number(q?.percent_change_24h ?? 0);
          if (isFinite(price)) {
            result[lower] = {
              price,
              changePct24h: isFinite(change) ? change : 0,
              lastUpdated: Date.now(),
            };
          }
        }
      } catch (cmcErr) {
        console.log(
          '[prices][cg->cmc] fallback failed for',
          checksumAddr,
          cmcErr,
        );
      }
    }
  }

  return result;
};
