import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { GitFileStatus, GitStatusSummary } from '../types/projectControlCenter.js';

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

export async function getGitSummary(repoRoot: string): Promise<import("./types").GitSummary> {
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

  const [branchOutput, statusOutput, logOutput] = await Promise.all([
    runGit(["branch", "--show-current"]),
    runGit(["status", "--porcelain"]),
    runGit(["log", "-5", "--pretty=format:%h%x09%s"])
  ]);

  const changedFiles = statusOutput
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.slice(3).trim())
    .filter((path) => path.length > 0);

  const lastCommits = logOutput
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => {
      const [shortHash = "", subject = ""] = line.split("\t");
      return { shortHash, subject };
    });

  return {
    branch: branchOutput.trim() || "unknown",
    isClean: changedFiles.length === 0,
    changedFiles,
    lastCommits
  } as unknown as import("./types").GitSummary;
}
