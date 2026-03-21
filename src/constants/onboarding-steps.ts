export const STEPS = {
  ADMIN: 1,
  EMAIL_VERIFY: 2,
  COMPANY: 3,
  INCLUDE_SELF: 4,
  EMPLOYEES: 5,
  PLANHOLDER: 6,         // only if includesSelf = true
  FAMILY_QUESTIONS: 7,   // ask: spouse? parents? dependants?
  SPOUSE: 8,             // only if includeSpouse = true
  PARENTS: 9,            // only if includeParents = true
  DEPENDANT: 10,         // only if includeDependant = true
  START_DATE: 11,
  SUCCESS: 12,
} as const;

export type StepNumber = (typeof STEPS)[keyof typeof STEPS];

// Maps internal step to visual group (1-5) for the step indicator
export function getVisualGroup(step: number): number {
  if (step <= 2) return 1;   // Account setup
  if (step === 3) return 2;  // Company info
  if (step <= 5) return 3;   // Team setup
  if (step <= 10) return 4;  // Personal details (Planholder + Family)
  return 5;                   // Finalize
}

// Internal steps per visual group
export const VISUAL_GROUP_STEPS: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4, 5],
  4: [6, 7, 8, 9, 10],
  5: [11, 12],
};

// After employees: go to planholder if self, else start date
export function getNextAfterEmployees(includesSelf: boolean): number {
  return includesSelf ? STEPS.PLANHOLDER : STEPS.START_DATE;
}

// After family questions: find the first "yes" form to show, or skip to start date
export function getNextAfterFamilyQuestions(
  includeSpouse: boolean,
  includeParents: boolean,
  includeDependant: boolean
): number {
  if (includeSpouse) return STEPS.SPOUSE;
  if (includeParents) return STEPS.PARENTS;
  if (includeDependant) return STEPS.DEPENDANT;
  return STEPS.START_DATE;
}

// After spouse form: find next "yes" form
export function getNextAfterSpouse(
  includeParents: boolean,
  includeDependant: boolean
): number {
  if (includeParents) return STEPS.PARENTS;
  if (includeDependant) return STEPS.DEPENDANT;
  return STEPS.START_DATE;
}

// After parents form: find next "yes" form
export function getNextAfterParents(includeDependant: boolean): number {
  if (includeDependant) return STEPS.DEPENDANT;
  return STEPS.START_DATE;
}
