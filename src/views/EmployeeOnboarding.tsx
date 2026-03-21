"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import OnboardingSidebar from "@/components/quote/OnboardingSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

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

interface EmployeeOnboardingProps {
  token: string;
}

export default function EmployeeOnboarding({ token }: EmployeeOnboardingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [onboardData, setOnboardData] = useState<OnboardData | null>(null);

  // Password form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate token on mount — handle all states
  const validateToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/onboard/${token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid onboarding link");
        return;
      }

      // Employee already fully onboarded — redirect to login
      if (data.status === "completed") {
        router.push("/login");
        return;
      }

      // Password already set — auto-login and redirect to personal details
      if (data.status === "password_set") {
        // Try logging in with existing session, or redirect to login
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          router.push("/profile/onboard");
        } else {
          router.push("/login");
        }
        return;
      }

      // New employee — show password form
      setOnboardData(data);
    } catch {
      setError("Failed to validate onboarding link");
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleSetPassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Set password
      const res = await fetch(`/api/onboard/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set password");

      // Step 2: Auto-login the employee
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: onboardData!.employee.email, password }),
      });

      if (loginRes.ok) {
        toast.success("Account created! Redirecting to fill your details...");
        // Redirect to the shared personal details form
        setTimeout(() => router.push("/profile/onboard"), 1500);
      } else {
        // If auto-login fails, still mark as success and redirect to login
        toast.success("Account created! Please log in to continue.");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Validating your link...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const isExpired = error.includes("expired");
    const isAlreadyDone = error.includes("already completed");
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="max-w-md text-center p-8 bg-background rounded-2xl border border-border shadow-sm">
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isAlreadyDone ? "text-green-500" : "text-destructive"}`} />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {isAlreadyDone ? "Already Set Up!" : isExpired ? "Link Expired" : "Link Invalid"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <div className="flex flex-col gap-2">
            {isAlreadyDone && (
              <Button onClick={() => router.push("/login")} className="bg-primary text-primary-foreground rounded-full">
                Go to Login
              </Button>
            )}
            {!isAlreadyDone && (
              <p className="text-xs text-muted-foreground">
                Contact your administrator to {isExpired ? "resend" : "send"} a new invitation link.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!onboardData) return null;

  const { employee, company, quote } = onboardData;

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden lg:block w-[320px] shrink-0">
        <OnboardingSidebar />
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-auto">
        <div className="w-full max-w-4xl">
          {/* Step indicator — compact horizontal */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">1</span>
            <span className="text-xs font-medium text-foreground">Create Account</span>
            <div className="h-px w-12 bg-border" />
            <span className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</span>
            <span className="text-xs font-medium text-muted-foreground">Personal Details</span>
          </div>

          {/* Two-column layout: left = welcome info, right = form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left — Welcome + info */}
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground mb-2">
                Welcome, <span className="text-primary">{employee.fullName}</span>!
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                <strong>{company.legalName}</strong> has enrolled you in their{" "}
                <span className="capitalize font-medium">{quote.selectedPlan || "health insurance"}</span>{" "}
                plan. Set up your account to get started.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground">Company</p>
                  <p className="text-sm font-semibold text-foreground">{company.legalName}</p>
                </div>
                <div className="bg-accent/5 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground">Plan</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{quote.selectedPlan || "Standard"}</p>
                </div>
              </div>
            </div>

            {/* Right — Password form */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-base text-foreground mb-1">Create your account</h2>
              <p className="text-xs text-muted-foreground mb-4">Set a password to access your dashboard.</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <Input value={employee.email} disabled className="border-border bg-muted/30 h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="border-border pr-10 h-9 text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Confirm password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="border-border h-9 text-sm"
                  />
                </div>
                <Button
                  onClick={handleSetPassword}
                  disabled={isSubmitting || !password || !confirmPassword}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-2.5 text-sm"
                >
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>) : "Create Account & Continue"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
