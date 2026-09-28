# Product Leadership Presentation System — usage guide

The master template for strategy, research, planning, performance and decision decks, built on the Advertiser Experience deck’s visual language. **The thinking changes. The design system does not.**

| File | What it is |
|---|---|
| `Product-Leadership-Master-Template.pptx` | The master plus 64 system slides: foundations, layout picker, one worked example per layout, and the component, chart, table and diagram libraries. |
| `Product-Leadership-Master-Template.potx` | The same package as a PowerPoint template: opening it starts a new, untitled deck. |
| `system.js` · `masters.js` · `components.js` · `build.js` | The single source for every coordinate, style, colour and component. |
| `make.sh` | Rebuilds both files: build → post-process → render thumbnails → rebuild → post-process. |

## How to use it

1. **Choose the job.** START, TELL, PROVE, EXPLAIN, CUSTOMER, STRATEGY, PRIORITIZE, DECIDE, PLAN, MEASURE, COMPARE, OPERATE, UPDATE, CLOSE (slide 10).
2. **Pick the layout** in Home → New Slide. Layouts are numbered 01–35 and every slot is a named placeholder.
3. **Replace the content.** For components, charts and diagrams, duplicate the matching library slide and edit it; don’t redraw.
4. **When it doesn’t fit:** tighten the copy → use the dense layout (26) → change layout → split the slide → only then reduce type, within the minimums. Never shrink until it fits.

## Foundations

- **Canvas:** 13.333 × 7.5 in (16:9), authored on a 1920 × 1080 px grid (1 px = 1/144 in).
- **Content frame:** x = 80 → 1840 px, with 12 columns (117.3 px) and 32 px gutters. Supported splits: 12 · 8+4 · 7+5 · 6+6 · 4+4+4 · 3+3+3+3 · 3+9 · 2+10.
- **Zones:**
  - context (eyebrow and section marker) at y 72
  - title, bottom-anchored, at 112–264
  - subtitle at 272–344
  - content at 384–944
  - source at 952
  - footer (Spark, deck name, slide number) at 1008
  - dense layouts: title at 88–152, content at 184–944
- **Spacing:** 4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 · 96 px.
- **Radii:** full for pills, 12 px for cards and panels, 24 px for hero containers.
- **Lines:** 0.75 pt hairline · 1 pt rule · 1.5 pt emphasis.
- **Colour roles:**
  - Primary #001E60 · Secondary #0053E2 · Accent #4DBDF5 (dark grounds only)
  - Background #F5F6F8 · Surface #FFFFFF · Surface alt #E9EEF3 · Border #DEE1E6
  - Text #001E60 / #3D4A63 / #5E636E
  - Positive #128A08 · Warning #B25E00 · Negative #DE1C24 · Info #0053E2
  - These are also written into the PowerPoint theme, so new charts and shapes pick them up.
- **Type:** Everyday Sans (Headline Light, UI, UI Medium, Light Italic, Mono), 24 semantic styles; see slide 5.
  - Minimum 10 pt for reading text; 7.5 pt only for mono labels and pills.
  - The file names the desktop families; if your PowerPoint lists them differently, change `FONT` in `system.js` and run `make.sh`.

## Layouts

