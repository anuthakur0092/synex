import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { IconSource } from '../../../utils/types/discover.types';
import { useColors } from '../../../utils/theme';
import { styles } from './IconRenderer.styles';

interface IconRendererProps {
  icon: IconSource;
  size?: number;
  style?: ViewStyle;
  fallbackIcon?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  size = 32,
  style,
  fallbackIcon = '🌐',
}) => {
  const colors = useColors();
  const [imageError, setImageError] = useState(false);

  const containerStyle: ViewStyle = [
    styles.container,
    {
      width: size,
      height: size,
      backgroundColor: colors.surface.secondary,
    },
    style,
  ];

  const imageStyle: ImageStyle = [
    styles.image,
    {
      width: size,
      height: size,
    },
  ];

  const textStyle: TextStyle = [
    styles.text,
    {
      fontSize: size * 0.6, // Make emoji/text proportional to container size
      color: colors.text.primary,
    },
  ];

  const handleImageError = () => {
    setImageError(true);
  };

  const renderContent = () => {
    switch (icon.type) {
      case 'local':
        if (imageError) {
          return (
            <Text style={textStyle} numberOfLines={1}>
              {fallbackIcon}
            </Text>
          );
        }
        return (
          <Image
            source={icon.source}
            style={imageStyle}
            onError={handleImageError}
            resizeMode="contain"
          />
        );

      case 'remote':
        if (imageError) {
          return (
            <Text style={textStyle} numberOfLines={1}>
              {fallbackIcon}
            </Text>
          );
        }
        return (
          <Image
            source={{ uri: icon.source }}
            style={imageStyle}
            onError={handleImageError}
            resizeMode="contain"
          />
        );

      case 'emoji':
      default:
        return (
          <Text style={textStyle} numberOfLines={1}>
            {icon.source}
          </Text>
        );
    }
  };

  return <View style={containerStyle}>{renderContent()}</View>;
};
