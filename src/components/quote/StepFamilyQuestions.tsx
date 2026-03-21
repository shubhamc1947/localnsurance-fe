"use client";

import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS, getNextAfterFamilyQuestions } from "@/constants/onboarding-steps";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, HeartOff, Users, UserX, Link, Unlink } from "lucide-react";

const StepFamilyQuestions = () => {
  const { data, updateData, setCurrentStep } = useQuote();

  const [wantsSpouse, setWantsSpouse] = useState<boolean | null>(data.includeSpouse);
  const [wantsParents, setWantsParents] = useState<boolean | null>(data.includeParents);
  const [wantsDependant, setWantsDependant] = useState<boolean | null>(data.includeDependant);

  const allAnswered =
    wantsSpouse !== null && wantsParents !== null && wantsDependant !== null;

  const handleContinue = () => {
    if (!allAnswered) return;

    updateData({
      includeSpouse: wantsSpouse,
      includeParents: wantsParents,
      includeDependant: wantsDependant,
    });

    const nextStep = getNextAfterFamilyQuestions(
      wantsSpouse!,
      wantsParents!,
      wantsDependant!
    );
    setCurrentStep(nextStep);
  };

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        Who would you like to include in your{" "}
        <span className="text-primary">plan</span>?
      </h2>

      {/* Question 1: Spouse */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-foreground mb-3">
          Do you want to include your spouse in the plan?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <button
            onClick={() => setWantsSpouse(true)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsSpouse === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Heart className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">Yes</p>
            <p className="text-xs text-muted-foreground">
              Include my spouse in this plan.
            </p>
          </button>
          <button
            onClick={() => setWantsSpouse(false)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsSpouse === false
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <HeartOff className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">No</p>
            <p className="text-xs text-muted-foreground">
              Don&apos;t include my spouse.
            </p>
          </button>
        </div>
      </div>

      {/* Question 2: Parents */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-foreground mb-3">
          Do you want to include your parents in the plan?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <button
            onClick={() => setWantsParents(true)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsParents === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Users className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">Yes</p>
            <p className="text-xs text-muted-foreground">
              Include my parents in this plan.
            </p>
          </button>
          <button
            onClick={() => setWantsParents(false)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsParents === false
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <UserX className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">No</p>
            <p className="text-xs text-muted-foreground">
              Don&apos;t include my parents.
            </p>
          </button>
        </div>
      </div>

      {/* Question 3: Dependant */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-foreground mb-3">
          Do you want to include your dependant in the plan?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <button
            onClick={() => setWantsDependant(true)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsDependant === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Link className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">Yes</p>
            <p className="text-xs text-muted-foreground">
              Include my dependant in this plan.
            </p>
          </button>
          <button
            onClick={() => setWantsDependant(false)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsDependant === false
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Unlink className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">No</p>
            <p className="text-xs text-muted-foreground">
              Don&apos;t include my dependant.
            </p>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(STEPS.PLANHOLDER)}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!allAnswered}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepFamilyQuestions;