| # | Layout | Job | Use it for | Ideal | Max | Fallback |
|---|---|---|---|---|---|---|
| 01 | Cover — Minimal | START | Deck cover on a dark ground | Title ≤ 12 words | 3 title lines | Cover — Editorial for longer titles |
| 02 | Cover — Editorial | START | Cover for a document-style or leave-behind deck | Title ≤ 14 words | 3 title lines | Cover — Minimal |
| 03 | Cover — Visual | START | Cover led by a product image or screenshot | Title ≤ 10 words | 3 title lines | Cover — Minimal |
| 04 | Agenda | START | Agenda, content map, section map | 4–6 items | 6 rows | Agenda in two slides, or Label Rail for 4 |
| 05 | Section Divider | START | Section transition that carries the section’s argument | Name ≤ 5 words, argument ≤ 20 | 2 title lines | Section Divider — Statement |
| 06 | Section Divider — Statement | START | Transition that lands a statement, visual rest | ≤ 18 words | 4 lines | Hero Statement |
| 07 | Hero Statement | TELL | Hero statement, big question, key takeaway, north star, vision line | ≤ 20 words | 4 lines at 36pt | Statement + Evidence |
| 08 | Statement + Evidence | PROVE | Statement + evidence, situation → implication, why now | 1 claim + 3 proof points | 3 evidence items | KPI Row — 4 |
| 09 | Title Only | EXPLAIN | Workhorse for diagrams, charts, components and infographic primitives | One diagram | Content zone 1760 × 560px | Split 8 + 4 when the diagram needs a so-what |
| 10 | Title + Body | TELL | Narrative prose, executive summary text, context | 60–90 words | 8 lines | Label Rail — 4 Rows to break prose into claims |
| 11 | Two Column | COMPARE | Side-by-side, problem → opportunity, pros / cons, similarities / differences | 2 × 40 words | 2 × 70 words | Comparison Table |
| 12 | Split 8 + 4 | PROVE | Content + so-what: chart, screenshot, table or diagram with interpretation | 1 visual + 40-word read | Rail 80 words | Chart — Full with annotation |
| 13 | Three Column | STRATEGY | Strategic pillars, themes, recommendations, options, research findings, principles | 3 × 30 words | 3 × 60 words | Four Column for 4; Pillars + Initiatives above 5 |
| 14 | Four Column | STRATEGY | Big rocks, KPI categories, four themes, four phases | 4 × 25 words | 4 × 45 words | Grid 2 × 2 when bodies run long |
| 15 | Label Rail — 4 Rows | EXPLAIN | Principles, what we know / believe / need to learn, wins / risks / next, assumptions | 3–4 rows × 20 words | 4 rows × 30 words | Split across two slides |
| 16 | Current → Future | COMPARE | Current vs future, before / after, today → tomorrow, current-state → future-state workflow | 2 × 40 words | 2 × 70 words | Two Column |
| 17 | Grid 2 × 2 | EXPLAIN | Four findings, four risks, four segments, 2×2 framework cells | 4 × 25 words | 4 × 40 words | Four Column |
| 18 | Grid 3 × 2 | EXPLAIN | Six capabilities, six pain points, persona traits, initiative snapshots | 6 × 20 words | 6 × 30 words | Table |
| 19 | Process — 5 Steps | EXPLAIN | Linear progression, phased journey, sequence / unlocks, signal → diagnosis → action → outcome, intake → execution | 4–5 steps | 5 steps × 25 words | Timeline, or two rows of steps |
| 20 | Now / Next / Later | PLAN | Now / next / later, horizon model, strategic roadmap, must / should / could | 3–5 items per lane | 6 items per lane | Roadmap Table |
| 21 | Hero Metric | MEASURE | Single metric, hero metric, metric + drivers | 1 number + interpretation | 1 number | KPI Row — 4 for several numbers |
| 22 | KPI Row — 4 | MEASURE | KPI scorecard, multi-metric hero, target vs actual, before / after | 3–4 metrics | 4 metrics | KPI Table above 4 |
| 23 | Chart + Insight | PROVE | Annotated chart, trend, segment performance, adoption / conversion funnel | 1 chart, 1 highlighted series | 1 chart | Chart — Full |
| 24 | Chart — Full | PROVE | Full-width chart: trend, cohort, waterfall, multi-series | 1 chart | 1 chart + 1 annotation | Chart + Insight |
| 25 | Table | COMPARE | Executive, comparison, initiative, KPI, decision, risk and research tables | 5–7 rows × 4–5 columns | 8 rows | Dense — Title + Body |
| 26 | Dense — Title + Body | UPDATE | Purpose-built dense slide: appendix tables, detailed timelines, decision logs | Reference material | Content zone 1760 × 760px | Split into two slides |
| 27 | Quote — Hero | CUSTOMER | Singular quote, quote + implication | ≤ 35 words | 5 lines | Quote Wall — 4 |
| 28 | Quote Wall — 4 | CUSTOMER | Quote wall, voice-of-customer themes, dense quote themes | 4 quotes ≤ 30 words | 4 quotes | Table of themes with one quote each |
| 29 | Screenshot — Hero | EXPLAIN | Product screenshot hero, product concept | 1 screenshot | 1 screenshot | Screenshot + Annotations |
| 30 | Screenshot + Annotations | EXPLAIN | Annotated screenshot, workflow step, before / after product | 3 annotations | 4 annotations | Screenshot — Hero with a caption |
| 31 | Recommendation | DECIDE | Recommendation, decision slide, recommendation + ask, strategic choice | 1 recommendation + 1 decision | 1 recommendation | Options Comparison — 3 first, then this |
| 32 | Options — 3 | DECIDE | Options comparison, strategic choices, tradeoff slide, three-way comparison | 3 options | 3 options × 50 words | Decision Table for 4+ |
| 33 | Closing — Takeaways + Ask | CLOSE | Key takeaways, recommendation + ask, next steps, leadership decisions | 3 asks | 3 × 30 words | Recommendation |
| 34 | Appendix Divider | CLOSE | Appendix divider, Q&A | — | — | — |
| 35 | Blank | EXPLAIN | Free canvas with footer, for one-off working canvases | — | — | — |

