import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { ProgressBarWithSteps } from './ProgressBarWithSteps';
import LeftBackIcon from '../../../../assets/icon/left-back.svg';

import { styles } from './WriteSeedPhraseScreen.styles';

interface WriteSeedPhraseScreenProps {
  seedPhrase: string[];
  onNext: () => void;
  onBack: () => void;
}

export const WriteSeedPhraseScreen: React.FC<WriteSeedPhraseScreenProps> = ({
  seedPhrase,
  onNext,
  onBack,
}) => {
  const colors = useColors();
  const [isVisible, setIsVisible] = useState(false);

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
          <ProgressBarWithSteps currentStep={3} totalSteps={5} />
        </View>

        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Write Down Your Seed Phrase
        </Text>

        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          This is your seed phrase. Write it down on a paper and keep it in a
          safe place. You'll be asked to re-enter this phrase (in order) on the
          next step.
        </Text>

        <View style={styles.seedPhraseContainer}>
          <Text
            style={[styles.instructionText, { color: colors.text.secondary }]}
          >
            Tap to reveal your seed phrase
          </Text>
          <Text style={[styles.warningText, { color: colors.text.tertiary }]}>
            Make sure no one is watching your screen.
          </Text>

          {!isVisible ? (
            <TouchableOpacity
              style={[
                styles.revealButton,
                { backgroundColor: colors.background.card },
              ]}
              onPress={() => setIsVisible(true)}
            >
              <Image
                source={require('../../../../assets/icon/eye-visble.png')}
                style={[
                  styles.eyeIcon,
                  { tintColor: colors.interactive.secondary },
                ]}
              />
              <Text
                style={[
                  styles.revealButtonText,
                  { color: colors.interactive.secondary },
                ]}
              >
                View
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.seedPhraseGrid,
                { backgroundColor: colors.background.card },
              ]}
            >
              {seedPhrase.map((word, index) => (
                <View
                  key={index}
                  style={[
                    styles.wordContainer,
                    { backgroundColor: colors.background.primary },
                  ]}
                >
                  <Text
                    style={[styles.wordNumber, { color: colors.text.tertiary }]}
                  >
                    {index + 1}.
                  </Text>
                  <Text
                    style={[styles.wordText, { color: colors.text.primary }]}
                  >
                    {word}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: isVisible
                ? colors.interactive.primary
                : colors.background.tertiary || '#2a2a2a',
              borderWidth: isVisible ? 0 : 1,
              borderColor: isVisible ? 'transparent' : colors.border.primary,
            },
          ]}
          onPress={onNext}
          disabled={!isVisible}
        >
          <Text
            style={[
              styles.continueButtonText,
              {
                color: isVisible ? colors.text.inverse : colors.text.tertiary,
              },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
