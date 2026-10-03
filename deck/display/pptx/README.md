# PowerPoint export

`../Advertiser-Experience-Strategy.pptx` is generated from the rendered HTML deck, so the two stay identical. Every text box, rule and shape sits where the browser draws it, the line breaks copy the browser's, and speaker notes and footnotes go into the PowerPoint notes. All of it stays editable.

```bash
python3 deck/display/build.py                         # regenerate docs/advertiser-experience.html
(cd docs && python3 -m http.server 8811 &)            # serve it
node deck/display/pptx/extract.js                     # -> pptx/layout.json (Playwright, 1920x1080, reduced motion)
node deck/display/pptx/build.js                       # -> ../Advertiser-Experience-Strategy.pptx (needs pptxgenjs + sharp)
```

Scale: 1920px maps to 13.333in (LAYOUT_WIDE), so 1px is 1/144in and 0.5pt.

**Fonts.** The deck names the desktop Everyday Sans families:
- Everyday Sans Headline Light
- Everyday Sans Light (italic)
- Everyday Sans UI
- Everyday Sans UI Medium
- Everyday Sans Mono

If a machine doesn't have them, PowerPoint substitutes another font and the layout drifts. To change the names, edit the `FONT` map in `build.js`.

## Walmart Connect version

Same slides, built to the **Walmart Connect Guidelines v1.0 (May 2025)**. Page numbers below are that PDF's.

| Rule | What the deck does |
|---|---|
| Backgrounds are White or Bentonville Blue only (p28) | light slides go from gray-50 to white |
| Small text on white is Bentonville Blue only (p27) | True Blue labels and small accents become navy |
| Purple is the most-used secondary colour and passes for large text (p21, p26) | accent words and display-size accents become Connect Purple on white |
| Gradient is Purple → Everyday Blue → Teal, 40/40/20 (p24), for oversized type and the Connect Line only (p36) | navy-slide accent words, the chain/loop connectors, statement rules, and one gradient-border card (the measurement layer, p35) |
| No gradient on small text, data points or backgrounds; no partial-opacity colours (p29, p37) | stat numerals are solid purple; tinted panels are removed |
| No italics or tracked-out headlines (p39, p42) | italics are set upright |
| Spark (Everyday Blue) and wordmark are never locked up: Spark top right, wordmark bottom left (p56–59) | presentation chrome per p71: team label top left, Spark top right, "Private and confidential" bottom left, page number bottom right, two-tone wordmark on the cover |

```bash
python3 deck/display/build.py connect                 # docs/advertiser-experience-connect.html
node deck/display/pptx/extract.js http://127.0.0.1:8811/advertiser-experience-connect.html layout-connect.json
node deck/display/pptx/build.js layout-connect.json Advertiser-Experience-Strategy-Walmart-Connect.pptx
```

`connect.js` tags what the kit paints True Blue on white slides, and `connect.css` re-colours the tags. Gradients are painted over the sentinel solid `#993EF6`, which `build.js` swaps for a native `<a:gradFill>`. LibreOffice renders those gradients as flat Everyday Blue; PowerPoint renders the gradient itself.
