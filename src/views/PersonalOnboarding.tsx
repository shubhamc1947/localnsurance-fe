"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

type FamilyFormStep = "questions" | "spouse" | "parents" | "dependants";

// ---------------------------------------------------------------------------
// Step Indicator (4 steps)
// ---------------------------------------------------------------------------

function PersonalStepIndicator({ step }: { step: number }) {
  const groups = [1, 2, 3, 4];
  const labels = ["Personal", "Family", "Details", "Done"];

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

export default function PersonalOnboarding() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Global state
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(true);

  // Step 1 - Personal Details
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

  // Step 2 - Family Questions
  const [includeSpouse, setIncludeSpouse] = useState<boolean | null>(null);
  const [includeParents, setIncludeParents] = useState<boolean | null>(null);
  const [includeDependant, setIncludeDependant] = useState<boolean | null>(null);

  // Step 3 - Family form sub-step
  const [familyFormStep, setFamilyFormStep] = useState<FamilyFormStep>("questions");

  // Spouse fields
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

  // Parent fields
  const [prFirstName, setPrFirstName] = useState("");
  const [prLastName, setPrLastName] = useState("");
  const [prPreferredName, setPrPreferredName] = useState("");
  const [prCountry, setPrCountry] = useState("");
  const [prState, setPrState] = useState("");
  const [prGender, setPrGender] = useState("");
  const [prDob, setPrDob] = useState("");
  const [prNationality, setPrNationality] = useState("");
  const [prHeight, setPrHeight] = useState("");
  const [prWeight, setPrWeight] = useState("");
  const [prRelationship, setPrRelationship] = useState("");
  const [prOccupation, setPrOccupation] = useState("");

  // Dependants
  const [dependants, setDependants] = useState<DependantForm[]>([
    createEmptyDependant("1"),
  ]);

  // ─── Pre-fill from auth ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // ─── Fetch user's latest quote ──────────────────────────────────────────────
  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("/api/quotes");
        const json = await res.json();
        if (res.ok && json.quotes && json.quotes.length > 0) {
          setQuoteId(json.quotes[0].id);
        }
      } catch {
        // Quote fetch failed - will show error when user tries to save
      } finally {
        setQuoteLoading(false);
      }
    }
    if (!authLoading) {
      fetchQuote();
    }
  }, [authLoading]);

  // ─── Determine next family form step ────────────────────────────────────────
  const getNextFamilyStep = useCallback(
    (after: FamilyFormStep): FamilyFormStep | "done" => {
      const order: FamilyFormStep[] = ["spouse", "parents", "dependants"];
      const flags = [includeSpouse, includeParents, includeDependant];
      const startIdx =
        after === "questions"
          ? 0
          : order.indexOf(after) + 1;

      for (let i = startIdx; i < order.length; i++) {
        if (flags[i]) return order[i];
      }
      return "done";
    },
    [includeSpouse, includeParents, includeDependant]
  );

  const getPrevFamilyStep = useCallback(
    (before: FamilyFormStep): FamilyFormStep => {
      const order: FamilyFormStep[] = ["spouse", "parents", "dependants"];
      const flags = [includeSpouse, includeParents, includeDependant];
      const endIdx = order.indexOf(before) - 1;

      for (let i = endIdx; i >= 0; i--) {
        if (flags[i]) return order[i];
      }
      return "questions";
    },
    [includeSpouse, includeParents, includeDependant]
  );

  // ─── Save personal details (Step 1) ────────────────────────────────────────
  const handleSavePersonal = async () => {
    if (!firstName || !lastName) {
      toast.error("Please enter your first and last name.");
      return;
    }
    if (!quoteId) {
      toast.error("No quote found. Please complete company onboarding first.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/planholder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          firstName,
          lastName,
          email,
          country: pdCountry,
          state: pdState,
          postalCode: pdPostalCode,
          phone,
          phoneType,
          gender,
          dateOfBirth: dob,
          nationality,
          height,
          weight,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setStep(2);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save personal details";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Save family questions (Step 2) → determine which forms to show ───────
  const handleFamilyQuestions = () => {
    if (
      includeSpouse === null &&
      includeParents === null &&
      includeDependant === null
    ) {
      toast.error("Please answer at least one question.");
      return;
    }
    // Default unanswered to "no"
    if (includeSpouse === null) setIncludeSpouse(false);
    if (includeParents === null) setIncludeParents(false);
    if (includeDependant === null) setIncludeDependant(false);

    const sp = includeSpouse ?? false;
    const pr = includeParents ?? false;
    const dp = includeDependant ?? false;

    if (!sp && !pr && !dp) {
      // No family members — skip to done
      setStep(4);
      return;
    }

    // Move to step 3 (family forms)
    setStep(3);
    // Determine which sub-form to show first
    if (sp) {
      setFamilyFormStep("spouse");
    } else if (pr) {
      setFamilyFormStep("parents");
    } else {
      setFamilyFormStep("dependants");
    }
  };

  // ─── Save spouse ────────────────────────────────────────────────────────────
  const handleSaveSpouse = async () => {
    if (!spFirstName || !spLastName) {
      toast.error("Please enter your spouse's first and last name.");
      return;
    }
    setSaving(true);
    try {
      const spStateOptions = STATES_BY_COUNTRY[spCountry] || [];
      void spStateOptions; // used for reference only
      const res = await fetch("/api/spouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          firstName: spFirstName,
          lastName: spLastName,
          preferredName: spPreferredName,
          country: spCountry,
          state: spState,
          occupation: spOccupation,
          occupationIndustry: spOccupationIndustry,
          gender: spGender,
          dateOfBirth: spDob,
          nationality: spNationality,
          height: spHeight,
          weight: spWeight,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      const next = getNextFamilyStep("spouse");
      if (next === "done") {
        setStep(4);
      } else {
        setFamilyFormStep(next);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save spouse details";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Save parents ──────────────────────────────────────────────────────────
  const handleSaveParents = async () => {
    if (!prFirstName || !prLastName) {
      toast.error("Please enter your parent's first and last name.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          firstName: prFirstName,
          lastName: prLastName,
          preferredName: prPreferredName,
          country: prCountry,
          state: prState,
          gender: prGender,
          dob: prDob,
          nationality: prNationality,
          height: prHeight,
          weight: prWeight,
          relationship: prRelationship,
          occupation: prOccupation,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      const next = getNextFamilyStep("parents");
      if (next === "done") {
        setStep(4);
      } else {
        setFamilyFormStep(next);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save parent details";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Save dependants ───────────────────────────────────────────────────────
  const handleSaveDependants = async () => {
    const hasEmpty = dependants.some((d) => !d.fullName || !d.lastName);
    if (hasEmpty) {
      toast.error("Please fill in all dependant names.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/dependants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, dependants }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setStep(4);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save dependant details";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Dependant helpers ──────────────────────────────────────────────────────
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

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (authLoading || quoteLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your details...</p>
        </div>
      </div>
    );
  }

  // ─── No quote found ─────────────────────────────────────────────────────────
  if (!quoteId && !quoteLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-sm border border-border p-10 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-xl text-foreground mb-2">
            No Plan Found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We could not find an active insurance plan. Please complete your
            company onboarding first.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/get-quote/onboarding")}
            className="rounded-full px-8"
          >
            Go to Onboarding
          </Button>
        </div>
      </div>
    );
  }

  // ─── Computed values ────────────────────────────────────────────────────────
  const pdStateOptions = STATES_BY_COUNTRY[pdCountry] || [];
  const spStateOptions = STATES_BY_COUNTRY[spCountry] || [];
  const prStateOptions = STATES_BY_COUNTRY[prCountry] || [];

  // =========================================================================
  // STEP 1: Personal Details
  // =========================================================================
  const renderStep1 = () => (
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

      {/* Action button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSavePersonal}
          disabled={saving}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 flex items-center gap-2"
        >
          {saving ? "Saving..." : "Next"}{" "}
          {!saving && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );

  // =========================================================================
  // STEP 2: Family Questions
  // =========================================================================
  const renderStep2 = () => (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-2">
        Who would you like to{" "}
        <span className="text-primary">include in your plan?</span>
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Select the family members you&apos;d like to add to your health insurance plan.
      </p>

      {/* Spouse card */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">
          Include your spouse?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <button
            onClick={() => setIncludeSpouse(true)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              includeSpouse === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Heart className="w-5 h-5 mb-2 text-foreground" />
            <p className="font-bold text-foreground text-sm">Yes</p>
            <p className="text-xs text-muted-foreground">
              Include my spouse
            </p>
          </button>
          <button
            onClick={() => setIncludeSpouse(false)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              includeSpouse === false
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <HeartOff className="w-5 h-5 mb-2 text-foreground" />
            <p className="font-bold text-foreground text-sm">No</p>
            <p className="text-xs text-muted-foreground">
              Don&apos;t include spouse
            </p>
          </button>
        </div>
      </div>

      {/* Parents card */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">
          Include your parents?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <button
            onClick={() => setIncludeParents(true)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              includeParents === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Users className="w-5 h-5 mb-2 text-foreground" />
            <p className="font-bold text-foreground text-sm">Yes</p>
            <p className="text-xs text-muted-foreground">
              Include my parents
            </p>
          </button>
          <button
            onClick={() => setIncludeParents(false)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              includeParents === false
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Users className="w-5 h-5 mb-2 text-muted-foreground" />
            <p className="font-bold text-foreground text-sm">No</p>
            <p className="text-xs text-muted-foreground">
              Don&apos;t include parents
            </p>
          </button>
        </div>
      </div>

      {/* Dependants card */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-foreground mb-3">
          Include your dependants?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <button
            onClick={() => setIncludeDependant(true)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              includeDependant === true
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <Baby className="w-5 h-5 mb-2 text-foreground" />
            <p className="font-bold text-foreground text-sm">Yes</p>
            <p className="text-xs text-muted-foreground">
              Include my dependants
            </p>
          </button>
          <button
            onClick={() => setIncludeDependant(false)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              includeDependant === false
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <BabyIcon className="w-5 h-5 mb-2 text-muted-foreground" />
            <p className="font-bold text-foreground text-sm">No</p>
            <p className="text-xs text-muted-foreground">
              Don&apos;t include dependants
            </p>
          </button>
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
          onClick={handleFamilyQuestions}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 flex items-center gap-2"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  // =========================================================================
  // STEP 3: Family Forms (sub-steps)
  // =========================================================================

  // ── Spouse Form ─────────────────────────────────────────────────────────────
  const renderSpouseForm = () => (
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
          onClick={() => setStep(2)}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSaveSpouse}
          disabled={saving}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );

  // ── Parents Form ────────────────────────────────────────────────────────────
  const renderParentsForm = () => (
    <div className="p-6 lg:p-10">
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
          <label className="text-xs text-muted-foreground mb-1 block">
            First name
          </label>
          <Input
            value={prFirstName}
            onChange={(e) => setPrFirstName(e.target.value)}
            placeholder="Robert"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Last name
          </label>
          <Input
            value={prLastName}
            onChange={(e) => setPrLastName(e.target.value)}
            placeholder="Doe"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            What does he/she like to be called
          </label>
          <Input
            value={prPreferredName}
            onChange={(e) => setPrPreferredName(e.target.value)}
            placeholder="Preferred name"
            className="border-border"
          />
        </div>
      </div>

      {/* Row 2: Location + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Country
          </label>
          <Select
            value={prCountry}
            onValueChange={(v) => {
              setPrCountry(v);
              setPrState("");
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
          {prStateOptions.length > 0 ? (
            <Select value={prState} onValueChange={setPrState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {prStateOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={prState}
              onChange={(e) => setPrState(e.target.value)}
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
              onClick={() => setPrGender("male")}
              className={`flex-1 text-xs font-medium transition-colors ${
                prGender === "male"
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-foreground hover:bg-muted/50"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setPrGender("female")}
              className={`flex-1 text-xs font-medium transition-colors ${
                prGender === "female"
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-foreground hover:bg-muted/50"
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Relationship, DOB, Occupation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Relationship
          </label>
          <Select value={prRelationship} onValueChange={setPrRelationship}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="father">Father</SelectItem>
              <SelectItem value="mother">Mother</SelectItem>
              <SelectItem value="father-in-law">Father-in-law</SelectItem>
              <SelectItem value="mother-in-law">Mother-in-law</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Date of birth
          </label>
          <Input
            value={prDob}
            onChange={(e) => setPrDob(e.target.value)}
            placeholder="01/15/1960"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Occupation
          </label>
          <Input
            value={prOccupation}
            onChange={(e) => setPrOccupation(e.target.value)}
            placeholder="Retired"
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
            value={prHeight}
            onChange={(e) => setPrHeight(e.target.value)}
            placeholder="175cm"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Weight
          </label>
          <Input
            value={prWeight}
            onChange={(e) => setPrWeight(e.target.value)}
            placeholder="80kg"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Nationality
          </label>
          <Select value={prNationality} onValueChange={setPrNationality}>
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
          onClick={() => {
            const prev = getPrevFamilyStep("parents");
            if (prev === "questions") {
              setStep(2);
            } else {
              setFamilyFormStep(prev);
            }
          }}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSaveParents}
          disabled={saving}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );

  // ── Dependants Form ─────────────────────────────────────────────────────────
  const renderDependantsForm = () => (
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
          onClick={() => {
            const prev = getPrevFamilyStep("dependants");
            if (prev === "questions") {
              setStep(2);
            } else {
              setFamilyFormStep(prev);
            }
          }}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSaveDependants}
          disabled={saving}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    switch (familyFormStep) {
      case "spouse":
        return renderSpouseForm();
      case "parents":
        return renderParentsForm();
      case "dependants":
        return renderDependantsForm();
      default:
        return renderSpouseForm();
    }
  };

  // =========================================================================
  // STEP 4: Complete
  // =========================================================================
  const renderStep4 = () => (
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
        Your Details Are Saved!
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
        Your personal health details have been saved successfully. You can now
        view and manage your plan from the dashboard.
      </p>

      <Button
        onClick={() => router.push("/dashboard/members")}
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-3"
      >
        Go to Dashboard
      </Button>
    </div>
  );

  // =========================================================================
  // Step router
  // =========================================================================
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
      default:
        return renderStep1();
    }
  };

  // =========================================================================
  // Layout
  // =========================================================================
  return (
    <div className="min-h-screen bg-muted/30 p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <OnboardingSidebar />
        </div>

        {/* Main content */}
        <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
          {step < 4 && <PersonalStepIndicator step={step} />}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${familyFormStep}`}
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
