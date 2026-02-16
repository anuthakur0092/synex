import React from 'react';
import { SafeAreaView, ViewStyle } from 'react-native';
import { useColors } from '../../../utils/theme';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  backgroundColor?: string;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  backgroundColor,
}) => {
  const colors = useColors();

  const defaultBackgroundColor = backgroundColor || colors.background.primary;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: defaultBackgroundColor }, style]}
    >
      {children}
    </SafeAreaView>
  );
};
