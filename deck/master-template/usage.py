"""Generate USAGE.md from build-map.json plus the pattern catalog below."""
import json, pathlib
here = pathlib.Path(__file__).parent
M = json.loads((here / 'build-map.json').read_text())['masters']

# The brief's named patterns → layout number and the variant that carries it.
CATALOG = {
 'Opening & navigation': [('Cover — Minimal','01',''),('Cover — Editorial','02',''),('Cover — Visual','03',''),('Executive Summary','10','or 13 with the answer as the headline'),('Agenda','04',''),('Agenda — Journey','19','steps as sections'),('Section Divider','05',''),('Section Divider — Statement','06',''),('Section Map','04','descriptions as the argument of each section')],
 'Narrative & strategy': [('Hero Statement','07',''),('Statement + Evidence','08',''),('Situation → Implication','16','relabel Today / Future as Situation / Implication'),('Problem → Opportunity','11',''),('Why Now','08',''),('Market / Context Shift','16',''),('Strategic Thesis','07',''),('North Star','07',''),('Vision','06','or 07'),('Strategic Pillars / Big Rocks','13','14 for four'),('Pillars + Initiatives','13','initiatives as body lines; 25 above five pillars'),('Strategy House','09','nested layers primitive'),('Strategic Cascade','09','hierarchy primitive'),('Strategic Choices','32',''),('Principles','15','')],
 'Product portfolio & initiatives': [('Initiative Portfolio','25','initiative table'),('Pillar → Initiative Map','25','pillar column + initiative rows'),('Initiative Detail','15','problem / bet / measure / risk rows'),('Initiative Snapshot','18','six snapshot cards'),('Portfolio Landscape','09','2 × 2 primitive'),('Initiative Dependencies','09','swimlane primitive with connectors'),('Enabler Map','09','nested layers'),('Platform / Product Layers','09','nested layers'),('Capability Architecture','09','nested layers or many → one')],
 'Prioritization & decisions': [('Ranked Priorities','25',''),('Priority Matrix','09','2 × 2 primitive'),('Weighted Prioritization','25','numeric columns right-aligned'),('Now / Next / Later','20',''),('Must / Should / Could','20','relabel the three lanes'),('Decision Slide','31',''),('Options Comparison','32',''),('Tradeoff Slide','32',''),('Recommendation','31',''),('Decision Log','26','dense table'),('Open Questions','15','')],
 'Roadmaps & sequencing': [('Strategic Roadmap','20',''),('Product Roadmap','09','swimlane primitive'),('Phased Journey','19',''),('Maturity Roadmap','19','stages as maturity levels'),('Swimlane Roadmap','09','swimlane primitive'),('Milestone Timeline','09','milestone primitive'),('Detailed Timeline','26',''),('Critical Path','19','steps + dependency pills'),('Sequence / Unlocks','19',''),('Horizon Model','20','lanes as horizons')],
 'Metrics, KPIs & performance': [('KPI Scorecard','22',''),('Hero Metric','21',''),('Multi-Metric Hero','22',''),('KPI Tree','09','hierarchy primitive'),('Adoption Funnel','23','funnel chart'),('Conversion Funnel','23','funnel chart'),('Adoption Curve','23','line chart'),('Target vs. Actual','22','progress bars'),('Trend','23',''),('Before / After','16',''),('Cohort Comparison','24','heatmap table'),('Segment Performance','24','highlighted bar'),('Metric + Drivers','21','drivers in the read rail'),('Measurement Framework','15',''),('Success Framework','13','three outcome families')],
 'Data visualization': [('Horizontal Bar','23',''),('Vertical Bar','23',''),('Stacked Bar','24',''),('100% Stacked Bar','24',''),('Line','23',''),('Multi-Line Trend','24',''),('Area','24','only with a zero baseline'),('Dot Plot','24','scatter'),('Slope Chart','24','two-point line'),('Scatterplot','24',''),('Bubble Chart','24',''),('Waterfall','24','stacked with page-colour base'),('Funnel','23','sorted bars'),('Heatmap','25','table with a single-hue ramp'),('Histogram','24','columns, no gap'),('Progress / Bullet Chart','22','track + target'),('Variance Chart','24','columns ±'),('Cohort Matrix','25','heatmap table')],
 'Customer & research': [('Singular Quote','27',''),('Quote + Implication','27',''),('Quote + Evidence','12','quote in content, evidence in rail'),('Quote Wall','28',''),('Dense Quote Themes','26',''),('Voice of Customer Themes','28',''),('Research Findings','18',''),('Finding → Evidence → Opportunity','13','three columns'),('Pain Points','18',''),('Needs / Jobs to Be Done','15',''),('Persona Snapshot','12','profile in content, needs in rail'),('Persona Comparison','25',''),('Customer Journey','19',''),('Journey Heatmap','25','stages × dimensions'),('Experience Breakdown','17',''),('Signal Triangulation','09','many → one')],
 'Product experience': [('Product Screenshot — Hero','29',''),('Annotated Screenshot','30',''),('Before / After Product','16','screenshots in both columns'),('Product Journey','19',''),('Workflow','19',''),('Current-State Workflow','19',''),('Future-State Workflow','19',''),('Current → Future','16',''),('Experience Principles','15',''),('Product Concept','29','')],
 'Systems, architecture & operating models': [('Ecosystem Map','09','hub and spoke'),('System Architecture','09','nested layers'),('Platform Model','09','nested layers'),('Operating Model','15',''),('Flywheel','09','loop primitive'),('Feedback Loop','09','loop primitive'),('Governance Model','09','hierarchy'),('Ownership Model','25',''),('RACI / Responsibility Matrix','25',''),('Intake → Execution','19','')],
 'Comparison': [('Side-by-Side','11',''),('Three-Way Comparison','32',''),('Current vs. Future','16',''),('Us vs. Market','25',''),('Feature / Capability Matrix','25',''),('Pros / Cons','11',''),('Similarities / Differences','11',''),('Gap Analysis','25','')],
 'Tables': [('Executive Table','25',''),('Comparison Table','25',''),('Initiative Table','25',''),('Roadmap Table','25',''),('KPI Table','25',''),('Decision Table','25',''),('Risk Table','25',''),('Research Table','25',''),('Dense Appendix Table','26','')],
 'Risks, dependencies & planning': [('Risks','17',''),('Risk Matrix','09','2 × 2'),('Dependencies','25',''),('Assumptions','15',''),('Constraints','15',''),('Blockers','17',''),('Dependencies + Decisions','12','dependencies in content, decisions in rail')],
 'Execution & status': [('Status Summary','25','status column'),('Workstream Status','25',''),('Progress to Plan','22','progress bars'),('Completed / In Progress / Next','20','relabel lanes'),('Wins / Risks / Next','15',''),('Milestone Status','09','milestone primitive'),('Launch Readiness','25','')],
 'Workshops & working sessions': [('Discussion Question','07',''),('Workshop Prompt','07',''),('Hypotheses','15',''),('What We Know / Believe / Need to Learn','15',''),('Parking Lot','35',''),('Decisions Needed Today','31',''),('Working Canvas','35','')],
 'Closing': [('Key Takeaways','33',''),('Recommendation + Ask','33',''),('Next Steps','33',''),('Leadership Decisions','31',''),('Closing Statement','06',''),('Q&A','34',''),('Appendix Divider','34','')],
}
by_no = {m['name'][:2]: m for m in M}
L = ['# Product Leadership Presentation System — usage guide', '',
 'The master template for strategy, research, planning, performance and decision decks, built on the Advertiser Experience deck’s visual language. **The thinking changes. The design system does not.**', '',
 '| File | What it is |', '|---|---|',
 '| `Product-Leadership-Master-Template.pptx` | The master plus 64 system slides: foundations, layout picker, one worked example per layout, and the component, chart, table and diagram libraries. |',
 '| `Product-Leadership-Master-Template.potx` | The same package as a PowerPoint template: opening it starts a new, untitled deck. |',
 '| `system.js` · `masters.js` · `components.js` · `build.js` | The single source for every coordinate, style, colour and component. |',
 '| `make.sh` | Rebuilds both files: build → post-process → render thumbnails → rebuild → post-process. |', '',
 '## How to use it', '',
 '1. **Choose the job.** START, TELL, PROVE, EXPLAIN, CUSTOMER, STRATEGY, PRIORITIZE, DECIDE, PLAN, MEASURE, COMPARE, OPERATE, UPDATE, CLOSE (slide 10).',
 '2. **Pick the layout** in Home → New Slide. Layouts are numbered 01–35 and every slot is a named placeholder.',
 '3. **Replace the content.** For components, charts and diagrams, duplicate the matching library slide and edit it; don’t redraw.',
 '4. **When it doesn’t fit:** tighten the copy → use the dense layout (26) → change layout → split the slide → only then reduce type, within the minimums. Never shrink until it fits.', '',
 '## Foundations', '',
 '- **Canvas:** 13.333 × 7.5 in (16:9), authored on a 1920 × 1080 px grid (1 px = 1/144 in).',
 '- **Content frame:** x = 80 → 1840 px, with 12 columns (117.3 px) and 32 px gutters. Supported splits: 12 · 8+4 · 7+5 · 6+6 · 4+4+4 · 3+3+3+3 · 3+9 · 2+10.',
 '- **Zones:**',
 '  - context (eyebrow and section marker) at y 72',
 '  - title, bottom-anchored, at 112–264',
 '  - subtitle at 272–344',
 '  - content at 384–944',
 '  - source at 952',
 '  - footer (Spark, deck name, slide number) at 1008',
 '  - dense layouts: title at 88–152, content at 184–944',
 '- **Spacing:** 4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 · 96 px.',
 '- **Radii:** full for pills, 12 px for cards and panels, 24 px for hero containers.',
 '- **Lines:** 0.75 pt hairline · 1 pt rule · 1.5 pt emphasis.',
 '- **Colour roles:**',
 '  - Primary #001E60 · Secondary #0053E2 · Accent #4DBDF5 (dark grounds only)',
 '  - Background #F5F6F8 · Surface #FFFFFF · Surface alt #E9EEF3 · Border #DEE1E6',
 '  - Text #001E60 / #3D4A63 / #5E636E',
 '  - Positive #128A08 · Warning #B25E00 · Negative #DE1C24 · Info #0053E2',
 '  - These are also written into the PowerPoint theme, so new charts and shapes pick them up.',
 '- **Type:** Everyday Sans (Headline Light, UI, UI Medium, Light Italic, Mono), 24 semantic styles; see slide 5.',
 '  - Minimum 10 pt for reading text; 7.5 pt only for mono labels and pills.',
 '  - The file names the desktop families; if your PowerPoint lists them differently, change `FONT` in `system.js` and run `make.sh`.', '',
 '## Layouts', '', '| # | Layout | Job | Use it for | Ideal | Max | Fallback |', '|---|---|---|---|---|---|---|']
