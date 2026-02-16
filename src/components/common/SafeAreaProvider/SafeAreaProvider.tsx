import React from 'react';
import { StatusBar, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useColors } from '../../../utils/theme';
import { RequestSheet } from '../../features/walletconnect/RequestSheet/RequestSheet';

interface SafeAreaProviderProps {
  children: React.ReactNode;
  statusBarStyle?: 'light-content' | 'dark-content';
  backgroundColor?: string;
  edges?: Edge[];
  style?: ViewStyle;
  translucent?: boolean;
}

export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({
  children,
  statusBarStyle = 'light-content',
  backgroundColor,
  edges = ['top', 'left', 'right'],
  style,
  translucent = false,
}) => {
  const colors = useColors();
  const background = backgroundColor || colors.background.primary;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: background }, style]}
      edges={edges}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={background}
        translucent={translucent}
      />
      {children}
      <RequestSheet />
    </SafeAreaView>
  );
};
