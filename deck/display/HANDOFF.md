# Handoff: Advertiser Experience Strategy Deck (Display as Proof Point)

**For:** an AI agent rebuilding this deck exactly: same narrative, copy, layout and visual system.
**Reference build:** `docs/display.html` in `Ses2905/adx-strategy-charter`, PR #38, branch `claude/display-advertiser-experience-deck-w8n770`. The file name is historical; the deck is not a Display deck.
**Source of truth:** `deck/display/slides.html` (copy and markup, reproduced verbatim in Appendix B), `deck/display/display.css` (Appendix A), `deck/display/build.py` (assembly). Where this document and the source files disagree, the source files win.

---

## 1. What You Are Building

A 17-slide HTML presentation (1920×1080 stage, scaled to fit the viewport), plus an editable PowerPoint generated from it.

**It is an Advertiser Experience strategy across Walmart Ads. It is not a Display strategy.** Display is a proof point, used because Sales has raised real performance concerns and the evidence supports investigating them. The argument:

> We are improving the advertiser experience end to end, using data to identify where friction exists, designing shared capabilities around advertiser jobs rather than channel silos, and measuring whether those changes improve advertiser outcomes. Display is one of the first places we are applying that rigor, but the strategy extends across every advertising experience.

**Guardrails the copy must hold. Every one is load-bearing with a Sales audience:**
- Never present correlation as causation (slide 03 says so on the slide).
- Never claim Advertiser Experience alone will solve media performance. Slide 06 separates shopper ad experience, advertiser setup and delivery systems, and only one of them is primarily an experience problem.
- Goal-Based Buying and recommendations are hypotheses under test, not predetermined solutions (slides 10 and 11).
- Don't assume one root cause for Display (slides 05 and 06).
- Roadmap initiatives are one system, not disconnected launches (slide 16).

**Narrative spine and navigator sections** (`SECTIONS` in `build.py`, 0-indexed `start`/`end`):

| Section | Navigator label | Slides |
|---|---|---|
| 01 | What we are hearing | 01–03 |
| 02 | How we diagnose | 04 |
| 03 | Display as a proof point | 05–07 |
| 04 | What we are building | 08–15 |
| 05 | One system | 16–17 |

---

## 2. Two Ways to Build It

### Path A: You Have the Repo (Preferred)
1. Edit `deck/display/slides.html` (copy and markup) and `deck/display/display.css` (deck-local styles).
2. Run `python3 deck/display/build.py`. It reads `docs/index.html` (the published AE deck), keeps its whole `<head>`, CSS, fonts, chrome and runtime, then:
   - replaces every `<section class="slide">` with `slides.html`
   - rewrites `SECTIONS` (table above)
   - sets the `<title>` and footer meta to `Advertiser Experience Strategy · draft`
   - removes the `editor*.js` script tags (not shipped in `docs/`)
   - injects `display.css` as a `<style>` block before `</head>`
3. The output is `docs/display.html`. Never hand-edit it.
4. **PowerPoint:** serve `docs/` on port 8811, then run `node deck/display/pptx/extract.js && node deck/display/pptx/build.js`. The output is `deck/display/Advertiser-Experience-Strategy.pptx`. See `deck/display/pptx/README.md`.

### Path B: No Repo Access
Rebuild the shell from §3 and §4. Paste Appendix B as the slides and Appendix A as the deck-local CSS.

---

## 3. Visual System (Editorial Blue Kit)

### Canvas and Grid
| | |
|---|---|
| Stage | 1920×1080, `transform: scale()` to fit the viewport, letterboxed on `#070B14` |
| Side rails | 80px left and right (content spans x=80→1840) |
| Header top | `--head-inset: 148px` |
| Footer safe | 72px; the pager sits at `bottom: 48px` |
| Content max width | 1520–1760px |
| Spacing scale | 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80. Use these values and nothing else. |
| Slide layout | CSS grid rows `head-inset / header / 1fr content / foot-safe`. Content blocks centre vertically in the space left below the header. |

### Colour
| Token | Value | Use |
|---|---|---|
| `--navy` / `--ink` | `#001E60` | Text; cover and close backgrounds |
| `--true` | `#0053E2` | The emphasis colour: key rules, numerals, mono labels, the highlighted word |
| `--everyday` | `#4DBDF5` | Highlighted word on navy only |
| `--sky` | `#A9DDF7` | Dark-ground accents |
| `--paper` | `#F5F6F8` | Light slide background |
| `--muted` | `#3D4A63` | Body and supporting copy |
| `--line` | `#E4E8EF` | Hairline rules |
| Eyebrow pill fill | `#D7EEF9` | |
| Tint | `rgba(0,83,226,0.05)` | Foundation bands (slides 08 and 11) |

### Type (Everyday Sans, Proprietary, Vendored in `docs/fonts/`)
| Role | Face | Spec |
|---|---|---|
| Title `h2` | Everyday Sans Headline Light (300) | 48px, `letter-spacing:-0.03em`, line-height 1.26, **sentence case** |
| Cover/close `h1` | Headline Light | 64px (72px on close) |
| Highlight word `em.mark` | Everyday Sans Light Italic | True Blue (Everyday Blue on navy). **Exactly one per title**, usually the last word. |
| Lede | Everyday Sans UI 400 | 18px, line-height 1.45, muted |
| Cover sub | UI italic | 22px |
| Eyebrow | Everyday Sans Mono | 10px, uppercase, `letter-spacing:.18em`, True Blue on a `#D7EEF9` pill, 23px above the title |
| Mono label (`.ord`, `.lab`) | Mono | 11–12px, uppercase, `.14em`, True Blue |
| Display numerals | Headline Light | True Blue, `-0.04em`, 44–128px |
| Card heading (display) | Headline Light | 24–40px, `-0.03em` |
| Card heading (UI) | UI Medium 500 | 16–22px |
| Body in components | UI 400 | 14–18px, line-height 1.35–1.45, muted |

### The Grammar: Follow It, Don't Improvise
- **Relationships, not cards.** There are no boxed cards with shadows. Structure comes from a 1px `--line` hairline on top of each item.
- **One True Blue rule marks what matters:** the active or important layer, the future state, the column tops on key rows. Everything else gets a gray hairline.
- **Statement line (`.dx-say`).** It closes a slide: a 1px True Blue top rule, a mono label in a 220px left rail, and the statement at 28px Headline Light. There's no fill. Weight comes from type size and the rule.
- **Peer rows stay identical.** Siblings share the same rule, padding and type. Don't single out the last item of a sequence.
- **Chrome is recessive.** Axes and dividers are hairline gray, never navy.
- Dark (navy) slides: **only the opening slide.** There are no section-divider slides; the right-rail navigator carries the acts.
- **Text arrows** (`→`) are allowed inside a chain. Don't use decorative SVG arrows.

---

