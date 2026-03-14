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
    { label: "18-39", range: "18-39", count: 1, min: 1, max: 60 },
    { label: "40-49", range: "40-49", count: 1, min: 1, max: 100 },
    { label: "50-59", range: "50-59", count: 1, min: 1, max: 60 },
    { label: "60-69", range: "60-69", count: 1, min: 1, max: 60 },
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
