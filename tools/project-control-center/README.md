# Project Control Center

A local developer-only dashboard for tracking this repository's MVP progress and generating AI handoff prompts.

## What it does

- Reads repo structure.
- Reads project-map.json.
- Checks Git status.
- Computes practical MVP progress.
- Generates docs/PROJECT_STATUS.md.
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
- CONTROL_CENTER_SPEC.md: product spec for this tool
- PROJECT_MAP.md: human explanation of progress model
- project-map.json: machine-readable phase checklist
- CODEX_PROMPTS.md: prompts to give Codex