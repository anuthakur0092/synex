export interface TokenConfig {
  chainId: number; // EVM chain id (1 for Ethereum)
  address: string; // ERC-20 contract address (checksum or lowercase)
  name: string;
  symbol: string;
  decimals: number; // token precision
  logoURI?: string; // optional remote/local logo
  tags?: string[];
}

export interface TokenListByChain {
  chainId: number;
  tokens: TokenConfig[];
}

export interface TokenSelectionState {
  [normalizedAddress: string]: boolean;
}
