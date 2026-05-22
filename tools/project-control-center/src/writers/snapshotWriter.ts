import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ProjectSnapshot, WriteResult } from '../types/projectControlCenter.js';
import { assertWritableControlCenterPath } from '../core/safetyFilters.js';

const SNAPSHOT_PATH = '.project/project-control-center/snapshot.json';
const STATUS_SNAPSHOT_PATH = '.project/status.snapshot.json';

export async function writeSnapshot(rootDir: string, snapshot: ProjectSnapshot): Promise<WriteResult> {
  const targetPath = assertWritableControlCenterPath(rootDir, SNAPSHOT_PATH);
  const statusSnapshotPath = assertWritableControlCenterPath(rootDir, STATUS_SNAPSHOT_PATH);
  const body = `${JSON.stringify(snapshot, null, 2)}\n`;
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.mkdir(path.dirname(statusSnapshotPath), { recursive: true });
  await fs.writeFile(targetPath, body, 'utf8');
  await fs.writeFile(statusSnapshotPath, body, 'utf8');

  return {
    targetPath,
    bytesWritten: Buffer.byteLength(body, 'utf8')
  };
}
