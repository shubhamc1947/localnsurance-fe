"use client";

import { useQuote } from "@/contexts/QuoteContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import AnimatedSection from "@/components/AnimatedSection";
import { Users, Shield, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo } from "react";
import WorldMap from "./WorldMap";
import { getMemberRate, type AgeBand } from "@/data/pricingData";

const regions = [
  { id: "north-central-america", label: "North/Central America", x: "18%", y: "35%" },
  { id: "south-america", label: "South America", x: "25%", y: "70%" },
  { id: "europe", label: "Europe", x: "48%", y: "30%" },
  { id: "middle-east-africa", label: "Middle East / Africa", x: "45%", y: "58%" },
  { id: "asia-pacific", label: "Asia Pacific", x: "72%", y: "48%" },
];

const plans = [
  {
    id: "basic" as const,
    name: "BASIC",
    color: "text-foreground",
    description: "Essential coverage for cost-conscious teams",
    features: [
      "Coverage up to $X",
      "Emergency assistance",
      "Telemedicine access",
      "Annual health check",
    ],
    inclusions: [
      "Inpatient hospitalization",
      "Emergency room visits",
      "Basic diagnostics & lab tests",
      "Ambulance services",
      "Telemedicine consultations",
      "Annual wellness checkup",
    ],
    exclusions: [
      "Dental & vision care",
      "Mental health therapy",
      "Maternity & newborn care",
      "Physiotherapy & rehabilitation",
      "Pre-existing conditions (first 12 months)",
      "Cosmetic procedures",
    ],
    highlighted: false,
  },
  {
    id: "medium" as const,
    name: "MEDIUM",
    color: "text-primary",
    description: "Comprehensive coverage for growing teams",
    features: [
      "All included in\nthe basic plan, plus:",
      "Dental & vision care",
      "Mental health support",
      "Maternity coverage",
    ],
    inclusions: [
      "Everything in Basic, plus:",
      "Dental care (preventive & basic)",
      "Vision care (exams & corrective lenses)",
      "Mental health & therapy sessions",
      "Maternity & newborn care",
      "Specialist consultations",
      "Physiotherapy (limited sessions)",
    ],
    exclusions: [
      "Worldwide coverage (limited to plan region)",
      "Executive health screening",
      "Cosmetic & elective procedures",
      "Experimental treatments",
      "Pre-existing conditions (first 6 months)",
    ],
    highlighted: true,
  },
  {
    id: "pro" as const,
    name: "PRO",
    color: "text-foreground",
    description: "Premium coverage with global benefits",
    features: [
      "All included in\nthe medium plan, plus:",
      "Worldwide coverage",
      "Executive health program",
      "Family dependents included",
    ],
    inclusions: [
      "Everything in Medium, plus:",
      "Worldwide coverage (any hospital)",
      "Executive health screening program",
      "Family dependents coverage",
      "Unlimited specialist visits",
      "Full physiotherapy & rehab",
      "Medical evacuation & repatriation",
      "Second medical opinion",
    ],
    exclusions: [
      "Cosmetic & elective procedures",
      "Experimental/investigational treatments",
      "Self-inflicted injuries",
      "War & terrorism-related injuries",
    ],
    highlighted: false,
  },
];

