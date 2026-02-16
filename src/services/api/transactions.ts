import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { getHttpProvider } from './ethProvider';
import {
  fetchAddressTransactionsCovalent,
  getCovalentChainName,
} from './covalent';
import { StoredTransaction } from '../storage/transactionStorage';
import { walletStorage } from '../storage/walletStorage';
import { supportedChains } from '../../utils/config/chains';
import {
  ETHEREUM_TOKEN_LIST,
  BSC_TOKEN_LIST,
  POLYGON_TOKEN_LIST,
} from '../../utils/constants/tokenList.eth';

interface AlchemyTransfer {
  hash: string;
  from: string;
  to: string;
  value?: string | number;
  asset?: string | null;
  category?: string;
  metadata?: { blockTimestamp?: string };
  rawContract?: {
    value?: string;
    decimal?: string | number;
    address?: string;
  };
}

interface AlchemyTransfersResult {
  transfers: AlchemyTransfer[];
  pageKey?: string;
}

const hexFromNumber = (n: number) => `0x${n.toString(16)}`;

const callAlchemyTransfers = async (
  provider: JsonRpcProvider,
  params: Record<string, unknown>,
): Promise<AlchemyTransfersResult> => {
  // Using Alchemy's custom JSON-RPC method
  const res = await provider.send('alchemy_getAssetTransfers', [params]);
  return res as AlchemyTransfersResult;
};

/**
 * Fetch recent onchain transfers for an address using Alchemy RPC.
 * This pulls both incoming and outgoing transfers and normalizes them
 * into the app's StoredTransaction shape for UI rendering.
 */
export const fetchOnchainTransactions = async (
  walletId: string,
  address: string,
  maxCount: number = 100,
): Promise<StoredTransaction[]> => {
  // When possible, prefer Covalent transactions_v3 for consistency across features
  try {
    const selected = (await walletStorage.getSelectedChainId()) ?? 1;
    const chainName = getCovalentChainName(selected);
    if (chainName) {
      const cov = await fetchAddressTransactionsCovalent(chainName, address, {
        pageSize: maxCount,
      });
      // Stamp walletId for storage merging
      return cov.map(t => ({ ...t, walletId }));
    }
  } catch {}

  try {
    const provider = getHttpProvider();
    const addr = address.toLowerCase();
    // Resolve current chain symbol for proper labeling of native transfers
    let chainSymbol = 'ETH';
    let selectedChainId: number | undefined = undefined;
    try {
      const selected = (await walletStorage.getSelectedChainId()) ?? undefined;
      selectedChainId = selected;
      if (selected) {
        const chain = supportedChains.find(c => c.chainId === selected);
        if (chain?.symbol) chainSymbol = chain.symbol;
      } else {
        const net = await provider.getNetwork();
        const chain = supportedChains.find(
          c => c.chainId === (net as any)?.chainId,
        );
        selectedChainId = (net as any)?.chainId;
        if (chain?.symbol) chainSymbol = chain.symbol;
      }
    } catch {}

    const base = {
      fromBlock: '0x0',
      toBlock: 'latest',
      withMetadata: true,
      excludeZeroValue: false,
      category: ['external', 'erc20'],
      order: 'desc',
      maxCount: hexFromNumber(maxCount),
    } as const;

    // Fetch outgoing and incoming separately then merge
    const [outgoing, incoming] = await Promise.all([
      callAlchemyTransfers(provider, { ...base, fromAddress: address }),
      callAlchemyTransfers(provider, { ...base, toAddress: address }),
    ]);

    const normalize = (t: AlchemyTransfer): StoredTransaction | null => {
      if (!t.hash || !t.from || !t.to) return null;
      const ts = t.metadata?.blockTimestamp
        ? new Date(t.metadata.blockTimestamp).toISOString()
        : new Date().toISOString();
      // Identify ERC-20 vs native
      const isErc20 = !!t.rawContract?.value || t.category === 'erc20';

      // Determine token list for the active chain
      const list = (() => {
        switch (selectedChainId) {
          case 56:
            return BSC_TOKEN_LIST.tokens;
          case 137:
            return POLYGON_TOKEN_LIST.tokens;
          case 1:
          default:
            return ETHEREUM_TOKEN_LIST.tokens;
        }
      })();

      // Resolve decimals and symbol for ERC-20 when available
      let erc20Decimals: number | undefined =
        typeof t.rawContract?.decimal === 'number'
          ? (t.rawContract?.decimal as number)
          : t.rawContract?.decimal != null
          ? Number(t.rawContract.decimal)
          : undefined;
      let erc20Symbol: string | undefined = t.asset || undefined;
      if (isErc20 && t.rawContract?.address) {
        const found = list.find(
          tk =>
            tk.address.toLowerCase() === t.rawContract!.address!.toLowerCase(),
        );
        if (found) {
          if (!erc20Decimals) erc20Decimals = found.decimals;
          if (!erc20Symbol) erc20Symbol = found.symbol;
        }
      }

      // Skip ERC-20 transfer if we cannot identify a concrete token symbol
      if (isErc20 && !erc20Symbol) {
        return null;
      }

      // Compute amount string
      let amountStr = '0';
      if (isErc20) {
        const raw =
          t.rawContract?.value ||
          (typeof t.value === 'string' ? t.value : undefined);
        const dec = erc20Decimals ?? 18;
        if (raw) {
          try {
            const bn = ethers.BigNumber.from(raw);
            amountStr = ethers.utils.formatUnits(bn, dec);
          } catch {
            try {
              const hex = raw.startsWith('0x')
                ? raw
                : ethers.BigNumber.from(raw).toHexString();
              amountStr = ethers.utils.formatUnits(hex, dec);
            } catch {
              amountStr = '0';
            }
          }
        }
      } else {
        const provided =
          (typeof t.value === 'number' ? String(t.value) : t.value) || '0';
        if (typeof provided === 'string' && provided.startsWith('0x')) {
          try {
            amountStr = ethers.utils.formatUnits(provided, 18);
          } catch {
            amountStr = '0';
          }
        } else {
          amountStr = String(provided);
        }
      }

      const symbol = isErc20 ? (erc20Symbol as string) : chainSymbol;
      return {
        hash: t.hash,
        walletId,
        from: t.from,
        to: t.to,
        amount: amountStr,
        symbol,
        status: 'confirmed',
        timestamp: ts,
      } as StoredTransaction;
    };

    const combined = [
      ...(outgoing.transfers || []),
      ...(incoming.transfers || []),
    ]
      .map(normalize)
      .filter((t): t is StoredTransaction => !!t);

    // De-duplicate by hash (incoming/outgoing overlap when address equals both for self-transfer)
    const uniqueByHash = new Map<string, StoredTransaction>();
    for (const tx of combined) {
      if (!uniqueByHash.has(tx.hash)) uniqueByHash.set(tx.hash, tx);
    }

    // Sort by timestamp desc
    const sorted = Array.from(uniqueByHash.values()).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return sorted;
  } catch (_e) {
    return [];
  }
};

export default { fetchOnchainTransactions };
