/* Effektverkstan — register över alla demos.
   p = sida (utan .html), n = demonummer, t = titel, i = emoji.
   scroll: true = demon behöver vertikalt scrollutrymme i solo-läge. */
window.FX_CATS = {
  bakgrund:   { label: "Bakgrund",   icon: "🌌", g: "#8b5cf6,#4c1d95" },
  mus:        { label: "Mus",        icon: "🖱️", g: "#22d3ee,#0e7490" },
  "3d":       { label: "3D",         icon: "🧊", g: "#60a5fa,#1e3a8a" },
  scroll:     { label: "Scroll",     icon: "📜", g: "#f472b6,#9d174d" },
  text:       { label: "Text",       icon: "✍️", g: "#a78bfa,#5b21b6" },
  typografi:  { label: "Typografi",  icon: "🔤", g: "#fbbf24,#92400e" },
  galleri:    { label: "Galleri",    icon: "🖼️", g: "#4ade80,#14532d" },
  media:      { label: "Media",      icon: "🎬", g: "#67e8f9,#155e75" },
  ui:         { label: "UI",         icon: "✨", g: "#f9a8d4,#9d174d" },
  formular:   { label: "Formulär",   icon: "📝", g: "#818cf8,#3730a3" },
  navigation: { label: "Navigation", icon: "🧭", g: "#fb923c,#7c2d12" },
  feedback:   { label: "Feedback",   icon: "🔔", g: "#facc15,#854d0e" },
  listor:     { label: "Listor",     icon: "📚", g: "#34d399,#065f46" },
  tillstand:  { label: "Tillstånd",  icon: "🎚️", g: "#c084fc,#6b21a8" },
  css:        { label: "Modern CSS", icon: "🧩", g: "#38bdf8,#075985" },
  labb:       { label: "Labbet",     icon: "🧪", g: "#f87171,#7f1d1d" }
};

/* Ämnesgrupper för sidopanelen (js/navdrawer.js) — täcker alla 16 kategorier */
window.FX_NAV_GROUPS = [
  { label: "Visuellt", cats: ["bakgrund", "mus", "3d", "scroll", "galleri", "media"] },
  { label: "Interaktion", cats: ["formular", "navigation", "feedback", "listor", "tillstand"] },
  { label: "Innehåll", cats: ["text", "typografi", "ui"] },
  { label: "Kod", cats: ["css", "labb"] }
];

