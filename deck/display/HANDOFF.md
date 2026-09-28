# Handoff: Display + Advertiser Experience Deck

**For:** an AI agent rebuilding this deck exactly: same narrative, copy, layout and visual system.
**Reference build:** `docs/display.html` in `Ses2905/adx-strategy-charter`, PR #38, branch `claude/display-advertiser-experience-deck-w8n770`.
**Source of truth:** `deck/display/slides.html` (copy and markup), `deck/display/display.css` (deck-local components), `deck/display/build.py` (assembly). This document describes them. Where the two disagree, the source files win.

---

## 1. What You Are Building

A 15-slide HTML presentation (1920×1080 stage, scaled to fit the viewport). It is a Display-forward version of the broader Advertiser Experience (AE) strategy, **not** a separate Display strategy.

**The argument the deck must protect.** Advertiser Experience does not fix Display performance: ad serving, inventory, viewability, delivery and optimization models. It makes Display easier to buy, understand, diagnose, optimize and trust. It also fixes the structural problems that hurt every channel. Never write copy that implies the AE roadmap fixes Display performance. Sales will reject that claim immediately.

**Narrative spine, in five acts:**

| Act | Navigator label | Slides |
|---|---|---|
| — | (cover, no section) | 01 |
| 01 | Why Display feels broken | 02–03 |
| 02 | What is causing it | 04–06 |
| 03 | What we fix for Display | 07 |
| 04 | What we build once | 08–11 |
| 05 | What advertisers get | 12–15 |

---

## 2. Two Ways to Build It

