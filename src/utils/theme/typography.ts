/**
 * Typography system for the YoexWallet application
 * Defines font families, sizes, weights, and text styles
 */

import { Platform, TextStyle } from 'react-native';
import { responsive } from './dimensions';

// Font families
export const fontFamilies = {
  // Default system fonts
  default: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Specific font weights for better control
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto-Regular',
    default: 'System',
  }),

  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),

  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium', // Android doesn't have semibold, use medium
    default: 'System',
  }),

  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),

  // Monospace for addresses and technical data
  monospace: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

// Font weights
export const fontWeights = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  heavy: '800' as TextStyle['fontWeight'],
};

// Font sizes
export const fontSizes = {
  xs: responsive.fontSize(10),
  sm: responsive.fontSize(12),
  md: responsive.fontSize(14),
  lg: responsive.fontSize(16),
  xl: responsive.fontSize(18),
  xxl: responsive.fontSize(20),
  xxxl: responsive.fontSize(24),
  xxxxl: responsive.fontSize(28),
  xxxxxl: responsive.fontSize(32),
  xxxxxxl: responsive.fontSize(36),
};

// Line heights
export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Letter spacing
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

// Text styles for different use cases
export const textStyles = {
  // Display styles (large headings)
  display: {
    large: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.xxxxxxl,
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xxxxxxl * lineHeights.tight,
      letterSpacing: letterSpacing.tight,
    } as TextStyle,

    medium: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.xxxxxl,
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xxxxxl * lineHeights.tight,
      letterSpacing: letterSpacing.tight,
    } as TextStyle,

    small: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.xxxxl,
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xxxxl * lineHeights.normal,
    } as TextStyle,
  },

  // Heading styles
  heading: {
    h1: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.xxxl,
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xxxl * lineHeights.normal,
    } as TextStyle,

    h2: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xxl * lineHeights.normal,
    } as TextStyle,

    h3: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl * lineHeights.normal,
    } as TextStyle,

    h4: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.lg * lineHeights.normal,
    } as TextStyle,

    h5: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.md * lineHeights.normal,
    } as TextStyle,

    h6: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.sm * lineHeights.normal,
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.wide,
    } as TextStyle,
  },

  // Body text styles
  body: {
    large: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.xl * lineHeights.relaxed,
    } as TextStyle,

    medium: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.lg * lineHeights.relaxed,
    } as TextStyle,

    small: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.md * lineHeights.normal,
    } as TextStyle,
  },

  // Label styles
  label: {
    large: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.lg * lineHeights.normal,
    } as TextStyle,

    medium: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.md * lineHeights.normal,
    } as TextStyle,

    small: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.sm * lineHeights.normal,
    } as TextStyle,
  },

  // Caption styles
  caption: {
    large: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.sm * lineHeights.normal,
    } as TextStyle,

    small: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.xs * lineHeights.normal,
    } as TextStyle,
  },

  // Button text styles
  button: {
    large: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.lg * lineHeights.tight,
    } as TextStyle,

    medium: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.md * lineHeights.tight,
    } as TextStyle,

    small: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.sm * lineHeights.tight,
    } as TextStyle,
  },

  // Wallet specific text styles
  wallet: {
    balance: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.xxxxl,
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xxxxl * lineHeights.tight,
    } as TextStyle,

    currency: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.lg * lineHeights.normal,
    } as TextStyle,

    address: {
      fontFamily: fontFamilies.monospace,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.sm * lineHeights.normal,
      letterSpacing: letterSpacing.wide,
    } as TextStyle,

    hash: {
      fontFamily: fontFamilies.monospace,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.xs * lineHeights.normal,
      letterSpacing: letterSpacing.normal,
    } as TextStyle,

    amount: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.lg * lineHeights.normal,
    } as TextStyle,
  },

  // Input text styles
  input: {
    default: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.lg * lineHeights.normal,
    } as TextStyle,

    placeholder: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.regular,
      lineHeight: fontSizes.lg * lineHeights.normal,
    } as TextStyle,
  },

  // Navigation text styles
  navigation: {
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl * lineHeights.tight,
    } as TextStyle,

    tab: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.sm * lineHeights.normal,
    } as TextStyle,
  },
};

// Utility functions for text styling
export const textUtils = {
  /**
   * Create a custom text style by combining base styles
   * @param baseStyle - Base text style to extend
   * @param overrides - Style properties to override
   */
  createTextStyle: (
    baseStyle: TextStyle,
    overrides: Partial<TextStyle>,
  ): TextStyle => ({
    ...baseStyle,
    ...overrides,
  }),

  /**
   * Get text style with color
   * @param style - Base text style
   * @param color - Text color
   */
  withColor: (style: TextStyle, color: string): TextStyle => ({
    ...style,
    color,
  }),

  /**
   * Get text style with specific weight
   * @param style - Base text style
   * @param weight - Font weight
   */
  withWeight: (
    style: TextStyle,
    weight: TextStyle['fontWeight'],
  ): TextStyle => ({
    ...style,
    fontWeight: weight,
  }),

  /**
   * Get truncated text style
   * @param style - Base text style
   * @param numberOfLines - Number of lines to show
   */
  truncated: (style: TextStyle, numberOfLines: number = 1): TextStyle => ({
    ...style,
    // Note: These properties are used with Text component props, not style
    // numberOfLines and ellipsizeMode are component props
  }),
};

// Export commonly used text styles
export const commonTextStyles = {
  screenTitle: textStyles.heading.h1,
  sectionTitle: textStyles.heading.h3,
  cardTitle: textStyles.label.large,
  bodyText: textStyles.body.medium,
  captionText: textStyles.caption.large,
  buttonText: textStyles.button.medium,
  balanceText: textStyles.wallet.balance,
  addressText: textStyles.wallet.address,
};
