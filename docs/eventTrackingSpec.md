# Event Tracking Spec

## Timing

Use performance.now() for:
- response time
- first interaction latency
- hesitation time
- drag/drop durations
- trial timeout measurement

Use Date timestamps only for audit logs.

## Required event types

- module_started
- instruction_viewed
- practice_started
- block_started
- trial_started
- stimulus_shown
- first_interaction
- hover_started
- hover_ended
- drag_started
- drag_dropped
- response_changed
- response_submitted
- trial_timeout
- focus_lost
- focus_returned
- module_finished

## Quality flags

Flag:
- focus loss
- suspiciously fast responses
- repeated response patterns
- too many skipped trials
- spam clicks
- lag spikes when detectable