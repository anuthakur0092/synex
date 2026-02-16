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
    justifyContent: 'center',
    flexGrow: 1,
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  walletDetailsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  walletDetailCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  walletDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  walletDetailValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  noteContainer: {
    width: '100%',
    marginBottom: 40,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 16,
  },
  completeButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
