import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchBalanceOnce, subscribeBalance } from '../services/api/balance';

export interface UseBalanceOptions {
  address?: string | null;
  subscribe?: boolean;
  chainId?: number;
}

export interface UseBalanceResult {
  loading: boolean;
  balanceEth: string | null;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useBalance = (
  options: UseBalanceOptions = {},
): UseBalanceResult => {
  const { address, subscribe = true, chainId } = options;
  const [loading, setLoading] = useState<boolean>(!!address);
  const [balanceEth, setBalanceEth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<null | (() => void)>(null);

  const fetchOnce = async () => {
    if (!address) return;
    try {
      const b = await fetchBalanceOnce(address, { chainId });
      setBalanceEth(b);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch balance');
    }
  };

  useEffect(() => {
    // Cleanup previous subscription
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;

    if (!address) {
      setLoading(false);
      setBalanceEth(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    // Reset balance immediately on dependency change to avoid showing stale value
    setBalanceEth(null);

    // Initial fetch
    fetchOnce().finally(() => {
      if (active) setLoading(false);
    });

    if (subscribe) {
      unsubscribeRef.current = subscribeBalance({
        address,
        onUpdate: setBalanceEth,
        onError: e =>
          setError(e instanceof Error ? e.message : 'Realtime error'),
        chainId,
      });
    }

    return () => {
      active = false;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [address, subscribe, chainId]);

  const refresh = async () => {
    if (!address) return;
    setLoading(true);
    await fetchOnce();
    setLoading(false);
  };

  return useMemo(
    () => ({ loading, balanceEth, error, refresh }),
    [loading, balanceEth, error],
  );
};
