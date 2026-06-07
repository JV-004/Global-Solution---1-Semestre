// ============================================================
// components/RiskChart.tsx — Donut chart of risk distribution
// Uses react-native-chart-kit PieChart + custom legend
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../constants/theme';
import { RiskSummary } from '../types';

interface RiskChartProps {
  summary: RiskSummary;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHART_CONFIG = {
  color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(232, 244, 253, ${opacity})`,
  backgroundGradientFrom: theme.colors.surface,
  backgroundGradientTo: theme.colors.surface,
};

// Explicit chart entry type matching react-native-chart-kit's requirements
type ChartEntry = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export function RiskChart({ summary }: RiskChartProps): React.JSX.Element {
  const total = summary.total || 1; // avoid division by zero

  const allEntries: ChartEntry[] = [
    {
      name: 'Crítico',
      population: summary.critical,
      color: theme.colors.riskCritical as string,
      legendFontColor: theme.colors.riskCritical as string,
      legendFontSize: 12,
    },
    {
      name: 'Alto',
      population: summary.high,
      color: theme.colors.riskHigh as string,
      legendFontColor: theme.colors.riskHigh as string,
      legendFontSize: 12,
    },
    {
      name: 'Médio',
      population: summary.medium,
      color: theme.colors.riskMedium as string,
      legendFontColor: theme.colors.riskMedium as string,
      legendFontSize: 12,
    },
    {
      name: 'Baixo',
      population: summary.low,
      color: theme.colors.riskLow as string,
      legendFontColor: theme.colors.riskLow as string,
      legendFontSize: 12,
    },
  ];

  const chartData = allEntries.filter((d) => d.population > 0);
  const chartWidth = Math.min(SCREEN_WIDTH - theme.spacing.lg * 2, 380);

  // Empty state
  if (chartData.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>SEM DADOS DISPONÍVEIS</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={chartWidth}
        height={180}
        chartConfig={CHART_CONFIG}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute={false}
        hasLegend={true}
        style={styles.chart}
      />

      {/* Custom legend with percentages */}
      <View style={styles.legend}>
        {[
          { label: 'CRÍTICO', count: summary.critical, color: theme.colors.riskCritical as string },
          { label: 'ALTO', count: summary.high, color: theme.colors.riskHigh as string },
          { label: 'MÉDIO', count: summary.medium, color: theme.colors.riskMedium as string },
          { label: 'BAIXO', count: summary.low, color: theme.colors.riskLow as string },
        ].map(({ label, count, color }) => {
          const pct = ((count / total) * 100).toFixed(1);
          return (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={[styles.legendLabel, { color }]}>{label}</Text>
              <Text style={styles.legendCount}>{count}</Text>
              <Text style={styles.legendPct}>({pct}%)</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 2,
  },
  chart: {
    marginVertical: 0,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  legendCount: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.textSecondary,
  },
  legendPct: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.textMuted,
  },
});
