import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { useColors } from '../../utils/theme';
import { dimensions } from '../../utils/theme';
import { DiscoverSection } from '../../components/features/discover';
import { discoverData } from '../../utils/constants/discoverData';
import { DApp } from '../../utils/types/discover.types';

interface URLsScreenProps {
  onUrlSelect: (url: string, title: string) => void;
  onDirectUrlEntry?: (url: string) => void;
}

const URLsScreen: React.FC<URLsScreenProps> = ({
  onUrlSelect,
  onDirectUrlEntry,
}) => {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onDirectUrlEntry) {
      onDirectUrlEntry(searchQuery);
      setSearchQuery('');
    }
  };

  const handleDAppSelect = (dapp: DApp) => {
    onUrlSelect(dapp.url, dapp.title);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Discover
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          Explore DeFi, DEXs, and Web3 applications.
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.surface.primary },
        ]}
      >
        <View style={styles.searchIconContainer}>
          <Text style={[styles.searchIcon, { color: colors.text.tertiary }]}>
            🔍
          </Text>
        </View>
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search DApps, Protocols, or enter URL"
          placeholderTextColor={colors.text.placeholder}
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          keyboardType="web-search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch('')}
          >
            <Text
              style={[styles.clearButtonText, { color: colors.text.tertiary }]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Discover Section with Categories and DApps */}
      <DiscoverSection
        data={discoverData}
        onDAppSelect={handleDAppSelect}
        searchQuery={searchQuery}
      />
    </View>
  );
};

export default URLsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: dimensions.padding.medium,
    paddingTop: dimensions.padding.medium,
    paddingBottom: dimensions.padding.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: dimensions.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: dimensions.padding.medium,
    marginBottom: dimensions.padding.lg,
    paddingHorizontal: dimensions.padding.medium,
    paddingVertical: dimensions.padding.medium,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchIconContainer: {
    marginRight: dimensions.spacing.md,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: dimensions.spacing.sm,
  },
  clearButton: {
    padding: dimensions.spacing.xs,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
