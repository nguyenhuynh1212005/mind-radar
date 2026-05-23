import type { ContextExport, ContextExportKind } from "../core/types";
import { el, panel } from "./layout";
import { t, type LabelKey } from "./i18n";

const exportOrder: ContextExportKind[] = [
  "chatbotHandoff",
  "gitDiffReview",
  "nextCodexPrompt",
  "architectureContext",
  "changedFilesContext"
];

const labelByKind: Record<ContextExportKind, LabelKey> = {
  chatbotHandoff: "copyChatbotHandoff",
  gitDiffReview: "copyGitDiffReview",
  nextCodexPrompt: "copyNextCodexPrompt",
  architectureContext: "copyArchitectureContext",
  changedFilesContext: "copyChangedFilesContext"
};

const descByKind: Record<ContextExportKind, LabelKey> = {
  chatbotHandoff: "descChatbotHandoff",
  gitDiffReview: "descGitDiffReview",
  nextCodexPrompt: "descNextCodexPrompt",
  architectureContext: "descArchitectureContext",
  changedFilesContext: "descChangedFilesContext"
};

async function loadExports(): Promise<ContextExport[]> {
  const response = await fetch("/api/context");
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const payload = (await response.json()) as { exports: ContextExport[] };
  return payload.exports;
}

export function renderAiContextExportPanel(): HTMLElement {
  const section = panel("aiContextExport");
  section.append(el("p", "panel-note", t("aiArtifacts")));

  const status = el("p", "copy-status", "");
  const grid = el("div", "copilot-grid");

  for (const kind of exportOrder) {
    const card = el("div", "copilot-card");

    const info = el("div", "copilot-info");
    const title = el("h4", "copilot-title", t(labelByKind[kind]));
    const desc = el("p", "copilot-desc", t(descByKind[kind]));
    info.append(title, desc);

    const button = el("button", "copilot-action-btn", t("copyPrompt"));
    button.type = "button";

    card.append(info, button);

    // Click anywhere on the card to copy
    card.addEventListener("click", async (e) => {
      if (e.target === button) return; // handled by button click
      button.setAttribute("aria-busy", "true");
      try {
        const exports = await loadExports();
        const match = exports.find((entry) => entry.kind === kind);
        if (match) {
          await navigator.clipboard.writeText(match.content);
          status.textContent = `${t(labelByKind[kind])}: ${t("copied")}`;
        }
      } catch (err) {
        status.textContent = t("copyFailed");
      } finally {
        button.removeAttribute("aria-busy");
      }
    });

    // Also support button click
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      button.setAttribute("aria-busy", "true");
      try {
        const exports = await loadExports();
        const match = exports.find((entry) => entry.kind === kind);
        if (match) {
          await navigator.clipboard.writeText(match.content);
          status.textContent = `${t(labelByKind[kind])}: ${t("copied")}`;
        }
      } catch (err) {
        status.textContent = t("copyFailed");
      } finally {
        button.removeAttribute("aria-busy");
      }
    });

    grid.append(card);
  }

  section.append(grid);
  section.append(status);
  return section;
}
