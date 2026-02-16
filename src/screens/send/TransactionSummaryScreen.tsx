import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColors } from '../../utils/theme';
import { SendStackParamList } from '../../navigation/SendStack';

import { TransactionService } from '../../services/transaction/transactionService';
import { walletStorage } from '../../services/storage/walletStorage';
import Toast from 'react-native-simple-toast';
import { usePrice } from '../../hooks/usePrice';
import { supportedChains } from '../../utils/config/chains';
import { fetchErc20MarketData } from '../../services/api/prices';
import { transactionStorage } from '../../services/storage/transactionStorage';

type NavigationProp = NativeStackNavigationProp<
  SendStackParamList,
  'TransactionSummary'
>;
type RouteProps = RouteProp<SendStackParamList, 'TransactionSummary'>;

interface GasOption {
  label: string;
  speed: 'slow' | 'standard' | 'fast';
  estimatedTime: string;
  gasPrice: string; // in Gwei
  gasLimit: string;
  totalGasFee: string; // in ETH
  totalGasFeeUsd: string;
}

export const TransactionSummaryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const colors = useColors();
  const { token, toAddress, amount, usdValue } = route.params;
  const { ethPrice } = usePrice();

  const [selectedGasOption, setSelectedGasOption] = useState<
    'slow' | 'standard' | 'fast'
  >('standard');
  const [gasOptions, setGasOptions] = useState<GasOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [estimatingGas, setEstimatingGas] = useState(true);
  const [sending, setSending] = useState(false);
  const [fromAddress, setFromAddress] = useState<string | null>(null);
  const [amountUsd, setAmountUsd] = useState<string>(usdValue || '0.00');

  useEffect(() => {
    estimateGasFees();
  }, []);

  const estimateGasFees = async () => {
    try {
      setEstimatingGas(true);

      // Get current wallet
      const currentWalletId = await walletStorage.getCurrentWalletId();
      if (!currentWalletId) {
        throw new Error('No wallet found');
      }

      const metadata = await walletStorage.getWalletMetadata(currentWalletId);
      if (!metadata) {
        throw new Error('No wallet metadata');
      }
      setFromAddress(metadata.address);

      // Estimate gas for the transaction
      const gasEstimates = await TransactionService.estimateGasFees(
        metadata.address,
        toAddress,
        amount,
        token,
      );

      setGasOptions(gasEstimates);
    } catch (error) {
      console.error('Error estimating gas:', error);
      Alert.alert('Error', 'Failed to estimate gas fees. Please try again.');
    } finally {
      setEstimatingGas(false);
      setLoading(false);
    }
  };

  // Resolve amount USD using live price if missing
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const qty = parseFloat(amount);
        if (!Number.isFinite(qty) || qty <= 0) return;
        if (token.symbol === 'ETH' && (token.chainId ?? 1) === 1) {
          if (ethPrice != null && mounted)
            setAmountUsd((qty * ethPrice).toFixed(2));
          return;
        }
        const market = await fetchErc20MarketData(token.chainId || 1, [
          token.contractAddress,
        ]);
        const price = market[token.contractAddress.toLowerCase()]?.price;
        if (mounted && Number.isFinite(price))
          setAmountUsd((qty * (price as number)).toFixed(2));
      } catch (_e) {}
    })();
    return () => {
      mounted = false;
    };
  }, [amount, token.contractAddress, token.symbol, ethPrice]);

  const handleConfirm = async () => {
    try {
      setSending(true);

      const selectedGas = gasOptions.find(
        opt => opt.speed === selectedGasOption,
      );
      if (!selectedGas) {
        throw new Error('Gas option not found');
      }

      // Get current wallet
      const currentWalletId = await walletStorage.getCurrentWalletId();
      if (!currentWalletId) {
        throw new Error('No wallet found');
      }

      // Get stored password from keychain
      const password = await walletStorage.getStoredPassword(currentWalletId);
      if (!password) {
        throw new Error('Wallet password not found');
      }

      // Send transaction
      const txHash = await TransactionService.sendTransaction(
        currentWalletId,
        password,
        toAddress,
        amount,
        token,
        selectedGas,
      );

      Toast.show('Transaction sent successfully!', Toast.LONG);

      // Persist locally
      await transactionStorage.add(currentWalletId, {
        hash: txHash,
        walletId: currentWalletId,
        from: fromAddress || '',
        to: toAddress,
        amount,
        symbol: token.symbol,
        usdValue: amountUsd,
        gasPriceGwei: selectedGas.gasPrice,
        gasLimit: selectedGas.gasLimit,
        networkFeeEth: selectedGas.totalGasFee,
        networkFeeUsd: selectedGas.totalGasFeeUsd,
        speed: selectedGas.speed,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });

      // Navigate to live status page with initial pending status to avoid UI flicker
      (navigation as any).navigate('TransactionStatus', {
        tx: { hash: txHash, amount, symbol: token.symbol, status: 'pending' },
      });

      // Navigate back to home
      // Keep the status view; don't pop immediately
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      const friendly = (() => {
        const raw = String(error?.message || '');
        // Common underpriced gas pattern (EIP-1559 and legacy)
        if (/gas\s+price\s+below\s+minimum/i.test(raw)) {
          // Try to extract minimum needed (wei) and present as gwei
          const m = raw.match(/minimum\s+needed\s+(\d+)/i);
          const minWei = m && m[1] ? Number(m[1]) : NaN;
          const minGwei = Number.isFinite(minWei)
            ? (minWei / 1e9).toFixed(2)
            : null;
          return `Gas price too low for Polygon. ${
            minGwei ? `Minimum required ~${minGwei} Gwei. ` : ''
          }Please choose a higher gas option (Standard/Fast) and try again.`;
        }
        if (/insufficient\s+funds/i.test(raw)) {
          return 'Insufficient POL for network fees. Deposit a small amount of POL and try again.';
        }
        if (
          /replacement\s+fee\s+too\s+low/i.test(raw) ||
          /underpriced/i.test(raw)
        ) {
          return 'There is a pending transaction with a similar nonce. Increase the gas fee and try again.';
        }
        return (
          error?.message ||
          'Transaction failed. Please try again with a higher gas fee or try later.'
        );
      })();

      Alert.alert('Transaction Failed', friendly);
    } finally {
      setSending(false);
    }
  };

  const getSelectedGasOption = () => {
    return gasOptions.find(opt => opt.speed === selectedGasOption);
  };

  const totalAmount = parseFloat(amount);
  const selectedGas = getSelectedGasOption();
  const totalGasInEth = selectedGas ? parseFloat(selectedGas.totalGasFee) : 0;
  const nativeSymbol = (() => {
    const chain = supportedChains.find(c => c.chainId === (token.chainId || 1));
    // Polygon native token rebrand: display POL instead of MATIC on this screen
    if (chain?.chainId === 137) return 'POL';
    return chain?.symbol || 'ETH';
  })();
  const totalCost =
    token.symbol === nativeSymbol ? totalAmount + totalGasInEth : totalGasInEth;
  const totalCostUsd =
    token.symbol === nativeSymbol
      ? (
          parseFloat(usdValue) + parseFloat(selectedGas?.totalGasFeeUsd || '0')
        ).toFixed(2)
      : selectedGas?.totalGasFeeUsd || '0';

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction Details */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Transaction Details
          </Text>

          <View style={styles.detailRow}>
            <Text
              style={[styles.detailLabel, { color: colors.text.secondary }]}
            >
              From
            </Text>
            <Text style={[styles.detailValue, { color: colors.text.primary }]}>
              {fromAddress
                ? `${fromAddress.slice(0, 6)}...${fromAddress.slice(-4)}`
                : ''}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[styles.detailLabel, { color: colors.text.secondary }]}
            >
              To
            </Text>
            <Text style={[styles.detailValue, { color: colors.text.primary }]}>
              {`${toAddress.slice(0, 6)}...${toAddress.slice(-4)}`}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[styles.detailLabel, { color: colors.text.secondary }]}
            >
              Amount
            </Text>
            <View style={styles.amountColumn}>
              <Text
                style={[styles.detailValue, { color: colors.text.primary }]}
              >
                {amount} {token.symbol}
              </Text>
              <Text
                style={[styles.detailValueUsd, { color: colors.text.tertiary }]}
              >
                ${amountUsd}
              </Text>
            </View>
          </View>
        </View>

        {/* Gas Options */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Network Fee
          </Text>

          {estimatingGas ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="small"
                color={colors.interactive.primary}
              />
              <Text
                style={[styles.loadingText, { color: colors.text.secondary }]}
              >
                Estimating gas fees...
              </Text>
            </View>
          ) : (
            <View style={styles.gasOptions}>
              {gasOptions.map(option => (
                <TouchableOpacity
                  key={option.speed}
                  style={[
                    styles.gasOption,
                    {
                      borderColor:
                        selectedGasOption === option.speed
                          ? colors.interactive.primary
                          : colors.border.secondary,
                      backgroundColor:
                        selectedGasOption === option.speed
                          ? colors.background.tertiary
                          : 'transparent',
                    },
                  ]}
                  onPress={() => setSelectedGasOption(option.speed)}
                  activeOpacity={0.7}
                >
                  <View style={styles.gasOptionHeader}>
                    <Text
                      style={[styles.gasLabel, { color: colors.text.primary }]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[styles.gasTime, { color: colors.text.secondary }]}
                    >
                      {option.estimatedTime}
                    </Text>
                  </View>
                  <View style={styles.gasOptionFooter}>
                    <Text
                      style={[
                        styles.gasPrice,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {option.gasPrice} Gwei
                    </Text>
                    <Text
                      style={[styles.gasFee, { color: colors.text.primary }]}
                    >
                      {option.totalGasFee} {nativeSymbol}
                    </Text>
                  </View>
                  <Text
                    style={[styles.gasFeeUsd, { color: colors.text.tertiary }]}
                  >
                    ${option.totalGasFeeUsd}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Total Cost */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text.primary }]}>
              Total Cost
            </Text>
            <View style={styles.amountColumn}>
              <Text style={[styles.totalValue, { color: colors.text.primary }]}>
                {token.symbol === nativeSymbol
                  ? `${totalCost.toFixed(6)} ${nativeSymbol}`
                  : `${totalGasInEth.toFixed(6)} ${nativeSymbol}`}
              </Text>
              <Text
                style={[styles.totalValueUsd, { color: colors.text.secondary }]}
              >
                ${totalCostUsd}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                !estimatingGas && !sending
                  ? colors.interactive.primary
                  : colors.background.tertiary,
            },
          ]}
          onPress={handleConfirm}
          disabled={estimatingGas || sending}
          activeOpacity={0.7}
        >
          {sending ? (
            <ActivityIndicator color={colors.background.primary} />
          ) : (
            <Text
              style={[
                styles.confirmButtonText,
                {
                  color: !estimatingGas
                    ? colors.background.primary
                    : colors.text.tertiary,
                },
              ]}
            >
              Confirm
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountColumn: {
    alignItems: 'flex-end',
  },
  detailValueUsd: {
    fontSize: 12,
    marginTop: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  gasOptions: {
    gap: 12,
  },
  gasOption: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  gasOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gasLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  gasTime: {
    fontSize: 12,
  },
  gasOptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gasPrice: {
    fontSize: 12,
  },
  gasFee: {
    fontSize: 14,
    fontWeight: '500',
  },
  gasFeeUsd: {
    fontSize: 12,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValueUsd: {
    fontSize: 14,
    marginTop: 2,
  },
  buttonContainer: {
    padding: 20,
  },
  confirmButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
