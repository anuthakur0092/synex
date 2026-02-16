import { StyleSheet } from 'react-native';
import { dimensions } from '../../../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryInfo: {
    paddingHorizontal: dimensions.padding.medium,
    paddingVertical: dimensions.padding.sm,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
  searchInfo: {
    paddingHorizontal: dimensions.padding.medium,
    paddingVertical: dimensions.padding.sm,
  },
  searchResultsText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
});