## Pattern catalog

Each of the brief’s named patterns maps to a structural layout plus a controlled variant. This is how about 35 masters cover the full catalog without 150 one-offs.

### Opening & navigation

| Pattern | Layout | Variant |
|---|---|---|
| Cover — Minimal | 01 Cover — Minimal | — |
| Cover — Editorial | 02 Cover — Editorial | — |
| Cover — Visual | 03 Cover — Visual | — |
| Executive Summary | 10 Title + Body | or 13 with the answer as the headline |
| Agenda | 04 Agenda | — |
| Agenda — Journey | 19 Process — 5 Steps | steps as sections |
| Section Divider | 05 Section Divider | — |
| Section Divider — Statement | 06 Section Divider — Statement | — |
| Section Map | 04 Agenda | descriptions as the argument of each section |

### Narrative & strategy

| Pattern | Layout | Variant |
|---|---|---|
| Hero Statement | 07 Hero Statement | — |
| Statement + Evidence | 08 Statement + Evidence | — |
| Situation → Implication | 16 Current → Future | relabel Today / Future as Situation / Implication |
| Problem → Opportunity | 11 Two Column | — |
| Why Now | 08 Statement + Evidence | — |
| Market / Context Shift | 16 Current → Future | — |
| Strategic Thesis | 07 Hero Statement | — |
| North Star | 07 Hero Statement | — |
| Vision | 06 Section Divider — Statement | or 07 |
| Strategic Pillars / Big Rocks | 13 Three Column | 14 for four |
| Pillars + Initiatives | 13 Three Column | initiatives as body lines; 25 above five pillars |
| Strategy House | 09 Title Only | nested layers primitive |
| Strategic Cascade | 09 Title Only | hierarchy primitive |
| Strategic Choices | 32 Options — 3 | — |
| Principles | 15 Label Rail — 4 Rows | — |

### Product portfolio & initiatives

| Pattern | Layout | Variant |
|---|---|---|
| Initiative Portfolio | 25 Table | initiative table |
| Pillar → Initiative Map | 25 Table | pillar column + initiative rows |
| Initiative Detail | 15 Label Rail — 4 Rows | problem / bet / measure / risk rows |
| Initiative Snapshot | 18 Grid 3 × 2 | six snapshot cards |
| Portfolio Landscape | 09 Title Only | 2 × 2 primitive |
| Initiative Dependencies | 09 Title Only | swimlane primitive with connectors |
| Enabler Map | 09 Title Only | nested layers |
| Platform / Product Layers | 09 Title Only | nested layers |
| Capability Architecture | 09 Title Only | nested layers or many → one |

