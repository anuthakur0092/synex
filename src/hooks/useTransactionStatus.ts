import { useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';
import {
  getHttpProviderForChain,
  getWsProviderForChain,
} from '../services/api/ethProvider';
import { walletStorage } from '../services/storage/walletStorage';

export type TxLiveStatus = 'pending' | 'confirmed' | 'failed';

export interface UseTxStatusResult {
  status: TxLiveStatus;
  confirmations: number;
  remainingConfirmations: number;
  targetConfirmations: number;
  receipt: any | null;
  error: string | null;
}

export const useTransactionStatus = (
  hash?: string | null,
  targetConfirmations: number = 12,
  options?: { chainId?: number },
): UseTxStatusResult => {
  const [status, setStatus] = useState<TxLiveStatus>('pending');
  const [confirmations, setConfs] = useState(0);
  const [receipt, setReceipt] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fallbackTimerRef = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (!hash) return;
    let cancelled = false;

    const init = async () => {
      try {
        // Determine effective chain id
        const selected = await walletStorage.getSelectedChainId();
        const requested =
          typeof options?.chainId === 'number' ? options?.chainId : undefined;
        // Map "All Networks" (0) to BNB as elsewhere in app or fallback to 1
        const effectiveSelected =
          selected == null ? 1 : selected === 0 ? 56 : selected;
        const chainId = requested != null ? requested : effectiveSelected;

        // Prefer WS when available for live confirmations
        const ws = getWsProviderForChain(chainId);
        const http = getHttpProviderForChain(chainId);
        const provider: ethers.providers.Provider = (ws as any) || http;

        let currentBlock = 0;

        const updateFromReceipt = (r: any) => {
          if (cancelled) return;
          setReceipt(r);
          if (r && r.status === 0) {
            setStatus('failed');
            setConfs(0);
            return;
          }
          if (r && currentBlock && r.blockNumber) {
            const confs = Math.max(0, currentBlock - r.blockNumber + 1);
            setConfs(confs);
            if (confs >= targetConfirmations) setStatus('confirmed');
            else setStatus('pending');
          }
        };

        const onBlock = async (bn: number) => {
          currentBlock = bn;
          try {
            const r = await provider.getTransactionReceipt(hash);
            if (r) updateFromReceipt(r);
          } catch (e: any) {
            if (!cancelled) setError(e?.message || 'status error');
          }
        };

        // Websocket live updates if available
        (provider as any).on?.('block', onBlock);

        // Fallback polling
        const poll = async () => {
          try {
            const r = await provider.getTransactionReceipt(hash);
            if (r) updateFromReceipt(r);
          } catch (e: any) {
            if (!cancelled) setError(e?.message || 'status error');
          }
        };
        fallbackTimerRef.current = setInterval(poll, 6000);
        poll();

        return () => {
          cancelled = true;
          if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
          try {
            (provider as any).removeAllListeners?.('block');
            (provider as any).destroy?.();
          } catch {}
        };
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'status error');
      }
    };

    const disposer = init();
    return () => {
      if (typeof disposer === 'function') (disposer as any)();
    };
  }, [hash, targetConfirmations, options?.chainId]);

  const remainingConfirmations = Math.max(
    0,
    targetConfirmations - confirmations,
  );

  return useMemo(
    () => ({
      status,
      confirmations,
      remainingConfirmations,
      targetConfirmations,
      receipt,
      error,
    }),
    [
      status,
      confirmations,
      remainingConfirmations,
      targetConfirmations,
      receipt,
      error,
    ],
  );
};
