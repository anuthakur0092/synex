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
    alignItems: 'stretch',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 32,
    textAlign: 'center',
    width: '100%',
  },
  illustrationContainer: {
    marginBottom: 32,
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  illustrationText: {
    fontSize: 40,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 10,
    width: '100%',
  },
  infoBox: {
    width: '100%',
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'stretch',
  },
  whyImportantButton: {
    marginBottom: 16,
    width: '100%',
  },
  whyImportantContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  whyImportantText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContent: {
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: 'dashed',
    padding: 16,
    width: '100%',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  securityLevel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  risksTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  riskItem: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  otherOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 2,
  },
  remindButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  remindButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    alignSelf: 'stretch',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Loading state styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Additional UI element styles
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  whyImportantButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
