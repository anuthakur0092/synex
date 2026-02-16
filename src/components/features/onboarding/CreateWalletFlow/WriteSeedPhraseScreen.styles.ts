import { StyleSheet } from 'react-native';
import { createCommonBackButtonStyles } from '../../../../utils/theme';

const commonBackButtonStyles = createCommonBackButtonStyles();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  ...commonBackButtonStyles,
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  seedPhraseContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  revealButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  seedPhraseGrid: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  wordNumber: {
    fontSize: 14,
    marginRight: 8,
    minWidth: 20,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
