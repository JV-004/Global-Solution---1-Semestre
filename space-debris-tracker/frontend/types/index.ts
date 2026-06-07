// ============================================================
// types/index.ts — Domain TypeScript interfaces
// Space Debris Tracker | FIAP Global Solution 2026.1
// ============================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Debris {
  id: string;
  name: string;
  norad_id: number;
  altitude_km: number;
  inclination_deg: number;
  period_min: number;
  velocity_km_s: number;
  risk_level: RiskLevel;
  risk_score: number; // 0–100
  tle_line1: string;
  tle_line2: string;
  updated_at: string; // ISO 8601
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface RiskSummary {
  low: number;
  medium: number;
  high: number;
  critical: number;
  total: number;
}

export interface RiskHistoryEntry {
  timestamp: string;
  risk_score: number;
  risk_level: RiskLevel;
}
