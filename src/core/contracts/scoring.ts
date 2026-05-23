import { TrialResult } from './assessment';
import { RawEvent } from './events';

export interface DataQualityFlag {
  flag: string;
  reason: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface MetricScore {
  axis: string;
  score: number;
  confidence: number;
  percentile?: number;
}

export interface ScoringResult {
  metrics: MetricScore[];
  qualityFlags: DataQualityFlag[];
  isValid: boolean;
}

export interface ScoringAdapter {
  calculateScores(trials: TrialResult[], events: RawEvent[]): ScoringResult;
}
