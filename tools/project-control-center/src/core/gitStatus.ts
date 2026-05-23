import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { SCHEMA_VERSION } from './constants';
import type { GitFileStatus, GitStatusSummary } from '../types/projectControlCenter.js';
import type { GitSummary } from './types';

const execFileAsync = promisify(execFile);

export async function readGitStatus(rootDir: string): Promise<GitStatusSummary> {
  try {
    const { stdout } = await execFileAsync('git', ['status', '--porcelain=v1', '-b'], {
      cwd: rootDir,
      windowsHide: true
    });
    return parseGitStatus(stdout);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown git status error.';
    return {
      branch: 'unknown',
      ahead: 0,
      behind: 0,
      isClean: false,
      files: [],
      error: message
    };
  }
}

export function parseGitStatus(stdout: string): GitStatusSummary {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const branchLine = lines[0] ?? '## unknown';
  const files = lines.slice(1).map(parseGitFileStatus);
  const branch = parseBranch(branchLine);
  const upstream = parseUpstream(branchLine);
  const ahead = parseCount(branchLine, /ahead (\d+)/);
  const behind = parseCount(branchLine, /behind (\d+)/);

  return {
    branch,
    upstream,
    ahead,
    behind,
    isClean: files.length === 0,
    files
  };
}

function parseGitFileStatus(line: string): GitFileStatus {
  return {
    indexStatus: line.slice(0, 1).trim(),
    workingTreeStatus: line.slice(1, 2).trim(),
    path: line.slice(3).trim()
  };
}

function parseBranch(branchLine: string): string {
  const withoutPrefix = branchLine.replace(/^##\s*/, '');
  return withoutPrefix.split(/[.\[]/)[0]?.trim() || 'unknown';
}

function parseUpstream(branchLine: string): string | undefined {
  const match = /\.\.\.([^\s[]+)/.exec(branchLine);
  return match?.[1];
}

function parseCount(branchLine: string, pattern: RegExp): number {
  const match = pattern.exec(branchLine);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
}
type GitStatusOutputSummary = ReturnType<typeof parseGitStatus> & {
  stagedFiles: string[];
  unstagedFiles: string[];
  untrackedFiles: string[];
};

export function parseGitStatusOutput(stdout: string | string[]): GitStatusOutputSummary {
  const lines = Array.isArray(stdout) ? stdout : stdout.split(/\r?\n/);
  const stagedFiles: string[] = [];
  const unstagedFiles: string[] = [];
  const untrackedFiles: string[] = [];

  for (const line of lines) {
    if (line.length < 3) {
      continue;
    }

    const indexStatus = line[0];
    const workTreeStatus = line[1];
    const path = normalizeGitStatusPath(line.slice(3).trim());

    if (!path) {
      continue;
    }

    if (indexStatus === "?" && workTreeStatus === "?") {
      untrackedFiles.push(path);
      continue;
    }

    if (indexStatus !== " " && indexStatus !== "?") {
      stagedFiles.push(path);
    }

    if (workTreeStatus !== " " && workTreeStatus !== "?") {
      unstagedFiles.push(path);
    }
  }

  return {
    ...parseGitStatus(lines.join("\n")),
    stagedFiles,
    unstagedFiles,
    untrackedFiles
  };
}

function normalizeGitStatusPath(path: string): string {
  const renameSeparator = " -> ";
  const renameIndex = path.lastIndexOf(renameSeparator);

  return renameIndex === -1 ? path : path.slice(renameIndex + renameSeparator.length);
}

export async function getGitSummary(repoRoot: string): Promise<GitSummary> {
  const { execFile } = await import("node:child_process");

  const runGit = (args: string[]): Promise<string> =>
    new Promise((resolve, reject) => {
      execFile("git", args, { cwd: repoRoot, encoding: "utf8" }, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(stdout);
      });
    });

  const [branchOutput, statusOutput, logOutput, unstagedDiffOutput, stagedDiffOutput] = await Promise.all([
    runGit(["branch", "--show-current"]),
    runGit(["status", "--porcelain"]),
    runGit(["log", "-5", "--pretty=format:%H%x09%h%x09%an%x09%aI%x09%s"]),
    runGit(["diff", "--stat"]),
    runGit(["diff", "--cached", "--stat"])
  ]);

  const status = parseGitStatusOutput(statusOutput);
  const changedFiles = uniquePaths([
    ...status.stagedFiles,
    ...status.unstagedFiles,
    ...status.untrackedFiles
  ]);

  const lastCommits = logOutput
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => {
      const [hash = "", shortHash = "", author = "", date = "", ...subjectParts] = line.split("\t");
      return { hash, shortHash, author, date, subject: subjectParts.join("\t") };
    });

  return {
    schemaVersion: SCHEMA_VERSION,
    capturedAt: new Date().toISOString(),
    branch: branchOutput.trim() || "unknown",
    isClean: changedFiles.length === 0,
    stagedFiles: status.stagedFiles,
    unstagedFiles: status.unstagedFiles,
    untrackedFiles: status.untrackedFiles,
    changedFiles,
    lastCommits,
    diffSummary: [...splitLines(stagedDiffOutput), ...splitLines(unstagedDiffOutput)]
  };
}

function splitLines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trimEnd()).filter((line) => line.length > 0);
}

function uniquePaths(values: string[]): string[] {
  return [...new Set(values)];
}
