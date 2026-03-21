"use client";

import { useState, useEffect } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { STEPS } from "@/constants/onboarding-steps";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const StepEmailVerify = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-send OTP on mount (only if not already verified)
  useEffect(() => {
    if (data.emailVerified) {
      // Already verified — skip straight to next step
      setCurrentStep(STEPS.COMPANY);
      return;
    }
    const sendOtp = async () => {
      try {
        const res = await fetch("/api/auth/send-verification-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to send verification code");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to send verification code";
        toast.error(message);
      }
    };
    if (data.email) sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    if (otp.length < 4) {
      toast.error("Please enter the 4-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, code: otp }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Verification failed");
      }
      updateData({ emailVerified: true });
      setCurrentStep(STEPS.COMPANY);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("/api/auth/send-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to resend code");
      }
      toast.success("Code resent");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend code";
      toast.error(message);
    }
  };

  return (
    <div className="p-6 lg:p-10 flex flex-col items-center text-center">
      {/* Envelope icon */}
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mt-8">
        <Mail className="w-8 h-8 text-primary" />
      </div>

      {/* Title */}
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3">
        Please, <span className="text-primary">confirm your email</span>
      </h2>

      {/* Subtitle */}
      <p className="text-muted-foreground text-sm mb-8 max-w-md">
        We sent a code to <span className="font-semibold text-foreground">{data.email}</span>
      </p>

      {/* OTP Input */}
      <div className="mb-8">
        <InputOTP maxLength={4} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-14 h-14 text-lg" />
            <InputOTPSlot index={1} className="w-14 h-14 text-lg" />
            <InputOTPSlot index={2} className="w-14 h-14 text-lg" />
            <InputOTPSlot index={3} className="w-14 h-14 text-lg" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Continue button */}
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-16 py-3 w-full max-w-md mb-3"
      >
        {isLoading ? "Verifying..." : "Continue"}
      </Button>

      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => setCurrentStep(STEPS.ADMIN)}
        className="rounded-full px-16 py-3 w-full max-w-md flex items-center justify-center gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to the log in
      </Button>

      {/* Resend link */}
      <p className="text-sm text-muted-foreground">
        Didn&apos;t receive the email?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="font-semibold text-primary hover:underline"
        >
          Click to resend
        </button>
      </p>
    </div>
  );
};

export default StepEmailVerify;
