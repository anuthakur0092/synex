import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../utils/theme';
import { walletStorage } from '../../services/storage/walletStorage';

const { width } = Dimensions.get('window');

interface PINSetupScreenProps {
  onComplete: (pin: string) => void;
  onCancel: () => void;
  pinLength: 4 | 6;
}

export const PINSetupScreen: React.FC<PINSetupScreenProps> = ({
  onComplete,
  onCancel,
  pinLength,
}) => {
  const colors = useColors();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const handleNumberPress = (number: string) => {
    if (error) setError('');

    if (isConfirming) {
      if (confirmPin.length < pinLength) {
        setConfirmPin(prev => prev + number);
      }
    } else {
      if (pin.length < pinLength) {
        setPin(prev => prev + number);
      }
    }
  };

  const handleBackspace = () => {
    if (error) setError('');

    if (isConfirming) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (error) setError('');

    if (isConfirming) {
      setConfirmPin('');
    } else {
      setPin('');
    }
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (pin.length === pinLength && !isConfirming) {
      setIsConfirming(true);
    }
  }, [pin, pinLength, isConfirming]);

  useEffect(() => {
    if (confirmPin.length === pinLength) {
      if (pin === confirmPin) {
        // PINs match, save and complete
        savePIN();
      } else {
        // PINs don't match, show error and reset
        setError('PINs do not match. Please try again.');
        shakeInput();
        setTimeout(() => {
          setPin('');
          setConfirmPin('');
          setIsConfirming(false);
          setError('');
        }, 2000);
      }
    }
  }, [confirmPin, pin, pinLength]);

  const savePIN = async () => {
    try {
      await walletStorage.savePin(pin);

      // Update biometric settings to enable PIN
      const currentSettings = await walletStorage.getBiometricSettings();
      const newSettings = {
        ...currentSettings,
        enabled: true,
        type: 'pin' as const,
        pinLength,
        pinEnabled: true,
        lastUsed: new Date().toISOString(),
      };

      await walletStorage.saveBiometricSettings(newSettings);
      onComplete(pin);
    } catch (error) {
      console.error('Error saving PIN:', error);
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    }
  };

  const renderPINInput = (value: string, isActive: boolean) => {
    return (
      <View style={styles.pinContainer}>
        {Array.from({ length: pinLength }, (_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor:
                  isActive && index < value.length
                    ? colors.interactive.primary
                    : colors.border.secondary,
                borderColor: colors.border.primary,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace'],
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.numberButton,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  },
                ]}
                onPress={() => {
                  if (item === 'backspace') {
                    handleBackspace();
                  } else if (item === '') {
                    // Empty space
                  } else {
                    handleNumberPress(item);
                  }
                }}
                disabled={item === ''}
              >
                {item === 'backspace' ? (
                  <Text
                    style={[
                      styles.backspaceText,
                      { color: colors.text.primary },
                    ]}
                  >
                    ⌫
                  </Text>
                ) : item === '' ? null : (
                  <Text
                    style={[styles.numberText, { color: colors.text.primary }]}
                  >
                    {item}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={[styles.cancelText, { color: colors.text.secondary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {isConfirming ? 'Confirm PIN' : 'Create PIN'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {isConfirming
              ? 'Enter your PIN again to confirm'
              : `Enter a ${pinLength}-digit PIN to secure your wallet`}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.inputContainer,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          {renderPINInput(isConfirming ? confirmPin : pin, true)}
        </Animated.View>

        {error ? (
          <Text style={[styles.errorText, { color: colors.status.error }]}>
            {error}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.border.primary }]}
            onPress={handleClear}
          >
            <Text style={[styles.clearText, { color: colors.text.secondary }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderNumberPad()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    marginBottom: 40,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '500',
  },
  numberPad: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  numberButton: {
    width: (width - 80) / 3,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 24,
    fontWeight: '600',
  },
  backspaceText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
