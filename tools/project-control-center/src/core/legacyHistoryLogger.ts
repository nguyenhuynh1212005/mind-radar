import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { HistoryEntry, ProjectSnapshot, WriteResult } from '../types/projectControlCenter.js';
import { assertWritableControlCenterPath } from './safetyFilters.js';

// Legacy JSONL writer kept for auditability. npm run scan now appends the concise
// .project/scan-history.ndjson record through core/snapshots.ts.
const HISTORY_PATH = '.project/project-control-center/history.jsonl';

export function buildHistoryEntry(snapshot: ProjectSnapshot): HistoryEntry {
  return {
    schemaVersion: 'project-control-center.history.v1',
    timestamp: snapshot.generatedAt,
    eventType: 'scan',
    summary: {
      fileCount: snapshot.files.length,
      overallPercent: snapshot.progress.overallPercent,
      changedFileCount: snapshot.git.files.length
    }
  };
}

export async function appendHistory(rootDir: string, snapshot: ProjectSnapshot): Promise<WriteResult> {
  const targetPath = assertWritableControlCenterPath(rootDir, HISTORY_PATH);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const line = `${JSON.stringify(buildHistoryEntry(snapshot))}\n`;
  await fs.appendFile(targetPath, line, 'utf8');

  return {
    targetPath,
    bytesWritten: Buffer.byteLength(line, 'utf8')
  };
}
