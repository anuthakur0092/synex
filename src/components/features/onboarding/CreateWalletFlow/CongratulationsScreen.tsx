import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { ProgressBarWithSteps } from './ProgressBarWithSteps';
import LeftBackIcon from '../../../../assets/icon/left-back.svg';
import LottieIcon from '../../../../components/common/LottieIcon';
import { styles } from './CongratulationsScreen.styles';

import { ClipboardUtils } from '../../../../utils/clipboard';

interface CongratulationsScreenProps {
  onComplete: () => void;
  onBack: () => void;
  walletAddress?: string;
}

export const CongratulationsScreen: React.FC<CongratulationsScreenProps> = ({
  onComplete,
  onBack,
  walletAddress,
}) => {
  const colors = useColors();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Header with Progress and Back button */}
      {/* Custom Header with Progress in Title Area */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <View style={styles.backButtonContainer}>
            <LeftBackIcon
              width={styles.backIcon.width}
              height={styles.backIcon.height}
              color={styles.backIcon.tintColor}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <ProgressBarWithSteps currentStep={5} totalSteps={5} />
        </View>

        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <LottieIcon icon="success" size={80} />
        </View>

        {/* Title and Description */}
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Congratulations!
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Your wallet has been created successfully. You can now start using
          Oxylon to manage your cryptocurrencies.
        </Text>

        {/* Wallet Details Section */}
        {walletAddress && (
          <View style={styles.walletDetailsContainer}>
            {/* Wallet Address */}
            <View
              style={[
                styles.walletDetailCard,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                },
              ]}
            >
              <View style={styles.walletDetailHeader}>
                <Text
                  style={[
                    styles.walletDetailTitle,
                    { color: colors.text.primary },
                  ]}
                >
                  Wallet Address
                </Text>
                <TouchableOpacity
                  style={[
                    styles.copyButton,
                    { backgroundColor: colors.interactive.primary },
                  ]}
                  onPress={async () => {
                    if (walletAddress) {
                      await ClipboardUtils.showWalletAddress(walletAddress);
                    }
                  }}
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
                  styles.walletDetailValue,
                  { color: colors.text.secondary },
                ]}
              >
                {walletAddress}
              </Text>
            </View>
          </View>
        )}

        {/* Important Note */}
        <View style={styles.noteContainer}>
          <Text style={[styles.noteTitle, { color: colors.text.primary }]}>
            Important Security Notice
          </Text>
          <Text style={[styles.noteText, { color: colors.text.secondary }]}>
            • Keep your seed phrase and private key safe and secure
          </Text>
          <Text style={[styles.noteText, { color: colors.text.secondary }]}>
            • Never share your private key with anyone
          </Text>
          <Text style={[styles.noteText, { color: colors.text.secondary }]}>
            • Anyone with your private key can access your funds
          </Text>
          <Text style={[styles.noteText, { color: colors.text.secondary }]}>
            • You can access your private key and wallet details in Settings →
            Security
          </Text>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: colors.interactive.primary },
          ]}
          onPress={onComplete}
        >
          <Text
            style={[styles.completeButtonText, { color: colors.text.inverse }]}
          >
            Start Using Oxylon
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
