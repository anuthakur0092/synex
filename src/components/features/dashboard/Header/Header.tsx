import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { HeaderProps } from '../../../../utils/types/dashboard.types';
import WalletConnectIcon from '../../../../assets/dashboard/walletconnect.svg';

export const Header: React.FC<HeaderProps> = ({
  user,
  onProfilePress,
  onNetworkPress,
  onWalletConnectPress,
}) => {
  const colors = useColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Left Section - Profile */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.surface.secondary },
              ]}
            >
              <Text style={[styles.avatar, { color: colors.text.primary }]}>
                {user.profile.avatar}
              </Text>
              {user.profile.hasNotification && (
                <View
                  style={[
                    styles.notificationBadge,
                    { backgroundColor: colors.status.info },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Center Section - Network Selector */}
        <TouchableOpacity
          style={styles.networkSection}
          onPress={() => {
            console.log('Network button pressed!');
            onNetworkPress();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.networkName, { color: colors.text.primary }]}>
            {user.selectedNetwork.name}
          </Text>
          <Text style={[styles.networkIcon, { color: colors.text.secondary }]}>
            ▼
          </Text>
        </TouchableOpacity>

        {/* Right Section - WalletConnect Scan */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={onWalletConnectPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.scanButton}
          >
            <WalletConnectIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#09080C',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    minHeight: 50,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    // Profile button styling
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#09080C',
  },
  networkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  networkName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  networkIcon: {
    fontSize: 10,
    fontWeight: '400',
  },
  rightSection: {
    width: 32, // Same width as avatar for balance
    alignItems: 'flex-end',
  },
  scanButton: {
    padding: 6,
    borderRadius: 16,
  },
});
