# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server (Vite on http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test runner, linter, or formatter is currently configured. ESLint packages are installed but no config file exists.

## Architecture

**Trait Constellation** is a client-side React 19 + Vite 8 app that renders an interactive radar chart for exploring autism trait profiles across 39 dimensions organized into 10 behavioral factors. Inspired by the ASDQ (Autism Symptom Dimensions Questionnaire).

### Key Files

- **`src/SpectrumProfile.jsx`** — Main component (~575 lines): state management, radar SVG rendering, trait sliders, factor sections. Contains the `FACTORS` data array with all 39 traits.
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

## Conventions

- Monolithic component architecture — intentionally self-contained
- Higher trait scores indicate divergence from neurotypical baseline, not dysfunction
- No TypeScript — plain JSX throughout
