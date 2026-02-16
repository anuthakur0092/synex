import appConfig from '../../../app.config.json';

export interface CoinMarketCapConfig {
  baseUrl: string;
  apiKey?: string;
  apiKeys?: string[];
  vsCurrency: string;
}

type AppCfg = typeof appConfig & {
  coinmarketcap?: Partial<CoinMarketCapConfig>;
};

const DEFAULTS: CoinMarketCapConfig = {
  baseUrl: 'https://pro-api.coinmarketcap.com',
  apiKey: 'cd80684c-dff0-4d59-8a47-2d9f62e869a2',
  apiKeys: [],
  vsCurrency: 'USD',
};

export const getCmcConfig = (): CoinMarketCapConfig => {
  const cfg = appConfig as AppCfg;
  const cmc = cfg.coinmarketcap || {};
  const keysFromApiKeys = Array.isArray((cmc as any).apiKeys)
    ? (((cmc as any).apiKeys as unknown[]).filter(
        k => typeof k === 'string',
      ) as string[])
    : [];
  const keysFromApiKey = Array.isArray((cmc as any).apiKey)
    ? (((cmc as any).apiKey as unknown[]).filter(
        k => typeof k === 'string',
      ) as string[])
    : typeof (cmc as any).apiKey === 'string'
    ? [(cmc as any).apiKey as string]
    : [];
  const normalizedKeys = (
    keysFromApiKeys.length > 0 ? keysFromApiKeys : keysFromApiKey
  ).filter(k => !/REPLACE_ME/i.test(k));

  return {
    baseUrl: cmc.baseUrl || DEFAULTS.baseUrl,
    apiKey:
      (normalizedKeys[0] as string | undefined) ||
      (typeof (cmc as any).apiKey === 'string'
        ? ((cmc as any).apiKey as string)
        : DEFAULTS.apiKey),
    apiKeys: normalizedKeys,
    vsCurrency: (cmc.vsCurrency || DEFAULTS.vsCurrency).toUpperCase(),
  };
};

let cmcApiKeyIndex = 0;
export const getNextCmcApiKey = (): string | undefined => {
  const { apiKeys, apiKey } = getCmcConfig();
  if (apiKeys && apiKeys.length > 0) {
    const key = apiKeys[cmcApiKeyIndex % apiKeys.length];
    cmcApiKeyIndex = (cmcApiKeyIndex + 1) % apiKeys.length;
    return key;
  }
  return apiKey;
};

export const getRandomCmcApiKey = (): string | undefined => {
  const { apiKeys, apiKey } = getCmcConfig();
  if (apiKeys && apiKeys.length > 0) {
    const index = Math.floor(Math.random() * apiKeys.length);
    return apiKeys[index];
  }
  return apiKey;
};
