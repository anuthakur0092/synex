/**
 * Color palette for the YoexWallet application
 * Supports both light and dark themes with semantic color naming
 */

// Base color palette
const baseColors = {
  // Primary brand colors - Orange theme
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main primary - Orange
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Secondary colors
  secondary: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },

  // Accent colors - Complementary orange/amber
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Success colors
  success: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532',
  },

  // Warning colors
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error colors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Custom dark theme colors
  yoexDark: {
    primary: '#09080C', // Main dark background (from splash screen)
    secondary: '#0D0B10', // Slightly lighter variant
    tertiary: '#121016', // Even lighter for cards/surfaces
    border: '#1A1720', // Subtle borders
    highlight: '#252030', // Highlighted elements
  },

  // Pure colors
  white: '#FFFFFF',
  black: '#212121',
  transparent: 'rgba(0, 0, 0, 0)',
};

// Light theme colors
export const lightColors = {
  // Background colors
  background: {
    primary: baseColors.white,
    secondary: baseColors.gray[50],
    tertiary: baseColors.gray[100],
    card: baseColors.white,
    modal: baseColors.white,
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Surface colors
  surface: {
    primary: baseColors.white,
    secondary: baseColors.gray[50],
    elevated: baseColors.white,
    disabled: baseColors.gray[100],
  },

  // Text colors
  text: {
    primary: baseColors.gray[900],
    secondary: baseColors.gray[600],
    tertiary: baseColors.gray[500],
    disabled: baseColors.gray[400],
    inverse: baseColors.white,
    placeholder: baseColors.gray[400],
  },

  // Border colors
  border: {
    primary: baseColors.gray[200],
    secondary: baseColors.gray[100],
    focus: baseColors.primary[500],
    error: baseColors.error[500],
    success: baseColors.success[500],
    warning: baseColors.warning[500],
  },

  // Interactive colors
  interactive: {
    primary: baseColors.primary[500],
    primaryHover: baseColors.primary[600],
    primaryPressed: baseColors.primary[700],
    primaryDisabled: baseColors.gray[300],

    secondary: baseColors.gray[200],
    secondaryHover: baseColors.gray[300],
    secondaryPressed: baseColors.gray[400],

    accent: baseColors.accent[500],
    accentHover: baseColors.accent[600],
    accentPressed: baseColors.accent[700],
  },

  // Status colors
  status: {
    success: baseColors.success[500],
    successBackground: baseColors.success[50],
    successBorder: baseColors.success[200],

    warning: baseColors.warning[500],
    warningBackground: baseColors.warning[50],
    warningBorder: baseColors.warning[200],

    error: baseColors.error[500],
    errorBackground: baseColors.error[50],
    errorBorder: baseColors.error[200],

    info: baseColors.primary[500],
    infoBackground: baseColors.primary[50],
    infoBorder: baseColors.primary[200],
  },

  // Wallet specific colors
  wallet: {
    balance: baseColors.primary[600],
    positiveChange: baseColors.success[500],
    negativeChange: baseColors.error[500],
    transaction: baseColors.gray[700],
    pending: baseColors.warning[500],
    confirmed: baseColors.success[500],
  },
};

// Dark theme colors - Updated to use #09080C as primary
export const darkColors = {
  // Background colors
  background: {
    primary: baseColors.yoexDark.primary, // #09080C - Main background
    secondary: baseColors.yoexDark.secondary, // #0D0B10 - Secondary background
    tertiary: baseColors.yoexDark.tertiary, // #121016 - Tertiary background
    card: baseColors.yoexDark.tertiary, // #121016 - Card background
    modal: baseColors.yoexDark.secondary, // #0D0B10 - Modal background
    overlay: 'rgba(9, 8, 12, 0.8)', // Overlay with primary color
  },

  // Surface colors
  surface: {
    primary: baseColors.yoexDark.secondary, // #0D0B10
    secondary: baseColors.yoexDark.tertiary, // #121016
    elevated: baseColors.yoexDark.highlight, // #252030 - Elevated surfaces
    disabled: baseColors.yoexDark.border, // #1A1720
  },

  // Text colors
  text: {
    primary: baseColors.white,
    secondary: baseColors.gray[300],
    tertiary: baseColors.gray[400],
    disabled: baseColors.gray[500],
    inverse: baseColors.yoexDark.primary,
    placeholder: baseColors.gray[500],
  },

  // Border colors
  border: {
    primary: baseColors.yoexDark.border, // #1A1720 - Subtle borders
    secondary: baseColors.yoexDark.secondary, // #0D0B10
    focus: baseColors.primary[400], // Orange focus
    error: baseColors.error[400],
    success: baseColors.success[400],
    warning: baseColors.warning[400],
  },

  // Interactive colors
  interactive: {
    primary: baseColors.primary[400], // Orange primary
    primaryHover: baseColors.primary[300],
    primaryPressed: baseColors.primary[500],
    primaryDisabled: baseColors.gray[600],

    secondary: baseColors.yoexDark.highlight, // #252030
    secondaryHover: baseColors.gray[500],
    secondaryPressed: baseColors.yoexDark.border,

    accent: baseColors.accent[400], // Amber accent
    accentHover: baseColors.accent[300],
    accentPressed: baseColors.accent[500],
  },

  // Status colors
  status: {
    success: baseColors.success[400],
    successBackground: 'rgba(56, 161, 105, 0.1)', // Success with yoex background
    successBorder: baseColors.success[700],

    warning: baseColors.warning[400],
    warningBackground: 'rgba(245, 158, 11, 0.1)', // Warning with yoex background
    warningBorder: baseColors.warning[700],

    error: baseColors.error[400],
    errorBackground: 'rgba(239, 68, 68, 0.1)', // Error with yoex background
    errorBorder: baseColors.error[700],

    info: baseColors.primary[400], // Orange info
    infoBackground: 'rgba(251, 146, 60, 0.1)', // Info with orange background
    infoBorder: baseColors.primary[600],
  },

  // Wallet specific colors
  wallet: {
    balance: baseColors.primary[400], // Orange balance
    positiveChange: baseColors.success[400], // Green positive
    negativeChange: baseColors.error[400],
    transaction: baseColors.gray[200],
    pending: baseColors.warning[400],
    confirmed: baseColors.success[400], // Green confirmed
  },
};

// Export base colors for direct access when needed
export { baseColors };

// Color utility functions
export const colorUtils = {
  /**
   * Add opacity to a color
   * @param color - The base color
   * @param opacity - Opacity value between 0 and 1
   */
  withOpacity: (color: string, opacity: number): string => {
    if (color.startsWith('#')) {
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');
      return `${color}${alpha}`;
    }
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
    }
    return color;
  },

  /**
   * Get shadow color with opacity for the new dark theme
   * @param isDark - Whether it's dark theme
   * @param opacity - Shadow opacity
   */
  getShadowColor: (isDark: boolean, opacity: number = 0.1): string => {
    return isDark
      ? colorUtils.withOpacity('#09080C', opacity) // Use yoex dark color for shadows
      : colorUtils.withOpacity(baseColors.black, opacity);
  },
};
