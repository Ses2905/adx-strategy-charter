// Layer 3 · Compositions — the structural masters.
// Every master is a real PowerPoint slide layout with named placeholders, so a
// user picks it from New Slide and types; nothing is positioned by hand.
const { PX, FONT, C, G, col, Z, style, LW, box } = require('./system');

// ── placeholder + chrome builders ───────────────────────────────────────────
let _n = 0;
const ph = (name, type, x, y, w, h, st, prompt, extra = {}) => ({
  placeholder: {
    options: { name, type, ...box(x, y, w, h), margin: 0, valign: 'top', align: 'left', ...style(st), ...extra },
    text: prompt,
  },
});
const rect = (x, y, w, h, fill, extra = {}) => ({ rect: { ...box(x, y, w, h), fill: { color: fill }, line: { type: 'none' }, ...extra } });
const rule = (x, y, w, color, width = LW.hair) => ({ line: { ...box(x, y, w, 0), line: { color, width } } });
const vrule = (x, y, h, color, width = LW.hair) => ({ line: { ...box(x, y, 0, h), line: { color, width } } });
const sText = (text, x, y, w, h, st, extra = {}) => ({ text: { text, options: { ...box(x, y, w, h), margin: 0, valign: 'top', ...style(st), ...extra } } });

// Masters record their placeholder names so example slides can be checked against them.
function chrome(dark, spark, { context = true, footer = true } = {}) {
  const o = [];
  const lab = dark ? C.accent : C.secondary;
  if (context) {
    o.push(ph('eyebrow', 'body', G.left, Z.context.y, 1100, Z.context.h, 'eyebrow', 'EYEBROW · CONTEXT LABEL', { color: lab }));
    o.push(ph('section', 'body', G.right - 600, Z.context.y, 600, Z.context.h, 'label', 'SECTION NAME', { color: dark ? C.onDark2 : C.muted, align: 'right' }));
  }
  if (footer) {
    o.push({ image: { ...box(G.left, Z.footer.y + 4, 22, 22), data: dark ? spark.white : spark.blue } });
    o.push(sText('Walmart Ads', G.left + 34, Z.footer.y + 6, 600, 20, 'source', { color: dark ? C.onDark2 : C.muted }));
  }
  return o;
}
const slideNumber = (dark) => ({ ...box(G.right - 200, Z.footer.y + 6, 200, 20), fontFace: FONT.mono, fontSize: 8, color: dark ? C.onDark2 : C.muted, align: 'right' });

function header(dark, { subtitle = true, dense = false } = {}) {
  const ink = dark ? C.surface : C.text;
  if (dense) return [ph('title', 'title', G.left, Z.dense.title.y, G.width, Z.dense.title.h, 'denseHead', 'Dense headline states the takeaway in one line', { color: ink, valign: 'bottom' })];
  const o = [ph('title', 'title', G.left, Z.title.y, 1560, Z.title.h, 'headline', 'Headline states the takeaway, not the topic', { color: ink, valign: 'bottom' })];
  if (subtitle) o.push(ph('subtitle', 'body', G.left, Z.subtitle.y, 1240, Z.subtitle.h, 'bodyL', 'Optional supporting line: context, scope or the one fact the headline rests on.', { color: dark ? C.onDark2 : C.text2 }));
  return o;
}
const source = (dark) => ph('source', 'body', G.left, Z.source.y, G.width, Z.source.h, 'source', 'Source: name, date range, sample size. Delete if not needed.', { color: dark ? C.onDark2 : C.muted, valign: 'bottom' });

// Column module: rule → label → title → body. The deck's peer-row grammar.
function module_(k, c, y, h, { ruleColor = C.secondary, titleStyle = 'supporting', bodyStyle = 'body', titleLines = 2 } = {}) {
  const tH = Math.round(titleStyle === 'supporting' ? 36 * titleLines : 30 * titleLines);
  return [
    rule(c.x, y, c.w, ruleColor, LW.strong),
    ph(`${k}_label`, 'body', c.x, y + 16, c.w, 20, 'label', 'LABEL', { color: ruleColor === C.borderStrong ? C.muted : C.secondary }),
    ph(`${k}_title`, 'body', c.x, y + 44, c.w, tH, titleStyle, 'Module title', { color: C.text }),
    ph(`${k}_body`, 'body', c.x, y + 52 + tH, c.w, h - (52 + tH), bodyStyle, 'One to three sentences. Keep peers to the same length so the row stays even.', { color: C.text2 }),
  ];
}
// Surface card: quiet fill, medium radius, fixed padding.
function card(k, x, y, w, h) {
  const p = 24;
  return [
    { rect: { ...box(x, y, w, h), fill: { color: C.surfaceAlt }, line: { type: 'none' }, rectRadius: PX(12) } },
    ph(`${k}_label`, 'body', x + p, y + p, w - 2 * p, 20, 'label', 'LABEL', { color: C.secondary }),
    ph(`${k}_title`, 'body', x + p, y + p + 28, w - 2 * p, 60, 'cardTitle', 'Card title, one line ideally', { color: C.text }),
    ph(`${k}_body`, 'body', x + p, y + p + 92, w - 2 * p, h - 2 * p - 92, 'cardBody', 'Two or three lines of supporting detail. Same anatomy on every card.', { color: C.text2 }),
  ];
}

