---
name: assessment-module-builder
description: Use when implementing or modifying an assessment module runtime, module UI, demo item bank, trial flow, or module state machine.
---

Build modules according to the shared AssessmentModule contract.

Every module must include:
- Runtime implementation
- Demo/dev item bank only, unless production item bank is explicitly requested
- UI component
- Tracking events
- Scoring adapter
- Data quality flags
- Unit tests
- JSON/CSV export compatibility

Required flow:
1. Instruction screen
2. Practice if applicable
3. Block start
4. Trial prepare
5. Stimulus shown
6. User interacting
7. Response submitted or timeout
8. M9 confidence rating after block when required
9. Module end

Do not:
- Hardcode scoring in React components
- Hide scoring logic inside UI
- Skip raw event tracking
- Use Date.now() for response time
- Invent production-validated item content