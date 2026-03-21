"use client";

import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS } from "@/constants/onboarding-steps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Info } from "lucide-react";
import { toast } from "sonner";

const StepStartDate = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [startDate, setStartDate] = useState(data.planStartDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!startDate.trim()) {
      toast.error("Please enter a start date");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/quotes/${data.quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planStartDate: startDate }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save start date");
      }

      updateData({ planStartDate: startDate });
      setCurrentStep(STEPS.SUCCESS);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save start date";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        <span className="text-primary">Start date</span>
      </h2>

      {/* Date field */}
      <div className="max-w-lg mb-6">
        <label className="text-xs text-muted-foreground mb-1 block">
          Date on which You wish Your Plan
        </label>
        <div className="relative">
          <Input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="October 31, 2037"
            className="border-border pr-10"
          />
          <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Info notices */}
      <div className="max-w-lg space-y-4 mb-10">
        <div className="flex gap-3 p-4 bg-muted/30 rounded-xl">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cover cannot start until You have accepted all of Our terms and conditions
            following Our receipt of this application form and We have received the
            correct premium.
          </p>
        </div>

        <div className="flex gap-3 p-4 bg-muted/30 rounded-xl">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can apply for cover to start at a future date within 60 days of
            completion of this application form.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => {
            if (data.includeDependant === true) {
              setCurrentStep(STEPS.DEPENDANT);
            } else if (data.includeParents === true) {
              setCurrentStep(STEPS.PARENTS);
            } else if (data.includeSpouse === true) {
              setCurrentStep(STEPS.SPOUSE);
            } else if (data.includesSelf === true) {
              setCurrentStep(STEPS.FAMILY_QUESTIONS);
            } else {
              setCurrentStep(STEPS.EMPLOYEES);
            }
          }}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {isLoading ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepStartDate;
