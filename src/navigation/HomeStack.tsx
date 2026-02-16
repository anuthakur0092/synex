import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import TokenDetailScreen from '../screens/tokens/TokenDetailScreen';
import { TokenSelectionScreen } from '../screens/send/TokenSelectionScreen';
import { SendTokenScreen, TransactionSummaryScreen } from '../screens/send';
import { TransactionStatusScreen } from '../screens/transactions/TransactionStatusScreen';
import { Token } from '../utils/types/dashboard.types';
import { useColors } from '../utils/theme';
import Header from '../components/common/Header';
import ReceiveListScreen from '../screens/receive/ReceiveListScreen';
import ReceiveQRCodeScreen from '../screens/receive/ReceiveQRCodeScreen';
import { WalletConnectScanScreen } from '../screens/wallet/WalletConnectScanScreen';

export type HomeStackParamList = {
  HomeMain: { onLogout: () => void };
  TokenSelection: undefined;
  TokenDetail: { token: Token };
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
  WalletConnectScan: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

interface HomeStackProps {
  onLogout: () => void;
}

export const HomeStack: React.FC<HomeStackProps> = ({ onLogout }) => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: ({ route }) => {
          // Only show header for nested screens (not HomeMain)
          if (route.name === 'HomeMain') {
            return null;
          }

          return (
            <Header
              title={route.name}
              onBackPress={() => navigation.goBack()}
              showBackButton={true}
            />
          );
        },
      })}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        initialParams={{ onLogout }}
      />
      <Stack.Screen name="TokenSelection" component={TokenSelectionScreen} />
      <Stack.Screen name="TokenDetail" component={TokenDetailScreen} />
      <Stack.Screen name="SendToken" component={SendTokenScreen} />
      <Stack.Screen
        name="TransactionSummary"
        component={TransactionSummaryScreen}
      />
      <Stack.Screen
        name="TransactionStatus"
        component={TransactionStatusScreen}
      />
      <Stack.Screen name="Receive" component={ReceiveListScreen} />
      <Stack.Screen name="ReceiveQR" component={ReceiveQRCodeScreen} />
      <Stack.Screen
        name="WalletConnectScan"
        component={WalletConnectScanScreen}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Scan Wallet Connect QR"
              onBackPress={() => navigation.goBack()}
              showBackButton={true}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
