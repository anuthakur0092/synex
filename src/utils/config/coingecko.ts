import appConfig from '../../../app.config.json';

export interface CoinGeckoConfig {
  baseUrl: string;
  apiKey?: string; // single key (backward compatible)
  apiKeys?: string[]; // optional list of keys used for rotation
  vsCurrency: string; // e.g., 'usd'
  refreshIntervalMs: number; // polling interval
}

type AppCfg = typeof appConfig & {
  coingecko?: Partial<CoinGeckoConfig>;
};

const DEFAULTS: CoinGeckoConfig = {
  baseUrl: 'https://pro-api.coingecko.com/api/v3',
  apiKey: 'CG-nz5dqGfQRxzGQxTx16R7PAgz',
  apiKeys: ['CG-nz5dqGfQRxzGQxTx16R7PAgz'],
  vsCurrency: 'usd',
  refreshIntervalMs: 300000,
};

export const getCoinGeckoConfig = (): CoinGeckoConfig => {
  const cfg = appConfig as AppCfg;
  const cg = cfg.coingecko || {};
  // Normalize keys: allow apiKey to be string or string[] in app config
  const keysFromApiKeys = Array.isArray((cg as any).apiKeys)
    ? (((cg as any).apiKeys as unknown[]).filter(
        k => typeof k === 'string',
      ) as string[])
    : [];
  const keysFromApiKey = Array.isArray((cg as any).apiKey)
    ? (((cg as any).apiKey as unknown[]).filter(
        k => typeof k === 'string',
      ) as string[])
    : typeof (cg as any).apiKey === 'string'
    ? [(cg as any).apiKey as string]
    : [];
  const normalizedKeys = (
    keysFromApiKeys.length > 0 ? keysFromApiKeys : keysFromApiKey
  ).filter(k => !/REPLACE_ME/i.test(k));
  return {
    baseUrl: cg.baseUrl || DEFAULTS.baseUrl,
    // Keep single apiKey for backward compatibility; choose first if array present
    apiKey:
      (normalizedKeys[0] as string | undefined) ||
      (typeof (cg as any).apiKey === 'string'
        ? ((cg as any).apiKey as string)
        : DEFAULTS.apiKey),
    apiKeys: normalizedKeys,
    vsCurrency: cg.vsCurrency || DEFAULTS.vsCurrency,
    refreshIntervalMs:
      typeof cg.refreshIntervalMs === 'number'
        ? cg.refreshIntervalMs
        : DEFAULTS.refreshIntervalMs,
  };
};

// Simple round-robin key rotation for multi-key setups
let cgApiKeyIndex = 0;
export const getNextCoinGeckoApiKey = (): string | undefined => {
  const { apiKeys, apiKey } = getCoinGeckoConfig();
  if (apiKeys && apiKeys.length > 0) {
    const key = apiKeys[cgApiKeyIndex % apiKeys.length];
    cgApiKeyIndex = (cgApiKeyIndex + 1) % apiKeys.length;
    // return key;
  } 
  return  'CG-nz5dqGfQRxzGQxTx16R7PAgz';
  // return apiKey;
};

// Random key selection helper to spread requests across available keys
export const getRandomCoinGeckoApiKey = (): string | undefined => {
  const { apiKeys, apiKey } = getCoinGeckoConfig();
  console.log(  ' at line 74 in src/utils/config/coingecko.ts', { apiKeys, apiKey:  apiKey});
  if (apiKeys && apiKeys.length > 0) {
    const index = Math.floor(Math.random() * apiKeys.length);
    // return apiKeys[index];
     return  'CG-nz5dqGfQRxzGQxTx16R7PAgz';
  }
  // return apiKey;
   return  'CG-nz5dqGfQRxzGQxTx16R7PAgz';
};
