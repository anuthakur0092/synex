import { Linking, Alert, Platform } from 'react-native';

interface ExternalLinkConfig {
  url: string;
  appScheme?: string;
  fallbackUrl?: string;
}

const EXTERNAL_LINKS: Record<string, ExternalLinkConfig> = {
  instagram: {
    url: 'https://www.instagram.com/oxylonworld',
    appScheme: 'instagram://',
    fallbackUrl: 'https://www.instagram.com/oxylonworld',
  },
  twitter: {
    url: 'https://x.com/oxylonworld',
    appScheme: 'twitter://',
    fallbackUrl: 'https://x.com/oxylonworld',
  },
  telegram: {
    url: 'https://t.me/oxylonworld',
    appScheme: 'tg://',
    fallbackUrl: 'https://t.me/oxylonworld',
  },
  youtube: {
    url: 'https://www.youtube.com/@oxylonworld',
    appScheme: 'youtube://',
    fallbackUrl: 'https://www.youtube.com/@oxylonworld',
  },
  about: {
    url: 'https://oxylon.io/about',
  },
  support: {
    url: 'https://oxylon.io/support',
  },
  helpCenter: {
    url: 'https://oxylon.io/support',
  },
};

export const openExternalLink = async (
  linkType: keyof typeof EXTERNAL_LINKS,
): Promise<void> => {
  const config = EXTERNAL_LINKS[linkType];
  if (!config) {
    console.warn(`Unknown link type: ${linkType}`);
    return;
  }

  try {
    // Try to open in app first if app scheme is available
    if (config.appScheme && Platform.OS !== 'web') {
      try {
        const canOpen = await Linking.canOpenURL(config.appScheme);
        if (canOpen) {
          await Linking.openURL(config.appScheme);
          return;
        }
      } catch (appError) {
        console.log(`App scheme not available for ${linkType}:`, appError);
        // Continue to web fallback
      }
    }

    // Always try to open web URL as fallback
    const urlToOpen = config.fallbackUrl || config.url;
    console.log(`Opening web URL for ${linkType}:`, urlToOpen);
    await Linking.openURL(urlToOpen);
  } catch (error) {
    console.error(`Failed to open ${linkType} link:`, error);

    // Platform-specific error messages
    const errorMessage =
      Platform.OS === 'ios'
        ? `Unable to open ${linkType}. Please check if the app is installed or try opening in Safari.`
        : `Unable to open ${linkType}. Please check if the app is installed or try opening in your browser.`;

    Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
  }
};

export const openCustomUrl = async (url: string): Promise<void> => {
  try {
    console.log('Opening custom URL:', url);
    await Linking.openURL(url);
  } catch (error) {
    console.error('Failed to open custom URL:', error);
    Alert.alert(
      'Error',
      'Unable to open the link. Please check your internet connection and try again.',
      [{ text: 'OK' }],
    );
  }
};

export const isAppInstalled = async (appScheme: string): Promise<boolean> => {
  try {
    return await Linking.canOpenURL(appScheme);
  } catch (error) {
    console.error('Failed to check if app is installed:', error);
    return false;
  }
};

export const getAvailableSocialApps = async (): Promise<string[]> => {
  const availableApps: string[] = [];

  for (const [key, config] of Object.entries(EXTERNAL_LINKS)) {
    if (config.appScheme) {
      const isInstalled = await isAppInstalled(config.appScheme);
      if (isInstalled) {
        availableApps.push(key);
      }
    }
  }

  return availableApps;
};

export const openSocialMediaWithContent = async (
  platform: keyof typeof EXTERNAL_LINKS,
  content: string,
): Promise<void> => {
  const config = EXTERNAL_LINKS[platform];
  if (!config) {
    console.warn(`Unknown platform: ${platform}`);
    return;
  }

  try {
    // Try to open with content in app first
    if (config.appScheme && Platform.OS !== 'web') {
      const contentUrl = `${config.appScheme}${content}`;
      const canOpen = await Linking.canOpenURL(contentUrl);
      if (canOpen) {
        await Linking.openURL(contentUrl);
        return;
      }
    }

    // Fallback to web URL with content
    const webUrl = `${config.url}/${content}`;
    const canOpenWeb = await Linking.canOpenURL(webUrl);
    if (canOpenWeb) {
      await Linking.openURL(webUrl);
    } else {
      throw new Error('Cannot open URL');
    }
  } catch (error) {
    console.error(`Failed to open ${platform} with content:`, error);
    // Fallback to basic platform link
    await openExternalLink(platform);
  }
};

export const shareToSocialMedia = async (
  platform: keyof typeof EXTERNAL_LINKS,
  text: string,
  url?: string,
): Promise<void> => {
  const config = EXTERNAL_LINKS[platform];
  if (!config) {
    console.warn(`Unknown platform: ${platform}`);
    return;
  }

  try {
    let shareUrl = config.url;

    // Add sharing parameters based on platform
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text,
        )}${url ? `&url=${encodeURIComponent(url)}` : ''}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url || config.url,
        )}&quote=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          url || config.url,
        )}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url || config.url,
        )}`;
        break;
      default:
        // For other platforms, just open the main URL
        break;
    }

    await openCustomUrl(shareUrl);
  } catch (error) {
    console.error(`Failed to share to ${platform}:`, error);
    // Fallback to basic platform link
    await openExternalLink(platform);
  }
};

// Debug function to test links
export const testExternalLinks = async (): Promise<void> => {
  console.log('Testing external links...');

  for (const [key, config] of Object.entries(EXTERNAL_LINKS)) {
    console.log(`${key}:`, {
      url: config.url,
      appScheme: config.appScheme,
      fallbackUrl: config.fallbackUrl,
    });
  }

  // Test a simple web link
  try {
    console.log('Testing simple web link...');
    await Linking.openURL('https://www.google.com');
    console.log('Google link opened successfully');
  } catch (error) {
    console.error('Failed to open Google link:', error);
  }
};
