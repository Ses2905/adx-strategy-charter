"""Build docs/display.html from the published deck's shell (docs/index.html).

Keeps the kit's CSS, fonts, chrome and runtime; swaps in this deck's slides,
sections and title. Re-run after editing slides.html or display.css."""
import math, re, pathlib
here = pathlib.Path(__file__).parent
root = here.parent.parent
src = (root / 'docs/index.html').read_text()
slides = (here / 'slides.html').read_text()
css = (here / 'display.css').read_text()

# Flywheel: six steps on a ring, computed rather than hand-placed.
steps = ["Better Display experience", "Less friction + clearer decisions",
         "More advertiser control + confidence", "Faster optimization + learning",
         "Better adoption of capabilities", "Stronger advertiser outcomes"]
cx, cy, r = 360, 300, 170
parts = [f'<svg class="dx-wheel" viewBox="0 0 720 600" role="img" aria-label="Flywheel: {", then ".join(steps)}, which feeds back into a better Display experience.">',
         f'<circle class="ring" cx="{cx}" cy="{cy}" r="{r}"/>',
         f'<text class="mid" x="{cx}" y="{cy-4}" text-anchor="middle">Each turn</text>',
         f'<text class="mid" x="{cx}" y="{cy+28}" text-anchor="middle">compounds</text>']
for i, s in enumerate(steps):
    a = -math.pi/2 + i * 2*math.pi/len(steps)
    x, y = cx + r*math.cos(a), cy + r*math.sin(a)
    parts.append(f'<circle class="nd{" first" if i==0 else ""}" cx="{x:.1f}" cy="{y:.1f}" r="7"/>')
    c = math.cos(a)
    anchor = 'middle' if abs(c) < 0.2 else ('start' if c > 0 else 'end')
    lx = x + (22 if anchor == 'start' else -22 if anchor == 'end' else 0)
    ly = y + (-40 if (abs(c) < 0.2 and y < cy) else 52 if abs(c) < 0.2 else -8)
    # wrap into two lines at the '+' or midpoint
    words = s.split(' ')
    cut = words.index('+') if '+' in words else len(words)//2 + (len(words) % 2)
    l1, l2 = ' '.join(words[:cut]), ' '.join(words[cut:])
    parts.append(f'<text class="num" x="{lx:.1f}" y="{ly-22:.1f}" text-anchor="{anchor}">0{i+1}</text>')
    parts.append(f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="{anchor}">{l1}</text>')
    parts.append(f'<text x="{lx:.1f}" y="{ly+22:.1f}" text-anchor="{anchor}">{l2}</text>')
parts.append('</svg>')
slides = slides.replace('%%WHEEL%%', '\n'.join(parts))

a = src.index('<section class="slide')
b = src.index('<div class="chrome-layer"')
out = src[:a] + slides.strip() + '\n\n  ' + src[b:]

out = out.replace('<title>Advertiser Experience Strategy · working</title>',
                  '<title>Display + Advertiser Experience · draft</title>')
out = out.replace('<span class="meta">Advertiser Experience · working</span>',
                  '<span class="meta">Display + Advertiser Experience · draft</span>')
out = re.sub(r'const SECTIONS = \[.*?\];', '''const SECTIONS = [
    { id: "01", label: "Why Display feels broken", start: 1, end: 2 },
    { id: "02", label: "What is causing it", start: 3, end: 5 },
    { id: "03", label: "What we fix for Display", start: 6, end: 6 },
    { id: "04", label: "What we build once", start: 7, end: 10 },
    { id: "05", label: "What advertisers get", start: 11, end: 14 }
  ];''', out, count=1, flags=re.S)
# Editor scripts are not shipped in docs/ (they 404 on the live deck too).
out = re.sub(r'<script src="editor[^"]*"></script>\n', '', out)
out = out.replace('</head>', '<style>\n' + css + '</style>\n</head>', 1)
(root / 'docs/display.html').write_text(out)
print('wrote docs/display.html', out.count('<section class="slide'), 'slides')
