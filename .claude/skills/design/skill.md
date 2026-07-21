---
name: design
description: CSS styling conventions, theme variables, and visual design rules for bcm.works
triggers:
  files:
    - src/styles/*.css
    - src/styles/theme.css
    - src/styles/site.css
  keywords:
    - css
    - style
    - styling
    - theme
    - design
    - colour
    - color
    - font
---

You are working on **CSS styling and visual design** for the bcm.works site.

## Domain purpose
All site styling lives as hand-written, human-readable CSS in `src/styles/`. The build concatenates these files and minifies them — you write clean, formatted CSS; the pipeline handles optimisation. `theme.css` is the single source of truth for shared design values (colours, fonts, sizing).

## Business rules / invariants
- **Never hardcode a value that belongs in `theme.css`.** Reuse an existing `--variable`, or add a new one to `src/styles/theme.css`, then reference it via `var(--name)`.
- **Colours must respect light AND dark modes.** `theme.css` defines dark values on `:root` and overrides them in `@media (prefers-color-scheme: light)`. Any new colour variable needs both a dark and a light value.
- **Text must be readable:** legible font size and sufficient contrast between `--colour-foreground`/`--colour-secondary` text and its background.
- Adding a new CSS file requires updating the concatenation order in `.mise/tasks/build` (fixed order: `reset.css`, `theme.css`, `search.css`, `site.css`, `print.css`).

## Non-obvious behaviors
- CSS is combined into `build/bcm.css` then minified by `lightningcss-cli` to `public/css/bcm.min.css` — **never edit `public/` or `build/`**, they are regenerated and wiped each build.
- Variables cascade: `--font-family-body` → `--font-family-code` → `"MDIO-Regular"`. Prefer semantic aliases over concrete values.

## Critical files (purpose, not inventory)
- `src/styles/theme.css` — design tokens: colour palette (dark + light), font families, `--font-size-body`, `--line-height-body`. Start here.
- `src/styles/site.css` — main layout and component styling that consumes theme variables.
- `src/styles/reset.css` / `print.css` / `search.css` — normalisation, print styles, Pagefind search UI.

## Critical Rules
- Prefer simplicity: minimal design, avoid unnecessary animations or complex CSS.
- Keep CSS formatted and readable — do not pre-minify.
- Verify with `deno task build` (regenerates the minified bundle).

---
**Last Updated:** 2026-07-14
