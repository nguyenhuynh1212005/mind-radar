# AGENTS.md

## Project identity

This project is an Interactive Cognitive-Behavioral Profile Assessment web app.

The app measures task performance, interaction style, behavioral evidence, and metacognitive calibration.

## Core product rules

- Never produce one global IQ/EQ-like score.
- Results must be multi-axis and evidence-based.
- Report language must be cautious, specific, and tied to observed behavior.
- Do not overclaim psychological meaning.
- Every assessment module must export raw trial logs.
- Every score must be reproducible from logged data.
- Scoring logic must be independent from UI code.
- Use performance.now() for client-side timing.
- Date.now() may be used only for timestamps, not response time measurement.

## MVP scope

Build the platform before the full item bank.

MVP modules:
1. M2 - Inhibitory Control
2. M3 - Working Memory
3. M5 - Procedural / Systems Reasoning
4. M9 - Metacognitive Calibration embedded after blocks

Do not build all 11 modules at once.

## Architecture rules

Required layers:
- Frontend Test App
- Event Tracker
- Local State Store
- Test Orchestrator
- Module Runtime
- Scoring Engine
- Scoring Adapters
- Data Quality Checker
- Profile Aggregator
- Report Generator
- JSON/CSV Export

Modules must not call each other directly.
Modules communicate only through:
- Test Orchestrator
- Profile Aggregator
- explicit typed contracts

## Data rules

Every trial result must include at least:
- sessionId
- participantId
- moduleId
- blockId
- trialId
- itemId
- condition
- difficulty
- correctResponse when applicable
- userResponse
- isCorrect
- partialScore
- responseTimeMs
- firstInteractionTimeMs
- hesitationTimeMs
- changedAnswerCount
- wrongClickCount
- skipped
- timedOut
- focusLossCount
- invalidFlags

Every raw event must include:
- eventId
- eventType
- sessionId
- moduleId
- trialId when applicable
- clientTimeMs from performance.now()
- timestamp
- payload

## Engineering conventions

Tech stack:
- Frontend: Vite + Vanilla TypeScript
- Backend: Node.js + Express

Use TypeScript.
Prefer small, pure functions for scoring.
Do not mix scoring code with UI components.
All scoring adapters must have unit tests.
All schemas must be versioned.
Use explicit types; avoid `any` unless unavoidable.
Prefer deterministic tests over visual-only validation.

## Project Control Center (PCC) Integration

To maintain progress visibility and consistent AI collaboration, the project utilizes the **Project Control Center (PCC)** developer tool located under `tools/project-control-center`.

- **Machine-readable roadmap:** All development checklist checks, weights, and phase files are defined in `tools/project-control-center/project-map.json`.
- **Dynamic Status Scanning:** Before claiming any task or module complete, developers or AI agents must run:
  ```bash
  npm run pcc:scan
  ```
  This command will scan the repository and update `docs/projectStatus.md`, `docs/CHATBOT_HANDOFF.md`, and `.project/status.snapshot.json` with the latest objective progress indicators.
- **AI Handoffs:** To hand off context to another session or AI agent, use:
  ```bash
  npm run pcc:export
  ```
  This generates `.ai/context-bundle.md` containing all relevant, sanitized codebase context (excluding secrets, node_modules, build output, and binary files).

## Required checks before claiming done

Run:
- npm run typecheck
- npm run lint
- npm test
- npm run build

If a command does not exist yet, create the minimal script or explain why it cannot be run.

## Definition of done for a module

A module is done only when it has:
- interaction spec
- item schema
- runtime implementation
- tracking events
- scoring adapter
- data quality flags
- unit tests
- demo item bank
- JSON/CSV export compatibility
- safe report templates