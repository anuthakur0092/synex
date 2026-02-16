import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    height: 24,
    position: 'relative',
    marginBottom: 16,
    paddingHorizontal: 6, // Add padding to contain the dots
  },
  progressLine: {
    position: 'absolute',
    top: '50%',
    left: 6, // Adjust for padding
    right: 6, // Adjust for padding
    height: 2,
    transform: [{ translateY: -1 }],
  },
  progressFill: {
    position: 'absolute',
    top: '50%',
    left: 6, // Adjust for padding
    height: 2,
    transform: [{ translateY: -1 }],
    zIndex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -6 }], // Only center vertically
    zIndex: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
