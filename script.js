(function () {
  "use strict";

  function slugify(str) {
    return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function fillHeroCategories() {
    var el = document.getElementById("hero-categories");
    if (!el || typeof APP_DATA === "undefined") return;
    el.textContent = APP_DATA.map(function (g) {
      return slugify(g.category) + "/";
    }).join(" · ");
  }

  function buildCatalog() {
    var root = document.getElementById("catalog");
    if (!root || typeof APP_DATA === "undefined") return;

    var rowIndex = 0;

    APP_DATA.forEach(function (group, groupIndex) {
      var section = document.createElement("section");
      section.className = "dir";
      section.style.setProperty("--delay", groupIndex * 0.05 + "s");

      var head = document.createElement("div");
      head.className = "dir-head";

      var path = document.createElement("span");
      path.className = "dir-path";
      path.textContent = "./" + slugify(group.category) + "/";

      var count = document.createElement("span");
      count.className = "dir-count";
      var n = group.apps.length;
      count.textContent = n + (n === 1 ? " app" : " apps");

      head.appendChild(path);
      head.appendChild(count);

      var rule = document.createElement("div");
      rule.className = "dir-rule";

      var list = document.createElement("div");
      list.className = "file-list";

      group.apps.forEach(function (app) {
        var row = document.createElement("a");
        row.className = "file-row";
        row.href = app.url;
        row.target = "_blank";
        row.rel = "noopener noreferrer";
        row.style.setProperty("--stagger", (rowIndex % 6) * 0.05 + "s");
        rowIndex++;

        var main = document.createElement("span");
        main.className = "file-main";

        var prompt = document.createElement("span");
        prompt.className = "file-prompt";
        prompt.textContent = ">";
        prompt.setAttribute("aria-hidden", "true");

        var name = document.createElement("span");
        name.className = "file-name";
        name.textContent = app.name;

        var open = document.createElement("span");
        open.className = "file-open";
        open.textContent = "open ↗";

        main.appendChild(prompt);
        main.appendChild(name);
        main.appendChild(open);
        row.appendChild(main);

        if (app.description) {
          var desc = document.createElement("span");
          desc.className = "file-desc";
          desc.textContent = "# " + app.description;
          row.appendChild(desc);
        }

        list.appendChild(row);
      });

      section.appendChild(head);
      section.appendChild(rule);
      section.appendChild(list);
      root.appendChild(section);
    });
  }

  function observeReveals() {
    var targets = document.querySelectorAll(".dir, .file-row");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillHeroCategories();
    buildCatalog();
    observeReveals();
  });
})();
