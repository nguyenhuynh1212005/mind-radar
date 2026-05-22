# Codex Tasks

## Task 1 - Plan only

Read docs and propose implementation plan. Do not code.

## Task 2 - Scaffold project

Create a TypeScript React app with:
- src/core/contracts
- src/core/tracking
- src/core/orchestrator
- src/core/scoring
- src/modules/m2
- src/modules/m3
- src/modules/m5
- src/modules/m9
- src/export
- tests

Done when:
- npm install works
- npm run typecheck works
- npm test works
- empty app renders

## Task 3 - Implement tracking core

Implement EventTracker using performance.now().
Add focus loss tracking.
Add JSON export.

## Task 4 - Implement M2 demo module

Implement demo Stroop + Go/No-Go with dev item bank.
Add scoring adapter and tests.

## Task 5 - Implement M3 demo module

Implement Corsi forward/backward demo.
Add scoring adapter and tests.

## Task 6 - Implement M5 demo module

Implement sortable procedural ordering demo.
Add Kendall Tau scoring and tests.

## Task 7 - Implement report skeleton

Create radar chart and evidence-backed text.
No IQ/EQ.
No clinical claims.