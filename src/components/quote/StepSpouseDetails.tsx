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
import { ArrowLeft, Heart, HeartOff, Baby, BabyIcon } from "lucide-react";
import { toast } from "sonner";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";

const StepSpouseDetails = () => {
  const { data, updateData, setCurrentStep } = useQuote();

  // Phase tracking
  const [phase, setPhase] = useState<"question" | "form">(
    data.includeSpouse === true ? "form" : "question"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Local selections for the question phase
  const [wantsSpouse, setWantsSpouse] = useState<boolean | null>(data.includeSpouse);
  const [wantsDependant, setWantsDependant] = useState<boolean | null>(data.includeDependant);

  // Spouse form state
  const [spFirstName, setSpFirstName] = useState(data.spouseFirstName);
  const [spLastName, setSpLastName] = useState(data.spouseLastName);
  const [spPreferredName, setSpPreferredName] = useState(data.spousePreferredName);
  const [spCountry, setSpCountry] = useState(data.spouseCountry);
  const [spState, setSpState] = useState(data.spouseState);
  const [spPostalCode, setSpPostalCode] = useState(data.spousePostalCode);
  const [spOccupation, setSpOccupation] = useState(data.spouseOccupation);
  const [spOccupationIndustry, setSpOccupationIndustry] = useState(data.spouseOccupationIndustry);
  const [spGender, setSpGender] = useState(data.spouseGender);
  const [spHeight, setSpHeight] = useState(data.spouseHeight);
  const [spWeight, setSpWeight] = useState(data.spouseWeight);
  const [spNationality, setSpNationality] = useState(data.spouseNationality);
  const [spDob, setSpDob] = useState(data.spouseDob);

  const spStateOptions = STATES_BY_COUNTRY[spCountry] || [];

  // ─── Phase 1: Questions ─────────────────────────────────────────────────────
  if (phase === "question") {
    const handleContinue = () => {
      updateData({
        includeSpouse: wantsSpouse,
        includeDependant: wantsDependant,
      });

      if (wantsSpouse) {
        setPhase("form");
      } else if (wantsDependant) {
        setCurrentStep(STEPS.DEPENDANT);
      } else {
        setCurrentStep(STEPS.EMPLOYEES);
      }
    };

    return (
      <div className="p-6 lg:p-10">
        {/* Spouse question */}
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-6">
          Do you want to include your{" "}
          <span className="text-primary">spouse</span> in the plan?
        </h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10">
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
              I want to include my spouse in this plan.
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
              I don&apos;t want to include my spouse in the plan.
            </p>
          </button>
        </div>

        {/* Dependant question */}
        <h3 className="font-display font-extrabold text-xl md:text-2xl text-foreground mb-6">
          Do you want to include your{" "}
          <span className="text-primary">dependant</span> in the plan?
        </h3>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10">
          <button
            onClick={() => setWantsDependant(true)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              wantsDependant === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Baby className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">Yes</p>
            <p className="text-xs text-muted-foreground">
              I want to include my dependant in this plan.
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
            <BabyIcon className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">No</p>
            <p className="text-xs text-muted-foreground">
              I don&apos;t want to include a dependant in the plan.
            </p>
          </button>
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
            disabled={wantsSpouse === null || wantsDependant === null}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ─── Phase 2: Spouse Form ───────────────────────────────────────────────────
  const handleSubmitSpouse = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/spouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: data.quoteId,
          firstName: spFirstName,
          lastName: spLastName,
          preferredName: spPreferredName,
          country: spCountry,
          state: spState,
          postalCode: spPostalCode,
          occupation: spOccupation,
          occupationIndustry: spOccupationIndustry,
          gender: spGender,
          dob: spDob,
          nationality: spNationality,
          height: spHeight,
          weight: spWeight,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save spouse details");
      }

      updateData({
        spouseFirstName: spFirstName,
        spouseLastName: spLastName,
        spousePreferredName: spPreferredName,
        spouseCountry: spCountry,
        spouseState: spState,
        spousePostalCode: spPostalCode,
        spouseOccupation: spOccupation,
        spouseOccupationIndustry: spOccupationIndustry,
        spouseGender: spGender,
        spouseDob: spDob,
        spouseNationality: spNationality,
        spouseHeight: spHeight,
        spouseWeight: spWeight,
      });

      if (data.includeDependant) {
        setCurrentStep(STEPS.DEPENDANT);
      } else {
        setCurrentStep(STEPS.EMPLOYEES);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save spouse details";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground">
          Do you want to include your{" "}
          <span className="text-primary">spouse</span> in the plan?
        </h2>
        <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full hidden md:block">
          Spouse details
        </span>
      </div>

      {/* Row 1: Names */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">First name</label>
          <Input
            value={spFirstName}
            onChange={(e) => setSpFirstName(e.target.value)}
            placeholder="Jane"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Last name</label>
          <Input
            value={spLastName}
            onChange={(e) => setSpLastName(e.target.value)}
            placeholder="Kerim"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            What does he/she like to be called
          </label>
          <Input
            value={spPreferredName}
            onChange={(e) => setSpPreferredName(e.target.value)}
            placeholder="Preferred name"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 2: Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Country</label>
          <Select
            value={spCountry}
            onValueChange={(v) => {
              setSpCountry(v);
              setSpState("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">State</label>
          {spStateOptions.length > 0 ? (
            <Select value={spState} onValueChange={setSpState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {spStateOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={spState}
              onChange={(e) => setSpState(e.target.value)}
              placeholder="State / Province"
              className="border-border"
            />
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Postal code</label>
          <Input
            value={spPostalCode}
            onChange={(e) => setSpPostalCode(e.target.value)}
            placeholder="90005"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 3: Occupation + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Occupation</label>
          <Input
            value={spOccupation}
            onChange={(e) => setSpOccupation(e.target.value)}
            placeholder="Software Engineer"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Occupation industry</label>
          <Input
            value={spOccupationIndustry}
            onChange={(e) => setSpOccupationIndustry(e.target.value)}
            placeholder="Technology"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
          <div className="flex h-9 rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setSpGender("male")}
              className={`flex-1 text-xs font-medium transition-colors ${
                spGender === "male"
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-foreground hover:bg-muted/50"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setSpGender("female")}
              className={`flex-1 text-xs font-medium transition-colors ${
                spGender === "female"
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-foreground hover:bg-muted/50"
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Height, Weight, Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Height</label>
          <Input
            value={spHeight}
            onChange={(e) => setSpHeight(e.target.value)}
            placeholder="170cm"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Weight</label>
          <Input
            value={spWeight}
            onChange={(e) => setSpWeight(e.target.value)}
            placeholder="65kg"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nationality</label>
          <Select value={spNationality} onValueChange={setSpNationality}>
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 5: Date of birth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Date of birth</label>
          <Input
            value={spDob}
            onChange={(e) => setSpDob(e.target.value)}
            placeholder="09/09/1990"
            className="border-border"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setPhase("question")}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSubmitSpouse}
          disabled={isLoading}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {isLoading ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepSpouseDetails;
