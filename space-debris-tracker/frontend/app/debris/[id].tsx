// ============================================================
// app/debris/[id].tsx — Debris detail screen
// Orbital data grid, collapsible TLE, risk score, history chart
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { theme, getRiskColor, getRiskLabel } from '../../constants/theme';
import { DebrisService } from '../../services/api';
import { Debris } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { MOCK_DEBRIS } from '../../hooks/useDebris';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock risk history for the chart
function generateMockHistory(baseScore: number): { score: number; label: string }[] {
  const history: { score: number; label: string }[] = [];
  for (let i = 9; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 20;
    const score = Math.min(100, Math.max(0, Math.round(baseScore + variance)));
    history.push({ score, label: `-${i * 3}m` });
  }
  return history;
}

function getRiskDescription(level: string, score: number): string {
  switch (level) {
    case 'critical':
      return `Risco crítico detectado (score ${score}/100). Este objeto orbital representa uma ameaça iminente a satélites operacionais e à Estação Espacial Internacional. Monitoramento contínuo e manobras evasivas são recomendadas.`;
    case 'high':
      return `Risco elevado (score ${score}/100). O objeto está em trajetória potencialmente perigosa. Agências espaciais foram notificadas e possíveis manobras corretivas estão sendo avaliadas.`;
    case 'medium':
      return `Risco moderado (score ${score}/100). O debris está sendo acompanhado ativamente. A probabilidade de colisão nos próximos 72 horas é baixa, porém o monitoramento é contínuo.`;
    case 'low':
      return `Risco baixo (score ${score}/100). Objeto estável em órbita controlada. Sem previsão de aproximação perigosa com ativos operacionais no horizonte de 7 dias.`;
    default:
      return 'Classificação de risco não disponível.';
  }
}

