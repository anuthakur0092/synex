import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { styles } from './ReceiveListScreen.styles';
import { useColors } from '../../utils/theme';
import {
  ETHEREUM_TOKEN_LIST,
  BSC_TOKEN_LIST,
  POLYGON_TOKEN_LIST,
} from '../../utils/constants/tokenList.eth';
import { TokenConfig } from '../../utils/types/token.types';
import { useWallet } from '../../hooks/useWallet';
import { useNavigation } from '@react-navigation/native';
import { ReceiveTokenRow } from '../../components/features/receive/ReceiveTokenRow';
import { supportedChains } from '../../utils/config/chains';

export const ReceiveListScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const { address } = useWallet();

  const [query, setQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState<'all' | 1 | 56>('all');
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  const allTokens = useMemo<TokenConfig[]>(() => {
    return [
      ...ETHEREUM_TOKEN_LIST.tokens,
      ...BSC_TOKEN_LIST.tokens,
      ...POLYGON_TOKEN_LIST.tokens,
    ];
  }, []);

  const filteredTokens = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byNetwork =
      networkFilter === 'all'
        ? allTokens
        : allTokens.filter(t => t.chainId === networkFilter);
    if (!normalized) return byNetwork;
    return byNetwork.filter(t =>
      `${t.name} ${t.symbol} ${t.address}`.toLowerCase().includes(normalized),
    );
  }, [allTokens, networkFilter, query]);

  const openQR = useCallback(
    (token: TokenConfig) => {
      if (!address) return;
      (navigation as any).navigate('ReceiveQR', { token, address });
    },
    [navigation, address],
  );

  const renderItem = ({ item }: { item: TokenConfig }) => (
    <ReceiveTokenRow
      token={item}
      address={address || ''}
      onPress={() => openQR(item)}
    />
  );

  const currentChainName = (cid: number) =>
    supportedChains.find(c => c.chainId === cid)?.name || String(cid);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Network dropdown trigger */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.networkButton,
            {
              borderColor: colors.border.primary,
              backgroundColor: colors.surface.primary,
            },
          ]}
          onPress={() => setShowNetworkMenu(v => !v)}
          activeOpacity={0.7}
        >
          <Text style={{ color: colors.text.primary }}>
            {networkFilter === 'all'
              ? 'All Networks'
              : currentChainName(networkFilter)}
          </Text>
        </TouchableOpacity>

        {showNetworkMenu && (
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.surface.primary,
                borderColor: colors.border.primary,
              },
            ]}
          >
            {(
              [
                { label: 'All Networks', value: 'all' as const },
                { label: 'Ethereum', value: 1 as const },
                { label: 'BNB Smart Chain', value: 56 as const },
                { label: 'Polygon', value: 137 as const },
              ] as const
            ).map(opt => (
              <TouchableOpacity
                key={String(opt.value)}
                style={styles.dropdownItem}
                onPress={() => {
                  setNetworkFilter(opt.value);
                  setShowNetworkMenu(false);
                }}
              >
                <Text style={{ color: colors.text.primary }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface.primary,
            borderColor: colors.border.primary,
          },
        ]}
      >
        <TextInput
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={colors.text.tertiary}
          style={[styles.input, { color: colors.text.primary }]}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* List header */}
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
        All crypto
      </Text>

      <FlatList
        data={filteredTokens}
        keyExtractor={item => `${item.chainId}:${item.address}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default ReceiveListScreen;
