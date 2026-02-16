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

interface PINVerificationScreenProps {
  onSuccess: () => void;
  pinLength: 4 | 6;
  title?: string;
  subtitle?: string;
}

export const PINVerificationScreen: React.FC<PINVerificationScreenProps> = ({
  onSuccess,
  pinLength,
  title = 'Enter PIN',
  subtitle = 'Enter your PIN to continue',
}) => {
  const colors = useColors();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const handleNumberPress = (number: string) => {
    if (error) setError('');

    if (pin.length < pinLength) {
      setPin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    if (error) setError('');
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (error) setError('');
    setPin('');
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
    if (pin.length === pinLength) {
      verifyPIN();
    }
  }, [pin, pinLength]);

  const verifyPIN = async () => {
    try {
      const isValid = await walletStorage.validatePin(pin);

      if (isValid) {
        // Update last used timestamp
        const currentSettings = await walletStorage.getBiometricSettings();
        if (currentSettings) {
          const updatedSettings = {
            ...currentSettings,
            lastUsed: new Date().toISOString(),
          };
          await walletStorage.saveBiometricSettings(updatedSettings);
        }

        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          Alert.alert(
            'Too Many Attempts',
            'You have entered an incorrect PIN too many times. Please try again later.',
            [{ text: 'OK', onPress: () => setPin('') }],
          );
          setAttempts(0);
        } else {
          setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
          shakeInput();
          setTimeout(() => {
            setPin('');
            setError('');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      setError('Failed to verify PIN. Please try again.');
      shakeInput();
      setTimeout(() => {
        setPin('');
        setError('');
      }, 2000);
    }
  };

  const renderPINInput = () => {
    return (
      <View style={styles.pinContainer}>
        {Array.from({ length: pinLength }, (_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor:
                  index < pin.length
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
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {subtitle}
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
          {renderPINInput()}
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
