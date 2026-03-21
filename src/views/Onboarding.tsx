"use client";

import { useQuote } from "@/contexts/QuoteContext";
import OnboardingSidebar from "@/components/quote/OnboardingSidebar";
import StepIndicator from "@/components/quote/StepIndicator";
import Step1Admin from "@/components/quote/Step1Admin";
import StepEmailVerify from "@/components/quote/StepEmailVerify";
import Step2Company from "@/components/quote/Step2Company";
import StepIncludeSelf from "@/components/quote/StepIncludeSelf";
import Step4Employees from "@/components/quote/Step4Employees";
import StepStartDate from "@/components/quote/StepStartDate";
import StepPayment from "@/components/quote/StepPayment";
import { STEPS } from "@/constants/onboarding-steps";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Onboarding = () => {
  const { currentStep, setCurrentStep, data } = useQuote();
  const router = useRouter();
  const [showResume, setShowResume] = useState(false);
  const [savedStep, setSavedStep] = useState(0);

  // If user lands here without going through calculator, redirect
  // Also check for a saved step to offer resume
  useEffect(() => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep > STEPS.ADMIN) {
      // User has a saved step beyond the first step — offer to resume
      setSavedStep(currentStep);
      setShowResume(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect after the success loading animation
  useEffect(() => {
    if (currentStep !== STEPS.SUCCESS) return;
    const timer = setTimeout(() => {
      if (data.includesSelf === true) {
        router.push("/profile/onboard");
      } else {
        router.push("/dashboard/members");
      }
    }, 4000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleResume = () => {
    setShowResume(false);
    // currentStep is already set to the saved value
  };

  const handleStartOver = () => {
    setShowResume(false);
    setCurrentStep(STEPS.ADMIN);
  };

  const renderStep = () => {
    // Show resume prompt if applicable
    if (showResume && savedStep > STEPS.ADMIN) {
      return (
        <div className="p-6 lg:p-10 flex flex-col items-center text-center">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3 mt-8">
            Resume your <span className="text-primary">journey?</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md">
            It looks like you were in the middle of onboarding. Would you like to pick up where you left off?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartOver}
              className="rounded-full px-8 py-3 border border-border text-foreground hover:bg-muted/50 transition-colors text-sm font-medium"
            >
              Start over
            </button>
            <button
              onClick={handleResume}
              className="rounded-full px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
            >
              Resume
            </button>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case STEPS.ADMIN:
        return <Step1Admin />;
      case STEPS.EMAIL_VERIFY:
        return <StepEmailVerify />;
      case STEPS.COMPANY:
        return <Step2Company />;
      case STEPS.INCLUDE_SELF:
        return <StepIncludeSelf />;
      case STEPS.EMPLOYEES:
        return <Step4Employees />;
      case STEPS.START_DATE:
        return <StepStartDate />;
      case STEPS.PAYMENT:
        return <StepPayment />;
      case STEPS.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            {/* 3D Checkmark */}
            <div className="mb-8 relative">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #60A5FA 0%, #2563EB 45%, #1D4ED8 70%, #1E3A8A 100%)",
                  boxShadow: "0 20px 60px rgba(37,99,235,0.45), 0 8px 24px rgba(37,99,235,0.3), inset 0 2px 6px rgba(255,255,255,0.25)",
                }}
              >
                <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3">
              Payment Submitted!
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              We&apos;ll verify your payment and activate your plan. You&apos;ll receive a
              confirmation email once verified.
            </p>

            {/* Status line */}
            <p className="text-primary text-sm font-medium mb-6">
              Please wait, your administrator dashboard is being set up...
            </p>

            {/* Animated loading squares */}
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg bg-primary animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s`, opacity: 1 - i * 0.12 }}
                />
              ))}
            </div>
          </div>
        );
      default:
        return <Step1Admin />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <OnboardingSidebar />
        </div>

        {/* Main content */}
        <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
          <StepIndicator />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
