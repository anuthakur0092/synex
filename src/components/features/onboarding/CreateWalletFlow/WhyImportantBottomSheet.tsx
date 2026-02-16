import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { styles } from './WhyImportantBottomSheet.styles';

interface WhyImportantBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const WhyImportantBottomSheet: React.FC<
  WhyImportantBottomSheetProps
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
            Why is it important?
          </Text>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Don't risk losing your funds. Protect your wallet by saving your
            seed phrase in a place you trust.
          </Text>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            It's the only way to recover your wallet if you get locked out of
            the app or get a new device.
          </Text>

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
              I Got it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
