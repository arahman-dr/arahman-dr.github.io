/* Catches typos in content.js so the site can say where the problem is. */
(function () {
  window.__contentError = null;
  window.addEventListener("error", function (e) {
    if (e && e.filename && /content\.js/.test(e.filename)) {
      window.__contentError = { line: e.lineno, message: e.message };
    }
  }, true);
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
  } catch (err) {}
})();
