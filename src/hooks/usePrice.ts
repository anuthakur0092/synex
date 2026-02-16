import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchEthMarketData,
  fetchNativeMarketData,
} from '../services/api/prices';
import { walletStorage } from '../services/storage/walletStorage';
import { getCoinGeckoConfig } from '../utils/config/coingecko';

export interface UsePriceResult {
  loading: boolean;
  price: number | null;
  changePct24h: number | null;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useEthPrice = (): UsePriceResult => {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [changePct24h, setChange] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const runOnce = async () => {
    try {
      const res = await fetchEthMarketData();
      setPrice(res.price);
      setChange(res.changePct24h);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch price');
    }
  };

  useEffect(() => {
    let mounted = true;
    const { refreshIntervalMs } = getCoinGeckoConfig();

    const run = async () => {
      await runOnce();
      if (mounted) setLoading(false);
      if (mounted) {
        clearTimeout(timerRef.current as any);
        timerRef.current = setTimeout(run, refreshIntervalMs);
      }
    };

    run();

    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    await runOnce();
    setLoading(false);
  };

  return useMemo(
    () => ({ loading, price, changePct24h, error, refresh }),
    [loading, price, changePct24h, error],
  );
};

// Adapter for legacy screens expecting `usePrice` with ETH-specific keys
export interface UseEthPriceAdapterResult {
  priceLoading: boolean;
  ethPrice: number | null;
  ethChange: number | null;
  error: string | null;
  refresh: () => Promise<void>;
}

export const usePrice = (): UseEthPriceAdapterResult => {
  const { loading, price, changePct24h, error, refresh } = useEthPrice();
  return {
    priceLoading: loading,
    ethPrice: price,
    ethChange: changePct24h,
    error,
    refresh,
  };
};

// New: chain-aware native coin price hook
export interface UseNativePriceResult {
  loading: boolean;
  price: number | null;
  changePct24h: number | null;
  symbol: string;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseNativePriceOptions {
  chainId?: number; // optional override (e.g., UI-selected chain)
}

export const useNativePrice = (
  options: UseNativePriceOptions = {},
): UseNativePriceResult => {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [changePct24h, setChange] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string>('ETH');
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const runOnce = async () => {
    try {
      const selectedFromStorage =
        (await walletStorage.getSelectedChainId()) || 1;
      const effectiveSelected =
        typeof options.chainId === 'number'
          ? options.chainId
          : selectedFromStorage;
      const chainId = effectiveSelected === 0 ? 56 : effectiveSelected; // All Networks -> BNB
      // Map to symbol for UI
      const sym = chainId === 56 ? 'BNB' : chainId === 137 ? 'MATIC' : 'ETH';
      setSymbol(sym);
      const res = await fetchNativeMarketData(chainId);
      setPrice(res.price);
      setChange(res.changePct24h);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch price');
    }
  };

  useEffect(() => {
    let mounted = true;
    const { refreshIntervalMs } =
      require('../utils/config/coingecko').getCoinGeckoConfig();

    const run = async () => {
      await runOnce();
      if (mounted) setLoading(false);
      if (mounted) {
        clearTimeout(timerRef.current as any);
        timerRef.current = setTimeout(run, refreshIntervalMs);
      }
    };

    run();

    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [options.chainId]);

  const refresh = async () => {
    setLoading(true);
    await runOnce();
    setLoading(false);
  };

  return { loading, price, changePct24h, symbol, error, refresh };
};
