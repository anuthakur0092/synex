import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchTokenChart,
  fetchTokenMarketSummary,
  fetchNativeChart,
} from '../services/api/market';
import {
  fetchTokenTransfers,
  fetchNativeTransfers,
} from '../services/api/covalent';
import {
  fetchBalanceOnce,
  fetchErc20BalancesOnce,
} from '../services/api/balance';
import {
  ChartPoint,
  Timeframe,
  TokenTransactionItem,
  TokenMarketSummary,
} from '../utils/types/market.types';
import { Token } from '../utils/types/dashboard.types';
import { useWallet } from './useWallet';

export interface UseTokenDetailsResult {
  summary: TokenMarketSummary | null;
  chart: ChartPoint[];
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  balance: string | null;
  loading: boolean;
  error?: string;
  transactions: TokenTransactionItem[];
  refresh: () => Promise<void>;
}

export const useTokenDetails = (token: Token): UseTokenDetailsResult => {
  const { address, selectedChainId } = useWallet();
  const chainId = token.chainId || selectedChainId || 1;
  const [summary, setSummary] = useState<TokenMarketSummary | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TokenTransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const owner = address || '';
  const contract = token.contractAddress;
  const decimals = token.balance.decimals;

  const load = useCallback(async () => {
    if (!owner) return;
    setLoading(true);
    setError(undefined);
    try {
      const isNative =
        !contract || contract === '0x0000000000000000000000000000000000000000';
      // Prefer a single chart call (native vs token) and derive price/change from it
      const [ch, balRes, txs] = await Promise.all([
        (isNative
          ? fetchNativeChart(chainId, timeframe)
          : fetchTokenChart(chainId, contract, timeframe)
        ).catch(() => []),
        isNative
          ? fetchBalanceOnce(owner, { chainId }).catch(() => null)
          : fetchErc20BalancesOnce(owner, [{ address: contract, decimals }], {
              chainId,
            }).catch(() => ({} as Record<string, string>)),
        isNative
          ? fetchNativeTransfers(chainId, owner).catch(() => [])
          : fetchTokenTransfers(chainId, owner, contract).catch(() => []),
      ]);
      setChart(ch);
      try {
        console.log(
          '[useTokenDetails] chart points',
          Array.isArray(ch) ? ch.length : 0,
        );
        if (Array.isArray(ch) && ch.length > 0) {
          console.log('[useTokenDetails] first/last', ch[0], ch[ch.length - 1]);
        }
      } catch {}

      // Derive summary from chart; fallback to API only if needed
      if (Array.isArray(ch) && ch.length > 0) {
        // Use first/last non-zero values to avoid zero baselines from CG
        let iFirst = 0;
        while (iFirst < ch.length && !(ch[iFirst]?.value > 0)) iFirst++;
        let iLast = ch.length - 1;
        while (iLast >= 0 && !(ch[iLast]?.value > 0)) iLast--;
        const firstVal = iFirst < ch.length ? ch[iFirst].value : 0;
        const lastVal = iLast >= 0 ? ch[iLast].value : 0;
        const derivedChange =
          firstVal > 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0;
        setSummary({
          price: lastVal,
          changePct24h: derivedChange,
          lastUpdated: Date.now(),
        });
        try {
          console.log('[useTokenDetails] derived summary (nz)', {
            firstVal,
            lastVal,
            iFirst,
            iLast,
            derivedChange,
          });
        } catch {}
      } else {
        const sum = await fetchTokenMarketSummary(chainId, contract).catch(
          () => null,
        );
        if (sum) setSummary(sum);
        try {
          console.log('[useTokenDetails] fallback summary', sum);
        } catch {}
      }
      if (isNative) {
        setBalance((balRes as string | null) ?? null);
      } else {
        const bal = contract
          ? ((balRes as any)?.[contract.toLowerCase()] as string | undefined)
          : undefined;
        setBalance(bal ?? null);
      }
      setTransactions(txs);
    } catch (e) {
      setError('Failed to load token details');
    } finally {
      setLoading(false);
    }
  }, [owner, contract, chainId, timeframe, decimals]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return useMemo(
    () => ({
      summary,
      chart,
      timeframe,
      setTimeframe,
      balance,
      loading,
      error,
      transactions,
      refresh,
    }),
    [summary, chart, timeframe, balance, loading, error, transactions],
  );
};

export default useTokenDetails;
