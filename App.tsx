/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Import crypto polyfills first
import './src/utils/polyfills';

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Linking } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useColors } from './src/utils/theme';
import { SplashScreen } from './src/components/common/SplashScreen';
import { SafeAreaProvider } from './src/components/common/SafeAreaProvider';
import { WalletSetupScreen } from './src/components/features/onboarding/WalletSetupScreen';
import { ImportScreen } from './src/components/features/onboarding/ImportScreen';
import { CreateWalletFlow } from './src/components/features/onboarding/CreateWalletFlow';
import { TabNavigator } from './src/navigation/TabNavigator';
import { ImportTokensScreen } from './src/components/features/tokens/ImportTokens';
import { SendStack } from './src/navigation/SendStack';
import Header from './src/components/common/Header';
import { useSplashScreen } from './src/hooks/useSplashScreen';
import { useOnboarding } from './src/hooks/useOnboarding';
import { getThemeMode, getSplashDuration } from './src/utils/config';
import { CryptoWalletService } from './src/services/crypto/wallet';
import {
  WalletStorageService,
  walletStorage,
} from './src/services/storage/walletStorage';
import { useWalletConnect } from './src/hooks/useWalletConnect';
import { navigationRef } from './src/navigation/navigationRef';
import { RequestSheet } from './src/components/features/walletconnect/RequestSheet/RequestSheet';
import { reconfigureProvidersForSelectedChain } from './src/services/api/ethProvider';
import { AuthenticationWrapper } from './src/components/auth/AuthenticationWrapper';

// Screen types for navigation
type OnboardingScreen = 'setup' | 'import' | 'create';

