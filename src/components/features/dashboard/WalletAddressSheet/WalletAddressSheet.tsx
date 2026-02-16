import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import { styles } from './WalletAddressSheet.styles';
import { useColors } from '../../../../utils/theme';
import { supportedChains } from '../../../../utils/config/chains';
import { ClipboardUtils } from '../../../../utils/clipboard';

export interface WalletAddressSheetProps {
  visible: boolean;
  address?: string | null;
  onClose: () => void;
}

const getChainIcon = (id: 'ethereum' | 'bsc' | 'polygon') => {
  const chain = supportedChains.find(c => c.id === id);
  return chain?.icon;
};

const shorten = (addr?: string | null): string => {
  if (!addr) return '';
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const WalletAddressSheet: React.FC<WalletAddressSheetProps> = ({
  visible,
  address,
  onClose,
}) => {
  const colors = useColors();

  const renderRow = (params: {
    key: 'ethereum' | 'bsc' | 'polygon';
    label: string;
    showCopy: true;
  }) => {
    const icon = getChainIcon(params.key);
    const canCopy = (params as any).showCopy === true && Boolean(address);
    return (
      <View
        style={[
          styles.row,
          {
            borderColor: colors.border.primary,
            backgroundColor: colors.surface.primary,
          },
        ]}
      >
        <View style={styles.rowLeft}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.surface.secondary },
            ]}
          >
            {icon ? (
              <Image source={icon} style={styles.chainIcon} />
            ) : (
              <Text
                style={[styles.chainFallback, { color: colors.text.secondary }]}
              >
                ◎
              </Text>
            )}
          </View>
          <View style={styles.rowTextBlock}>
            <Text style={[styles.rowTitle, { color: colors.text.primary }]}>
              {params.label}
            </Text>
            <Text
              style={[styles.addressText, { color: colors.text.secondary }]}
            >
              {shorten(address)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Copy ${params.label}`}
          onPress={async () => {
            if (address) await ClipboardUtils.showWalletAddress(address);
          }}
          activeOpacity={0.7}
          style={[
            styles.copyButton,
            { backgroundColor: colors.interactive.primary },
          ]}
          disabled={!canCopy}
        >
          <Text style={[styles.copyText, { color: colors.text.inverse }]}>
            Copy
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      hardwareAccelerated
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            My Wallet Address
          </Text>

          {renderRow({
            key: 'ethereum',
            label: 'Ethereum Address',
            showCopy: true,
          })}
          {renderRow({
            key: 'bsc',
            label: 'BNB Smart Chain Address',
            showCopy: true,
          })}
          {renderRow({
            key: 'polygon',
            label: 'Polygon Address',
            showCopy: true,
          })}

          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.close, { color: colors.interactive.primary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WalletAddressSheet;
