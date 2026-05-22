# Module Runtime Contracts

All modules must implement the same contract.

```ts
export interface SessionContext {
  sessionId: string;
  participantId: string;
  deviceType: 'mouse_keyboard' | 'touch' | 'mixed';
  locale: 'vi-VN' | 'en-US';
}

export interface TrialSpec {
  trialId: string;
  itemId: string;
  difficulty: number;
  stimulusData: Record<string, unknown>;
  timeLimitMs?: number;
}

export interface UserResponse {
  trialId: string;
  value: unknown;
  responseTimeMs: number;
  interactionEvents: ClientEvent[];
}

export interface TrialResult {
  trialId: string;
  isCorrect: boolean;
  partialScore: number;
  metrics: Record<string, number>;
  invalidFlags: string[];
}

export interface AssessmentModule {
  moduleId: string;
  version: string;
  init(context: SessionContext): void;
  getNextTrial(): TrialSpec | null;
  submitResponse(response: UserResponse): TrialResult;
  computeRawModuleMetrics(results: TrialResult[]): Record<string, unknown>;
}