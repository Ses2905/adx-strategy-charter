// Walmart Connect theme: re-colour what the kit paints True Blue on white slides.
// Large type goes Connect Purple, small type and rules go Bentonville Blue (the only
// small-text colour the guidelines pass on white). Navy slides already use Everyday Blue.
(function () {
  const BLUE = 'rgb(0, 83, 226)';
  document.querySelectorAll('section.slide:not(.navy)').forEach(function (slide) {
    slide.querySelectorAll('*').forEach(function (el) {
      if (el.closest('aside.notes, svg') || el.matches('em.mark, .eyebrow, .pill, .eyebrow--feature')) return;
      const cs = getComputedStyle(el);
      if (['Top', 'Right', 'Bottom', 'Left'].some(function (s) { return parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Color'] === BLUE; })) el.classList.add('cx-rule');
      if (cs.backgroundColor === BLUE) el.classList.add('cx-mark');
      if (cs.color === BLUE) el.classList.add(parseFloat(cs.fontSize) >= 20 && !/Mono/.test(cs.fontFamily) ? 'cx-big' : 'cx-small');
    });
  });
})();
