import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import {
  supportedChains,
  ChainConfigItem,
} from '../../../../utils/config/chains';
import LottieIcon from '../../../common/LottieIcon';

interface NetworkSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedChainId?: number;
  onSelect: (chain: ChainConfigItem) => void;
  /** When true, prepends an "All Networks" option (chainId 0). Defaults to true. */
  includeAll?: boolean;
}

export const NetworkSheet: React.FC<NetworkSheetProps> = ({
  visible,
  onClose,
  selectedChainId,
  onSelect,
  includeAll = true,
}) => {
  const colors = useColors();

  const renderItem = ({ item }: { item: ChainConfigItem }) => {
    const isSelected = item.chainId === selectedChainId;
    return (
      <TouchableOpacity
        style={[
          styles.row,
          {
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: isSelected
              ? colors.interactive.primary
              : colors.border.secondary,
          },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        {item.icon ? (
          <Image source={item.icon} style={styles.icon} resizeMode="contain" />
        ) : (
          <View
            style={[
              styles.dot,
              { backgroundColor: colors.interactive.primary },
            ]}
          />
        )}
        <Text style={[styles.rowText, { color: colors.text.primary }]}>
          {item.name}
        </Text>
        {isSelected && <LottieIcon icon="success" size={16} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={false}
      presentationStyle="overFullScreen"
      hardwareAccelerated
    >
      <View style={[styles.overlay]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Network
          </Text>
          <FlatList
            data={
              includeAll
                ? ([
                    { name: 'All Networks', chainId: 0, symbol: 'ALL' } as any,
                    ...supportedChains,
                  ] as any)
                : (supportedChains as any)
            }
            keyExtractor={c => `${c.chainId}`}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.close, { color: colors.interactive.primary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 8,
  },
  close: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 8,
  },
});
