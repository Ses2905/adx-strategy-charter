# Advertiser Experience — shareable deck

Live URL: **https://ses2905.github.io/adx-strategy-charter/**

This GitHub Pages site hosts the aligned HTML Advertiser Experience strategy deck (cover slide first; arrow keys or space to advance).

It is not a live preview of every local save. The site updates only when a frozen/aligned version is copied into `docs/` and pushed.

## What’s on the site

`docs/` is the Pages root. It contains the frozen live deck:

- `index.html`
- `layout-system.css` / `layout-system.js` (header-width B)
- `review.css` / `review.js`
- `fonts/` and `logos/`
- GSAP from the same jsDelivr pin the frozen deck uses

Experimental copies stay off this URL: `layout-test/`, starter-kit, and kit-v1 compare.

## Republish after the next aligned version

From a clone of this repo, after the deck is frozen:

```bash
./scripts/publish-deck.sh
```

Or pass an export pack (the folder that contains `index.html`):

```bash
./scripts/publish-deck.sh "/path/to/previews/editorial-blue/exports/YYYY-MM-DD-HHMM/advertiser-experience-strategy-header-width-live"
```

The script copies only the shareable deck files into `docs/`, commits with a dated message, and pushes `main`. GitHub Actions then deploys `docs/` to Pages.

Dry run (no commit):

```bash
./scripts/publish-deck.sh --dry-run
```

Default source on this machine is the frozen live folder:

`~/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue`

Override with `DECK_SRC=/path ./scripts/publish-deck.sh`.

Do not publish until that version is aligned. Do not point the script at kit-v1 or layout-test.

## Working files in this repo

Older Claude Design / `.dc.html` working files remain in the repo for history. They are **not** what Pages serves. The shareable artifact is `docs/index.html`.
