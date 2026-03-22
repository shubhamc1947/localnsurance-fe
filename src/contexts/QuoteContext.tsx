"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { QuoteFormData, initialQuoteData } from "@/types/quote";

interface QuoteContextType {
  data: QuoteFormData;
  updateData: (partial: Partial<QuoteFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetData: () => void;
}

const QuoteContext = createContext<QuoteContextType | null>(null);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<QuoteFormData>(initialQuoteData);
  const [currentStep, setCurrentStepRaw] = useState(0);

  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepRaw(step);
  }, []);

  const updateData = useCallback((partial: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialQuoteData);
    setCurrentStepRaw(0);
  }, []);

  return (
    <QuoteContext.Provider value={{ data, updateData, currentStep, setCurrentStep, resetData }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
};