## 4. Runtime and Chrome (Reused From the Kit Unchanged)
- `<div class="stage" id="stage">` holds every `<section class="slide paper|navy …" data-label="…">`. Each slide has `.body > .slide-header` + `.slide-content > .slide-content-inner`, plus an `<aside class="notes">`.
- **Right-rail navigator (`#toc`):** one dot per section, built from `SECTIONS`, with a progress fill.
- **Pager:** Spark logo, meta text, key hints (J jump, N notes, G grid), prev/next buttons and a `NN / 15` counter.
- **Keys:** ←/→/Space/PageUp/PageDown, Home/End, J (jump), N (notes panel), G (grid overlay), M (measure overlay). The URL `?s=<0-index>` opens a given slide. `window.ADXShow(i)` navigates programmatically.
- **Entrance motion:** GSAP (`cdn.jsdelivr.net/npm/gsap@3.14.2`), `expo.out`, the eyebrow first, then the lede, then items staggered 50ms. Titles don't animate. Reduced motion, or a missing GSAP, shows the settled state.
- **Theme:** the stage takes `data-theme="navy"` on navy slides, which swaps the pager colours and the white Spark logo.
- **Footnotes:** `<span class="fn"><span class="fn-n" tabindex="0">1</span><span class="fn-src">…</span></span>`. Hover shows the source in a floating card. This deck has no Sources slide, so don't use `a.fn-app` links.

---

## 5. Component Inventory

| Slide | Component | Origin |
|---|---|---|
| 01 | `navy s-close`, pill + h1 + sub; `.dx-open` statement and paragraph; `.ask.dx-journey` 6-up | Kit archetype + variant |
| 02 | `.dx-five` five problems + `.dx-themes` source chips | New (chips reuse `.chip`) |
| 03 | `.dx-evid`: two scoped groups (4 behavior metrics, 2 perception metrics) + `.dx-say` | New |
| 04 | `.chain.dx-n5` + `.dx-say` | Kit `.chain`, 5-up |
| 05 | `.dx-split.is-even` (question list and chip set) + `.dx-caveat` + `.dx-say` | New |
| 06 | `.cols.dx-cols` three contributors (`.dx-q` question, `.dx-inv` label, `.dx-list`) + `.dx-say` | Kit `.cols` |
| 07 | `.dx-note` + `.stack.dx-model` (3 buckets over a measurement band) + `.dx-say` | Kit `.stack` |
| 08 | `.dx-tiers`: jobs → `.dx-found` capabilities → experiences, + `.dx-say` | New |
| 09 | `.paths-set` (today 5-up broken, future `.dx-n3`) + `.dx-why` 5-up + `.dx-say` | Kit `.paths` |
| 10 | `.dx-contrast` (gray before, True Blue after) + chips + `.dx-say` | New, the two-part contrast pattern |
| 11 | `.dx-gbb`: question + mini path on the left, evaluation list on the right, + `.dx-say` | New + kit `.paths` |
| 12 | `.dx-shift` (today cells, upstream note, future `.dx-found`) + `.dx-say` | New |
| 13 | `.dx-note` + `.paths.is-one` `.dx-n7` + `.dx-benefit` | Kit `.paths`, 7-up |
| 14 | `.dx-note` + `.loop.dx-n5` + `.dx-benefit.n3` + `.dx-say` | Kit `.loop`, 5-up |
| 15 | `.dx-contrast` with a `.dx-ab` A-vs-B grid + chips + `.dx-say` | New |
| 16 | `.tbl.dx-matrix` + `.dx-caveat` + `.dx-say` | Kit `.tbl` |
| 17 | `.loop.dx-n6` + `.dx-repeat` + `.dx-close` | Kit `.loop`, 6-up |

**Specificity trap.** The kit's `deck-families.css` sets grids as `.slide.s-ls .chain`, `.slide.s-ls .loop`, `.slide.s-ls .paths .flow`, `.slide.s-ls .cols` and `.slide.s-ls .stack`. Any variant that changes a column count **must** carry the same prefix. Without it, a 5-up chain silently wraps to 4.

**Statement vs note.** `.dx-say` (True Blue rule, 28px Headline Light) closes a slide with its claim. `.dx-note` (gray hairline, 18px muted) states what is true *today*. They share the 220px label rail so they line up when both appear.

---

## 6. Slide-by-Slide Spec

The eyebrow, title and navigator label for each slide are below, generated from the source so they can't drift. The `[word]` in brackets is the `em.mark`. **All body copy, ledes and speaker notes are verbatim in Appendix B.**

| # | Label | Eyebrow | Title |
|---|---|---|---|
| 01 | Opening | Advertiser Experience Strategy | Making Walmart Ads easier to buy, understand & [improve]. |
| 02 | What we hear | What we’re hearing | Advertisers are telling us the experience is [harder] than it should be. |
| 03 | Behavior | Behavior confirms the research | Advertiser friction isn’t just something they’re telling us. We can [see] it. |
| 04 | Diagnosis | From signals to action | We’re changing how experience problems get [diagnosed]. |
| 05 | Display proof point | Display as a proof point | Display shows why this approach [matters]. |
| 06 | Three contributors | Diagnosing Display | We’re testing three potential contributors to Display [performance]. |
| 07 | Measurement layer | Measurement is the connective tissue | We can’t improve what advertisers or product teams can’t [diagnose]. |
| 08 | Build once | Build the foundation once | The problems aren’t channel-specific. The solutions shouldn’t be [either]. |
| 09 | Setup | Starting earlier in the journey | Better outcomes start with making better setup [easier]. |
| 10 | Recommendations | Guidance, not noise | Recommendations only help when advertisers can [trust] them. |
| 11 | Goal-based buying | Simplifying campaign decisions | We’re testing whether intent can replace some of the [complexity]. |
| 12 | Consistency | Consistency across channels | Sponsored & Display shouldn’t feel like [different] companies built them. |
| 13 | Audiences | Better targeting starts with better audience experience | Audiences should be an asset advertisers understand & [reuse]. |
| 14 | Decision support | From reporting to decision support | Measurement should help advertisers decide what to do [next]. |
| 15 | Experiments | Close the learning loop | Campaign experiments turn performance questions into [evidence]. |
| 16 | Portfolio | One strategy, multiple interventions | Each initiative attacks a different part of the [same] experience problem. |
| 17 | Operating loop | The system we’re building | Listen. Diagnose. Simplify. Measure. [Learn]. |

Build notes that aren't obvious from the markup:
- **01** is a navy `s-close`, not `s-cover`. `s-cover` hides slide content, and this slide carries a statement, a paragraph and the six-step journey.
- **03 keeps two scopes apart on purpose.** The four behavior metrics are Onsite Display ad group setup; the two perception metrics are the Walmart Ads relationship survey. Each group has its own label and footnote. Don't merge them into one row of six equal stats.
- **07's measurement is a band under the three buckets, not a fourth column.** That shape is the argument: measurement is the diagnostic layer, not a root cause.
- **16's dots are intent, not impact.** The caveat under the table has to stay.
- **Footnotes:** slide 03 carries two. In the PowerPoint export they are appended to the speaker notes, because the hover card doesn't exist there.

