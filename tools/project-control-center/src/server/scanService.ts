import { REPO_ROOT } from "../core/constants";
import { appendToolError, toToolErrorRecord } from "../core/errors";
import { scanRepository } from "../core/repoScanner";
import { appendScanHistory, writeStatusSnapshot } from "../core/snapshots";
import type { GitSummary, RepoStatusSnapshot } from "../core/types";
import { refreshGitSummary } from "./gitService";

export async function refreshProjectStatus(inputGitSummary?: GitSummary): Promise<{
  status: RepoStatusSnapshot;
  git: GitSummary;
}> {
  try {
    const git = inputGitSummary ?? (await refreshGitSummary());
    const status = await scanRepository(REPO_ROOT, git);
    await writeStatusSnapshot(status);
    await appendScanHistory(status.summary);
    return { status, git };
  } catch (error) {
    await appendToolError(toToolErrorRecord("repo-scan", error));
    throw error;
  }
}
