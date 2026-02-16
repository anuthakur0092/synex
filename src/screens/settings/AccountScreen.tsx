import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useColors } from '../../utils/theme';
import {
  walletStorage,
  BiometricSettings,
} from '../../services/storage/walletStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/types';
import { PINSetupScreen } from '../auth/PINSetupScreen';

// Simple icon component for PIN authentication
const IconBiometric: React.FC<SvgProps> = ({
  width = 16,
  height = 16,
  color = '#666',
}) => <Text style={{ fontSize: Number(width), color }}>🔐</Text>;

interface AccountRowProps {
  label: string;
  value?: string;
  Icon: React.FC<SvgProps>;
  rightElement?: React.ReactNode;
}

const AccountRow: React.FC<AccountRowProps> = ({
  label,
  value,
  Icon,
  rightElement,
}) => {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Icon width={22} height={22} color={colors.text.primary} />
        <View style={styles.rowContent}>
          <Text style={[styles.rowLabel, { color: colors.text.primary }]}>
            {label}
          </Text>
          {value && (
            <Text style={[styles.rowValue, { color: colors.text.secondary }]}>
              {value}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>{rightElement}</View>
    </View>
  );
};

interface AccountScreenProps {
  navigation: NativeStackNavigationProp<SettingsStackParamList, 'Account'>;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const colors = useColors();
  const [biometricSettings, setBiometricSettings] =
    useState<BiometricSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPINSetup, setShowPINSetup] = useState(false);
  const [pinLength, setPinLength] = useState<4 | 6>(4);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      // Load biometric settings
      const bioSettings = await walletStorage.getBiometricSettings();
      setBiometricSettings(bioSettings);
    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBiometric = useCallback(
    async (enabled: boolean) => {
      try {
        if (enabled) {
          // Show PIN length selection and immediately start setup
          Alert.alert('Choose PIN Length', 'Select the length for your PIN', [
            {
              text: '4 Digits',
              onPress: () => {
                setPinLength(4);
                setShowPINSetup(true);
              },
            },
            {
              text: '6 Digits',
              onPress: () => {
                setPinLength(6);
                setShowPINSetup(true);
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
        } else {
          // Disable biometric authentication
          const newSettings: BiometricSettings = {
            enabled: false,
            type: null,
            lastUsed: new Date().toISOString(),
            pinLength: 4,
            pinEnabled: false,
          };

          await walletStorage.saveBiometricSettings(newSettings);
          setBiometricSettings(newSettings);
        }
      } catch (error) {
        console.error('Error updating biometric settings:', error);
        Alert.alert('Error', 'Failed to update biometric settings');
      }
    },
    [biometricSettings],
  );

  const handlePINSetupComplete = useCallback(
    async (pin: string) => {
      try {
        setShowPINSetup(false);

        const newSettings: BiometricSettings = {
          enabled: true,
          type: 'pin',
          lastUsed: new Date().toISOString(),
          pinLength,
          pinEnabled: true,
        };

        await walletStorage.saveBiometricSettings(newSettings);
        setBiometricSettings(newSettings);

        Alert.alert(
          'Success',
          'PIN authentication has been enabled successfully!',
        );
      } catch (error) {
        console.error('Error completing PIN setup:', error);
        Alert.alert('Error', 'Failed to complete PIN setup');
      }
    },
    [pinLength],
  );

  const handlePINSetupCancel = useCallback(() => {
    setShowPINSetup(false);
    // The switch will automatically reset to off since biometricSettings.enabled remains false
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Security Settings
          </Text>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <AccountRow
              label="PIN Authentication"
              value={
                biometricSettings?.enabled
                  ? `Enabled (${biometricSettings.pinLength}-digit)`
                  : 'Disabled'
              }
              Icon={IconBiometric}
              rightElement={
                <Switch
                  value={biometricSettings?.enabled || false}
                  onValueChange={handleToggleBiometric}
                  thumbColor={
                    biometricSettings?.enabled
                      ? colors.interactive.secondary
                      : colors.text.tertiary
                  }
                  trackColor={{
                    false: colors.border.secondary,
                    true: colors.interactive.primary,
                  }}
                />
              }
            />
          </View>
        </View>

        {/* Support Email */}
        <View style={styles.supportSection}>
          <Text style={[styles.supportText, { color: colors.text.secondary }]}>
            Need help? Contact us at
          </Text>
          <Text
            style={[styles.supportEmail, { color: colors.interactive.primary }]}
          >
            support@yoex.io
          </Text>
        </View>
      </ScrollView>

      {/* PIN Setup Modal */}
      {showPINSetup && (
        <Modal
          visible={showPINSetup}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <PINSetupScreen
            onComplete={handlePINSetupComplete}
            onCancel={handlePINSetupCancel}
            pinLength={pinLength}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowContent: {
    marginLeft: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supportSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 40,
    paddingBottom: 20,
  },
  supportText: {
    fontSize: 14,
    marginBottom: 4,
  },
  supportEmail: {
    fontSize: 16,
    fontWeight: '600',
  },
});
