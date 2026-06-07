// ============================================================
// app/index.tsx — Home: Debris list with risk filter & polling
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { useDebris } from '../hooks/useDebris';
import { DebrisCard } from '../components/DebrisCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RiskLevel } from '../types';

type FilterOption = 'ALL' | RiskLevel;

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'ALL', label: 'TODOS' },
  { key: 'low', label: 'BAIXO' },
  { key: 'medium', label: 'MÉDIO' },
  { key: 'high', label: 'ALTO' },
  { key: 'critical', label: 'CRÍTICO' },
];

function formatTime(date: Date | null): string {
  if (!date) return '--:--:--';
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filterRisk = activeFilter === 'ALL' ? undefined : activeFilter;
  const { data, loading, error, lastUpdate, isMockData, refetch } = useDebris(filterRisk);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleDebrisPress = useCallback(
    (id: string) => {
      router.push(`/debris/${id}`);
    },
    [router]
  );

  const handleGoToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleExitApp = useCallback(() => {
    Alert.alert(
      'Sair da Aplicação',
      'Tem certeza que deseja sair do Space Debris Tracker?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => BackHandler.exitApp() }
      ]
    );
  }, []);

  const filterColor = (key: FilterOption): string => {
    switch (key) {
      case 'low':      return theme.colors.riskLow;
      case 'medium':   return theme.colors.riskMedium;
      case 'high':     return theme.colors.riskHigh;
      case 'critical': return theme.colors.riskCritical;
      default:         return theme.colors.accent;
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Header ───────────────────────────────────── */}
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>SPACE DEBRIS TRACKER</Text>
            <Text style={styles.headerSubtitle}>ORBITAL RISK MONITOR</Text>
          </View>
          
          <View style={styles.headerRightActions}>
            {/* Online / mock indicator */}
            <View style={[styles.statusDot, { backgroundColor: isMockData ? theme.colors.riskMedium : theme.colors.riskLow }]} />
            
            {/* Botão de Sair */}
            <Pressable onPress={handleExitApp} style={styles.exitBtn}>
              <Text style={styles.exitBtnIcon}>⏻</Text>
            </Pressable>
          </View>
        </View>

        {/* Counter bar */}
        <View style={styles.counterBar}>
          <Text style={styles.counterText}>
            <Text style={styles.counterHighlight}>{data.length}</Text>
            {' '}objetos monitorados
          </Text>
          <Text style={styles.counterTime}>
            Atualização: {formatTime(lastUpdate)}
          </Text>
        </View>

        {/* Mock data warning */}
        {isMockData && (
          <View style={styles.mockWarning}>
            <Text style={styles.mockWarningText}>
              ⚠ API offline — exibindo dados de demonstração
            </Text>
          </View>
        )}

        {/* ── Filter Bar ─────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            const color = filterColor(f.key);
            return (
              <Pressable
                key={f.key}
                style={[
                  styles.filterBtn,
                  isActive && { borderColor: color, backgroundColor: `${color}15` },
                ]}
                onPress={() => setActiveFilter(f.key)}
              >
                {isActive && <View style={[styles.filterDot, { backgroundColor: color }]} />}
                <Text
                  style={[
                    styles.filterLabel,
                    { color: isActive ? color : theme.colors.textMuted },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* ── Content ──────────────────────────────────── */}
      {loading ? (
        <View style={styles.centered}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DebrisCard debris={item} onPress={handleDebrisPress} />
          )}
          contentContainerStyle={[
            styles.listContent,
            data.length === 0 && styles.listContentEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.accent}
              colors={[theme.colors.accent]}
              progressBackgroundColor={theme.colors.surface}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛸</Text>
              <Text style={styles.emptyTitle}>
                {error ? 'ERRO DE CONEXÃO' : 'NENHUM OBJETO ENCONTRADO'}
              </Text>
              <Text style={styles.emptyMessage}>
                {error ?? 'Nenhum debris encontrado para o filtro selecionado.'}
              </Text>
              <Pressable style={styles.retryBtn} onPress={handleRefresh}>
                <Text style={styles.retryLabel}>TENTAR NOVAMENTE</Text>
              </Pressable>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── FAB — Dashboard ──────────────────────────── */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        onPress={handleGoToDashboard}
      >
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.accentDim]}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>🛰</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 18,
    color: theme.colors.textPrimary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    letterSpacing: 3,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: 4,
  },
  exitBtn: {
    paddingHorizontal: 4,
  },
  exitBtnIcon: {
    fontSize: 16,
    color: theme.colors.riskHigh,
  },
  counterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  counterText: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  counterHighlight: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 14,
    color: theme.colors.accent,
  },
  counterTime: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  mockWarning: {
    backgroundColor: `${theme.colors.riskMedium}18`,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: `${theme.colors.riskMedium}40`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginBottom: theme.spacing.xs,
  },
  mockWarningText: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 11,
    color: theme.colors.riskMedium,
  },
  filterScroll: {
    marginTop: theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    gap: 5,
  },
  filterDot: {
    width: 5,
    height: 5,
    borderRadius: theme.radius.full,
  },
  filterLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // space for FAB
  },
  listContentEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  emptyMessage: {
    fontFamily: 'Rajdhani_400Regular',
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  retryLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: theme.colors.accent,
    letterSpacing: 1.5,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.md,
    borderRadius: theme.radius.full,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 24,
  },
});
