import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ethers } from 'ethers';
import { useColors } from '../../utils/theme';
import { walletStorage } from '../../services/storage/walletStorage';
import type { StoredTransaction } from '../../services/storage/transactionStorage';
import {
  useFocusEffect,
  useNavigation,
  TabActions,
} from '@react-navigation/native';
// import { TransactionService } from '../../services/transaction/transactionService';
import SentIcon from '../../assets/transactions/sent.svg';
import ReceiveIcon from '../../assets/dashboard/receive.svg';
import SwapIcon from '../../assets/transactions/swap.svg';
import ApprovalIcon from '../../assets/transactions/approval.svg';
import ShieldIcon from '../../assets/transactions/shield.svg';
import { fetchOnchainTransactions } from '../../services/api/transactions';
import {
  fetchAddressTransactionsCovalent,
  getCovalentChainName,
} from '../../services/api/covalent';
import { reconfigureProvidersForSelectedChain } from '../../services/api/ethProvider';
import { supportedChains } from '../../utils/config/chains';
import { NetworkSheet } from '../../components/features/dashboard/NetworkSheet/NetworkSheet';

const Transactions: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const [items, setItems] = useState<StoredTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef<null | ReturnType<typeof setInterval>>(null);
  const [selectedChainName, setSelectedChainName] = useState<string>('');
  const [addressExplorerUrl, setAddressExplorerUrl] = useState<string | null>(
    null,
  );
  const [networkSheetVisible, setNetworkSheetVisible] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [selfAddress, setSelfAddress] = useState<string | null>(null);
  const [chainInitialized, setChainInitialized] = useState<boolean>(false);
  const [loadingList, setLoadingList] = useState<boolean>(false);

  const formatAmount = (raw: string): string => {
    const str = String(raw);
    const parts = str.split('.');
    if (parts.length < 2) return parts[0];
    const intPart = parts[0];
    const frac = parts[1] || '';
    const sliced = frac.slice(0, 6);
    const trimmed = sliced.replace(/0+$/g, '');
    return trimmed ? `${intPart}.${trimmed}` : intPart;
  };

  // Fallback normalization: if an amount arrives in hex for native transfers,
  // format from wei to decimal using 18 decimals. Keeps tokens untouched.
  const normalizeDisplayAmount = (raw: string, symbol: string): string => {
    const nativeSymbol = (() => {
      const chain = supportedChains.find(c => c.chainId === selectedChainId);
      return chain?.symbol || 'ETH';
    })();
    const isHex = typeof raw === 'string' && raw.startsWith('0x');
    const isNative = symbol?.toUpperCase?.() === nativeSymbol.toUpperCase?.();
    if (isHex && isNative) {
      try {
        return ethers.utils.formatUnits(raw, 18);
      } catch {
        return raw;
      }
    }
    return raw;
  };

  const getExplorerAddressBase = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'https://etherscan.io/address/';
      case 56:
        return 'https://bscscan.com/address/';
      case 137:
        return 'https://polygonscan.com/address/';
      default:
        return 'https://etherscan.io/address/';
    }
  };

  const load = async () => {
    const id = await walletStorage.getCurrentWalletId();
    if (!id) return setItems([]);
    try {
      const meta = await walletStorage.getWalletMetadata(id);
      let onchain: StoredTransaction[] = [] as any;
      if (meta?.address) {
        // Determine selected chain; if All Networks (0), fetch all chains in parallel
        const selected = (await walletStorage.getSelectedChainId()) ?? 1;
        if (selected === 0) {
          const chains = ['eth-mainnet', 'bsc-mainnet', 'matic-mainnet'];
          const parts = await Promise.all(
            chains.map(c =>
              fetchAddressTransactionsCovalent(c, meta.address, {
                pageSize: 100,
              }).catch(() => []),
            ),
          );
          onchain = ([] as StoredTransaction[]).concat(
            ...parts.map(p => p.map(t => ({ ...t, walletId: id } as any))),
          );
          try {
            // eslint-disable-next-line no-console
            console.log('[Transactions][API][AllNetworks]', {
              counts: parts.map(p => p.length),
            });
          } catch {}
        } else {
          onchain = await fetchOnchainTransactions(id, meta.address, 100);
          try {
            // eslint-disable-next-line no-console
            console.log('[Transactions][API][SingleChain]', {
              chainId: selected,
              count: onchain.length,
              sample: onchain[0],
            });
          } catch {}
        }
      }
      const merged = (onchain || []).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      setItems(merged);
    } catch {
      setItems([]);
    }
    try {
      const chainId = (await walletStorage.getSelectedChainId()) ?? 1;
      const chain = supportedChains.find(c => c.chainId === chainId);
      if (chain?.name) setSelectedChainName(chain.name);
      else if (chainId === 0) setSelectedChainName('All Networks');
      setSelectedChainId(chainId);
      const meta = await walletStorage.getWalletMetadata(id);
      if (meta?.address)
        setAddressExplorerUrl(
          chainId === 0
            ? null
            : `${getExplorerAddressBase(chainId)}${meta.address}`,
        );
    } catch {}
  };

  useEffect(() => {
    (async () => {
      try {
        const cid = (await walletStorage.getSelectedChainId()) ?? 1;
        const chain = supportedChains.find(c => c.chainId === cid);
        if (chain) {
          setSelectedChainId(chain.chainId);
          setSelectedChainName(chain.name);
        } else if (cid === 0) {
          setSelectedChainId(0);
          setSelectedChainName('All Networks');
        }
        setLoadingList(true);
        await reconfigureProvidersForSelectedChain();
      } catch {}
      setChainInitialized(true);
      await load();
      setLoadingList(false);
      try {
        const id = await walletStorage.getCurrentWalletId();
        if (!id) return setSelfAddress(null);
        const meta = await walletStorage.getWalletMetadata(id);
        setSelfAddress(meta?.address?.toLowerCase?.() || null);
      } catch {
        setSelfAddress(null);
      }
    })();
  }, []);

  // Refresh from API when screen is focused and poll periodically
  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const refreshFromApi = async () => {
        try {
          if (!isCancelled) await load();
        } catch {}
      };

      refreshFromApi();
      pollRef.current = setInterval(refreshFromApi, 10000);

      return () => {
        isCancelled = true;
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderItem = ({ item }: { item: StoredTransaction }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border.primary }]}
      onPress={() =>
        (navigation as any).navigate('Send', {
          screen: 'TransactionStatus',
          params: {
            tx: {
              hash: item.hash,
              amount: item.amount,
              symbol: item.symbol,
              status: item.status,
            },
          },
        })
      }
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.primary,
          },
        ]}
      >
        {(() => {
          const action = (item.action || '').toLowerCase();
          if (action === 'approval' || action === 'approve') {
            return (
              <ApprovalIcon
                width={20}
                height={20}
                color={colors.text.secondary}
              />
            );
          }
          if (action.includes('swap')) {
            return (
              <SwapIcon width={20} height={20} color={colors.text.secondary} />
            );
          }
          const fromSelf =
            selfAddress && item.from?.toLowerCase?.() === selfAddress;
          return fromSelf ? (
            <SentIcon width={20} height={20} color={colors.text.secondary} />
          ) : (
            <ReceiveIcon width={20} height={20} color={colors.text.secondary} />
          );
        })()}
      </View>
      <View style={styles.rowMiddle}>
        <View style={styles.rowTitleWrap}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {item.action || 'Transfer'}
          </Text>
          <ShieldIcon
            width={14}
            height={14}
            color={statusToColor(item.status, colors)}
          />
        </View>
        <View style={styles.fromRow}>
          {selectedChainId != null ? (
            <Image
              source={
                supportedChains.find(c => c.chainId === selectedChainId)?.icon
              }
              style={styles.fromIcon}
            />
          ) : null}
          <Text style={[styles.sub, { color: colors.text.tertiary }]}>
            {renderFromTo(item)}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={[styles.amountRight, { color: colors.text.primary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {renderSignedAmount({
            ...item,
            amount: formatAmount(
              normalizeDisplayAmount(item.amount, item.symbol),
            ),
          })}{' '}
          {item.symbol}
        </Text>
        {!!item.usdValue && (
          <Text style={[styles.sub, { color: colors.text.tertiary }]}>
            ≈ ${Number(item.usdValue).toFixed(2)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const statusToColor = (
    status: StoredTransaction['status'],
    themeColors: ReturnType<typeof useColors>,
  ) => {
    switch (status) {
      case 'confirmed':
        return themeColors.status.success;
      case 'failed':
        return themeColors.status.error;
      default:
        return themeColors.status.warning;
    }
  };

  const toDateKey = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const renderFromTo = (item: StoredTransaction) => {
    const fromSelf = selfAddress && item.from?.toLowerCase?.() === selfAddress;
    if (fromSelf) {
      return `To: ${item.to.slice(0, 8)}...${item.to.slice(-6)}`;
    }
    return `From: ${item.from.slice(0, 8)}...${item.from.slice(-6)}`;
  };

  const renderSignedAmount = (item: StoredTransaction) => {
    if ((item.action || '').toLowerCase() === 'approval') return '';
    const fromSelf = selfAddress && item.from?.toLowerCase?.() === selfAddress;
    const sign = fromSelf ? '-' : '+';
    return `${sign} ${item.amount}`;
  };

  const formatDateHeader = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const sameDay =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
    if (sameDay) return 'Today';
    return d.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const displayItems = React.useMemo(() => items, [items]);

  const sections = React.useMemo(() => {
    if (!displayItems.length)
      return [] as { title: string; data: StoredTransaction[] }[];
    const map = new Map<string, StoredTransaction[]>();
    for (const it of displayItems) {
      const k = toDateKey(it.timestamp);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(it);
    }
    const arr = Array.from(map.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([k, data]) => ({
        title: formatDateHeader(data[0].timestamp),
        data,
      }));
    return arr;
  }, [displayItems]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {chainInitialized ? (
        <View style={styles.chainRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setNetworkSheetVisible(true)}
            style={[
              styles.chainPill,
              {
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              },
            ]}
          >
            {(() => {
              const chain = supportedChains.find(
                c => c.chainId === selectedChainId,
              );
              if (chain?.icon) {
                return <Image source={chain.icon} style={styles.chainIcon} />;
              }
              if (selectedChainId === 0) {
                return (
                  <View
                    style={[
                      styles.chainIcon,
                      { backgroundColor: colors.interactive.primary },
                    ]}
                  />
                );
              }
              return null;
            })()}
            <Text style={[styles.chainText, { color: colors.text.primary }]}>
              {selectedChainName}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* Bottom sheet for selecting network (same as Dashboard) */}
      <NetworkSheet
        visible={networkSheetVisible}
        onClose={() => setNetworkSheetVisible(false)}
        selectedChainId={selectedChainId ?? undefined}
        onSelect={async chain => {
          try {
            await walletStorage.setSelectedChainId(chain.chainId);
            setSelectedChainId(chain.chainId);
            setSelectedChainName(chain.name);
            setNetworkSheetVisible(false);
            setLoadingList(true);
            setItems([]);
            await reconfigureProvidersForSelectedChain();
            await load();
          } finally {
            setLoadingList(false);
          }
        }}
      />
      {loadingList ? (
        <View
          style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <View style={[styles.row, { paddingVertical: 12 }]}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.primary,
                    },
                  ]}
                />
                <View style={styles.rowMiddle}>
                  <View style={styles.rowTitleWrap}>
                    <View
                      style={[
                        styles.skeletonBar,
                        {
                          width: 80,
                          height: 16,
                          backgroundColor: colors.background.card,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.skeletonDot,
                        { backgroundColor: colors.background.card },
                      ]}
                    />
                  </View>
                  <View style={styles.fromRow}>
                    <View
                      style={[
                        styles.fromIcon,
                        { backgroundColor: colors.background.card },
                      ]}
                    />
                    <View
                      style={[
                        styles.skeletonBar,
                        { width: 180, backgroundColor: colors.background.card },
                      ]}
                    />
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View
                    style={[
                      styles.skeletonBar,
                      {
                        width: 100,
                        height: 16,
                        backgroundColor: colors.background.card,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.skeletonBar,
                      {
                        width: 80,
                        marginTop: 6,
                        backgroundColor: colors.background.card,
                      },
                    ]}
                  />
                </View>
              </View>
              <View
                style={{ height: 1, backgroundColor: colors.border.primary }}
              />
            </React.Fragment>
          ))}
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            No transactions yet
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          keyExtractor={i => i.hash}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderSectionHeader={({ section }) => (
            <Text
              style={[styles.sectionHeader, { color: colors.text.secondary }]}
            >
              {section.title}
            </Text>
          )}
          ListFooterComponent={
            addressExplorerUrl ? (
              <TouchableOpacity
                onPress={() => {
                  const { Linking } = require('react-native');
                  Linking.openURL(addressExplorerUrl).catch(() => {});
                }}
              >
                <Text
                  style={[
                    styles.checkExplorer,
                    { color: colors.interactive.primary },
                  ]}
                >
                  Cannot find your transaction? Check explorer
                </Text>
              </TouchableOpacity>
            ) : null
          }
          ItemSeparatorComponent={() => (
            <View
              style={{ height: 1, backgroundColor: colors.border.primary }}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 24,
          }}
        />
      )}
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 12 },
  hash: { fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 14 },
  chainRow: { paddingHorizontal: 16, paddingTop: 12 },
  chainPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainIcon: { width: 16, height: 16, marginRight: 8, borderRadius: 8 },
  chainText: { fontSize: 14, fontWeight: '600' },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: 'absolute',
    top: 64,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuIcon: { width: 20, height: 20, marginRight: 10, borderRadius: 10 },
  menuText: { fontSize: 14, fontWeight: '600' },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  checkExplorer: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
    fontWeight: '700',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowMiddle: { flex: 1 },
  rowTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '700' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  amountRight: { fontSize: 16, fontWeight: '700' },
  fromRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fromIcon: { width: 12, height: 12, borderRadius: 6 },
  skeletonBar: { height: 12, borderRadius: 6 },
  skeletonDot: { width: 14, height: 14, borderRadius: 7 },
});
