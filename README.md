# HashFunds — website

A seven-page, dependency-free website for HashFunds. Pure black-and-white
throughout: contrast, typography, line style and fill pattern do the work that
colour normally does, which is also why every chart stays legible when printed
or viewed by someone who can't distinguish hues.

## Running it

There is no build step. Open `index.html` in a browser and it works.

For the live market feed to work reliably, serve it over HTTP rather than
opening the file directly — some browsers block cross-origin requests from
`file://` pages:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. If the feed is blocked or rate-limited, the
site silently falls back to bundled sample data and labels it "Sample data".

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — hero, live ticker, strategies, investment process, tokenisation roadmap, target allocation, FAQ |
| `about.html` | Firm story, timeline, principles, founder, tokenisation programme, governance |
| `strategies.html` | Comparison table plus a full section per mandate, process, risk limits |
| `markets.html` | Live prices, sortable/searchable table, sentiment gauge, converter, cap-weighted heatmap |
| `portfolio.html` | Target allocation model, construction constraints, projection modeller, reporting |
| `insights.html` | Research archive with category filters and search, newsletter signup |
| `dashboard.html` | Investor portal demonstration — five tabbed panels, clearly marked as fictional |

## Where to edit things

**Almost all copy and numbers live in one file: `assets/js/data.js`.** Services,
team, timeline, roadmap, testimonials, articles, FAQs and allocation are all
defined there and rendered into the pages at load time. Change it once and every
page updates.

- **Photos** — see `assets/img/README.md` for the filenames to use.
- **Colours, spacing, type** — the design tokens at the top of
  `assets/css/style.css`, under `:root` and `[data-theme="light"]`.
- **Navigation links** — the `NAV` array near the top of `assets/js/app.js`.
- **Footer, disclaimer** — `buildFooter()` in `assets/js/app.js`.

Empty arrays are handled gracefully. `testimonials` and `insights` are currently
empty; the sections bound to them hide themselves or show an honest "nothing
published yet" state. Add real entries and the sections, filters and search all
switch back on automatically. Adding a second person to `team` switches the
About page from the single-founder layout back to a grid.

## Files

```
assets/css/style.css    Design system and every component style
assets/js/data.js       All content and figures
assets/js/charts.js     Canvas chart engine (line, donut, bars, gauge, sparkline)
assets/js/render.js     Turns data.js into DOM
assets/js/app.js        Nav, footer, theme, motion, forms, tabs, accordions
assets/js/markets.js    Live market data + fallback
```

## Features worth knowing about

- **Dark/light toggle** — persists in `localStorage`; charts redraw on switch.
- **Live crypto data** — CoinGecko public API, 60-second refresh, paused when
  the tab is hidden, session-cached, with a bundled fallback.
- **Charts** — written from scratch on `<canvas>`. Animated on scroll into view,
  hover crosshair with tooltip, retina-aware, redrawn on resize and theme change.
- **Projection modeller** (`portfolio.html`) — compounding model with bull/base/
  bear cases and a live chart.
- **Accessibility** — skip link, focus rings, ARIA labels, sortable table headers
  with `aria-sort`, `prefers-reduced-motion` respected throughout.
- **Responsive** down to 360px, with a full-screen mobile drawer.

---

## ⚠️ Before this goes live

The firm was founded in **March 2024** and is a single-person operation. The
public pages say only what a firm of that age can truthfully say — no AUM, no
returns, no client counts, no testimonials, no invented history. Keep it that
way. A financial services site that presents placeholder numbers as real is a
genuine regulatory and reputational problem.

1. **The tokenisation programme is the highest-risk content on the site.**
   Issuing a token or a stablecoin is a regulated activity in most
   jurisdictions, and describing one publicly can itself be treated as marketing
   a financial instrument. The section at `index.html#tokenisation` and the
   block on `about.html` are written as development stages with an explicit
   "nothing has launched, nothing is being offered" disclaimer.

   Keep it that way. Specifically, do **not** add: a launch date, a token price
   or supply figure, a presale/whitelist/allocation, a yield or return number,
   or any wording implying the token can be acquired. Statuses in `data.js` →
   `roadmap` should stay "In progress", "Planned" or "Researching".

   Take legal advice before changing any of this, and well before the stablecoin
   goes near a real user.

2. **Confirm the four hero statistics** in `data.js` → `stats`. "Founded March
   2024", "founder-owned" and "1:1 client contact" came from you. The fourth is
   now a **13–40% target annual return range**, which also appears in the
   homepage Process section and the first FAQ. A published return range is
   treated as a performance representation in most jurisdictions: have a
   documented basis for those numbers, and have the wording reviewed before
   launch.

3. **Confirm the timeline.** Only the March 2024 founding date is yours. The
   2024/2025/2026 entries in `data.js` → `timeline` describe a plausible early
   path — correct them, or delete what did not happen.

4. **Regulatory claims are unwritten.** `about.html` and the FAQ contain
   placeholder text about licensing and custody. Fill in your actual
   registrations, custodian, administrator and auditor — or remove the claims.

5. **Commercial terms are guesses.** The minimums, lock-ups and fees on each
   strategy in `data.js` (`min`, `lockup`, `fee`) were invented. Set them to what
   you actually charge, or remove those fields until you have decided.

6. **Activate the form endpoint.** Both forms now POST to FormSubmit, set in
   `data.js` → `company.formEndpoint`, which relays to `hjangid302@gmail.com`.
   The first submission does **not** arrive — FormSubmit emails that inbox a
   one-time activation link instead. Click it, then send one test enquiry to
   confirm delivery. After activating, replace the endpoint with the hashed
   URL FormSubmit gives you, so the address is not sitting in the page source
   for scrapers to harvest.

7. **The investor portal has no authentication.** `dashboard.html` is a visual
   demonstration carrying a notice that every figure on it is fictional. Keep
   that notice until it is wired to real reporting — it is what makes showing the
   page honest. Do not expose real client data through it without a real backend
   and real auth. It already carries `noindex`.

8. **Contact details are partly placeholders** — the city is now Jaipur,
   Rajasthan, but the street line, PIN code, phone number and all social links
   in `data.js` still need replacing.

9. **Legal pages don't exist.** The footer links to Privacy, Terms, Disclosures
   and Risk Warning all point at `#`. These need real pages before launch.
"# Hashfunds" 
