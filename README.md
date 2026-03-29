# Figma Education Platform

Educational website for Figma tutorials: dashboard with progress tracking and an immersive step-by-step tutorial room.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Styling:** Tailwind CSS + design tokens (Figma variables)
- **Animations:** Motion (motion.dev), canvas-confetti
- **Hosting:** Vercel (free tier). Video URLs are stored in `src/data/tutorials.json`; for a DB later you can use Vercel Postgres/Neon or KV (see [Vercel Storage](https://vercel.com/docs/storage)).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project layout

- `src/app/` – App Router: `page.tsx` (home), `tuto/[id]/page.tsx` (tutorial)
- `src/components/` – Layout, Button, Hero, TutorialGrid, TutorialCard, TutorialPageClient, DopamineButton, ShortcutsModal, SearchAndFilters, icons
- `src/data/tutorials.json` – Tutorials and steps (edit to add more)
- `src/hooks/useTutorialProgress.ts` – Progress (not_started / watched / finished) in `localStorage`
- `src/lib/safe-html.tsx` – Renders tutorial descriptions; use `<accent>word</accent>` for special styling

## Design

Colors, type, radius, and shadows follow your Figma variables and are in `src/app/globals.css` and `tailwind.config.ts`. No extra background colors beyond the design system.

## Deploy on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Optional: set `NEXT_PUBLIC_HERO_IMAGE` to your hero image URL (e.g. Vercel Blob or CDN).

Videos are referenced by URL in `tutorials.json`. For a free setup, keep using placeholder or external URLs; for a DB, you can later add Vercel Postgres or Neon and store video URLs there.
