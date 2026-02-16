import React from 'react';
import { Alert, View, Text } from 'react-native';
import { useColors } from '../../utils/theme';
import {
  Camera,
  useCameraPermission,
  useCodeScanner,
  useCameraDevice,
} from 'react-native-vision-camera';
import {
  pairWithUri,
  getWalletConnectClient,
} from '../../services/walletconnect/client';
import { useWallet } from '../../hooks/useWallet';
import { styles } from './WalletConnectScanScreen.styles';

export const WalletConnectScanScreen: React.FC = () => {
  const colors = useColors();
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = React.useRef<Camera>(null);
  const [isPairing, setIsPairing] = React.useState(false);
  const { address } = useWallet();
  const device = useCameraDevice('back');

  const [isActive, setIsActive] = React.useState(true);
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (!isActive || isPairing) return;
      const value = codes?.[0]?.value?.trim();
      if (!value) return;
      if (value.startsWith('wc:')) {
        setIsActive(false);
        setIsPairing(true);
        pairWithUri(value)
          .then(() => {
            // Pairing initiated; approval handled by global handler
          })
          .catch(e => {
            Alert.alert(
              'WalletConnect',
              'Failed to pair: ' + (e?.message || e),
            );
          })
          .finally(() => {
            setIsPairing(false);
            setIsActive(true);
          });
      }
    },
  });

  React.useEffect(() => {
    (async () => {
      if (!hasPermission) await requestPermission();
    })();
  }, [hasPermission, requestPermission]);

  // scanning handled in codeScanner callback

  // Session proposals are handled globally in useWalletConnect hook

  if (!hasPermission) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Text style={{ color: colors.text.primary }}>
          Camera permission is required.
        </Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Text style={{ color: colors.text.primary }}>
          No camera device found. Try a physical device or enable an emulator
          camera.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        isActive={isActive}
        device={device}
        codeScanner={codeScanner}
      />
    </View>
  );
};
