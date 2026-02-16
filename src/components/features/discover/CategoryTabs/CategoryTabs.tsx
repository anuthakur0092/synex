import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { DiscoverCategory } from '../../../../utils/types/discover.types';
import { IconRenderer } from '../../../common/IconRenderer';
import { styles } from './CategoryTabs.styles';

interface CategoryTabsProps {
  categories: DiscoverCategory[];
  activeCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

interface CategoryTabProps {
  category: DiscoverCategory;
  isActive: boolean;
  onPress: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  category,
  isActive,
  onPress,
}) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.tab,
        {
          backgroundColor: isActive
            ? colors.interactive.primary
            : colors.surface.secondary,
          borderColor: isActive
            ? colors.interactive.primary
            : colors.border.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconRenderer
        icon={category.icon}
        size={20}
        style={styles.tabIconContainer}
      />
      <Text
        style={[
          styles.tabText,
          {
            color: isActive ? colors.text.inverse : colors.text.primary,
          },
        ]}
        numberOfLines={1}
      >
        {category.displayName}
      </Text>
    </TouchableOpacity>
  );
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
}) => {
  const colors = useColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {categories.map(category => (
          <CategoryTab
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            onPress={() => onCategorySelect(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
