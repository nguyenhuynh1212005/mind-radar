import path from "node:path";
import { appendToolError, toToolErrorRecord } from "../core/errors";
import { getGitSummary } from "../core/gitStatus";
import { writeGitHistorySnapshot } from "../core/snapshots";
import type { GitSummary } from "../core/types";

interface CliArgs {
  readonly rootDir: string;
  readonly write: boolean;
}

export async function runGitSummary(args: readonly string[] = process.argv.slice(2)): Promise<GitSummary> {
  const parsedArgs = parseArgs(args);

  try {
    const git = await getGitSummary(parsedArgs.rootDir);

    if (parsedArgs.write) {
      await writeGitHistorySnapshot(
        git,
        path.join(parsedArgs.rootDir, ".project", "git-history.snapshot.json"),
        parsedArgs.rootDir
      );
    }

    return git;
  } catch (error) {
    await appendToolError(
      toToolErrorRecord("git-summary", error),
      path.join(parsedArgs.rootDir, ".project", "tool-errors.ndjson"),
      parsedArgs.rootDir
    );
    throw error;
  }
}

function parseArgs(args: readonly string[]): CliArgs {
  const rootFlagIndex = args.indexOf("--root");
  const rootDir = rootFlagIndex >= 0 && args[rootFlagIndex + 1]
    ? path.resolve(args[rootFlagIndex + 1])
    : resolveDefaultRootDir();

  return {
    rootDir,
    write: !args.includes("--dry-run")
  };
}

function resolveDefaultRootDir(): string {
  const cwd = process.cwd();
  const cwdName = path.basename(cwd);
  const parentName = path.basename(path.dirname(cwd));

  if (cwdName === "project-control-center" && parentName === "tools") {
    return path.resolve(cwd, "../..");
  }

  return cwd;
}

const currentFilePath = __filename;
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  runGitSummary()
    .then((git) => {
      console.log(JSON.stringify({
        capturedAt: git.capturedAt,
        branch: git.branch,
        isClean: git.isClean,
        stagedFiles: git.stagedFiles.length,
        unstagedFiles: git.unstagedFiles.length,
        untrackedFiles: git.untrackedFiles.length,
        changedFiles: git.changedFiles.length,
        lastCommits: git.lastCommits.length
      }, null, 2));
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown git summary failure.";
      console.error(message);
      process.exitCode = 1;
    });
}
