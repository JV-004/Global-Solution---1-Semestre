// ============================================================
// app/dashboard.tsx — Orbital Control Panel Dashboard
// Risk distribution chart, top 5, alerts, summary stats
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React, { useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme, getRiskColor, getRiskLabel } from '../constants/theme';
import { useDebris } from '../hooks/useDebris';
import { RiskChart } from '../components/RiskChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RiskBadge } from '../components/RiskBadge';
import { Debris, RiskSummary } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function computeSummary(data: Debris[]): RiskSummary {
  return {
    total: data.length,
    low: data.filter((d) => d.risk_level === 'low').length,
    medium: data.filter((d) => d.risk_level === 'medium').length,
    high: data.filter((d) => d.risk_level === 'high').length,
    critical: data.filter((d) => d.risk_level === 'critical').length,
  };
}

export default function DashboardScreen(): React.JSX.Element {
  const router = useRouter();
  const { data, loading, isMockData, refetch } = useDebris();

  const summary = useMemo(() => computeSummary(data), [data]);

  const topFive = useMemo(
    () => [...data].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5),
    [data]
  );

  const alerts = useMemo(
    () =>
      data
        .filter((d) => d.risk_level === 'high' || d.risk_level === 'critical')
        .sort((a, b) => b.risk_score - a.risk_score),
    [data]
  );

  const mostDangerous = topFive[0] ?? null;
  const criticalPct =
    summary.total > 0
      ? (((summary.critical + summary.high) / summary.total) * 100).toFixed(1)
      : '0';

  // Bar chart data — top 5 debris
  const barData = {
    labels: topFive.map((d) => d.name.substring(0, 8)),
    datasets: [
      {
        data: topFive.map((d) => d.risk_score),
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <LoadingSpinner message="CARREGANDO PAINEL ORBITAL..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refetch}
          tintColor={theme.colors.accent}
          colors={[theme.colors.accent]}
          progressBackgroundColor={theme.colors.surface}
        />
      }
    >
      {/* ── Page Header ─────────────────────────────── */}
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.pageHeader}
      >
        <Text style={styles.pageTitle}>PAINEL DE CONTROLE ORBITAL</Text>
        <Text style={styles.pageSubtitle}>
          {isMockData ? '● DADOS DE DEMONSTRAÇÃO' : '● DADOS AO VIVO'}
        </Text>
      </LinearGradient>

      {/* ── Summary Card ──────────────────────────── */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryGrid}>
          <SummaryCell
            label="OBJETOS"
            value={String(summary.total)}
            color={theme.colors.accent}
          />
          <SummaryCell
            label="ALTO RISCO"
            value={`${criticalPct}%`}
            color={theme.colors.riskHigh}
          />
          <SummaryCell
            label="CRÍTICOS"
            value={String(summary.critical)}
            color={theme.colors.riskCritical}
          />
        </View>

        {mostDangerous && (
          <View style={styles.mostDangerous}>
            <Text style={styles.mostDangerousLabel}>OBJETO MAIS PERIGOSO:</Text>
            <Pressable
              style={styles.mostDangerousRow}
              onPress={() => router.push(`/debris/${mostDangerous.id}`)}
            >
              <Text style={styles.mostDangerousName} numberOfLines={1}>
                {mostDangerous.name}
              </Text>
              <RiskBadge level={mostDangerous.risk_level} size="sm" />
            </Pressable>
          </View>
        )}
      </View>

      {/* ── Risk Distribution Donut ─────────────────── */}
      <SectionCard title="DISTRIBUIÇÃO DE RISCO">
        <RiskChart summary={summary} />
      </SectionCard>

      {/* ── Top 5 Bar Chart ─────────────────────────── */}
      {topFive.length > 0 && (
        <SectionCard title="TOP 5 — MAIOR PONTUAÇÃO DE RISCO">
          <BarChart
            data={barData}
            width={SCREEN_WIDTH - theme.spacing.md * 2 - theme.spacing.md * 2}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              color: (opacity = 1) => `rgba(255, 29, 68, ${opacity})`,
              labelColor: () => theme.colors.textMuted,
              decimalPlaces: 0,
              barPercentage: 0.6,
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: theme.colors.border,
                strokeWidth: 0.5,
              },
            }}
            style={styles.barChart}
            showValuesOnTopOfBars
            fromZero
            withHorizontalLabels
          />
        </SectionCard>
      )}

      {/* ── Alerts List ─────────────────────────────── */}
      <SectionCard title={`ALERTAS ATIVOS (${alerts.length})`}>
        {alerts.length === 0 ? (
          <Text style={styles.noAlerts}>
            ✓ Nenhum objeto em risco alto ou crítico no momento.
          </Text>
        ) : (
          alerts.map((debris) => (
            <Pressable
              key={debris.id}
              style={({ pressed }) => [
                styles.alertItem,
                { borderLeftColor: getRiskColor(debris.risk_level) },
                pressed && { backgroundColor: theme.colors.surfaceLight },
              ]}
              onPress={() => router.push(`/debris/${debris.id}`)}
            >
              <View style={styles.alertItemInner}>
                <Text style={styles.alertName} numberOfLines={1}>
                  {debris.name}
                </Text>
                <Text style={[styles.alertScore, { color: getRiskColor(debris.risk_level) }]}>
                  {debris.risk_score}/100
                </Text>
              </View>
              <View style={styles.alertMeta}>
                <Text style={styles.alertNorad}>
                  NORAD #{String(debris.norad_id).padStart(5, '0')}
                </Text>
                <RiskBadge level={debris.risk_level} size="sm" />
              </View>
            </Pressable>
          ))
        )}
      </SectionCard>
    </ScrollView>
  );
}

// ─── Sub-components ─────────────────────────────────────────

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

function SectionCard({ title, children }: SectionCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

interface SummaryCellProps {
  label: string;
  value: string;
  color: string;
}

function SummaryCell({ label, value, color }: SummaryCellProps): React.JSX.Element {
  return (
    <View style={styles.summaryCell}>
      <Text style={[styles.summaryCellValue, { color }]}>{value}</Text>
      <Text style={styles.summaryCellLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  centered: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page header
  pageHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  pageTitle: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 14,
    color: theme.colors.textPrimary,
    letterSpacing: 2,
  },
  pageSubtitle: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginTop: 4,
  },

  // Summary card
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  summaryCell: {
    alignItems: 'center',
  },
  summaryCellValue: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 28,
  },
  summaryCellLabel: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  mostDangerous: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
    gap: 6,
  },
  mostDangerousLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
  },
  mostDangerousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mostDangerousName: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  // Generic card
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.accent,
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },

  // Bar chart
  barChart: {
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.xs,
  },

  // Alerts
  noAlerts: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 14,
    color: theme.colors.riskLow,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
  },
  alertItem: {
    borderRadius: theme.radius.sm,
    borderLeftWidth: 3,
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    gap: 4,
  },
  alertItemInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertName: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  alertScore: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertNorad: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.textMuted,
  },
});
