import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../../../utils/theme';
import { createLogoStyles } from './Logo.styles';

// Default logo path
const DEFAULT_LOGO = require('../../../assets/app_new_icon_black.png');

export interface LogoProps {
  // Size variants
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  // Custom dimensions (overrides size)
  width?: number;
  height?: number;

  // Logo source
  source?: ImageSourcePropType;

  // Text content
  showText?: boolean;
  text?: string;
  textPosition?: 'bottom' | 'right' | 'none';

  // Interaction
  onPress?: () => void;
  disabled?: boolean;

  // Styling variants
  variant?:
    | 'default'
    | 'elevated'
    | 'bordered'
    | 'circular'
    | 'background-light'
    | 'background-primary';

  // Custom styles
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;

  // Loading and error states
  loading?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  testID?: string;

  // Responsive behavior
  responsive?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  width,
  height,
  source,
  showText = false,
  text = 'Oxylon',
  textPosition = 'bottom',
  onPress,
  disabled = false,
  variant = 'default',
  style,
  imageStyle,
  textStyle,
  loading = false,
  accessibilityLabel = 'Oxylon Logo',
  testID = 'logo',
  responsive = true,
}) => {
  const { theme } = useTheme();
  const styles = createLogoStyles(theme);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Determine the actual source to use
  const logoSource = source || DEFAULT_LOGO;
  const hasValidSource = logoSource !== null && logoSource !== undefined;

  // Debug logging
  // console.log('Logo source:', logoSource);
  // console.log('Has valid source:', hasValidSource);
  // console.log('Image error:', imageError);
  // console.log('Image loading:', imageLoading);

  // Get image size based on size prop or custom dimensions
  const getImageSize = () => {
    if (width && height) {
      return { width, height };
    }

    switch (size) {
      case 'xs':
        return styles.imageXS;
      case 'sm':
        return styles.imageSM;
      case 'lg':
        return styles.imageLG;
      case 'xl':
        return styles.imageXL;
      case 'xxl':
        return styles.imageXXL;
      default:
        return styles.imageMD;
    }
  };

  // Get text style based on size
  const getTextStyle = () => {
    const baseStyle =
      size === 'xs' || size === 'sm'
        ? styles.logoTextSmall
        : size === 'xl' || size === 'xxl'
        ? styles.logoTextLarge
        : styles.logoText;

    return [baseStyle, textStyle];
  };

  // Get container styles based on variant
  const getContainerStyles = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.container];

    // Add responsive container if enabled
    if (responsive) {
      baseStyles.push(styles.responsiveContainer);
    }

    // Add variant styles
    switch (variant) {
      case 'elevated':
        baseStyles.push(styles.elevated);
        break;
      case 'bordered':
        baseStyles.push(styles.bordered);
        break;
      case 'circular':
        baseStyles.push(styles.circular);
        break;
      case 'background-light':
        baseStyles.push(styles.backgroundLight);
        break;
      case 'background-primary':
        baseStyles.push(styles.backgroundPrimary);
        break;
    }

    // Add loading state
    if (loading || imageLoading) {
      baseStyles.push(styles.loading);
    }

    // Add custom styles
    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  // Get layout direction based on text position
  const getLayoutContainer = () => {
    if (!showText || textPosition === 'none') {
      return styles.container;
    }

    return textPosition === 'right'
      ? styles.brandContainer
      : styles.brandContainerVertical;
  };

  // Handle image load events
  const handleImageLoad = () => {
    console.log('Logo image loaded successfully');
    setImageLoading(false);
  };

  const handleImageError = () => {
    console.log('Logo image failed to load');
    setImageLoading(false);
    setImageError(true);
  };

  // Render error state
  const renderError = () => {
    const errorSize = getImageSize();
    return (
      <View style={[styles.errorContainer, errorSize]}>
        <Text style={styles.errorText}>Logo{'\n'}Error</Text>
      </View>
    );
  };

  // Render loading state
  const renderLoading = () => {
    const loadingSize = getImageSize();
    return (
      <View style={[styles.container, loadingSize]}>
        <ActivityIndicator
          size="small"
          color={theme.colors.interactive.primary}
        />
      </View>
    );
  };

  // Render the logo image
  const renderImage = () => {
    if (loading) {
      return renderLoading();
    }

    if (imageError || !hasValidSource) {
      return renderError();
    }

    const imageSize = getImageSize();

    return (
      <Image
        source={logoSource!}
        style={[imageSize, imageStyle]}
        onLoad={handleImageLoad}
        onError={handleImageError}
        accessibilityLabel={accessibilityLabel}
        testID={`${testID}-image`}
        resizeMode="contain"
      />
    );
  };

  // Render the logo text
  const renderText = () => {
    if (!showText || textPosition === 'none') {
      return null;
    }

    return (
      <Text style={getTextStyle()} testID={`${testID}-text`}>
        {text}
      </Text>
    );
  };

  // Render the complete logo content
  const renderContent = () => {
    const layoutStyle = getLayoutContainer();

    if (textPosition === 'right') {
      return (
        <View style={layoutStyle}>
          {renderImage()}
          {showText && (
            <View style={{ marginLeft: theme.spacing.sm }}>{renderText()}</View>
          )}
        </View>
      );
    }

    return (
      <View style={layoutStyle}>
        {renderImage()}
        {renderText()}
      </View>
    );
  };

  // Render touchable or non-touchable version
  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={getContainerStyles()}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        testID={testID}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={getContainerStyles()}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {renderContent()}
    </View>
  );
};
