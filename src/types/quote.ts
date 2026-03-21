export interface AgeGroup {
  label: string;
  range: string;
  count: number;
  min: number;
  max: number;
}

export interface QuoteFormData {
  // Step 1 - Calculator
  ageGroups: AgeGroup[];
  selectedRegions: string[];
  selectedPlan: "basic" | "medium" | "pro" | null;

  // Step 2 - Plan Administrator
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  postalCode: string;
  role: string;
  phoneDialCode: string;
  phone: string;
  password: string;

  // Step 3 - Company Info
  companyType: string;
  companyLegalName: string;
  website: string;
  companyPhone: string;
  addressLine: string;
  city: string;
  zipCode: string;
  companyCountry: string;
  companyState: string;

  // Step 4 - Onboarding confirmation
  includesSelf: boolean | null;

  // Step 5 - Add Employees
  employees: Employee[];
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  personalizedMessage?: string;
}

export const initialQuoteData: QuoteFormData = {
  ageGroups: [
    { label: "0-17", range: "0-17", count: 0, min: 0, max: 50 },
    { label: "18-30", range: "18-30", count: 1, min: 0, max: 100 },
    { label: "31-45", range: "31-45", count: 1, min: 0, max: 100 },
    { label: "46-60", range: "46-60", count: 0, min: 0, max: 60 },
    { label: "61-75", range: "61-75", count: 0, min: 0, max: 40 },
    { label: "76+", range: "76+", count: 0, min: 0, max: 20 },
  ],
  selectedRegions: [],
  selectedPlan: null,
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  state: "",
  postalCode: "",
  role: "",
  phoneDialCode: "us",
  phone: "",
  password: "",
  companyType: "",
  companyLegalName: "",
  website: "",
  companyPhone: "",
  addressLine: "",
  city: "",
  zipCode: "",
  companyCountry: "",
  companyState: "",
  includesSelf: null,
  employees: [],
};
