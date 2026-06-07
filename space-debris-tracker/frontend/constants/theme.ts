// ============================================================
// constants/theme.ts — Design tokens: Space Debris Tracker
// Tema: Espacial / Sci-Fi Sombrio — Controle de Missão
// FIAP Global Solution 2026.1
// ============================================================

export const theme = {
  colors: {
    // Backgrounds
    background: '#020B18', // azul-preto espacial profundo
    surface: '#071829', // superfície de cards
    surfaceLight: '#0D2137', // superfície elevada / hover
    border: '#1A3A5C', // bordas sutis

    // Accent
    accent: '#00D4FF', // ciano elétrico — elemento principal
    accentDim: '#005F73', // ciano escuro para fundos de badge

    // Text
    textPrimary: '#E8F4FD', // branco levemente azulado
    textSecondary: '#7BA7C4', // cinza-azulado para labels
    textMuted: '#3D6B8A', // texto desabilitado / placeholder

    // Risk Levels — semântico
    riskLow: '#00E676', // verde néon
    riskMedium: '#FFD600', // amarelo âmbar
    riskHigh: '#FF6D00', // laranja alerta
    riskCritical: '#FF1744', // vermelho crítico

    // Utility
    white: '#FFFFFF',
    transparent: 'transparent',
  },

  fonts: {
    display: 'SpaceMono_400Regular', // monospace — IDs, coordenadas, dados TLE
    body: 'Rajdhani_400Regular', // sci-fi humanista — textos e labels
    bodyMedium: 'Rajdhani_500Medium',
    bodySemiBold: 'Rajdhani_600SemiBold',
    bodyBold: 'Rajdhani_700Bold',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },

  shadows: {
    card: {
      shadowColor: '#00D4FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    accent: {
      shadowColor: '#00D4FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;

// Helper to get risk color
export function getRiskColor(level: string): string {
  switch (level) {
    case 'low':
      return theme.colors.riskLow;
    case 'medium':
      return theme.colors.riskMedium;
    case 'high':
      return theme.colors.riskHigh;
    case 'critical':
      return theme.colors.riskCritical;
    default:
      return theme.colors.textMuted;
  }
}

// Helper to get risk label in Portuguese
export function getRiskLabel(level: string): string {
  switch (level) {
    case 'low':
      return 'BAIXO';
    case 'medium':
      return 'MÉDIO';
    case 'high':
      return 'ALTO';
    case 'critical':
      return 'CRÍTICO';
    default:
      return 'DESCONHECIDO';
  }
}
