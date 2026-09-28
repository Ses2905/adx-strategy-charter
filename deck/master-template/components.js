// Layer 2 · Components — native shapes with fixed geometry.
// Every component takes (slide, pres, x, y, ...) in canvas px and draws editable
// PowerPoint shapes. Nothing depends on auto-sizing: widths are computed from the
// monospaced label font, heights and paddings are constants.
const { PX, FONT, C, RAMP, MUTE, style, LW, box, txt } = require('./system');

const MONO_CH = 10.8; // px per character, Everyday Sans Mono 7.5pt + tracking, on the 1920 canvas
const up = (s) => s.toUpperCase();
// Rough wrap estimate for proportional UI text: average glyph ≈ 0.52em. Used to size
// stacked text so a two-line title pushes the body down instead of overlapping it.
const linesFor = (t, pt, w) => Math.max(1, Math.ceil((String(t).length * pt * 2 * 0.52) / w));

// ── primitives ──────────────────────────────────────────────────────────────
function line(sl, pres, x, y, w, h, color, width = LW.hair, extra = {}) {
  sl.addShape(pres.shapes.LINE, { ...box(x, y, w, h), line: { color, width, ...extra } });
}
// Segment between two points; PowerPoint lines need positive extents, so flip instead.
function seg(sl, pres, x1, y1, x2, y2, color, width = LW.rule, extra = {}) {
  const flipV = (x2 - x1) * (y2 - y1) < 0;
  sl.addShape(pres.shapes.LINE, { ...box(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)), flipV, line: { color, width, ...extra } });
}
const GLYPH = { 'On track': ['●', C.positive], 'At risk': ['▲', C.warning], 'Off track': ['■', C.negative], 'Complete': ['✓', C.secondary], 'Not started': ['○', C.muted] };
const statusCell = (s) => ({ text: `${GLYPH[s][0]}  ${s}`, options: { color: GLYPH[s][1] } });
function text(sl, x, y, w, h, t, st, extra = {}) {
  sl.addText(t, txt(style(st), { ...box(x, y, w, h), ...extra }));
}
function rrect(sl, pres, x, y, w, h, fill, r = 12, lineOpt) {
  sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(x, y, w, h), fill: { color: fill }, line: lineOpt || { type: 'none' }, rectRadius: Math.min(0.5, r / Math.min(w, h)) });
}
function rect(sl, pres, x, y, w, h, fill, lineOpt) {
  sl.addShape(pres.shapes.RECTANGLE, { ...box(x, y, w, h), fill: fill ? { color: fill } : { type: 'none' }, line: lineOpt || { type: 'none' } });
}
function dot(sl, pres, x, y, d, fill, lineOpt) {
  sl.addShape(pres.shapes.OVAL, { ...box(x, y, d, d), fill: fill ? { color: fill } : { type: 'none' }, line: lineOpt || { type: 'none' } });
}

// ── pills / tags: fixed 28px height, 12px side padding, mono caps ───────────
const PILL = {
  neutral: { fill: C.surfaceAlt, color: C.text },
  category: { fill: 'D7EEF9', color: C.secondary },
  info: { fill: C.infoBg, color: C.info },
  positive: { fill: C.positiveBg, color: C.positive },
  warning: { fill: C.warningBg, color: C.warning },
  negative: { fill: C.negativeBg, color: C.negative },
  strong: { fill: C.secondary, color: C.surface },
  outline: { fill: null, color: C.secondary, line: C.secondary },
};
function pillWidth(label) { return Math.round(up(label).length * MONO_CH + 24); }
function pill(sl, pres, x, y, label, variant = 'category') {
  const v = PILL[variant]; const w = pillWidth(label);
  sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(x, y, w, 28), fill: v.fill ? { color: v.fill } : { type: 'none' }, line: v.line ? { color: v.line, width: LW.hair } : { type: 'none' }, rectRadius: 0.5 });
  sl.addText(up(label), txt(style('pill'), { ...box(x, y, w, 28), color: v.color, align: 'center', valign: 'middle' }));
  return w;
}

// ── status: colour AND shape, so it survives grayscale and colour-blindness ──
const STATUS = {
  'On track': { shape: 'OVAL', color: C.positive },
  'At risk': { shape: 'ISOSCELES_TRIANGLE', color: C.warning },
  'Off track': { shape: 'RECTANGLE', color: C.negative },
  'Complete': { shape: 'OVAL', color: C.secondary, glyph: '✓' },
  'Not started': { shape: 'OVAL', color: null, outline: C.muted },
};
function status(sl, pres, x, y, label) {
  const s = STATUS[label];
  sl.addShape(pres.shapes[s.shape], { ...box(x, y + 3, 16, 16), fill: s.color ? { color: s.color } : { type: 'none' }, line: s.outline ? { color: s.outline, width: LW.strong } : { type: 'none' } });
  if (s.glyph) sl.addText(s.glyph, txt({ fontFace: FONT.uiMedium, fontSize: 7, color: C.surface }, { ...box(x, y + 3, 16, 16), align: 'center', valign: 'middle' }));
  text(sl, x + 26, y, 220, 22, label, 'bodyS', { color: C.text, valign: 'middle' });
}

// ── delta: arrow glyph + sign + colour ──────────────────────────────────────
function delta(sl, pres, x, y, value, dir) {
  const v = dir === 'up' ? 'positive' : dir === 'down' ? 'negative' : 'neutral';
  return pill(sl, pres, x, y, `${dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■'} ${value}`, v);
}

