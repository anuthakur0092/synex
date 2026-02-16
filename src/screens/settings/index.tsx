import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useColors } from '../../utils/theme';
import { LogoutConfirmationBottomSheet } from '../../components/common/LogoutConfirmationBottomSheet';
import { openExternalLink } from '../../utils/externalLinks';

// Dummy icons (placeholders). The user will replace these later.
import IconArrow from '../../assets/icon/right-arrow.svg';
import IconAccount from '../../assets/settings/account.svg';
import IconPreferences from '../../assets/settings/preferences.svg';
import IconSecurity from '../../assets/settings/security.svg';
import IconHelpCenter from '../../assets/settings/help-center.svg';
import IconSupport from '../../assets/settings/support.svg';
import IconAbout from '../../assets/settings/about.svg';
import IconTwitter from '../../assets/settings/twitter.svg';
import IconTelegram from '../../assets/settings/telegram.svg';
import IconInstagram from '../../assets/settings/instagram.svg';
import IconYoutube from '../../assets/settings/youtube.svg';
import IconLogout from '../../assets/settings/logout.svg';

interface RowProps {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

const SettingsRow: React.FC<RowProps> = ({
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

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/types';

interface SettingsScreenProps {
  onLogout?: () => void;
}

export { PreferencesScreen } from './PreferencesScreen';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const colors = useColors();
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const handleLogoutPress = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setShowLogoutModal(false);
    onLogout?.();
  }, [onLogout]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  const separator = useMemo(
    () => (
      <View
        style={[styles.separator, { borderBottomColor: colors.border.primary }]}
      />
    ),
    [colors.border.primary],
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
        <SettingsRow
          label="Account"
          Icon={IconAccount}
          onPress={() => navigation.navigate('Account')}
        />

        {separator}

        <SettingsRow
          label="Preferences"
          Icon={IconPreferences}
          onPress={() => navigation.navigate('Preferences')}
        />
        <SettingsRow
          label="Security"
          Icon={IconSecurity}
          onPress={() => navigation.navigate('Security')}
        />

        {separator}

        <SettingsRow
          label="Help Center"
          Icon={IconHelpCenter}
          onPress={() => openExternalLink('helpCenter')}
        />
        <SettingsRow
          label="Support"
          Icon={IconSupport}
          onPress={() => openExternalLink('support')}
        />
        <SettingsRow
          label="About"
          Icon={IconAbout}
          onPress={() => openExternalLink('about')}
        />

        {separator}

        <SettingsRow
          label="Twitter"
          Icon={IconTwitter}
          onPress={() => openExternalLink('twitter')}
        />
        <SettingsRow
          label="Telegram"
          Icon={IconTelegram}
          onPress={() => openExternalLink('telegram')}
        />
        <SettingsRow
          label="Instagram"
          Icon={IconInstagram}
          onPress={() => openExternalLink('instagram')}
        />
        <SettingsRow
          label="Youtube"
          Icon={IconYoutube}
          onPress={() => openExternalLink('youtube')}
        />

        <SettingsRow
          label="Log out"
          Icon={IconLogout}
          onPress={handleLogoutPress}
        />
      </ScrollView>

      <LogoutConfirmationBottomSheet
        visible={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
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
    // spacing handled by label marginLeft
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    // spacing handled by arrow/icon widths
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
  subItem: {
    marginLeft: 24,
    marginRight: 12,
  },
});
