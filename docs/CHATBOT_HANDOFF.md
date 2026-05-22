# Chatbot Handoff

Use the `project-control-center-builder` skill for future changes to the Project
Control Center.

Important constraints:

- Do not modify `src/`.
- Do not scaffold the main assessment app from this tool.
- Use `tools/project-control-center/project-map.json` as the only machine-readable
  source for progress calculation.
- Treat `tools/project-control-center/projectMap.md` as documentation only.
- Keep all UI labels in `tools/project-control-center/src/ui/i18n.ts`.
- Keep writes limited to `tools/project-control-center/`, `docs/projectStatus.md`,
  `docs/CHATBOT_HANDOFF.md`, `.project/`, and `.ai/`.

Generated state:

- `.project/status.snapshot.json`
- `.project/scan-history.ndjson`
- `.project/tool-errors.ndjson`
- `.project/git-history.snapshot.json`
- `.ai/context-bundle.md`
- `.ai/code-index.json`
