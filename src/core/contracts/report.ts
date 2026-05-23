import { MetricScore, DataQualityFlag } from './scoring';

export interface ModuleEvidence {
  metric: string;
  observation: string;
  implication: string;
}

export interface ModuleReport {
  moduleId: string;
  metrics: MetricScore[];
  evidence: ModuleEvidence[];
  qualityFlags: DataQualityFlag[];
}

export interface ProfileAxis {
  name: string;
  overallScore: number;
  description: string;
}

export interface ProfileReport {
  sessionId: string;
  participantId: string;
  timestamp: number;
  axes: ProfileAxis[];
  moduleReports: ModuleReport[];
  overallQuality: 'HIGH' | 'MEDIUM' | 'LOW' | 'INVALID';
}
