import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../../../utils/theme';
import { walletStorage } from '../../../services/storage/walletStorage';
import {
  transactionStorage,
  StoredTransaction,
} from '../../../services/storage/transactionStorage';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PendingTxBanner: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const [pending, setPending] = useState<StoredTransaction | null>(null);
  const insets = useSafeAreaInsets();
  // Keep in sync with TabNavigator tabBarStyle.height (currently 80)
  const TAB_BAR_HEIGHT = 80;
  const EXTRA_MARGIN = 12;

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const load = async () => {
      const id = await walletStorage.getCurrentWalletId();
      if (!id) return setPending(null);
      const list = await transactionStorage.getAll(id);
      const p = list.find(t => t.status === 'pending') || null;
      if (mounted) setPending(p);
    };

    load();
    timer = setInterval(load, 5000);
    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  const content = useMemo(() => {
    if (!pending) return null;
    const bottomOffset = Math.max(
      16,
      TAB_BAR_HEIGHT + insets.bottom + EXTRA_MARGIN,
    );
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.primary,
            bottom: bottomOffset,
          },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          (navigation.getParent() as any)?.navigate('Send', {
            screen: 'TransactionStatus',
            params: {
              tx: {
                hash: pending.hash,
                amount: pending.amount,
                symbol: pending.symbol,
                status: pending.status,
              },
            },
          })
        }
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Transaction Submitted
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Waiting for confirmation…
        </Text>
      </TouchableOpacity>
    );
  }, [pending, colors]);

  if (!pending) return null;
  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    zIndex: 10,
  },
  title: { fontSize: 14, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 4 },
});

export default PendingTxBanner;
