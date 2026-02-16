import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { DiscoverData, DApp } from '../../../../utils/types/discover.types';
import { CategoryTabs } from '../CategoryTabs';
import { DAppList } from '../DAppList';
import { styles } from './DiscoverSection.styles';

interface DiscoverSectionProps {
  data: DiscoverData;
  onDAppSelect: (dapp: DApp) => void;
  searchQuery?: string;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({
  data,
  onDAppSelect,
  searchQuery = '',
}) => {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState(
    data.categories[0]?.id || 'featured',
  );

  // Filter DApps based on search query and active category
  const filteredDApps = useMemo(() => {
    const activeData = data.categories.find(cat => cat.id === activeCategory);
    if (!activeData) return [];

    let dapps = activeData.dapps;

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      dapps = dapps.filter(
        dapp =>
          dapp.title.toLowerCase().includes(query) ||
          dapp.description.toLowerCase().includes(query) ||
          dapp.tags?.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    return dapps;
  }, [data.categories, activeCategory, searchQuery]);

  // Get active category info for display
  const activeCategoryInfo = data.categories.find(
    cat => cat.id === activeCategory,
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Category Tabs */}
      <CategoryTabs
        categories={data.categories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      {/* Category Description */}
      {activeCategoryInfo && !searchQuery && (
        <View style={styles.categoryInfo}>
          <Text
            style={[
              styles.categoryDescription,
              { color: colors.text.secondary },
            ]}
          >
            {activeCategoryInfo.description}
          </Text>
        </View>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <View style={styles.searchInfo}>
          <Text
            style={[styles.searchResultsText, { color: colors.text.secondary }]}
          >
            {filteredDApps.length} result{filteredDApps.length !== 1 ? 's' : ''}{' '}
            for "{searchQuery}"
          </Text>
        </View>
      )}

      {/* DApp List */}
      <DAppList
        dapps={filteredDApps}
        onDAppSelect={onDAppSelect}
        emptyMessage={
          searchQuery
            ? `No DApps found matching "${searchQuery}" in ${
                activeCategoryInfo?.displayName || 'this category'
              }`
            : `No DApps available in ${
                activeCategoryInfo?.displayName || 'this category'
              }`
        }
      />
    </View>
  );
};
