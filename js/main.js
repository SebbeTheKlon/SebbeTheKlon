/* Effektverkstan — delad JS: reveal-on-scroll + aktiv nav-länk */
(function () {
  // Markera aktiv sida i navigationen
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-head nav a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });

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
})();
