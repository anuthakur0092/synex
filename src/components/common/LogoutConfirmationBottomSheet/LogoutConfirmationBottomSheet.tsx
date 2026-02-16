import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { useColors } from '../../../utils/theme';
import { Button } from '../Button';
import { styles } from './LogoutConfirmationBottomSheet.styles';

export interface LogoutConfirmationBottomSheetProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmationBottomSheet: React.FC<
  LogoutConfirmationBottomSheetProps
> = ({ visible, onConfirm, onCancel }) => {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      presentationStyle="overFullScreen"
      hardwareAccelerated
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onCancel} />
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
            Confirm Logout
          </Text>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Are you sure you want to log out? You'll need to import your wallet
            again to access your funds.
          </Text>

          <Text style={[styles.warning, { color: colors.status.warning }]}>
            Make sure you have your seed phrase or private key saved before
            logging out.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={styles.cancelButton}
            />

            <Button
              title="Log Out"
              variant="primary"
              onPress={onConfirm}
              style={[
                styles.logoutButton,
                { backgroundColor: colors.status.error },
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
