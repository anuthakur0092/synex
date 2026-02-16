import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import {
  getHttpProvider,
  getWsProvider,
  getHttpProviderForChain,
  getWsProviderForChain,
} from './ethProvider';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';

export interface RealtimeBalanceOptions {
  address: string;
  onUpdate: (balanceEth: string) => void;
  onError?: (error: unknown) => void;
  chainId?: number;
}

export const fetchBalanceOnce = async (
  address: string,
  options?: { chainId?: number },
): Promise<string> => {
  const provider = options?.chainId
    ? getHttpProviderForChain(options.chainId)
    : getHttpProvider();
  const bal: BigNumber = await provider.getBalance(address);
  return formatEther(bal);
};

export const subscribeBalance = (options: RealtimeBalanceOptions) => {
  const { address, onUpdate, onError, chainId } = options;
  const ws =
    typeof chainId === 'number'
      ? getWsProviderForChain(chainId)
      : getWsProvider();
  if (!ws) {
    // Fallback: poll via HTTP when WS not configured
    let stopped = false;
    const poll = async () => {
      if (stopped) return;
      try {
        const next = await fetchBalanceOnce(address, { chainId });
        onUpdate(next);
      } catch (e) {
        onError?.(e);
      }
      if (!stopped) setTimeout(poll, 10000);
    };
    poll();
    return () => {
      stopped = true;
    };
  }

  // Use new heads to refresh balance in real-time
  const onBlock = async (_blockNumber: number) => {
    try {
      const next = await ws.getBalance(address);
      onUpdate(formatEther(next));
    } catch (e) {
      onError?.(e);
    }
  };

  ws.on('block', onBlock);

  // Initial fetch
  ws.getBalance(address)
    .then(b => onUpdate(formatEther(b)))
    .catch(err => onError?.(err));

  return () => {
    try {
      ws.off('block', onBlock);
      // Do not close shared provider here; higher-level reset will handle
    } catch {}
  };
};

// ===== ERC-20 balances =====

const ERC20_ABI = ['function balanceOf(address owner) view returns (uint256)'];

export interface TokenSpec {
  address: string; // contract address
  decimals: number;
}

/**
 * Fetch balances for multiple ERC-20 tokens for a single owner.
 * Returns a map of lowercase contract address -> human-readable balance string.
 */
export const fetchErc20BalancesOnce = async (
  owner: string,
  tokens: TokenSpec[],
  options?: { chainId?: number },
): Promise<Record<string, string>> => {
  const provider = options?.chainId
    ? getHttpProviderForChain(options.chainId)
    : getHttpProvider();
  const tasks = tokens.map(async t => {
    try {
      const contract = new Contract(t.address, ERC20_ABI, provider);
      const raw: BigNumber = await contract.balanceOf(owner);
      const formatted = formatUnits(raw, t.decimals);
      return [t.address.toLowerCase(), formatted] as const;
    } catch (_e) {
      return [t.address.toLowerCase(), '0'] as const;
    }
  });
  const entries = await Promise.all(tasks);
  return Object.fromEntries(entries);
};
