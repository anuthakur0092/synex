import { useEffect, useState } from 'react';
import {
  walletStorage,
  WalletMetadata,
} from '../services/storage/walletStorage';
import { supportedChains } from '../utils/config/chains';

export interface UseWalletResult {
  loading: boolean;
  walletId: string | null;
  metadata: WalletMetadata | null;
  address: string | null;
  selectedChainId: number | null;
}

export const useWallet = (): UseWalletResult => {
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<WalletMetadata | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = await walletStorage.getCurrentWalletId();
        if (!mounted) return;
        setWalletId(id);
        if (id) {
          const meta = await walletStorage.getWalletMetadata(id);
          if (!mounted) return;
          setMetadata(meta);
          setAddress(meta?.address || null);
        } else {
          setMetadata(null);
          setAddress(null);
        }
        // Load selected chain (fallback to All Networks)
        const storedChain = await walletStorage.getSelectedChainId();
        if (!mounted) return;
        // Default to 0 (All Networks) when nothing stored
        setSelectedChainId(
          storedChain ??
            0 /* All Networks default */ ??
            supportedChains[0]?.chainId ??
            null,
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, walletId, metadata, address, selectedChainId };
};
