"use client";

import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS } from "@/constants/onboarding-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check, Info, CreditCard, Building2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const BANK_DETAILS = [
  { label: "Bank Name", value: "Localsurance Holdings Ltd" },
  { label: "Account Number", value: "1234567890" },
  { label: "Routing Number", value: "021000021" },
  { label: "SWIFT/BIC", value: "LOCLUS33" },
  { label: "Bank Address", value: "100 Insurance Plaza, New York, NY 10001" },
];

const StepPayment = () => {
  const { data, setCurrentStep } = useQuote();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const quoteRef = data.quoteId?.slice(0, 8)?.toUpperCase() || "--------";

  const totalMembers = data.ageGroups
    ? data.ageGroups.reduce((sum, g) => sum + g.count, 0)
    : 0;

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSubmitPayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/quotes/${data.quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SUBMITTED" }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit payment");
      }
      setCurrentStep(STEPS.SUCCESS);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit payment";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-2">
        Complete Your <span className="text-primary">Payment</span>
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-lg leading-relaxed">
        Transfer the amount below to activate your plan. Once payment is
        confirmed, you&apos;ll receive a confirmation email.
      </p>

      <div className="max-w-3xl space-y-4 mb-6">
        {/* Payment Summary Card - compact 2-column grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-border">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {data.selectedPlan || "--"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border">
                <span className="text-sm text-muted-foreground">Annual Cost</span>
                <span className="text-sm font-bold text-foreground">
                  ${(data.totalCost || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="text-sm font-medium text-foreground">
                  {totalMembers}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm font-medium text-foreground">
                  {data.planStartDate
                    ? format(new Date(data.planStartDate), "MMM d, yyyy")
                    : "--"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details Card - 2-column grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Bank Details for Wire Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {BANK_DETAILS.map((field) => (
                <div
                  key={field.label}
                  className="flex items-center justify-between py-2 border-b border-border group"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {field.value}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(field.label, field.value)}
                    className="p-1 rounded hover:bg-muted transition-colors shrink-0 ml-2"
                    title={`Copy ${field.label}`}
                  >
                    {copiedField === field.label ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </button>
                </div>
              ))}
              {/* Reference field */}
              <div className="flex items-center justify-between py-2 group">
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="text-sm font-bold text-primary">
                    Quote #{quoteRef}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("Reference", `Quote #${quoteRef}`)}
                  className="p-1 rounded hover:bg-muted transition-colors shrink-0 ml-2"
                  title="Copy Reference"
                >
                  {copiedField === "Reference" ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info notice - compact */}
        <div className="flex gap-2 p-3 bg-muted/30 rounded-lg">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please use the reference number above when making your transfer.
            Processing typically takes 1-3 business days.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(STEPS.START_DATE)}
          className="rounded-full px-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSubmitPayment}
          disabled={isLoading}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          {isLoading ? "Submitting..." : "I've Made the Payment"}
        </Button>
      </div>
    </div>
  );
};

export default StepPayment;
