/* layout-system.js
   Debug toggle + capacity flags for migrated standard slides (.s-ls).
   Press L, or ?debug=layout. Hidden in presentation mode. */
(function () {
  const params = new URLSearchParams(location.search);
  const hint = document.createElement("div");
  hint.className = "ls-debug-hint";
  hint.textContent = "Layout debug · L to hide · migrated slides";
  const stage = document.getElementById("stage");
  if (stage) stage.appendChild(hint);

  function lineCount(el) {
    if (!el) return 0;
    const cs = getComputedStyle(el);
    let lh = parseFloat(cs.lineHeight);
    if (!lh) lh = parseFloat(cs.fontSize) * 1.2;
    if (!lh) return 0;
    return Math.round(el.getBoundingClientRect().height / lh);
  }

  function flagCapacity() {
    document.querySelectorAll(".ls-over-capacity").forEach((el) => {
      el.classList.remove("ls-over-capacity");
      delete el.dataset.lsFlag;
    });
    const flags = [];
    document.querySelectorAll(".slide.s-ls").forEach((slide) => {
      const label = slide.getAttribute("data-label") || "(untitled)";
      slide.querySelectorAll(
        ".principles article, .cols > div, .spectrum > div, .evidence .ev, .paths .stop, .spine article, .chain article, .axes article, .loop article, .ask-row .copy, .compare > div, .root-split .kids article, .equation .box, .formula .box, .now-reuse article, .life article, .nest .band, .timeline .step, .anatomy .cell, .burden .layer, .stack .exp > div, .hero-metric .hero, .hero-metric .metric"
      ).forEach((card, i) => {
        const title = card.querySelector("h3");
        const body = card.querySelector("p, ul");
        const titleLines = lineCount(title);
        const bodyLines = body && body.tagName === "P" ? lineCount(body) : 0;
        const reasons = [];
        if (titleLines > 3) reasons.push("title " + titleLines + " lines (max 3)");
        else if (titleLines > 2) reasons.push("title " + titleLines + " lines (target 1–2)");
        if (bodyLines > 3) reasons.push("body " + bodyLines + " lines (summary length exceeded)");
        if (reasons.length) {
          card.classList.add("ls-over-capacity");
          card.dataset.lsFlag = reasons.join("; ");
          flags.push({ slide: label, index: i + 1, reasons, text: (title && title.textContent.trim()) || "" });
        }
      });
      slide.querySelectorAll(".quote-grid q").forEach((q, i) => {
        const lines = lineCount(q);
        if (lines > 4) {
          q.classList.add("ls-over-capacity");
          q.dataset.lsFlag = "quote " + lines + " lines";
          flags.push({ slide: label, index: i + 1, reasons: ["quote " + lines + " lines"], text: q.textContent.trim() });
        }
      });
      slide.querySelectorAll(".cols, .compare").forEach((grid) => {
        const cols = Array.from(grid.children);
        const counts = cols.map((c) => c.querySelectorAll("li").length);
        const min = Math.min.apply(null, counts);
        const max = Math.max.apply(null, counts);
        if (max > min && max > 0) {
          cols.forEach((c, i) => {
            if (counts[i] > min) {
              c.classList.add("ls-over-capacity");
              const reason = "column has " + counts[i] + " items; siblings have " + min;
              c.dataset.lsFlag = reason;
              const title = c.querySelector("h3");
              flags.push({ slide: label, index: i + 1, reasons: [reason], text: (title && title.textContent.trim()) || "" });
            }
          });
        }
      });
    });
    window.ADXLayoutFlags = flags;
    return flags;
  }

  function setDebug(on) {
    document.body.classList.toggle("debug-layout", on);
    if (on) requestAnimationFrame(flagCapacity);
  }

  if (params.get("debug") === "layout") setDebug(true);

  document.addEventListener("keydown", (e) => {
    if (e.target && e.target.matches && e.target.matches("input, textarea, select")) return;
    if (e.key === "l" || e.key === "L") {
      e.preventDefault();
      setDebug(!document.body.classList.contains("debug-layout"));
    }
  });

  window.ADXLayoutTest = { flagCapacity, setDebug };
})();
