"use client";

import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS, getNextAfterParents } from "@/constants/onboarding-steps";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";

const StepParentsDetails = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [isLoading, setIsLoading] = useState(false);

  // Parent form state
  const [firstName, setFirstName] = useState(data.parentFirstName);
  const [lastName, setLastName] = useState(data.parentLastName);
  const [preferredName, setPreferredName] = useState(data.parentPreferredName);
  const [country, setCountry] = useState(data.parentCountry);
  const [state, setState] = useState(data.parentState);
  const [postalCode, setPostalCode] = useState(data.parentPostalCode);
  const [relationship, setRelationship] = useState(data.parentRelationship);
  const [occupation, setOccupation] = useState(data.parentOccupation);
  const [gender, setGender] = useState(data.parentGender);
  const [height, setHeight] = useState(data.parentHeight);
  const [weight, setWeight] = useState(data.parentWeight);
  const [nationality, setNationality] = useState(data.parentNationality);
  const [dob, setDob] = useState(data.parentDob);

  const stateOptions = STATES_BY_COUNTRY[country] || [];

  const handleBack = () => {
    if (data.includeSpouse === true) {
      setCurrentStep(STEPS.SPOUSE);
    } else {
      setCurrentStep(STEPS.FAMILY_QUESTIONS);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: data.quoteId,
          firstName,
          lastName,
          preferredName,
          country,
          state,
          postalCode,
          gender,
          dob,
          nationality,
          height,
          weight,
          relationship,
          occupation,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save parent details");
      }

      updateData({
        parentFirstName: firstName,
        parentLastName: lastName,
        parentPreferredName: preferredName,
        parentCountry: country,
        parentState: state,
        parentPostalCode: postalCode,
        parentGender: gender,
        parentDob: dob,
        parentNationality: nationality,
        parentHeight: height,
        parentWeight: weight,
        parentRelationship: relationship,
        parentOccupation: occupation,
      });

      const nextStep = getNextAfterParents(data.includeDependant === true);
      setCurrentStep(nextStep);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save parent details";
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
          Tell us about your{" "}
          <span className="text-primary">parent</span>
        </h2>
        <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full hidden md:block">
          Parent details
        </span>
      </div>

      {/* Row 1: Names */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">First name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Last name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Kerim"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            What does he/she like to be called
          </label>
          <Input
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
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
            value={country}
            onValueChange={(v) => {
              setCountry(v);
              setState("");
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
          {stateOptions.length > 0 ? (
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State / Province"
              className="border-border"
            />
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Postal code</label>
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="90005"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 3: Relationship, Occupation, Gender */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Relationship</label>
          <Input
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Father"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Occupation</label>
          <Input
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Retired"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
          <div className="flex h-9 rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`flex-1 text-xs font-medium transition-colors ${
                gender === "male"
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-foreground hover:bg-muted/50"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`flex-1 text-xs font-medium transition-colors ${
                gender === "female"
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
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170cm"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Weight</label>
          <Input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70kg"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nationality</label>
          <Select value={nationality} onValueChange={setNationality}>
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
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="01/15/1960"
            className="border-border"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
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

export default StepParentsDetails;
