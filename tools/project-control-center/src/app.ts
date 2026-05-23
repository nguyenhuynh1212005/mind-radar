import type { GitSummary, RepoStatusSnapshot } from "./core/types";
import { renderAiContextExportPanel } from "./ui/AiContextExportPanel";
import { renderGitHistoryPanel } from "./ui/GitHistoryPanel";
import { renderLogsPanel } from "./ui/LogsPanel";
import { renderRepoTreePanel } from "./ui/RepoTreePanel";
import { renderStatusPanel } from "./ui/StatusPanel";
import { t } from "./ui/i18n";
import { el } from "./ui/layout";

interface StatusPayload {
  status: RepoStatusSnapshot;
  git: GitSummary;
}

async function loadStatus(): Promise<StatusPayload> {
  const response = await fetch("/api/status");
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as StatusPayload;
}

function renderError(root: HTMLElement, error: unknown): void {
  root.replaceChildren();
  const message = error instanceof Error ? error.message : String(error);
  const section = el("section", "panel error-panel");
  section.append(el("h2", undefined, t("errorTitle")));
  section.append(el("pre", undefined, message));
  root.append(section);
}

async function renderDashboard(root: HTMLElement, payload: StatusPayload): Promise<void> {
  root.replaceChildren();
  const header = el("header", "app-header");
  header.append(el("h1", undefined, t("appTitle")));
  const refresh = el("button", "button", t("refresh"));
  refresh.type = "button";
  refresh.addEventListener("click", () => {
    void start(root);
  });
  header.append(refresh);

  const main = el("main", "dashboard");
  main.append(renderStatusPanel(payload.status));
  main.append(renderRepoTreePanel(payload.status));
  main.append(renderGitHistoryPanel(payload.git));
  main.append(renderAiContextExportPanel());
  
  const logsPanel = await renderLogsPanel();
  main.append(logsPanel);

  root.append(header, main);
}

export async function start(root: HTMLElement): Promise<void> {
  root.replaceChildren(el("p", "loading", t("loading")));
  try {
    const payload = await loadStatus();
    await renderDashboard(root, payload);
  } catch (error) {
    renderError(root, error);
  }
}