### Prioritization & decisions

| Pattern | Layout | Variant |
|---|---|---|
| Ranked Priorities | 25 Table | — |
| Priority Matrix | 09 Title Only | 2 × 2 primitive |
| Weighted Prioritization | 25 Table | numeric columns right-aligned |
| Now / Next / Later | 20 Now / Next / Later | — |
| Must / Should / Could | 20 Now / Next / Later | relabel the three lanes |
| Decision Slide | 31 Recommendation | — |
| Options Comparison | 32 Options — 3 | — |
| Tradeoff Slide | 32 Options — 3 | — |
| Recommendation | 31 Recommendation | — |
| Decision Log | 26 Dense — Title + Body | dense table |
| Open Questions | 15 Label Rail — 4 Rows | — |

### Roadmaps & sequencing

| Pattern | Layout | Variant |
|---|---|---|
| Strategic Roadmap | 20 Now / Next / Later | — |
| Product Roadmap | 09 Title Only | swimlane primitive |
| Phased Journey | 19 Process — 5 Steps | — |
| Maturity Roadmap | 19 Process — 5 Steps | stages as maturity levels |
| Swimlane Roadmap | 09 Title Only | swimlane primitive |
| Milestone Timeline | 09 Title Only | milestone primitive |
| Detailed Timeline | 26 Dense — Title + Body | — |
| Critical Path | 19 Process — 5 Steps | steps + dependency pills |
| Sequence / Unlocks | 19 Process — 5 Steps | — |
| Horizon Model | 20 Now / Next / Later | lanes as horizons |

### Metrics, KPIs & performance

| Pattern | Layout | Variant |
|---|---|---|
| KPI Scorecard | 22 KPI Row — 4 | — |
| Hero Metric | 21 Hero Metric | — |
| Multi-Metric Hero | 22 KPI Row — 4 | — |
| KPI Tree | 09 Title Only | hierarchy primitive |
| Adoption Funnel | 23 Chart + Insight | funnel chart |
| Conversion Funnel | 23 Chart + Insight | funnel chart |
| Adoption Curve | 23 Chart + Insight | line chart |
| Target vs. Actual | 22 KPI Row — 4 | progress bars |
| Trend | 23 Chart + Insight | — |
| Before / After | 16 Current → Future | — |
| Cohort Comparison | 24 Chart — Full | heatmap table |
| Segment Performance | 24 Chart — Full | highlighted bar |
| Metric + Drivers | 21 Hero Metric | drivers in the read rail |
| Measurement Framework | 15 Label Rail — 4 Rows | — |
| Success Framework | 13 Three Column | three outcome families |

### Data visualization

| Pattern | Layout | Variant |
|---|---|---|
| Horizontal Bar | 23 Chart + Insight | — |
| Vertical Bar | 23 Chart + Insight | — |
| Stacked Bar | 24 Chart — Full | — |
| 100% Stacked Bar | 24 Chart — Full | — |
| Line | 23 Chart + Insight | — |
| Multi-Line Trend | 24 Chart — Full | — |
| Area | 24 Chart — Full | only with a zero baseline |
| Dot Plot | 24 Chart — Full | scatter |
| Slope Chart | 24 Chart — Full | two-point line |
| Scatterplot | 24 Chart — Full | — |
| Bubble Chart | 24 Chart — Full | — |
| Waterfall | 24 Chart — Full | stacked with page-colour base |
| Funnel | 23 Chart + Insight | sorted bars |
| Heatmap | 25 Table | table with a single-hue ramp |
| Histogram | 24 Chart — Full | columns, no gap |
| Progress / Bullet Chart | 22 KPI Row — 4 | track + target |
| Variance Chart | 24 Chart — Full | columns ± |
| Cohort Matrix | 25 Table | heatmap table |

### Customer & research

