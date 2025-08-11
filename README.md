# Veridox — Spot the Fake (Document Forensics Game)

Train your eye to detect forged and AI‑generated documents in seconds. Veridox is a fast, educational browser game and demo built to showcase our platform’s real‑world document forensics capabilities for insurers, KYC/AML, trust & safety, and risk teams.

The experience simulates real review: magnify details, decide “real” or “fake,” then learn what to look for. Each correct answer moves you up a live wait‑list style position indicator.

![Veridox](public/images/veridox-logo.png)

## Table of Contents
1. [What is Veridox?](#what-is-veridox)
2. [Features](#features)
3. [How it works](#how-it-works)
4. [Quick start](#quick-start)
5. [Project structure](#project-structure)
6. [Managing the dataset](#managing-the-dataset)
7. [Configuration](#configuration)
8. [Deployment](#deployment)
9. [Tech stack](#tech-stack)
10. [Roadmap](#roadmap)
11. [License](#license)

## What is Veridox?
Veridox helps teams spot forged or AI‑generated documents before they become expensive claims or onboarding failures. This game demonstrates core UX and education elements: rapid decisioning under time pressure, visual inspection aids, and targeted feedback that teaches the difference between real and fake artifacts.

> Production Veridox adds automated forgery detection, policy controls, review workflows, and auditability. This repo focuses on the interactive training/demo experience.

## Features

- **Countdown challenge**: 10‑second timer to encourage quick, confident review.
- **Magnifier with crosshair**: Inspect micro‑details anywhere on the page.
- **Swipe/keys/buttons**: Left = fake, right = real; supports arrow keys and click.
- **Educational feedback**: After each guess, see why it’s real or fake and what to check next time.
- **Auto‑advance with hover‑pause**: Review notes without losing pace.
- **Position pill**: Correct answers move you up a live “wait‑list” indicator.
- **Analytics hooks**: Wrong answers are logged by category, difficulty, and type for learning insights.
- **Pluggable dataset**: Add your own real and fake documents with metadata, difficulty, and learning notes.

## How it works

- The app renders a randomized stream of documents from `src/data/documents.js` that reference images in `public/dataset/real` and `public/dataset/fake`.
- Users decide “real” or “fake” via swipe, arrow keys, or UI buttons.
- A learning card explains the decision with highlights like forgery techniques and security features.
- The timer and position pill reinforce fast, accurate decision‑making.

## Quick start

### Prerequisites
- Node.js 16+ (18+ recommended)
- npm 8+

### Install & run
```bash
npm install
npm start
```
Then open `http://localhost:3000`.

## Project structure

```
public/
  images/veridox-logo.png
  dataset/
    real/   # authentic examples
    fake/   # forged/AI examples
    SETUP_GUIDE.md
src/
  App.js                   # game flow, countdown, magnifier, feedback
  data/documents.js        # dataset + metadata + analytics hooks
  components/EducationalFeedback.js
  utils/sounds.js          # tick sound for countdown
```

## Managing the dataset

Add images and metadata to create your own exercises.

1) Place images:
- Real docs → `public/dataset/real/`
- Fake docs → `public/dataset/fake/`

2) Describe each document in `src/data/documents.js`:

```js
{
  id: 12,
  image: process.env.PUBLIC_URL + "/dataset/fake/your_image.png",
  isReal: false,
  type: "AI‑Generated Invoice",
  category: "invoice",
  difficulty: "hard", // easy | medium | hard | expert
  forgeryType: "ai_generation",
  forgeryDetails: {
    alterations: ["Synthetic data"],
    techniques: ["Diffusion model"],
    detectionClues: ["Inconsistent typography"]
  },
  educationalNotes: {
    whenWrong: "This is actually FAKE! Look for…",
    keyIndicators: "Subtle kerning, unrealistic tax IDs, generic branding"
  }
}
```

For a step‑by‑step guide (categories, difficulty levels, and image requirements), see the dataset guide: [`public/dataset/SETUP_GUIDE.md`](public/dataset/SETUP_GUIDE.md).

## Configuration

Key configuration lives in `src/data/documents.js`:

- `documentDataset`: Array of document items consumed by the game.
- `userAnalytics`: In‑memory logging of wrong answers, aggregated by category/difficulty/type.
- `datasetConfig`: Allowed formats, recommended dimensions, and validation helper.

UI/UX behaviors are defined in `src/App.js` (e.g., timer length, auto‑advance, magnifier behavior, animations).

## Deployment

This app is built with Create React App and can be deployed anywhere static assets can be served.

### GitHub Pages
1. In `package.json`, set `homepage` to your repo pages URL, for example:
   ```json
   "homepage": "https://your-username.github.io/your-repo"
   ```
2. Build and deploy:
   ```bash
   npm run deploy
   ```
3. In GitHub → Settings → Pages, ensure the source is the `gh-pages` branch.

## Tech stack

- React 18
- React Scripts (CRA)
- Framer Motion (animations)
- Lightweight custom components for text effects and UI polish

## Roadmap

- Optional cloud analytics & cohorts for learning outcomes
- Document region highlighting and side‑by‑side comparisons
- Role‑based scenarios (claims, KYC, marketplace)
- Integrated model‑assisted hints and explainability

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE).

---

If you’d like to integrate this training experience into your workflow or see the full Veridox platform in action, use the “Book a demo” button in the header or get in touch.
