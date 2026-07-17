/* Effektverkstan — "Visa koden": lägger en knapp på varje demo som visar
   demons HTML (från DOM), CSS och JS (utsnitt ur sidans style-/script-taggar,
   avgränsade av markörer i formen "--- 01 ..."). */
(function () {
  var styles = Array.prototype.map.call(
    document.querySelectorAll("style"),
    function (s) { return s.textContent; }
  ).join("\n");

  var scripts = Array.prototype.filter.call(
    document.querySelectorAll("script"),
    function (s) { return !s.src; }
  ).map(function (s) { return s.textContent; }).join("\n");

  function extract(src, nr) {
    var re = new RegExp("/\\* --- " + nr + "[\\s\\S]*?(?=/\\* --- |$)");
    var m = src.match(re);
    return m ? m[0].trim() : "";
  }

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function block(lang, code) {
    return '<div class="code-block"><div class="code-lang">' + lang +
           '</div><pre><code>' + esc(code) + '</code></pre></div>';
  }

  document.querySelectorAll(".demo").forEach(function (demo) {
    var head = demo.querySelector(".demo-head");
    if (!head) return;
    var nrEl = demo.querySelector(".nr");
    var nr = nrEl ? nrEl.textContent.trim() : null;
    var stage = demo.querySelector(".demo-stage");

    var btn = document.createElement("button");
    btn.className = "code-btn";
    btn.textContent = "</> Visa koden";
    head.appendChild(btn);

    var wrap = null;
    btn.addEventListener("click", function () {
      if (wrap) {
        wrap.remove();
        wrap = null;
        btn.textContent = "</> Visa koden";
        return;
      }
      var parts = [];
      if (stage) parts.push(block("HTML", stage.outerHTML));
      var css = nr ? extract(styles, nr) : "";
      var js = nr ? extract(scripts, nr) : "";
      if (css) parts.push(block("CSS", css));
      if (js) parts.push(block("JavaScript", js));
      if (!parts.length) return;
      wrap = document.createElement("div");
      wrap.className = "code-view";
      wrap.innerHTML = parts.join("");
      demo.appendChild(wrap);
      btn.textContent = "✕ Dölj koden";
    });
  });
})();
