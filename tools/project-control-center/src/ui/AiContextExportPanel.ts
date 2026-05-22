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
  const actions = el("div", "button-row");

  for (const kind of exportOrder) {
    const button = el("button", "button", t(labelByKind[kind]));
    button.type = "button";
    button.addEventListener("click", async () => {
      button.setAttribute("aria-busy", "true");
      try {
        const exports = await loadExports();
        const match = exports.find((entry) => entry.kind === kind);
        if (match) {
          await navigator.clipboard.writeText(match.content);
          status.textContent = t("copied");
        }
      } finally {
        button.removeAttribute("aria-busy");
      }
    });
    actions.append(button);
  }

  section.append(actions);
  section.append(status);
  return section;
}
