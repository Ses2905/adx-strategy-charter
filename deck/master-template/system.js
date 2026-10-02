// Product Leadership Presentation System — foundations, components and masters.
// One source for every coordinate, type style, colour and component, so the
// masters, the example slides and the libraries cannot drift apart.
//
// Units: layouts are authored on the 1920×1080 canvas the HTML deck uses, then
// converted. 1px = 1/144in on the 13.333×7.5in slide. Type is set in points.

const PX = (p) => +(p / 144).toFixed(4);

// ── Layer 1 · Foundations ────────────────────────────────────────────────────

// Desktop Everyday Sans family names. Change here if PowerPoint lists them differently.
const FONT = {
  headline: 'Everyday Sans Headline Light',
  italic: 'Everyday Sans Light',
  ui: 'Everyday Sans UI',
  uiMedium: 'Everyday Sans UI Medium',
  mono: 'Everyday Sans Mono',
};

// Semantic colour roles (Walmart design system tokens).
const C = {
  primary: '001E60',      // Bentonville Blue — text, dark grounds
  secondary: '0053E2',    // True Blue — emphasis, rules that matter, labels
  accent: '4DBDF5',       // Everyday Blue — accent on dark grounds only
  sky: 'A9DDF7',
  background: 'F5F6F8',   // gray-50 — page
  surface: 'FFFFFF',
  surfaceAlt: 'E9EEF3',   // quiet structural surface: cards, bands, zones
  border: 'DEE1E6',       // gray-200 — hairline
  borderStrong: 'C3C6CD', // gray-300 — visible rule, muted half of a contrast
  text: '001E60',
  text2: '3D4A63',
  muted: '5E636E',        // gray-600
  positive: '128A08', positiveBg: 'E7F4E4',
  warning: 'B25E00', warningBg: 'FCEFD9',
  negative: 'DE1C24', negativeBg: 'FDEAEA',
  info: '0053E2', infoBg: 'E8F0FF',
  onDark2: 'CFE0FB', onDarkRule: '4A5E8C',
};
// Tonal ramp for charts and diagrams, darkest → lightest, plus a mute.
const RAMP = ['001E60', '0053E2', '4DBDF5', 'A9DDF7', 'CFE0FF'];
const MUTE = 'C3C6CD';

// 12-column grid inside one master content frame.
const G = { left: 80, right: 1840, width: 1760, cols: 12, gutter: 32 };
G.col = (G.width - G.gutter * (G.cols - 1)) / G.cols; // 117.33
const col = (start, span) => ({ x: G.left + start * (G.col + G.gutter), w: span * G.col + (span - 1) * G.gutter });

// 8-point spacing tokens.
const S = { xs: 4, s: 8, m: 16, l: 24, xl: 32, '2xl': 48, '3xl': 64, '4xl': 80, '5xl': 96 };
// Corner radius system (px): small = pills, medium = cards, large = hero containers.
const R = { small: 999, medium: 12, large: 24 };

// Four vertical zones, fixed for every standard master.
const Z = {
  context: { y: 72, h: 24 },            // eyebrow (left) + section marker (right)
  title: { y: 112, h: 152 },            // 2 lines max, anchored bottom so title + subtitle read as one unit
  subtitle: { y: 272, h: 72 },          // 2 lines max
  content: { y: 384, h: 560 },          // main content: 384 → 944
  source: { y: 952, h: 28 },            // evidence / source / footnote
  footer: { y: 1008, h: 32 },
  dense: { title: { y: 88, h: 64 }, content: { y: 184, h: 760 } },
};

