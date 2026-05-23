import { getMessages } from './i18n.js';
import { renderStatusPanel } from './StatusPanel.js';
import { renderGitHistoryPanel } from './GitHistoryPanel.js';
import { renderRepoTreePanel } from './RepoTreePanel.js';
import { renderLogsPanel } from './LogsPanel.js';
import { renderAiContextExportPanel } from './AiContextExportPanel.js';
import { el } from './layout.js';

const messages = getMessages();
const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('Missing #app root element.');
}

app.innerHTML = `
  <section class="shell">
    <header class="topbar">
      <div>
        <h1>${messages.title}</h1>
        <p>${messages.subtitle}</p>
      </div>
      <button id="loadSnapshot" type="button">${messages.scanCta}</button>
    </header>
    <section id="content" class="dashboard" aria-live="polite"></section>
  </section>
`;

const content = document.querySelector<HTMLElement>('#content');
const loadButton = document.querySelector<HTMLButtonElement>('#loadSnapshot');

if (!content || !loadButton) {
  throw new Error('Project Control Center UI failed to initialize.');
}

loadButton.addEventListener('click', () => {
  void loadSnapshot();
});

renderEmptyState();

async function loadSnapshot(): Promise<void> {
  content!.innerHTML = `<p class="muted">${messages.loading}</p>`;

  try {
    const response = await fetch('/api/snapshot');
    if (!response.ok) {
      throw new Error(`Snapshot request failed with ${response.status}.`);
    }
    const data = await response.json() as any;
    // data contains { status: RepoStatusSnapshot, git: GitSummary }
    if (!data.status || !data.git) {
      throw new Error("Invalid API response format");
    }
    await renderSnapshot(data);
  } catch (e) {
    renderEmptyState(messages.unavailable);
  }
}

function renderEmptyState(message = messages.unavailable): void {
  content!.innerHTML = `
    <article class="panel panel-wide">
      <h2>${messages.progress}</h2>
      <p class="muted">${message}</p>
    </article>
  `;
}

async function renderSnapshot(data: any): Promise<void> {
  content!.innerHTML = "";
  
  const col1 = el("div", "col");
  col1.append(renderStatusPanel(data.status));
  
  const treePanel = renderRepoTreePanel(data.status);
  const repoTreeWrapper = el("div", "panel-wrapper");
  repoTreeWrapper.append(treePanel);
  col1.append(repoTreeWrapper);
  
  const col2 = el("div", "col");
  col2.append(renderGitHistoryPanel(data.git));
  col2.append(await renderLogsPanel());
  col2.append(renderAiContextExportPanel());
  
  content!.append(col1);
  content!.append(col2);
}
