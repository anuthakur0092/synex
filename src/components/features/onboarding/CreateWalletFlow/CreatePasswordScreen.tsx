import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { ProgressBarWithSteps } from './ProgressBarWithSteps';
import { SafeAreaWrapper } from '../../../common/SafeAreaWrapper';
import { PasswordRecoveryBottomSheet } from './PasswordRecoveryBottomSheet';
import LeftBackIcon from '../../../../assets/icon/left-back.svg';

import { styles } from './CreatePasswordScreen.styles';

interface CreatePasswordScreenProps {
  onNext: (data: { password: string; confirmPassword: string }) => void;
  onBack: () => void;
}

export const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({
  onNext,
  onBack,
}) => {
  const colors = useColors();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRecoveryInfo, setShowPasswordRecoveryInfo] =
    useState(false);

  const getPasswordStrength = (pwd: string): string => {
    if (pwd.length < 8) return 'Weak';
    if (pwd.length < 12) return 'Medium';
    return 'Good';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Weak':
        return colors.status.error;
      case 'Medium':
        return '#FFA500'; // Orange fallback color
      case 'Good':
        return colors.status.success;
      default:
        return colors.border.secondary;
    }
  };

  const isFormValid =
    password.length >= 8 && password === confirmPassword && agreed;

  const handleSubmit = () => {
    if (isFormValid) {
      onNext({
        password,
        confirmPassword,
      });
    }
  };

  return (
    <SafeAreaWrapper
      style={styles.container}
      backgroundColor={colors.background.primary}
    >
      {/* Header with Progress and Back button */}
      {/* Custom Header with Progress in Title Area */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <View style={styles.backButtonContainer}>
            <LeftBackIcon
              width={styles.backIcon.width}
              height={styles.backIcon.height}
              color={styles.backIcon.tintColor}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <ProgressBarWithSteps currentStep={1} totalSteps={5} />
        </View>

        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Create Password
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          This password will unlock your Oxylon Wallet wallet only on this
          service
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                },
              ]}
              placeholder="New Password"
              placeholderTextColor={colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={
                  showPassword
                    ? require('../../../../assets/icon/eye-visble.png')
                    : require('../../../../assets/icon/eye-hidden.png')
                }
                style={[styles.eyeIcon, { tintColor: colors.text.tertiary }]}
              />
            </TouchableOpacity>
          </View>

          {password.length > 0 && (
            <Text
              style={[
                styles.passwordStrength,
                { color: getStrengthColor(getPasswordStrength(password)) },
              ]}
            >
              Password strength: {getPasswordStrength(password)}
            </Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.text.tertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Image
                source={
                  showConfirmPassword
                    ? require('../../../../assets/icon/eye-visble.png')
                    : require('../../../../assets/icon/eye-hidden.png')
                }
                style={[styles.eyeIcon, { tintColor: colors.text.tertiary }]}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.requirement, { color: colors.text.tertiary }]}>
            Must be at least 8 characters
          </Text>
        </View>

        <View style={styles.agreementContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: agreed
                    ? colors.interactive.primary
                    : 'transparent',
                  borderColor: agreed
                    ? colors.interactive.primary
                    : colors.text.tertiary,
                },
              ]}
            >
              {agreed && (
                <Text
                  style={[styles.checkmark, { color: colors.text.inverse }]}
                >
                  ✓
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <Text
            style={[styles.agreementText, { color: colors.text.secondary }]}
          >
            I understand that Oxylon Wallet cannot recover this password for me.{' '}
            <Text
              style={{
                color: colors.interactive.primary,
                textDecorationLine: 'underline',
              }}
              onPress={() => setShowPasswordRecoveryInfo(true)}
            >
              Learn more
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: isFormValid
                ? colors.interactive.primary
                : colors.background.tertiary || '#2a2a2a',
              borderWidth: isFormValid ? 0 : 1,
              borderColor: isFormValid ? 'transparent' : colors.border.primary,
            },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text
            style={[
              styles.nextButtonText,
              {
                color: isFormValid ? colors.text.inverse : colors.text.tertiary,
              },
            ]}
          >
            Create Password
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <PasswordRecoveryBottomSheet
        isVisible={showPasswordRecoveryInfo}
        onClose={() => setShowPasswordRecoveryInfo(false)}
      />
    </SafeAreaWrapper>
  );
};
