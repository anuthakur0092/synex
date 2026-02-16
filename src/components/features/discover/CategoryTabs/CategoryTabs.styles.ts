import { StyleSheet } from 'react-native';
import { dimensions } from '../../../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: dimensions.padding.sm,
    paddingHorizontal: dimensions.padding.medium,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: dimensions.padding.xs,
    gap: dimensions.spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.padding.medium,
    paddingVertical: dimensions.padding.sm,
    borderRadius: dimensions.borderRadius.full,
    borderWidth: 1,
    gap: dimensions.spacing.xs,
    minHeight: 40,
  },
  tabIconContainer: {
    width: 20,
    height: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
