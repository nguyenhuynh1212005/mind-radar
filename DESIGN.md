---
version: 1.1.0
name: Mind-Radar-Clinical-Design
description: A clinical, high-focus design system for cognitive-behavioral assessments. The system prioritizes zero cognitive load, timing-safe rendering, stable layouts, and evidence-based reporting.

colors:
  primary: "#0052ff"
  primary-pressed: "#003ecc"
  on-primary: "#ffffff"
  brand-navy: "#0a1530"

  canvas: "#ffffff"
  surface: "#f7f7f7"
  surface-elevated: "#ffffff"

  hairline: "#dee1e6"
  hairline-strong: "#c8c4be"

  ink: "#0a0b0d"
  ink-muted: "#5b616e"
  ink-subtle: "#8a9099"

  semantic-correct: "#05b169"
  semantic-incorrect: "#cf202f"
  semantic-warning: "#dd5b00"

  focus-ring: "rgba(0, 82, 255, 0.24)"
  disabled-surface: "#f0f1f3"
  disabled-ink: "#9aa0aa"

  module-tint-stroop: "#fde0ec"
  module-tint-memory: "#dcecfa"
  module-tint-spatial: "#d9f3e1"
  module-tint-metacognition: "#f6ead4"

typography:
  display-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  heading-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  heading-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  stimulus-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.5px
  stimulus-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
  number-metric:
    fontFamily: "'JetBrains Mono', 'Geist Mono', 'SFMono-Regular', Consolas, monospace"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
  number-metric-sm:
    fontFamily: "'JetBrains Mono', 'Geist Mono', 'SFMono-Regular', Consolas, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.35
  button:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  section: 96px

layout:
  min-test-viewport-width: 1024px
  min-test-viewport-height: 720px
  active-test-max-width: 960px
  instruction-max-width: 760px
  report-max-width: 1120px

motion:
  active-test-transition-duration: 0ms
  dashboard-transition-duration: 120ms
  report-transition-duration: 120ms
  easing-standard: "cubic-bezier(0.2, 0, 0, 1)"

components:
  test-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.section}"
    motion: "none"
  instruction-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    maxWidth: "{layout.instruction-max-width}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
  stimulus-frame:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.stimulus-lg}"
    minHeight: "240px"
    display: "grid"
    placeItems: "center"
    motion: "none"
  fixation-point:
    color: "{colors.ink}"
    typography: "{typography.stimulus-md}"
    size: "40px"
    motion: "none"
  response-grid:
    display: "grid"
    gap: "{spacing.sm}"
    minHeight: "72px"
    motion: "none"
  response-option:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
    minHeight: "52px"
    motion: "none"
  button-primary:
    backgroundColor: "{colors.primary}"
    pressedBackgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    minHeight: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    minHeight: "48px"
  keyboard-key:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.number-metric-sm}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  confidence-slider:
    trackColor: "{colors.hairline}"
    fillColor: "{colors.primary}"
    thumbColor: "{colors.primary}"
    valueTypography: "{typography.number-metric}"
    minHeight: "64px"
  card-module:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
    shadow: "0 4px 12px rgba(0, 0, 0, 0.04)"
  metric-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.number-metric}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  evidence-card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  data-quality-flag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.sm}"
---

# Mind Radar Design System

## 1. Overview

Mind Radar is a clinical, high-focus interface for interactive cognitive-behavioral assessment.

The design goal is not to look playful. The goal is to reduce measurement noise. Active testing screens must be visually stable, predictable, and free from unnecessary animation so that response-time measurements, hesitation measurements, and interaction logs remain interpretable.

The interface should feel like a modern psychology laboratory: clean, precise, quiet, and serious.

## 2. Product Design Principles

### 2.1 Zero Cognitive Load

During active testing, the user should only process the task stimulus and the allowed response options. Do not add decoration, illustrations, gradients, badges, floating panels, or playful animation inside active trials.

### 2.2 Timing-safe Rendering

Any UI state used to measure response time must render without visual transition.

Timing-sensitive states include:

- fixation screen
- stimulus shown
- first available response input
- response submitted
- timeout
- drag start / drag drop
- confidence rating shown after a block

### 2.3 Static Geometry

Active test screens must not shift layout after the trial begins.

Rules:

- reserve fixed space for progress indicators
- reserve fixed space for stimulus
- reserve fixed space for response controls
- never insert late-loading elements above the stimulus
- never let feedback change the size or position of the next trial

### 2.4 Evidence-first Reporting

