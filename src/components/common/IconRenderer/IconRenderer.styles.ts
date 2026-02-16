import { StyleSheet } from 'react-native';
import { dimensions } from '../../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: dimensions.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    borderRadius: dimensions.borderRadius.lg,
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
