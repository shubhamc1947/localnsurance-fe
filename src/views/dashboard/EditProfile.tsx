"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronDown, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/data/data";
import Link from "next/link";

interface FamilyQuote {
  planholderInfo?: {
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: string;
    nationality?: string;
    occupation?: string;
    phone?: string;
  } | null;
  spouseInfo?: {
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: string;
    nationality?: string;
    occupation?: string;
  } | null;
  dependants?: {
    id: string;
    fullName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: string;
    relationshipToPlanholder?: string;
  }[];
}

interface EmployeeRecord {
  id: string;
  fullName: string;
  spouseFirstName?: string | null;
  spouseLastName?: string | null;
  spouseGender?: string | null;
  spouseDob?: string | null;
  spouseNationality?: string | null;
  spouseOccupation?: string | null;
  includeSpouse?: boolean | null;
  includeDependant?: boolean | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependantsData?: any;
}

function formatDate(d?: string | null): string {
  if (!d) return "\u2014";
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "\u2014";
  }
}

export default function EditProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 max-w-[1000px]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted rounded-full" />
            <div className="h-10 bg-muted rounded w-32" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  const getProfileFromUser = () => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    country: user?.country || "",
    state: user?.state || "",
    postalCode: user?.postalCode || "",
    phone: user?.phone || "",
    password: "",
  });

  const [profile, setProfile] = useState(getProfileFromUser);

  useEffect(() => {
    if (user) {
      setProfile(getProfileFromUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [showPassword, setShowPassword] = useState(false);
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});

  const toggleEdit = (field: string) => {
    setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Fetch family data from /api/auth/me (extended response)
  const { data: meData } = useQuery({
    queryKey: ["me-family"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const familyQuote: FamilyQuote | null = meData?.latestQuote || null;
  const employeeRecord: EmployeeRecord | null = meData?.employeeRecord || null;

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const companyId = (user?.companies as { id: string }[] | undefined)?.[0]?.id;
  const isEmployee = !companyId && !isAdmin;

  // Derive states from selected country
  const countryValue = profile.country?.toLowerCase() || "";
  const countryKey = COUNTRIES.find(
    (c) => c.label.toLowerCase() === countryValue || c.value === countryValue
  )?.value || "";
  const availableStates = STATES_BY_COUNTRY[countryKey] || [];

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profile) => {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setEditingFields({});
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(profile);
  };

  const handleDiscard = () => {
    setProfile(getProfileFromUser());
    setEditingFields({});
  };

  // Build spouse info for display
  let spouseData: { name: string; gender: string; dob: string; nationality: string; occupation: string } | null = null;
  if (isEmployee && employeeRecord?.includeSpouse && employeeRecord.spouseFirstName) {
    spouseData = {
      name: `${employeeRecord.spouseFirstName} ${employeeRecord.spouseLastName || ""}`.trim(),
      gender: employeeRecord.spouseGender || "\u2014",
      dob: formatDate(employeeRecord.spouseDob),
      nationality: employeeRecord.spouseNationality || "\u2014",
      occupation: employeeRecord.spouseOccupation || "\u2014",
    };
  } else if (familyQuote?.spouseInfo) {
    const s = familyQuote.spouseInfo;
    spouseData = {
      name: `${s.firstName} ${s.lastName}`.trim(),
      gender: s.gender || "\u2014",
      dob: formatDate(s.dateOfBirth),
      nationality: s.nationality || "\u2014",
      occupation: s.occupation || "\u2014",
    };
  }

  // Build dependants list for display
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dependantsList: { name: string; relationship: string; gender: string; dob: string }[] = [];
  if (isEmployee && employeeRecord?.includeDependant && employeeRecord.dependantsData) {
    const deps = Array.isArray(employeeRecord.dependantsData) ? employeeRecord.dependantsData : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependantsList = deps.map((d: any) => ({
      name: d.fullName || d.name || `${d.firstName || ""} ${d.lastName || ""}`.trim(),
      relationship: d.relationship || d.relationshipToPlanholder || "\u2014",
      gender: d.gender || "\u2014",
      dob: formatDate(d.dateOfBirth || d.dob),
    }));
  } else if (familyQuote?.dependants && familyQuote.dependants.length > 0) {
    dependantsList = familyQuote.dependants.map((d) => ({
      name: `${d.fullName} ${d.lastName}`.trim(),
      relationship: d.relationshipToPlanholder || "\u2014",
      gender: d.gender || "\u2014",
      dob: formatDate(d.dateOfBirth),
    }));
  }

  const hasFamilyData = !!spouseData || dependantsList.length > 0;

  return (
    <div className="p-8 max-w-[1000px]">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <InitialsAvatar name={`${profile.firstName} ${profile.lastName}`.trim() || "User"} size="xl" />
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1: First name, Last name, Email */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">First name</label>
              <button onClick={() => toggleEdit("firstName")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Input
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              disabled={!editingFields.firstName}
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Last name</label>
              <button onClick={() => toggleEdit("lastName")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Input
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              disabled={!editingFields.lastName}
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
            </div>
            <Input
              value={profile.email}
              disabled
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
        </div>

        {/* Row 2: Country, State, Postal */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Country of residence</label>
            </div>
            <Select value={profile.country} disabled>
              <SelectTrigger className="bg-secondary/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">State</label>
            </div>
            <Select value={profile.state} disabled>
              <SelectTrigger className="bg-secondary/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStates.length > 0 ? (
                  availableStates.map((s) => (
                    <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>
                  ))
                ) : (
                  <SelectItem value={profile.state || "N/A"}>{profile.state || "N/A"}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Postal code</label>
            </div>
            <Input
              value={profile.postalCode}
              disabled
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
        </div>

        {/* Row 3: Phone, Password */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Phone number</label>
              <button onClick={() => toggleEdit("phone")} className="text-xs text-primary font-medium">change</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg px-3 py-2 text-sm">
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!editingFields.phone}
                className="bg-secondary/50 border-0 disabled:opacity-80 flex-1"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={profile.password || "********"}
                disabled
                className="bg-secondary/50 border-0 disabled:opacity-80 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={handleDiscard}
              className="border border-border px-8 py-2.5 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="bg-accent text-accent-foreground px-8 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Family Members Section */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">Family Members</h2>
        </div>

        {!hasFamilyData ? (
          <div className="bg-secondary/30 rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">No family member data available yet.</p>
            <Link
              href="/profile/onboard"
              className="text-sm text-primary font-medium hover:underline"
            >
              Add family details
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Planholder card (for admin users with quote data) */}
            {!isEmployee && familyQuote?.planholderInfo && (
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Planholder</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium text-foreground">
                      {familyQuote.planholderInfo.firstName} {familyQuote.planholderInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-sm font-medium text-foreground">{familyQuote.planholderInfo.gender || "\u2014"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(familyQuote.planholderInfo.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="text-sm font-medium text-foreground">{familyQuote.planholderInfo.nationality || "\u2014"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{familyQuote.planholderInfo.phone || "\u2014"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Spouse card */}
            {spouseData && (
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Spouse</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium text-foreground">{spouseData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-sm font-medium text-foreground">{spouseData.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{spouseData.dob}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="text-sm font-medium text-foreground">{spouseData.nationality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Occupation</p>
                    <p className="text-sm font-medium text-foreground">{spouseData.occupation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Dependants cards */}
            {dependantsList.map((dep, idx) => (
              <div key={idx} className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Dependant {idx + 1}</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium text-foreground">{dep.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Relationship</p>
                    <p className="text-sm font-medium text-foreground">{dep.relationship}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-sm font-medium text-foreground">{dep.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{dep.dob}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Manage link */}
            <div className="pt-2">
              <Link
                href="/profile/onboard"
                className="text-sm text-primary font-medium hover:underline"
              >
                Manage family details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
