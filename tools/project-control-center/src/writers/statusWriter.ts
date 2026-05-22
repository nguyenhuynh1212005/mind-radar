import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ProjectSnapshot, WriteResult } from '../types/projectControlCenter.js';
import { assertWritableControlCenterPath } from '../core/safetyFilters.js';

const STATUS_PATH = '.project/status.md';

export async function writeStatus(rootDir: string, snapshot: ProjectSnapshot): Promise<WriteResult> {
  const targetPath = assertWritableControlCenterPath(rootDir, STATUS_PATH);
  const body = renderStatus(snapshot);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, body, 'utf8');

  return {
    targetPath,
    bytesWritten: Buffer.byteLength(body, 'utf8')
  };
}

export function renderStatus(snapshot: ProjectSnapshot): string {
  const metrics = snapshot.progress.metrics
    .map((metric) => `- ${metric.label}: ${metric.completed}/${metric.total} (${metric.status})`)
    .join('\n');
  const gitFiles = snapshot.git.files.length === 0
    ? '- No changed files detected.'
    : snapshot.git.files.map((file) => `- ${file.indexStatus || ' '} ${file.workingTreeStatus || ' '} ${file.path}`).join('\n');

  return [
    '# Project Status',
    '',
    `Generated: ${snapshot.generatedAt}`,
    `Overall progress: ${snapshot.progress.overallPercent}%`,
    `Git branch: ${snapshot.git.branch}`,
    `Git clean: ${snapshot.git.isClean ? 'yes' : 'no'}`,
    '',
    '## Progress',
    metrics,
    '',
    '## Changed Files',
    gitFiles,
    ''
  ].join('\n');
}