// ── the catalog ─────────────────────────────────────────────────────────────
// job: the communication job it serves (layout picker). ideal/max/fallback: smart
// layout behaviour. patterns: the brief's named patterns this master carries.
function masters(spark) {
  const L = [];
  const add = (m) => { L.push(m); return m; };
  const lightBase = (o) => [...chrome(false, spark), ...o];
  const darkBase = (o) => [...chrome(true, spark), ...o];

  add({ name: '01 Cover — Minimal', dark: true, job: 'START', use: 'Deck cover on a dark ground', ideal: 'Title ≤ 12 words', max: '3 title lines', fallback: 'Cover — Editorial for longer titles',
    objects: darkBase([
      ph('title', 'title', G.left, 360, 1400, 300, 'display', 'Presentation title states the point of the deck', { color: C.surface, valign: 'bottom' }),
      ph('subtitle', 'body', G.left, 684, 1100, 100, 'bodyL', 'One line on what this deck is for and who it is for.', { color: C.onDark2 }),
      ph('meta', 'body', G.left, 880, 1100, 24, 'label', 'PRESENTER · TEAM · MONTH YEAR', { color: C.accent }),
    ]).filter((o) => !(o.placeholder && o.placeholder.options.name === 'section')) });

  add({ name: '02 Cover — Editorial', dark: false, job: 'START', use: 'Cover for a document-style or leave-behind deck', ideal: 'Title ≤ 14 words', max: '3 title lines', fallback: 'Cover — Minimal',
    objects: lightBase([
      ph('title', 'title', G.left, 220, 1500, 380, 'display', 'Presentation title states the point of the deck', { color: C.text, valign: 'bottom', fontSize: 52 }),
      rule(G.left, 632, G.width, C.secondary, LW.strong),
      ph('subtitle', 'body', col(0, 7).x, 660, col(0, 7).w, 120, 'bodyL', 'One or two lines on what this deck is for and what you need from the room.', { color: C.text2 }),
      ph('meta', 'body', col(8, 4).x, 660, col(8, 4).w, 60, 'label', 'PRESENTER · TEAM\nMONTH YEAR', { color: C.secondary, align: 'right' }),
    ]).filter((o) => !(o.placeholder && o.placeholder.options.name === 'section')) });

  add({ name: '03 Cover — Visual', dark: true, job: 'START', use: 'Cover led by a product image or screenshot', ideal: 'Title ≤ 10 words', max: '3 title lines', fallback: 'Cover — Minimal',
    objects: [
      ...darkBase([]).filter((o) => !(o.placeholder && o.placeholder.options.name === 'section')),
      ph('picture', 'pic', 1040, 0, 880, 1080, 'body', 'Drop a product image here', {}),
      ph('title', 'title', G.left, 360, 860, 300, 'display', 'Title states the point of the deck', { color: C.surface, valign: 'bottom', fontSize: 40 }),
      ph('subtitle', 'body', G.left, 684, 820, 100, 'bodyL', 'One line on what this deck is for.', { color: C.onDark2 }),
      ph('meta', 'body', G.left, 880, 820, 24, 'label', 'PRESENTER · MONTH YEAR', { color: C.accent }),
    ] });

  add({ name: '04 Agenda', dark: false, job: 'START', use: 'Agenda, content map, section map', ideal: '4–6 items', max: '6 rows', fallback: 'Agenda in two slides, or Label Rail for 4',
    objects: lightBase([
      ...header(false, { subtitle: false }),
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => {
        const y = Z.content.y + i * 92;
        return [
          rule(G.left, y, G.width, C.border),
          ph(`n${i + 1}`, 'body', col(0, 1).x, y + 22, col(0, 1).w, 48, 'supporting', `0${i + 1}`, { color: C.secondary, fontSize: 24 }),
          ph(`t${i + 1}`, 'body', col(1, 4).x, y + 26, col(1, 4).w, 40, 'supporting', 'Section name', { color: C.text }),
          ph(`d${i + 1}`, 'body', col(5, 7).x, y + 30, col(5, 7).w, 48, 'body', 'What this section answers, in one line.', { color: C.text2 }),
        ];
      }),
    ]) });

  add({ name: '05 Section Divider', dark: true, job: 'START', use: 'Section transition that carries the section’s argument', ideal: 'Name ≤ 5 words, argument ≤ 20', max: '2 title lines', fallback: 'Section Divider — Statement',
    objects: darkBase([
      ph('number', 'body', G.left, 380, 800, 24, 'label', 'SECTION 01', { color: C.accent }),
      ph('title', 'title', G.left, 420, 1500, 190, 'sectionHead', 'Section name', { color: C.surface, fontSize: 56 }),
      ph('subtitle', 'body', G.left, 640, 1100, 110, 'supporting', 'The section’s argument in one sentence.', { color: C.onDark2 }),
    ]).filter((o) => !(o.placeholder && o.placeholder.options.name === 'eyebrow')) });

  add({ name: '06 Section Divider — Statement', dark: true, bg: C.secondary, job: 'START', use: 'Transition that lands a statement, visual rest', ideal: '≤ 18 words', max: '4 lines', fallback: 'Hero Statement',
    objects: [
      ...chrome(true, spark).filter((o) => !(o.placeholder && o.placeholder.options.name === 'eyebrow')),
      ph('number', 'body', G.left, 300, 800, 24, 'label', 'SECTION 02', { color: C.surface }),
      ph('title', 'title', G.left, 340, 1500, 400, 'display', 'A statement that turns the argument toward what comes next.', { color: C.surface, fontSize: 48 }),
    ] });

  add({ name: '07 Hero Statement', dark: false, job: 'TELL', use: 'Hero statement, big question, key takeaway, north star, vision line', ideal: '≤ 20 words', max: '4 lines at 36pt', fallback: 'Statement + Evidence',
    objects: lightBase([
      ph('title', 'title', G.left, 280, col(0, 10).w, 420, 'statement', 'One idea, stated plainly enough that the room could repeat it.', { color: C.text, fontSize: 40, valign: 'bottom' }),
      rule(G.left, 728, col(0, 10).w, C.secondary, LW.strong),
      ph('subtitle', 'body', G.left, 752, col(0, 8).w, 100, 'bodyL', 'Supporting line: why it matters or what it changes.', { color: C.text2 }),
      source(false),
    ]) });

  add({ name: '08 Statement + Evidence', dark: false, job: 'PROVE', use: 'Statement + evidence, situation → implication, why now', ideal: '1 claim + 3 proof points', max: '3 evidence items', fallback: 'KPI Row — 4',
    objects: lightBase([
      ...header(false),
      ph('claim', 'body', col(0, 6).x, Z.content.y, col(0, 6).w, 300, 'statement', 'The claim, in one or two sentences.', { color: C.text, fontSize: 28 }),
      ph('claim_body', 'body', col(0, 6).x, Z.content.y + 320, col(0, 6).w, 200, 'body', 'What the evidence means together. Interpretation, not a restatement of the numbers.', { color: C.text2 }),
      ...[0, 1, 2].flatMap((i) => {
        const c = col(7, 5); const y = Z.content.y + i * 184;
        return [
          rule(c.x, y, c.w, C.secondary, LW.strong),
          ph(`e${i + 1}_value`, 'body', c.x, y + 20, c.w, 64, 'data', '00%', { color: C.secondary }),
          ph(`e${i + 1}_label`, 'body', c.x, y + 92, c.w, 60, 'bodyS', 'What the number measures, and for whom.', { color: C.text2 }),
        ];
      }),
      source(false),
    ]) });

  add({ name: '09 Title Only', dark: false, job: 'EXPLAIN', use: 'Workhorse for diagrams, charts, components and infographic primitives', ideal: 'One diagram', max: 'Content zone 1760 × 560px', fallback: 'Split 8 + 4 when the diagram needs a so-what',
    objects: lightBase([...header(false), source(false)]) });

  add({ name: '10 Title + Body', dark: false, job: 'TELL', use: 'Narrative prose, executive summary text, context', ideal: '60–90 words', max: '8 lines', fallback: 'Label Rail — 4 Rows to break prose into claims',
    objects: lightBase([...header(false),
      ph('body', 'body', col(0, 9).x, Z.content.y, col(0, 9).w, Z.content.h, 'bodyL', 'Body text at a readable measure. Nine columns wide on purpose: the container aligns to the grid, the text stops before the line gets too long.', { color: C.text2 }),
      source(false)]) });

  add({ name: '11 Two Column', dark: false, job: 'COMPARE', use: 'Side-by-side, problem → opportunity, pros / cons, similarities / differences', ideal: '2 × 40 words', max: '2 × 70 words', fallback: 'Comparison Table',
    objects: lightBase([...header(false), ...module_('c1', col(0, 6), Z.content.y, 520), ...module_('c2', col(6, 6), Z.content.y, 520), source(false)]) });

  add({ name: '12 Split 8 + 4', dark: false, job: 'PROVE', use: 'Content + so-what: chart, screenshot, table or diagram with interpretation', ideal: '1 visual + 40-word read', max: 'Rail 80 words', fallback: 'Chart — Full with annotation',
    objects: lightBase([...header(false),
      ph('content', 'body', col(0, 8).x, Z.content.y, col(0, 8).w, Z.content.h, 'body', 'Main content: paste a chart, table, screenshot or diagram here.', { color: C.muted }),
      rule(col(8, 4).x, Z.content.y, col(8, 4).w, C.secondary, LW.strong),
      ph('rail_label', 'body', col(8, 4).x, Z.content.y + 16, col(8, 4).w, 20, 'label', 'SO WHAT', { color: C.secondary }),
      ph('rail_title', 'body', col(8, 4).x, Z.content.y + 44, col(8, 4).w, 160, 'supporting', 'The interpretation in one sentence.', { color: C.text }),
      ph('rail_body', 'body', col(8, 4).x, Z.content.y + 220, col(8, 4).w, 310, 'body', 'Why it matters and what to do about it.', { color: C.text2 }),
      source(false)]) });

  add({ name: '13 Three Column', dark: false, job: 'STRATEGY', use: 'Strategic pillars, themes, recommendations, options, research findings, principles', ideal: '3 × 30 words', max: '3 × 60 words', fallback: 'Four Column for 4; Pillars + Initiatives above 5',
    objects: lightBase([...header(false), ...[0, 1, 2].flatMap((i) => module_(`c${i + 1}`, col(i * 4, 4), Z.content.y, 520)), source(false)]) });

  add({ name: '14 Four Column', dark: false, job: 'STRATEGY', use: 'Big rocks, KPI categories, four themes, four phases', ideal: '4 × 25 words', max: '4 × 45 words', fallback: 'Grid 2 × 2 when bodies run long',
    objects: lightBase([...header(false), ...[0, 1, 2, 3].flatMap((i) => module_(`c${i + 1}`, col(i * 3, 3), Z.content.y, 520)), source(false)]) });

  add({ name: '15 Label Rail — 4 Rows', dark: false, job: 'EXPLAIN', use: 'Principles, what we know / believe / need to learn, wins / risks / next, assumptions', ideal: '3–4 rows × 20 words', max: '4 rows × 30 words', fallback: 'Split across two slides',
    objects: lightBase([...header(false), ...[0, 1, 2, 3].flatMap((i) => {
      const y = Z.content.y + i * 138;
      return [
        rule(G.left, y, G.width, i === 0 ? C.secondary : C.border, i === 0 ? LW.strong : LW.hair),
        ph(`r${i + 1}_label`, 'body', col(0, 3).x, y + 22, col(0, 3).w, 20, 'label', 'ROW LABEL', { color: C.secondary }),
        ph(`r${i + 1}_text`, 'body', col(3, 9).x, y + 16, col(3, 9).w, 110, 'supporting', 'A statement for this row. One claim, not a paragraph.', { color: C.text }),
      ];
    }), source(false)]) });

  add({ name: '16 Current → Future', dark: false, job: 'COMPARE', use: 'Current vs future, before / after, today → tomorrow, current-state → future-state workflow', ideal: '2 × 40 words', max: '2 × 70 words', fallback: 'Two Column',
    objects: lightBase([...header(false),
      ...module_('now', col(0, 5), Z.content.y, 520, { ruleColor: C.borderStrong }),
      { text: { text: '→', options: { ...box(col(5, 2).x, Z.content.y + 180, col(5, 2).w, 120), align: 'center', valign: 'middle', fontFace: FONT.ui, fontSize: 40, color: C.secondary, margin: 0 } } },
      ...module_('next', col(7, 5), Z.content.y, 520),
      source(false)]) });

  add({ name: '17 Grid 2 × 2', dark: false, job: 'EXPLAIN', use: 'Four findings, four risks, four segments, 2×2 framework cells', ideal: '4 × 25 words', max: '4 × 40 words', fallback: 'Four Column',
    objects: lightBase([...header(false), ...[0, 1, 2, 3].flatMap((i) => card(`g${i + 1}`, col((i % 2) * 6, 6).x, Z.content.y + Math.floor(i / 2) * 284, col(0, 6).w, 268)), source(false)]) });

  add({ name: '18 Grid 3 × 2', dark: false, job: 'EXPLAIN', use: 'Six capabilities, six pain points, persona traits, initiative snapshots', ideal: '6 × 20 words', max: '6 × 30 words', fallback: 'Table',
    objects: lightBase([...header(false), ...[0, 1, 2, 3, 4, 5].flatMap((i) => card(`g${i + 1}`, col((i % 3) * 4, 4).x, Z.content.y + Math.floor(i / 3) * 284, col(0, 4).w, 268)), source(false)]) });

  add({ name: '19 Process — 5 Steps', dark: false, job: 'EXPLAIN', use: 'Linear progression, phased journey, sequence / unlocks, signal → diagnosis → action → outcome, intake → execution', ideal: '4–5 steps', max: '5 steps × 25 words', fallback: 'Timeline, or two rows of steps',
    objects: lightBase([...header(false),
      rule(G.left, Z.content.y + 10, G.width, C.secondary, LW.rule),
      ...[0, 1, 2, 3, 4].flatMap((i) => {
        const x = G.left + i * (G.width + 32) / 5; const w = (G.width + 32) / 5 - 32;
        return [
          { text: { text: '', options: { ...box(x, Z.content.y + 3, 14, 14), shape: 'ellipse', fill: { color: C.background }, line: { color: C.secondary, width: LW.strong } } } },
          ph(`s${i + 1}_label`, 'body', x, Z.content.y + 40, w, 20, 'label', `STEP 0${i + 1}`, { color: C.secondary }),
          ph(`s${i + 1}_title`, 'body', x, Z.content.y + 68, w, 90, 'supporting', 'Step name', { color: C.text, fontSize: 20 }),
          ph(`s${i + 1}_body`, 'body', x, Z.content.y + 170, w, 320, 'body', 'What happens here and what it unlocks.', { color: C.text2 }),
        ];
      }), source(false)]) });

  add({ name: '20 Now / Next / Later', dark: false, job: 'PLAN', use: 'Now / next / later, horizon model, strategic roadmap, must / should / could', ideal: '3–5 items per lane', max: '6 items per lane', fallback: 'Roadmap Table',
    objects: lightBase([...header(false), ...[0, 1, 2].flatMap((i) => {
      const c = col(i * 4, 4);
      return [
        { rect: { ...box(c.x, Z.content.y, c.w, 76), fill: { color: i === 0 ? C.secondary : C.surfaceAlt }, line: { type: 'none' }, rectRadius: PX(12) } },
        ph(`h${i + 1}_label`, 'body', c.x + 24, Z.content.y + 16, c.w - 48, 20, 'label', ['NOW', 'NEXT', 'LATER'][i], { color: i === 0 ? C.surface : C.secondary }),
        ph(`h${i + 1}_when`, 'body', c.x + 24, Z.content.y + 40, c.w - 48, 24, 'bodyS', ['0–3 months', '3–9 months', '9–18 months'][i], { color: i === 0 ? C.surface : C.text2 }),
        ph(`h${i + 1}_body`, 'body', c.x, Z.content.y + 100, c.w, 440, 'body', 'Initiative or outcome, one per line.\nConfidence falls left to right: say so.', { color: C.text, paraSpaceAfter: 8 }),
      ];
    }), source(false)]) });

  add({ name: '21 Hero Metric', dark: false, job: 'MEASURE', use: 'Single metric, hero metric, metric + drivers', ideal: '1 number + interpretation', max: '1 number', fallback: 'KPI Row — 4 for several numbers',
    objects: lightBase([...header(false),
      rule(col(0, 6).x, Z.content.y, col(0, 6).w, C.secondary, LW.strong),
      ph('value', 'body', col(0, 6).x, Z.content.y + 32, col(0, 6).w, 190, 'dataHero', '00%', { color: C.secondary }),
      ph('value_label', 'body', col(0, 6).x, Z.content.y + 240, col(0, 6).w, 60, 'dataLabel', 'What the number measures', { color: C.text, fontSize: 14 }),
      ph('value_context', 'body', col(0, 6).x, Z.content.y + 300, col(0, 6).w, 90, 'body', 'Population, period and comparison point.', { color: C.text2 }),
      rule(col(7, 5).x, Z.content.y, col(7, 5).w, C.border),
      ph('read_label', 'body', col(7, 5).x, Z.content.y + 16, col(7, 5).w, 20, 'label', 'WHAT IT MEANS', { color: C.secondary }),
      ph('read', 'body', col(7, 5).x, Z.content.y + 44, col(7, 5).w, 400, 'supporting', 'The interpretation, including what the number does not tell you.', { color: C.text }),
      source(false)]) });

  add({ name: '22 KPI Row — 4', dark: false, job: 'MEASURE', use: 'KPI scorecard, multi-metric hero, target vs actual, before / after', ideal: '3–4 metrics', max: '4 metrics', fallback: 'KPI Table above 4',
    objects: lightBase([...header(false), ...[0, 1, 2, 3].flatMap((i) => {
      const c = col(i * 3, 3);
      return [
        rule(c.x, Z.content.y, c.w, C.secondary, LW.strong),
        ph(`k${i + 1}_value`, 'body', c.x, Z.content.y + 28, c.w, 80, 'data', '00', { color: C.secondary, fontSize: 48 }),
        ph(`k${i + 1}_label`, 'body', c.x, Z.content.y + 120, c.w, 44, 'dataLabel', 'Metric name', { color: C.text }),
        ph(`k${i + 1}_context`, 'body', c.x, Z.content.y + 168, c.w, 100, 'bodyS', 'Period, population, direction vs target.', { color: C.text2 }),
      ];
    }),
      rule(G.left, Z.content.y + 344, G.width, C.secondary, LW.rule),
      ph('read_label', 'body', col(0, 3).x, Z.content.y + 370, col(0, 3).w, 20, 'label', 'WHAT IT ADDS UP TO', { color: C.secondary }),
      ph('read', 'body', col(3, 9).x, Z.content.y + 362, col(3, 9).w, 150, 'supporting', 'One sentence the four numbers support together.', { color: C.text, fontSize: 22 }),
      source(false)]) });

  add({ name: '23 Chart + Insight', dark: false, job: 'PROVE', use: 'Annotated chart, trend, segment performance, adoption / conversion funnel', ideal: '1 chart, 1 highlighted series', max: '1 chart', fallback: 'Chart — Full',
    objects: lightBase([...header(false),
      ph('chart', 'chart', col(0, 8).x, Z.content.y, col(0, 8).w, 540, 'body', '', {}),
      rule(col(8, 4).x, Z.content.y, col(8, 4).w, C.secondary, LW.strong),
      ph('rail_label', 'body', col(8, 4).x, Z.content.y + 16, col(8, 4).w, 20, 'label', 'THE INSIGHT', { color: C.secondary }),
      ph('rail_title', 'body', col(8, 4).x, Z.content.y + 44, col(8, 4).w, 160, 'supporting', 'What the chart shows, stated as a finding.', { color: C.text }),
      ph('rail_body', 'body', col(8, 4).x, Z.content.y + 220, col(8, 4).w, 300, 'body', 'Definition, caveats and what to do next.', { color: C.text2 }),
      source(false)]) });

  add({ name: '24 Chart — Full', dark: false, job: 'PROVE', use: 'Full-width chart: trend, cohort, waterfall, multi-series', ideal: '1 chart', max: '1 chart + 1 annotation', fallback: 'Chart + Insight',
    objects: lightBase([...header(false),
      ph('chart', 'chart', G.left, Z.content.y, G.width, 500, 'body', '', {}),
      ph('annotation', 'body', G.left, Z.content.y + 516, G.width, 40, 'annotation', 'So what: one line under the chart.', { color: C.text }),
      source(false)]) });

  add({ name: '25 Table', dark: false, job: 'COMPARE', use: 'Executive, comparison, initiative, KPI, decision, risk and research tables', ideal: '5–7 rows × 4–5 columns', max: '8 rows', fallback: 'Dense — Title + Body',
    objects: lightBase([...header(false), ph('table', 'tbl', G.left, Z.content.y, G.width, 540, 'tableBody', '', {}), source(false)]) });

  add({ name: '26 Dense — Title + Body', dark: false, job: 'UPDATE', use: 'Purpose-built dense slide: appendix tables, detailed timelines, decision logs', ideal: 'Reference material', max: 'Content zone 1760 × 760px', fallback: 'Split into two slides',
    objects: [...chrome(false, spark), ...header(false, { dense: true }),
      ph('body', 'body', G.left, Z.dense.content.y, G.width, Z.dense.content.h, 'bodyS', 'Dense content: paste a table, detailed timeline or reference list. This is a different composition, not a normal slide with smaller type.', { color: C.text2 }),
      source(false)] });

  add({ name: '27 Quote — Hero', dark: false, job: 'CUSTOMER', use: 'Singular quote, quote + implication', ideal: '≤ 35 words', max: '5 lines', fallback: 'Quote Wall — 4',
    objects: lightBase([
      sText('“', G.left - 8, 180, 200, 200, 'display', { fontSize: 160, color: C.secondary, fontFace: FONT.italic }),
      ph('title', 'title', col(1, 10).x, 340, col(1, 10).w, 360, 'quote', 'A verbatim quote that carries the finding, trimmed but never reworded.', { color: C.text, fontSize: 32 }),
      rule(col(1, 10).x, 736, 120, C.secondary, LW.strong),
      ph('attribution', 'body', col(1, 10).x, 756, col(1, 10).w, 24, 'quoteAttr', 'ROLE · SEGMENT · SOURCE, DATE', { color: C.secondary }),
      ph('implication', 'body', col(1, 8).x, 800, col(1, 8).w, 90, 'body', 'Optional: what this tells us, in one sentence.', { color: C.text2 }),
    ]) });

  add({ name: '28 Quote Wall — 4', dark: false, job: 'CUSTOMER', use: 'Quote wall, voice-of-customer themes, dense quote themes', ideal: '4 quotes ≤ 30 words', max: '4 quotes', fallback: 'Table of themes with one quote each',
    objects: lightBase([...header(false), ...[0, 1, 2, 3].flatMap((i) => {
      const c = col((i % 2) * 6, 6); const y = Z.content.y + Math.floor(i / 2) * 280;
      return [
        rule(c.x, y, c.w, C.border),
        ph(`q${i + 1}_theme`, 'body', c.x, y + 16, c.w, 20, 'label', 'THEME', { color: C.secondary }),
        ph(`q${i + 1}_text`, 'body', c.x, y + 44, c.w, 160, 'quoteS', '“Verbatim quote, trimmed but never reworded.”', { color: C.text, fontSize: 17 }),
        ph(`q${i + 1}_attr`, 'body', c.x, y + 212, c.w, 20, 'quoteAttr', 'ROLE · SEGMENT', { color: C.muted }),
      ];
    }), source(false)]) });

  add({ name: '29 Screenshot — Hero', dark: false, job: 'EXPLAIN', use: 'Product screenshot hero, product concept', ideal: '1 screenshot', max: '1 screenshot', fallback: 'Screenshot + Annotations',
    objects: lightBase([...header(false, { subtitle: false }),
      { rect: { ...box(G.left, 312, G.width, 624), fill: { color: C.surfaceAlt }, line: { type: 'none' }, rectRadius: PX(12) } },
      ph('picture', 'pic', G.left + 48, 344, G.width - 96, 560, 'body', 'Drop a screenshot here', {}),
      source(false)]) });

  add({ name: '30 Screenshot + Annotations', dark: false, job: 'EXPLAIN', use: 'Annotated screenshot, workflow step, before / after product', ideal: '3 annotations', max: '4 annotations', fallback: 'Screenshot — Hero with a caption',
    objects: lightBase([...header(false),
      { rect: { ...box(col(0, 8).x, Z.content.y, col(0, 8).w, 552), fill: { color: C.surfaceAlt }, line: { type: 'none' }, rectRadius: PX(12) } },
      ph('picture', 'pic', col(0, 8).x + 32, Z.content.y + 32, col(0, 8).w - 64, 488, 'body', 'Drop a screenshot here', {}),
      ...[0, 1, 2].flatMap((i) => {
        const c = col(8, 4); const y = Z.content.y + i * 184;
        return [
          rule(c.x, y, c.w, C.border),
          { text: { text: String(i + 1), options: { ...box(c.x, y + 20, 32, 32), shape: 'ellipse', fill: { color: C.secondary }, color: C.surface, fontFace: FONT.uiMedium, fontSize: 10, align: 'center', valign: 'middle', margin: 0 } } },
          ph(`a${i + 1}_title`, 'body', c.x + 48, y + 22, c.w - 48, 30, 'cardTitle', 'What to notice', { color: C.text }),
          ph(`a${i + 1}_body`, 'body', c.x + 48, y + 58, c.w - 48, 110, 'bodyS', 'Why it matters for the advertiser.', { color: C.text2 }),
        ];
      }), source(false)]) });

  add({ name: '31 Recommendation', dark: false, job: 'DECIDE', use: 'Recommendation, decision slide, recommendation + ask, strategic choice', ideal: '1 recommendation + 1 decision', max: '1 recommendation', fallback: 'Options Comparison — 3 first, then this',
    objects: lightBase([...header(false),
      rule(col(0, 7).x, Z.content.y, col(0, 7).w, C.secondary, LW.strong),
      ph('rec_label', 'body', col(0, 7).x, Z.content.y + 16, col(0, 7).w, 20, 'label', 'RECOMMENDATION', { color: C.secondary }),
      ph('rec', 'body', col(0, 7).x, Z.content.y + 48, col(0, 7).w, 200, 'statement', 'We recommend one specific thing, for one reason.', { color: C.text, fontSize: 28 }),
      ph('rec_body', 'body', col(0, 7).x, Z.content.y + 300, col(0, 7).w, 230, 'body', 'Rationale, the tradeoff we accept, and what we will not do.', { color: C.text2 }),
      { rect: { ...box(col(8, 4).x, Z.content.y, col(8, 4).w, 552), fill: { color: C.primary }, line: { type: 'none' }, rectRadius: PX(12) } },
      ph('dec_label', 'body', col(8, 4).x + 32, Z.content.y + 32, col(8, 4).w - 64, 20, 'label', 'DECISION NEEDED', { color: C.accent }),
      ph('dec', 'body', col(8, 4).x + 32, Z.content.y + 64, col(8, 4).w - 64, 200, 'supporting', 'The yes / no question the room answers today.', { color: C.surface, fontSize: 20 }),
      rule(col(8, 4).x + 32, Z.content.y + 300, col(8, 4).w - 64, C.onDarkRule),
      ph('owner_label', 'body', col(8, 4).x + 32, Z.content.y + 320, col(8, 4).w - 64, 20, 'label', 'OWNER', { color: C.accent }),
      ph('owner', 'body', col(8, 4).x + 32, Z.content.y + 346, col(8, 4).w - 64, 30, 'body', 'Name, role', { color: C.surface }),
      ph('by_label', 'body', col(8, 4).x + 32, Z.content.y + 400, col(8, 4).w - 64, 20, 'label', 'NEEDED BY', { color: C.accent }),
      ph('by', 'body', col(8, 4).x + 32, Z.content.y + 426, col(8, 4).w - 64, 30, 'body', 'Date, and what slips if it is late', { color: C.surface }),
      source(false)]) });

  add({ name: '32 Options — 3', dark: false, job: 'DECIDE', use: 'Options comparison, strategic choices, tradeoff slide, three-way comparison', ideal: '3 options', max: '3 options × 50 words', fallback: 'Decision Table for 4+',
    objects: lightBase([...header(false), ...[0, 1, 2].flatMap((i) => {
      const c = col(i * 4, 4);
      return [
        ...module_(`o${i + 1}`, c, Z.content.y, 300),
        rule(c.x, Z.content.y + 320, c.w, C.border),
        ph(`o${i + 1}_trade_label`, 'body', c.x, Z.content.y + 336, c.w, 20, 'label', 'TRADEOFF', { color: C.muted }),
        ph(`o${i + 1}_trade`, 'body', c.x, Z.content.y + 362, c.w, 90, 'bodyS', 'What we give up if we choose this.', { color: C.text2 }),
      ];
    }),
      ph('pick', 'body', G.left, Z.content.y + 476, G.width, 60, 'supporting', 'Recommended: Option _ — because… (use the Emphasis Card on that column)', { color: C.secondary }),
      source(false)]) });

  add({ name: '33 Closing — Takeaways + Ask', dark: true, job: 'CLOSE', use: 'Key takeaways, recommendation + ask, next steps, leadership decisions', ideal: '3 asks', max: '3 × 30 words', fallback: 'Recommendation',
    objects: darkBase([
      ph('title', 'title', G.left, 200, 1500, 230, 'display', 'The closing line: what we are asking for', { color: C.surface, valign: 'bottom' }),
      ph('subtitle', 'body', G.left, 452, 1100, 90, 'bodyL', 'One line on why now.', { color: C.onDark2 }),
      ...[0, 1, 2].flatMap((i) => {
        const c = col(i * 4, 4);
        return [
          rule(c.x, 620, c.w, C.accent, LW.strong),
          ph(`ask${i + 1}_label`, 'body', c.x, 640, c.w, 20, 'label', ['ALIGN', 'DECIDE', 'NEXT'][i], { color: C.accent }),
          ph(`ask${i + 1}`, 'body', c.x, 672, c.w, 220, 'bodyL', 'A specific ask with an owner and a date.', { color: C.surface }),
        ];
      }),
    ]).filter((o) => !(o.placeholder && o.placeholder.options.name === 'eyebrow')) });

  add({ name: '34 Appendix Divider', dark: true, job: 'CLOSE', use: 'Appendix divider, Q&A', ideal: '—', max: '—', fallback: '—',
    objects: darkBase([
      sText('A', G.left - 10, 96, 400, 380, 'display', { fontSize: 180, color: C.onDarkRule }),
      ph('title', 'title', G.left, 520, 1400, 120, 'sectionHead', 'Appendix', { color: C.surface, fontSize: 56 }),
      ph('subtitle', 'body', G.left, 660, 1100, 100, 'bodyL', 'Reference material and evidence, in the order the main deck cites it.', { color: C.onDark2 }),
    ]).filter((o) => !(o.placeholder && ['eyebrow', 'section'].includes(o.placeholder.options.name))) });

  add({ name: '35 Blank', dark: false, job: 'EXPLAIN', use: 'Free canvas with footer, for one-off working canvases', ideal: '—', max: '—', fallback: '—',
    objects: chrome(false, spark, { context: false }) });

  return L;
}

function defineMasters(pres, spark) {
  const list = masters(spark);
  for (const m of list) {
    pres.defineSlideMaster({
      title: m.name,
      background: { color: m.bg || (m.dark ? C.primary : C.background) },
      objects: m.objects,
      slideNumber: slideNumber(m.dark),
    });
    m.placeholders = m.objects.filter((o) => o.placeholder).map((o) => o.placeholder.options.name);
    m.phMeta = m.objects.filter((o) => o.placeholder).map((o) => ({ name: o.placeholder.options.name, valign: o.placeholder.options.valign, mono: o.placeholder.options.fontFace === FONT.mono }));
  }
  return list;
}

module.exports = { defineMasters };
