import { StyleSheet } from 'react-native';
import { dimensions } from '../../../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: dimensions.padding.medium,
    paddingBottom: dimensions.padding.xl,
  },
  dappItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.padding.medium,
    paddingVertical: dimensions.padding.medium,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: dimensions.borderWidth.default,
    minHeight: 72,
  },
  iconContainer: {
    marginRight: dimensions.margin.medium,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: dimensions.padding.sm,
  },
  dappTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 2,
  },
  dappDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: dimensions.spacing.sm,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: dimensions.padding.xl,
    paddingVertical: dimensions.padding.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: dimensions.margin.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: dimensions.margin.sm,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
