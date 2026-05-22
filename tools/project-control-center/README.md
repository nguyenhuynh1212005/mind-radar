# Project Control Center

A local developer-only dashboard for tracking this repository's MVP progress and generating AI handoff prompts.

## What it does

- Reads repo structure.
- Reads project-map.json.
- Checks Git status.
- Computes practical MVP progress.
- Generates docs/projectStatus.md.
- Generates docs/CHATBOT_HANDOFF.md.
- Generates .project/status.snapshot.json.
- Generates AI context bundles for chatbot/Codex review.
- Provides copy buttons for common AI prompts.

## What it does not do

- It does not build the assessment product app.
- It does not create production item banks.
- It does not validate scientific reliability.
- It does not replace tests.
- It does not read secrets.

## Planned commands

After implementation, expected commands:

```bash
npm install
npm run scan
npm run dev
npm run build

http://localhost:4177
```

## Main files
- controlCenterSpec.md: product spec for this tool
- projectMap.md: human explanation of progress model
- project-map.json: machine-readable phase checklist
- CODEX_PROMPTS.md: prompts to give Codex

## Implementation notes

Project Control Center is an isolated Vite + TypeScript tool. It must not scaffold
or modify the main assessment app under `src/`.

Runtime progress calculation uses `tools/project-control-center/project-map.json`
as the only machine-readable source. `projectMap.md` is documentation only and is
not parsed by runtime code.

### Run commands

```bash
cd tools/project-control-center
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run dev
```

The dev server runs at `http://127.0.0.1:5174`.

### Safety model

The tool blocks reads and exports for `.env`, `.env.*`, `node_modules`, `dist`,
`build`, `.git`, and binary files. Writes are limited to:

- `tools/project-control-center/`
- `docs/projectStatus.md`
- `docs/CHATBOT_HANDOFF.md`
- `.project/`
- `.ai/`

### Snapshots and history

- `.project/status.snapshot.json` is overwritten with the latest full status.
- `.project/git-history.snapshot.json` is overwritten with the latest Git summary.
- `.project/scan-history.ndjson` appends one concise scan summary per scan.
- `.project/tool-errors.ndjson` appends one sanitized error per error.

### AI context export

The AI Context Export panel writes `.ai/context-bundle.md` and
`.ai/code-index.json` through the same safe path rules. It provides copy actions
for Chatbot Handoff, Git Diff Review, Next Codex Prompt, Architecture Context,
and Changed Files Context.
