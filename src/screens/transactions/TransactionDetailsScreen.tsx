import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '../../utils/theme';
import { RouteProp, useRoute } from '@react-navigation/native';

type Params = {
  tx: {
    hash: string;
    from: string;
    to: string;
    amount: string;
    symbol: string;
    status: string;
    gasPriceGwei?: string;
    gasLimit?: string;
    networkFeeEth?: string;
    networkFeeUsd?: string;
  };
};

type RouteProps = RouteProp<
  Record<'TransactionDetails', Params>,
  'TransactionDetails'
>;

export const TransactionDetailsScreen: React.FC = () => {
  const colors = useColors();
  const route = useRoute<RouteProps>();
  const tx = route.params.tx;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Transaction Details
        </Text>
        {Object.entries(tx).map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              {k}
            </Text>
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {String(v)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: { fontSize: 14 },
  value: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
});

export default TransactionDetailsScreen;
