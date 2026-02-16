import React from 'react';
import { View, Text } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { styles } from './ProgressBarWithSteps.styles';

interface ProgressBarWithStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBarWithSteps: React.FC<ProgressBarWithStepsProps> = ({
  currentStep,
  totalSteps,
}) => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.progressText, { color: colors.text.secondary }]}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};