---

## 7. Copy Rules
- Titles are sentence case and assert a takeaway. Someone reading only the titles should get the argument.
- Titles keep "&" where the author wrote it ("Sponsored & Display…"). Body sentences use "and". Labels and chips use "+" ("Measurement + reporting").
- There's one `em.mark` per title, on the word that carries the claim.
- Be candid about what we don't know yet: "not yet sufficient", "a hypothesis to test", "may be one, may be all three". Don't sand it off. That candor is what makes the deck credible to Sales.
- **Never invent metrics, quotes or sources.** Placeholders stay visibly marked as needing confirmation.
- Avoid: unlock, leverage, seamless, robust, holistic, transformative.

---

## 8. Validation (Do All of These Before Calling It Done)
1. **Render every slide** at 1920×1080 with `reducedMotion: 'reduce'`, navigating with `window.ADXShow(i)`. Look at each screenshot.
2. **Rail check.** No leaf text may run past x<78, x>1842 or y>990. The kit's `.slide-content-inner` box reaching y=1008 is expected, so ignore it.
3. **Column counts.** 04 renders 5 across, 09's future path 3, 13's path 7, 14's loop 5, 17's loop 6, 06 three columns. If a row wraps, it's the specificity trap in §5.
4. **Fonts load.** Everyday Sans must actually load, or the fallback metrics will mislead every width check.
5. **PowerPoint:** run the OOXML validator, render through LibreOffice with the desktop-named fonts installed, and look at every slide. Converter bugs so far (all fixed): dropped `<br>`, re-wrapped titles, a bullet dot overlapping its text, and a label overlapping its sentence. Each one showed up only in a render.

---

## 9. Open Items to Carry Forward (Not Yours to Resolve)
- **Slide 03's behavior metrics** (46.2%, 135K+, 28K+, 13.7K+) have no date range or denominator yet. Footnote 1 says so.
- **Slide 03 mixes scopes:** Display setup behavior next to Walmart Ads-wide perception. The layout separates them, and the presenter must too.
- **Journey language isn't one set yet.** Slide 01 says Plan → Build → Launch → Understand → Optimize → Grow. Slide 08's jobs are Plan / Build / Target / Launch / Measure / Diagnose / Optimize. Slide 17's title names five steps while its loop has six (Enable is the one not in the title). Language is part of the product, so the author should pick one vocabulary.
- **Slide 16's matrix** gives Audience Library and Unified Measurement + Reporting all five dots. That reads as "does everything" unless the caveat is said out loud.
- **The deck has no explicit ask.** It closes on the operating philosophy, not a decision.
- **Publishing:** merging to `main` publishes `/display.html` via GitHub Pages. The fonts are proprietary Walmart typefaces.
- **PowerPoint fonts:** the file uses the desktop names Everyday Sans Headline Light / Light / UI / UI Medium / Mono. Confirm they match an installed PowerPoint's font menu.

---

## Appendix A · `display.css` (Verbatim)

