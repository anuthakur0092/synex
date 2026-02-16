import { useState, useEffect, useCallback } from 'react';
import {
  walletStorage,
  BiometricSettings,
} from '../services/storage/walletStorage';

export interface UseAuthenticationResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresAuth: boolean;
  authenticate: () => Promise<boolean>;
  logout: () => void;
  biometricSettings: BiometricSettings | null;
}

export const useAuthentication = (): UseAuthenticationResult => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [biometricSettings, setBiometricSettings] =
    useState<BiometricSettings | null>(null);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      setIsLoading(true);

      // Check if user has a wallet
      const currentWalletId = await walletStorage.getCurrentWalletId();
      if (!currentWalletId) {
        setIsAuthenticated(false);
        setRequiresAuth(false);
        return;
      }

      // Check biometric settings
      const settings = await walletStorage.getBiometricSettings();
      setBiometricSettings(settings);

      if (settings?.enabled && settings?.pinEnabled) {
        // PIN authentication is enabled, require authentication
        setRequiresAuth(true);
        setIsAuthenticated(false);
      } else {
        // No authentication required
        setRequiresAuth(false);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
      setRequiresAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      if (!biometricSettings?.enabled || !biometricSettings?.pinEnabled) {
        setIsAuthenticated(true);
        return true;
      }

      // For now, we'll return true and let the UI handle the PIN verification
      // This will be called by the PIN verification screen
      return true;
    } catch (error) {
      console.error('Error during authentication:', error);
      return false;
    }
  }, [biometricSettings]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    if (biometricSettings?.enabled && biometricSettings?.pinEnabled) {
      setRequiresAuth(true);
    }
  }, [biometricSettings]);

  return {
    isAuthenticated,
    isLoading,
    requiresAuth,
    authenticate,
    logout,
    biometricSettings,
  };
};
