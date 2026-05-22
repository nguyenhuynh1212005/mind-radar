import fs from "node:fs/promises";
import path from "node:path";
import { CODE_INDEX_PATH, CONTEXT_BUNDLE_PATH, REPO_ROOT, SCHEMA_VERSION } from "./constants";
import { assertSafeWrite } from "./safePaths";
import type { ContextExport, ContextExportKind, GitSummary, RepoStatusSnapshot } from "./types";

function listLines(title: string, values: string[]): string {
  const body = values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- Khong co";
  return `## ${title}\n\n${body}`;
}

function renderContext(kind: ContextExportKind, status: RepoStatusSnapshot, git: GitSummary): ContextExport {
  const changedFiles = git.changedFiles;
  const missingChecks = status.checks.filter((check) => !check.exists).map((check) => `${check.id}: ${check.path}`);

  const commonHeader = [
    `# Project Control Center`,
    ``,
    `- Thoi diem scan: ${status.scannedAt}`,
    `- Nhanh Git: ${git.branch}`,
    `- Trang thai: ${git.isClean ? "sach" : "co thay doi"}`,
    `- Check hien co: ${status.summary.existingCheckCount}`,
    `- Check thieu: ${status.summary.missingCheckCount}`
  ].join("\n");

  if (kind === "chatbotHandoff") {
    return {
      kind,
      labelKey: "copyChatbotHandoff",
      content: [
        commonHeader,
        listLines("Check thieu", missingChecks),
        listLines("Tep thay doi", changedFiles)
      ].join("\n\n")
    };
  }

  if (kind === "gitDiffReview") {
    return {
      kind,
      labelKey: "copyGitDiffReview",
      content: [
        `# Git Diff Review`,
        ``,
        `Nhanh: ${git.branch}`,
        listLines("Staged", git.stagedFiles),
        listLines("Unstaged", git.unstagedFiles),
        listLines("Untracked", git.untrackedFiles),
        listLines("Diff summary", git.diffSummary)
      ].join("\n\n")
    };
  }

  if (kind === "nextCodexPrompt") {
    return {
      kind,
      labelKey: "copyNextCodexPrompt",
      content: [
        `Use the project-control-center-builder skill.`,
        ``,
        `Continue from the Project Control Center status snapshot.`,
        `Do not modify src/.`,
        `Use project-map.json as the only machine-readable progress source.`,
        listLines("Priority missing checks", missingChecks.slice(0, 10))
      ].join("\n")
    };
  }

  if (kind === "architectureContext") {
    return {
      kind,
      labelKey: "copyArchitectureContext",
      content: [
        `# Architecture Context`,
        ``,
        `Project Control Center is isolated under tools/project-control-center/.`,
        `Runtime progress input is tools/project-control-center/project-map.json only.`,
        `projectMap.md is documentation only.`,
        `Snapshots live in .project/.`,
        `AI exports live in .ai/.`
      ].join("\n")
    };
  }

  return {
    kind,
    labelKey: "copyChangedFilesContext",
    content: [`# Changed Files Context`, listLines("Tep thay doi", changedFiles)].join("\n\n")
  };
}

export function buildContextExports(status: RepoStatusSnapshot, git: GitSummary): ContextExport[] {
  return [
    renderContext("chatbotHandoff", status, git),
    renderContext("gitDiffReview", status, git),
    renderContext("nextCodexPrompt", status, git),
    renderContext("architectureContext", status, git),
    renderContext("changedFilesContext", status, git)
  ];
}

export async function writeContextArtifacts(status: RepoStatusSnapshot, git: GitSummary): Promise<ContextExport[]> {
  const exports = buildContextExports(status, git);
  const bundle = exports.map((entry) => entry.content).join("\n\n---\n\n");
  const codeIndex = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    files: status.checks.map((check) => ({
      id: check.id,
      path: check.path,
      exists: check.exists,
      required: check.required
    }))
  };

  for (const filePath of [CONTEXT_BUNDLE_PATH, CODE_INDEX_PATH]) {
    assertSafeWrite(REPO_ROOT, filePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  }

  await fs.writeFile(CONTEXT_BUNDLE_PATH, `${bundle}\n`, "utf8");
  await fs.writeFile(CODE_INDEX_PATH, `${JSON.stringify(codeIndex, null, 2)}\n`, "utf8");

  return exports;
}
