export interface PlanDetail {
  id: string;
  name: string;
  inclusions: string[];
  exclusions: string[];
}

export const PLAN_DETAILS: Record<string, PlanDetail> = {
  basic: {
    id: "basic",
    name: "Basic",
    inclusions: [
      "Inpatient hospitalization",
      "Emergency room visits",
      "Basic diagnostics & lab tests",
      "Ambulance services",
      "Telemedicine consultations",
      "Annual wellness checkup",
    ],
    exclusions: [
      "Dental & vision care",
      "Mental health therapy",
      "Maternity & newborn care",
      "Physiotherapy & rehabilitation",
      "Pre-existing conditions (first 12 months)",
      "Cosmetic procedures",
    ],
  },
  medium: {
    id: "medium",
    name: "Medium",
    inclusions: [
      "Everything in Basic, plus:",
      "Dental care (preventive & basic)",
      "Vision care (exams & corrective lenses)",
      "Mental health & therapy sessions",
      "Maternity & newborn care",
      "Specialist consultations",
      "Physiotherapy (limited sessions)",
    ],
    exclusions: [
      "Worldwide coverage (limited to plan region)",
      "Executive health screening",
      "Cosmetic & elective procedures",
      "Experimental treatments",
      "Pre-existing conditions (first 6 months)",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    inclusions: [
      "Everything in Medium, plus:",
      "Worldwide coverage (any hospital)",
      "Executive health screening program",
      "Family dependents coverage",
      "Unlimited specialist visits",
      "Full physiotherapy & rehab",
      "Medical evacuation & repatriation",
      "Second medical opinion",
    ],
    exclusions: [
      "Cosmetic & elective procedures",
      "Experimental/investigational treatments",
      "Self-inflicted injuries",
      "War & terrorism-related injuries",
    ],
  },
};
