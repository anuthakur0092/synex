import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { ProgressBarWithSteps } from './ProgressBarWithSteps';
import LeftBackIcon from '../../../../assets/icon/left-back.svg';

import {
  getCurrentSeedConfig,
  logSeedPresets,
} from '../../../../utils/config/seedConfig';
import { styles } from './ConfirmSeedPhraseScreen.styles';

interface ConfirmSeedPhraseScreenProps {
  seedPhrase: string[];
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

interface ConfirmationStep {
  requiredPositions: number[];
  selectedWords: { [position: number]: string };
  availableWords: string[];
}

export const ConfirmSeedPhraseScreen: React.FC<
  ConfirmSeedPhraseScreenProps
> = ({ seedPhrase, onComplete, onBack, isLoading = false }) => {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmationSteps, setConfirmationSteps] = useState<
    ConfirmationStep[]
  >([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  // Get configurable verification settings
  const seedConfig = getCurrentSeedConfig();

  // Log available presets for developer reference
  useEffect(() => {
    logSeedPresets();
  }, []);

  // Auto-complete if configured to skip
  useEffect(() => {
    if (seedConfig.skipConfirmation) {
      console.log(
        '🚀 Skipping seed verification (configured for fast development)',
      );
      onComplete();
      return;
    }
  }, [seedConfig.skipConfirmation, onComplete]);

  // Generate configurable confirmation steps
  useEffect(() => {
    if (seedConfig.skipConfirmation) return;

    const steps: ConfirmationStep[] = [];
    const totalWords = seedPhrase.length;

    // Generate steps based on configuration
    for (let i = 0; i < seedConfig.totalSteps; i++) {
      const positions: number[] = [];

      // Select random positions for this step
      for (let j = 0; j < seedConfig.wordsPerStep; j++) {
        let randomPos;
        do {
          randomPos = Math.floor(Math.random() * totalWords) + 1; // 1-based indexing
        } while (positions.includes(randomPos));
        positions.push(randomPos);
      }

      steps.push({
        requiredPositions: positions.sort((a, b) => a - b), // Sort for better UX
        selectedWords: {},
        availableWords: generateAvailableWords(positions),
      });
    }

    setConfirmationSteps(steps);
    console.log(
      `🎯 Generated ${seedConfig.totalSteps} verification steps with ${seedConfig.wordsPerStep} words each:`,
      steps.map(step => step.requiredPositions),
    );
  }, [seedPhrase, seedConfig]);

  const generateAvailableWords = (requiredPositions: number[]): string[] => {
    const requiredWords = requiredPositions.map(pos => seedPhrase[pos - 1]);
    // Add some distractor words
    const distractors = ['vacant', 'avoid', 'girl', 'alien', 'cross'];
    const allWords = [...requiredWords, ...distractors];
    return shuffleArray([...new Set(allWords)]); // Remove duplicates and shuffle
  };

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handlePositionPress = (position: number) => {
    const newSteps = [...confirmationSteps];
    const currentStepData = newSteps[currentStep];

    if (currentStepData.selectedWords[position]) {
      // Position is filled - clear it
      delete currentStepData.selectedWords[position];
      setConfirmationSteps(newSteps);
      setSelectedPosition(null);
    } else {
      // Position is empty - select it for word input
      setSelectedPosition(selectedPosition === position ? null : position);
    }
  };

  const handleWordSelect = (word: string) => {
    if (selectedPosition) {
      // Fill the selected position with the word
      const newSteps = [...confirmationSteps];
      newSteps[currentStep].selectedWords[selectedPosition] = word;
      setConfirmationSteps(newSteps);
      setSelectedPosition(null); // Clear selection after filling
    } else {
      // No position selected - find first empty position (fallback behavior)
      const emptyPosition = confirmationSteps[
        currentStep
      ]?.requiredPositions.find(pos => !isPositionFilled(pos));
      if (emptyPosition && !isWordSelected(word)) {
        const newSteps = [...confirmationSteps];
        newSteps[currentStep].selectedWords[emptyPosition] = word;
        setConfirmationSteps(newSteps);
      }
    }
  };

  const isWordSelected = (word: string): boolean => {
    return Object.values(
      confirmationSteps[currentStep]?.selectedWords || {},
    ).includes(word);
  };

  const isPositionFilled = (position: number): boolean => {
    return !!confirmationSteps[currentStep]?.selectedWords[position];
  };

  const isPositionSelected = (position: number): boolean => {
    return selectedPosition === position;
  };

  const isStepComplete = (): boolean => {
    const step = confirmationSteps[currentStep];
    if (!step) return false;

    return step.requiredPositions.every(position => {
      const selectedWord = step.selectedWords[position];
      const correctWord = seedPhrase[position - 1];
      return selectedWord === correctWord;
    });
  };

  const handleNext = () => {
    if (currentStep < confirmationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedPosition(null); // Clear selection when moving to next step
    } else {
      onComplete();
    }
  };

  const currentStepData = confirmationSteps[currentStep];

  if (!currentStepData) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      />
    );
  }

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
          <ProgressBarWithSteps currentStep={4} totalSteps={5} />
        </View>

        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Confirm Seed Phrase
        </Text>

        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {selectedPosition
            ? `Select a word for position ${selectedPosition}`
            : 'Tap a position, then select the word'}
        </Text>

