"use client";

import { useQuote } from "@/contexts/QuoteContext";

const StepIndicator = () => {
  const { currentStep } = useQuote();
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center w-full px-4 py-6">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all flex-shrink-0 ${
              i + 1 < currentStep
                ? "bg-accent border-accent text-accent-foreground"
                : i + 1 === currentStep
                ? "border-accent text-accent bg-background"
                : "border-border text-muted-foreground bg-background"
            }`}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-2 mx-2 rounded-full overflow-hidden bg-border">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: i + 1 < currentStep ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
