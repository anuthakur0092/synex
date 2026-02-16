import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Discover from '../screens/discover';
import { useColors } from '../utils/theme';
import Header from '../components/common/Header';

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  WebView: { url: string; title: string };
  URLs: undefined;
};

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export const DiscoverStack: React.FC = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: ({ route }) => {
          // Only show header for nested screens (not DiscoverMain)
          if (route.name === 'DiscoverMain') {
            return null;
          }

          return (
            <Header
              title={route.name}
              onBackPress={() => navigation?.goBack()}
            />
          );
        },
      })}
    >
      <Stack.Screen name="DiscoverMain" component={Discover} />
    </Stack.Navigator>
  );
};
