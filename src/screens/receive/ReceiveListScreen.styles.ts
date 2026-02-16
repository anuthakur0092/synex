import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { marginTop: 12, marginHorizontal: 16 },
  networkButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 6,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  searchBox: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: { height: 44 },
  sectionTitle: { marginHorizontal: 16, marginTop: 16 },
  listContent: { paddingVertical: 8 },
});
