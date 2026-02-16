/**
 * Polyfills for React Native crypto operations
 * This file should be imported at the top of index.js or App.tsx
 */

// Buffer polyfill - must be first
import { Buffer } from 'buffer';
(global as any).Buffer = (global as any).Buffer || Buffer;

// Required polyfills for WalletConnect RN compatibility
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// WalletConnect React Native compatibility shims (must load very early)
import '@walletconnect/react-native-compat';

// Process polyfill
import process from 'process';
(global as any).process = (global as any).process || process;

// Stream polyfill
if (typeof (global as any).stream === 'undefined') {
  (global as any).stream = require('stream');
}

// Additional Node.js polyfills that might be needed
if (typeof (global as any).setImmediate === 'undefined') {
  (global as any).setImmediate = (callback: () => void) =>
    setTimeout(callback, 0);
}

if (typeof (global as any).clearImmediate === 'undefined') {
  (global as any).clearImmediate = (id: any) => clearTimeout(id);
}

// Crypto polyfills for bip39 and ethers
if (typeof (global as any).crypto === 'undefined') {
  (global as any).crypto = {
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  };
}

// Console log for debugging crypto setup
console.log('Crypto polyfills loaded successfully');

export default {};
