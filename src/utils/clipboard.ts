import Toast from 'react-native-simple-toast';
import { Platform } from 'react-native';

// Import clipboard module with proper error handling
let Clipboard: any;
let isClipboardAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Clipboard = require('@react-native-clipboard/clipboard').default;
  isClipboardAvailable = true;
  console.log(
    '[ClipboardUtils] @react-native-clipboard/clipboard loaded successfully',
  );
} catch (error) {
  console.warn(
    '[ClipboardUtils] Failed to load @react-native-clipboard/clipboard:',
    error,
  );
  Clipboard = undefined;
  isClipboardAvailable = false;
}

/**
 * Clipboard utility: copies to the system clipboard and shows a toast.
 * Falls back to toast-only if the native module isn't installed.
 */
export class ClipboardUtils {
  private static async copy(text: string): Promise<boolean> {
    if (!text || typeof text !== 'string') {
      console.warn('[ClipboardUtils] Invalid text provided for copying');
      return false;
    }

    try {
      // Try the community clipboard module first
      if (Clipboard && typeof Clipboard.setString === 'function') {
        await Clipboard.setString(text);
        console.log(
          '[ClipboardUtils] Successfully copied using @react-native-clipboard/clipboard',
        );
        return true;
      }

      // Fallback: try using the legacy React Native Clipboard API
      try {
        const { Clipboard: RNClipboard } = require('react-native');
        if (RNClipboard && typeof RNClipboard.setString === 'function') {
          RNClipboard.setString(text);
          console.log(
            '[ClipboardUtils] Successfully copied using React Native Clipboard',
          );
          return true;
        }
      } catch (fallbackError) {
        console.warn(
          '[ClipboardUtils] React Native Clipboard fallback failed:',
          fallbackError,
        );
      }

      // Final fallback: toast only
      if (__DEV__) {
        console.warn(
          '[ClipboardUtils] No clipboard module available. Showing toast only.',
        );
      }
      return false;
    } catch (error) {
      console.error('[ClipboardUtils] Error copying to clipboard:', error);
      return false;
    }
  }

  /** Copies wallet address and shows confirmation */
  static async showWalletAddress(address: string): Promise<void> {
    if (!address) {
      Toast.show('No address to copy', Toast.SHORT);
      return;
    }

    const success = await this.copy(address);
    if (success) {
      Toast.show('Wallet Address Copied', Toast.SHORT);
    } else {
      Toast.show('Failed to copy address', Toast.SHORT);
    }
  }

  /** Copies private key and shows warning */
  static async showPrivateKey(privateKey: string): Promise<void> {
    if (!privateKey) {
      Toast.show('No private key to copy', Toast.SHORT);
      return;
    }

    const success = await this.copy(privateKey);
    if (success) {
      Toast.show('⚠️ Private Key Copied - Keep Secret!', Toast.LONG);
    } else {
      Toast.show('Failed to copy private key', Toast.SHORT);
    }
  }

  /** Copies wallet ID and shows confirmation */
  static async showWalletId(walletId: string): Promise<void> {
    if (!walletId) {
      Toast.show('No wallet ID to copy', Toast.SHORT);
      return;
    }

    const success = await this.copy(walletId);
    if (success) {
      Toast.show('Wallet ID Copied', Toast.SHORT);
    } else {
      Toast.show('Failed to copy wallet ID', Toast.SHORT);
    }
  }

  /** Generic copy method for any text */
  static async copyText(text: string, successMessage?: string): Promise<void> {
    if (!text) {
      Toast.show('No text to copy', Toast.SHORT);
      return;
    }

    const success = await this.copy(text);
    if (success) {
      Toast.show(successMessage || 'Copied to clipboard', Toast.SHORT);
    } else {
      Toast.show('Failed to copy', Toast.SHORT);
    }
  }

  /** Check if clipboard is available */
  static isAvailable(): boolean {
    return isClipboardAvailable;
  }
}
