import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  contentTall: {
    paddingBottom: 160,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  tokenName: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { fontWeight: '700', marginLeft: 8 },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 8 },
  price: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  balance: {
    marginTop: 6,
  },
  chartContainer: {
    height: 220,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeframeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  timeframeSelected: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  section: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Tabs
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabSelected: {
    backgroundColor: 'transparent',
  },
  tabUnderline: { height: 2, borderRadius: 1, marginTop: 6 },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    // marginBottom: 24,
  },
});
