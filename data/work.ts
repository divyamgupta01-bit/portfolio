// "Selected work": two projects shown in depth. Facts come from the résumé and the paper.
// Screenshots: drop images in /public/work/ and list them in `shots` to show them.

export const stacksCase = {
  id: "stacks",
  kicker: "Case study · Aug 2026 – present",
  title: "Stacks Reports",
  subtitle: "An internal reporting system for SJSU's MLK Library stacks team",
  problem:
    "Student assistants reported shelving problems, damaged books and equipment issues informally, so problems got lost, nobody could see what was open, and there was no record of who changed what.",
  built:
    "A full-stack web app (Flask, SQLAlchemy, SQLite) where assistants file a report by floor, location, category and priority, and the team works it from Open to Resolved.",
  // The controls, in the order a request meets them. This is the bit a tech-risk reader cares about.
  controls: [
    { step: "Sign in", control: "PIN authentication", detail: "Each assistant signs in with a PIN; brute-force lockout is specified for the production release." },
    { step: "Role check", control: "Role-based access", detail: "Assistants file and work reports; only admins manage accounts." },
    { step: "Report", control: "Structured input", detail: "Floor, category and priority are captured on every report; QR codes at the shelves are specified next." },
    { step: "Every change", control: "Audit log", detail: "Each status change is recorded with who made it and when." },
  ],
  result: "Resolution time down by roughly 25% compared with informal reporting.",
  stack: ["Flask", "SQLAlchemy", "SQLite", "Gunicorn", "systemd"],
  why: "It's the same set of controls I test as an auditor (access, authentication, change logging), built from the other side.",
  shots: [] as { src: string; alt: string }[],
};

/** H-1B share of employment by industry, 2015–2024: redrawn from Figure 1 of the paper. */
export const h1bFigure = {
  id: "h1b",
  kicker: "Research · Econ 103B · May 2026",
  title: "Does H-1B hiring move U.S. wages?",
  takeaway:
    "Tech's H-1B share rose from about 4% to 5.4% over the decade while health care stayed under 0.2%. A two-way fixed-effects panel found no statistically significant effect of that share on wages or unemployment, and the paper is explicit that 30 industry-year observations limit what can be concluded.",
  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  series: [
    { name: "Tech", values: [0.0403, 0.0456, 0.042, 0.0422, 0.0412, 0.0459, 0.0538, 0.0531, 0.0503, 0.0541] },
    { name: "Finance & Insurance", values: [0.0107, 0.0128, 0.0118, 0.0152, 0.016, 0.0192, 0.0235, 0.0279, 0.0228, 0.0209] },
    { name: "Health Care", values: [0.0019, 0.002, 0.002, 0.0019, 0.002, 0.0019, 0.0019, 0.002, 0.0019, 0.0018] },
  ],
  methods: ["Industry panel, 2015–2024", "Two-way fixed effects", "R", "USCIS + BLS data"],
  paper: "/research/h1b-term-paper.pdf",
};
