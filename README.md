# Advertiser Experience — shareable deck

Live URL: **https://ses2905.github.io/adx-strategy-charter/**

This GitHub Pages site hosts the working HTML Advertiser Experience strategy deck (cover slide first; arrow keys or space to advance).

It is not a live preview of every local save. The site updates only when an aligned version is copied into `docs/` and pushed.

## What’s on the site

`docs/` is the Pages root. It is copied from the **working** deck:

`previews/editorial-blue-kit-v1/` (local: http://127.0.0.1:8795/)

Included:

- `index.html`
- `css/` (tokens, presentation-system, layout-system, components, archetypes, deck-families, debug)
- `theme/optional-editorial-blue.css`
- `layout-system.js`, `js/`
- `review.css` / `review.js`
- `fonts/` and `logos/`
- GSAP from the same jsDelivr pin the working deck uses

## Republish after the next aligned version

From a clone of this repo, after the working deck is aligned:

```bash
./scripts/publish-deck.sh
```

That copies from `editorial-blue-kit-v1` by default, commits with a dated message, and pushes `main`. GitHub Actions then deploys `docs/` to Pages.

Dry run (no commit):

```bash
./scripts/publish-deck.sh --dry-run
```

Pass a specific folder (must contain `index.html`):

```bash
./scripts/publish-deck.sh "/path/to/previews/editorial-blue-kit-v1"
```

Revert to the frozen original (backup only — do not edit that folder):

```bash
./scripts/publish-deck.sh --revert-archive
```

Default source:

`~/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue-kit-v1`

Override with `DECK_SRC=/path ./scripts/publish-deck.sh`.

Do not publish until the version is aligned. Do not point the script at `layout-test/` or `presentation-starter-kit/`.

## Frozen archive (revert backup)

`previews/editorial-blue/` (local: http://127.0.0.1:8793/) is the frozen original. Do not modify it. Do not use it as the default publish source. It exists so a bad publish can be compared or reverted.

## Working files in this repo

Older Claude Design / `.dc.html` working files remain in the repo for history. They are **not** what Pages serves. The shareable artifact is `docs/index.html`.
