import appConfig from '../../../app.config.json';

export interface NetworkConfig {
  name: string;
  chainId: number;
  symbol: string;
  isTestnet: boolean;
  rpcHttpUrl: string;
  rpcWsUrl?: string;
}

type AppConfigWithNetwork = typeof appConfig & {
  network?: Partial<NetworkConfig>;
};

const DEFAULT_NETWORK: NetworkConfig = {
  name: 'BNB Smart Chain',
  chainId: 56,
  symbol: 'BNB',
  isTestnet: false,
  // Replace these with your Alchemy/Infura/Custom RPC URLs
  rpcHttpUrl: 'https://bnb-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
  rpcWsUrl: 'wss://bnb-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
};

export const getNetworkConfig = (): NetworkConfig => {
  const cfg = appConfig as AppConfigWithNetwork;
  const net = cfg.network || {};
  return {
    name: net.name || DEFAULT_NETWORK.name,
    chainId:
      typeof net.chainId === 'number' ? net.chainId : DEFAULT_NETWORK.chainId,
    symbol: net.symbol || DEFAULT_NETWORK.symbol,
    isTestnet:
      typeof net.isTestnet === 'boolean'
        ? net.isTestnet
        : DEFAULT_NETWORK.isTestnet,
    rpcHttpUrl: net.rpcHttpUrl || DEFAULT_NETWORK.rpcHttpUrl,
    rpcWsUrl: net.rpcWsUrl || DEFAULT_NETWORK.rpcWsUrl,
  };
};