```css
  /* Advertiser Experience Strategy (Display proof point) — deck-local components.
     Built only from the kit's tokens (--true, --line, --muted, --ink, --display,
     --mono, --paper) and its grammar: 1px hairlines, a True Blue rule for the thing
     that matters, mono labels, light display type. Grid variants that change a kit
     family's column count carry the kit's own .slide.s-ls prefix, or they lose. */
  .dx-five-wrap, .dx-evid-wrap, .dx-chain-wrap, .dx-split-wrap, .dx-cols-wrap,
  .dx-shift-wrap, .dx-meas-wrap, .dx-loop-wrap {
    display: flex; flex-direction: column; gap: 36px; width: 100%; max-width: 1760px;
  }
  .slide .ord { font-size: 11px; letter-spacing: 0.14em; }

  /* statement line — the kit's closing assertion, not a slab */
  .dx-say {
    display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: baseline;
    padding-top: 16px; border-top: 1px solid var(--true);
    font-family: var(--display); font-weight: 300; font-size: 28px;
    letter-spacing: -0.02em; line-height: 1.25; color: var(--ink);
  }
  /* context line — same rail, muted, hairline: what is true today */
  .dx-note {
    display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: baseline;
    padding-top: 14px; border-top: 1px solid var(--line);
    font-size: 18px; line-height: 1.45; color: var(--muted);
  }
  .dx-note .ord { color: var(--muted); }
  .dx-caveat { font-size: 15px; line-height: 1.4; color: var(--muted); font-style: italic; margin-top: 14px; }
  .dx-themes, .dx-chipset { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .dx-themes .lab, .dx-shift .lab, .dx-evid .lab {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--true);
  }
  .dx-themes .lab { margin-inline-end: 14px; }

  /* 01 · opening (navy) */
  .dx-open { display: flex; flex-direction: column; gap: 28px; width: 100%; max-width: 1520px; }
  .dx-open-t { font-family: var(--display); font-weight: 300; font-size: 44px; letter-spacing: -0.03em; line-height: 1.15; color: #fff; margin-top: 16px; }
  .dx-open-p { font-size: 20px; line-height: 1.45; color: rgba(255,255,255,0.88); max-width: 980px; }
  .ask.dx-journey { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 24px; margin-top: 12px; }
  .ask.dx-journey p { font-family: var(--display); font-weight: 300; font-size: 28px; letter-spacing: -0.02em; color: #fff; }

  /* 02 · five problems */
  .dx-five { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 32px; }
  .dx-five article { padding-top: 20px; border-top: 1px solid var(--true); }
  .dx-five h3 { font-family: var(--display); font-weight: 300; font-size: 40px; letter-spacing: -0.035em; line-height: 1.05; color: var(--true); margin-bottom: 14px; }
  .dx-five p { font-size: 17px; line-height: 1.4; color: var(--muted); }

  /* 03 · evidence, two scopes kept apart */
  .dx-evid { display: grid; grid-template-columns: 2fr 1fr; gap: 64px; }
  .dx-evid .lab { display: block; margin-bottom: 14px; }
  .dx-evid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 32px; }
  .dx-evid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 32px; }
  .dx-m { padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-m .n { font-family: var(--display); font-weight: 300; color: var(--true); letter-spacing: -0.04em; line-height: 0.95; font-size: 64px; }
  .dx-m h3 { font-size: 17px; font-weight: 500; margin: 12px 0 4px; }
  .dx-m p { font-size: 15px; line-height: 1.35; color: var(--muted); }

  /* 04 · diagnosis chain, 5-up */
  .slide.s-ls .chain.dx-n5 { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 32px; }
  .slide.s-ls .chain.dx-n5 .ord { display: block; margin-bottom: 10px; }
  .slide.s-ls .chain.dx-n5 h3 { font-family: var(--display); font-weight: 300; font-size: 28px; letter-spacing: -0.03em; line-height: 1.2; }

  /* 05 · split: two even columns */
  .dx-split { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
  .dx-split > div { padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-split .ord { display: block; margin-bottom: 14px; }
  .dx-split ul { list-style: none; }
  .dx-split li { font-size: 19px; line-height: 1.35; padding: 10px 0; border-top: 1px solid var(--line); }
  .dx-split li:first-child { border-top: 0; padding-top: 0; }
  .dx-chipset .chip { font-size: 13px; }

  /* 06 · three contributors */
  .slide.s-ls .cols.dx-cols > div { grid-template-rows: none; display: block; padding-top: 16px; border-top: 1px solid var(--true); }
  .slide.s-ls .cols.dx-cols .ord { display: block; margin-bottom: 6px; }
  .slide.s-ls .cols.dx-cols h3 { font-size: 30px; margin-bottom: 12px; }
  .dx-q { font-family: var(--display); font-weight: 300; font-size: 22px; letter-spacing: -0.02em; line-height: 1.3; color: var(--true); margin-bottom: 18px; }
  .dx-inv { display: block; font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; padding-top: 12px; border-top: 1px solid var(--line); }
  .dx-list { font-size: 16px; line-height: 1.55; color: var(--muted); }

  /* 07 · measurement as a layer under all three */
  .slide.s-ls .stack.dx-model .exp.dx-n3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 40px; padding-bottom: 20px; }
  .slide.s-ls .stack.dx-model .exp div { padding-top: 14px; }
  .slide.s-ls .stack.dx-model .exp .ord { display: block; margin-bottom: 6px; color: var(--muted); }
  .slide.s-ls .stack.dx-model .exp h3 { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.03em; }
  .slide.s-ls .stack.dx-model .found { border-top-width: 2px; padding: 20px 24px; background: rgba(0,83,226,0.05); }
  .slide.s-ls .stack.dx-model .found h3 { color: var(--true); margin-bottom: 10px; }
  .dx-flow { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: baseline; }
  .dx-flow b { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.02em; color: var(--ink); }
  .dx-flow i { font-style: normal; color: var(--true); font-size: 20px; }

  /* 08 · jobs → capabilities → experiences */
  .dx-tiers { display: flex; flex-direction: column; gap: 20px; }
  .dx-tier { display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: start; }
  .dx-tier > .ord { padding-top: 14px; }
  .dx-found { display: flex; flex-wrap: wrap; gap: 8px; padding: 18px; border-top: 2px solid var(--true); background: rgba(0,83,226,0.05); }
  .dx-found span { font-size: 16px; font-weight: 500; color: var(--true); padding: 8px 12px; border: 1px solid rgba(0,83,226,0.35); background: #fff; }
  .dx-serves { display: flex; gap: 8px; }
  .dx-serves span { flex: 1; font-size: 17px; font-weight: 500; padding-top: 12px; border-top: 1px solid var(--line); }
  .dx-tier .dx-serves.n7 span { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.02em; border-top-color: var(--true); }

  /* 09 · paths variants */
  .dx-paths { display: flex; flex-direction: column; gap: 32px; }
  .dx-paths .paths + .paths { margin-top: 0; }
  .slide.s-ls .paths .flow.dx-n3 { grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 60%; }
  .slide.s-ls .paths .flow.dx-n7 { grid-template-columns: repeat(7, minmax(0, 1fr)); }
  .dx-paths .paths.is-one .stop h3 { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.03em; color: var(--true); }
  .dx-paths .paths.is-broken .stop h3 { color: var(--muted); font-weight: 400; }
  .dx-why { display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: start; }
  .dx-why .ord { padding-top: 12px; }
  .dx-why ul { list-style: none; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 24px; }
  .dx-why li { font-size: 16px; line-height: 1.4; padding-top: 12px; border-top: 1px solid var(--line); }

  /* 10 · 15 · two-part contrast: gray before, True Blue after */
  .dx-contrast { display: grid; grid-template-columns: 1fr 1.4fr; gap: 64px; }
  .dx-contrast > div { padding-top: 16px; }
  .dx-contrast .is-was { border-top: 2px solid #C3C6CD; }
  .dx-contrast .is-now { border-top: 2px solid var(--true); }
  .dx-contrast .ord { display: block; margin-bottom: 12px; }
  .dx-contrast .is-was .ord { color: var(--muted); }
  .dx-contrast p { font-family: var(--display); font-weight: 300; font-size: 30px; letter-spacing: -0.02em; line-height: 1.25; }
  .dx-contrast .is-was p { color: var(--muted); }
  .dx-contrast .is-now p { color: var(--ink); }
  .dx-contrast .dx-quote { font-family: var(--italic); font-style: italic; font-size: 36px; }
  .dx-ab { display: grid; grid-template-columns: auto auto auto; justify-content: start; gap: 10px 24px; align-items: baseline; }
  .dx-ab span { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.02em; color: var(--true); }
  .dx-ab i { font-style: normal; font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }

  /* 11 · goal-based buying */
  .dx-gbb { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; }
  .dx-gbb > div { padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-gbb .ord { display: block; margin-bottom: 12px; }
  .dx-bigq { font-family: var(--display); font-weight: 300; font-size: 34px; letter-spacing: -0.03em; line-height: 1.22; margin-bottom: 36px; }
  .dx-mini .stop h3 { font-family: var(--display); font-weight: 300; font-size: 24px; color: var(--true); }
  .dx-evallist { list-style: none; }
  .dx-evallist li { font-size: 19px; line-height: 1.35; padding: 11px 0; border-top: 1px solid var(--line); }
  .dx-evallist li:first-child { border-top: 0; padding-top: 0; }

  /* 12 · consistency */
  .dx-shift { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .dx-shift .lab { margin-bottom: 14px; }
  .dx-today { display: flex; flex-direction: column; gap: 8px; }
  .dx-row { display: grid; grid-template-columns: 120px repeat(3, 1fr); gap: 8px; align-items: center; }
  .dx-row b { font-size: 16px; font-weight: 500; }
  .dx-row span { font-size: 14px; color: var(--muted); padding: 10px; border: 1px solid var(--line); background: #fff; text-align: center; }
  .dx-upstream { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 17px; line-height: 1.4; color: var(--ink); }
  .dx-upstream span { display: block; font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--true); margin-bottom: 6px; }

  /* 13 · 14 · benefit pair / trio */
  .dx-benefit { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
  .dx-benefit.n3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; }
  .dx-benefit > div { padding-top: 14px; border-top: 1px solid var(--line); }
  .dx-benefit .ord { display: block; margin-bottom: 8px; }
  .dx-benefit p { font-size: 18px; line-height: 1.45; }

  /* 14 · 17 · loops */
  .slide.s-ls .loop.dx-n5 { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 32px; }
  .slide.s-ls .loop.dx-n6 { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0 28px; }
  .slide.s-ls .loop.dx-n5 h3, .slide.s-ls .loop.dx-n6 h3 { font-size: 26px; line-height: 1.2; }
  .slide.s-ls .loop .ord { font-size: 12px; }
  .dx-repeat { margin-top: 14px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--true); }
  .dx-close {
    padding-top: 20px; border-top: 1px solid var(--true);
    font-family: var(--display); font-weight: 300; font-size: 40px; letter-spacing: -0.03em; line-height: 1.2; color: var(--ink); max-width: 1400px;
  }

  /* 16 · coverage matrix */
  .slide.s-ls .tbl.dx-matrix { width: 100%; font-size: 17px; }
  .slide.s-ls .tbl.dx-matrix th:not(:first-child), .slide.s-ls .tbl.dx-matrix td:not(:first-child) { text-align: center; width: 13%; }
  .slide.s-ls .tbl.dx-matrix td:not(:first-child) { color: var(--true); font-size: 18px; }
  .slide.s-ls .tbl.dx-matrix td, .slide.s-ls .tbl.dx-matrix th { padding-top: 10px; padding-bottom: 10px; }
```