| Pattern | Layout | Variant |
|---|---|---|
| Singular Quote | 27 Quote — Hero | — |
| Quote + Implication | 27 Quote — Hero | — |
| Quote + Evidence | 12 Split 8 + 4 | quote in content, evidence in rail |
| Quote Wall | 28 Quote Wall — 4 | — |
| Dense Quote Themes | 26 Dense — Title + Body | — |
| Voice of Customer Themes | 28 Quote Wall — 4 | — |
| Research Findings | 18 Grid 3 × 2 | — |
| Finding → Evidence → Opportunity | 13 Three Column | three columns |
| Pain Points | 18 Grid 3 × 2 | — |
| Needs / Jobs to Be Done | 15 Label Rail — 4 Rows | — |
| Persona Snapshot | 12 Split 8 + 4 | profile in content, needs in rail |
| Persona Comparison | 25 Table | — |
| Customer Journey | 19 Process — 5 Steps | — |
| Journey Heatmap | 25 Table | stages × dimensions |
| Experience Breakdown | 17 Grid 2 × 2 | — |
| Signal Triangulation | 09 Title Only | many → one |

### Product experience

| Pattern | Layout | Variant |
|---|---|---|
| Product Screenshot — Hero | 29 Screenshot — Hero | — |
| Annotated Screenshot | 30 Screenshot + Annotations | — |
| Before / After Product | 16 Current → Future | screenshots in both columns |
| Product Journey | 19 Process — 5 Steps | — |
| Workflow | 19 Process — 5 Steps | — |
| Current-State Workflow | 19 Process — 5 Steps | — |
| Future-State Workflow | 19 Process — 5 Steps | — |
| Current → Future | 16 Current → Future | — |
| Experience Principles | 15 Label Rail — 4 Rows | — |
| Product Concept | 29 Screenshot — Hero | — |

### Systems, architecture & operating models

| Pattern | Layout | Variant |
|---|---|---|
| Ecosystem Map | 09 Title Only | hub and spoke |
| System Architecture | 09 Title Only | nested layers |
| Platform Model | 09 Title Only | nested layers |
| Operating Model | 15 Label Rail — 4 Rows | — |
| Flywheel | 09 Title Only | loop primitive |
| Feedback Loop | 09 Title Only | loop primitive |
| Governance Model | 09 Title Only | hierarchy |
| Ownership Model | 25 Table | — |
| RACI / Responsibility Matrix | 25 Table | — |
| Intake → Execution | 19 Process — 5 Steps | — |

### Comparison

| Pattern | Layout | Variant |
|---|---|---|
| Side-by-Side | 11 Two Column | — |
| Three-Way Comparison | 32 Options — 3 | — |
| Current vs. Future | 16 Current → Future | — |
| Us vs. Market | 25 Table | — |
| Feature / Capability Matrix | 25 Table | — |
| Pros / Cons | 11 Two Column | — |
| Similarities / Differences | 11 Two Column | — |
| Gap Analysis | 25 Table | — |

### Tables

| Pattern | Layout | Variant |
|---|---|---|
| Executive Table | 25 Table | — |
| Comparison Table | 25 Table | — |
| Initiative Table | 25 Table | — |
| Roadmap Table | 25 Table | — |
| KPI Table | 25 Table | — |
| Decision Table | 25 Table | — |
| Risk Table | 25 Table | — |
| Research Table | 25 Table | — |
| Dense Appendix Table | 26 Dense — Title + Body | — |

### Risks, dependencies & planning

| Pattern | Layout | Variant |
|---|---|---|
| Risks | 17 Grid 2 × 2 | — |
| Risk Matrix | 09 Title Only | 2 × 2 |
| Dependencies | 25 Table | — |
| Assumptions | 15 Label Rail — 4 Rows | — |
| Constraints | 15 Label Rail — 4 Rows | — |
| Blockers | 17 Grid 2 × 2 | — |
| Dependencies + Decisions | 12 Split 8 + 4 | dependencies in content, decisions in rail |

### Execution & status

