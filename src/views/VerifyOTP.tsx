"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import AuthSidebar from "@/components/auth/AuthSidebar";
import { toast } from "sonner";

const VerifyOTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/forgot-password");
    }
  }, [router]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }
      sessionStorage.setItem("resetToken", data.resetToken);
      router.push("/reset-password");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }
      toast.success("OTP resent successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AuthSidebar />

      <div className="flex-1 flex items-start justify-start p-8 pt-32 pl-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Email icon */}
          <div className="mb-6 text-4xl">
            <img src="/images/envlop.png" alt="Email" className="w-16 h-16" />

          </div>

          <h1 className="font-display text-4xl font-bold mb-2">
            <span className="text-primary ">Reset</span>{" "}
            <span className="text-foreground">your password</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            We sent a code to <span className="font-semibold text-foreground">{email}</span>
          </p>

          <form onSubmit={handleContinue} className="space-y-8">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-20 h-20 text-3xl font-bold rounded-xl border-2 border-border bg-card first:rounded-l-xl last:rounded-r-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full h-12 text-sm font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full rounded-full h-12 text-sm font-medium border-border text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to the log in
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button type="button" onClick={handleResend} className="text-accent font-medium hover:underline">
                Click to resend
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;
