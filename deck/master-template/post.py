"""Post-process the generated .pptx into a finished template.

pptxgenjs gets the geometry right but leaves four gaps a real template can't have:
  1. the theme colour scheme is Office default, so charts and new shapes come out orange;
  2. layout placeholders keep PowerPoint's default 0.1in insets and top anchoring, so a
     slide made from a layout does not line up with the rules the layout draws;
  3. every placeholder is named "Text N", so the selection pane is useless;
  4. mono label placeholders only look uppercase because the prompt is typed in caps.
Writes the .pptx in place and a .potx beside it (same package, template content type)."""
import json, re, sys, zipfile, shutil, pathlib

here = pathlib.Path(__file__).parent
src = here / 'Product-Leadership-Master-Template.pptx'
meta = json.loads((here / 'build-map.json').read_text())
by_name = {m['name']: m for m in meta['masters']}

SCHEME = '''<a:clrScheme name="Walmart Ads"><a:dk1><a:srgbClr val="001E60"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="3D4A63"/></a:dk2><a:lt2><a:srgbClr val="F5F6F8"/></a:lt2><a:accent1><a:srgbClr val="0053E2"/></a:accent1><a:accent2><a:srgbClr val="001E60"/></a:accent2><a:accent3><a:srgbClr val="4DBDF5"/></a:accent3><a:accent4><a:srgbClr val="A9DDF7"/></a:accent4><a:accent5><a:srgbClr val="5E636E"/></a:accent5><a:accent6><a:srgbClr val="C3C6CD"/></a:accent6><a:hlink><a:srgbClr val="0053E2"/></a:hlink><a:folHlink><a:srgbClr val="001E60"/></a:folHlink></a:clrScheme>'''
ANCHOR = {'top': 't', 'middle': 'ctr', 'bottom': 'b', None: 't'}
pretty = lambda n: n.replace('_', ' ').capitalize()

def ph_blocks(xml):
    """Yield (start, end) of every <p:sp> that is a placeholder, in document order."""
    for m in re.finditer(r'<p:sp>.*?</p:sp>', xml, re.S):
        if '<p:ph' in m.group(0) and 'type="sldNum"' not in m.group(0):
            yield m.start(), m.end()

def fix_layout(xml):
    name = re.search(r'<p:cSld name="([^"]+)"', xml).group(1)
    m = by_name.get(name)
    if not m: return xml, {}
    out, last, idxmap = [], 0, {}
    for i, (a, b) in enumerate(ph_blocks(xml)):
        blk = xml[a:b]; pm = m['phMeta'][i]
        idx = re.search(r'idx="(\d+)"', blk).group(1); idxmap[idx] = pm['name']
        blk = re.sub(r'<p:cNvPr id="(\d+)" name="[^"]*"', lambda g: f'<p:cNvPr id="{g.group(1)}" name="{pretty(pm["name"])}"', blk, 1)
        blk = re.sub(r'<a:bodyPr[^>]*>', f'<a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="{ANCHOR[pm["valign"]]}">', blk, 1)
        if pm['mono']: blk = blk.replace('<a:defRPr lang="en-US"', '<a:defRPr lang="en-US" cap="all"').replace('<a:rPr lang="en-US"', '<a:rPr lang="en-US" cap="all"')
        out.append(xml[last:a]); out.append(blk); last = b
    out.append(xml[last:])
    return ''.join(out), idxmap

def fix_slide(xml, idxmap, mono):
    def ren(g):
        blk = g.group(0); m = re.search(r'<p:ph[^>]*idx="(\d+)"', blk)
        if not m or m.group(1) not in idxmap: return blk
        nm = idxmap[m.group(1)]
        blk = re.sub(r'<p:cNvPr id="(\d+)" name="[^"]*"', lambda h: f'<p:cNvPr id="{h.group(1)}" name="{pretty(nm)}"', blk, 1)
        if nm in mono: blk = blk.replace('<a:rPr lang="en-US"', '<a:rPr lang="en-US" cap="all"')
        return blk
    return re.sub(r'<p:sp>.*?</p:sp>', ren, xml, flags=re.S)

zin = zipfile.ZipFile(src)
files = {n: zin.read(n) for n in zin.namelist()}
zin.close()
layout_idx, layout_mono = {}, {}
for n in list(files):
    if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n):
        x, idxmap = fix_layout(files[n].decode())
        files[n] = x.encode(); layout_idx[n.split('/')[-1]] = idxmap
        nm = re.search(r'<p:cSld name="([^"]+)"', x).group(1)
        layout_mono[n.split('/')[-1]] = {p['name'] for p in by_name.get(nm, {'phMeta': []})['phMeta'] if p['mono']}
for n in list(files):
    if re.match(r'ppt/slides/slide\d+\.xml$', n):
        rel = files[n.replace('slides/', 'slides/_rels/') + '.rels'].decode()
        lay = re.search(r'slideLayouts/(slideLayout\d+\.xml)', rel).group(1)
        files[n] = fix_slide(files[n].decode(), layout_idx.get(lay, {}), layout_mono.get(lay, set())).encode()
# Drop pptxgenjs's unused "DEFAULT" layout so the gallery shows only the system's layouts.
for n in [k for k in files if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', k)]:
    if '<p:cSld name="DEFAULT"' in files[n].decode():
        fname = n.split('/')[-1]
        used = any(fname in files[k].decode() for k in files if k.startswith('ppt/slides/_rels/'))
        if used: break
        mrel = files['ppt/slideMasters/_rels/slideMaster1.xml.rels'].decode()
        rid = re.search(r'Id="(rId\d+)"[^>]*Target="../slideLayouts/' + fname + '"', mrel) or re.search(r'Target="../slideLayouts/' + fname + '"[^>]*Id="(rId\d+)"', mrel)
        rid = rid.group(1)
        files['ppt/slideMasters/_rels/slideMaster1.xml.rels'] = re.sub(r'<Relationship[^>]*Target="../slideLayouts/' + fname + '"[^>]*/>', '', mrel).encode()
        files['ppt/slideMasters/slideMaster1.xml'] = re.sub(r'<p:sldLayoutId[^>]*r:id="' + rid + '"[^>]*/>', '', files['ppt/slideMasters/slideMaster1.xml'].decode()).encode()
        files['[Content_Types].xml'] = re.sub(r'<Override[^>]*PartName="/ppt/slideLayouts/' + fname + '"[^>]*/>', '', files['[Content_Types].xml'].decode()).encode()
        del files[n]; files.pop('ppt/slideLayouts/_rels/' + fname + '.rels', None)
        break
th = files['ppt/theme/theme1.xml'].decode()
th = re.sub(r'<a:clrScheme .*?</a:clrScheme>', SCHEME, th, flags=re.S)
th = re.sub(r'<a:theme ([^>]*)name="[^"]*"', r'<a:theme \1name="Walmart Ads Product Leadership"', th, 1)
files['ppt/theme/theme1.xml'] = th.encode()

def write(path, ctype_swap=False):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for n, d in files.items():
            if ctype_swap and n == '[Content_Types].xml':
                d = d.decode().replace('presentationml.presentation.main+xml', 'presentationml.template.main+xml').encode()
            z.writestr(n, d)
tmp = src.with_suffix('.tmp'); write(tmp); shutil.move(tmp, src)
write(src.with_suffix('.potx'), ctype_swap=True)
print('post-processed', src.name, '+ .potx;', sum(len(v) for v in layout_idx.values()), 'layout placeholders named')