window.FX_REGISTRY = [
  { p: "bakgrund", n: "01", t: "Aurora / gradientblobbar", i: "🌠" },
  { p: "bakgrund", n: "02", t: "Partikelnät", i: "🕸️" },
  { p: "bakgrund", n: "03", t: "Punktrutnät med spotlight", i: "🔦" },
  { p: "bakgrund", n: "04", t: "Animerad gradient", i: "🌈" },
  { p: "bakgrund", n: "05", t: "Stjärnfält med djup", i: "⭐" },
  { p: "bakgrund", n: "06", t: "Roterande ljusstrimmor", i: "💫" },

  { p: "mus", n: "01", t: "Egen muspekare", i: "🎯" },
  { p: "mus", n: "02", t: "Magnetiska knappar", i: "🧲" },
  { p: "mus", n: "03", t: "Spotlight-kort", i: "💡" },
  { p: "mus", n: "04", t: "Tilt-kort med glans", i: "🃏" },
  { p: "mus", n: "05", t: "Partikelspår", i: "☄️" },
  { p: "mus", n: "06", t: "Bildförhandsvisning vid hover", i: "🖼️" },

  { p: "3d", n: "01", t: "Flip-kort", i: "🔄" },
  { p: "3d", n: "02", t: "Roterande kub", i: "🎲" },
  { p: "3d", n: "03", t: "3D-karusell", i: "🎠" },
  { p: "3d", n: "04", t: "Parallaxlager i kort", i: "🛰️" },
  { p: "3d", n: "05", t: "Isometriskt hover-lyft", i: "📦" },

  { p: "scroll", n: "01", t: "Reveal-varianter", i: "🎭", scroll: true },
  { p: "scroll", n: "02", t: "Parallaxbakgrund", i: "🏔️", scroll: true },
  { p: "scroll", n: "03", t: "Staplade kort", i: "🥞", scroll: true },
  { p: "scroll", n: "04", t: "Text som fylls i vid scroll", i: "💬", scroll: true },
  { p: "scroll", n: "05", t: "Skala med scrollposition", i: "🔮", scroll: true },

  { p: "text", n: "01", t: "Skrivmaskin", i: "⌨️" },
  { p: "text", n: "02", t: "Scramble / avkodning", i: "🔐" },
  { p: "text", n: "03", t: "Glitch", i: "📺" },
  { p: "text", n: "04", t: "Gradienttext & marquee", i: "🎨" },
  { p: "text", n: "05", t: "Bokstav-för-bokstav-reveal", i: "🫧" },
  { p: "text", n: "06", t: "Highlight-understrykning", i: "🖍️" },

  { p: "typografi", n: "01", t: "Anfang (drop cap)", i: "🅰️" },
  { p: "typografi", n: "02", t: "Neonglöd", i: "🌃" },
  { p: "typografi", n: "03", t: "Konturtext", i: "⭕" },
  { p: "typografi", n: "04", t: "Spärrning vid hover", i: "↔️" },
  { p: "typografi", n: "05", t: "Text på bana", i: "🎢" },
  { p: "typografi", n: "06", t: "Vågtext", i: "🌊" },
  { p: "typografi", n: "07", t: "Balanserade rubriker", i: "⚖️" },

  { p: "galleri", n: "01", t: "Crossfade-bildspel", i: "🎞️" },
  { p: "galleri", n: "02", t: "Ken Burns", i: "🎥" },
  { p: "galleri", n: "03", t: "Coverflow", i: "💿" },
  { p: "galleri", n: "04", t: "Dragbar slider", i: "👆" },
  { p: "galleri", n: "05", t: "Före / efter-reglage", i: "🌗" },
  { p: "galleri", n: "06", t: "Lightbox-galleri", i: "🔍" },

  { p: "media", n: "01", t: "Blur-up-laddning (LQIP)", i: "🌫️" },
  { p: "media", n: "02", t: "Bildzoom vid hover", i: "🔎" },
  { p: "media", n: "03", t: "Ritande SVG-linjer", i: "✏️" },
  { p: "media", n: "04", t: "Lazy-loading", i: "😴" },
  { p: "media", n: "05", t: "Blend modes", i: "🎭" },
  { p: "media", n: "06", t: "Aspect-ratio-lådor", i: "📐" },
  { p: "media", n: "07", t: "Fullskärms-API", i: "⛶" },

  { p: "ui", n: "01", t: "Glassmorphism", i: "🪟" },
  { p: "ui", n: "02", t: "Roterande gradientram", i: "🔆" },
  { p: "ui", n: "03", t: "Knapp-effekter", i: "🔘" },
  { p: "ui", n: "04", t: "Skeleton loading", i: "💀" },
  { p: "ui", n: "05", t: "Räknare som tickar upp", i: "🧮" },
  { p: "ui", n: "06", t: "Bento-layout", i: "🍱" },
  { p: "ui", n: "07", t: "Toggle med studs", i: "🎛️" },

  { p: "formular", n: "01", t: "Flytande etiketter", i: "🏷️" },
  { p: "formular", n: "02", t: "Live-validering", i: "✅" },
  { p: "formular", n: "03", t: "Egna kryssrutor & radio", i: "☑️" },
  { p: "formular", n: "04", t: "Dubbelreglage (från–till)", i: "🎚️" },
  { p: "formular", n: "05", t: "Autocomplete-sök", i: "🔤" },
  { p: "formular", n: "06", t: "Stegformulär med progress", i: "🪜" },
  { p: "formular", n: "07", t: "Dra-och-släpp-uppladdning", i: "📁" },

  { p: "navigation", n: "01", t: "Smart sticky header", i: "🫥" },
  { p: "navigation", n: "02", t: "Hamburgare → kryss", i: "🍔" },
  { p: "navigation", n: "03", t: "Flikar med indikator", i: "📑" },
  { p: "navigation", n: "04", t: "Scrollspy", i: "🕵️" },
  { p: "navigation", n: "05", t: "Dropdown-meny", i: "📂" },
  { p: "navigation", n: "06", t: "Mobil bottennav", i: "📱" },
  { p: "navigation", n: "07", t: "Brödsmulor", i: "🥖" },

  { p: "feedback", n: "01", t: "Toast-notiser", i: "🍞" },
  { p: "feedback", n: "02", t: "Modal med backdrop", i: "🪧" },
  { p: "feedback", n: "03", t: "Tooltips", i: "💭" },
  { p: "feedback", n: "04", t: "Kopiera till urklipp", i: "📋" },
  { p: "feedback", n: "05", t: "Laddare", i: "⏳" },
  { p: "feedback", n: "06", t: "Progressbar", i: "📊" },

  { p: "listor", n: "01", t: "Masonry", i: "🧱" },
  { p: "listor", n: "02", t: "Filtrera med animation", i: "🏷️" },
  { p: "listor", n: "03", t: "Ladda fler", i: "➕" },
  { p: "listor", n: "04", t: "Oändlig scroll", i: "♾️" },
  { p: "listor", n: "05", t: "Scroll-snap-rad", i: "🧲" },
  { p: "listor", n: "06", t: "Dra för att sortera", i: "🔀" },
  { p: "listor", n: "07", t: "Tomt läge", i: "🔭" },

  { p: "tillstand", n: "01", t: "Alla knapptillstånd", i: "🚦" },
  { p: "tillstand", n: "02", t: "Fokusringar", i: "⌖" },
  { p: "tillstand", n: "03", t: "Laddningsknapp", i: "🔄" },
  { p: "tillstand", n: "04", t: "Felskakning", i: "🙅" },
  { p: "tillstand", n: "05", t: "Tryckkänsla", i: "👇" },
  { p: "tillstand", n: "06", t: "Inaktiverat läge", i: "🚫" },

  { p: "css", n: "01", t: ":has() — föräldern reagerar", i: "👪" },
  { p: "css", n: "02", t: "Container queries", i: "📦" },
  { p: "css", n: "03", t: "clip-path & morphande former", i: "🫠" },
  { p: "css", n: "04", t: "accent-color", i: "🖌️" },
  { p: "css", n: "05", t: "backdrop-filter-varianter", i: "🥃" },
  { p: "css", n: "06", t: "Egen scrollbar", i: "🛝" },

  { p: "labb", n: "01", t: "WebGL-shader", i: "🌋" },
  { p: "labb", n: "02", t: "Scroll-drivna CSS-animationer", i: "🎬", scroll: true },
  { p: "labb", n: "03", t: "View Transitions API", i: "🪄" },
  { p: "labb", n: "04", t: "Gooey-effekt", i: "🫧" },
  { p: "labb", n: "05", t: "Typografi som reagerar på musen", i: "🎹" },
  { p: "labb", n: "06", t: "Sidövergångar mellan sidor", i: "🚪" }
];
