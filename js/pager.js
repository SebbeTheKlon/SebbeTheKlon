/* Effektverkstan — föregående/nästa-knappar längst ner på varje kategorisida.
   Byggs dynamiskt ur FX_CATS ordning (samma ordning som toppnavigeringen),
   loopar runt i en cirkel så man kan klicka sig igenom hela biblioteket. */
(function () {
  if (!window.FX_CATS) return;
  var order = Object.keys(FX_CATS);
  var page = (location.pathname.split("/").pop() || "").replace(".html", "");
  var idx = order.indexOf(page);
  if (idx < 0) return; // hubbsidor (index, alla, bygg) får ingen pager

  var foot = document.querySelector(".site-foot");
  if (!foot) return;

  var prevKey = order[(idx - 1 + order.length) % order.length];
  var nextKey = order[(idx + 1) % order.length];
  var prev = FX_CATS[prevKey], next = FX_CATS[nextKey];

  var bar = document.createElement("nav");
  bar.className = "pager";
  bar.setAttribute("aria-label", "Bläddra mellan kategorier");
  bar.innerHTML =
    '<a class="pager-btn pager-prev" href="' + prevKey + '.html">' +
      '<span class="pager-dir">← Föregående</span>' +
      '<span class="pager-name">' + prev.icon + " " + prev.label + "</span>" +
    "</a>" +
    '<span class="pager-count">' + String(idx + 1).padStart(2, "0") + " / " + order.length + "</span>" +
    '<a class="pager-btn pager-next" href="' + nextKey + '.html">' +
      '<span class="pager-dir">Nästa →</span>' +
      '<span class="pager-name">' + next.icon + " " + next.label + "</span>" +
    "</a>";

  foot.parentNode.insertBefore(bar, foot);
})();
