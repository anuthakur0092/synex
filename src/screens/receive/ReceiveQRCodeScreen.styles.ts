import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  warning: {
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  warningText: { fontSize: 12 },
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  tokenName: { fontSize: 16, fontWeight: '600' },
  chip: {
    marginLeft: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: { fontSize: 10, fontWeight: '600' },
  qrWrapper: { alignItems: 'center', marginTop: 24 },
  address: { marginTop: 12, textAlign: 'center', paddingHorizontal: 16 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
