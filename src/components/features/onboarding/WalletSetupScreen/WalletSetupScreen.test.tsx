import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WalletSetupScreen } from './WalletSetupScreen';

describe('WalletSetupScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WalletSetupScreen />);

    expect(getByText('YoeX')).toBeTruthy();
    expect(getByText('Wallet')).toBeTruthy();
    expect(getByText('Import Using Seed Phrase')).toBeTruthy();
    expect(getByText('Create a New Wallet')).toBeTruthy();
  });

  it('calls onImportWallet when import button is pressed', () => {
    const mockImportWallet = jest.fn();
    const { getByText } = render(
      <WalletSetupScreen onImportWallet={mockImportWallet} />,
    );

    fireEvent.press(getByText('Import Using Seed Phrase'));
    expect(mockImportWallet).toHaveBeenCalled();
  });

  it('calls onCreateWallet when create button is pressed', () => {
    const mockCreateWallet = jest.fn();
    const { getByText } = render(
      <WalletSetupScreen onCreateWallet={mockCreateWallet} />,
    );

    fireEvent.press(getByText('Create a New Wallet'));
    expect(mockCreateWallet).toHaveBeenCalled();
  });

  it('handles missing callbacks gracefully', () => {
    const { getByText } = render(<WalletSetupScreen />);

    // Should not crash when pressing buttons without callbacks
    fireEvent.press(getByText('Import Using Seed Phrase'));
    fireEvent.press(getByText('Create a New Wallet'));

    expect(getByText('YoeX')).toBeTruthy();
  });
});
