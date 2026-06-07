// ============================================================
// components/RiskBadge.tsx — Colored risk level badge
// Animates with pulse for 'critical' level
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { theme, getRiskColor, getRiskLabel } from '../constants/theme';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function RiskBadge({ level, size = 'md', style }: RiskBadgeProps): React.JSX.Element {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const riskColor = getRiskColor(level);
  const label = getRiskLabel(level);

  // Pulsing animation for critical level
  useEffect(() => {
    if (level === 'critical') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
      return undefined;
    }
  }, [level, pulseAnim]);

  const sizeStyles = {
    sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 9 },
    md: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 11 },
    lg: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 13 },
  }[size];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: riskColor,
          backgroundColor: `${riskColor}18`,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          shadowColor: riskColor,
          opacity: level === 'critical' ? pulseAnim : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: riskColor },
        ]}
      />
      <Text
        style={[
          styles.label,
          { color: riskColor, fontSize: sizeStyles.fontSize },
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: theme.radius.full,
  },
  label: {
    fontFamily: theme.fonts.display,
    letterSpacing: 1.2,
    fontWeight: '600',
  },
});
