// Project case studies. Every number here comes from the project's own repo, workbook or paper.
// Rule: no invented metrics. If a figure isn't in the source, it isn't on the site.

import type { Hue } from "./site";

export type Stat = { value: string; label: string };
export type Block = { title: string; body: string[] };

export type Project = {
  slug: string;
  title: string;
  short: string; // card title
  kind: string; // e.g. "FP&A model"
  context: string; // course / independent / internal
  period: string;
  hue: Hue;
  hook: string; // the one-line story, not a resume bullet
  summary: string;
  stats: Stat[];
  tools: string[];
  repo: string;
  repoLabel: string;
  extraLinks?: { label: string; href: string }[];
  question: Block;
  approach: Block;
  finding: Block;
  limits: Block; // what went wrong / what it can't tell you
  next: string[];
  /** The one-page summary: a headline that states the finding, the chart title, three numbers and the source. */
  slide: {
    headline: string;
    figure: string;
    kpis: Stat[];
    source: string;
  };
  /** Plain-English card copy: what a non-specialist reader needs first. */
  card: {
    type: string; // e.g. "Financial model"
    name: string; // plain title
    what: string; // what it is
    did: string; // what I did
    result: string; // what came out of it
  };
};

export const projects: Project[] = [
  {
    slug: "google-cloud-fpna-model",
    title: "Google Cloud: Q3 2026 earnings analysis and Q4 forecast model",
    short: "Google Cloud FP&A model",
    kind: "FP&A model · Excel",
    context: "Independent project",
    period: "November 2026",
    hue: "sky",
    hook: "Can Cloud keep expanding margins while paying a premium for third-party compute?",
    summary:
      "A nine-tab Excel model of Google Cloud's segment results: Q3 2026 actuals, a three-scenario Q4 forecast and an illustrative FY2027 plan, built only from public SEC filings.",
    stats: [
      { value: "$30.7B", label: "Q3 2026 revenue, +102.6% YoY" },
      { value: "+12.5 pts", label: "operating margin vs Q3 2025" },
      { value: "$36.2B", label: "base-case Q4 revenue" },
      { value: "3", label: "scenarios, one switch cell" },
    ],
    tools: ["Excel", "Driver-based modelling", "Scenario analysis", "Sensitivity tables", "SEC filings"],
    repo: "https://github.com/divyamgupta01-bit/google-cloud-fpna-financial-model",
    repoLabel: "Workbook and README on GitHub",
    extraLinks: [
      {
        label: "Q3 2026 earnings release (SEC)",
        href: "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm",
      },
    ],
    question: {
      title: "The question",
      body: [
        "Google Cloud's Q3 2026 numbers were remarkable: $30,709M of revenue and $11,121M of operating income, a 36.2% margin that was 12.5 points higher than a year earlier. Management also warned that bridging compute capacity from third parties would weigh on margins in the near term.",
        "So the decision question for the model is narrow and useful: does the margin keep expanding, or does the capacity premium push it back down, and by how much?",
      ],
    },
    approach: {
      title: "How the model works",
      body: [
        "Alphabet reports Cloud revenue and operating income, and nothing in between. So I derived implied segment costs (revenue minus operating income), split them into a variable and a fixed part using an assumption calibrated so Q3 reconciles exactly to the reported figure, and added the capacity premium as its own line.",
        "Forecast revenue is the prior quarter grown by a sequential rate. Variable costs scale with revenue, fixed costs grow on their own path, and the premium is a percentage of revenue. One cell, ASSUMPTIONS!B7, flips the whole workbook between downside, base and upside.",
        "I also added a reconciliation check on the history: the FY2025 quarters sum to the reported full-year revenue and operating income with zero difference, so errors in the inputs show up immediately.",
      ],
    },
    finding: {
      title: "What the model says",
      body: [
        "In the base case, Q4 revenue reaches $36.2B and operating income $12.9B, but the margin dips about 0.7 points to 35.5%. Revenue keeps growing; the premium trims the margin. In the downside case the margin falls to about 29.8%, so the capacity premium and growth rate are the two assumptions that matter most.",
        "The Q3 bridge makes the same point from the actuals: revenue added $15.6B year on year, implied costs absorbed $8.0B of that, and operating income rose $7.5B. About half of every incremental revenue dollar reached operating income.",
      ],
    },
    limits: {
      title: "What it can't tell you",
      body: [
        "The variable and fixed cost split is my assumption, because Google does not disclose it. The size of the capacity premium is my estimate; only its direction comes from management commentary. The Q3 bridge is an accounting identity, not a causal analysis, and no Alphabet-wide capex is allocated to Cloud.",
        "I wrote these limits into the workbook's START HERE tab so that anyone opening it sees them before the numbers.",
      ],
    },
    slide: {
      headline: "Google Cloud's Q4 revenue grows to $36.2B, but its margin slips to 35.5%",
      figure: "Quarterly revenue ($M) and operating margin",
      kpis: [{ value: "$30.7B", label: "Q3 2026 revenue, +102.6% YoY" }, { value: "+12.5 pts", label: "operating margin vs Q3 2025" }, { value: "$36.2B", label: "Q4 revenue, base case" }],
      source: "Alphabet Q3 2026 earnings release (SEC); author's model",
    },
    card: {
      type: "Financial model",
      name: "Google Cloud earnings forecast",
      what: "An Excel model that forecasts Google Cloud's next quarter of revenue and profit, built only from Alphabet's public SEC filings.",
      did: "Rebuilt the Q3 2026 results, split costs into fixed and variable parts, and set up downside, base and upside forecasts that switch from one cell.",
      result: "Base case: Q4 revenue of $36.2B with a 35.5% operating margin, slightly lower than Q3 because of the extra cost of renting computing capacity.",
    },
    next: [
      "Q4 2026 actuals land in early February 2027. I'll freeze this base case, compare it to the reported results and publish the forecast-versus-actual variance.",
    ],
  },
  {
    slug: "stacks-reporting-system",
    title: "MLK Library Stacks Reporting System",
    short: "Library stacks reporting app",
    kind: "Full-stack web app",
    context: "Built for the SJSU Library stacks team",
    period: "August 2026 – present",
    hue: "pine",
    hook: "Scan a QR code on the shelf, report the problem in two taps, and track it until it's fixed.",
    summary:
      "An internal tool where student assistants report floor issues from their phones and Stack Maintenance staff triage them to resolution, with a full activity history on every task.",
    stats: [
      { value: "QR", label: "one non-guessable link per location" },
      { value: "7", label: "task states, from New to Closed" },
      { value: "4", label: "roles, enforced on the server" },
      { value: "5 → 15", label: "wrong PINs → minutes of lockout" },
    ],
    tools: ["Python", "Flask", "SQLAlchemy", "PostgreSQL", "Vercel", "Mobile-first UI"],
    repo: "https://github.com/divyamgupta01-bit/stacks-reports",
    repoLabel: "Source code on GitHub",
    question: {
      title: "The problem",
      body: [
        "In the library stacks, problems like disorganised shelves, damaged materials and safety hazards were reported informally, with no shared record of what was open, who owned it, or whether it was fixed. I work in the stacks as a student assistant, so I know what a report needs to capture and how little time there is to enter it.",
        "The constraint that shaped the design: reports are filed standing in an aisle, one-handed, on a phone.",
      ],
    },
    approach: {
      title: "How it works",
      body: [
        "Each shelf location has its own QR code that opens a pre-filled form. A two-tap quick log records routine completed work. Anything that needs follow-up opens a fuller form (category, severity, description, photo) that creates a trackable task.",
        "Tasks move New → Waiting → Assigned → In Progress → Resolved → Closed or Cancelled, and every change is written to an activity timeline. If a follow-up is filed at a location that already has an open task, the app offers to link it instead of creating a duplicate, and duplicate tasks can be merged with their reports and photos moved across.",
        "Roles (student assistant, stack maintenance, other staff, admin) are checked on the server, so a student assistant who forces a status change gets a 403, not just a hidden button. Sign-in is a name plus a four-digit PIN, with a lockout after five wrong attempts. I wrote the specification and tested every flow; the code was built with AI assistance, directed against that spec.",
      ],
    },
    finding: {
      title: "Bugs that testing turned up",
      body: [
        "A photo attached to a completed quick report uploaded correctly but never appeared anywhere. The cause: quick reports have no task, and the task page was the only place photos were shown. The fix was a report log page that lists every report with its thumbnails.",
        "Every timestamp was seven hours off. Times were stored in UTC, which is correct, but templates printed them raw, so a 6 pm report read as 1 am. Fixing the display uncovered a second bug: the supervisor dashboard's overdue check used UTC for 'today', so tasks due near midnight Pacific could be reported as overdue, or not, incorrectly. Both now use the library's local time.",
        "Configurable report categories use deactivate instead of delete, so an old task never loses its label. Severity carries an explicit weight for sorting, because once admins can rename a label you can't trust alphabetical order.",
      ],
    },
    limits: {
      title: "Where it stands",
      body: [
        "Phases 1 and 2 are built and tested: the report-to-task loop, photos, duplicate merging, the public bulletin board, the supervisor dashboard and admin-configurable options. Not done yet: printable QR sign sheets, SSO sign-in and email notifications, which depend on decisions from library IT. The screenshots below use the demo build, which seeds fictional people and locations only.",
      ],
    },
    slide: {
      headline: "Shelf problems that used to get lost now have an owner, a status and a full history",
      figure: "Dr. Martin Luther King Jr. Library, San José",
      kpis: [{ value: "7", label: "task states, New to Closed" }, { value: "4", label: "user roles, enforced on the server" }, { value: "5 → 15", label: "wrong PINs → minutes of lockout" }],
      source: "Stacks Reports demo build (fictional people and locations)",
    },
    card: {
      type: "Web app",
      name: "Library problem-reporting app",
      what: "A phone-friendly web app that SJSU's library stacks team uses to report problems on the shelves and track them until they're fixed.",
      did: "Built it end to end: a QR code on each shelf opens a report with the location filled in, and staff assign, update and close every issue.",
      result: "Every issue now has an owner, a status and a full history, with sign-in, user roles and PIN lockout protecting it.",
    },
    next: [
      "Printable QR sign sheets for each location.",
      "SSO sign-in and email notifications once library IT confirms the identity system and a sending account.",
    ],
  },
  {
    slug: "equity-ensemble-trading-model",
    title: "Equity ensemble trading model: adding Apple as a fourth signal",
    short: "Equity ensemble trading model",
    kind: "Backtest · Excel",
    context: "ECON 137A/139, San José State",
    period: "October 2026",
    hue: "gold",
    hook: "The backtest turned $10,000 into $180 million. Then I checked the timing.",
    summary:
      "I extended a class trading model with Apple as a fourth voting signal, tested 143 parameter combinations, and then found that the headline result was an artifact of look-ahead bias.",
    stats: [
      { value: "5,462", label: "trading days, Jan 2005 – Oct 2026" },
      { value: "143", label: "parameter combinations tested" },
      { value: "~11%", label: "max drawdown at 90/10" },
      { value: "$180M → $0.4M", label: "ending value once timing is realistic" },
    ],
    tools: ["Excel", "INDEX/MATCH", "RSI", "Backtesting", "Yahoo Finance data"],
    repo: "https://github.com/divyamgupta01-bit/equity-ensemble-trading-model",
    repoLabel: "Method and results on GitHub",
    question: {
      title: "The question",
      body: [
        "The course model checks four signals each trading day and invests only when at least three vote yes: a moving-average rule on the S&P 500, a VIX futures reading, S&P RSI and, in my extension, Apple's RSI. Otherwise it sits in cash. My professor showed the steps with the MOO ETF; I repeated every one with Apple.",
        "The goal was not the highest ending value. It was the smoothest equity curve with the smallest drawdown, and then to check whether any of it would survive real trading.",
      ],
    },
    approach: {
      title: "What I built",
      body: [
        "I copied the class tab so the original stayed untouched, pulled Apple's daily closes from Yahoo Finance and matched them to all 5,462 model dates with INDEX/MATCH, with no gaps. I built Apple's RSI the way the model computes it for MOO, converted it to a 1/0 vote and added it to the vote total.",
        "Then I linked the S&P/Apple allocation and the RSI smoothing to an inputs sheet and tested 13 smoothing values (1 to 126 days) against 11 allocations, 143 combinations in all. A 90/10 S&P/Apple split with no smoothing had the smoothest curve, with a worst drawdown of about 11%, against 20% at 50/50.",
      ],
    },
    finding: {
      title: "The finding: look-ahead bias",
      body: [
        "The model decides whether to be invested using a day's closing price, then earns that same day's return. In real trading you only know the close after the day is over, so you could not act until the next day. On a day Apple rises, its own RSI turns positive and switches the signal on, so the model partly rewards itself for knowing the answer. That is also why no smoothing 'won' every time.",
        "Re-running with a one-day lag took the Apple-only strategy from about $180M to about $0.4M, below simply holding Apple, which ended near $3.0M. The large returns were an artifact, not a tradable edge.",
      ],
    },
    limits: {
      title: "What I'd do differently",
      body: [
        "I tuned the parameters first and questioned the timing second. In hindsight the lag test should come before any optimisation, because tuning on a biased signal tunes the bias. The base workbook is course material, so the repository documents my extension, method and results rather than the file itself.",
      ],
    },
    slide: {
      headline: "A $180M backtest result shrank to $0.4M once the trading timing was made realistic",
      figure: "Growth of $1, Apple vs S&P 500, 2005–2026 (log scale)",
      kpis: [{ value: "$180M", label: "ending value, signal used same day" }, { value: "$0.4M", label: "ending value, signal used next day" }, { value: "143", label: "parameter combinations tested" }],
      source: "Monthly closes Jan 2005 – Oct 2026; author's backtest",
    },
    card: {
      type: "Trading backtest",
      name: "Testing a stock trading model",
      what: "A class model that decides each day whether to hold the S&P 500 or cash, which I extended with Apple as a fourth signal.",
      did: "Added Apple's price data and signal, then tested 143 combinations of settings over 5,462 trading days.",
      result: "Found that the headline $180M result came from a timing error (look-ahead bias). With realistic timing it fell to about $0.4M, below simply holding Apple.",
    },
    next: [
      "Act on every signal the next day and re-tune from scratch.",
      "Hold out whole years from the parameter search so the settings are not fit to the past.",
    ],
  },
  {
    slug: "h1b-wages",
    title: "Does H-1B hiring move U.S. wages? An industry panel, 2015–2024",
    short: "H-1B wage panel",
    kind: "Econometrics paper · panel data",
    context: "ECON 103B, San José State",
    period: "May 2026",
    hue: "sky",
    hook: "Tech's H-1B share rose by a third in a decade. Wages and unemployment didn't move with it, at least not detectably.",
    summary:
      "A two-way fixed-effects panel of Finance, Health Care and Tech from 2015 to 2024, testing whether a higher H-1B share goes with lower wages or higher unemployment, with the limits of 30 observations stated plainly.",
    stats: [
      { value: "30", label: "industry-years (3 industries × 10 years)" },
      { value: "0.18–5.4%", label: "range of H-1B share across the panel" },
      { value: "p = 0.92", label: "wage effect, not significant" },
      { value: "p = 0.57", label: "unemployment effect, not significant" },
    ],
    tools: ["Panel regression", "Two-way fixed effects", "Hypothesis testing", "FRED (BLS)", "USCIS data"],
    repo: "/research/h1b-term-paper.pdf",
    repoLabel: "Read the paper (PDF)",
    question: {
      title: "The question",
      body: [
        "Some argue firms use H-1B workers to cut labour costs or replace domestic workers; others that they fill genuine skill shortages. Rather than argue about the program in general, the paper asks a narrower question: within an industry, when the H-1B share goes up, do wages or unemployment move with it?",
      ],
    },
    approach: {
      title: "Method",
      body: [
        "Wages, unemployment and employment come from FRED (BLS); certified H-1B approvals by industry come from the USCIS H-1B Employer Data Hub. H-1B share is approvals divided by total employment in that industry and year, giving 30 industry-year observations.",
        "The model is Y = β1·H1Bshare + industry effects + year effects. Industry fixed effects compare each industry with itself (Tech always pays more than Health Care); year fixed effects absorb shocks that hit every industry at once, like 2020. β1 is the number the paper is about.",
      ],
    },
    finding: {
      title: "Results",
      body: [
        "Neither model finds a statistically significant effect. In the wage model the coefficient is −16,224 (p = 0.92): read literally, one more percentage point of H-1B share goes with about $162 lower annual wages. In the unemployment model it is 17.52 (p = 0.57), about 0.18 points higher unemployment. Neither model is significant overall on its F-test either.",
        "So in this data there is no strong evidence either way, which matches a literature that is itself split.",
      ],
    },
    limits: {
      title: "What limits it",
      body: [
        "Thirty observations give the test little power, so a null result here is not proof of no effect. H-1B share is probably not exogenous: growing industries may hire more H-1B workers and see different wage trends at the same time. And the share uses approvals, not workers actually employed, so it can undercount true H-1B intensity. The results describe correlation, not cause.",
      ],
    },
    slide: {
      headline: "Higher H-1B hiring showed no measurable link to wages or unemployment, 2015–2024",
      figure: "H-1B share of employment by industry",
      kpis: [{ value: "p = 0.92", label: "wage effect, not significant" }, { value: "p = 0.57", label: "unemployment effect, not significant" }, { value: "30", label: "industry-years of data" }],
      source: "USCIS H-1B Employer Data Hub; BLS via FRED",
    },
    card: {
      type: "Research paper",
      name: "Do H-1B visas affect U.S. wages?",
      what: "A research paper testing whether industries that hire more H-1B visa workers see lower wages or higher unemployment.",
      did: "Built a ten-year dataset for Tech, Finance and Health Care from USCIS and BLS data and ran a fixed-effects regression.",
      result: "No statistically significant effect on wages or unemployment. With 30 data points, the paper is clear about how much that can say.",
    },
    next: [
      "Use an instrument, such as H-1B lottery outcomes or changes to the national visa cap, which move H-1B hiring without coming from any one industry's wage trend.",
      "Extend the panel to more industries so the test has real power.",
    ],
  },
  {
    slug: "youth-employment-econometrics",
    title: "What drives U.S. youth employment? GDP growth, trade and the minimum wage",
    short: "Youth employment regression",
    kind: "Econometrics paper · R",
    context: "ECON 103A, San José State",
    period: "May 2025",
    hue: "dawn",
    hook: "Growth lifts young people's employment. The minimum wage, nationally, doesn't move it.",
    summary:
      "A multivariate regression on 34 years of World Bank and FRED data, including a fix for multicollinearity between imports and exports and an F-test of joint significance.",
    stats: [
      { value: "0.735", label: "R², 34 annual observations" },
      { value: "+0.78 pts", label: "youth employment per 1-pt GDP growth" },
      { value: "F = 6.82", label: "vs ≈2.95 critical value" },
      { value: "p > 0.3", label: "real minimum wage, both models" },
    ],
    tools: ["R", "OLS regression", "Hypothesis testing", "World Bank", "FRED"],
    repo: "https://github.com/divyamgupta01-bit/youth-employment-econometrics",
    repoLabel: "Paper (PDF) and write-up on GitHub",
    question: {
      title: "The question",
      body: [
        "How have GDP growth, international trade and the real minimum wage affected the employment of 15 to 24-year-olds in the United States between 1991 and 2024?",
        "Young workers are hit first in a downturn, as the series below shows with its spikes in 2008–2010 and 2020, so which levers actually help is worth testing rather than assuming.",
      ],
    },
    approach: {
      title: "Method",
      body: [
        "I assembled 34 annual observations: youth employment rate from the World Bank, and GDP growth, imports, exports and the CPI-adjusted minimum wage from FRED, with state minimum wages averaged. Imports and exports were taken in logs.",
        "The first model regressed youth employment on all four. Imports and exports were highly correlated, which inflates their standard errors, so I built a second model with a single log trade-volume variable. An F-test then checked whether GDP growth, imports and exports are jointly significant.",
      ],
    },
    finding: {
      title: "Results",
      body: [
        "A one-point rise in GDP growth goes with about a 0.78-point rise in the youth employment rate (p < 0.01), and the estimate barely moves between the two models. Once imports and exports are combined, higher trade volume is associated with significantly lower youth employment (p < 0.01), a result the separate variables hid. The real minimum wage is not significant at the national level in either model.",
        "The three growth and trade variables are jointly significant: F = 6.82 against a 5% critical value of about 2.95.",
      ],
    },
    limits: {
      title: "Limitations",
      body: [
        "National data can hide differences between states. Combining imports and exports trades their separate effects for a cleaner estimate. Education and industry mix are not modelled, and with 34 annual points the model describes association, not cause, so the trade result should be read as a pattern worth investigating rather than a proven mechanism.",
      ],
    },
    slide: {
      headline: "Each point of GDP growth goes with about 0.78 points more youth employment",
      figure: "U.S. youth unemployment rate, 1991–2024",
      kpis: [{ value: "+0.78 pts", label: "youth employment per 1 pt of GDP growth" }, { value: "0.735", label: "R², 34 annual observations" }, { value: "p > 0.3", label: "real minimum wage, both models" }],
      source: "World Bank via FRED; author's regressions",
    },
    card: {
      type: "Research paper",
      name: "What drives youth employment?",
      what: "A research paper on how economic growth, trade and the minimum wage relate to employment of 15 to 24-year-olds in the U.S.",
      did: "Ran regressions in R on 34 years of World Bank and FRED data, and fixed a problem caused by two trade measures moving together.",
      result: "Faster GDP growth goes with higher youth employment, about 0.78 points per point of growth. The national minimum wage had no significant effect.",
    },
    next: [
      "Repeat the model on a state-by-state panel, where the minimum wage varies a lot more than it does in a national average.",
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
