import fs from "node:fs/promises";
import path from "node:path";
import {
  CHATBOT_HANDOFF_DOC_PATH,
  CODE_INDEX_PATH,
  CONTEXT_BUNDLE_PATH,
  PROJECT_STATUS_DOC_PATH,
  REPO_ROOT,
  SCHEMA_VERSION
} from "./constants";
import { assertSafeRead, assertSafeWrite, isBlockedReadPath, normalizeRepoPath, toRepoRelative } from "./safePaths";
import type { ContextExport, ContextExportKind, GitSummary, RepoStatusSnapshot } from "./types";

const MAX_CONTEXT_FILE_CHARS = 20_000;
const SOURCE_INDEX_ROOTS = [
  "tools/project-control-center/src/cli",
  "tools/project-control-center/src/core",
  "tools/project-control-center/src/server",
  "tools/project-control-center/src/ui",
  "tools/project-control-center/src/writers"
];

interface ContextArtifactEntry {
  path: string;
  content: string;
  truncated: boolean;
}

interface SourceIndexEntry {
  path: string;
  lineCount: number;
  byteLength: number;
}

interface WriteContextArtifactsOptions {
  repoRoot?: string;
  contextBundlePath?: string;
  codeIndexPath?: string;
  projectStatusDocPath?: string;
  chatbotHandoffDocPath?: string;
}

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

export async function writeContextArtifacts(
  status: RepoStatusSnapshot,
  git: GitSummary,
  options: WriteContextArtifactsOptions = {}
): Promise<ContextExport[]> {
  const repoRoot = options.repoRoot ?? REPO_ROOT;
  const contextBundlePath = options.contextBundlePath ?? CONTEXT_BUNDLE_PATH;
  const codeIndexPath = options.codeIndexPath ?? CODE_INDEX_PATH;
  const projectStatusDocPath = options.projectStatusDocPath ?? PROJECT_STATUS_DOC_PATH;
  const chatbotHandoffDocPath = options.chatbotHandoffDocPath ?? CHATBOT_HANDOFF_DOC_PATH;
  const exports = buildContextExports(status, git);
  const contextEntries = await collectContextBundleEntries(repoRoot);
  const sourceIndex = await collectSourceIndex(repoRoot);
  const generatedAt = new Date().toISOString();
  const bundle = renderContextBundle(exports, contextEntries, sourceIndex, generatedAt);
  const codeIndex = buildCodeIndex(status, contextEntries, sourceIndex, generatedAt);
  const projectStatusDoc = renderProjectStatusDoc(status, git, generatedAt);
  const chatbotHandoffDoc = renderChatbotHandoffDoc(exports, status, git, generatedAt);

  for (const filePath of [contextBundlePath, codeIndexPath, projectStatusDocPath, chatbotHandoffDocPath]) {
    assertSafeWrite(repoRoot, filePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  }

  await fs.writeFile(contextBundlePath, `${bundle}\n`, "utf8");
  await fs.writeFile(codeIndexPath, `${JSON.stringify(codeIndex, null, 2)}\n`, "utf8");
  await fs.writeFile(projectStatusDocPath, `${projectStatusDoc}\n`, "utf8");
  await fs.writeFile(chatbotHandoffDocPath, `${chatbotHandoffDoc}\n`, "utf8");

  return exports;
}

export function isContextBundleAllowedPath(relativePath: string): boolean {
  const normalized = normalizeRepoPath(relativePath);
  const fileName = normalized.split("/").at(-1) ?? "";

  if (isBlockedReadPath(normalized)) {
    return false;
  }

  if (["AGENTS.md", "README.md", "DESIGN.md"].includes(normalized)) {
    return true;
  }

  if (normalized.startsWith("docs/") && normalized.endsWith(".md")) {
    return true;
  }

  if (
    normalized.startsWith("tools/project-control-center/") &&
    normalized.split("/").length === 3 &&
    normalized.endsWith(".md") &&
    fileName !== "projectMap.md"
  ) {
    return true;
  }

  return normalized === "tools/project-control-center/project-map.json";
}

export function buildCodeIndex(
  status: RepoStatusSnapshot,
  contextEntries: ContextArtifactEntry[] = [],
  sourceIndex: SourceIndexEntry[] = [],
  generatedAt = new Date().toISOString()
): unknown {
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    checks: status.checks.map((check) => ({
      id: check.id,
      path: check.path,
      exists: check.exists,
      required: check.required
    })),
    contextFiles: contextEntries.map((entry) => ({
      path: entry.path,
      truncated: entry.truncated
    })),
    sourceIndex
  };
}

export function renderProjectStatusDoc(status: RepoStatusSnapshot, git: GitSummary, generatedAt: string): string {
  const missingChecks = status.checks.filter((check) => !check.exists).slice(0, 40);
  const missingLines = missingChecks.length > 0
    ? missingChecks.map((check) => `- ${check.id}: ${check.path}`).join("\n")
    : "- Khong co";

  return [
    "# Project Status",
    "",
    `Generated: ${generatedAt}`,
    `Scan: ${status.scannedAt}`,
    `Git branch: ${git.branch}`,
    `Git clean: ${git.isClean ? "yes" : "no"}`,
    "",
    "## Progress",
    `- Total checklist: ${status.progress.totalChecklistProgress.percent}%`,
    `- Main app MVP: ${status.progress.mainAppMvpProgress.percent}%`,
    `- Project Control Center: ${status.progress.projectControlCenterProgress.percent}%`,
    `- Codex readiness: ${status.progress.codexReadiness.percent}%`,
    `- Production readiness: ${status.progress.productionReadiness.percent}%`,
    "",
    "## Missing Checks",
    missingLines
  ].join("\n");
}

