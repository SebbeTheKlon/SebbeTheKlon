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
  drawer.innerHTML = '<div class="fav-head"><strong>⭐ Mina favoriter</strong><button class="fav-close" aria-label="Stäng">✕</button></div><div class="fav-list"></div>';
  document.body.appendChild(drawer);
  drawer.querySelector(".fav-close").addEventListener("click", function () {
    drawer.classList.remove("open");
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
