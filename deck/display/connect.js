// Walmart Connect theme: tag what the kit paints True Blue (Everyday Blue on navy)
// so connect.css can turn it into the Connect gradient. Runs once, before first paint.
(function () {
  const BLUE = 'rgb(0, 83, 226)', EVERY = 'rgb(77, 189, 245)';
  document.querySelectorAll('section.slide').forEach(function (slide) {
    const navy = slide.classList.contains('navy');
    const bar = document.createElement('div'); bar.className = 'cx-bar'; bar.setAttribute('aria-hidden', 'true');
    slide.appendChild(bar);
    slide.querySelectorAll('*').forEach(function (el) {
      if (el.closest('aside.notes, svg') || el.matches('em.mark')) return;
      const cs = getComputedStyle(el);
      const accent = function (c) { return c === BLUE || (navy && c === EVERY); };
      const h = ['Top', 'Bottom'].some(function (s) { return parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none' && accent(cs['border' + s + 'Color']); });
      const v = ['Left', 'Right'].some(function (s) { return parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none' && accent(cs['border' + s + 'Color']); });
      const boxed = ['Top', 'Right', 'Bottom', 'Left'].every(function (s) { return parseFloat(cs['border' + s + 'Width']) > 0; });
      if (!boxed && h) el.classList.add('cx-rule'); else if (!boxed && v) el.classList.add('cx-rule-v');
      if (accent(cs.backgroundColor) && cs.backgroundImage === 'none' && el.getBoundingClientRect().height <= 4) el.classList.add('cx-fill');
      // display-size accent type gets gradient ink; small labels stay True Blue for legibility
      if (accent(cs.color) && parseFloat(cs.fontSize) >= 20 && !/Mono/.test(cs.fontFamily) &&
          [].some.call(el.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) el.classList.add('cx-text');
    });
  });
})();
