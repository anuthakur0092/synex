import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColors } from '../../utils/theme';
import { Token } from '../../utils/types/dashboard.types';
import { SendStackParamList } from '../../navigation/SendStack';
import { walletStorage } from '../../services/storage/walletStorage';
import {
  ETHEREUM_TOKEN_LIST,
  BSC_TOKEN_LIST,
  POLYGON_TOKEN_LIST,
} from '../../utils/constants/tokenList.eth';

import { buildTokenFromConfig } from '../../utils/tokenHelpers';
import {
  fetchErc20BalancesOnce,
  fetchBalanceOnce,
} from '../../services/api/balance';
import { useBalance } from '../../hooks/useBalance';
import { usePrice, useNativePrice } from '../../hooks/usePrice';
import { fetchNativeMarketData } from '../../services/api/prices';
import { useWallet } from '../../hooks/useWallet';
import { fetchErc20MarketData } from '../../services/api/prices';
import { supportedChains } from '../../utils/config/chains';

type NavigationProp = NativeStackNavigationProp<
  SendStackParamList,
  'TokenSelection'
>;

export const TokenSelectionScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation<NavigationProp>();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();
  // Ensure ETH balance is fetched from Ethereum mainnet, not the globally selected network
  const { balanceEth, loading: balanceLoading } = useBalance({
    address,
    chainId: 1,
  });
  const { ethPrice, ethChange, priceLoading } = usePrice();
  const { price: bnbPrice } = useNativePrice({ chainId: 56 });
  const { price: maticPrice } = useNativePrice({ chainId: 137 });

  const loadTokens = useCallback(async () => {
    try {
      setLoading(true);
      // We show tokens from all supported networks
      const chainIds = [1, 56, 137];

      // Get current wallet address
      const currentWalletId = await walletStorage.getCurrentWalletId();
      if (!currentWalletId) {
        console.log('No current wallet');
        setLoading(false);
        return;
      }

      const metadata = await walletStorage.getWalletMetadata(currentWalletId);
      if (!metadata || !metadata.address) {
        console.log('No wallet metadata or address found');
        setLoading(false);
        return;
      }

      // Resolve native prices with fallback to direct API if hooks aren't ready
      let ethPriceVal = ethPrice;
      let bnbPriceVal = bnbPrice;
      let maticPriceVal = maticPrice;
      try {
        if (ethPriceVal == null)
          ethPriceVal = (await fetchNativeMarketData(1)).price;
      } catch {}
      try {
        if (bnbPriceVal == null)
          bnbPriceVal = (await fetchNativeMarketData(56)).price;
      } catch {}
      try {
        if (maticPriceVal == null)
          maticPriceVal = (await fetchNativeMarketData(137)).price;
      } catch {}

      // Create native tokens (ETH, BNB, MATIC)
      const ethBalance = balanceEth ?? '0';
      const ethToken: Token = {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: '🔷',
        logoSource: require('../../assets/tokens/ethereum.png'),
        balance: { amount: ethBalance, symbol: 'ETH', decimals: 18 },
        value: {
          amount: ethPriceVal != null ? ethPriceVal.toFixed(2) : '0',
          currency: 'USD',
          symbol: '$',
        },
        change: {
          percentage: Math.abs(ethChange ?? 0),
          isPositive: (ethChange ?? 0) >= 0,
          timeframe: '24h',
        },
        isPrimary: true,
        contractAddress: '0x0000000000000000000000000000000000000000',
        chain: 'ethereum',
        chainId: 1,
      };

      // Native BNB (balance currently not tracked via useBalance hook; default 0 until native per-chain is added)
      const bnbNativeBalance = metadata.address
        ? await fetchBalanceOnce(metadata.address, { chainId: 56 }).catch(
            () => '0',
          )
        : '0';
      const bnbToken: Token = {
        id: 'bnb',
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        icon: '🟡',
        logoSource: require('../../assets/tokens/binance.png'),
        balance: { amount: bnbNativeBalance, symbol: 'BNB', decimals: 18 },
        value: {
          amount: bnbPriceVal != null ? bnbPriceVal.toFixed(2) : '0',
          currency: 'USD',
          symbol: '$',
        },
        change: { percentage: 0, isPositive: true, timeframe: '24h' },
        isPrimary: true,
        contractAddress: '0x0000000000000000000000000000000000000000',
        chain: 'bsc',
        chainId: 56,
      };

      // Native MATIC (Polygon)
      const maticNativeBalance = metadata.address
        ? await fetchBalanceOnce(metadata.address, { chainId: 137 }).catch(
            () => '0',
          )
        : '0';
      const maticToken: Token = {
        id: 'matic',
        name: 'Polygon',
        symbol: 'POL',
        icon: '🟣',
        logoSource: require('../../assets/tokens/polygon.png'),
        balance: { amount: maticNativeBalance, symbol: 'MATIC', decimals: 18 },
        value: {
          amount: maticPriceVal != null ? maticPriceVal.toFixed(2) : '0',
          currency: 'USD',
          symbol: '$',
        },
        change: { percentage: 0, isPositive: true, timeframe: '24h' },
        isPrimary: true,
        contractAddress: '0x0000000000000000000000000000000000000000',
        chain: 'polygon',
        chainId: 137,
      };

      // Get user's selected tokens
      const addressesByChain = await Promise.all(
        chainIds.map(c => walletStorage.getPreferredTokenAddresses(c)),
      );
      const customByChain = await Promise.all(
        chainIds.map(c => walletStorage.getCustomTokens(c)),
      );
      const chainToList: Record<number, any[]> = {
        1: ETHEREUM_TOKEN_LIST.tokens,
        56: BSC_TOKEN_LIST.tokens,
        137: POLYGON_TOKEN_LIST.tokens,
      };
      const configIndex: Record<string, any> = {};
      for (const c of chainIds) {
        for (const t of chainToList[c] || []) {
          configIndex[`${c}:${t.address.toLowerCase()}`] = t;
        }
      }
      const erc20ByChain: { chainId: number; addrs: string[] }[] = [];
      addressesByChain.forEach((arr, idx) => {
        const c = chainIds[idx];
        const filtered = (arr || []).filter(
          a => a !== '0x0000000000000000000000000000000000000000',
        );
        if (filtered.length) erc20ByChain.push({ chainId: c, addrs: filtered });
      });

      // Fetch balances for ERC-20s (per chain to use correct RPCs)
      let erc20Balances: Record<string, string> = {};
      try {
        if (metadata.address) {
          const perChain = await Promise.all(
            erc20ByChain.map(async ({ chainId: c, addrs }, idx) => {
              const custom = customByChain[idx] || {};
              const specsForChain = addrs
                .map(
                  a =>
                    configIndex[`${c}:${a.toLowerCase()}`] ||
                    (custom as any)[a],
                )
                .filter(Boolean)
                .map(cfg => ({ address: cfg.address, decimals: cfg.decimals }));
              if (specsForChain.length === 0)
                return {} as Record<string, string>;
              return await fetchErc20BalancesOnce(
                metadata.address,
                specsForChain,
                { chainId: c },
              ).catch(() => ({}));
            }),
          );
          erc20Balances = Object.assign({}, ...perChain);
        }
      } catch (_e) {
        erc20Balances = {};
      }

      const userTokens: Token[] = [];
      erc20ByChain.forEach(({ chainId: c, addrs }, idx) => {
        const custom = customByChain[idx] || {};
        for (const addr of addrs) {
          const cfg =
            configIndex[`${c}:${addr.toLowerCase()}`] || (custom as any)[addr];
          if (cfg) {
            const token = buildTokenFromConfig(cfg);
            const bal = erc20Balances[addr.toLowerCase()];
            if (bal != null) {
              token.balance = { ...token.balance, amount: bal };
            }
            userTokens.push(token);
          }
        }
      });

      // Fetch ERC-20 market prices and populate token value/change
      try {
        if (userTokens.length > 0) {
          const marketParts = await Promise.all(
            erc20ByChain.map(({ chainId: c, addrs }) =>
              fetchErc20MarketData(c, addrs).catch(() => ({})),
            ),
          );
          const market = Object.assign({}, ...marketParts);
          for (const t of userTokens) {
            const entry = market[t.contractAddress.toLowerCase()];
            if (entry) {
              const priceNum = Number(entry.price);
              const decimals =
                Number.isFinite(priceNum) && priceNum < 0.01 ? 6 : 2;
              t.value = {
                amount: Number.isFinite(priceNum)
                  ? priceNum.toFixed(decimals)
                  : '0',
                currency: 'USD',
                symbol: '$',
              };
              const ch = Number(entry.changePct24h || 0);
              t.change = {
                percentage: Math.abs(ch),
                isPositive: ch >= 0,
                timeframe: '24h',
              };
            }
          }
        }
      } catch (_e) {}

      // Only show tokens that can be sent (balance > 0)
      const positive = [ethToken, bnbToken, maticToken, ...userTokens].filter(
        t => {
          const amt = parseFloat(t.balance?.amount || '0');
          return Number.isFinite(amt) && amt > 0;
        },
      );
      setTokens(positive);
    } catch (error) {
      console.error('Error loading tokens:', error);
      // Set empty tokens array on error
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [balanceEth, ethPrice, ethChange, bnbPrice, maticPrice]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const handleTokenPress = (token: Token) => {
    navigation.navigate('SendToken', { token });
  };

  const renderToken = ({ item }: { item: Token }) => {
    const totalUsdValue =
      parseFloat(item.balance.amount) * parseFloat(item.value.amount);

    return (
      <TouchableOpacity
        style={[
          styles.tokenItem,
          { borderBottomColor: colors.border.secondary },
        ]}
        onPress={() => handleTokenPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.tokenLeft}>
          {/* Token Icon */}
          <View style={styles.iconWrapper}>
            {item.logoSource ? (
              <Image source={item.logoSource} style={styles.tokenIcon} />
            ) : item.logoURI ? (
              <Image source={{ uri: item.logoURI }} style={styles.tokenIcon} />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              <Image
                source={require('../../assets/tokens/ERC20.png')}
                style={styles.tokenIcon}
              />
            )}
            {(() => {
              const chain = supportedChains.find(
                c => c.chainId === item.chainId,
              );
              if (!chain?.icon) return null;
              return <Image source={chain.icon} style={styles.chainBadge} />;
            })()}
          </View>

          <View style={styles.tokenInfo}>
            <View style={styles.tokenNameRow}>
              <Text
                style={[styles.tokenSymbol, { color: colors.text.primary }]}
              >
                {item.symbol}
              </Text>
              <View
                style={[
                  styles.chainChip,
                  { backgroundColor: colors.background.tertiary },
                ]}
              >
                <Text
                  style={[styles.chainText, { color: colors.text.secondary }]}
                >
                  {(() => {
                    const chain = supportedChains.find(
                      c => c.chainId === item.chainId,
                    );
                    if (chain?.id === 'bsc') return 'BNB Smart Chain';
                    return chain?.name || item.chain || 'ethereum';
                  })()}
                </Text>
              </View>
            </View>
            <Text style={[styles.tokenName, { color: colors.text.secondary }]}>
              {item.name}
            </Text>
          </View>
        </View>

        <View style={styles.tokenRight}>
          <Text style={[styles.tokenBalance, { color: colors.text.primary }]}>
            {parseFloat(item.balance.amount).toFixed(4)} {item.symbol}
          </Text>
          <Text style={[styles.tokenValue, { color: colors.text.secondary }]}>
            ${totalUsdValue.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Token List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.interactive.primary} />
        </View>
      ) : tokens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            No wallet found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
            Please create or import a wallet first
          </Text>
        </View>
      ) : (
        <FlatList
          data={tokens}
          renderItem={renderToken}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  tokenEmoji: {
    fontSize: 32,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
  },
  tokenInfo: {
    marginLeft: 12,
    flex: 1,
  },
  tokenNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  chainChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  chainText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tokenName: {
    fontSize: 14,
    marginTop: 2,
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  tokenValue: {
    fontSize: 14,
    marginTop: 2,
  },
});
