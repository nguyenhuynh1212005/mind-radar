import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ProjectSnapshot, WriteResult } from '../types/projectControlCenter.js';
import { assertWritableControlCenterPath } from '../core/safetyFilters.js';

const HANDOFF_PATH = '.ai/handoff.md';

export async function writeHandoff(rootDir: string, snapshot: ProjectSnapshot): Promise<WriteResult> {
  const targetPath = assertWritableControlCenterPath(rootDir, HANDOFF_PATH);
  const body = renderHandoff(snapshot);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, body, 'utf8');

  return {
    targetPath,
    bytesWritten: Buffer.byteLength(body, 'utf8')
  };
}

export function renderHandoff(snapshot: ProjectSnapshot): string {
  const notes = snapshot.progress.notes.map((note) => `- ${note}`).join('\n');
  const changedFiles = snapshot.git.files.slice(0, 40).map((file) => `- ${file.path}`).join('\n') || '- None detected.';

  return [
    '# AI Handoff',
    '',
    `Generated: ${snapshot.generatedAt}`,
    '',
    '## Current State',
    `- Overall progress: ${snapshot.progress.overallPercent}%`,
    `- Branch: ${snapshot.git.branch}`,
    `- Changed files: ${snapshot.git.files.length}`,
    '',
    '## Progress Notes',
    notes,
    '',
    '## Changed Files',
    changedFiles,
    ''
  ].join('\n');
}
