import * as bip39 from 'bip39';
import { HDNode } from '@ethersproject/hdnode';
import { Wallet } from '@ethersproject/wallet';
import { randomBytes } from '@ethersproject/random';
import { bip39List } from '../../utils/constants/seedphrase';

// Wallet interface for our application
export interface WalletData {
  address: string;
  privateKey: string;
  mnemonic: string;
  seedPhrase: string[];
  publicKey: string;
  path: string; // Derivation path
}

// Wallet generation result
export interface WalletGenerationResult {
  wallet: WalletData;
  encryptedWallet?: string; // Encrypted JSON wallet
}

// Wallet validation result
export interface WalletValidationResult {
  isValid: boolean;
  error?: string;
}

export class CryptoWalletService {
  private static readonly DEFAULT_PATH = "m/44'/60'/0'/0/0"; // Ethereum derivation path

  /**
   * Get word suggestions for autocomplete based on user input
   * @param input - Partial word input from user
   * @param maxSuggestions - Maximum number of suggestions to return (default: 3)
   * @returns Array of suggested words
   */
  static getWordSuggestions(
    input: string,
    maxSuggestions: number = 3,
  ): string[] {
    if (!input || input.length < 1) {
      return [];
    }

    const normalizedInput = input.toLowerCase().trim();

    // Find words that start with the input
    const suggestions = bip39List
      .filter(word => word.startsWith(normalizedInput))
      .slice(0, maxSuggestions);

    return suggestions;
  }

  /**
   * Get the complete BIP39 word list
   * @returns Array of all BIP39 words
   */
  static getBIP39WordList(): string[] {
    return bip39List;
  }

  /**
   * Check if a word is a valid BIP39 word
   * @param word - Word to check
   * @returns boolean indicating if word is valid
   */
  static isValidBIP39Word(word: string): boolean {
    return bip39List.includes(word.toLowerCase().trim());
  }

  /**
   * Generate a new wallet with mnemonic - OPTIMIZED FOR SPEED
   * @returns Promise<WalletGenerationResult>
   */
  static async generateNewWallet(): Promise<WalletGenerationResult> {
    try {
      console.log('Starting FAST wallet generation...');

      // Use smaller entropy for faster generation (128 bits = 12 words)
      const entropy = randomBytes(16);
      console.log('Generated entropy instantly');

      // Generate mnemonic from entropy
      const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy));
      console.log('Generated mnemonic instantly');

      // Create HD wallet from mnemonic (optimized path)
      const hdNode = HDNode.fromMnemonic(mnemonic);
      const walletNode = hdNode.derivePath(this.DEFAULT_PATH);

      // Create wallet from private key
      const wallet = new Wallet(walletNode.privateKey);

      console.log('Generated wallet instantly:', wallet.address);

      const walletData: WalletData = {
        address: wallet.address,
        privateKey: walletNode.privateKey,
        mnemonic: mnemonic,
        seedPhrase: mnemonic.split(' '),
        publicKey: walletNode.publicKey,
        path: this.DEFAULT_PATH,
      };

