import fs from "node:fs/promises";
import path from "node:path";
import { SCHEMA_VERSION } from "./constants";
import { loadProjectMap } from "./projectMap";
import { assertSafeRead, isBlockedReadPath, normalizeRepoPath, toRepoRelative } from "./safePaths";
import type {
  CheckStatus,
  CheckType,
  GitSummary,
  ProgressMetric,
  ProjectMap,
  ProjectMapCheck,
  ProjectProgressMetrics,
  RepoStatusSnapshot,
  RepoTreeNode,
  ScanSummary
} from "./types";

interface ScanCounters {
  fileCount: number;
  directoryCount: number;
}

interface PhaseCheckEntry {
  phaseId: string;
  check: ProjectMapCheck;
}

const EXCLUDED_DIRECTORY_NAMES = new Set([".git", "node_modules", "dist", "build", "out"]);
const EXCLUDED_BINARY_EXTENSIONS = new Set([
  ".7z",
  ".a",
  ".avi",
  ".bmp",
  ".bz2",
  ".dll",
  ".doc",
  ".docx",
  ".dylib",
  ".exe",
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".mov",
  ".mp3",
  ".mp4",
  ".ogg",
  ".pdf",
  ".png",
  ".rar",
  ".so",
  ".tar",
  ".tgz",
  ".webm",
  ".webp",
  ".xls",
  ".xlsx",
  ".xz",
  ".zip"
]);

function normalizeCheckType(type: CheckType): "file" | "directory" {
  if (type === "directory" || type === "directory_exists") {
    return "directory";
  }

  return "file";
}

function getExclusionReason(relativePath: string): string | null {
  const normalized = normalizeRepoPath(relativePath);
  if (normalized === ".") {
    return null;
  }

  const parts = normalized.split("/");
  const name = parts.at(-1) ?? "";
  if (name === ".env" || name.startsWith(".env.")) {
    return "environment file";
  }

  if (parts.some((part) => EXCLUDED_DIRECTORY_NAMES.has(part))) {
    return "excluded directory";
  }

  if (EXCLUDED_BINARY_EXTENSIONS.has(path.posix.extname(name).toLowerCase())) {
    return "binary/media/archive file";
  }

  if (isBlockedReadPath(normalized)) {
    return "blocked read path";
  }

  return null;
}

async function pathExists(repoRoot: string, relativePath: string, type: CheckType): Promise<boolean> {
  if (getExclusionReason(relativePath)) {
    return false;
  }

  const targetPath = path.join(repoRoot, relativePath);
  assertSafeRead(repoRoot, targetPath);

  try {
    const stat = await fs.stat(targetPath);
    return normalizeCheckType(type) === "directory" ? stat.isDirectory() : stat.isFile();
  } catch {
    return false;
  }
}

function hasGitChange(normalizedPath: string, changedFiles: Set<string>): boolean {
  if (normalizedPath === ".") {
    return changedFiles.size > 0;
  }

  return changedFiles.has(normalizedPath) || [...changedFiles].some((filePath) => filePath.startsWith(`${normalizedPath}/`));
}

function insertMissingCheckNode(root: RepoTreeNode, check: CheckStatus): void {
  const parts = check.path.split("/").filter(Boolean);
  if (parts.length === 0) {
    return;
  }

  let current = root;
  let currentPath = "";

  for (const [index, part] of parts.entries()) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    const isLeaf = index === parts.length - 1;
    let child = current.children.find((candidate) => candidate.path === currentPath);

    if (!child) {
      child = {
        name: part,
        path: currentPath,
        type: isLeaf ? normalizeCheckType(check.type) : "directory",
        children: [],
        checkIds: isLeaf ? [check.id] : [],
        missingCheckIds: isLeaf ? [check.id] : [],
        existsInProjectMap: isLeaf,
        missingRequiredCheck: isLeaf,
        gitChanged: false,
        excluded: Boolean(getExclusionReason(currentPath))
      };
      current.children.push(child);
      current.children.sort((left, right) => {
        if (left.type !== right.type) {
          return left.type === "directory" ? -1 : 1;
        }
        return left.name.localeCompare(right.name);
      });
    }

    if (isLeaf) {
      child.checkIds = Array.from(new Set([...child.checkIds, check.id]));
      child.missingCheckIds = Array.from(new Set([...child.missingCheckIds, check.id]));
      child.existsInProjectMap = true;
      child.missingRequiredCheck = true;
      child.excluded = child.excluded || check.excluded;
    }

    if (child.excluded) {
      return;
    }

    current = child;
  }
}

