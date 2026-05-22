import type { RepoStatusSnapshot, RepoTreeNode } from "../core/types";
import { t } from "./i18n";
import { el, list, metric, panel } from "./layout";

function renderNode(node: RepoTreeNode): HTMLElement {
  const item = el("li", "tree-item");
  if (node.gitChanged) {
    item.classList.add("is-git-changed");
  }
  if (node.excluded) {
    item.classList.add("is-excluded");
  }
  if (node.missingRequiredCheck) {
    item.classList.add("is-missing-check");
  }
  if (node.checkIds.length > 0) {
    item.classList.add("has-check");
  }

  const row = el("div", "tree-row");
  row.append(el("span", "tree-name", node.name));
  row.append(el("span", "tree-path", node.path));

  if (node.checkIds.length > 0) {
    row.append(el("span", "badge badge-ok", node.checkIds.join(", ")));
  }
  if (node.missingRequiredCheck) {
    row.append(el("span", "badge badge-warning", node.missingCheckIds.join(", ")));
  }
  if (node.gitChanged) {
    row.append(el("span", "badge badge-change", t("gitShort")));
  }
  if (node.excluded) {
    row.append(el("span", "badge badge-muted", "excluded"));
  }

  item.append(row);

  if (node.children.length > 0) {
    const children = el("ul", "tree");
    for (const child of node.children) {
      children.append(renderNode(child));
    }
    item.append(children);
  }

  return item;
}

export function renderRepoTreePanel(status: RepoStatusSnapshot): HTMLElement {
  const section = panel("repoTree");
  const summary = el("div", "metric-grid");
  summary.append(metric("files", status.summary.fileCount));
  summary.append(metric("directories", status.summary.directoryCount));
  summary.append(metric("existingChecks", status.summary.existingCheckCount));
  summary.append(metric("missingChecks", status.summary.missingCheckCount));
  summary.append(metric("changedFiles", status.summary.changedFileCount));
  section.append(summary);

  const missingChecks = status.checks
    .filter((check) => !check.exists)
    .map((check) => `${check.labelVi}: ${check.path}`);
  section.append(list("missingChecks", missingChecks));

  const tree = el("ul", "tree tree-root");
  tree.append(renderNode(status.tree));
  section.append(tree);
  return section;
}
