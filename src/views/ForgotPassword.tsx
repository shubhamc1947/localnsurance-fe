"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthSidebar from "@/components/auth/AuthSidebar";
import { toast } from "sonner";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset instructions");
      }
      sessionStorage.setItem("resetEmail", email);
      router.push("/verify-otp");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset instructions";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AuthSidebar />

      {/* Right Content */}
      <div className="flex-1 flex items-start justify-start p-8 pt-48 pl-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <h1 className="font-display text-4xl font-bold mb-2">
            <span className="text-primary ">Reset</span>{" "}
            <span className="text-foreground">your password</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Enter the email address you used to register with
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your email</label>
              <Input
                type="email"
                placeholder="amir@stealthstartup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-card border-0 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/login")}
                className="rounded-full px-8 h-12 text-sm font-medium border-border text-muted-foreground flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to the sign in
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-full px-8 h-12 text-sm font-medium bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
              >
                {isLoading ? "Sending..." : "Send instructions"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
