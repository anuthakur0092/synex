import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../utils/theme';
import { createHeaderStyles } from './Header.styles';
import LeftBackIcon from '../../../assets/icon/left-back.svg';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  elevation?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  rightComponent,
  transparent = false,
  elevation = true,
}) => {
  const { theme, isDark } = useTheme();
  const styles = createHeaderStyles(theme);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      // Fallback: try to go back using navigation if available
      console.log('Back button pressed but no onBackPress handler provided');
    }
  };

  return (
    <View
      style={[
        styles.container,
        transparent && { backgroundColor: 'transparent', borderBottomWidth: 0 },
        elevation &&
          !transparent && {
            shadowColor: theme.colors.background.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
      ]}
    >
      <View style={styles.header}>
        {/* Back Button */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.6}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <View style={styles.backButtonContainer}>
              <LeftBackIcon
                width={styles.backIcon.width}
                height={styles.backIcon.height}
                color={styles.backIcon.tintColor}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Title Container */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Component */}
        {rightComponent && (
          <View style={styles.rightContainer}>{rightComponent}</View>
        )}
      </View>
    </View>
  );
};

export default Header;
