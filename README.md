# Figma Education Platform

Educational website for Figma tutorials: dashboard with progress tracking and an immersive step-by-step tutorial room.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS + design tokens
- Motion (motion.dev), canvas-confetti

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Project layout

- src/app/: app routes and global styles
- src/components/: UI and feature components
- src/data/tutorials.json: tutorials and steps
- src/hooks/useTutorialProgress.ts: progress in localStorage
- src/lib/safe-html.tsx: safe rich text renderer
