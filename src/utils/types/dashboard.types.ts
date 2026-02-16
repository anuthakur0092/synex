// Dashboard data types for the new home screen design
import { ImageSourcePropType } from 'react-native';

export interface UserProfile {
  avatar: string;
  hasNotification: boolean;
  notificationType: 'update' | 'security' | 'transaction';
}

export interface NetworkInfo {
  name: string;
  chainId: number;
  symbol: string;
  isTestnet: boolean;
}

export interface User {
  profile: UserProfile;
  selectedNetwork: NetworkInfo;
}

export interface Balance {
  amount: string;
  symbol: string;
  decimals: number;
}

export interface CurrencyValue {
  amount: string;
  currency: string;
  symbol: string;
}

export interface PriceChange {
  percentage: number;
  isPositive: boolean;
  timeframe: string;
}

export interface WalletBalance {
  primary: Balance;
  secondary: CurrencyValue;
  change: PriceChange;
}

export interface Wallet {
  address: string;
  balance: WalletBalance;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: string;
  enabled: boolean;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  // Optional remote/local logo. If present, UI should prefer this over `icon`.
  logoURI?: string;
  logoSource?: ImageSourcePropType;
  balance: Balance;
  value: CurrencyValue;
  change: PriceChange;
  isPrimary: boolean;
  contractAddress: string;
  chain?: string; // ethereum, polygon, bsc, etc.
  chainId?: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'buy';
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  symbol: string;
  to: string;
  from: string;
  timestamp: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
}

export interface MarketData {
  lastUpdated: string;
  totalPortfolioValue: CurrencyValue;
  totalChange: PriceChange;
}

export interface NotificationSettings {
  enabled: boolean;
  priceAlerts: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
}

export interface SecuritySettings {
  biometricEnabled: boolean;
  autoLockEnabled: boolean;
  autoLockTimeout: number;
  hideBalances: boolean;
}

export interface DisplaySettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
}

export interface Settings {
  notifications: NotificationSettings;
  security: SecuritySettings;
  display: DisplaySettings;
}

export interface DashboardData {
  user: User;
  wallet: Wallet;
  quickActions: QuickAction[];
  tokens: Token[];
  recentTransactions: Transaction[];
  marketData: MarketData;
  settings: Settings;
}

// Utility types for component props
export interface DashboardProps {
  data: DashboardData;
  onActionPress?: (action: string) => void;
  onTokenPress?: (token: Token) => void;
  onTransactionPress?: (transaction: Transaction) => void;
  onProfilePress?: () => void;
  onNetworkPress?: () => void;
  onAddTokensPress?: () => void;
  onWalletConnectPress?: () => void;
  onLogout?: () => void;
  balanceLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  tokenPricesLoading?: boolean;
  priceLoading?: boolean;
  ethPrice?: number | null;
  ethChange?: number | null;
}

// Component-specific prop types
export interface HeaderProps {
  user: User;
  onProfilePress: () => void;
  onNetworkPress: () => void;
  onWalletConnectPress?: () => void;
}

export interface BalanceDisplayProps {
  balance: WalletBalance;
  loading?: boolean;
  priceLoading?: boolean;
  price?: number | null;
  changePct24h?: number | null;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  onActionPress: (action: string) => void;
}

export interface TokenListProps {
  tokens: Token[];
  onTokenPress: (token: Token) => void;
}

export interface TransactionListProps {
  transactions: Transaction[];
  onTransactionPress: (transaction: Transaction) => void;
}
