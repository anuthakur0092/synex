import { Token } from './types/dashboard.types';
import { TokenConfig } from './types/token.types';
import { supportedChains } from './config/chains';

export const buildTokenFromConfig = (cfg: TokenConfig): Token => ({
  id: cfg.address.toLowerCase(),
  name: cfg.name,
  symbol: cfg.symbol,
  icon: '🪙',
  logoURI: cfg.logoURI,
  balance: { amount: '0', symbol: cfg.symbol, decimals: cfg.decimals },
  value: { amount: '0', currency: 'USD', symbol: '$' },
  change: { percentage: 0, isPositive: true, timeframe: '24h' },
  isPrimary: false,
  contractAddress: cfg.address,
  chain: supportedChains.find(c => c.chainId === cfg.chainId)?.id || 'ethereum',
  chainId: cfg.chainId,
});
