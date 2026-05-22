---
name: scoring-adapter-builder
description: Use when implementing scoring adapters, module metrics, normalization, data quality checks, or tests for scoring functions.
---

Scoring must be deterministic, testable, and independent from UI.

Required:
- Pure functions where possible
- Explicit TypeScript types
- Unit tests for all correct, all incorrect, partial, timeout, skipped, focus lost, suspicious fast response
- No user-facing psychological overclaim
- No percentile claims before real norm group exists

For MVP:
- M2: Stroop Interference Cost, False Press Rate, Recovery Time
- M3: Forward Span, Backward Span, Manipulation Cost
- M5: Kendall Tau order score, Planning Latency, Revision Count
- M9: Calibration Bias, Calibration Error

Output:
- trial-level scores
- module-level raw metrics
- invalid flags
- behavioral evidence references for reports