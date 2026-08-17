/* ==========================================================================
   HashFunds — Application core.
   Injects the shared chrome (nav + footer), then wires theme, motion,
   counters, accordions, sliders, forms and the reading progress bar.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ 1. THEME */

  const THEME_KEY = "hf-theme";

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    document.dispatchEvent(new CustomEvent("hf:theme", { detail: t }));
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved || "dark");
  }
  initTheme();

  /* --------------------------------------------------------- 2. NAV DATA */

  const NAV = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "strategies.html", label: "Strategies" },
    { href: "markets.html", label: "Markets" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "insights.html", label: "Insights" },
    { href: "contact.html", label: "Contact" }
  ];

  function currentPage() {
    let p = location.pathname.split("/").pop() || "index.html";
    if (!p.includes(".")) p = "index.html";
    return p;
  }

  const ARW = '<svg class="arw" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildNav() {
    const here = currentPage();
    const links = NAV.map(
      (n) => '<a href="' + n.href + '"' + (n.href === here ? ' class="active" aria-current="page"' : "") + ">" + n.label + "</a>"
    ).join("");

    const el = document.createElement("header");
    el.className = "nav";
    el.innerHTML =
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html" aria-label="HashFunds home">' +
          '<span class="brand-mark">HF</span><span><b>Hash</b><span>Funds</span></span>' +
        "</a>" +
        '<nav class="nav-links" aria-label="Primary">' + links + "</nav>" +
        '<div class="nav-side">' +
          '<button class="theme-btn" id="themeBtn" aria-label="Switch colour theme" title="Switch theme">' +
            '<svg class="i-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
            '<svg class="i-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
          "</button>" +
          '<a class="btn btn-sm" href="dashboard.html">Investor Portal' + ARW + "</a>" +
          '<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><i></i><i></i><i></i></button>' +
        "</div>" +
      "</div>";

    const drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.innerHTML =
      NAV.map((n, i) =>
        '<a class="d-link" href="' + n.href + '" style="animation-delay:' + (0.08 + i * 0.06) + 's">' +
        n.label + "<span>0" + (i + 1) + "</span></a>"
      ).join("") +
      '<div style="margin-top:36px;display:flex;gap:12px;flex-wrap:wrap">' +
        '<a class="btn" href="dashboard.html">Investor Portal' + ARW + "</a>" +
        '<a class="btn btn-ghost" href="contact.html">Book a call</a>' +
      "</div>";

    document.body.prepend(drawer);
    document.body.prepend(el);
    return { el, drawer };
  }

  function buildFooter() {
    const C = window.HF.company;
    const f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-top">' +
          "<div>" +
            '<a class="brand" href="index.html"><span class="brand-mark">HF</span><span><b>Hash</b><span>Funds</span></span></a>' +
            '<p class="muted" style="margin-top:18px;max-width:34ch;font-size:0.9rem">' + C.tagline + "</p>" +
            '<div class="flex gap wrapf" style="margin-top:22px">' +
              C.social.map((s) => '<a href="' + s.href + '" class="tag" aria-label="' + s.label + '">' + s.short + "</a>").join("") +
            "</div>" +
          "</div>" +
          "<div><h4>Strategies</h4><div class=\"footer-links\">" +
            window.HF.services.slice(0, 5).map((s) => '<a href="strategies.html#' + s.slug + '">' + s.title + "</a>").join("") +
          "</div></div>" +
          "<div><h4>Firm</h4><div class=\"footer-links\">" +
            '<a href="about.html">About us</a><a href="about.html#team">Team</a>' +
            '<a href="insights.html">Insights</a><a href="portfolio.html">Portfolio</a>' +
            '<a href="markets.html">Live markets</a><a href="contact.html#careers">Careers</a>' +
          "</div></div>" +
          "<div><h4>Contact</h4><div class=\"footer-links\">" +
            '<a href="mailto:' + C.email + '">' + C.email + "</a>" +
            '<a href="mailto:' + C.press + '">' + C.press + "</a>" +
            '<a href="contact.html">Book a call</a>' +
          "</div>" +
          '<p class="dim" style="font-size:0.8rem;margin-top:16px;line-height:1.7">' + C.address.join("<br>") + "</p>" +
          "</div>" +
        "</div>" +
        '<p class="disclaimer"><b style="color:var(--ink-2)">Important:</b> HashFunds provides investment management services to eligible clients. ' +
        "Nothing on this website is an offer to sell or a solicitation to buy any security, nor is it personalised investment advice. " +
        "Digital assets are volatile and you may lose the entire value of your investment. Past performance is not indicative of future results. " +
        "All figures shown are illustrative unless explicitly marked as audited. Please read the full offering documents and consult your own adviser before investing.</p>" +
        '<div class="footer-bot">' +
          "<span>© " + new Date().getFullYear() + " " + C.name + ". All rights reserved.</span>" +
          '<span class="flex gap-lg wrapf"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Disclosures</a><a href="#">Risk warning</a></span>' +
        "</div>" +
      "</div>";
    document.body.appendChild(f);
  }

  /* ------------------------------------------------------- 3. CHROME BOOT */

  const chrome = buildNav();

  const themeBtn = $("#themeBtn");
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = chrome.drawer.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".d-link", chrome.drawer).forEach((a) =>
    a.addEventListener("click", () => {
      chrome.drawer.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chrome.drawer.classList.contains("open")) burger.click();
  });

  /* Sticky / hide-on-scroll nav + reading progress */
  const prog = document.createElement("div");
  prog.className = "progress";
  document.body.appendChild(prog);

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.body.appendChild(toTop);

  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    chrome.el.classList.toggle("is-stuck", y > 40);
    chrome.el.classList.toggle("is-hidden", y > 400 && y > lastY && !chrome.drawer.classList.contains("open"));
    toTop.classList.toggle("on", y > 700);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------ 4. SCROLL ANIM */

  function initAnim(root) {
    const items = $$("[data-anim]", root || document).filter((el) => !el.dataset.animBound);
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const stagger = parseFloat(el.dataset.stagger || 0);
          if (stagger) {
            Array.from(el.children).forEach((c, i) => {
              c.style.setProperty("--d", i * stagger + "s");
              c.setAttribute("data-anim", c.getAttribute("data-anim") || "up");
              requestAnimationFrame(() => c.classList.add("in"));
            });
          }
          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => { el.dataset.animBound = "1"; io.observe(el); });
  }

  /* Split a heading into line-reveal spans */
  function initReveals() {
    $$("[data-reveal]").forEach((el) => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = "1";
      const html = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = html
        .map((part, i) => '<span class="reveal-line"><span style="--d:' + i * 0.09 + 's">' + part + "</span></span>")
        .join("");
      if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
      const io = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) { el.classList.add("in"); io.disconnect(); }
      }, { threshold: 0.2 });
      io.observe(el);
    });
  }

  /* ------------------------------------------------------- 5. COUNTERS */

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    if (reduce) { el.textContent = prefix + target.toFixed(dec) + suffix; return; }
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + (target * e).toFixed(dec) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    const els = $$("[data-count]").filter((e) => !e.dataset.countBound);
    if (!("IntersectionObserver" in window)) { els.forEach(countUp); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    els.forEach((e) => { e.dataset.countBound = "1"; io.observe(e); });
  }

  /* Animated horizontal bars */
  function initBars() {
    const els = $$(".bar-fill[data-w]").filter((e) => !e.dataset.barBound);
    if (!("IntersectionObserver" in window)) { els.forEach((e) => (e.style.width = e.dataset.w + "%")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => (e.target.style.width = e.target.dataset.w + "%"), 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach((e) => { e.dataset.barBound = "1"; io.observe(e); });
  }

  /* ------------------------------------------------------ 6. ACCORDIONS */

  function initAccordions(root) {
    $$(".acc-q", root || document).forEach((btn) => {
      if (btn.dataset.accBound) return;
      btn.dataset.accBound = "1";
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        const item = btn.closest(".acc-i");
        const group = item.parentElement;
        const isOpen = item.classList.contains("open");
        if (group.dataset.single !== "false") {
          $$(".acc-i.open", group).forEach((o) => {
            o.classList.remove("open");
            const q = $(".acc-q", o); q && q.setAttribute("aria-expanded", "false");
          });
        }
        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* --------------------------------------------------------- 7. SLIDERS */

  function initSliders() {
    $$("[data-slider]").forEach((box) => {
      if (box.dataset.sliderBound) return;
      box.dataset.sliderBound = "1";
      const slides = $$(".slide", box);
      const dotsBox = $(".dots", box.parentElement) || $(".dots", box);
      if (!slides.length) return;
      let i = 0, timer;
      if (dotsBox) {
        dotsBox.innerHTML = slides.map((_, k) => '<button class="dot' + (k === 0 ? " on" : "") + '" aria-label="Slide ' + (k + 1) + '"></button>').join("");
      }
      const dots = dotsBox ? $$(".dot", dotsBox) : [];
      function go(n) {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle("on", k === i));
        dots.forEach((d, k) => d.classList.toggle("on", k === i));
      }
      dots.forEach((d, k) => d.addEventListener("click", () => { go(k); restart(); }));
      function restart() { clearInterval(timer); timer = setInterval(() => go(i + 1), 6500); }
      go(0); restart();
      box.addEventListener("mouseenter", () => clearInterval(timer));
      box.addEventListener("mouseleave", restart);
    });
  }

  /* ----------------------------------------------------------- 8. TOAST */

  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<span class="live-dot"></span><span>' + msg + "</span>";
    toastEl.classList.add("on");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("on"), 4200);
  }
  window.hfToast = toast;

  /* ----------------------------------------------------------- 9. FORMS */

  function initForms() {
    $$("form[data-form]").forEach((form) => {
      if (form.dataset.formBound) return;
      form.dataset.formBound = "1";

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let ok = true;
        $$(".field", form).forEach((f) => {
          const inp = $(".inp", f);
          if (!inp || !inp.hasAttribute("required")) return;
          let bad = !inp.value.trim();
          if (!bad && inp.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
          f.classList.toggle("invalid", bad);
          if (bad) ok = false;
        });
        const consent = $('input[name="consent"]', form);
        if (consent && !consent.checked) {
          ok = false;
          toast("Please confirm you have read the risk disclosure.");
        }
        if (!ok) { if (!consent || consent.checked) toast("Please check the highlighted fields."); return; }

        const btn = $('button[type="submit"]', form);
        const original = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }

        const C = window.HF.company;
        const done = () => {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
        };

        if (!C.formEndpoint) {
          done();
          toast("This form is not connected to a mail service yet.");
          return;
        }

        const payload = new FormData(form);
        // FormSubmit control fields — how the mail is titled, formatted and
        // which address hitting Reply answers to.
        payload.append("_subject", form.dataset.subject || "New enquiry — hashfunds.com");
        payload.append("_template", "table");
        payload.append("_captcha", "false");
        const from = $('input[type="email"]', form);
        if (from && from.value.trim()) payload.append("_replyto", from.value.trim());
        payload.append("Sent from", location.href);

        fetch(C.formEndpoint, {
          method: "POST",
          body: payload,
          headers: { Accept: "application/json" }
        })
          .then((res) => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            done();
            form.reset();
            $$(".field", form).forEach((f) => f.classList.remove("invalid"));
            toast(form.dataset.success || "Thank you — we'll be in touch within one business day.");
          })
          .catch(() => {
            // Never swallow it: a silent failure looks identical to success,
            // and the enquiry is lost. Hand them the address instead.
            done();
            toast("Could not send just now — please email " + C.email + " directly.");
          });
      });

      $$(".inp", form).forEach((inp) =>
        inp.addEventListener("input", () => {
          const f = inp.closest(".field");
          f && f.classList.remove("invalid");
        })
      );
    });
  }

  /* -------------------------------------------------------- 10. LOADER */

  function initLoader() {
    const l = $(".loader");
    if (!l) return;
    const bar = $(".loader-bar i", l);
    const pct = $(".loader-pct", l);
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 22 + 8);
      if (bar) bar.style.width = p + "%";
      if (pct) pct.textContent = String(Math.floor(p)).padStart(3, "0");
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          l.classList.add("done");
          document.body.style.overflow = "";
          document.dispatchEvent(new CustomEvent("hf:loaded"));
        }, 240);
      }
    }, 170);
    document.body.style.overflow = "hidden";
  }

  /* ---------------------------------------------- 11. MAGNETIC + MISC */

  function initMagnetic() {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    $$("[data-magnet]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + x * 0.18 + "px," + y * 0.24 + "px)";
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* Subtle parallax on elements carrying data-parallax="0.15" */
  function initParallax() {
    const els = $$("[data-parallax]");
    if (!els.length || reduce) return;
    let ticking = false;
    function upd() {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translate3d(0," + (-mid * parseFloat(el.dataset.parallax)).toFixed(2) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  }

  /* Tabs: [data-tabs] > [data-tab="id"] buttons and [data-panel="id"] panels */
  function initTabs() {
    $$("[data-tabs]").forEach((box) => {
      if (box.dataset.tabsBound) return;
      box.dataset.tabsBound = "1";
      const scope = (box.dataset.tabs && $("#" + box.dataset.tabs)) || document;
      // Only panels this control actually owns are toggled, so a segmented
      // control that merely emits an event never blanks someone else's panels.
      const owned = $$("[data-tab]", box).map((b) => b.dataset.tab);
      $$("[data-tab]", box).forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.tab;
          $$("[data-tab]", box).forEach((b) => b.classList.toggle("on", b === btn));
          $$("[data-panel]", scope).forEach((p) => {
            if (owned.indexOf(p.dataset.panel) > -1) p.classList.toggle("on", p.dataset.panel === id);
          });
          document.dispatchEvent(new CustomEvent("hf:tab", { detail: id }));
        });
      });
    });
  }

  /* Smooth in-page anchors with nav offset */
  function initAnchors() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  }

  /* Copy-to-clipboard for [data-copy] */
  function initCopy() {
    $$("[data-copy]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(el.dataset.copy);
          toast("Copied: " + el.dataset.copy);
        } catch (err) { toast("Copy failed — please select manually."); }
      })
    );
  }

  /* Hover-to-colour portraits.
     Any <img data-colour> gets a full-colour twin stacked on top of it, which
     the stylesheet wipes into view on hover. All this does is build the layer;
     no pointer handlers, so hovering costs nothing.
     Touch screens have no hover at all, so there a tap toggles it instead —
     otherwise the colour photo would be unreachable on a phone. */
  const noHover = window.matchMedia("(hover: none)").matches;

  function initPhotoReveal(root) {
    $$("img[data-colour]", root || document).forEach((img) => {
      const frame = img.parentElement;
      if (!frame || frame.dataset.photoBound) return;
      frame.dataset.photoBound = "1";

      const layer = document.createElement("span");
      layer.className = "photo-colour";
      layer.setAttribute("aria-hidden", "true");

      const twin = document.createElement("img");
      twin.src = img.currentSrc || img.src;
      twin.alt = "";
      twin.loading = "lazy";
      layer.appendChild(twin);

      frame.classList.add("photo-toggle");
      frame.appendChild(layer);

      if (noHover) {
        frame.addEventListener("click", () => frame.classList.toggle("in-colour"));
      }
    });
  }

  /* Live clock in [data-clock] */
  function initClock() {
    const els = $$("[data-clock]");
    if (!els.length) return;
    function tick() {
      els.forEach((el) => {
        const tz = el.dataset.clock;
        try {
          el.textContent = new Date().toLocaleTimeString("en-GB", {
            timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit"
          });
        } catch (e) { el.textContent = new Date().toLocaleTimeString("en-GB"); }
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------- 12. BOOT */

  function boot() {
    if (window.HFRender) window.HFRender.all();
    buildFooter();
    initLoader();
    initAnim();
    initReveals();
    initCounters();
    initBars();
    initAccordions();
    initSliders();
    initForms();
    initMagnetic();
    initParallax();
    initTabs();
    initAnchors();
    initCopy();
    initPhotoReveal();
    initClock();
    onScroll();
  }

  // Re-runnable so pages that inject markup later can refresh behaviours.
  window.hfRefresh = function (root) {
    if (window.HFRender) { window.HFRender.all(root); window.HFRender.imgFallback(root); }
    initAnim(root);
    initReveals();
    initCounters();
    initBars();
    initAccordions(root);
    initCopy();
    initPhotoReveal(root);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
