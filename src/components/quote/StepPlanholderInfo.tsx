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
import { ArrowLeft, Users, UserX } from "lucide-react";
import { toast } from "sonner";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";

const StepPlanholderInfo = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [showForm, setShowForm] = useState(data.includesSelf === true);
  const [isLoading, setIsLoading] = useState(false);

  // Local form state for planholder fields
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [email, setEmail] = useState(data.email);
  const [phCountry, setPhCountry] = useState(data.country);
  const [phState, setPhState] = useState(data.state);
  const [phPostalCode, setPhPostalCode] = useState(data.postalCode);
  const [phone, setPhone] = useState(data.phone);
  const [phoneType, setPhoneType] = useState(data.planholderPhoneType || "mobile");
  const [gender, setGender] = useState(data.planholderGender);
  const [dob, setDob] = useState(data.planholderDob);
  const [nationality, setNationality] = useState(data.planholderNationality);
  const [height, setHeight] = useState(data.planholderHeight);
  const [weight, setWeight] = useState(data.planholderWeight);

  const stateOptions = STATES_BY_COUNTRY[phCountry] || [];

  // ─── Phase 1: "Does this include you?" ─────────────────────────────────────
  if (!showForm && data.includesSelf !== true) {
    return (
      <div className="p-6 lg:p-10 flex flex-col items-center text-center">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3 mt-8">
          Does this <span className="text-primary">include you?</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-10 max-w-md">
          Let us know if the plan administrator is also covered under this insurance plan.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10">
          <button
            onClick={() => {
              updateData({ includesSelf: true });
              setShowForm(true);
            }}
            className="p-6 rounded-xl border-2 transition-all text-left border-border hover:border-muted-foreground/40"
          >
            <Users className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">Yes</p>
            <p className="text-xs text-muted-foreground">
              I am included or want to include myself
            </p>
          </button>
          <button
            onClick={() => {
              updateData({ includesSelf: false });
              setCurrentStep(STEPS.SPOUSE);
            }}
            className="p-6 rounded-xl border-2 transition-all text-left border-border hover:border-muted-foreground/40"
          >
            <UserX className="w-6 h-6 mb-2 text-foreground" />
            <p className="font-bold text-foreground">No</p>
            <p className="text-xs text-muted-foreground">
              It&apos;s for employees only
            </p>
          </button>
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentStep(STEPS.COMPANY)}
          className="rounded-full px-16 py-3 w-full max-w-md flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>
    );
  }

  // ─── Phase 2: Planholder Form ──────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/planholder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: data.quoteId,
          firstName,
          lastName,
          email,
          country: phCountry,
          state: phState,
          postalCode: phPostalCode,
          phone,
          phoneType,
          gender,
          dob,
          nationality,
          height,
          weight,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save planholder info");
      }

      updateData({
        planholderGender: gender,
        planholderDob: dob,
        planholderNationality: nationality,
        planholderHeight: height,
        planholderWeight: weight,
        planholderPhoneType: phoneType,
      });

      setCurrentStep(STEPS.SPOUSE);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save planholder info";
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
          Now, let&apos;s start with <span className="text-primary">your plan</span>
        </h2>
        <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full hidden md:block">
          Planholder information
        </span>
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">First name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Amir"
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
          <label className="text-xs text-muted-foreground mb-1 block">Email address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amir@stealthstartup.com"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 2: Country, State, Postal code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Country</label>
          <Select
            value={phCountry}
            onValueChange={(v) => {
              setPhCountry(v);
              setPhState("");
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
            <Select value={phState} onValueChange={setPhState}>
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
              value={phState}
              onChange={(e) => setPhState(e.target.value)}
              placeholder="State / Province"
              className="border-border"
            />
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Postal code</label>
          <Input
            value={phPostalCode}
            onChange={(e) => setPhPostalCode(e.target.value)}
            placeholder="90005"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 3: Phone + Phone type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Preferred phone number
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="123-456-7890"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Phone type</label>
          <div className="flex h-9 rounded-md border border-border overflow-hidden">
            {(["mobile", "home", "work"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPhoneType(type)}
                className={`flex-1 text-xs font-medium transition-colors ${
                  phoneType === type
                    ? "bg-accent text-accent-foreground"
                    : "bg-transparent text-foreground hover:bg-muted/50"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Gender, DOB, Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Date of birth</label>
          <Input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="09/09/1990"
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

      {/* Row 5: Height, Weight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Height</label>
          <Input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="190cm"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Weight</label>
          <Input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="83kg"
            className="border-border"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(STEPS.COMPANY)}
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

export default StepPlanholderInfo;
