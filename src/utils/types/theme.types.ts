/**
 * TypeScript type definitions for the YoexWallet theme system
 */

import { TextStyle, ViewStyle } from 'react-native';

// Color types
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
  card: string;
  modal: string;
  overlay: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
  inverse: string;
  placeholder: string;
}

export interface InteractiveColors {
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  primaryDisabled: string;
  secondary: string;
  secondaryHover: string;
  secondaryPressed: string;
  accent: string;
  accentHover: string;
  accentPressed: string;
}

export interface StatusColors {
  success: string;
  successBackground: string;
  successBorder: string;
  warning: string;
  warningBackground: string;
  warningBorder: string;
  error: string;
  errorBackground: string;
  errorBorder: string;
  info: string;
  infoBackground: string;
  infoBorder: string;
}

export interface WalletColors {
  balance: string;
  positiveChange: string;
  negativeChange: string;
  transaction: string;
  pending: string;
  confirmed: string;
}

export interface ThemeColors {
  background: BackgroundColors;
  text: TextColors;
  interactive: InteractiveColors;
  status: StatusColors;
  wallet: WalletColors;
}

// Main theme interface
export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  dimensions: any;
  typography: any;
  shadows: any;
  spacing: any;
  borderRadius: any;
  iconSize: any;
}

// Theme mode type
export type ThemeMode = 'light' | 'dark' | 'auto';

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// Component prop types
export interface ThemedComponentProps<T = {}> {
  theme?: Theme;
  isDark?: boolean;
}

// Style creator function type
export type StyleCreator<T extends Record<string, any>> = (theme: Theme) => T;
