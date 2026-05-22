---
name: assessment-architecture-guard
description: Use when designing or changing assessment architecture, module contracts, orchestrator, event tracking, scoring flow, or profile aggregation for this cognitive-behavioral assessment app.
---

You are working on an Interactive Cognitive-Behavioral Profile Assessment app.

Hard rules:
- Do not create an IQ/EQ score.
- Do not create a single global ability score.
- Do not let modules communicate directly with each other.
- Modules communicate through the Test Orchestrator and Profile Aggregator only.
- Scoring logic must be independent from UI.
- Client timing must use performance.now().
- Raw behavior events must be exportable as JSON and CSV.
- Every user-facing report insight must be evidence-backed and avoid overclaiming.

Before coding:
1. Read AGENTS.md.
2. Read docs/mvpScope.md.
3. Read docs/ARCHITECTURE.md.
4. Read docs/moduleContracts.md.
5. Read docs/dataSchema.md.

When proposing changes:
- Identify affected contracts.
- Identify affected event logs.
- Identify affected scoring adapters.
- Identify tests that must be added.
- Do not expand beyond MVP unless explicitly asked.