# Architecture

## Technical flow

Frontend Test App
-> Event Tracker
-> Local State Store
-> Test Orchestrator
-> Module Runtime
-> Raw Session Logs
-> Scoring Engine
-> Scoring Adapters
-> Data Quality Checker
-> Normalization Engine
-> Profile Aggregator
-> Report Generator

## Hard rule

Assessment modules never communicate directly with each other.

Correct flow:
Module -> Orchestrator -> Profile Aggregator -> Report

## Frontend responsibilities

- Render tasks.
- Capture interactions.
- Use performance.now() for RT.
- Save recoverable state locally.
- Submit responses to module runtime.
- Export raw logs.

## Scoring responsibilities

- Validate events.
- Reconstruct trials.
- Compute trial score.
- Aggregate module metrics.
- Apply data quality flags.
- Generate safe evidence-backed report data.