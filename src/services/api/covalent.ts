import appConfig from '../../../app.config.json';
import { TokenTransactionItem } from '../../utils/types/market.types';
import { CovalentTxDetails } from '../../utils/types/covalent.types.ts';
import { StoredTransaction } from '../storage/transactionStorage';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

interface CovalentTxnItem {
  tx_hash: string;
  from_address: string;
  to_address: string;
  block_signed_at: string;
  value_quote?: number; // USD
  // Preferred parsed transfers array for ERC-20s
  transfers?: Array<{
    from_address?: string;
    to_address?: string;
    contract_decimals?: number;
    contract_address?: string;
    transfer_type?: 'IN' | 'OUT' | string;
    delta?: string | number; // raw smallest units, may be negative
    delta_quote?: number;
  }>;
  log_events?: Array<{
    sender_address?: string;
    sender_contract_address?: string;
    raw_log_address?: string;
    decoded?: {
      name?: string;
      params?: Array<{ name: string; value: string }>;
    };
  }>;
}

const getApiKey = (): string =>
  ((appConfig as any)?.covalent?.apiKey as string) ||
  'cqt_wF8hKtDpcpYJjtrkwBXtRvtDbVQ8';
const getBaseUrl = (): string =>
  ((appConfig as any)?.covalent?.baseUrl as string) ||
  'https://api.covalenthq.com/v1';

// Map our identifiers to Covalent chainName used by transaction_v2
export const getCovalentChainName = (input: number | string): string | null => {
  const key = String(input).toLowerCase().trim();
  // If already a covalent chain name, accept as-is
  if (
    key.includes('-mainnet') ||
    key.includes('-testnet') ||
    key.includes('-')
  ) {
    return key;
  }
  switch (key) {
    case '1':
    case 'eth':
    case 'ethereum':
      return 'eth-mainnet';
    case '56':
    case 'bsc':
    case 'bnb':
      return 'bsc-mainnet';
    case '137':
    case 'polygon':
    case 'matic':
      return 'matic-mainnet';
    default:
      return null;
  }
};

/**
 * Fetch ERC-20 token transfers for a wallet address filtered by a token contract.
 * chainId: EVM chain id (1, 56, 137 ...)
 */
export const fetchTokenTransfers = async (
  chainId: number,
  walletAddress: string,
  contractAddress: string,
  options?: { pageSize?: number },
): Promise<TokenTransactionItem[]> => {
  const pageSize = options?.pageSize ?? 50;
  const url = `${getBaseUrl()}/${chainId}/address/${walletAddress}/transfers_v2/?contract-address=${contractAddress}&page-size=${pageSize}`;
  const headers = { Authorization: `Bearer ${getApiKey()}` } as Record<
    string,
    string
  >;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    // console.log('[covalent] http error', res.status, url, body);
    throw new Error(String(res.status));
  }
  const json = await res.json();
  const items: CovalentTxnItem[] = (json as any)?.data?.items || [];
  const lowerToken = contractAddress.toLowerCase();

  // Normalize
  const normalized: TokenTransactionItem[] = items.map(it => {
    // console.log('each txn : ', it);
    const lowerOwner = walletAddress.toLowerCase();
    // Prefer the structured transfers entry matching our contract
    const txTransfer = (it.transfers || []).find(
      tr => String(tr.contract_address || '').toLowerCase() === lowerToken,
    );
    // Determine direction
    let isSend = false;
    if (txTransfer) {
      if (String(txTransfer.transfer_type).toUpperCase() === 'OUT') {
        isSend = true;
      } else if (String(txTransfer.transfer_type).toUpperCase() === 'IN') {
        isSend = false;
      } else {
        isSend =
          String(txTransfer.from_address || '').toLowerCase() === lowerOwner;
      }
    } else {
      // Fallback: use tx-level from/to when transfers missing
      isSend = String(it.from_address).toLowerCase() === lowerOwner;
    }
    // Try to read amount from ERC-20 Transfer event params when present
    let amountStr = '0';
    if (txTransfer) {
      // Use delta (absolute) as raw smallest units
      const raw = txTransfer.delta as any;
      let s = typeof raw === 'string' ? raw : String(raw ?? '0');
      if (s.startsWith('-')) s = s.slice(1);
      if (s && s !== '0') amountStr = s;
    }
    const transferEvents = (it.log_events || []).filter(e => {
      const nameOk = e.decoded?.name === 'Transfer';
      const emitter = String(
        (e as any).sender_address ||
          (e as any).sender_contract_address ||
          (e as any).raw_log_address ||
          '',
      ).toLowerCase();
      return nameOk && emitter === lowerToken;
    });
    if (amountStr === '0' && transferEvents.length > 0) {
      for (const ev of transferEvents) {
        const params = ev.decoded?.params || [];
        // Prefer param named value/amount/wad; fallback last param
        const named =
          params.find(p => /^(value|amount|wad)$/i.test(String(p.name))) ||
          params[params.length - 1];
        const v = (named as any)?.value as unknown;
        const toDecimalString = (val: unknown): string => {
          if (typeof val === 'string') {
            if (val === '0') return '0';
            if (/^0x/i.test(val)) {
              try {
                return BigInt(val).toString();
              } catch {
                return '0';
              }
            }
            return val;
          }
          if (typeof val === 'number') return String(val);
          if (val && typeof (val as any).hex === 'string') {
            try {
              return BigInt((val as any).hex).toString();
            } catch {
              return '0';
            }
          }
          return '0';
        };
        const parsed = toDecimalString(v);
        if (parsed !== '0') {
          amountStr = parsed;
          break;
        }
      }
    }
    return {
      hash: it.tx_hash,
      type: isSend ? 'send' : 'receive',
      from: (txTransfer?.from_address as any) || it.from_address,
      to: (txTransfer?.to_address as any) || it.to_address,
      amount: amountStr,
      amountUsd: isFinite(Number(txTransfer?.delta_quote))
        ? Number(txTransfer?.delta_quote)
        : isFinite(Number(it.value_quote))
        ? Number(it.value_quote)
        : undefined,
      timestamp: it.block_signed_at,
    };
  });

  return normalized;
};

