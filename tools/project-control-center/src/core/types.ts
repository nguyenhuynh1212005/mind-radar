export type CheckType = "file" | "directory" | "file_exists" | "directory_exists";
export type RepoTreeNodeType = "file" | "directory";

export interface ProjectMapCheck {
  id: string;
  labelVi: string;
  path: string;
  type: CheckType;
  required: boolean;
}

export interface ProjectMapPhase {
  id: string;
  name: string;
  weight: number;
  checks: ProjectMapCheck[];
}

export interface ProjectMapReadiness {
  codexReadinessChecks: ProjectMapCheck[];
  productionReadinessChecks: ProjectMapCheck[];
}

export interface ProjectMap {
  schemaVersion: number;
  generatedAt: string;
  phases: ProjectMapPhase[];
  readiness: ProjectMapReadiness;
}

export interface CheckStatus extends ProjectMapCheck {
  phaseId: string;
  exists: boolean;
  missingRequired: boolean;
  excluded: boolean;
}

export interface ProgressMetric {
  completed: number;
  total: number;
  percent: number;
}

export interface ProjectProgressMetrics {
  totalChecklistProgress: ProgressMetric;
  mainAppMvpProgress: ProgressMetric;
  projectControlCenterProgress: ProgressMetric;
  codexReadiness: ProgressMetric;
  productionReadiness: ProgressMetric;
}

export interface RepoTreeNode {
  name: string;
  path: string;
  type: RepoTreeNodeType;
  children: RepoTreeNode[];
  checkIds: string[];
  missingCheckIds: string[];
  existsInProjectMap: boolean;
  missingRequiredCheck: boolean;
  gitChanged: boolean;
  excluded: boolean;
}

export interface ScanSummary {
  schemaVersion: number;
  scannedAt: string;
  fileCount: number;
  directoryCount: number;
  existingCheckCount: number;
  missingCheckCount: number;
  changedFileCount: number;
}

export interface RepoStatusSnapshot {
  schemaVersion: number;
  scannedAt: string;
  tree: RepoTreeNode;
  checks: CheckStatus[];
  progress: ProjectProgressMetrics;
  summary: ScanSummary;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  subject: string;
}

export interface GitSummary {
  schemaVersion: number;
  capturedAt: string;
  branch: string;
  isClean: boolean;
  stagedFiles: string[];
  unstagedFiles: string[];
  untrackedFiles: string[];
  changedFiles: string[];
  lastCommits: GitCommit[];
  diffSummary: string[];
}

export type ContextExportKind =
  | "chatbotHandoff"
  | "gitDiffReview"
  | "nextCodexPrompt"
  | "architectureContext"
  | "changedFilesContext";

export interface ContextExport {
  kind: ContextExportKind;
  labelKey: string;
  content: string;
}

export interface ToolErrorRecord {
  schemaVersion: number;
  timestamp: string;
  operation: string;
  code: string;
  message: string;
  path?: string;
}
