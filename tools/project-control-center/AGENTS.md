# AGENTS.md - Project Control Center

## Scope

This folder contains a developer-only local tool named Project Control Center.

This tool is not the assessment product app.

## Purpose

The tool helps the project owner:
- see project progress visually
- inspect Git status
- know the current MVP phase
- generate copyable prompts for Codex and other chatbots
- export AI context bundles
- update docs/PROJECT_STATUS.md and docs/CHATBOT_HANDOFF.md

## Hard rules

- Do not modify main product source code from this tool.
- Do not create production assessment modules from this folder.
- Do not create production question banks.
- Do not read or export secrets.
- Do not include .env files in AI context.
- Do not include node_modules, dist, build, .git, or binary files in AI context.
- Do not claim scientific completion based only on file existence.
- Progress is a practical development checklist, not scientific validation.

## Implementation preferences

- Prefer TypeScript.
- Prefer minimal dependencies.
- Prefer a local-only dashboard.
- Prefer deterministic output.
- Prefer simple JSON + Markdown outputs.
- Keep the tool easy to delete without breaking the product app.

## Generated files

The tool may generate:
- docs/PROJECT_STATUS.md
- docs/CHATBOT_HANDOFF.md
- .project/status.snapshot.json
- .ai/context-bundle.md
- .ai/code-index.json

## Important outputs

The UI should provide copy buttons for:
- Chatbot handoff prompt
- Git diff review prompt
- Next Codex prompt
- Architecture context
- Changed files context

## Done means

The tool is usable when:
- it scans the repo root
- it computes progress from project-map.json
- it displays phase progress
- it displays Git status
- it generates Markdown handoff files
- it supports copy-to-clipboard from the local UI