export function renderChatbotHandoffDoc(
  exports: ContextExport[],
  status: RepoStatusSnapshot,
  git: GitSummary,
  generatedAt: string
): string {
  const handoff = exports.find((entry) => entry.kind === "chatbotHandoff")?.content ?? "";
  const nextCodex = exports.find((entry) => entry.kind === "nextCodexPrompt")?.content ?? "";

  return [
    "# Chatbot Handoff",
    "",
    `Generated: ${generatedAt}`,
    `Scan: ${status.scannedAt}`,
    `Git branch: ${git.branch}`,
    "",
    "## Handoff Prompt",
    handoff,
    "",
    "## Next Codex Prompt",
    nextCodex
  ].join("\n");
}

async function collectContextBundleEntries(repoRoot: string): Promise<ContextArtifactEntry[]> {
  const candidates = [
    "AGENTS.md",
    "README.md",
    "DESIGN.md",
    "tools/project-control-center/AGENTS.md",
    "tools/project-control-center/CODEX_PROMPTS.md",
    "tools/project-control-center/controlCenterSpec.md",
    "tools/project-control-center/README.md",
    "tools/project-control-center/project-map.json",
    ...(await listMarkdownFiles(path.join(repoRoot, "docs"), repoRoot))
  ];

  const uniqueCandidates = [...new Set(candidates.map(normalizeRepoPath))].filter(isContextBundleAllowedPath);
  const entries: ContextArtifactEntry[] = [];

  for (const relativePath of uniqueCandidates.sort()) {
    const absolutePath = path.join(repoRoot, relativePath);
    const entry = await readContextEntry(repoRoot, absolutePath);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

async function readContextEntry(repoRoot: string, absolutePath: string): Promise<ContextArtifactEntry | undefined> {
  try {
    assertSafeRead(repoRoot, absolutePath);
    const relativePath = toRepoRelative(repoRoot, absolutePath);
    if (!isContextBundleAllowedPath(relativePath)) {
      return undefined;
    }

    const content = await fs.readFile(absolutePath, "utf8");
    const truncated = content.length > MAX_CONTEXT_FILE_CHARS;
    return {
      path: relativePath,
      content: truncated ? content.slice(0, MAX_CONTEXT_FILE_CHARS) : content,
      truncated
    };
  } catch {
    return undefined;
  }
}

async function listMarkdownFiles(directoryPath: string, repoRoot: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const result: string[] = [];

    for (const entry of entries) {
      const childPath = path.join(directoryPath, entry.name);
      const relativePath = toRepoRelative(repoRoot, childPath);
      if (isBlockedReadPath(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        result.push(...(await listMarkdownFiles(childPath, repoRoot)));
      } else if (entry.isFile() && relativePath.endsWith(".md")) {
        result.push(relativePath);
      }
    }

    return result;
  } catch {
    return [];
  }
}

async function collectSourceIndex(repoRoot: string): Promise<SourceIndexEntry[]> {
  const files: string[] = [];

  for (const sourceRoot of SOURCE_INDEX_ROOTS) {
    files.push(...(await listSourceFiles(path.join(repoRoot, sourceRoot), repoRoot)));
  }

  const entries: SourceIndexEntry[] = [];
  for (const relativePath of [...new Set(files)].sort()) {
    const absolutePath = path.join(repoRoot, relativePath);
    try {
      assertSafeRead(repoRoot, absolutePath);
      const content = await fs.readFile(absolutePath, "utf8");
      entries.push({
        path: relativePath,
        lineCount: content.split(/\r?\n/).length,
        byteLength: Buffer.byteLength(content, "utf8")
      });
    } catch {
      continue;
    }
  }

  return entries;
}

async function listSourceFiles(directoryPath: string, repoRoot: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const result: string[] = [];

    for (const entry of entries) {
      const childPath = path.join(directoryPath, entry.name);
      const relativePath = toRepoRelative(repoRoot, childPath);
      if (isBlockedReadPath(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        result.push(...(await listSourceFiles(childPath, repoRoot)));
      } else if (entry.isFile() && relativePath.endsWith(".ts") && !relativePath.endsWith(".test.ts")) {
        result.push(relativePath);
      }
    }

    return result;
  } catch {
    return [];
  }
}

function renderContextBundle(
  exports: ContextExport[],
  contextEntries: ContextArtifactEntry[],
  sourceIndex: SourceIndexEntry[],
  generatedAt: string
): string {
  const promptSections = exports.map((entry) => [`## ${entry.kind}`, "", entry.content].join("\n")).join("\n\n");
  const contextSections = contextEntries.map((entry) => [
    `## ${entry.path}`,
    "",
    entry.truncated ? "_Truncated for context safety._" : "",
    "```",
    entry.content.trimEnd(),
    "```"
  ].filter((line) => line.length > 0).join("\n")).join("\n\n");
  const sourceLines = sourceIndex.length > 0
    ? sourceIndex.map((entry) => `- ${entry.path} (${entry.lineCount} lines, ${entry.byteLength} bytes)`).join("\n")
    : "- Khong co";

  return [
    "# AI Context Bundle",
    "",
    `Generated: ${generatedAt}`,
    "",
    "# Copyable Prompts",
    "",
    promptSections,
    "",
    "# Allowlisted Project Context",
    "",
    contextSections || "- Khong co tep allowlist.",
    "",
    "# Selected Source Index",
    "",
    sourceLines
  ].join("\n");
}
