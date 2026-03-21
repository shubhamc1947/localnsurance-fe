// Company onboarding steps (the main /get-quote/onboarding wizard)
export const STEPS = {
  ADMIN: 1,
  EMAIL_VERIFY: 2,
  COMPANY: 3,
  INCLUDE_SELF: 4,
  EMPLOYEES: 5,
  START_DATE: 6,
  PAYMENT: 7,
  SUCCESS: 8,

  // Personal onboarding sub-steps (used by StepPlanholderInfo, StepFamilyQuestions, etc.)
  PLANHOLDER: 10,
  FAMILY_QUESTIONS: 11,
  SPOUSE: 12,
  DEPENDANTS: 13,
} as const;

export type StepNumber = (typeof STEPS)[keyof typeof STEPS];

// Maps internal step to visual group (1-5) for the step indicator
export function getVisualGroup(step: number): number {
  if (step <= 2) return 1;  // Account setup
  if (step === 3) return 2; // Company info
  if (step <= 5) return 3;  // Team setup
  if (step === 6) return 4; // Finalize
  return 5;                  // Payment + Success
}

// Internal steps per visual group
export const VISUAL_GROUP_STEPS: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4, 5],
  4: [6],
  5: [7, 8],
};

// ---------------------------------------------------------------------------
// Helper functions for personal onboarding flow navigation
// (used by StepFamilyQuestions, StepSpouseDetails, StepDependantDetails)
// ---------------------------------------------------------------------------

export function getNextAfterFamilyQuestions(
  includeSpouse: boolean,
  includeDependant: boolean
): number {
  if (includeSpouse) return STEPS.SPOUSE;
  if (includeDependant) return STEPS.DEPENDANTS;
  return STEPS.START_DATE;
}

export function getNextAfterSpouse(
  includeDependant: boolean
): number {
  if (includeDependant) return STEPS.DEPENDANTS;
  return STEPS.START_DATE;
}
