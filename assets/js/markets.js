/* ==========================================================================
   HashFunds — Live market data.
   Pulls from CoinGecko's public API and degrades to bundled sample data
   when the network or rate limit says no. Every consumer renders the same
   shape, so nothing on the page knows which source it got.
   ========================================================================== */

window.HFMarkets = (function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const IDS = [
    "bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano",
    "chainlink", "avalanche-2", "aave", "uniswap", "polkadot", "litecoin"
  ];

  const API =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
    IDS.join(",") +
    "&order=market_cap_desc&sparkline=true&price_change_percentage=24h,7d";

  const CACHE_KEY = "hf-mkt-cache";
  const CACHE_TTL = 90 * 1000;

  let state = { rows: [], live: false, at: null };
  const subs = [];

  /* ------------------------------------------------------------ format */

  function money(n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    if (n >= 1000) return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (n >= 1) return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }

  function big(n) {
    if (!n && n !== 0) return "—";
    const u = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]];
    for (const [d, s] of u) if (n >= d) return "$" + (n / d).toFixed(2) + s;
    return "$" + n.toFixed(0);
  }

  function pct(n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
  }

  /* ------------------------------------------------------------- fetch */

  function normalise(raw) {
    return raw.map((c) => ({
      id: c.id,
      symbol: (c.symbol || "").toUpperCase(),
      name: c.name,
      price: c.current_price,
      ch24: c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0,
      ch7: c.price_change_percentage_7d_in_currency ?? 0,
      cap: c.market_cap,
      vol: c.total_volume,
      high: c.high_24h,
      low: c.low_24h,
      supply: c.circulating_supply,
      spark: (c.sparkline_in_7d && c.sparkline_in_7d.price
        ? c.sparkline_in_7d.price.filter((_, i, a) => i % Math.ceil(a.length / 24) === 0)
        : [])
    }));
  }

  function readCache() {
    try {
      const raw = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (raw && Date.now() - raw.at < CACHE_TTL) return raw;
    } catch (e) {}
    return null;
  }

  async function load(force) {
    const cached = !force && readCache();
    if (cached) {
      state = { rows: cached.rows, live: true, at: new Date(cached.at) };
      emit();
      return state;
    }
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 8000);
      const res = await fetch(API, { signal: ctl.signal, headers: { accept: "application/json" } });
      clearTimeout(to);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      if (!Array.isArray(json) || !json.length) throw new Error("empty payload");
      const rows = normalise(json);
      state = { rows, live: true, at: new Date() };
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rows, at: Date.now() })); } catch (e) {}
    } catch (err) {
      state = { rows: window.HF.fallbackMarkets.slice(), live: false, at: new Date() };
    }
    emit();
    return state;
  }

  function emit() { subs.forEach((fn) => { try { fn(state); } catch (e) {} }); }
  function subscribe(fn) { subs.push(fn); if (state.rows.length) fn(state); return () => subs.splice(subs.indexOf(fn), 1); }

  /* Status stamps can live anywhere on the page, so resolve them globally. */
  function stampAll(s) {
    $$("[data-stamp]").forEach((el) => {
      el.textContent = (s.live ? "Live" : "Sample data") + " · updated " +
        s.at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    });
  }

  /* ------------------------------------------------------------ ticker */

  function renderTicker(host) {
    if (!host) return;
    function paint(s) {
      const one = s.rows
        .map((c) =>
          '<div class="tick"><b>' + c.symbol + '</b>' +
          '<span class="p">' + money(c.price) + "</span>" +
          '<span class="c ' + (c.ch24 >= 0 ? "up" : "dn") + '">' + Math.abs(c.ch24).toFixed(2) + "%</span></div>"
        ).join("");
      const track = $(".ticker-track", host);
      // Duplicated once so the -50% translate loop is seamless.
      track.innerHTML = one + one;
    }
    subscribe(paint);
  }

  /* ------------------------------------------------------------- table */

  function renderTable(host, opts) {
    if (!host) return;
    const o = Object.assign({ search: null, limit: 100 }, opts || {});
    let sortKey = "cap", sortDir = -1, query = "";

    function rows(s) {
      let r = s.rows.slice();
      if (query) {
        const q = query.toLowerCase();
        r = r.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
      }
      r.sort((a, b) => {
        const A = a[sortKey], B = b[sortKey];
        if (typeof A === "string") return A.localeCompare(B) * sortDir;
        return ((A ?? 0) - (B ?? 0)) * sortDir;
      });
      return r.slice(0, o.limit);
    }

    function paint(s) {
      const body = $("tbody", host);
      const list = rows(s);
      if (!list.length) {
        body.innerHTML = '<tr><td colspan="7" style="padding:40px;text-align:center" class="dim">No assets match “' + query + '”.</td></tr>';
        return;
      }
      body.innerHTML = list.map((c, i) =>
        "<tr>" +
          '<td class="dim num">' + String(i + 1).padStart(2, "0") + "</td>" +
          '<td><div class="coin"><span class="coin-sym">' + c.symbol.slice(0, 4) + "</span>" +
            "<div><div>" + c.name + '</div><div class="dim num" style="font-size:0.74rem">' + c.symbol + "</div></div></div></td>" +
          '<td class="t-r num">' + money(c.price) + "</td>" +
          '<td class="t-r num delta ' + (c.ch24 >= 0 ? "up" : "dn") + '">' + Math.abs(c.ch24).toFixed(2) + "%</td>" +
          '<td class="t-r num delta ' + (c.ch7 >= 0 ? "up" : "dn") + '">' + Math.abs(c.ch7 || 0).toFixed(2) + "%</td>" +
          '<td class="t-r num dim">' + big(c.cap) + "</td>" +
          '<td class="t-r"><div class="sparkcell" style="display:flex;justify-content:flex-end"></div></td>' +
        "</tr>"
      ).join("");

      // Sparklines are drawn after the row HTML lands.
      $$(".sparkcell", body).forEach((cell, i) => {
        if (list[i] && list[i].spark && list[i].spark.length > 1) {
          window.HFChart.sparkline(cell, list[i].spark);
        }
      });

    }

    $$("th.sortable", host).forEach((th) => {
      th.addEventListener("click", () => {
        const k = th.dataset.key;
        if (k === sortKey) sortDir *= -1;
        else { sortKey = k; sortDir = -1; }
        $$("th.sortable", host).forEach((x) => x.removeAttribute("aria-sort"));
        th.setAttribute("aria-sort", sortDir === -1 ? "descending" : "ascending");
        $(".caret", th).textContent = sortDir === -1 ? "↓" : "↑";
        paint(state);
      });
    });

    if (o.search) {
      const inp = $(o.search);
      inp && inp.addEventListener("input", (e) => { query = e.target.value.trim(); paint(state); });
    }

    subscribe(paint);
  }

  /* --------------------------------------------------------- highlights */

  function renderHighlights(host) {
    if (!host) return;
    subscribe((s) => {
      const byCh = s.rows.slice().sort((a, b) => b.ch24 - a.ch24);
      const top = byCh[0], worst = byCh[byCh.length - 1];
      const byVol = s.rows.slice().sort((a, b) => b.vol - a.vol)[0];
      const totalCap = s.rows.reduce((t, c) => t + (c.cap || 0), 0);
      const btc = s.rows.find((c) => c.symbol === "BTC");
      const dom = btc && totalCap ? ((btc.cap / totalCap) * 100).toFixed(1) : "—";

      const cards = [
        { l: "Top gainer, 24h", v: top.symbol, d: pct(top.ch24), up: true },
        { l: "Largest decline", v: worst.symbol, d: pct(worst.ch24), up: worst.ch24 >= 0 },
        { l: "Highest volume", v: byVol.symbol, d: big(byVol.vol), up: null },
        { l: "BTC share of tracked cap", v: dom + "%", d: "Of " + big(totalCap), up: null }
      ];
      host.innerHTML = cards.map((c) =>
        '<div class="kpi"><span class="kpi-l">' + c.l + "</span>" +
        '<div><div class="kpi-v">' + c.v + "</div>" +
        '<div class="kpi-d ' + (c.up === null ? "dim" : c.up ? "up delta" : "dn delta") + '">' +
        (c.up === null ? c.d : c.d.replace(/^[+-]/, "")) + "</div></div></div>"
      ).join("");
    });
  }

  /* ------------------------------------------------------ fear & greed */

  async function fearGreed(canvas, numEl, labelEl) {
    let value = 62, label = "Greed";
    try {
      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), 6000);
      const r = await fetch("https://api.alternative.me/fng/?limit=1", { signal: ctl.signal });
      const j = await r.json();
      if (j && j.data && j.data[0]) {
        value = parseInt(j.data[0].value, 10);
        label = j.data[0].value_classification;
      }
    } catch (e) { /* bundled default stands in */ }
    if (numEl) numEl.textContent = value;
    if (labelEl) labelEl.textContent = label;
    if (canvas) window.HFChart.gauge(canvas, { value });
  }

  /* --------------------------------------------------------------- init */

  function init() {
    subscribe(stampAll);
    renderTicker($("[data-ticker]"));
    renderHighlights($("[data-highlights]"));
    const tbl = $("[data-market-table]");
    if (tbl) renderTable(tbl, { search: "#mktSearch" });

    const fg = $("#fearGauge");
    if (fg) fearGreed(fg, $("#fearNum"), $("#fearLabel"));

    load();
    // Refresh while the tab is visible; pause when it is not.
    setInterval(() => { if (!document.hidden) load(true); }, 60000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });

    const rb = $("[data-refresh]");
    if (rb) rb.addEventListener("click", async () => {
      rb.disabled = true;
      const t = rb.textContent;
      rb.textContent = "Refreshing…";
      await load(true);
      rb.disabled = false;
      rb.textContent = t;
      window.hfToast && window.hfToast(state.live ? "Market data refreshed." : "Live feed unavailable — showing sample data.");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return { load, subscribe, money, big, pct, get state() { return state; } };
})();
