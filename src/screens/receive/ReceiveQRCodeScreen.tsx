import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  TextInput,
} from 'react-native';
import { styles } from './ReceiveQRCodeScreen.styles';
import { useColors } from '../../utils/theme';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/types';
import QRCodeStyled from 'react-native-qrcode-styled';
import { ClipboardUtils } from '../../utils/clipboard';

type RouteProps = RouteProp<HomeStackParamList, 'ReceiveQR'>;

const getStandard = (
  chainId: number,
): 'ERC20' | 'BEP20' | 'Polygon' | 'Unknown' => {
  switch (chainId) {
    case 1:
      return 'ERC20';
    case 56:
      return 'BEP20';
    case 137:
      return 'Polygon';
    default:
      return 'Unknown';
  }
};

export const ReceiveQRCodeScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProps>();
  const { token, address } = params;
  const [amountVisible, setAmountVisible] = React.useState(false);
  const [amount, setAmount] = React.useState('');

  const qrValue = useMemo(() => {
    // Basic amount embedding convention (no chain-specific prefix for now)
    return amount ? `${address}?amount=${amount}` : address;
  }, [address, amount]);

  const onShare = async () => {
    try {
      const symbol = (token as any)?.name || token?.symbol || '';
      const message = `My Public Address to Receive ${symbol} :\n${address}`;
      await Share.share({ message });
    } catch {}
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Warning banner */}
      <View
        style={[
          styles.warning,
          { backgroundColor: '#F8E7B4', borderColor: '#E3C66C' },
        ]}
      >
        <Text style={[styles.warningText, { color: '#7C5B00' }]}>
          Only send {token.name} ({getStandard(token.chainId)}) assets to this
          address. Other assets will be lost forever.
        </Text>
      </View>

      {/* Token header */}
      <View style={styles.headerBlock}>
        <Text style={[styles.tokenName, { color: colors.text.primary }]}>
          {token.name}
        </Text>
        <View style={[styles.chip, { borderColor: colors.border.primary }]}>
          <Text style={[styles.chipText, { color: colors.text.secondary }]}>
            {getStandard(token.chainId)}
          </Text>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrWrapper}>
        <QRCodeStyled
          data={qrValue}
          size={260}
          padding={16}
          pieceCornerType="rounded"
          color="#000000"
          outerEyesOptions={{
            topLeft: { borderRadius: 18 },
            topRight: { borderRadius: 18 },
            bottomLeft: { borderRadius: 18 },
          }}
          innerEyesOptions={{
            color: '#F97316',
            borderRadius: 8,
          }}
          logo={{
            href: require('../../assets/app_new_icon_dapp.png'),
            padding: 1,
            scale: 1.1,
            hidePieces: true,
            opacity: 0.8,
          }}
          style={{ backgroundColor: '#FFFFFF', borderRadius: 10 }}
        />
      </View>

      {/* Address */}
      <Text style={[styles.address, { color: colors.text.secondary }]}>
        {address}
      </Text>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.primary,
            },
          ]}
          onPress={() => ClipboardUtils.showWalletAddress(address)}
        >
          <Text style={{ color: colors.text.primary }}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.primary,
            },
          ]}
          onPress={() => setAmountVisible(true)}
        >
          <Text style={{ color: colors.text.primary }}>Set Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.primary,
            },
          ]}
          onPress={onShare}
        >
          <Text style={{ color: colors.text.primary }}>Share</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={amountVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <View
            style={{
              width: '80%',
              borderRadius: 12,
              padding: 16,
              backgroundColor: colors.background.primary,
              borderWidth: 1,
              borderColor: colors.border.primary,
            }}
          >
            <Text style={{ marginBottom: 8, color: colors.text.primary }}>
              Enter amount
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={colors.text.tertiary}
              value={amount}
              onChangeText={setAmount}
              style={{
                borderWidth: 1,
                borderColor: colors.border.primary,
                borderRadius: 8,
                paddingHorizontal: 12,
                height: 44,
                color: colors.text.primary,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
                gap: 12,
              }}
            >
              <TouchableOpacity onPress={() => setAmountVisible(false)}>
                <Text style={{ color: colors.text.secondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAmountVisible(false)}>
                <Text style={{ color: colors.interactive.primary }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReceiveQRCodeScreen;