for m in M:
    L.append(f"| {m['name'][:2]} | {m['name'][3:]} | {m['job']} | {m['use']} | {m['ideal']} | {m['max']} | {m['fallback']} |")
L += ['', '## Pattern catalog', '', 'Each of the brief’s named patterns maps to a structural layout plus a controlled variant. This is how about 35 masters cover the full catalog without 150 one-offs.', '']
for sec, rows in CATALOG.items():
    L += [f'### {sec}', '', '| Pattern | Layout | Variant |', '|---|---|---|']
    for p, no, v in rows:
        L.append(f"| {p} | {no} {by_no[no]['name'][3:]} | {v or '—'} |")
    L.append('')
L += ['## Components', '',
 '- **Pills:** 28 px high, 12 px side padding, full radius, Mono 7.5 pt caps. Widths are computed from the monospaced label, so they never need hand resizing. Keep labels to 18 characters or fewer.',
 '  - Variants: category, info, positive, warning, negative, neutral, strong, outline.',
 '- **Status:** shape and colour together, so it survives grayscale and colour-blindness:',
 '  - On track ● · At risk ▲ · Off track ■ · Complete ✓ · Not started ○',
 '- **Deltas:** a direction glyph and a sign, as well as colour.',
 '- **Cards:** one anatomy (eyebrow → title → optional metric → body → optional footer) with 24 px padding. Four treatments:',
 '  - **rule:** the default for peers',
 '  - **surface:** grouped content on #E9EEF3',
 '  - **emphasis:** the one recommended pick, never the last step of a sequence',
 '  - **dark:** a decision the room must make',
 '- **Semantic cards:** metric, insight, recommendation, risk, initiative, evidence, pain point and quote. The same job always wears the same card.',
 '- **Annotation:** number markers, a 1 pt True Blue connector with an arrowhead, a dashed reference line, timeline markers (done / next / planned / gate) and callouts that sit beside the UI, never on it.', '',
 '## Charts and tables', '',
 '- **Choosing a chart:** start with the insight. Bars rank, lines trend, dot plots compare precisely, heatmaps show patterns, waterfalls show contribution. Never 3D.',
 '- **Emphasis:** highlight one series in True Blue and mute the rest in #C3C6CD. Prefer direct labels to legends.',
 '- **Remove:** gridlines, borders, tick marks and extra decimals. Every chart has a source zone and a so-what zone.',
 '- **Tables:** header in Mono caps with a 1 pt rule under it, hairline rows and no vertical lines.',
 '  - Narrative columns get the width; numbers are right-aligned; status sits in the cell as a glyph.',
 '  - Use the dense table (layout 26) for appendix material.', '',
 '## QA before a deck goes out', '',
 '- **Three-second test:** is the message clear at a glance?',
 '- **Swap test:** can the content change without redesign?',
 '- **Stress test:** does it hold with long headlines and dense content?',
 '- **Export test:** does it still hold as PDF and in PowerPoint on another machine?',
 '- **System test:** does every slide belong to the same family?',
 '- **Editability test:** are the objects native and logically grouped?',
 '- **Accessibility test:** do contrast, labels and non-colour cues hold up?', '',
 '## Known limits', '',
 '- **Rendering:** this build was rendered and checked in LibreOffice with Everyday Sans installed under the names in the file. It has not been opened in desktop PowerPoint, so check one of each layout family there before rolling it out.',
 '- **Example content:** all example numbers are illustrative and every example slide says so in its source zone. Replace them before use.',
 '- **Placeholder formatting:** it is set on the layouts. Pasting formatted text can override it; paste with Keep Text Only.']
(here / 'USAGE.md').write_text('\n'.join(L) + '\n')
print('USAGE.md', len(L), 'lines')
