import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { styles } from './PasswordRecoveryBottomSheet.styles';

interface PasswordRecoveryBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PasswordRecoveryBottomSheet: React.FC<
  PasswordRecoveryBottomSheetProps
> = ({ isVisible, onClose }) => {
  const colors = useColors();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background.card || '#1a1a1a' },
          ]}
        >
          <View
            style={[styles.handle, { backgroundColor: colors.border.primary }]}
          />

          <Text style={[styles.title, { color: colors.text.primary }]}>
            Password Recovery
          </Text>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Oxylon Wallet cannot recover your password if you forget it. This is
            a security feature to protect your funds.
          </Text>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Your password is encrypted and stored locally on your device. We
            have no access to it, which means:
          </Text>

          <View style={styles.bulletPoints}>
            <Text
              style={[styles.bulletPoint, { color: colors.text.secondary }]}
            >
              • We cannot reset or recover your password
            </Text>
            <Text
              style={[styles.bulletPoint, { color: colors.text.secondary }]}
            >
              • If you forget it, you'll need to restore from your seed phrase
            </Text>
            <Text
              style={[styles.bulletPoint, { color: colors.text.secondary }]}
            >
              • Make sure to store your seed phrase securely as a backup
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.gotItButton,
              { backgroundColor: colors.interactive.primary },
            ]}
            onPress={onClose}
          >
            <Text
              style={[styles.gotItButtonText, { color: colors.text.inverse }]}
            >
              I Understand
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
