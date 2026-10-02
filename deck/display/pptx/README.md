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
