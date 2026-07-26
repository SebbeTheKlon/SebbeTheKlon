# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Effektverkstan** ("The Effect Workshop") — a static, dependency-free showcase of ~100 interactive web effects (backgrounds, cursors, 3D, scroll, text, forms, navigation, feedback, media, lists, typography, modern CSS, states, plus an experimental "Labbet") organized as one HTML page per category, a searchable gallery (`alla.html`), and a live page builder (`bygg.html`).

There is no framework, no build step, and no package manager — every page is plain HTML with an inline `<style>`/`<script>` for its own demos, plus shared files in `css/` and `js/`. Keep it that way; don't introduce a bundler, npm dependency, or framework without a strong reason.

## Commands

There is no build, lint, or test tooling (no `package.json`). To work on this repo:

- **Preview**: open any `.html` file directly in a browser, or serve the root with any static file server (e.g. `python3 -m http.server`). GitHub Pages serves the repo as-is.
- **Verify JS after editing**: `node --check js/<file>.js` for each touched script, and for inline `<script>` blocks extract and run through `node -e` (wrap in a function and call it) — there is no automated test suite, so this syntax check plus manually reasoning through the DOM APIs used is the standard way changes get verified in this repo.
- **Verify CSS after editing**: a quick brace-balance check is enough to catch structural mistakes, e.g. `node -e 'var c=require("fs").readFileSync("css/style.css","utf8"); console.log((c.match(/\{/g)||[]).length, (c.match(/\}/g)||[]).length)'`.
- **No screenshots/browser automation available in this environment** — reason about the DOM/CSS carefully instead of relying on visual verification.

## Git workflow (read this before finishing any change)

- After a coding session (changes committed and pushed to the working branch): automatically open a pull request against `main` and merge it immediately, without asking for confirmation first. Use clear titles/descriptions in Swedish, matching the style of prior PRs in the repo.
- If an open PR already exists for the same branch, update/merge that one instead of opening a new one.
- Skip auto-merging only if the user explicitly asks not to merge yet, or a merge conflict comes up that needs a decision — ask before proceeding in that case.
- The working branch for this repo is a `claude/...` branch; PRs go from there to `main`.

## Architecture

### Shared design system (`css/style.css`, `js/theme.js`)
All visual theming is CSS custom properties on `:root` (`--bg`, `--card`, `--border`, `--text`, `--muted`, `--violet`, `--cyan`, `--pink`, `--grad`, `--radius`, `--font`, `--mono`, …), switched by `data-*` attributes on `<html>`: `data-theme` (light/dark), `data-accent` (color palette), `data-font`, `data-radius`, `data-border`, `data-bg`/`data-cursor` (site-wide effects, see below), `data-textsize`/`data-motion`/`data-contrast` (accessibility). `js/theme.js` reads/writes these from `localStorage` and applies them **synchronously at parse time** (before `DOMContentLoaded`) so there's no flash of unstyled content — any new global toggle should follow this same pattern rather than waiting for `DOMContentLoaded`.

### Script loading order (important — most bugs here are ordering bugs)
Every page loads `js/theme.js` in `<head>` and `js/main.js` near the end of `<body>` (a plain, blocking `<script>` tag, so it runs before `DOMContentLoaded`). `main.js` assigns each `.demo` section an id (`fx-01`, `fx-02`, …, derived from its `.nr` span), wires up scroll-reveal, handles `?solo=` mode, and creates the (empty) hamburger button — but does **not** populate the nav drawer itself.

On `DOMContentLoaded`, `theme.js` injects, in this exact order, with `async = false` so execution order is preserved: `js/fx.js` → `js/registry.js` → `js/navdrawer.js` → `js/pager.js` → `js/favs.js`. `registry.js` must load before the last three because they all read its globals (`window.FX_CATS`, `window.FX_REGISTRY`, `window.FX_NAV_GROUPS`). `alla.html` loads `registry.js` itself earlier (it needs it immediately to render the gallery grid); `theme.js` detects this and skips re-injecting it. None of this injected bundle runs inside `?solo=` iframes (see below).

### Registry (`js/registry.js`)
Single source of truth for every demo and category: `FX_CATS` (per-category label/icon/gradient), `FX_REGISTRY` (flat list of every demo — page, number, title, icon), `FX_NAV_GROUPS` (how categories are clustered in the nav drawer). The gallery, the favorites drawer, and the prev/next pager all read from this instead of scraping the DOM — **adding, removing, or renaming a demo requires updating `FX_REGISTRY` here**, not just the HTML.

### Demo authoring convention (category pages: `bakgrund.html`, `mus.html`, `3d.html`, …)
Each demo is a `<section class="demo">` containing a `.demo-head` (with an `<h2><span class="nr">NN</span>Title</h2>`) and a `.demo-stage`. The two-digit `.nr` is load-bearing: `main.js` uses it to build the section's id, and `js/code-view.js` extracts that demo's CSS/JS for the "Visa koden" button by matching a comment marker of the exact form `/* --- NN ... */` in the page's inline `<style>`/`<script>` blocks. When adding a demo, keep the `.nr`, the markup, and the `/* --- NN */` comment markers in sync, and add an entry to `FX_REGISTRY`.

### Solo mode / lightbox (`alla.html` + `main.js`)
`alla.html` renders every demo as a small card; clicking one opens `<page>.html?solo=fx-NN` inside an `<iframe>` rather than duplicating any demo markup. `main.js` detects `?solo=`, adds `.solo-mode` to `<html>`, and shows only the matching `.demo` (CSS hides header/footer/panels/FABs — see the `.solo-mode` rules in `style.css`). This is why every new global UI piece (drawers, FABs, etc.) needs a corresponding `.solo-mode .your-thing { display: none }` rule.

### Site-wide effects (`js/fx.js`)
Distinct from the per-page demo canvases: this renders an optional full-page background (aurora/particles/dot-grid/starfield) and custom cursor, driven by `data-bg`/`data-cursor` on `<html>` (set via the theme panel). Rebuilds itself whenever `theme.js` dispatches an `fx-change` event, so it always matches the current accent color.

### Nav drawer (`js/navdrawer.js`) and pager (`js/pager.js`)
The old horizontal nav link list is hidden via CSS (`.site-head nav { display: none }`) and kept only as a no-JS fallback. Real navigation is a left-side drawer built from `FX_CATS`/`FX_NAV_GROUPS`, opened by the hamburger button `main.js` creates. It supports a "pin" (📌) that persists in `localStorage` (`fx-nav-pinned`) and pushes page content via `html.nav-push body { padding-left }`; `theme.js` applies that push class synchronously on load (same flash-avoidance pattern as the theme system) before `navdrawer.js` itself has run. `pager.js` builds the prev/next footer buttons on every category page purely from `Object.keys(FX_CATS)` order — no per-page config needed.

### Favorites (`js/favs.js` + `data/favoriter.json`)
Favorites live in `localStorage` per-browser by default (no login — this is intentionally a single-user static site, and a write-capable GitHub token can't be safely embedded in public client-side JS). `data/favoriter.json` is a manually-synced snapshot: the favorites drawer has Export/Copy (get the JSON out) and a "Ladda från GitHub" button (`fetch`es this file and merges it in). Updating that file means committing a new copy of it — there's no live write path from the browser to GitHub, by design.

### Page builder (`bygg.html`)
Self-contained and independent from the registry/demo system above. It has its own small HTML/CSS/JS generator function (`buildDoc`) that assembles a standalone page from the sidebar's choices and renders it into an `<iframe srcdoc>` for live preview; the same function is used for the "show code" view and the downloadable export, so preview and export can never drift apart.
