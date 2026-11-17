// Projects page. Each case study gets its own page at /projects/<slug>.
//
// Adding screenshots: put the images in /public/projects/<slug>/ and list them in that
// project's "gallery" block (src, alt, caption). Adding a live demo: set `live` (a link) and,
// if the site allows being framed, add an "embed" block with its URL. Nothing shows until it
// is filled in, so an empty slot never appears on the live site.
//
// Facts come from the résumé, the Stacks app and the H-1B paper (public/research).

import type { Hue } from "./site";

export type Block =
  | { kind: "text"; title: string; body: string[] }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "steps"; title: string; intro?: string; steps: { label: string; title: string; detail: string }[] }
  | { kind: "equation"; title: string; equation: string; notes: { term: string; meaning: string }[] }
  | { kind: "table"; title: string; caption?: string; columns: string[]; rows: string[][]; note?: string }
  | { kind: "h1b-chart"; title: string }
  | { kind: "gallery"; title: string; shots: { src: string; alt: string; caption: string; width: number; height: number }[] }
  | { kind: "embed"; title: string; url: string; label: string; height?: number };

export type Project = {
  slug: string;
  title: string;
  /** one line under the title */
  subtitle: string;
  type: "Build" | "Research" | "Analysis";
  date: string;
  hue: Hue;
  /** the short version, used on the index card */
  summary: string;
  facts: { label: string; value: string }[];
  tools: string[];
  /** headline numbers, shown as a strip under the header */
  metrics: { value: string; label: string }[];
  links: { label: string; href: string }[];
  blocks: Block[];
};