Report screens may be richer than active test screens, but every interpretation must be tied to behavioral evidence. The UI must not imply a global IQ/EQ-like score or a diagnostic label.

## 3. Color Rules

### 3.1 Active Testing

Allowed during active trials:

- canvas white
- ink black
- muted ink
- hairline border
- primary blue only for primary action or selected control
- semantic colors only after feedback is allowed

Not allowed during active trials:

- module pastel tint backgrounds
- decorative gradients
- multiple accent colors
- heavy colored shadows
- animated color transitions

### 3.2 Dashboard and Menu

Module tints are allowed only outside active trials:

- `module-tint-stroop` for M2 cards or menu labels
- `module-tint-memory` for M3 cards or menu labels
- `module-tint-spatial` for M5 cards or menu labels
- `module-tint-metacognition` for M9 cards or menu labels

### 3.3 Feedback

Correct and incorrect colors must not be the only information channel. Feedback must include text or icon support, for example:

- Correct / Đúng
- Incorrect / Sai
- Timeout / Hết giờ
- Skipped / Bỏ qua

## 4. Typography Rules

### 4.1 Sans-serif

Use Inter for:

- instructions
- headings
- buttons
- response labels
- report text

Font weight must not exceed 600.

### 4.2 Monospace

Use monospace for:

- response time in ms
- countdown timers
- trial numbers
- score metrics
- confidence percentage
- exported-data preview fields

This prevents numeric jitter when values change.

### 4.3 Stimulus Text

Stimulus text should be large, centered, and visually isolated. Use `stimulus-lg` by default for Stroop-like tasks and `stimulus-md` for denser tasks.

## 5. Layout and Spacing

### 5.1 Active Test Canvas

Active test layout:

```text
┌─────────────────────────────────────────────┐
│ Minimal top status / progress, fixed height │
├─────────────────────────────────────────────┤
│                                             │
│            Fixation / Stimulus              │
│                                             │
├─────────────────────────────────────────────┤
│       Response controls, fixed region        │
└─────────────────────────────────────────────┘
```

Rules:

- center stimulus in the viewport or active test area
- use generous whitespace
- keep the same layout between trials inside one block
- use `spacing.section` for stimulus isolation on desktop
- avoid scroll during active trials

### 5.2 Instruction Screens

Instruction screens may use cards, lists, and examples. They are not timing-critical.

Keep instructions short and procedural:

- what the user will see
- what they should do
- which keys/clicks are valid
- whether the practice block counts
- what happens on timeout

### 5.3 Report Screens

Report screens may use:

- radar chart
- evidence cards
- module metric cards
- data-quality warnings
- JSON/CSV export actions

Report screens may use light shadows and module tints because they are not used for response-time measurement.

## 6. Runtime UI State Rules

Each module UI must follow the same high-level state sequence:

```text
Instruction
-> Practice
-> Block Start
-> Fixation / Trial Prepare
-> Stimulus Shown
-> User Interacting
-> Response Submitted or Timeout
-> Optional Feedback
-> Confidence Rating when required
-> Block End
-> Module End
```

### 6.1 Timing Boundaries

The timer for response time may start only after the stimulus is fully committed to the screen.

The UI must fire or support these boundaries:

- `stimulus_shown`
- `first_interaction`
- `response_changed`
- `response_submitted`
- `trial_timeout`
- `focus_lost`
- `focus_returned`

### 6.2 No Animation During Active Measurement

The following must be set to 0ms duration during active measurement:

- stimulus appearance
- response option appearance
- grid highlight
- drag placeholder position changes, where possible
- timer/counter visual update
- feedback insertion inside the same layout region

Micro-interactions are allowed only on dashboard, report, and non-timed instruction screens.

### 6.3 Focus and Interruption

When the browser tab loses focus:

- keep layout frozen
- record focus loss
- show a neutral recovery screen when the user returns
- do not silently continue a timed trial if focus loss invalidates the measurement

## 7. Component Rules

### 7.1 `test-canvas`

Use for every active module runtime.

Requirements:

- white background
- no card shadow
- no decorative background
- no animation
- fixed active regions
- no scrolling in normal desktop viewport

### 7.2 `stimulus-frame`

Use for the main task stimulus.

Requirements:

- centered content
- fixed minimum height
- no transition
- no late font swap after the trial starts
- no extra helper text inside the frame unless the task requires it

### 7.3 `response-grid`

Use for click/tap responses.

Requirements:

