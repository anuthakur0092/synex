import appConfig from '../../../app.config.json';

export interface SeedVerificationConfig {
  wordsPerStep: number;
  totalSteps: number;
  skipConfirmation: boolean;
}

export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  theme: {
    mode: 'light' | 'dark' | 'auto';
    allowUserToggle: boolean;
    followSystemTheme: boolean;
  };
  splash: {
    duration: number;
    minDuration: number;
    showLoadingIndicator: boolean;
  };
  features: {
    biometricAuth: boolean;
    notifications: boolean;
    analytics: boolean;
  };
  ui?: {
    pricePrecision?: {
      smallValueMaxDigits?: number;
      largeValueMaxDigits?: number;
      smallValueThreshold?: number;
    };
  };
  seedVerification: {
    enabled: boolean;
    development: SeedVerificationConfig;
    production: SeedVerificationConfig;
    testing: SeedVerificationConfig;
  };
}

// Detect environment
const isDevelopment = __DEV__;
const isTesting = process.env.NODE_ENV === 'test';

// Validate and export the configuration
const config: AppConfig = {
  app: {
    name: appConfig.app.name || 'YoexWallet',
    version: appConfig.app.version || '1.0.0',
    description:
      appConfig.app.description || 'Modern cryptocurrency wallet application',
  },
  theme: {
    mode: (['light', 'dark', 'auto'].includes(appConfig.theme.mode)
      ? appConfig.theme.mode
      : 'dark') as 'light' | 'dark' | 'auto',
    allowUserToggle: appConfig.theme.allowUserToggle ?? true,
    followSystemTheme: appConfig.theme.followSystemTheme ?? false,
  },
  splash: {
    duration: appConfig.splash.duration || 3000,
    minDuration: appConfig.splash.minDuration || 2000,
    showLoadingIndicator: appConfig.splash.showLoadingIndicator ?? true,
  },
  features: {
    biometricAuth: appConfig.features.biometricAuth ?? true,
    notifications: appConfig.features.notifications ?? true,
    analytics: appConfig.features.analytics ?? false,
  },
  ui: {
    pricePrecision: {
      smallValueMaxDigits:
        ((appConfig as any)?.ui?.pricePrecision
          ?.smallValueMaxDigits as number) || 6,
      largeValueMaxDigits:
        ((appConfig as any)?.ui?.pricePrecision
          ?.largeValueMaxDigits as number) || 2,
      smallValueThreshold:
        ((appConfig as any)?.ui?.pricePrecision
          ?.smallValueThreshold as number) || 0.01,
    },
  },
  seedVerification: {
    enabled: appConfig.seedVerification?.enabled ?? true,
    development: {
      wordsPerStep: appConfig.seedVerification?.development?.wordsPerStep ?? 1,
      totalSteps: appConfig.seedVerification?.development?.totalSteps ?? 2,
      skipConfirmation:
        appConfig.seedVerification?.development?.skipConfirmation ?? false,
    },
    production: {
      wordsPerStep: appConfig.seedVerification?.production?.wordsPerStep ?? 3,
      totalSteps: appConfig.seedVerification?.production?.totalSteps ?? 4,
      skipConfirmation:
        appConfig.seedVerification?.production?.skipConfirmation ?? false,
    },
    testing: {
      wordsPerStep: appConfig.seedVerification?.testing?.wordsPerStep ?? 1,
      totalSteps: appConfig.seedVerification?.testing?.totalSteps ?? 1,
      skipConfirmation:
        appConfig.seedVerification?.testing?.skipConfirmation ?? true,
    },
  },
};

export default config;

// Helper functions for easy access
export const getThemeMode = () => config.theme.mode;
export const getAllowUserToggle = () => config.theme.allowUserToggle;
export const getFollowSystemTheme = () => config.theme.followSystemTheme;
export const getSplashDuration = () => config.splash.duration;
export const getSplashMinDuration = () => config.splash.minDuration;
export const getAppName = () => config.app.name;
export const getAppVersion = () => config.app.version;
export const getUiPricePrecision = () =>
  (config.ui && config.ui.pricePrecision) || {
    smallValueMaxDigits: 8,
    largeValueMaxDigits: 2,
    smallValueThreshold: 0.01,
  };

// Seed verification helper functions
export const getSeedVerificationConfig = (): SeedVerificationConfig => {
  if (isTesting) {
    return config.seedVerification.testing;
  } else if (isDevelopment) {
    return config.seedVerification.development;
  } else {
    return config.seedVerification.production;
  }
};

export const getSeedWordsPerStep = () =>
  getSeedVerificationConfig().wordsPerStep;
export const getSeedTotalSteps = () => getSeedVerificationConfig().totalSteps;
export const getShouldSkipSeedConfirmation = () =>
  getSeedVerificationConfig().skipConfirmation;
export const isSeedVerificationEnabled = () => config.seedVerification.enabled;

// WalletConnect helpers
export const getWalletConnectProjectId = (): string =>
  (appConfig as any)?.walletConnect?.projectId || 'REPLACE_ME';
export const getWalletConnectRelayUrl = (): string =>
  (appConfig as any)?.walletConnect?.relayUrl ||
  'wss://relay.walletconnect.com';
