# Tip tap — Premium Typing Experience

Tip tap is a modern, distraction-free typing practice application built with React, TypeScript, and Vite.  
It combines speed tests, structured touch-typing lessons, detailed progress analytics, and rich customization in a privacy-first local app.

## Features

- **Multiple practice modes**
  - Time mode: 15s, 30s, 60s, 120s
  - Word mode: 10, 25, 50, 100 words
  - Quote mode (short/medium/long)
  - Custom text mode
- **Adaptive text options**: punctuation and numbers toggles
- **Touch Typing Academy**: 7 learning modules with 26 progressive lessons
- **Performance analytics**
  - Net WPM, Raw WPM, Accuracy, Consistency
  - Recent test history
  - Weak-key analysis and targeted drill generation
  - Level progression system
- **Practice streak tracking**
  - Daily goal
  - Current and longest streak
  - Weekly activity view
- **Deep customization**
  - Accent colors
  - Font families and sizes
  - Caret styles
  - Typing sound profiles and volume
  - Virtual keyboard, blind mode, reduced motion, focus mode
- **Local-first data**
  - All user data stays in browser localStorage
  - Backup export/import as JSON
- **SEO + LLM discoverability assets**
  - Dynamic metadata updates
  - JSON-LD schema
  - `robots.txt`, `sitemap.xml`
  - `llms.txt` and `llms-full.txt`

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4 + custom CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Motion/UI:** Motion
- **Analytics:** Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Installation

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The app runs on: **http://localhost:3000**

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` — start Vite dev server on port 3000
- `npm run build` — TypeScript check + production build
- `npm run preview` — preview built app locally
- `npm run lint` — TypeScript type-check (`tsc --noEmit`)
- `npm run clean` — remove `dist` output folder

## Keyboard Shortcuts

- `Tab + Enter` — restart current test
- `Esc` — exit dialog / return to practice
- `?` — open shortcuts modal
- `Alt + 1 / 2 / 3` — quick switch test duration / word count
- `Alt + P` — toggle punctuation
- `Alt + N` — toggle numbers
- `Alt + K` — toggle virtual keyboard
- `Alt + M` — toggle sound effects

## Project Structure

```text
src/
  components/
    Practice/
    Learn/
    Progress/
    Settings/
  context/
  types/
  utils/
public/
  llms.txt
  llms-full.txt
  robots.txt
  sitemap.xml
```

## Data & Privacy

- User settings, results, lesson progress, and streak context are stored locally under:
  - `tiptap_data_v1`
- No account is required to use the app.

## Deployment

This project is configured for Vercel with SPA rewrites in `vercel.json`.

## License

This repository includes Apache-2.0 SPDX headers in source files.
