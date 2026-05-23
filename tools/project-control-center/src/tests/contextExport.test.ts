import { describe, expect, it } from "vitest";
import { buildContextExports } from "../core/contextExport";
import type { GitSummary, RepoStatusSnapshot } from "../core/types";

const status: RepoStatusSnapshot = {
  schemaVersion: 1,
  scannedAt: "2026-05-22T00:00:00.000Z",
  tree: {
    name: ".",
    path: ".",
    type: "directory",
    children: [],
    checkIds: [],
    missingCheckIds: [],
    existsInProjectMap: false,
    missingRequiredCheck: false,
    gitChanged: false,
    excluded: false
  },
  checks: [
    {
      id: "missing",
      phaseId: "P0",
      labelVi: "Con thieu",
      path: "docs/missing.md",
      type: "file",
      required: true,
      exists: false,
      missingRequired: true,
      excluded: false
    }
  ],
  progress: {
    totalChecklistProgress: { completed: 0, total: 1, percent: 0 },
    mainAppMvpProgress: { completed: 0, total: 1, percent: 0 },
    projectControlCenterProgress: { completed: 0, total: 0, percent: 0 },
    codexReadiness: { completed: 0, total: 1, percent: 0 },
    productionReadiness: { completed: 0, total: 1, percent: 0 }
  },
  totalChecklistProgress: 50,
  mainAppMvpProgress: 50,
  projectControlCenterProgress: 100,
  codexReadiness: 100,
  productionReadiness: 0,
  summary: {
    schemaVersion: 1,
    scannedAt: "2026-05-22T00:00:00.000Z",
    fileCount: 1,
    directoryCount: 1,
    existingCheckCount: 0,
    missingCheckCount: 1,
    changedFileCount: 1
  }
};

const git: GitSummary = {
  schemaVersion: 1,
  capturedAt: "2026-05-22T00:00:00.000Z",
  branch: "main",
  isClean: false,
  stagedFiles: [],
  unstagedFiles: ["tools/project-control-center/src/app.ts"],
  untrackedFiles: [],
  changedFiles: ["tools/project-control-center/src/app.ts"],
  lastCommits: [],
  diffSummary: ["1 file changed"]
};

describe("buildContextExports", () => {
  it("creates all requested AI context copy payloads", () => {
    const exports = buildContextExports(status, git);

    expect(exports.map((entry) => entry.kind)).toEqual([
      "chatbotHandoff",
      "gitDiffReview",
      "nextCodexPrompt",
      "architectureContext",
      "changedFilesContext"
    ]);
    expect(exports[0]?.content).toContain("docs/missing.md");
  });
});
