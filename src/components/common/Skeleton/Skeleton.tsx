import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, View, ViewStyle } from 'react-native';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  radius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ style, radius = 8 }) => {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [opacity]);

  return (
    <View style={[{ overflow: 'hidden', borderRadius: radius }, style]}>
      <Animated.View
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          height: '100%',
          opacity,
        }}
      />
    </View>
  );
};
