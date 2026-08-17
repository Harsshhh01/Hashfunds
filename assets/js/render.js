/* ==========================================================================
   HashFunds — Content renderers.
   Pages declare an empty host, e.g. <div data-render="services"></div>,
   and this module fills it from data.js. Change copy in one place.
   ========================================================================== */

window.HFRender = (function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const D = () => window.HF;

  const ARW = '<svg class="arw" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const ICONS = {
    layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    scales: '<path d="M12 4v16M6 8h12M4 8l-2 6h4l-2-6ZM20 8l-2 6h4l-2-6ZM8 20h8"/>',
    seed:   '<path d="M12 21c0-6 3-9 8-9 0 6-3 9-8 9ZM12 21c0-6-3-9-8-9 0 6 3 9 8 9ZM12 21V9"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    vault:  '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="12" cy="12" r="4"/><path d="M12 8v1M12 15v1M8 12h1M15 12h1"/>',
    scope:  '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5M11 8v6M8 11h6"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.layers) + "</svg>";
  }

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  /* ------------------------------------------------------------ blocks */

  const R = {
    stats(host) {
      host.innerHTML = D().stats.map((s) => {
        // A stat is either a plain string or an animated counter.
        const value = s.text !== undefined
          ? "<span>" + s.text + "</span>"
          : '<span data-count="' + s.v + '" data-dec="' + (s.dec || 0) +
            '" data-prefix="' + (s.prefix || "") + '" data-suffix="' + (s.suffix || "") + '">0</span>';
        return '<div class="stat"><div class="stat-v">' + value + "</div>" +
          '<div class="stat-l">' + s.label + "</div></div>";
      }).join("");
    },

    services(host) {
      const limit = parseInt(host.dataset.limit || "99", 10);
      host.innerHTML = D().services.slice(0, limit).map((s) =>
        '<a class="svc" href="strategies.html#' + s.slug + '" data-anim>' +
          '<div class="svc-n">' + s.n + " / " + s.title.toUpperCase() + "</div>" +
          '<div class="svc-ico">' + icon(s.icon) + "</div>" +
          "<h3 class=\"h3\">" + s.title + "</h3>" +
          '<p class="svc-d">' + s.short + "</p>" +
          '<span class="svc-more">Explore' + ARW + "</span>" +
        "</a>"
      ).join("");
    },

    servicesFull(host) {
      host.innerHTML = D().services.map((s, i) =>
        '<article class="section-tight" id="' + s.slug + '" style="border-top:1px solid var(--line)">' +
          '<div class="split split-40" style="align-items:start">' +
            '<div data-anim="left">' +
              '<div class="svc-n">' + s.n + "</div>" +
              '<h2 class="h2" style="margin-top:14px">' + s.title + "</h2>" +
              '<div class="metric-strip" style="margin-top:26px;border-left:0;border-right:0">' +
                '<div><div class="kpi-l">Minimum</div><div class="num" style="margin-top:7px">' + s.min + "</div></div>" +
                '<div><div class="kpi-l">Lock-up</div><div class="num" style="margin-top:7px">' + s.lockup + "</div></div>" +
                '<div><div class="kpi-l">Fee</div><div class="num" style="margin-top:7px">' + s.fee + "</div></div>" +
              "</div>" +
            "</div>" +
            '<div data-anim="right">' +
              '<div class="svc-ico" style="margin-top:0">' + icon(s.icon) + "</div>" +
              '<p class="lede" style="margin-bottom:22px">' + s.short + "</p>" +
              "<p class=\"muted\">" + s.body + "</p>" +
              '<ul class="big-list" style="margin-top:30px">' +
                s.points.map((p) => '<div class="li"><span class="lt" style="font-size:1rem;font-family:var(--f-sans)">' + p + '</span><span class="dim num">✓</span></div>').join("") +
              "</ul>" +
              '<a class="btn mt" href="contact.html?strategy=' + s.slug + '">Enquire about ' + s.title + ARW + "</a>" +
            "</div>" +
          "</div>" +
        "</article>"
      ).join("");
    },

    pillars(host) {
      host.innerHTML = D().pillars.map((p, i) =>
        '<div class="card" data-anim style="--d:' + i * 0.08 + 's">' +
          '<div class="svc-n">' + String(i + 1).padStart(2, "0") + "</div>" +
          '<h3 class="h3" style="margin:16px 0 10px">' + p.t + "</h3>" +
          '<p class="muted" style="font-size:0.92rem">' + p.d + "</p>" +
        "</div>"
      ).join("");
    },

    timeline(host) {
      host.innerHTML = '<div class="tl">' + D().timeline.map((t) =>
        '<div class="tl-i" data-anim>' +
          '<div class="tl-y">' + t.y + "</div>" +
          '<h3 class="h3">' + t.t + "</h3>" +
          '<p class="muted" style="font-size:0.92rem;max-width:56ch">' + t.d + "</p>" +
        "</div>"
      ).join("") + "</div>";
    },

    team(host) {
      const people = D().team;

      // A single founder gets a feature layout — one card marooned in a
      // four-column grid reads like the other three slots failed to load.
      if (people.length === 1) {
        const p = people[0];
        host.className = "split";
        host.innerHTML =
          '<div data-anim="left">' +
            '<div class="person-img" style="max-width:420px">' +
              '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" data-colour data-fallback="' + p.name + '">' +
            "</div>" +
          "</div>" +
          '<div data-anim="right">' +
            '<h3 class="h2">' + p.name + "</h3>" +
            '<div class="person-role" style="margin-top:10px">' + p.role + "</div>" +
            '<p class="lede" style="margin-top:22px">' + p.bio + "</p>" +
            '<div class="flex gap wrapf" style="margin-top:24px">' +
              p.focus.map((f) => '<span class="tag">' + f + "</span>").join("") +
            "</div>" +
            '<a class="link-u" style="margin-top:28px" href="' + p.linked + '">Connect on LinkedIn' + ARW + "</a>" +
          "</div>";
        return;
      }

      host.innerHTML = people.map((p, i) =>
        '<div class="person" data-anim style="--d:' + i * 0.07 + 's">' +
          '<div class="person-img"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy" data-fallback="' + p.name + '"></div>' +
          '<div class="person-meta"><div><div class="h3">' + p.name + "</div>" +
          '<div class="person-role" style="margin-top:6px">' + p.role + "</div></div>" +
          '<a href="' + p.linked + '" class="tag" aria-label="' + p.name + ' profile">IN</a></div>' +
          '<p class="muted" style="font-size:0.88rem;margin-top:14px">' + p.bio + "</p>" +
          '<div class="flex gap wrapf" style="margin-top:14px">' + p.focus.map((f) => '<span class="tag">' + f + "</span>").join("") + "</div>" +
        "</div>"
      ).join("");
    },

    testimonials(host) {
      if (!D().testimonials.length) return hideSection(host);
      host.innerHTML = '<div class="slides" data-slider>' + D().testimonials.map((t, i) =>
        '<figure class="slide' + (i === 0 ? " on" : "") + '">' +
          '<blockquote class="quote">“' + t.q + "”</blockquote>" +
          '<figcaption style="margin-top:26px" class="dim"><span class="num">' + t.a + "</span> · " + t.o + "</figcaption>" +
        "</figure>"
      ).join("") + '</div><div class="dots"></div>';
    },

    insights(host) {
      const limit = parseInt(host.dataset.limit || "99", 10);
      const list = D().insights.slice(0, limit);

      if (!list.length) {
        // On a preview (homepage) drop the whole section; on the archive page
        // say plainly that nothing is published rather than faking a catalogue.
        if (host.dataset.limit) return hideSection(host);
        host.innerHTML =
          '<div style="border-top:1px solid var(--line);border-bottom:1px solid var(--line);' +
          'padding:clamp(48px,8vw,90px) 0;text-align:center">' +
            '<div class="h3" style="max-width:34ch;margin-inline:auto">Nothing published yet.</div>' +
            '<p class="muted" style="margin-top:14px;max-width:52ch;margin-inline:auto;font-size:0.92rem">' +
            "The first research notes are being written. Subscribe below and they will reach you " +
            "before they reach anywhere else.</p>" +
          "</div>";
        return;
      }

      host.innerHTML = list.map((p) =>
        '<a class="post" href="insights.html#' + encodeURIComponent(p.t.slice(0, 24)) + '" data-cat="' + p.c + '" data-anim>' +
          '<div class="post-date">' + fmtDate(p.d) + "</div>" +
          "<div><h3 class=\"h3\">" + p.t + "</h3><p>" + p.x + "</p>" +
          '<div class="post-tags"><span class="tag">' + p.c + '</span><span class="tag">' + p.r + " min read</span></div></div>" +
          '<div class="post-arw">' + ARW + "</div>" +
        "</a>"
      ).join("");
    },

    insightFilters(host) {
      if (!D().insights.length) { host.style.display = "none"; return; }
      const cats = ["All"].concat(Array.from(new Set(D().insights.map((i) => i.c))));
      host.innerHTML = cats.map((c, i) =>
        '<button class="tag' + (i === 0 ? " on" : "") + '" data-filter="' + c + '">' + c + "</button>"
      ).join("");
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-filter]");
        if (!b) return;
        $$("[data-filter]", host).forEach((x) => x.classList.toggle("on", x === b));
        const c = b.dataset.filter;
        $$(".post").forEach((p) => {
          const show = c === "All" || p.dataset.cat === c;
          p.style.display = show ? "" : "none";
        });
        const n = $$(".post").filter((p) => p.style.display !== "none").length;
        const cnt = $("[data-count-posts]");
        if (cnt) cnt.textContent = String(n).padStart(2, "0");
      });
    },

    faqs(host) {
      host.innerHTML = D().faqs.map((f) =>
        '<div class="acc-i">' +
          '<button class="acc-q">' + f.q + '<span class="acc-sign"></span></button>' +
          '<div class="acc-a"><div><p>' + f.a + "</p></div></div>" +
        "</div>"
      ).join("");
    },

    allocation(host) {
      host.innerHTML = D().allocation.map((a) =>
        '<div class="bar-row">' +
          '<span class="bl">' + a.k + "</span>" +
          '<span class="bar-track"><span class="bar-fill ' + (a.pattern === "solid" ? "" : a.pattern) + '" data-w="' + (a.v / 34) * 100 + '"></span></span>' +
          '<span class="bv">' + a.v.toFixed(1) + "%</span>" +
        "</div>"
      ).join("");
    },

    allocationLegend(host) {
      host.innerHTML = D().allocation.map((a) => {
        const style =
          a.pattern === "hatch" ? "background:repeating-linear-gradient(45deg,var(--ink) 0 2px,transparent 2px 4px)" :
          a.pattern === "dots" ? "background-image:radial-gradient(var(--ink) 1px,transparent 1.1px);background-size:4px 4px" :
          a.pattern === "half" ? "background:var(--ink);opacity:0.45" : "background:var(--ink)";
        return '<span class="legend-i"><span class="legend-sw" style="' + style + '"></span>' + a.k + " · " + a.v + "%</span>";
      }).join("");
    },

    holdings(host) {
      const b = $("tbody", host) || host;
      b.innerHTML = D().holdings.map((h) =>
        "<tr>" +
          '<td><div class="coin"><span class="coin-sym">' + h.s.slice(0, 4) + "</span><div>" + h.a + "</div></div></td>" +
          '<td class="t-r num">' + h.w.toFixed(1) + "%</td>" +
          '<td class="t-r num delta ' + (parseFloat(h.e) >= 0 ? "up" : "dn") + '">' + h.e.replace("-", "").replace("+", "") + "</td>" +
          '<td class="t-r num">' + (h.p >= 1000 ? "$" + h.p.toLocaleString("en-US") : "$" + h.p.toFixed(2)) + "</td>" +
          '<td class="t-r num ' + (h.r.startsWith("-") ? "dn" : h.r === "—" ? "dim" : "up") + '">' + h.r + "</td>" +
        "</tr>"
      ).join("");
    },

    transactions(host) {
      const b = $("tbody", host) || host;
      b.innerHTML = D().transactions.map((t) =>
        "<tr>" +
          '<td class="num dim">' + fmtDate(t.d) + "</td>" +
          "<td>" + t.t + "</td>" +
          '<td class="num">' + t.a + "</td>" +
          '<td class="t-r num">' + t.q + "</td>" +
          '<td class="t-r num">' + t.v + "</td>" +
          '<td class="t-r"><span class="pill">' + t.s + "</span></td>" +
        "</tr>"
      ).join("");
    },

    roadmap(host) {
      host.innerHTML = D().roadmap.map((r, i) =>
        '<div class="li" data-anim style="--d:' + i * 0.06 + 's;align-items:flex-start">' +
          '<div style="display:flex;gap:clamp(14px,2.5vw,28px);align-items:flex-start">' +
            '<span class="svc-n" style="padding-top:6px">' + r.n + "</span>" +
            "<div>" +
              '<div class="lt">' + r.t + "</div>" +
              '<p class="muted" style="font-size:0.9rem;margin-top:8px;max-width:60ch">' + r.d + "</p>" +
            "</div>" +
          "</div>" +
          '<span class="pill" style="flex:none">' + r.s + "</span>" +
        "</div>"
      ).join("");
    },

    riskMetrics(host) {
      host.innerHTML = D().riskMetrics.map((m) =>
        '<div><div class="kpi-l">' + m.k + "</div>" +
        '<div class="num" style="font-size:1.5rem;margin-top:10px">' + m.v + "</div>" +
        '<div class="dim" style="font-size:0.74rem;margin-top:5px">' + m.n + "</div></div>"
      ).join("");
    }
  };

  /* Remove the whole section a host sits in — used when a data array is empty
     so the page never shows a heading with nothing under it. */
  function hideSection(host) {
    const sec = host.closest("section") || host;
    sec.style.display = "none";
  }

  /* --------------------------------------------------------- img fallback */

  function imgFallback(root) {
    $$("img[data-fallback]", root || document).forEach((img) => {
      if (img.dataset.fbBound) return;
      img.dataset.fbBound = "1";
      const fail = () => {
        const box = img.parentElement;
        if (!box) return;
        box.classList.add("img-missing");
        box.setAttribute("data-missing", img.dataset.fallback || "Photo");
        img.style.display = "none";
      };
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  }

  function all(root) {
    $$("[data-render]", root || document).forEach((host) => {
      const fn = R[host.dataset.render];
      if (fn && !host.dataset.rendered) {
        host.dataset.rendered = "1";
        fn(host);
      }
    });
    imgFallback(root);
  }

  return { all, blocks: R, icon, fmtDate, imgFallback };
})();
