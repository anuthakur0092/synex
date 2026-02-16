/**
 * Dimension constants for consistent spacing and sizing
 * across the YoexWallet application
 */

import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base spacing unit (4px)
const BASE_UNIT = 4;

export const dimensions = {
  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
    isSmall: screenWidth < 375,
    isMedium: screenWidth >= 375 && screenWidth < 414,
    isLarge: screenWidth >= 414,
  },

  // Spacing scale based on 4px base unit
  spacing: {
    xs: BASE_UNIT, // 4px
    sm: BASE_UNIT * 2, // 8px
    md: BASE_UNIT * 3, // 12px
    lg: BASE_UNIT * 4, // 16px
    xl: BASE_UNIT * 5, // 20px
    xxl: BASE_UNIT * 6, // 24px
    xxxl: BASE_UNIT * 8, // 32px
    xxxxl: BASE_UNIT * 10, // 40px
  },

  // Padding variants
  padding: {
    xs: BASE_UNIT, // 4px
    sm: BASE_UNIT * 2, // 8px
    medium: BASE_UNIT * 4, // 16px
    lg: BASE_UNIT * 5, // 20px
    xl: BASE_UNIT * 6, // 24px
    xxl: BASE_UNIT * 8, // 32px
  },

  // Margin variants
  margin: {
    xs: BASE_UNIT, // 4px
    sm: BASE_UNIT * 2, // 8px
    medium: BASE_UNIT * 4, // 16px
    lg: BASE_UNIT * 5, // 20px
    xl: BASE_UNIT * 6, // 24px
    xxl: BASE_UNIT * 8, // 32px
  },

  // Border radius
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    xxl: 16,
    xxxl: 20,
    full: 9999,
  },

  // Border width
  borderWidth: {
    none: 0,
    thin: 0.5,
    default: 1,
    thick: 2,
    thicker: 3,
  },

  // Icon sizes
  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 40,
    xxxxl: 48,
  },

  // Button dimensions
  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 56,
    },
    minWidth: {
      sm: 64,
      md: 88,
      lg: 120,
      xl: 160,
    },
  },

  // Input dimensions
  input: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    minHeight: 44, // For accessibility
  },

  // Header dimensions
  header: {
    height: Platform.select({
      ios: 88, // Including status bar
      android: 56,
      default: 56,
    }),
    statusBarHeight: Platform.select({
      ios: 44,
      android: 24,
      default: 24,
    }),
  },

  // Tab bar dimensions
  tabBar: {
    height: Platform.select({
      ios: 83, // Including safe area
      android: 60,
      default: 60,
    }),
  },

  // Modal dimensions
  modal: {
    maxWidth: Math.min(screenWidth * 0.9, 400),
    minHeight: 200,
    borderRadius: 12,
  },

  // Card dimensions
  card: {
    minHeight: 80,
    borderRadius: 12,
    elevation: 2,
  },

  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80,
    xxxl: 120,
  },

  // Touch target sizes (for accessibility)
  touchTarget: {
    minSize: 44, // Minimum recommended touch target size
    comfortable: 48,
    large: 56,
  },

  // Layout constants
  layout: {
    containerPadding: BASE_UNIT * 4, // 16px
    sectionSpacing: BASE_UNIT * 6, // 24px
    cardSpacing: BASE_UNIT * 3, // 12px
  },

  // Wallet specific dimensions
  wallet: {
    balanceCard: {
      height: 120,
      borderRadius: 16,
    },
    transactionItem: {
      height: 72,
      padding: 16,
    },
    cryptoIcon: {
      size: 32,
    },
  },

  // Animation values
  animation: {
    buttonScale: 0.95,
    cardElevation: 4,
    modalSlide: screenHeight * 0.3,
  },
};

// Utility functions for responsive design
export const responsive = {
  /**
   * Get responsive spacing based on screen size
   * @param small - Value for small screens
   * @param medium - Value for medium screens (optional)
   * @param large - Value for large screens
   */
  spacing: (small: number, medium?: number, large?: number) => {
    if (dimensions.screen.isSmall) return small;
    if (dimensions.screen.isMedium && medium) return medium;
    return large || small;
  },

  /**
   * Get responsive font size
   * @param base - Base font size
   * @param scale - Scale factor for larger screens
   */
  fontSize: (base: number, scale: number = 1.1) => {
    return dimensions.screen.isLarge ? base * scale : base;
  },

  /**
   * Check if device has small screen
   */
  isSmallScreen: () => dimensions.screen.isSmall,

  /**
   * Get safe padding for different screen sizes
   */
  safePadding: () => responsive.spacing(12, 16, 20),
};

// Export individual dimension categories for easy access
export const spacing = dimensions.spacing;
export const padding = dimensions.padding;
export const margin = dimensions.margin;
export const borderRadius = dimensions.borderRadius;
export const iconSize = dimensions.iconSize;
