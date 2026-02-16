import { useState, useEffect } from 'react';
import { walletStorage } from '../services/storage/walletStorage';

// Simulate checking if user is authenticated/has wallet setup
// In a real app, this would check secure storage, keychain, etc.
export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    // Check authentication/wallet status from secure storage
    const checkUserStatus = async () => {
      try {
        // Small delay to allow splash to feel smooth
        await new Promise(resolve => setTimeout(resolve, 300));

        const currentId = await walletStorage.getCurrentWalletId();
        const exists = !!currentId;
        // Do NOT decrypt on startup to avoid blocking UI; defer decryption to when needed
        setHasWallet(exists);
        setIsAuthenticated(exists);
      } catch (error) {
        console.error('Error checking user status:', error);
        setHasWallet(false);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const completeOnboarding = () => {
    setHasWallet(true);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasWallet(false);
    // ensure needsOnboarding becomes true immediately
  };

  // User needs onboarding if they don't have a wallet or aren't authenticated
  const needsOnboarding = !isAuthenticated || !hasWallet;

  return {
    isLoading,
    isAuthenticated,
    hasWallet,
    needsOnboarding,
    completeOnboarding,
    logout,
  };
};
