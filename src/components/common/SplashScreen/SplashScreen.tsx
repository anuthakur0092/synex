import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import { Logo } from '../Logo';
import { styles } from './SplashScreen.styles';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
  duration = 3000,
}) => {
  // Main animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.9)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoBounce = useRef(new Animated.Value(0)).current;

  // Background curve animations
  const topCurveRotation = useRef(new Animated.Value(0)).current;
  const bottomCurveRotation = useRef(new Animated.Value(0)).current;
  const decorativeCurve1Rotation = useRef(new Animated.Value(0)).current;
  const decorativeCurve2Rotation = useRef(new Animated.Value(0)).current;

  // Additional background animations
  const gradientOrb1Scale = useRef(new Animated.Value(0.8)).current;
  const gradientOrb2Scale = useRef(new Animated.Value(0.6)).current;
  const gradientOrb3Scale = useRef(new Animated.Value(0.9)).current;
  const gradientOrb1Opacity = useRef(new Animated.Value(0.3)).current;
  const gradientOrb2Opacity = useRef(new Animated.Value(0.2)).current;
  const gradientOrb3Opacity = useRef(new Animated.Value(0.25)).current;

  // Floating geometric shapes
  const geometricShapes = useRef(
    Array.from({ length: 4 }, () => ({
      translateX: new Animated.Value(Math.random() * width),
      translateY: new Animated.Value(Math.random() * height),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      opacity: new Animated.Value(0.1 + Math.random() * 0.2),
    })),
  ).current;

  // Pulsing background elements
  const pulseElements = useRef(
    Array.from({ length: 3 }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.1),
    })),
  ).current;

  // Loading dots animations
  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;

  // Particle animations
  const particles = useRef(
    Array.from({ length: 6 }, () => ({
      translateX: new Animated.Value(Math.random() * width),
      translateY: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    })),
  ).current;

  // Exit animations
  const exitAnim = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Particle floating animation
    const createParticleAnimation = (particle: any, index: number) => {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const endX = Math.random() * width;
      const endY = Math.random() * height;

      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.6,
              duration: 1000,
              delay: index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 1000,
              delay: index * 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.translateX, {
              toValue: endX,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: endY,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 },
      );
    };

    // Background curve rotations
    const createCurveAnimation = (animValue: Animated.Value, speed: number) => {
      return Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: speed,
          useNativeDriver: true,
        }),
        { iterations: -1 },
      );
    };

    // Gradient orb animations
    const createGradientOrbAnimation = (
      scaleAnim: Animated.Value,
      opacityAnim: Animated.Value,
      delay: number,
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 3000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.5,
              duration: 3000,
              delay,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.2,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ]),
        { iterations: -1 },
      );
    };

    // Geometric shape floating animation
    const createGeometricShapeAnimation = (shape: any, index: number) => {
      const endX = Math.random() * width;
      const endY = Math.random() * height;

      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(shape.translateX, {
              toValue: endX,
              duration: 8000 + Math.random() * 4000,
              delay: index * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(shape.translateY, {
              toValue: endY,
              duration: 8000 + Math.random() * 4000,
              delay: index * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(shape.rotate, {
              toValue: 1,
              duration: 12000,
              delay: index * 1000,
              useNativeDriver: true,
            }),
          ]),
        ]),
        { iterations: -1 },
      );
    };

    // Pulsing element animation
    const createPulseElementAnimation = (pulseElement: any, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseElement.scale, {
              toValue: 1.5,
              duration: 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(pulseElement.opacity, {
              toValue: 0.3,
              duration: 2000,
              delay,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseElement.scale, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseElement.opacity, {
              toValue: 0.1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]),
        { iterations: -1 },
      );
    };

    // Pulsing animation for loading dots
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1.5,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // Start all animations
    const startAnimations = () => {
      // Background fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Background curve rotations
      createCurveAnimation(topCurveRotation, 20000).start();
      createCurveAnimation(bottomCurveRotation, 15000).start();
      createCurveAnimation(decorativeCurve1Rotation, 25000).start();
      createCurveAnimation(decorativeCurve2Rotation, 18000).start();

      // Gradient orb animations
      createGradientOrbAnimation(
        gradientOrb1Scale,
        gradientOrb1Opacity,
        0,
      ).start();
      createGradientOrbAnimation(
        gradientOrb2Scale,
        gradientOrb2Opacity,
        1000,
      ).start();
      createGradientOrbAnimation(
        gradientOrb3Scale,
        gradientOrb3Opacity,
        2000,
      ).start();

      // Geometric shape animations
      geometricShapes.forEach((shape, index) => {
        createGeometricShapeAnimation(shape, index).start();
      });

      // Pulsing element animations
      pulseElements.forEach((pulseElement, index) => {
        createPulseElementAnimation(pulseElement, index * 500).start();
      });

      // Particle animations
      particles.forEach((particle, index) => {
        createParticleAnimation(particle, index).start();
      });

      // Logo entrance animation with bounce and rotation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: 300,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 1200,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Logo bounce effect after entrance
        Animated.sequence([
          Animated.timing(logoBounce, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(logoBounce, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Text fade in with staggered effect
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          delay: 800,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          delay: 800,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Start dot animations
      createPulseAnimation(dot1Scale, 0).start();
      createPulseAnimation(dot2Scale, 200).start();
      createPulseAnimation(dot3Scale, 400).start();

      // Complete animation after duration
      if (onAnimationComplete) {
        setTimeout(() => {
          // Exit animations
          Animated.parallel([
            Animated.timing(exitAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(exitScale, {
              toValue: 0.9,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onAnimationComplete();
          });
        }, duration);
      }
    };

    startAnimations();
  }, [
    fadeAnim,
    scaleAnim,
    logoOpacity,
    textOpacity,
    textScale,
    logoRotation,
    logoBounce,
    topCurveRotation,
    bottomCurveRotation,
    decorativeCurve1Rotation,
    decorativeCurve2Rotation,
    gradientOrb1Scale,
    gradientOrb1Opacity,
    gradientOrb2Scale,
    gradientOrb2Opacity,
    gradientOrb3Scale,
    gradientOrb3Opacity,
    geometricShapes,
    pulseElements,
    dot1Scale,
    dot2Scale,
    dot3Scale,
    particles,
    exitAnim,
    exitScale,
    onAnimationComplete,
    duration,
  ]);

  // Interpolate rotation values
  const topCurveSpin = topCurveRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '345deg'],
  });

  const bottomCurveSpin = bottomCurveRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['25deg', '385deg'],
  });

  const decorativeCurve1Spin = decorativeCurve1Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['45deg', '405deg'],
  });

  const decorativeCurve2Spin = decorativeCurve2Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-30deg', '330deg'],
  });

  const logoSpin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolate geometric shape rotations
  const geometricShapeRotations = geometricShapes.map(shape =>
    shape.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: Animated.multiply(fadeAnim, exitAnim),
          transform: [{ scale: exitScale }],
        },
      ]}
    >
      {/* Background with animated curved elements */}
      <View style={styles.background}>
        {/* Top curved element */}
        <Animated.View
          style={[styles.topCurve, { transform: [{ rotate: topCurveSpin }] }]}
        />

        {/* Bottom curved element */}
        <Animated.View
          style={[
            styles.bottomCurve,
            { transform: [{ rotate: bottomCurveSpin }] },
          ]}
        />

        {/* Additional decorative curves */}
        <Animated.View
          style={[
            styles.decorativeCurve1,
            { transform: [{ rotate: decorativeCurve1Spin }] },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeCurve2,
            { transform: [{ rotate: decorativeCurve2Spin }] },
          ]}
        />
      </View>

      {/* Animated gradient orbs */}
      <Animated.View
        style={[
          styles.gradientOrb1,
          {
            opacity: gradientOrb1Opacity,
            transform: [{ scale: gradientOrb1Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.gradientOrb2,
          {
            opacity: gradientOrb2Opacity,
            transform: [{ scale: gradientOrb2Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.gradientOrb3,
          {
            opacity: gradientOrb3Opacity,
            transform: [{ scale: gradientOrb3Scale }],
          },
        ]}
      />

      {/* Floating geometric shapes */}
      {geometricShapes.map((shape, index) => (
        <Animated.View
          key={`shape-${index}`}
          style={[
            index % 2 === 0 ? styles.geometricShape1 : styles.geometricShape2,
            {
              opacity: shape.opacity,
              transform: [
                { translateX: shape.translateX },
                { translateY: shape.translateY },
                { rotate: geometricShapeRotations[index] },
                { scale: shape.scale },
              ],
            },
          ]}
        />
      ))}

      {/* Pulsing background elements */}
      {pulseElements.map((pulseElement, index) => (
        <Animated.View
          key={`pulse-${index}`}
          style={[
            styles.pulseElement,
            {
              opacity: pulseElement.opacity,
              transform: [{ scale: pulseElement.scale }],
            },
          ]}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            index % 3 === 0
              ? styles.particle
              : index % 3 === 1
              ? styles.particle1
              : styles.particle2,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(scaleAnim, logoBounce) },
                { rotate: logoSpin },
              ],
            },
          ]}
        >
          <Logo size="xxl" variant="default" showText={false} />
        </Animated.View>

        {/* Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ scale: textScale }],
            },
          ]}
        >
          <Image
            source={require('../../../assets/app_new_logo_black.png')}
            style={{ width: 200, height: 80 }}
          />
        </Animated.View>
      </View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[styles.loadingDot, { transform: [{ scale: dot1Scale }] }]}
        />
        <Animated.View
          style={[
            styles.loadingDot,
            styles.loadingDotDelay1,
            { transform: [{ scale: dot2Scale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingDot,
            styles.loadingDotDelay2,
            { transform: [{ scale: dot3Scale }] },
          ]}
        />
      </View>
    </Animated.View>
  );
};
