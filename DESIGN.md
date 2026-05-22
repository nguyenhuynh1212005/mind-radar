---
version: 1.0.0
name: Mind-Radar-Clinical-Design
description: A clinical, high-focus design system for cognitive-behavioral assessments. Merges the institutional calm and monospace precision of Coinbase with the serious, low-cognitive-load geometry of Notion.

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
  semantic-correct: "#05b169"
  semantic-incorrect: "#cf202f"
  semantic-warning: "#dd5b00"
  module-tint-stroop: "#fde0ec"
  module-tint-memory: "#dcecfa"
  module-tint-spatial: "#d9f3e1"

typography:
  display-lg:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  heading-md:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  number-metric:
    fontFamily: "'JetBrains Mono', 'Geist Mono', monospace"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
  button:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 500

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  section: 96px

components:
  test-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.section}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
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
---

## Overview

This application is a clinical cognitive-behavioral assessment tool. The UI must ensure **Zero Cognitive Load**. Extraneous visual elements, animations, or heavy shadows will skew the user's reaction times (ms). The interface should feel like a modern, precise psychology laboratory.

## Colors

- **Canvas & Surface:** Pure white (`{colors.canvas}`) is the default background for all testing interfaces. Soft gray (`{colors.surface}`) is used only to group elements outside of active testing.
- **Primary Action:** Trustworthy clinical blue (`{colors.primary}`). Used strictly for "Next", "Start Test", or primary submit actions.
- **Semantics:** Correct/Incorrect feedback must use the exact `{colors.semantic-correct}` and `{colors.semantic-incorrect}` values.
- **Module Tints:** Pastel tints are reserved ONLY for the dashboard/menu to differentiate modules (e.g., Stroop vs. Working Memory), never during an active test.

## Typography

- **Inter (Sans-serif):** The universal font for instructions, buttons, and headings. Weight never exceeds 600.
- **Monospace for Metrics:** ANY display of reaction time (ms), scores, or active countdown timers MUST use a monospace font (`{typography.number-metric}`). This prevents the UI from jittering when numbers rapidly change.

## Layout & Spacing

- Generous whitespace is mandatory. Use `{spacing.section}` (96px) to isolate the testing stimulus in the center of the screen.
- The interface must remain absolutely static during a test block. No layout shifting.

## Shapes & Elevation

- **Sober Geometry:** Buttons use `{rounded.md}` (8px). We use rectangles, not rounded pills, to maintain a serious, academic tone.
- **Flat Design:** Shadows are restricted to a single, ultra-light tier (`0 4px 12px rgba(0,0,0,0.04)`) for dashboard cards. Active testing interfaces are completely flat.

## Do's and Don'ts

- **Do** center the primary stimulus (text, image) perfectly in the viewport during test execution.
- **Do** use monospace fonts for all rapid-changing numbers.
- **Don't** use transition animations for stimuli in speed-based tests (Module 2, 7). They must appear instantly (0ms render).
- **Don't** introduce new accent colors. Stick strictly to Ink, Blue, and White during active testing.