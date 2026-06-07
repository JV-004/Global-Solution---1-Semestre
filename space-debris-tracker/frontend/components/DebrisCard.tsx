// ============================================================
// components/DebrisCard.tsx — Card for debris list items
// Left border colored by risk level, SpaceMono for technical data
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme, getRiskColor } from '../constants/theme';
import { Debris } from '../types';
import { RiskBadge } from './RiskBadge';

interface DebrisCardProps {
  debris: Debris;
  onPress?: (id: string) => void;
}

export function DebrisCard({ debris, onPress }: DebrisCardProps): React.JSX.Element {
  const riskColor = getRiskColor(debris.risk_level);

  const handlePress = (): void => {
    onPress?.(debris.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { borderLeftColor: riskColor },
        pressed && styles.containerPressed,
      ]}
      onPress={handlePress}
      android_ripple={{ color: `${riskColor}20`, borderless: false }}
    >
      {/* Top row: name + badge */}
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {debris.name}
        </Text>
        <RiskBadge level={debris.risk_level} size="sm" />
      </View>

      {/* NORAD ID */}
      <Text style={styles.noradId}>
        NORAD #{String(debris.norad_id).padStart(5, '0')}
      </Text>

      {/* Data row */}
      <View style={styles.dataRow}>
        <DataItem
          label="ALTITUDE"
          value={`${debris.altitude_km.toFixed(1)} km`}
        />
        <DataItem
          label="VELOCIDADE"
          value={`${debris.velocity_km_s.toFixed(2)} km/s`}
        />
        <DataItem
          label="INCLINAÇÃO"
          value={`${debris.inclination_deg.toFixed(2)}°`}
        />
        <DataItem
          label="RISCO"
          value={`${debris.risk_score}/100`}
          highlight
          color={riskColor}
        />
      </View>
    </Pressable>
  );
}

interface DataItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}

function DataItem({ label, value, highlight = false, color }: DataItemProps): React.JSX.Element {
  return (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text
        style={[
          styles.dataValue,
          highlight && color ? { color } : {},
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderLeftWidth: 4,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 6,
  },
  containerPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  noradId: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dataItem: {
    alignItems: 'flex-start',
    flex: 1,
  },
  dataLabel: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  dataValue: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
