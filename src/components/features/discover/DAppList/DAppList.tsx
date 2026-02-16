import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useColors } from '../../../../utils/theme';
import { DApp } from '../../../../utils/types/discover.types';
import { IconRenderer } from '../../../common/IconRenderer';
import { styles } from './DAppList.styles';

interface DAppListProps {
  dapps: DApp[];
  onDAppSelect: (dapp: DApp) => void;
  emptyMessage?: string;
}

interface DAppItemProps {
  dapp: DApp;
  onPress: () => void;
}

const DAppItem: React.FC<DAppItemProps> = ({ dapp, onPress }) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.dappItem,
        {
          backgroundColor: colors.surface.primary,
          borderColor: colors.border.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <IconRenderer
        icon={dapp.icon}
        size={48}
        style={styles.iconContainer}
        fallbackIcon="🌐"
      />

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text
          style={[styles.dappTitle, { color: colors.text.primary }]}
          numberOfLines={1}
        >
          {dapp.title}
        </Text>
        <Text
          style={[styles.dappDescription, { color: colors.text.secondary }]}
          numberOfLines={1}
        >
          {dapp.description}
        </Text>
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: colors.text.tertiary }]}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  const colors = useColors();

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
        No DApps Found
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
        {message}
      </Text>
    </View>
  );
};

export const DAppList: React.FC<DAppListProps> = ({
  dapps,
  onDAppSelect,
  emptyMessage = 'No DApps available in this category',
}) => {
  const colors = useColors();

  const renderDAppItem: ListRenderItem<DApp> = ({ item }) => (
    <DAppItem dapp={item} onPress={() => onDAppSelect(item)} />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  if (dapps.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <FlatList
        data={dapps}
        renderItem={renderDAppItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
      />
    </View>
  );
};
