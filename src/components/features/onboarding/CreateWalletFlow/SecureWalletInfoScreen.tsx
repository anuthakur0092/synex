import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { ProgressBarWithSteps } from './ProgressBarWithSteps';
import { WhyImportantBottomSheet } from './WhyImportantBottomSheet';
import LeftBackIcon from '../../../../assets/icon/left-back.svg';

import { styles } from './SecureWalletInfoScreen.styles';

interface SecureWalletInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
  isWalletReady?: boolean;
}

export const SecureWalletInfoScreen: React.FC<SecureWalletInfoScreenProps> = ({
  onNext,
  onBack,
  isWalletReady = false,
}) => {
  const colors = useColors();
  const [showWhyImportant, setShowWhyImportant] = useState(false);

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
          <ProgressBarWithSteps currentStep={2} totalSteps={5} />
        </View>

        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Secure Your Wallet
        </Text>

        {/* Wallet illustration - for now using a simple colored view */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.illustration,
              { backgroundColor: colors.interactive.secondary },
            ]}
          >
            <Text
              style={[styles.illustrationText, { color: colors.text.inverse }]}
            >
              🛡️💳
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Don't risk losing your funds, protect your wallet by saving your{' '}
          <Text style={{ color: colors.text.primary, fontWeight: 'bold' }}>
            Seed Phrase
          </Text>{' '}
          in a place you trust.
        </Text>

        <Text style={[styles.description, { color: colors.text.secondary }]}>
          It's the only way to recover your wallet if you get locked out of the
          app or get a new device.
        </Text>

        <View style={styles.infoBox}>
          <TouchableOpacity
            style={[
              styles.whyImportantButton,
              {
                borderWidth: 1,
                borderColor: colors.interactive.primary,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background.card,
              },
            ]}
            onPress={() => setShowWhyImportant(true)}
          >
            <View style={styles.whyImportantContent}>
              <Text
                style={[
                  styles.whyImportantText,
                  { color: colors.interactive.primary, fontWeight: '600' },
                ]}
              >
                Why is it important?
              </Text>
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.interactive.primary },
                ]}
              >
                <Text
                  style={[styles.infoIconText, { color: colors.text.inverse }]}
                >
                  i
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.infoContent,
              { borderColor: colors.interactive.secondary },
            ]}
          >
            <View style={styles.infoSection}>
              <Text
                style={[
                  styles.infoSectionTitle,
                  { color: colors.text.primary },
                ]}
              >
                Manual
              </Text>
              <Text
                style={[styles.securityLevel, { color: colors.status.success }]}
              >
                Security Level: Very Strong
              </Text>
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Write down your seed phrase on a piece of paper and store it in
                a safe place.
              </Text>

              <Text style={[styles.risksTitle, { color: colors.text.primary }]}>
                Risks are:
              </Text>
              <Text style={[styles.riskItem, { color: colors.text.secondary }]}>
                • You lose it
              </Text>
              <Text style={[styles.riskItem, { color: colors.text.secondary }]}>
                • You forget where you put it
              </Text>
              <Text style={[styles.riskItem, { color: colors.text.secondary }]}>
                • Someone else finds it
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.border.primary },
              ]}
            />

            <View style={styles.infoSection}>
              <Text
                style={[
                  styles.otherOptionsTitle,
                  { color: colors.text.primary },
                ]}
              >
                Other options: Doesn't have to be paper!
              </Text>

              <Text
                style={[styles.tipsTitle, { color: colors.text.secondary }]}
              >
                Tips:
              </Text>
              <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
                • Store in bank vault
              </Text>
              <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
                • Store in a safe
              </Text>
              <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
                • Store in multiple secret places
              </Text>
            </View>
          </View>
        </View>

        {/* Conditional Button Rendering */}
        {isWalletReady ? (
          <>
            <TouchableOpacity
              style={[
                styles.remindButton,
                { borderColor: colors.text.tertiary },
              ]}
            >
              <Text
                style={[
                  styles.remindButtonText,
                  { color: colors.text.tertiary },
                ]}
              >
                Remind Me Later
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: colors.interactive.primary },
              ]}
              onPress={onNext}
            >
              <Text
                style={[styles.nextButtonText, { color: colors.text.inverse }]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.interactive.primary}
            />
            <Text
              style={[styles.loadingText, { color: colors.text.secondary }]}
            >
              Please wait while we generate your secure wallet...
            </Text>
            <Text
              style={[styles.loadingSubtext, { color: colors.text.tertiary }]}
            >
              This will only take a moment
            </Text>
          </View>
        )}
      </ScrollView>

      <WhyImportantBottomSheet
        isVisible={showWhyImportant}
        onClose={() => setShowWhyImportant(false)}
      />
    </SafeAreaView>
  );
};
