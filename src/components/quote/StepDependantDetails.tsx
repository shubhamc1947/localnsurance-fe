"use client";

import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS } from "@/constants/onboarding-steps";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DependantFormData } from "@/types/quote";
import { CountryCombobox } from "@/components/quote/shared/CountryCombobox";
import { DateInput } from "@/components/quote/shared/DateInput";

function createEmptyDependant(id: string): DependantFormData {
  return {
    id,
    fullName: "",
    lastName: "",
    preferredName: "",
    gender: "",
    dob: "",
    country: "",
    nationality: "",
    height: "",
    weight: "",
    relationshipToPlanholder: "",
    occupation: "",
  };
}

const StepDependantDetails = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize dependants with at least one entry
  const [dependants, setDependants] = useState<DependantFormData[]>(
    data.dependants.length > 0
      ? data.dependants
      : [createEmptyDependant("1")]
  );

  const updateDependant = (index: number, partial: Partial<DependantFormData>) => {
    setDependants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...partial };
      return updated;
    });
  };

  const addDependant = () => {
    setDependants((prev) => [
      ...prev,
      createEmptyDependant(String(prev.length + 1)),
    ]);
  };

  const removeDependant = (index: number) => {
    setDependants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dependants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: data.quoteId,
          dependants,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save dependant details");
      }

      updateData({ dependants });
      setCurrentStep(STEPS.START_DATE);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save dependant details";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        Do you want to include your{" "}
        <span className="text-primary">dependant</span> in the plan
      </h2>

      {/* Dependant cards */}
      <div className="space-y-6 mb-6">
        {dependants.map((dep, i) => (
          <div key={dep.id} className="border border-border rounded-xl p-5">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm text-foreground">
                  Dependant {i + 1}
                </span>
              </div>
              {dependants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDependant(i)}
                  className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded-md hover:bg-destructive/10"
                  title="Remove dependant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Row 1: Names */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Full name
                </label>
                <Input
                  value={dep.fullName}
                  onChange={(e) => updateDependant(i, { fullName: e.target.value })}
                  placeholder="Full name"
                  className="border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Last name
                </label>
                <Input
                  value={dep.lastName}
                  onChange={(e) => updateDependant(i, { lastName: e.target.value })}
                  placeholder="Kerim"
                  className="border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  What does he/she like to be called
                </label>
                <Input
                  value={dep.preferredName}
                  onChange={(e) => updateDependant(i, { preferredName: e.target.value })}
                  placeholder="Preferred name"
                  className="border-border"
                />
              </div>
            </div>

            {/* Row 2: Gender, DOB, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                <div className="flex h-9 rounded-md border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateDependant(i, { gender: "male" })}
                    className={`flex-1 text-xs font-medium transition-colors ${
                      dep.gender === "male"
                        ? "bg-accent text-accent-foreground"
                        : "bg-transparent text-foreground hover:bg-muted/50"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDependant(i, { gender: "female" })}
                    className={`flex-1 text-xs font-medium transition-colors ${
                      dep.gender === "female"
                        ? "bg-accent text-accent-foreground"
                        : "bg-transparent text-foreground hover:bg-muted/50"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Date of birth
                </label>
                <DateInput
                  value={dep.dob}
                  onChange={(v) => updateDependant(i, { dob: v })}
                  maxDate={new Date()}
                  placeholder="Date of birth"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Country of residence
                </label>
                <CountryCombobox
                  value={dep.country}
                  onChange={(v) => updateDependant(i, { country: v })}
                />
              </div>
            </div>

            {/* Row 3: Nationality, Height, Weight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Nationality
                </label>
                <CountryCombobox
                  value={dep.nationality}
                  onChange={(v) => updateDependant(i, { nationality: v })}
                  placeholder="Select nationality"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Height</label>
                <Input
                  value={dep.height}
                  onChange={(e) => updateDependant(i, { height: e.target.value })}
                  placeholder="120cm"
                  className="border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Weight</label>
                <Input
                  value={dep.weight}
                  onChange={(e) => updateDependant(i, { weight: e.target.value })}
                  placeholder="35kg"
                  className="border-border"
                />
              </div>
            </div>

            {/* Row 4: Relationship, Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Relationship to Planholder
                </label>
                <Select
                  value={dep.relationshipToPlanholder}
                  onValueChange={(v) =>
                    updateDependant(i, { relationshipToPlanholder: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Daughter">Daughter</SelectItem>
                    <SelectItem value="Brother">Brother</SelectItem>
                    <SelectItem value="Sister">Sister</SelectItem>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Occupation (ages 16+)
                </label>
                <Input
                  value={dep.occupation}
                  onChange={(e) => updateDependant(i, { occupation: e.target.value })}
                  placeholder="Student"
                  className="border-border"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add dependant placeholder */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-5 h-5 text-primary/40" />
          <span className="text-sm text-muted-foreground">
            Dependant {dependants.length + 1}
          </span>
        </div>
        <Button
          onClick={addDependant}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 flex items-center gap-2"
        >
          Add Dependants <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => {
            if (data.includeSpouse === true) {
              setCurrentStep(STEPS.SPOUSE);
            } else {
              setCurrentStep(STEPS.FAMILY_QUESTIONS);
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

export default StepDependantDetails;
