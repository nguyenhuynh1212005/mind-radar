export type EventType =
  | 'MODULE_START'
  | 'MODULE_END'
  | 'BLOCK_START'
  | 'BLOCK_END'
  | 'TRIAL_START'
  | 'TRIAL_END'
  | 'USER_INTERACTION'
  | 'FOCUS_LOST'
  | 'FOCUS_RESTORED'
  | 'SYSTEM_ERROR';

export interface RawEvent {
  eventId: string;
  eventType: EventType;
  sessionId: string;
  moduleId: string;
  trialId?: string;
  clientTimeMs: number; // Must be from performance.now()
  timestamp: number;    // Unix timestamp from Date.now() for reference
  payload: Record<string, unknown>;
}
