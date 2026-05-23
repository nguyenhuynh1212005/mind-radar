import { describe, it, expect, beforeEach } from 'vitest';
import { EventTracker } from '../src/core/tracking/EventTracker';

describe('EventTracker', () => {
  let tracker: EventTracker;

  beforeEach(() => {
    tracker = new EventTracker('session-1', 'module-1');
  });

  it('should initialize with no events', () => {
    expect(tracker.getEvents()).toHaveLength(0);
  });

  it('should track a new event', () => {
    const event = tracker.track('MODULE_START', { detail: 'test' });
    
    expect(event.eventType).toBe('MODULE_START');
    expect(event.sessionId).toBe('session-1');
    expect(event.moduleId).toBe('module-1');
    expect(event.payload).toEqual({ detail: 'test' });
    expect(event.clientTimeMs).toBeGreaterThanOrEqual(0);
    expect(event.timestamp).toBeGreaterThan(0);
    expect(tracker.getEvents()).toHaveLength(1);
    expect(tracker.getEvents()[0]).toBe(event);
  });

  it('should track trial events with trialId', () => {
    const event = tracker.track('TRIAL_START', {}, 'trial-1');
    
    expect(event.eventType).toBe('TRIAL_START');
    expect(event.trialId).toBe('trial-1');
  });

  it('should clear events', () => {
    tracker.track('MODULE_START');
    expect(tracker.getEvents()).toHaveLength(1);
    
    tracker.clear();
    expect(tracker.getEvents()).toHaveLength(0);
  });
});
