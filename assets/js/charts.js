/* ==========================================================================
   HashFunds — Monochrome canvas chart engine.
   No dependencies. Series are distinguished by line style and fill pattern
   rather than colour, so everything stays legible in pure black & white.
   ========================================================================== */

window.HFChart = (function () {
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

  function css(name, el) {
    return getComputedStyle(el || document.documentElement).getPropertyValue(name).trim();
  }

  function palette(el) {
    return {
      ink: css("--ink", el) || "#fff",
      ink2: css("--ink-2", el) || "#b4b4b4",
      ink3: css("--ink-3", el) || "#6e6e6e",
      line: css("--line", el) || "#262626",
      line2: css("--line-2", el) || "#3d3d3d",
      bg: css("--bg", el) || "#000"
    };
  }

  function setup(canvas) {
    const r = canvas.getBoundingClientRect();
    const d = DPR();
    canvas.width = Math.max(1, Math.floor(r.width * d));
    canvas.height = Math.max(1, Math.floor(r.height * d));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, r.width, r.height);
    return { ctx, w: r.width, h: r.height };
  }

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animate(dur, step, done) {
    const t0 = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || dur === 0) { step(1); done && done(); return { cancel() {} }; }
    let raf;
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur);
      step(easeOut(t));
      if (t < 1) raf = requestAnimationFrame(frame);
      else done && done();
    }
    raf = requestAnimationFrame(frame);
    return { cancel() { cancelAnimationFrame(raf); } };
  }

  function fmtNum(n, dec) {
    if (dec === undefined) dec = Math.abs(n) >= 100 ? 0 : 2;
    return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  /* Diagonal-hatch / dot fill patterns so areas stay distinguishable in mono. */
  function makePattern(ctx, kind, color, bg) {
    const c = document.createElement("canvas");
    const s = kind === "dots" ? 6 : 8;
    c.width = c.height = s;
    const p = c.getContext("2d");
    p.fillStyle = bg;
    p.fillRect(0, 0, s, s);
    p.strokeStyle = color;
    p.fillStyle = color;
    if (kind === "hatch") {
      p.lineWidth = 1.4;
      p.beginPath();
      p.moveTo(-1, s + 1); p.lineTo(s + 1, -1);
      p.moveTo(-1, 1); p.lineTo(1, -1);
      p.moveTo(s - 1, s + 1); p.lineTo(s + 1, s - 1);
      p.stroke();
    } else if (kind === "cross") {
      p.lineWidth = 1;
      p.beginPath();
      p.moveTo(-1, s + 1); p.lineTo(s + 1, -1);
      p.moveTo(-1, -1); p.lineTo(s + 1, s + 1);
      p.stroke();
    } else if (kind === "dots") {
      p.beginPath();
      p.arc(s / 2, s / 2, 1.1, 0, Math.PI * 2);
      p.fill();
    } else if (kind === "half") {
      p.globalAlpha = 0.42;
      p.fillRect(0, 0, s, s);
    } else {
      p.fillRect(0, 0, s, s);
    }
    return ctx.createPattern(c, "repeat");
  }

  const DASH = { solid: [], dash: [7, 5], dot: [1.5, 4], dashdot: [9, 4, 2, 4] };

  /* ---------------------------------------------------------------- LINE */

  function line(canvas, opts) {
    const o = Object.assign({
      labels: [], series: [], fill: true, pad: { t: 18, r: 16, b: 30, l: 52 },
      yFormat: (v) => fmtNum(v, 0), grid: 5, animate: true, baseline: null
    }, opts);

    const host = canvas.closest(".chart-canvas") || canvas.parentElement;
    let tip = host && host.querySelector(".chart-tip");
    if (host && !tip) {
      tip = document.createElement("div");
      tip.className = "chart-tip";
      host.style.position = host.style.position || "relative";
      host.appendChild(tip);
    }

    let hoverIdx = -1;
    let progress = o.animate ? 0 : 1;

    const all = o.series.flatMap((s) => s.data).filter((n) => typeof n === "number");
    let min = Math.min.apply(null, all);
    let max = Math.max.apply(null, all);
    const span = (max - min) || 1;
    min -= span * 0.12;
    max += span * 0.12;

    function draw() {
      const { ctx, w, h } = setup(canvas);
      const P = palette(canvas);
      const pad = o.pad;
      const iw = w - pad.l - pad.r;
      const ih = h - pad.t - pad.b;
      if (iw <= 0 || ih <= 0) return;

      const X = (i) => pad.l + (o.labels.length <= 1 ? 0 : (i / (o.labels.length - 1)) * iw);
      const Y = (v) => pad.t + ih - ((v - min) / (max - min)) * ih;

      // grid + y axis
      ctx.strokeStyle = P.line;
      ctx.fillStyle = P.ink3;
      ctx.lineWidth = 1;
      ctx.font = '10px ui-monospace, "JetBrains Mono", monospace';
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let g = 0; g <= o.grid; g++) {
        const v = min + ((max - min) * g) / o.grid;
        const y = Math.round(Y(v)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
        ctx.fillText(o.yFormat(v), pad.l - 10, y);
      }

      // x labels — thinned to fit
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const every = Math.max(1, Math.ceil(o.labels.length / Math.max(2, Math.floor(iw / 62))));
      o.labels.forEach((lb, i) => {
        if (i % every !== 0 && i !== o.labels.length - 1) return;
        ctx.fillStyle = P.ink3;
        ctx.fillText(lb, X(i), h - pad.b + 10);
      });

      if (o.baseline !== null) {
        ctx.save();
        ctx.strokeStyle = P.line2;
        ctx.setLineDash([3, 4]);
        const y = Math.round(Y(o.baseline)) + 0.5;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.restore();
      }

      const shown = Math.max(1, Math.round(progress * (o.labels.length - 1)));

      o.series.forEach((s, si) => {
        const style = s.style || (si === 0 ? "solid" : si === 1 ? "dash" : "dot");
        const isPrimary = si === 0;

        if (o.fill && isPrimary) {
          const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ih);
          grad.addColorStop(0, "rgba(255,255,255,0.10)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          const isLight = document.documentElement.getAttribute("data-theme") === "light";
          if (isLight) {
            grad.addColorStop(0, "rgba(0,0,0,0.09)");
            grad.addColorStop(1, "rgba(0,0,0,0)");
          }
          ctx.beginPath();
          ctx.moveTo(X(0), Y(s.data[0]));
          for (let i = 1; i <= shown; i++) ctx.lineTo(X(i), Y(s.data[i]));
          ctx.lineTo(X(shown), pad.t + ih);
          ctx.lineTo(X(0), pad.t + ih);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.save();
        ctx.strokeStyle = isPrimary ? P.ink : P.ink3;
        ctx.lineWidth = isPrimary ? 2 : 1.4;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.setLineDash(DASH[style] || []);
        ctx.beginPath();
        ctx.moveTo(X(0), Y(s.data[0]));
        for (let i = 1; i <= shown; i++) ctx.lineTo(X(i), Y(s.data[i]));
        ctx.stroke();
        ctx.restore();

        // leading dot
        if (progress >= 0.999 && isPrimary) {
          ctx.fillStyle = P.ink;
          ctx.strokeStyle = P.bg;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(X(o.labels.length - 1), Y(s.data[o.labels.length - 1]), 3.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });

      // crosshair
      if (hoverIdx >= 0 && progress >= 0.999) {
        const x = Math.round(X(hoverIdx)) + 0.5;
        ctx.save();
        ctx.strokeStyle = P.line2;
        ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ih); ctx.stroke();
        ctx.restore();
        o.series.forEach((s, si) => {
          ctx.fillStyle = si === 0 ? P.ink : P.bg;
          ctx.strokeStyle = si === 0 ? P.bg : P.ink3;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(x, Y(s.data[hoverIdx]), 4, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
        });
      }
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const iw = r.width - o.pad.l - o.pad.r;
      const rel = (cx - o.pad.l) / iw;
      const i = Math.round(rel * (o.labels.length - 1));
      const clamped = Math.max(0, Math.min(o.labels.length - 1, i));
      if (clamped === hoverIdx) return;
      hoverIdx = clamped;
      draw();
      if (tip) {
        const x = o.pad.l + (hoverIdx / (o.labels.length - 1)) * iw;
        tip.style.left = x + "px";
        tip.style.top = (o.pad.t + 6) + "px";
        tip.innerHTML =
          "<b>" + o.labels[hoverIdx] + "</b><br>" +
          o.series.map((s) => s.name + ": " + (s.format ? s.format(s.data[hoverIdx]) : fmtNum(s.data[hoverIdx]))).join("<br>");
        tip.classList.add("on");
      }
    }
    function onLeave() { hoverIdx = -1; draw(); tip && tip.classList.remove("on"); }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchend", onLeave);

    function run() {
      if (o.animate) animate(1100, (t) => { progress = t; draw(); });
      else draw();
    }

    const api = {
      redraw: draw,
      replay: run,
      update(series, labels) {
        if (labels) o.labels = labels;
        o.series = series;
        const a = series.flatMap((s) => s.data);
        min = Math.min.apply(null, a); max = Math.max.apply(null, a);
        const sp = (max - min) || 1;
        min -= sp * 0.12; max += sp * 0.12;
        progress = 0;
        run();
      }
    };
    register(canvas, api, run);
    return api;
  }

  /* --------------------------------------------------------------- DONUT */

  function donut(canvas, opts) {
    const o = Object.assign({ data: [], thickness: 0.34, animate: true, center: null }, opts);
    let progress = o.animate ? 0 : 1;
    let hover = -1;

    const host = canvas.closest(".chart-canvas") || canvas.parentElement;
    let tip = host && host.querySelector(".chart-tip");
    if (host && !tip) {
      tip = document.createElement("div");
      tip.className = "chart-tip";
      host.appendChild(tip);
    }

    const total = o.data.reduce((s, d) => s + d.v, 0) || 1;

    function geom() {
      const r = canvas.getBoundingClientRect();
      const R = Math.min(r.width, r.height) / 2 - 6;
      return { cx: r.width / 2, cy: r.height / 2, R, inner: R * (1 - o.thickness) };
    }

    function draw() {
      const { ctx, w, h } = setup(canvas);
      const P = palette(canvas);
      const { cx, cy, R, inner } = geom();
      let a0 = -Math.PI / 2;

      o.data.forEach((d, i) => {
        const frac = d.v / total;
        const a1 = a0 + frac * Math.PI * 2 * progress;
        const grow = hover === i ? 5 : 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R + grow, a0, a1);
        ctx.arc(cx, cy, inner, a1, a0, true);
        ctx.closePath();
        ctx.fillStyle = makePattern(ctx, d.pattern || "solid", P.ink, P.bg);
        ctx.fill();
        ctx.strokeStyle = P.bg;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        a0 += frac * Math.PI * 2 * progress;
      });

      if (o.center) {
        ctx.textAlign = "center";
        ctx.fillStyle = P.ink;
        ctx.font = '600 ' + Math.round(R * 0.34) + 'px "Instrument Serif", serif';
        ctx.textBaseline = "alphabetic";
        ctx.fillText(o.center.v, cx, cy + 2);
        ctx.fillStyle = P.ink3;
        ctx.font = '9px ui-monospace, monospace';
        ctx.fillText(o.center.l.toUpperCase(), cx, cy + 20);
      }
    }

    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const { cx, cy, R, inner } = geom();
      const dx = x - cx, dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < inner || dist > R + 6) { if (hover !== -1) { hover = -1; draw(); tip && tip.classList.remove("on"); } return; }
      let ang = Math.atan2(dy, dx) + Math.PI / 2;
      if (ang < 0) ang += Math.PI * 2;
      let acc = 0, idx = -1;
      for (let i = 0; i < o.data.length; i++) {
        const f = (o.data[i].v / total) * Math.PI * 2;
        if (ang >= acc && ang < acc + f) { idx = i; break; }
        acc += f;
      }
      if (idx !== hover) {
        hover = idx; draw();
        if (tip && idx >= 0) {
          tip.style.left = x + "px";
          tip.style.top = y + "px";
          tip.innerHTML = "<b>" + o.data[idx].k + "</b><br>" + o.data[idx].v + "% of book";
          tip.classList.add("on");
        }
      }
    });
    canvas.addEventListener("mouseleave", () => { hover = -1; draw(); tip && tip.classList.remove("on"); });

    function run() { if (o.animate) animate(1000, (t) => { progress = t; draw(); }); else draw(); }
    const api = { redraw: draw, replay: run };
    register(canvas, api, run);
    return api;
  }

  /* ---------------------------------------------------------------- BARS */

  function bars(canvas, opts) {
    const o = Object.assign({
      labels: [], data: [], pad: { t: 16, r: 10, b: 28, l: 46 },
      yFormat: (v) => fmtNum(v, 0), animate: true, zero: true
    }, opts);
    let progress = o.animate ? 0 : 1;
    let hover = -1;

    const host = canvas.closest(".chart-canvas") || canvas.parentElement;
    let tip = host && host.querySelector(".chart-tip");
    if (host && !tip) { tip = document.createElement("div"); tip.className = "chart-tip"; host.appendChild(tip); }

    const max = Math.max.apply(null, o.data.concat(o.zero ? [0] : []));
    const min = Math.min.apply(null, o.data.concat(o.zero ? [0] : []));
    const range = (max - min) || 1;

    function draw() {
      const { ctx, w, h } = setup(canvas);
      const P = palette(canvas);
      const pad = o.pad;
      const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
      if (iw <= 0 || ih <= 0) return;
      const Y = (v) => pad.t + ih - ((v - min) / range) * ih;
      const bw = (iw / o.data.length) * 0.56;

      ctx.strokeStyle = P.line;
      ctx.fillStyle = P.ink3;
      ctx.font = '10px ui-monospace, monospace';
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let g = 0; g <= 4; g++) {
        const v = min + (range * g) / 4;
        const y = Math.round(Y(v)) + 0.5;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(o.yFormat(v), pad.l - 8, y);
      }

      const zeroY = Y(0);
      o.data.forEach((v, i) => {
        const cx = pad.l + (i + 0.5) * (iw / o.data.length);
        const top = Y(v);
        const hgt = (zeroY - top) * progress;
        ctx.fillStyle = hover === i ? P.ink : (v < 0 ? P.ink3 : P.ink2);
        if (v >= 0) {
          ctx.fillStyle = hover === i ? P.ink : P.ink2;
          ctx.fillRect(cx - bw / 2, zeroY - hgt, bw, hgt);
        } else {
          ctx.save();
          ctx.fillStyle = makePattern(ctx, "hatch", hover === i ? P.ink : P.ink3, P.bg);
          ctx.fillRect(cx - bw / 2, zeroY, bw, -hgt);
          ctx.restore();
          ctx.strokeStyle = P.ink3;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - bw / 2 + 0.5, zeroY + 0.5, bw - 1, -hgt);
        }
        ctx.fillStyle = P.ink3;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(o.labels[i], cx, h - pad.b + 9);
      });

      ctx.strokeStyle = P.line2;
      ctx.beginPath();
      ctx.moveTo(pad.l, Math.round(zeroY) + 0.5);
      ctx.lineTo(w - pad.r, Math.round(zeroY) + 0.5);
      ctx.stroke();
    }

    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const iw = r.width - o.pad.l - o.pad.r;
      const i = Math.floor(((x - o.pad.l) / iw) * o.data.length);
      const c = Math.max(0, Math.min(o.data.length - 1, i));
      if (c === hover) return;
      hover = c; draw();
      if (tip) {
        tip.style.left = (o.pad.l + (c + 0.5) * (iw / o.data.length)) + "px";
        tip.style.top = o.pad.t + "px";
        tip.innerHTML = "<b>" + o.labels[c] + "</b><br>" + (o.data[c] > 0 ? "+" : "") + o.data[c] + "%";
        tip.classList.add("on");
      }
    });
    canvas.addEventListener("mouseleave", () => { hover = -1; draw(); tip && tip.classList.remove("on"); });

    function run() { if (o.animate) animate(900, (t) => { progress = t; draw(); }); else draw(); }
    const api = { redraw: draw, replay: run };
    register(canvas, api, run);
    return api;
  }

  /* ------------------------------------------------------------ GAUGE */

  function gauge(canvas, opts) {
    const o = Object.assign({ value: 50, animate: true }, opts);
    let progress = o.animate ? 0 : 1;

    function draw() {
      const { ctx, w, h } = setup(canvas);
      const P = palette(canvas);
      const cx = w / 2, cy = h * 0.86, R = Math.min(w / 2, h / 1.1) - 12;
      const start = Math.PI, end = Math.PI * 2;

      ctx.lineCap = "butt";
      // track ticks
      const ticks = 44;
      for (let i = 0; i <= ticks; i++) {
        const t = i / ticks;
        const a = start + t * (end - start);
        const on = t <= (o.value / 100) * progress;
        const len = i % 11 === 0 ? 14 : 8;
        ctx.strokeStyle = on ? P.ink : P.line2;
        ctx.lineWidth = i % 11 === 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (R - len), cy + Math.sin(a) * (R - len));
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.stroke();
      }
      // needle
      const a = start + (o.value / 100) * progress * (end - start);
      ctx.strokeStyle = P.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22));
      ctx.stroke();
      ctx.fillStyle = P.ink;
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = P.ink3;
      ctx.font = '9px ui-monospace, monospace';
      ctx.textAlign = "left";
      ctx.fillText("FEAR", cx - R, cy + 16);
      ctx.textAlign = "right";
      ctx.fillText("GREED", cx + R, cy + 16);
    }
    function run() { if (o.animate) animate(1200, (t) => { progress = t; draw(); }); else draw(); }
    const api = { redraw: draw, replay: run, set(v) { o.value = v; progress = 0; run(); } };
    register(canvas, api, run);
    return api;
  }

  /* ------------------------------------------------------- SPARKLINE SVG */

  function sparkline(el, data) {
    if (!data || data.length < 2) return;
    const w = 92, h = 30, p = 3;
    const min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    const rng = (max - min) || 1;
    const pts = data.map((v, i) => {
      const x = p + (i / (data.length - 1)) * (w - p * 2);
      const y = h - p - ((v - min) / rng) * (h - p * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    });
    const rising = data[data.length - 1] >= data[0];
    el.innerHTML =
      '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<polyline points="' + pts.join(" ") + '" fill="none" stroke="currentColor" stroke-width="1.4" ' +
      'stroke-linejoin="round" stroke-linecap="round"' + (rising ? "" : ' stroke-dasharray="3 2"') + '/>' +
      "</svg>";
    el.classList.toggle("dim", !rising);
  }

  /* ------------------------------------------------- registry / lifecycle */

  const registry = [];

  function register(canvas, api, run) {
    const entry = { canvas, api, run, played: false };
    registry.push(entry);

    // Draw on first scroll-into-view, redraw on resize / theme change.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting && !entry.played) {
            entry.played = true;
            run();
            io.unobserve(canvas);
          }
        });
      }, { threshold: 0.25 });
      io.observe(canvas);
    } else { run(); }

    if ("ResizeObserver" in window) {
      let t;
      const ro = new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => { if (entry.played) api.redraw(); }, 90);
      });
      ro.observe(canvas);
    }
  }

  document.addEventListener("hf:theme", () => {
    registry.forEach((e) => { if (e.played) e.api.redraw(); });
  });

  window.addEventListener("resize", (function () {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => registry.forEach((e) => e.played && e.api.redraw()), 140);
    };
  })());

  return { line, donut, bars, gauge, sparkline, fmtNum };
})();
