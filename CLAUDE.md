# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server (Vite on http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test runner or linter is configured. ESLint packages are installed but no config file exists. Prettier is installed and runs automatically via Claude Code PostToolUse hook on every file edit.

## Architecture

**Trait Constellation** is a client-side React 19 + Vite 8 app that renders an interactive radar chart for exploring autism trait profiles across 39 dimensions organized into 10 behavioral factors. Inspired by the ASDQ (Autism Symptom Dimensions Questionnaire).

### Key Files

- **`src/SpectrumProfile.jsx`** — Main component (~629 lines): state management, radar SVG rendering, trait sliders, factor sections. Contains the `FACTORS` data array with all 39 traits.
- **`src/Onboarding.jsx`** — First-run onboarding interview (~723 lines): 10 poetic questions, one per factor. Stores completion flag in `localStorage` (`tc_onboarded`).
- **`src/main.jsx`** — React entry point.
- **`src/index.css`** — Global reset styles.

### Data Model

All data is inline in `SpectrumProfile.jsx` via the `FACTORS` array. Each factor has a name, color, and array of traits (39 total). Traits are scored 1–5 via button groups.

### UI Patterns

- Custom inline SVG radar chart (no charting library)
- Inline CSS-in-JS (no CSS framework)
- Google Fonts: JetBrains Mono + Space Grotesk
- React hooks only (useState, useCallback, useRef, useEffect) — no state management library
- LocalStorage for onboarding flag only

### Deployment

Static export to GitHub Pages via `.github/workflows/deploy.yml`. Vite base path is `/trait-constellation/` (set in `vite.config.js`).

⚠️ **Gotcha**: The `base` path in `vite.config.js` must stay as `/trait-constellation/` for GitHub Pages. Changing it breaks deployed asset loading. A PreToolUse hook guards this file — you'll be prompted before editing.

### Easter Egg

Cmd+click the app icon 10 times within 10 seconds to load a personal trait profile. Press Escape to dismiss. Implementation is in `SpectrumProfile.jsx` (`handleIconClick`).

## Conventions

- Monolithic component architecture — intentionally self-contained
- Higher trait scores indicate divergence from neurotypical baseline, not dysfunction
- No TypeScript — plain JSX throughout

## Claude Code Automation

- **PostToolUse hook**: Auto-runs `prettier --write` on every file edit
- **PreToolUse hook**: Guards `vite.config` and `.env` files — prompts before modification
- **`/deploy-check`**: Validates build output asset paths match GitHub Pages base path
- **`/quick-preview`**: Builds app, starts preview server, captures screenshot for visual verification