/**
 * Fetch native coin transfers (ETH/BNB/MATIC) for a wallet.
 * Uses transactions_v3, mapping tx.value and value_quote.
 */
export const fetchNativeTransfers = async (
  chainId: number,
  walletAddress: string,
  options?: { pageSize?: number },
): Promise<TokenTransactionItem[]> => {
  const pageSize = options?.pageSize ?? 50;
  const url = `${getBaseUrl()}/${chainId}/address/${walletAddress}/transactions_v3/?page-size=${pageSize}`;
  const headers = { Authorization: `Bearer ${getApiKey()}` } as Record<
    string,
    string
  >;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    // console.log('[covalent][native] http error', res.status, url, body);
    throw new Error(String(res.status));
  }
  const json = await res.json();
  const items: any[] = (json as any)?.data?.items || [];
  const lowerOwner = walletAddress.toLowerCase();
  const normalized: TokenTransactionItem[] = items.map(it => {
    const isSend = String(it.from_address).toLowerCase() === lowerOwner;
    const raw = (it as any)?.value ?? '0';
    const amountStr = typeof raw === 'string' ? raw : String(raw ?? '0');
    const usd = (it as any)?.value_quote;
    return {
      hash: it.tx_hash,
      type: isSend ? 'send' : 'receive',
      from: it.from_address,
      to: it.to_address,
      amount: amountStr,
      amountUsd: isFinite(Number(usd)) ? Number(usd) : undefined,
      timestamp: it.block_signed_at,
    } as TokenTransactionItem;
  });
  return normalized;
};

export default { fetchTokenTransfers };

// ===== Single transaction detail =====

/**
 * Fetch a single transaction's details by hash using Covalent's transaction_v3 endpoint.
 */
export const fetchTxDetailsByHash = async (
  chain: number | string,
  txHash: string,
): Promise<CovalentTxDetails | null> => {
  const chainName = getCovalentChainName(chain);
  if (!chainName) {
    // console.log('[covalent][tx] unsupported chain', chain);
    return null;
  }
  const url = `${getBaseUrl()}/${chainName}/transaction_v2/${txHash}/`;
  const headers = { Authorization: `Bearer ${getApiKey()}` } as Record<
    string,
    string
  >;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    // console.log('[covalent][tx] http error', res.status, url, body);
    return null;
  }
  const json = await res.json();
  const item = (json as any)?.data?.items?.[0];
  if (!item) return null;
  // console.log('item colvalent', item);
  const details: CovalentTxDetails = {
    hash: String(item.tx_hash || txHash),
    from: String(item.from_address || ''),
    to: String(item.to_address || ''),
    blockSignedAt: String(item.block_signed_at || ''),
    blockHeight:
      typeof item.block_height === 'number' ? item.block_height : undefined,
    success: Boolean(item.successful ?? true),
    value: String((item as any).value ?? ''),
    valueQuote: Number.isFinite(Number(item.value_quote))
      ? Number(item.value_quote)
      : undefined,
    gasOffered: String((item as any).gas_offered ?? ''),
    gasSpent: String((item as any).gas_spent ?? ''),
    gasPriceWei: String((item as any).gas_price ?? ''),
  };
  return details;
};

// ===== Address transactions (transactions_v3) =====

const nativeSymbolForChainName = (chainName: string): string => {
  const key = chainName.toLowerCase();
  if (key.includes('bsc')) return 'BNB';
  if (key.includes('matic') || key.includes('polygon')) return 'MATIC';
  return 'ETH';
};