## Appendix B · `slides.html` (Verbatim)

```html
  <section class="slide navy s-close active" data-label="Opening">
    <div class="body">
      <div class="slide-header">
<span class="pill eyebrow--feature">Advertiser Experience Strategy</span>
<h1>Making Walmart Ads easier to buy, understand &amp; <em class="mark">improve</em>.</h1>
<p class="sub">We’re connecting advertiser evidence, product experience and performance signals to systematically remove friction across the advertising journey.</p>
      </div>
      <div class="slide-content">
<div class="dx-open">
  <p class="dx-open-t">Less complexity. More clarity. Better decisions.</p>
  <p class="dx-open-p">Advertisers should not need to understand our organizational structure, platform architecture or channel history to successfully advertise with Walmart.</p>
  <div class="ask dx-journey" role="img" aria-label="Our job is to make it easier to plan, build, launch, understand, optimize and grow.">
    <div><div class="k">01</div><p>Plan</p></div>
    <div><div class="k">02</div><p>Build</p></div>
    <div><div class="k">03</div><p>Launch</p></div>
    <div><div class="k">04</div><p>Understand</p></div>
    <div><div class="k">05</div><p>Optimize</p></div>
    <div><div class="k">06</div><p>Grow</p></div>
  </div>
</div>
      </div>
    </div>
    <aside class="notes">Say it early: this is the Advertiser Experience strategy across Walmart Ads, not a Display strategy. Display shows up later as a proof point. Our job is to make the whole journey easier, from planning to growth.</aside>
  </section>

  <section class="slide paper s-ls" data-label="What we hear">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">What we’re hearing</span>
<h2>Advertisers are telling us the experience is <em class="mark">harder</em> than it should be.</h2>
<p class="lede">Across research, behavioral data, feedback and support interactions, the same experience problems continue to surface.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-five-wrap">
<div class="dx-five" role="img" aria-label="Five experience problems: complex, fragmented, inconsistent, unclear, time-consuming.">
  <article><h3>Complex</h3><p>Too many decisions and concepts require expertise to navigate.</p></article>
  <article><h3>Fragmented</h3><p>Advertiser jobs are distributed across workflows, products and destinations.</p></article>
  <article><h3>Inconsistent</h3><p>Similar tasks work differently depending on where advertisers are.</p></article>
  <article><h3>Unclear</h3><p>Advertisers struggle to understand what happened, why and what to do next.</p></article>
  <article><h3>Time-consuming</h3><p>Routine jobs require too many steps, clicks and workarounds.</p></article>
</div>
<div class="dx-themes"><span class="lab">Evidence sources</span><span class="chip">UXR</span><span class="chip">Pendo behavior</span><span class="chip">VOC</span><span class="chip">Support</span><span class="chip">Sales</span><span class="chip">Product analytics</span></div>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">These five come from recurring advertiser evidence, not internal product opinion. Name the sources. The rest of the deck keeps coming back to these five.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Behavior">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Behavior confirms the research</span>
<h2>Advertiser friction isn’t just something they’re telling us. We can <em class="mark">see</em> it.</h2>
<p class="lede">Behavioral signals reinforce what advertisers are telling us through research and feedback.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-evid-wrap">
<div class="dx-evid" role="img" aria-label="Behavior in Onsite Display ad group setup: 46.2% drop-off, 135K+ dead clicks, 28K+ U-turns, 13.7K+ rage clicks. Perception: about 60% detractors, and a 0.888 correlation between experience and perceived effectiveness.">
  <div class="dx-evid-g">
    <div class="lab">Behavior · Onsite Display ad group setup<span class="fn"><span class="fn-n" tabindex="0">1</span><span class="fn-src"><span>Pendo behavioral analytics, Onsite Display ad group setup. Date range and denominators to confirm before presenting.</span></span></span></div>
    <div class="dx-evid-4">
      <div class="dx-m"><div class="n">46.2%</div><h3>Drop-off</h3><p>From Ad Group Create / Edit to Set Up.</p></div>
      <div class="dx-m"><div class="n">135K+</div><h3>Dead clicks</h3><p>Clicks that do nothing.</p></div>
      <div class="dx-m"><div class="n">28K+</div><h3>U-turns</h3><p>Leaving a page and coming straight back.</p></div>
      <div class="dx-m"><div class="n">13.7K+</div><h3>Rage clicks</h3><p>Repeated clicks out of frustration.</p></div>
    </div>
  </div>
  <div class="dx-evid-g">
    <div class="lab">Perception · Relationship survey<span class="fn"><span class="fn-n" tabindex="0">2</span><span class="fn-src"><span>Pendo Feedback, 1,825 records, February 2025–August 2026; 1,350 scored relationship responses.</span></span></span></div>
    <div class="dx-evid-2">
      <div class="dx-m"><div class="n">~60%</div><h3>Detractors</h3><p>Across 1,350 scored relationship responses.</p></div>
      <div class="dx-m"><div class="n">0.888</div><h3>Correlation</h3><p>Between paired experience and perceived effectiveness ratings.</p></div>
    </div>
  </div>
</div>
<p class="dx-say"><span class="ord">Read it carefully</span><span>Correlation does not establish causation. It does tell us that advertisers experiencing more friction also tend to perceive Walmart Ads as less effective.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Two different scopes on one slide: the left group is Display setup behavior, the right is the relationship survey across Walmart Ads. Don’t blend them. Say the causation line out loud before anyone else does.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Diagnosis">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">From signals to action</span>
<h2>We’re changing how experience problems get <em class="mark">diagnosed</em>.</h2>
<p class="lede">Feedback tells us where to look. It should not predetermine the solution.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-chain-wrap">
<div class="chain dx-n5" role="img" aria-label="Signals, then experience problems, then root-cause diagnosis, then intervention, then outcome.">
  <article><span class="dot" aria-hidden="true"></span><span class="ord">01 · Signals</span><h3>UXR, Pendo, VOC, Support, Sales, Performance</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">02 · Experience problems</span><h3>What job is failing? Where? For whom?</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">03 · Root-cause diagnosis</span><h3>Experience? Capability? Performance system?</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">04 · Intervention</span><h3>Simplify, redesign, build or test</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">05 · Outcome</span><h3>Did behavior, performance or perception improve?</h3></article>
</div>
<p class="dx-say"><span class="ord">The shift</span><span>We’re moving from reacting to individual symptoms toward understanding the systems creating them.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">This is the operating philosophy behind the roadmap. Step three is the one we used to skip: we went from signal straight to solution. Every initiative later in the deck should trace back through this chain.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Display proof point">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Display as a proof point</span>
<h2>Display shows why this approach <em class="mark">matters</em>.</h2>
<p class="lede">Sales has raised meaningful concerns about Display performance. The available evidence suggests the concern is real, but does not yet point to a single root cause.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-split-wrap">
<div class="dx-split is-even">
  <div>
    <span class="ord">What Sales needs Product to help answer</span>
    <ul class="c1">
      <li>Who should use Display and for which objectives?</li>
      <li>What does a viable campaign setup look like?</li>
      <li>What investment, audience scale and configuration are required?</li>
      <li>When performance is weak, what is actually driving it?</li>
      <li>What can Sales or advertisers change?</li>
      <li>What requires Product or platform intervention?</li>
    </ul>
  </div>
  <div>
    <span class="ord">What investigation has surfaced so far</span>
    <div class="dx-chipset"><span class="chip">Budget</span><span class="chip">Audience size</span><span class="chip">Frequency</span><span class="chip">Conversion volume</span><span class="chip">Item-set setup</span><span class="chip">Campaign configuration</span><span class="chip">Manual Sales + Media Insights mitigations</span></div>
    <p class="dx-caveat">These signals are useful, but they are not yet sufficient to declare a single root cause.</p>
  </div>
</div>
<p class="dx-say"><span class="ord">Where we are</span><span>Today, we cannot answer all of those questions with enough confidence or transparency.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Validate the Sales concern without blaming anyone: not the advertiser, not the workflow, not the serving system. The left column is their list, in their words. The right is what we’ve found so far — useful, not conclusive.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Three contributors">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Diagnosing Display</span>
<h2>We’re testing three potential contributors to Display <em class="mark">performance</em>.</h2>
<p class="lede">Display performance is an outcome of an interconnected system. We need to isolate the variables before prescribing the solution.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-cols-wrap">
<div class="cols dx-cols dx-three">
  <div><span class="ord">01</span><h3>Ad experience &amp; media quality</h3>
    <p class="dx-q">Are we creating ad experiences shoppers actually see and engage with?</p>
    <span class="dx-inv">Investigate</span>
    <p class="dx-list">Placement and inventory quality · Viewability · Ad relevance · Creative experience · Frequency · Where ads appear across Walmart · Differences in performance by placement or environment</p>
  </div>
  <div><span class="ord">02</span><h3>Advertiser setup &amp; workflow</h3>
    <p class="dx-q">Are we making it too difficult to build a campaign positioned to succeed?</p>
    <span class="dx-inv">Investigate</span>
    <p class="dx-list">Audience selection · Targeting decisions · Budget configuration · Goals and objectives · Item selection · Creative setup · Workflow comprehension · Recommendations and guidance</p>
  </div>
  <div><span class="ord">03</span><h3>Delivery, decisioning &amp; optimization</h3>
    <p class="dx-q">Given a well-configured campaign and viable ad opportunity, is the system efficiently finding and serving the right impression?</p>
    <span class="dx-inv">Investigate</span>
    <p class="dx-list">Eligible inventory · Auction and serving logic · Audience match and available reach · Budget pacing · Bid and optimization logic · Creative eligibility · Frequency constraints · Delivery opportunities · Optimization toward the selected objective</p>
  </div>
</div>
<p class="dx-say"><span class="ord">Our job</span><span>The answer may be one. It may be all three. Our job is to isolate the variables rather than assume the cause.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Three buckets: what the shopper sees, what the advertiser builds, and what the system does with it. Only the middle one is primarily an experience problem, and we say so. The discipline is not picking a favorite before the evidence does.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Measurement layer">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Measurement is the connective tissue</span>
<h2>We can’t improve what advertisers or product teams can’t <em class="mark">diagnose</em>.</h2>
<p class="lede">Measurement connects ad experience, campaign setup and delivery signals so advertisers and internal teams can understand what is driving an outcome.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<p class="dx-note"><span class="ord">Today</span><span>Reporting is fragmented across experiences, metrics are not always presented consistently and finding the right answer often requires knowing where Walmart put it.</span></p>
<div class="stack dx-model dx-layer3" role="img" aria-label="Measurement and diagnostics is a layer that runs beneath and connects all three contributors, not a fourth contributor.">
  <div class="exp dx-n3">
    <div><span class="ord">01</span><h3>Ad experience &amp; media quality</h3></div>
    <div><span class="ord">02</span><h3>Advertiser setup &amp; workflow</h3></div>
    <div><span class="ord">03</span><h3>Delivery, decisioning &amp; optimization</h3></div>
  </div>
  <div class="found">
    <h3>Measurement + diagnostics connects all three</h3>
    <p class="dx-flow"><b>What happened?</b><i>→</i><b>Why?</b><i>→</i><b>What can I do?</b><i>→</i><b>Did it work?</b></p>
  </div>
</div>
<p class="dx-say"><span class="ord">Framing</span><span>Measurement is not a fourth root-cause bucket. It is the diagnostic layer that helps us understand the other three.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">This is the bridge back out of the Display example. Measurement sits under all three buckets — that is why it’s a band, not a fourth column. And it is one of the foundational cross-channel investments.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Build once">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Build the foundation once</span>
<h2>The problems aren’t channel-specific. The solutions shouldn’t be <em class="mark">either</em>.</h2>
<p class="lede">Where advertiser jobs are shared across channels, we should create common capabilities and interaction patterns rather than repeatedly rebuilding them.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-shift-wrap">
<div class="dx-tiers" role="img" aria-label="Seven shared advertiser jobs are served by eight shared experience capabilities, which power Sponsored, Display, Offsite and Marketplace.">
  <div class="dx-tier"><span class="ord">Advertiser jobs</span><div class="dx-serves n7"><span>Plan</span><span>Build</span><span>Target</span><span>Launch</span><span>Measure</span><span>Diagnose</span><span>Optimize</span></div></div>
  <div class="dx-tier"><span class="ord">Shared experience capabilities</span><div class="dx-found"><span>Campaign management</span><span>Audience Library</span><span>Measurement + reporting</span><span>Creative + assets</span><span>Recommendations</span><span>Experimentation</span><span>Forecasting</span><span>Notifications</span></div></div>
  <div class="dx-tier"><span class="ord">Advertising experiences</span><div class="dx-serves"><span>Sponsored</span><span>Display</span><span>Offsite</span><span>Marketplace</span></div></div>
</div>
<p class="dx-say"><span class="ord">The principle</span><span>Where advertiser jobs are common, the experience should feel common. Where the media genuinely differs, the product should adapt.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">This is where the deck returns decisively from Display to the broader strategy. Read it top to bottom: the jobs are the same, so the capabilities should be too. Channels adapt only where the media genuinely differs.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Setup">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Starting earlier in the journey</span>
<h2>Better outcomes start with making better setup <em class="mark">easier</em>.</h2>
<p class="lede">We’re reducing the expertise required to translate an advertiser’s intent into a viable campaign.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<div class="paths-set dx-paths" role="img" aria-label="Example, Seller Center native campaign creation. Today five steps across two platforms. Future: seller intent, native setup, launch.">
  <div class="paths is-broken">
    <div class="lab">Today · Example: Seller Center campaign creation</div>
    <div class="flow">
      <div class="stop"><h3>Seller Center</h3></div>
      <div class="stop"><h3>Leave the seller’s existing context</h3></div>
      <div class="stop"><h3>Enter Ad Center</h3></div>
      <div class="stop"><h3>Navigate an enterprise advertising workflow</h3></div>
      <div class="stop"><h3>Configure campaign</h3></div>
    </div>
  </div>
  <div class="paths is-one">
    <div class="lab">Future direction · Native campaign creation</div>
    <div class="flow dx-n3">
      <div class="stop"><h3>Seller intent</h3></div>
      <div class="stop"><h3>Native campaign setup</h3></div>
      <div class="stop"><h3>Launch</h3></div>
    </div>
  </div>
</div>
<div class="dx-why"><span class="ord">Why it matters</span><ul>
  <li>Removes unnecessary platform switching</li>
  <li>Keeps advertisers in a familiar environment</li>
  <li>Reduces setup complexity for less-experienced advertisers</li>
  <li>Creates an opportunity for contextual guidance at the moment of decision</li>
  <li>Reduces reliance on advertisers understanding our internal platform structure</li>
</ul></div>
<p class="dx-say"><span class="ord">The principle</span><span>This extends beyond Marketplace: don’t make advertisers learn our platform before they can successfully advertise.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">A concrete example of starting upstream, before campaign performance becomes the symptom. Seller Center is the example; the principle applies everywhere.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Recommendations">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Guidance, not noise</span>
<h2>Recommendations only help when advertisers can <em class="mark">trust</em> them.</h2>
<p class="lede">Guidance should reduce decision complexity. When relevance, context or expected value is unclear, it can create more complexity instead.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<div class="dx-contrast">
  <div class="is-was"><span class="ord">Historical assumption</span><p>More recommendations = more optimization opportunity.</p></div>
  <div class="is-now"><span class="ord">What we’re learning</span><p>A recommendation without sufficient relevance, context or credibility can make the advertiser’s decision harder rather than easier.</p></div>
</div>
<div class="dx-themes"><span class="lab">Adding more rigor around</span><span class="chip">Eligibility</span><span class="chip">Relevance</span><span class="chip">Expected value</span><span class="chip">Explanation</span><span class="chip">Timing</span><span class="chip">Conflicts</span><span class="chip">Suppression</span><span class="chip">Acceptance</span><span class="chip">Downstream outcome</span></div>
<p class="dx-say"><span class="ord">The goal</span><span>The goal isn’t recommendation volume. It’s better advertiser decisions.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Show that feedback and observed adoption changed our approach. We are not scaling the existing recommendation model — we’re adding the rigor that decides whether a recommendation should appear at all.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Goal-based buying">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Simplifying campaign decisions</span>
<h2>We’re testing whether intent can replace some of the <em class="mark">complexity</em>.</h2>
<p class="lede">Goal-Based Buying is one approach we’re testing to determine whether starting with advertiser intent can simplify setup and improve campaign configuration.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<div class="dx-gbb">
  <div>
    <span class="ord">Core question</span>
    <p class="dx-bigq">Can we start with what an advertiser is trying to accomplish and simplify the decisions required to get there?</p>
    <span class="ord">Approach</span>
    <div class="paths is-one dx-mini"><div class="flow n4">
      <div class="stop"><h3>Learn</h3></div><div class="stop"><h3>Validate</h3></div><div class="stop"><h3>Refine</h3></div><div class="stop"><h3>Scale</h3></div>
    </div></div>
  </div>
  <div>
    <span class="ord">We will evaluate</span>
    <ul class="dx-evallist">
      <li>Do advertisers understand the goals?</li>
      <li>Does setup become easier?</li>
      <li>Do campaigns launch with stronger configurations?</li>
      <li>Does performance improve?</li>
      <li>Do advertisers retain appropriate control?</li>
      <li>Do we see unintended behavior?</li>
    </ul>
  </div>
</div>
<p class="dx-say"><span class="ord">Status</span><span>Goal-Based Buying is a hypothesis to test, not a predetermined answer to every campaign setup problem.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">New approaches earn scale through evidence. Walk the six evaluation questions — the last one matters: we are looking for unintended behavior, not only wins.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Consistency">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Consistency across channels</span>
<h2>Sponsored &amp; Display shouldn’t feel like <em class="mark">different</em> companies built them.</h2>
<p class="lede">Advertisers increasingly manage objectives and budgets across channels, but our workflows still expose differences created by product history and organizational boundaries.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-shift-wrap">
<div class="dx-shift" role="img" aria-label="Today Sponsored and Display use different workflows, terminology and interaction patterns, while advertiser strategy, budgets, teams and objectives overlap. Future: shared patterns across seven areas.">
  <div class="dx-today">
    <div class="lab">Today</div>
    <div class="dx-row n3"><b>Sponsored</b><span>Workflow A</span><span>Terminology A</span><span>Interaction patterns A</span></div>
    <div class="dx-row n3"><b>Display</b><span>Workflow B</span><span>Terminology B</span><span>Interaction patterns B</span></div>
    <p class="dx-upstream"><span>Yet upstream</span>Advertiser strategy, budgets, teams and objectives increasingly overlap.</p>
  </div>
  <div class="dx-future">
    <div class="lab">Future direction · Shared patterns</div>
    <div class="dx-found">
      <span>Navigation</span><span>Setup</span><span>Goals</span><span>Tables</span><span>Filters</span><span>Measurement</span><span>Optimization</span>
    </div>
    <p class="dx-caveat">Retain channel-specific decisions only where those differences add genuine advertiser value.</p>
  </div>
</div>
<p class="dx-say"><span class="ord">Why it matters</span><span>Consistency reduces the cognitive cost of moving across Walmart Ads.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Sponsored and Display workflow modernization are one strategy, not two isolated redesigns. The differences on the left came from product history and org boundaries, not from advertiser needs.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Audiences">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Better targeting starts with better audience experience</span>
<h2>Audiences should be an asset advertisers understand &amp; <em class="mark">reuse</em>.</h2>
<p class="lede">Audience creation, selection and management should help advertisers make confident targeting decisions across campaigns and channels.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<p class="dx-note"><span class="ord">Today</span><span>Audience selection and management can be fragmented from the actual campaign decisions advertisers are trying to make.</span></p>
<div class="paths-set dx-paths">
  <div class="paths is-one">
    <div class="lab">Future experience · Across channels</div>
    <div class="flow dx-n7">
      <div class="stop"><h3>Discover</h3></div><div class="stop"><h3>Understand</h3></div><div class="stop"><h3>Create</h3></div><div class="stop"><h3>Save</h3></div><div class="stop"><h3>Activate</h3></div><div class="stop"><h3>Measure</h3></div><div class="stop"><h3>Reuse</h3></div>
    </div>
  </div>
</div>
<div class="dx-benefit">
  <div><span class="ord">What better audience experience can improve</span><p>Understanding audience size · Composition · Applicability · Expected reach · Reuse across workflows · Consistency between the Audience Library and campaign setup</p></div>
  <div><span class="ord">Connection to Display diagnosis</span><p>Better audience information also helps us distinguish poor campaign configuration from underlying delivery or inventory constraints.</p></div>
</div>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">A shared foundation that does two jobs at once: it simplifies the workflow, and it improves our ability to diagnose performance. Point at the right-hand box — it connects straight back to the three contributors.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Decision support">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">From reporting to decision support</span>
<h2>Measurement should help advertisers decide what to do <em class="mark">next</em>.</h2>
<p class="lede">We’re moving from distributed reporting destinations toward a clearer experience organized around the questions advertisers are trying to answer.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<p class="dx-note"><span class="ord">Today</span><span>Campaign reports · Channel reports · Measurement tools · Performance views · Optimization signals · Different destinations and interaction patterns</span></p>
<div class="loop dx-n5" role="img" aria-label="Understand, diagnose, compare, optimize, validate.">
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Understand</span><h3>How am I performing?</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Diagnose</span><h3>What’s driving the result?</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Compare</span><h3>How are campaigns and channels performing?</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Optimize</span><h3>Where should I act?</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Validate</span><h3>Did the change work?</h3></article>
</div>
<div class="dx-benefit n3">
  <div><span class="ord">Sponsored only</span><p>Surface Sponsored activity.</p></div>
  <div><span class="ord">Display only</span><p>Surface Display activity.</p></div>
  <div><span class="ord">Multi-channel</span><p>Make it possible to understand the portfolio.</p></div>
</div>
<p class="dx-say"><span class="ord">The standard</span><span>The advertiser shouldn’t have to navigate our taxonomy to get an answer.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Unified Measurement + Reporting is decision support, not another reporting destination. The bottom row is the adaptive part: show each advertiser what they actually buy.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Experiments">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">Close the learning loop</span>
<h2>Campaign experiments turn performance questions into <em class="mark">evidence</em>.</h2>
<p class="lede">Controlled experimentation gives advertisers and Product teams a better way to understand what actually changed an outcome.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<div class="dx-contrast">
  <div class="is-was"><span class="ord">Instead of</span><p class="dx-quote">“Display isn’t performing.”</p></div>
  <div class="is-now"><span class="ord">We can test</span>
    <div class="dx-ab"><span>Audience A</span><i>vs.</i><span>Audience B</span><span>Creative A</span><i>vs.</i><span>Creative B</span><span>Setup A</span><i>vs.</i><span>Setup B</span><span>Strategy A</span><i>vs.</i><span>Strategy B</span></div>
  </div>
</div>
<div class="dx-themes"><span class="lab">Experiments can help separate</span><span class="chip">Targeting effects</span><span class="chip">Creative effects</span><span class="chip">Configuration effects</span><span class="chip">Strategy effects</span><span class="chip">Other performance variables</span></div>
<p class="dx-say"><span class="ord">Then ask</span><span>What actually changed the outcome?</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">This connects directly to the diagnosis framework: experiments are how step three gets real evidence instead of opinion. Over time, that builds the evidence loop.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Portfolio">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">One strategy, multiple interventions</span>
<h2>Each initiative attacks a different part of the <em class="mark">same</em> experience problem.</h2>
<p class="lede">The roadmap is not a collection of disconnected projects. Each initiative addresses one or more of the structural problems advertisers consistently experience.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-meas-wrap">
<table class="tbl dx-matrix">
  <thead><tr><th scope="col">Initiative</th><th scope="col">Complex</th><th scope="col">Fragmented</th><th scope="col">Inconsistent</th><th scope="col">Unclear</th><th scope="col">Time-consuming</th></tr></thead>
  <tbody>
    <tr><td>Seller Center Native Creation</td><td>●</td><td>●</td><td></td><td>●</td><td>●</td></tr>
    <tr><td>Audience Library</td><td>●</td><td>●</td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>Unified Measurement + Reporting</td><td>●</td><td>●</td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>Sponsored Workflow Enhancements</td><td>●</td><td></td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>Display Workflow Enhancements</td><td>●</td><td></td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>Goal-Based Buying</td><td>●</td><td></td><td></td><td>●</td><td>●</td></tr>
    <tr><td>Recommendation Experience Framework</td><td>●</td><td></td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>Campaign Experiments</td><td></td><td></td><td></td><td>●</td><td></td></tr>
  </tbody>
</table>
<p class="dx-caveat">Dots indicate which advertiser pain points each initiative is intended to address. They are not scores, rankings or estimates of relative impact.</p>
<p class="dx-say"><span class="ord">The system</span><span>Individual initiatives become more valuable when they work together as part of a coherent experience system.</span></p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">Read the columns, not the rows: every pain point has more than one initiative against it. Say the caveat — dots are intent, not impact.</aside>
  </section>

  <section class="slide paper s-ls" data-label="Operating loop">
    <div class="body">
      <div class="slide-header">
<span class="eyebrow">The system we’re building</span>
<h2>Listen. Diagnose. Simplify. Measure. <em class="mark">Learn</em>.</h2>
<p class="lede">Improving advertiser experience is not a one-time redesign. It is a continuous system for turning advertiser evidence into better experiences and measurable outcomes.</p>
      </div>
      <div class="slide-content">
<div class="slide-content-inner">
<div class="dx-loop-wrap">
<div class="loop dx-n6" role="img" aria-label="Listen, diagnose, simplify, enable, measure, learn, then repeat.">
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Listen</span><h3>UXR, VOC, Sales, Support, Pendo</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Diagnose</span><h3>Behavior, experience, performance</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Simplify</span><h3>Remove friction and unnecessary complexity</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Enable</span><h3>Shared capabilities and better guidance</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Measure</span><h3>Behavior, adoption, media outcomes</h3></article>
  <article><span class="dot" aria-hidden="true"></span><span class="ord">Learn</span><h3>Decide what to improve, refine or scale next</h3><p class="dx-repeat">↺ Repeat</p></article>
</div>
<p class="dx-close">We don’t need advertisers to trust that Walmart Ads is getting better. We need to give them an experience, evidence and outcomes that prove it.</p>
</div>
      </div>
      </div>
    </div>
    <aside class="notes">End on the operating philosophy and the accountability model, not a feature list. Read the closing line and stop.</aside>
  </section>
```
