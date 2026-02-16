import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09080C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonIcon: {
    width: 70,
    height: 70,

    tintColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginRight: 40, // Balance the back button
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
    backgroundColor: 'rgba(26, 23, 32, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'System',
    minHeight: 50,
  },
  seedPhraseInput: {
    minHeight: 80,
    paddingRight: 80, // Space for action buttons
    textAlignVertical: 'top',
  },
  inputActions: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  actionButtonIcon: {
    width: 18,
    height: 18,
    tintColor: '#FB923C',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginLeft: 4,
  },
  biometricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  biometricLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  termsContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#FB923C',
    textDecorationLine: 'underline',
  },
  importButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 25,
    backgroundColor: '#00FFD4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00FFD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    marginBottom: 16,
  },
  importButtonDisabled: {
    backgroundColor: '#333',
    shadowOpacity: 0,
    elevation: 0,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09080C',
    letterSpacing: 0.5,
  },
  importButtonTextDisabled: {
    color: '#666',
  },
  bottomSpacer: {
    height: 40,
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  biometricInfo: {
    flex: 1,
    marginRight: 16,
  },
  biometricText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  biometricSubtext: {
    color: '#999',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'rgba(26, 23, 32, 0.8)',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  tabButtonTextActive: {
    color: '#09080C',
    fontWeight: '700',
  },
  privateKeyInput: {
    minHeight: 50,
    paddingRight: 80, // Space for action buttons
    textAlignVertical: 'center',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '500',
  },
});