const PricingCalculator = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const router = useRouter();

  const { totalMembers, totalCost, costPerMember } = useMemo(() => {
    let members = 0;
    let cost = 0;

    for (const group of data.ageGroups) {
      members += group.count;
      if (group.count > 0) {
        const rate = getMemberRate(
          group.range as AgeBand,
          data.selectedRegions,
          data.selectedPlan
        );
        cost += group.count * rate;
      }
    }

    return {
      totalMembers: members,
      totalCost: cost,
      costPerMember: members > 0 ? Math.round(cost / members) : 0,
    };
  }, [data.ageGroups, data.selectedRegions, data.selectedPlan]);

  const handleSliderChange = (index: number, value: number[]) => {
    const newGroups = [...data.ageGroups];
    newGroups[index] = { ...newGroups[index], count: value[0] };
    updateData({ ageGroups: newGroups });
  };

  const toggleRegion = (regionId: string) => {
    const current = data.selectedRegions;
    const updated = current.includes(regionId)
      ? current.filter((r) => r !== regionId)
      : [...current, regionId];
    updateData({ selectedRegions: updated });
  };

  const handleGetCovered = () => {
    updateData({ costPerMember, totalCost });
    setCurrentStep(1);
    router.push("/get-quote/onboarding");
  };

  const needsSelection = data.selectedRegions.length === 0 || !data.selectedPlan;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section className="bg-muted/30 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground leading-tight">
                What's the Cost<br />
                <span className="text-accent">of Remote Health?</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-sm">
                Use our price calculator below to find out how much comprehensive coverage will cost your team
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-primary rounded-xl px-6 py-4 text-primary-foreground min-w-[200px]">
                <p className="text-xs opacity-80">Estimated cost per member*</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold">
                    {needsSelection ? "—" : `${formatCurrency(costPerMember)}*`}
                  </span>
                  <span className="text-sm opacity-80">/ annually</span>
                </div>
              </div>
              <div className="bg-primary rounded-xl px-6 py-4 text-primary-foreground min-w-[200px]">
                <p className="text-xs opacity-80">Estimated for all members*</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold">
                    {needsSelection ? "—" : `${formatCurrency(totalCost)}*`}
                  </span>
                  <span className="text-sm opacity-80">/ annually</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handleGetCovered}
                  disabled={needsSelection || totalMembers === 0}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-3 text-base font-semibold shadow-lg disabled:opacity-50"
                >
                  Get Covered
                </Button>
                <p className="text-[10px] text-muted-foreground text-center max-w-[140px]">
                  * Taxes and other factors could affect the final price
                </p>
              </div>
            </div>
          </div>

          {needsSelection && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 rounded-lg px-4 py-2 mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                Select at least one <strong>region</strong> and a <strong>plan</strong> to see pricing
              </span>
            </div>
          )}
        </AnimatedSection>

        {/* Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Steps 1 & 2 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1 - Age Groups */}
            <AnimatedSection delay={0.1}>
              <div className="bg-background rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">1.</span>
                    <h3 className="font-display font-bold text-base text-foreground">
                      How many team members would you like to insure?
                    </h3>
                  </div>
                  <span className="text-muted-foreground text-sm">(By age)</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Enter the number of employees in each age group across all regions</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {data.ageGroups.map((group, i) => {
                    const rate = getMemberRate(
                      group.range as AgeBand,
                      data.selectedRegions,
                      data.selectedPlan
                    );
                    return (
                      <div key={group.range} className="border border-border rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-foreground">{group.range}</span>
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-accent mb-2">
                          {group.count} {group.count === 1 ? "person" : "people"}
                        </p>
                        <Slider
                          value={[group.count]}
                          min={group.min}
                          max={group.max}
                          step={1}
                          onValueChange={(v) => handleSliderChange(i, v)}
                          className="mb-2"
                        />
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span className="border border-accent text-accent rounded px-2 py-0.5 text-xs">
                            {group.min} - {group.max}
                          </span>
                          {rate > 0 && group.count > 0 && (
                            <span className="text-xs font-medium text-foreground">
                              {formatCurrency(rate)}/yr
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>

            {/* Step 2 - Regions */}
            <AnimatedSection delay={0.2}>
              <div className="bg-background rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">2.</span>
                  <h3 className="font-display font-bold text-base text-foreground">
                    Please select the regions where your remote team members are located?
                  </h3>
                </div>

                <WorldMap
                  selectedRegions={data.selectedRegions}
                  onToggleRegion={toggleRegion}
                  regions={regions}
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Right column: Step 3 - Plans */}
          <AnimatedSection delay={0.3}>
            <div className="bg-background rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">3.</span>
                <h3 className="font-display font-bold text-base text-foreground">Choose a plan:</h3>
              </div>

              <div className="space-y-3">
                {plans.map((plan) => (
                  <Popover key={plan.id}>
                    <button
                      onClick={() => updateData({ selectedPlan: plan.id })}
                      className={`relative w-full text-left rounded-xl p-3 border-2 transition-all ${
                        data.selectedPlan === plan.id
                          ? plan.highlighted
                            ? "border-primary bg-primary/5"
                            : "border-accent bg-accent/5"
                          : "border-border hover:border-muted-foreground/30"
                      } ${plan.highlighted ? "border-dashed" : ""}`}
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-sm ${plan.color}`}>{plan.name}</span>
                          <PopoverTrigger asChild>
                            <button
                              className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="w-3 h-3 text-primary" />
                            </button>
                          </PopoverTrigger>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{plan.description}</span>
                      </div>

                      <PopoverContent className="w-80 p-4" side="left">
                        <h4 className="font-bold text-sm text-foreground mb-2">Inclusions</h4>
                        <ul className="space-y-1 mb-3">
                          {plan.inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <h4 className="font-bold text-sm text-foreground mb-2">Exclusions</h4>
                        <ul className="space-y-1">
                          {plan.exclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <X className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            {i === 0 ? (
                              <Shield className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <span className="text-xs text-foreground whitespace-pre-line">{f}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        className={`w-full text-center py-2 rounded-full text-sm font-medium border transition-colors ${
                          data.selectedPlan === plan.id
                            ? "border-accent text-accent"
                            : "border-border text-accent"
                        }`}
                      >
                        {data.selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                      </div>
                    </button>
                  </Popover>
                ))}
              </div>

              {data.selectedPlan && data.selectedRegions.length > 0 && totalMembers > 0 && (
                <div className="mt-3 rounded-lg border border-border/60 overflow-hidden">
                  <div className="bg-muted/40 px-3 py-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Regional Breakdown</span>
                  </div>
                  <div className="px-3 py-1">
                    {data.selectedRegions.map((regionId) => {
                      const region = regions.find(r => r.id === regionId);
                      let regionCost = 0;
                      for (const group of data.ageGroups) {
                        if (group.count > 0) {
                          const rate = getMemberRate(group.range as AgeBand, [regionId], data.selectedPlan);
                          regionCost += group.count * rate;
                        }
                      }
                      const perMember = totalMembers > 0 ? Math.round(regionCost / totalMembers) : 0;
                      return (
                        <div key={regionId} className="flex items-center justify-between py-1 text-[11px]">
                          <span className="text-muted-foreground">{region?.label}</span>
                          <span className="font-medium text-foreground">{formatCurrency(perMember)}<span className="text-muted-foreground font-normal">/yr</span></span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between px-3 py-1.5 bg-accent/5 border-t border-border/60">
                    <span className="text-[11px] font-bold text-foreground">Blended avg</span>
                    <span className="text-[11px] font-bold text-accent">{formatCurrency(costPerMember)}/yr</span>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