        <View style={styles.positionsContainer}>
          {currentStepData.requiredPositions.map(position => (
            <TouchableOpacity
              key={position}
              style={[
                styles.positionSlot,
                {
                  backgroundColor: isPositionFilled(position)
                    ? colors.interactive.primary
                    : isPositionSelected(position)
                    ? colors.interactive.secondary
                    : colors.background.card,
                  borderColor: isPositionSelected(position)
                    ? colors.interactive.secondary
                    : colors.border.primary,
                  borderWidth: isPositionSelected(position) ? 2 : 1,
                },
              ]}
              onPress={() => handlePositionPress(position)}
            >
              <Text
                style={[
                  styles.positionNumber,
                  {
                    color: isPositionFilled(position)
                      ? colors.text.inverse
                      : colors.text.tertiary,
                  },
                ]}
              >
                {position}.
              </Text>
              {isPositionFilled(position) && (
                <Text
                  style={[styles.positionWord, { color: colors.text.inverse }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentStepData.selectedWords[position]}
                </Text>
              )}
              {isPositionSelected(position) && !isPositionFilled(position) && (
                <Text
                  style={[
                    styles.positionPlaceholder,
                    { color: colors.text.tertiary },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Tap word
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.wordsContainer}>
          {currentStepData.availableWords.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.wordButton,
                {
                  backgroundColor: isWordSelected(word)
                    ? colors.border.secondary
                    : colors.background.card,
                  borderColor: colors.border.primary,
                  opacity: isWordSelected(word) ? 0.5 : 1,
                },
              ]}
              onPress={() => handleWordSelect(word)}
              disabled={isWordSelected(word)}
            >
              <Text
                style={[
                  styles.wordButtonText,
                  {
                    color: isWordSelected(word)
                      ? colors.text.tertiary
                      : colors.text.primary,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                isStepComplete() && !isLoading
                  ? colors.interactive.primary
                  : colors.background.tertiary || '#2a2a2a',
              borderWidth: isStepComplete() && !isLoading ? 0 : 1,
              borderColor:
                isStepComplete() && !isLoading
                  ? 'transparent'
                  : colors.border.primary,
            },
          ]}
          onPress={handleNext}
          disabled={!isStepComplete() || isLoading}
        >
          {isLoading && currentStep === confirmationSteps.length - 1 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.text.inverse} />
              <Text
                style={[
                  styles.nextButtonText,
                  { color: colors.text.inverse, marginLeft: 8 },
                ]}
              >
                Creating Wallet...
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.nextButtonText,
                {
                  color:
                    isStepComplete() && !isLoading
                      ? colors.text.inverse
                      : colors.text.tertiary,
                },
              ]}
            >
              {currentStep < confirmationSteps.length - 1 ? 'Next' : 'Finish'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
