import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Transactions from '../screens/transactions';
import { TransactionDetailsScreen } from '../screens/transactions/TransactionDetailsScreen';
import { TransactionStatusScreen } from '../screens/transactions/TransactionStatusScreen';
import { useColors } from '../utils/theme';
import Header from '../components/common/Header';

export type TransactionsStackParamList = {
  TransactionsMain: undefined;
  TransactionDetails: { transactionId: string };
  TransactionStatus: { transactionId: string };
  // Add more transaction-related screens here as needed
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

export const TransactionsStack: React.FC = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: ({ route }) => {
          // Only show header for nested screens (not TransactionsMain)
          if (route.name === 'TransactionsMain') {
            return null;
          }

          return (
            <Header
              title={route.name}
              onBackPress={() => navigation.goBack()}
            />
          );
        },
      })}
    >
      <Stack.Screen name="TransactionsMain" component={Transactions} />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
      />
      <Stack.Screen
        name="TransactionStatus"
        component={TransactionStatusScreen}
      />
    </Stack.Navigator>
  );
};
