import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './receiveTokenRow.styles';
import { useColors } from '../../../../utils/theme';
import { TokenConfig } from '../../../../utils/types/token.types';
import { supportedChains } from '../../../../utils/config/chains';
import { ClipboardUtils } from '../../../../utils/clipboard';
import QrIcon from '../../../../assets/receive/qr.svg';
import CopyIcon from '../../../../assets/receive/copy.svg';

interface Props {
  token: TokenConfig;
  address: string;
  onPress: () => void;
}

const chainChipText = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum';
    case 56:
      return 'BNB Smart Chain';
    default:
      return String(chainId);
  }
};

export const ReceiveTokenRow: React.FC<Props> = ({
  token,
  address,
  onPress,
}) => {
  const colors = useColors();
  const chain = supportedChains.find(c => c.chainId === token.chainId);

  const shortened = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: colors.border.primary }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.left}>
        {/* Token Logo */}
        <View>
          {token.logoURI ? (
            <Image source={{ uri: token.logoURI }} style={styles.logo} />
          ) : chain?.icon ? (
            <Image source={chain.icon} style={styles.logo} />
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: colors.surface.secondary },
              ]}
            />
          )}
          {chain?.icon && (
            <Image source={chain.icon} style={styles.chainBadge} />
          )}
        </View>
        <View style={styles.texts}>
          <View style={styles.nameLine}>
            <Text style={[styles.name, { color: colors.text.primary }]}>
              {token.name}
            </Text>
            <View
              style={[styles.chainChip, { borderColor: colors.border.primary }]}
            >
              <Text
                style={[styles.chainChipText, { color: colors.text.secondary }]}
              >
                {chainChipText(token.chainId)}
              </Text>
            </View>
          </View>
          <Text style={[styles.address, { color: colors.text.secondary }]}>
            {shortened}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onPress}
          accessibilityLabel="Show QR"
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.primary,
            },
          ]}
        >
          <QrIcon width={18} height={18} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => ClipboardUtils.showWalletAddress(address)}
          accessibilityLabel="Copy address"
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.primary,
            },
          ]}
        >
          <CopyIcon width={18} height={18} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ReceiveTokenRow;
