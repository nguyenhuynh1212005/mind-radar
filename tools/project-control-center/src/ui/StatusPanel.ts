import type { GitSummary, RepoStatusSnapshot } from "../core/types";
import { el, metric, panel } from "./layout";
import { t } from "./i18n";

export function renderStatusPanel(status: RepoStatusSnapshot, git: GitSummary): HTMLElement {
  const section = panel("status");
  const grid = el("div", "metric-grid");
  grid.append(metric("progressSource", t("progressSourceValue")));
  grid.append(metric("docsOnly", t("yes")));
  grid.append(metric("existingChecks", status.summary.existingCheckCount));
  grid.append(metric("missingChecks", status.summary.missingCheckCount));
  grid.append(metric("gitChanged", git.changedFiles.length));
  section.append(grid);
  return section;
}