// Main app component with routing logic
const ThemedApp: React.FC = () => {
  const RootStack = createNativeStackNavigator();
  const colors = useColors();
  // Initialize WalletConnect session handlers globally
  useWalletConnect();
  // Navigation theme must be created unconditionally to keep hook order stable
  const navTheme = React.useMemo(() => {
    return {
      ...(colors.background.primary === '#09080C' ? DarkTheme : DefaultTheme),
      dark: true,
      colors: {
        ...(colors.background.primary === '#09080C'
          ? DarkTheme.colors
          : DefaultTheme.colors),
        background: colors.background.primary,
        card: colors.background.primary,
        border: colors.border.primary,
        text: colors.text.primary,
        primary: colors.interactive.primary,
      },
    } as const;
  }, [colors]);
  const { isVisible: splashVisible, hideSplashScreen } = useSplashScreen({
    duration: getSplashDuration(),
  });
  const { isLoading, needsOnboarding, completeOnboarding, logout } =
    useOnboarding();
  const [currentScreen, setCurrentScreen] = useState<OnboardingScreen>('setup');

  // When dashboard becomes visible, log wallet info once from here as a fallback
  React.useEffect(() => {
    if (isLoading || needsOnboarding) return;
    (async () => {
      try {
        // Ensure RPC providers are configured to the user's selected chain on app ready
        await reconfigureProvidersForSelectedChain();
        // console.log('App: Dashboard is visible; logging wallet summary...');
        const id = await walletStorage.getCurrentWalletId();
        const meta = id ? await walletStorage.getWalletMetadata(id) : null;
        // console.log('App: Current wallet ID', id);
        // console.log('App: Wallet metadata', meta);
      } catch (e) {
        console.log('App: Failed to log wallet summary', e);
      }
    })();
  }, [isLoading, needsOnboarding]);

  // Handle wallet setup actions
  const handleImportWallet = () => {
    setCurrentScreen('import');
  };

  const handleCreateWallet = () => {
    setCurrentScreen('create');
  };

  // Handle import form submission
  const handleImportSubmit = async (data: {
    seedPhrase: string;
    password: string;
    confirmPassword: string;
    biometric: boolean;
  }) => {
    // Use setTimeout to make storage operations non-blocking
    setTimeout(async () => {
      try {
        // console.log('🔄 Processing wallet import and storage...');

        // The ImportScreen already validated and imported the wallet with selected mode
        // Now we need to save it to storage
        const input = data.seedPhrase.trim();

        // Re-import for storage - the ImportScreen already determined the type
        // console.log('🔑 Re-importing wallet for storage...');

        // Try to determine the type based on input format for storage
        const isPrivateKey = /^(0x)?[0-9a-fA-F]{64}$/.test(input);

        let walletResult;
        if (isPrivateKey) {
          // console.log('🔑 Re-importing from private key...');
          walletResult = await CryptoWalletService.importFromPrivateKey(input);
        } else {
          // console.log('🔑 Re-importing from mnemonic...');
          walletResult = await CryptoWalletService.importFromMnemonic(input);
        }

        // console.log('💾 Saving wallet to secure storage...');

        // Save to storage
        const walletId = await walletStorage.saveWallet(
          walletResult.wallet,
          data.password,
        );

        console.log('✅ Wallet imported and saved successfully:', {
          id: walletId,
          address: walletResult.wallet.address,
          type: isPrivateKey ? 'private key' : 'mnemonic',
        });

        console.log('🎉 Import process completed, redirecting to main app...');

        // Complete onboarding immediately after successful save
        completeOnboarding();
      } catch (error) {
        console.error('❌ Import failed:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to import wallet';

        Alert.alert('Import Failed', errorMessage, [
          { text: 'OK', style: 'default' },
        ]);
      }
    }, 100); // Small delay to allow UI updates
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentScreen('setup');
  };

  // Always render the main app content, but overlay splash screen when needed
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider
        statusBarStyle="light-content"
        backgroundColor={colors.background.primary}
      >
        {/* Main app content - always rendered */}
        {!splashVisible && (
          <>
            {/* Show loading if checking user status */}
            {isLoading ? (
              <View
                style={[
                  styles.container,
                  { backgroundColor: colors.background.primary },
                ]}
              >
                {/* You could add a loading spinner here */}
              </View>
            ) : needsOnboarding ? (
              <View
                style={[
                  styles.container,
                  { backgroundColor: colors.background.primary },
                ]}
              >
                {currentScreen === 'setup' && (
                  <WalletSetupScreen
                    onImportWallet={handleImportWallet}
                    onCreateWallet={handleCreateWallet}
                  />
                )}
                {currentScreen === 'import' && (
                  <ImportScreen
                    onImport={handleImportSubmit}
                    onBack={handleBack}
                  />
                )}
                {currentScreen === 'create' && (
                  <CreateWalletFlow
                    onComplete={completeOnboarding}
                    onBack={handleBack}
                  />
                )}
              </View>
            ) : (
              <NavigationContainer
                theme={navTheme}
                ref={navigationRef}
                linking={{
                  prefixes: ['yoex://', 'wc:'],
                }}
              >
                <RootStack.Navigator
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: colors.background.primary,
                    },
                    animation: 'ios_from_right',
                  }}
                >
                  <RootStack.Screen name="Tabs">
                    {() => (
                      <AuthenticationWrapper>
                        <TabNavigator
                          onLogout={async () => {
                            try {
                              await walletStorage.clearAll();
                            } catch (e) {
                              console.log(
                                'App logout: storage clear failed, proceeding',
                                e,
                              );
                            }
                            setCurrentScreen('setup');
                            logout();
                          }}
                        />
                      </AuthenticationWrapper>
                    )}
                  </RootStack.Screen>
                  <RootStack.Screen
                    name="ImportTokens"
                    component={ImportTokensScreen}
                    options={({ navigation }) => ({
                      headerShown: true,
                      header: () => (
                        <Header
                          title="Add Tokens"
                          onBackPress={() => navigation.goBack()}
                          showBackButton={true}
                        />
                      ),
                    })}
                  />
                  <RootStack.Screen name="Send" component={SendStack} />
                </RootStack.Navigator>
              </NavigationContainer>
            )}
          </>
        )}

        {/* Splash screen overlay */}
        {splashVisible && (
          <SplashScreen onAnimationComplete={hideSplashScreen} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

function App() {
  return (
    <ThemeProvider initialMode={getThemeMode()}>
      <ThemedApp />
    </ThemeProvider>
  );
}

// Create styles using the new theme system
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