- fixed number of columns inside a block
- fixed position across trials
- stable option size
- no hover animation that changes size
- selected state may change color or border only
- keyboard shortcuts should be shown before the timed block starts

### 7.4 `confidence-slider`

Use for M9 metacognitive calibration.

Requirements:

- shown after block or after selected important trials
- never interrupt the middle of a speed-sensitive trial
- percentage display must use monospace
- slider labels must be simple: 0%, 50%, 100%
- copy should ask about confidence in the just-completed block, not about identity or personality

### 7.5 `evidence-card`

Use for report explanations.

Each evidence card should include:

- source module
- observed metric
- actual value
- short cautious interpretation
- data-quality flags if relevant

## 8. MVP Module-specific UI Rules

### 8.1 M2 - Inhibitory Control

Applies to Stroop and Go/No-Go tasks.

Rules:

- stimulus must appear instantly
- stimulus must be centered
- answer keys/buttons must remain in fixed positions
- do not animate color changes
- do not use decorative module tint during trials
- do not show celebratory feedback during the timed block
- feedback, if used, must be brief and occupy a reserved region

Preferred active layout:

```text
Top fixed progress
Center stimulus word/color or Go/No-Go signal
Bottom fixed response keys/buttons
```

### 8.2 M3 - Working Memory

Applies to Corsi-style spatial sequence tasks.

Rules:

- grid cell size must stay fixed across a block
- sequence flash must use deterministic timing
- highlighted cells must not move or resize
- input phase must be visually distinct from playback phase
- disable response controls during playback
- do not show score during sequence playback

Preferred active layout:

```text
Top fixed phase label
Center fixed Corsi grid
Bottom fixed instruction/status text
```

### 8.3 M5 - Procedural / Systems Reasoning

Applies to sortable sequence and planning tasks.

Rules:

- list items must have fixed height when possible
- drag placeholder must reserve space
- drag ghost must not obscure the full list
- first drag time must be trackable as planning latency
- revision count must be trackable by stable drag/drop events
- no playful drag animation during measured interactions

Preferred active layout:

```text
Left/center fixed sortable list
Optional right fixed constraints panel
Bottom submit area
```

### 8.4 M9 - Metacognitive Calibration

Applies after blocks or selected trials.

Rules:

- confidence slider appears after task response, not before
- use neutral wording
- no shame language
- no diagnostic language
- display values in monospace
- submit button uses primary blue

Preferred wording:

```text
Bạn tự tin bao nhiêu % rằng mình làm đúng trong block vừa rồi?
```

Avoid:

```text
Bạn nghĩ trí thông minh của mình cao bao nhiêu?
```

## 9. Accessibility and Input Rules

### 9.1 Keyboard

Every timed task that supports keyboard response must define keys before the timed block starts.

Keyboard focus must be visible with `focus-ring`, but focus styling must not change element size.

### 9.2 Pointer and Touch

Minimum target size:

- normal buttons: 48px height
- response options: 52px height
- drag handles: 32px visual target, 44px interaction target when possible

### 9.3 Color Accessibility

Do not rely on color alone. Use text labels or icons for correctness, warnings, disabled states, and invalid trials.

### 9.4 Device Warning

If viewport is below the recommended active-test size, show a pre-test warning before starting the module. Do not show this warning after a timed trial begins.

## 10. Report and Export UI Rules

Report UI must support:

- multi-axis radar chart
- module-level metrics
- behavioral evidence cards
- data-quality flags
- JSON export
- CSV export

## 11. Do's and Don'ts

### Do's

- center the primary stimulus
- use monospace for numeric metrics
- reserve layout space before a trial starts
- use `performance.now()`-compatible UI timing boundaries
- separate active test UI from dashboard/report UI
- show data-quality warnings in reports
- keep report claims tied to behavioral evidence

### Don'ts

- animate stimulus appearance
- introduce new active-test accent colors
- use heavy shadows in active tests
- use pill-shaped playful controls for core assessment tasks
- show module tints during active trials
- show global IQ/EQ-like scores
- make diagnostic or career-deterministic claims
- mix scoring logic with UI components

## 12. Agent Implementation Notes

Before creating or editing UI code, agents must read this file.

When implementing UI:

1. build active module screens from `test-canvas`, `stimulus-frame`, `response-grid`, and module-specific components
2. ensure trial layout is stable before `stimulus_shown`
3. use `performance.now()` through the Event Tracker for all client timing
4. export raw logs for every module
5. keep scoring independent from UI
6. run typecheck, lint, tests, and build before claiming done