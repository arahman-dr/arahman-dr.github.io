/* The form editor behind edit.html. It reads content.js and writes a new one. */
(function () {
  "use strict";
  var DRAFT_KEY = "content-draft";
  var main = document.getElementById("ed-main"), nav = document.getElementById("ed-nav"), msg = document.getElementById("ed-msg");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function say(t, bad) {
    msg.innerHTML = t ? '<p class="' + (bad ? "bad" : "ok") + '">' + t + "</p>" : "";
  }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  if (!window.CONTENT) {
    var er = window.__contentError;
    main.innerHTML = '<div class="typo"><h2>content.js has a problem</h2>' +
      (er ? "<p>There is a typo near <b>line " + esc(er.line) + "</b>: <code>" + esc(er.message) + "</code></p>" : "<p>content.js could not be loaded.</p>") +
      "<p>Fix that line on GitHub (often a missing comma or quote), or restore the previous version from the file's History, then reload this page.</p></div>";
    return;
  }

  var original = clone(window.CONTENT);
  var data = clone(original);
  var draft = read(DRAFT_KEY);
  if (draft && draft !== JSON.stringify(original)) {
    try {
      data = JSON.parse(draft);
      say('You have unsaved edits from earlier, shown below. <button type="button" class="linkbtn" id="discard">Discard them and start from the published file</button>');
    } catch (e) { data = clone(original); }
  }

  /* ------------------------------------------------ names and hints */
  var SECTIONS = {
    site: ["You and site settings", "Your name, contact details, profile links, and which pages are shown."],
    home: ["Home page", "The text at the top of the home page, the About paragraphs and the highlights."],
    places: ["Map of work and study", "Places on the home-page map. Coordinates: right-click a place in Google Maps and copy the two numbers."],
    research: ["Research page", "Your current project and earlier projects."],
    publications: ["Publications", "Newest first."],
    myAuthorName: ["Your name in author lists", "This part of each author list is shown in bold."],
    talks: ["Talks and posters", "Shown on the Publications page once there is at least one."],
    experience: ["CV: research experience", "Newest first. Dates like 2025-11 draw the timeline chart."],
    education: ["CV: education", "Newest first."],
    awards: ["CV: awards", ""],
    roles: ["CV: roles and service", ""],
    skills: ["CV: skills", "One skill per line."],
    languages: ["CV: languages", ""],
    news: ["News and events", "Newest first. The first few also appear on the home page."],
    travel: ["Travel page", "One entry per city. Write countries in English so they are shaded on the map. Coordinates: right-click a city in Google Maps."],
    blog: ["Blog", "Newest first. The Blog page appears once there is a post."]
  };
  var LABELS = {
    name: "Name", role: "Role or title", description: "Short description (for search engines)", photo: "Photo", cvFile: "CV as PDF",
    email: "Email", affiliation: "Affiliation (footer)", linkedin: "LinkedIn", orcid: "ORCID", scholar: "Google Scholar",
    researchgate: "ResearchGate", github: "GitHub", lede: "Main sentence under your name", intro: "Introduction",
    about: "About paragraphs", highlights: "Highlights", showMap: "Show the map", latestNews: "How many news items on the home page",
    city: "City", country: "Country", lat: "Latitude", lng: "Longitude", years: "Years", what: "What you did there",
    upcoming: "Planned, not started yet", hide: "Hide from the site", title: "Title", where: "Where", paragraphs: "Paragraphs",
    keywords: "Keywords (one per line)", field: "Field (used for the filter buttons)", text: "Text", authors: "Authors",
    venue: "Journal or venue", year: "Year", type: "Type", summary: "Summary", doi: "DOI link", pdf: "PDF link",
    start: "Start (e.g. 2025-11 or 2023)", end: "End (e.g. 2026-03, or present)", org: "Organisation", place: "Place",
    methods: "Methods (one per line)", degree: "Degree", group: "Group", items: "Items (one per line)", level: "Level",
    date: "Date", links: "Links", photos: "Photos", label: "Link text", url: "Address (https://...)", src: "Image path (images/...)",
    alt: "Short description of the photo", embed: "LinkedIn embed address", id: "Short web name (lowercase-with-dashes)",
    body: "Post text", link: "Link", event: "Event", kind: "Kind (Talk, Poster...)", pages: "Pages shown in the menu",
    current: "Current project", teaser: "Sentence for the home page", showOnHome: "Show “Beyond the lab” on the home page", note: "Note (optional)", travel: "Travel page", earlier: "Earlier projects", links_: "", research: "Research page", cv: "CV page",
    news: "News page", blog: "Blog page", publications: "Publications page", award: "Award line"
  };
  var HINTS = {
    photo: "Upload the picture to the images folder on GitHub first, then write its path, e.g. images/me.jpg",
    src: "Upload the picture to the images folder on GitHub first.",
    body: "Blank line between paragraphs. ## Heading, - bullet, **bold**, *italic*, [text](https://link), ![description](images/photo.jpg)",
    type: "News: Event, Award, Publication, Role or News. Publications: Review article, Research article...",
    embed: "On a public LinkedIn post: ⋯ menu, Embed this post, copy the address inside src=\"...\""
  };
  var LINES = { keywords: 1, methods: 1, items: 1 };            // arrays of strings shown as one-per-line
  var LONG = { text: 1, summary: 1, description: 1, intro: 1, what: 1, about: 1, paragraphs: 1 };
  var TEMPLATES = {
    talks: { title: "", event: "", place: "", date: "", kind: "Talk", link: "" },
    photos: { src: "", alt: "" },
    links: { label: "", url: "" },
    news: { date: "", type: "News", title: "", place: "", text: "", links: [], photos: [] },
    blog: { id: "", title: "", date: "", summary: "", body: "\nWrite here.\n" }
  };
  function label(k) { return LABELS[k] || k.replace(/([A-Z])/g, " $1").replace(/^./, function (c) { return c.toUpperCase(); }); }
  function blank(v) {
    if (Array.isArray(v)) return [];
    if (v && typeof v === "object") { var o = {}; Object.keys(v).forEach(function (k) { o[k] = blank(v[k]); }); return o; }
    if (typeof v === "boolean") return false;
    if (typeof v === "number") return 0;
    return "";
  }
  function titleOf(o, i) {
    var t = o && (o.title || o.role || o.degree || o.city || o.name || o.group || o.label || o.src);
    return t ? String(t) : "New item " + (i + 1);
  }

  /* ------------------------------------------------ path helpers */
  function get(path) { return path.reduce(function (o, k) { return o == null ? o : o[k]; }, data); }
  function set(path, v) {
    var o = data;
    for (var i = 0; i < path.length - 1; i++) o = o[path[i]];
    o[path[path.length - 1]] = v;
    changed();
  }
  var saveTimer;
  function changed() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { store(DRAFT_KEY, JSON.stringify(data)); }, 300);
  }

  /* ------------------------------------------------ form builder */
  var uid = 0;
  function field(key, val, path) {
    var id = "f" + (++uid), p = esc(JSON.stringify(path)), hint = HINTS[key] ? '<span class="hint">' + esc(HINTS[key]) + "</span>" : "";
    if (typeof val === "boolean") {
      return '<label class="chk"><input type="checkbox" data-p="' + p + '" data-t="bool"' + (val ? " checked" : "") + "> " + esc(label(key)) + "</label>";
    }
    if (typeof val === "number") {
      return '<label class="fld" for="' + id + '"><span>' + esc(label(key)) + "</span>" + hint + '<input id="' + id + '" type="number" step="any" data-p="' + p + '" data-t="num" value="' + esc(val) + '"></label>';
    }
    if (typeof val === "string") {
      var big = key === "body", long = big || LONG[key] || val.length > 90 || val.indexOf("\n") >= 0;
      var inp = long ? '<textarea id="' + id + '" rows="' + (big ? 18 : Math.min(8, Math.max(3, Math.ceil(val.length / 80)))) + '" data-p="' + p + '"' + (big ? ' class="mono"' : "") + ">" + esc(val) + "</textarea>"
        : '<input id="' + id + '" type="text" data-p="' + p + '" value="' + esc(val) + '">';
      return '<label class="fld" for="' + id + '"><span>' + esc(label(key)) + "</span>" + hint + inp + "</label>";
    }
    if (Array.isArray(val)) {
      if (val.length === 0 && TEMPLATES[key]) return listOf(key, val, path);
      var isStr = val.every(function (x) { return typeof x === "string"; });
      if (isStr && (LINES[key] || !LONG[key]) && !(val.length === 0 && TEMPLATES[key])) {
        return '<label class="fld" for="' + id + '"><span>' + esc(label(key)) + '</span><span class="hint">One per line.</span><textarea id="' + id + '" rows="' + Math.max(3, Math.min(10, val.length + 1)) + '" data-p="' + p + '" data-t="lines">' + esc(val.join("\n")) + "</textarea></label>";
      }
      if (isStr) {
        return '<fieldset class="grp"><legend>' + esc(label(key)) + "</legend>" + val.map(function (s, i) {
          return '<div class="para"><textarea rows="4" data-p="' + esc(JSON.stringify(path.concat(i))) + '">' + esc(s) + '</textarea>' + itemTools(path, i, val.length) + "</div>";
        }).join("") + '<button type="button" class="add" data-add="' + p + '" data-kind="str">Add a paragraph</button></fieldset>';
      }
      return listOf(key, val, path);
    }
    if (val && typeof val === "object") {
      return '<fieldset class="grp"><legend>' + esc(label(key)) + "</legend>" + Object.keys(val).map(function (k) { return field(k, val[k], path.concat(k)); }).join("") + "</fieldset>";
    }
    return "";
  }
  function itemTools(path, i, n) {
    var p = esc(JSON.stringify(path));
    return '<div class="tools">' +
      '<button type="button" data-move="-1" data-list="' + p + '" data-i="' + i + '"' + (i === 0 ? " disabled" : "") + ' aria-label="Move up">Up</button>' +
      '<button type="button" data-move="1" data-list="' + p + '" data-i="' + i + '"' + (i === n - 1 ? " disabled" : "") + ' aria-label="Move down">Down</button>' +
      '<button type="button" data-dup="' + p + '" data-i="' + i + '">Duplicate</button>' +
      '<button type="button" class="del" data-del="' + p + '" data-i="' + i + '">Delete</button></div>';
  }
  function listOf(key, arr, path, open) {
    var p = esc(JSON.stringify(path));
    return '<fieldset class="grp list"><legend>' + esc(label(key)) + " (" + arr.length + ")</legend>" +
      '<button type="button" class="add" data-add="' + p + '" data-key="' + esc(key) + '">' + (path.length === 1 ? "Add new at the top" : "Add one") + '</button>' +
      arr.map(function (o, i) {
        return '<details class="item" data-path="' + esc(JSON.stringify(path.concat(i))) + '"' + (open === i ? " open" : "") + '><summary><span>' + esc(titleOf(o, i)) + "</span>" + (o && o.hide ? '<em class="hidden-tag">hidden</em>' : "") + "</summary>" +
          '<div class="item-body">' + Object.keys(o || {}).map(function (k) { return field(k, o[k], path.concat(i, k)); }).join("") +
          (o && !("hide" in o) ? '<label class="chk"><input type="checkbox" data-p="' + esc(JSON.stringify(path.concat(i, "hide"))) + '" data-t="bool"> Hide from the site</label>' : "") +
          itemTools(path, i, arr.length) + "</div></details>";
      }).join("") + "</fieldset>";
  }

  var currentSection = null;
  function renderNav() {
    nav.innerHTML = Object.keys(data).map(function (k) {
      var s = SECTIONS[k] || [label(k)];
      return '<a href="#' + k + '"' + (k === currentSection ? ' aria-current="true"' : "") + ">" + esc(s[0]) + "</a>";
    }).join("");
  }
  function renderSection(k, openPath) {
    currentSection = k;
    var s = SECTIONS[k] || [label(k), ""], v = data[k], body;
    if (Array.isArray(v) && v.every(function (x) { return x && typeof x === "object"; })) body = listOf(k, v, [k], openPath);
    else if (v && typeof v === "object" && !Array.isArray(v)) body = Object.keys(v).map(function (kk) { return field(kk, v[kk], [k, kk]); }).join("");
    else body = field(k, v, [k]);
    main.innerHTML = '<h2>' + esc(s[0]) + "</h2>" + (s[1] ? '<p class="lead">' + esc(s[1]) + "</p>" : "") + '<div class="form">' + body + "</div>";
    renderNav();
  }
  function route(openPath) {
    var k = location.hash.slice(1);
    if (!(k in data)) k = Object.keys(data)[0];
    renderSection(k, openPath);
  }
  window.addEventListener("hashchange", function () { route(); window.scrollTo(0, 0); });

  /* ------------------------------------------------ events */
  main.addEventListener("input", function (e) {
    var t = e.target, p = t.getAttribute("data-p");
    if (!p) return;
    var path = JSON.parse(p), kind = t.getAttribute("data-t"), v = t.value;
    if (kind === "bool") v = t.checked;
    else if (kind === "num") v = t.value === "" ? 0 : +t.value;
    else if (kind === "lines") v = t.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    set(path, v);
    var det = t.closest("details.item");
    if (det && /"(title|role|degree|city|name|group|label|src)"\]$/.test(p)) det.querySelector("summary span").textContent = v || "New item";
  });
  main.addEventListener("change", function (e) { if (e.target.getAttribute("data-t") === "bool") e.target.dispatchEvent(new Event("input", { bubbles: true })); });
  main.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var arr, i, path;
    if (b.hasAttribute("data-add")) {
      path = JSON.parse(b.getAttribute("data-add"));
      arr = get(path);
      if (b.getAttribute("data-kind") === "str") { arr.push(""); changed(); rerender(path, null); return; }
      var key = b.getAttribute("data-key");
      var tpl = TEMPLATES[key] ? clone(TEMPLATES[key]) : (arr[0] ? blank(arr[0]) : { title: "", text: "" });
      delete tpl.hide;
      arr.unshift(tpl);
      changed();
      rerender(path, 0);
      return;
    }
    if (b.hasAttribute("data-move")) {
      path = JSON.parse(b.getAttribute("data-list")); arr = get(path); i = +b.getAttribute("data-i");
      var j = i + (+b.getAttribute("data-move"));
      if (j < 0 || j >= arr.length) return;
      var x = arr[i]; arr[i] = arr[j]; arr[j] = x; changed(); rerender(path, j); return;
    }
    if (b.hasAttribute("data-dup")) {
      path = JSON.parse(b.getAttribute("data-dup")); arr = get(path); i = +b.getAttribute("data-i");
      arr.splice(i, 0, clone(arr[i])); changed(); rerender(path, i); return;
    }
    if (b.hasAttribute("data-del")) {
      path = JSON.parse(b.getAttribute("data-del")); arr = get(path); i = +b.getAttribute("data-i");
      if (!confirm("Delete “" + titleOf(arr[i], i) + "”? You can still get it back by discarding your edits before you upload.")) return;
      arr.splice(i, 1); changed(); rerender(path, null); return;
    }
  });
  function rerender(path, openIdx) {
    // redraw, keeping open the items that were open, plus the one just changed
    var keep = [];
    main.querySelectorAll("details.item[open]").forEach(function (d) { keep.push(d.getAttribute("data-path")); });
    var y = window.scrollY;
    route();
    if (openIdx != null) keep.push(JSON.stringify(path.concat(openIdx)));
    main.querySelectorAll("details.item").forEach(function (d) { if (keep.indexOf(d.getAttribute("data-path")) >= 0) d.open = true; });
    window.scrollTo(0, y);
  }
  msg.addEventListener("click", function (e) {
    if (e.target.id === "discard") { data = clone(original); store(DRAFT_KEY, null); say("Edits discarded. You are editing the published file."); route(); }
  });

  /* ------------------------------------------------ write content.js */
  var COMMENTS = {
    site: "YOU, AND THE PARTS SHOWN ON EVERY PAGE", home: "HOME PAGE", places: "MAP: PLACES I HAVE STUDIED AND WORKED",
    research: "RESEARCH PAGE", publications: "PUBLICATIONS (newest first)", talks: "TALKS AND POSTERS", experience: "CV: RESEARCH EXPERIENCE (newest first)",
    education: "CV: EDUCATION", awards: "CV: AWARDS", roles: "CV: ROLES AND SERVICE", skills: "CV: SKILLS", languages: "CV: LANGUAGES",
    news: "NEWS AND EVENTS (newest first)", travel: "TRAVEL PAGE", blog: "BLOG (newest first)"
  };
  function str(s) {
    if (s.indexOf("\n") >= 0) return "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
    return JSON.stringify(s);
  }
  function key(k) { return /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k); }
  function ser(v, ind) {
    var pad = "  ".repeat(ind), pad1 = "  ".repeat(ind + 1);
    if (typeof v === "string") return str(v);
    if (typeof v !== "object" || v === null) return JSON.stringify(v);
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      if (v.every(function (x) { return typeof x === "string" && x.length < 40; })) {
        var one = "[" + v.map(str).join(", ") + "]";
        if (one.length < 110) return one;
      }
      return "[\n" + v.map(function (x) { return pad1 + ser(x, ind + 1); }).join(",\n") + "\n" + pad + "]";
    }
    var ks = Object.keys(v);
    if (!ks.length) return "{}";
    return "{\n" + ks.map(function (k) { return pad1 + key(k) + ": " + ser(v[k], ind + 1); }).join(",\n") + "\n" + pad + "}";
  }
  function output() {
    var head = "/* =====================================================================\n" +
      "   ALL THE TEXT ON YOUR WEBSITE LIVES IN THIS ONE FILE.\n" +
      "   Easiest way to change it: open edit.html on your site, edit, download.\n" +
      "   Saved with the editor on " + new Date().toISOString().slice(0, 10) + ".\n" +
      "   ===================================================================== */\n\nvar CONTENT = {\n";
    var parts = Object.keys(data).map(function (k) {
      return (COMMENTS[k] ? "\n  /* ---------- " + COMMENTS[k] + " ---------- */\n" : "") + "  " + key(k) + ": " + ser(data[k], 1);
    });
    var out = head + parts.join(",\n") + "\n};\n";
    // check that it parses before giving it to you
    try { new Function(out + "\nreturn CONTENT;")(); } catch (e) { say("Something went wrong while writing the file: " + esc(e.message), true); return null; }
    return out;
  }
  function problems() {
    var p = [];
    (data.blog || []).forEach(function (b, i) { if (b.id && !/^[a-z0-9-]+$/.test(b.id)) p.push("Blog post " + (i + 1) + ": the short web name may only use lowercase letters, numbers and dashes."); });
    (data.places || []).forEach(function (pl) { if (isNaN(+pl.lat) || isNaN(+pl.lng)) p.push("Map place " + pl.city + ": latitude and longitude must be numbers."); });
    return p;
  }
  document.getElementById("download").addEventListener("click", function () {
    var pr = problems();
    if (pr.length) { say(pr.map(esc).join("<br>"), true); return; }
    var out = output();
    if (!out) return;
    var blob = new Blob([out], { type: "text/javascript" });
    var u = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = u; a.download = "content.js"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 2000);
    say("Downloaded content.js. Upload it to GitHub to publish your changes (see “How to put your changes online”).");
    document.getElementById("help").open = true;
  });
  document.getElementById("copy").addEventListener("click", function () {
    var out = output();
    if (!out) return;
    if (navigator.clipboard) navigator.clipboard.writeText(out).then(function () {
      say("Copied. On GitHub, open content.js, click the pencil, select all, paste, and commit.");
    }, function () { say("Copying was blocked by the browser. Use Download instead.", true); });
    else say("Copying is not available in this browser. Use Download instead.", true);
  });
  document.getElementById("preview").addEventListener("click", function () {
    if (!store(DRAFT_KEY, JSON.stringify(data))) { say("This browser blocks saving, so the preview cannot show your edits.", true); return; }
    try { sessionStorage.setItem("preview", "1"); } catch (e) {}
    window.open("index.html?preview=1", "_blank");
  });

  route();
})();
