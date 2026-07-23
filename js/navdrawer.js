/* Effektverkstan — sidopanel med all navigering, grupperad i ämnen.
   Ersätter den gamla långa länkraden i headern. Byggs ur FX_CATS/
   FX_NAV_GROUPS (redan laddade av theme.js innan detta skript körs).
   Kan "fästas" (📌) så den stannar öppen även när man byter sida —
   preferensen sparas i localStorage och läses av theme.js redan innan
   sidan målas, så innehållet inte hoppar till när panelen dyker upp. */
(function () {
  if (!window.FX_CATS || !window.FX_NAV_GROUPS) return;

  var PIN_KEY = "fx-nav-pinned";
  var pinned = localStorage.getItem(PIN_KEY) === "1";
  var page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  var root = document.documentElement;

  function link(href, icon, label) {
    var active = page === href ? " active" : "";
    return '<a class="nd-link' + active + '" href="' + href + '.html">' + icon + " " + label + "</a>";
  }

  var html =
    '<div class="nd-head"><strong>Utforska</strong>' +
      '<button class="nd-pin' + (pinned ? " active" : "") + '" id="nd-pin" aria-label="Fäst sidopanelen" title="Fäst — panelen stannar öppen när du byter sida">📌</button>' +
      '<button class="nd-close" aria-label="Stäng meny">✕</button>' +
    "</div>";
  html += '<div class="nd-pinned">' +
            link("index", "🏠", "Startsida") +
            link("alla", "🗂️", "Alla effekter") +
            link("bygg", "🧰", "Bygg") +
          "</div>";

  FX_NAV_GROUPS.forEach(function (g) {
    html += '<div class="nd-group"><div class="nd-label">' + g.label + "</div>";
    g.cats.forEach(function (key) {
      var c = FX_CATS[key];
      if (c) html += link(key, c.icon, c.label);
    });
    html += "</div>";
  });

  var drawer = document.createElement("aside");
  drawer.className = "nav-drawer";
  drawer.setAttribute("aria-label", "Sidnavigering");
  drawer.innerHTML = html;
  document.body.appendChild(drawer);

  var btn = document.querySelector(".site-menu-btn");
  var pinBtn = drawer.querySelector("#nd-pin");

  function updatePush() {
    root.classList.toggle("nav-push", pinned && drawer.classList.contains("open"));
  }
  function open() {
    drawer.classList.add("open");
    if (btn) btn.classList.add("open");
    updatePush();
  }
  function close() {
    if (pinned) return; // fäst = stannar öppen tills man lossar den
    drawer.classList.remove("open");
    if (btn) btn.classList.remove("open");
    updatePush();
  }
  function toggle() { if (drawer.classList.contains("open")) close(); else open(); }

  // Öppna direkt (utan glid-animation) om panelen redan var fäst från
  // en tidigare sida — samma tick som elementet skapas, så webbläsaren
  // hinner aldrig rita det stängda läget först.
  if (pinned) open();

  if (btn) btn.addEventListener("click", toggle);
  drawer.querySelector(".nd-close").addEventListener("click", function () {
    // stäng = lossa fästningen helt, annars vore stängning meningslös
    pinned = false;
    localStorage.setItem(PIN_KEY, "0");
    pinBtn.classList.remove("active");
    drawer.classList.remove("open");
    if (btn) btn.classList.remove("open");
    root.classList.remove("nav-push");
  });
  pinBtn.addEventListener("click", function () {
    pinned = !pinned;
    localStorage.setItem(PIN_KEY, pinned ? "1" : "0");
    pinBtn.classList.toggle("active", pinned);
    if (pinned) open(); else updatePush();
  });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a") && !pinned) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) close();
  });
  document.addEventListener("click", function (e) {
    if (!drawer.classList.contains("open")) return;
    if (drawer.contains(e.target) || (btn && btn.contains(e.target))) return;
    close();
  });
})();
