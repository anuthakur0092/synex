import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthentication } from '../../hooks/useAuthentication';
import { PINVerificationScreen } from '../../screens/auth/PINVerificationScreen';
import { useColors } from '../../utils/theme';

interface AuthenticationWrapperProps {
  children: React.ReactNode;
}

export const AuthenticationWrapper: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const colors = useColors();
  const { isAuthenticated, isLoading, requiresAuth, biometricSettings } =
    useAuthentication();
  const [showPINVerification, setShowPINVerification] = useState(false);

  useEffect(() => {
    if (!isLoading && requiresAuth && !isAuthenticated) {
      setShowPINVerification(true);
    }
  }, [isLoading, requiresAuth, isAuthenticated]);

  const handleAuthenticationSuccess = () => {
    setShowPINVerification(false);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        {/* You can add a loading spinner here */}
      </View>
    );
  }

  if (showPINVerification && biometricSettings?.pinEnabled) {
    return (
      <PINVerificationScreen
        onSuccess={handleAuthenticationSuccess}
        pinLength={biometricSettings.pinLength}
        title="Unlock YoexWallet"
        subtitle="Enter your PIN to access your wallet"
      />
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