async function scanNode(
  repoRoot: string,
  absolutePath: string,
  changedFiles: Set<string>,
  checksByPath: Map<string, string[]>,
  missingChecksByPath: Map<string, string[]>,
  counters: ScanCounters
): Promise<RepoTreeNode> {
  const relativePath = toRepoRelative(repoRoot, absolutePath);
  const normalized = normalizeRepoPath(relativePath);
  const exclusionReason = getExclusionReason(normalized);

  const stat = await fs.lstat(absolutePath);
  const type = stat.isDirectory() ? "directory" : "file";
  const checkIds = checksByPath.get(normalized) ?? [];
  const missingCheckIds = missingChecksByPath.get(normalized) ?? [];

  const node: RepoTreeNode = {
    name: normalized === "." ? "." : path.posix.basename(normalized),
    path: normalized,
    type,
    children: [],
    checkIds,
    missingCheckIds,
    existsInProjectMap: checkIds.length > 0,
    missingRequiredCheck: missingCheckIds.length > 0,
    gitChanged: hasGitChange(normalized, changedFiles),
    excluded: Boolean(exclusionReason) || stat.isSymbolicLink()
  };

  if (node.excluded) {
    return node;
  }

  if (type === "directory") {
    counters.directoryCount += 1;
  } else {
    counters.fileCount += 1;
  }

  if (type === "directory") {
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    node.children = await Promise.all(
      entries
        .sort((a, b) => {
          if (a.isDirectory() !== b.isDirectory()) {
            return a.isDirectory() ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
        .map((entry) =>
          scanNode(
            repoRoot,
            path.join(absolutePath, entry.name),
            changedFiles,
            checksByPath,
            missingChecksByPath,
            counters
          )
        )
    );
  }

  return node;
}

export async function scanRepository(
  repoRoot: string,
  gitSummary: GitSummary,
  projectMapPath?: string
): Promise<RepoStatusSnapshot> {
  const projectMap = await loadProjectMap(projectMapPath);
  const phaseChecks = projectMap.phases.flatMap((phase) =>
    phase.checks.map((check): PhaseCheckEntry => ({ phaseId: phase.id, check }))
  );
  const checksByPath = new Map<string, string[]>();

  for (const { check } of phaseChecks) {
    const normalized = normalizeRepoPath(check.path);
    checksByPath.set(normalized, [...(checksByPath.get(normalized) ?? []), check.id]);
  }

  const checks = await resolvePhaseChecks(repoRoot, phaseChecks);
  const missingChecksByPath = new Map<string, string[]>();
  for (const check of checks) {
    if (check.missingRequired) {
      missingChecksByPath.set(check.path, [...(missingChecksByPath.get(check.path) ?? []), check.id]);
    }
  }
  const progress = await calculateProjectProgress(repoRoot, projectMap, checks);

  const counters: ScanCounters = { fileCount: 0, directoryCount: 0 };
  const changedFiles = new Set(gitSummary.changedFiles.map(normalizeRepoPath));
  const tree = await scanNode(repoRoot, repoRoot, changedFiles, checksByPath, missingChecksByPath, counters);
  for (const check of checks.filter((entry) => entry.missingRequired)) {
    insertMissingCheckNode(tree, check);
  }

  const existingCheckCount = checks.filter((check) => check.exists).length;
  const missingCheckCount = checks.length - existingCheckCount;
  const scannedAt = new Date().toISOString();
  const summary: ScanSummary = {
    schemaVersion: SCHEMA_VERSION,
    scannedAt,
    fileCount: counters.fileCount,
    directoryCount: counters.directoryCount,
    existingCheckCount,
    missingCheckCount,
    changedFileCount: gitSummary.changedFiles.length
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    scannedAt,
    tree,
    checks,
    progress,
    summary
  };
}

async function resolvePhaseChecks(repoRoot: string, entries: readonly PhaseCheckEntry[]): Promise<CheckStatus[]> {
  return await Promise.all(
    entries.map(async ({ phaseId, check }) => {
      const normalizedPath = normalizeRepoPath(check.path);
      const excluded = Boolean(getExclusionReason(normalizedPath));
      const exists = await pathExists(repoRoot, check.path, check.type);

      return {
        ...check,
        phaseId,
        path: normalizedPath,
        exists,
        missingRequired: check.required && !exists,
        excluded
      };
    })
  );
}

async function resolveReadinessChecks(
  repoRoot: string,
  checks: readonly ProjectMapCheck[]
): Promise<Array<ProjectMapCheck & { exists: boolean }>> {
  return await Promise.all(
    checks.map(async (check) => ({
      ...check,
      path: normalizeRepoPath(check.path),
      exists: await pathExists(repoRoot, check.path, check.type)
    }))
  );
}

async function calculateProjectProgress(
  repoRoot: string,
  projectMap: ProjectMap,
  checks: readonly CheckStatus[]
): Promise<ProjectProgressMetrics> {
  const codexReadinessChecks = await resolveReadinessChecks(repoRoot, projectMap.readiness.codexReadinessChecks);
  const productionReadinessChecks = await resolveReadinessChecks(repoRoot, projectMap.readiness.productionReadinessChecks);

  return {
    totalChecklistProgress: calculateWeightedPhaseProgress(projectMap, checks, (phaseId) => phaseId !== ""),
    mainAppMvpProgress: calculateWeightedPhaseProgress(projectMap, checks, (phaseId) => phaseId !== "P0.5"),
    projectControlCenterProgress: calculateWeightedPhaseProgress(projectMap, checks, (phaseId) => phaseId === "P0.5"),
    codexReadiness: calculateCountProgress(codexReadinessChecks),
    productionReadiness: calculateCountProgress(productionReadinessChecks)
  };
}

function calculateWeightedPhaseProgress(
  projectMap: ProjectMap,
  checks: readonly CheckStatus[],
  includePhase: (phaseId: string) => boolean
): ProgressMetric {
  const includedPhases = projectMap.phases.filter((phase) => includePhase(phase.id));
  const includedPhaseIds = new Set(includedPhases.map((phase) => phase.id));
  const includedChecks = checks.filter((check) => includedPhaseIds.has(check.phaseId));
  const completed = includedChecks.filter((check) => check.exists).length;
  const total = includedChecks.length;
  const totalWeight = includedPhases.reduce((sum, phase) => sum + phase.weight, 0);

  if (totalWeight === 0) {
    return { completed, total, percent: 0 };
  }

  const weightedCompletion = includedPhases.reduce((sum, phase) => {
    const phaseChecks = checks.filter((check) => check.phaseId === phase.id);
    const phaseTotal = phaseChecks.length;
    const phaseCompleted = phaseChecks.filter((check) => check.exists).length;
    const phasePercent = phaseTotal === 0 ? 0 : phaseCompleted / phaseTotal;

    return sum + phasePercent * phase.weight;
  }, 0);

  return {
    completed,
    total,
    percent: Math.round((weightedCompletion / totalWeight) * 100)
  };
}

function calculateCountProgress(checks: ReadonlyArray<{ exists: boolean }>): ProgressMetric {
  const completed = checks.filter((check) => check.exists).length;
  const total = checks.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}
