import { DashboardData } from '../types/dashboard.types';

// Define the dashboard data directly in TypeScript to avoid JSON import issues
const dashboardDataJson: DashboardData = {
  user: {
    profile: {
      avatar: '👤',
      hasNotification: true,
      notificationType: 'update',
    },
    selectedNetwork: {
      name: 'All Networks',
      chainId: 0,
      symbol: 'ALL',
      isTestnet: false,
    },
  },
  wallet: {
    address: '',
    balance: {
      primary: {
        amount: '',
        symbol: '',
        decimals: 0,
      },
      secondary: {
        amount: '',
        currency: '',
        symbol: '$',
      },
      change: {
        percentage: 0,
        isPositive: true,
        timeframe: '24h',
      },
    },
  },
  quickActions: [
    {
      id: 'send',
      title: 'Send',
      icon: '📤',
      action: 'navigate_to_send',
      enabled: true,
    },
    {
      id: 'receive',
      title: 'Receive',
      icon: '📥',
      action: 'navigate_to_receive',
      enabled: true,
    },
  ],
  tokens: [],
  recentTransactions: [
    {
      id: 'tx_001',
      type: 'send',
      status: 'confirmed',
      amount: '0.5',
      symbol: 'ETH',
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      from: '0x946f36b52AA2deaE47156d7928987b60c60A6C9C',
      timestamp: '2024-01-15T10:30:00Z',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      gasUsed: '21000',
      gasPrice: '20000000000',
    },
    {
      id: 'tx_002',
      type: 'receive',
      status: 'confirmed',
      amount: '2.1',
      symbol: 'ETH',
      to: '0x946f36b52AA2deaE47156d7928987b60c60A6C9C',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      timestamp: '2024-01-14T15:45:00Z',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      gasUsed: '21000',
      gasPrice: '18000000000',
    },
  ],
  marketData: {
    lastUpdated: '',
    totalPortfolioValue: {
      amount: '',
      currency: '',
      symbol: '$',
    },
    totalChange: {
      percentage: 0,
      isPositive: true,
      timeframe: '24h',
    },
  },
  settings: {
    notifications: {
      enabled: true,
      priceAlerts: true,
      transactionAlerts: true,
      securityAlerts: true,
    },
    security: {
      biometricEnabled: true,
      autoLockEnabled: true,
      autoLockTimeout: 300,
      hideBalances: false,
    },
    display: {
      currency: 'USD',
      language: 'en',
      theme: 'dark',
    },
  },
};

// Export the typed dashboard data
export const dashboardData: DashboardData = dashboardDataJson;

// Utility function to get dashboard data with error handling
export const getDashboardData = (): DashboardData => {
  if (!dashboardData) {
    console.error('Dashboard data is undefined!');
    throw new Error('Dashboard data not available');
  }
  return dashboardData;
};

// Utility function to update specific parts of dashboard data
export const updateDashboardData = (
  updates: Partial<DashboardData>,
): DashboardData => {
  if (!dashboardData) {
    console.error('Dashboard data is undefined!');
    throw new Error('Dashboard data not available');
  }
  return {
    ...dashboardData,
    ...updates,
  };
};

// Utility function to get tokens by symbol
export const getTokenBySymbol = (symbol: string) => {
  if (!dashboardData?.tokens) {
    console.error('Tokens data is undefined!');
    return undefined;
  }
  return dashboardData.tokens.find(token => token.symbol === symbol);
};

// Utility function to get primary token (ETH)
export const getPrimaryToken = () => {
  if (!dashboardData?.tokens) {
    console.error('Tokens data is undefined!');
    return undefined;
  }
  return dashboardData.tokens.find(token => token.isPrimary);
};

// Utility function to format balance display
export const formatBalance = (amount: string, symbol: string): string => {
  return `${amount} ${symbol}`;
};

// Utility function to format currency value
export const formatCurrency = (value: {
  amount: string;
  symbol: string;
}): string => {
  return `${value.symbol}${value.amount}`;
};

// Utility function to format percentage change
export const formatPercentageChange = (change: {
  percentage: number;
  isPositive: boolean;
}): string => {
  const value = Math.abs(change.percentage);
  // Use Trust Wallet style: tiny values shown as <0.01 with sign
  const threshold = 0.01;
  if (value > 0 && value < threshold) {
    return `${change.isPositive ? '+ ' : '- '}<0.01%`;
  }
  const rounded = value.toFixed(2);
  const sign = change.isPositive ? '+ ' : '- ';
  return `${sign}${rounded}%`;
};

// Export default for easy importing
export default dashboardData;
