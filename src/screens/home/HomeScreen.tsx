import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { buildTokenFromConfig } from '../../utils/tokenHelpers';
import { Dashboard } from '../../components/features/dashboard/Dashboard';
import { dashboardData } from '../../utils/constants/dashboardData';
import { Token } from '../../utils/types/dashboard.types';
import { walletStorage } from '../../services/storage/walletStorage';
import { useColors } from '../../utils/theme';
import { useWallet } from '../../hooks/useWallet';
import { useBalance } from '../../hooks/useBalance';
import { useNativePrice } from '../../hooks/usePrice';
import { fetchErc20MarketData } from '../../services/api/prices';
import {
  fetchErc20BalancesOnce,
  fetchBalanceOnce,
} from '../../services/api/balance';
import { NetworkSheet } from '../../components/features/dashboard/NetworkSheet/NetworkSheet';
import { WalletAddressSheet } from '../../components/features/dashboard/WalletAddressSheet';
import { reconfigureProvidersForSelectedChain } from '../../services/api/ethProvider';
import {
  ETHEREUM_TOKEN_LIST,
  BSC_TOKEN_LIST,
  POLYGON_TOKEN_LIST,
} from '../../utils/constants/tokenList.eth';
import { TokenConfig } from '../../utils/types/token.types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStack';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { onLogout } = route.params;
  const [consoleLogged, setConsoleLogged] = useState(false);
  const colors = useColors();
  const { address, selectedChainId } = useWallet();
  const isAllNetworks = dashboardData.user.selectedNetwork.chainId === 0;
  const {
    loading: balanceLoading,
    balanceEth,
    error: balanceError,
    refresh: refreshBalance,
  } = useBalance({
    address,
    chainId: isAllNetworks
      ? undefined
      : dashboardData.user.selectedNetwork.chainId,
    subscribe: !isAllNetworks,
  });
  const {
    loading: priceLoading,
    price: nativePrice,
    changePct24h: nativeChange,
    symbol: nativeSymbol,
    refresh: refreshPrice,
  } = useNativePrice({
    chainId: isAllNetworks
      ? undefined
      : dashboardData.user.selectedNetwork.chainId,
  });
  // Native prices for All Networks aggregation
  const npEth = useNativePrice({ chainId: 1 });
  const npBnb = useNativePrice({ chainId: 56 });
  const npMatic = useNativePrice({ chainId: 137 });
  // Ensure per-chain price is always correct by using the explicit chain hooks
  const selectedChainForPrice = dashboardData.user.selectedNetwork.chainId;
  const selectedChainPrice =
    selectedChainForPrice === 1
      ? npEth.price
      : selectedChainForPrice === 56
      ? npBnb.price
      : selectedChainForPrice === 137
      ? npMatic.price
      : nativePrice;
  const selectedChainChange =
    selectedChainForPrice === 1
      ? npEth.changePct24h
      : selectedChainForPrice === 56
      ? npBnb.changePct24h
      : selectedChainForPrice === 137
      ? npMatic.changePct24h
      : nativeChange;
  const [refreshing, setRefreshing] = useState(false);
  const [networkSheetVisible, setNetworkSheetVisible] = useState(false);
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);
  const [userTokens, setUserTokens] = useState<Token[] | null>(null);
  const [tokenMarkets, setTokenMarkets] = useState<
    Record<string, { price: number; changePct24h: number }>
  >({});
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>(
    {},
  );
  const [tokenPricesLoading, setTokenPricesLoading] = useState(false);
  const [nativeBalances, setNativeBalances] = useState<Record<number, string>>(
    {},
  );
  const [portfolioReady, setPortfolioReady] = useState(false);

  // Debug network sheet visibility
  useEffect(() => {
    console.log('Network sheet visible:', networkSheetVisible);
  }, [networkSheetVisible]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([refreshBalance(), refreshPrice()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance, refreshPrice]);

  // Log wallet and metadata on landing (one-time), without blocking UI
  useEffect(() => {
    (async () => {
      if (consoleLogged) return;
      try {
        console.log('Dashboard: logging wallet details...');
        const currentId = await walletStorage.getCurrentWalletId();
        if (!currentId) {
          console.log('Dashboard: No current wallet found');
          setConsoleLogged(true);
          return;
        }
        // Avoid decryption on dashboard to keep UI responsive; only log metadata
        const metadata = await walletStorage.getWalletMetadata(currentId);
        console.log('Dashboard: Current wallet ID', currentId);
        console.log('Dashboard: Wallet metadata', metadata);
      } catch (e) {
        console.log('Dashboard: Failed to load wallet for console log', e);
      } finally {
        setConsoleLogged(true);
      }
    })();
  }, [consoleLogged]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will show the onboarding flow again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout, style: 'destructive' },
      ],
    );
  };

  const handleActionPress = (action: string) => {
    console.log('Action pressed:', action);
    switch (action) {
      case 'navigate_to_send':
        // Navigate to Send flow
        navigation.navigate('Send' as any);
        break;
      case 'navigate_to_receive':
        (navigation as any).navigate('Receive');
        break;
      case 'navigate_to_buy':
        console.log('Navigate to Buy screen');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleTokenPress = (token: Token) => {
    console.log('Token pressed:', token.name);
    (navigation as any).navigate('TokenDetail', { token });
  };

  const handleProfilePress = () => {
    setAddressSheetVisible(true);
  };

  const handleNetworkPress = () => {
    setNetworkSheetVisible(true);
  };

  const handleAddTokensPress = () => {
    console.log('Add tokens pressed');
    // Navigate to Import Tokens screen at root stack
    (navigation as any).navigate('ImportTokens');
  };

  const handleWalletConnectPress = () => {
    (navigation as any).navigate('WalletConnectScan');
  };

  // Add error handling for dashboard data
  if (!dashboardData) {
    console.error('HomeScreen: dashboardData is undefined');
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.text.primary }]}>
          Failed to load dashboard data
        </Text>
      </View>
    );
  }

  // Build tokens to display: always include native coin balance symbol for current chain
  const chainId = dashboardData.user.selectedNetwork.chainId;

  const liveData = useMemo(() => {
    if (!dashboardData) return dashboardData;
    const displayAmount = balanceEth ?? '0';
    const cloned = { ...dashboardData };
    cloned.wallet = { ...dashboardData.wallet };
    cloned.wallet.balance = { ...dashboardData.wallet.balance };
    const selectedChainId = dashboardData.user.selectedNetwork.chainId;
    const selectedSymbol = dashboardData.user.selectedNetwork.symbol;
    // If All Networks selected (chainId 0), show BNB as default per requirement
    const symbolForDisplay =
      selectedChainId === 0 ? 'BNB' : selectedSymbol || nativeSymbol || 'ETH';

    cloned.wallet.balance.primary = {
      ...dashboardData.wallet.balance.primary,
      amount: displayAmount,
      symbol: symbolForDisplay,
    };

    // Merge tokens (always show main ETH row using current network price for now)
    /* No USE since we already have on TOP */
    /* WILL SHOW YOEX TOKEN HERE IF CHAIN IS BNB */
    /*
    const yoexToken: Token = {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: '🔷',
      logoSource: require('../../assets/tokens/ethereum.png'),
      balance: { amount: displayAmount ?? '0', symbol: 'ETH', decimals: 18 },
      value: {
        amount: ethPrice != null ? ethPrice.toFixed(2) : '0',
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
    */

    const selection = (userTokens ?? null)?.map(t => {
      const key = t.contractAddress.toLowerCase();
      const mkt = tokenMarkets[key];
      const bal = tokenBalances[key];
      if (!mkt) return t;
      const priceNum = Number(mkt.price);
      const decimals = Number.isFinite(priceNum) && priceNum < 0.001 ? 6 : 2;
      return {
        ...t,
        value: {
          amount: Number.isFinite(priceNum) ? priceNum.toFixed(decimals) : '0',
          currency: 'USD',
          symbol: '$',
        },
        change: {
          percentage: Math.abs(mkt.changePct24h),
          isPositive: mkt.changePct24h >= 0,
          timeframe: '24h',
        },
        balance: bal ? { ...t.balance, amount: bal } : t.balance,
      } as Token;
    });
    const listFromSelection =
      selection && selection.length > 0 ? selection : [];

    // Build native token row(s) and compute portfolio totals in USD
    const nativeRows: Token[] = [];
    const pushNativeRow = (
      cId: number,
      name: string,
      symbol: string,
      amount: string,
      price: number | null,
      change: number | null,
      logo: any,
    ) => {
      nativeRows.push({
        id: `native-${cId}`,
        name,
        symbol,
        icon: '◉',
        logoSource: logo,
        balance: { amount: amount ?? '0', symbol, decimals: 18 },
        value: {
          amount: price != null ? price.toFixed(5) : '0',
          currency: 'USD',
          symbol: '$',
        },
        change: {
          percentage: Math.abs(change ?? 0),
          isPositive: (change ?? 0) >= 0,
          timeframe: '24h',
        },
        isPrimary: true,
        contractAddress: '0x0000000000000000000000000000000000000000',
        chain: cId === 56 ? 'bsc' : cId === 137 ? 'polygon' : 'ethereum',
        chainId: cId,
      });
    };

    if (selectedChainId === 0) {
      // All networks: show native rows for ETH, BNB, MATIC if balances known
      pushNativeRow(
        1,
        'Ethereum',
        'ETH',
        (nativeBalances as any)[1] || '0',
        npEth.price,
        npEth.changePct24h,
        require('../../assets/tokens/ethereum.png'),
      );
      pushNativeRow(
        56,
        'BNB Smart Chain',
        'BNB',
        (nativeBalances as any)[56] || '0',
        npBnb.price,
        npBnb.changePct24h,
        require('../../assets/tokens/binance.png'),
      );
      pushNativeRow(
        137,
        'Polygon',
        'MATIC',
        (nativeBalances as any)[137] || '0',
        npMatic.price,
        npMatic.changePct24h,
        require('../../assets/tokens/polygon.png'),
      );
    } else {
      // Selected chain only
      const meta =
        selectedChainId === 56
          ? {
              name: 'BNB Smart Chain',
              symbol: 'BNB',
              logo: require('../../assets/tokens/binance.png'),
            }
          : selectedChainId === 137
          ? {
              name: 'Polygon',
              symbol: 'MATIC',
              logo: require('../../assets/tokens/polygon.png'),
            }
          : {
              name: 'Ethereum',
              symbol: 'ETH',
              logo: require('../../assets/tokens/ethereum.png'),
            };
      pushNativeRow(
        selectedChainId,
        meta.name,
        meta.symbol,
        balanceLoading ? '0.0000' : displayAmount ?? '0',
        selectedChainPrice,
        selectedChainChange,
        meta.logo,
      );
    }

    const combined = [...nativeRows, ...listFromSelection];
    cloned.tokens = combined;

    const totalUsd = combined.reduce((acc, t) => {
      const bal = Number(t.balance?.amount || '0');
      const price = Number(t.value?.amount || '0');
      return acc + (isFinite(bal) && isFinite(price) ? bal * price : 0);
    }, 0);
    const totalChangeUsd = combined.reduce((acc, t) => {
      const bal = Number(t.balance?.amount || '0');
      const price = Number(t.value?.amount || '0');
      const pct = Number(t.change?.percentage || 0);
      return (
        acc +
        (isFinite(bal) && isFinite(price) && isFinite(pct)
          ? bal * price * (pct / 100)
          : 0)
      );
    }, 0);
    const totalChangePct = totalUsd > 0 ? (totalChangeUsd / totalUsd) * 100 : 0;

    // Overwrite header to show portfolio USD like Trust Wallet only when data ready
    // Rely solely on explicit `portfolioReady` to avoid any brief calculations
    if (!portfolioReady) {
      // Show loading skeleton state
      cloned.wallet.balance.primary = {
        amount: '0',
        symbol: '$',
        decimals: 2,
      } as any;
      cloned.wallet.balance.secondary = {
        amount: '0',
        currency: 'USD',
        symbol: '$',
      } as any;
      cloned.wallet.balance.change = {
        percentage: 0,
        isPositive: true,
        timeframe: '24h',
      } as any;
    } else {
      cloned.wallet.balance.primary = {
        amount: totalUsd.toFixed(5),
        symbol: '$',
        decimals: 2,
      } as any;
      cloned.wallet.balance.secondary = {
        amount: Math.abs(totalChangeUsd).toFixed(5),
        currency: 'USD',
        symbol: '$',
      } as any;
      cloned.wallet.balance.change = {
        percentage: Math.abs(totalChangePct),
        isPositive: totalChangeUsd >= 0,
        timeframe: '24h',
      } as any;
    }

    return cloned;
  }, [
    balanceEth,
    balanceLoading,
    userTokens,
    tokenMarkets,
    tokenBalances,
    nativeBalances,
    nativePrice,
    nativeChange,
    npEth.price,
    npBnb.price,
    npMatic.price,
    npEth.changePct24h,
    npBnb.changePct24h,
    npMatic.changePct24h,
    selectedChainPrice,
    portfolioReady,
  ]);

  // Load user-selected tokens on focus and when wallet address becomes available
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          setPortfolioReady(false);
          // Load selections ACROSS all supported chains
          const chainIds = chainId === 0 ? [1, 56, 137] : [chainId];
          console.log('Dashboard: effective chainIds', chainIds);
          const addressesByChain = await Promise.all(
            chainIds.map(c => walletStorage.getPreferredTokenAddresses(c)),
          );
          console.log('Dashboard: addressesByChain', addressesByChain);
          const customByChain = await Promise.all(
            chainIds.map(c => walletStorage.getCustomTokens(c)),
          );
          console.log(
            'Dashboard: customByChain sizes',
            customByChain.map(c => Object.keys(c || {}).length),
          );
          const chainToList: Record<number, TokenConfig[]> = {
            1: ETHEREUM_TOKEN_LIST.tokens,
            56: BSC_TOKEN_LIST.tokens,
            137: POLYGON_TOKEN_LIST.tokens,
          };
          const configIndex: Record<string, TokenConfig> = {};
          for (const c of chainIds) {
            for (const t of chainToList[c] || []) {
              configIndex[`${c}:${t.address.toLowerCase()}`] = t;
            }
          }
          // Exclude native ETH from the selection (we already add it separately)
          const erc20ByChain: { chainId: number; addrs: string[] }[] = [];
          addressesByChain.forEach((arr, idx) => {
            const c = chainIds[idx];
            const filtered = (arr || []).filter(
              a => a !== '0x0000000000000000000000000000000000000000',
            );
            if (filtered.length)
              erc20ByChain.push({ chainId: c, addrs: filtered });
          });

          const tokens: Token[] = [];
          erc20ByChain.forEach(({ chainId: c, addrs }, chainIdx) => {
            const custom = customByChain[chainIdx] || {};
            for (const addr of addrs) {
              const cfg =
                configIndex[`${c}:${addr.toLowerCase()}`] ||
                (custom as any)[addr];
              if (cfg) tokens.push(buildTokenFromConfig(cfg as TokenConfig));
            }
          });
          console.log(
            'Dashboard: built tokens',
            tokens.map(t => ({ sym: t.symbol, chainId: t.chainId })),
          );

          // Fetch market data for these tokens
          const flatAddresses: string[] = erc20ByChain.flatMap(x => x.addrs);
          console.log('Dashboard: ERC-20 addresses flat', flatAddresses);
          if (flatAddresses.length > 0) {
            setTokenPricesLoading(true);
            try {
              // Build requests in parallel
              const marketPromise = Promise.all(
                erc20ByChain.map(({ chainId: c, addrs }) =>
                  fetchErc20MarketData(c, addrs).catch(() => ({})),
                ),
              ).then(parts => Object.assign({}, ...parts));
              // Resolve missing logos for custom tokens via network metadata
              // and persist in custom tokens storage to avoid flicker next time
              try {
                const { resolveTokenLogo } = await import(
                  '../../services/api/market'
                );
                const enriched = await Promise.all(
                  (tokens || []).map(async t => {
                    if (!t.logoURI) {
                      try {
                        const url = await resolveTokenLogo(
                          t.chainId || 1,
                          t.contractAddress,
                        );
                        if (url) {
                          (t as any).logoURI = url;
                          try {
                            await walletStorage.saveCustomToken(
                              t.chainId || 1,
                              {
                                chainId: t.chainId || 1,
                                address: t.contractAddress,
                                name: t.name,
                                symbol: t.symbol,
                                decimals: t.balance.decimals,
                                logoURI: url,
                              },
                            );
                          } catch {}
                        }
                      } catch {}
                    }
                    return t;
                  }),
                );
                if (mounted) setUserTokens(enriched);
              } catch {}

              const balancesPromise = (async () => {
                if (!address) return {} as Record<string, string>;
                // Group token specs by their chainId
                const byChain: Record<
                  number,
                  { address: string; decimals: number }[]
                > = {};
                for (const t of tokens) {
                  const c: number =
                    typeof t.chainId === 'number'
                      ? t.chainId
                      : typeof selectedChainId === 'number' &&
                        selectedChainId > 0
                      ? selectedChainId
                      : 1;
                  if (!byChain[c]) byChain[c] = [];
                  byChain[c].push({
                    address: t.contractAddress,
                    decimals: t.balance.decimals,
                  });
                }
                const chainIdsToFetch = Object.keys(byChain).map(k =>
                  Number(k),
                );
                const parts = await Promise.all(
                  chainIdsToFetch.map(async c => {
                    try {
                      const res = await fetchErc20BalancesOnce(
                        address,
                        byChain[c],
                        { chainId: c },
                      );
                      return res;
                    } catch {
                      return {} as Record<string, string>;
                    }
                  }),
                );
                return Object.assign({}, ...parts);
              })();

              const [market, mergedBalances] = await Promise.all([
                marketPromise,
                balancesPromise,
              ]);

              if (mounted) {
                setTokenMarkets(market);
                setTokenBalances(mergedBalances);
              }
            } catch (_e) {
              if (mounted) {
                setTokenMarkets({});
                setTokenBalances({});
              }
            } finally {
              if (mounted) {
                setTokenPricesLoading(false);
                setPortfolioReady(true);
              }
            }
          } else if (mounted) {
            setTokenMarkets({});
            setTokenBalances({});
            setTokenPricesLoading(false);
            setPortfolioReady(true);
          }
        } catch (_e) {
          if (mounted) setUserTokens([]);
          if (mounted) setTokenMarkets({});
          if (mounted) setTokenBalances({});
          if (mounted) setTokenPricesLoading(false);
          if (mounted) setPortfolioReady(true);
        }
      })();
      // Fetch native balances across chains for All Networks portfolio
      (async () => {
        try {
          if (!address) return;
          const [b1, b56, b137] = await Promise.all([
            fetchBalanceOnce(address, { chainId: 1 }).catch(() => '0'),
            fetchBalanceOnce(address, { chainId: 56 }).catch(() => '0'),
            fetchBalanceOnce(address, { chainId: 137 }).catch(() => '0'),
          ]);
          if (mounted) setNativeBalances({ 1: b1, 56: b56, 137: b137 });
        } catch {}
      })();
      return () => {
        mounted = false;
      };
    }, [chainId, address]),
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <Dashboard
        data={liveData}
        balanceLoading={balanceLoading || priceLoading || !portfolioReady}
        tokenPricesLoading={tokenPricesLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onActionPress={handleActionPress}
        onTokenPress={handleTokenPress}
        onProfilePress={handleProfilePress}
        onNetworkPress={() => setNetworkSheetVisible(true)}
        onWalletConnectPress={handleWalletConnectPress}
        onAddTokensPress={handleAddTokensPress}
        onLogout={handleLogout}
        priceLoading={priceLoading}
        ethPrice={nativePrice}
        ethChange={nativeChange}
      />
      <WalletAddressSheet
        visible={addressSheetVisible}
        address={address || dashboardData.wallet.address}
        onClose={() => setAddressSheetVisible(false)}
      />
      <NetworkSheet
        visible={networkSheetVisible}
        onClose={() => setNetworkSheetVisible(false)}
        selectedChainId={dashboardData.user.selectedNetwork.chainId}
        onSelect={async chain => {
          try {
            // If the same network is selected, do nothing (avoid clearing tokens)
            if (chain.chainId === dashboardData.user.selectedNetwork.chainId) {
              setNetworkSheetVisible(false);
              return;
            }
            // Enter loading state immediately to prevent stale values flashing
            setPortfolioReady(false);
            setTokenPricesLoading(true);
            setUserTokens([]);
            setTokenMarkets({});
            setTokenBalances({});
            await walletStorage.setSelectedChainId(chain.chainId);
            // Reset providers first to avoid race with old network
            await reconfigureProvidersForSelectedChain();
            // Update selected network in dashboard data model (in-memory)
            (dashboardData as any).user.selectedNetwork.chainId = chain.chainId;
            (dashboardData as any).user.selectedNetwork.name = chain.name;
            (dashboardData as any).user.selectedNetwork.symbol = chain.symbol;
            // Refresh prices/balances for the new chain immediately
            await Promise.all([refreshBalance(), refreshPrice()]);
          } finally {
            setNetworkSheetVisible(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
