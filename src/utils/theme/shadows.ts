/**
 * Shadow styles for the YoexWallet application
 * Provides consistent shadows across iOS and Android platforms
 */

import { Platform, ViewStyle } from 'react-native';
import { colorUtils } from './colors';

// Shadow configuration type
interface ShadowConfig {
  elevation: number; // Android elevation
  shadowColor: string; // iOS shadow color
  shadowOffset: { width: number; height: number }; // iOS shadow offset
  shadowOpacity: number; // iOS shadow opacity
  shadowRadius: number; // iOS shadow blur radius
}

// Create platform-specific shadow styles
const createShadow = (
  config: ShadowConfig,
  isDark: boolean = false,
): ViewStyle => {
  const shadowColor = isDark
    ? colorUtils.getShadowColor(true, 0.3)
    : colorUtils.getShadowColor(false, 0.15);

  if (Platform.OS === 'android') {
    return {
      elevation: config.elevation,
    };
  }

  return {
    shadowColor: shadowColor,
    shadowOffset: config.shadowOffset,
    shadowOpacity: config.shadowOpacity,
    shadowRadius: config.shadowRadius,
  };
};

// Shadow presets
const shadowConfigs = {
  none: {
    elevation: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },

  xs: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },

  sm: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  md: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  lg: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  xl: {
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  xxl: {
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
};

// Light theme shadows
export const lightShadows = {
  none: createShadow(shadowConfigs.none, false),
  xs: createShadow(shadowConfigs.xs, false),
  sm: createShadow(shadowConfigs.sm, false),
  md: createShadow(shadowConfigs.md, false),
  lg: createShadow(shadowConfigs.lg, false),
  xl: createShadow(shadowConfigs.xl, false),
  xxl: createShadow(shadowConfigs.xxl, false),

  // Component-specific shadows
  card: createShadow(shadowConfigs.sm, false),
  button: createShadow(shadowConfigs.xs, false),
  buttonPressed: createShadow(shadowConfigs.md, false),
  modal: createShadow(shadowConfigs.xl, false),
  dropdown: createShadow(shadowConfigs.lg, false),
  tooltip: createShadow(shadowConfigs.md, false),
  fab: createShadow(shadowConfigs.lg, false),

  // Wallet-specific shadows
  balanceCard: createShadow(shadowConfigs.md, false),
  transactionCard: createShadow(shadowConfigs.sm, false),
  walletCard: createShadow(shadowConfigs.md, false),
};

// Dark theme shadows (more pronounced)
export const darkShadows = {
  none: createShadow(shadowConfigs.none, true),
  xs: createShadow({ ...shadowConfigs.xs, shadowOpacity: 0.1 }, true),
  sm: createShadow({ ...shadowConfigs.sm, shadowOpacity: 0.2 }, true),
  md: createShadow({ ...shadowConfigs.md, shadowOpacity: 0.3 }, true),
  lg: createShadow({ ...shadowConfigs.lg, shadowOpacity: 0.4 }, true),
  xl: createShadow({ ...shadowConfigs.xl, shadowOpacity: 0.5 }, true),
  xxl: createShadow({ ...shadowConfigs.xxl, shadowOpacity: 0.6 }, true),

  // Component-specific shadows
  card: createShadow({ ...shadowConfigs.sm, shadowOpacity: 0.2 }, true),
  button: createShadow({ ...shadowConfigs.xs, shadowOpacity: 0.1 }, true),
  buttonPressed: createShadow(
    { ...shadowConfigs.md, shadowOpacity: 0.3 },
    true,
  ),
  modal: createShadow({ ...shadowConfigs.xl, shadowOpacity: 0.5 }, true),
  dropdown: createShadow({ ...shadowConfigs.lg, shadowOpacity: 0.4 }, true),
  tooltip: createShadow({ ...shadowConfigs.md, shadowOpacity: 0.3 }, true),
  fab: createShadow({ ...shadowConfigs.lg, shadowOpacity: 0.4 }, true),

  // Wallet-specific shadows
  balanceCard: createShadow({ ...shadowConfigs.md, shadowOpacity: 0.3 }, true),
  transactionCard: createShadow(
    { ...shadowConfigs.sm, shadowOpacity: 0.2 },
    true,
  ),
  walletCard: createShadow({ ...shadowConfigs.md, shadowOpacity: 0.3 }, true),
};

// Shadow utility functions
export const shadowUtils = {
  /**
   * Create a custom shadow with specific parameters
   * @param elevation - Android elevation
   * @param radius - iOS shadow radius
   * @param opacity - Shadow opacity
   * @param offset - Shadow offset (iOS)
   * @param isDark - Whether it's for dark theme
   */
  createCustomShadow: (
    elevation: number,
    radius: number,
    opacity: number,
    offset: { width: number; height: number } = {
      width: 0,
      height: radius / 2,
    },
    isDark: boolean = false,
  ): ViewStyle => {
    return createShadow(
      {
        elevation,
        shadowColor: '#000000',
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
      },
      isDark,
    );
  },

  /**
   * Get inner shadow effect (requires additional styling)
   * @param size - Shadow size
   * @param isDark - Whether it's for dark theme
   */
  getInnerShadow: (size: number = 2, isDark: boolean = false): ViewStyle => {
    // Note: React Native doesn't support inner shadows natively
    // This would need to be implemented with gradients or other techniques
    return {
      // Placeholder for inner shadow implementation
    };
  },

  /**
   * Combine multiple shadow styles
   * @param shadows - Array of shadow styles to combine
   */
  combineShadows: (...shadows: ViewStyle[]): ViewStyle => {
    // React Native doesn't support multiple shadows directly
    // Return the last shadow as the primary one
    return shadows[shadows.length - 1] || {};
  },

  /**
   * Get shadow style based on theme
   * @param shadowName - Name of the shadow preset
   * @param isDark - Whether it's dark theme
   */
  getThemeShadow: (
    shadowName: keyof typeof lightShadows,
    isDark: boolean,
  ): ViewStyle => {
    return isDark ? darkShadows[shadowName] : lightShadows[shadowName];
  },
};

// Export commonly used shadows
export const commonShadows = {
  card: lightShadows.card,
  cardDark: darkShadows.card,
  button: lightShadows.button,
  buttonDark: darkShadows.button,
  modal: lightShadows.modal,
  modalDark: darkShadows.modal,
};

// Animation-friendly shadow values
export const animatedShadows = {
  // For animated components, pre-define shadow states
  resting: lightShadows.sm,
  hover: lightShadows.md,
  pressed: lightShadows.lg,

  // Dark theme variants
  restingDark: darkShadows.sm,
  hoverDark: darkShadows.md,
  pressedDark: darkShadows.lg,
};
