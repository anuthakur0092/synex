import React, { useState } from 'react';
import { View, StyleSheet, Modal, Alert } from 'react-native';
import { useColors } from '../../utils/theme';
import URLsScreen from './URLs';
import WebViewScreen from './WebView';

export interface DiscoverProps {
  navigation?: any;
}

const Discover: React.FC<DiscoverProps> = ({ navigation }) => {
  const colors = useColors();
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleUrlSelect = (url: string, title: string) => {
    setSelectedUrl(url);
    setSelectedTitle(title);
  };

  const handleDirectUrlEntry = (url: string) => {
    let processedUrl = url.trim();

    // Add https:// if no protocol is specified
    if (
      !processedUrl.startsWith('http://') &&
      !processedUrl.startsWith('https://')
    ) {
      processedUrl = `https://${processedUrl}`;
    }

    // Basic URL validation
    try {
      new URL(processedUrl);
      setSelectedUrl(processedUrl);
      setSelectedTitle('Web Page');
    } catch (error) {
      Alert.alert('Invalid URL', 'Please enter a valid URL');
    }
  };

  const handleCloseWebView = () => {
    setSelectedUrl(null);
    setSelectedTitle('');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <URLsScreen
        onUrlSelect={handleUrlSelect}
        onDirectUrlEntry={handleDirectUrlEntry}
      />

      {/* WebView Modal */}
      <Modal
        visible={!!selectedUrl}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseWebView}
      >
        <WebViewScreen
          navigation={{ goBack: handleCloseWebView }}
          route={{ params: { url: selectedUrl || '', title: selectedTitle } }}
        />
      </Modal>
    </View>
  );
};

export default Discover;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
