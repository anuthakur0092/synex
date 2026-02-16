import React from 'react';
import { render } from '@testing-library/react-native';
import { SplashScreen } from './SplashScreen';

// Mock Animated for testing
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      spring: jest.fn(() => ({
        start: jest.fn(),
      })),
      parallel: jest.fn(() => ({
        start: jest.fn(),
      })),
      loop: jest.fn(() => ({
        start: jest.fn(),
      })),
      sequence: jest.fn(() => ({
        start: jest.fn(),
      })),
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
      })),
    },
  };
});

describe('SplashScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SplashScreen />);

    expect(getByText('YOEX')).toBeTruthy();
    expect(getByText('Wallet')).toBeTruthy();
  });

  it('calls onAnimationComplete after duration', done => {
    const mockCallback = jest.fn();
    const duration = 100; // Short duration for testing

    render(
      <SplashScreen onAnimationComplete={mockCallback} duration={duration} />,
    );

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalled();
      done();
    }, duration + 50);
  });

  it('renders with default duration when not provided', () => {
    const { getByText } = render(<SplashScreen />);

    expect(getByText('YOEX')).toBeTruthy();
    expect(getByText('Wallet')).toBeTruthy();
  });
});
