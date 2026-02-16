/**
 * Main theme export file for YoexWallet
 * Combines colors, typography, dimensions, and shadows into a cohesive theme system
 */

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useColorScheme, View, Animated } from 'react-native';
import { lightColors, darkColors, baseColors, colorUtils } from './colors';
import {
  dimensions,
  spacing,
  padding,
  margin,
  borderRadius,
  iconSize,
  responsive,
} from './dimensions';
import {
  textStyles,
  fontFamilies,
  fontSizes,
  fontWeights,
  commonTextStyles,
  textUtils,
} from './typography';
import {
  lightShadows,
  darkShadows,
  shadowUtils,
  commonShadows,
} from './shadows';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Theme {
  mode: 'light' | 'dark';
  colors: typeof lightColors;
  dimensions: typeof dimensions;
  typography: typeof textStyles;
  shadows: typeof lightShadows;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSize: typeof iconSize;
}

// Create theme objects
export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  dimensions,
  typography: textStyles,
  shadows: lightShadows,
  spacing,
  borderRadius,
  iconSize,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  dimensions,
  typography: textStyles,
  shadows: darkShadows,
  spacing,
  borderRadius,
  iconSize,
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'auto',
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialMode);
  const [overlayColor, setOverlayColor] = useState<string>('transparent');
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  // Determine the actual theme based on mode
  const isDark = useMemo(() => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const runThemeTransition = useCallback(
    (targetMode: ThemeMode) => {
      const resolvedMode =
        targetMode === 'auto'
          ? systemColorScheme === 'dark'
            ? 'dark'
            : 'light'
          : targetMode;
      const target = resolvedMode === 'dark' ? darkColors : lightColors;
      setOverlayColor(target.background.primary);
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setThemeModeState(targetMode);
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    },
    [overlayOpacity, systemColorScheme],
  );

  const toggleTheme = useCallback(() => {
    setThemeModeState(prev => {
      const next =
        prev === 'auto' ? 'light' : prev === 'light' ? 'dark' : 'auto';
      // Use transition for a smooth change
      runThemeTransition(next);
      return prev; // actual state update is handled inside runThemeTransition to keep animation order
    });
  }, [runThemeTransition]);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      runThemeTransition(mode);
    },
    [runThemeTransition],
  );

  const contextValue = useMemo(
    () => ({
      theme,
      isDark,
      themeMode,
      toggleTheme,
      setThemeMode,
    }),
    [theme, isDark, themeMode, toggleTheme, setThemeMode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <View style={{ flex: 1 }}>
        {children}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: overlayOpacity,
            backgroundColor: overlayColor,
          }}
        />
      </View>
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility hooks
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useDimensions = () => {
  const { theme } = useTheme();
  return theme.dimensions;
};

export const useTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

export const useShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
};

export const useIsDark = () => {
  const { isDark } = useTheme();
  return isDark;
};

// Style creation utilities
export const createThemedStyles = <T extends Record<string, any>>(
  styleCreator: (theme: Theme) => T,
) => {
  return (theme: Theme): T => styleCreator(theme);
};

// Export all theme utilities
export {
  // Colors
  lightColors,
  darkColors,
  baseColors,
  colorUtils,

  // Dimensions
  dimensions,
  spacing,
  padding,
  margin,
  borderRadius,
  iconSize,
  responsive,

  // Typography
  textStyles,
  fontFamilies,
  fontSizes,
  fontWeights,
  commonTextStyles,
  textUtils,

  // Shadows
  lightShadows,
  darkShadows,
  shadowUtils,
  commonShadows,
};

// Common styles
export { createCommonBackButtonStyles } from './commonStyles';

// Default theme (light theme)
export default lightTheme;

// Constants for easy access
export const THEME_COLORS = {
  light: lightColors,
  dark: darkColors,
} as const;

export const THEME_MODES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
  AUTO: 'auto' as const,
};

// Theme-aware component props helper
export type ThemedComponentProps<T = {}> = T & {
  theme?: Theme;
  isDark?: boolean;
};

// Style sheet creator with theme
export const createStyles = <T extends Record<string, any>>(
  styleCreator: (theme: Theme) => T,
) => {
  return {
    light: styleCreator(lightTheme),
    dark: styleCreator(darkTheme),
    get: (isDark: boolean) =>
      isDark ? styleCreator(darkTheme) : styleCreator(lightTheme),
  };
};

// Theme validation (for development)
export const validateTheme = (theme: Partial<Theme>): boolean => {
  const requiredKeys = [
    'mode',
    'colors',
    'dimensions',
    'typography',
    'shadows',
  ];
  return requiredKeys.every(key => key in theme);
};