export const projects: Project[] = [
  {
    slug: "stacks-reports",
    title: "Stacks Reports",
    subtitle: "An internal reporting system for SJSU's MLK Library stacks team",
    type: "Build",
    date: "Aug 2026 – present",
    hue: "dusk",
    summary:
      "A web app where library assistants file shelving, damage and equipment problems and the team works each one to resolved, with sign-in, roles and an audit log built in.",
    facts: [
      { label: "Context", value: "SJSU MLK Library, stacks team" },
      { label: "My role", value: "Built it while working as a Stacks Maintenance Assistant" },
      { label: "Timeline", value: "Aug 2026 – present" },
      { label: "Status", value: "In use by the stacks team" },
    ],
    tools: ["Python", "Flask", "SQLAlchemy", "SQLite", "Gunicorn", "systemd"],
    metrics: [
      { value: "~25%", label: "Faster resolution than informal reporting" },
      { value: "4", label: "Controls designed in from day one" },
      { value: "Open → Resolved", label: "Every report has an owner and a status" },
    ],
    links: [{ label: "Open the live app", href: "https://stacks.idivyam.com" }],
    blocks: [
      {
        kind: "text",
        title: "The problem",
        body: [
          "Student assistants reported shelving problems, damaged books and equipment issues informally. Problems got lost, nobody could see what was still open, and there was no record of who changed what.",
          "From a controls point of view, that's a process with no input standard, no ownership and no audit trail.",
        ],
      },
      {
        kind: "text",
        title: "What I built",
        body: [
          "A full-stack web app (Flask, SQLAlchemy, SQLite) where an assistant files a report by floor, location, category and priority, and the team works it from Open to Resolved.",
          "It's served with Gunicorn and kept running by systemd, so it comes back on its own after a restart.",
        ],
      },
      {
        kind: "steps",
        title: "Controls I designed in",
        intro: "In the order a report meets them. It's the same set I test as an auditor, built from the other side.",
        steps: [
          { label: "Sign in", title: "PIN authentication", detail: "Each assistant signs in with a PIN; brute-force lockout is specified for the production release." },
          { label: "Role check", title: "Role-based access", detail: "Assistants file and work reports; only admins manage accounts." },
          { label: "Report", title: "Structured input", detail: "Floor, category and priority are captured on every report; QR codes at the shelves are specified next." },
          { label: "Every change", title: "Audit log", detail: "Each status change is recorded with who made it and when." },
        ],
      },
      {
        kind: "list",
        title: "What changed",
        items: [
          "Resolution time came down by roughly 25% compared with informal reporting.",
          "Open issues are visible to the whole team instead of living in someone's memory.",
          "Every change to a report can be traced to a person and a time.",
        ],
      },
      {
        kind: "list",
        title: "What's next",
        items: ["Brute-force lockout on PIN sign-in.", "QR codes at the shelves so a report starts with the location filled in."],
      },
    ],
  },
  {
    slug: "h1b-wages",
    title: "Does H-1B hiring move U.S. wages?",
    subtitle: "An industry panel study of H-1B share, wages and unemployment, 2015–2024",
    type: "Research",
    date: "May 2026",
    hue: "sky",
    summary:
      "A two-way fixed-effects panel across Tech, Finance and Health Care. No statistically significant effect of H-1B share on wages or unemployment, with the limits of 30 observations stated plainly.",
    facts: [
      { label: "Course", value: "Econ 103B, Econometric Methods (SJSU)" },
      { label: "My role", value: "Sole author: data, model, write-up" },
      { label: "Timeline", value: "Spring 2026, submitted May 2026" },
      { label: "Data", value: "USCIS H-1B Employer Data Hub, FRED (BLS)" },
    ],
    tools: ["R", "Panel regression", "Two-way fixed effects", "FRED", "USCIS data"],
    metrics: [
      { value: "30", label: "Industry-year observations (3 industries × 10 years)" },
      { value: "0.18–5.4%", label: "Range of H-1B share across the panel" },
      { value: "p = 0.92", label: "Wage effect: not statistically significant" },
    ],
    links: [{ label: "Read the paper (PDF)", href: "/research/h1b-term-paper.pdf" }],
    blocks: [
      {
        kind: "text",
        title: "The question",
        body: [
          "Some argue firms use H-1B workers to cut labour costs; others that they fill real skill shortages. Instead of arguing about the program in general, the paper asks a narrower question: within an industry, when the H-1B share goes up, do wages or unemployment move with it?",
        ],
      },
      { kind: "h1b-chart", title: "What the data look like" },
      {
        kind: "table",
        title: "The panel",
        caption: "Descriptive statistics, 30 industry-years (Finance, Health Care and Tech, 2015–2024)",
        columns: ["Variable", "Mean", "Std dev", "Min", "Max"],
        rows: [
          ["Annual wage (USD)", "71,389", "9,397", "58,032", "88,452"],
          ["H-1B approvals", "18,515", "10,662", "4,589", "38,884"],
          ["Employment", "1,547,500", "892,622", "423,000", "2,895,000"],
          ["H-1B share", "0.0223", "0.0194", "0.0018", "0.0542"],
          ["Unemployment (%)", "3.38", "1.23", "1.90", "7.50"],
        ],
        note: "H-1B share = certified H-1B approvals ÷ total employment in that industry and year.",
      },
      {
        kind: "equation",
        title: "The model",
        equation: "Y_it = β_1 · H1Bshare_it + α_i + α_t + ε_it",
        notes: [
          { term: "Y_it", meaning: "Wages (or unemployment) in industry i, year t" },
          { term: "β_1", meaning: "The number the paper is about: does a higher H-1B share go with different outcomes?" },
          { term: "α_i", meaning: "Industry fixed effects: Tech always pays more than Health Care, so compare each industry with itself" },
          { term: "α_t", meaning: "Year fixed effects: shocks that hit every industry at once, like 2020" },
        ],
      },
      {
        kind: "table",
        title: "Results",
        columns: ["", "Wage model", "Unemployment model"],
        rows: [
          ["H-1B share estimate", "−16,224", "17.520"],
          ["Standard error", "164,192", "29.905"],
          ["t-value", "−0.099", "0.586"],
          ["p-value", "0.922", "0.566"],
          ["N", "30", "30"],
          ["R²", "0.0006", "0.0198"],
        ],
        note: "Read literally, one percentage point more H-1B share goes with about $162 lower annual wages and 0.18 points higher unemployment, but neither is anywhere near significant.",
      },
      {
        kind: "list",
        title: "What I concluded, and what limits it",
        items: [
          "No statistically significant relationship between H-1B share and wages or unemployment in this panel.",
          "30 observations is a small sample, so the test has little power; a null result here is not proof of no effect.",
          "H-1B share is probably not exogenous: growing industries may hire more H-1B workers and see different wage trends at the same time.",
          "The share uses approvals, not workers actually employed, so it can undercount true H-1B intensity.",
        ],
      },
      {
        kind: "text",
        title: "What I'd do next",
        body: [
          "Use an instrument: H-1B lottery outcomes or changes to the national visa cap move the number of H-1B workers firms can hire without coming from wage trends in any one industry. That would let the estimate be read as causal rather than as a correlation.",
        ],
      },
    ],
  },
];

/** Smaller coursework projects, listed on the index without their own page. */
export const coursework: { title: string; date: string; context: string; summary: string; tools: string[]; hue: Hue }[] = [
  {
    title: "What drives U.S. youth employment?",
    date: "May 2025",
    context: "Econometrics, SJSU",
    summary:
      "Multivariate regression in R on World Bank and FRED data, testing how GDP growth, international trade and the minimum wage relate to youth employment, with hypothesis tests and F-tests on each factor.",
    tools: ["R", "Regression", "F-tests", "FRED", "World Bank"],
    hue: "gold",
  },
  {
    title: "Pfizer 10-K analysis",
    date: "Apr 2025",
    context: "Accounting, SJSU",
    summary:
      "A full financial statement analysis of Pfizer, Inc. from its annual report, with written analysis of the business, its risk factors, the audit report and the notes to the financial statements.",
    tools: ["Financial statements", "10-K", "Risk factors", "Audit report"],
    hue: "pine",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
