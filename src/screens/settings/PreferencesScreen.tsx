import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useColors, useTheme } from '../../utils/theme';
import IconArrow from '../../assets/icon/right-arrow.svg';
import IconDarkMode from '../../assets/settings/dark-mode.svg';
import IconPreferences from '../../assets/settings/preferences.svg';

interface RowProps {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

const PreferencesRow: React.FC<RowProps> = ({
  label,
  Icon,
  onPress,
  showArrow = true,
  rightElement,
}) => {
  const colors = useColors();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      style={styles.row}
    >
      <View style={{ ...styles.rowLeft }}>
        <Icon width={22} height={22} color={colors.text.primary} />
        <Text style={[styles.rowLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {rightElement}
        {showArrow ? (
          <IconArrow width={18} height={18} color={colors.text.tertiary} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export const PreferencesScreen: React.FC = () => {
  const colors = useColors();
  const { isDark, setThemeMode } = useTheme();
  const [darkEnabled, setDarkEnabled] = useState<boolean>(isDark);

  const toggleDarkMode = useCallback(
    (value: boolean) => {
      setDarkEnabled(value);
      setThemeMode(value ? 'dark' : 'light');
    },
    [setThemeMode],
  );

  const separator = (
    <View
      style={[styles.separator, { borderBottomColor: colors.border.primary }]}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PreferencesRow
          label="Dark Mode"
          Icon={IconDarkMode}
          showArrow={false}
          rightElement={
            <Switch
              value={darkEnabled}
              onValueChange={toggleDarkMode}
              thumbColor={
                darkEnabled
                  ? colors.interactive.secondary
                  : colors.text.tertiary
              }
              trackColor={{
                false: colors.border.secondary,
                true: colors.interactive.primary,
              }}
              style={{ paddingBottom: 10 }}
            />
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  separator: {
    borderBottomWidth: 1,
    marginHorizontal: 1,
    opacity: 0.7,
  },
});
