"""Render the example slides and write thumbs.json (master number → PNG data URI)."""
import json, subprocess, base64, io, pathlib, sys
import pymupdf
from PIL import Image
here = pathlib.Path(__file__).parent
work = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/mt-thumbs'); work.mkdir(parents=True, exist_ok=True)
deck = work / 'deck.pptx'; deck.write_bytes((here / 'Product-Leadership-Master-Template.pptx').read_bytes())
subprocess.run(['soffice', '--headless', '-env:UserInstallation=file:///tmp/lo_prof', '--convert-to', 'pdf', '--outdir', str(work), str(deck)], check=True, capture_output=True, timeout=400)
doc = pymupdf.open(work / 'deck.pdf')
ex = json.loads((here / 'build-map.json').read_text())['exampleOf']
out = {}
for no, sn in ex.items():
    if not sn: continue
    pix = doc[sn - 1].get_pixmap(dpi=60)
    im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB').resize((640, 360), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    out[no] = 'image/png;base64,' + base64.b64encode(b.getvalue()).decode()
(work / 'thumbs.json').write_text(json.dumps(out))
print(len(out), 'thumbnails', work / 'thumbs.json')
