import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';
import Browser from '../../components/Browser';
import { useColors } from '../../utils/theme';

export interface WebViewProps {
  navigation: any;
  route: any;
}

const WebViewScreen: React.FC<WebViewProps> = ({ navigation, route }) => {
  const colors = useColors();
  const { url, title: initialTitle } = route.params;

  const [activeUrl, setActiveUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState(initialTitle || 'Browser');
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setActiveUrl(url);
  }, [url]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setPageTitle(navState.title || 'Browser');
    setIsLoading(navState.loading);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* WebView Content with Browser Controls */}
      <View style={styles.webviewContainer}>
        <Browser
          url={activeUrl}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </View>
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
});
