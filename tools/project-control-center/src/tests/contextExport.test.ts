import { describe, expect, it } from "vitest";
import {
  buildCodeIndex,
  buildContextExports,
  isContextBundleAllowedPath,
  renderChatbotHandoffDoc,
  renderProjectStatusDoc
} from "../core/contextExport";
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

  it("keeps unsafe paths out of context bundle allowlist", () => {
    expect(isContextBundleAllowedPath("AGENTS.md")).toBe(true);
    expect(isContextBundleAllowedPath("docs/ARCHITECTURE.md")).toBe(true);
    expect(isContextBundleAllowedPath("tools/project-control-center/controlCenterSpec.md")).toBe(true);
    expect(isContextBundleAllowedPath("tools/project-control-center/project-map.json")).toBe(true);

    expect(isContextBundleAllowedPath(".env")).toBe(false);
    expect(isContextBundleAllowedPath(".env.local")).toBe(false);
    expect(isContextBundleAllowedPath("node_modules/pkg/README.md")).toBe(false);
    expect(isContextBundleAllowedPath("dist/app.js")).toBe(false);
    expect(isContextBundleAllowedPath("build/app.js")).toBe(false);
    expect(isContextBundleAllowedPath("out/app.js")).toBe(false);
    expect(isContextBundleAllowedPath(".git/config")).toBe(false);
    expect(isContextBundleAllowedPath("docs/image.png")).toBe(false);
    expect(isContextBundleAllowedPath("tools/project-control-center/projectMap.md")).toBe(false);
  });

  it("builds a code index with checks, context files, and source summaries", () => {
    const index = buildCodeIndex(
      status,
      [{ path: "AGENTS.md", content: "# Agents", truncated: false }],
      [{ path: "tools/project-control-center/src/core/contextExport.ts", lineCount: 10, byteLength: 250 }],
      "2026-05-22T00:00:00.000Z"
    ) as {
      checks: Array<{ id: string; path: string }>;
      contextFiles: Array<{ path: string; truncated: boolean }>;
      sourceIndex: Array<{ path: string; lineCount: number }>;
    };

    expect(index.checks).toEqual([{ id: "missing", path: "docs/missing.md", exists: false, required: true }]);
    expect(index.contextFiles).toEqual([{ path: "AGENTS.md", truncated: false }]);
    expect(index.sourceIndex).toEqual([
      { path: "tools/project-control-center/src/core/contextExport.ts", lineCount: 10, byteLength: 250 }
    ]);
  });

  it("renders docs and handoff content from current status and prompts", () => {
    const exports = buildContextExports(status, git);
    const projectStatus = renderProjectStatusDoc(status, git, "2026-05-22T00:00:00.000Z");
    const handoff = renderChatbotHandoffDoc(exports, status, git, "2026-05-22T00:00:00.000Z");

    expect(projectStatus).toContain("# Project Status");
    expect(projectStatus).toContain("docs/missing.md");
    expect(handoff).toContain("# Chatbot Handoff");
    expect(handoff).toContain("Next Codex Prompt");
  });
});
