import { RawEvent } from '../contracts/events';

export function validateEvent(event: RawEvent): boolean {
  if (!event || typeof event !== 'object') return false;
  if (typeof event.eventId !== 'string' || event.eventId.trim() === '') return false;
  if (typeof event.eventType !== 'string' || event.eventType.trim() === '') return false;
  if (typeof event.sessionId !== 'string' || event.sessionId.trim() === '') return false;
  if (typeof event.moduleId !== 'string' || event.moduleId.trim() === '') return false;
  if (typeof event.clientTimeMs !== 'number' || event.clientTimeMs < 0) return false;
  if (typeof event.timestamp !== 'number' || event.timestamp <= 0) return false;
  if (typeof event.payload !== 'object' || event.payload === null) return false;

  return true;
}

export function validateEventSequence(events: RawEvent[]): string[] {
  const errors: string[] = [];
  
  let hasStart = false;
  let hasEnd = false;

  for (const event of events) {
    if (!validateEvent(event)) {
      errors.push(`Invalid event format: ${event.eventId || 'unknown'}`);
    }
    if (event.eventType === 'MODULE_START') hasStart = true;
    if (event.eventType === 'MODULE_END') hasEnd = true;
  }

  if (hasEnd && !hasStart) {
    errors.push('MODULE_END seen before or without MODULE_START');
  }

  return errors;
}
