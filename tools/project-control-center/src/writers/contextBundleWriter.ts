import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ProjectSnapshot, WriteResult } from '../types/projectControlCenter.js';
import { assertWritableControlCenterPath } from '../core/safetyFilters.js';

const CONTEXT_BUNDLE_PATH = '.ai/context-bundle.md';

export async function writeContextBundle(rootDir: string, snapshot: ProjectSnapshot): Promise<WriteResult> {
  const targetPath = assertWritableControlCenterPath(rootDir, CONTEXT_BUNDLE_PATH);
  const body = renderContextBundle(snapshot);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, body, 'utf8');

  return {
    targetPath,
    bytesWritten: Buffer.byteLength(body, 'utf8')
  };
}

export function renderContextBundle(snapshot: ProjectSnapshot): string {
  const byArea = new Map<string, number>();

  for (const file of snapshot.files) {
    byArea.set(file.area, (byArea.get(file.area) ?? 0) + 1);
  }

  const areaLines = [...byArea.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([area, count]) => `- ${area}: ${count}`)
    .join('\n');

  return [
    '# Context Bundle',
    '',
    `Generated: ${snapshot.generatedAt}`,
    `Schema: ${snapshot.schemaVersion}`,
    '',
    '## File Counts By Area',
    areaLines || '- No files detected.',
    '',
    '## Progress Metrics',
    ...snapshot.progress.metrics.map((metric) => [`### ${metric.label}`, `- Status: ${metric.status}`, `- Evidence: ${metric.completed}/${metric.total}`].join('\n')),
    ''
  ].join('\n');
}
