import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen, PreferencesScreen } from '../screens/settings';
import { SecurityScreen } from '../screens/settings/SecurityScreen';
import { AccountScreen } from '../screens/settings/AccountScreen';
import { useColors } from '../utils/theme';
import { View, Text } from 'react-native';
import Header from '../components/common/Header';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Security: undefined;
  Preferences: undefined;
  Account: undefined;
  ComingSoon: { title: string };
  TransactionStatus?: any;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

// Simple Coming Soon screen component
const ComingSoonScreen: React.FC<{ route: { params: { title: string } } }> = ({
  route,
}) => {
  const colors = useColors();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
      }}
    >
      <Text style={{ fontSize: 18, color: colors.text.primary }}>
        {route.params.title} - Coming Soon!
      </Text>
    </View>
  );
};

interface SettingsStackProps {
  onLogout?: () => void;
}

export const SettingsStack: React.FC<SettingsStackProps> = ({ onLogout }) => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: ({ route }) => {
          // Only show header for nested screens (not SettingsHome)
          if (route.name === 'SettingsHome') {
            return null;
          }

          // Use the title from route params if available, otherwise use route name
          const title = (route.params as any)?.title || route.name;

          return (
            <Header title={title} onBackPress={() => navigation?.goBack()} />
          );
        },
      })}
    >
      <Stack.Screen name="SettingsHome">
        {() => <SettingsScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
    </Stack.Navigator>
  );
};
