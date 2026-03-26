---
name: quick-preview
description: Build and visually verify the Trait Constellation app renders correctly
disable-model-invocation: true
---

## Quick Preview

Visual verification workflow for the Trait Constellation app:

1. Run `npm run build` and check for build errors
2. Start `npm run preview` in background (serves on http://localhost:4173)
3. Navigate to http://localhost:4173/trait-constellation/ in the browser
4. Take a screenshot of the running app
5. Check browser console for errors
6. Report visual status — radar chart renders, sliders visible, no layout breakage
7. Kill the preview server when done
