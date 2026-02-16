export interface CovalentTxDetails {
  hash: string;
  from: string;
  to: string;
  blockSignedAt: string;
  blockHeight?: number;
  success: boolean;
  value: string; // raw native value in wei when native, may be empty for token-only
  valueQuote?: number; // USD
  gasOffered?: string; // gas limit
  gasSpent?: string; // gas used
  gasPriceWei?: string;
}
