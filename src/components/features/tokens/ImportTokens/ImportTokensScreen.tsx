import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Switch,
  SafeAreaView,
  Image,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import {
  ETHEREUM_TOKEN_LIST,
  BSC_TOKEN_LIST,
  POLYGON_TOKEN_LIST,
} from '../../../../utils/constants/tokenList.eth';
import { TokenConfig } from '../../../../utils/types/token.types';
import { walletStorage } from '../../../../services/storage/walletStorage';
import { useNavigation } from '@react-navigation/native';
import { supportedChains } from '../../../../utils/config/chains';
import { getHttpProviderForChain } from '../../../../services/api/ethProvider';
import { ethers } from 'ethers';
import { resolveTokenLogo } from '../../../../services/api/market';
import { Linking } from 'react-native';
import { NetworkSheet } from '../../dashboard/NetworkSheet/NetworkSheet';

interface ImportTokensScreenProps {
  chainId?: number; // defaults to 1 (Ethereum)
  onBack?: () => void;
  onComplete?: () => void;
}

// Token logo with chain badge overlay
const TokenLogo: React.FC<{ uri?: string; chainId: number }> = ({
  uri,
  chainId,
}) => {
  const [hasError, setHasError] = useState(false);
  const chain = useMemo(
    () => supportedChains.find(c => c.chainId === chainId),
    [chainId],
  );

  return (
    <View style={styles.logoWrapper}>
      {!uri || hasError ? (
        <View style={styles.logoPlaceholder} />
      ) : (
        // Use RN Image via require inline to avoid top-level import
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        React.createElement(require('react-native').Image, {
          source: { uri },
          style: styles.logoImage,
          onError: () => setHasError(true),
        })
      )}
      {chain?.icon
        ? // eslint-disable-next-line @typescript-eslint/no-var-requires
          React.createElement(require('react-native').Image, {
            source: chain.icon,
            style: styles.chainBadge,
          })
        : null}
    </View>
  );
};

