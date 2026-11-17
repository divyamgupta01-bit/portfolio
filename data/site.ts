// All site-wide copy lives here. Edit freely; components read from this file.
// Values containing "TODO" are rendered as an em dash (—) in the UI, never as raw text.

export const site = {
  name: "Divyam Gupta",
  tagline: "Economics student · Technology risk, EY (summer 2026)",
  location: "San José, CA",
  email: "divyam5129@gmail.com",
  linkedin: "https://www.linkedin.com/in/divyam5129",
  resume: "/resume.pdf",
  graduation: "May 2027",
  availability: "June 2027",
  year: 2026,

  hero: {
    primaryCta: "View work",
    secondaryCta: "Resume",
  },

  about: {
    statement:
      "I'm studying Econometrics and Quantitative Economics at San José State, with a minor in Business. This summer at EY, I worked in technology risk and tested the IT controls that keep financial systems trustworthy. That's where I want to build my career.",
    // phrases in the statement that get their own colour
    highlights: [
      { text: "Econometrics and Quantitative Economics", hue: "gold" },
      { text: "technology risk", hue: "sky" },
      { text: "IT controls", hue: "pine" },
    ],
    portrait: "/photos/portrait.jpg",
    portraitAlt: "Divyam Gupta in a dark suit and striped tie, arms crossed, in a glass-walled atrium",
    caption: "FIG. 01",
    spec: [
      { label: "Based in", value: "San José, CA" },
      { label: "Studying", value: "B.S. Economics, SJSU" },
      { label: "Graduating", value: "May 2027" },
    ],
  },

  // "Now": what's happening at the moment. Each item is a card.
  now: {
    title: "Right now",
    intro: "Senior year, a finished tech risk internship at EY, and the search for a full-time role starting June 2027.",
    items: [
      {
        icon: "shield",
        kicker: "Completed",
        title: "Tech risk internship, EY",
        body: "Summer 2026: SOX and IT general controls testing on two audit engagements.",
        hue: "sky",
      },
      {
        icon: "compass",
        kicker: "Looking for",
        title: "Full-time roles, 2027",
        body: "New-grad roles in IT audit, tech risk, internal audit and risk management.",
        hue: "trail",
      },
      {
        icon: "box",
        kicker: "Community",
        title: "IIA student member",
        body: "Student member of the Institute of Internal Auditors, learning the profession beyond the classroom.",
        hue: "pine",
      },
    ],
  },

  // IT general controls explained in plain English.
  toolkit: {
    title: "What I learned testing controls",
    intro: "IT general controls, in plain English: the checks that keep the systems behind the numbers trustworthy, and what I learned testing them as an intern.",
    domains: [
      {
        id: "access",
        code: "ITGC-01",
        title: "Access",
        line: "The right people, and only the right people, can get in.",
        examples: ["Joiners, movers and leavers", "Periodic user access reviews", "Privileged and admin accounts", "Password and authentication settings"],
        hue: "sky",
      },
      {
        id: "change",
        code: "ITGC-02",
        title: "Change",
        line: "Nothing reaches production without being requested, tested and approved.",
        examples: ["Change tickets and approvals", "Testing before release", "Developers kept out of production", "Emergency change handling"],
        hue: "trail",
      },
      {
        id: "operations",
        code: "ITGC-03",
        title: "Operations",
        line: "Systems run the way they should, and recover when they don't.",
        examples: ["Scheduled job monitoring", "Backups and restores", "Incident and problem management", "Cloud and third-party reliance (SOC reports)"],
        hue: "pine",
      },
      {
        id: "development",
        code: "ITGC-04",
        title: "Development",
        line: "New systems and data moves are built with controls from day one.",
        examples: ["Project approvals", "User acceptance testing", "Data conversion checks", "Go-live sign-off"],
        hue: "dusk",
      },
    ],
    // How a control gets tested, step by step.
    process: [
      { title: "Understand", body: "What could go wrong, and which control stops it." },
      { title: "Walk through", body: "Follow one example end to end with the control owner." },
      { title: "Sample", body: "Pick the items to test across the period." },
      { title: "Test", body: "Check design and operating effectiveness against evidence." },
      { title: "Document", body: "Workpapers clear enough for a reviewer to re-perform." },
    ],
    // The workpaper that builds up beside the steps. Generic, made-up example data: not from any client.
    example: {
      label: "Illustrative example · not client data",
      control: {
        id: "AC-03",
        title: "Quarterly user access review",
        text: "Each quarter the system owner reviews who can access the finance system and removes anyone who no longer needs it.",
        risk: "People keep access they no longer need.",
      },
      walkthrough: ["Listing pulled", "Owner reviews", "Removals ticketed", "Access removed"],
      population: "Q3 review listing",
      attributes: ["Reviewed", "Action taken", "On time"],
      rows: [
        { id: "USR-0142", role: "AP clerk", decision: "Keep", exception: false },
        { id: "USR-0217", role: "GL accountant", decision: "Keep", exception: false },
        { id: "USR-0388", role: "Contractor, left", decision: "Remove", exception: true },
        { id: "USR-0401", role: "Payroll admin", decision: "Keep", exception: false },
        { id: "USR-0456", role: "IT support", decision: "Remove", exception: false },
        { id: "USR-0519", role: "Controller", decision: "Keep", exception: false },
      ],
      exceptionNote: "Removal ticketed but access still active 45 days later.",
      conclusion: "1 exception: a removal was not completed on time. Evaluated and reported to management.",
    },
  },

  // "On paper": the résumé facts recruiters scan for. Keep it to what's on the résumé.
  record: {
    title: "On paper",
    intro: "The short version: grades, awards, a certification and the roles I've taken on outside class.",
    academics: {
      gpa: "3.64",
      degree: "B.S. Economics, minor in Business",
      school: "San José State University · May 2027",
      awards: ["Global Spartan Scholarship", "Dean's Scholar", "President's Scholar"],
      coursework: ["Financial & Managerial Accounting", "Econometric & Research Methods", "Statistics"],
    },
    certifications: [{ name: "Microsoft Excel Associate", issuer: "Microsoft · Certified" }],
    affiliations: [
      {
        name: "Institute of Internal Auditors",
        detail: "Member, San José Chapter · Sep 2026",
        note: "Campus to Career: IIA Student & Chapter Summit, Mountain View · 2 CPE credits",
      },
    ],
    leadership: [
      {
        role: "Secretary",
        org: "Indian Student Organisation, SJSU",
        period: "Aug 2024 – Present",
        line: "Coordinated venue setup for an event serving 1,200+ attendees; earlier, as Finance Director, developed the club's budgeting guidelines.",
      },
      {
        role: "VP of Membership",
        org: "Financial Management Association, SJSU",
        period: "Aug 2024 – Aug 2025",
        line: "Organized 5+ social events for networking and led a team of three running newsletters and attendance tracking.",
      },
    ],
  },

  skills: {
    work: [
      "SOX",
      "IT general controls (ITGCs)",
      "Application controls (ITACs)",
      "Internal controls",
      "Risk assessment",
      "Audit documentation",
      "SQL",
      "Python",
      "R",
      "Excel (PivotTables, VLOOKUP)",
      "Econometrics",
      "Regression analysis",
    ],
    interests: ["Camping", "Photography"],
    languages: ["English", "Hindi", "Punjabi"],
  },

  contact: {
    headline: "Let's talk.",
    intro: "Open to new-grad roles in IT audit, tech risk, internal audit and risk management from June 2027.",
  },

  // Section labels used in the HUD and section headers. Order = scroll order.
  sections: [
    { id: "hero", label: "The Bay" },
    { id: "about", label: "About" },
    { id: "now", label: "Now" },
    { id: "record", label: "On Paper" },
    { id: "experience", label: "Experience" },
    { id: "work", label: "Selected Work" },
    { id: "toolkit", label: "IT Controls" },
    { id: "gallery", label: "Beyond Work" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ],
};

/** Index of a section in scroll order (drives the time of day). */
export function sectionIndex(id: string): number {
  return site.sections.findIndex((s) => s.id === id);
}

/** Colour families used by cards, tags and placeholder art. */
export type Hue = "dawn" | "sky" | "trail" | "pine" | "dusk" | "gold";
export const hues: Record<Hue, { a: string; b: string }> = {
  dawn: { a: "#ff8a5b", b: "#c084fc" },
  sky: { a: "#38bdf8", b: "#4fd1c5" },
  trail: { a: "#ff6a2b", b: "#fbbf24" },
  pine: { a: "#34d399", b: "#4fd1c5" },
  dusk: { a: "#a78bfa", b: "#f472b6" },
  gold: { a: "#fbbf24", b: "#ff8a5b" },
};

/** Render helper: anything still marked TODO shows as an em dash. */
export function display(value: string | undefined | null): string {
  if (!value || /TODO/i.test(value)) return "—";
  return value;
}

export function isTodo(value: string | undefined | null): boolean {
  return !value || /TODO/i.test(value);
}
