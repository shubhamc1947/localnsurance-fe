"use client";

import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS } from "@/constants/onboarding-steps";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarDays, Info } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const StepStartDate = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.planStartDate ? new Date(data.planStartDate) : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error("Please select a start date");
      return;
    }

    setIsLoading(true);
    try {
      const isoDate = selectedDate.toISOString();
      const res = await fetch(`/api/quotes/${data.quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planStartDate: isoDate }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save start date");
      }

      updateData({ planStartDate: isoDate });
      setCurrentStep(STEPS.SUCCESS);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save start date";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Only allow future dates, within 60 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        <span className="text-primary">Start date</span>
      </h2>

      {/* Date picker */}
      <div className="max-w-lg mb-6">
        <label className="text-xs text-muted-foreground mb-1 block">
          Date on which You wish Your Plan
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10 border-border",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setOpen(false);
              }}
              disabled={(date) => date < today}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
          onClick={() => setCurrentStep(STEPS.EMPLOYEES)}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !selectedDate}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {isLoading ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepStartDate;
