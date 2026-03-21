"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import OnboardingSidebar from "@/components/quote/OnboardingSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Shield } from "lucide-react";

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

  // Validate token on mount
  const validateToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/onboard/${token}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid onboarding link");
        return;
      }
      setOnboardData(data);
    } catch {
      setError("Failed to validate onboarding link");
    } finally {
      setLoading(false);
    }
  }, [token]);

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="max-w-md text-center p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Onboarding Link Invalid</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please contact your administrator for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (!onboardData) return null;

  const { employee, company, quote } = onboardData;
  const nameParts = employee.fullName.split(" ");
  const initials = nameParts.map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <OnboardingSidebar />
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-background rounded-2xl border border-border p-8 shadow-sm">
            {/* Welcome header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">{initials}</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-foreground mb-2">
                Welcome, <span className="text-primary">{employee.fullName}</span>!
              </h1>
              <p className="text-sm text-muted-foreground">
                <strong>{company.legalName}</strong> has enrolled you in their{" "}
                {quote.selectedPlan ? (
                  <span className="capitalize font-medium">{quote.selectedPlan}</span>
                ) : (
                  "health insurance"
                )}{" "}
                plan through Localsurance.
              </p>
            </div>

            {/* Plan info cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="text-sm font-semibold text-foreground">{company.legalName}</p>
              </div>
              <div className="bg-accent/5 rounded-xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Plan</p>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {quote.selectedPlan || "Health Insurance"}
                </p>
              </div>
            </div>

            {/* Set password form */}
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground text-lg">Create your account</h2>
              <p className="text-xs text-muted-foreground">
                Set a password to access your dashboard. After this, you'll fill in your personal health details.
              </p>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input value={employee.email} disabled className="border-border bg-muted/30" />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
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
                  placeholder="Re-enter your password"
                  className="border-border"
                />
              </div>

              <Button
                onClick={handleSetPassword}
                disabled={isSubmitting || !password || !confirmPassword}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account & Continue"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
