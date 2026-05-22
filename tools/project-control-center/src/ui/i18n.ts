export type Locale = 'en';

export interface Messages {
  readonly title: string;
  readonly subtitle: string;
  readonly scanCta: string;
  readonly loading: string;
  readonly unavailable: string;
  readonly progress: string;
  readonly git: string;
  readonly changedFiles: string;
  readonly fileAreas: string;
}

const EN_MESSAGES: Messages = {
  title: 'Project Control Center',
  subtitle: 'Local status, progress, and handoff context for the assessment app.',
  scanCta: 'Load Snapshot',
  loading: 'Loading snapshot...',
  unavailable: 'Snapshot API unavailable. Run the CLI scan or start the local server.',
  progress: 'Progress',
  git: 'Git',
  changedFiles: 'Changed Files',
  fileAreas: 'File Areas'
};

export function getMessages(locale: Locale = 'en'): Messages {
  switch (locale) {
    case 'en':
      return EN_MESSAGES;
  }
}
export type LabelKey = string;

export function t(key: LabelKey): string {
  return key;
}
