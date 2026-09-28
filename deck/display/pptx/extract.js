// Walk each rendered slide and emit shapes/text in stage px (1920x1080).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage({viewport:{width:1920,height:1080}, reducedMotion:'reduce'});
  await p.goto(process.argv[2] || 'http://127.0.0.1:8811/display.html',{waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
  const n = await p.evaluate(()=>document.querySelectorAll('section.slide').length);
  const out = [];
  for (let i=0;i<n;i++){
    await p.evaluate(i=>window.ADXShow(i), i); await p.waitForTimeout(250);
    out.push(await p.evaluate(i=>{
      const stage=document.getElementById('stage').getBoundingClientRect();
      const slide=document.querySelectorAll('section.slide')[i];
      const R=el=>{const r=el.getBoundingClientRect();return {x:r.left-stage.left,y:r.top-stage.top,w:r.width,h:r.height};};
      const col=c=>{const m=c&&c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const v=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);const a=v.length>3?v[3]:1;if(a===0)return null;return {hex:v.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('').toUpperCase(),a};};
      const shapes=[], texts=[];
      const INLINE=new Set(['inline','contents']);
      const visible=el=>{const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};
      const skip=el=>el.closest('aside.notes, .fn-src');
      const fontOf=cs=>({fam:cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(),wt:+cs.fontWeight,it:cs.fontStyle==='italic',px:parseFloat(cs.fontSize),ls:cs.letterSpacing==='normal'?0:parseFloat(cs.letterSpacing),color:col(cs.color),tt:cs.textTransform,va:cs.verticalAlign});
      function boxShapes(el,r,cs,pseudo){
        const bg=col(cs.backgroundColor);
        const rad=parseFloat(cs.borderTopLeftRadius)||0;
        const bw=['Top','Right','Bottom','Left'].map(s=>({w:parseFloat(cs['border'+s+'Width'])||0,c:col(cs['border'+s+'Color']),st:cs['border'+s+'Style']}));
        const all=bw.every(b=>b.w>0&&b.st!=='none'&&b.c)&&bw.every(b=>b.w===bw[0].w&&b.c.hex===bw[0].c.hex);
        if(bg||all) shapes.push({k:'rect',...r,fill:bg,line:all?{w:bw[0].w,c:bw[0].c}:null,rad:Math.min(rad,r.h/2),round:rad>=Math.min(r.w,r.h)/2-0.5&&rad>0});
        if(!all) bw.forEach((b,j)=>{ if(!(b.w>0&&b.c&&b.st!=='none'))return;
          if(j===0) shapes.push({k:'line',x:r.x,y:r.y+b.w/2,w:r.w,h:0,lw:b.w,c:b.c});
          if(j===2) shapes.push({k:'line',x:r.x,y:r.y+r.h-b.w/2,w:r.w,h:0,lw:b.w,c:b.c});
          if(j===1) shapes.push({k:'line',x:r.x+r.w-b.w/2,y:r.y,w:0,h:r.h,lw:b.w,c:b.c});
          if(j===3) shapes.push({k:'line',x:r.x+b.w/2,y:r.y,w:0,h:r.h,lw:b.w,c:b.c}); });
      }
      function pseudo(el,which){
        const cs=getComputedStyle(el,which); if(!cs.content||cs.content==='none'||cs.display==='none')return;
        const er=R(el); const px=v=>parseFloat(v);
        const w=px(cs.width),h=px(cs.height);
        let x=er.x, y=er.y;
        if(cs.position==='absolute'){
          if(cs.left!=='auto') x=er.x+px(cs.left); else if(cs.right!=='auto'&&!isNaN(w)) x=er.x+er.w-px(cs.right)-w;
          if(cs.top!=='auto') y=er.y+px(cs.top);
        } else return;
        const txt=cs.content.replace(/^["']|["']$/g,'');
        if(txt){ const f=fontOf(cs); texts.push({x,y,w:isNaN(w)?f.px*1.2:w,h:parseFloat(cs.lineHeight)||f.px*1.2,align:'l',lh:f.px*1.1,runs:[{t:txt,...f}]}); return; }
        let ww=w,hh=h; if(cs.left!=='auto'&&cs.right!=='auto'&&cs.width!=='auto'){} 
        if(isNaN(ww)||ww===0){ ww=er.w-(px(cs.left)||0)-(px(cs.right)||0); }
        boxShapes(null,{x,y,w:ww,h:isNaN(hh)?1:hh},cs,true);
      }
      const all=[slide,...slide.querySelectorAll('*')];
      for(const el of all){
        if(skip(el)||!visible(el))continue;
        const cs=getComputedStyle(el); const r=R(el);
        if(el.tagName==='circle'){ const f=col(cs.fill),s=col(cs.stroke); shapes.push({k:'ell',...r,fill:f,line:s?{w:parseFloat(cs.strokeWidth)*1,c:s}:null}); continue; }
        if(el.tagName==='text'){ const f=fontOf(cs); f.color=col(cs.fill); const a=cs.textAnchor; texts.push({x:r.x,y:r.y,w:r.w,h:r.h,align:a==='middle'?'c':a==='end'?'r':'l',lh:r.h,runs:[{t:el.textContent,...f}],svg:true}); continue; }
        if(el.closest('svg'))continue;
        if(el!==slide) boxShapes(el,r,cs);
        pseudo(el,'::before'); pseudo(el,'::after');
        if(INLINE.has(cs.display))continue;
        // text block: gather word pieces with their line position, not descending into non-inline children
        const pieces=[]; let has=false;
        (function walk(node){ for(const c of node.childNodes){
          if(c.nodeType===3){ const raw=c.textContent; if(!raw.replace(/\s+/g,''))
              { if(raw.length) pieces.push({sp:true,st:fontOf(getComputedStyle(c.parentElement))}); continue; }
            has=true; const st=fontOf(getComputedStyle(c.parentElement));
            const re=/\S+|\s+/g; let m;
            while((m=re.exec(raw))){ if(/^\s/.test(m[0])){pieces.push({sp:true,st});continue;}
              const rg=document.createRange(); rg.setStart(c,m.index); rg.setEnd(c,m.index+m[0].length);
              const rs=rg.getClientRects(); const top=rs.length?rs[0].bottom:null; const left=rs.length?rs[0].left:null;
              pieces.push({t:m[0],st,top,left}); } }
          else if(c.nodeType===1){ if(skip(c))continue; if(c.tagName==='BR'){pieces.push({br:true});continue;} if(!visible(c))continue; const cc=getComputedStyle(c); if(INLINE.has(cc.display)&&c.tagName!=='svg'){ walk(c); if(parseFloat(cc.marginRight)>0) pieces.push({sp:true,st:fontOf(cc)}); } }
        }})(el);
        if(!has)continue;
        // build runs, inserting a break wherever the browser started a new line
        const runs=[]; let lastTop=null, pendSp=null, minLeft=Infinity;
        const lhpx=(cs.lineHeight==='normal'?parseFloat(cs.fontSize)*1.2:parseFloat(cs.lineHeight));
        const push=(t,st)=>{const L=runs[runs.length-1]; if(L&&!L.br&&L.st===st)L.t+=t; else runs.push({t,st});};
        for(const pc of pieces){
          if(pc.br){ runs.push({br:true}); lastTop=null; pendSp=null; continue; }
          if(pc.sp){ pendSp=pc.st; continue; }
          if(pc.left!=null) minLeft=Math.min(minLeft,pc.left-stage.left);
          if(lastTop!=null && pc.top!=null && pc.top-lastTop>lhpx*0.5){ runs.push({br:true}); pendSp=null; }
          else if(pendSp && runs.length && !runs[runs.length-1].br) push(' ',pendSp);
          pendSp=null; push(pc.t,pc.st); if(pc.top!=null) lastTop=pc.top;
        }
        runs.forEach(r=>{ if(r.st){ Object.assign(r,r.st); delete r.st; } });
        const pad=s=>parseFloat(cs['padding'+s])+parseFloat(cs['border'+s+'Width']);
        let cx=r.x+pad('Left'), cy=r.y+pad('Top'), cw=r.w-pad('Left')-pad('Right'), ch=r.h-pad('Top')-pad('Bottom');
        if(isFinite(minLeft) && minLeft>cx+1 && cs.textAlign!=='center'){ cw-=minLeft-cx; cx=minLeft; }
        const lh=lhpx;
        const lines=runs.filter(x=>x.br).length+1;
        const align=cs.textAlign==='center'?'c':(cs.textAlign==='right'||cs.textAlign==='end')?'r':'l';
        const jc=cs.justifyContent, ai=cs.alignItems;
        texts.push({x:cx,y:cy,w:cw,h:ch,align:(cs.display.includes('flex')&&jc==='center')?'c':align,valign:(cs.display.includes('flex')&&ai==='center')?'m':'t',lh,lines,runs});
      }
      const navy=slide.classList.contains('navy');
      let notes=(slide.querySelector('aside.notes')||{}).textContent||''; slide.querySelectorAll('.fn').forEach(f=>{ const n=f.querySelector('.fn-n'), src=f.querySelector('.fn-src'); if(n&&src) notes+='\n\nFootnote '+n.textContent.trim()+': '+src.textContent.trim(); });
      const pn=document.getElementById('pagenum').textContent, meta=document.querySelector('.pager .meta'), spark=document.getElementById('spark');
      return {label:slide.dataset.label,navy,notes:notes.trim(),shapes,texts,chrome:{meta:{...R(meta),t:meta.textContent,...fontOf(getComputedStyle(meta))},page:{...R(document.getElementById('pagenum')),t:pn,...fontOf(getComputedStyle(document.getElementById('pagenum')))},spark:{...R(spark),src:spark.getAttribute('src')}}};
    }, i));
  }
  fs.writeFileSync(require('path').join(__dirname,'layout.json'), JSON.stringify(out));
  console.log(out.map(s=>s.label+': '+s.shapes.length+' shapes, '+s.texts.length+' texts').join('\n'));
  await b.close();
})();
