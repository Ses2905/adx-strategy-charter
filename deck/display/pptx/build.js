// Build the .pptx from layout.json. 1920px stage -> 13.333in; 1px = 1/144in = 0.5pt.
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
// usage: node build.js [layout.json] [output.pptx]
const path = require('path');
const L = JSON.parse(fs.readFileSync(path.join(__dirname, process.argv[2] || 'layout.json')));
const OUT = path.join(__dirname, '..', process.argv[3] || 'Advertiser-Experience-Strategy.pptx');
// Walmart Connect theme sentinels (see connect.css): solid colours the browser never shows,
// swapped here for native PowerPoint gradients.
const GS = (stops) => '<a:gradFill rotWithShape="1"><a:gsLst>' + stops.map(([p, c]) => `<a:gs pos="${p}"><a:srgbClr val="${c}"/></a:gs>`).join('') + '</a:gsLst><a:lin ang="0" scaled="0"/></a:gradFill>';
const SENTINEL = {
  // Connect gradient (guidelines p24): Purple → Everyday Blue → Teal, roughly 40/40/20
  '993EF6': GS([[0, '993EF4'], [60000, '4DBDF5'], [100000, '00D0CD']]),
};
const IN = px => px / 144, PT = px => px * 0.5;
// Desktop Everyday Sans family names. Change here if your PowerPoint lists them differently.
const FONT = {
  headline: 'Everyday Sans Headline Light',
  italic: 'Everyday Sans Light',
  ui: 'Everyday Sans UI',
  uiMedium: 'Everyday Sans UI Medium',
  mono: 'Everyday Sans Mono',
};
function face(r){
  if (/Mono/.test(r.fam)) return {f:FONT.mono,b:false};
  if (/Headline/.test(r.fam)) return {f:FONT.headline,b:false};
  if (r.fam==='Everyday Sans') return {f:FONT.italic,b:false};
  if (r.wt>=500) return {f:FONT.uiMedium,b:r.wt>=600};
  return {f:FONT.ui,b:false};
}
const tr = c => c && c.a < 1 ? Math.round((1-c.a)*100) : 0;
(async()=>{
  const spark = {}, images = {};
  for (const f of ['spark-white.svg','spark-everyday-blue.svg'])
    spark[f] = 'image/png;base64,' + (await sharp(fs.readFileSync(require('path').join(__dirname,'../../../docs/logos',f)),{density:600}).resize(256,256).png().toBuffer()).toString('base64');
  for (const f of new Set(L.flatMap(s => (s.chrome.cx || []).filter(e => e.img).map(e => path.basename(e.img)))))
    images[f] = 'image/png;base64,' + (await sharp(fs.readFileSync(path.join(__dirname, '../../../docs/logos', f)), { density: 600 }).resize({ height: 160 }).png().toBuffer()).toString('base64');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Advertiser Experience Strategy';
  pres.author = 'Advertiser Experience';
  L.forEach((s, i) => {
    const sl = pres.addSlide();
    sl.background = { color: s.navy ? '001E60' : (s.chrome.cx && s.chrome.cx.length ? 'FFFFFF' : 'F5F6F8') };
    for (const sh of s.shapes) {
      if (sh.k === 'line') {
        sl.addShape(pres.shapes.LINE, { x: IN(sh.x), y: IN(sh.y), w: IN(sh.w), h: IN(sh.h),
          line: { color: sh.c.hex, width: Math.max(0.5, PT(sh.lw)), transparency: tr(sh.c) } });
      } else {
        const o = { x: IN(sh.x), y: IN(sh.y), w: IN(sh.w), h: IN(sh.h) };
        o.fill = sh.fill ? { color: sh.fill.hex, transparency: tr(sh.fill) } : { type: 'none' };
        o.line = sh.line ? { color: sh.line.c.hex, width: Math.max(0.5, PT(sh.line.w)), transparency: tr(sh.line.c) } : { type: 'none' };
        let type = pres.shapes.RECTANGLE;
        if (sh.k === 'ell' || (sh.round && Math.abs(sh.w - sh.h) < 1)) type = pres.shapes.OVAL;
        else if (sh.rad > 0) { type = pres.shapes.ROUNDED_RECTANGLE; o.rectRadius = Math.min(0.5, sh.rad / Math.min(sh.w, sh.h)); }
        sl.addShape(type, o);
      }
    }
    for (const t of s.texts) {
      const runs = []; let first = true;
      t.runs.forEach((r, k) => {
        if (r.br) { if (runs.length) runs[runs.length-1].options.breakLine = true; return; }
        const fc = face(r); let txt = r.t; if (r.tt === 'uppercase') txt = txt.toUpperCase();
        const o = { fontFace: fc.f, bold: fc.b, italic: r.it && fc.f !== FONT.italic ? true : (fc.f===FONT.italic), fontSize: PT(r.px),
          color: (r.color || {hex:'001E60'}).hex };
        if (r.ls) o.charSpacing = PT(r.ls);
        if (r.va === 'super' || (r.px < 14 && /^\d$/.test(txt.trim()) && t.runs.length > 1)) o.superscript = true;
        runs.push({ text: txt, options: o });
      });
      if (!runs.length) continue;
      const single = true; // breaks are explicit now, so every box gets slack
      // One-line text gets slack so PowerPoint's metrics never force a wrap.
      let x = t.x, w = t.w + (single ? Math.max(24, t.w * 0.08) : 4);
      if (t.align === 'c') x -= (w - t.w) / 2; else if (t.align === 'r') x -= (w - t.w);
      const mainPx = Math.max(...t.runs.filter(r=>!r.br).map(r => r.px));
      sl.addText(runs, { x: IN(x), y: IN(t.y), w: IN(w), h: IN(Math.max(t.h, t.lh)), margin: 0, isTextBox: true,
        align: { l: 'left', c: 'center', r: 'right' }[t.align], valign: t.valign === 'm' ? 'middle' : 'top',
        lineSpacing: PT(t.lh), fit: 'none', wrap: true, paraSpaceBefore: 0, paraSpaceAfter: 0 });
    }
    // footer chrome: spark, meta, page number
    const c = s.chrome;
    if (c.cx && c.cx.length) {
      // Walmart Connect presentation chrome (guidelines p71)
      for (const e of c.cx) {
        if (e.img) sl.addImage({ data: images[path.basename(e.img)], x: IN(e.x), y: IN(e.y), w: IN(e.w), h: IN(e.h), altText: /spark/.test(e.img) ? 'Walmart Spark' : 'Walmart Connect' });
        else sl.addText(e.tt === 'uppercase' ? e.t.toUpperCase() : e.t, { x: IN(e.x), y: IN(e.y), w: IN(e.w + 60), h: IN(e.h), margin: 0, isTextBox: true, valign: 'middle',
          fontFace: FONT.ui, fontSize: PT(e.px), charSpacing: PT(e.ls), color: e.color.hex });
      }
      sl.addText(String(i + 1), { x: IN(1640), y: IN(c.page.y), w: IN(200), h: IN(c.page.h), margin: 0, isTextBox: true,
        align: 'right', valign: 'middle', fontFace: FONT.ui, fontSize: PT(11), color: s.navy ? 'FFFFFF' : '001E60' });
      if (s.notes) sl.addNotes(s.notes);
      return;
    }
    sl.addImage({ data: spark[s.navy ? 'spark-white.svg' : 'spark-everyday-blue.svg'], x: IN(c.spark.x), y: IN(c.spark.y), w: IN(c.spark.w), h: IN(c.spark.h), altText: 'Walmart Spark' });
    sl.addText(c.meta.t, { x: IN(c.meta.x), y: IN(c.spark.y), w: IN(c.meta.w + 60), h: IN(c.spark.h), margin: 0, isTextBox: true, valign: 'middle',
      fontFace: FONT.ui, fontSize: PT(c.meta.px), color: s.navy ? 'FFFFFF' : '3D4A63' });
    sl.addText(String(i+1).padStart(2,'0') + ' / ' + String(L.length).padStart(2,'0'), { x: IN(1640), y: IN(c.spark.y), w: IN(200), h: IN(c.spark.h), margin: 0, isTextBox: true,
      align: 'right', valign: 'middle', fontFace: FONT.mono, fontSize: PT(13), charSpacing: PT(13*0.12), color: s.navy ? 'D0D5DE' : '3D4A63' });
    if (s.notes) sl.addNotes(s.notes);
  });
  const JSZip = require('jszip');
  const zip = await JSZip.loadAsync(await pres.write({ outputType: 'nodebuffer' }));
  let swapped = 0;
  for (const name of Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    const xml = (await zip.file(name).async('string')).replace(/<a:solidFill><a:srgbClr val="(993EF[567])"(?:\/>|>.*?<\/a:srgbClr>)<\/a:solidFill>/g, (m, k) => (swapped++, SENTINEL[k]));
    zip.file(name, xml);
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('gradients', swapped);
  console.log('written');
})();
