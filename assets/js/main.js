/* Structurre — scripts communs à toutes les pages */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * 1. Filet de sécurité Tailwind
   * Si assets/css/tailwind.css n'a pas encore été généré (`npm run build`),
   * on charge le compilateur Tailwind navigateur pour garder la page stylée.
   * En production, ce test est faux et rien n'est téléchargé.
   * ----------------------------------------------------------------- */
  function ensureTailwind() {
    var probe = document.createElement("div");
    probe.className = "hidden";
    document.body.appendChild(probe);
    var built = getComputedStyle(probe).display === "none";
    probe.remove();
    if (built) return;

    console.warn(
      "[Structurre] tailwind.css absent — chargement du compilateur navigateur. " +
        "Lancez `npm run build` pour la version optimisée."
    );
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
   * 2. Menu mobile
   * ----------------------------------------------------------------- */
  function initNav() {
    var btn = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-menu-panel]");
    if (!btn || !panel) return;

    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("hidden", !open);
      document.documentElement.classList.toggle("overflow-hidden", open);
    }

    btn.addEventListener("click", function () {
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
   * 3. En-tête : ombre au scroll
   * ----------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("shadow-md", window.scrollY > 8);
      header.classList.toggle("border-slate-200", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
   * 4. Apparition au scroll
   * ----------------------------------------------------------------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;

    var ticking = false;
    var ro = null;

    function check() {
      ticking = false;
      var h = window.innerHeight || document.documentElement.clientHeight;
      // Un simple test de position couvre aussi les éléments franchis d'un seul
      // coup (scroll rapide, ancre, retour arrière) — cas où un
      // IntersectionObserver ne déclencherait jamais.
      items = items.filter(function (el) {
        if (el.getBoundingClientRect().top >= h * 0.9) return true;
        el.classList.add("is-visible");
        return false;
      });
      if (!items.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.removeEventListener("load", onScroll);
        if (ro) ro.disconnect();
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(check);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", onScroll);

    // La hauteur de page bouge encore après le premier rendu (polices, images,
    // CSS chargée tardivement) : on re-teste à chaque changement de gabarit.
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(onScroll);
      ro.observe(document.body);
    }

    check();
  }

  /* ------------------------------------------------------------------
   * 5. Divers : année courante, lien actif
   * ----------------------------------------------------------------- */
  function initMisc() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    var page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
    document.querySelectorAll("[data-nav-link]").forEach(function (link) {
      var target = link.getAttribute("data-nav-link");
      if (target === page || (page === "" && target === "index")) {
        // On retire la couleur par défaut : deux classes de couleur Tailwind
        // sur le même élément se départagent par l'ordre du fichier CSS.
        link.classList.remove("text-slate-700");
        link.classList.add("text-amber-700", "font-semibold");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function boot() {
    ensureTailwind();
    initNav();
    initHeader();
    initReveal();
    initMisc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
