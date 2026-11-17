// Experience: one ledger row per chapter, newest first (by start date). Keep bullets factual: no invented metrics,
// awards or dates. "TODO" values render as an em dash.

import type { Hue } from "./site";

export type Chapter = {
  id: string;
  kind: "education" | "role" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  bullets: string[];
  tags: string[];
  link?: { href: string; label: string };
  hue: Hue;
};

export const chapters: Chapter[] = [
  {
    id: "ey",
    kind: "role",
    title: "Technology Risk Assurance Intern",
    org: "Ernst & Young (EY), San Jose",
    period: "Jun – Aug 2026",
    summary: "SOX controls testing on an engagement team.",
    bullets: [
      "Presented control testing findings to senior managers and partners across two SOX audit engagements.",
      "Tracked 100+ workpapers across engagement teams, helping teams meet year-end deadlines.",
      "Evaluated application controls and system evidence across 12+ applications against EY's ITAC/ITGC standards.",
      "Performed quality reviews of 10+ workpapers, catching gaps before submission.",
    ],
    tags: ["SOX", "ITGC", "Controls testing", "Audit documentation"],
    hue: "sky",
  },
  {
    id: "ra",
    kind: "role",
    title: "Resident Advisor",
    org: "University Housing Services, SJSU",
    period: "Aug 2025 – Present",
    summary: "Community, mediation and first response in the residence halls.",
    bullets: [
      "Manage 40+ residents, fostering a safe, inclusive living environment.",
      "Host 6 community events per semester, connecting residents to university resources.",
      "Respond to resident concerns and conflicts while enforcing housing policies and safety standards.",
    ],
    tags: ["Leadership", "Conflict resolution", "Community"],
    hue: "dawn",
  },
  {
    id: "library",
    kind: "role",
    title: "Stacks Maintenance Assistant",
    org: "SJSU Library",
    period: "Sep 2024 – Present",
    summary: "Access control, collection audits and an internal ticketing system for the library stacks.",
    bullets: [
      "Review shared-drive access and remove permissions for departed staff to maintain proper access control.",
      "Built an internal ticketing system to track stack issues, cutting resolution time by roughly 25%.",
      "Conduct regular collection audits to Library of Congress standards, supporting retrieval of 100+ resources weekly.",
    ],
    tags: ["Access control", "Process improvement", "Audits"],
    hue: "pine",
  },
  {
    id: "econ-research",
    kind: "project",
    title: "Youth Employment Research Paper",
    org: "SJSU, Econometrics (project)",
    period: "May 2025",
    summary: "Econometrics paper on what drives U.S. youth employment.",
    bullets: [
      "Analyzed the effects of GDP growth, international trade and minimum wage on U.S. youth employment.",
      "Built a multivariate regression model in R using World Bank and FRED data.",
      "Ran hypothesis tests and F-tests to check which factors mattered.",
    ],
    tags: ["R", "Regression", "Econometrics", "FRED", "World Bank"],
    hue: "gold",
  },
  {
    id: "pfizer-10k",
    kind: "project",
    title: "Pfizer 10-K Analysis",
    org: "SJSU, Accounting (project)",
    period: "Apr 2025",
    summary: "Financial statement analysis of Pfizer, Inc. using its annual report.",
    bullets: [
      "Completed a full financial statement analysis of Pfizer, Inc. using basic accounting principles.",
      "Wrote narrative analysis of the business and its risk factors, the audit report and the notes to the financial statements.",
    ],
    tags: ["Financial statements", "10-K", "Risk factors", "Audit reports"],
    hue: "sky",
  },
];

/** The last ledger row: what's next. */
export const summit = {
  title: "What's next",
  line: "Graduating May 2027. Available from June 2027.",
  paths: [
    { title: "Tech controls / risk advisory", hue: "trail" as Hue },
    { title: "Finance & economics analytics", hue: "dusk" as Hue },
  ],
};
