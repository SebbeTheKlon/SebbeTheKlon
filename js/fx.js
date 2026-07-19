/* Effektverkstan — sajtomfattande effekter (bakgrund + muspekare).
   Styrs från 🎨-panelen via data-bg/data-cursor på <html> och lyssnar på
   "fx-change" från theme.js. Färgerna hämtas ur temats CSS-variabler. */
(function () {
  var root = document.documentElement;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function reduced() { // systeminställning ELLER "Rörelse: Av" i panelen
    return reducedMQ || root.getAttribute("data-motion") === "av";
  }

  var bgLayer = null, bgRaf = 0, bgListeners = [];
  var curLayer = null, curRaf = 0, curListeners = [];

  function cssColor(name) {
    return getComputedStyle(root).getPropertyValue(name).trim() || "#8b5cf6";
  }
  function on(list, t, e, f) { t.addEventListener(e, f); list.push({ t: t, e: e, f: f }); }
  function offAll(list) { list.forEach(function (l) { l.t.removeEventListener(l.e, l.f); }); list.length = 0; }

  /* ---------- Bakgrunder ---------- */
  function destroyBg() {
    cancelAnimationFrame(bgRaf); bgRaf = 0;
    offAll(bgListeners);
    if (bgLayer) { bgLayer.remove(); bgLayer = null; }
  }
  function makeBgLayer(cls) {
    bgLayer = document.createElement("div");
    bgLayer.className = "site-fx " + cls;
    bgLayer.setAttribute("aria-hidden", "true");
    document.body.prepend(bgLayer);
    return bgLayer;
  }
  function makeBgCanvas(cls) {
    makeBgLayer(cls);
    var c = document.createElement("canvas");
    bgLayer.appendChild(c);
    function fit() { c.width = innerWidth; c.height = innerHeight; }
    fit();
    on(bgListeners, window, "resize", fit);
    return c;
  }

  var BG = {
    aurora: function () {
      makeBgLayer("fx-aurora");
      [cssColor("--violet"), cssColor("--cyan"), cssColor("--pink")].forEach(function (col, i) {
        var b = document.createElement("i");
        b.style.background = col;
        b.className = "fxb" + (i + 1);
        bgLayer.appendChild(b);
      });
    },
    partiklar: function () {
      var c = makeBgCanvas("fx-canvas");
      var ctx = c.getContext("2d");
      var v = cssColor("--violet"), cy = cssColor("--cyan");
      var pts = [];
      for (var i = 0; i < 45; i++) {
        pts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
                   vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 });
      }
      function tick() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.globalAlpha = .5;
        pts.forEach(function (p, i) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > c.width) p.vx *= -1;
          if (p.y < 0 || p.y > c.height) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = v; ctx.fill();
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 130) {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = cy; ctx.globalAlpha = .14 * (1 - d / 130);
              ctx.stroke(); ctx.globalAlpha = .5;
            }
          }
        });
        if (!reduced()) bgRaf = requestAnimationFrame(tick);
      }
      tick(); // vid reducerad rörelse ritas en stillbild
    },
    rutnat: function () {
      makeBgLayer("fx-dots");
      var v = cssColor("--violet");
      bgLayer.style.backgroundImage = "radial-gradient(" + v + " 1px, transparent 1.5px)";
      var glow = document.createElement("i");
      glow.className = "fx-dots-glow";
      bgLayer.appendChild(glow);
      if (fine) {
        on(bgListeners, window, "mousemove", function (e) {
          glow.style.background = "radial-gradient(260px circle at " + e.clientX + "px " + e.clientY + "px, color-mix(in srgb, " + v + " 22%, transparent), transparent 70%)";
        });
      }
    },
    stjarnor: function () {
      var c = makeBgCanvas("fx-canvas");
      var ctx = c.getContext("2d");
      var stars = [];
      for (var layer = 0; layer < 3; layer++) {
        for (var i = 0; i < 50; i++) {
          stars.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
                       s: (layer + 1) * .1, r: (layer + 1) * .6, a: .25 + layer * .25 });
        }
      }
      function tick() {
        ctx.clearRect(0, 0, c.width, c.height);
        stars.forEach(function (s) {
          s.x -= s.s;
          if (s.x < 0) { s.x = c.width; s.y = Math.random() * c.height; }
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(160,160,220," + s.a + ")"; ctx.fill();
        });
        if (!reduced()) bgRaf = requestAnimationFrame(tick);
      }
      tick();
    }
  };

  /* ---------- Muspekare ---------- */
  function destroyCursor() {
    cancelAnimationFrame(curRaf); curRaf = 0;
    offAll(curListeners);
    if (curLayer) { curLayer.remove(); curLayer = null; }
  }

  var CURSOR = {
    ring: function () {
      curLayer = document.createElement("div");
      curLayer.className = "site-cursor";
      curLayer.innerHTML = '<i class="scd"></i><i class="scr"></i>';
      curLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(curLayer);
      var dot = curLayer.querySelector(".scd");
      var ring = curLayer.querySelector(".scr");
      var mx = -100, my = -100, rx = -100, ry = -100;
      on(curListeners, window, "mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        var hot = e.target.closest && e.target.closest("a,button,input,select,textarea,label,[role=button]");
        curLayer.classList.toggle("hot", !!hot);
      });
      function loop() {
        rx += (mx - rx) * .16; ry += (my - ry) * .16;
        dot.style.transform = "translate(" + mx + "px," + my + "px)";
        ring.style.transform = "translate(" + rx + "px," + ry + "px)";
        curRaf = requestAnimationFrame(loop);
      }
      loop();
    },
    spar: function () {
      curLayer = document.createElement("canvas");
      curLayer.className = "site-trail";
      curLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(curLayer);
      var ctx = curLayer.getContext("2d");
      function fit() { curLayer.width = innerWidth; curLayer.height = innerHeight; }
      fit();
      on(curListeners, window, "resize", fit);
      var parts = [];
      var colors = [cssColor("--violet"), cssColor("--cyan"), cssColor("--pink")];
      on(curListeners, window, "mousemove", function (e) {
        parts.push({ x: e.clientX, y: e.clientY,
                     vx: (Math.random() - .5) * 1.4, vy: (Math.random() - .5) * 1.4 - .3,
                     life: 1, r: Math.random() * 2.5 + 1,
                     c: colors[Math.floor(Math.random() * 3)] });
        if (!curRaf) loop();
      });
      function loop() {
        ctx.clearRect(0, 0, curLayer.width, curLayer.height);
        parts = parts.filter(function (p) { return p.life > 0; });
        parts.forEach(function (p) {
          p.x += p.vx; p.y += p.vy; p.life -= .025;
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.c; ctx.fill();
        });
        ctx.globalAlpha = 1;
        curRaf = parts.length ? requestAnimationFrame(loop) : 0; // sov när spåret är tomt
      }
    }
  };

  function rebuild() {
    destroyBg();
    destroyCursor();
    var bg = root.getAttribute("data-bg");
    if (bg && BG[bg]) BG[bg]();
    var cur = root.getAttribute("data-cursor");
    if (cur && fine && !reduced() && CURSOR[cur]) CURSOR[cur]();
  }

  document.addEventListener("fx-change", rebuild);
  rebuild();
})();
