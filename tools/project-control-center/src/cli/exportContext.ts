import path from "node:path";
import { appendToolError, toToolErrorRecord } from "../core/errors";
import { getGitSummary } from "../core/gitStatus";
import { scanRepository } from "../core/repoScanner";
import { writeContextArtifacts } from "../core/contextExport";
import type { ContextExport } from "../core/types";

interface CliArgs {
  readonly rootDir: string;
  readonly write: boolean;
}

export async function runContextExport(args: readonly string[] = process.argv.slice(2)): Promise<ContextExport[]> {
  const parsedArgs = parseArgs(args);

  try {
    const git = await getGitSummary(parsedArgs.rootDir);
    const status = await scanRepository(parsedArgs.rootDir, git);

    if (!parsedArgs.write) {
      return [];
    }

    return await writeContextArtifacts(status, git, {
      repoRoot: parsedArgs.rootDir,
      contextBundlePath: path.join(parsedArgs.rootDir, ".ai", "context-bundle.md"),
      codeIndexPath: path.join(parsedArgs.rootDir, ".ai", "code-index.json"),
      projectStatusDocPath: path.join(parsedArgs.rootDir, "docs", "projectStatus.md"),
      chatbotHandoffDocPath: path.join(parsedArgs.rootDir, "docs", "CHATBOT_HANDOFF.md")
    });
  } catch (error) {
    await appendToolError(
      toToolErrorRecord("context-export", error),
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
  runContextExport()
    .then((exports) => {
      console.log(JSON.stringify({
        exports: exports.map((entry) => entry.kind),
        files: [
          ".ai/context-bundle.md",
          ".ai/code-index.json",
          "docs/projectStatus.md",
          "docs/CHATBOT_HANDOFF.md"
        ]
      }, null, 2));
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown context export failure.";
      console.error(message);
      process.exitCode = 1;
    });
}
