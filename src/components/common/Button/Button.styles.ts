import { StyleSheet } from 'react-native';
import { Theme } from '../../../utils/theme';

export const createButtonStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: theme.dimensions.button.height.md,
      ...theme.shadows.button,
    },

    // Button variants
    primary: {
      backgroundColor: theme.colors.interactive.primary,
    },

    secondary: {
      backgroundColor: theme.colors.interactive.secondary,
      borderWidth: theme.dimensions.borderWidth.default,
      borderColor: theme.colors.border.primary,
    },

    accent: {
      backgroundColor: theme.colors.interactive.accent,
    },

    outline: {
      backgroundColor: 'transparent',
      borderWidth: theme.dimensions.borderWidth.default,
      borderColor: theme.colors.interactive.primary,
    },

    ghost: {
      backgroundColor: 'transparent',
    },

    // Button sizes
    small: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: theme.dimensions.button.height.sm,
    },

    large: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: theme.dimensions.button.height.lg,
    },

    // Button states
    disabled: {
      backgroundColor: theme.colors.interactive.primaryDisabled,
      opacity: 0.6,
    },

    pressed: {
      transform: [{ scale: theme.dimensions.animation.buttonScale }],
      ...theme.shadows.buttonPressed,
    },

    // Text styles
    text: {
      ...theme.typography.button.medium,
      color: theme.colors.text.inverse,
    },

    textSecondary: {
      color: theme.colors.text.primary,
    },

    textOutline: {
      color: theme.colors.interactive.primary,
    },

    textGhost: {
      color: theme.colors.interactive.primary,
    },

    textDisabled: {
      color: theme.colors.text.disabled,
    },

    // Size variants for text
    textSmall: {
      ...theme.typography.button.small,
    },

    textLarge: {
      ...theme.typography.button.large,
    },

    // Loading state
    loading: {
      opacity: 0.8,
    },

    loadingText: {
      opacity: 0,
    },

    // Icon styles
    icon: {
      marginRight: theme.spacing.sm,
    },

    iconOnly: {
      marginRight: 0,
      width: theme.dimensions.button.height.md,
      paddingHorizontal: 0,
    },

    iconOnlySmall: {
      width: theme.dimensions.button.height.sm,
    },

    iconOnlyLarge: {
      width: theme.dimensions.button.height.lg,
    },
  });
