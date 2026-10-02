"""Build docs/advertiser-experience.html from the published deck's shell (docs/index.html).

Keeps the kit's CSS, fonts, chrome and runtime; swaps in this deck's slides,
sections and title. Re-run after editing slides.html or display.css."""
import re, pathlib
here = pathlib.Path(__file__).parent
root = here.parent.parent
src = (root / 'docs/index.html').read_text()
slides = (here / 'slides.html').read_text()
css = (here / 'display.css').read_text()

a = src.index('<section class="slide')
b = src.index('<div class="chrome-layer"')
out = src[:a] + slides.strip() + '\n\n  ' + src[b:]

out = out.replace('<title>Advertiser Experience Strategy · working</title>',
                  '<title>Advertiser Experience Strategy · draft</title>')
out = out.replace('<span class="meta">Advertiser Experience · working</span>',
                  '<span class="meta">Advertiser Experience Strategy · draft</span>')
out = re.sub(r'const SECTIONS = \[.*?\];', '''const SECTIONS = [
    { id: "01", label: "What we are hearing", start: 0, end: 2 },
    { id: "02", label: "How we diagnose", start: 3, end: 3 },
    { id: "03", label: "Display as a proof point", start: 4, end: 6 },
    { id: "04", label: "What we are building", start: 7, end: 14 },
    { id: "05", label: "One system", start: 15, end: 17 }
  ];''', out, count=1, flags=re.S)
# Editor scripts are not shipped in docs/ (they 404 on the live deck too).
out = re.sub(r'<script src="editor[^"]*"></script>\n', '', out)
out = out.replace('</head>', '<style>\n' + css + '</style>\n</head>', 1)
(root / 'docs/advertiser-experience.html').write_text(out)
print('wrote docs/advertiser-experience.html', out.count('<section class="slide'), 'slides')