      return {
        wallet: walletData,
      };
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw new Error('Failed to generate wallet');
    }
  }

  /**
   * Import wallet from mnemonic phrase
   * @param mnemonic - The mnemonic phrase
   * @param path - Optional derivation path
   * @returns Promise<WalletGenerationResult>
   */
  static async importFromMnemonic(
    mnemonic: string,
    path: string = this.DEFAULT_PATH,
  ): Promise<WalletGenerationResult> {
    try {
      // Validate mnemonic first
      const validation = this.validateMnemonic(mnemonic);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid mnemonic');
      }

      // Create HD wallet from mnemonic
      const hdNode = HDNode.fromMnemonic(mnemonic);
      const walletNode = hdNode.derivePath(path);

      // Create wallet from private key
      const wallet = new Wallet(walletNode.privateKey);

      const walletData: WalletData = {
        address: wallet.address,
        privateKey: walletNode.privateKey,
        mnemonic: mnemonic,
        seedPhrase: mnemonic.split(' '),
        publicKey: walletNode.publicKey,
        path: path,
      };

      return {
        wallet: walletData,
      };
    } catch (error) {
      console.error('Error importing wallet from mnemonic:', error);
      throw new Error('Failed to import wallet from mnemonic');
    }
  }

  /**
   * Import wallet from private key
   * @param privateKey - The private key
   * @returns Promise<WalletGenerationResult>
   */
  static async importFromPrivateKey(
    privateKey: string,
  ): Promise<WalletGenerationResult> {
    try {
      // Validate private key format
      if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
      }

      // Create wallet from private key
      const wallet = new Wallet(privateKey);

      const walletData: WalletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: '', // No mnemonic for private key import
        seedPhrase: [],
        publicKey: wallet.publicKey,
        path: '', // No path for private key import
      };

      return {
        wallet: walletData,
      };
    } catch (error) {
      console.error('Error importing wallet from private key:', error);
      throw new Error('Failed to import wallet from private key');
    }
  }

  /**
   * Encrypt wallet with password
   * @param wallet - The wallet to encrypt
   * @param password - The password for encryption
   * @returns Promise<string> - Encrypted JSON wallet
   */
  static async encryptWallet(
    wallet: WalletData,
    password: string,
  ): Promise<string> {
    try {
      const ethersWallet = new Wallet(wallet.privateKey);

      // Use faster scrypt params suitable for mobile to avoid long blocking times.
      // Security note: These params are a pragmatic balance for mobile. Adjust for production as needed.
      // Use scrypt KDF with moderate cost suitable for mobile (best practice over PBKDF2)
      const encryptedWallet = await ethersWallet.encrypt(password, {
        scrypt: {
          N: 1 << 12, // 4096
          r: 8,
          p: 1,
        },
      });
      return encryptedWallet;
    } catch (error) {
      console.error('Error encrypting wallet:', error);
      throw new Error('Failed to encrypt wallet');
    }
  }

  /**
   * Decrypt wallet with password
   * @param encryptedWallet - The encrypted JSON wallet
   * @param password - The password for decryption
   * @returns Promise<WalletData>
   */
  static async decryptWallet(
    encryptedWallet: string,
    password: string,
  ): Promise<WalletData> {
    try {
      const wallet = await Wallet.fromEncryptedJson(encryptedWallet, password);

      const walletData: WalletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: '', // Encrypted wallets don't store mnemonic
        seedPhrase: [],
        publicKey: wallet.publicKey,
        path: '',
      };

      return walletData;
    } catch (error) {
      console.error('Error decrypting wallet:', error);
      throw new Error('Failed to decrypt wallet');
    }
  }

  /**
   * Validate mnemonic phrase
   * @param mnemonic - The mnemonic phrase to validate
   * @returns WalletValidationResult
   */
  static validateMnemonic(mnemonic: string): WalletValidationResult {
    try {
      const words = mnemonic.trim().split(/\s+/);

      // Check word count (12, 15, 18, 21, or 24 words)
      const validWordCounts = [12, 15, 18, 21, 24];
      if (!validWordCounts.includes(words.length)) {
        return {
          isValid: false,
          error: `Invalid word count. Expected 12, 15, 18, 21, or 24 words, got ${words.length}`,
        };
      }

      // Validate using bip39
      if (!bip39.validateMnemonic(mnemonic)) {
        return {
          isValid: false,
          error: 'Invalid mnemonic phrase',
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to validate mnemonic',
      };
    }
  }

  /**
   * Validate private key
   * @param privateKey - The private key to validate
   * @returns WalletValidationResult
   */
  static validatePrivateKey(privateKey: string): WalletValidationResult {
    try {
      // Add 0x prefix if missing
      if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
      }

      // Check length (64 hex characters + 0x = 66 total)
      if (privateKey.length !== 66) {
        return {
          isValid: false,
          error: 'Private key must be 64 hex characters',
        };
      }

      // Check if it's valid hex
      if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
        return {
          isValid: false,
          error: 'Private key must contain only hex characters',
        };
      }

      // Try to create wallet to validate
      new Wallet(privateKey);

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid private key',
      };
    }
  }

  /**
   * Generate a secure random seed phrase of specified length
   * @param wordCount - Number of words (12, 15, 18, 21, or 24)
   * @returns string[] - Array of seed phrase words
   */
  static generateSeedPhrase(wordCount: number = 12): string[] {
    try {
      const validWordCounts = [12, 15, 18, 21, 24];
      if (!validWordCounts.includes(wordCount)) {
        throw new Error('Invalid word count. Must be 12, 15, 18, 21, or 24');
      }

      // Calculate entropy size based on word count
      // 12 words = 128 bits, 15 words = 160 bits, etc.
      const entropyBits = wordCount * 11 - wordCount / 3;
      const entropyBytes = entropyBits / 8;

      // Generate random bytes
      const entropy = randomBytes(entropyBytes);

      // Create mnemonic from entropy (convert Uint8Array to Buffer)
      const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy));

      return mnemonic.split(' ');
    } catch (error) {
      console.error('Error generating seed phrase:', error);
      throw new Error('Failed to generate seed phrase');
    }
  }

  /**
   * Get wallet balance (requires network connection)
   * @param address - Wallet address
   * @param rpcUrl - RPC URL for the network
   * @returns Promise<string> - Balance in ETH
   */
  static async getWalletBalance(
    address: string,
    rpcUrl?: string,
  ): Promise<string> {
    try {
      // Use shared HTTP provider for balance
      const { JsonRpcProvider } = await import('@ethersproject/providers');
      const { formatEther } = await import('@ethersproject/units');
      const provider = new JsonRpcProvider(rpcUrl);
      const bal = await provider.getBalance(address);
      return formatEther(bal);
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }
}

export default CryptoWalletService;
