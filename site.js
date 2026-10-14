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


  /* built-in blog animations: use  [[animation:foulant-cleaning]]  on its own line in a post */
  var ANIMATIONS = {
    "foulant-cleaning": {
      caption: "Light-triggered foulant cleaning. Simplified illustration, not to scale; it shows the effect, not a specific mechanism.",
      svg: '<svg class="fc" viewBox="0 -12 640 302" role="img" aria-label="Animation: foulant builds up on a membrane surface and permeate flow weakens; light is switched on, the foulant lifts off and is carried away, and permeate flow recovers">' +
        '<polygon class="fc-light" points="300,34 340,34 604,186 36,186"/>' +
        '<circle class="fc-lamp" cx="320" cy="24" r="10"/>' +
        '<g class="fc-rays"><line x1="320" y1="4" x2="320" y2="-2"/><line x1="300" y1="10" x2="295" y2="5"/><line x1="340" y1="10" x2="345" y2="5"/></g>' +
        '<rect class="fc-mem" x="40" y="190" width="560" height="26" rx="4"/>' +
        '<g class="fc-pores"><rect x="80" y="190" width="12" height="26"/><rect x="140" y="190" width="12" height="26"/><rect x="200" y="190" width="12" height="26"/><rect x="260" y="190" width="12" height="26"/><rect x="320" y="190" width="12" height="26"/><rect x="380" y="190" width="12" height="26"/><rect x="440" y="190" width="12" height="26"/><rect x="500" y="190" width="12" height="26"/><rect x="560" y="190" width="12" height="26"/></g>' +
        '<line class="fc-glow" x1="40" y1="189" x2="600" y2="189"/>' +
        '<g class="fc-perm"><g><line x1="86" y1="224" x2="86" y2="254"/><polygon points="81,252 86,262 91,252"/></g><g><line x1="146" y1="224" x2="146" y2="254"/><polygon points="141,252 146,262 151,252"/></g><g><line x1="206" y1="224" x2="206" y2="254"/><polygon points="201,252 206,262 211,252"/></g><g><line x1="266" y1="224" x2="266" y2="254"/><polygon points="261,252 266,262 271,252"/></g><g><line x1="326" y1="224" x2="326" y2="254"/><polygon points="321,252 326,262 331,252"/></g><g><line x1="386" y1="224" x2="386" y2="254"/><polygon points="381,252 386,262 391,252"/></g><g><line x1="446" y1="224" x2="446" y2="254"/><polygon points="441,252 446,262 451,252"/></g><g><line x1="506" y1="224" x2="506" y2="254"/><polygon points="501,252 506,262 511,252"/></g><g><line x1="566" y1="224" x2="566" y2="254"/><polygon points="561,252 566,262 571,252"/></g></g>' +
        '<circle class="fo fa" cx="95" cy="181" r="9"/><circle class="fo fa" cx="255" cy="180" r="10"/><circle class="fo fa" cx="415" cy="182" r="8"/>' +
        '<circle class="fo fb" cx="175" cy="182" r="8"/><circle class="fo fb" cx="335" cy="181" r="9"/><circle class="fo fb" cx="495" cy="180" r="10"/>' +
        '<circle class="fo fc3" cx="135" cy="183" r="7"/><circle class="fo fc3" cx="295" cy="182" r="8"/><circle class="fo fc3" cx="455" cy="183" r="7"/><circle class="fo fc3" cx="555" cy="181" r="9"/>' +
        '<text class="fc-lab" x="44" y="62">Feed</text><text class="fc-lab" x="44" y="282">Permeate</text>' +
        '<text class="fc-st t1" x="600" y="62" text-anchor="end">Foulant builds up, flow drops</text>' +
        '<text class="fc-st t2" x="600" y="62" text-anchor="end">Light on: foulant is released</text>' +
        '<text class="fc-st t3" x="600" y="62" text-anchor="end">Clean surface, flow restored</text>' +
        '</svg>'
    }
  };

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
      if ((m = blk.match(/^\[\[animation:([\w-]+)\]\]$/)) && ANIMATIONS[m[1]]) {
        return '<figure class="anim">' + ANIMATIONS[m[1]].svg + "<figcaption>" + esc(ANIMATIONS[m[1]].caption) + "</figcaption></figure>";
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
