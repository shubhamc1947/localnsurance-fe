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
  Trash2,
} from "lucide-react";
import { CountryCombobox } from "@/components/quote/shared/CountryCombobox";
import { StateCombobox } from "@/components/quote/shared/StateCombobox";
import { DateInput } from "@/components/quote/shared/DateInput";

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

type FamilyFormStep = "questions" | "spouse" | "dependants";

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

const LS_STEP_KEY = "localsurance-personal-step";
const LS_DATA_KEY = "localsurance-personal-data";

export default function PersonalOnboarding() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  // Determine if user is employee or admin — only after auth is loaded
  // Admin = has companies, Employee = no companies
  const isEmployee = !authLoading && !!user && (!user.companies || (user.companies as unknown[]).length === 0);

  // Resume prompt
  const [showResume, setShowResume] = useState(false);

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

  // Dependants
  const [dependants, setDependants] = useState<DependantForm[]>([
    createEmptyDependant("1"),
  ]);

  // ─── localStorage resume support ──────────────────────────────────────────
  // Check for saved data on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem(LS_STEP_KEY);
      const savedData = localStorage.getItem(LS_DATA_KEY);
      if (savedStep && savedData && parseInt(savedStep, 10) > 1) {
        setShowResume(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const restoreSavedData = useCallback(() => {
    try {
      const savedStep = localStorage.getItem(LS_STEP_KEY);
      const savedData = localStorage.getItem(LS_DATA_KEY);
      if (!savedStep || !savedData) return;
      const d = JSON.parse(savedData);
      setStep(parseInt(savedStep, 10));
      // personal
      if (d.firstName) setFirstName(d.firstName);
      if (d.lastName) setLastName(d.lastName);
      if (d.email) setEmail(d.email);
      if (d.pdCountry) setPdCountry(d.pdCountry);
      if (d.pdState) setPdState(d.pdState);
      if (d.pdPostalCode) setPdPostalCode(d.pdPostalCode);
      if (d.phone) setPhone(d.phone);
      if (d.phoneType) setPhoneType(d.phoneType);
      if (d.gender) setGender(d.gender);
      if (d.dob) setDob(d.dob);
      if (d.nationality) setNationality(d.nationality);
      if (d.height) setHeight(d.height);
      if (d.weight) setWeight(d.weight);
      // family questions
      if (d.includeSpouse !== undefined) setIncludeSpouse(d.includeSpouse);
      if (d.includeDependant !== undefined) setIncludeDependant(d.includeDependant);
      if (d.familyFormStep) setFamilyFormStep(d.familyFormStep);
      // spouse
      if (d.spFirstName) setSpFirstName(d.spFirstName);
      if (d.spLastName) setSpLastName(d.spLastName);
      if (d.spPreferredName) setSpPreferredName(d.spPreferredName);
      if (d.spCountry) setSpCountry(d.spCountry);
      if (d.spState) setSpState(d.spState);
      if (d.spOccupation) setSpOccupation(d.spOccupation);
      if (d.spOccupationIndustry) setSpOccupationIndustry(d.spOccupationIndustry);
      if (d.spGender) setSpGender(d.spGender);
      if (d.spHeight) setSpHeight(d.spHeight);
      if (d.spWeight) setSpWeight(d.spWeight);
      if (d.spNationality) setSpNationality(d.spNationality);
      if (d.spDob) setSpDob(d.spDob);
      // dependants
      if (d.dependants && d.dependants.length > 0) setDependants(d.dependants);
    } catch {
      // corrupted data, ignore
    }
    setShowResume(false);
  }, []);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(LS_STEP_KEY);
      localStorage.removeItem(LS_DATA_KEY);
    } catch {
      // ignore
    }
    setShowResume(false);
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(LS_STEP_KEY, String(step));
      localStorage.setItem(
        LS_DATA_KEY,
        JSON.stringify({
          firstName, lastName, email, pdCountry, pdState, pdPostalCode,
          phone, phoneType, gender, dob, nationality, height, weight,
          includeSpouse, includeDependant, familyFormStep,
          spFirstName, spLastName, spPreferredName, spCountry, spState,
          spOccupation, spOccupationIndustry, spGender, spHeight, spWeight,
          spNationality, spDob, dependants,
        })
      );
    } catch {
      // localStorage unavailable
    }
  }, [
    step, firstName, lastName, email, pdCountry, pdState, pdPostalCode,
    phone, phoneType, gender, dob, nationality, height, weight,
    includeSpouse, includeDependant, familyFormStep,
    spFirstName, spLastName, spPreferredName, spCountry, spState,
    spOccupation, spOccupationIndustry, spGender, spHeight, spWeight,
    spNationality, spDob, dependants,
  ]);

  // ─── Pre-fill from auth ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // ─── Fetch user's quote (admin owns it, employee is linked via employee record)
  useEffect(() => {
    async function fetchQuote() {
      try {
        if (isEmployee && !quoteId) {
          // Employee flow: fetch their own employee record to pre-fill data
          const empMeRes = await fetch("/api/employees/me");
          const empMeJson = await empMeRes.json();
          if (empMeRes.ok && empMeJson.employee) {
            const emp = empMeJson.employee;
            setFirstName(emp.fullName?.split(" ")[0] || "");
            setLastName(emp.fullName?.split(" ").slice(1).join(" ") || "");
            if (emp.phone) setPhone(emp.phone);
            if (emp.phoneType) setPhoneType(emp.phoneType);
            if (emp.gender) setGender(emp.gender);
            if (emp.dateOfBirth) setDob(new Date(emp.dateOfBirth).toISOString().split("T")[0]);
            if (emp.nationality) setNationality(emp.nationality);
            if (emp.height) setHeight(emp.height);
            if (emp.weight) setWeight(emp.weight);
            if (emp.country) setPdCountry(emp.country);
            if (emp.state) setPdState(emp.state);
            if (emp.postalCode) setPdPostalCode(emp.postalCode);
            if (emp.includeSpouse != null) setIncludeSpouse(emp.includeSpouse);
            if (emp.spouseFirstName) setSpFirstName(emp.spouseFirstName);
            if (emp.spouseLastName) setSpLastName(emp.spouseLastName);
            if (emp.spousePreferredName) setSpPreferredName(emp.spousePreferredName);
            if (emp.spouseGender) setSpGender(emp.spouseGender);
            if (emp.spouseDob) setSpDob(new Date(emp.spouseDob).toISOString().split("T")[0]);
            if (emp.spouseCountry) setSpCountry(emp.spouseCountry);
            if (emp.spouseNationality) setSpNationality(emp.spouseNationality);
            if (emp.spouseHeight) setSpHeight(emp.spouseHeight);
            if (emp.spouseWeight) setSpWeight(emp.spouseWeight);
            if (emp.spouseOccupation) setSpOccupation(emp.spouseOccupation);
            if (emp.spouseOccIndustry) setSpOccupationIndustry(emp.spouseOccIndustry);
            if (emp.includeDependant != null) setIncludeDependant(emp.includeDependant);
            if (emp.dependantsData && Array.isArray(emp.dependantsData) && emp.dependantsData.length > 0) {
              setDependants(emp.dependantsData as DependantForm[]);
            }
            if (emp.quoteId) setQuoteId(emp.quoteId);
          }
          setQuoteLoading(false);
          return;
        }

        // Admin flow: user's own quotes
        const res = await fetch("/api/quotes");
        const json = await res.json();
        if (res.ok && json.quotes && json.quotes.length > 0) {
          setQuoteId(json.quotes[0].id);
          setQuoteLoading(false);
          return;
        }

        // Fallback: user is an employee — find their employee record's quote
        const empRes = await fetch("/api/employees");
        const empJson = await empRes.json();
        if (empRes.ok && empJson.employees && empJson.employees.length > 0) {
          const emp = empJson.employees[0];
          if (emp.quoteId) {
            setQuoteId(emp.quoteId);
            setQuoteLoading(false);
            return;
          }
        }
      } catch {
        // Fetch failed
      } finally {
        setQuoteLoading(false);
      }
    }
    if (!authLoading) {
      fetchQuote();
    }
  }, [authLoading, isEmployee]);

  // ─── Determine next family form step ────────────────────────────────────────
  const getNextFamilyStep = useCallback(
    (after: FamilyFormStep): FamilyFormStep | "done" => {
      const order: FamilyFormStep[] = ["spouse", "dependants"];
      const flags = [includeSpouse, includeDependant];
      const startIdx =
        after === "questions"
          ? 0
          : order.indexOf(after) + 1;

      for (let i = startIdx; i < order.length; i++) {
        if (flags[i]) return order[i];
      }
      return "done";
    },
    [includeSpouse, includeDependant]
  );

  const getPrevFamilyStep = useCallback(
    (before: FamilyFormStep): FamilyFormStep => {
      const order: FamilyFormStep[] = ["spouse", "dependants"];
      const flags = [includeSpouse, includeDependant];
      const endIdx = order.indexOf(before) - 1;

      for (let i = endIdx; i >= 0; i--) {
        if (flags[i]) return order[i];
      }
      return "questions";
    },
    [includeSpouse, includeDependant]
  );

  // ─── Save personal details (Step 1) ────────────────────────────────────────
  const handleSavePersonal = async () => {
    if (!firstName || !lastName) {
      toast.error("Please enter your first and last name.");
      return;
    }

    setSaving(true);
    try {
      // Use employee API only if truly an employee (no companies AND no quoteId from own quotes)
      const useEmployeeApi = isEmployee && !quoteId;
      if (useEmployeeApi) {
        const res = await fetch("/api/employees/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "personal",
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
        if (!res.ok) {
          const j = await res.json();
          throw new Error(j.error || "Failed to save");
        }
        setStep(2);
        setSaving(false);
        return;
      }

      if (!quoteId) {
        // No quote linked yet — skip API save, still advance to next step
        toast.info("Details saved locally. They'll sync once your plan is set up.");
        setStep(2);
        setSaving(false);
        return;
      }

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
  const handleFamilyQuestions = async () => {
    if (includeSpouse === null || includeDependant === null) {
      toast.error("Please answer both questions.");
      return;
    }

    const sp = includeSpouse;
    const dp = includeDependant;

    // For employees, persist the no-spouse / no-dependants flags
    if (isEmployee && !quoteId) {
      try {
        if (!sp) {
          await fetch("/api/employees/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "no-spouse" }),
          });
        }
        if (!dp) {
          await fetch("/api/employees/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "no-dependants" }),
          });
        }
      } catch {
        // non-critical, continue
      }
    }

    if (!sp && !dp) {
      // No family members — skip to done
      setStep(4);
      return;
    }

    // Move to step 3 (family forms)
    setStep(3);
    // Determine which sub-form to show first
    if (sp) {
      setFamilyFormStep("spouse");
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
      if (isEmployee && !quoteId) {
        const res = await fetch("/api/employees/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "spouse",
            firstName: spFirstName,
            lastName: spLastName,
            preferredName: spPreferredName,
            country: spCountry,
            gender: spGender,
            dateOfBirth: spDob,
            nationality: spNationality,
            height: spHeight,
            weight: spWeight,
            occupation: spOccupation,
            occupationIndustry: spOccupationIndustry,
          }),
        });
        if (!res.ok) {
          const j = await res.json();
          throw new Error(j.error || "Failed to save");
        }
        const next = getNextFamilyStep("spouse");
        if (next === "done") {
          setStep(4);
        } else {
          setFamilyFormStep(next);
        }
        setSaving(false);
        return;
      }

      if (!quoteId) {
        toast.info("Details saved locally.");
        const nextStep = getNextFamilyStep("spouse");
        if (nextStep === "done") setStep(4);
        else setFamilyFormStep(nextStep);
        setSaving(false);
        return;
      }

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

  // ─── Save dependants ───────────────────────────────────────────────────────
  const handleSaveDependants = async () => {
    const hasEmpty = dependants.some((d) => !d.fullName || !d.lastName);
    if (hasEmpty) {
      toast.error("Please fill in all dependant names.");
      return;
    }

    setSaving(true);
    try {
      if (isEmployee && !quoteId) {
        const res = await fetch("/api/employees/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "dependants",
            dependants,
          }),
        });
        if (!res.ok) {
          const j = await res.json();
          throw new Error(j.error || "Failed to save");
        }
        setStep(4);
        setSaving(false);
        return;
      }

      if (!quoteId) {
        toast.info("Details saved locally.");
        setStep(4);
        setSaving(false);
        return;
      }

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

  const removeDependant = (index: number) => {
    setDependants((prev) => prev.filter((_, i) => i !== index));
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
    // No quoteId found — still let the user fill details (save will be skipped)
    // This handles employees whose admin hasn't completed onboarding yet
  }

  // ─── Computed values ────────────────────────────────────────────────────────

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
          <CountryCombobox
            value={pdCountry}
            onChange={(v) => {
              setPdCountry(v);
              setPdState("");
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            State
          </label>
          <StateCombobox country={pdCountry} value={pdState} onChange={setPdState} />
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
          <DateInput value={dob} onChange={setDob} maxDate={new Date()} placeholder="Date of birth" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Nationality
          </label>
          <CountryCombobox value={nationality} onChange={setNationality} placeholder="Select nationality" />
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
          disabled={includeSpouse === null || includeDependant === null}
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
          <CountryCombobox
            value={spCountry}
            onChange={(v) => {
              setSpCountry(v);
              setSpState("");
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            State
          </label>
          <StateCombobox country={spCountry} value={spState} onChange={setSpState} />
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
          <DateInput value={spDob} onChange={setSpDob} maxDate={new Date()} placeholder="Date of birth" />
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
          <CountryCombobox value={spNationality} onChange={setSpNationality} placeholder="Select nationality" />
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
                <Select
                  value={dep.relationshipToPlanholder}
                  onValueChange={(v) =>
                    updateDependant(i, {
                      relationshipToPlanholder: v,
                    })
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
          {/* Resume prompt */}
          {showResume && (
            <div className="bg-primary/5 border-b border-primary/20 p-4 flex items-center justify-between gap-4">
              <p className="text-sm text-foreground">
                You have unsaved progress. <span className="font-semibold">Resume where you left off?</span>
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSavedData}
                  className="rounded-full text-xs"
                >
                  Start Fresh
                </Button>
                <Button
                  size="sm"
                  onClick={restoreSavedData}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs"
                >
                  Resume
                </Button>
              </div>
            </div>
          )}
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
