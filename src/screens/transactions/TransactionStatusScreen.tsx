import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { JsonRpcProvider } from '@ethersproject/providers';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../../utils/theme';
import { supportedChains } from '../../utils/config/chains';
import {
  ETHEREUM_TOKEN_LIST,
  BSC_TOKEN_LIST,
  POLYGON_TOKEN_LIST,
} from '../../utils/constants/tokenList.eth';

import {
  useTransactionStatus,
  type TxLiveStatus,
} from '../../hooks/useTransactionStatus';
import {
  fetchTxDetailsByHash,
  getCovalentChainName,
} from '../../services/api/covalent';
import { walletStorage } from '../../services/storage/walletStorage';
import { transactionStorage } from '../../services/storage/transactionStorage';

type Params = {
  tx: {
    hash: string;
    symbol: string;
    amount: string;
    status?: 'pending' | 'confirmed' | 'failed';
  };
};

type RouteProps = RouteProp<
  Record<'TransactionStatus', Params>,
  'TransactionStatus'
>;

export const TransactionStatusScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const colors = useColors();
  const { hash, amount, symbol, status: initialStatus } = route.params.tx;
  const live = useTransactionStatus(hash, 12);
  const [statusOverride, setStatusOverride] = useState<TxLiveStatus | null>(
    null,
  );
  const status =
    statusOverride ??
    (initialStatus && initialStatus !== 'pending'
      ? initialStatus
      : live.status);
  const { confirmations, remainingConfirmations, targetConfirmations } = live;
  const [details, setDetails] = useState<{
    blockNumber?: number;
    gasUsed?: string;
    effectiveGasPriceGwei?: string;
    feeEth?: string;
    timestamp?: string;
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
  const [detectedChainId, setDetectedChainId] = useState<number | null>(null);
  const [detectedChainName, setDetectedChainName] = useState<string | null>(
    null,
  );
  const [tokenLogoUri, setTokenLogoUri] = useState<string | null>(null);

  // Removed elapsed timer per requirement

  // Fetch transaction details from Covalent (after chain is detected)
  useEffect(() => {
    if (!detectedChainId) return;
    let cancelled = false;
    setLoadingDetails(true);
    (async () => {
      try {
        const chainName = getCovalentChainName(detectedChainId || 1);
        const cov = await fetchTxDetailsByHash(chainName as string, hash);
        // eslint-disable-next-line no-console
        console.log('[TransactionStatus][covalentTx]', cov);
        if (!cancelled) {
          if (cov) {
            const gwei = cov.gasPriceWei
              ? (Number(cov.gasPriceWei) / 1e9).toFixed(2)
              : undefined;
            let feeEth: string | undefined = undefined;
            const gasPriceNum = Number(cov.gasPriceWei);
            const gasSpentNum = Number(cov.gasSpent);
            if (Number.isFinite(gasPriceNum) && Number.isFinite(gasSpentNum)) {
              feeEth = ((gasPriceNum * gasSpentNum) / 1e18).toFixed(6);
            }
            setDetails({
              blockNumber: cov.blockHeight,
              gasUsed: cov.gasSpent,
              effectiveGasPriceGwei: gwei,
              feeEth,
              timestamp: cov.blockSignedAt
                ? new Date(cov.blockSignedAt).toLocaleString()
                : undefined,
            });
            // Map status from Covalent response
            setStatusOverride(cov.success ? 'confirmed' : 'failed');
          } else {
            setDetails(null);
          }
          setLoadingDetails(false);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('[TransactionStatus][covalentTx][error]', e);
        if (!cancelled) setLoadingDetails(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hash, detectedChainId]);

  // Detect chain by probing configured RPCs once per tx hash
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (const chain of supportedChains) {
          if (!chain.rpcHttpUrl) continue;
          try {
            const p = new JsonRpcProvider(chain.rpcHttpUrl, chain.chainId);
            const r = await p.getTransactionReceipt(hash);
            if (r) {
              if (!cancelled) {
                setDetectedChainId(chain.chainId);
                setDetectedChainName(chain.name);
                // Attempt to detect ERC-20 transfer and resolve token icon from bundled lists
                try {
                  const transferTopic =
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
                  const log = (r as any)?.logs?.find(
                    (l: any) =>
                      l?.topics?.[0]?.toLowerCase?.() === transferTopic,
                  );
                  const tokenAddr: string | undefined = log?.address;
                  if (tokenAddr) {
                    const lower = tokenAddr.toLowerCase();
                    let logo: string | null = null;
                    if (chain.chainId === 1) {
                      const t = ETHEREUM_TOKEN_LIST.tokens.find(
                        x => x.address.toLowerCase() === lower,
                      );
                      logo = t?.logoURI || null;
                    } else if (chain.chainId === 56) {
                      const t = BSC_TOKEN_LIST.tokens.find(
                        x => x.address.toLowerCase() === lower,
                      );
                      logo = t?.logoURI || null;
                    } else if (chain.chainId === 137) {
                      const t = POLYGON_TOKEN_LIST.tokens.find(
                        x => x.address.toLowerCase() === lower,
                      );
                      logo = t?.logoURI || null;
                    }
                    if (logo) setTokenLogoUri(logo);
                  } else {
                    setTokenLogoUri(null);
                  }
                } catch {}
              }
              break;
            }
          } catch {}
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [hash]);

  // Persist status changes to local storage
  useEffect(() => {
    (async () => {
      try {
        const walletId = await walletStorage.getCurrentWalletId();
        if (!walletId) return;
        await transactionStorage.updateStatus(walletId, hash, status);
      } catch {}
    })();
  }, [hash, status]);

  const statusText = useMemo(() => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  }, [status]);

  const statusChipStyle = useMemo(() => {
    switch (status) {
      case 'confirmed':
        return {
          bg: colors.status.successBackground,
          border: colors.status.successBorder,
          text: colors.status.success,
        } as const;
      case 'failed':
        return {
          bg: colors.status.errorBackground,
          border: colors.status.errorBorder,
          text: colors.status.error,
        } as const;
      default:
        return {
          bg: colors.status.warningBackground,
          border: colors.status.warningBorder,
          text: colors.status.warning,
        } as const;
    }
  }, [status, colors]);

  const handleOpenExplorer = async () => {
    const getExplorerBaseForChainId = (id: number) => {
      switch (id) {
        case 1:
          return 'https://etherscan.io/tx/';
        case 56:
          return 'https://bscscan.com/tx/';
        case 137:
          return 'https://polygonscan.com/tx/';
        default:
          return 'https://etherscan.io/tx/';
      }
    };

    if (!detectedChainId) {
      // Fallback: probe quickly if not yet detected
      for (const chain of supportedChains) {
        if (!chain.rpcHttpUrl) continue;
        try {
          const provider = new JsonRpcProvider(chain.rpcHttpUrl, chain.chainId);
          const receipt = await provider.getTransactionReceipt(hash);
          if (receipt) {
            setDetectedChainId(chain.chainId);
            setDetectedChainName(chain.name);
            break;
          }
        } catch {}
      }
    }

    const base = getExplorerBaseForChainId(detectedChainId || 1);
    Linking.openURL(`${base}${hash}`).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={styles.content}>
        <View style={styles.chipRow}>
          <View
            style={[
              styles.chip,
              {
                backgroundColor: statusChipStyle.bg,
                borderColor: statusChipStyle.border,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: statusChipStyle.text }]}>
              {statusText}
            </Text>
          </View>
          {detectedChainName ? (
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: colors.text.secondary }]}>
                {detectedChainName}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.amountRow}>
          {tokenLogoUri ? (
            <Image source={{ uri: tokenLogoUri }} style={styles.tokenIcon} />
          ) : null}
          <Text style={[styles.amount, { color: colors.text.primary }]}>
            {amount} {symbol}
          </Text>
        </View>
        <View style={styles.hashRow}>
          <Text style={[styles.hash, { color: colors.text.tertiary }]}>
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Confirmations
          </Text>
          <Text style={[styles.value, { color: colors.text.primary }]}>
            {confirmations} / {targetConfirmations} ({remainingConfirmations}{' '}
            left)
          </Text>
        </View>
        <View
          style={[
            styles.separator,
            { borderBottomColor: colors.border.primary },
          ]}
        />
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Block
          </Text>
          {loadingDetails ? (
            <View
              style={[
                styles.skeleton,
                { backgroundColor: colors.background.card },
              ]}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {details?.blockNumber ?? '-'}
            </Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Gas Used
          </Text>
          {loadingDetails ? (
            <View
              style={[
                styles.skeleton,
                { backgroundColor: colors.background.card },
              ]}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {details?.gasUsed ?? '-'}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.separator,
            { borderBottomColor: colors.border.primary },
          ]}
        />
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Gas Price
          </Text>
          {loadingDetails ? (
            <View
              style={[
                styles.skeleton,
                { backgroundColor: colors.background.card },
              ]}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {details?.effectiveGasPriceGwei
                ? `${details.effectiveGasPriceGwei} Gwei`
                : '-'}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.separator,
            { borderBottomColor: colors.border.primary },
          ]}
        />
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Fee
          </Text>
          {loadingDetails ? (
            <View
              style={[
                styles.skeleton,
                { backgroundColor: colors.background.card },
              ]}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {details?.feeEth ? `${details.feeEth} ETH` : '-'}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.separator,
            { borderBottomColor: colors.border.primary },
          ]}
        />
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Timestamp
          </Text>
          {loadingDetails ? (
            <View
              style={[
                styles.skeleton,
                { backgroundColor: colors.background.card },
              ]}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {details?.timestamp ?? '-'}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.separator,
            { borderBottomColor: colors.border.primary },
          ]}
        />
        {/* Elapsed row removed as requested */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.interactive.primary },
            ]}
            onPress={handleOpenExplorer}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.buttonText, { color: colors.background.primary }]}
            >
              View on Explorer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonSecondary,
              { borderColor: colors.border.primary },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.text.primary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingVertical: 12 },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 10,
  },
  chipText: { fontSize: 12, fontWeight: '700' },
  amount: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hash: { fontSize: 12, marginBottom: 12 },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tokenIcon: { width: 16, height: 16, borderRadius: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  separator: {
    borderBottomWidth: 1,
    marginHorizontal: 1,
    opacity: 0.7,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
  skeleton: {
    width: 120,
    height: 14,
    borderRadius: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: { fontSize: 14, fontWeight: '600' },
});

export default TransactionStatusScreen;
