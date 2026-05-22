import { REPO_ROOT } from "../core/constants";
import { appendToolError, toToolErrorRecord } from "../core/errors";
import { getGitSummary } from "../core/gitStatus";
import { writeGitHistorySnapshot } from "../core/snapshots";
import type { GitSummary } from "../core/types";

export async function refreshGitSummary(): Promise<GitSummary> {
  try {
    const summary = await getGitSummary(REPO_ROOT);
    await writeGitHistorySnapshot(summary);
    return summary;
  } catch (error) {
    await appendToolError(toToolErrorRecord("git-summary", error));
    throw error;
  }
}
