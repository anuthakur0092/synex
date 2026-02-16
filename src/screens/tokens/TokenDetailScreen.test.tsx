import React from 'react';
import { render } from '@testing-library/react-native';
import TokenDetailScreen from './TokenDetailScreen';

const mockRoute: any = {
  params: {
    token: {
      id: 'usdc',
      name: 'USD Coin',
      symbol: 'USDC',
      icon: '🪙',
      balance: { amount: '0', symbol: 'USDC', decimals: 6 },
      value: { amount: '0', currency: 'USD', symbol: '$' },
      change: { percentage: 0, isPositive: true, timeframe: '24h' },
      isPrimary: false,
      contractAddress: '0x0000000000000000000000000000000000000000',
    },
  },
};

const mockNavigation: any = {};

describe('TokenDetailScreen', () => {
  it('renders token name and symbol', () => {
    const { getByText } = render(
      <TokenDetailScreen route={mockRoute} navigation={mockNavigation} />,
    );
    expect(getByText(/USD Coin/i)).toBeTruthy();
    expect(getByText(/USDC/i)).toBeTruthy();
  });
});
