/* Effektverkstan — delad JS: reveal-on-scroll, aktiv nav-länk, demo-id:n,
   solo-läge (för lightboxen i Alla effekter) och mobilmeny. */
(function () {
  // Markera aktiv sida i navigationen
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-head nav a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });

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

  // Mobilmeny: hamburgare i headern under 760 px (knappen injiceras här
  // så att befintliga sidor inte behöver ändras)
  var head = document.querySelector(".site-head");
  if (head && !solo) {
    var mb = document.createElement("button");
    mb.className = "site-menu-btn";
    mb.setAttribute("aria-label", "Meny");
    mb.innerHTML = "<span></span><span></span><span></span>";
    mb.addEventListener("click", function () { head.classList.toggle("nav-open"); });
    head.appendChild(mb);
  }

  // Hjälpare: pausa tunga canvas-loopar när elementet inte syns
  window.fxVisible = function (el, cb) {
    if (!("IntersectionObserver" in window)) { cb(true); return; }
    new IntersectionObserver(function (e) { cb(e[0].isIntersecting); }).observe(el);
  };
})();
