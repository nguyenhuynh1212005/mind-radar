---
name: project-control-center-builder
description: Use when building or modifying the local Project Control Center tool that tracks repo progress, Git status, AI handoff context, and next Codex prompts. This tool lives under tools/project-control-center and must not modify the main product app unless explicitly requested.
---

You are working on the Project Control Center, a local developer-only tool for this repository.

Purpose:
- Track MVP progress visually.
- Read repo status from docs, Git, project-map.json, and file existence checks.
- Generate copyable AI context for Codex or other chatbots.
- Generate docs/PROJECT_STATUS.md.
- Generate docs/CHATBOT_HANDOFF.md.
- Generate .project/status.snapshot.json.
- Generate .ai/context-bundle.md and .ai/code-index.json when implemented.

Hard boundaries:
- Do not scaffold or modify the main product app unless explicitly asked.
- Do not create src/ for the main app.
- Do not implement assessment modules.
- Do not create production item banks.
- Keep this tool isolated in tools/project-control-center.
- This is a developer tool, not part of the end-user assessment app.

Preferred implementation:
- Use TypeScript or simple Node.js.
- Prefer minimal dependencies.
- Localhost only if a server is needed.
- No database.
- No external network requirement.
- Deterministic generated files.
- Do not read secrets.
- Exclude .env, node_modules, dist, build, .git, binary files from context export.

Required UI features:
- MVP progress percentage.
- Phase checklist.
- Missing checks.
- Git branch and working tree status.
- Last commits.
- Next recommended action.
- Copy Chatbot Handoff button.
- Copy Git Diff Review Prompt button.
- Copy Next Codex Prompt button.
- Refresh button.

Required generated files:
- docs/PROJECT_STATUS.md
- docs/CHATBOT_HANDOFF.md
- .project/status.snapshot.json
- .ai/context-bundle.md
- .ai/code-index.json

Progress calculation:
- Use tools/project-control-center/project-map.json.
- Each phase has a weight.
- Each phase has file/folder checks.
- Completion is based on existing checks.
- Do not let AI invent progress manually.

Before coding:
1. Read root AGENTS.md.
2. Read tools/project-control-center/AGENTS.md.
3. Read tools/project-control-center/CONTROL_CENTER_SPEC.md.
4. Read tools/project-control-center/project-map.json.
5. Read docs/MVP_SCOPE.md.
6. Read docs/CODEX_TASKS.md if available.

Done means:
- The tool can be run locally.
- It can scan the repo.
- It can compute progress from project-map.json.
- It can generate status and handoff files.
- It can display a local dashboard.
- It does not touch the main app.