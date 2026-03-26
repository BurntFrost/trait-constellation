---
name: deploy-check
description: Verify Vite build output asset paths match GitHub Pages base path configuration before deploy
---

## Deploy Check

Before pushing to main, verify deployment will work:

1. Read `vite.config.js` and extract the `base` path value
2. Run `npm run build`
3. Check `dist/index.html` for asset path prefixes — they must start with the configured base path (`/trait-constellation/`)
4. Verify `dist/CNAME` exists if custom domain is configured
5. Report any mismatches between `vite.config.js` base and the actual asset paths in the built HTML

### Expected State
- `base: '/trait-constellation/'` in vite.config.js
- All `<script>` and `<link>` tags in dist/index.html reference paths starting with `/trait-constellation/`
- dist/CNAME contains `soistartedblasting.com` (custom domain pointed at Vercel, separate from GitHub Pages)

### Common Failure Mode
If `base` is changed to `'/'` for local dev or custom domain testing, GitHub Pages assets will 404 because it serves from the `/trait-constellation/` subpath.
