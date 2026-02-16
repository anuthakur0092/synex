import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Header from '../../../common/Header';
import { styles } from './ImportScreen.styles';
import {
  CryptoWalletService,
  WalletValidationResult,
} from '../../../../services/crypto/wallet';

const { width, height } = Dimensions.get('window');

interface ImportScreenProps {
  onImport?: (data: {
    seedPhrase: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onBack?: () => void;
}

export const ImportScreen: React.FC<ImportScreenProps> = ({
  onImport,
  onBack,
}) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSeedPhraseVisible, setIsSeedPhraseVisible] = useState(false);
  const [isSeedPhraseFocused, setIsSeedPhraseFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [importMode, setImportMode] = useState<'mnemonic' | 'privateKey'>(
    'mnemonic',
  );
  const [wordSuggestions, setWordSuggestions] = useState<string[]>([]);
  const [currentWordInput, setCurrentWordInput] = useState('');

  const handleImport = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setValidationError('');

    // Use setTimeout to make import non-blocking (similar to Create Wallet flow)
    setTimeout(async () => {
      try {
        console.log('🔄 Starting non-blocking wallet import...');

        // Determine if input is mnemonic or private key based on selected mode
        const input = seedPhrase.trim();
        let validation: WalletValidationResult;
        let importType: 'mnemonic' | 'privateKey' = importMode;

        if (importType === 'privateKey') {
          console.log('🔍 Validating private key...');
          validation = CryptoWalletService.validatePrivateKey(input);
        } else {
          console.log('🔍 Validating mnemonic phrase...');
          validation = CryptoWalletService.validateMnemonic(input);
        }

        if (!validation.isValid) {
          console.log('❌ Validation failed:', validation.error);
          setValidationError(validation.error || 'Invalid input');
          setIsLoading(false);
          return;
        }

        console.log('✅ Validation passed, importing wallet...');

        // Import the wallet using appropriate method
        let result;
        if (importType === 'mnemonic') {
          console.log('🔑 Importing wallet from mnemonic...');
          result = await CryptoWalletService.importFromMnemonic(input);
        } else {
          console.log('🔑 Importing wallet from private key...');
          result = await CryptoWalletService.importFromPrivateKey(input);
        }

        console.log('✅ Wallet imported successfully:', {
          address: result.wallet.address,
          type: importType,
        });

        // Call the parent handler with the imported data
        if (onImport) {
          onImport({
            seedPhrase: input,
            password,
            confirmPassword,
          });
        }
      } catch (error) {
        console.error('❌ Import error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to import wallet';
        setValidationError(errorMessage);
        setIsLoading(false);
      }
      // Note: setIsLoading(false) is handled by parent component after successful import
    }, 100); // Small delay to allow UI to update
  };

  const handleTermsPress = () => {
    Linking.openURL('https://example.com');
  };

  const isFormValid = () => {
    return (
      seedPhrase.trim().length > 0 &&
      password.length >= 8 &&
      password === confirmPassword &&
      !validationError
    );
  };

  // Function to get the display value for seed phrase
  const getSeedPhraseDisplayValue = () => {
    if (isSeedPhraseVisible || isSeedPhraseFocused) {
      return seedPhrase;
    }
    // Create masked version - simple approach
    if (seedPhrase.length === 0) {
      return '';
    }
    return '•'.repeat(seedPhrase.length);
  };

  // Validate input in real-time as user types
  const handleSeedPhraseChange = (text: string) => {
    setSeedPhrase(text);
    setValidationError(''); // Clear previous errors when user types

    // Only show suggestions for mnemonic mode
    if (importMode === 'mnemonic') {
      // Get the current word being typed (last word)
      const words = text.split(' ');
      const currentWord = words[words.length - 1];
      setCurrentWordInput(currentWord);

      // Get suggestions if user is typing a word
      if (currentWord && currentWord.length > 0) {
        const suggestions = CryptoWalletService.getWordSuggestions(
          currentWord,
          3,
        );
        setWordSuggestions(suggestions);
      } else {
        setWordSuggestions([]);
      }
    } else {
      setWordSuggestions([]);
    }
  };

  // Handle suggestion tap
  const handleSuggestionPress = (suggestion: string) => {
    const words = seedPhrase.split(' ');
    // Replace the last word with the suggestion
    words[words.length - 1] = suggestion;
    const newSeedPhrase = words.join(' ') + ' ';
    setSeedPhrase(newSeedPhrase);
    setWordSuggestions([]);
    setCurrentWordInput('');
  };

  // Handle tab switch
  const handleTabSwitch = (mode: 'mnemonic' | 'privateKey') => {
    setImportMode(mode);
    setSeedPhrase(''); // Clear input when switching
    setValidationError(''); // Clear any validation errors
    setWordSuggestions([]); // Clear suggestions
    setCurrentWordInput('');
  };

  // Get placeholder text based on import mode
  const getPlaceholderText = () => {
    if (importMode === 'mnemonic') {
      return 'Enter your seed phrase';
    } else {
      return 'Enter private key';
    }
  };

  // Get input label based on import mode
  const getInputLabel = () => {
    if (importMode === 'mnemonic') {
      return 'Seed Phrase';
    } else {
      return 'Private Key';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Import Existing"
        onBackPress={onBack}
        transparent={true}
        elevation={false}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              importMode === 'mnemonic' && styles.tabButtonActive,
            ]}
            onPress={() => handleTabSwitch('mnemonic')}
          >
            <Text
              style={[
                styles.tabButtonText,
                importMode === 'mnemonic' && styles.tabButtonTextActive,
              ]}
            >
              Seed Phrase
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              importMode === 'privateKey' && styles.tabButtonActive,
            ]}
            onPress={() => handleTabSwitch('privateKey')}
          >
            <Text
              style={[
                styles.tabButtonText,
                importMode === 'privateKey' && styles.tabButtonTextActive,
              ]}
            >
              Private Key
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{getInputLabel()}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.textInput,
                importMode === 'privateKey'
                  ? styles.privateKeyInput
                  : styles.seedPhraseInput,
                { color: '#FFFFFF' },
                validationError ? styles.inputError : {},
              ]}
              value={getSeedPhraseDisplayValue()}
              onChangeText={handleSeedPhraseChange}
              onFocus={() => setIsSeedPhraseFocused(true)}
              onBlur={() => setIsSeedPhraseFocused(false)}
              placeholder={getPlaceholderText()}
              placeholderTextColor="#888"
              multiline={importMode === 'mnemonic'}
              numberOfLines={importMode === 'mnemonic' ? 3 : 1}
              secureTextEntry={false}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // QR Code scan functionality
                  console.log('Scan QR Code');
                }}
              >
                <Image
                  source={require('../../../../assets/icon/scan.png')}
                  style={styles.actionButtonIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsSeedPhraseVisible(!isSeedPhraseVisible)}
              >
                <Image
                  source={
                    isSeedPhraseVisible
                      ? require('../../../../assets/icon/eye-visble.png')
                      : require('../../../../assets/icon/eye-hidden.png')
                  }
                  style={styles.actionButtonIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          {validationError ? (
            <Text style={styles.errorText}>{validationError}</Text>
          ) : null}

          {/* Word Suggestions for Mnemonic */}
          {importMode === 'mnemonic' && wordSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {wordSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { color: '#FFFFFF' }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              placeholderTextColor="#888"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Image
                source={
                  isPasswordVisible
                    ? require('../../../../assets/icon/eye-visble.png')
                    : require('../../../../assets/icon/eye-hidden.png')
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { color: '#FFFFFF' }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#888"
              secureTextEntry={!isConfirmPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Image
                source={
                  isConfirmPasswordVisible
                    ? require('../../../../assets/icon/eye-visble.png')
                    : require('../../../../assets/icon/eye-hidden.png')
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By proceeding, you agree to our{' '}
            <Text style={styles.termsLink} onPress={handleTermsPress}>
              Terms of Service
            </Text>
          </Text>
        </View>

        {/* Import Button */}
        <TouchableOpacity
          style={[
            styles.importButton,
            (!isFormValid() || isLoading) && styles.importButtonDisabled,
          ]}
          onPress={handleImport}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.importButtonText}>
                Importing wallet and onchain data...
              </Text>
            </View>
          ) : (
            <Text style={styles.importButtonText}>Import</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
