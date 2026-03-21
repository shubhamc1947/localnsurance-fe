"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import OnboardingSidebar from "@/components/quote/OnboardingSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  HeartOff,
  Baby,
  BabyIcon,
  Users,
  UserPlus,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EmployeeInfo {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
}

interface OnboardData {
  employee: EmployeeInfo;
  company: { legalName: string };
  quote: { selectedPlan: string | null };
}

interface DependantForm {
  id: string;
  fullName: string;
  lastName: string;
  preferredName: string;
  gender: string;
  dob: string;
  country: string;
  nationality: string;
  height: string;
  weight: string;
  relationshipToPlanholder: string;
  occupation: string;
}

function createEmptyDependant(id: string): DependantForm {
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

// ---------------------------------------------------------------------------
// Step Indicator (self-contained for employee flow)
// ---------------------------------------------------------------------------

function EmployeeStepIndicator({ step }: { step: number }) {
  const groups = [1, 2, 3, 4];
  const labels = ["Password", "Personal", "Spouse", "Dependants"];

  return (
    <div className="flex items-center w-full px-4 py-6">
      {groups.map((group, i) => (
        <div key={group} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all flex-shrink-0 ${
                step > group
                  ? "bg-accent border-accent text-accent-foreground"
                  : step === group
                  ? "border-accent text-accent bg-background"
                  : "border-border text-muted-foreground bg-background"
              }`}
            >
              {step > group ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                group
              )}
            </div>
            <span className="text-[10px] text-muted-foreground hidden md:block">
              {labels[i]}
            </span>
          </div>
          {i < groups.length - 1 && (
            <div className="flex-1 h-2 mx-2 rounded-full overflow-hidden bg-border mb-5">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: step > group ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function EmployeeOnboarding({ token }: { token: string }) {
  const router = useRouter();

  // Global state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OnboardData | null>(null);

  // Step 1 - Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 - Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pdCountry, setPdCountry] = useState("");
  const [pdState, setPdState] = useState("");
  const [pdPostalCode, setPdPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneType, setPhoneType] = useState("mobile");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Step 3 - Spouse
  const [includeSpouse, setIncludeSpouse] = useState<boolean | null>(null);
  const [spFirstName, setSpFirstName] = useState("");
  const [spLastName, setSpLastName] = useState("");
  const [spPreferredName, setSpPreferredName] = useState("");
  const [spCountry, setSpCountry] = useState("");
  const [spState, setSpState] = useState("");
  const [spOccupation, setSpOccupation] = useState("");
  const [spOccupationIndustry, setSpOccupationIndustry] = useState("");
  const [spGender, setSpGender] = useState("");
  const [spHeight, setSpHeight] = useState("");
  const [spWeight, setSpWeight] = useState("");
  const [spNationality, setSpNationality] = useState("");
  const [spDob, setSpDob] = useState("");

  // Step 4 - Dependants
  const [includeDependant, setIncludeDependant] = useState<boolean | null>(null);
  const [dependants, setDependants] = useState<DependantForm[]>([
    createEmptyDependant("1"),
  ]);

  // ─── Validate token on mount ─────────────────────────────────────────────────
  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch(`/api/onboard/${token}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Invalid link");
        setData(json);
        // Pre-fill name + email
        const nameParts = (json.employee.fullName || "").split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(json.employee.email || "");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to validate onboarding link";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, [token]);

  // ─── Save step helper ─────────────────────────────────────────────────────────
  const saveStep = useCallback(
    async (stepNum: number | string, body: Record<string, unknown>) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/onboard/${token}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: stepNum, ...body }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to save");
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to save";
        toast.error(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [token]
  );

  // ─── Step handlers ─────────────────────────────────────────────────────────
  const handleStep1 = async () => {
    if (!password) {
      toast.error("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const ok = await saveStep(1, { password });
    if (ok) setStep(2);
  };

  const handleStep2 = async () => {
    if (!firstName || !lastName) {
      toast.error("Please enter your first and last name.");
      return;
    }
    const ok = await saveStep(2, {
      personalDetails: {
        firstName,
        lastName,
        email,
        country: pdCountry,
        state: pdState,
        postalCode: pdPostalCode,
        phone,
        phoneType,
        gender,
        dob,
        nationality,
        height,
        weight,
      },
    });
    if (ok) setStep(3);
  };

  const handleStep3 = async () => {
    if (includeSpouse === null) {
      toast.error("Please select whether to include a spouse.");
      return;
    }
    const body: Record<string, unknown> = { includeSpouse };
    if (includeSpouse) {
      body.spouse = {
        firstName: spFirstName,
        lastName: spLastName,
        preferredName: spPreferredName,
        country: spCountry,
        state: spState,
        gender: spGender,
        dob: spDob,
        nationality: spNationality,
        height: spHeight,
        weight: spWeight,
        occupation: spOccupation,
        occupationIndustry: spOccupationIndustry,
      };
    }
    const ok = await saveStep(3, body);
    if (ok) setStep(4);
  };

  const handleStep4 = async () => {
    if (includeDependant === null) {
      toast.error("Please select whether to include dependants.");
      return;
    }
    const body: Record<string, unknown> = { includeDependant };
    if (includeDependant) {
      body.dependants = dependants;
    }
    const ok = await saveStep(4, body);
    if (!ok) return;
    // Mark onboarding complete
    const complete = await saveStep("complete", {});
    if (complete) setStep(5);
  };

  // ─── Dependant helpers ─────────────────────────────────────────────────────
  const updateDependant = (index: number, partial: Partial<DependantForm>) => {
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

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Validating your link...</p>
        </div>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-sm border border-border p-10 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-xl text-foreground mb-2">
            Onboarding Unavailable
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {error || "Something went wrong."}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="rounded-full px-8"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // ─── Computed values ───────────────────────────────────────────────────────
  const pdStateOptions = STATES_BY_COUNTRY[pdCountry] || [];
  const spStateOptions = STATES_BY_COUNTRY[spCountry] || [];
  const planLabel =
    data.quote.selectedPlan
      ? data.quote.selectedPlan.charAt(0).toUpperCase() +
        data.quote.selectedPlan.slice(1)
      : "Standard";

  // ─── Step Renderers ────────────────────────────────────────────────────────

  // STEP 1: Welcome + Set Password
  const renderStep1 = () => (
    <div className="p-6 lg:p-10 flex flex-col items-center text-center">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3 mt-4">
        Welcome to <span className="text-primary">Localsurance</span>,{" "}
        {data.employee.fullName.split(" ")[0]}!
      </h2>
      <p className="text-muted-foreground text-sm mb-2 max-w-md">
        <span className="font-semibold text-foreground">
          {data.company.legalName}
        </span>{" "}
        has enrolled you in their health insurance plan.
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-md">
        Plan: <span className="font-medium text-primary">{planLabel}</span>
      </p>

      <div className="w-full max-w-md space-y-4 text-left">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Create a password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Confirm password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        onClick={handleStep1}
        disabled={saving}
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 mt-8 flex items-center gap-2"
      >
        {saving ? "Saving..." : "Continue"}{" "}
        {!saving && <ArrowRight className="w-4 h-4" />}
      </Button>
    </div>
  );

  // STEP 2: Personal Details
  const renderStep2 = () => (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground">
          Let&apos;s start with{" "}
          <span className="text-primary">your personal details</span>
        </h2>
        <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full hidden md:block">
          Personal information
        </span>
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            First name
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Last name
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Email address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 2: Country, State, Postal code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Country
          </label>
          <Select
            value={pdCountry}
            onValueChange={(v) => {
              setPdCountry(v);
              setPdState("");
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
          <label className="text-xs text-muted-foreground mb-1 block">
            State
          </label>
          {pdStateOptions.length > 0 ? (
            <Select value={pdState} onValueChange={setPdState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {pdStateOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={pdState}
              onChange={(e) => setPdState(e.target.value)}
              placeholder="State / Province"
              className="border-border"
            />
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Postal code
          </label>
          <Input
            value={pdPostalCode}
            onChange={(e) => setPdPostalCode(e.target.value)}
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
          <label className="text-xs text-muted-foreground mb-1 block">
            Phone type
          </label>
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
          <label className="text-xs text-muted-foreground mb-1 block">
            Gender
          </label>
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
          <label className="text-xs text-muted-foreground mb-1 block">
            Date of birth
          </label>
          <Input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="09/09/1990"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Nationality
          </label>
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
          <label className="text-xs text-muted-foreground mb-1 block">
            Height
          </label>
          <Input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="190cm"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Weight
          </label>
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
          onClick={() => setStep(1)}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleStep2}
          disabled={saving}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {saving ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );

  // STEP 3: Spouse
  const renderStep3 = () => {
    const showSpouseForm = includeSpouse === true;

    // If no choice yet or chose "No", show question cards
    if (!showSpouseForm) {
      return (
        <div className="p-6 lg:p-10">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-6">
            Do you want to include your{" "}
            <span className="text-primary">spouse</span> in the plan?
          </h2>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10">
            <button
              onClick={() => setIncludeSpouse(true)}
              className="p-6 rounded-xl border-2 transition-all text-left border-border hover:border-muted-foreground/40"
            >
              <Heart className="w-6 h-6 mb-2 text-foreground" />
              <p className="font-bold text-foreground">Yes</p>
              <p className="text-xs text-muted-foreground">
                I want to include my spouse in this plan.
              </p>
            </button>
            <button
              onClick={() => setIncludeSpouse(false)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                includeSpouse === false
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

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="rounded-full px-8 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              onClick={handleStep3}
              disabled={saving || includeSpouse === null}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
            >
              {saving ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      );
    }

    // Spouse form
    return (
      <div className="p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground">
            Tell us about your{" "}
            <span className="text-primary">spouse</span>
          </h2>
          <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full hidden md:block">
            Spouse details
          </span>
        </div>

        {/* Row 1: Names */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              First name
            </label>
            <Input
              value={spFirstName}
              onChange={(e) => setSpFirstName(e.target.value)}
              placeholder="Jane"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Last name
            </label>
            <Input
              value={spLastName}
              onChange={(e) => setSpLastName(e.target.value)}
              placeholder="Doe"
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
            <label className="text-xs text-muted-foreground mb-1 block">
              Country
            </label>
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
            <label className="text-xs text-muted-foreground mb-1 block">
              State
            </label>
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
            <label className="text-xs text-muted-foreground mb-1 block">
              Gender
            </label>
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

        {/* Row 3: Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Occupation
            </label>
            <Input
              value={spOccupation}
              onChange={(e) => setSpOccupation(e.target.value)}
              placeholder="Software Engineer"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Occupation industry
            </label>
            <Input
              value={spOccupationIndustry}
              onChange={(e) => setSpOccupationIndustry(e.target.value)}
              placeholder="Technology"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Date of birth
            </label>
            <Input
              value={spDob}
              onChange={(e) => setSpDob(e.target.value)}
              placeholder="09/09/1990"
              className="border-border"
            />
          </div>
        </div>

        {/* Row 4: Physical + Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Height
            </label>
            <Input
              value={spHeight}
              onChange={(e) => setSpHeight(e.target.value)}
              placeholder="170cm"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Weight
            </label>
            <Input
              value={spWeight}
              onChange={(e) => setSpWeight(e.target.value)}
              placeholder="65kg"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Nationality
            </label>
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

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIncludeSpouse(null)}
            className="rounded-full px-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={handleStep3}
            disabled={saving}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
          >
            {saving ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    );
  };

  // STEP 4: Dependants
  const renderStep4 = () => {
    const showDependantForm = includeDependant === true;

    // If no choice yet or chose "No", show question cards
    if (!showDependantForm) {
      return (
        <div className="p-6 lg:p-10">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-6">
            Do you want to include your{" "}
            <span className="text-primary">dependants</span> in the plan?
          </h2>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10">
            <button
              onClick={() => setIncludeDependant(true)}
              className="p-6 rounded-xl border-2 transition-all text-left border-border hover:border-muted-foreground/40"
            >
              <Baby className="w-6 h-6 mb-2 text-foreground" />
              <p className="font-bold text-foreground">Yes</p>
              <p className="text-xs text-muted-foreground">
                I want to include my dependants in this plan.
              </p>
            </button>
            <button
              onClick={() => setIncludeDependant(false)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                includeDependant === false
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <BabyIcon className="w-6 h-6 mb-2 text-foreground" />
              <p className="font-bold text-foreground">No</p>
              <p className="text-xs text-muted-foreground">
                I don&apos;t want to include dependants in the plan.
              </p>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(3)}
              className="rounded-full px-8 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              onClick={handleStep4}
              disabled={saving || includeDependant === null}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
            >
              {saving ? "Saving..." : "Complete Onboarding"}
            </Button>
          </div>
        </div>
      );
    }

    // Dependant forms
    return (
      <div className="p-6 lg:p-10">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
          Tell us about your{" "}
          <span className="text-primary">dependants</span>
        </h2>

        <div className="space-y-6 mb-6">
          {dependants.map((dep, i) => (
            <div key={dep.id} className="border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm text-foreground">
                  Dependant {i + 1}
                </span>
              </div>

              {/* Row 1: Names */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Full name
                  </label>
                  <Input
                    value={dep.fullName}
                    onChange={(e) =>
                      updateDependant(i, { fullName: e.target.value })
                    }
                    placeholder="Kyle"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Last name
                  </label>
                  <Input
                    value={dep.lastName}
                    onChange={(e) =>
                      updateDependant(i, { lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    What does he/she like to be called
                  </label>
                  <Input
                    value={dep.preferredName}
                    onChange={(e) =>
                      updateDependant(i, { preferredName: e.target.value })
                    }
                    placeholder="Preferred name"
                    className="border-border"
                  />
                </div>
              </div>

              {/* Row 2: Gender, DOB, Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Gender
                  </label>
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
                  <Input
                    value={dep.dob}
                    onChange={(e) =>
                      updateDependant(i, { dob: e.target.value })
                    }
                    placeholder="09/09/2010"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Country of residence
                  </label>
                  <Select
                    value={dep.country}
                    onValueChange={(v) => updateDependant(i, { country: v })}
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
              </div>

              {/* Row 3: Nationality, Height, Weight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Nationality
                  </label>
                  <Select
                    value={dep.nationality}
                    onValueChange={(v) =>
                      updateDependant(i, { nationality: v })
                    }
                  >
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
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Height
                  </label>
                  <Input
                    value={dep.height}
                    onChange={(e) =>
                      updateDependant(i, { height: e.target.value })
                    }
                    placeholder="120cm"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Weight
                  </label>
                  <Input
                    value={dep.weight}
                    onChange={(e) =>
                      updateDependant(i, { weight: e.target.value })
                    }
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
                  <Input
                    value={dep.relationshipToPlanholder}
                    onChange={(e) =>
                      updateDependant(i, {
                        relationshipToPlanholder: e.target.value,
                      })
                    }
                    placeholder="Child"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Occupation (ages 16+)
                  </label>
                  <Input
                    value={dep.occupation}
                    onChange={(e) =>
                      updateDependant(i, { occupation: e.target.value })
                    }
                    placeholder="Student"
                    className="border-border"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add dependant */}
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
            onClick={() => setIncludeDependant(null)}
            className="rounded-full px-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={handleStep4}
            disabled={saving}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
          >
            {saving ? "Saving..." : "Complete Onboarding"}
          </Button>
        </div>
      </div>
    );
  };

  // STEP 5: Success
  const renderStep5 = () => (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {/* 3D Checkmark */}
      <div className="mb-8 relative">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #60A5FA 0%, #2563EB 45%, #1D4ED8 70%, #1E3A8A 100%)",
            boxShadow:
              "0 20px 60px rgba(37,99,235,0.45), 0 8px 24px rgba(37,99,235,0.3), inset 0 2px 6px rgba(255,255,255,0.25)",
          }}
        >
          <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3">
        You&apos;re All Set!
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
        Your onboarding is complete. You can now log in to view your plan
        details.
      </p>

      <Button
        onClick={() => router.push("/login")}
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-3"
      >
        Go to Login
      </Button>
    </div>
  );

  // ─── Render current step ───────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <OnboardingSidebar />
        </div>

        {/* Main content */}
        <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
          {step < 5 && <EmployeeStepIndicator step={step} />}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
