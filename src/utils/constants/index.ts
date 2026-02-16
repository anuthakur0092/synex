/**
 * Constants file for YoexWallet application
 * Re-exports theme utilities and defines app-specific constants
 */

// Re-export theme utilities for backward compatibility
export {
  lightColors,
  darkColors,
  dimensions,
  spacing,
  padding,
  margin,
  borderRadius,
  iconSize,
  textStyles,
  fontSizes,
  fontWeights,
  lightShadows as shadows,
  darkShadows,
} from '../theme';

// Also export lightColors as 'colors' for backward compatibility
export { lightColors as colors } from '../theme';

// App-specific constants
export const APP_CONFIG = {
  name: 'YoexWallet',
  version: '1.0.0',

  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    pageTransition: 300,
  },

  // Wallet configuration
  wallet: {
    maxWallets: 10,
    defaultCurrency: 'USD',
    transactionPageSize: 20,
    maxRecentTransactions: 5,
  },

  // Security settings
  security: {
    autoLockTimeout: 300000, // 5 minutes
    maxPinAttempts: 3,
    biometricTimeout: 30000, // 30 seconds
  },

  // Storage keys
  storageKeys: {
    theme: '@yoex_wallet_theme',
    wallets: '@yoex_wallet_wallets',
    settings: '@yoex_wallet_settings',
    biometric: '@yoex_wallet_biometric',
    pin: '@yoex_wallet_pin',
  },

  // Network configuration
  networks: {
    mainnet: {
      name: 'Mainnet',
      chainId: 1,
      symbol: 'ETH',
      rpcUrl: 'https://mainnet.infura.io',
    },
    testnet: {
      name: 'Testnet',
      chainId: 3,
      symbol: 'ETH',
      rpcUrl: 'https://ropsten.infura.io',
    },
  },
};

// Screen names for navigation
export const SCREEN_NAMES = {
  // Auth screens
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main tabs
  WALLET: 'Wallet',
  TRANSACTIONS: 'Transactions',
  SETTINGS: 'Settings',

  // Wallet screens
  WALLET_DETAILS: 'WalletDetails',
  ADD_WALLET: 'AddWallet',
  IMPORT_WALLET: 'ImportWallet',

  // Transaction screens
  SEND: 'Send',
  RECEIVE: 'Receive',
  TRANSACTION_DETAILS: 'TransactionDetails',

  // Settings screens
  PROFILE: 'Profile',
  SECURITY: 'Security',
  ABOUT: 'About',
  THEME_SETTINGS: 'ThemeSettings',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please try again.',
  INVALID_ADDRESS: 'Invalid wallet address.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  WALLET_NOT_FOUND: 'Wallet not found.',
  INVALID_PIN: 'Invalid PIN. Please try again.',
  BIOMETRIC_ERROR: 'Biometric authentication failed.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CREATED: 'Wallet created successfully!',
  WALLET_IMPORTED: 'Wallet imported successfully!',
  TRANSACTION_SENT: 'Transaction sent successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  BACKUP_COMPLETED: 'Backup completed successfully!',
} as const;

// Cryptocurrency symbols and info
export const CRYPTO_CURRENCIES = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    icon: '₿',
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: 'Ξ',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    icon: '₮',
  },
  BNB: {
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    icon: 'BNB',
  },
} as const;

// Fiat currencies
export const FIAT_CURRENCIES = {
  USD: {
    symbol: 'USD',
    name: 'US Dollar',
    sign: '$',
    decimals: 2,
  },
  EUR: {
    symbol: 'EUR',
    name: 'Euro',
    sign: '€',
    decimals: 2,
  },
  GBP: {
    symbol: 'GBP',
    name: 'British Pound',
    sign: '£',
    decimals: 2,
  },
  JPY: {
    symbol: 'JPY',
    name: 'Japanese Yen',
    sign: '¥',
    decimals: 0,
  },
} as const;

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PIN: /^\d{4,6}$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  BITCOIN_ADDRESS: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  MNEMONIC_WORD: /^[a-z]+$/,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  BIOMETRIC_AUTH: true,
  DARK_MODE: true,
  MULTI_WALLET: true,
  QR_SCANNER: true,
  PRICE_ALERTS: false,
  STAKING: false,
  NFT_SUPPORT: false,
} as const;

// Asset types
export type AssetType = keyof typeof CRYPTO_CURRENCIES;
export type FiatType = keyof typeof FIAT_CURRENCIES;
export type ScreenName = (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];