| Pattern | Layout | Variant |
|---|---|---|
| Status Summary | 25 Table | status column |
| Workstream Status | 25 Table | — |
| Progress to Plan | 22 KPI Row — 4 | progress bars |
| Completed / In Progress / Next | 20 Now / Next / Later | relabel lanes |
| Wins / Risks / Next | 15 Label Rail — 4 Rows | — |
| Milestone Status | 09 Title Only | milestone primitive |
| Launch Readiness | 25 Table | — |

### Workshops & working sessions

| Pattern | Layout | Variant |
|---|---|---|
| Discussion Question | 07 Hero Statement | — |
| Workshop Prompt | 07 Hero Statement | — |
| Hypotheses | 15 Label Rail — 4 Rows | — |
| What We Know / Believe / Need to Learn | 15 Label Rail — 4 Rows | — |
| Parking Lot | 35 Blank | — |
| Decisions Needed Today | 31 Recommendation | — |
| Working Canvas | 35 Blank | — |

### Closing

| Pattern | Layout | Variant |
|---|---|---|
| Key Takeaways | 33 Closing — Takeaways + Ask | — |
| Recommendation + Ask | 33 Closing — Takeaways + Ask | — |
| Next Steps | 33 Closing — Takeaways + Ask | — |
| Leadership Decisions | 31 Recommendation | — |
| Closing Statement | 06 Section Divider — Statement | — |
| Q&A | 34 Appendix Divider | — |
| Appendix Divider | 34 Appendix Divider | — |

## Components

- **Pills:** 28 px high, 12 px side padding, full radius, Mono 7.5 pt caps. Widths are computed from the monospaced label, so they never need hand resizing. Keep labels to 18 characters or fewer.
  - Variants: category, info, positive, warning, negative, neutral, strong, outline.
- **Status:** shape and colour together, so it survives grayscale and colour-blindness:
  - On track ● · At risk ▲ · Off track ■ · Complete ✓ · Not started ○
- **Deltas:** a direction glyph and a sign, as well as colour.
- **Cards:** one anatomy (eyebrow → title → optional metric → body → optional footer) with 24 px padding. Four treatments:
  - **rule:** the default for peers
  - **surface:** grouped content on #E9EEF3
  - **emphasis:** the one recommended pick, never the last step of a sequence
  - **dark:** a decision the room must make
- **Semantic cards:** metric, insight, recommendation, risk, initiative, evidence, pain point and quote. The same job always wears the same card.
- **Annotation:** number markers, a 1 pt True Blue connector with an arrowhead, a dashed reference line, timeline markers (done / next / planned / gate) and callouts that sit beside the UI, never on it.

## Charts and tables

- **Choosing a chart:** start with the insight. Bars rank, lines trend, dot plots compare precisely, heatmaps show patterns, waterfalls show contribution. Never 3D.
- **Emphasis:** highlight one series in True Blue and mute the rest in #C3C6CD. Prefer direct labels to legends.
- **Remove:** gridlines, borders, tick marks and extra decimals. Every chart has a source zone and a so-what zone.
- **Tables:** header in Mono caps with a 1 pt rule under it, hairline rows and no vertical lines.
  - Narrative columns get the width; numbers are right-aligned; status sits in the cell as a glyph.
  - Use the dense table (layout 26) for appendix material.

## QA before a deck goes out

- **Three-second test:** is the message clear at a glance?
- **Swap test:** can the content change without redesign?
- **Stress test:** does it hold with long headlines and dense content?
- **Export test:** does it still hold as PDF and in PowerPoint on another machine?
- **System test:** does every slide belong to the same family?
- **Editability test:** are the objects native and logically grouped?
- **Accessibility test:** do contrast, labels and non-colour cues hold up?

## Known limits

- **Rendering:** this build was rendered and checked in LibreOffice with Everyday Sans installed under the names in the file. It has not been opened in desktop PowerPoint, so check one of each layout family there before rolling it out.
- **Example content:** all example numbers are illustrative and every example slide says so in its source zone. Replace them before use.
- **Placeholder formatting:** it is set on the layouts. Pasting formatted text can override it; paste with Keep Text Only.
