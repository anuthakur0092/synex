import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { BalanceDisplayProps } from '../../../../utils/types/dashboard.types';
import { formatTokenAmount } from '../../../../utils/format';
import { Skeleton } from '../../../common/Skeleton/Skeleton';
import { formatPercentageChange } from '../../../../utils/constants/dashboardData';
import UpArrow from '../../../../assets/dashboard/up_arrow.svg';
import DownArrow from '../../../../assets/dashboard/down_arrow.svg';

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  loading,
  priceLoading: priceLoadingProp,
  price: priceProp,
  changePct24h: changeProp,
}) => {
  const colors = useColors();
  const formattedPrimary = formatTokenAmount(balance.primary.amount, 2);

  const effectivePriceLoading = !!priceLoadingProp;
  const effectivePrice = priceProp != null ? priceProp : null;
  const effectiveChange = changeProp != null ? changeProp : null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Primary Balance: show currency symbol first (e.g., $1,234.56) */}
      {loading ? (
        <View style={styles.primarySkeletonRow}>
          <Skeleton style={styles.primarySkeleton} />
        </View>
      ) : (
        <Text style={[styles.primaryBalance, { color: colors.text.primary }]}>
          {balance.primary.symbol}
          {formattedPrimary}
        </Text>
      )}

      {/* Secondary line: show only portfolio change */}
      {loading ? (
        <View style={styles.secondaryRow}>
          <Skeleton style={styles.secondarySkeleton} />
        </View>
      ) : (
        <View style={styles.secondaryRow}>
          {(() => {
            const deltaUsd = Number((balance as any)?.secondary?.amount || '0');
            const isPositive = !!(balance as any)?.change?.isPositive;
            const percentage = Number(
              (balance as any)?.change?.percentage || 0,
            );
            const color = isPositive
              ? colors.wallet.positiveChange
              : colors.wallet.negativeChange;
            const sign = isPositive ? '+' : '-';
            const pctStr = formatPercentageChange({
              percentage: Math.abs(percentage),
              isPositive,
            });
            return (
              <View style={styles.changeRow}>
                {isPositive ? (
                  <UpArrow width={14} height={14} />
                ) : (
                  <DownArrow width={14} height={14} />
                )}
                <Text style={[styles.changeText, { color }]}>
                  {' '}
                  ${Math.abs(deltaUsd).toFixed(2)} ({pctStr})
                </Text>
              </View>
            );
          })()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  primarySkeletonRow: {
    width: '80%',
    height: 40,
    marginBottom: 8,
  },
  primarySkeleton: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  primaryBalance: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  primarySymbol: {
    fontSize: 28,
    fontWeight: '600',
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondarySkeleton: {
    width: 180,
    height: 20,
    borderRadius: 8,
  },
  secondaryBalance: {
    fontSize: 18,
    fontWeight: '500',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
