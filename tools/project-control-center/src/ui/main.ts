import { getMessages } from './i18n.js';
import type { ProjectSnapshot } from '../types/projectControlCenter.js';

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
    const snapshot = await response.json() as ProjectSnapshot;
    renderSnapshot(snapshot);
  } catch {
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

function renderSnapshot(snapshot: ProjectSnapshot): void {
  const areaCounts = new Map<string, number>();
  for (const file of snapshot.files) {
    areaCounts.set(file.area, (areaCounts.get(file.area) ?? 0) + 1);
  }

  content!.innerHTML = `
    <article class="panel">
      <h2>${messages.progress}</h2>
      <div class="metric-large">${snapshot.progress.overallPercent}%</div>
      <ul>${snapshot.progress.metrics.map((metric) => `<li>${metric.label}: ${metric.completed}/${metric.total}</li>`).join('')}</ul>
    </article>
    <article class="panel">
      <h2>${messages.git}</h2>
      <p>Branch: <strong>${snapshot.git.branch}</strong></p>
      <p>Status: <strong>${snapshot.git.isClean ? 'clean' : 'changed'}</strong></p>
      <p>Ahead/behind: ${snapshot.git.ahead}/${snapshot.git.behind}</p>
    </article>
    <article class="panel">
      <h2>${messages.changedFiles}</h2>
      <ul>${renderChangedFiles(snapshot)}</ul>
    </article>
    <article class="panel">
      <h2>${messages.fileAreas}</h2>
      <ul>${[...areaCounts.entries()].map(([area, count]) => `<li>${area}: ${count}</li>`).join('')}</ul>
    </article>
  `;
}

function renderChangedFiles(snapshot: ProjectSnapshot): string {
  if (snapshot.git.files.length === 0) {
    return '<li>No changed files detected.</li>';
  }

  return snapshot.git.files.slice(0, 12).map((file) => `<li>${file.path}</li>`).join('');
}
