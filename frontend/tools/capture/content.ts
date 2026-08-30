// Display and case-study metadata that isn't a capture parameter, so it
// doesn't belong in sites.config.ts. Every TODO here is real client
// copy/results — not something a script should invent. Replace before shipping.
export type SiteContent = {
  name: string;
  outcome: string;
  caseStudy: {
    problem: string;
    whatWeBuilt: string;
    results: string;
  };
};

const TODO_CASE_STUDY = {
  problem: "TODO: the problem in two or three sentences.",
  whatWeBuilt: "TODO: what was built — scope, stack, notable engineering.",
  results: "TODO: results, quantified where possible.",
};

export const content: Record<string, SiteContent> = {
  peeyew: {
    name: "PYM Magazine",
    outcome: "TODO: real one-line result statement",
    caseStudy: { ...TODO_CASE_STUDY },
  },
  nyulara: {
    name: "NYU Stern LARA",
    outcome: "TODO: real one-line result statement",
    caseStudy: { ...TODO_CASE_STUDY },
  },
  vistakidsdental: {
    name: "Vista Kids Dental",
    outcome: "TODO: real one-line result statement",
    caseStudy: { ...TODO_CASE_STUDY },
  },
};
