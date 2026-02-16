import React from 'react';
import { View, Text } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { styles } from './ProgressIndicator.styles';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const colors = useColors();

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {/* Background line */}
        <View
          style={[
            styles.progressLine,
            {
              backgroundColor: colors.border.secondary,
            },
          ]}
        />

        {/* Progress fill line */}
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.interactive.primary,
              width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
            },
          ]}
        />

        {/* Progress dots */}
        {Array.from({ length: totalSteps }, (_, index) => {
          const dotPosition =
            totalSteps === 1 ? 50 : (index / (totalSteps - 1)) * 100;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep - 1;

          return (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  left: `${dotPosition}%`,
                  backgroundColor:
                    isCompleted || isCurrent
                      ? colors.interactive.primary
                      : colors.border.secondary,
                },
              ]}
            />
          );
        })}
      </View>

      <Text style={[styles.progressText, { color: colors.text.secondary }]}>
        {currentStep}/{totalSteps}
      </Text>
    </View>
  );
};
