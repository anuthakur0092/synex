import { StyleSheet } from 'react-native';
import { Theme } from '../../../utils/theme';

export const createHeaderStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.dimensions.spacing.lg,
      paddingVertical: theme.dimensions.spacing.md,
    },
    backButton: {
      position: 'absolute',
      left: theme.dimensions.spacing.md,
      zIndex: 1,
    },
    backButtonContainer: {
      width: theme.dimensions.iconSize.xxxl,
      height: theme.dimensions.iconSize.xxxl,
      borderRadius: theme.dimensions.borderRadius.full,
      backgroundColor: theme.colors.surface.elevated,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.background.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    backIcon: {
      width: theme.dimensions.iconSize.lg,
      height: theme.dimensions.iconSize.lg,
      tintColor: theme.colors.text.primary,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.dimensions.spacing.xxl,
    },
    title: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.caption.large,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.dimensions.spacing.xs,
    },
    rightContainer: {
      position: 'absolute',
      right: theme.dimensions.spacing.md,
      zIndex: 1,
    },
  });
