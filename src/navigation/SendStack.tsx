import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TokenSelectionScreen } from '../screens/send/TokenSelectionScreen';
import { SendTokenScreen, TransactionSummaryScreen } from '../screens/send';
import { Token } from '../utils/types/dashboard.types';
import TransactionStatusScreen from '../screens/transactions/TransactionStatusScreen';
import Header from '../components/common/Header';

export type SendStackParamList = {
  TokenSelection: undefined;
  SendToken: { token: Token };
  TransactionSummary: {
    token: Token;
    toAddress: string;
    amount: string;
    usdValue: string;
  };
  TransactionStatus: {
    tx: {
      hash: string;
      amount: string;
      symbol: string;
      status?: 'pending' | 'confirmed' | 'failed';
    };
  };
};

const Stack = createNativeStackNavigator<SendStackParamList>();

export const SendStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: ({ route }) => {
          // Show header for all screens including TokenSelection
          const getTitle = (routeName: string) => {
            switch (routeName) {
              case 'TokenSelection':
                return 'Select Token';
              case 'SendToken':
                return 'Send';
              case 'TransactionSummary':
                return 'Transaction Summary';
              case 'TransactionStatus':
                return 'Transaction Status';
              default:
                return routeName;
            }
          };

          return (
            <Header
              title={getTitle(route.name)}
              onBackPress={() => navigation.goBack()}
              showBackButton={true}
            />
          );
        },
      })}
    >
      <Stack.Screen name="TokenSelection" component={TokenSelectionScreen} />
      <Stack.Screen name="SendToken" component={SendTokenScreen} />
      <Stack.Screen
        name="TransactionSummary"
        component={TransactionSummaryScreen}
      />
      <Stack.Screen
        name="TransactionStatus"
        component={TransactionStatusScreen}
      />
    </Stack.Navigator>
  );
};
