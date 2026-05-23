import { EventTracker } from './EventTracker';

export class FocusTracker {
  private tracker: EventTracker;
  private isFocused: boolean = true;
  private onFocusBound: () => void;
  private onBlurBound: () => void;

  constructor(tracker: EventTracker) {
    this.tracker = tracker;
    this.onFocusBound = this.handleFocus.bind(this);
    this.onBlurBound = this.handleBlur.bind(this);
  }

  public start(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.onFocusBound);
      window.addEventListener('blur', this.onBlurBound);
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.onFocusBound);
      window.removeEventListener('blur', this.onBlurBound);
    }
  }

  private handleFocus(): void {
    if (!this.isFocused) {
      this.isFocused = true;
      this.tracker.track('FOCUS_RESTORED');
    }
  }

  private handleBlur(): void {
    if (this.isFocused) {
      this.isFocused = false;
      this.tracker.track('FOCUS_LOST');
    }
  }
}
