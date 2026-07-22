/* Effektverkstan — delad JS: reveal-on-scroll, demo-id:n, solo-läge
   (för lightboxen i Alla effekter) och menyknappen till sidopanelen. */
(function () {
  // Ge varje demo ett id utifrån sitt nummer (fx-01, fx-02 …)
  document.querySelectorAll(".demo").forEach(function (sec) {
    var nr = sec.querySelector(".nr");
    if (nr && !sec.id) sec.id = "fx-" + nr.textContent.trim();
  });

  // Solo-läge: ?solo=fx-01 visar bara den demon (lightboxen på alla.html).
  // Sektionerna döljs med CSS i stället för att tas bort, så att sidans
  // init-skript (som slår upp element med getElementById) inte kraschar.
  var params = new URLSearchParams(location.search);
  var solo = params.get("solo");
  if (solo) {
    document.documentElement.classList.add("solo-mode");
    if (params.get("scroll") === "1") document.documentElement.classList.add("solo-scroll");
    var target = document.getElementById(solo);
    if (target) target.classList.add("solo");
  }

  // Reveal-on-scroll med IntersectionObserver
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // Menyknapp: öppnar sidopanelen med all navigering (js/navdrawer.js
  // fyller panelen och binder klicket — knappen skapas tidigt här så den
  // garanterat finns i DOM:en när navdrawer.js körs senare)
  var head = document.querySelector(".site-head");
  if (head && !solo) {
    var mb = document.createElement("button");
    mb.className = "site-menu-btn";
    mb.setAttribute("aria-label", "Öppna meny");
    mb.innerHTML = "<span></span><span></span><span></span>";
    head.appendChild(mb);
  }

  // Hjälpare: pausa tunga canvas-loopar när elementet inte syns
  window.fxVisible = function (el, cb) {
    if (!("IntersectionObserver" in window)) { cb(true); return; }
    new IntersectionObserver(function (e) { cb(e[0].isIntersecting); }).observe(el);
  };
})();
