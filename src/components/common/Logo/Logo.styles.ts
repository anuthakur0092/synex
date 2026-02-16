import { StyleSheet } from 'react-native';
import { Theme } from '../../../utils/theme';

export const createLogoStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container styles
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Image styles for different sizes
    imageXS: {
      width: theme.iconSize.xxl, // 32px
      height: theme.iconSize.xxl, // 32px
      resizeMode: 'contain',
    },

    imageSM: {
      width: theme.iconSize.xxxl, // 40px
      height: theme.iconSize.xxxl, // 40px
      resizeMode: 'contain',
    },

    imageMD: {
      width: theme.iconSize.xxxxl, // 48px
      height: theme.iconSize.xxxxl, // 48px
      resizeMode: 'contain',
    },

    imageLG: {
      width: 64,
      height: 64,
      resizeMode: 'contain',
    },

    imageXL: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },

    imageXXL: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
    },

    // Text styles when logo text is included
    logoText: {
      ...theme.typography.heading.h3,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.sm,
      fontWeight: '700',
    },

    logoTextSmall: {
      ...theme.typography.label.large,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.xs,
      fontWeight: '600',
    },

    logoTextLarge: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.md,
      fontWeight: '700',
    },

    // Brand specific styling
    brandContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },

    brandContainerVertical: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },

    // Interactive styles for touchable logo
    touchable: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
    },

    touchablePressed: {
      opacity: 0.7,
      transform: [{ scale: 0.95 }],
    },

    // Shadow for elevated logo
    elevated: {
      ...theme.shadows.sm,
    },

    // Background variants
    backgroundLight: {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },

    backgroundPrimary: {
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },

    // Logo with border
    bordered: {
      borderWidth: theme.dimensions.borderWidth.default,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
    },

    // Circular logo container
    circular: {
      borderRadius: 999,
      overflow: 'hidden',
    },

    // Loading state
    loading: {
      opacity: 0.5,
    },

    // Error state placeholder
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.status.errorBackground,
      borderWidth: theme.dimensions.borderWidth.default,
      borderColor: theme.colors.status.errorBorder,
      borderRadius: theme.borderRadius.md,
    },

    errorText: {
      ...theme.typography.caption.small,
      color: theme.colors.status.error,
      textAlign: 'center',
    },

    // Animated styles
    animated: {
      // Base styles for animations - actual animation would be handled by Animated API
    },

    // Responsive adjustments
    responsiveContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      // Will be dynamically adjusted based on screen size
    },
  });
