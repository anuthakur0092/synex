import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { Button } from '../../../common/Button';
import {
  walletConnectRequestEvent,
  WalletConnectUIRequest,
} from '../../../../services/walletconnect/events';
import { decodeEthSendTransaction } from '../../../../services/walletconnect/decoder';
import { supportedChains } from '../../../../utils/config/chains';
import { dimensions, spacing } from '../../../../utils/constants';

interface RequestSheetProps {}

export const RequestSheet: React.FC<RequestSheetProps> = () => {
  const colors = useColors();
  const [visible, setVisible] = React.useState(false);
  const [request, setRequest] = React.useState<WalletConnectUIRequest | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<null | 'success' | 'error'>(null);
  const [decodedSummary, setDecodedSummary] = React.useState<{
    title: string;
    lines: string[];
  } | null>(null);

  React.useEffect(() => {
    const unsub = walletConnectRequestEvent.subscribe(req => {
      setRequest(req);
      setStatus(null);
      setLoading(false);
      setVisible(true);
    });
    return unsub;
  }, []);

  // Decode summary for tx requests outside of render to avoid hook-order issues
  React.useEffect(() => {
    (async () => {
      if (!request) {
        setDecodedSummary(null);
        return;
      }
      try {
        if (request.method === 'eth_sendTransaction') {
          const tx = request.params?.[0] || {};
          const dec = await decodeEthSendTransaction(tx, request.chainId);
          setDecodedSummary(dec);
        } else {
          setDecodedSummary(null);
        }
      } catch (_e) {
        setDecodedSummary(null);
      }
    })();
  }, [request?.id, request?.method, request?.chainId, request?.params]);

  const onClose = () => {
    if (loading) return;
    setVisible(false);
    setRequest(null);
  };

  const handleApprove = async () => {
    if (!request) return;
    setLoading(true);
    const { error } = await request.approve();
    setStatus(error ? 'error' : 'success');
    setLoading(false);
    setTimeout(onClose, 900);
  };

  const handleReject = async () => {
    if (!request) return;
    setLoading(true);
    await request.reject();
    setLoading(false);
    setVisible(false);
    setRequest(null);
  };

  const getRequestTypeIcon = () => {
    if (!request) return null;

    switch (request.method) {
      case 'personal_sign':
      case 'eth_sign':
        return '✍️';
      case 'eth_sendTransaction':
        return '💸';
      default:
        return '🔗';
    }
  };

  const getRequestTypeColor = () => {
    if (!request) return colors.interactive.primary;

    switch (request.method) {
      case 'personal_sign':
      case 'eth_sign':
        return colors.status.warning;
      case 'eth_sendTransaction':
        return colors.status.info;
      default:
        return colors.interactive.primary;
    }
  };

  const renderTransactionDetails = () => {
    if (!request || request.method !== 'eth_sendTransaction') return null;

    const tx = request.params?.[0] || {};
    const summary = decodedSummary;

    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Transaction Details</Text>
        <View style={styles.detailsContent}>
          {summary?.lines?.map((line, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{line.split(':')[0]}:</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {line.split(':').slice(1).join(':')}
              </Text>
            </View>
          )) || (
            <>
              {tx.to && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>To:</Text>
                  <Text style={styles.detailValue} numberOfLines={2}>
                    {tx.to}
                  </Text>
                </View>
              )}
              {tx.value && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Value:</Text>
                  <Text style={styles.detailValue}>{tx.value} wei</Text>
                </View>
              )}
              {tx.data && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Data:</Text>
                  <Text style={styles.detailValue} numberOfLines={2}>
                    {String(tx.data).slice(0, 66)}...
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderMessageDetails = () => {
    if (
      !request ||
      (request.method !== 'personal_sign' && request.method !== 'eth_sign')
    )
      return null;

    const p0 = request.params[0];
    const p1 = request.params[1];
    const message =
      typeof p0 === 'string' && p0.startsWith('0x') && p0.length === 42
        ? p1
        : p0;
    const preview =
      typeof message === 'string' ? String(message).slice(0, 120) : '[object]';

    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Message to Sign</Text>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText} numberOfLines={6}>
            {preview}
          </Text>
        </View>
      </View>
    );
  };

  const renderChainInfo = () => {
    if (!request?.chainId) return null;

    const chain = supportedChains.find(c => c.id === request.chainId);

    return (
      <View style={styles.chainContainer}>
        {chain?.icon && <Image source={chain.icon} style={styles.chainIcon} />}
        <Text style={styles.chainText}>{request.chainId}</Text>
      </View>
    );
  };

  if (!request) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.container,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                { backgroundColor: colors.border.primary },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.requestTypeContainer}>
              <Text style={styles.requestTypeIcon}>{getRequestTypeIcon()}</Text>
              <View style={styles.requestTypeText}>
                <Text
                  style={[styles.requestType, { color: colors.text.primary }]}
                >
                  {decodedSummary?.title ||
                    (request.method === 'personal_sign' ||
                    request.method === 'eth_sign'
                      ? 'Sign Message'
                      : request.method === 'eth_sendTransaction'
                      ? 'Send Transaction'
                      : request.method || 'Unknown Request')}
                </Text>
                <Text
                  style={[
                    styles.requestMethod,
                    { color: colors.text.secondary },
                  ]}
                >
                  {request.method}
                </Text>
              </View>
            </View>
          </View>

          {/* DApp Info */}
          <View style={styles.dappContainer}>
            <View style={styles.dappInfo}>
              {request.dappIcon ? (
                <Image
                  source={{ uri: request.dappIcon }}
                  style={styles.dappIcon}
                />
              ) : (
                <View
                  style={[
                    styles.dappIconPlaceholder,
                    { backgroundColor: colors.border.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.dappIconPlaceholderText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {request.dappName?.charAt(0) || '?'}
                  </Text>
                </View>
              )}
              <View style={styles.dappText}>
                <Text style={[styles.dappName, { color: colors.text.primary }]}>
                  {request.dappName || 'Unknown DApp'}
                </Text>
              </View>
            </View>
            {renderChainInfo()}
          </View>

          {/* Request Details */}
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderTransactionDetails()}
            {renderMessageDetails()}
          </ScrollView>

          {/* Status */}
          {loading && (
            <View style={styles.statusContainer}>
              <ActivityIndicator
                color={colors.interactive.primary}
                size="small"
              />
              <Text
                style={[styles.statusText, { color: colors.text.secondary }]}
              >
                Processing request...
              </Text>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.statusContainer}>
              <Text
                style={[styles.statusText, { color: colors.status.success }]}
              >
                ✅ Request approved successfully
              </Text>
            </View>
          )}

          {status === 'error' && (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: colors.status.error }]}>
                ❌ Request failed
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Reject"
              variant="outline"
              onPress={handleReject}
              disabled={loading}
              style={styles.rejectButton}
            />
            <Button
              title="Approve"
              variant="primary"
              onPress={handleApprove}
              disabled={loading}
              style={styles.approveButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    borderTopLeftRadius: dimensions.borderRadius.xxl,
    borderTopRightRadius: dimensions.borderRadius.xxl,
    maxHeight: '90%' as any,
    marginBottom: spacing.md,
  },
  handleContainer: {
    alignItems: 'center' as const,
    paddingVertical: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  requestTypeContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  requestTypeIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  requestTypeText: {
    flex: 1,
  },
  requestType: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: spacing.xs,
  },
  requestMethod: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  dappContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dappInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  dappIcon: {
    width: dimensions.iconSize.lg,
    height: dimensions.iconSize.lg,
    borderRadius: dimensions.borderRadius.lg,
    marginRight: spacing.md,
  },
  dappIconPlaceholder: {
    width: dimensions.iconSize.lg,
    height: dimensions.iconSize.lg,
    borderRadius: dimensions.borderRadius.lg,
    marginRight: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dappIconPlaceholderText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  dappText: {
    flex: 1,
  },
  dappName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  chainContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: dimensions.borderRadius.md,
  },
  chainIcon: {
    width: dimensions.iconSize.sm,
    height: dimensions.iconSize.sm,
    borderRadius: dimensions.borderRadius.sm,
    marginRight: spacing.xs,
  },
  chainText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
  },
  detailsContainer: {
    marginBottom: spacing.lg,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: spacing.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  detailsContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: dimensions.borderRadius.md,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row' as const,
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    width: 80,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '400' as const,
    flex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: dimensions.borderRadius.md,
    padding: spacing.md,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statusContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginLeft: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxxl,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  rejectButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  approveButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
};
