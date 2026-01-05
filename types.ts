
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

/**
 * Interface representing the structured response from the Gemini Demand Sensing model.
 */
export interface TrendAnalysisResponse {
  name: string;
  category: string;
  action: string;
  impact: string;
  reasoning: string;
  confidence: number;
  trendScore: number;
  sensitivity: number;
  analog?: string;
  points: number[];
  awarenessSignals: TrendSignal[];
  groundingSources?: GroundingSource[];
}

export interface AppState {
  licenses: LicenseTrend[];
  isSensing: boolean;
  lastUpdated: string;
  selectedLicenseId: string | null;
}

// Define the AIStudio interface to prevent declaration mismatch errors with Window.aistudio
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Fix: Reference the AIStudio interface instead of an anonymous object to match subsequent declarations
    aistudio?: AIStudio;
  }
}
