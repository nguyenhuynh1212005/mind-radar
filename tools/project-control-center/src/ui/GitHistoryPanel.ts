import type { GitSummary } from "../core/types";
import { el, list, metric, panel } from "./layout";
import { t } from "./i18n";

export function renderGitHistoryPanel(git: GitSummary): HTMLElement {
  const section = panel("gitHistory");
  const summary = el("div", "metric-grid");
  summary.append(metric("currentBranch", git.branch));
  summary.append(metric("cleanState", git.isClean ? t("clean") : t("dirtyState")));
  section.append(summary);

  section.append(list("stagedFiles", git.stagedFiles));
  section.append(list("unstagedFiles", git.unstagedFiles));
  section.append(list("untrackedFiles", git.untrackedFiles));

  const commits = git.lastCommits.map((commit) => `${commit.shortHash} ${commit.subject}`);
  section.append(list("lastCommits", commits));
  section.append(list("diffSummary", git.diffSummary));
  return section;
}
