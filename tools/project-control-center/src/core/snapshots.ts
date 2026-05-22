import fs from "node:fs/promises";
import path from "node:path";
import {
  GIT_HISTORY_SNAPSHOT_PATH,
  REPO_ROOT,
  SCAN_HISTORY_PATH,
  STATUS_SNAPSHOT_PATH
} from "./constants";
import { assertSafeWrite } from "./safePaths";
import type { GitSummary, RepoStatusSnapshot, ScanSummary } from "./types";

async function ensureParent(filePath: string, repoRoot = REPO_ROOT): Promise<void> {
  assertSafeWrite(repoRoot, filePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function writeJson(filePath: string, value: unknown, repoRoot = REPO_ROOT): Promise<void> {
  await ensureParent(filePath, repoRoot);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function appendNdjson(filePath: string, value: unknown, repoRoot = REPO_ROOT): Promise<void> {
  await ensureParent(filePath, repoRoot);
  await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

export async function writeStatusSnapshot(
  snapshot: RepoStatusSnapshot,
  filePath = STATUS_SNAPSHOT_PATH,
  repoRoot = REPO_ROOT
): Promise<void> {
  await writeJson(filePath, snapshot, repoRoot);
}

export async function appendScanHistory(
  summary: ScanSummary,
  filePath = SCAN_HISTORY_PATH,
  repoRoot = REPO_ROOT
): Promise<void> {
  await appendNdjson(filePath, summary, repoRoot);
}

export async function writeGitHistorySnapshot(summary: GitSummary): Promise<void> {
  await writeJson(GIT_HISTORY_SNAPSHOT_PATH, summary);
}
