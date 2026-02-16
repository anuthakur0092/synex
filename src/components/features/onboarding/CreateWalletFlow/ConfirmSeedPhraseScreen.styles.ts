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
  positionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  positionSlot: {
    minWidth: 100,
    maxWidth: 150,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  positionNumber: {
    fontSize: 14,
    marginRight: 8,
    flexShrink: 0,
  },
  positionWord: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  positionPlaceholder: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  wordButton: {
    minWidth: 80,
    maxWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  nextButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
