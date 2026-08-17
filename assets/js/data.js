/* ==========================================================================
   HashFunds — Single source of content.
   Edit this file to change site copy, figures, people and articles.
   NOTE: every figure here is illustrative placeholder data. Replace with
   audited numbers before publishing. See README.md.
   ========================================================================== */

window.HF = (function () {
  const company = {
    name: "HashFunds",
    tagline: "Digital asset management, run like a discipline.",
    founded: "March 2024",
    email: "invest@hashfunds.com",
    press: "press@hashfunds.com",
    careers: "careers@hashfunds.com",
    phone: "+91 00000 00000",

    /* Where the contact and subscribe forms deliver.
       FormSubmit relays a static-site form POST to the inbox named in the URL.
       IMPORTANT: the very first submission does not arrive — FormSubmit instead
       emails hjangid302@gmail.com a one-time activation link. Click it, and
       every submission after that lands in the inbox.
       Once activated, FormSubmit issues a hashed endpoint
       (https://formsubmit.co/ajax/<hash>). Swap it in here, because the address
       below is readable in the page source and scrapers do read it. */
    formEndpoint: "https://formsubmit.co/ajax/hjangid302@gmail.com",
    inbox: "hjangid302@gmail.com",
    address: ["HashFunds Capital", "Level 9, Financial District", "Jaipur, Rajasthan 302001", "India"],
    social: [
      { label: "LinkedIn", href: "#", short: "LI" },
      { label: "X / Twitter", href: "#", short: "X" },
      { label: "Substack", href: "#", short: "SS" },
      { label: "GitHub", href: "#", short: "GH" }
    ]
  };

  /* Facts a new firm can actually stand behind. No AUM, no return figures and
     no client counts until there are audited numbers to put here. */
  const stats = [
    { text: "Mar 2024", label: "Firm founded" },
    { text: "100%", label: "Founder-owned, no outside capital" },
    { text: "1:1", label: "Every client works with the principal" },
    { text: "13–40%", label: "Target annual return range" }
  ];

  const services = [
    {
      n: "01",
      slug: "digital-asset-fund",
      title: "Digital Asset Fund",
      short: "A concentrated, actively rebalanced portfolio of large- and mid-cap digital assets.",
      body: "Our flagship strategy holds a conviction-weighted basket of protocol assets, rebalanced against a proprietary liquidity and momentum framework. Positions are sized by drawdown tolerance rather than market cap, so the book stays defensible when correlation goes to one.",
      points: ["Conviction-weighted, 12–18 positions", "Quarterly rebalance with tactical overlays", "Segregated qualified custody", "Monthly NAV, audited annually"],
      icon: "layers",
      min: "$250,000",
      lockup: "12 months",
      fee: "2 / 20"
    },
    {
      n: "02",
      slug: "wealth",
      title: "Private Wealth Advisory",
      short: "Blended traditional and digital allocation for families and operating founders.",
      body: "For clients whose net worth is concentrated in one asset or one company, we build the diversification plan around the concentration rather than pretending it away. Equities, fixed income, private credit and a sized digital sleeve, governed by a written policy statement.",
      points: ["Written investment policy statement", "Cross-asset allocation modelling", "Tax-aware rebalancing", "Succession and estate coordination"],
      icon: "compass",
      min: "$1,000,000",
      lockup: "None",
      fee: "0.85% AUM"
    },
    {
      n: "03",
      slug: "research",
      title: "Research & Diligence",
      short: "Independent protocol, counterparty and token diligence for allocators.",
      body: "Standalone research mandates for family offices and funds that want a second opinion before they wire. We publish the methodology alongside the conclusion, because a rating you cannot interrogate is a marketing document.",
      points: ["Protocol and smart-contract review", "Counterparty and venue risk scoring", "Token supply and unlock modelling", "Written opinion, delivered in 10 days"],
      icon: "scope",
      min: "Engagement based",
      lockup: "—",
      fee: "From $25,000"
    }
  ];

  const pillars = [
    { t: "Capital preservation first", d: "The compounding math only works if you avoid the hole. Risk limits are hard-coded, not advisory, and they bind the people who set them." },
    { t: "Evidence over narrative", d: "Every position carries a written thesis with falsification criteria. If the thesis breaks, the position closes — regardless of how loudly the market disagrees." },
    { t: "Custody you can verify", d: "Client assets sit with regulated qualified custodians under segregated title. You get independent attestation, not our word for it." },
    { t: "Fees that align", d: "Performance fees sit behind a high-water mark. We do not get paid twice for recovering ground we lost." }
  ];

  /* CONFIRM THESE BEFORE PUBLISHING — only the March 2024 founding date came
     from you. The rest describes a plausible early path; correct anything that
     did not happen, and delete entries you cannot evidence. */
  const timeline = [
    { y: "March 2024", t: "HashFunds founded", d: "Established in Jaipur, Rajasthan as a founder-led investment firm covering digital assets and traditional markets." },
    { y: "2024", t: "Framework before capital", d: "The first months went into writing the risk limits, thesis template and custody policy that now govern every mandate — before managing anyone else's money." },
    { y: "2025", t: "First mandates", d: "Began taking on client capital under the initial strategies, with reporting built to satisfy an auditor rather than a marketing deck." },
    { y: "2026", t: "Building the record", d: "Deliberately small. The priority is a documented process and a track record that will survive being checked, not growth for its own sake." },
    { y: "In development", t: "Tokenisation programme", d: "Building settlement infrastructure for tokenised real-world assets, including a native digital asset and a fully reserved stablecoin. In development — nothing issued, nothing offered." }
  ];

  const team = [
    {
      name: "Harsh Jangid",
      role: "Founder & Chief Investment Officer",
      img: "assets/img/founder.jpg",
      bio: "An AI/ML engineer by training, with a B.Tech in Artificial Intelligence and Data Science. Founded HashFunds in March 2024 to bring an engineer's habits to markets: models tested before they are trusted, assumptions written down where they can be checked, and risk limits enforced in code rather than by memo. Runs the firm single-handedly — research, portfolio construction, execution and risk all sit with one person.",
      focus: ["Machine learning", "Quantitative research", "Systematic risk", "Portfolio construction"],
      linked: "#"
    }
    /* Adding a second person here automatically switches the About page from
       the single-founder feature layout back to a grid. */
  ];

  /* Empty until real, attributable client quotes exist — with written consent.
     Sections bound to this array hide themselves while it is empty. */
  const testimonials = [];

  /* ------------------------------------------------------------------------
     ROADMAP — the tokenisation programme.

     Read the disclaimer on the page before editing any of this. Nothing here
     has launched. None of it may be described as available, purchasable or
     dated until it genuinely is, and until you have taken legal advice in
     every jurisdiction you intend to offer it in. Issuing a token or a
     stablecoin is a regulated activity in most of them.

     Keep every `s` (status) value as "In progress", "Planned" or "Researching"
     — never "Live", "Available" or anything implying you can buy it.
     ------------------------------------------------------------------------ */
  const roadmap = [
    {
      n: "01",
      t: "Settlement architecture",
      s: "In progress",
      d: "Designing the chain-level architecture for moving tokenised assets between parties without the settlement risk that makes institutions refuse to participate."
    },
    {
      n: "02",
      t: "Stablecoin and reserve model",
      s: "In progress",
      d: "A fully reserved unit intended as the cash leg of tokenised settlement. The design work is mostly about the reserve composition, attestation cadence and redemption mechanics — the parts that decide whether it survives stress, not the parts that market well."
    },
    {
      n: "03",
      t: "Legal and regulatory review",
      s: "Planned",
      d: "Independent counsel in every jurisdiction the programme would touch, before anything is issued. Stablecoin issuance is a regulated activity in most of them and the rules are still moving."
    },
    {
      n: "04",
      t: "Independent audit",
      s: "Planned",
      d: "Third-party smart contract audit plus a reserve attestation process, both published. An unaudited contract holding other people's money is not a product, it is a liability."
    },
    {
      n: "05",
      t: "Controlled pilot",
      s: "Planned",
      d: "A limited pilot with known counterparties on real tokenised instruments, sized so that being wrong is survivable for everyone involved."
    }
  ];

  /* Add real pieces as you publish them. The Insights page shows an honest
     "nothing published yet" state while this is empty, rather than inventing
     a back catalogue.
     Shape: { d: "YYYY-MM-DD", t: "Title", c: "Category", x: "Summary", r: readMinutes } */
  const insights = [];

  const faqs = [
    { q: "What returns should I expect?", a: "We target an annual return between 13% and 40% across our mandates, with the lower end reflecting the more conservative, liquidity-constrained books and the upper end the concentrated digital asset strategy in a favourable market. Treat that as a target we manage towards, not a forecast and not a guarantee — it is not fixed, not contractual, and no return is assured. HashFunds was founded in March 2024, so the realised record is still short; when it is long enough to be meaningful it will be published audited and net of fees, and you can judge us on that rather than on the target. Digital assets are volatile and you may lose the entire value of your investment." },
    { q: "Why should I use a firm this new?", a: "Sometimes you should not, and we will say so on the first call if your situation calls for a manager with a fifteen-year record. What you get here instead is direct access to the person actually making the decisions, a written thesis behind every position that you can ask to read, and no legacy book or inherited positions anyone is quietly defending. Weigh that against the absence of a long record honestly — both are real." },
    { q: "What is the minimum investment?", a: "Minimums vary by strategy — from $250,000 for the Digital Asset Fund to $2,000,000 for corporate treasury mandates. Research engagements are priced per scope. Every mandate begins with a suitability conversation, and we will tell you plainly if we are not the right fit." },
    { q: "Where are client assets actually held?", a: "With regulated qualified custodians under segregated title, never commingled with firm capital and never on a venue overnight beyond what execution requires. You receive independent custodian statements directly, not routed through us." },
    { q: "How is the firm regulated?", a: "HashFunds operates under the licensing and registration regime applicable in each jurisdiction where it markets. Full disclosure documents, including the fee schedule and conflicts register, are provided before any subscription. Replace this paragraph with your specific registrations." },
    { q: "What happens in a severe drawdown?", a: "Hard risk limits trigger de-risking automatically at pre-defined thresholds — no committee vote required, because committees are slow exactly when speed matters. You will receive written notification within one business day of any limit breach." },
    { q: "How do you charge?", a: "Management and performance fees vary by strategy and are listed on each strategy page. Performance fees sit behind a high-water mark, so we do not earn twice on recovering ground we lost. There are no placement, entry or exit fees." },
    { q: "Can I redeem early?", a: "Lock-up terms are set per strategy and disclosed upfront. The market-neutral book offers 90-day liquidity; the flagship fund runs a 12-month initial lock with quarterly windows thereafter. We have never gated a redemption." },
    { q: "Do you manage traditional assets too?", a: "Yes — the private wealth mandate covers equities, fixed income and private credit alongside a sized digital sleeve. Most of our wealth clients hold more traditional exposure than digital, which is usually the correct answer." },
    { q: "How do I get started?", a: "Send a note through the contact form or email invest@hashfunds.com. The first conversation is a 30-minute suitability call with an investment team member — not a salesperson — followed by full documentation if there is a fit." }
  ];

  /* ------------------------------------------------------------------------
     TARGET allocation — how the flagship book is designed to be constructed.
     This is a model, not a statement of current holdings, and the pages that
     use it say so. Adjust the weights to match your actual policy.
     ------------------------------------------------------------------------ */
  const allocation = [
    { k: "Bitcoin", v: 34, pattern: "solid" },
    { k: "Ethereum", v: 22, pattern: "hatch" },
    { k: "Layer-1 basket", v: 14, pattern: "dots" },
    { k: "DeFi & infrastructure", v: 11, pattern: "half" },
    { k: "Tokenised treasuries", v: 10, pattern: "hatch" },
    { k: "Cash & stables", v: 9, pattern: "dots" }
  ];

  /* ========================================================================
     DEMO-ONLY DATA — everything below this line is invented.

     It exists solely to make dashboard.html look realistic as a product
     demonstration, and that page carries a visible notice saying so. None of
     it is used on the public marketing pages.

     Do NOT surface any of this as real performance, holdings or risk data.
     ======================================================================== */

  const perfLabels = ["Jan 25","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan 26","Feb","Mar","Apr","May","Jun","Jul"];
  const perf = {
    fund:  [100,106,103,112,118,115,124,131,127,138,146,142,151,158,163,159,171,178,186],
    bench: [100,109,101,114,124,112,126,138,124,140,152,139,148,158,161,150,166,170,176],
    neutral:[100,101,102,103,104,105,106,107,108,110,111,112,113,115,116,117,118,120,121]
  };

  const holdings = [
    { a: "Bitcoin", s: "BTC", w: 34.0, e: "+2.1", p: 118420, r: "+42.6%" },
    { a: "Ethereum", s: "ETH", w: 22.0, e: "-0.8", p: 4310, r: "+31.2%" },
    { a: "Solana", s: "SOL", w: 7.5, e: "+1.2", p: 214, r: "+58.9%" },
    { a: "Chainlink", s: "LINK", w: 4.2, e: "+0.4", p: 27.4, r: "+18.3%" },
    { a: "Avalanche", s: "AVAX", w: 2.3, e: "-0.3", p: 41.2, r: "-6.4%" },
    { a: "Tokenised T-Bills", s: "TBIL", w: 10.0, e: "0.0", p: 100.0, r: "+4.9%" },
    { a: "Aave", s: "AAVE", w: 3.6, e: "+0.6", p: 312, r: "+22.7%" },
    { a: "Uniswap", s: "UNI", w: 3.4, e: "-0.2", p: 14.8, r: "-2.1%" },
    { a: "USD Cash & Stables", s: "USD", w: 9.0, e: "-1.0", p: 1.0, r: "—" },
    { a: "Lido Staked ETH", s: "STETH", w: 4.0, e: "+0.3", p: 4288, r: "+29.8%" }
  ];

  const transactions = [
    { d: "2026-07-24", t: "Rebalance", a: "BTC", q: "+12.400", v: "$1,468,408", s: "Settled" },
    { d: "2026-07-24", t: "Rebalance", a: "AVAX", q: "-8,200.00", v: "$337,840", s: "Settled" },
    { d: "2026-07-18", t: "Subscription", a: "USD", q: "+2,500,000", v: "$2,500,000", s: "Settled" },
    { d: "2026-07-11", t: "Yield accrual", a: "TBIL", q: "+1,904.22", v: "$190,422", s: "Settled" },
    { d: "2026-07-03", t: "Buy", a: "SOL", q: "+4,100.00", v: "$877,400", s: "Settled" },
    { d: "2026-06-27", t: "Redemption", a: "USD", q: "-750,000", v: "$750,000", s: "Settled" },
    { d: "2026-06-19", t: "Sell", a: "UNI", q: "-22,000.00", v: "$325,600", s: "Settled" },
    { d: "2026-06-12", t: "Staking reward", a: "STETH", q: "+18.740", v: "$80,357", s: "Settled" }
  ];

  const riskMetrics = [
    { k: "Sharpe ratio", v: "1.84", n: "Trailing 24 months" },
    { k: "Max drawdown", v: "-18.2%", n: "Peak to trough, since inception" },
    { k: "Volatility", v: "24.6%", n: "Annualised, trailing 12M" },
    { k: "Beta to BTC", v: "0.61", n: "Trailing 12M regression" },
    { k: "Sortino ratio", v: "2.41", n: "Downside-adjusted" },
    { k: "Win rate", v: "68%", n: "Positive months since inception" }
  ];

  /* Fallback market data — used when the live API is unreachable. */
  const fallbackMarkets = [
    { id:"bitcoin", symbol:"BTC", name:"Bitcoin", price:118420.55, ch24:2.14, ch7:5.9, cap:2334000000000, vol:41200000000, spark:[112,113,111,115,116,114,118,117,119,118] },
    { id:"ethereum", symbol:"ETH", name:"Ethereum", price:4310.22, ch24:-0.82, ch7:3.1, cap:519000000000, vol:19800000000, spark:[4.2,4.25,4.19,4.31,4.28,4.35,4.30,4.33,4.29,4.31] },
    { id:"solana", symbol:"SOL", name:"Solana", price:214.06, ch24:4.31, ch7:11.4, cap:102000000000, vol:6400000000, spark:[192,198,201,196,205,209,212,208,215,214] },
    { id:"binancecoin", symbol:"BNB", name:"BNB", price:702.14, ch24:0.94, ch7:1.8, cap:101000000000, vol:2100000000, spark:[690,694,688,697,701,699,705,702,708,702] },
    { id:"ripple", symbol:"XRP", name:"XRP", price:2.94, ch24:-1.62, ch7:-4.2, cap:168000000000, vol:5200000000, spark:[3.1,3.05,3.02,2.98,3.0,2.95,2.92,2.96,2.9,2.94] },
    { id:"cardano", symbol:"ADA", name:"Cardano", price:0.914, ch24:1.28, ch7:2.6, cap:32800000000, vol:980000000, spark:[.89,.9,.88,.91,.92,.9,.93,.91,.92,.914] },
    { id:"chainlink", symbol:"LINK", name:"Chainlink", price:27.41, ch24:3.02, ch7:8.4, cap:17400000000, vol:840000000, spark:[25.2,25.8,26.1,25.7,26.6,27.0,27.3,26.9,27.6,27.4] },
    { id:"avalanche-2", symbol:"AVAX", name:"Avalanche", price:41.18, ch24:-2.44, ch7:-5.1, cap:17000000000, vol:610000000, spark:[43.5,43.1,42.6,42.9,42.1,41.8,41.4,41.9,41.0,41.2] },
    { id:"aave", symbol:"AAVE", name:"Aave", price:312.44, ch24:2.86, ch7:6.7, cap:4700000000, vol:340000000, spark:[295,299,303,300,306,309,311,308,314,312] },
    { id:"uniswap", symbol:"UNI", name:"Uniswap", price:14.82, ch24:-0.41, ch7:1.2, cap:8900000000, vol:290000000, spark:[14.6,14.7,14.5,14.9,14.8,15.0,14.9,14.7,14.9,14.8] },
    { id:"polkadot", symbol:"DOT", name:"Polkadot", price:8.42, ch24:1.11, ch7:0.4, cap:12100000000, vol:410000000, spark:[8.2,8.3,8.25,8.4,8.35,8.45,8.5,8.38,8.44,8.42] },
    { id:"litecoin", symbol:"LTC", name:"Litecoin", price:132.6, ch24:0.62, ch7:-1.1, cap:10000000000, vol:520000000, spark:[131,132,130,133,132,134,133,131,133,132.6] }
  ];

  return {
    company, stats, services, pillars, timeline, team, testimonials, roadmap,
    insights, faqs, allocation, perfLabels, perf, holdings, transactions,
    riskMetrics, fallbackMarkets
  };
})();
