import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { appendToolError, toToolErrorRecord } from "../core/errors";
import { isAllowedWritePath } from "../core/safePaths";
import { appendScanHistory, writeGitHistorySnapshot } from "../core/snapshots";
import type { GitSummary, ScanSummary, ToolErrorRecord } from "../core/types";

async function makeTempRepo(): Promise<string> {
  return await fs.mkdtemp(path.join(os.tmpdir(), "pcc-snapshot-"));
}

describe("snapshot paths", () => {
  it("keeps snapshot and history writes inside approved metadata paths", () => {
    expect(isAllowedWritePath(".project/status.snapshot.json")).toBe(true);
    expect(isAllowedWritePath(".project/scan-history.ndjson")).toBe(true);
    expect(isAllowedWritePath(".project/tool-errors.ndjson")).toBe(true);
    expect(isAllowedWritePath(".project/git-history.snapshot.json")).toBe(true);
  });

  it("appends scan history as valid NDJSON", async () => {
    const repoRoot = await makeTempRepo();
    const historyPath = path.join(repoRoot, ".project", "scan-history.ndjson");
    const summary: ScanSummary = {
      schemaVersion: 1,
      scannedAt: "2026-05-22T00:00:00.000Z",
      fileCount: 2,
      directoryCount: 1,
      existingCheckCount: 1,
      missingCheckCount: 1,
      changedFileCount: 0
    };

    await appendScanHistory(summary, historyPath, repoRoot);
    await appendScanHistory({ ...summary, fileCount: 3 }, historyPath, repoRoot);

    const lines = (await fs.readFile(historyPath, "utf8")).trim().split(/\r?\n/);
    expect(lines).toHaveLength(2);
    expect(lines.map((line) => JSON.parse(line) as ScanSummary)).toEqual([summary, { ...summary, fileCount: 3 }]);
  });

  it("writes the Git history snapshot as JSON", async () => {
    const repoRoot = await makeTempRepo();
    const snapshotPath = path.join(repoRoot, ".project", "git-history.snapshot.json");
    const summary: GitSummary = {
      schemaVersion: 1,
      capturedAt: "2026-05-22T00:00:00.000Z",
      branch: "main",
      isClean: false,
      stagedFiles: ["staged.ts"],
      unstagedFiles: ["unstaged.ts"],
      untrackedFiles: ["new.ts"],
      changedFiles: ["staged.ts", "unstaged.ts", "new.ts"],
      lastCommits: [],
      diffSummary: ["1 file changed"]
    };

    await writeGitHistorySnapshot(summary, snapshotPath, repoRoot);

    expect(JSON.parse(await fs.readFile(snapshotPath, "utf8")) as GitSummary).toEqual(summary);
  });

  it("appends tool errors as valid NDJSON", async () => {
    const repoRoot = await makeTempRepo();
    const errorPath = path.join(repoRoot, ".project", "tool-errors.ndjson");
    const record: ToolErrorRecord = {
      schemaVersion: 1,
      timestamp: "2026-05-22T00:00:00.000Z",
      operation: "test",
      code: "TOOL_ERROR",
      message: "scan failed"
    };

    await appendToolError(record, errorPath, repoRoot);

    const lines = (await fs.readFile(errorPath, "utf8")).trim().split(/\r?\n/);
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]) as ToolErrorRecord).toEqual(record);
  });

  it("sanitizes blocked paths before appending tool errors", () => {
    const record = toToolErrorRecord("scan", new Error("failed"), ".env.local");

    expect(record.path).toBe("[blocked]");
    expect(record.message).toBe("failed");
  });
});
