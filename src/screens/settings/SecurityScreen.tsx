import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { useColors } from '../../utils/theme';
import { walletStorage } from '../../services/storage/walletStorage';
import { ClipboardUtils } from '../../utils/clipboard';
import IconSecurity from '../../assets/settings/security.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/types';

// Token icons
const EthereumIcon = require('../../assets/tokens/ethereum.png');
const BinanceIcon = require('../../assets/tokens/binance.png');
const PolygonIcon = require('../../assets/tokens/polygon.png');

interface SecurityScreenProps {
  navigation: NativeStackNavigationProp<SettingsStackParamList, 'Security'>;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({
  navigation,
}) => {
  const colors = useColors();
  const [privateKey, setPrivateKey] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [requiredText] = useState('I understand the risks');

  // Network configurations
  const networks = [
    {
      name: 'Ethereum',
      icon: EthereumIcon,
      address: walletAddress, // Same address for all networks in this wallet
    },
    {
      name: 'BNB Smart Chain',
      icon: BinanceIcon,
      address: walletAddress,
    },
    {
      name: 'Polygon',
      icon: PolygonIcon,
      address: walletAddress,
    },
  ];

  useEffect(() => {
    loadWalletInfo();
  }, []);

  const loadWalletInfo = async () => {
    try {
      setIsLoading(true);
      const currentWalletId = await walletStorage.getCurrentWalletId();
      if (currentWalletId) {
        const metadata = await walletStorage.getWalletMetadata(currentWalletId);
        if (metadata) {
          setWalletAddress(metadata.address);
        }
      }
    } catch (error) {
      console.error('Error loading wallet info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPrivateKey = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmShowPrivateKey = async () => {
    if (confirmationText !== requiredText) {
      Alert.alert(
        'Error',
        'Please type the exact text to confirm you understand the risks',
      );
      return;
    }

    try {
      const currentWalletId = await walletStorage.getCurrentWalletId();
      if (!currentWalletId) return;

      const password = await walletStorage.getStoredPassword(currentWalletId);
      if (!password) {
        Alert.alert('Error', 'Unable to retrieve wallet password');
        return;
      }

      const wallet = await walletStorage.getWallet(currentWalletId, password);
      if (wallet && wallet.privateKey) {
        setPrivateKey(wallet.privateKey);
        setShowPrivateKey(true);
        setShowConfirmationModal(false);
        setConfirmationText('');
      }
    } catch (error) {
      console.error('Error loading private key:', error);
      Alert.alert('Error', 'Failed to load private key');
    }
  };

  const handleHidePrivateKey = () => {
    setShowPrivateKey(false);
    setPrivateKey(''); // Clear from memory
  };

  const handleCopyPrivateKey = async () => {
    if (privateKey) {
      await ClipboardUtils.showPrivateKey(privateKey);
    }
  };

  const handleCopyWalletAddress = async (address: string) => {
    if (address) {
      await ClipboardUtils.showWalletAddress(address);
    }
  };

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
            Loading wallet information...
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
        {/* Critical Security Warning - Moved to top */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            ⚠️ Critical Security Warning
          </Text>
          <View
            style={[
              styles.warningCard,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <Text style={[styles.warningTitle, { color: colors.status.error }]}>
              NEVER SHARE YOUR PRIVATE KEY WITH ANYONE!
            </Text>
            <Text
              style={[styles.warningText, { color: colors.text.secondary }]}
            >
              • Your private key is the only way to access your funds
            </Text>
            <Text
              style={[styles.warningText, { color: colors.text.secondary }]}
            >
              • Anyone with your private key can steal all your assets
            </Text>
            <Text
              style={[styles.warningText, { color: colors.text.secondary }]}
            >
              • Never enter it on websites, share in messages, or give to
              support
            </Text>
            <Text
              style={[styles.warningText, { color: colors.text.secondary }]}
            >
              • Store it offline in a secure, private location
            </Text>
            <Text
              style={[styles.warningText, { color: colors.text.secondary }]}
            >
              • Consider using a hardware wallet for maximum security
            </Text>
          </View>
        </View>

        {/* Network Addresses */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Network Addresses
          </Text>
          {networks.map((network, index) => (
            <View key={index} style={styles.networkCard}>
              <View style={styles.networkHeader}>
                <View style={styles.networkInfo}>
                  <Image source={network.icon} style={styles.networkIcon} />
                  <Text
                    style={[styles.networkName, { color: colors.text.primary }]}
                  >
                    {network.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.copyButton,
                    { backgroundColor: colors.interactive.primary },
                  ]}
                  onPress={() => handleCopyWalletAddress(network.address)}
                >
                  <Text
                    style={[
                      styles.copyButtonText,
                      { color: colors.text.inverse },
                    ]}
                  >
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.networkAddress,
                  { color: colors.text.secondary },
                ]}
              >
                {network.address || 'Address not available'}
              </Text>
            </View>
          ))}
        </View>

        {/* Private Key */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Private Key
          </Text>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <View style={styles.infoHeader}>
              <Text style={[styles.infoTitle, { color: colors.text.primary }]}>
                Private Key
              </Text>
              <View style={styles.privateKeyActions}>
                {!showPrivateKey ? (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.interactive.secondary },
                    ]}
                    onPress={handleShowPrivateKey}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: colors.text.primary },
                      ]}
                    >
                      Reveal
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.copyButton,
                        { backgroundColor: colors.interactive.primary },
                      ]}
                      onPress={handleCopyPrivateKey}
                    >
                      <Text
                        style={[
                          styles.copyButtonText,
                          { color: colors.text.inverse },
                        ]}
                      >
                        Copy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: colors.interactive.secondary },
                      ]}
                      onPress={handleHidePrivateKey}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: colors.text.primary },
                        ]}
                      >
                        Hide
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            {showPrivateKey ? (
              <Text
                style={[styles.infoValue, { color: colors.text.secondary }]}
              >
                {privateKey}
              </Text>
            ) : (
              <View style={styles.hiddenContainer}>
                <Text
                  style={[styles.hiddenText, { color: colors.text.tertiary }]}
                >
                  🔒 Private key is hidden for security
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal for Private Key */}
      <Modal
        visible={showConfirmationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              ⚠️ Security Confirmation Required
            </Text>

            <Text
              style={[
                styles.modalDescription,
                { color: colors.text.secondary },
              ]}
            >
              To reveal your private key, you must confirm that you understand
              the risks involved.
            </Text>

            <Text style={[styles.modalWarning, { color: colors.status.error }]}>
              Type exactly: "{requiredText}"
            </Text>

            <TextInput
              style={[
                styles.confirmationInput,
                {
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                },
              ]}
              value={confirmationText}
              onChangeText={setConfirmationText}
              placeholder="Type the confirmation text..."
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { borderColor: colors.border.primary },
                ]}
                onPress={() => {
                  setShowConfirmationModal(false);
                  setConfirmationText('');
                }}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: colors.text.primary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  {
                    backgroundColor:
                      confirmationText === requiredText
                        ? colors.interactive.primary
                        : colors.text.tertiary,
                  },
                ]}
                onPress={handleConfirmShowPrivateKey}
                disabled={confirmationText !== requiredText}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: colors.text.inverse },
                  ]}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  privateKeyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hiddenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  hiddenText: {
    fontSize: 14,
  },
  warningCard: {
    padding: 16,
    borderRadius: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalWarning: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  confirmButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  networkCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '600',
  },
  networkAddress: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});
