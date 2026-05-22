export type ProjectArea =
  | 'assessment-app'
  | 'project-control-center'
  | 'documentation'
  | 'automation'
  | 'unknown';

export type FileKind =
  | 'source'
  | 'test'
  | 'config'
  | 'documentation'
  | 'data'
  | 'generated'
  | 'unknown';

export interface ScanOptions {
  readonly rootDir: string;
  readonly maxDepth: number;
  readonly includeHidden: boolean;
  readonly generatedAt: string;
}

export interface FileSummary {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly name: string;
  readonly extension: string;
  readonly kind: FileKind;
  readonly area: ProjectArea;
  readonly sizeBytes: number;
  readonly modifiedAt: string;
}

export interface RepoTreeNode {
  readonly name: string;
  readonly relativePath: string;
  readonly type: 'directory' | 'file';
  readonly children: readonly RepoTreeNode[];
  readonly file?: FileSummary;
}

export interface ProgressMetric {
  readonly id: string;
  readonly label: string;
  readonly completed: number;
  readonly total: number;
  readonly status: 'not-started' | 'in-progress' | 'complete';
}

export interface ProgressRatio {
  readonly completed: number;
  readonly total: number;
  readonly percent: number;
}

export interface ProgressSummary {
  readonly overallPercent: number;
  readonly totalChecklistProgress: ProgressRatio;
  readonly mainAppMvpProgress: ProgressRatio;
  readonly projectControlCenterProgress: ProgressRatio;
  readonly codexReadiness: ProgressRatio;
  readonly productionReadiness: ProgressRatio;
  readonly metrics: readonly ProgressMetric[];
  readonly notes: readonly string[];
}

export interface GitFileStatus {
  readonly path: string;
  readonly indexStatus: string;
  readonly workingTreeStatus: string;
}

export interface GitStatusSummary {
  readonly branch: string;
  readonly upstream?: string;
  readonly ahead: number;
  readonly behind: number;
  readonly isClean: boolean;
  readonly files: readonly GitFileStatus[];
  readonly error?: string;
}

export interface ProjectSnapshot {
  readonly schemaVersion: 'project-control-center.snapshot.v1';
  readonly generatedAt: string;
  readonly rootDir: string;
  readonly files: readonly FileSummary[];
  readonly tree: RepoTreeNode;
  readonly progress: ProgressSummary;
  readonly git: GitStatusSummary;
}

export interface HistoryEntry {
  readonly schemaVersion: 'project-control-center.history.v1';
  readonly timestamp: string;
  readonly eventType: 'scan';
  readonly summary: {
    readonly fileCount: number;
    readonly overallPercent: number;
    readonly changedFileCount: number;
  };
}

export interface SafetyFilterDecision {
  readonly allowed: boolean;
  readonly targetPath: string;
  readonly reason: string;
}

export interface WriteResult {
  readonly targetPath: string;
  readonly bytesWritten: number;
}
