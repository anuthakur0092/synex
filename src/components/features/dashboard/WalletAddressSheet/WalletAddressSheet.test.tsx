import React from 'react';
import { render } from '@testing-library/react-native';
import { WalletAddressSheet } from './WalletAddressSheet';

describe('WalletAddressSheet', () => {
  it('renders rows and copy buttons for ETH and BSC, polygon text-only', () => {
    const { getByText, queryAllByText } = render(
      <WalletAddressSheet
        visible
        address={'0x1234567890abcdef1234567890abcdef12345678'}
        onClose={() => {}}
      />,
    );

    expect(getByText('My Wallet Address')).toBeTruthy();
    expect(getByText('Ethereum Address')).toBeTruthy();
    expect(getByText('BNB Smart Chain Address')).toBeTruthy();
    expect(getByText('Polygon Address')).toBeTruthy();

    // Two copy buttons (ETH + BSC)
    expect(queryAllByText('Copy').length).toBe(2);
  });
});

