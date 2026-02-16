import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

const icons = {
  success: require('../../../assets/json/success.json'),
};

export type LottieIconName = keyof typeof icons;

export interface LottieIconProps {
  icon: LottieIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  loop?: boolean;
}

const LottieIcon: React.FC<LottieIconProps> = ({
  icon,
  size = 60,
  style,
  loop = false,
}) => {
  return (
    <LottieView
      source={icons[icon]}
      autoPlay
      loop={loop}
      style={[{ width: size, height: size }, style]}
    />
  );
};

export default LottieIcon;
