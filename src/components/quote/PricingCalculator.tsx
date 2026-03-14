import { useQuote } from "@/contexts/QuoteContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import AnimatedSection from "@/components/AnimatedSection";
import { Users, Shield, CheckCircle, Info } from "lucide-react";
import { useMemo } from "react";

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
    description: "Get our starter plan for getting small scale services",
    features: ["Coverage up to $X", "Option X", "Option X", "Option X"],
    highlighted: false,
  },
  {
    id: "medium" as const,
    name: "MEDIUM",
    color: "text-primary",
    description: "Get our starter plan for getting small scale services",
    features: ["All included in\nthe basic plan, plus:", "Option X", "Option X", "Option X"],
    highlighted: true,
  },
  {
    id: "pro" as const,
    name: "PRO",
    color: "text-foreground",
    description: "Get our starter plan for getting small scale services",
    features: ["All included in\nthe medium plan, plus:", "Option X", "Option X", "Option X"],
    highlighted: false,
  },
];

const PricingCalculator = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const navigate = useNavigate();

  const totalMembers = useMemo(
    () => data.ageGroups.reduce((sum, g) => sum + g.count, 0),
    [data.ageGroups]
  );
  const costPerMember = 117;
  const totalCost = totalMembers * costPerMember;

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
    setCurrentStep(1);
    navigate("/get-quote/onboarding");
  };

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
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
                  <span className="text-3xl font-extrabold">${costPerMember}*</span>
                  <span className="text-sm opacity-80">/ annually</span>
                </div>
              </div>
              <div className="bg-primary rounded-xl px-6 py-4 text-primary-foreground min-w-[200px]">
                <p className="text-xs opacity-80">Estimated for all members*</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold">${totalCost}*</span>
                  <span className="text-sm opacity-80">/ annually</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handleGetCovered}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-3 text-base font-semibold shadow-lg"
                >
                  Get Covered
                </Button>
                <p className="text-[10px] text-muted-foreground text-center max-w-[140px]">
                  * Taxes and other factors could affect the final price
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Steps 1 & 2 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1 - Age Groups */}
            <AnimatedSection delay={0.1}>
              <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">1.</span>
                    <h3 className="font-display font-bold text-base text-foreground">
                      How many team members would you like to insure?
                    </h3>
                  </div>
                  <span className="text-muted-foreground text-sm">(By age)</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.ageGroups.map((group, i) => (
                    <div key={group.range} className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-foreground">{group.range}</span>
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-accent mb-2">How many people?</p>
                      <Slider
                        value={[group.count]}
                        min={group.min}
                        max={group.max}
                        step={1}
                        onValueChange={(v) => handleSliderChange(i, v)}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span className="border border-accent text-accent rounded px-2 py-0.5 text-xs">
                          {group.min} - {group.max}
                        </span>
                        {group.max > 60 && <span>{group.max}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Step 2 - Regions */}
            <AnimatedSection delay={0.2}>
              <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">2.</span>
                  <h3 className="font-display font-bold text-base text-foreground">
                    Please select the regions where your remote team members are located?
                  </h3>
                </div>

                <div className="relative w-full aspect-[2/1] bg-muted/20 rounded-xl overflow-hidden">
                  {/* Dotted world map placeholder */}
                  <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
                    {/* Simple dot pattern to represent world map */}
                    {Array.from({ length: 40 }).map((_, row) =>
                      Array.from({ length: 80 }).map((_, col) => {
                        const x = col * 10 + 5;
                        const y = row * 10 + 5;
                        // Simple landmass approximation
                        const isLand =
                          (x > 100 && x < 300 && y > 80 && y < 300) || // Americas
                          (x > 350 && x < 500 && y > 60 && y < 250) || // Europe/Africa
                          (x > 500 && x < 700 && y > 80 && y < 300) || // Asia
                          (x > 600 && x < 750 && y > 280 && y < 380); // Australia
                        return isLand ? (
                          <circle
                            key={`${row}-${col}`}
                            cx={x}
                            cy={y}
                            r={2}
                            fill="hsl(var(--muted-foreground))"
                            opacity={0.4}
                          />
                        ) : null;
                      })
                    )}
                  </svg>

                  {/* Region labels */}
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => toggleRegion(region.id)}
                      className={`absolute text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                        data.selectedRegions.includes(region.id)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-background text-foreground border border-border hover:border-primary"
                      }`}
                      style={{ left: region.x, top: region.y, transform: "translate(-50%, -50%)" }}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right column: Step 3 - Plans */}
          <AnimatedSection delay={0.3}>
            <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">3.</span>
                <h3 className="font-display font-bold text-base text-foreground">Choose a plan:</h3>
              </div>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => updateData({ selectedPlan: plan.id })}
                    className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                      data.selectedPlan === plan.id
                        ? plan.highlighted
                          ? "border-primary bg-primary/5"
                          : "border-accent bg-accent/5"
                        : "border-border hover:border-muted-foreground/30"
                    } ${plan.highlighted ? "border-dashed" : ""}`}
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <span className={`font-extrabold text-sm ${plan.color}`}>{plan.name}</span>
                      <span className="text-[10px] text-muted-foreground">{plan.description}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
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

                    {plan.highlighted && (
                      <Info className="w-4 h-4 text-primary absolute top-4 right-4" />
                    )}

                    <div
                      className={`w-full text-center py-2 rounded-full text-sm font-medium border transition-colors ${
                        data.selectedPlan === plan.id
                          ? "border-accent text-accent"
                          : "border-border text-accent"
                      }`}
                    >
                      Choose Plan
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
