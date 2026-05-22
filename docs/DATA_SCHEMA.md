# Data Schema

## Session schema

Session records must include:
- sessionId
- participantId
- assessmentVersion
- startedAt
- endedAt
- locale
- device
- moduleOrder
- dataQuality

## Raw event schema

Raw events are append-only.

Fields:
- eventId
- eventType
- sessionId
- moduleId
- blockId?
- trialId?
- clientTimeMs
- timestamp
- payload

## Trial result schema

Fields:
- trialId
- itemId
- itemVersion
- moduleId
- blockId
- condition
- difficulty
- stimulusHash
- correctResponse
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

## Export requirements

Must support:
- full JSON export
- flat CSV export