// ============================================================
// hooks/useDebris.ts — Polling hook for debris data
// Space Debris Tracker | FIAP Global Solution 2026.1
// Polls API every 30 seconds, supports risk-level filtering
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { DebrisService } from '../services/api';
import { Debris, RiskLevel } from '../types';
import axios from 'axios';

// Fallback mock data for when the API is offline
const MOCK_DEBRIS: Debris[] = [
  {
    id: 'mock-001',
    name: 'COSMOS 1408 DEB',
    norad_id: 49002,
    altitude_km: 487.3,
    inclination_deg: 82.95,
    period_min: 94.3,
    velocity_km_s: 7.61,
    risk_level: 'critical',
    risk_score: 91,
    tle_line1: '1 49002U 82092BQ  24001.00000000  .00001234  00000-0  12345-3 0  9999',
    tle_line2: '2 49002  82.9506  15.2345 0009876 123.4567 236.5432 15.28765432123456',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-002',
    name: 'FENGYUN 1C DEB',
    norad_id: 29779,
    altitude_km: 842.1,
    inclination_deg: 98.8,
    period_min: 101.9,
    velocity_km_s: 7.43,
    risk_level: 'high',
    risk_score: 76,
    tle_line1: '1 29779U 99025ALX  24001.00000000  .00000087  00000-0  87654-4 0  9998',
    tle_line2: '2 29779  98.8012 200.1234 0001234 180.0000 180.0001 14.12345678987654',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-003',
    name: 'IRIDIUM 33 DEB',
    norad_id: 33778,
    altitude_km: 776.5,
    inclination_deg: 86.4,
    period_min: 100.4,
    velocity_km_s: 7.46,
    risk_level: 'high',
    risk_score: 68,
    tle_line1: '1 33778U 97043D    24001.00000000  .00000156  00000-0  15678-3 0  9997',
    tle_line2: '2 33778  86.3925 100.5678 0012345  90.1234 270.0000 14.34567890234567',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-004',
    name: 'SL-16 R/B',
    norad_id: 22220,
    altitude_km: 648.2,
    inclination_deg: 71.0,
    period_min: 97.7,
    velocity_km_s: 7.53,
    risk_level: 'medium',
    risk_score: 45,
    tle_line1: '1 22220U 92076A    24001.00000000  .00000024  00000-0  24321-4 0  9996',
    tle_line2: '2 22220  70.9876 300.1234 0002345 200.5678 159.4321 14.51234567890123',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-005',
    name: 'DELTA 1 DEB',
    norad_id: 12345,
    altitude_km: 562.8,
    inclination_deg: 28.5,
    period_min: 95.7,
    velocity_km_s: 7.58,
    risk_level: 'medium',
    risk_score: 38,
    tle_line1: '1 12345U 81039A    24001.00000000  .00000045  00000-0  45123-4 0  9995',
    tle_line2: '2 12345  28.5000  45.0000 0005678 150.0000 210.0000 15.05678901234567',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-006',
    name: 'SCOUT DEB',
    norad_id: 9876,
    altitude_km: 1234.0,
    inclination_deg: 90.0,
    period_min: 107.2,
    velocity_km_s: 7.31,
    risk_level: 'low',
    risk_score: 12,
    tle_line1: '1 09876U 79054A    24001.00000000  .00000010  00000-0  10000-4 0  9994',
    tle_line2: '2 09876  90.0000 180.0000 0000001  90.0000 270.0000 13.44012345678901',
    updated_at: new Date().toISOString(),
  },
];

interface UseDebrisReturn {
  data: Debris[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  isMockData: boolean;
  refetch: () => Promise<void>;
}

export function useDebris(filterRisk?: RiskLevel): UseDebrisReturn {
  const [data, setData] = useState<Debris[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Keep a ref to the interval so we can clear it properly
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await DebrisService.getAll();
      const list: Debris[] = res.data;

      const filtered = filterRisk
        ? list.filter((d) => d.risk_level === filterRisk)
        : list;

      setData(filtered);
      setLastUpdate(new Date());
      setError(null);
      setIsMockData(false);
    } catch (e: unknown) {
      // If API is unavailable, show mock data with an info message
      const errorMessage =
        axios.isAxiosError(e)
          ? `API indisponível (${e.message}) — exibindo dados de demonstração`
          : 'Erro ao buscar dados — exibindo dados de demonstração';

      const mockFiltered = filterRisk
        ? MOCK_DEBRIS.filter((d) => d.risk_level === filterRisk)
        : MOCK_DEBRIS;

      setData(mockFiltered);
      setError(errorMessage);
      setIsMockData(true);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, [filterRisk]);

  useEffect(() => {
    void fetchData();

    // Poll every 30 seconds
    intervalRef.current = setInterval(() => {
      void fetchData();
    }, 30_000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  return { data, loading, error, lastUpdate, isMockData, refetch: fetchData };
}

// Export mock data for use in other screens
export { MOCK_DEBRIS };
