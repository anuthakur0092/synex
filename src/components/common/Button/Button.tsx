import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../utils/theme';
import { createButtonStyles } from './Button.styles';

export interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconOnly = false,
  style,
  textStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = createButtonStyles(theme);

  const getButtonStyles = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.button];

    // Add variant styles
    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.secondary);
        break;
      case 'accent':
        baseStyles.push(styles.accent);
        break;
      case 'outline':
        baseStyles.push(styles.outline);
        break;
      case 'ghost':
        baseStyles.push(styles.ghost);
        break;
      default:
        baseStyles.push(styles.primary);
    }

    // Add size styles
    switch (size) {
      case 'small':
        baseStyles.push(styles.small);
        break;
      case 'large':
        baseStyles.push(styles.large);
        break;
    }

    // Add state styles
    if (disabled) {
      baseStyles.push(styles.disabled);
    }

    if (loading) {
      baseStyles.push(styles.loading);
    }

    // Add icon only styles
    if (iconOnly) {
      baseStyles.push(styles.iconOnly);
      if (size === 'small') baseStyles.push(styles.iconOnlySmall);
      if (size === 'large') baseStyles.push(styles.iconOnlyLarge);
    }

    // Add custom styles
    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  const getTextStyles = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [styles.text];

    // Add variant text styles
    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.textSecondary);
        break;
      case 'outline':
        baseStyles.push(styles.textOutline);
        break;
      case 'ghost':
        baseStyles.push(styles.textGhost);
        break;
    }

    // Add size text styles
    switch (size) {
      case 'small':
        baseStyles.push(styles.textSmall);
        break;
      case 'large':
        baseStyles.push(styles.textLarge);
        break;
    }

    // Add state text styles
    if (disabled) {
      baseStyles.push(styles.textDisabled);
    }

    if (loading) {
      baseStyles.push(styles.loadingText);
    }

    // Add custom text styles
    if (textStyle) {
      baseStyles.push(textStyle);
    }

    return baseStyles;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === 'secondary' ||
            variant === 'outline' ||
            variant === 'ghost'
              ? theme.colors.interactive.primary
              : theme.colors.text.inverse
          }
        />
      );
    }

    if (iconOnly && icon) {
      return icon;
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && <View style={styles.icon}>{icon}</View>}
        {title && <Text style={getTextStyles()}>{title}</Text>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={disabled ? 1 : 0.8}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
