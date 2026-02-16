import { WalletData, CryptoWalletService } from '../crypto/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

// Storage keys from constants
const STORAGE_KEYS = {
  wallets: '@yoex_wallet_wallets',
  settings: '@yoex_wallet_settings',
  biometric: '@yoex_wallet_biometric',
  pin: '@yoex_wallet_pin',
  encryptedWallet: '@yoex_wallet_encrypted',
  walletMetadata: '@yoex_wallet_metadata',
  currentWalletId: '@yoex_wallet_current_id',
  selectedChainId: '@yoex_wallet_selected_chain_id',
  preferredTokensPrefix: '@yoex_wallet_tokens',
  customTokensPrefix: '@yoex_wallet_custom_tokens',
};

// Wallet metadata interface
export interface WalletMetadata {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  lastAccessed: string;
  isBackedUp: boolean;
  biometricEnabled: boolean;
}

// Biometric settings interface
export interface BiometricSettings {
  enabled: boolean;
  type: 'fingerprint' | 'face' | 'iris' | 'pin' | null;
  lastUsed: string;
  pinLength: 4 | 6;
  pinEnabled: boolean;
}

// Storage service interface
export interface IWalletStorage {
  // Wallet operations
  saveWallet(walletData: WalletData, password: string): Promise<string>;
  getWallet(walletId: string, password: string): Promise<WalletData | null>;
  deleteWallet(walletId: string): Promise<boolean>;

  // Metadata operations
  saveWalletMetadata(metadata: WalletMetadata): Promise<void>;
  getWalletMetadata(walletId: string): Promise<WalletMetadata | null>;
  getAllWalletMetadata(): Promise<WalletMetadata[]>;

  // Settings operations
  saveBiometricSettings(settings: BiometricSettings): Promise<void>;
  getBiometricSettings(): Promise<BiometricSettings | null>;

  // Security operations
  savePin(pin: string): Promise<void>;
  validatePin(pin: string): Promise<boolean>;
  clearAll(): Promise<void>;

  // Session helpers
  getCurrentWalletId(): Promise<string | null>;
  setCurrentWalletId(walletId: string): Promise<void>;
  getStoredPassword(walletId: string): Promise<string | null>;
  // Network selection
  getSelectedChainId(): Promise<number | null>;
  setSelectedChainId(chainId: number): Promise<void>;

  // User preferred tokens (by chain)
  getPreferredTokenAddresses(chainId: number): Promise<string[]>;
  setPreferredTokenAddresses(
    chainId: number,
    addresses: string[],
  ): Promise<void>;
  addPreferredTokenAddress(chainId: number, address: string): Promise<void>;
  removePreferredTokenAddress(chainId: number, address: string): Promise<void>;

  // Custom tokens (metadata persisted by chain)
  getCustomTokens(chainId: number): Promise<Record<string, CustomToken>>;
  saveCustomToken(chainId: number, token: CustomToken): Promise<void>;
  deleteCustomToken(chainId: number, address: string): Promise<void>;
}

// Basic custom token metadata type (chain-specific)
export interface CustomToken {
  chainId: number;
  address: string; // checksum preferred
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

/**
 * Basic wallet storage implementation
 * TODO: Enhance with @react-native-async-storage/async-storage and react-native-keychain
 */
export class WalletStorageService implements IWalletStorage {
  // Temporary in-memory cache layer for performance (backed by AsyncStorage)
  private static memoryStorage: { [key: string]: any } = {};

  private getEncryptedWalletKey(walletId: string): string {
    return `${STORAGE_KEYS.encryptedWallet}_${walletId}`;
  }

  private getMetadataKey(walletId: string): string {
    return `${STORAGE_KEYS.walletMetadata}_${walletId}`;
  }

  private getKeychainService(walletId: string): string {
    return `yoex_wallet_${walletId}`;
  }

  private getPreferredTokensKey(chainId: number): string {
    return `${STORAGE_KEYS.preferredTokensPrefix}_${chainId}`;
  }

  private getCustomTokensKey(chainId: number): string {
    return `${STORAGE_KEYS.customTokensPrefix}_${chainId}`;
  }

