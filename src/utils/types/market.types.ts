export interface ChartPoint {
  timestamp: number; // ms epoch
  value: number; // price in USD
}

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export interface TokenMarketSummary {
  price: number; // current price USD
  changePct24h: number; // 24h change percentage
  lastUpdated: number; // ms epoch
}

export interface TokenTransactionItem {
  hash: string;
  type: 'send' | 'receive';
  from: string;
  to: string;
  amount: string; // token units
  amountUsd?: number; // optional USD value at tx time
  timestamp: string; // ISO
}
