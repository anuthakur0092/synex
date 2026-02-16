export interface ChainConfigItem {
  id: 'ethereum' | 'sepolia' | 'bsc' | 'polygon' | string;
  name: string;
  chainId: number;
  symbol: string;
  isTestnet?: boolean;
  icon?: any; // require('...')
  rpcHttpUrl?: string;
  rpcWsUrl?: string;
}

export const supportedChains: ChainConfigItem[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    isTestnet: false,
    rpcHttpUrl: 'https://eth-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
    rpcWsUrl: 'wss://eth-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
    icon: require('../../assets/tokens/ethereum.png'),
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    chainId: 56,
    symbol: 'BNB',
    isTestnet: false,
    rpcHttpUrl: 'https://bnb-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
    rpcWsUrl: 'wss://bnb-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
    icon: require('../../assets/tokens/binance.png'),
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    symbol: 'POL',
    isTestnet: false,
    rpcHttpUrl:
      'https://polygon-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
    rpcWsUrl: 'wss://polygon-mainnet.g.alchemy.com/v2/YmzF__0gR-fXYRjjsuzIY',
    icon: require('../../assets/tokens/polygon.png'),
  },
];
