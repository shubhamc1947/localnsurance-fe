"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthSidebar from "@/components/auth/AuthSidebar";

const PasswordResetSuccess = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-muted">
      <AuthSidebar />

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8"
        >
          {/* Left side - ALL DONE */}
          <div className="flex flex-col items-center">
            <h1 className="font-display text-7xl md:text-8xl font-extrabold leading-none tracking-tight text-center">
              <span className="text-primary">ALL </span>
              <span className="bg-gradient-to-r from-primary via-destructive to-accent bg-clip-text text-transparent">
                DONE
              </span>
            </h1>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="mt-8 rounded-full px-12 h-12 text-sm font-medium border-border text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Right side - message + login */}
          <div className="flex flex-col items-center text-center">
            <p className="text-foreground font-display font-semibold text-lg mb-8">
              All set! Your password has<br />been successfully reset
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="rounded-full px-12 h-12 text-sm font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Log in
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
