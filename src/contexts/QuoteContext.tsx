"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { QuoteFormData, initialQuoteData } from "@/types/quote";

const STORAGE_KEY = "localsurance-quote-data";
const STEP_KEY = "localsurance-quote-step";

interface QuoteContextType {
  data: QuoteFormData;
  updateData: (partial: Partial<QuoteFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetData: () => void;
  isHydrated: boolean;
}

const QuoteContext = createContext<QuoteContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<QuoteFormData>(initialQuoteData);
  const [currentStep, setCurrentStepRaw] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedData = loadFromStorage<QuoteFormData>(STORAGE_KEY, initialQuoteData);
    const storedStep = loadFromStorage<number>(STEP_KEY, 0);
    setData(storedData);
    setCurrentStepRaw(storedStep);
    setIsHydrated(true);
  }, []);

  // Persist data to localStorage on every change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, isHydrated]);

  // Persist step to localStorage
  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepRaw(step);
    try {
      localStorage.setItem(STEP_KEY, JSON.stringify(step));
    } catch {}
  }, []);

  const updateData = useCallback((partial: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialQuoteData);
    setCurrentStepRaw(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
    } catch {}
  }, []);

  return (
    <QuoteContext.Provider value={{ data, updateData, currentStep, setCurrentStep, resetData, isHydrated }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
};