export const fetchAddressTransactionsCovalent = async (
  chain: number | string,
  walletAddress: string,
  options?: { pageSize?: number },
): Promise<StoredTransaction[]> => {
  try {
    const chainName = getCovalentChainName(chain);
    if (!chainName) return [];
    const pageSize = options?.pageSize ?? 100;
    const url = `${getBaseUrl()}/${chainName}/address/${walletAddress}/transactions_v3/?page-size=${pageSize}&no-logs=false`;
    const headers = { Authorization: `Bearer ${getApiKey()}` } as Record<
      string,
      string
    >;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      let body = '';
      try {
        body = await res.text();
      } catch {}
      // console.log('[covalent][addr_tx] http error', res.status, url, body);
      return [];
    }
    const json = await res.json();
    const items: any[] = (json as any)?.data?.items || [];
    try {
      // eslint-disable-next-line no-console
      // console.log('[Covalent][addr_tx][response]', {
      //   chainName,
      //   address: walletAddress,
      //   itemsCount: Array.isArray(items) ? items.length : 0,
      //   sample: items,
      // });
    } catch {}

    const lowerOwner = walletAddress.toLowerCase();
    const nativeSymbol = nativeSymbolForChainName(chainName);

    const normalized = items
      .map((it: any): StoredTransaction | null => {
        try {
          let amountStr: string | null = null;
          let symbol: string | null = null;
          let action: string | undefined = undefined;

          const v = it.value != null ? String(it.value) : '0';
          if (v && v !== '0') {
            amountStr = formatUnits(BigNumber.from(v), 18);
            symbol = nativeSymbol;
            action = 'Transfer';
          } else {
            const logs: any[] = Array.isArray(it.log_events)
              ? (it.log_events as any[])
              : [];
            const lowerName = (e: any) =>
              String(e?.decoded?.name || '').toLowerCase();
            const findBy = (re: RegExp) =>
              logs.find(e => re.test(lowerName(e)));

            const evSwap = findBy(/swap/);
            if (evSwap) {
              action = 'Swap';
              const transfers = logs.filter(e => {
                const n = lowerName(e);
                return n === 'transfer' || n === 'logtransfer';
              });
              let pick = transfers.find(e => {
                const p = (e.decoded?.params || []).find(
                  (x: any) => String(x?.name).toLowerCase() === 'from',
                );
                return String(p?.value || '').toLowerCase() === lowerOwner;
              });
              if (!pick) {
                pick = transfers.find(e => {
                  const p = (e.decoded?.params || []).find(
                    (x: any) => String(x?.name).toLowerCase() === 'to',
                  );
                  return String(p?.value || '').toLowerCase() === lowerOwner;
                });
              }
              if (!pick) pick = transfers[0];
              if (pick && pick.decoded?.params) {
                const params: any[] = pick.decoded.params;
                const valParam =
                  params.find(x =>
                    /^(value|amount|wad)$/i.test(String(x?.name)),
                  ) || params[params.length - 1];
                const raw = String(valParam?.value ?? '0');
                const decimals = Number(pick.sender_contract_decimals || 18);
                try {
                  amountStr = formatUnits(
                    BigNumber.from(raw),
                    isFinite(decimals) ? decimals : 18,
                  );
                } catch {
                  amountStr = '0';
                }
                symbol =
                  String(
                    pick.sender_contract_ticker_symbol || '',
                  ).toUpperCase() ||
                  symbol ||
                  nativeSymbol;
              }
            } else {
              const evApproval = findBy(/^(approval|approve)$/);
              if (evApproval) {
                symbol =
                  String(
                    evApproval.sender_contract_ticker_symbol || '',
                  ).toUpperCase() || symbol;
                action = 'Approval';
                amountStr = '';
              } else {
                const ev = findBy(/^(transfer|logtransfer)$/);
                if (ev && ev.decoded?.params) {
                  const params: any[] = ev.decoded.params;
                  const valParam =
                    params.find(x =>
                      /^(value|amount)$/i.test(String(x?.name)),
                    ) || params[params.length - 1];
                  const raw = String(valParam?.value ?? '0');
                  const decimals = Number(ev.sender_contract_decimals || 18);
                  try {
                    amountStr = formatUnits(
                      BigNumber.from(raw),
                      isFinite(decimals) ? decimals : 18,
                    );
                  } catch {
                    amountStr = '0';
                  }
                  symbol =
                    String(
                      ev.sender_contract_ticker_symbol || '',
                    ).toUpperCase() || null;
                  action = 'Transfer';
                }
              }
            }
          }

          if (!amountStr || !symbol) {
            amountStr = amountStr ?? '0';
            symbol = symbol ?? nativeSymbol;
          }

          const ts: string = it.block_signed_at
            ? new Date(it.block_signed_at).toISOString()
            : new Date().toISOString();

          const st: StoredTransaction = {
            hash: String(it.tx_hash),
            walletId: '',
            from: String(it.from_address || ''),
            to: String(it.to_address || ''),
            amount: amountStr,
            symbol,
            action,
            status: it.successful === false ? 'failed' : 'confirmed',
            timestamp: ts,
          };
          return st;
        } catch {
          return null;
        }
      })
      .filter((x): x is StoredTransaction => !!x);

    return normalized.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  } catch (_e) {
    return [];
  }
};
