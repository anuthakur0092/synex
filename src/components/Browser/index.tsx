import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useColors } from '../../utils/theme';

export interface WebViewProps {
  url: string;
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
}

const Browser: React.FC<WebViewProps> = ({ url, onNavigationStateChange }) => {
  const colors = useColors();
  const webviewRef = useRef<WebView>(null);

  const [currentUrl, setCurrentUrl] = useState(url);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCurrentUrl(navState.url);

      if (onNavigationStateChange) {
        onNavigationStateChange(navState);
      }
    },
    [onNavigationStateChange],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        startInLoadingState={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsBackForwardNavigationGestures={true}
        onNavigationStateChange={handleNavigationStateChange}
        onError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          Alert.alert('Error', `Failed to load: ${nativeEvent.description}`);
        }}
      />
    </View>
  );
};

export default Browser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
