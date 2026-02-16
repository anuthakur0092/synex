import { getSeedVerificationConfig } from './index';

export enum SeedVerificationMode {
  TESTING = 'testing', // 1 word, 1 step, skip confirmation
  DEVELOPMENT = 'development', // 1 word, 2 steps
  PRODUCTION = 'production', // 3 words, 4 steps
}

/**
 * Quick seed verification configuration for development
 * Change this to switch between different verification modes
 */
export const CURRENT_SEED_MODE: SeedVerificationMode =
  SeedVerificationMode.TESTING;

/**
 * Get current seed verification settings
 */
export const getCurrentSeedConfig = () => {
  const config = getSeedVerificationConfig();

  console.log(`🎯 Seed Verification Mode: ${CURRENT_SEED_MODE}`);
  console.log(`📝 Words per step: ${config.wordsPerStep}`);
  console.log(`🔢 Total steps: ${config.totalSteps}`);
  console.log(`⏭️  Skip confirmation: ${config.skipConfirmation}`);

  return config;
};

/**
 * Preset configurations for quick switching
 */
export const SEED_PRESETS = {
  [SeedVerificationMode.TESTING]: {
    wordsPerStep: 1,
    totalSteps: 1,
    skipConfirmation: true,
    description: '🚀 FASTEST - Skip verification (testing)',
  },
  [SeedVerificationMode.DEVELOPMENT]: {
    wordsPerStep: 1,
    totalSteps: 2,
    skipConfirmation: false,
    description: '⚡ FAST - Minimal verification (development)',
  },
  [SeedVerificationMode.PRODUCTION]: {
    wordsPerStep: 3,
    totalSteps: 4,
    skipConfirmation: false,
    description: '🔒 SECURE - Full verification (production)',
  },
};

/**
 * Log all available presets for easy reference
 */
export const logSeedPresets = () => {
  console.log('🎯 Available Seed Verification Modes:');
  Object.entries(SEED_PRESETS).forEach(([mode, preset]) => {
    console.log(`  ${mode}: ${preset.description}`);
    console.log(
      `    - ${preset.wordsPerStep} words/step, ${preset.totalSteps} steps, skip: ${preset.skipConfirmation}`,
    );
  });
  console.log(`\n✅ Current mode: ${CURRENT_SEED_MODE}`);
};
