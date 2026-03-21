export const STEPS = {
  ADMIN: 1,
  EMAIL_VERIFY: 2,
  COMPANY: 3,
  INCLUDE_SELF: 4,
  EMPLOYEES: 5,
  PLANHOLDER: 6,      // only if includesSelf = true
  SPOUSE: 7,           // only if includesSelf = true
  DEPENDANT: 8,        // only if includesSelf = true
  START_DATE: 9,
  SUCCESS: 10,
} as const;

export type StepNumber = (typeof STEPS)[keyof typeof STEPS];

// Maps internal step to visual group (1-5) for the step indicator
export function getVisualGroup(step: number): number {
  if (step <= 2) return 1;  // Account setup (Admin + Email verify)
  if (step === 3) return 2; // Company info
  if (step <= 5) return 3;  // Team setup (Include self + Employees)
  if (step <= 8) return 4;  // Personal details (Planholder + Spouse + Dependant)
  return 5;                  // Finalize (Start date + Success)
}

// Internal steps per visual group
export const VISUAL_GROUP_STEPS: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4, 5],
  4: [6, 7, 8],
  5: [9, 10],
};

// Get next step after INCLUDE_SELF based on user's choice
export function getNextAfterIncludeSelf(includesSelf: boolean): number {
  return STEPS.EMPLOYEES; // Always go to employees next
}

// Get next step after EMPLOYEES based on user's choice
export function getNextAfterEmployees(includesSelf: boolean): number {
  return includesSelf ? STEPS.PLANHOLDER : STEPS.START_DATE;
}

// Get next step after DEPENDANT
export function getNextAfterDependant(): number {
  return STEPS.START_DATE;
}