export const ImportTokensScreen: React.FC<ImportTokensScreenProps> = ({
  chainId = 1,
  onBack,
  onComplete,
}) => {
  const colors = useColors();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [query, setQuery] = useState('');
  // key format `${chainId}:${address.toLowerCase()}` to handle multi-chain selections
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [networkFilter, setNetworkFilter] = useState<'all' | 1 | 56 | 137>(
    'all',
  );
  const [searchNetworkSheetVisible, setSearchNetworkSheetVisible] =
    useState(false);
  const [custom, setCustom] = useState({
    address: '',
    name: '',
    symbol: '',
    decimals: '',
  });
  const [customChainId, setCustomChainId] = useState<number>(chainId || 1);
  const [customNetworkSheetVisible, setCustomNetworkSheetVisible] =
    useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState<boolean>(false);
  const [logoUri, setLogoUri] = useState<string | undefined>(undefined);

  const tokenList = useMemo<TokenConfig[]>(() => {
    // Combine supported chain token lists
    return [
      ...ETHEREUM_TOKEN_LIST.tokens,
      ...BSC_TOKEN_LIST.tokens,
      ...POLYGON_TOKEN_LIST.tokens,
    ];
  }, []);

  // Load custom tokens from storage (all supported chains) to append at end of Search tab
  const [customSearchTokens, setCustomSearchTokens] = useState<TokenConfig[]>(
    [],
  );
  useEffect(() => {
    (async () => {
      try {
        const [c1, c56, c137] = await Promise.all([
          walletStorage.getCustomTokens(1),
          walletStorage.getCustomTokens(56),
          walletStorage.getCustomTokens(137),
        ]);
        const toCfg = (rec: Record<string, any>): TokenConfig[] =>
          Object.values(rec || {}).map((t: any) => ({
            chainId: t.chainId,
            address: t.address,
            name: t.name,
            symbol: t.symbol,
            decimals: t.decimals,
            logoURI: t.logoURI,
          }));
        const combined = [...toCfg(c1), ...toCfg(c56), ...toCfg(c137)];
        setCustomSearchTokens(combined);
      } catch (_e) {
        setCustomSearchTokens([]);
      }
    })();
  }, []);

  // Preselect already-added tokens from storage across supported chains
  useEffect(() => {
    (async () => {
      try {
        const [eth, bsc, pol] = await Promise.all([
          walletStorage.getPreferredTokenAddresses(1),
          walletStorage.getPreferredTokenAddresses(56),
          walletStorage.getPreferredTokenAddresses(137),
        ]);
        const map: Record<string, boolean> = {};
        for (const a of eth) map[`1:${a.toLowerCase()}`] = true;
        for (const a of bsc) map[`56:${a.toLowerCase()}`] = true;
        for (const a of pol) map[`137:${a.toLowerCase()}`] = true;
        setSelected(map);
      } catch (_e) {}
    })();
  }, []);

  const normalizedFilter = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    // Prepare base and custom lists by selected network
    const baseByNetwork =
      networkFilter === 'all'
        ? tokenList
        : tokenList.filter(t => t.chainId === networkFilter);
    const existingKeys = new Set(
      baseByNetwork.map(t => `${t.chainId}:${t.address.toLowerCase()}`),
    );
    const customAllByNetwork =
      networkFilter === 'all'
        ? customSearchTokens
        : customSearchTokens.filter(t => t.chainId === networkFilter);
    // Append custom tokens not present in the base list
    const customToAppend = customAllByNetwork.filter(
      t => !existingKeys.has(`${t.chainId}:${t.address.toLowerCase()}`),
    );

    if (!normalizedFilter) return [...baseByNetwork, ...customToAppend];

    const filterFn = (t: TokenConfig) => {
      const hay = `${t.name} ${t.symbol} ${t.address}`.toLowerCase();
      return hay.includes(normalizedFilter);
    };
    const baseMatches = baseByNetwork.filter(filterFn);
    const customMatches = customToAppend.filter(filterFn);
    return [...baseMatches, ...customMatches];
  }, [tokenList, customSearchTokens, normalizedFilter, networkFilter]);

  const toggleSelect = useCallback((itemChainId: number, address: string) => {
    const key = `${itemChainId}:${address.toLowerCase()}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ---- ERC-20 metadata autofill for custom address ----
  useEffect(() => {
    let cancelled = false;
    const fetchMetadata = async () => {
      const addr = custom.address.trim();
      if (!addr || addr.length < 10) return; // simple guard
      try {
        setIsFetchingMeta(true);
        setLogoUri(undefined); // hide preview while fetching
        const provider = getHttpProviderForChain(customChainId);
        const erc20Abi = [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)',
        ];
        const contract = new ethers.Contract(addr, erc20Abi, provider);
        const [nm, sym, dec] = await Promise.all([
          contract.name().catch(() => ''),
          contract.symbol().catch(() => ''),
          contract.decimals().catch(() => 0),
        ]);
        if (!cancelled) {
          setCustom(p => ({
            ...p,
            name: nm ? String(nm) : p.name,
            symbol: sym ? String(sym) : p.symbol,
            decimals: dec ? String(dec) : p.decimals,
          }));
        }
        // Try to find logo from bundled lists first
        try {
          const lower = addr.toLowerCase();
          let bundled: string | undefined;
          if (customChainId === 1) {
            const t = ETHEREUM_TOKEN_LIST.tokens.find(
              x => x.address.toLowerCase() === lower,
            );
            bundled = t?.logoURI;
          } else if (customChainId === 56) {
            const t = BSC_TOKEN_LIST.tokens.find(
              x => x.address.toLowerCase() === lower,
            );
            bundled = t?.logoURI;
          } else if (customChainId === 137) {
            const t = POLYGON_TOKEN_LIST.tokens.find(
              x => x.address.toLowerCase() === lower,
            );
            bundled = t?.logoURI;
          }
          if (!cancelled) setLogoUri(bundled);
          if (!bundled) {
            const resolved = await resolveTokenLogo(customChainId, addr);
            if (!cancelled && resolved) setLogoUri(resolved);
          }
        } catch {}
      } catch (_e) {
        // ignore - user can fill manually
      } finally {
        if (!cancelled) setIsFetchingMeta(false);
      }
    };
    fetchMetadata();
    return () => {
      cancelled = true;
    };
  }, [custom.address, customChainId]);

  const handleCancel = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      (navigation as any).goBack();
    }
  }, [onBack, navigation]);

  const handleImport = useCallback(async () => {
    if (activeTab === 'custom') {
      // Basic validation; user can fill real data later
      const addr = custom.address.trim();
      const decimals = Number(custom.decimals || '0');
      if (!addr || !custom.symbol || Number.isNaN(decimals)) {
        return;
      }
      await walletStorage.saveCustomToken(customChainId, {
        chainId: customChainId,
        address: addr,
        name: custom.name || custom.symbol,
        symbol: custom.symbol,
        decimals,
        logoURI: logoUri || undefined,
      });
      await walletStorage.addPreferredTokenAddress(customChainId, addr);
      if (onComplete) {
        onComplete();
      } else {
        // Default: go back
        (navigation as any).goBack();
      }
      return;
    }

    // Group by chain and persist separately
    const perChainTouched: Record<
      number,
      { add: string[]; touched: string[] }
    > = {} as any;
    for (const [k, v] of Object.entries(selected)) {
      const [cStr, addr] = k.split(':');
      const c = Number(cStr);
      if (!perChainTouched[c]) perChainTouched[c] = { add: [], touched: [] };
      if (v) perChainTouched[c].add.push(addr);
      perChainTouched[c].touched.push(addr);
    }
    for (const cStr of Object.keys(perChainTouched)) {
      const c = Number(cStr);
      const existing = await walletStorage.getPreferredTokenAddresses(c);
      const existingLc = (existing || []).map(a => a.toLowerCase());
      const { add, touched } = perChainTouched[c];
      const touchedSet = new Set(touched.map(a => a.toLowerCase()));
      const toRemove = existingLc.filter(
        a => touchedSet.has(a) && !selected[`${c}:${a}`],
      );
      const kept = existingLc.filter(a => !toRemove.includes(a));
      const merged = Array.from(new Set([...kept, ...add]));
      await walletStorage.setPreferredTokenAddresses(c, merged);
    }
    if (onComplete) {
      onComplete();
    } else {
      (navigation as any).goBack();
    }
  }, [activeTab, selected, chainId, custom, onComplete, navigation]);

  const renderItem = ({ item }: { item: TokenConfig }) => {
    const key = `${item.chainId}:${item.address.toLowerCase()}`;
    const isSelected = !!selected[key];
    return (
      <TouchableOpacity
        style={[styles.row, { borderColor: colors.border.primary }]}
        onPress={() => toggleSelect(item.chainId, item.address)}
        activeOpacity={0.7}
      >
        <TokenLogo uri={item.logoURI} chainId={item.chainId} />
        <View style={styles.rowText}>
          <View style={styles.nameLine}>
            <Text style={[styles.name, { color: colors.text.primary }]}>
              {item.name}
            </Text>
            {(() => {
              const chain = supportedChains.find(
                c => c.chainId === item.chainId,
              );
              const label =
                chain?.id === 'bsc'
                  ? 'BNB Smart Chain'
                  : chain?.name || String(item.chainId);
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
          <Text style={[styles.symbol, { color: colors.text.secondary }]}>
            {item.symbol}
          </Text>
        </View>
        <Switch
          value={isSelected}
          onValueChange={() => toggleSelect(item.chainId, item.address)}
          trackColor={{
            false: colors.border.secondary,
            true: colors.interactive.primary,
          }}
          thumbColor={isSelected ? colors.text.primary : colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Enhanced Tabs */}
      <View
        style={[
          styles.tabsContainer,
          { backgroundColor: colors.surface.primary },
        ]}
      >
        <View style={[styles.tabs, { borderColor: colors.border.secondary }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'search' && {
                backgroundColor: colors.interactive.primary,
                borderColor: colors.interactive.primary,
              },
            ]}
            onPress={() => setActiveTab('search')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'search'
                      ? colors.text.inverse
                      : colors.text.secondary,
                  fontWeight: activeTab === 'search' ? '700' : '600',
                },
              ]}
            >
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'custom' && {
                backgroundColor: colors.interactive.primary,
                borderColor: colors.interactive.primary,
              },
            ]}
            onPress={() => setActiveTab('custom')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'custom'
                      ? colors.text.inverse
                      : colors.text.secondary,
                  fontWeight: activeTab === 'custom' ? '700' : '600',
                },
              ]}
            >
              Custom Token
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area with proper flex */}
      <View style={styles.contentContainer}>
        {activeTab === 'search' ? (
          <>
            {/* Network filter dropdown */}
            <View style={styles.networkFilterContainer}>
              <TouchableOpacity
                style={[
                  styles.networkFilterButton,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.surface.primary,
                  },
                ]}
                onPress={() => setSearchNetworkSheetVisible(true)}
              >
                {(() => {
                  if (networkFilter === 'all') {
                    return (
                      <Text
                        style={{
                          color: colors.text.primary,
                          fontWeight: '600',
                        }}
                      >
                        All Networks
                      </Text>
                    );
                  }
                  const chain = supportedChains.find(
                    c => c.chainId === (networkFilter as number),
                  );
                  return (
                    <View style={styles.chainButtonContent}>
                      {chain?.icon ? (
                        <Image
                          source={chain.icon}
                          style={styles.chainIcon}
                          resizeMode="contain"
                        />
                      ) : null}
                      <Text
                        style={{
                          color: colors.text.primary,
                          fontWeight: '600',
                        }}
                      >
                        {chain?.name || 'Network'}
                      </Text>
                    </View>
                  );
                })()}
              </TouchableOpacity>
              {/* Bottom sheet trigger above; sheet rendered at bottom */}
            </View>

            {/* Search input */}
            <TextInput
              placeholder="Search tokens..."
              placeholderTextColor={colors.text.tertiary}
              style={[
                styles.searchBox,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                },
              ]}
              value={query}
              onChangeText={setQuery}
            />

            {/* Token list */}
            <FlatList
              data={filtered}
              renderItem={renderItem}
              keyExtractor={item => `${item.chainId}:${item.address}`}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          </>
        ) : (
          <View style={styles.customForm}>
            {/* Token preview row (hidden until logo fetched) */}
            {logoUri ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View style={styles.logoWrapper}>
                  {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    React.createElement(require('react-native').Image, {
                      source: { uri: logoUri },
                      style: styles.logoImage,
                      onError: () => setLogoUri(undefined),
                    })
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: colors.text.primary, fontWeight: '600' }}
                  >
                    {custom.symbol || 'Symbol'}
                  </Text>
                  <Text style={{ color: colors.text.secondary }}>
                    {custom.name || 'Name'}
                  </Text>
                </View>
              </View>
            ) : null}
            {/* Network selector for custom token */}
            <TouchableOpacity
              style={[
                styles.networkFilterButton,
                {
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                },
              ]}
              onPress={() => setCustomNetworkSheetVisible(true)}
            >
              {(() => {
                const chain = supportedChains.find(
                  c => c.chainId === customChainId,
                );
                return (
                  <View style={styles.chainButtonContent}>
                    {chain?.icon ? (
                      <Image
                        source={chain.icon}
                        style={styles.chainIcon}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text
                      style={{ color: colors.text.primary, fontWeight: '600' }}
                    >
                      {chain?.name || `Chain ${customChainId}`}
                    </Text>
                  </View>
                );
              })()}
            </TouchableOpacity>
            {/* Bottom sheet trigger above; sheet rendered at bottom */}
            {/* Verify on Explorer - visible only when address provided */}
            {custom.address.trim().length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.networkFilterButton,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.surface.secondary,
                  },
                ]}
                onPress={() => {
                  const addr = custom.address.trim();
                  const base = (() => {
                    switch (customChainId) {
                      case 56:
                        return 'https://bscscan.com/token/';
                      case 137:
                        return 'https://polygonscan.com/token/';
                      case 1:
                      default:
                        return 'https://etherscan.io/token/';
                    }
                  })();
                  const url = addr ? `${base}${addr}` : base;
                  Linking.openURL(url).catch(() => {});
                }}
              >
                <Text style={{ color: colors.text.primary, fontWeight: '600' }}>
                  Not sure about the Token? Verify on Explorer
                </Text>
              </TouchableOpacity>
            ) : null}
            <TextInput
              placeholder="Contract Address"
              placeholderTextColor={colors.text.tertiary}
              style={[
                styles.input,
                styles.formField,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                },
              ]}
              autoCapitalize="none"
              value={custom.address}
              onChangeText={v => {
                const val = v;
                if (val.trim().length === 0) {
                  setLogoUri(undefined);
                  setCustom(p => ({
                    ...p,
                    address: val,
                    name: '',
                    symbol: '',
                    decimals: '',
                  }));
                } else {
                  setCustom(p => ({ ...p, address: val }));
                }
              }}
            />
            <TextInput
              placeholder="Symbol"
              placeholderTextColor={colors.text.tertiary}
              style={[
                styles.input,
                styles.formField,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                },
              ]}
              autoCapitalize="characters"
              value={custom.symbol}
              onChangeText={v => setCustom(p => ({ ...p, symbol: v }))}
            />
            <TextInput
              placeholder="Name (optional)"
              placeholderTextColor={colors.text.tertiary}
              style={[
                styles.input,
                styles.formField,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                },
              ]}
              autoCapitalize="words"
              value={custom.name}
              onChangeText={v => setCustom(p => ({ ...p, name: v }))}
            />
            <TextInput
              placeholder="Decimals"
              placeholderTextColor={colors.text.tertiary}
              style={[
                styles.input,
                styles.formField,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.surface.primary,
                },
              ]}
              keyboardType="number-pad"
              value={custom.decimals}
              onChangeText={v => setCustom(p => ({ ...p, decimals: v }))}
            />
            {isFetchingMeta ? (
              <Text style={{ color: colors.text.secondary, marginLeft: 4 }}>
                Fetching token details...
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {/* Enhanced Sticky Bottom Bar */}
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: colors.surface.primary },
        ]}
      >
        <View style={[styles.bottom, { borderColor: colors.border.secondary }]}>
          <TouchableOpacity
            style={[
              styles.cancelBtn,
              {
                borderColor: colors.border.primary,
                backgroundColor: colors.surface.secondary,
              },
            ]}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.cancelBtnText, { color: colors.text.primary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.importBtn,
              {
                backgroundColor: colors.interactive.primary,
                shadowColor: colors.interactive.primary,
              },
            ]}
            onPress={handleImport}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.importBtnText, { color: colors.text.inverse }]}
            >
              Import
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom sheets */}
      <NetworkSheet
        visible={searchNetworkSheetVisible}
        onClose={() => setSearchNetworkSheetVisible(false)}
        selectedChainId={
          networkFilter === 'all' ? 0 : (networkFilter as number)
        }
        includeAll
        onSelect={chain => {
          if (chain.chainId === 0) {
            setNetworkFilter('all');
          } else if (
            chain.chainId === 1 ||
            chain.chainId === 56 ||
            chain.chainId === 137
          ) {
            setNetworkFilter(chain.chainId as 1 | 56 | 137);
          }
          setSearchNetworkSheetVisible(false);
        }}
      />
      <NetworkSheet
        visible={customNetworkSheetVisible}
        onClose={() => setCustomNetworkSheetVisible(false)}
        selectedChainId={customChainId}
        includeAll={false}
        onSelect={chain => {
          if (chain.chainId) setCustomChainId(chain.chainId);
          setCustomNetworkSheetVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 23, 32, 0.1)',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    backgroundColor: 'rgba(26, 23, 32, 0.05)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  contentContainer: {
    flex: 1,
  },
  networkFilterContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    position: 'relative',
    zIndex: 10,
  },
  searchBox: {
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  input: {
    height: 48,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100, // Add bottom padding to account for sticky bottom bar
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 23, 32, 0.1)',
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  networkFilterButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chainIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  symbol: {
    fontSize: 14,
    opacity: 0.8,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chainBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    backgroundColor: '#000',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  customForm: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
    paddingBottom: 100, // Add bottom padding to account for sticky bottom bar
  },
  formField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 23, 32, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  importBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FB923C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  importBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default ImportTokensScreen;
