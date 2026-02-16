import { JsonRpcProvider, WebSocketProvider } from '@ethersproject/providers';
import { getNetworkConfig } from '../../utils/config/network';
import { walletStorage } from '../storage/walletStorage';
import { supportedChains } from '../../utils/config/chains';

let httpProvider: JsonRpcProvider | null = null;
let wsProvider: WebSocketProvider | null = null;

export const getHttpProvider = (): JsonRpcProvider => {
  if (httpProvider) return httpProvider;
  const { rpcHttpUrl, chainId } = getNetworkConfig();
  httpProvider = new JsonRpcProvider(rpcHttpUrl, chainId);
  return httpProvider;
};

export const getWsProvider = (): WebSocketProvider | null => {
  const { rpcWsUrl, chainId } = getNetworkConfig();
  if (!rpcWsUrl || /REPLACE_ME/i.test(rpcWsUrl)) return null;
  if (wsProvider) return wsProvider;
  wsProvider = new WebSocketProvider(rpcWsUrl, chainId);
  return wsProvider;
};

export const resetProviders = () => {
  try {
    if (wsProvider) {
      // Best-effort cleanup; ignore TS on optional private field access
      const anyWs: any = wsProvider as any;
      anyWs._websocket?.close?.();
    }
  } catch {}
  httpProvider = null;
  wsProvider = null;
};

export const reconfigureProvidersForSelectedChain = async () => {
  const selected = await walletStorage.getSelectedChainId();
  // For "All Networks" selection (0), default to BNB as per UI convention
  const effectiveChainId = selected === 0 ? 56 : selected;
  const chain = supportedChains.find(c => c.chainId === effectiveChainId);
  if (!chain) return;
  resetProviders();
  if (chain.rpcHttpUrl) {
    httpProvider = new JsonRpcProvider(chain.rpcHttpUrl, chain.chainId);
  }
  if (chain.rpcWsUrl && !/REPLACE_ME/i.test(chain.rpcWsUrl)) {
    wsProvider = new WebSocketProvider(chain.rpcWsUrl, chain.chainId);
  }
};

/**
 * Create an HTTP provider for a specific chain without mutating the shared global provider.
 * Useful for cross-chain read operations (e.g., fetching ERC-20 balances across chains).
 */
export const getHttpProviderForChain = (chainId: number): JsonRpcProvider => {
  const chain = supportedChains.find(c => c.chainId === chainId);
  if (chain?.rpcHttpUrl) {
    return new JsonRpcProvider(chain.rpcHttpUrl, chain.chainId);
  }
  // Fallback to default app network if specific chain not found
  const { rpcHttpUrl } = getNetworkConfig();
  return new JsonRpcProvider(rpcHttpUrl, chainId);
};

/**
 * Create a WS provider for a specific chain without mutating the shared global provider.
 */
export const getWsProviderForChain = (
  chainId: number,
): WebSocketProvider | null => {
  const chain = supportedChains.find(c => c.chainId === chainId);
  if (!chain?.rpcWsUrl || /REPLACE_ME/i.test(chain.rpcWsUrl)) return null;
  return new WebSocketProvider(chain.rpcWsUrl, chain.chainId);
};
