import AsyncStorage from '@react-native-async-storage/async-storage';

export type TxStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface StoredTransaction {
  hash: string;
  walletId: string;
  from: string;
  to: string;
  amount: string;
  symbol: string;
  action?: string; // e.g., Transfer, Approval, Swap; derived from decoded logs or native
  usdValue?: string;
  gasPriceGwei?: string;
  gasLimit?: string;
  networkFeeEth?: string;
  networkFeeUsd?: string;
  speed?: 'slow' | 'standard' | 'fast';
  status: TxStatus;
  timestamp: string; // ISO date
}

const keyFor = (walletId: string) => `@yoex_wallet_txs_${walletId}`;

export const transactionStorage = {
  async getAll(walletId: string): Promise<StoredTransaction[]> {
    try {
      const raw = await AsyncStorage.getItem(keyFor(walletId));
      const list: StoredTransaction[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  async add(walletId: string, tx: StoredTransaction): Promise<void> {
    const list = await transactionStorage.getAll(walletId);
    const updated = [tx, ...list.filter(t => t.hash !== tx.hash)];
    await AsyncStorage.setItem(keyFor(walletId), JSON.stringify(updated));
  },

  async updateStatus(
    walletId: string,
    hash: string,
    status: TxStatus,
  ): Promise<void> {
    const list = await transactionStorage.getAll(walletId);
    const updated = list.map(t => (t.hash === hash ? { ...t, status } : t));
    await AsyncStorage.setItem(keyFor(walletId), JSON.stringify(updated));
  },
};

export default transactionStorage;
