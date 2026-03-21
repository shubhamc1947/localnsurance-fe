"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ArrowDownUp, MoreHorizontal, Copy, ArrowDown, X, Info, Eye, Mail, UserPlus, Loader2, Send, Clock, UserCog, MessageCircleQuestion, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PLAN_DETAILS } from "@/data/planDetails";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

type MemberStatus = "ACTIVE" | "PENDING" | "CANCELED" | "DRAFT" | "SUBMITTED";

interface Member {
  id: string;
  name: string;
  planId: string;
  status: MemberStatus;
  email: string;
  country: string;
  countryFlag: string;
  dependents: number | null;
  annualCost: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEmployeeToMember(emp: any): Member {
  return {
    id: emp.id,
    name: emp.fullName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unknown",
    planId: emp.planId || "N/A",
    status: (emp.status || "PENDING").toUpperCase() as MemberStatus,
    email: emp.email || "",
    country: emp.country || "\u2014",
    countryFlag: emp.countryFlag || "",
    dependents: emp.dependantsCount ?? null,
    annualCost: emp.annualCost ?? null,
  };
}

const statusColors: Record<MemberStatus, string> = {
  ACTIVE: "bg-green-50 text-green-600 border-green-200",
  PENDING: "bg-orange-50 text-orange-500 border-orange-200",
  CANCELED: "bg-red-50 text-red-500 border-red-200",
  DRAFT: "bg-muted text-muted-foreground border-border",
  SUBMITTED: "bg-blue-50 text-blue-600 border-blue-200",
};

export default function MembersOverview() {
  const { user, latestQuote } = useAuth();
  const companyId = (user?.companies?.[0] as { id: string } | undefined)?.id;
  const quoteStatus = latestQuote?.status;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBanner, setShowBanner] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Add New Member dialog state
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberMessage, setNewMemberMessage] = useState("");

  const isEmployee = !companyId;

  const { data, isLoading } = useQuery({
    queryKey: ["employees", companyId, currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
      });
      if (companyId) params.set("companyId", companyId);
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/employees?${params}`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      return res.json();
    },
    enabled: !!user,
  });

  // Add single employee mutation
  const addMemberMutation = useMutation({
    mutationFn: async (data: { fullName: string; email: string; personalizedMessage?: string }) => {
      const res = await fetch("/api/employees/add-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add member");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setAddMemberOpen(false);
      setNewMemberName("");
      setNewMemberEmail("");
      setNewMemberMessage("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add member");
    },
  });

  // Resend invite mutation
  const resendInviteMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const res = await fetch("/api/employees/resend-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to resend invite");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Invite email resent successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend invite");
    },
  });

  const allMembers: Member[] = (data?.employees || []).map(mapEmployeeToMember);
  const totalPages = data?.totalPages || 1;

  // For employee view: find THEIR OWN record, not just first in list
  const myRecord = isEmployee
    ? allMembers.find((m) => m.email === user?.email) || allMembers[0]
    : null;
  const members = allMembers;

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedMembers((prev) =>
      prev.length === members.length ? [] : members.map((m) => m.id)
    );
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    addMemberMutation.mutate({
      fullName: newMemberName.trim(),
      email: newMemberEmail.trim(),
      personalizedMessage: newMemberMessage.trim() || undefined,
    });
  };

  // ─── Employee "My Plan" view ───
  if (isEmployee) {
    return (
      <div className="p-8 max-w-[1200px]">
        {/* Plan activation status banner */}
        {quoteStatus && quoteStatus !== "ACTIVE" && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
            <Clock className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-700">
                {quoteStatus === "SUBMITTED"
                  ? "Your plan is pending activation. Our team is verifying your payment."
                  : quoteStatus === "DRAFT"
                    ? "Your plan is not yet active. Please complete onboarding to activate."
                    : "Your plan status is currently: " + quoteStatus}
              </p>
            </div>
          </div>
        )}

        <h1 className="font-display text-3xl font-bold text-foreground leading-tight mb-6">
          My Insurance Plan
        </h1>

        <div className="space-y-6">
          {/* Personal info card */}
          {isLoading ? (
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-4 mb-6 animate-pulse">
                <div className="w-14 h-14 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-40" />
                  <div className="h-4 bg-muted rounded w-56" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3 animate-pulse">
                    <div className="h-3 bg-muted rounded w-16 mb-2" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <InitialsAvatar name={myRecord?.name || user?.firstName || "?"} size="lg" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{myRecord?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim()}</h2>
                  <p className="text-sm text-muted-foreground">{myRecord?.email || user?.email}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[myRecord?.status || "PENDING"]}`}>
                    {myRecord?.status || "PENDING"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Plan</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{myRecord?.planId || "\u2014"}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Country</p>
                  <p className="text-sm font-semibold text-foreground">{myRecord?.country || "\u2014"}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Dependants</p>
                  <p className="text-sm font-semibold text-foreground">{myRecord?.dependents ?? 0}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Annual Cost</p>
                  <p className="text-sm font-semibold text-foreground">{myRecord?.annualCost ? `$${myRecord.annualCost.toLocaleString()}` : "\u2014"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Plan Inclusions & Exclusions */}
          {(() => {
            const planKey = (latestQuote?.selectedPlan || myRecord?.planId || "").toLowerCase();
            const plan = PLAN_DETAILS[planKey];
            if (!plan) return null;
            return (
              <div className="bg-background rounded-xl border border-border p-6">
                <h3 className="text-base font-bold text-foreground mb-1">
                  Your <span className="text-primary capitalize">{plan.name}</span> Plan Coverage
                </h3>
                <p className="text-xs text-muted-foreground mb-4">Here's what's included and excluded in your plan.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Inclusions</h4>
                    <ul className="space-y-1.5">
                      {plan.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Exclusions</h4>
                    <ul className="space-y-1.5">
                      {plan.exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/profile/onboard")}
              className="bg-background rounded-xl border border-border p-5 text-left hover:border-primary/50 transition-colors"
            >
              <UserCog className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-semibold text-foreground">Update Personal Details</p>
              <p className="text-xs text-muted-foreground">Edit your health information, spouse & dependants</p>
            </button>
            <button
              onClick={() => router.push("/dashboard/support")}
              className="bg-background rounded-xl border border-border p-5 text-left hover:border-primary/50 transition-colors"
            >
              <MessageCircleQuestion className="w-5 h-5 text-accent mb-2" />
              <p className="text-sm font-semibold text-foreground">Get Support</p>
              <p className="text-xs text-muted-foreground">Raise a ticket or ask a question</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Admin "Members Overview" view ───
  return (
    <div className="p-8 max-w-[1200px]">
      {/* Plan activation status banner */}
      {quoteStatus && quoteStatus !== "ACTIVE" && (
        <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
          <Clock className="w-5 h-5 text-orange-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-700">
              {quoteStatus === "SUBMITTED"
                ? "Your plan is pending activation. Our team is verifying your payment."
                : quoteStatus === "DRAFT"
                  ? "Your plan is not yet active. Please complete onboarding and submit payment to activate."
                  : "Your plan status is currently: " + quoteStatus}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
          Overview of Company<br />Insurance Plan Members
        </h1>

        {showBanner && (
          <div className="flex items-start gap-3 bg-primary/10 rounded-xl px-5 py-4 max-w-md relative">
            <Info className="w-8 h-8 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                We are waiting for some of your employees to complete their onboarding. Once reviewed, the invoice will be available.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                We may ask for a reserve payment before you can onboard a new employee
              </p>
            </div>
            <button onClick={() => setShowBanner(false)} className="absolute top-3 right-3">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-sm text-primary font-medium">
            <ArrowDownUp className="w-4 h-4" /> Sort
          </button>
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                onBlur={() => { if (!searchTerm) setSearchOpen(false); }}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring w-48"
              />
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <Search className="w-4 h-4" /> Search...
            </button>
          )}
        </div>
        <button
          onClick={() => setAddMemberOpen(true)}
          className="bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add New Member
        </button>
      </div>

      {/* Add New Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Send an onboarding invite to a new team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Personalized Message <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                value={newMemberMessage}
                onChange={(e) => setNewMemberMessage(e.target.value)}
                placeholder="Welcome to the team! Please complete your onboarding..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <button
              onClick={handleAddMember}
              disabled={addMemberMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addMemberMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Invite</>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 w-12">
                <Checkbox
                  checked={selectedMembers.length === members.length && members.length > 0}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">Name <ArrowDown className="w-3 h-3" /></span>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Employee Plan ID</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Country</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Dependents</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Annual Cost</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-9 h-9 bg-muted rounded-full" />
                        <div className="space-y-1.5">
                          <div className="h-4 bg-muted rounded w-28" />
                          <div className="h-3 bg-muted rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-8 mx-auto animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-6 animate-pulse" />
                    </td>
                  </tr>
                ))}
              </>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-sm text-muted-foreground">
                  No members found.
                </td>
              </tr>
            ) : members.map((member) => (
              <tr key={member.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={member.name} size="sm" />
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    {member.planId}
                    <Copy className="w-3.5 h-3.5 cursor-pointer hover:text-foreground" />
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusColors[member.status]}`}>
                    {member.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{member.email}</td>
                <td className="p-4">
                  {member.country ? (
                    <span className="flex items-center gap-1.5 text-sm text-foreground">
                      <span>{member.countryFlag}</span> {member.country}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground/50">empty</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {member.dependents !== null ? (
                    <span className="text-sm font-medium text-foreground">{member.dependents}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground/50">empty</span>
                  )}
                </td>
                <td className="p-4">
                  {member.annualCost !== null ? (
                    <span className="text-sm font-semibold text-foreground">${member.annualCost.toLocaleString()}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground/50">empty</span>
                  )}
                </td>
                <td className="p-4">
                  <Popover open={actionMenuOpen === member.id} onOpenChange={(open) => setActionMenuOpen(open ? member.id : null)}>
                    <PopoverTrigger asChild>
                      <button className="p-1 rounded hover:bg-secondary transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48 p-2">
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-foreground">
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                      {member.status === "PENDING" && (
                        <button
                          onClick={() => {
                            resendInviteMutation.mutate(member.id);
                            setActionMenuOpen(null);
                          }}
                          disabled={resendInviteMutation.isPending}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-foreground disabled:opacity-50"
                        >
                          <Mail className="w-4 h-4" /> Resend Invite
                        </button>
                      )}
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-destructive">
                        <Trash2 className="w-4 h-4" /> Remove Employee
                      </button>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          &larr; Previous
        </button>
        <div className="flex items-center gap-1">
          {(() => {
            const pages: (number | null)[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1, 2, 3);
              if (currentPage > 4) pages.push(null);
              for (let i = Math.max(4, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                if (!pages.includes(i)) pages.push(i);
              }
              if (currentPage < totalPages - 3) pages.push(null);
              if (!pages.includes(totalPages - 1)) pages.push(totalPages - 1);
              if (!pages.includes(totalPages)) pages.push(totalPages);
            }
            return pages.map((page, i) =>
              page === null ? (
                <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {page}
                </button>
              )
            );
          })()}
        </div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
