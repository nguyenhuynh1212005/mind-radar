export interface TrialResult {
  sessionId: string;
  participantId: string;
  moduleId: string;
  blockId: string;
  trialId: string;
  itemId: string;
  condition: string;
  difficulty: number;
  correctResponse?: string | number | boolean | null;
  userResponse: string | number | boolean | null;
  isCorrect: boolean;
  partialScore: number;
  responseTimeMs: number;
  firstInteractionTimeMs: number;
  hesitationTimeMs: number;
  changedAnswerCount: number;
  wrongClickCount: number;
  skipped: boolean;
  timedOut: boolean;
  focusLossCount: number;
  invalidFlags: string[];
}

export interface ItemConfig {
  id: string;
  type: string;
  difficulty: number;
  stimulus: Record<string, unknown>;
  correctResponse?: string | number | boolean | null;
  metadata?: Record<string, unknown>;
}

export interface BlockConfig {
  id: string;
  name: string;
  condition: string;
  items: ItemConfig[];
}

export interface ModuleConfig {
  id: string;
  name: string;
  version: string;
  blocks: BlockConfig[];
}
