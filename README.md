# Trait Constellation

An interactive radar chart for exploring autism trait profiles across **39 dimensions** and **10 factors**, inspired by the [Autism Symptom Dimensions Questionnaire](https://onlinelibrary.wiley.com/doi/10.1111/dmcn.15637) (ASDQ) as visualized in [Scientific American (March 2026)](https://www.scientificamerican.com/article/the-autism-spectrum-isnt-a-sliding-scale-39-traits-show-the-complexity/).

![Trait Constellation Screenshot](docs/screenshot.png)

## Why This Exists

The autism spectrum isn't a linear scale from "less" to "more" autistic. The ASDQ model maps 39 distinct traits across 10 behavioral factors into a radar chart — producing a unique shape for every person, like a fingerprint. This project makes that model interactive so you can explore and adjust your own profile.

**Higher scores aren't inherently negative.** Many high-scoring traits — deep focus, pattern recognition, systematic thinking — are professional superpowers. The radar shows divergence from neurotypical baseline, not dysfunction.

## Features

- **Interactive radar chart** — 39 data points rendered as a polar area chart, updating in real-time as you adjust values
- **10 collapsible factor sections** — each with a description and per-trait sliders (1–5)
- **Hover tooltips on every trait** — plain-English explanations of what each trait measures and what the scale means
- **Radar dot hover** — highlights data points on the chart with label + value
- **Info panels** — expandable "What is this?", "How values were calibrated", and "How to read the scale" sections
- **Factor averages summary** — bar chart with overall score and peak factor identification
- **Fully client-side** — no backend, no data collection, no accounts

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (comes with Node.js)

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/trait-constellation.git
cd trait-constellation
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Static files are output to `dist/`. Deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

### Deploy to GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

## Usage

1. **Explore the radar** — the chart shows your current trait profile at a glance
2. **Tap a factor** — expand any of the 10 collapsible sections to see individual traits
3. **Adjust sliders** — click the 1–5 buttons to change any trait value; the radar updates instantly
4. **Hover for context** — hover the ⓘ icon next to any trait for a tooltip explaining what it measures
5. **Review the summary** — scroll down for factor averages and peak factor identification

### Customizing Default Values

To change the starting profile, edit the `value` field for any trait in the `FACTORS` array at the top of `src/SpectrumProfile.jsx`:

```jsx
{
  id: "deep_focus",
  label: "Deep-Dive Focus",
  value: 5,  // ← change this
  tip: "Ability (or compulsion) to go very deep into a subject..."
}
```

## The 10 Factors

| Factor | What It Measures |
|---|---|
| **Social Communication** | Eye contact, social reciprocity, small talk, reading cues |
| **Conversational Skills** | Turn-taking, staying on topic, perspective-taking |
| **Verbal Expression** | Vocal prosody, language precision, figurative language |
| **Restricted Interests** | Deep focus, topic intensity, novelty vs. mastery, systems fascination |
| **Cognitive Patterns** | Detail orientation, pattern recognition, systematic thinking, mental models |
| **Flexibility & Routine** | Routine preference, transition ease, ambiguity tolerance, need for closure |
| **Sensory Processing** | Noise, visual, tactile sensitivity, sensory seeking |
| **Emotional Regulation** | Frustration intensity, recovery speed, productive channeling, expression |
| **Motor Patterns** | Repetitive movements, fidgeting/stimming, coordination |
| **Executive Function** | Optimization drive, task switching, planning, inefficiency intolerance |

## Tech Stack

- [React 19](https://react.dev/) — UI components
- [Vite](https://vite.dev/) — build tooling
- Inline SVG — radar chart (no charting library dependency)
- Google Fonts — JetBrains Mono + Space Grotesk

Zero runtime dependencies beyond React.

## Project Structure

```
trait-constellation/
├── index.html              # Entry point with font imports
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg         # Radar-themed favicon
└── src/
    ├── main.jsx            # React mount point
    ├── index.css           # Global reset styles
    └── SpectrumProfile.jsx # Entire app (single component)
```

The entire app is a single ~460-line React component. This is intentional — it's a self-contained visualization, not a framework.

## Disclaimer

**This is not a clinical or diagnostic instrument.** It's an interactive exploration tool inspired by published research. The ASDQ is a validated questionnaire administered by clinicians — this project is a visualization of its dimensional model, not the questionnaire itself.

If you're interested in a formal assessment, consult a qualified professional.

## References

- Frazier, T.W. et al. (2023). "The Autism Symptom Dimensions Questionnaire: Development and Psychometric Evaluation of a New, Open-Source Measure of Autism Symptomatology." *Developmental Medicine & Child Neurology*, 65(8).
- Parshall, A. & Montañez, A. (2026). "Here's What the Autism Spectrum Really Looks Like." *Scientific American*, 334(4), p. 74.

## License

MIT
