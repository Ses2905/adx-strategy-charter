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

Same slides, Walmart Connect accents and gradient (brand guidelines, Walmart Connect page):
purple `#993EF4` → teal `#00D0CD` on rules, fills and navy-slide type; purple → True Blue on
light-slide type, because teal fails text contrast on a light ground. The signature colour bar
runs across the top of every slide, and the Walmart Connect wordmark sits beside the Spark.

```bash
python3 deck/display/build.py connect                 # docs/advertiser-experience-connect.html
node deck/display/pptx/extract.js http://127.0.0.1:8811/advertiser-experience-connect.html layout-connect.json
node deck/display/pptx/build.js layout-connect.json Advertiser-Experience-Strategy-Walmart-Connect.pptx
```

`connect.js` tags whatever the kit paints True Blue (rules, thin fills, display-size type) and
`connect.css` styles the tags. The CSS paints sentinel solids (`#993EF5/6/7`) under each
gradient, and `build.js` swaps those for native `<a:gradFill>` in the slide XML. If a sentinel
ever shows up as flat purple in PowerPoint, the swap missed it. LibreOffice renders gradient
text as a near-solid purple; PowerPoint renders the gradient itself.
