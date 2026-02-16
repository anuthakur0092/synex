import { StyleSheet, Dimensions } from 'react-native';
import { dimensions } from '../../../utils/constants';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: dimensions.borderRadius.xxl,
    borderTopRightRadius: dimensions.borderRadius.xxl,
    paddingHorizontal: dimensions.padding.xl,
    paddingBottom: 40,
    paddingTop: dimensions.padding.lg,
    minHeight: height * 0.35,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: dimensions.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: dimensions.spacing.xl,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: dimensions.spacing.xl,
    paddingHorizontal: dimensions.padding.sm,
  },
  warning: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: dimensions.spacing.xxxl,
    fontWeight: '500',
    paddingHorizontal: dimensions.padding.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: dimensions.spacing.lg,
    marginTop: dimensions.spacing.xl,
  },
  cancelButton: {
    flex: 1,
  },
  logoutButton: {
    flex: 1,
  },
});