  /**
   * Save encrypted wallet to secure storage
   * @param walletData - Wallet data to save
   * @param password - Password for encryption
   * @returns Promise<string> - Wallet ID
   */
  async saveWallet(walletData: WalletData, password: string): Promise<string> {
    try {
      // Generate unique wallet ID
      const walletId = this.generateWalletId();

      // Encrypt wallet with password
      const encryptedJson = await CryptoWalletService.encryptWallet(
        walletData,
        password,
      );

      const walletKey = this.getEncryptedWalletKey(walletId);

      // Persist encrypted wallet (AsyncStorage)
      await AsyncStorage.setItem(
        walletKey,
        JSON.stringify({
          encrypted: encryptedJson,
          encryptedAt: new Date().toISOString(),
          address: walletData.address,
        }),
      );

      // Cache in memory
      WalletStorageService.memoryStorage[walletKey] = {
        encrypted: encryptedJson,
        encryptedAt: new Date().toISOString(),
        address: walletData.address,
      };

      // Save metadata
      const metadata: WalletMetadata = {
        id: walletId,
        name: `Wallet ${Date.now()}`,
        address: walletData.address,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        isBackedUp: false,
        biometricEnabled: false,
      };

      await this.saveWalletMetadata(metadata);

      // Store password securely in Keychain (so we can auto-restore session)
      await Keychain.setGenericPassword('yoex', password, {
        service: this.getKeychainService(walletId),
      });

      // Mark as current wallet
      await this.setCurrentWalletId(walletId);

      console.log('Wallet saved successfully (in memory):', {
        id: walletId,
        address: walletData.address,
      });

      return walletId;
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw new Error('Failed to save wallet');
    }
  }

  /**
   * Retrieve wallet from secure storage
   * @param walletId - Wallet ID
   * @param password - Password for decryption
   * @returns Promise<WalletData | null>
   */
  async getWallet(
    walletId: string,
    password: string,
  ): Promise<WalletData | null> {
    try {
      const walletKey = this.getEncryptedWalletKey(walletId);

      // Prefer cache, fallback to AsyncStorage
      let stored = WalletStorageService.memoryStorage[walletKey];
      if (!stored) {
        const raw = await AsyncStorage.getItem(walletKey);
        stored = raw ? JSON.parse(raw) : null;
        if (stored) {
          WalletStorageService.memoryStorage[walletKey] = stored;
        }
      }

      if (!stored) {
        return null;
      }

      const encryptedJson: string = stored.encrypted;

      // If no password provided, try Keychain
      const effectivePassword =
        password || (await this.getStoredPassword(walletId)) || '';
      if (!effectivePassword) {
        return null;
      }

      // Decrypt to reconstruct WalletData
      const decrypted = await CryptoWalletService.decryptWallet(
        encryptedJson,
        effectivePassword,
      );

      // Update last accessed
      const metadata = await this.getWalletMetadata(walletId);
      if (metadata) {
        metadata.lastAccessed = new Date().toISOString();
        await this.saveWalletMetadata(metadata);
      }

      console.log('Wallet retrieved successfully (decrypted):', {
        id: walletId,
        address: decrypted.address,
      });

      return decrypted;
    } catch (error) {
      console.error('Error retrieving wallet:', error);
      throw new Error('Failed to retrieve wallet');
    }
  }

  /**
   * Delete wallet from storage
   * @param walletId - Wallet ID
   * @returns Promise<boolean>
   */
  async deleteWallet(walletId: string): Promise<boolean> {
    try {
      const walletKey = this.getEncryptedWalletKey(walletId);
      const metadataKey = this.getMetadataKey(walletId);

      // Clear cache and persistent storage
      delete WalletStorageService.memoryStorage[walletKey];
      delete WalletStorageService.memoryStorage[metadataKey];
      await AsyncStorage.multiRemove([walletKey, metadataKey]);

      // Remove keychain entry
      await Keychain.resetGenericPassword({
        service: this.getKeychainService(walletId),
      });

      console.log('Wallet deleted successfully:', walletId);
      return true;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      return false;
    }
  }

