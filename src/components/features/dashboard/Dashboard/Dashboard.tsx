import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, RefreshControl } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { DashboardProps, Token } from '../../../../utils/types/dashboard.types';
import { Header as DashboardHeader } from '../Header';
import { BalanceDisplay } from '../BalanceDisplay';
import { QuickActions } from '../QuickActions';
import { TokenItem } from '../TokenList/TokenList';
import { AddTokensButton } from '../AddTokensButton';

// NetworkSheet managed by parent (HomeScreen)

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  onActionPress,
  onTokenPress,
  onProfilePress,
  onNetworkPress,
  onWalletConnectPress,
  onAddTokensPress,
  balanceLoading,
  refreshing,
  onRefresh,
  tokenPricesLoading,
  priceLoading,
  ethPrice,
  ethChange,
}) => {
  const colors = useColors();
  // Sheet visibility is handled by parent via onNetworkPress

  // Add error handling for undefined data
  if (!data) {
    console.error('Dashboard: data prop is undefined');
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            Dashboard data not available
          </Text>
        </View>
      </View>
    );
  }

  const handleActionPress = (action: string) => {
    onActionPress?.(action);
  };

  const handleTokenPress = (token: Token) => {
    onTokenPress?.(token);
  };

  // Create the header component for FlatList
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Balance Display */}
      <BalanceDisplay
        balance={data.wallet.balance}
        loading={balanceLoading}
        priceLoading={priceLoading}
        price={ethPrice}
        changePct24h={ethChange}
      />

      {/* Quick Actions */}
      <QuickActions
        actions={data.quickActions}
        onActionPress={handleActionPress}
      />
    </View>
  );

  // Create the footer component for FlatList
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Add Tokens Button */}
      <AddTokensButton onPress={onAddTokensPress || (() => {})} />
    </View>
  );

  // Render tokens list
  const renderContent = () => {
    return (
      <FlatList
        data={data.tokens}
        renderItem={({ item }) => (
          <TokenItem
            token={item}
            onPress={handleTokenPress}
            loadingPrices={!!tokenPricesLoading}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      />
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Header - Outside of FlatList for proper positioning */}
      <DashboardHeader
        user={data.user}
        onProfilePress={onProfilePress || (() => {})}
        onNetworkPress={onNetworkPress || (() => {})}
        onWalletConnectPress={onWalletConnectPress || (() => {})}
      />

      {/* Main Content */}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    // Header components will handle their own padding
  },
  footerContainer: {
    // Footer components will handle their own padding
  },
  listContent: {
    flexGrow: 1,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
