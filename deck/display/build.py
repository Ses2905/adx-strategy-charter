"""Build docs/advertiser-experience.html from the published deck's shell (docs/index.html).

Keeps the kit's CSS, fonts, chrome and runtime; swaps in this deck's slides,
sections and title. Re-run after editing slides.html or display.css."""
import re, pathlib, sys
THEME = sys.argv[1] if len(sys.argv) > 1 else None  # None | "connect"
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
name = 'advertiser-experience.html'
if THEME == 'connect':
    # Walmart Connect presentation system (guidelines p71): same slides, Connect colour,
    # team label top left, Spark top right, confidentiality bottom left, wordmark on the cover.
    out = out.replace('<title>Advertiser Experience Strategy · draft</title>', '<title>Advertiser Experience Strategy · Walmart Connect · draft</title>')
    out = out.replace('</head>', '<style>\n' + (here / 'connect.css').read_text() + '</style>\n</head>', 1)
    out = out.replace('<span class="meta">Advertiser Experience Strategy · draft</span>',
        '<img class="cx-wordmark" id="cxWordmark" data-cx-chrome src="logos/connect-wordmark-white.svg" alt="Walmart Connect">\n'
        '      <span class="meta" data-cx-chrome>Private and confidential</span>')
    out = out.replace('<div class="chrome-layer" id="chromeLayer">', '<div class="chrome-layer" id="chromeLayer">\n'
        '  <span class="cx-team" data-cx-chrome>Advertiser Experience</span>\n'
        '  <img class="cx-spark" data-cx-chrome src="logos/spark-everyday-blue.svg" alt="Walmart Spark">', 1)
    js = 'spark.src = navy ? "logos/spark-white.svg" : "logos/spark-everyday-blue.svg";'
    assert js in out
    out = out.replace(js, js + '\n    document.getElementById("cxWordmark").src = navy ? "logos/connect-wordmark-white.svg" : "logos/connect-wordmark-navy.svg";'
        '\n    stage.classList.toggle("cx-cover", i === 0);')
    i = out.index('<script', out.index('<div class="chrome-layer"'))
    out = out[:i] + '<script>\n' + (here / 'connect.js').read_text() + '</script>\n' + out[i:]
    name = 'advertiser-experience-connect.html'
(root / 'docs' / name).write_text(out)
print('wrote docs/' + name, out.count('<section class="slide'), 'slides')
