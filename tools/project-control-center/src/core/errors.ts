import fs from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT, SCHEMA_VERSION, TOOL_ERRORS_PATH } from "./constants";
import { assertSafeWrite, isBlockedReadPath, normalizeRepoPath } from "./safePaths";
import type { ToolErrorRecord } from "./types";

function sanitizePath(inputPath: string | undefined): string | undefined {
  if (!inputPath) {
    return undefined;
  }

  const normalized = normalizeRepoPath(inputPath);
  return isBlockedReadPath(normalized) ? "[blocked]" : normalized;
}

export function toToolErrorRecord(
  operation: string,
  error: unknown,
  unsafePath?: string
): ToolErrorRecord {
  const message = error instanceof Error ? error.message : "Unknown tool error.";
  return {
    schemaVersion: SCHEMA_VERSION,
    timestamp: new Date().toISOString(),
    operation,
    code: "TOOL_ERROR",
    message,
    path: sanitizePath(unsafePath)
  };
}

export async function appendToolError(
  record: ToolErrorRecord,
  filePath = TOOL_ERRORS_PATH,
  repoRoot = REPO_ROOT
): Promise<void> {
  assertSafeWrite(repoRoot, filePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
}
