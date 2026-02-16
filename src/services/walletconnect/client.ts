import SignClient from '@walletconnect/sign-client';
import type { PairingTypes, SessionTypes } from '@walletconnect/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getWalletConnectProjectId,
  getWalletConnectRelayUrl,
} from '../../utils/config';

export interface WalletConnectState {
  client: SignClient | null;
  sessions: SessionTypes.Struct[];
  pairings: PairingTypes.Struct[];
}

// Keep a global singleton across Fast Refresh and module reloads
declare global {
  // eslint-disable-next-line no-var
  var __YOEX_WC_CLIENT__: SignClient | undefined;
  // eslint-disable-next-line no-var
  var __YOEX_WC_INIT_PROMISE__: Promise<SignClient> | undefined;
}

let instance: SignClient | null = (global as any).__YOEX_WC_CLIENT__ || null;
let initPromise: Promise<SignClient> | undefined = (global as any)
  .__YOEX_WC_INIT_PROMISE__;

export async function getWalletConnectClient(): Promise<SignClient> {
  if (instance) return instance;
  if (initPromise) return initPromise;

  initPromise = SignClient.init({
    projectId: getWalletConnectProjectId(),
    metadata: {
      name: 'Oxylon Wallet',
      description: 'Oxylon Mobile Crypto Wallet',
      url: 'https://oxylon.io',
      icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
    storageOptions: {
      asyncStorage: AsyncStorage as any,
    },
    relayUrl: getWalletConnectRelayUrl(),
  })
    .then(client => {
      instance = client;
      (global as any).__YOEX_WC_CLIENT__ = client;
      return client;
    })
    .finally(() => {
      (global as any).__YOEX_WC_INIT_PROMISE__ = undefined;
      initPromise = undefined;
    });

  (global as any).__YOEX_WC_INIT_PROMISE__ = initPromise;
  return initPromise;
}

export async function resetWalletConnectClient(): Promise<void> {
  if (instance) {
    try {
      await instance.core?.relayer?.transportClose?.();
    } catch {}
  }
  instance = null;
  (global as any).__YOEX_WC_CLIENT__ = undefined;
}

export async function pairWithUri(wcUri: string): Promise<void> {
  const client = await getWalletConnectClient();
  await client.pair({ uri: wcUri });
}

export async function getCurrentState(): Promise<WalletConnectState> {
  const client = await getWalletConnectClient();
  return {
    client,
    sessions: client.session.values,
    pairings: client.pairing.values,
  };
}
