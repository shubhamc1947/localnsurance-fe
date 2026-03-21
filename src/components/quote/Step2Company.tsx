"use client";

import { useQuote } from "@/contexts/QuoteContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";
import { STEPS } from "@/constants/onboarding-steps";

const companyTypes = [
  "Software & Design Agency",
  "Small Consulting & Advisory Firm",
  "Freelance & Solopreneur",
  "Bootstrapped Tech Startup",
  "Pre-Seed & Seed Startup",
  "VC Film",
  "University",
  "Tech Enterprise",
  "eCommerce Business",
  "Other",
];

const Step2Company = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const { register } = useAuth();
  const [selectedType, setSelectedType] = useState(data.companyType);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    updateData({ companyType: selectedType });

    // If already registered, just advance to next step
    if (data.quoteId && data.companyId) {
      setCurrentStep(STEPS.INCLUDE_SELF);
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phoneDialCode: data.phoneDialCode,
        phone: data.phone,
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        companyType: selectedType,
        companyLegalName: data.companyLegalName,
        website: data.website,
        companyPhone: data.companyPhone,
        addressLine: data.addressLine,
        city: data.city,
        zipCode: data.zipCode,
        companyCountry: data.companyCountry,
        companyState: data.companyState,
        selectedPlan: data.selectedPlan,
        selectedRegions: data.selectedRegions,
        ageGroups: data.ageGroups,
        costPerMember: data.costPerMember,
        totalCost: data.totalCost,
      });

      // Store the returned IDs in QuoteContext
      updateData({
        quoteId: result.quote.id,
        companyId: result.company.id
      });

      setCurrentStep(STEPS.INCLUDE_SELF);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        Tell us about <span className="text-primary">your company</span>
      </h2>

      {/* Company type chips */}
      <div className="mb-6">
        <label className="text-xs text-muted-foreground mb-2 block">What kind of company are you?</label>
        <div className="flex flex-wrap gap-2">
          {companyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                selectedType === type
                  ? "border-accent text-accent bg-accent/5"
                  : "border-border text-foreground hover:border-primary"
              }`}
            >
              # {type}
            </button>
          ))}
        </div>
      </div>

      {/* Company Logo */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-muted/30 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Company Logo</p>
          <p className="text-xs text-muted-foreground">Update your company logo and then choose where you want to display</p>
        </div>
      </div>

      {/* Company info row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Company Legal Name</label>
          <Input
            value={data.companyLegalName}
            onChange={(e) => updateData({ companyLegalName: e.target.value })}
            placeholder="Stealth Startup Technology Inc."
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Website (optional)</label>
          <Input
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            placeholder="www.stealthstartuptoday.com"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Company phone number (optional)</label>
          <Input
            value={data.companyPhone}
            onChange={(e) => updateData({ companyPhone: e.target.value })}
            placeholder="123-456-7890"
            className="border-border"
          />
        </div>
      </div>

      {/* Company info row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Address line</label>
          <Input
            value={data.addressLine}
            onChange={(e) => updateData({ addressLine: e.target.value })}
            placeholder="2972 Westheimer Rd."
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">City</label>
          <Input
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder="Woodland"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Zip Code</label>
          <Input
            value={data.zipCode}
            onChange={(e) => updateData({ zipCode: e.target.value })}
            placeholder="90005"
            className="border-border"
          />
        </div>
      </div>

      {/* Company info row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Country of residence</label>
          <Select value={data.companyCountry} onValueChange={(v) => updateData({ companyCountry: v, companyState: "" })}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">State</label>
          <Select value={data.companyState} onValueChange={(v) => updateData({ companyState: v })}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>
              {(STATES_BY_COUNTRY[data.companyCountry] || []).map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
              {!STATES_BY_COUNTRY[data.companyCountry] && (
                <SelectItem value="other">Other</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(STEPS.EMAIL_VERIFY)}
            className="rounded-full px-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
          >
            {isLoading ? "Submitting..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Company;
