export interface AgeGroup {
  label: string;
  range: string;
  count: number;
  min: number;
  max: number;
}

export interface DependantFormData {
  id: string;
  fullName: string;
  lastName: string;
  preferredName: string;
  gender: string;
  dob: string;
  country: string;
  nationality: string;
  height: string;
  weight: string;
  relationshipToPlanholder: string;
  occupation: string;
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

  // Pricing
  costPerMember: number;
  totalCost: number;

  // Step 4 - Onboarding confirmation
  includesSelf: boolean | null;

  // Step 5 - Add Employees
  employees: Employee[];

  // IDs returned from API after registration
  quoteId: string;
  companyId: string;

  // Email verification
  emailVerified: boolean;

  // Planholder personal info
  planholderGender: string;
  planholderDob: string;
  planholderNationality: string;
  planholderHeight: string;
  planholderWeight: string;
  planholderPhoneType: string;

  // Spouse info
  includeSpouse: boolean | null;
  spouseFirstName: string;
  spouseLastName: string;
  spousePreferredName: string;
  spouseCountry: string;
  spouseState: string;
  spousePostalCode: string;
  spouseOccupation: string;
  spouseOccupationIndustry: string;
  spouseGender: string;
  spouseDob: string;
  spouseNationality: string;
  spouseHeight: string;
  spouseWeight: string;

  // Parents info
  includeParents: boolean | null;
  parentFirstName: string;
  parentLastName: string;
  parentPreferredName: string;
  parentCountry: string;
  parentState: string;
  parentPostalCode: string;
  parentGender: string;
  parentDob: string;
  parentNationality: string;
  parentHeight: string;
  parentWeight: string;
  parentRelationship: string;
  parentOccupation: string;

  // Dependant info
  includeDependant: boolean | null;
  dependants: DependantFormData[];

  // Start date
  planStartDate: string;
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
  costPerMember: 0,
  totalCost: 0,
  includesSelf: null,
  employees: [],
  quoteId: "",
  companyId: "",
  emailVerified: false,
  planholderGender: "",
  planholderDob: "",
  planholderNationality: "",
  planholderHeight: "",
  planholderWeight: "",
  planholderPhoneType: "mobile",
  includeSpouse: null,
  spouseFirstName: "",
  spouseLastName: "",
  spousePreferredName: "",
  spouseCountry: "",
  spouseState: "",
  spousePostalCode: "",
  spouseOccupation: "",
  spouseOccupationIndustry: "",
  spouseGender: "",
  spouseDob: "",
  spouseNationality: "",
  spouseHeight: "",
  spouseWeight: "",
  includeParents: null,
  parentFirstName: "",
  parentLastName: "",
  parentPreferredName: "",
  parentCountry: "",
  parentState: "",
  parentPostalCode: "",
  parentGender: "",
  parentDob: "",
  parentNationality: "",
  parentHeight: "",
  parentWeight: "",
  parentRelationship: "",
  parentOccupation: "",
  includeDependant: null,
  dependants: [],
  planStartDate: "",
};