  /**
   * Save wallet metadata
   * @param metadata - Wallet metadata
   */
  async saveWalletMetadata(metadata: WalletMetadata): Promise<void> {
    try {
      const metadataKey = this.getMetadataKey(metadata.id);

      WalletStorageService.memoryStorage[metadataKey] = metadata;
      await AsyncStorage.setItem(metadataKey, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving wallet metadata:', error);
      throw new Error('Failed to save wallet metadata');
    }
  }

  /**
   * Get wallet metadata
   * @param walletId - Wallet ID
   * @returns Promise<WalletMetadata | null>
   */
  async getWalletMetadata(walletId: string): Promise<WalletMetadata | null> {
    try {
      const metadataKey = this.getMetadataKey(walletId);

      const cached = WalletStorageService.memoryStorage[metadataKey];
      if (cached) return cached;

      const raw = await AsyncStorage.getItem(metadataKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      WalletStorageService.memoryStorage[metadataKey] = parsed;
      return parsed;
    } catch (error) {
      console.error('Error getting wallet metadata:', error);
      return null;
    }
  }

  /**
   * Get all wallet metadata
   * @returns Promise<WalletMetadata[]>
   */
  async getAllWalletMetadata(): Promise<WalletMetadata[]> {
    try {
      const allMetadata: WalletMetadata[] = [];

      const keys = await AsyncStorage.getAllKeys();
      const metadataKeys = keys.filter(k =>
        k.startsWith(STORAGE_KEYS.walletMetadata),
      );
      if (metadataKeys.length > 0) {
        const results = await AsyncStorage.multiGet(metadataKeys);
        for (const [, value] of results) {
          if (value) {
            try {
              const item = JSON.parse(value);
              allMetadata.push(item);
            } catch (_e) {}
          }
        }
      }

      return allMetadata.sort(
        (a, b) =>
          new Date(b.lastAccessed).getTime() -
          new Date(a.lastAccessed).getTime(),
      );
    } catch (error) {
      console.error('Error getting all wallet metadata:', error);
      return [];
    }
  }

  /**
   * Save biometric settings
   * @param settings - Biometric settings
   */
  async saveBiometricSettings(settings: BiometricSettings): Promise<void> {
    try {
      WalletStorageService.memoryStorage[STORAGE_KEYS.biometric] = settings;
      await AsyncStorage.setItem(
        STORAGE_KEYS.biometric,
        JSON.stringify(settings),
      );
    } catch (error) {
      console.error('Error saving biometric settings:', error);
      throw new Error('Failed to save biometric settings');
    }
  }

  /**
   * Get biometric settings
   * @returns Promise<BiometricSettings | null>
   */
  async getBiometricSettings(): Promise<BiometricSettings | null> {
    try {
      const cached = WalletStorageService.memoryStorage[STORAGE_KEYS.biometric];
      if (cached) return cached;
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.biometric);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Error getting biometric settings:', error);
      return null;
    }
  }

  /**
   * Save PIN (hashed)
   * @param pin - PIN to save
   */
  async savePin(pin: string): Promise<void> {
    try {
      const hashedPin = this.hashPin(pin);
      WalletStorageService.memoryStorage[STORAGE_KEYS.pin] = hashedPin;
      await AsyncStorage.setItem(STORAGE_KEYS.pin, hashedPin);
    } catch (error) {
      console.error('Error saving PIN:', error);
      throw new Error('Failed to save PIN');
    }
  }

  /**
   * Validate PIN
   * @param pin - PIN to validate
   * @returns Promise<boolean>
   */
  async validatePin(pin: string): Promise<boolean> {
    try {
      let storedPin = WalletStorageService.memoryStorage[STORAGE_KEYS.pin];
      if (!storedPin) {
        storedPin = await AsyncStorage.getItem(STORAGE_KEYS.pin);
      }
      if (!storedPin) {
        return false;
      }

      const hashedPin = this.hashPin(pin);
      return hashedPin === storedPin;
    } catch (error) {
      console.error('Error validating PIN:', error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const yoexKeys = keys.filter(k => k.startsWith('@yoex_wallet_'));

      // Collect wallet IDs to clean Keychain
      const ids = new Set<string>();
      for (const k of yoexKeys) {
        if (k.startsWith(STORAGE_KEYS.walletMetadata + '_')) {
          ids.add(k.substring((STORAGE_KEYS.walletMetadata + '_').length));
        }
        if (k.startsWith(STORAGE_KEYS.encryptedWallet + '_')) {
          ids.add(k.substring((STORAGE_KEYS.encryptedWallet + '_').length));
        }
      }

      // Remove all keychain entries for discovered wallet IDs
      for (const id of ids) {
        try {
          await Keychain.resetGenericPassword({
            service: this.getKeychainService(id),
          });
        } catch (_e) {}
      }

      // Remove all AsyncStorage keys
      if (yoexKeys.length) {
        await AsyncStorage.multiRemove(yoexKeys);
      }

      WalletStorageService.memoryStorage = {};
      console.log('All wallet storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  async getCurrentWalletId(): Promise<string | null> {
    try {
      const id = await AsyncStorage.getItem(STORAGE_KEYS.currentWalletId);
      return id || null;
    } catch (_e) {
      return null;
    }
  }

  async setCurrentWalletId(walletId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.currentWalletId, walletId);
    } catch (_e) {}
  }

  async getStoredPassword(walletId: string): Promise<string | null> {
    try {
      const creds = await Keychain.getGenericPassword({
        service: this.getKeychainService(walletId),
      });
      if (creds) {
        return creds.password;
      }
      return null;
    } catch (_e) {
      return null;
    }
  }

  async getSelectedChainId(): Promise<number | null> {
    try {
      const v = await AsyncStorage.getItem(STORAGE_KEYS.selectedChainId);
      return v ? Number(v) : null;
    } catch (_e) {
      return null;
    }
  }

  async setSelectedChainId(chainId: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.selectedChainId, String(chainId));
    } catch (_e) {}
  }

