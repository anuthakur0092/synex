import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../utils/theme';
import { HomeStack } from './HomeStack';
import { DiscoverStack } from './DiscoverStack';
import { TransactionsStack } from './TransactionsStack';
import { SettingsStack } from './SettingsStack';
import Icon1 from '../assets/tab-nav/icon1.svg';
import Icon2 from '../assets/tab-nav/icon2.svg';
import Icon3 from '../assets/tab-nav/icon3.svg';
import Icon4 from '../assets/tab-nav/icon4.svg';
import { PendingTxBanner } from '../components/common/PendingTxBanner';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabNavigatorProps {
  onLogout: () => void;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ onLogout }) => {
  const colors = useColors();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background.card,
            borderTopColor: colors.border.primary,
            borderTopWidth: 1,
            paddingBottom: 20,
            paddingTop: 5,
            height: 80,
            paddingHorizontal: 10,
          },
          tabBarActiveTintColor: colors.interactive.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 6,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <TabIcon Icon={Icon1} color={color} size={size} />
            ),
            headerShown: false,
          }}
        >
          {() => <HomeStack onLogout={onLogout} />}
        </Tab.Screen>
        <Tab.Screen
          name="Discover"
          options={{
            tabBarLabel: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <TabIcon Icon={Icon2} color={color} size={size} />
            ),
            headerShown: false,
          }}
        >
          {() => <DiscoverStack />}
        </Tab.Screen>
        <Tab.Screen
          name="Transaction"
          options={{
            tabBarLabel: 'Transaction',
            tabBarIcon: ({ color, size }) => (
              <TabIcon Icon={Icon3} color={color} size={size} />
            ),
            headerShown: false,
          }}
        >
          {() => <TransactionsStack />}
        </Tab.Screen>
        <Tab.Screen
          name="Settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <TabIcon Icon={Icon4} color={color} size={size} />
            ),
            headerShown: false,
          }}
        >
          {() => <SettingsStack onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      <PendingTxBanner />
    </SafeAreaView>
  );
};

// Tab icon component using SVG with emoji fallback
import { Text } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface TabIconProps {
  Icon?: React.FC<SvgProps>;
  color: string;
  size: number;
  fallbackEmoji?: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  Icon,
  color,
  size,
  fallbackEmoji = '📱',
}) => {
  if (Icon) {
    return <Icon width={size} height={size} color={color} />;
  }
  return <Text style={{ fontSize: size, color }}>{fallbackEmoji}</Text>;
};
