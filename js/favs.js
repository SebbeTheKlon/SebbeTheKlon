/* Effektverkstan — favoriter: ♥-knapp på varje demo och en drawer
   (öppnas från ⭐-knappen i FAB-raden) som listar sparade effekter.
   Sparas i localStorage som ["sida:nr", …]. */
(function () {
  var KEY = "fx-favs";
  var favs = [];
  try { favs = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}

  var page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");

  function save() { localStorage.setItem(KEY, JSON.stringify(favs)); }
  function has(id) { return favs.indexOf(id) >= 0; }
  function toggle(id) {
    var i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1); else favs.push(id);
    save();
    refreshButtons();
    renderDrawer();
    updateBadge();
  }
  function lookup(id) {
    var parts = id.split(":");
    var hit = null;
    (window.FX_REGISTRY || []).forEach(function (d) {
      if (d.p === parts[0] && d.n === parts[1]) hit = d;
    });
    return hit;
  }

  /* ♥-knappar i varje demo-head på kategorisidorna */
  function refreshButtons() {
    document.querySelectorAll(".fav-btn").forEach(function (b) {
      var active = has(b.dataset.fav);
      b.classList.toggle("active", active);
      b.textContent = active ? "♥ Sparad" : "♡ Spara";
    });
  }
  document.querySelectorAll(".demo").forEach(function (demo) {
    var head = demo.querySelector(".demo-head");
    var nr = demo.querySelector(".nr");
    if (!head || !nr) return;
    var id = page + ":" + nr.textContent.trim();
    var b = document.createElement("button");
    b.className = "fav-btn";
    b.dataset.fav = id;
    b.addEventListener("click", function () { toggle(id); });
    head.appendChild(b);
  });

  /* Drawer + ⭐-knapp i FAB-raden (raden skapas av theme.js) */
  var drawer = document.createElement("aside");
  drawer.className = "fav-drawer";
  drawer.innerHTML =
    '<div class="fav-head"><strong>⭐ Mina favoriter</strong><button class="fav-close" aria-label="Stäng">✕</button></div>' +
    '<div class="fav-list"></div>' +
    '<div class="fav-io">' +
      '<button class="fav-io-btn" id="fav-copy" title="Kopierar JSON till urklipp — klistra in i chatten med Claude">📋 Kopiera</button>' +
      '<button class="fav-io-btn" id="fav-export">⬇ Exportera</button>' +
    "</div>" +
    '<div class="fav-io">' +
      '<button class="fav-io-btn" id="fav-import">⬆ Importera</button>' +
      '<input type="file" id="fav-import-file" accept="application/json" hidden>' +
      '<button class="fav-io-btn" id="fav-sync" title="Hämtar data/favoriter.json från repot">🔄 GitHub</button>' +
    "</div>" +
    '<div class="fav-io-msg" id="fav-io-msg"></div>';
  document.body.appendChild(drawer);
  drawer.querySelector(".fav-close").addEventListener("click", function () {
    drawer.classList.remove("open");
  });

  /* Kopiera JSON till urklipp — snabbast för att skicka listan till Claude
     i chatten utan att ladda ner/ladda upp någon fil */
  drawer.querySelector("#fav-copy").addEventListener("click", function () {
    var msg = document.getElementById("fav-io-msg");
    var text = JSON.stringify({ favoriter: favs }, null, 2);
    navigator.clipboard.writeText(text).then(function () {
      msg.textContent = "✓ Kopierat! Klistra in det i chatten så committar Claude det.";
      msg.className = "fav-io-msg ok";
    }, function () {
      msg.textContent = "✕ Kunde inte komma åt urklipp — använd Exportera istället.";
      msg.className = "fav-io-msg err";
    });
  });

  /* Exportera favoriterna som en nedladdningsbar JSON-fil */
  drawer.querySelector("#fav-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify({ favoriter: favs }, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "effektverkstan-favoriter.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* Gemensam sammanslagning: tar in {favoriter:[...]} eller en ren array */
  function mergeIncoming(data) {
    var incoming = Array.isArray(data) ? data : data.favoriter;
    if (!Array.isArray(incoming)) throw new Error("fel format");
    var before = favs.length;
    incoming.forEach(function (id) { if (favs.indexOf(id) < 0) favs.push(id); });
    save();
    refreshButtons();
    renderDrawer();
    updateBadge();
    return favs.length - before;
  }

  /* Importera från en tidigare exporterad fil — slås ihop med befintliga */
  var fileInput = drawer.querySelector("#fav-import-file");
  drawer.querySelector("#fav-import").addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var msg = document.getElementById("fav-io-msg");
      try {
        var added = mergeIncoming(JSON.parse(reader.result));
        msg.textContent = "✓ Importerade " + added + " nya favoriter.";
        msg.className = "fav-io-msg ok";
      } catch (e) {
        msg.textContent = "✕ Kunde inte läsa filen — är det en exporterad favoritfil?";
        msg.className = "fav-io-msg err";
      }
      fileInput.value = "";
    };
    reader.readAsText(file);
  });

  /* Hämta favoriter som är sparade i repot (data/favoriter.json) — praktiskt
     för att synka mellan enheter utan att behöva ladda ner filen själv varje
     gång. Filen uppdateras genom att exportera och be Claude committa den. */
  drawer.querySelector("#fav-sync").addEventListener("click", function () {
    var msg = document.getElementById("fav-io-msg");
    msg.textContent = "Hämtar…";
    msg.className = "fav-io-msg";
    fetch("data/favoriter.json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        var added = mergeIncoming(data);
        msg.textContent = added > 0
          ? "✓ Hämtade " + added + " favoriter från GitHub."
          : "✓ Redan uppdaterad — inga nya favoriter i repot.";
        msg.className = "fav-io-msg ok";
      })
      .catch(function () {
        msg.textContent = "✕ Kunde inte hämta data/favoriter.json.";
        msg.className = "fav-io-msg err";
      });
  });

  function renderDrawer() {
    var list = drawer.querySelector(".fav-list");
    list.innerHTML = "";
    if (!favs.length) {
      list.innerHTML = '<p class="fav-empty">Inga favoriter ännu. Tryck ♡ Spara på en demo — eller utforska <a href="alla.html">alla effekter</a>.</p>';
      return;
    }
    favs.forEach(function (id) {
      var d = lookup(id);
      var cat = d && window.FX_CATS ? FX_CATS[d.p] : null;
      var row = document.createElement("div");
      row.className = "fav-row";
      row.innerHTML =
        '<span class="fav-ico">' + (d ? d.i : "✨") + "</span>" +
        '<span class="fav-name">' + (d ? d.t : id) + (cat ? '<small>' + cat.label + "</small>" : "") + "</span>" +
        '<a href="alla.html?open=' + id + '" title="Öppna i stort läge">⛶</a>' +
        '<button title="Ta bort">✕</button>';
      row.querySelector("button").addEventListener("click", function () { toggle(id); });
      list.appendChild(row);
    });
  }

  function updateBadge() {
    var fab = document.getElementById("fab-favs");
    if (fab) fab.dataset.count = favs.length || "";
  }

  // ⭐-knappen skapas av theme.js — koppla ihop när den finns
  var tries = 0;
  (function hook() {
    var fab = document.getElementById("fab-favs");
    if (fab) {
      fab.addEventListener("click", function () { drawer.classList.toggle("open"); });
      updateBadge();
    } else if (tries++ < 20) {
      setTimeout(hook, 100);
    }
  })();

  document.addEventListener("click", function (e) {
    if (drawer.classList.contains("open") &&
        !drawer.contains(e.target) &&
        !(e.target.id === "fab-favs")) {
      drawer.classList.remove("open");
    }
  });

  refreshButtons();
  renderDrawer();
})();