export default function DebrisDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [debris, setDebris] = useState<Debris | null>(null);
  const [loading, setLoading] = useState(true);
  const [tleExpanded, setTleExpanded] = useState(false);
  const [history] = useState(() => generateMockHistory(50));

  const fetchDebris = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await DebrisService.getById(id);
      setDebris(res.data);
    } catch {
      // Fallback to mock data
      const mock = MOCK_DEBRIS.find((d) => d.id === id) ?? MOCK_DEBRIS[0];
      setDebris(mock);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDebris();
  }, [fetchDebris]);

  if (loading || !debris) {
    return (
      <View style={styles.centered}>
        <LoadingSpinner message="CARREGANDO OBJETO ORBITAL..." />
      </View>
    );
  }

  const riskColor = getRiskColor(debris.risk_level);
  const historyScores = history.map((h) => h.score);
  const historyLabels = history.map((_, i) => (i % 3 === 0 ? history[i].label : ''));

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Object Header ─────────────────────────── */}
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.objectHeader}
      >
        <View style={styles.objectHeaderTop}>
          <View style={styles.objectHeaderInfo}>
            <Text style={styles.objectName}>{debris.name}</Text>
            <Text style={styles.objectNorad}>
              NORAD #{String(debris.norad_id).padStart(5, '0')}
            </Text>
          </View>
          <RiskBadge level={debris.risk_level} size="lg" />
        </View>
      </LinearGradient>

      {/* ── Orbital Data Grid ─────────────────────── */}
      <SectionCard title="DADOS ORBITAIS">
        <View style={styles.dataGrid}>
          <GridCell label="ALTITUDE" value={`${debris.altitude_km.toFixed(1)} km`} />
          <GridCell label="VELOCIDADE" value={`${debris.velocity_km_s.toFixed(2)} km/s`} />
          <GridCell label="INCLINAÇÃO" value={`${debris.inclination_deg.toFixed(4)}°`} />
          <GridCell label="PERÍODO" value={`${debris.period_min.toFixed(2)} min`} />
        </View>
      </SectionCard>

      {/* ── TLE Raw (collapsible) ──────────────────── */}
      <SectionCard
        title="DADOS TLE"
        rightAction={
          <Pressable onPress={() => setTleExpanded(!tleExpanded)}>
            <Text style={styles.expandBtn}>
              {tleExpanded ? '▲ RECOLHER' : '▼ EXPANDIR'}
            </Text>
          </Pressable>
        }
      >
        {tleExpanded && (
          <View style={styles.tleContainer}>
            <Text style={styles.tleLine}>{debris.tle_line1}</Text>
            <Text style={styles.tleLine}>{debris.tle_line2}</Text>
          </View>
        )}
        {!tleExpanded && (
          <Text style={styles.tlePreview}>
            Pressione para exibir as linhas TLE brutas...
          </Text>
        )}
      </SectionCard>

      {/* ── Risk Assessment ───────────────────────── */}
      <SectionCard title="AVALIAÇÃO DE RISCO">
        {/* Score display */}
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: riskColor }]}>
            {debris.risk_score}
          </Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <LinearGradient
            colors={[riskColor + '60', riskColor]}
            style={[styles.progressFill, { width: `${debris.risk_score}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        <Text style={styles.riskDescription}>
          {getRiskDescription(debris.risk_level, debris.risk_score)}
        </Text>

        <View style={styles.riskLevelRow}>
          <Text style={styles.riskLevelLabel}>NÍVEL: </Text>
          <Text style={[styles.riskLevelValue, { color: riskColor }]}>
            {getRiskLabel(debris.risk_level)}
          </Text>
        </View>
      </SectionCard>

      {/* ── Risk History Chart ────────────────────── */}
      <SectionCard title="HISTÓRICO DE RISCO (10 LEITURAS)">
        <Text style={styles.chartNote}>* Dados simulados para demonstração</Text>
        <LineChart
          data={{
            labels: historyLabels,
            datasets: [{ data: historyScores, color: () => riskColor, strokeWidth: 2 }],
          }}
          width={SCREEN_WIDTH - theme.spacing.lg * 2 - theme.spacing.md * 2}
          height={140}
          chartConfig={{
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            color: () => riskColor,
            labelColor: () => theme.colors.textMuted,
            style: { borderRadius: theme.radius.md },
            propsForDots: {
              r: '3',
              strokeWidth: '1',
              stroke: riskColor,
            },
            decimalPlaces: 0,
          }}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          withHorizontalLines
          transparent
        />
      </SectionCard>

      {/* ── Ask Agent CTA ─────────────────────────── */}
      <Pressable
        style={({ pressed }) => [styles.agentBtn, pressed && { opacity: 0.8 }]}
        onPress={() => router.push({ pathname: '/agent', params: { prefill: debris.name } })}
      >
        <LinearGradient
          colors={[theme.colors.accentDim, theme.colors.background]}
          style={styles.agentBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.agentBtnIcon}>🤖</Text>
          <Text style={styles.agentBtnLabel}>PERGUNTAR AO AGENTE</Text>
          <Text style={styles.agentBtnArrow}>→</Text>
        </LinearGradient>
      </Pressable>

      {/* Last updated */}
      <Text style={styles.updatedAt}>
        Atualizado: {new Date(debris.updated_at).toLocaleString('pt-BR')}
      </Text>
    </ScrollView>
  );
}

// ─── Sub-components ─────────────────────────────────────────

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}

function SectionCard({ title, children, rightAction }: SectionCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {rightAction}
      </View>
      {children}
    </View>
  );
}

interface GridCellProps {
  label: string;
  value: string;
}

function GridCell({ label, value }: GridCellProps): React.JSX.Element {
  return (
    <View style={styles.gridCell}>
      <Text style={styles.gridLabel}>{label}</Text>
      <Text style={styles.gridValue}>{value}</Text>
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

  // Object header
  objectHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  objectHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  objectHeaderInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  objectName: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 16,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
  objectNorad: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.8,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: theme.colors.accent,
    letterSpacing: 2,
  },

  // Data grid
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  gridCell: {
    width: '47%',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
  },
  gridLabel: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  gridValue: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },

  // TLE
  expandBtn: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.accent,
    letterSpacing: 1,
  },
  tleContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    gap: 4,
  },
  tleLine: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  tlePreview: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 13,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },

  // Risk assessment
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  scoreValue: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 48,
    fontWeight: '400',
  },
  scoreMax: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 20,
    color: theme.colors.textMuted,
    marginLeft: 4,
  },
  progressBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
  riskDescription: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.sm,
  },
  riskLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLevelLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  riskLevelValue: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1.5,
  },

  // History chart
  chartNote: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
    fontStyle: 'italic',
  },
  chart: {
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.xs,
  },

  // Agent CTA
  agentBtn: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.accentDim,
  },
  agentBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  agentBtnIcon: {
    fontSize: 20,
  },
  agentBtnLabel: {
    flex: 1,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    color: theme.colors.accent,
    letterSpacing: 1.5,
  },
  agentBtnArrow: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 16,
    color: theme.colors.accent,
  },

  // Footer
  updatedAt: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: theme.colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.8,
    marginTop: theme.spacing.sm,
  },
});
