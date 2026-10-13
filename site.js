(function () {
  "use strict";
  var S = window.SITE || {};
  var L = S.links || {};

  var NAV = [
    ["index", "Home"], ["research", "Research"], ["experience", "Experience"],
    ["publications", "Publications"], ["events", "Conferences"], ["news", "News"]
  ];

  if (window.BLOG && window.BLOG.length) NAV.push(["blog", "Blog"]);

  var ICONS = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 8l8 5.5L20 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3.5" fill="#0A66C2"/><text x="12" y="17" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11.5" fill="#fff">in</text></svg>',
    orcid: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#A6CE39"/><text x="12" y="15.6" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="9.5" fill="#fff">iD</text></svg>',
    scholar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 1.5 9 12 15l8.5-4.86V16H22V9L12 3z" fill="#4285F4"/><path d="M5.5 13.2V17c0 1.6 2.9 3.5 6.5 3.5s6.5-1.9 6.5-3.5v-3.8L12 16.8l-6.5-3.6z" fill="#4285F4" opacity=".75"/></svg>',
    researchgate: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3.5" fill="#00A99D"/><text x="12" y="16" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="9.5" fill="#fff">RG</text></svg>'
  };

  var ICON_LIST = [
    ["mail", "Email", "mailto:" + (S.email || "")],
    ["linkedin", "LinkedIn", L.linkedin],
    ["orcid", "ORCID", L.orcid],
    ["scholar", "Google Scholar", L.scholar],
    ["researchgate", "ResearchGate", L.researchgate]
  ];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function iconRow(extra) {
    var h = '<div class="icons ' + (extra || "") + '">';
    ICON_LIST.forEach(function (i) {
      if (!i[2]) return;
      var ext = i[0] === "mail" ? "" : ' target="_blank" rel="noopener"';
      h += '<a class="ico" href="' + esc(i[2]) + '" aria-label="' + i[1] + '" title="' + i[1] + '"' + ext + '>' + ICONS[i[0]] + '</a>';
    });
    return h + "</div>";
  }

  /* header and footer */
  var cur = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
  var hdr = document.getElementById("site-header");
  if (hdr) {
    var nav = NAV.map(function (n) {
      return '<a href="' + n[0] + '.html"' + (n[0] === cur ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("");
    hdr.innerHTML = '<div class="hdr"><a class="brand" href="index.html">' + esc(S.name) + '</a><nav class="main" aria-label="Main">' + nav + "</nav>" + iconRow("") + "</div>";
  }
  var ftr = document.getElementById("site-footer");
  if (ftr) {
    ftr.innerHTML = '<div class="ftr"><span>© ' + new Date().getFullYear() + " " + esc(S.name) +
      " · Leibniz Institute of Surface Engineering (IOM), Leipzig · Friedrich Schiller University Jena</span>" + iconRow("") + "</div>";
  }
  var hero = document.getElementById("hero-icons");
  if (hero) hero.outerHTML = iconRow("lg");

  /* links helper */
  function linkList(arr) {
    if (!arr || !arr.length) return "";
    return '<p class="rl">' + arr.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("") + "</p>";
  }

  /* events */
  var evEl = document.getElementById("events-list");
  if (evEl && window.EVENTS) {
    evEl.innerHTML = EVENTS.map(function (e) {
      var h = '<article class="item">';
      if (e.date) h += '<span class="when">' + esc(e.date) + "</span>";
      h += "<h3>" + esc(e.title) + "</h3>";
      h += '<p class="where">' + esc([e.place, e.role].filter(Boolean).join(" · ")) + "</p>";
      if (e.award) h += '<p class="award">' + esc(e.award) + "</p>";
      if (e.summary) h += "<p>" + esc(e.summary) + "</p>";
      h += linkList(e.links);
      if (e.photos && e.photos.length) {
        h += '<div class="gallery">' + e.photos.map(function (p) {
          return '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || e.title) + '" loading="lazy">';
        }).join("") + "</div>";
      }
      return h + "</article>";
    }).join("");
  }

  /* publications */
  var pubEl = document.getElementById("pub-list");
  if (pubEl && window.PUBLICATIONS) {
    pubEl.innerHTML = PUBLICATIONS.map(function (p) {
      var h = '<article class="item"><h3>' + esc(p.title) + "</h3>";
      h += '<p class="where">' + esc(p.authors) + "</p>";
      h += "<p><em>" + esc(p.venue) + "</em>, " + esc(p.year) + (p.type ? " · " + esc(p.type) : "") + "</p>";
      if (p.summary) h += '<p class="tags">' + esc(p.summary) + "</p>";
      if (p.doi) h += '<p class="rl"><a href="' + esc(p.doi) + '" target="_blank" rel="noopener">DOI</a></p>';
      return h + "</article>";
    }).join("");
  }

  /* LinkedIn posts */
  function postHTML(p) {
    var h = '<article class="post">';
    if (p.date) h += '<p class="where">' + esc(p.date) + "</p>";
    h += "<h3>" + esc(p.title) + "</h3>";
    if (p.embed && /^https:\/\/www\.linkedin\.com\/embed\//.test(p.embed)) {
      h += '<div class="embed"><iframe src="' + esc(p.embed) + '" height="' + esc(p.height || 600) + '" title="LinkedIn post" loading="lazy" allowfullscreen></iframe></div>';
    }
    if (p.text) h += "<p>" + esc(p.text) + "</p>";
    h += linkList(p.links);
    return h + "</article>";
  }
  var postsEl = document.getElementById("posts-list");
  if (postsEl && window.POSTS) postsEl.innerHTML = POSTS.map(postHTML).join("");

  var latest = document.getElementById("latest-posts");
  if (latest && window.POSTS) {
    latest.innerHTML = POSTS.slice(0, 2).map(function (p) {
      return '<article class="item"><h3>' + esc(p.title) + "</h3><p>" + esc(p.short || "") + "</p></article>";
    }).join("") + '<p class="rl"><a href="news.html">All news</a><a href="' + esc(L.linkedinActivity) + '" target="_blank" rel="noopener">My LinkedIn activity</a></p>';
  }

  /* blog */
  function inline(t) {
    t = esc(t);
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|[\w\-.\/#?=&%;]+)\)/g, function (m, label, u) {
      var ext = /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + u + '"' + ext + ">" + label + "</a>";
    });
    return t;
  }
  function bodyHTML(b) {
    return String(b || "").trim().split(/\n\s*\n/).map(function (blk) {
      blk = blk.trim();
      var m;
      if ((m = blk.match(/^### (.+)$/))) return "<h3>" + inline(m[1]) + "</h3>";
      if ((m = blk.match(/^## (.+)$/))) return "<h2>" + inline(m[1]) + "</h2>";
      if ((m = blk.match(/^!\[([^\]]*)\]\((images\/[^\s)]+)\)$/))) {
        return '<figure><img src="' + esc(m[2]) + '" alt="' + esc(m[1]) + '" loading="lazy"><figcaption>' + esc(m[1]) + "</figcaption></figure>";
      }
      var lines = blk.split("\n");
      if (lines.every(function (l) { return /^- /.test(l.trim()); })) {
        return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.trim().slice(2)) + "</li>"; }).join("") + "</ul>";
      }
      return "<p>" + lines.map(function (l) { return inline(l.trim()); }).join(" ") + "</p>";
    }).join("");
  }
  var blogEl = document.getElementById("blog-view");
  if (blogEl) {
    var posts = window.BLOG || [];
    var wanted = new URLSearchParams(location.search).get("post");
    var head = document.getElementById("blog-head");
    var one = null;
    posts.forEach(function (p) { if (p.id === wanted) one = p; });
    if (one) {
      if (head) head.style.display = "none";
      document.title = one.title + " · " + S.name;
      blogEl.innerHTML = '<article class="article"><p class="where">' + esc(one.date) + "</p><h1>" + esc(one.title) + "</h1>" +
        bodyHTML(one.body) + '<p class="rl"><a href="blog.html">← All posts</a></p></article>';
    } else if (posts.length) {
      blogEl.innerHTML = '<section id="posts"><h2>All posts</h2><div>' + posts.map(function (p) {
        return '<article class="item"><span class="when">' + esc(p.date) + '</span><h3><a href="blog.html?post=' + encodeURIComponent(p.id) + '">' +
          esc(p.title) + "</a></h3><p>" + esc(p.summary || "") + "</p></article>";
      }).join("") + "</div></section>";
    } else {
      blogEl.innerHTML = '<p class="note">The first blog post is coming soon.</p>';
    }
  }
})();
