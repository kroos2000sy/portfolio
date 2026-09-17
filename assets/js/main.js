(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll progress ---------- */
  var progressFill = document.getElementById("progressFill");
  var ticking = false;
  function updateProgress() {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    var pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    ticking = false;
  }
  if (progressFill) {
    updateProgress();
    document.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------- theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  function effectiveTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function reflectTheme(theme) {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  reflectTheme(effectiveTheme());
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      reflectTheme(next);
    });
  }

  /* ---------- reveal on scroll ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || isNaN(target)) {
      el.textContent = (isNaN(target) ? "" : target) + suffix;
      return;
    }
    var start = performance.now();
    var duration = 700;
    function frame(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    io.observe(el);
  });

  /* safety net: never leave content sitting invisible for long */
  window.setTimeout(function () {
    document.querySelectorAll("[data-reveal]:not(.in-view)").forEach(function (el) {
      el.classList.add("in-view");
      el.querySelectorAll("[data-count]").forEach(animateCount);
    });
  }, 900);

  /* ---------- image skeleton to loaded fade ---------- */
  function markMediaLoaded(img) {
    img.classList.add("is-loaded");
    var container = img.closest(".project-media, .detail-media");
    if (container) container.classList.add("media-loaded");
  }
  document.querySelectorAll(".project-media img, .detail-media img").forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      markMediaLoaded(img);
    } else {
      img.addEventListener("load", function () {
        markMediaLoaded(img);
      });
      img.addEventListener("error", function () {
        markMediaLoaded(img);
      });
    }
  });

  /* ---------- scrollspy nav ---------- */
  var navLinks = document.querySelectorAll("[data-nav-link]");
  if (navLinks.length) {
    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      var section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (s) {
            return s.section === entry.target;
          });
          if (!match) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.removeAttribute("aria-current");
            });
            match.link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (s) {
      spy.observe(s.section);
    });
  }

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById("copyEmailBtn");
  var copiedTag = document.getElementById("copiedTag");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "yousefpes1@gmail.com";
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(email).then(function () {
        if (!copiedTag) return;
        copiedTag.classList.add("visible");
        window.setTimeout(function () {
          copiedTag.classList.remove("visible");
        }, 1800);
      }).catch(function () {});
    });
  }

  /* ---------- back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    document.addEventListener(
      "scroll",
      function () {
        var doc = document.documentElement;
        var scrolled = doc.scrollTop || document.body.scrollTop;
        backToTop.classList.toggle("visible", scrolled > 480);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
