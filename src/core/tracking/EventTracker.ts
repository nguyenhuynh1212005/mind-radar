import { RawEvent, EventType } from '../contracts/events';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

export class EventTracker {
  private events: RawEvent[] = [];
  private sessionId: string;
  private moduleId: string;

  constructor(sessionId: string, moduleId: string) {
    this.sessionId = sessionId;
    this.moduleId = moduleId;
  }

  public track(
    eventType: EventType,
    payload: Record<string, unknown> = {},
    trialId?: string
  ): RawEvent {
    const event: RawEvent = {
      eventId: generateId(),
      eventType,
      sessionId: this.sessionId,
      moduleId: this.moduleId,
      trialId,
      clientTimeMs: performance.now(),
      timestamp: Date.now(),
      payload,
    };
    
    this.events.push(event);
    return event;
  }

  public getEvents(): RawEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
