
import { LicenseTrend, ActionType, ImpactLevel } from './types';

export const KPI_DEFINITIONS = {
  TREND_SCORE: {
    label: "Trend Score",
    meaning: "The current momentum of the license across digital platforms.",
    calculation: "Weighted average of Google Search velocity (40%), News sentiment (30%), and Social media engagement rate (30%) relative to category baselines."
  },
  WINDOW: {
    label: "Window",
    meaning: "The remaining duration of peak consumer demand.",
    calculation: "Estimated media lifecycle duration minus weeks elapsed since peak awareness trigger. Calibrated against historical IP decay curves."
  },
  IMPACT: {
    label: "Impact",
    meaning: "The projected revenue and brand reach scale for BioWorld.",
    calculation: "Correlation of current audience size with category-specific purchase intent data and retailer shelf-space availability."
  },
  CONFIDENCE: {
    label: "AI Confidence",
    meaning: "The statistical reliability of this sensing report.",
    calculation: "Calculated based on the density of verified data points, freshness of search signals (last 48h), and historical prediction accuracy for the specific category."
  },
  ACTION: {
    label: "Recommended Action",
    meaning: "The prescriptive merchandising strategy based on risk/reward.",
    calculation: "Determined by a logic matrix: (Trend Velocity × Confidence Score) vs. (Inventory Risk × Production Lead Time)."
  },
  ANALOG: {
    label: "Historical Analog",
    meaning: "A past property used as a performance benchmark.",
    calculation: "Nearest-neighbor matching based on audience demographics, media format (Streaming vs. Cinema), and seasonal launch timing."
  }
};

export const MOCK_LICENSES: LicenseTrend[] = [
  {
    id: '1',
    name: 'Cyberpunk Edgerunners S2',
    category: 'Anime',
    trendScore: 88,
    impactScore: ImpactLevel.HIGH,
    recommendedAction: ActionType.SCALE,
    confidence: 92,
    timeSensitivity: 4,
    historicalAnalog: 'Arcane Season 1',
    reasoning: 'Keyword velocity for "Cyberpunk" has spiked following recent project leaks and studio announcements. High demand for premium streetwear.',
    chartData: [
      { date: 'Jan 05', value: 20 },
      { date: 'Jan 12', value: 25 },
      { date: 'Jan 19', value: 35 },
      { date: 'Jan 26', value: 88 },
    ],
    signals: [
      { type: 'news', source: 'Deadline', description: 'Studio Trigger confirms new project timeline for late 2025', intensity: 95, timestamp: '2025-01-20' },
      { type: 'search', source: 'Google Trends', description: '"Cyberpunk apparel" searches up 300% in US/UK markets', intensity: 80, timestamp: '2025-01-24' }
    ]
  },
  {
    id: '4',
    name: 'Stranger Things 5',
    category: 'Entertainment',
    trendScore: 94,
    impactScore: ImpactLevel.HIGH,
    recommendedAction: ActionType.SCALE,
    confidence: 96,
    timeSensitivity: 8,
    historicalAnalog: 'Stranger Things S4',
    reasoning: 'Final season production wrap and Netflix teaser drops have triggered a massive surge in 80s nostalgia and character-specific apparel intent.',
    chartData: [
      { date: 'Jan 05', value: 45 },
      { date: 'Jan 12', value: 55 },
      { date: 'Jan 19', value: 75 },
      { date: 'Jan 26', value: 94 },
    ],
    signals: [
      { type: 'news', source: 'Variety', description: 'Netflix releases "Stranger Things 5" behind-the-scenes footage; 2025 release confirmed', intensity: 98, timestamp: '2025-01-15' },
      { type: 'social', source: 'TikTok', description: '#StrangerThings5 theories generating 500M+ weekly views', intensity: 92, timestamp: '2025-01-25' }
    ]
  },
  {
    id: '2',
    name: 'Genshin Impact x Collab',
    category: 'Gaming',
    trendScore: 65,
    impactScore: ImpactLevel.MEDIUM,
    recommendedAction: ActionType.TEST,
    confidence: 78,
    timeSensitivity: 12,
    reasoning: 'Consistent engagement baseline. New region expansion driving sustained social volume.',
    chartData: [
      { date: 'Jan 05', value: 55 },
      { date: 'Jan 12', value: 60 },
      { date: 'Jan 19', value: 58 },
      { date: 'Jan 26', value: 65 },
    ],
    signals: [
      { type: 'social', source: 'Reddit', description: 'Leaked images of new character skin sets trending on gaming subs', intensity: 70, timestamp: '2025-01-22' }
    ]
  },
  {
    id: '3',
    name: 'Marvel: Avengers Doomsday',
    category: 'Entertainment',
    trendScore: 45,
    impactScore: ImpactLevel.HIGH,
    recommendedAction: ActionType.HOLD,
    confidence: 85,
    timeSensitivity: 52,
    reasoning: 'IP in early awareness phase. High news volume but limited immediate apparel intent signals.',
    chartData: [
      { date: 'Jan 05', value: 10 },
      { date: 'Jan 12', value: 15 },
      { date: 'Jan 19', value: 40 },
      { date: 'Jan 26', value: 45 },
    ],
    signals: [
      { type: 'news', source: 'Variety', description: 'Production updates and casting rumors driving 2026 hype', intensity: 60, timestamp: '2025-01-25' }
    ]
  }
];

export const ACTION_STYLES = {
  [ActionType.SCALE]: 'bg-green-100 text-green-700 border-green-200',
  [ActionType.TEST]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ActionType.HOLD]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [ActionType.AVOID]: 'bg-orange-100 text-orange-700 border-orange-200',
  [ActionType.KILL]: 'bg-red-100 text-red-700 border-red-200',
};

export const IMPACT_STYLES = {
  [ImpactLevel.HIGH]: 'bg-purple-100 text-purple-700',
  [ImpactLevel.MEDIUM]: 'bg-blue-50 text-blue-600',
  [ImpactLevel.LOW]: 'bg-gray-100 text-gray-500',
};
