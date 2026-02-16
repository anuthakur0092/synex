import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { styles } from './WalletSetupScreen.styles';

const { width, height } = Dimensions.get('window');

interface WalletSetupScreenProps {
  onImportWallet?: () => void;
  onCreateWallet?: () => void;
}

export const WalletSetupScreen: React.FC<WalletSetupScreenProps> = ({
  onImportWallet,
  onCreateWallet,
}) => {
  return (
    <View style={styles.container}>
      {/* Background with curved elements */}
      <View style={styles.background}>
        {/* Top curved element */}
        <View style={styles.topCurve} />

        {/* Bottom curved element */}
        <View style={styles.bottomCurve} />

        {/* Additional decorative curves */}
        <View style={styles.decorativeCurve1} />
        <View style={styles.decorativeCurve2} />
        <View style={styles.decorativeCurve3} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../../assets/app_new_logo_black.png')}
            style={{ width: 200, height: 80 }}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Import Wallet Button */}
          <TouchableOpacity
            style={styles.importButton}
            onPress={onImportWallet}
            activeOpacity={0.8}
          >
            <Text style={styles.importButtonText}>
              Import Using Seed Phrase or PVT Key
            </Text>
          </TouchableOpacity>

          {/* Create Wallet Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateWallet}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>Create a New Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
