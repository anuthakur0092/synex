// Crypto services
export {
  CryptoWalletService,
  type WalletData,
  type WalletGenerationResult,
  type WalletValidationResult,
} from './crypto/wallet';

// Storage services
export {
  WalletStorageService,
  walletStorage,
  type WalletMetadata,
  type BiometricSettings,
  type IWalletStorage,
} from './storage/walletStorage';

// Service instances for easy access
export const cryptoService = CryptoWalletService;
export const storageService = walletStorage;

// WalletConnect service will be added and exported from here once implemented
