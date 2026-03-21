"use client";

import { useQuote } from "@/contexts/QuoteContext";
import { getVisualGroup, VISUAL_GROUP_STEPS } from "@/constants/onboarding-steps";

const StepIndicator = () => {
  const { currentStep } = useQuote();
  const activeGroup = getVisualGroup(currentStep);
  const groups = [1, 2, 3, 4, 5];

  // Calculate progress of the connecting bar between groups.
  // A bar after group `g` is fully filled when the active group is past `g`,
  // partially filled when the active group equals `g` and there are multiple
  // internal steps within that group, and empty otherwise.
  const barProgress = (group: number): string => {
    if (activeGroup > group) return "100%";
    if (activeGroup === group) {
      const stepsInGroup = VISUAL_GROUP_STEPS[group];
      if (stepsInGroup.length <= 1) return "0%";
      const idx = stepsInGroup.indexOf(currentStep);
      if (idx <= 0) return "0%";
      return `${(idx / (stepsInGroup.length - 1)) * 100}%`;
    }
    return "0%";
  };

  return (
    <div className="flex items-center w-full px-4 py-6">
      {groups.map((group, i) => (
        <div key={group} className="flex items-center flex-1 last:flex-none">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all flex-shrink-0 ${
              activeGroup > group
                ? "bg-accent border-accent text-accent-foreground"
                : activeGroup === group
                ? "border-accent text-accent bg-background"
                : "border-border text-muted-foreground bg-background"
            }`}
          >
            {group}
          </div>
          {i < groups.length - 1 && (
            <div className="flex-1 h-2 mx-2 rounded-full overflow-hidden bg-border">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: barProgress(group) }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
