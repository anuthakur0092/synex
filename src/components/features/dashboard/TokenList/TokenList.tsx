import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Skeleton } from '../../../common/Skeleton/Skeleton';
import { useColors } from '../../../../utils/theme';
import { TokenListProps, Token } from '../../../../utils/types/dashboard.types';
import { supportedChains } from '../../../../utils/config/chains';
import {
  formatBalance,
  formatCurrency,
  formatPercentageChange,
} from '../../../../utils/constants/dashboardData';

// Single token item component
interface TokenItemProps {
  token: Token;
  onPress: (token: Token) => void;
  loadingPrices?: boolean;
}

const BaseTokenItem: React.FC<TokenItemProps> = ({
  token,
  onPress,
  loadingPrices,
}) => {
  const colors = useColors();
  const [logoError, setLogoError] = React.useState(false);
  const holdingsValue = React.useMemo(() => {
    const amount = parseFloat(token.balance?.amount || '0');
    const price = parseFloat(token.value?.amount || '0');
    const total =
      Number.isFinite(amount) && Number.isFinite(price) ? amount * price : 0;
    // Reuse existing currency formatter
    return formatCurrency({ amount: total.toFixed(2), symbol: '$' });
  }, [token.balance?.amount, token.value?.amount]);

  const priceDisplay = React.useMemo(() => {
    const amount = token.value?.amount ?? '0';
    const sym = token.value?.symbol || '$';
    return `${sym}${amount}`;
  }, [token.value?.amount, token.value?.symbol]);

  const displayBalance = React.useMemo(() => {
    const raw = token.balance?.amount ?? '0';
    const n = Number(raw);
    if (!Number.isFinite(n)) return raw;
    try {
      // Cap to 6 decimals for user tokens; preserve fewer when appropriate
      const decimalsCap = 6;
      const decimals = Math.min(
        Math.max(token.balance?.decimals ?? decimalsCap, 0),
        decimalsCap,
      );
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).format(n);
    } catch (_e) {
      return raw;
    }
  }, [token.balance?.amount, token.balance?.decimals]);

  return (
    <TouchableOpacity
      style={[styles.tokenItem, { backgroundColor: colors.background.primary }]}
      onPress={() => onPress(token)}
      activeOpacity={0.7}
    >
      {/* Left side: logo and, to its right, name/chain (top) with price/% (bottom) */}
      <View style={styles.leftCol}>
        <View style={styles.leftRow}>
          <View style={styles.logoWrapper}>
            {token.logoSource ? (
              <Image source={token.logoSource} style={styles.tokenLogo} />
            ) : token.logoURI && !logoError ? (
              <Image
                source={{ uri: token.logoURI }}
                style={styles.tokenLogo}
                onError={() => setLogoError(true)}
              />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              <Image
                source={require('../../../../assets/tokens/ERC20.png')}
                style={styles.tokenLogo}
              />
            )}
            {(() => {
              const chain = supportedChains.find(
                c => c.chainId === token.chainId,
              );
              if (!chain?.icon) return null;
              return <Image source={chain.icon} style={styles.chainBadge} />;
            })()}
          </View>
          <View style={styles.namePriceCol}>
            <View style={styles.nameAndChain}>
              <Text
                style={[styles.tokenSymbol, { color: colors.text.primary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {token.symbol || token.name}
              </Text>
              {(() => {
                const chain = supportedChains.find(
                  c => c.chainId === token.chainId,
                );
                const label =
                  chain?.id === 'bsc'
                    ? 'BNB Smart Chain'
                    : chain?.name || token.chain || '';
                return (
                  <View
                    style={[
                      styles.chainChip,
                      {
                        backgroundColor: colors.surface.primary,
                        borderColor: colors.border.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chainChipText,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                );
              })()}
            </View>
            <View style={styles.leftBottomRow}>
              <Text
                style={[styles.priceText, { color: colors.text.secondary }]}
                numberOfLines={1}
              >
                {priceDisplay}
              </Text>
              <Text
                style={[
                  styles.percentText,
                  {
                    color: token.change.isPositive
                      ? colors.wallet.positiveChange
                      : colors.wallet.negativeChange,
                  },
                ]}
                numberOfLines={1}
              >
                {formatPercentageChange(token.change)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right side: (Top: My balance) (Bottom: Holdings fiat + % change) */}
      <View style={styles.rightCol}>
        <View style={styles.rightTopRow}>
          <Text style={[styles.balanceText, { color: colors.text.primary }]}>
            {displayBalance}
          </Text>
        </View>
        <View style={styles.rightBottomRow}>
          <Text
            style={[styles.holdingsText, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {holdingsValue}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const TokenItem = React.memo(BaseTokenItem);

// Main TokenList component (for backward compatibility)
export const TokenList: React.FC<
  TokenListProps & { loadingPrices?: boolean }
> = ({ tokens, onTokenPress, loadingPrices }) => {
  const colors = useColors();

  const renderToken = ({ item }: { item: Token }) => (
    <TokenItem
      token={item}
      onPress={onTokenPress}
      loadingPrices={loadingPrices}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <FlatList
        data={tokens}
        renderItem={renderToken}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  leftCol: {
    flexDirection: 'column',
    flex: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  namePriceCol: {
    flexDirection: 'column',
    flex: 1,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chainBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    backgroundColor: '#000',
  },
  nameAndChain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  chainChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  iconText: {
    fontSize: 18,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  leftBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    columnGap: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightTopRow: {
    marginTop: 0,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '800',
  },
  rightBottomRow: {
    marginTop: 4,
    alignItems: 'flex-end',
    flexDirection: 'row',
    columnGap: 8,
  },
  holdingsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  walletChangeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
