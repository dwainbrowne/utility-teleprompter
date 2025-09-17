# utility-teleprompter

A simple React/TypeScript teleprompter to help you stay on track while recording YouTube videos. Edit Markdown on the left, read from the teleprompter-style preview on the right.

## Features
- Sweeping (mirror flip) for teleprompter glass — toggle "Teleprompter Mode" to horizontally flip the preview.
- Basic auto-scroll with adjustable speed, Play/Pause, and quick reset to top.
- Live Markdown preview (GitHub Flavored Markdown, soft line breaks).
- Font family and size controls for comfortable reading.
- Collapse the editor for a full-screen prompt view.

## Quick start

```bash
npm install
npm run dev
```

Build and preview production:

```bash
npm run build
npm run preview
```

## Tech stack
- React + TypeScript, Vite, Tailwind CSS
- Markdown parsing with `marked`
- Icons from `lucide-react`
