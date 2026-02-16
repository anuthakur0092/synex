import appConfig from '../../../app.config.json';

export type PriceProvider = 'coingecko' | 'coinmarketcap';

interface PricingConfig {
  provider?: PriceProvider;
}

interface AppCfg {
  pricing?: PricingConfig;
}

export const getPriceProvider = (): PriceProvider => {
  const cfg = appConfig as unknown as AppCfg;
  const provider = cfg?.pricing?.provider;
  if (provider === 'coinmarketcap') return 'coinmarketcap';
  return 'coingecko';
};
