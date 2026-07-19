/* Effektverkstan — temaväxlare: läge, färgtema, typsnitt, hörn och ramar.
   Sparas i localStorage och appliceras direkt vid sidladdning (ingen blink). */
(function () {
  var KEY = "fx-theme";
  var root = document.documentElement;
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}

  var GROUPS = [
    { key: "theme", label: "Läge", opts: [["", "🌙 Mörkt"], ["light", "☀️ Ljust"]] },
    { key: "accent", label: "Färgtema", swatch: true, opts: [
      ["", "linear-gradient(120deg,#8b5cf6,#22d3ee)", "Neon (standard)"],
      ["hav", "linear-gradient(120deg,#3b82f6,#67e8f9)", "Hav"],
      ["skog", "linear-gradient(120deg,#10b981,#a3e635)", "Skog"],
      ["sol", "linear-gradient(120deg,#f97316,#f472b6)", "Solnedgång"],
      ["rubin", "linear-gradient(120deg,#ef4444,#fbbf24)", "Rubin"]
    ]},
    { key: "font", label: "Typsnitt", opts: [["", "Sans"], ["serif", "Serif"], ["mono", "Mono"]] },
    { key: "radius", label: "Hörn", opts: [["skarp", "Skarpa"], ["mjuk", "Mjuka"], ["", "Runda"], ["extra", "Extra runda"]] },
    { key: "border", label: "Ramar", opts: [["", "Subtila"], ["tydlig", "Tydliga"], ["neon", "Neon"]] },
    { key: "bg", label: "Sajtbakgrund ✨", opts: [["", "Ingen"], ["aurora", "Aurora"], ["partiklar", "Partiklar"], ["rutnat", "Rutnät"], ["stjarnor", "Stjärnor"]] },
    { key: "cursor", label: "Muspekare ✨", opts: [["", "Standard"], ["ring", "Ring"], ["spar", "Partikelspår"]] }
  ];

  function apply() {
    GROUPS.forEach(function (g) {
      var v = state[g.key];
      if (v) root.setAttribute("data-" + g.key, v);
      else root.removeAttribute("data-" + g.key);
    });
    document.dispatchEvent(new CustomEvent("fx-change")); // låt fx.js reagera
  }
  apply(); // körs direkt i <head> så rätt tema finns innan sidan målas

  document.addEventListener("DOMContentLoaded", function () {
    // ingen panel eller sajteffekter inne i lightbox-iframes (solo-läget)
    if (new URLSearchParams(location.search).get("solo")) return;

    // ladda sajteffekt-motorn (fx.js) — injiceras här så att alla sidor
    // får den utan att behöva ändras
    var fxScript = document.createElement("script");
    fxScript.src = "js/fx.js";
    document.body.appendChild(fxScript);

    var fab = document.createElement("button");
    fab.className = "fab";
    fab.textContent = "🎨";
    fab.setAttribute("aria-label", "Anpassa utseendet");

    var panel = document.createElement("div");
    panel.className = "theme-panel";
    var html = '<div class="tp-title">Anpassa utseendet</div>';
    GROUPS.forEach(function (g) {
      html += '<div class="tp-group"><div class="tp-label">' + g.label + '</div><div class="tp-opts">';
      g.opts.forEach(function (o) {
        if (g.swatch) {
          html += '<button class="tp-swatch" data-key="' + g.key + '" data-val="' + o[0] +
                  '" style="background:' + o[1] + '" title="' + o[2] + '" aria-label="' + o[2] + '"></button>';
        } else {
          html += '<button class="tp-btn" data-key="' + g.key + '" data-val="' + o[0] + '">' + o[1] + '</button>';
        }
      });
      html += '</div></div>';
    });
    html += '<div class="tp-group"><button class="tp-btn" id="tp-reset">↺ Återställ allt</button></div>';
    panel.innerHTML = html;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    function mark() {
      panel.querySelectorAll("[data-key]").forEach(function (b) {
        b.classList.toggle("active", (state[b.dataset.key] || "") === b.dataset.val);
      });
    }
    mark();

    fab.addEventListener("click", function () { panel.classList.toggle("open"); });

    panel.addEventListener("click", function (e) {
      var b = e.target.closest("[data-key]");
      if (b) {
        if (b.dataset.val) state[b.dataset.key] = b.dataset.val;
        else delete state[b.dataset.key];
        localStorage.setItem(KEY, JSON.stringify(state));
        apply(); mark();
      }
      if (e.target.id === "tp-reset") {
        state = {};
        localStorage.removeItem(KEY);
        apply(); mark();
      }
    });

    // klick utanför stänger panelen
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== fab) {
        panel.classList.remove("open");
      }
    });
  });
})();
