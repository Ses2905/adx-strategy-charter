// Builds the Product Leadership master template.
//   node build.js [thumbs.json]   → Product-Leadership-Master-Template.pptx
// Two passes (see make.sh): pass 1 renders thumbnails of the example slides,
// pass 2 embeds them in the layout catalog.
const path = require('path');
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const { PX, FONT, C, RAMP, MUTE, G, col, S, R, Z, T, style, LW, box, txt } = require('./system');
const K = require('./components');
const { defineMasters } = require('./masters');

const OUT = path.join(__dirname, 'Product-Leadership-Master-Template.pptx');
const THUMBS = process.argv[2] && fs.existsSync(process.argv[2]) ? JSON.parse(fs.readFileSync(process.argv[2])) : null;
const ILLUS = 'Illustrative example content and data for layout demonstration. Replace with real content and cite the source.';

(async () => {
  const logos = path.join(__dirname, '../../docs/logos');
  const png = async (f) => 'image/png;base64,' + (await sharp(fs.readFileSync(path.join(logos, f)), { density: 600 }).resize(256, 256).png().toBuffer()).toString('base64');
  const spark = { white: await png('spark-white.svg'), blue: await png('spark-everyday-blue.svg') };

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Product Leadership Presentation System';
  pres.author = 'Walmart Ads';
  pres.theme = { headFontFace: FONT.headline, bodyFontFace: FONT.ui };

  const M = defineMasters(pres, spark);
  const byNo = Object.fromEntries(M.map((m) => [m.name.slice(0, 2), m]));
  const exampleOf = {};      // master number → slide number of its worked example
  let n = 0;

  function use(no, fillMap = {}, { example = false, notes } = {}) {
    const m = byNo[no];
    const sl = pres.addSlide({ masterName: m.name });
    n += 1;
    if (example && !exampleOf[no]) exampleOf[no] = n;
    for (const [k, v] of Object.entries(fillMap)) {
      if (!m.placeholders.includes(k)) throw new Error(`${m.name} has no placeholder "${k}"`);
      sl.addText(v, { placeholder: k });
    }
    if (notes) sl.addNotes(notes);
    return sl;
  }
  const add = (slide, fn) => fn(slide);

  // ════════════════════════════════════════════════════════════════════════
  // 0 · How to use
  // ════════════════════════════════════════════════════════════════════════
  use('01', { title: 'Product Leadership Presentation System', subtitle: 'A reusable master for strategy, research, planning, performance and decision decks. Choose the job, pick the layout, replace the content.', meta: 'WALMART ADS · MASTER TEMPLATE · V1' },
    { notes: 'Start here. Delete the system slides (1–20) when you build a real deck; keep the layouts, which live in Home → Layout.' });

  use('15', { eyebrow: 'HOW TO USE THIS TEMPLATE', section: 'START HERE', title: 'Decide what you are trying to say. The system decides how it looks.',
    r1_label: '01 · CHOOSE THE JOB', r1_text: 'Start, tell, prove, explain, decide, plan, measure, compare, operate, update or close. The layout picker (slide 10) maps each job to layouts.',
    r2_label: '02 · PICK THE LAYOUT', r2_text: 'Home → New Slide → pick by number and name. Every layout has named slots, so nothing needs positioning by hand.',
    r3_label: '03 · REPLACE THE CONTENT', r3_text: 'Type into the placeholders. Duplicate a worked example when it already has the components you need.',
    r4_label: '04 · WHEN IT DOES NOT FIT', r4_text: 'Tighten the copy → use the dense layout → change layout → split the slide → only then reduce type, within the minimums.' },
    { notes: 'The overflow order is the most important rule in the system: never shrink until it fits.' });

  // ════════════════════════════════════════════════════════════════════════
  // 1 · Foundations
  // ════════════════════════════════════════════════════════════════════════
  use('05', { number: 'SYSTEM 01', section: 'FOUNDATIONS', title: 'Foundations', subtitle: 'The grid, zones, type, colour and spacing every layout inherits. Change them here and only here.' });

  add(use('09', { eyebrow: 'FOUNDATIONS · GRID', section: 'FOUNDATIONS', title: 'One content frame, twelve columns, four fixed zones', subtitle: 'Every region shares the same left and right edges. Container width controls alignment; text width controls readability.', source: 'Canvas 13.333 × 7.5 in (1920 × 1080 authoring px). Margins 80px. Gutter 32px. Column 117px. Zones: context 72, message 112–344, content 384–944, source 952, footer 1008.' }), (sl) => {
    for (let i = 0; i < 12; i++) { const c = col(i, 1); K.rect(sl, pres, c.x, Z.content.y, c.w, 400, 'E1EAF7'); K.text(sl, c.x, Z.content.y + 8, c.w, 20, String(i + 1).padStart(2, '0'), 'label', { color: C.secondary, align: 'center' }); }
    const combos = [['12', [[0, 12]]], ['8 + 4', [[0, 8], [8, 4]]], ['7 + 5', [[0, 7], [7, 5]]], ['6 + 6', [[0, 6], [6, 6]]], ['4 + 4 + 4', [[0, 4], [4, 4], [8, 4]]], ['3 + 3 + 3 + 3', [[0, 3], [3, 3], [6, 3], [9, 3]]], ['3 + 9', [[0, 3], [3, 9]]], ['2 + 10', [[0, 2], [2, 10]]]];
    combos.forEach(([lab, spans], r) => {
      const y = Z.content.y + 40 + r * 44;
      spans.forEach(([s, w]) => { const c = col(s, w); K.rect(sl, pres, c.x, y, c.w, 32, C.secondary); });
      K.text(sl, col(0, 12).x + 12, y + 6, 300, 22, lab, 'label', { color: C.surface });
    });
    K.text(sl, G.left, Z.content.y + 420, 1760, 40, 'Supported combinations: 12 · 8+4 · 7+5 · 6+6 · 4+4+4 · 3+3+3+3 · 3+9 · 2+10. Shared headline treatments sit at identical coordinates on every layout.', 'body', { color: C.text2 });
  });

  add(use('26', { title: 'Twenty-four semantic text styles, each with a size, a line limit and a job', source: 'Everyday Sans (Headline Light, UI, UI Medium, Light Italic, Mono). Minimum 10pt for reading text; 7.5pt only for mono labels and pills.' }), (sl) => {
    const rows = [];
    const spec = { display: 'Display / Hero', sectionHead: 'Section headline', statement: 'Statement', headline: 'Slide headline', denseHead: 'Dense headline', supporting: 'Supporting headline', bodyL: 'Body large', body: 'Body', bodyS: 'Body small', dataHero: 'Data hero', data: 'Data', dataLabel: 'Data label', cardTitle: 'Card title', cardBody: 'Card body', eyebrow: 'Eyebrow', label: 'Label / section label', pill: 'Pill / tag', tableHead: 'Table header', tableBody: 'Table body', chartLabel: 'Chart label', annotation: 'Chart annotation', quote: 'Quote', quoteAttr: 'Quote attribution', source: 'Source / footnote' };
    const faceName = (f) => f.replace('Everyday Sans ', '');
    for (const [k, lab] of Object.entries(spec)) {
      const t = T[k];
      rows.push([lab, `${faceName(t.fontFace)} ${t.fontSize}pt · ${t.lineSpacingMultiple || 1}× · max ${t.maxLines}`,
        { text: /eyebrow|label|pill|tableHead|quoteAttr/.test(k) ? 'EXAMPLE LABEL' : 'Adoption is growing', options: { ...style(k), fontSize: Math.min(t.fontSize, 12), lineSpacingMultiple: 1, color: /eyebrow|label|tableHead/.test(k) ? C.secondary : C.text } }]);
    }
    const headRow = ['Style', 'Face · size · leading · lines', 'Sample'];
    const h = Math.ceil(rows.length / 2);
    K.table(sl, col(0, 6).x, Z.dense.content.y, col(0, 6).w, [headRow, ...rows.slice(0, h)], [230, 380, 254], { dense: true });
    K.table(sl, col(6, 6).x, Z.dense.content.y, col(6, 6).w, [headRow, ...rows.slice(h)], [230, 380, 254], { dense: true });
  });

  add(use('09', { eyebrow: 'FOUNDATIONS · COLOUR', section: 'FOUNDATIONS', title: 'Colour carries meaning, so each colour has exactly one job', subtitle: 'Navy is ink and dark grounds. True Blue is the thing that matters. Status colours never appear without a shape or a word.', source: 'Walmart design system tokens. #E9EEF3 is the quiet structural surface for cards, bands, zones and comparison areas.' }), (sl) => {
    const roles = [['Primary', C.primary, 'Text, dark grounds'], ['Secondary', C.secondary, 'Emphasis, key rules, labels'], ['Accent', C.accent, 'Accent on dark grounds only'], ['Background', C.background, 'Page'], ['Surface', C.surface, 'Raised panels'], ['Surface alt', C.surfaceAlt, 'Cards, bands, zones'], ['Border', C.border, 'Hairlines'],
      ['Primary text', C.text, 'Headlines, body'], ['Secondary text', C.text2, 'Body, descriptions'], ['Muted text', C.muted, 'Sources, meta'], ['Positive', C.positive, 'On track, gains'], ['Warning', C.warning, 'At risk'], ['Negative', C.negative, 'Off track, losses'], ['Informational', C.info, 'Neutral notices']];
    roles.forEach(([name, hex, job], i) => {
      const c = col((i % 7) * 12 / 7 | 0, 1); const x = G.left + (i % 7) * 254; const y = Z.content.y + Math.floor(i / 7) * 184;
      K.rrect(sl, pres, x, y, 222, 88, hex, 12, ['F5F6F8', 'FFFFFF', 'E9EEF3', 'DEE1E6'].includes(hex) ? { color: C.borderStrong, width: LW.hair } : undefined);
      K.text(sl, x, y + 100, 222, 22, name, 'cardTitle', { color: C.text, fontSize: 11 });
      K.text(sl, x, y + 124, 222, 20, `#${hex} · ${job}`, 'source', { color: C.muted });
    });
    K.text(sl, G.left, Z.content.y + 380, 400, 20, 'CHART & DIAGRAM RAMP', 'label', { color: C.secondary });
    [...RAMP, MUTE].forEach((hex, i) => { K.rect(sl, pres, G.left + i * 150, Z.content.y + 408, 150, 48, hex); K.text(sl, G.left + i * 150, Z.content.y + 464, 150, 20, `#${hex}`, 'source', { color: C.muted }); });
    K.text(sl, col(6, 6).x, Z.content.y + 404, col(6, 6).w, 90, 'Highlight the key series in True Blue and mute the rest in #C3C6CD. Use the ramp in order for ordinal data only; nominal categories take one colour.', 'body', { color: C.text2 });
  });

  add(use('09', { eyebrow: 'FOUNDATIONS · SPACING & SHAPE', section: 'FOUNDATIONS', title: 'An 8-point scale, three radii and three line weights', subtitle: 'Arbitrary spacing is the fastest way to make a system look improvised. Pick from the scale.', source: 'Radii: small = pills (full), medium = cards and panels (12px), large = hero containers (24px). Lines: 0.75pt hairline, 1pt rule, 1.5pt emphasis. Nothing thinner survives export.' }), (sl) => {
    Object.entries(S).forEach(([k, v], i) => {
      const y = Z.content.y + i * 50;
      K.text(sl, G.left, y + 4, 90, 22, k.toUpperCase(), 'label', { color: C.secondary });
      K.text(sl, G.left + 90, y + 4, 90, 22, `${v}px`, 'bodyS', { color: C.text2 });
      K.rect(sl, pres, G.left + 180, y + 6, v * 4, 18, C.secondary);
    });
    const x0 = col(6, 6).x;
    K.text(sl, x0, Z.content.y, 400, 20, 'RADIUS', 'label', { color: C.secondary });
    K.pill(sl, pres, x0, Z.content.y + 36, 'Small · pill', 'category');
    K.rrect(sl, pres, x0 + 260, Z.content.y + 36, 220, 120, C.surfaceAlt, 12); K.text(sl, x0 + 284, Z.content.y + 60, 180, 22, 'Medium · card', 'bodyS', { color: C.text2 });
    K.rrect(sl, pres, x0 + 520, Z.content.y + 36, 280, 120, C.surfaceAlt, 24); K.text(sl, x0 + 544, Z.content.y + 60, 220, 22, 'Large · hero container', 'bodyS', { color: C.text2 });
    K.text(sl, x0, Z.content.y + 220, 400, 20, 'LINE WEIGHTS', 'label', { color: C.secondary });
    [['0.75pt hairline · rows, dividers', C.border, LW.hair], ['1pt rule · header underline', C.borderStrong, LW.rule], ['1.5pt emphasis · the rule that matters', C.secondary, LW.strong]].forEach(([lab, c, w], i) => {
      K.line(sl, pres, x0, Z.content.y + 268 + i * 64, 800, 0, c, w);
      K.text(sl, x0, Z.content.y + 278 + i * 64, 800, 22, lab, 'bodyS', { color: C.text2 });
    });
  });

  use('15', { eyebrow: 'FOUNDATIONS · DENSITY', section: 'FOUNDATIONS', title: 'Light, standard and dense are different compositions, not different font sizes',
    r1_label: 'LIGHT', r1_text: 'Hero statement, single metric, single quote, section transition. Use for visual rest and for the lines the room should remember.',
    r2_label: 'STANDARD', r2_text: 'The default. One headline, one composition, 40–90 words of support. Most slides in a leadership deck.',
    r3_label: 'DENSE', r3_text: 'Layout 26. A compact header and a larger content zone for tables, logs and appendix material. Never a standard slide with smaller type.',
    r4_label: 'OVERFLOW ORDER', r4_text: 'Tighten copy → higher-density variant → change layout → split the slide → reduce type within the minimums. Never shrink until it fits.' });

  // ════════════════════════════════════════════════════════════════════════
  // 2 · Layout picker
  // ════════════════════════════════════════════════════════════════════════
  use('05', { number: 'SYSTEM 02', section: 'LAYOUT PICKER', title: 'Layout picker', subtitle: 'What kind of slide do I need? Start from the communication job, not from the gallery.' });

  const JOBS = [
    ['START', 'Opening the deck or a section', '01 Cover — Minimal · 02 Cover — Editorial · 03 Cover — Visual · 04 Agenda · 05 Section Divider · 06 Section Divider — Statement'],
    ['TELL', 'Landing one idea or a narrative beat', '07 Hero Statement · 10 Title + Body · 15 Label Rail'],
    ['PROVE', 'Showing evidence behind a claim', '08 Statement + Evidence · 12 Split 8 + 4 · 23 Chart + Insight · 24 Chart — Full'],
    ['EXPLAIN', 'Frameworks, systems, workflows, diagrams', '09 Title Only · 15 Label Rail · 17 Grid 2 × 2 · 18 Grid 3 × 2 · 19 Process · 29–30 Screenshot'],
    ['CUSTOMER', 'Research, quotes, pain points, journeys', '27 Quote — Hero · 28 Quote Wall · 18 Grid 3 × 2 · 19 Process (journey) · 25 Table (research)'],
    ['STRATEGY', 'Pillars, choices, principles, vision', '13 Three Column · 14 Four Column · 07 Hero Statement · 15 Label Rail'],
    ['PRIORITIZE', 'Ranking and sequencing what matters', '20 Now / Next / Later · 25 Table · 09 Title Only (2×2 matrix)'],
    ['DECIDE', 'Getting a decision in the room', '32 Options — 3 · 31 Recommendation · 25 Table (decision log)'],
    ['PLAN', 'Roadmaps, milestones, dependencies', '20 Now / Next / Later · 19 Process · 09 Title Only (timeline, swimlane) · 26 Dense'],
    ['MEASURE', 'KPIs, performance, success frameworks', '21 Hero Metric · 22 KPI Row — 4 · 23 Chart + Insight · 25 Table (KPI)'],
    ['COMPARE', 'Side by side, current vs future, gaps', '11 Two Column · 16 Current → Future · 25 Table · 32 Options — 3'],
    ['OPERATE', 'Operating models, ownership, loops', '09 Title Only (loop, hub, layers) · 15 Label Rail · 25 Table (RACI)'],
    ['UPDATE', 'Status, progress, readiness', '22 KPI Row — 4 · 25 Table (status) · 15 Label Rail (wins / risks / next) · 26 Dense'],
    ['CLOSE', 'Takeaways, asks, next steps, appendix', '33 Closing — Takeaways & Ask · 31 Recommendation · 34 Appendix Divider'],
  ];
  add(use('26', { title: 'Fourteen communication jobs, each mapped to the layouts that serve it', source: 'Numbers are layout numbers in Home → New Slide. The full pattern catalog (≈150 named patterns → layout + variant) is in USAGE.md next to this file.' }), (sl) => {
    K.table(sl, G.left, Z.dense.content.y, G.width, [['Job', 'Use when you are…', 'Layouts'], ...JOBS.map(([j, u, l]) => [{ text: j, options: { fontFace: FONT.mono, fontSize: 9, charSpacing: 1.1, color: C.secondary } }, u, l])], [220, 460, 1080], { dense: false });
  });

  // Master catalog with thumbnails: 8 per slide.
  const catalogSlides = [];
  for (let p = 0; p < Math.ceil(M.length / 8); p++) {
    const part = M.slice(p * 8, p * 8 + 8);
    add(use('26', { title: `Layout catalog ${p + 1} of ${Math.ceil(M.length / 8)}: ${part[0].name.slice(0, 2)}–${part[part.length - 1].name.slice(0, 2)}` }), (sl) => {
      catalogSlides.push(n);
      part.forEach((m, i) => {
        const w = 416, x = G.left + (i % 4) * (w + 32), y = Z.dense.content.y + Math.floor(i / 4) * 384;
        const no = m.name.slice(0, 2);
        const th = THUMBS && THUMBS[no];
        if (th) sl.addImage({ data: th, ...box(x, y, w, 234), altText: `${m.name} example` });
        else K.rect(sl, pres, x, y, w, 234, C.surfaceAlt);
        K.rect(sl, pres, x, y, w, 234, null, { color: C.border, width: LW.hair });
        K.text(sl, x, y + 244, w, 24, m.name, 'cardTitle', { color: C.text, fontSize: 11 });
        K.text(sl, x, y + 276, w, 20, `${m.job} · IDEAL ${m.ideal.toUpperCase()}`, 'label', { color: C.secondary, fontSize: 7 });
        K.text(sl, x, y + 302, w, 60, m.use, 'bodyS', { color: C.text2, fontSize: 9 });
      });
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // 3 · Worked examples, one per layout, with realistic product content
  // ════════════════════════════════════════════════════════════════════════
  use('06', { number: 'SYSTEM 03', title: 'Worked examples: every layout, filled with the kind of content it was built for.' }, { example: true });

  use('01', { title: 'Making campaign setup something advertisers finish, not abandon', subtitle: 'FY27 product review · Campaign creation and management', meta: 'ADVERTISER EXPERIENCE · PRODUCT · MONTH YEAR' }, { example: true });
  use('02', { title: 'Setup is where advertiser intent turns into spend — or doesn’t', subtitle: 'A readout of what we learned from six months of setup research, and the three changes we want to fund next.', meta: 'PRODUCT RESEARCH READOUT\nMONTH YEAR' }, { example: true });
  use('03', { title: 'One place to plan, buy and measure', subtitle: 'Concept review for the unified campaign workspace', meta: 'DESIGN REVIEW · MONTH YEAR' }, { example: true });
  use('04', { eyebrow: 'AGENDA', section: 'PRODUCT REVIEW', title: 'Five questions this review answers',
    n1: '01', t1: 'Where we are', d1: 'What setup completion and advertiser feedback tell us today.',
    n2: '02', t2: 'What is driving it', d2: 'The three root causes behind abandonment, and the evidence for each.',
    n3: '03', t3: 'What we will change', d3: 'Three bets for next half, sequenced by what they unlock.',
    n4: '04', t4: 'How we will know', d4: 'Outcome measures, targets and the guardrails we will watch.',
    n5: '05', t5: 'What we need', d5: 'Two decisions and one staffing ask.', n6: '', t6: '', d6: '' }, { example: true });
  use('05', { number: 'SECTION 02', section: 'PRODUCT REVIEW', title: 'What is driving abandonment', subtitle: 'Three causes, not one — and only one of them is a design problem.' }, { example: true });
  use('07', { eyebrow: 'THE REFRAME', section: 'STRATEGY', title: 'Advertisers don’t need more insights. They need fewer, clearer decisions.', subtitle: 'Every capability we add should remove a decision from the advertiser, not add one.', source: '' }, { example: true });
  use('08', { eyebrow: 'WHY NOW', section: 'STRATEGY', title: 'Setup friction is now the constraint on growth, not demand', subtitle: 'Advertisers arrive with budget. Too many leave before a campaign goes live.',
    claim: 'The funnel leaks at setup, and it leaks most for the advertisers we most want to grow.', claim_body: 'Demand is not the constraint: new-advertiser sign-ups are up. Completion is. Newer advertisers abandon setup at almost twice the rate of managed accounts.',
    e1_value: '42%', e1_label: 'Setup starts that never reach launch, last two quarters.', e2_value: '1.9×', e2_label: 'Abandonment rate for self-serve vs managed advertisers.', e3_value: '11 min', e3_label: 'Median time to first launch for advertisers who finish.', source: ILLUS }, { example: true });
  use('10', { eyebrow: 'EXECUTIVE SUMMARY', section: 'SUMMARY', title: 'We should simplify setup before we add intelligence to it',
    body: 'Advertisers tell us setup asks too many decisions too early, and the behavioral data agrees: most abandonment happens at targeting and budget, before anything is live. Adding recommendations on top of that flow would add a decision rather than remove one.\n\nWe propose to reorder setup around the advertiser’s goal, move targeting and budget guidance into the step where the decision is made, and only then layer in automated suggestions — measured against completion, time to launch and early campaign performance.', source: ILLUS }, { example: true });
  use('11', { eyebrow: 'PROBLEM → OPPORTUNITY', section: 'STRATEGY', title: 'The problem is decision load; the opportunity is sequencing', subtitle: 'Same data, two readings. The second one tells us what to build.',
    c1_label: 'THE PROBLEM', c1_title: 'Setup asks for every decision up front', c1_body: 'Objective, audience, budget, bid and creative arrive on one screen, in an order that reflects our data model rather than the advertiser’s thinking.',
    c2_label: 'THE OPPORTUNITY', c2_title: 'Ask for each decision when it can be made well', c2_body: 'Lead with the goal, defer what can be defaulted, and bring guidance to the moment of decision. Fewer choices, each with more context.', source: ILLUS }, { example: true });
  add(use('12', { eyebrow: 'EVIDENCE', section: 'RESEARCH', title: 'Abandonment clusters at two steps, and both are decision steps',
    rail_label: 'SO WHAT', rail_title: 'Fix targeting and budget first; the other steps are not where we lose people.', rail_body: 'Creative upload and review have low drop-off. The two decision-heavy steps account for most of the loss, so that is where simplification buys the most.', source: ILLUS }, { example: true }), (sl) => {
    const steps = ['Objective', 'Audience', 'Budget', 'Bid', 'Creative', 'Review'];
    sl.addChart(pres.charts.BAR, [{ name: 'Other', labels: steps, values: [6, 0, 0, 9, 4, 3] }, { name: 'Focus', labels: steps, values: [0, 21, 17, 0, 0, 0] }],
      { ...box(col(0, 8).x, Z.content.y, col(0, 8).w, 540), ...K.chartBase({ barDir: 'bar', barOverlapPct: 100, barGapWidthPct: 50, chartColors: [MUTE, C.secondary], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"% of starts";;;', valAxisHidden: true, catAxisOrientation: 'maxMin', catAxisLabelFontSize: 11 }) });
  });
  use('13', { eyebrow: 'STRATEGIC PILLARS', section: 'STRATEGY', title: 'Three pillars, each removing a different kind of friction', subtitle: 'Ideal for three. Supports three to five. Above five, move to a pillar → initiative map.',
    c1_label: 'PILLAR 01', c1_title: 'Simplify the core', c1_body: 'Fewer steps and fewer decisions in the workflows advertisers use every week.',
    c2_label: 'PILLAR 02', c2_title: 'Connect the platform', c2_body: 'One navigation, one reporting model, shared objects across channels.',
    c3_label: 'PILLAR 03', c3_title: 'Guide the next decision', c3_body: 'Recommendations that explain themselves and are measured on outcomes.', source: ILLUS }, { example: true });
  use('14', { eyebrow: 'BIG ROCKS', section: 'PLAN', title: 'Four big rocks carry the plan for the next year', subtitle: 'Each rock has one owner, one outcome measure and one dependency we are watching.',
    c1_label: 'ROCK 01', c1_title: 'Goal-first setup', c1_body: 'Reorder creation around the advertiser’s objective.',
    c2_label: 'ROCK 02', c2_title: 'Shared audience library', c2_body: 'Build once, reuse across campaigns and channels.',
    c3_label: 'ROCK 03', c3_title: 'Unified reporting', c3_body: 'One answer to “how am I doing?”, wherever you ask it.',
    c4_label: 'ROCK 04', c4_title: 'Campaign experiments', c4_body: 'Turn performance questions into evidence.', source: ILLUS }, { example: true });
  use('15', { eyebrow: 'WHAT WE KNOW', section: 'RESEARCH', title: 'Separating what we know from what we believe keeps the plan honest',
    r1_label: 'WE KNOW', r1_text: 'Abandonment is concentrated at targeting and budget, across every advertiser segment we measured.',
    r2_label: 'WE BELIEVE', r2_text: 'Goal-first ordering will lift completion more for new advertisers than for managed accounts.',
    r3_label: 'WE NEED TO LEARN', r3_text: 'Whether better setup improves early campaign performance, or only completion.',
    r4_label: 'HOW WE WILL LEARN', r4_text: 'A controlled test on new advertisers, measured on completion, time to launch and 30-day spend.', source: ILLUS }, { example: true });
  use('16', { eyebrow: 'CURRENT → FUTURE', section: 'EXPERIENCE', title: 'From one long form to a guided sequence',
    now_label: 'TODAY', now_title: 'Every decision on one screen', now_body: 'Twenty-three fields, eight of them required before the advertiser can save. Guidance lives in a help article.',
    next_label: 'FUTURE', next_title: 'One decision per step, with context', next_body: 'Goal first, sensible defaults, and guidance inside the step where the choice is made. Save at any point.', source: ILLUS }, { example: true });
  use('17', { eyebrow: 'RISKS', section: 'PLAN', title: 'Four risks, each with an owner and a mitigation already in motion',
    g1_label: 'DEPENDENCY', g1_title: 'Audience API is not ready', g1_body: 'Mitigation: ship setup with today’s audience picker; swap in the library when the API lands.',
    g2_label: 'ADOPTION', g2_title: 'Power users resist the new flow', g2_body: 'Mitigation: keep an expert mode with every field on one screen, measured separately.',
    g3_label: 'MEASUREMENT', g3_title: 'Completion rises, performance doesn’t', g3_body: 'Mitigation: 30-day spend and ROAS are guardrails in the test, not afterthoughts.',
    g4_label: 'CAPACITY', g4_title: 'Two pods share one designer', g4_body: 'Mitigation: sequence research ahead of build; decision needed on hiring.', source: ILLUS }, { example: true });
  use('18', { eyebrow: 'PAIN POINTS', section: 'RESEARCH', title: 'Six pain points recur across every research source',
    g1_label: 'COMPLEX', g1_title: 'Too many concepts up front', g1_body: 'Bid strategy and attribution window before the first ad exists.',
    g2_label: 'FRAGMENTED', g2_title: 'Jobs split across tools', g2_body: 'Audiences built in one place, used in another, reported in a third.',
    g3_label: 'INCONSISTENT', g3_title: 'Same task, different flow', g3_body: 'Editing a budget works differently by channel.',
    g4_label: 'UNCLEAR', g4_title: 'No sense of what happens next', g4_body: 'Advertisers cannot predict delivery from their settings.',
    g5_label: 'TIME-CONSUMING', g5_title: 'Routine edits take too long', g5_body: 'Bulk changes need exports and re-uploads.',
    g6_label: 'UNTRUSTED', g6_title: 'Numbers don’t match', g6_body: 'The same metric differs between two reports.', source: ILLUS }, { example: true });
  use('19', { eyebrow: 'SIGNAL → OUTCOME', section: 'OPERATING MODEL', title: 'Every initiative runs the same five steps from signal to outcome',
    s1_label: 'STEP 01', s1_title: 'Signal', s1_body: 'Research, behavior, support, sales and performance data point to where to look.',
    s2_label: 'STEP 02', s2_title: 'Problem', s2_body: 'Which job is failing, where, and for whom.',
    s3_label: 'STEP 03', s3_title: 'Diagnosis', s3_body: 'Experience, capability or performance system? Isolate before prescribing.',
    s4_label: 'STEP 04', s4_title: 'Intervention', s4_body: 'Simplify, redesign, build or test — the smallest change that answers the diagnosis.',
    s5_label: 'STEP 05', s5_title: 'Outcome', s5_body: 'Did behavior, performance or perception move? If not, back to step three.', source: '' }, { example: true });
  use('20', { eyebrow: 'ROADMAP', section: 'PLAN', title: 'Confidence falls from left to right, and the roadmap says so', subtitle: 'Now is committed. Next is planned. Later is direction with a discovery gate in front of it.',
    h1_label: 'NOW', h1_when: 'Committed · this quarter', h1_body: 'Goal-first setup, beta\nSetup instrumentation\nExpert mode',
    h2_label: 'NEXT', h2_when: 'Planned · next two quarters', h2_body: 'Shared audience library\nInline budget guidance\nSetup experiment readout',
    h3_label: 'LATER', h3_when: 'Direction · to be validated', h3_body: 'Automated setup suggestions\nCross-channel campaign templates', source: ILLUS }, { example: true });
  use('21', { eyebrow: 'HERO METRIC', section: 'PERFORMANCE', title: 'Setup completion is the number that moves everything else',
    value: '58%', value_label: 'Setup completion rate', value_context: 'Share of setup starts reaching launch. Trailing two quarters, all self-serve advertisers.',
    read_label: 'WHAT IT MEANS', read: 'Four in ten advertisers who start setup never launch. It does not tell us why — the next two slides do.', source: ILLUS }, { example: true });
  add(use('22', { eyebrow: 'SCORECARD', section: 'PERFORMANCE', title: 'Completion is improving; time to launch is not yet',
    k1_value: '58%', k1_label: 'Setup completion', k1_context: 'Target 70% by year end.',
    k2_value: '11m', k2_label: 'Median time to launch', k2_context: 'Flat quarter over quarter.',
    k3_value: '3.2', k3_label: 'Help-article views per setup', k3_context: 'Lower is better.',
    k4_value: '−27', k4_label: 'Setup satisfaction (NPS)', k4_context: 'Relationship survey, scored responses.',
    read_label: 'WHAT IT ADDS UP TO', read: 'More advertisers are finishing, but they are not finishing faster — decision load, not bugs, is the remaining constraint.', source: ILLUS }, { example: true }), (sl) => {
    const deltas = [['4 PTS', 'up'], ['0 MIN', 'flat'], ['0.6', 'down'], ['3 PTS', 'up']];
    deltas.forEach(([v, d], i) => K.delta(sl, pres, col(i * 3, 3).x, Z.content.y + 280, v, d));
  });
  add(use('23', { eyebrow: 'TREND', section: 'PERFORMANCE', title: 'Completion rose after the step reorder, and held',
    rail_label: 'THE INSIGHT', rail_title: 'The reorder lifted completion by about eight points.', rail_body: 'Definition: setup starts reaching launch within 7 days. The dashed line marks the release. Seasonality has not been removed.', source: ILLUS }, { example: true }), (sl) => {
    sl.addChart(pres.charts.LINE, [
      { name: 'Completion', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], values: [49, 50, 49, 51, 57, 58, 59, 58] },
      { name: 'Target', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], values: [70, 70, 70, 70, 70, 70, 70, 70] },
    ], { placeholder: 'chart', ...K.chartBase({ chartColors: [C.secondary, MUTE], lineSize: 2, lineDataSymbol: 'circle', lineDataSymbolSize: 6, valAxisMinVal: 40, valAxisMaxVal: 75, valAxisLabelFormatCode: '0"%"', showValue: false }) });
  });
  add(use('24', { eyebrow: 'SEGMENTS', section: 'PERFORMANCE', title: 'New advertisers abandon at twice the rate of managed accounts',
    annotation: 'So what: the redesign should be measured on new self-serve advertisers first; that is where the gap is.', source: ILLUS }, { example: true }), (sl) => {
    const cats = ['Managed', 'Returning self-serve', 'Marketplace sellers', 'New self-serve'];
    sl.addChart(pres.charts.BAR, [
      { name: 'Other', labels: cats, values: [22, 31, 36, 0] },
      { name: 'Focus', labels: cats, values: [0, 0, 0, 43] },
    ], { placeholder: 'chart', ...K.chartBase({ barDir: 'bar', barGrouping: 'clustered', barOverlapPct: 100, barGapWidthPct: 60, chartColors: [MUTE, C.secondary], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%";;;', valAxisHidden: true, catAxisLabelFontSize: 10 }) });
  });
  add(use('25', { eyebrow: 'INITIATIVES', section: 'PLAN', title: 'Five initiatives, each tied to one outcome and one owner', source: ILLUS }, { example: true }), (sl) => {
    const rows = [['Initiative', 'Outcome it moves', 'Owner', 'Confidence', 'Status'],
      ['Goal-first setup', 'Setup completion', 'Setup pod', 'Committed', K.statusCell('On track')], ['Inline budget guidance', 'Time to launch', 'Setup pod', 'Planned', K.statusCell('At risk')],
      ['Shared audience library', 'Reuse rate', 'Audiences pod', 'Planned', K.statusCell('On track')], ['Unified reporting', 'Report trust score', 'Measurement pod', 'Exploring', K.statusCell('Not started')], ['Campaign experiments', 'Tests run per quarter', 'Measurement pod', 'Exploring', K.statusCell('Not started')]];
    K.table(sl, G.left, Z.content.y, G.width, rows, [460, 440, 300, 260, 300]);
  });
  add(use('26', { title: 'Decision log: what we decided, when, and what would reopen it', source: ILLUS }, { example: true }), (sl) => {
    const rows = [['Date', 'Decision', 'Decided by', 'Rationale', 'Reopen if…'],
      ['Month 1', 'Lead setup with the advertiser’s goal', 'Product leadership', 'Research and behavior agree on decision load', 'Test shows no completion lift'],
      ['Month 1', 'Keep an expert mode', 'Product + Sales', 'Managed accounts rely on single-screen edits', 'Expert-mode use falls below 10%'],
      ['Month 2', 'Defer automated suggestions', 'Product leadership', 'Simplify before adding intelligence', 'Completion target met early'],
      ['Month 2', 'Measure on new self-serve first', 'Product + Analytics', 'Largest gap, cleanest test', 'Sample too small in 6 weeks'],
      ['Month 3', 'Share audiences across channels', 'Platform council', 'Same job, rebuilt three times today', 'API slips past next half'],
      ['Month 3', 'Report trust is a tracked KPI', 'Measurement pod', 'Mismatched numbers drive support tickets', 'A better proxy is found']];
    K.table(sl, G.left, Z.dense.content.y, G.width, rows, [180, 440, 280, 460, 400], { dense: true });
  });
  use('27', { title: '“I had the budget ready. I just couldn’t work out which of the targeting options I was supposed to pick.”', attribution: 'SELF-SERVE ADVERTISER · HOME CATEGORY · USABILITY STUDY', implication: 'The advertiser was ready to spend. The workflow, not the intent, stopped the campaign.' }, { example: true });
  use('28', { eyebrow: 'VOICE OF THE ADVERTISER', section: 'RESEARCH', title: 'Four themes, in advertisers’ own words',
    q1_theme: 'DECISION LOAD', q1_text: '“Every screen wants me to decide something I don’t understand yet.”', q1_attr: 'SELF-SERVE · NEW',
    q2_theme: 'TRUST', q2_text: '“The dashboard and the report give me two different numbers.”', q2_attr: 'AGENCY · MANAGED',
    q3_theme: 'CONTINUITY', q3_text: '“I built the audience last month. Why can’t I find it now?”', q3_attr: 'SELLER · MARKETPLACE',
    q4_theme: 'GUIDANCE', q4_text: '“Tell me what a good budget looks like for my goal.”', q4_attr: 'SELF-SERVE · RETURNING', source: ILLUS }, { example: true });
  add(use('29', { eyebrow: 'CONCEPT', section: 'EXPERIENCE', title: 'The unified workspace puts plan, build and measure on one surface', source: 'Replace the placeholder frame with a screenshot: right-click → Change Picture keeps the crop and position.' }, { example: true }), (sl) => {
    K.rect(sl, pres, G.left + 48, 344, G.width - 96, 560, C.surface, { color: C.border, width: LW.hair });
    K.rect(sl, pres, G.left + 48, 344, 260, 560, 'EEF0F3');
    K.text(sl, G.left + 380, 600, 1200, 40, 'Screenshot frame — desktop, 16:9', 'supporting', { color: C.muted, align: 'center' });
  });
  add(use('30', { eyebrow: 'ANNOTATED FLOW', section: 'EXPERIENCE', title: 'Three changes make the budget step a decision advertisers can make',
    a1_title: 'Goal carried forward', a1_body: 'The objective chosen in step one sets sensible defaults here.',
    a2_title: 'Guidance in place', a2_body: 'A recommended range, with the reason, next to the field.',
    a3_title: 'Predicted outcome', a3_body: 'Estimated reach updates as the budget changes.', source: ILLUS }, { example: true }), (sl) => {
    const x0 = col(0, 8).x + 32, y0 = Z.content.y + 32, w0 = col(0, 8).w - 64;
    K.rect(sl, pres, x0, y0, w0, 488, C.surface, { color: C.border, width: LW.hair });
    [[x0 + 60, y0 + 70, 1], [x0 + 60, y0 + 230, 2], [x0 + 600, y0 + 330, 3]].forEach(([x, y, k]) => K.marker(sl, pres, x, y, k));
    K.text(sl, x0 + 200, y0 + 220, 700, 30, 'Screenshot frame — replace with the budget step', 'bodyS', { color: C.muted });
  });
  use('31', { eyebrow: 'RECOMMENDATION', section: 'DECISION', title: 'We recommend funding goal-first setup before automated suggestions',
    rec_label: 'RECOMMENDATION', rec: 'Fund goal-first setup now; defer automated suggestions until completion reaches 65%.', rec_body: 'Suggestions on today’s flow would add a decision, not remove one. We accept a slower path to automation in exchange for a flow worth automating. We will not build channel-specific setup variants in the meantime.',
    dec_label: 'DECISION NEEDED', dec: 'Approve two additional engineers for the setup pod for two quarters.', owner_label: 'OWNER', owner: 'Director, Advertiser Experience', by_label: 'NEEDED BY', by: 'End of month — the beta slips a quarter otherwise', source: ILLUS }, { example: true });
  use('32', { eyebrow: 'OPTIONS', section: 'DECISION', title: 'Three ways to reduce setup abandonment, and what each costs',
    o1_label: 'OPTION A', o1_title: 'Patch the current flow', o1_body: 'Fix the top ten usability issues in place. Fastest to ship.', o1_trade_label: 'TRADEOFF', o1_trade: 'Leaves decision load untouched; gains likely plateau.',
    o2_label: 'OPTION B', o2_title: 'Goal-first setup', o2_body: 'Reorder around the objective, defer what can be defaulted.', o2_trade_label: 'TRADEOFF', o2_trade: 'Two quarters of build; expert mode needed for power users.',
    o3_label: 'OPTION C', o3_title: 'Automate setup now', o3_body: 'Suggest full campaigns from a goal and a budget.', o3_trade_label: 'TRADEOFF', o3_trade: 'Automates a flow we already know is confusing.',
    pick: 'Recommended: Option B — it removes decisions instead of hiding them.', source: ILLUS }, { example: true });
  use('33', { title: 'Fund the setup reorder, and measure it on outcomes', subtitle: 'Completion is the constraint on growth this year.',
    ask1_label: 'ALIGN', ask1: 'Agree that setup completion is the lead measure for next half.', ask2_label: 'DECIDE', ask2: 'Approve two engineers for the setup pod for two quarters.', ask3_label: 'NEXT', ask3: 'Beta to new self-serve advertisers; readout in eight weeks.' }, { example: true });
  use('34', { title: 'Appendix', subtitle: 'Method, definitions and the full research inventory behind this review.' }, { example: true });

  // ════════════════════════════════════════════════════════════════════════
  // 4 · Component library
  // ════════════════════════════════════════════════════════════════════════
  use('06', { number: 'SYSTEM 04', title: 'Components: copy them, don’t redraw them. A recommendation should look like a recommendation on every slide.' });

  add(use('09', { eyebrow: 'COMPONENTS · PILLS, STATUS, DELTAS', section: 'COMPONENTS', title: 'Pills are fixed-height and monospaced, so they never need resizing by hand', subtitle: 'Status always pairs colour with a shape. Deltas pair colour with a direction glyph.', source: 'Pill: 28px high, 12px side padding, full radius, Mono 7.5pt caps. Keep labels ≤ 18 characters.' }), (sl) => {
    const groups = [
      ['CATEGORY / CHANNEL', [['Sponsored', 'category'], ['Display', 'category'], ['Offsite', 'category'], ['Marketplace', 'category']]],
      ['PRIORITY / PHASE', [['P1', 'strong'], ['P2', 'outline'], ['P3', 'neutral'], ['Discovery', 'neutral'], ['Beta', 'info'], ['GA', 'strong']]],
      ['SENTIMENT', [['Positive', 'positive'], ['Neutral', 'neutral'], ['Negative', 'negative'], ['Watch', 'warning']]],
      ['OWNER / META', [['Product', 'outline'], ['Design', 'outline'], ['Engineering', 'outline'], ['Sales', 'outline']]],
    ];
    groups.forEach(([lab, ps], r) => {
      const y = Z.content.y + r * 72;
      K.text(sl, G.left, y + 6, 280, 20, lab, 'label', { color: C.muted });
      let x = G.left + 300; ps.forEach(([t, v]) => { x += K.pill(sl, pres, x, y, t, v) + 12; });
    });
    K.text(sl, col(7, 5).x, Z.content.y + 6, 400, 20, 'STATUS', 'label', { color: C.muted });
    Object.keys(K.STATUS).forEach((s, i) => K.status(sl, pres, col(7, 5).x, Z.content.y + 40 + i * 40, s));
    K.text(sl, col(10, 2).x, Z.content.y + 6, 300, 20, 'DELTAS', 'label', { color: C.muted });
    [['12 PTS', 'up'], ['3 PTS', 'down'], ['0 PTS', 'flat']].forEach(([v, d], i) => K.delta(sl, pres, col(10, 2).x, Z.content.y + 40 + i * 44, v, d));
  });

  add(use('09', { eyebrow: 'COMPONENTS · CARDS', section: 'COMPONENTS', title: 'One card anatomy, four treatments, each with a meaning', subtitle: 'Eyebrow → title → optional metric → body → optional footer. Padding is 24px everywhere; equal rows are equal height.', source: 'Rule = default peer module (deck-native). Surface = grouped content. Emphasis = the one pick among peers — never the last step of a sequence. Dark = a decision.' }), (sl) => {
    const w = col(0, 3).w, h = 300, y = Z.content.y;
    K.card(sl, pres, col(0, 3).x, y, w, h, { variant: 'rule', eyebrow: 'Rule card', title: 'Default peer module', body: 'Top rule, no fill. Use for pillars, themes and any row of equals.' });
    K.card(sl, pres, col(3, 3).x, y, w, h, { variant: 'surface', eyebrow: 'Surface card', title: 'Grouped content', body: 'Quiet #E9EEF3 surface. Use for findings, risks, snapshots.', footer: 'Owner · Date' });
    K.card(sl, pres, col(6, 3).x, y, w, h, { variant: 'emphasis', eyebrow: 'Emphasis card', title: 'The recommended option', body: 'Everyday Blue border. One per row, only with a reason on the slide.' });
    K.card(sl, pres, col(9, 3).x, y, w, h, { variant: 'dark', eyebrow: 'Decision', title: 'Approve two engineers for two quarters', body: 'Navy is reserved for the decision the room must make.', footer: 'Needed by: end of month' });
    K.text(sl, G.left, y + 340, 1760, 60, 'Compact state: drop the body and keep eyebrow + title. Dense state: 16px padding and Body small, used only on layout 26.', 'body', { color: C.text2 });
  });

  add(use('09', { eyebrow: 'COMPONENTS · SEMANTIC CARDS', section: 'COMPONENTS', title: 'Semantic cards: the same job always wears the same card', subtitle: 'Metric, insight, recommendation, risk, initiative, evidence, pain point and quote.', source: ILLUS }), (sl) => {
    const w = col(0, 3).w, h = 256; const y1 = Z.content.y, y2 = Z.content.y + 280;
    K.card(sl, pres, col(0, 3).x, y1, w, h, { variant: 'rule', eyebrow: 'Metric', metric: '58%', title: 'Setup completion', body: 'Trailing two quarters.' });
    K.card(sl, pres, col(3, 3).x, y1, w, h, { variant: 'surface', eyebrow: 'Insight', title: 'Abandonment clusters at decision steps', body: 'Targeting and budget, not creative upload.' });
    K.card(sl, pres, col(6, 3).x, y1, w, h, { variant: 'surface', eyebrow: 'Recommendation', title: 'Lead setup with the goal', body: 'Defer what can be defaulted.', pillLabel: 'Recommended', pillVariant: 'strong' });
    K.card(sl, pres, col(9, 3).x, y1, w, h, { variant: 'surface', eyebrow: 'Risk', title: 'Audience API not ready', body: 'Ship with today’s picker.', pillLabel: 'High · owner PM', pillVariant: 'negative' });
    K.card(sl, pres, col(0, 3).x, y2, w, h, { variant: 'surface', eyebrow: 'Initiative', title: 'Goal-first setup', body: 'Moves: completion.', pillLabel: 'Now', pillVariant: 'strong' });
    K.card(sl, pres, col(3, 3).x, y2, w, h, { variant: 'surface', eyebrow: 'Evidence', title: '3 of 5 sources agree', body: 'UXR, Pendo, support tickets.', pillLabel: 'Triangulated', pillVariant: 'positive' });
    K.card(sl, pres, col(6, 3).x, y2, w, h, { variant: 'surface', eyebrow: 'Pain point', title: 'Numbers don’t match', body: 'Same metric, two reports.', pillLabel: 'Unclear', pillVariant: 'category' });
    K.card(sl, pres, col(9, 3).x, y2, w, h, { variant: 'surface', eyebrow: 'Quote', title: '“Tell me what a good budget looks like.”', body: 'Self-serve · returning' });
  });

  add(use('09', { eyebrow: 'COMPONENTS · MARKERS, CONNECTORS, CALLOUTS', section: 'COMPONENTS', title: 'Annotation parts share one marker, one leader line and one spacing', subtitle: 'Numbers mark the order of reading. Connectors are 1pt True Blue with a small arrowhead. Callouts never cover the product UI.', source: 'Source block: 8pt, bottom of the slide, name · date range · sample size. Legends only when a direct label will not fit.' }), (sl) => {
    const y = Z.content.y;
    K.text(sl, G.left, y, 400, 20, 'NUMBER MARKERS', 'label', { color: C.muted });
    [1, 2, 3].forEach((k, i) => K.marker(sl, pres, G.left + i * 48, y + 32, k)); [4, 5].forEach((k, i) => K.marker(sl, pres, G.left + 144 + i * 48, y + 32, k, 'outline'));
    K.text(sl, G.left, y + 100, 400, 20, 'CONNECTORS', 'label', { color: C.muted });
    K.line(sl, pres, G.left, y + 150, 360, 0, C.secondary, LW.rule, { endArrowType: 'triangle' });
    K.line(sl, pres, G.left, y + 190, 360, 0, C.borderStrong, LW.rule, { dashType: 'dash' });
    K.text(sl, G.left + 380, y + 140, 400, 22, 'Flow / causation', 'bodyS', { color: C.text2 }); K.text(sl, G.left + 380, y + 180, 400, 22, 'Reference line only', 'bodyS', { color: C.text2 });
    K.text(sl, G.left, y + 240, 400, 20, 'TIMELINE MARKERS', 'label', { color: C.muted });
    K.line(sl, pres, G.left, y + 290, 560, 0, C.borderStrong, LW.rule);
    [[0, 'Done', C.secondary, null], [180, 'Next', C.surface, C.secondary], [360, 'Planned', C.surface, C.borderStrong], [540, 'Gate', C.primary, null]].forEach(([dx, lab, f, l]) => {
      K.dot(sl, pres, G.left + dx, y + 282, 16, f, l ? { color: l, width: LW.strong } : null); K.text(sl, G.left + dx - 20, y + 308, 120, 20, lab, 'bodyS', { color: C.text2 });
    });
    K.text(sl, col(6, 6).x, y, 500, 20, 'CALLOUT', 'label', { color: C.muted });
    K.rect(sl, pres, col(6, 6).x, y + 32, 480, 300, C.surface, { color: C.border, width: LW.hair });
    K.callout(sl, pres, col(6, 6).x + 520, y + 60, 1, 'Leader line to the element', 'The marker sits beside the UI, never on it.', 320, { x1: col(6, 6).x + 380, y1: y + 76, x2: col(6, 6).x + 520, y2: y + 76 });
    K.dot(sl, pres, col(6, 6).x + 372, y + 68, 16, C.secondary);
    K.text(sl, col(6, 6).x, y + 360, 500, 20, 'SECTION LABEL · SOURCE BLOCK', 'label', { color: C.muted });
    K.text(sl, col(6, 6).x, y + 392, 800, 20, 'SECTION 02 · WHAT IS DRIVING IT', 'label', { color: C.secondary });
    K.text(sl, col(6, 6).x, y + 424, 800, 30, 'Source: Setup funnel, Pendo, trailing two quarters, n = 18,400 setup starts.', 'source', { color: C.muted });
  });

  // ════════════════════════════════════════════════════════════════════════
  // 5 · Charts
  // ════════════════════════════════════════════════════════════════════════
  const half = (i) => ({ x: col(i * 6, 6).x, w: col(i * 6, 6).w });
  const chartTitle = (sl, i, lab, head) => { K.text(sl, half(i).x, Z.content.y, half(i).w, 20, lab, 'label', { color: C.secondary }); K.text(sl, half(i).x, Z.content.y + 26, half(i).w, 30, head, 'cardTitle', { color: C.text }); };
  const chartBox = (i) => ({ ...box(half(i).x, Z.content.y + 64, half(i).w, 470) });

  add(use('09', { eyebrow: 'CHARTS · RANKING & COMPOSITION', section: 'CHARTS', title: 'Bars rank and compare; highlight the one that carries the point', subtitle: 'Direct labels, no gridlines, no legend for one series, one colour unless a series is the point.', source: ILLUS }), (sl) => {
    chartTitle(sl, 0, 'HORIZONTAL BAR · HIGHLIGHT ONE', 'Abandonment by setup step');
    const steps = ['Objective', 'Audience', 'Budget', 'Bid', 'Creative', 'Review'];
    sl.addChart(pres.charts.BAR, [{ name: 'Other', labels: steps, values: [6, 0, 0, 9, 4, 3] }, { name: 'Focus', labels: steps, values: [0, 21, 17, 0, 0, 0] }],
      { ...chartBox(0), ...K.chartBase({ barDir: 'bar', barOverlapPct: 100, barGapWidthPct: 50, chartColors: [MUTE, C.secondary], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%";;;', valAxisHidden: true, catAxisOrientation: 'maxMin' }) });
    chartTitle(sl, 1, '100% STACKED BAR · COMPOSITION', 'Where advertisers finish setup, by segment');
    const seg = ['Managed', 'Returning', 'Sellers', 'New'];
    sl.addChart(pres.charts.BAR, [{ name: 'Launched', labels: seg, values: [78, 69, 64, 57] }, { name: 'Saved draft', labels: seg, values: [12, 16, 15, 14] }, { name: 'Abandoned', labels: seg, values: [10, 15, 21, 29] }],
      { ...chartBox(1), ...K.chartBase({ barDir: 'bar', barGrouping: 'percentStacked', barGapWidthPct: 50, chartColors: [C.secondary, '5E636E', '97999F'], showValue: true, dataLabelPosition: 'ctr', dataLabelFormatCode: '0"%"', dataLabelColor: C.surface, valAxisHidden: true, showLegend: true, legendPos: 'b', legendFontFace: FONT.ui, legendFontSize: 9, legendColor: C.text2, catAxisOrientation: 'maxMin' }) });
  });

  add(use('09', { eyebrow: 'CHARTS · CHANGE OVER TIME', section: 'CHARTS', title: 'Lines show trends; mute the context series and label the one that matters', subtitle: 'Consistent baselines when charts are compared. Annotate the event, not the axis.', source: ILLUS }), (sl) => {
    chartTitle(sl, 0, 'MULTI-LINE · HIGHLIGHT ONE SERIES', 'Completion by segment, monthly');
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    sl.addChart(pres.charts.LINE, [{ name: 'Managed', labels: mo, values: [76, 77, 76, 78, 78, 79, 78, 78] }, { name: 'Returning', labels: mo, values: [63, 64, 63, 65, 68, 69, 69, 69] }, { name: 'New self-serve', labels: mo, values: [44, 45, 44, 46, 53, 56, 57, 57] }],
      { ...chartBox(0), ...K.chartBase({ chartColors: [MUTE, MUTE, C.secondary], lineSize: 2, lineDataSymbol: 'none', valAxisMinVal: 40, valAxisMaxVal: 80, valAxisLabelFormatCode: '0"%"', showLegend: true, legendPos: 'b', legendFontFace: FONT.ui, legendFontSize: 9, legendColor: C.text2 }) });
    chartTitle(sl, 1, 'WATERFALL · CONTRIBUTION TO CHANGE', 'What moved completion from 50% to 58%');
    const wf = ['Start', 'Reorder', 'Defaults', 'Guidance', 'End'];
    sl.addChart(pres.charts.BAR, [{ name: 'Base', labels: wf, values: [0, 50, 55, 57, 0] }, { name: 'Change', labels: wf, values: [50, 5, 2, 1, 58] }],
      { ...chartBox(1), ...K.chartBase({ barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [C.background, C.secondary], showValue: false, valAxisMinVal: 0, valAxisMaxVal: 65, valAxisHidden: true }) });
    K.text(sl, half(1).x, Z.content.y + 540, half(1).w, 22, '+5 reorder · +2 defaults · +1 guidance. The base series takes the page colour; label the deltas directly.', 'annotation', { color: C.muted, fontSize: 9 });
  });

  add(use('09', { eyebrow: 'CHARTS · FUNNELS, PROGRESS, PATTERNS', section: 'CHARTS', title: 'Funnels, progress bars and heatmaps cover the rest of the everyday charts', subtitle: 'Funnel = sorted bars. Progress = a track and a target. Heatmap = a table with a single-hue ramp.', source: ILLUS }), (sl) => {
    const x0 = G.left, y0 = Z.content.y;
    K.text(sl, x0, y0, 560, 20, 'FUNNEL', 'label', { color: C.secondary });
    [['Setup started', 100], ['Objective set', 91], ['Audience set', 70], ['Budget set', 58], ['Launched', 58]].forEach(([lab, v], i) => {
      const w = 5.2 * v; const y = y0 + 36 + i * 62;
      K.rect(sl, pres, x0, y, w, 44, i === 2 ? C.secondary : RAMP[3]);
      K.text(sl, x0 + 16, y + 11, 260, 22, lab, 'bodyS', { color: i === 2 ? C.surface : C.text });
      K.text(sl, x0 + w + 12, y + 11, 80, 22, `${v}%`, 'bodyS', { color: C.text });
    });
    const x1 = col(5, 3).x;
    K.text(sl, x1, y0, 400, 20, 'PROGRESS / BULLET', 'label', { color: C.secondary });
    [['Completion', 58, 70], ['Time to launch', 40, 60], ['Reuse rate', 22, 40]].forEach(([lab, v, t], i) => {
      const y = y0 + 40 + i * 100, W = 440;
      K.text(sl, x1, y, W, 22, lab, 'cardTitle', { color: C.text, fontSize: 11 });
      K.rrect(sl, pres, x1, y + 32, W, 16, C.surfaceAlt, 8); K.rrect(sl, pres, x1, y + 32, W * v / 100, 16, C.secondary, 8);
      K.line(sl, pres, x1 + W * t / 100, y + 24, 0, 32, C.primary, LW.strong);
      K.text(sl, x1, y + 56, W, 20, `${v}% of plan · target ${t}%`, 'source', { color: C.muted });
    });
    const x2 = col(9, 3).x;
    K.text(sl, x2, y0, 400, 20, 'HEATMAP · COHORT', 'label', { color: C.secondary });
    const hm = [[100, 72, 61, 55], [100, 75, 66, 60], [100, 81, 72, 68]];
    const ramp = (v) => (v >= 90 ? RAMP[0] : v >= 70 ? RAMP[1] : v >= 60 ? RAMP[2] : RAMP[3]);
    ['M0', 'M1', 'M2', 'M3'].forEach((h, j) => K.text(sl, x2 + 90 + j * 88, y0 + 32, 88, 20, h, 'label', { color: C.muted, align: 'center' }));
    hm.forEach((row, i) => {
      K.text(sl, x2, y0 + 72 + i * 72, 90, 22, ['Q1', 'Q2', 'Q3'][i], 'label', { color: C.muted });
      row.forEach((v, j) => { K.rect(sl, pres, x2 + 90 + j * 88, y0 + 60 + i * 72, 84, 66, ramp(v)); K.text(sl, x2 + 90 + j * 88, y0 + 80 + i * 72, 84, 24, String(v), 'bodyS', { color: v >= 70 ? C.surface : C.text, align: 'center' }); });
    });
    K.text(sl, x2, y0 + 290, 440, 60, 'Retention by launch cohort. Darker = higher. Numbers stay on the cells.', 'annotation', { color: C.muted, fontSize: 9 });
  });

  use('15', { eyebrow: 'CHARTS · RULES', section: 'CHARTS', title: 'Start with the insight, then choose the chart that shows it',
    r1_label: 'CHOOSE', r1_text: 'Bars rank. Lines trend. Dot plots compare precisely. Heatmaps show patterns. Waterfalls show contribution. Never 3D.',
    r2_label: 'HIGHLIGHT', r2_text: 'One series, segment or delta in True Blue; everything else in #C3C6CD. Direct labels beat legends.',
    r3_label: 'REMOVE', r3_text: 'Gridlines, borders, tick marks, extra decimals and default styling. Keep baselines consistent across compared charts.',
    r4_label: 'VARIANTS', r4_text: 'Standard · annotated insight · comparison · highlight one series · dense appendix. Every chart has a source and a so-what zone.' });

  // ════════════════════════════════════════════════════════════════════════
  // 6 · Tables
  // ════════════════════════════════════════════════════════════════════════
  add(use('09', { eyebrow: 'TABLES · KPI & RISK', section: 'TABLES', title: 'Tables are structured by type and whitespace, not by gridlines', subtitle: 'Narrative columns get width; numbers are right-aligned; status carries a shape.', source: ILLUS }), (sl) => {
    K.text(sl, G.left, Z.content.y, 800, 20, 'KPI TABLE', 'label', { color: C.muted });
    K.table(sl, G.left, Z.content.y + 28, col(0, 6).w, [['Metric', 'Actual', 'Target', 'Δ QoQ'], ['Setup completion', '58%', '70%', '+4 pts'], ['Median time to launch', '11 min', '8 min', '0'], ['Help views per setup', '3.2', '2.0', '−0.6'], ['Report trust score', '61', '75', '+3']], [380, 160, 160, 164], { align: ['left', 'right', 'right', 'right'] });
    K.text(sl, col(6, 6).x, Z.content.y, 800, 20, 'RISK TABLE', 'label', { color: C.muted });
    K.table(sl, col(6, 6).x, Z.content.y + 28, col(6, 6).w, [['Risk', 'Likelihood', 'Impact', 'Mitigation'], ['Audience API slips', 'Medium', 'High', 'Ship with current picker'], ['Power users resist', 'High', 'Medium', 'Keep expert mode'], ['No performance lift', 'Medium', 'High', 'Guardrail metrics in test']], [300, 150, 130, 284]);
  });

  add(use('26', { title: 'Dense appendix table: purpose-built for reference, still readable at 10.5pt', source: ILLUS }), (sl) => {
    const rows = [['Source', 'Type', 'Period', 'Sample', 'What it contributes', 'Status']];
    const data = [['Setup usability study', 'Moderated UXR', 'Month 1', '12 advertisers', 'Where and why advertisers stall', 'Linked'], ['Setup funnel', 'Pendo behavior', '2 quarters', '18,400 starts', 'Step-level abandonment', 'Linked'], ['Relationship survey', 'VOC', '2 quarters', '1,350 scored', 'Satisfaction and verbatims', 'Linked'], ['Support tickets', 'Operational', '2 quarters', '2,900 tickets', 'Setup-related contact drivers', 'Needs link'], ['Sales field notes', 'Qualitative', 'Month 2', '14 sellers', 'Account-level escalations', 'Needs link'], ['Competitive teardown', 'Desk research', 'Month 2', '4 platforms', 'Setup step counts and defaults', 'Check figure'], ['Expert-mode interviews', 'UXR', 'Month 3', '8 managed accounts', 'What power users need to keep', 'Linked'], ['Experiment design review', 'Analytics', 'Month 3', '—', 'Power and guardrails for the test', 'Linked'], ['Design critique notes', 'Internal', 'Month 3', '3 sessions', 'Open questions for the beta', 'Linked']];
    K.table(sl, G.left, Z.dense.content.y, G.width, [...rows, ...data], [340, 220, 180, 220, 560, 240], { dense: true });
  });

  // ════════════════════════════════════════════════════════════════════════
  // 7 · Infographic primitives
  // ════════════════════════════════════════════════════════════════════════
  exampleOf['09'] = n + 1; // Title Only is shown through the diagram library
  const cell = (i, cols = 3) => { const w = (G.width - (cols - 1) * 48) / cols; return { x: G.left + (i % cols) * (w + 48), y: Z.content.y + Math.floor(i / cols) * 290, w, h: 262 }; };
  const primLabel = (sl, c, t) => K.text(sl, c.x, c.y, c.w, 20, t, 'label', { color: C.secondary });

  add(use('09', { eyebrow: 'DIAGRAMS · FLOW', section: 'DIAGRAMS', title: 'Flow primitives: progression, loop, funnel, layers, many → one, signal → outcome', subtitle: 'Every primitive inherits the same type, connector and colour rules. Recolour through the ramp, never ad hoc.' }), (sl) => {
    let c = cell(0); primLabel(sl, c, 'LINEAR PROGRESSION');
    K.line(sl, pres, c.x, c.y + 70, c.w, 0, C.secondary, LW.rule);
    ['Plan', 'Build', 'Launch', 'Learn'].forEach((t, i) => { const x = c.x + i * c.w / 4; K.dot(sl, pres, x, c.y + 62, 16, C.background, { color: C.secondary, width: LW.strong }); K.text(sl, x, c.y + 94, c.w / 4 - 8, 30, t, 'cardTitle', { color: C.text }); });
    c = cell(1); primLabel(sl, c, 'CIRCULAR LOOP / FLYWHEEL');
    const cx = c.x + c.w / 2, cy = c.y + 150, r = 90;
    K.dot(sl, pres, cx - r, cy - r, 2 * r, null, { color: C.secondary, width: LW.rule });
    ['Listen', 'Diagnose', 'Simplify', 'Measure', 'Learn'].forEach((t, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); K.dot(sl, pres, x - 8, y - 8, 16, i === 0 ? C.secondary : C.background, { color: C.secondary, width: LW.strong }); const right = Math.cos(a) >= 0; K.text(sl, right ? x + 16 : x - 136, y - 10, 120, 20, t, 'bodyS', { color: C.text, align: right ? 'left' : 'right' }); });
    c = cell(2); primLabel(sl, c, 'FUNNEL');
    [1, 0.8, 0.6, 0.42].forEach((f, i) => { const w = c.w * 0.8 * f; K.rect(sl, pres, c.x + (c.w * 0.8 - w) / 2, c.y + 40 + i * 52, w, 44, RAMP[i]); K.text(sl, c.x + c.w * 0.8 + 16, c.y + 52 + i * 52, 120, 20, ['Reach', 'Consider', 'Start', 'Launch'][i], 'bodyS', { color: C.text2 }); });
    c = cell(3); primLabel(sl, c, 'NESTED LAYERS / STACK');
    [['Experiences', C.surfaceAlt, C.text], ['Shared capabilities', 'CFE0FF', C.text], ['Platform foundation', C.primary, C.surface]].forEach(([t, f, ink], i) => { K.rrect(sl, pres, c.x, c.y + 40 + i * 70, c.w, 60, f, 12); K.text(sl, c.x + 24, c.y + 58 + i * 70, c.w - 48, 24, t, 'cardTitle', { color: ink }); });
    c = cell(4); primLabel(sl, c, 'MANY → ONE');
    ['Sponsored', 'Display', 'Offsite', 'Seller'].forEach((t, i) => { const y = c.y + 44 + i * 50; K.text(sl, c.x, y, 160, 24, t, 'bodyS', { color: C.text }); K.seg(sl, pres, c.x + 170, y + 12, c.x + 370, c.y + 130, C.borderStrong, LW.rule); });
    K.rrect(sl, pres, c.x + 370, c.y + 100, c.w - 370, 60, C.secondary, 12); K.text(sl, c.x + 370, c.y + 118, c.w - 370, 24, 'One job', 'cardTitle', { color: C.surface, align: 'center' });
    c = cell(5); primLabel(sl, c, 'SIGNAL → DIAGNOSIS → ACTION → OUTCOME');
    ['Signal', 'Diagnosis', 'Action', 'Outcome'].forEach((t, i) => { const w = (c.w - 3 * 28) / 4, x = c.x + i * (w + 28); K.rrect(sl, pres, x, c.y + 80, w, 80, i === 3 ? C.secondary : C.surfaceAlt, 12); K.text(sl, x, c.y + 108, w, 24, t, 'cardTitle', { color: i === 3 ? C.surface : C.text, align: 'center', fontSize: 11 }); if (i < 3) K.text(sl, x + w, c.y + 104, 28, 30, '→', 'bodyL', { color: C.secondary, align: 'center' }); });
  });

  add(use('09', { eyebrow: 'DIAGRAMS · STRUCTURE', section: 'DIAGRAMS', title: 'Structure primitives: 2 × 2, hub and spoke, hierarchy, pyramid, value chain, before → future' }), (sl) => {
    let c = cell(0); primLabel(sl, c, '2 × 2 MATRIX');
    const q = (c.w - 60) / 2;
    [['Quick wins', 1], ['Big bets', 0], ['Deprioritize', 3], ['Maybe later', 3]].forEach(([t, k], i) => { const x = c.x + 40 + (i % 2) * (q + 8), y = c.y + 36 + Math.floor(i / 2) * 104; K.rect(sl, pres, x, y, q, 96, i === 0 ? C.secondary : i === 1 ? 'CFE0FF' : C.surfaceAlt); K.text(sl, x + 16, y + 14, q - 32, 22, t, 'cardTitle', { color: i === 0 ? C.surface : C.text, fontSize: 11 }); });
    K.text(sl, c.x, c.y + 250, c.w, 20, 'EFFORT →', 'label', { color: C.muted, align: 'center' });
    c = cell(1); primLabel(sl, c, 'HUB AND SPOKE');
    const hx = c.x + c.w / 2, hy = c.y + 146;
    [0, 1, 2, 3, 4, 5].forEach((i) => { const a = i * Math.PI / 3; const x = hx + 150 * Math.cos(a), y = hy + 90 * Math.sin(a); K.seg(sl, pres, hx, hy, x, y, C.borderStrong, LW.rule); K.dot(sl, pres, x - 18, y - 18, 36, C.surfaceAlt); });
    K.dot(sl, pres, hx - 44, hy - 44, 88, C.secondary); K.text(sl, hx - 44, hy - 12, 88, 24, 'Core', 'cardTitle', { color: C.surface, align: 'center', fontSize: 11 });
    c = cell(2); primLabel(sl, c, 'HIERARCHY / TREE');
    K.rrect(sl, pres, c.x + c.w / 2 - 90, c.y + 40, 180, 48, C.primary, 8); K.text(sl, c.x + c.w / 2 - 90, c.y + 54, 180, 22, 'North star', 'cardTitle', { color: C.surface, align: 'center', fontSize: 11 });
    K.line(sl, pres, c.x + c.w / 6, c.y + 118, c.w * 2 / 3, 0, C.borderStrong, LW.rule); K.line(sl, pres, c.x + c.w / 2, c.y + 88, 0, 30, C.borderStrong, LW.rule);
    [0, 1, 2].forEach((i) => { const x = c.x + i * c.w / 3; K.line(sl, pres, x + c.w / 6, c.y + 118, 0, 24, C.borderStrong, LW.rule); K.rrect(sl, pres, x + 8, c.y + 142, c.w / 3 - 16, 48, C.surfaceAlt, 8); K.text(sl, x + 8, c.y + 156, c.w / 3 - 16, 22, `Pillar ${i + 1}`, 'bodyS', { color: C.text, align: 'center' }); });
    c = cell(3); primLabel(sl, c, 'PYRAMID');
    ['Vision', 'Strategy', 'Initiatives', 'Delivery'].forEach((t, i) => { const w = c.w * (0.35 + i * 0.2); K.rect(sl, pres, c.x + (c.w - w) / 2, c.y + 40 + i * 52, w, 46, RAMP[i]); K.text(sl, c.x + (c.w - w) / 2, c.y + 52 + i * 52, w, 22, t, 'cardTitle', { color: i < 2 ? C.surface : C.text, align: 'center', fontSize: 11 }); });
    c = cell(4); primLabel(sl, c, 'VALUE CHAIN');
    ['Plan', 'Buy', 'Serve', 'Measure', 'Optimize'].forEach((t, i) => { const w = (c.w + 4 * 6) / 5 - 6; sl.addShape(pres.shapes.CHEVRON, { ...box(c.x + i * (w + 6), c.y + 90, w, 70), fill: { color: i === 3 ? C.secondary : C.surfaceAlt }, line: { type: 'none' } }); K.text(sl, c.x + i * (w + 6) + 14, c.y + 114, w - 20, 22, t, 'bodyS', { color: i === 3 ? C.surface : C.text, align: 'center' }); });
    c = cell(5); primLabel(sl, c, 'BEFORE → TRANSITION → FUTURE');
    [['Before', C.surfaceAlt, C.text, C.borderStrong], ['Transition', 'CFE0FF', C.text, C.secondary], ['Future', C.secondary, C.surface, C.secondary]].forEach(([t, f, ink], i) => { const w = (c.w - 2 * 20) / 3; K.rrect(sl, pres, c.x + i * (w + 20), c.y + 60, w, 150, f, 12); K.text(sl, c.x + i * (w + 20) + 16, c.y + 76, w - 32, 22, t, 'cardTitle', { color: ink, fontSize: 11 }); });
  });

  add(use('09', { eyebrow: 'DIAGRAMS · TIME', section: 'DIAGRAMS', title: 'Time primitives: a milestone timeline and a swimlane roadmap', subtitle: 'Quarters, not dates, unless the dates are committed. Confidence is shown, not implied.', source: ILLUS }), (sl) => {
    const y0 = Z.content.y;
    K.text(sl, G.left, y0, 800, 20, 'MILESTONE TIMELINE', 'label', { color: C.secondary });
    K.line(sl, pres, G.left, y0 + 60, G.width, 0, C.borderStrong, LW.rule);
    [['Q1', 'Research readout', 'done'], ['Q2', 'Beta to new advertisers', 'done'], ['Q3', 'Expert mode', 'next'], ['Q4', 'GA decision gate', 'gate'], ['Q1 +1', 'Suggestions pilot', 'plan']].forEach(([q, t, s], i) => {
      const x = G.left + i * 360; K.dot(sl, pres, x, y0 + 52, 16, s === 'done' ? C.secondary : s === 'gate' ? C.primary : C.background, s === 'next' || s === 'plan' ? { color: s === 'next' ? C.secondary : C.borderStrong, width: LW.strong } : null);
      K.text(sl, x, y0 + 80, 360, 20, q, 'label', { color: C.muted }); K.text(sl, x, y0 + 104, 360, 24, t, 'cardTitle', { color: C.text, fontSize: 12 });
    });
    K.text(sl, G.left, y0 + 170, 800, 20, 'SWIMLANE ROADMAP', 'label', { color: C.secondary });
    const lanes = [['Setup', [[0, 2, 'Goal-first setup', 1], [2, 1.5, 'Expert mode', 0]]], ['Audiences', [[1, 2.5, 'Shared audience library', 0]]], ['Measurement', [[0.5, 1.5, 'Instrumentation', 1], [2.5, 1.5, 'Experiments', 2]]]];
    const qw = (G.width - 200) / 4;
    ['Q1', 'Q2', 'Q3', 'Q4'].forEach((q, i) => K.text(sl, G.left + 200 + i * qw, y0 + 200, qw, 20, q, 'label', { color: C.muted }));
    lanes.forEach(([lab, bars], i) => {
      const y = y0 + 232 + i * 64; K.line(sl, pres, G.left, y + 56, G.width, 0, C.border, LW.hair); K.text(sl, G.left, y + 16, 190, 22, lab, 'cardTitle', { color: C.text, fontSize: 11 });
      bars.forEach(([s, l, t, k]) => { K.rrect(sl, pres, G.left + 200 + s * qw, y + 8, l * qw - 8, 40, [C.secondary, 'CFE0FF', C.surfaceAlt][k], 8); K.text(sl, G.left + 216 + s * qw, y + 8, l * qw - 40, 40, t, 'bodyS', { color: k === 0 ? C.surface : C.text, valign: 'middle' }); });
    });
    K.text(sl, G.left + 200, y0 + 432, 1200, 22, 'Committed · Planned · Exploring — fill weight carries confidence.', 'annotation', { color: C.muted, fontSize: 9 });
  });

  // ════════════════════════════════════════════════════════════════════════
  // 8 · Do / don't and close
  // ════════════════════════════════════════════════════════════════════════
  use('11', { eyebrow: 'DO / DON’T', section: 'USAGE', title: 'The system works when routine edits need no design work',
    c1_label: 'DO', c1_title: 'Duplicate, replace, delete, present', c1_body: 'Pick the layout by job. Type into placeholders. Delete unused modules rather than moving the rest. Keep peers the same length. Cite every number in the source zone. Repeat a layout when the job repeats.',
    c2_label: 'DON’T', c2_title: 'Nudge, shrink, recolour, decorate', c2_body: 'Don’t drag placeholders off the grid, shrink text to make it fit, invent a colour, add gradients, shadows or accent stripes, or fill one card among peers without a stated reason.' });
  use('33', { title: 'The thinking changes. The design system does not.', subtitle: 'Make the correct design choice the easiest one.', ask1_label: 'START', ask1: 'Pick the communication job on the layout picker.', ask2_label: 'BUILD', ask2: 'Use the numbered layouts and the component slides.', ask3_label: 'CHECK', ask3: 'Three-second test, swap test, export test before it goes out.' });

  await pres.writeFile({ fileName: OUT });
  fs.writeFileSync(path.join(__dirname, 'build-map.json'), JSON.stringify({ exampleOf, catalogSlides, masters: M.map(({ name, job, use, ideal, max, fallback, placeholders, phMeta }) => ({ name, job, use, ideal, max, fallback, placeholders, phMeta })) }, null, 1));
  console.log('slides', n, 'masters', M.length);
})().catch((e) => { console.error(e); process.exit(1); });
