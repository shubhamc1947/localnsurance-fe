// Company onboarding steps (the main /get-quote/onboarding wizard)
export const STEPS = {
  ADMIN: 1,
  EMAIL_VERIFY: 2,
  COMPANY: 3,
  INCLUDE_SELF: 4,
  EMPLOYEES: 5,
  START_DATE: 6,
  SUCCESS: 7,
} as const;

export type StepNumber = (typeof STEPS)[keyof typeof STEPS];

// Maps internal step to visual group (1-5) for the step indicator
export function getVisualGroup(step: number): number {
  if (step <= 2) return 1;  // Account setup
  if (step === 3) return 2; // Company info
  if (step <= 5) return 3;  // Team setup
  if (step === 6) return 4; // Finalize
  return 5;                  // Success
}

// Internal steps per visual group
export const VISUAL_GROUP_STEPS: Record<number, number[]> = {
  1: [1, 2],
  2: [3],
  3: [4, 5],
  4: [6],
  5: [7],
};