  async getPreferredTokenAddresses(chainId: number): Promise<string[]> {
    try {
      const key = this.getPreferredTokensKey(chainId);
      const cached = WalletStorageService.memoryStorage[key];
      if (cached) return cached as string[];
      const raw = await AsyncStorage.getItem(key);
      const parsed: string[] = raw ? JSON.parse(raw) : [];
      WalletStorageService.memoryStorage[key] = parsed;
      return parsed;
    } catch (_e) {
      return [];
    }
  }

  async setPreferredTokenAddresses(
    chainId: number,
    addresses: string[],
  ): Promise<void> {
    const unique = Array.from(new Set(addresses.map(a => a.toLowerCase())));
    const key = this.getPreferredTokensKey(chainId);
    WalletStorageService.memoryStorage[key] = unique;
    await AsyncStorage.setItem(key, JSON.stringify(unique));
  }

  async addPreferredTokenAddress(
    chainId: number,
    address: string,
  ): Promise<void> {
    const existing = await this.getPreferredTokenAddresses(chainId);
    if (!existing.includes(address.toLowerCase())) {
      existing.push(address.toLowerCase());
      await this.setPreferredTokenAddresses(chainId, existing);
    }
  }

  async removePreferredTokenAddress(
    chainId: number,
    address: string,
  ): Promise<void> {
    const existing = await this.getPreferredTokenAddresses(chainId);
    const filtered = existing.filter(a => a !== address.toLowerCase());
    await this.setPreferredTokenAddresses(chainId, filtered);
  }

  async getCustomTokens(chainId: number): Promise<Record<string, CustomToken>> {
    try {
      const key = this.getCustomTokensKey(chainId);
      const cached = WalletStorageService.memoryStorage[key];
      if (cached) return cached as Record<string, CustomToken>;
      const raw = await AsyncStorage.getItem(key);
      const parsed: Record<string, CustomToken> = raw ? JSON.parse(raw) : {};
      WalletStorageService.memoryStorage[key] = parsed;
      return parsed;
    } catch (_e) {
      return {};
    }
  }

  async saveCustomToken(chainId: number, token: CustomToken): Promise<void> {
    const key = this.getCustomTokensKey(chainId);
    const current = await this.getCustomTokens(chainId);
    current[token.address.toLowerCase()] = token;
    WalletStorageService.memoryStorage[key] = current;
    await AsyncStorage.setItem(key, JSON.stringify(current));
    // Also ensure it is present in preferred selection
    await this.addPreferredTokenAddress(chainId, token.address);
  }

  async deleteCustomToken(chainId: number, address: string): Promise<void> {
    const key = this.getCustomTokensKey(chainId);
    const current = await this.getCustomTokens(chainId);
    delete current[address.toLowerCase()];
    WalletStorageService.memoryStorage[key] = current;
    await AsyncStorage.setItem(key, JSON.stringify(current));
    await this.removePreferredTokenAddress(chainId, address);
  }

  /**
   * Generate unique wallet ID
   * @returns string
   */
  private generateWalletId(): string {
    return `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Basic PIN hashing (replace with proper hashing)
   * @param pin - PIN to hash
   * @returns string
   */
  private hashPin(pin: string): string {
    // TODO: Replace with proper cryptographic hashing (bcrypt, scrypt, etc.)
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
}

// Export singleton instance
export const walletStorage = new WalletStorageService();
export default WalletStorageService;
