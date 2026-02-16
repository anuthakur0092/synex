import { useState, useEffect } from 'react';
import { getSplashDuration, getSplashMinDuration } from '../utils/config';

interface UseSplashScreenOptions {
  duration?: number;
  minDuration?: number;
}

export const useSplashScreen = (options: UseSplashScreenOptions = {}) => {
  const {
    duration = getSplashDuration(),
    minDuration = getSplashMinDuration(),
  } = options;
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure minimum duration
    const minTimer = setTimeout(() => {
      setIsReady(true);
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, [minDuration]);

  const hideSplashScreen = () => {
    if (isReady) {
      setIsVisible(false);
    }
  };

  return {
    isVisible,
    hideSplashScreen,
    isReady,
  };
};
