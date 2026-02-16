import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStack';
import { styles } from './TokenDetailScreen.styles';
import { useColors } from '../../utils/theme';
import useTokenDetails from '../../hooks/useTokenDetails';
import { Button } from '../../components/common/Button';
import SendIcon from '../../assets/dashboard/send.svg';
import ReceiveIcon from '../../assets/dashboard/receive.svg';
import { LineGraph, type GraphPoint } from 'react-native-graph';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useWallet } from '../../hooks/useWallet';
import { formatUnits } from '@ethersproject/units';
import ShieldIcon from '../../assets/transactions/shield.svg';
import TxSendIcon from '../../assets/dashboard/send.svg';
import TxReceiveIcon from '../../assets/dashboard/receive.svg';
import { getUiPricePrecision } from '../../utils/config';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';

type Props = NativeStackScreenProps<HomeStackParamList, 'TokenDetail'>;

const TokenDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { token } = route.params;
  const colors = useColors();
  const { address } = useWallet();
  const precision = getUiPricePrecision();
  console.log('precision', precision);
  const {
    summary,
    chart,
    timeframe,
    setTimeframe,
    balance,
    loading,
    transactions,
  } = useTokenDetails(token);

  // Determine native asset (no contract address / zero address / primary flag)
  const isZeroAddress =
    !token.contractAddress ||
    token.contractAddress.toLowerCase() ===
      '0x0000000000000000000000000000000000000000';
  const isNative = !!token.isPrimary || isZeroAddress;

  const usdFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    [],
  );

  // Match dashboard balance formatting: cap to 6 fractional digits
  const displayBalance = useMemo(() => {
    const raw = balance ?? '0';
    const n = Number(raw);
    if (!Number.isFinite(n)) return raw || '0';
    const decimalsCap = 6;
    const decimals = Math.min(
      Math.max(token.balance.decimals ?? decimalsCap, 0),
      decimalsCap,
    );
    try {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).format(n);
    } catch (_e) {
      return raw;
    }
  }, [balance, token.balance.decimals]);

  // Compute my holding's USD worth for the right-side label
  // IMPORTANT: Match dashboard exactly -> use token.value.amount as price source
  const myWorthUsd = useMemo(() => {
    // Prefer dashboard-provided token price, fallback to summary price
    const priceFromToken = parseFloat(token.value?.amount || '0');
    const price = Number.isFinite(priceFromToken)
      ? priceFromToken
      : summary?.price ?? null;
    if (price == null) return null;

    // Prefer freshly fetched balance from hook, fallback to token.balance.amount
    const amtRaw = balance ?? token.balance?.amount ?? '0';
    const amt = Number(amtRaw);
    if (!Number.isFinite(amt)) return null;
    const total = amt * price;
    return Number.isFinite(total) ? total : null;
  }, [token.value?.amount, summary?.price, balance, token.balance?.amount]);

  const graphPoints: GraphPoint[] = useMemo(() => {
    if (!Array.isArray(chart) || chart.length === 0) return [];
    const sorted = [...chart].sort((a, b) => a.timestamp - b.timestamp);
    const firstTs = sorted[0].timestamp;
    const lastTs = sorted[sorted.length - 1].timestamp;

    // Choose bin count per timeframe for even sampling
    const binsByTf: Record<typeof timeframe, number> = {
      '1D': 60,
      '1W': 90,
      '1M': 100,
      '1Y': 110,
      ALL: 120,
    } as const;
    const binCount = Math.min(binsByTf[timeframe], Math.max(20, sorted.length));
    const binSize = (lastTs - firstTs) / binCount;

    const bins: { ts: number; values: number[] }[] = Array.from(
      { length: binCount },
      (_x, i) => ({ ts: Math.round(firstTs + i * binSize), values: [] }),
    );
    for (const p of sorted) {
      const idx = Math.min(
        binCount - 1,
        Math.max(0, Math.floor((p.timestamp - firstTs) / (binSize || 1))),
      );
      bins[idx].values.push(p.value);
    }
    // Average within bins; forward-fill empties
    const averaged: { timestamp: number; value: number }[] = [];
    let lastVal = sorted[0].value;
    for (const b of bins) {
      const v = b.values.length
        ? b.values.reduce((a, c) => a + c, 0) / b.values.length
        : lastVal;
      averaged.push({ timestamp: b.ts, value: v });
      lastVal = v;
    }

    // Determine if token is stable-like -> stronger smoothing and clamping
    const symbol = (token.symbol || '').toUpperCase();
    const stableList = ['USDC', 'USDT', 'DAI', 'TUSD', 'BUSD'];
    const isStableLike =
      stableList.includes(symbol) || Math.abs(summary?.changePct24h || 0) < 0.5;

    // Exponential moving average smoothing
    const alpha = isStableLike ? 0.25 : 0.5; // stronger smoothing for stable
    const smoothed: { timestamp: number; value: number }[] = [];
    let ema = averaged[0].value;
    for (const p of averaged) {
      ema = alpha * p.value + (1 - alpha) * ema;
      smoothed.push({ timestamp: p.timestamp, value: ema });
    }

    // Optional band clamp for stable to avoid exaggerated spikes
    const base =
      summary?.price || smoothed[Math.floor(smoothed.length / 2)].value;
    const bandPctMap: Record<typeof timeframe, number> = {
      '1D': 0.01,
      '1W': 0.02,
      '1M': 0.03,
      '1Y': 0.06,
      ALL: 0.1,
    } as const;
    const bandPct = isStableLike ? bandPctMap[timeframe] : 0;
    const minB = base * (1 - bandPct);
    const maxB = base * (1 + bandPct);
    const clamped = smoothed.map(p => ({
      timestamp: p.timestamp,
      value: bandPct > 0 ? Math.min(maxB, Math.max(minB, p.value)) : p.value,
    }));

    // Visual compression for stable-like tokens: flatten deviations around base
    const visualScaleMap: Record<typeof timeframe, number> = {
      '1D': 0.15,
      '1W': 0.12,
      '1M': 0.1,
      '1Y': 0.08,
      ALL: 0.06,
    } as const;
    const visualScale = isStableLike ? visualScaleMap[timeframe] : 1;

    const processed = clamped
      .map(p => ({
        value: base + (p.value - base) * visualScale,
        date: new Date(p.timestamp),
      }))
      .filter(p => Number.isFinite(p.value) && !isNaN(p.date.getTime()));

    // Fallback: if something went wrong, use a straightforward downsample of raw points
    if (processed.length < 2) {
      const rawTarget = Math.min(120, sorted.length);
      const rawStep = Math.max(1, Math.floor(sorted.length / rawTarget));
      const raw = [] as GraphPoint[];
      for (let i = 0; i < sorted.length; i += rawStep) {
        const pt = sorted[i];
        if (Number.isFinite(pt.value)) {
          raw.push({ value: pt.value, date: new Date(pt.timestamp) });
        }
      }
      return raw;
    }

    return processed;
  }, [chart, timeframe, token.symbol, summary?.changePct24h, summary?.price]);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'Holdings' | 'History' | 'About'>(
    'Holdings',
  );

  // Log Covalent transactions when History tab is opened
  useEffect(() => {
    if (activeTab === 'History') {
      try {
        console.log('[TokenDetail][Covalent] params', {
          chainId: token.chainId,
          owner: address,
          contract: token.contractAddress,
        });
        console.log('[TokenDetail][Covalent] transactions', transactions);
      } catch {}
    }
  }, [activeTab, transactions, token.chainId, token.contractAddress, address]);

  const shorten = (addr: string) =>
    addr && addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : addr;

  const formatTokenAmount = (raw: string) => {
    try {
      const num = Number(formatUnits(raw || '0', token.balance.decimals));
      const maxDigits = Math.min(
        token.balance.decimals,
        (precision.smallValueMaxDigits || 8) as number,
      );
      return num.toLocaleString(undefined, {
        maximumFractionDigits: Math.max(0, maxDigits),
      });
    } catch {
      return raw;
    }
  };

  const formatUsd = (val?: number | null) => {
    if (val == null || !isFinite(val)) return '--';
    const small = precision.smallValueThreshold || 0.01;
    const maxSmall = precision.smallValueMaxDigits || 8;
    const maxLarge = precision.largeValueMaxDigits || 2;
    const opts = {
      minimumFractionDigits: 0,
      maximumFractionDigits: val < small ? maxSmall : maxLarge,
    } as const;
    return `$${val.toLocaleString(undefined, opts)}`;
  };

  const txExplorerBase = (cid?: number) => {
    switch (cid) {
      case 56:
        return 'https://bscscan.com/tx/';
      case 137:
        return 'https://polygonscan.com/tx/';
      case 1:
      default:
        return 'https://etherscan.io/tx/';
    }
  };

  const displayTransactions = useMemo(() => {
    const isZeroRaw = (val: string): boolean => {
      try {
        const s = String(val ?? '0')
          .trim()
          .toLowerCase();
        if (!s) return true;
        if (s.startsWith('0x')) return BigInt(s) === 0n;
        return BigInt(s) === 0n;
      } catch {
        return String(val ?? '0') === '0';
      }
    };
    return (transactions || []).filter(tx => !isZeroRaw(tx.amount));
  }, [transactions]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
        contentContainerStyle={[styles.content, styles.contentTall]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* token chip */}
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: colors.surface.primary,
                  borderColor: colors.border.primary,
                  borderWidth: 1,
                },
              ]}
            >
              {/* Prefer inline source, fallback to remote logoURI, then bundled ERC20 icon */}
              {token.logoSource ? (
                <Image
                  source={token.logoSource as any}
                  style={{ width: 18, height: 18, borderRadius: 9 }}
                />
              ) : token.logoURI ? (
                <Image
                  source={{ uri: token.logoURI }}
                  style={{ width: 18, height: 18, borderRadius: 9 }}
                />
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                <Image
                  source={require('../../assets/tokens/ERC20.png')}
                  style={{ width: 18, height: 18, borderRadius: 9 }}
                />
              )}
              <Text style={[styles.chipText, { color: colors.text.primary }]}>
                {token.name}
              </Text>
            </View>
          </View>

          <View style={styles.subHeaderRow}>
            <Text style={{ color: colors.text.secondary }}>{token.symbol}</Text>
            <Text style={{ color: colors.text.secondary, marginHorizontal: 8 }}>
              |
            </Text>
            <Text style={{ color: colors.text.secondary }}>
              {(() => {
                // derive chain display
                const chain =
                  token.chainId === 1
                    ? 'Ethereum Main'
                    : token.chainId === 56
                    ? 'BNB Smart Chain'
                    : token.chainId === 137
                    ? 'Polygon'
                    : 'Unknown';
                return chain;
              })()}
            </Text>
          </View>

          {/* Price and change */}
          <Text style={[styles.price, { color: colors.text.primary }]}>
            {summary
              ? (() => {
                  const small = precision.smallValueThreshold || 0.01;
                  const maxSmall = precision.smallValueMaxDigits || 6;
                  const maxLarge = precision.largeValueMaxDigits || 2;
                  const val = summary.price;
                  const opts = {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: val < small ? maxSmall : maxLarge,
                  } as const;
                  return `$${val.toLocaleString(undefined, opts)}`;
                })()
              : '--'}
          </Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
          >
            <Text
              style={{
                color:
                  (summary?.changePct24h || 0) >= 0
                    ? colors.status.success
                    : colors.status.error,
              }}
            >
              {(summary?.changePct24h || 0) >= 0 ? '▲' : '▼'}
            </Text>
            <Text
              style={{
                marginLeft: 6,
                color:
                  (summary?.changePct24h || 0) >= 0
                    ? colors.status.success
                    : colors.status.error,
              }}
            >
              {summary
                ? `${(() => {
                    const pct = Math.abs(summary.changePct24h || 0);
                    const sign = (summary.changePct24h || 0) >= 0 ? '+' : '-';
                    if (pct > 0 && pct < 0.01) return `${sign}<0.01`;
                    return `${sign}${pct.toFixed(2)}`;
                  })()}% (${timeframe})`
                : ''}
            </Text>
          </View>
          {/* <Text style={[styles.balance, { color: colors.text.secondary }]}>
            {balance ? `${balance} ${token.symbol}` : '--'}
          </Text> */}
        </View>

        {/* Chart */}
        <Animated.View
          entering={FadeIn.duration(250)}
          style={styles.chartContainer}
        >
          {loading ? (
            <Skeleton style={{ flex: 1, borderRadius: 12 }} />
          ) : graphPoints.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                }}
              >
                <Text
                  style={{ color: colors.text.secondary, fontWeight: '600' }}
                >
                  No data available
                </Text>
              </View>
            </View>
          ) : (
            <LineGraph
              style={{ flex: 1, alignSelf: 'stretch' }}
              animated
              color={
                (summary?.changePct24h || 0) >= 0
                  ? colors.status.success
                  : colors.status.error
              }
              points={graphPoints}
              gradientFillColors={[
                ((summary?.changePct24h || 0) >= 0
                  ? colors.status.success
                  : colors.status.error) + '20',
                'transparent',
              ]}
              enablePanGesture={false}
              enableFadeInMask
              lineThickness={2}
            />
          )}
        </Animated.View>

        {/* Timeframe toggles under graph */}
        <View style={styles.timeframeRow}>
          {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map(tf => (
            <TouchableOpacity
              key={tf}
              onPress={() => setTimeframe(tf)}
              style={[
                styles.timeframeBtn,
                timeframe === tf && styles.timeframeSelected,
              ]}
            >
              <Text style={{ color: colors.text.primary }}>{tf}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {(['Holdings', 'History', 'About'] as const).map(t => (
            <View key={t} style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setActiveTab(t)}
                style={[styles.tabBtn, activeTab === t && styles.tabSelected]}
              >
                <Text style={{ color: colors.text.primary }}>{t}</Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.tabUnderline,
                  {
                    width: '100%',
                    backgroundColor:
                      activeTab === t
                        ? colors.interactive.primary
                        : 'transparent',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Tab content */}
        {activeTab === 'Holdings' && (
          <View
            style={[styles.sectionCard, { borderColor: colors.border.primary }]}
          >
            <Text style={{ color: colors.text.secondary, marginBottom: 8 }}>
              My Balance
            </Text>
            {/* Reuse token row layout: minimal, single token */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Left: logo + name + my balance */}
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 12,
                  }}
                >
                  {token.logoSource ? (
                    <Image
                      source={token.logoSource as any}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  ) : token.logoURI ? (
                    <Image
                      source={{ uri: token.logoURI }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    <Image
                      source={require('../../assets/tokens/ERC20.png')}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  )}
                  {/* Chain badge bottom-right */}
                  {(() => {
                    const chain =
                      token.chainId === 56
                        ? require('../../assets/tokens/binance.png')
                        : token.chainId === 137
                        ? require('../../assets/tokens/polygon.png')
                        : require('../../assets/tokens/ethereum.png');
                    return (
                      <Image
                        source={chain as any}
                        style={{
                          position: 'absolute',
                          right: -2,
                          bottom: -2,
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.4)',
                          backgroundColor: '#000',
                        }}
                      />
                    );
                  })()}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: colors.text.primary, fontWeight: '700' }}
                  >
                    {token.name}
                  </Text>
                  <Text style={{ color: colors.text.secondary, marginTop: 2 }}>
                    {`${displayBalance} ${token.symbol}`}
                  </Text>
                </View>
              </View>
              {/* Right: my tokens worth (balance * price) */}
              <Text style={{ color: colors.text.primary, fontWeight: '600' }}>
                {formatUsd(myWorthUsd)}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'History' && (
          <View
            style={[styles.sectionCard, { borderColor: colors.border.primary }]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text.primary, marginBottom: 8 },
              ]}
            >
              Recent Transactions
            </Text>
            {displayTransactions.length === 0 ? (
              <Text style={{ color: colors.text.secondary }}>
                No transactions
              </Text>
            ) : (
              displayTransactions.slice(0, 20).map(tx => {
                const isSend = tx.type === 'send';
                const counterparty = isSend ? tx.to : tx.from;
                const amountStr = formatTokenAmount(tx.amount);
                try {
                  console.log('[TokenDetail][history] amount', {
                    hash: tx.hash,
                    raw: tx.amount,
                    decimals: token.balance.decimals,
                    formatted: amountStr,
                    symbol: token.symbol,
                  });
                } catch {}
                const display = `${isSend ? '-' : '+'} ${amountStr} ${
                  token.symbol
                }`;
                const amountColor = isSend
                  ? colors.wallet?.negativeChange || colors.status.error
                  : colors.wallet?.positiveChange || colors.status.success;
                const chainBadge = (
                  token.chainId === 56
                    ? require('../../assets/tokens/binance.png')
                    : token.chainId === 137
                    ? require('../../assets/tokens/polygon.png')
                    : require('../../assets/tokens/ethereum.png')
                ) as any;

                return (
                  <TouchableOpacity
                    key={tx.hash}
                    style={[
                      styles.txRow,
                      {
                        paddingVertical: 12,
                        alignItems: 'center',
                      },
                    ]}
                    onPress={async () => {
                      const url = `${txExplorerBase(token.chainId)}${tx.hash}`;
                      try {
                        await Linking.openURL(url);
                      } catch {}
                    }}
                  >
                    {/* Left icon */}
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      {isSend ? (
                        <TxSendIcon
                          width={18}
                          height={18}
                          stroke={colors.interactive.accent}
                          fill={'none'}
                        />
                      ) : (
                        <TxReceiveIcon
                          width={18}
                          height={18}
                          stroke={colors.interactive.accent}
                          fill={'none'}
                        />
                      )}
                    </View>

                    {/* Middle title/subtitle */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text
                          style={{
                            color: colors.text.primary,
                            fontWeight: '700',
                          }}
                        >
                          Transfer
                        </Text>
                        <ShieldIcon
                          width={14}
                          height={14}
                          style={{ marginLeft: 6 }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 2,
                        }}
                      >
                        <Image
                          source={chainBadge}
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            marginRight: 6,
                          }}
                        />
                        <Text style={{ color: colors.text.secondary }}>
                          {isSend ? 'To' : 'From'}: {shorten(counterparty)}
                        </Text>
                      </View>
                    </View>

                    {/* Right amount */}
                    <Text style={{ color: amountColor, fontWeight: '700' }}>
                      {display}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {activeTab === 'About' && (
          <View
            style={[
              styles.sectionCard,
              {
                borderColor: colors.border.primary,
                // borderColor: 'red',
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              About
            </Text>
            <View style={{ height: 1 }} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ color: colors.text.secondary, width: 140 }}>
                Token Name
              </Text>
              <Text style={{ color: colors.text.primary }}>{token.name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ color: colors.text.secondary, width: 140 }}>
                Symbol
              </Text>
              <Text style={{ color: colors.text.primary }}>{token.symbol}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ color: colors.text.secondary, width: 140 }}>
                Logo
              </Text>
              {token.logoSource ? (
                <Image
                  source={token.logoSource as any}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                />
              ) : token.logoURI ? (
                <Image
                  source={{ uri: token.logoURI }}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                />
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                <Image
                  source={require('../../assets/tokens/ERC20.png')}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                />
              )}
            </View>
            {isNative ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: colors.text.secondary, width: 140 }}>
                  Type
                </Text>
                <Text style={{ color: colors.text.primary }}>Native</Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: colors.text.secondary, width: 140 }}>
                  Contract Address
                </Text>
                <Text
                  style={{ color: colors.text.primary, flex: 1 }}
                  selectable
                >
                  {token.contractAddress}
                </Text>
              </View>
            )}
          </View>
        )}
        {/* Remove extra recent transactions preview under tabs as requested */}

        {/* End of scrollable content */}
      </ScrollView>
      {/* Sticky footer actions like dashboard */}
      <View
        style={[
          styles.stickyFooter,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              paddingHorizontal: 16,
              borderRadius: 24,
              borderWidth: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.0335)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SendToken', { token })}
          >
            <SendIcon
              width={20}
              height={20}
              fill={'none'}
              stroke={colors.interactive.accent}
            />
            <Text
              style={{
                color: colors.text.primary,
                fontWeight: '600',
                marginLeft: 8,
              }}
            >
              Send
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              paddingHorizontal: 16,
              borderRadius: 24,
              borderWidth: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.0335)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
            activeOpacity={0.7}
            onPress={() => {
              const tokenCfg = {
                chainId: token.chainId || 1,
                address: token.contractAddress,
                name: token.name,
                symbol: token.symbol,
                decimals: token.balance.decimals,
                logoURI: token.logoURI,
              } as any;
              navigation.navigate('ReceiveQR' as any, {
                token: tokenCfg,
                address: address || '',
              });
            }}
          >
            <ReceiveIcon
              width={20}
              height={20}
              fill={'none'}
              stroke={colors.interactive.accent}
            />
            <Text
              style={{
                color: colors.text.primary,
                fontWeight: '600',
                marginLeft: 8,
              }}
            >
              Receive
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TokenDetailScreen;
