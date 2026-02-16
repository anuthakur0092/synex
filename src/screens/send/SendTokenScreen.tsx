import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColors } from '../../utils/theme';
import { SendStackParamList } from '../../navigation/SendStack';

const ScanIcon = require('../../assets/icon/scan.png');
import { usePrice } from '../../hooks/usePrice';
import {
  fetchErc20MarketData,
  fetchNativeMarketData,
} from '../../services/api/prices';
import { useWallet } from '../../hooks/useWallet';
import { useBalance } from '../../hooks/useBalance';
import { fetchErc20BalancesOnce } from '../../services/api/balance';
import { walletStorage } from '../../services/storage/walletStorage';

type NavigationProp = NativeStackNavigationProp<
  SendStackParamList,
  'SendToken'
>;
type RouteProps = RouteProp<SendStackParamList, 'SendToken'>;

export const SendTokenScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const colors = useColors();
  const { token } = route.params;
  const { ethPrice } = usePrice();
  const { address } = useWallet();

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [usdValue, setUsdValue] = useState('0.00');
  const [addressError, setAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [tokenPrice, setTokenPrice] = useState<number | null>(() => {
    const initial = parseFloat(token.value.amount);
    return Number.isFinite(initial) && initial > 0 ? initial : null;
  });
  const [erc20Balance, setErc20Balance] = useState<string | null>(null);

  // Detect native coin vs ERC-20 by zero address
  const isZeroAddress =
    !token.contractAddress ||
    token.contractAddress.toLowerCase() ===
      '0x0000000000000000000000000000000000000000';

  // For native assets, reuse the same balance hook as dashboard (chain-aware)
  const { balanceEth } = useBalance({
    address,
    chainId: token.chainId || 1,
    subscribe: false,
  });

  // For ERC-20, fetch fresh balance the same way as dashboard
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!address || isZeroAddress || !token.contractAddress) return;
        const res = await fetchErc20BalancesOnce(
          address,
          [
            {
              address: token.contractAddress,
              decimals: token.balance.decimals,
            },
          ],
          { chainId: token.chainId || 1 },
        );
        if (!cancelled) {
          const val = res[token.contractAddress.toLowerCase()];
          if (typeof val === 'string') setErc20Balance(val);
        }
      } catch (_e) {
        if (!cancelled) setErc20Balance(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    address,
    token.contractAddress,
    token.balance.decimals,
    token.chainId,
    isZeroAddress,
  ]);

  const effectiveBalance: string = useMemo(() => {
    if (isZeroAddress) return balanceEth ?? token.balance.amount;
    return erc20Balance ?? token.balance.amount;
  }, [isZeroAddress, balanceEth, erc20Balance, token.balance.amount]);

  // Resolve token price (native via chain-aware API, ERC-20 via API) when screen mounts
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const sym = String(token.symbol || '').toUpperCase();
        // Determine effective chain id for pricing
        let effectiveChainId = token.chainId as number | undefined;
        if (effectiveChainId == null || effectiveChainId === 0) {
          try {
            const stored = await walletStorage.getSelectedChainId();
            effectiveChainId = stored == null ? 1 : stored === 0 ? 56 : stored;
          } catch {
            effectiveChainId = 1;
          }
        }

        // Native assets (ETH/BNB/MATIC) or zero-address tokens
        const isNative =
          isZeroAddress ||
          sym === 'ETH' ||
          sym === 'BNB' ||
          sym === 'MATIC' ||
          sym === 'POL';
        if (isNative) {
          // Prefer ETH hook when available
          if (sym === 'ETH' && ethPrice != null) {
            if (mounted) setTokenPrice(ethPrice);
          } else {
            try {
              const native = await fetchNativeMarketData(effectiveChainId || 1);
              if (mounted && native && Number.isFinite(native.price)) {
                setTokenPrice(native.price);
              }
            } catch (_e) {}
          }
        } else {
          // ERC-20 single-token price (chain-aware)
          try {
            const market = await fetchErc20MarketData(effectiveChainId || 1, [
              token.contractAddress,
            ]);
            const price = market[token.contractAddress.toLowerCase()]?.price;
            if (mounted && Number.isFinite(price))
              setTokenPrice(price as number);
          } catch (_e) {}
        }

        // Fallback retry after short delay if price still missing
        if (mounted && (tokenPrice == null || tokenPrice === 0)) {
          setTimeout(async () => {
            if (!mounted) return;
            try {
              if (isNative) {
                const native = await fetchNativeMarketData(
                  effectiveChainId || 1,
                );
                if (mounted && native && Number.isFinite(native.price)) {
                  setTokenPrice(native.price);
                }
              } else {
                const market = await fetchErc20MarketData(
                  effectiveChainId || 1,
                  [token.contractAddress],
                );
                const price =
                  market[token.contractAddress.toLowerCase()]?.price;
                if (mounted && Number.isFinite(price))
                  setTokenPrice(price as number);
              }
            } catch (_e) {}
          }, 1200);
        }
      } catch (_e) {}
    })();
    return () => {
      mounted = false;
    };
  }, [
    token.contractAddress,
    token.symbol,
    token.chainId,
    ethPrice,
    isZeroAddress,
  ]);

  // Calculate USD value when amount or price changes
  useEffect(() => {
    const amt = parseFloat(amount);
    if (amount && Number.isFinite(amt) && tokenPrice != null) {
      const usd = amt * tokenPrice;
      setUsdValue(usd.toFixed(2));
    } else {
      setUsdValue('0.00');
    }
  }, [amount, tokenPrice]);

  const handleMax = () => {
    setAmount(effectiveBalance || '0');
    setAmountError('');
  };

  const handleScan = () => {
    // TODO: Implement QR code scanning
    console.log('Scan QR code');
  };

  const validateAddress = (address: string) => {
    if (!address) {
      setAddressError('Address is required');
      return false;
    }

    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(address)) {
      setAddressError('Invalid Ethereum address');
      return false;
    }

    setAddressError('');
    return true;
  };

  const validateAmount = (value: string) => {
    if (!value || parseFloat(value) <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }

    if (parseFloat(value) > parseFloat(effectiveBalance || '0')) {
      setAmountError('Insufficient balance');
      return false;
    }

    setAmountError('');
    return true;
  };

  const handleNext = () => {
    const isAddressValid = validateAddress(toAddress);
    const isAmountValid = validateAmount(amount);

    if (isAddressValid && isAmountValid) {
      navigation.navigate('TransactionSummary', {
        token,
        toAddress,
        amount,
        usdValue,
      });
    }
  };

  const isFormValid = toAddress && amount && !addressError && !amountError;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* To Address Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              To
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: addressError
                    ? colors.status.error
                    : colors.border.secondary,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="Enter wallet address"
                placeholderTextColor={colors.text.tertiary}
                value={toAddress}
                onChangeText={text => {
                  setToAddress(text);
                  if (addressError) validateAddress(text);
                }}
                onBlur={() => validateAddress(toAddress)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScan}
                activeOpacity={0.7}
              >
                <Image
                  source={ScanIcon}
                  style={[
                    styles.scanIcon,
                    { tintColor: colors.interactive.primary },
                  ]}
                />
              </TouchableOpacity>
            </View>
            {addressError ? (
              <Text style={[styles.errorText, { color: colors.status.error }]}>
                {addressError}
              </Text>
            ) : null}
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Amount
              </Text>
              <Text style={[styles.balance, { color: colors.text.tertiary }]}>
                Balance: {parseFloat(effectiveBalance || '0').toFixed(4)}{' '}
                {token.symbol}
              </Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: amountError
                    ? colors.status.error
                    : colors.border.secondary,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="0.0"
                placeholderTextColor={colors.text.tertiary}
                value={amount}
                onChangeText={text => {
                  // Allow only numbers and decimal point
                  const filtered = text.replace(/[^0-9.]/g, '');
                  // Prevent multiple decimal points
                  const parts = filtered.split('.');
                  const formatted =
                    parts.length > 2
                      ? parts[0] + '.' + parts.slice(1).join('')
                      : filtered;
                  setAmount(formatted);
                  if (amountError && formatted) validateAmount(formatted);
                }}
                onBlur={() => amount && validateAmount(amount)}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={[
                  styles.maxButton,
                  {
                    backgroundColor: colors.interactive.primary,
                    borderColor: colors.border.focus,
                  },
                ]}
                onPress={handleMax}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.maxText, { color: colors.background.primary }]}
                >
                  MAX
                </Text>
              </TouchableOpacity>
            </View>
            {amountError ? (
              <Text style={[styles.errorText, { color: colors.status.error }]}>
                {amountError}
              </Text>
            ) : null}

            {/* USD Value */}
            <Text style={[styles.usdValue, { color: colors.text.tertiary }]}>
              ≈ ${usdValue} USD
            </Text>
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { marginBottom: 10 },
              {
                backgroundColor: isFormValid
                  ? colors.interactive.primary
                  : colors.background.tertiary,
              },
            ]}
            onPress={handleNext}
            disabled={!isFormValid}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.nextButtonText,
                {
                  color: isFormValid
                    ? colors.background.primary
                    : colors.text.tertiary,
                },
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balance: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  scanButton: {
    padding: 8,
    marginLeft: 8,
  },
  scanIcon: {
    width: 24,
    height: 24,
  },
  maxButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  maxText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  usdValue: {
    fontSize: 14,
    marginTop: 8,
  },
  buttonContainer: {
    padding: 20,
  },
  nextButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