// Semantic text styles (points). maxLines is guidance, recorded in the usage guide.
const T = {
  display:     { fontFace: FONT.headline, fontSize: 44, lineSpacingMultiple: 1.02, charSpacing: -1.2, maxLines: 3 },
  sectionHead: { fontFace: FONT.headline, fontSize: 40, lineSpacingMultiple: 1.05, charSpacing: -1.0, maxLines: 2 },
  statement:   { fontFace: FONT.headline, fontSize: 32, lineSpacingMultiple: 1.12, charSpacing: -0.8, maxLines: 4 },
  headline:    { fontFace: FONT.headline, fontSize: 28, lineSpacingMultiple: 1.1, charSpacing: -0.7, maxLines: 2 },
  denseHead:   { fontFace: FONT.headline, fontSize: 22, lineSpacingMultiple: 1.1, charSpacing: -0.5, maxLines: 1 },
  supporting:  { fontFace: FONT.headline, fontSize: 18, lineSpacingMultiple: 1.2, charSpacing: -0.3, maxLines: 3 },
  bodyL:       { fontFace: FONT.ui, fontSize: 14, lineSpacingMultiple: 1.35, maxLines: 6 },
  body:        { fontFace: FONT.ui, fontSize: 12, lineSpacingMultiple: 1.35, maxLines: 8 },
  bodyS:       { fontFace: FONT.ui, fontSize: 10.5, lineSpacingMultiple: 1.35, maxLines: 10 },
  dataHero:    { fontFace: FONT.headline, fontSize: 96, lineSpacingMultiple: 0.9, charSpacing: -3, maxLines: 1 },
  data:        { fontFace: FONT.headline, fontSize: 40, lineSpacingMultiple: 0.95, charSpacing: -1.2, maxLines: 1 },
  dataLabel:   { fontFace: FONT.uiMedium, fontSize: 11, lineSpacingMultiple: 1.25, maxLines: 2 },
  cardTitle:   { fontFace: FONT.uiMedium, fontSize: 14, lineSpacingMultiple: 1.2, maxLines: 2 },
  cardBody:    { fontFace: FONT.ui, fontSize: 11, lineSpacingMultiple: 1.35, maxLines: 5 },
  eyebrow:     { fontFace: FONT.mono, fontSize: 8, charSpacing: 1.4, maxLines: 1 },
  label:       { fontFace: FONT.mono, fontSize: 8, charSpacing: 1.1, maxLines: 1 },
  pill:        { fontFace: FONT.mono, fontSize: 7.5, charSpacing: 0.9, maxLines: 1 },
  tableHead:   { fontFace: FONT.mono, fontSize: 8, charSpacing: 1.1, maxLines: 2 },
  tableBody:   { fontFace: FONT.ui, fontSize: 10.5, lineSpacingMultiple: 1.25, maxLines: 3 },
  chartLabel:  { fontFace: FONT.ui, fontSize: 9, maxLines: 1 },
  annotation:  { fontFace: FONT.ui, fontSize: 10, lineSpacingMultiple: 1.3, maxLines: 3 },
  quote:       { fontFace: FONT.italic, fontSize: 26, italic: true, lineSpacingMultiple: 1.2, charSpacing: -0.4, maxLines: 5 },
  quoteS:      { fontFace: FONT.italic, fontSize: 15, italic: true, lineSpacingMultiple: 1.3, maxLines: 5 },
  quoteAttr:   { fontFace: FONT.mono, fontSize: 8, charSpacing: 1.1, maxLines: 1 },
  source:      { fontFace: FONT.ui, fontSize: 8, maxLines: 2 },
};
const style = (name, extra = {}) => { const { maxLines, ...s } = T[name]; return { ...s, ...extra }; };

// Line weights: nothing thinner than 0.75pt survives export and projection.
const LW = { hair: 0.75, rule: 1, strong: 1.5 };

// ── Geometry helpers ────────────────────────────────────────────────────────
const box = (x, y, w, h) => ({ x: PX(x), y: PX(y), w: PX(w), h: PX(h) });
const txt = (s, extra) => ({ margin: 0, isTextBox: true, valign: 'top', fit: 'none', wrap: true, ...s, ...extra });

module.exports = { PX, FONT, C, RAMP, MUTE, G, col, S, R, Z, T, style, LW, box, txt };
