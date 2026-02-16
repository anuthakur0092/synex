import {
  getCoinGeckoConfig,
  getNextCoinGeckoApiKey,
} from '../../utils/config/coingecko';
import { getCmcConfig, getRandomCmcApiKey } from '../../utils/config/cmc';
import { getPriceProvider } from '../../utils/config/prices';
import {
  ChartPoint,
  TokenMarketSummary,
  Timeframe,
} from '../../utils/types/market.types';

const fetchJson = async (url: string, headers?: Record<string, string>) => {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    console.log('[market] HTTP error', res.status, url, body);
    throw new Error(String(res.status));
  }
  return res.json();
};

// CoinGecko helper: rotate through configured API keys on 401/429
const fetchJsonCgWithRotation = async (url: string) => {
  const { apiKeys, apiKey } = getCoinGeckoConfig();
  const keys: (string | undefined)[] =
    apiKeys && apiKeys.length > 0 ? [...apiKeys] : [apiKey];

  // Always try at least once (even with no key)
  const attempts = Math.max(1, keys.length || 1);
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const k = keys[i];
    try {
      const headers: Record<string, string> = {};
      if (k) headers['x-cg-pro-api-key'] = k;
      const res = await fetch(url, { headers });
      if (res.ok) return res.json();
      // Rotate only on auth/ratelimit
      if (res.status === 401 || res.status === 429) {
        lastErr = new Error(`CG ${res.status}`);
        continue;
      }
      let body = '';
      try {
        body = await res.text();
      } catch {}
      console.log('[market][cg] HTTP error', res.status, url, body);
      throw new Error(String(res.status));
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('CG fetch failed');
};

// ===== Current price + 24h change =====
export const fetchTokenMarketSummary = async (
  chainId: number,
  contractAddress: string,
): Promise<TokenMarketSummary> => {
  const provider = getPriceProvider();
  // Attempt CMC first when configured
  if (provider === 'coinmarketcap') {
    try {
      const { baseUrl, vsCurrency } = getCmcConfig();
      const convert = (vsCurrency || 'USD').toUpperCase();
      const infoUrl = `${baseUrl}/v2/cryptocurrency/info?address=${encodeURIComponent(
        contractAddress,
      )}&skip_invalid=true`;
      const info = await fetchJson(infoUrl, {
        'X-CMC_PRO_API_KEY': getRandomCmcApiKey() || '',
      });
      const lower = contractAddress.toLowerCase();
      let cmcId: number | undefined;
      const data = (info as any)?.data;
      if (data?.[lower]) {
        const entry = Array.isArray(data[lower]) ? data[lower][0] : data[lower];
        cmcId = Number(entry?.id);
      } else if (typeof data === 'object') {
        const match = Object.values(data)[0] as any;
        cmcId = Number((match as any)?.id);
      }
      if (cmcId && isFinite(cmcId)) {
        const quoteUrl = `${baseUrl}/v2/cryptocurrency/quotes/latest?id=${cmcId}&convert=${encodeURIComponent(
          convert,
        )}`;
        const quote = await fetchJson(quoteUrl, {
          'X-CMC_PRO_API_KEY': getRandomCmcApiKey() || '',
        });
        const qData =
          (quote as any)?.data?.[String(cmcId)] ||
          ((quote as any)?.data && Object.values((quote as any).data)[0]);
        const q = (qData as any)?.quote?.[convert];
        const price = Number(q?.price);
        const change = Number(q?.percent_change_24h ?? 0);
        if (isFinite(price)) {
          return {
            price,
            changePct24h: isFinite(change) ? change : 0,
            lastUpdated: Date.now(),
          };
        }
      }
    } catch (e) {
      // fallthrough to CG
    }
  }

  // Fallback to CoinGecko
  const platformByChainId: Record<number, string> = {
    1: 'ethereum',
    56: 'binance-smart-chain',
    137: 'polygon-pos',
  };
  const platform = platformByChainId[chainId] || 'ethereum';
  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  const url = `${baseUrl}/simple/token_price/${platform}?contract_addresses=${encodeURIComponent(
    contractAddress,
  )}&vs_currencies=${encodeURIComponent(
    vsCurrency,
  )}&include_24hr_change=true&precision=4`;
  const json = await fetchJson(url, {
    'x-cg-pro-api-key': getNextCoinGeckoApiKey() || '',
  });
  const lower = contractAddress.toLowerCase();
  const entry = (json as any)?.[lower];
  const price = Number(entry?.[vsCurrency]);
  const change = Number(entry?.[`${vsCurrency}_24h_change`] ?? 0);
  if (!isFinite(price)) throw new Error('No price');
  return {
    price,
    changePct24h: isFinite(change) ? change : 0,
    lastUpdated: Date.now(),
  };
};

// Resolve a logo URL for a token by address and chain. Tries CMC info first, then CoinGecko contract endpoint.
export const resolveTokenLogo = async (
  chainId: number,
  contractAddress: string,
): Promise<string | null> => {
  const provider = getPriceProvider();
  // Try CoinMarketCap when configured
  if (provider === 'coinmarketcap') {
    try {
      const { baseUrl } = getCmcConfig();
      const infoUrl = `${baseUrl}/v2/cryptocurrency/info?address=${encodeURIComponent(
        contractAddress,
      )}&skip_invalid=true`;
      const info = await fetchJson(infoUrl, {
        'X-CMC_PRO_API_KEY': getRandomCmcApiKey() || '',
      });
      const lower = contractAddress.toLowerCase();
      const data = (info as any)?.data;
      let entry: any | undefined;
      if (data?.[lower]) {
        entry = Array.isArray(data[lower]) ? data[lower][0] : data[lower];
      } else if (typeof data === 'object') {
        entry = Object.values(data)[0];
      }
      const logo = entry?.logo as string | undefined;
      if (logo && typeof logo === 'string') return logo;
    } catch (_e) {}
  }

  // Fallback to CoinGecko contract metadata
  try {
    const { baseUrl } = getCoinGeckoConfig();
    const platformByChainId: Record<number, string> = {
      1: 'ethereum',
      56: 'binance-smart-chain',
      137: 'polygon-pos',
    };
    const platform = platformByChainId[chainId] || 'ethereum';
    const url = `${baseUrl}/coins/${platform}/contract/${contractAddress}`;
    const json = await fetchJsonCgWithRotation(url);
    const image = (json as any)?.image?.small || (json as any)?.image?.thumb;
    if (image && typeof image === 'string') return image as string;
  } catch (_e) {}

  return null;
};

// ===== Historical chart data =====
export const fetchTokenChart = async (
  chainId: number,
  contractAddress: string,
  timeframe: Timeframe,
): Promise<ChartPoint[]> => {
  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  const platformByChainId: Record<number, string> = {
    1: 'ethereum',
    56: 'binance-smart-chain',
    137: 'polygon-pos',
  };
  const platform = platformByChainId[chainId] || 'ethereum';

  const daysMap: Record<Timeframe, string> = {
    '1D': '1',
    '1W': '7',
    '1M': '30',
    '1Y': '365',
    ALL: 'max',
  };
  const days = daysMap[timeframe];
  const url = `${baseUrl}/coins/${platform}/contract/${contractAddress}/market_chart?vs_currency=${encodeURIComponent(
    vsCurrency,
  )}&days=${days}&precision=4`;

  const json = await fetchJsonCgWithRotation(url);
  const prices = (json as any)?.prices as [number, number][];
  if (!Array.isArray(prices)) return [];
  return prices.map(([ts, v]) => ({ timestamp: ts, value: v }));
};

// ===== Native coin historical chart data (ETH/BNB/MATIC) =====
export const fetchNativeChart = async (
  chainId: number,
  timeframe: Timeframe,
): Promise<ChartPoint[]> => {
  const { baseUrl, vsCurrency } = getCoinGeckoConfig();
  // Prefer POL for Polygon, fallback handled by CG rotation if needed
  const idByChain: Record<number, string> = {
    1: 'ethereum',
    56: 'binancecoin',
    137: 'polygon-ecosystem-token',
  };
  const coinId = idByChain[chainId] || 'ethereum';

  const daysMap: Record<Timeframe, string> = {
    '1D': '1',
    '1W': '7',
    '1M': '30',
    '1Y': '365',
    ALL: 'max',
  };
  const days = daysMap[timeframe];
  const url = `${baseUrl}/coins/${coinId}/market_chart?vs_currency=${encodeURIComponent(
    vsCurrency,
  )}&days=${days}&precision=4`;

  const json = await fetchJsonCgWithRotation(url);
  const prices = (json as any)?.prices as [number, number][];
  if (!Array.isArray(prices)) return [];
  return prices.map(([ts, v]) => ({ timestamp: ts, value: v }));
};