### Path A: You Have the Repo (Preferred)
1. Work in `deck/display/`. Edit `slides.html` for copy or markup and `display.css` for deck-local styles.
2. Run `python3 deck/display/build.py`. It reads `docs/index.html` (the published AE deck), keeps its whole `<head>`, CSS, fonts, chrome and runtime, and then:
   - replaces every `<section class="slide">` with the contents of `slides.html`
   - generates the flywheel SVG on slide 14 into the `%%WHEEL%%` placeholder
   - rewrites the `SECTIONS` array (table above; `start`/`end` are **0-indexed** slide positions: 1–2, 3–5, 6–6, 7–10, 11–14)
   - sets the `<title>` and footer meta to `Display + Advertiser Experience · draft`
   - removes the `editor*.js` script tags (those files aren't shipped in `docs/`)
   - injects `display.css` as a `<style>` block before `</head>`
3. Output: `docs/display.html`. Never hand-edit that file.

### Path B: No Repo Access
Rebuild the shell from the spec in §3 and §4, then use the slide specs in §6 and the CSS in Appendix A. The runtime behaviour you need is in §4.

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
- Dark (navy) slides: **only the cover and the close.** There are no section-divider slides in this deck; the right-rail navigator carries the acts.
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
| 01, 15 | `s-cover`, `s-close` + `.ask` | Kit |
| 02 | `.dx-thesis` + `.dx-layers` | New |
| 03 | `.dx-proof` + `.dx-themes` chips + `.dx-say` | New (the chips reuse the kit's `.chip`) |
| 04 | `.dx-five` + `.dx-count` | New |
| 05 | `.chain.dx-n6` + `.dx-say` | Kit `.chain`, 6-up variant |
| 06 | `.dx-split` + `.dx-pair` | New |
| 07 | `.cols.dx-cols` + `.dx-say` | Kit `.cols` |
| 08 | `.dx-shift` (`.dx-today` grid / `.dx-found` + `.dx-serves`) + `.dx-say` | New |
| 09 | `.paths-set` with `.paths.is-broken` / `.paths.is-one` + `.dx-benefit` | Kit `.paths`, 6-up variant |
| 10 | `.loop.dx-n4` + `.dx-cap` + `.dx-say` | Kit `.loop`, 4-up variant |
| 11 | `.stack.dx-model` (`.exp.dx-n3` / `.found` / `.dx-serves.is-label`) | Kit `.stack` |
| 12 | `.fromto.dx-commit` + `.dx-benefit` | Kit `.fromto` |
| 13 | `.cols.dx-road` + `li.d` markers + `.dx-legend` | Kit `.cols` |
| 14 | Generated SVG `.dx-wheel` + `.dx-reuse` | New |

**Specificity trap (this one cost a render cycle).** The kit's `deck-families.css` sets grids as `.slide.s-ls .chain`, `.slide.s-ls .loop`, `.slide.s-ls .paths .flow` and `.slide.s-ls .cols`. Any variant that changes column count **must** carry the same prefix, e.g. `.slide.s-ls .chain.dx-n6`. Without it, a 6-up chain silently wraps to 4 columns.

---

## 6. Slide-by-Slide Spec (Exact Copy)

Every content slide is `class="slide paper s-ls"`. The format is **Eyebrow → Title** (the `[word]` in brackets is the `em.mark`) **→ Lede → Content → Notes**.

### 01 · Cover (`navy s-cover`, label "Cover")
- Pill: DISPLAY + ADVERTISER EXPERIENCE
- h1: Making Display easier to buy, understand and [trust].
- Sub: A Display-forward view of the Advertiser Experience strategy.
- Notes: This is not a separate Display strategy. It is the Advertiser Experience strategy, told through the channel where the cracks are most visible.

### 02 · Two Jobs
- Eyebrow: Display + Advertiser Experience
- Title: Improving Display requires more than fixing [Display].
- Lede: The opportunity is to address the immediate friction hurting Display today while fixing the shared experience foundations that make every advertising workflow harder than it needs to be.
- Content:
  - **Thesis** (40px Headline Light, two lines): "Fix what is uniquely broken in Display." / "Build what should never have been unique to Display in the first place."
  - **Three layer rows**, each a 420px label column plus an items column:
    1. `Built once`, **Shared advertiser experience**: Navigation · Audiences · Creative · Reporting · Experimentation · Intelligence
    2. `Where advertisers feel it`, **Display experience**: Setup · Control · Diagnostics · Recommendations · Measurement. This middle row is emphasised: 2px True Blue rules above and below, True Blue label and heading, ink-coloured items. It has no fill and doesn't extend past the rails.
    3. `Display-owned`, **Display performance**: Ad serving · Inventory · Viewability · Delivery · Optimization
- Notes: Read the two-line thesis, then point at the middle layer. That is where advertisers feel both problems at once: what sits beneath it and what sits above it.

### 03 · Pressure
- Eyebrow: The pressure is real
- Title: Display is where advertiser friction is hardest to [ignore].
- Lede: Sales feedback, behavioral data, support signals and advertiser research point to the same problem: Display is too difficult to navigate, operate and understand.¹
  - Footnote 1: "Display behavioral analytics and Display survey feedback. Source, date range and denominators to confirm before presenting."
- Content:
  - **Proof grid** `1.2fr 1fr 1fr`. The hero spans two rows: **46.2%** (120px), "Drop-off into Set Up", "Moving from Ad Group Create / Edit into Set Up — the step where campaigns become real."
  - **Four metrics** at 48px, 2×2: **135K+** Dead clicks / Clicks that do nothing. · **13.7K** Rage clicks / Repeated clicks out of frustration. · **28K+** U-turns / Leaving a page and coming straight back. · **~31%** Detractors / In Display survey feedback.
  - **Chip row**, labelled `What they keep saying`: Clunky workflows · Limited data · Reporting trust · Optimization control · Transparency.
  - **Statement**, labelled `The real question`: Advertisers aren't just asking "Did my campaign perform?" They're struggling to answer "What happened, why, and what should I do next?"
- Notes: Lead with 46.2%. The behavioral numbers show struggle, not dissatisfaction alone. Land on the question: the problem is not only performance, it is not knowing what to do about it.

### 04 · Bigger Than Display
- Eyebrow: This is bigger than Display
- Title: Display amplifies problems advertisers experience [everywhere].
- Lede: Our research consistently points to five core experience problems. Display does not create all of them, but its complexity makes them especially visible.
- Content:
  - **Five columns**, each with a True Blue top rule, the word at 40px True Blue Headline Light, and a 17px description:
    - Time-consuming: Too much effort to accomplish routine jobs.
    - Inconsistent: Similar tasks behave differently across products and platforms.
    - Fragmented: Advertisers move between disconnected tools, workflows and destinations.
    - Complex: The experience exposes too much internal product complexity.
    - Unclear: Advertisers lack confidence in what happened, why, and what to do next.
  - **Count row**, labelled `Evidence base`: **23** sources · **18** studies · **28K+** support tickets · **20** interviews.
- Notes: This is the turn: from "Display problem" to "system problem." Same five themes as the main strategy deck — say that out loud so nobody thinks this is new research.

### 05 · Compounding
- Eyebrow: The experience compounds the performance problem
- Title: When performance is hard to understand, experience becomes part of the [problem].
- Lede: Even when the issue begins with delivery or performance, fragmented workflows make it harder for advertisers to diagnose the cause, understand their options and take action.
- Content:
  - **Six-step chain** (True Blue line, hollow dots, mono label, 26px question): Signal: Campaign underdelivers · Diagnosis: Where do I find the right information? · Understanding: Why is this happening? · Decision: What can I change? · Action: Where do I make the change? · Validation: Did it work?
  - **Statement**, labelled `Today`: Every handoff adds friction, uncertainty and time.
- Notes: This gives Advertiser Experience a legitimate seat in the Display performance conversation without claiming the algorithm. We don't own the first box. We own whether the next five are survivable.

### 06 · Two Types of Work
- Eyebrow: Two problems, two types of work
- Title: Separate Display-specific problems from shared experience [problems].
- Lede: Not every Display issue should become a platform initiative, and not every experience problem should be solved independently inside Display.
- Content:
  - **Two columns** at `2fr 3fr`, both with a True Blue top rule:
    - `Solve within Display`, **The capabilities that make Display perform**. Two sub-columns × 4 rows: Ad serving and delivery · Viewability · Inventory availability · Display-specific optimization logic · Goal-based buying · Display-specific forecasting · Format-specific requirements · Performance model improvements.
    - `Solve once across Advertiser Experience`, **The connective tissue that makes them usable**. Three sub-columns × 4 rows: Navigation and IA · Campaign management patterns · Measurement and reporting · Audiences · Creative and assets · Recommendations · Experimentation · Diagnostics · Notifications · Forecasting patterns · Terminology · Controls and transparency.
  - **Paired statements** on the same `2fr 3fr` grid, 26px: "Display owns the capabilities that make Display perform." / "Advertiser Experience owns the connective tissue that makes those capabilities usable."
- Notes: This is the slide that protects the rest of the deck. Performance capabilities determine what the system can deliver. Advertiser Experience determines whether advertisers can understand, control and get value from them. You need both.

### 07 · Near-Term Reset
- Eyebrow: Near-term Display reset
- Title: First, remove the friction we already know is hurting [Display].
- Lede: We do not need to wait for the future platform to improve today's experience.
- Content:
  - **Three columns**, each with a mono ordinal, a 32px heading and a hairline list:
    - 01 **Simplify**: Address known workflow friction · Modernize campaign creation · Resolve "Lost in the Shuffle" improvements · Improve tables, editing and management · Reduce unnecessary steps
    - 02 **Clarify**: Separate Offsite from Onsite Display · Simplify campaign goals and setup · Improve terminology · Make controls and automation clearer
    - 03 **Strengthen**: Goal-based buying · Better forecasting · More actionable recommendations · Stronger diagnostics · Clearer performance insights
  - **Statement**, labelled `Guardrail`: Immediate improvements should reduce friction without creating another Display-specific experience we later have to unwind.
- Notes: The guardrail is the point of the slide. Say it plainly and move on — it applies to goal-based buying and dynamic display without naming either.

### 08 · The Shift
- Eyebrow: The shift
- Title: Then we stop rebuilding the same capabilities channel by [channel].
- Lede: Many of the capabilities Display needs are the same capabilities Sponsored, Offsite, Marketplace and future channels need.
- Content (two halves, 80px gap):
  - **Left**, labelled `Today · Channel-centric`. A grid with a 110px channel name plus four boxed cells (1px `--line` border, white fill, 13px muted, centred):
    - Sponsored / Display / Offsite: Campaigns · Audiences · Reporting · Recommendations
    - Seller: Campaigns · Reporting · Recommendations, with the fourth cell empty
  - **Right**, labelled `Future · Shared experience foundation`. A tinted band with a 2px True Blue top rule holds seven outlined True Blue chips: Campaign management · Audiences · Measurement + reporting · Creative + assets · Experimentation · Forecasting · Recommendations + intelligence. Beneath it sits a hairline row: Sponsored · Display · Offsite · Marketplace · Future channels.
  - **Statement**, labelled `The principle`: Build the common job once. Adapt it where the channel genuinely requires it.
- Notes: Let the left side look repetitive — that's the argument. Fifteen boxes doing four jobs. On the right, seven capabilities, built once, serving five channels.

### 09 · Measurement
- Eyebrow: One example: measurement
- Title: Advertisers shouldn't have to learn where Walmart put the [answer].
- Lede: Measurement is a clear example of how a shared capability improves Display immediately while eliminating fragmentation across the portfolio.
- Content:
  - **Two flows**, 36px apart:
    - `Today · Find the answer first` (gray rules, gray arrows, muted 18px stops): Campaign → Channel → Reporting destination → Metric → Interpretation → Action
    - `Future · Unified Measurement + Reporting Hub` (True Blue rules and arrows, 28px True Blue Headline Light stops): What happened? → Why? → What should I do? → Take action
  - **Benefit pair**:
    - `For Display`: Diagnose underdelivery · Understand performance drivers · Compare outcomes · Connect reporting to action
    - `For every channel`: Consistent metrics · Shared reporting patterns · Cross-channel visibility · Less navigation · Greater trust
- Notes: One example on purpose. We could repeat this for audiences or recommendations, but one concrete case proves the model without turning the deck into roadmap bingo.

### 10 · Transparency
- Eyebrow: From data to decisions
- Title: Transparency is the bridge between performance and [trust].
- Lede: More data alone does not make an advertiser feel in control. The experience must explain what is happening, why it is happening and what they can do about it.
- Content:
  - **Four-step loop** (True Blue line and dots). Each step has a mono label, a 30px question (with a `min-height` of 2 lines so the rows align) and a capability line under a hairline:
    - See: What is happening? → Reporting
    - Understand: Why is it happening? → Diagnostics
    - Act: What can I do? → Recommendations + controls
    - Learn: Did the change improve the outcome? → Experimentation
  - **Statement**, labelled `The experience layer`: This is what turns performance signals into advertiser decisions. Advertisers don't need more insights. They need fewer, clearer decisions.
- Notes: Connect back to the main strategy thesis: advertisers do not need more insights, they need fewer decisions. The bottom row is the capability that carries each step.

### 11 · Experience Model
- Eyebrow: The experience model
- Title: The goal is not one giant workflow. It's one coherent [system].
- Lede: Advertisers have different jobs, sophistication levels and channel needs. Consistency should reduce cognitive load without removing the flexibility sophisticated advertisers require.
- Content:
  - **Three columns**, each with a 36px heading and a 17px description:
    - Guided: Quick-start, goal-based setup, recommendations, automation
    - Flexible: Configurable workflows, reusable assets and audiences, controls
    - Advanced: Granular controls, experimentation, diagnostics, APIs
  - **Foundation band** (2px True Blue top rule, tinted, 24px padding): **One shared foundation**, with the line "Shared navigation · Shared terminology · Shared capabilities · Shared intelligence · Shared measurement"
  - **Serving row**: mono `Serving`, then Sponsored · Display · Offsite · Marketplace
- Notes: This protects against "unification means dumbing everything down." Advanced users keep their depth. What they lose is having to relearn the platform in every channel.

### 12 · Commitments (Hero Slide)
- Eyebrow: The advertiser impact
- Title: Five structural problems become five experience [commitments].
- Lede: Our roadmap should be judged by whether it materially reduces the friction advertisers experience today.
- Content:
  - **From→to table**, max-width 1100px. Mono header row: `Today` (muted) · `Commitment` (True Blue). Five hairline rows set "from" at 32px muted, `→` in True Blue, and "to" at 40px True Blue Headline Light:
    - Time-consuming → Efficient
    - Inconsistent → Predictable
    - Fragmented → Connected
    - Complex → Intuitive
    - Unclear → Transparent
  - **Benefit pair**:
    - `For Display`: Easier setup, clearer controls, faster diagnosis and more actionable optimization.
    - `For every channel`: Familiar patterns, reusable capabilities, consistent measurement and fewer systems to learn.
- Notes: Hero slide. Read the right-hand column only. Then: this is the scorecard the roadmap should be held to.

### 13 · Roadmap
- Eyebrow: Roadmap
- Title: The work already underway starts building this [future].
- Lede: The strategy does not require starting over. It requires sequencing today's work so individual initiatives compound into a coherent advertiser experience.
- Content:
  - **Four columns.** A ● is an 8px True Blue dot marking "directly improves Display"; ○ means no marker, but the item keeps the same indent.
    - **Understand + diagnose**: ● Advertiser Experience Health + Intelligence · ● Unified Measurement + Reporting · ● Experimentation infrastructure
    - **Simplify + modernize**: ● Display campaign redesign · ○ Sponsored campaign redesign · ● Lost in the Shuffle · ● Living Design 3.5 · ● Standardized campaign tables
    - **Connect**: ● Global IA · ● Unified navigation · ○ Shared Apps framework · ● Unified Audience Library · ● Dedicated Offsite experience
    - **Guide + optimize**: ● Recommendation Experience Framework · ● Campaign Automation + Guided Setup · ● Forecasting · ● Budget controls · ● Notifications
  - **Legend row**: "● Directly improves Display" on the left; on the right, in muted text, "Grouped by the advertiser job each initiative serves, not by date."
- Notes: Don't walk the list. Point at the markers: a surprising amount of the Advertiser Experience roadmap is also a Display improvement roadmap. Display markers are a working read — confirm with the Display team before this goes wide.

### 14 · Payoff
- Eyebrow: The payoff
- Title: Display gets better. The platform gets [stronger].
- Lede: Solving Display's immediate challenges within a shared experience strategy creates value beyond a single channel and prevents today's fixes from becoming tomorrow's fragmentation.
- Content: the **flywheel** on the left (720px wide) and a **reuse** block on the right, 96px apart.
  - **Flywheel SVG**, `viewBox 0 0 720 600`:
    - Ring: centre (360,300), r=170, 1px True Blue.
    - Six nodes at 60° intervals, starting at the top and going clockwise. Each is r=7 with paper fill and a 1.5px True Blue stroke. Node 01 is filled True Blue.
    - Labels: a mono `0N` line above two 17px lines. The text wraps at the "+" or at the word midpoint, anchored `middle` at the top and bottom and `start`/`end` at the sides, offset 22px horizontally.
    - The top label sits 40px above its node. The bottom label sits **52px below** its node; less than that overlaps the number and the node.
    - Steps: Better Display experience · Less friction + clearer decisions · More advertiser control + confidence · Faster optimization + learning · Better adoption of capabilities · Stronger advertiser outcomes
    - Centre text, two lines at 26px True Blue Headline Light: "Each turn" / "compounds"
  - **Reuse block**: a True Blue top rule, the mono label `Built to be reused`, the 34px line "What we build for Display becomes reusable across Sponsored, Offsite, Marketplace and whatever comes next.", and a hairline row: Sponsored · Offsite · Marketplace · Next.
- Notes: Walk the wheel once, starting at the top. The point is that it turns: stronger outcomes earn more adoption, which makes the next Display improvement worth more.

### 15 · Close (`navy s-close`, label "Close")
- Pill: CLOSING
- h1: Display is the proving ground for the experience we need [everywhere].
- Sub: Performance determines what the system can deliver. Experience determines whether advertisers can understand, control and get value from it.
- `.ask` row (three columns, Everyday Blue top rules, uppercase `.k` labels):
  - Solve within Display: The capabilities that make Display perform
  - Solve once: The connective tissue that makes them usable
  - Why both: Neither lands for advertisers without the other
- Notes: Land the plane: Display is an urgent proving ground for the experience we need to build everywhere. Do not claim the roadmap fixes Display performance — claim that it makes performance usable.

---

## 7. Copy Rules
- Titles are sentence case and assert a takeaway. Someone reading only the titles should get the argument.
- Use "and" in titles and sentences. Use "+" in labels and chips ("Measurement + reporting").
- There's one `em.mark` per title, and it goes on the word that carries the claim.
- **Never invent metrics, quotes or sources.** Placeholders stay visibly marked as needing confirmation.
- Avoid: unlock, leverage, seamless, robust, holistic, transformative.

---

## 8. Validation (Do All of These Before Calling It Done)
1. **Render every slide** at 1920×1080 with `reducedMotion: 'reduce'` in Playwright, navigating with `window.ADXShow(i)`. Look at each screenshot. The layout bugs in this build were only visible in renders.
2. **Rail check.** No leaf text may run past x<78, x>1842 or y>990. The kit's own `.slide-content-inner` box reaching y=1008 is expected, so ignore it.
3. **Column counts.** Confirm slide 05 renders 6 across, slide 09's "today" flow 6, slide 10 4, and slide 13 4. If a row wraps, it's the specificity trap in §5.
4. **Peer alignment.** Headings in a row share one baseline (slide 10 uses `min-height` for this).
5. **Fonts load.** Everyday Sans must actually load. If it doesn't, the fallback metrics will mislead every width check.

---

## 9. Open Items to Carry Forward (Not Yours to Resolve)
- **Slide 03 metrics have no source.** That covers 46.2%, 135K+, 13.7K, 28K+ and ~31%: each needs a source, date range and denominator. "28K+ U-turns" is easy to confuse with "28K+ support tickets" on slide 04.
- **Slide 13's Display markers are a working read** and need confirmation from the Display team.
- **There's no explicit ask.** The close lands a thesis, not a decision. If a "What we need from you" row is added, it goes on slide 15's `.ask` row.
- **Nobody owns the middle layer.** Slide 02's "Display experience" layer has no named owner. It sits between Display (performance) and AE (connective tissue).
- **Publishing.** Merging to `main` publishes `/display.html` through GitHub Pages. The fonts are proprietary Walmart typefaces, so confirm that's intended before the deck goes anywhere public.

---

## Appendix A · `display.css` (Verbatim)

```css
  /* Display + Advertiser Experience — deck-local components.
     Built only from the kit's tokens (--true, --line, --muted, --display,
     --mono, --paper) and its existing grammar: 1px hairlines, a True Blue
     rule for the thing that matters, mono labels, light display type. */
  .dx-layers-wrap, .dx-proof-wrap, .dx-five-wrap, .dx-chain-wrap, .dx-split-wrap,
  .dx-cols-wrap, .dx-shift-wrap, .dx-meas-wrap, .dx-loop-wrap, .dx-commit-wrap,
  .dx-road-wrap, .dx-wheel-wrap {
    display: flex; flex-direction: column; gap: 40px; width: 100%; max-width: 1520px;
  }

  /* statement line — the kit's closing assertion, not a slab */
  .dx-say {
    display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: baseline;
    padding-top: 16px; border-top: 1px solid var(--true);
    font-family: var(--display); font-weight: 300; font-size: 28px;
    letter-spacing: -0.02em; line-height: 1.25; color: var(--ink);
  }
  .dx-say .ord { font-size: 11px; letter-spacing: 0.14em; }

  /* 01 · three layers */
  .dx-thesis {
    font-family: var(--display); font-weight: 300; font-size: 40px;
    letter-spacing: -0.03em; line-height: 1.2; color: var(--ink);
  }
  .dx-layers { display: flex; flex-direction: column; }
  .dx-layer {
    display: grid; grid-template-columns: 420px 1fr; gap: 32px; align-items: baseline;
    padding: 18px 0; border-top: 1px solid var(--line);
  }
  .dx-layer:last-child { border-bottom: 1px solid var(--line); }
  .dx-layer .ord { display: block; font-size: 11px; letter-spacing: 0.14em; margin-bottom: 6px; color: var(--muted); }
  .dx-layer h3 { font-family: var(--display); font-weight: 300; font-size: 28px; letter-spacing: -0.03em; }
  .dx-layer p { font-size: 18px; color: var(--muted); line-height: 1.4; }
  .dx-layer.is-mid { border-top: 2px solid var(--true); border-bottom: 2px solid var(--true); }
  .dx-layer.is-mid + .dx-layer { border-top: 0; }
  .dx-layer.is-mid .ord, .dx-layer.is-mid h3 { color: var(--true); }
  .dx-layer.is-mid p { color: var(--ink); }

  /* 02 · proof */
  .dx-proof { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 24px 48px; }
  .dx-hero { grid-row: 1 / span 2; padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-hero .n, .dx-m .n { font-family: var(--display); font-weight: 300; color: var(--true); letter-spacing: -0.04em; line-height: 0.95; }
  .dx-hero .n { font-size: 120px; }
  .dx-hero h3 { font-size: 22px; font-weight: 500; margin: 16px 0 6px; }
  .dx-hero p { font-size: 16px; line-height: 1.4; color: var(--muted); max-width: 24em; }
  .dx-m { padding-top: 14px; border-top: 1px solid var(--line); }
  .dx-m .n { font-size: 48px; }
  .dx-m h3 { font-size: 16px; font-weight: 500; margin: 8px 0 4px; }
  .dx-m p { font-size: 14px; line-height: 1.35; color: var(--muted); }
  .dx-themes { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .dx-themes .lab, .dx-count .lab, .dx-shift .lab {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--true);
  }
  .dx-themes .lab { margin-inline-end: 14px; }

  /* 03 · five problems */
  .dx-five { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 32px; }
  .dx-five article { padding-top: 20px; border-top: 1px solid var(--true); }
  .dx-five h3 { font-family: var(--display); font-weight: 300; font-size: 40px; letter-spacing: -0.035em; line-height: 1.05; color: var(--true); margin-bottom: 14px; }
  .dx-five p { font-size: 17px; line-height: 1.4; color: var(--muted); }
  .dx-count { display: flex; gap: 40px; align-items: baseline; padding-top: 16px; border-top: 1px solid var(--line); font-size: 16px; color: var(--muted); }
  .dx-count b { font-family: var(--display); font-weight: 300; font-size: 28px; color: var(--ink); margin-inline-end: 6px; letter-spacing: -0.03em; }

  /* 04 · six handoffs */
  .slide.s-ls .chain.dx-n6 { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0 28px; }
  .slide.s-ls .chain.dx-n6 .ord { display: block; font-size: 11px; letter-spacing: 0.14em; margin-bottom: 10px; }
  .slide.s-ls .chain.dx-n6 h3 { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.03em; line-height: 1.2; }

  /* 05 · split */
  .dx-split { display: grid; grid-template-columns: 2fr 3fr; gap: 64px; }
  .dx-split > div { padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-split .ord { display: block; font-size: 11px; letter-spacing: 0.14em; margin-bottom: 8px; }
  .dx-split h3 { font-family: var(--display); font-weight: 300; font-size: 28px; letter-spacing: -0.03em; margin-bottom: 16px; }
  .dx-split ul { list-style: none; display: grid; grid-auto-flow: column; gap: 0 28px; }
  .dx-split ul.c2 { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, auto); }
  .dx-split ul.c3 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(4, auto); }
  .dx-split li { font-size: 16px; line-height: 1.35; padding: 9px 0; border-top: 1px solid var(--line); }
  .dx-pair { display: grid; grid-template-columns: 2fr 3fr; gap: 64px; padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-pair p { font-family: var(--display); font-weight: 300; font-size: 26px; letter-spacing: -0.02em; line-height: 1.25; }

  /* 06 · cols */
  .slide.s-ls .cols.dx-cols .ord { display: block; font-size: 11px; letter-spacing: 0.14em; margin-bottom: 6px; }
  .slide.s-ls .cols.dx-cols > div { grid-template-rows: auto auto 1fr; padding-top: 16px; border-top: 1px solid var(--true); }
  .slide.s-ls .cols.dx-cols h3 { font-size: 32px; }
  .slide.s-ls .cols.dx-cols li { font-size: 17px; }

  /* 07 · shift */
  .dx-shift { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .dx-shift .lab { margin-bottom: 14px; }
  .dx-today { display: flex; flex-direction: column; gap: 8px; }
  .dx-row { display: grid; grid-template-columns: 110px repeat(4, 1fr); gap: 8px; align-items: center; }
  .dx-row b { font-size: 15px; font-weight: 500; }
  .dx-row span { font-size: 13px; color: var(--muted); padding: 8px 10px; border: 1px solid var(--line); background: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dx-found { display: flex; flex-wrap: wrap; gap: 8px; padding: 18px; border-top: 2px solid var(--true); background: rgba(0,83,226,0.05); }
  .dx-found span { font-size: 15px; font-weight: 500; color: var(--true); padding: 8px 12px; border: 1px solid rgba(0,83,226,0.35); background: #fff; }
  .dx-serves { display: flex; gap: 8px; margin-top: 12px; }
  .dx-serves span { flex: 1; font-size: 15px; font-weight: 500; padding-top: 10px; border-top: 1px solid var(--line); }
  .dx-serves.is-label em { font-style: normal; font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); padding-top: 12px; width: 140px; flex: none; }

  /* 08 · measurement */
  .dx-paths { display: flex; flex-direction: column; gap: 36px; }
  .dx-paths .paths + .paths { margin-top: 0; }
  .slide.s-ls .paths .flow.dx-n6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .dx-paths .paths.is-one .stop h3 { font-family: var(--display); font-weight: 300; font-size: 28px; letter-spacing: -0.03em; color: var(--true); }
  .dx-paths .paths.is-broken .stop h3 { color: var(--muted); font-weight: 400; }
  .dx-benefit { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
  .dx-benefit > div { padding-top: 14px; border-top: 1px solid var(--line); }
  .dx-benefit .ord { display: block; font-size: 11px; letter-spacing: 0.14em; margin-bottom: 8px; }
  .dx-benefit p { font-size: 18px; line-height: 1.45; }

  /* 09 · loop */
  .slide.s-ls .loop.dx-n4 { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 40px; }
  .slide.s-ls .loop.dx-n4 .ord { font-size: 12px; }
  .slide.s-ls .loop.dx-n4 h3 { font-size: 30px; line-height: 1.2; min-height: 2.4em; }
  .slide.s-ls .loop .dx-cap { margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 16px; font-weight: 500; color: var(--ink); }

  /* 10 · model */
  .slide.s-ls .stack.dx-model .exp.dx-n3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 40px; padding-bottom: 32px; }
  .slide.s-ls .stack.dx-model .exp div { padding-top: 16px; }
  .slide.s-ls .stack.dx-model .exp h3 { font-family: var(--display); font-weight: 300; font-size: 36px; letter-spacing: -0.03em; }
  .slide.s-ls .stack.dx-model .exp p { font-size: 17px; margin-top: 8px; }
  .slide.s-ls .stack.dx-model .found { border-top-width: 2px; padding: 20px 24px; background: rgba(0,83,226,0.05); }
  .slide.s-ls .stack.dx-model .found p { font-size: 18px; color: var(--ink); }
  .slide.s-ls .stack.dx-model .dx-serves { margin-top: 20px; }

  /* 11 · commitments */
  .slide.s-ls .dx-commit { max-width: 1100px; }
  .slide.s-ls .dx-commit .dx-hd { display: grid; grid-template-columns: 1fr 48px 1fr; gap: 16px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--true); padding-bottom: 12px; }
  .slide.s-ls .dx-commit .dx-hd span:first-child { color: var(--muted); }
  .slide.s-ls .dx-commit .pair { padding: 10px 0; }
  .slide.s-ls .dx-commit .from { font-family: var(--display); font-weight: 300; font-size: 32px; letter-spacing: -0.03em; }
  .slide.s-ls .dx-commit .to { font-family: var(--display); font-weight: 300; font-size: 40px; letter-spacing: -0.03em; }
  .slide.s-ls .dx-commit .arrw { font-size: 24px; }
  .slide.s-ls .dx-commit .pair:last-child { border-bottom: 1px solid var(--line); }

  /* 12 · roadmap */
  .slide.s-ls .cols.dx-road { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px; }
  .slide.s-ls .cols.dx-road > div { padding-top: 16px; border-top: 1px solid var(--true); }
  .slide.s-ls .cols.dx-road li { font-size: 16px; padding-inline-start: 20px; position: relative; }
  .slide.s-ls .cols.dx-road li.d::before, .dx-legend i {
    content: ""; position: absolute; left: 0; top: 15px; width: 8px; height: 8px; border-radius: 50%; background: var(--true);
  }
  .dx-legend { display: flex; align-items: center; gap: 10px; font-size: 15px; color: var(--ink); padding-top: 14px; border-top: 1px solid var(--line); }
  .dx-legend i { position: static; display: inline-block; }
  .dx-legend span { margin-inline-start: auto; color: var(--muted); }

  /* 13 · wheel */
  .dx-wheel-wrap { flex-direction: row; align-items: center; gap: 96px; }
  .dx-wheel { width: 720px; flex: none; height: auto; overflow: visible; }
  .dx-wheel .ring { fill: none; stroke: var(--true); stroke-width: 1; }
  .dx-wheel .nd { fill: var(--paper); stroke: var(--true); stroke-width: 1.5; }
  .dx-wheel .nd.first { fill: var(--true); }
  .dx-wheel text { font-family: var(--ui); font-size: 17px; fill: var(--ink); }
  .dx-wheel text.num { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; fill: var(--true); }
  .dx-wheel text.mid { font-family: var(--display); font-weight: 300; font-size: 26px; fill: var(--true); letter-spacing: -0.02em; }
  .dx-reuse { flex: 1; padding-top: 16px; border-top: 1px solid var(--true); }
  .dx-reuse .ord { display: block; font-size: 11px; letter-spacing: 0.14em; margin-bottom: 12px; }
  .dx-reuse-t { font-family: var(--display); font-weight: 300; font-size: 34px; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 24px; }
```
