import { useQuote } from "@/contexts/QuoteContext";
import OnboardingSidebar from "@/components/quote/OnboardingSidebar";
import StepIndicator from "@/components/quote/StepIndicator";
import Step1Admin from "@/components/quote/Step1Admin";
import Step2Company from "@/components/quote/Step2Company";
import Step3Success from "@/components/quote/Step3Success";
import Step4Employees from "@/components/quote/Step4Employees";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Onboarding = () => {
  const { currentStep, setCurrentStep } = useQuote();
  const navigate = useNavigate();

  // If user lands here without going through calculator, redirect
  useEffect(() => {
    if (currentStep === 0) {
      setCurrentStep(1);
    }
  }, [currentStep, setCurrentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Admin />;
      case 2:
        return <Step2Company />;
      case 3:
        return <Step3Success />;
      case 4:
        return <Step4Employees />;
      case 5:
        // Final complete state - could redirect or show summary
        return (
          <div className="p-10 text-center">
            <h2 className="font-display font-extrabold text-2xl text-foreground mb-4">
              🎉 <span className="text-primary">All Done!</span>
            </h2>
            <p className="text-muted-foreground mb-6">Your quote request has been submitted. We'll be in touch shortly.</p>
            <button
              onClick={() => navigate("/")}
              className="text-primary underline text-sm"
            >
              Back to Homepage
            </button>
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
