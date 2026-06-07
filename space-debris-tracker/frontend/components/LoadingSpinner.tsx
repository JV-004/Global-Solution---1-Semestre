// ============================================================
// components/LoadingSpinner.tsx — Themed orbital loading indicator
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Easing,
} from 'react-native';
import { theme } from '../constants/theme';

interface LoadingSpinnerProps {
  message?: string;
  style?: ViewStyle;
  size?: number;
}

export function LoadingSpinner({
  message = 'CARREGANDO DADOS ORBITAIS...',
  style,
  size = 60,
}: LoadingSpinnerProps): React.JSX.Element {
  const rotation = useRef(new Animated.Value(0)).current;
  const outerRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Inner ring — fast rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Outer ring — slow counter-rotation
    Animated.loop(
      Animated.timing(outerRotation, {
        toValue: -1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation, outerRotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const outerSpin = outerRotation.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-360deg', '0deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: outerSpin }],
          },
        ]}
      />

      {/* Inner ring */}
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: size * 0.65,
            height: size * 0.65,
            borderRadius: (size * 0.65) / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {/* Center dot */}
      <View
        style={[
          styles.centerDot,
          {
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: (size * 0.2) / 2,
          },
        ]}
      />

      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.accent,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.accentDim,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  centerDot: {
    backgroundColor: theme.colors.accent,
    position: 'absolute',
  },
  message: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 70,
    textAlign: 'center',
  },
});
