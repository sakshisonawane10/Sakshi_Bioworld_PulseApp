
export enum ActionType {
  TEST = 'TEST',
  SCALE = 'SCALE',
  HOLD = 'HOLD',
  AVOID = 'AVOID',
  KILL = 'KILL'
}

export enum ImpactLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TrendSignal {
  type: 'search' | 'news' | 'social';
  source: string;
  description: string;
  intensity: number; // 0-100
  timestamp: string;
}

export interface LicenseTrend {
  id: string;
  name: string;
  category: string;
  trendScore: number;
  impactScore: ImpactLevel;
  recommendedAction: ActionType;
  confidence: number;
  timeSensitivity: number; // Weeks remaining
  signals: TrendSignal[];
  historicalAnalog?: string;
  reasoning: string;
  chartData: Array<{ date: string; value: number }>;
  groundingSources?: GroundingSource[];
}

export interface AppState {
  licenses: LicenseTrend[];
  isSensing: boolean;
  lastUpdated: string;
  selectedLicenseId: string | null;
}
