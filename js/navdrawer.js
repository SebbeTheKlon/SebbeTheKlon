/* Effektverkstan — sidopanel med all navigering, grupperad i ämnen.
   Ersätter den gamla långa länkraden i headern. Byggs ur FX_CATS/
   FX_NAV_GROUPS (redan laddade av theme.js innan detta skript körs). */
(function () {
  if (!window.FX_CATS || !window.FX_NAV_GROUPS) return;

  var page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");

  function link(href, icon, label) {
    var active = page === href ? " active" : "";
    return '<a class="nd-link' + active + '" href="' + href + '.html">' + icon + " " + label + "</a>";
  }

  var html = '<div class="nd-head"><strong>Utforska</strong><button class="nd-close" aria-label="Stäng meny">✕</button></div>';
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

  function close() {
    drawer.classList.remove("open");
    if (btn) btn.classList.remove("open");
  }
  function toggle() {
    var open = drawer.classList.toggle("open");
    if (btn) btn.classList.toggle("open", open);
  }

  if (btn) btn.addEventListener("click", toggle);
  drawer.querySelector(".nd-close").addEventListener("click", close);
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) close();
  });
  document.addEventListener("click", function (e) {
    if (!drawer.classList.contains("open")) return;
    if (drawer.contains(e.target) || (btn && btn.contains(e.target))) return;
    close();
  });
})();
