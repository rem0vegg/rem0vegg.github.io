(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Active nav link (scroll spy) ---------- */
  var navLinks = {};
  document.querySelectorAll(".links a[href^='#']").forEach(function (a) {
    navLinks[a.getAttribute("href").slice(1)] = a;
  });

  function setCurrent(id) {
    Object.keys(navLinks).forEach(function (key) {
      if (key === id) navLinks[key].setAttribute("aria-current", "true");
      else navLinks[key].removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(entry.target.id || null);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll("header.hero, section[id]").forEach(function (el) { spy.observe(el); });

    // Short last sections may never reach the observer band: mark the last one at page bottom.
    window.addEventListener(
      "scroll",
      function () {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          setCurrent("contact");
        }
      },
      { passive: true }
    );
  }

  /* ---------- Lightbox ---------- */
  var dialog = document.getElementById("lightbox");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));

  if (dialog && triggers.length) {
    var supportsDialog = typeof dialog.showModal === "function";
    var img = dialog.querySelector(".lb-img");
    var caption = dialog.querySelector(".lb-caption");
    var count = dialog.querySelector(".lb-count");
    var index = 0;

    var show = function (i) {
      index = (i + triggers.length) % triggers.length;
      var btn = triggers[index];
      var thumb = btn.querySelector("img");
      img.classList.remove("is-loaded");
      img.onload = function () { img.classList.add("is-loaded"); };
      img.src = btn.dataset.full;
      img.alt = thumb ? thumb.alt : "";
      var fig = btn.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      caption.textContent = cap ? cap.textContent : "";
      count.textContent = index + 1 + " / " + triggers.length;

      // Warm the cache for the neighbours.
      [index - 1, index + 1].forEach(function (n) {
        var pre = new Image();
        pre.src = triggers[(n + triggers.length) % triggers.length].dataset.full;
      });
    };

    triggers.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        if (!supportsDialog) {
          window.open(btn.dataset.full, "_blank", "noopener");
          return;
        }
        show(i);
        dialog.showModal();
      });
    });

    dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
    dialog.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });

    // Click on the empty backdrop area closes the dialog.
    dialog.addEventListener("click", function (e) {
      if (!e.target.closest("img, button, figcaption, .lb-count")) dialog.close();
    });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
    });

    // Swipe on touch screens.
    var startX = null;
    dialog.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(dx > 0 ? index - 1 : index + 1);
    });

    dialog.addEventListener("close", function () {
      img.removeAttribute("src");
      img.classList.remove("is-loaded");
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copy-email");
  var status = document.getElementById("copy-status");
  if (copyBtn && status) {
    var timer;
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email;
      var done = function (msg) {
        status.textContent = msg;
        clearTimeout(timer);
        timer = setTimeout(function () { status.textContent = ""; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { done("Copied"); },
          function () { done("Copy failed"); }
        );
      } else {
        done("Copy failed");
      }
    });
  }
})();
