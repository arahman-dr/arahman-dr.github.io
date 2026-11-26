/* Builds every page from content.js. You do not need to edit this file. */
(function () {
  "use strict";

  /* ------------------------------------------------------------ helpers */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    if (/^(https?:|mailto:|#)/i.test(u)) return u;
    if (/^[\w\-./?=&%#]+$/.test(u) && !/^\/\//.test(u)) return u;
    return "";
  }
  function ext(u) { return /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : ""; }
  function a(url, label, cls) {
    var u = safeUrl(url);
    if (!u) return "";
    return '<a' + (cls ? ' class="' + cls + '"' : "") + ' href="' + esc(u) + '"' + ext(u) + ">" + label + "</a>";
  }
  function list(x) { return (Array.isArray(x) ? x : []).filter(function (i) { return i && !i.hide; }); }
  function has(s) { return s != null && String(s).trim() !== ""; }
  function inline(t) {
    t = esc(t);
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, u) {
      var s = safeUrl(u.replace(/&amp;/g, "&"));
      return s ? '<a href="' + esc(s) + '"' + ext(s) + ">" + label + "</a>" : label;
    });
    return t;
  }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function parseYM(s, isEnd) {
    s = String(s || "").trim().toLowerCase();
    if (!s) return null;
    if (s === "present" || s === "now") { var d = new Date(); return d.getFullYear() + d.getMonth() / 12 + 1 / 24; }
    var m = s.match(/^(\d{4})(?:-(\d{1,2}))?/);
    if (!m) return null;
    var y = +m[1];
    if (m[2]) return y + (+m[2] - 1) / 12 + (isEnd ? 1 / 12 : 0);
    return y + (isEnd ? 0.58 : 0.67); // a bare year is drawn as an academic year (Sep to Jul)
  }
  function fmtYM(s) {
    s = String(s || "").trim();
    if (/^(present|now)$/i.test(s)) return "present";
    var m = s.match(/^(\d{4})-(\d{1,2})$/);
    if (m) return MONTHS[+m[2] - 1] + " " + m[1];
    return s;
  }
  function fmtRange(st, en) {
    var A = fmtYM(st), B = fmtYM(en);
    if (!A) return B;
    if (!B || A === B) return A;
    var ma = String(st).match(/^(\d{4})-\d+$/), mb = String(en).match(/^(\d{4})-\d+$/);
    if (ma && mb && ma[1] === mb[1]) return A.split(" ")[0] + " – " + B;
    return A + " – " + B;
  }
  function el(id) { return document.getElementById(id); }

  /* ------------------------------------------------------------ preview of unsaved edits from edit.html */
  var previewing = false;
  try {
    if (/[?&]preview=1/.test(location.search)) sessionStorage.setItem("preview", "1");
    if (sessionStorage.getItem("preview") === "1" && localStorage.getItem("content-draft")) {
      window.CONTENT = JSON.parse(localStorage.getItem("content-draft"));
      previewing = true;
    }
  } catch (e) {}

  /* ------------------------------------------------------------ guard against typos */
  var C = window.CONTENT;
  var main = el("main");
  if (!C || typeof C !== "object") {
    var err = window.__contentError;
    main.innerHTML = '<div class="typo" role="alert"><h1>The site could not read content.js</h1>' +
      (err ? "<p>There is a typo near <b>line " + esc(err.line) + "</b> of content.js. The browser says: <code>" + esc(err.message) + "</code></p>" :
        "<p>The file content.js is missing or could not be loaded.</p>") +
      "<p>The usual causes are a missing comma between two blocks, a missing closing quote, or a quote mark inside text (write it as \\\"). " +
      "On GitHub, open content.js, click History, and compare with the last version that worked. You can also open edit.html, which checks the file for you.</p></div>";
    return;
  }

  var S = C.site || {};
  var L = S.links || {};
  var P = S.pages || {};
  var page = document.body.getAttribute("data-page") || "index";

  /* ------------------------------------------------------------ icons */
  var IC = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M4 8l8 5.5L20 8"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.7 1.1-2.8 2.5-2.8s2.4 1 2.4 2.8V17"/></svg>',
    orcid: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.6 10v6.5M8.6 7.5v.1M11.6 16.5V8h2.1a4.25 4.25 0 0 1 0 8.5z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 9.5 12 4l9.5 5.5L12 15z"/><path d="M6.5 12v4c1.2 1.6 3.3 2.5 5.5 2.5s4.3-.9 5.5-2.5v-4M21.5 9.5V15"/></svg>',
    researchgate: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 17V8h2.6a2.3 2.3 0 0 1 0 4.6H7.5M10 12.6l2.4 4.4M18 9.4a2.4 2.4 0 0 0-4.2 1.4v2.8a2.4 2.4 0 0 0 4.4 1.2v-1.6h-1.8"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>'
  };
  var PROFILES = [
    ["mail", "Email", S.email ? "mailto:" + S.email : ""],
    ["linkedin", "LinkedIn", L.linkedin], ["orcid", "ORCID", L.orcid],
    ["scholar", "Google Scholar", L.scholar], ["researchgate", "ResearchGate", L.researchgate],
    ["github", "GitHub", L.github]
  ];
  function iconRow(cls) {
    return '<div class="icons ' + (cls || "") + '">' + PROFILES.map(function (p) {
      var u = safeUrl(p[2]);
      return u ? '<a class="ico" href="' + esc(u) + '"' + ext(u) + ' aria-label="' + p[1] + '" title="' + p[1] + '">' + IC[p[0]] + "</a>" : "";
    }).join("") + "</div>";
  }

  /* ------------------------------------------------------------ header and footer */
  var blogPosts = list(C.blog);
  var NAV = [
    ["research", "Research", P.research !== false],
    ["publications", "Publications", P.publications !== false],
    ["experience", "CV", P.cv !== false],
    ["news", "News", P.news !== false],
    ["travel", "Travel", P.travel !== false && list((C.travel || {}).places).length > 0],
    ["blog", "Blog", P.blog !== false && blogPosts.length > 0]
  ].filter(function (n) { return n[2]; });

  el("site-header").innerHTML =
    '<div class="hdr"><a class="brand" href="index.html"' + (page === "index" ? ' aria-current="page"' : "") + ">" + esc(S.name) + "</a>" +
    '<nav class="main" aria-label="Main">' + NAV.map(function (n) {
      return '<a href="' + n[0] + '.html"' + (n[0] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("") + "</nav>" +
    '<div class="hdr-end">' + iconRow("sm") + '<button class="theme" type="button" id="theme-btn"></button></div></div>';

  el("site-footer").innerHTML = '<div class="ftr"><div><p class="ftr-name">' + esc(S.name) + "</p><p>" + esc(S.affiliation) +
    "</p><p>© " + new Date().getFullYear() + "</p></div>" + iconRow("") + "</div>";

  (function theme() {
    var btn = el("theme-btn");
    function current() {
      var t = document.documentElement.getAttribute("data-theme");
      if (t) return t;
      return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function paint() {
      var dark = current() === "dark";
      btn.innerHTML = dark ? IC.sun : IC.moon;
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = btn.getAttribute("aria-label");
    }
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });
    paint();
  })();

  function section(id, title, body, cls) {
    return '<section class="sec ' + (cls || "") + '" id="' + id + '" aria-labelledby="' + id + '-h"><h2 id="' + id + '-h">' + title + '</h2><div class="sec-body">' + body + "</div></section>";
  }
  function pageHead(title, text, extra) {
    return '<header class="page-head"><h1>' + esc(title) + "</h1>" + (has(text) ? "<p>" + esc(text) + "</p>" : "") + (extra || "") + "</header>";
  }
  function chips(items, cls) {
    items = list(items);
    if (!items.length) return "";
    return '<ul class="chips ' + (cls || "") + '">' + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }
  function filterBar(name, values, label) {
    if (values.length < 2) return "";
    return '<div class="filters" role="group" aria-label="' + esc(label) + '" data-filter="' + name + '">' +
      '<button type="button" aria-pressed="true" data-v="">All</button>' +
      values.map(function (v) { return '<button type="button" aria-pressed="false" data-v="' + esc(v) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
  }
  function wireFilter(name, scope) {
    var bar = document.querySelector('[data-filter="' + name + '"]');
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var v = b.getAttribute("data-v");
      document.querySelectorAll(scope).forEach(function (it) {
        it.hidden = !!v && it.getAttribute("data-k") !== v;
      });
    });
  }
  function uniq(arr) {
    var out = [];
    arr.forEach(function (x) { if (has(x) && out.indexOf(x) < 0) out.push(x); });
    return out;
  }

  /* ------------------------------------------------------------ hero: interactive photoswitch */
  function photoswitchFigure() {
    var W = 520, x0 = 46, x1 = 500, top = 26, base = 176;
    function X(nm) { return x0 + (nm - 250) / 450 * (x1 - x0); }
    function g(nm, c, w) { return Math.exp(-Math.pow((nm - c) / w, 2) / 2); }
    function curve(f) {
      var d = "", nm;
      for (nm = 250; nm <= 700; nm += 5) d += (nm === 250 ? "M" : "L") + X(nm).toFixed(1) + "," + (base - f(nm) * 128).toFixed(1);
      return d;
    }
    var closed = function (nm) { return 0.92 * g(nm, 292, 20) + 0.42 * g(nm, 338, 18); };
    var open = function (nm) { return 0.55 * g(nm, 292, 20) + 0.3 * g(nm, 372, 22) + 0.98 * g(nm, 560, 38); };
    var dc = curve(closed), dop = curve(open);
    var areaO = dop + "L" + X(700) + "," + base + "L" + X(250) + "," + base + "Z";
    var ticks = [300, 400, 500, 600, 700].map(function (t) {
      return '<line class="tick" x1="' + X(t) + '" y1="' + base + '" x2="' + X(t) + '" y2="' + (base + 5) + '"/><text class="axl" x="' + X(t) + '" y="' + (base + 19) + '" text-anchor="middle">' + t + "</text>";
    }).join("");
    // visible spectrum strip
    var strip = '<defs><linearGradient id="vis" x1="0" x2="1">' +
      [[0, "#7A4BC9"], [.17, "#3D5BD8"], [.33, "#1FA3B0"], [.5, "#46B04A"], [.67, "#E2C934"], [.83, "#EE8A2E"], [1, "#C8333A"]].map(function (s) {
        return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>';
      }).join("") + '</linearGradient><pattern id="uvp" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" class="uvhatch"/></pattern></defs>' +
      '<rect x="' + X(250) + '" y="' + (base + 26) + '" width="' + (X(400) - X(250)) + '" height="6" fill="url(#uvp)"/>' +
      '<rect x="' + X(400) + '" y="' + (base + 26) + '" width="' + (X(700) - X(400)) + '" height="6" fill="url(#vis)"/>' +
      '<text class="axl" x="' + X(325) + '" y="' + (base + 46) + '" text-anchor="middle">UV</text>' +
      '<text class="axl" x="' + X(550) + '" y="' + (base + 46) + '" text-anchor="middle">visible light, nm</text>';
    // membrane
    var my = 300, pores = [120, 210, 300, 390];
    var mem = '<rect class="m-body" x="40" y="' + my + '" width="460" height="30" rx="3"/>';
    pores.forEach(function (px, i) {
      mem += '<rect class="m-pore" x="' + (px - 9) + '" y="' + my + '" width="18" height="30"/>';
      mem += '<circle class="sw" cx="' + (px - 15) + '" cy="' + (my - 1) + '" r="6"/><circle class="sw" cx="' + (px + 15) + '" cy="' + (my - 1) + '" r="6"/>';
      mem += '<g class="flow"><line x1="' + px + '" y1="' + (my + 36) + '" x2="' + px + '" y2="' + (my + 58) + '"/><path d="M' + (px - 5) + "," + (my + 54) + "l5,8l5,-8" + '"/></g>';
    });
    var beam = '<path class="beam" d="M255 246 L285 246 L500 297 L40 297 Z"/><circle class="lamp" cx="270" cy="243" r="6"/>';
    return '<figure class="ps" id="ps" data-state="closed">' +
      '<svg viewBox="0 0 ' + W + ' 380" role="img" aria-labelledby="ps-title ps-desc"><title id="ps-title">Interactive photoswitch</title>' +
      '<desc id="ps-desc">An absorption spectrum and a membrane. In the closed form the molecule absorbs only ultraviolet light. Ultraviolet light switches it to the coloured open form, which also absorbs green light, and the membrane surface changes with it.</desc>' +
      strip + '<line class="axis" x1="' + x0 + '" y1="' + base + '" x2="' + x1 + '" y2="' + base + '"/>' + ticks +
      '<text class="axl" x="' + x0 + '" y="' + (top - 8) + '">Absorbance</text>' +
      '<path class="sp-area" d="' + areaO + '"/>' +
      '<path class="sp-closed" d="' + dc + '"/><path class="sp-open" d="' + dop + '"/>' +
      '<g class="irr irr-uv"><line x1="' + X(365) + '" y1="' + (top + 4) + '" x2="' + X(365) + '" y2="' + (base - 4) + '"/><text x="' + (X(365) + 6) + '" y="' + (top + 14) + '">365 nm</text></g>' +
      '<g class="irr irr-vis"><line x1="' + X(530) + '" y1="' + (top + 4) + '" x2="' + X(530) + '" y2="' + (base - 4) + '"/><text x="' + (X(530) + 6) + '" y="' + (top + 14) + '">530 nm</text></g>' +
      beam + mem +
      '<text class="axl" x="500" y="' + (my + 52) + '" text-anchor="end">Membrane</text>' +
      "</svg>" +
      '<div class="ps-ctl" role="group" aria-label="Choose the light">' +
      '<button type="button" data-s="open" aria-pressed="false">Shine UV light</button>' +
      '<button type="button" data-s="closed" aria-pressed="true">Shine visible light</button></div>' +
      '<figcaption><span class="ps-state" aria-live="polite"></span> Simplified illustration of a photoswitch such as spiropyran: the switch is the handle that lets light change a membrane.</figcaption></figure>';
  }
  function wirePhotoswitch() {
    var f = el("ps");
    if (!f) return;
    var txt = {
      closed: "Closed form: colourless, absorbs only UV.",
      open: "Open form: coloured, now absorbs green light too."
    };
    var btns = f.querySelectorAll(".ps-ctl button"), auto = null;
    function set(s) {
      f.setAttribute("data-state", s);
      btns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-s") === s ? "true" : "false"); });
      f.querySelector(".ps-state").textContent = txt[s];
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { if (auto) { clearInterval(auto); auto = null; } set(b.getAttribute("data-s")); });
    });
    set("closed");
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm) {
      var n = 0;
      auto = setInterval(function () {
        set(f.getAttribute("data-state") === "closed" ? "open" : "closed");
        if (++n >= 6 && auto) { clearInterval(auto); auto = null; }
      }, 3800);
    }
  }

  /* ------------------------------------------------------------ map */
  function mapFigure() {
    var M = window.MAP_DATA, places = list(C.places);
    if (!M || !places.length) return "";
    var E = M.europe, I = M.inset, gap = 28, ix = E.w + gap, W = E.w + gap + I.w;
    function proj(m, lat, lng) {
      var r = Math.PI / 180;
      return [m.tx + m.k * lng * r, m.ty - m.k * Math.log(Math.tan(Math.PI / 4 + lat * r / 2))];
    }
    var pts = places.map(function (p, i) {
      var lat = +p.lat, lng = +p.lng, xy, where = null;
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;
      xy = proj(E, lat, lng);
      if (xy[0] >= 0 && xy[0] <= E.w && xy[1] >= 0 && xy[1] <= E.h) where = "e";
      else { xy = proj(I, lat, lng); if (xy[0] >= 0 && xy[0] <= I.w && xy[1] >= 0 && xy[1] <= I.h) { where = "i"; xy[0] += ix; } }
      return where ? { p: p, i: i, x: xy[0], y: xy[1], where: where } : null;
    }).filter(Boolean);
    // simple label side choice: push label left if a neighbour sits to the right
    pts.forEach(function (a) {
      var side = a.p.label || "right";
      if (!a.p.label) pts.forEach(function (b) {
        if (b !== a && b.x > a.x && b.x - a.x < 110 && Math.abs(b.y - a.y) < 22 && b.i < a.i) side = "left";
      });
      if (a.where === "i") side = "below";
      a.side = side;
    });
    var arc = "";
    var home = pts.filter(function (q) { return q.where === "i"; })[0];
    var first = pts.filter(function (q) { return q.where === "e"; })[0];
    var svg = '<svg class="map" viewBox="0 0 ' + W + " " + E.h + '" role="img" aria-label="Map of the places listed below">' +
      '<rect class="sea" x="0" y="0" width="' + E.w + '" height="' + E.h + '"/>' +
      '<path class="land" d="' + E.land + '"/><path class="borders" d="' + E.borders + '"/>' +
      '<g transform="translate(' + ix + ',' + (E.h - I.h) + ')"><rect class="sea" width="' + I.w + '" height="' + I.h + '"/>' +
      '<path class="land" d="' + I.land + '"/><path class="borders" d="' + I.borders + '"/><path class="land-hi" d="' + (I.hi || "") + '"/>' +
      '<rect class="frame" width="' + I.w + '" height="' + I.h + '"/></g>' +
      '<rect class="frame" width="' + E.w + '" height="' + E.h + '"/>';
    pts.forEach(function (q) { if (q.where === "i") q.y += E.h - I.h; });
    if (home && first) {
      var mx2 = (home.x + first.x) / 2, my2 = Math.min(home.y, first.y) - 140;
      arc = '<path class="map-arc" d="M' + home.x.toFixed(1) + "," + home.y.toFixed(1) + " Q" + mx2.toFixed(1) + "," + my2.toFixed(1) + " " + first.x.toFixed(1) + "," + first.y.toFixed(1) + '"/>';
    }
    svg += arc;
    pts.forEach(function (q) {
      var tx = q.x + 11, ty = q.y + 5, anchor = "start";
      if (q.side === "left") { tx = q.x - 11; anchor = "end"; }
      if (q.side === "below") { tx = q.x; ty = q.y + 24; anchor = "middle"; }
      if (q.side === "above") { tx = q.x; ty = q.y - 13; anchor = "middle"; }
      svg += '<g class="pt' + (q.p.upcoming ? " soon" : "") + '" data-i="' + q.i + '" tabindex="0" role="button" aria-label="' + esc(q.p.city + ", " + q.p.what) + '">' +
        '<circle class="halo" cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="14"/>' +
        '<circle class="dot" cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="6"/>' +
        '<text class="lbl" x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="' + anchor + '">' + esc(q.p.city) + "</text></g>";
    });
    svg += '<text class="inset-lbl" x="' + (ix + I.w / 2) + '" y="' + (E.h - I.h - 12) + '" text-anchor="middle">Bangladesh</text></svg>';
    var items = places.map(function (p, i) {
      return '<li data-i="' + i + '"' + (p.upcoming ? ' class="soon"' : "") + '><span class="pl-city">' + esc(p.city) + (has(p.country) ? ", " + esc(p.country) : "") +
        '</span><span class="pl-years">' + esc(p.years) + (p.upcoming ? " (planned)" : "") + '</span><span class="pl-what">' + esc(p.what) + "</span></li>";
    }).join("");
    return '<div class="map-wrap">' + svg + '<ol class="places">' + items + "</ol></div>";
  }
  function wireMap() {
    var wrap = document.querySelector(".map-wrap");
    if (!wrap) return;
    function on(i, v) {
      wrap.querySelectorAll('[data-i="' + i + '"]').forEach(function (n) { n.classList.toggle("on", v); });
    }
    wrap.addEventListener("mouseover", function (e) { var t = e.target.closest("[data-i]"); if (t) on(t.getAttribute("data-i"), true); });
    wrap.addEventListener("mouseout", function (e) { var t = e.target.closest("[data-i]"); if (t) on(t.getAttribute("data-i"), false); });
    wrap.addEventListener("focusin", function (e) { var t = e.target.closest("[data-i]"); if (t) on(t.getAttribute("data-i"), true); });
    wrap.addEventListener("focusout", function (e) { var t = e.target.closest("[data-i]"); if (t) on(t.getAttribute("data-i"), false); });
  }

  /* ------------------------------------------------------------ shared item renderers */
  function newsItem(n) {
    var h = '<article class="news" data-k="' + esc(n.type || "") + '">';
    h += '<p class="news-when">' + (has(n.date) ? esc(n.date) : "") + "</p><div>";
    if (has(n.type)) h += '<p class="kind kind-' + esc(String(n.type).toLowerCase()) + '">' + esc(n.type) + "</p>";
    h += "<h3>" + esc(n.title) + "</h3>";
    if (has(n.place) || has(n.role)) h += '<p class="where">' + esc([n.place, n.role].filter(has).join(", ")) + "</p>";
    if (has(n.award)) h += '<p class="award">' + esc(n.award) + "</p>";
    if (has(n.text)) h += "<p>" + inline(n.text) + "</p>";
    var emb = String(n.embed || "");
    if (/^https:\/\/www\.linkedin\.com\/embed\//.test(emb)) h += '<div class="embed"><iframe src="' + esc(emb) + '" height="' + esc(n.height || 560) + '" title="LinkedIn post" loading="lazy"></iframe></div>';
    var ph = list(n.photos);
    if (ph.length) h += '<div class="gallery">' + ph.map(function (p) {
      var s = safeUrl(p.src);
      return s ? '<a href="' + esc(s) + '" target="_blank" rel="noopener"><img src="' + esc(s) + '" alt="' + esc(p.alt || n.title) + '" loading="lazy"></a>' : "";
    }).join("") + "</div>";
    var ln = list(n.links);
    if (ln.length) h += '<p class="links-inline">' + ln.map(function (l) { return a(l.url, esc(l.label || "Link")); }).join("") + "</p>";
    return h + "</div></article>";
  }
  function authorLine(s) {
    var me = C.myAuthorName, t = esc(s);
    if (has(me)) t = t.split(esc(me)).join("<b>" + esc(me) + "</b>");
    return t;
  }

  /* ------------------------------------------------------------ pages */
  var R = {};

  R.index = function () {
    var H = C.home || {};
    var photo = has(S.photo) ? '<img class="portrait" src="' + esc(safeUrl(S.photo)) + '" alt="Portrait of ' + esc(S.name) + '">' : "";
    var h = '<div class="hero"><div class="hero-text">' + photo +
      '<h1 class="name">' + esc(S.name) + "</h1>" +
      '<p class="lede">' + esc(H.lede) + "</p>" +
      '<p class="sub">' + esc(H.intro) + "</p>" +
      '<div class="btns">' + (P.research !== false ? a("research.html", "My research", "btn primary") : "") +
      (P.cv !== false ? a("experience.html", "CV", "btn") : "") + (S.email ? a("mailto:" + S.email, "Email me", "btn") : "") + "</div>" +
      "</div>" + photoswitchFigure() + "</div>";

    var about = list(H.about).map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("");
    if (about) h += section("about", "About", '<div class="prose">' + about + "</div>");

    var hl = list(H.highlights);
    if (hl.length) h += section("highlights", "Highlights", '<div class="hl">' + hl.map(function (x) {
      var t = esc(x.title);
      if (safeUrl(x.link)) t = '<a href="' + esc(safeUrl(x.link)) + '"' + ext(x.link) + ">" + t + "</a>";
      return '<div class="hl-item"><h3>' + t + "</h3><p>" + inline(x.text) + "</p></div>";
    }).join("") + "</div>");

    if (H.showMap !== false) {
      var m = mapFigure();
      if (m) h += section("map", "Where I have studied and worked", m, "wide");
    }

    var nn = list(C.news).slice(0, H.latestNews == null ? 3 : +H.latestNews);
    if (nn.length && P.news !== false) h += section("latest", "Latest news", nn.map(newsItem).join("") + '<p class="more">' + a("news.html", "All news and events") + "</p>");

    var TR = C.travel || {}, trp = list(TR.places);
    if (P.travel !== false && trp.length && TR.showOnHome !== false) {
      var ts = travelStats(trp);
      h += section("beyond", "Beyond the lab", '<p class="beyond">' + esc(TR.teaser || "I love to travel.") + " So far: " +
        plural(ts.nCities, "city", "cities") + " in " + plural(ts.nCountries, "country", "countries") + ".</p>" +
        '<p class="more">' + a("travel.html", "See where I have been") + "</p>");
    }
    h += section("contact", "Contact", '<p class="big-mail">' + a("mailto:" + S.email, esc(S.email)) + "</p>" + iconRow("lg"));
    main.innerHTML = h;
    wirePhotoswitch();
    wireMap();
  };

  R.research = function () {
    var RS = C.research || {}, cur = RS.current || {};
    var h = pageHead("Research", RS.intro);
    if (has(cur.title)) {
      h += section("current", "Current", '<h3 class="big">' + esc(cur.title) + "</h3>" +
        (has(cur.where) ? '<p class="where">' + esc(cur.where) + "</p>" : "") +
        '<div class="cur-grid"><div class="prose">' + list(cur.paragraphs).map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("") +
        (cur.link && safeUrl(cur.link.url) ? '<p class="links-inline">' + a(cur.link.url, esc(cur.link.label || "Project website")) + "</p>" : "") +
        "</div>" + jablonski() + "</div>" +
        (list(cur.keywords).length ? '<h4 class="minor">Keywords</h4>' + chips(cur.keywords) : ""));
    }
    var ear = list(RS.earlier);
    if (ear.length) {
      var fields = uniq(ear.map(function (e) { return e.field; }));
      h += section("earlier", "Earlier projects", filterBar("field", fields, "Filter projects by field") +
        '<div class="proj">' + ear.map(function (e) {
          return '<article class="proj-item" data-k="' + esc(e.field || "") + '"><h3>' + esc(e.title) + "</h3>" +
            (has(e.where) ? '<p class="where">' + esc(e.where) + "</p>" : "") + "<p>" + inline(e.text) + "</p>" +
            (has(e.field) ? '<p class="field">' + esc(e.field) + "</p>" : "") + "</article>";
        }).join("") + "</div>");
    }
    main.innerHTML = h;
    wireFilter("field", ".proj-item");
  };

  function jablonski() {
    return '<figure class="jab"><svg viewBox="0 0 400 252" role="img" aria-label="Diagram: light lifts a molecule from its ground state S0 to an excited state S1, and the excited molecule opens a gate in a membrane so small ions pass while large ions are held back">' +
      '<line class="lvl" x1="30" y1="62" x2="130" y2="62"/><line class="lvl" x1="30" y1="190" x2="130" y2="190"/>' +
      '<text x="4" y="66">S₁</text><text x="4" y="194">S₀</text>' +
      '<g class="up"><path class="photon" d="M60 188 q8 -9 0 -18 t0 -18 t0 -18 t0 -18 t0 -18 t0 -18 t0 -18"/><polygon class="head" points="54,70 60,58 66,70"/><text class="hv" x="70" y="128">hν</text></g>' +
      '<g class="down"><line class="decay" x1="108" y1="72" x2="108" y2="176"/><polygon class="dhead" points="102,176 108,188 114,176"/></g>' +
      '<circle class="e" cx="60" cy="190" r="6"/><path class="link" d="M132 62 C190 62 228 84 262 112"/>' +
      '<rect class="wall" x="260" y="20" width="18" height="90" rx="3"/><rect class="wall" x="260" y="140" width="18" height="90" rx="3"/>' +
      '<rect class="flap ftop" x="262" y="110" width="14" height="15"/><rect class="flap fbot" x="262" y="125" width="14" height="15"/>' +
      '<circle class="k k1" cx="215" cy="116" r="5"/><circle class="k k2" cx="215" cy="125" r="5"/><circle class="k k3" cx="215" cy="134" r="5"/>' +
      '<circle class="na n1" cx="215" cy="75" r="9"/><circle class="na n2" cx="215" cy="175" r="9"/>' +
      '<text x="4" y="246">Photophysics</text><text x="214" y="246">Membrane separation</text></svg>' +
      "<figcaption>Two fields, one system: light excites a photoresponsive material, and the excited material changes what the membrane lets through.</figcaption></figure>";
  }

  R.publications = function () {
    var pubs = list(C.publications), talks = list(C.talks);
    var prof = '<div class="btns">' + a(L.scholar, "Google Scholar", "btn") + a(L.orcid, "ORCID", "btn") + a(L.researchgate, "ResearchGate", "btn") + "</div>";
    var h = pageHead("Publications", "The full, up-to-date list is on my profiles.", prof);
    if (pubs.length) {
      var types = uniq(pubs.map(function (p) { return p.type; }));
      var lastYear = null;
      h += section("papers", "Articles", filterBar("ptype", types, "Filter by type") + '<div class="pubs">' + pubs.map(function (p, i) {
        var yr = "";
        if (p.year !== lastYear) { yr = '<p class="yr">' + esc(p.year) + "</p>"; lastYear = p.year; }
        return yr + '<article class="pub" data-k="' + esc(p.type || "") + '"><h3>' + (safeUrl(p.doi) ? a(p.doi, esc(p.title)) : esc(p.title)) + "</h3>" +
          '<p class="authors">' + authorLine(p.authors) + "</p>" +
          '<p class="venue"><i>' + esc(p.venue) + "</i>" + (has(p.year) ? ", " + esc(p.year) : "") + (has(p.type) ? '<span class="ptype">' + esc(p.type) + "</span>" : "") + "</p>" +
          (has(p.summary) ? '<p class="sum">' + inline(p.summary) + "</p>" : "") +
          '<p class="links-inline">' + a(p.doi, "DOI") + a(p.pdf, "PDF") +
          '<button type="button" class="linkbtn" data-cite="' + i + '">Copy citation</button></p></article>';
      }).join("") + "</div>");
    } else {
      h += section("papers", "Articles", '<p class="note">Publications will appear here.</p>');
    }
    if (talks.length) {
      h += section("talks", "Talks and posters", talks.map(function (t) {
        return '<article class="pub"><h3>' + (safeUrl(t.link) ? a(t.link, esc(t.title)) : esc(t.title)) + "</h3>" +
          '<p class="venue">' + esc([t.kind, t.event, t.place, t.date].filter(has).join(", ")) + "</p></article>";
      }).join(""));
    }
    main.innerHTML = h;
    wireFilter("ptype", ".pub[data-k]");
    main.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cite]");
      if (!b) return;
      var p = pubs[+b.getAttribute("data-cite")];
      var doi = String(p.doi || "").replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
      var txt = p.authors + " (" + p.year + "). " + p.title + ". " + p.venue + "." + (doi ? " https://doi.org/" + doi : "");
      function done(ok) { b.textContent = ok ? "Copied" : "Copy failed"; setTimeout(function () { b.textContent = "Copy citation"; }, 1800); }
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  };

  R.experience = function () {
    var ex = list(C.experience), ed = list(C.education);
    var tools = '<div class="btns">' + a(S.cvFile, "Download CV (PDF)", "btn primary") +
      '<button type="button" class="btn" id="print-btn">Print or save this page as PDF</button></div>';
    var h = pageHead("CV", "Research experience, education, awards and skills.", tools);
    h += section("glance", "At a glance", timelineChart(ex, ed), "wide");
    function entry(x, kind) {
      var title = kind === "edu" ? x.degree : x.role;
      return '<article class="cv-item' + (x.upcoming ? " soon" : "") + '" id="' + kind + "-" + slug(title + x.start) + '">' +
        '<p class="cv-when">' + esc(fmtRange(x.start, x.end)) + (x.upcoming ? '<span class="planned">planned</span>' : "") + "</p><div>" +
        "<h3>" + esc(title) + "</h3>" +
        '<p class="where">' + esc(x.org) + (has(x.place) ? "<br>" + esc(x.place) : "") + "</p>" +
        (has(x.text) ? "<p>" + inline(x.text) + "</p>" : "") + chips(x.methods, "sm") + "</div></article>";
    }
    if (ex.length) h += section("experience", "Research experience", ex.map(function (x) { return entry(x, "exp"); }).join(""));
    if (ed.length) h += section("education", "Education", ed.map(function (x) { return entry(x, "edu"); }).join(""));
    var aw = list(C.awards);
    if (aw.length) h += section("awards", "Awards", '<ul class="rows">' + aw.map(function (x) {
      return '<li><span class="rows-k">' + esc(x.year) + "</span><span><b>" + esc(x.title) + "</b>" + (has(x.text) ? " " + inline(x.text) : "") + "</span></li>";
    }).join("") + "</ul>");
    var ro = list(C.roles);
    if (ro.length) h += section("roles", "Roles and service", '<ul class="rows">' + ro.map(function (x) {
      return '<li><span class="rows-k">' + esc(x.years) + "</span><span><b>" + esc(x.title) + "</b>" + (has(x.org) ? ", " + esc(x.org) : "") + (has(x.text) ? ". " + inline(x.text) : "") + "</span></li>";
    }).join("") + "</ul>");
    var sk = list(C.skills);
    if (sk.length) h += section("skills", "Skills", '<div class="skills">' + sk.map(function (g) {
      return '<div><h3 class="minor">' + esc(g.group) + "</h3>" + chips(g.items) + "</div>";
    }).join("") + "</div>");
    var lg = list(C.languages);
    if (lg.length) h += section("languages", "Languages", '<ul class="rows">' + lg.map(function (x) {
      return '<li><span class="rows-k">' + esc(x.level) + "</span><span><b>" + esc(x.name) + "</b></span></li>";
    }).join("") + "</ul>");
    main.innerHTML = h;
    var pb = el("print-btn");
    if (pb) pb.addEventListener("click", function () { window.print(); });
  };
  function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }

  function timelineChart(ex, ed) {
    var rows = [];
    function add(arr, lane, kind) {
      arr.forEach(function (x) {
        var s = parseYM(x.start, false), e = parseYM(x.end || x.start, true);
        if (s == null || e == null) return;
        rows.push({ lane: lane, kind: kind, s: s, e: e, x: x, title: kind === "edu" ? x.degree : x.role });
      });
    }
    add(ed, 0, "edu"); add(ex, 1, "exp");
    if (!rows.length) return "";
    var minY = Math.floor(Math.min.apply(null, rows.map(function (r) { return r.s; })));
    var maxY = Math.ceil(Math.max.apply(null, rows.map(function (r) { return r.e; })));
    var W = 1000, left = 118, right = 16, rowH = 26, laneGap = 26;
    function X(v) { return left + (v - minY) / (maxY - minY) * (W - left - right); }
    // pack each lane into sub-rows
    var laneRows = [[], []];
    rows.sort(function (a, b) { return a.s - b.s; }).forEach(function (r) {
      var subs = laneRows[r.lane], k = 0;
      while (subs[k] && subs[k].some(function (o) { return !(r.e <= o.s + 0.001 || r.s >= o.e - 0.001); })) k++;
      (subs[k] = subs[k] || []).push(r);
      r.sub = k;
    });
    var y = 34, laneY = [], svg = "";
    [0, 1].forEach(function (ln) {
      laneY[ln] = y;
      y += Math.max(1, laneRows[ln].length) * rowH + laneGap;
    });
    var H = y + 6;
    for (var yr = minY; yr <= maxY; yr++) {
      svg += '<line class="grid" x1="' + X(yr) + '" y1="22" x2="' + X(yr) + '" y2="' + (H - 18) + '"/>';
      if (yr < maxY) svg += '<text class="yrl" x="' + (X(yr) + 4) + '" y="16">' + yr + "</text>";
    }
    var now = parseYM("present");
    if (now > minY && now < maxY) svg += '<line class="now" x1="' + X(now) + '" y1="22" x2="' + X(now) + '" y2="' + (H - 18) + '"/><text class="nowl" x="' + (X(now) + 4) + '" y="' + (H - 6) + '">today</text>';
    ["Education", "Research"].forEach(function (nm, ln) {
      svg += '<text class="lane" x="0" y="' + (laneY[ln] + 17) + '">' + nm + "</text>";
    });
    rows.forEach(function (r) {
      var x1 = X(r.s), x2 = Math.max(X(r.e), x1 + 8), yy = laneY[r.lane] + r.sub * rowH;
      var id = (r.kind === "edu" ? "edu-" : "exp-") + slug(r.title + r.x.start);
      var label = r.title, room = x2 - x1 - 12;
      var short = label.length * 7 > room ? (room > 60 ? label.slice(0, Math.floor(room / 7) - 1) + "…" : "") : label;
      svg += '<a href="#' + id + '" class="bar ' + r.kind + (r.x.upcoming ? " soon" : "") + '"><title>' + esc(r.title + ", " + fmtRange(r.x.start, r.x.end)) + "</title>" +
        '<rect x="' + x1.toFixed(1) + '" y="' + yy + '" width="' + (x2 - x1).toFixed(1) + '" height="' + (rowH - 6) + '" rx="3"/>' +
        (short ? '<text x="' + (x1 + 6).toFixed(1) + '" y="' + (yy + 14.5) + '">' + esc(short) + "</text>" : "") + "</a>";
    });
    return '<div class="tl-scroll"><svg class="tl" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Timeline of education and research positions from ' + minY + " to " + maxY + '">' + svg + "</svg></div>" +
      '<p class="tl-note">Each bar is one position, listed in detail below. Select a bar to jump to it.</p>';
  }

  R.news = function () {
    var nn = list(C.news);
    var h = pageHead("News and events", "Conferences, summer schools, awards and other news, newest first.",
      L.linkedin ? '<div class="btns">' + a(L.linkedin, "Follow me on LinkedIn", "btn") + "</div>" : "");
    var types = uniq(nn.map(function (n) { return n.type; }));
    h += section("all", "All updates", filterBar("ntype", types, "Filter by kind") + (nn.length ? nn.map(newsItem).join("") : '<p class="note">News will appear here.</p>'));
    main.innerHTML = h;
    wireFilter("ntype", ".news");
  };

  /* ------------------------------------------------------------ blog */
  var ANIM = {
    "foulant-cleaning": {
      caption: "Light-triggered foulant cleaning. Simplified illustration, not to scale; it shows the effect, not a specific mechanism.",
      svg: '<svg class="fc" viewBox="0 -12 640 302" role="img" aria-label="Animation: foulant builds up on a membrane surface and permeate flow weakens; light is switched on, the foulant lifts off and is carried away, and permeate flow recovers">' +
        '<polygon class="fc-light" points="300,34 340,34 604,186 36,186"/><circle class="fc-lamp" cx="320" cy="24" r="10"/>' +
        '<g class="fc-rays"><line x1="320" y1="4" x2="320" y2="-2"/><line x1="300" y1="10" x2="295" y2="5"/><line x1="340" y1="10" x2="345" y2="5"/></g>' +
        '<rect class="fc-mem" x="40" y="190" width="560" height="26" rx="4"/>' +
        '<g class="fc-pores">' + [80, 140, 200, 260, 320, 380, 440, 500, 560].map(function (x) { return '<rect x="' + x + '" y="190" width="12" height="26"/>'; }).join("") + "</g>" +
        '<line class="fc-glow" x1="40" y1="189" x2="600" y2="189"/>' +
        '<g class="fc-perm">' + [86, 146, 206, 266, 326, 386, 446, 506, 566].map(function (x) { return '<g><line x1="' + x + '" y1="224" x2="' + x + '" y2="254"/><polygon points="' + (x - 5) + ",252 " + x + ",262 " + (x + 5) + ',252"/></g>'; }).join("") + "</g>" +
        '<circle class="fo fa" cx="95" cy="181" r="9"/><circle class="fo fa" cx="255" cy="180" r="10"/><circle class="fo fa" cx="415" cy="182" r="8"/>' +
        '<circle class="fo fb" cx="175" cy="182" r="8"/><circle class="fo fb" cx="335" cy="181" r="9"/><circle class="fo fb" cx="495" cy="180" r="10"/>' +
        '<circle class="fo fc3" cx="135" cy="183" r="7"/><circle class="fo fc3" cx="295" cy="182" r="8"/><circle class="fo fc3" cx="455" cy="183" r="7"/><circle class="fo fc3" cx="555" cy="181" r="9"/>' +
        '<text class="fc-lab" x="44" y="62">Feed</text><text class="fc-lab" x="44" y="282">Permeate</text>' +
        '<text class="fc-st t1" x="600" y="62" text-anchor="end">Foulant builds up, flow drops</text>' +
        '<text class="fc-st t2" x="600" y="62" text-anchor="end">Light on: foulant is released</text>' +
        '<text class="fc-st t3" x="600" y="62" text-anchor="end">Clean surface, flow restored</text></svg>'
    }
  };
  function bodyHTML(b) {
    return String(b || "").trim().split(/\n\s*\n/).map(function (blk) {
      blk = blk.trim();
      var m;
      if ((m = blk.match(/^### (.+)$/))) return "<h3>" + inline(m[1]) + "</h3>";
      if ((m = blk.match(/^## (.+)$/))) return "<h2>" + inline(m[1]) + "</h2>";
      if ((m = blk.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)) && safeUrl(m[2])) {
        return '<figure><img src="' + esc(safeUrl(m[2])) + '" alt="' + esc(m[1]) + '" loading="lazy">' + (m[1] ? "<figcaption>" + esc(m[1]) + "</figcaption>" : "") + "</figure>";
      }
      if ((m = blk.match(/^\[\[animation:([\w-]+)\]\]$/)) && ANIM[m[1]]) {
        return '<figure class="anim">' + ANIM[m[1]].svg + "<figcaption>" + esc(ANIM[m[1]].caption) + "</figcaption></figure>";
      }
      var lines = blk.split("\n");
      if (lines.every(function (l) { return /^- /.test(l.trim()); })) {
        return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.trim().slice(2)) + "</li>"; }).join("") + "</ul>";
      }
      return "<p>" + lines.map(function (l) { return inline(l.trim()); }).join(" ") + "</p>";
    }).join("");
  }
  R.blog = function () {
    var want = new URLSearchParams(location.search).get("post") || decodeURIComponent(location.hash.slice(1)), one = null;
    blogPosts.forEach(function (p) { if (p.id === want) one = p; });
    if (one) {
      document.title = one.title + " · " + S.name;
      main.innerHTML = '<article class="article"><p class="where">' + esc(one.date) + "</p><h1>" + esc(one.title) + "</h1>" + bodyHTML(one.body) +
        '<p class="more"><a href="blog.html">All posts</a></p></article>';
      window.scrollTo(0, 0);
      return;
    }
    var h = pageHead("Blog", "Notes from my research.");
    h += section("posts", "Posts", blogPosts.length ? blogPosts.map(function (p) {
      return '<article class="news"><p class="news-when">' + esc(p.date) + '</p><div><h3><a href="blog.html#' + encodeURIComponent(p.id) + '">' + esc(p.title) + "</a></h3><p>" + inline(p.summary) + "</p></div></article>";
    }).join("") : '<p class="note">The first post is coming soon.</p>');
    main.innerHTML = h;
  };
  if (page === "blog") window.addEventListener("hashchange", function () { R.blog(); });

  /* ------------------------------------------------------------ travel */
  var ALIAS = {
    "usa": "United States of America", "us": "United States of America", "united states": "United States of America", "america": "United States of America",
    "uk": "United Kingdom", "england": "United Kingdom", "scotland": "United Kingdom", "wales": "United Kingdom", "great britain": "United Kingdom", "northern ireland": "United Kingdom",
    "czech republic": "Czechia", "north macedonia": "Macedonia", "bosnia and herzegovina": "Bosnia and Herz.", "dominican republic": "Dominican Rep.",
    "dr congo": "Dem. Rep. Congo", "democratic republic of the congo": "Dem. Rep. Congo", "ivory coast": "Côte d'Ivoire", "turkiye": "Turkey", "türkiye": "Turkey",
    "holland": "Netherlands", "the netherlands": "Netherlands", "swaziland": "eSwatini", "south sudan": "S. Sudan", "central african republic": "Central African Rep.",
    "korea": "South Korea", "republic of korea": "South Korea", "uae": "United Arab Emirates", "russian federation": "Russia", "viet nam": "Vietnam", "burma": "Myanmar"
  };
  function countryKey(c) { var k = String(c || "").trim().toLowerCase(); return (ALIAS[k] || String(c || "").trim()).toLowerCase(); }

  function travelStats(pl) {
    var cs = uniq(pl.map(function (p) { return String(p.country || "").trim(); }));
    var cities = uniq(pl.map(function (p) { return (String(p.city || "").trim() + "|" + countryKey(p.country)).toLowerCase(); }));
    return { countries: cs, nCountries: uniq(pl.map(function (p) { return countryKey(p.country); })).length, nCities: cities.length };
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  R.travel = function () {
    var T = C.travel || {}, pl = list(T.places), st = travelStats(pl);
    var h = pageHead(T.title || "Travel", T.intro);
    h += '<p class="tr-count">' + plural(st.nCities, "city", "cities") + " in " + plural(st.nCountries, "country", "countries") + " so far.</p>";
    h += section("tr-map", "Map", worldMap(pl), "wide");
    // group by country, in the order they first appear
    var groups = [], idx = {};
    pl.forEach(function (p) {
      var k = countryKey(p.country);
      if (!(k in idx)) { idx[k] = groups.length; groups.push({ name: p.country || "Other", items: [] }); }
      groups[idx[k]].items.push(p);
    });
    h += section("tr-list", "Places", '<div class="tr-groups">' + groups.map(function (g) {
      return '<div class="tr-group"><h3>' + esc(g.name) + ' <span class="tr-n">' + plural(g.items.length, "city", "cities") + "</span></h3><ul>" +
        g.items.map(function (p) {
          var i = pl.indexOf(p), ph = list(p.photos);
          return '<li data-i="' + i + '"><span class="tr-city">' + esc(p.city) + "</span>" + (has(p.year) ? '<span class="tr-year">' + esc(p.year) + "</span>" : "") +
            (has(p.note) ? '<p class="tr-note">' + inline(p.note) + "</p>" : "") +
            (ph.length ? '<div class="gallery sm">' + ph.map(function (q) {
              var u = safeUrl(q.src);
              return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener"><img src="' + esc(u) + '" alt="' + esc(q.alt || p.city) + '" loading="lazy"></a>' : "";
            }).join("") + "</div>" : "") + "</li>";
        }).join("") + "</ul></div>";
    }).join("") + "</div>");
    main.innerHTML = h;
    wireWorld();
  };

  function worldMap(pl) {
    var M = window.WORLD_DATA;
    if (!M) return "";
    var visited = {};
    pl.forEach(function (p) { visited[countryKey(p.country)] = true; });
    var r = Math.PI / 180;
    var land = M.countries.map(function (c) {
      return '<path class="ct' + (visited[c.n.toLowerCase()] ? " been" : "") + '" d="' + c.d + '"><title>' + esc(c.n) + "</title></path>";
    }).join("");
    var pins = pl.map(function (p, i) {
      var lat = +p.lat, lng = +p.lng;
      if (!has(p.lat) || !has(p.lng) || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return "";
      var lam = ((lng - (M.lon0 || 0)) % 360 + 540) % 360 - 180;
      var x = M.tx + M.k * lam * r, y = M.ty - M.k * Math.log(Math.tan(Math.PI / 4 + lat * r / 2));
      return '<g class="pin" data-i="' + i + '" transform="translate(' + x.toFixed(1) + "," + y.toFixed(1) + ')" tabindex="0" role="img" aria-label="' + esc(p.city + ", " + p.country) + '"><g class="pin-s">' +
        '<circle class="halo" r="9"/><circle class="dot" r="3.6"/><text class="lbl" x="7" y="3.5">' + esc(p.city) + "</text></g></g>";
    }).join("");
    var views = '<div class="filters" role="group" aria-label="Zoom the map">' +
      [["world", "World"], ["europe", "Europe"], ["asia", "Asia"]].map(function (v, i) {
        return '<button type="button" data-view="' + v[0] + '" aria-pressed="' + (i === 0) + '">' + v[1] + "</button>";
      }).join("") + "</div>";
    return views + '<svg class="world" id="world" viewBox="0 0 ' + M.w + " " + M.h + '" role="img" aria-label="World map. Visited countries are shaded and each city is a dot.">' +
      '<rect class="sea" width="' + M.w + '" height="' + M.h + '"/>' + land + pins + "</svg>" +
      '<p class="tl-note">Shaded: countries I have visited. Hover or tab to a dot to see the city.</p>';
  }
  function wireWorld() {
    var svg = el("world"), M = window.WORLD_DATA;
    if (!svg || !M) return;
    var cur = M.views.world.slice(), anim = null;
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function fit(v) { // match the 5:3 frame
      var ar = M.w / M.h, w = v[2], hh = v[3];
      if (w / hh < ar) { var nw = hh * ar; return [v[0] - (nw - w) / 2, v[1], nw, hh]; }
      var nh = w / ar; return [v[0], v[1] - (nh - hh) / 2, w, nh];
    }
    function apply(v) {
      svg.setAttribute("viewBox", v.map(function (n) { return n.toFixed(2); }).join(" "));
      svg.style.setProperty("--s", (v[2] / M.w).toFixed(4));
    }
    function go(name) {
      var to = fit(M.views[name] || M.views.world), from = cur.slice(), t0 = null;
      if (anim) cancelAnimationFrame(anim);
      if (calm) { cur = to; apply(cur); return; }
      function step(ts) {
        if (t0 == null) t0 = ts;
        var t = Math.min(1, (ts - t0) / 650), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        cur = from.map(function (f, i) { return f + (to[i] - f) * e; });
        apply(cur);
        if (t < 1) anim = requestAnimationFrame(step);
      }
      anim = requestAnimationFrame(step);
    }
    apply(cur);
    document.querySelector('[data-view]').parentNode.addEventListener("click", function (e) {
      var b = e.target.closest("[data-view]");
      if (!b) return;
      b.parentNode.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      go(b.getAttribute("data-view"));
    });
    var wrap = main;
    function on(i, v) { wrap.querySelectorAll('[data-i="' + i + '"]').forEach(function (n) { n.classList.toggle("on", v); }); }
    ["mouseover", "focusin"].forEach(function (ev) { wrap.addEventListener(ev, function (e) { var t = e.target.closest("[data-i]"); if (t) on(t.getAttribute("data-i"), true); }); });
    ["mouseout", "focusout"].forEach(function (ev) { wrap.addEventListener(ev, function (e) { var t = e.target.closest("[data-i]"); if (t) on(t.getAttribute("data-i"), false); }); });
  }

  (R[page] || R.index)();

  if (previewing) {
    var bar = document.createElement("div");
    bar.className = "preview-bar";
    bar.innerHTML = "<span>Preview of your unsaved edits. Visitors still see the published version.</span>" +
      '<a href="edit.html">Back to the editor</a><button type="button">Leave preview</button>';
    bar.querySelector("button").addEventListener("click", function () {
      try { sessionStorage.removeItem("preview"); } catch (e) {}
      location.href = location.pathname;
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }
})();
