import type { RepoStatusSnapshot } from "../core/types";
import { el, metric, panel } from "./layout";

export function renderStatusPanel(status: RepoStatusSnapshot): HTMLElement {
  const section = panel("progress");
  const grid = el("div", "metric-grid");
  
  grid.append(metric("totalChecklistProgress", `${status.progress.totalChecklistProgress.percent}%`));
  grid.append(metric("mainAppMvpProgress", `${status.progress.mainAppMvpProgress.percent}%`));
  grid.append(metric("projectControlCenterProgress", `${status.progress.projectControlCenterProgress.percent}%`));
  grid.append(metric("codexReadiness", `${status.progress.codexReadiness.percent}%`));
  grid.append(metric("productionReadiness", `${status.progress.productionReadiness.percent}%`));
  
  grid.append(metric("files", status.summary.fileCount));
  grid.append(metric("directories", status.summary.directoryCount));
  grid.append(metric("existingChecks", status.summary.existingCheckCount));
  grid.append(metric("missingChecks", status.summary.missingCheckCount));
  
  section.append(grid);
  return section;
}