// ── number marker + annotation callout ─────────────────────────────────────
function marker(sl, pres, x, y, n, variant = 'strong') {
  dot(sl, pres, x, y, 32, variant === 'strong' ? C.secondary : C.surface, variant === 'strong' ? null : { color: C.secondary, width: LW.strong });
  sl.addText(String(n), txt({ fontFace: FONT.uiMedium, fontSize: 10, color: variant === 'strong' ? C.surface : C.secondary }, { ...box(x, y, 32, 32), align: 'center', valign: 'middle' }));
}
function callout(sl, pres, x, y, n, title, body, w = 360, leader) {
  if (leader) line(sl, pres, leader.x1, leader.y1, leader.x2 - leader.x1, leader.y2 - leader.y1, C.secondary, LW.rule);
  marker(sl, pres, x, y, n);
  const th = linesFor(title, 14, w - 44) * 34;
  text(sl, x + 44, y + 2, w - 44, th, title, 'cardTitle', { color: C.text });
  text(sl, x + 44, y + 8 + th, w - 44, 60, body, 'bodyS', { color: C.text2 });
}

// ── cards: one anatomy — eyebrow, title, optional metric, body, optional footer
// variant: rule (deck-native: top rule, no fill) · surface (quiet fill) ·
// emphasis (the one pick among peers) · dark (decision)
function card(sl, pres, x, y, w, h, { variant = 'surface', eyebrow, title, metric, body, footer, pillLabel, pillVariant } = {}) {
  const P = variant === 'rule' ? 0 : 24;
  let ink = C.text, ink2 = C.text2, lab = C.secondary;
  if (variant === 'surface') rrect(sl, pres, x, y, w, h, C.surfaceAlt);
  if (variant === 'emphasis') rrect(sl, pres, x, y, w, h, C.surface, 12, { color: C.accent, width: LW.strong });
  if (variant === 'dark') { rrect(sl, pres, x, y, w, h, C.primary); ink = C.surface; ink2 = C.onDark2; lab = C.accent; }
  if (variant === 'rule') line(sl, pres, x, y, w, 0, C.secondary, LW.strong);
  let cy = y + (variant === 'rule' ? 16 : P);
  if (eyebrow) { text(sl, x + P, cy, w - 2 * P, 20, up(eyebrow), 'label', { color: lab }); cy += 30; }
  if (pillLabel) { pill(sl, pres, x + P, cy, pillLabel, pillVariant); cy += 40; }
  if (metric) { text(sl, x + P, cy, w - 2 * P, 56, metric, 'data', { color: variant === 'dark' ? C.surface : C.secondary }); cy += 64; }
  if (title) { const th = linesFor(title, 14, w - 2 * P) * 34; text(sl, x + P, cy, w - 2 * P, th, title, 'cardTitle', { color: ink }); cy += th + 8; }
  if (body) text(sl, x + P, cy, w - 2 * P, h - (cy - y) - (footer ? 48 : P), body, 'cardBody', { color: ink2 });
  if (footer) {
    line(sl, pres, x + P, y + h - P - 30, w - 2 * P, 0, variant === 'dark' ? C.onDarkRule : C.borderStrong);
    text(sl, x + P, y + h - P - 22, w - 2 * P, 22, footer, 'bodyS', { color: ink2 });
  }
}

// ── charts: insight first, one highlighted series, no chrome ───────────────
function chartBase(extra = {}) {
  return {
    showLegend: false, showTitle: false,
    catAxisLabelFontFace: FONT.ui, catAxisLabelFontSize: 9, catAxisLabelColor: C.text2,
    valAxisLabelFontFace: FONT.ui, valAxisLabelFontSize: 9, valAxisLabelColor: C.muted,
    valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    catAxisLineShow: true, catAxisLineColor: MUTE, valAxisLineShow: false,
    dataLabelFontFace: FONT.ui, dataLabelFontSize: 9, dataLabelColor: C.text,
    plotArea: { fill: { color: C.background } }, chartArea: { fill: { color: C.background } },
    ...extra,
  };
}

// ── tables: header in mono caps, hairline rows, no verticals ───────────────
function table(sl, x, y, w, rows, colW, { dense = false, status: statusCol = -1, align = [] } = {}) {
  const pad = dense ? [3, 6, 3, 0] : [7, 8, 7, 0];
  const none = { type: 'none' };
  const out = rows.map((r, ri) => r.map((cell, ci) => {
    const head = ri === 0;
    const o = typeof cell === 'object' && cell !== null ? cell : { text: String(cell) };
    const base = head ? { ...style('tableHead'), color: C.secondary } : { ...style(dense ? 'bodyS' : 'tableBody'), color: ci === 0 ? C.text : C.text2 };
    return { text: head ? up(o.text) : o.text, options: { ...base, margin: pad.map(PX), valign: head ? 'bottom' : 'top', align: align[ci] || 'left',
      border: [none, none, { pt: head ? LW.rule : LW.hair, color: head ? C.borderStrong : C.border }, none], ...(o.options || {}) } };
  }));
  sl.addTable(out, { ...box(x, y, w, 10), colW: colW.map(PX), autoPage: false });
}

module.exports = { linesFor, seg, statusCell, GLYPH, line, text, rrect, rect, dot, pill, pillWidth, PILL, status, STATUS, delta, marker, callout, card, chartBase, table, up };
