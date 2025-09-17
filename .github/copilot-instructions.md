# Copilot Instructions for utility-teleprompter

## What this repo is
- React + TypeScript single-page teleprompter to keep you on track while recording videos.
- Live Markdown editor (left) with teleprompter preview (right). All business logic is in `src/App.tsx`.

## Architecture at a glance
- State lives in `App.tsx`: `markdown`, `html`, `isFlipped`, `isCollapsed`, `fontSize`, `fontFamily`, `isScrolling`, `scrollSpeed`, and refs `scrollContainerRef`, `scrollIntervalRef`.
- Markdown → HTML via `marked` inside a `useEffect` with `gfm: true` and `breaks: true`, then rendered with `dangerouslySetInnerHTML` in the preview.
- Styling is Tailwind; Markdown typography via `.prose` rules in `src/index.css`.

## Key behaviors to know (with code pointers)
- Sweeping (mirror flip):
  - Toggle via header button (RotateCcw icon) that flips `isFlipped`.
  - Implementation: preview wrapper applies `transform scale-x-[-1]` when `isFlipped` is true; see the container around the `.prose` div in `App.tsx`.
  - UI chip shows “Teleprompter Mode” when flipped.
- Auto-scroll:
  - Play/Pause toggles `isScrolling`; speed is `scrollSpeed` (0.5–5, step 0.5) with +/- buttons.
  - A 50ms interval calls `scrollContainerRef.current.scrollBy({ top: scrollSpeed, behavior: 'smooth' })`; see the `useEffect` watching `[isScrolling, scrollSpeed]`.
  - Reset uses `scrollTo({ top: 0, behavior: 'smooth' })`.
- Editor collapse/expand:
  - `isCollapsed` toggles left panel width classes (`w-0 overflow-hidden` vs `w-1/2`) and makes preview `w-full` when collapsed.
- Font controls:
  - `fontFamily` select and `fontSize` +/- (12–48) are applied inline to the preview `.prose` container.
- Markdown styles:
  - See `src/index.css` for `.prose` rules (headings, lists, strong/em).

## Files and configs
- `src/App.tsx` — core UI/logic; add features here.
- `src/index.css` — Tailwind plus Markdown typography.
- `vite.config.ts` — Vite + React; note `optimizeDeps.exclude = ['lucide-react']`.
- `tailwind.config.js`, `eslint.config.js` — styling and linting.

## Developer workflows
- Dev server: `npm run dev`
- Build: `npm run build`  •  Preview: `npm run preview`
- Lint: `npm run lint`
- No tests present.

## Integration points
- `marked` for Markdown → HTML; `lucide-react` for icons. `@supabase/supabase-js` is installed but unused.
- No backend, no auth, no persistence.

## Extending safely
- Keep new UI controls in `App.tsx` header and wire to local state.
- If sourcing Markdown externally, add sanitization before `dangerouslySetInnerHTML`.

For anything unclear, treat `App.tsx` and `src/index.css` as the source of truth.
