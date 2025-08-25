# Mentor

Modern React + Vite app for offline quiz practice.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## PWA notes

- Service worker auto-updates and caches local JSON databases for offline use.
- An install button appears on supported mobile browsers.
- When a new version is available a toast prompts to reload.

## Data & API

- Quiz data lives in `/public/data/*.json`. Replace these files to swap in another dataset.
- For optional AI grading, set `GEMINI_API_KEY` in your environment before running `npm run dev`.

## PWA icons

Use any image generator to create `pwa-192x192.png`, `pwa-512x512.png` and place them in `public/`.

## Keyboard shortcuts

- `N` – next question
- `R` – review mode

