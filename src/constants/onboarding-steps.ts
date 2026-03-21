export const STEPS = {
  ADMIN: 1,
  EMAIL_VERIFY: 2,
  COMPANY: 3,
  PLANHOLDER: 4,
  SPOUSE: 5,
  DEPENDANT: 6,
  EMPLOYEES: 7,
  START_DATE: 8,
  SUCCESS: 9,
} as const;

export type StepNumber = (typeof STEPS)[keyof typeof STEPS];

// Maps internal step to visual group (1-5) for the step indicator
export function getVisualGroup(step: number): number {
  if (step <= 2) return 1;  // Account setup
  if (step === 3) return 2; // Company
  if (step <= 6) return 3;  // Personal details
  if (step === 7) return 4; // Team
  return 5;                 // Finalize
}

// Number of internal steps per visual group
export const VISUAL_GROUP_STEPS: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4, 5, 6],
  4: [7],
  5: [8, 9],
};
