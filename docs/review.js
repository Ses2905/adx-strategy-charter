(() => {
  const KEY = "adx-review-v1";
  const RULES = [
    {
      id: "density",
      q: "How dense should the live readout feel?",
      options: [
        "Dense leadership: keep this grain",
        "One idea per slide, even if that means more slides later",
        "Mix: core dense, appendix thinner"
      ]
    },
    {
      id: "voice",
      q: "Whose voice should the slides use?",
      options: [
        "Warm, you = advertiser",
        "Institutional: we / Walmart Ads",
        "Keep a mix: warm on diagnosis, we on the ask"
      ]
    },
    {
      id: "copywell",
      q: "Should titles and body stay on the 960 well?",
      options: [
        "Yes, 960 everywhere including diagrams",
        "960 for type, full 1520 for diagrams and tables",
        "Let dense slides go wider when they need it"
      ]
    },
    {
      id: "footer",
      q: "Footer meta (Advertiser Experience · Walmart Global Ads)?",
      options: ["Keep 11px", "Slightly larger", "Hide it"]
    },
    {
      id: "diagrams",
      q: "The new journey / topology / sequence diagrams?",
      options: [
        "Keep them: they read as models",
        "Simplify further",
        "Go back to cards and lists"
      ]
    },
    {
      id: "appendix",
      q: "What should happen to the appendix in the room?",
      options: [
        "Keep it in this file, skip it live",
        "Keep it and walk a few tables",
        "Cut it from this file"
      ]
    },
    {
      id: "emphasis",
      q: "True Blue italic on one word in titles?",
      options: ["Keep it", "Use it only on chapter and close slides", "Remove it"]
    },
    {
      id: "motion",
      q: "Enter motion?",
      options: ["Keep GSAP expo.out", "Faster / quieter", "Static, no enter"]
    },
    {
      id: "length",
      q: "For this leadership readout, what is the working length?",
      options: [
        "Full 69 is fine",
        "Core 61, appendix on request",
        "We will make a shorter cut later (do not build it yet)"
      ]
    }
  ];

  const DIRS = [
    { id: "keep", label: "Keep" },
    { id: "tweak", label: "Tweak" },
    { id: "rewrite", label: "Rewrite copy" },
    { id: "density", label: "Too dense" },
    { id: "diagram", label: "Needs a diagram" },
    { id: "cut", label: "Cut / move" }
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      return {};
    }
  }
  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function state() {
    const data = load();
    if (!data.rules) data.rules = {};
    if (!data.notes) data.notes = {};
    if (!data.dirs) data.dirs = {};
    if (!data.extras) data.extras = {};
    return data;
  }

  function slideTitle(i) {
    const sl = document.querySelectorAll(".slide")[i];
    if (!sl) return "";
    const t = sl.querySelector("h1, h2, blockquote");
    return (t ? t.textContent : sl.dataset.label || "").replace(/\s+/g, " ").trim();
  }

  function exportMarkdown(data) {
    const slides = Array.from(document.querySelectorAll(".slide"));
    let out = "# ADX review brief\n\n## Global rules\n\n";
    RULES.forEach((rule) => {
      const ans = data.rules[rule.id] || "";
      const extra = (data.extras[rule.id] || "").trim();
      out += `**${rule.q}**\n`;
      out += ans ? `${ans}\n` : "_unanswered_\n";
      if (extra) out += `Note: ${extra}\n`;
      out += "\n";
    });
    out += "## Slide notes\n\n";
    let any = false;
    slides.forEach((sl, i) => {
      const note = (data.notes[i] || "").trim();
      const dir = data.dirs[i] || "";
      if (!note && !dir) return;
      any = true;
      const n = String(i + 1).padStart(2, "0");
      out += `### ${n} · ${slideTitle(i)}\n`;
      out += `URL: ?s=${i}\n`;
      if (dir) out += `Direction: ${dir}\n`;
      if (note) out += `${note}\n`;
      out += "\n";
    });
    if (!any) out += "_No slide notes yet._\n";
    return out;
  }

  function mount() {
    if (document.getElementById("reviewDock")) return;
    const dock = document.createElement("aside");
    dock.className = "review-dock";
    dock.id = "reviewDock";
    dock.innerHTML = `
      <div class="review-hd">
        <div class="kicker">Review mode · R to toggle</div>
        <h2>Direction first, then slides</h2>
        <p>Answer the rules. Then arrow through the deck and leave a note only where something is wrong.</p>
      </div>
      <div class="review-tabs" role="tablist">
        <button type="button" role="tab" id="tab-rules" aria-selected="true" data-pane="rules">1 · Rules</button>
        <button type="button" role="tab" id="tab-slide" aria-selected="false" data-pane="slide">2 · This slide</button>
        <button type="button" role="tab" id="tab-export" aria-selected="false" data-pane="export">3 · Copy</button>
      </div>
      <div class="review-panes">
        <div class="review-pane is-on" id="pane-rules"></div>
        <div class="review-pane" id="pane-slide"></div>
        <div class="review-pane" id="pane-export">
          <p class="review-hint">Paste this into Cursor when you want the next pass. It includes only answered rules and slides you marked.</p>
          <div class="review-actions">
            <button type="button" class="copy-btn" id="copyBrief">Copy brief</button>
            <button type="button" class="copy-btn ghost" id="refreshBrief">Refresh</button>
          </div>
          <textarea class="export-box" id="exportBox" readonly></textarea>
        </div>
      </div>
    `;
    document.body.appendChild(dock);

    const data = state();
    const rulesPane = dock.querySelector("#pane-rules");
    rulesPane.innerHTML = RULES.map((rule, idx) => {
      const chosen = data.rules[rule.id] || "";
      const opts = rule.options.map((opt) => `
        <label>
          <input type="radio" name="rule-${rule.id}" value="${opt.replace(/"/g, "&quot;")}" ${chosen === opt ? "checked" : ""}>
          <span>${opt}</span>
        </label>`).join("");
      return `<div class="rule" data-rule="${rule.id}">
        <h3>${idx + 1}. ${rule.q}</h3>
        ${opts}
        <textarea data-extra="${rule.id}" placeholder="Optional: a sentence of direction">${(data.extras[rule.id] || "").replace(/</g, "&lt;")}</textarea>
      </div>`;
    }).join("") + `<p class="review-hint">When the ten rules feel right, switch to This slide. You do not have to comment on every slide.</p>`;

    rulesPane.addEventListener("change", (e) => {
      const t = e.target;
      const next = state();
      if (t.matches("input[type=radio]")) {
        next.rules[t.name.replace("rule-", "")] = t.value;
        save(next);
      }
    });
    rulesPane.addEventListener("input", (e) => {
      if (!e.target.matches("textarea[data-extra]")) return;
      const next = state();
      next.extras[e.target.dataset.extra] = e.target.value;
      save(next);
    });

    dock.querySelectorAll(".review-tabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        dock.querySelectorAll(".review-tabs button").forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
        dock.querySelectorAll(".review-pane").forEach((p) => p.classList.toggle("is-on", p.id === "pane-" + btn.dataset.pane));
        if (btn.dataset.pane === "export") refreshExport();
        if (btn.dataset.pane === "slide") renderSlide();
      });
    });

    dock.querySelector("#copyBrief").addEventListener("click", async () => {
      refreshExport();
      const text = dock.querySelector("#exportBox").value;
      try {
        await navigator.clipboard.writeText(text);
        dock.querySelector("#copyBrief").textContent = "Copied";
        setTimeout(() => { dock.querySelector("#copyBrief").textContent = "Copy brief"; }, 1200);
      } catch {
        dock.querySelector("#exportBox").select();
      }
    });
    dock.querySelector("#refreshBrief").addEventListener("click", refreshExport);
  }

  function renderSlide() {
    const pane = document.getElementById("pane-slide");
    if (!pane) return;
    const i = window.ADXReviewIndex || 0;
    const data = state();
    const dir = data.dirs[i] || "";
    const count = Object.keys(data.notes).filter((k) => (data.notes[k] || "").trim() || data.dirs[k]).length;
    pane.innerHTML = `
      <div class="slide-meta">Slide ${String(i + 1).padStart(2, "0")} / ${String(document.querySelectorAll(".slide").length).padStart(2, "0")} · ?s=${i}<span class="badge">${count} marked</span></div>
      <div class="slide-title">${slideTitle(i)}</div>
      <div class="dirs">
        ${DIRS.map((d) => `<label><input type="radio" name="dir" value="${d.id}" ${dir === d.id ? "checked" : ""}> ${d.label}</label>`).join("")}
      </div>
      <textarea class="slide-note" id="slideNote" placeholder="What should change on this slide? Point at the element if you can: pill, title, lede, diagram, table.">${(data.notes[i] || "").replace(/</g, "&lt;")}</textarea>
      <div class="review-actions">
        <button type="button" id="clearSlide" class="ghost">Clear this slide</button>
      </div>
      <p class="review-hint">Speaker notes are still N. This panel is direction for the next build pass, not the talk track.</p>
    `;
    pane.querySelector("#slideNote").addEventListener("input", (e) => {
      const next = state();
      next.notes[i] = e.target.value;
      save(next);
    });
    pane.querySelectorAll("input[name=dir]").forEach((el) => {
      el.addEventListener("change", () => {
        const next = state();
        next.dirs[i] = el.value;
        save(next);
      });
    });
    pane.querySelector("#clearSlide").addEventListener("click", () => {
      const next = state();
      delete next.notes[i];
      delete next.dirs[i];
      save(next);
      renderSlide();
    });
  }

  function refreshExport() {
    const box = document.getElementById("exportBox");
    if (box) box.value = exportMarkdown(state());
  }

  function setReview(on) {
    document.body.classList.toggle("is-review", on);
    const url = new URL(location.href);
    if (on) url.searchParams.set("review", "1");
    else url.searchParams.delete("review");
    history.replaceState(null, "", url);
    if (typeof window.ADXFit === "function") window.ADXFit();
    if (on) renderSlide();
  }

  window.ADXReview = {
    onShow(i) {
      window.ADXReviewIndex = i;
      if (document.body.classList.contains("is-review")) renderSlide();
    }
  };

  mount();
  const params = new URLSearchParams(location.search);
  window.ADXReviewIndex = Number(params.get("s") || 0);
  if (params.get("review") === "1" || params.has("review")) setReview(true);

  document.addEventListener("keydown", (e) => {
    if (e.target && e.target.closest && e.target.closest(".review-dock") && e.target.matches("input, textarea, select")) return;
    if (e.key === "r" || e.key === "R") {
      if (e.target && e.target.matches && e.target.matches("input, textarea, select")) return;
      e.preventDefault();
      setReview(!document.body.classList.contains("is-review"));
    }
  });
})();
