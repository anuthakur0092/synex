import { Token } from '../utils/types/dashboard.types';
import { TokenConfig } from '../utils/types/token.types';

// Home Stack Types
export type HomeStackParamList = {
  HomeMain: { onLogout: () => void };
  TokenSelection: undefined;
  SendToken: { token: Token };
  TokenDetail: { token: Token };
  TransactionSummary: {
    token: Token;
    toAddress: string;
    amount: string;
    usdValue: string;
  };
  TransactionStatus: {
    tx: {
      hash: string;
      amount: string;
      symbol: string;
      status?: 'pending' | 'confirmed' | 'failed';
    };
  };
  Receive: undefined;
  ReceiveQR: {
    token: TokenConfig;
    address: string;
  };
};

// Discover Stack Types
export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  WebView: { url: string; title: string };
  URLs: undefined;
  // Add more discover-related screens here as needed
};

// Transactions Stack Types
export type TransactionsStackParamList = {
  TransactionsMain: undefined;
  TransactionDetails: { transactionId: string };
  TransactionStatus: { transactionId: string };
  // Add more transaction-related screens here as needed
};

// Settings Stack Types
export type SettingsStackParamList = {
  SettingsHome: undefined;
  Security: undefined;
  Preferences: undefined;
  Account: undefined;
  ComingSoon: { title: string };
  TransactionStatus?: any;
};

// Root Tab Navigator Types
export type RootTabParamList = {
  Home: undefined;
  Discover: undefined;
  Transaction: undefined;
  Settings: undefined;
};
