import { useState } from "react";
import { Search, Filter, ArrowDownUp, MoreHorizontal, Copy, ArrowDown, X, Info, Eye, RefreshCw, Mail, Ban } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import avatarImg from "@/assets/testimonial-avatar.jpg";

type MemberStatus = "ACTIVE" | "PENDING" | "CANCELED";

interface Member {
  id: string;
  name: string;
  avatar: string;
  planId: string;
  status: MemberStatus;
  email: string;
  country: string;
  countryFlag: string;
  dependents: number | null;
  annualCost: number | null;
}

const mockMembers: Member[] = [
  { id: "1", name: "Cameron Williamson", avatar: avatarImg, planId: "L8FHJG", status: "ACTIVE", email: "nathan.roberts@example.com", country: "France", countryFlag: "🇫🇷", dependents: 3, annualCost: 230 },
  { id: "2", name: "Luhutan Imir", avatar: avatarImg, planId: "L8FHJG", status: "PENDING", email: "debbie.baker@example.com", country: "US", countryFlag: "🇺🇸", dependents: null, annualCost: null },
  { id: "3", name: "Wade Warren", avatar: avatarImg, planId: "L8FHJG", status: "CANCELED", email: "deanna.curtis@example.com", country: "US", countryFlag: "🇺🇸", dependents: 2, annualCost: 230 },
  { id: "4", name: "Robert Fox", avatar: avatarImg, planId: "L8FHJG", status: "PENDING", email: "sara.cruz@example.com", country: "", countryFlag: "", dependents: null, annualCost: null },
  { id: "5", name: "Cameron Williamson", avatar: avatarImg, planId: "L8FHJG", status: "ACTIVE", email: "nathan.roberts@example.com", country: "France", countryFlag: "🇫🇷", dependents: 2, annualCost: 230 },
  { id: "6", name: "Luhutan Imir", avatar: avatarImg, planId: "L8FHJG", status: "PENDING", email: "debbie.baker@example.com", country: "US", countryFlag: "🇺🇸", dependents: null, annualCost: null },
  { id: "7", name: "Wade Warren", avatar: avatarImg, planId: "L8FHJG", status: "CANCELED", email: "deanna.curtis@example.com", country: "US", countryFlag: "🇺🇸", dependents: 2, annualCost: 230 },
];

const statusColors: Record<MemberStatus, string> = {
  ACTIVE: "bg-green-50 text-green-600 border-green-200",
  PENDING: "bg-orange-50 text-orange-500 border-orange-200",
  CANCELED: "bg-red-50 text-red-500 border-red-200",
};

export default function MembersOverview() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBanner, setShowBanner] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const totalPages = 10;

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedMembers((prev) =>
      prev.length === mockMembers.length ? [] : mockMembers.map((m) => m.id)
    );
  };

  return (
    <div className="p-8 max-w-[1200px]">
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
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Search className="w-4 h-4" /> Search...
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <button className="bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
          Add New Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 w-12">
                <Checkbox
                  checked={selectedMembers.length === mockMembers.length}
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
            {mockMembers.map((member) => (
              <tr key={member.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
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
                    <span className="text-sm font-semibold text-foreground">${member.annualCost}</span>
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
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-primary">
                        <Eye className="w-4 h-4" /> View Plan
                      </button>
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-primary">
                        <RefreshCw className="w-4 h-4" /> Request An Update
                      </button>
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-primary">
                        <Mail className="w-4 h-4" /> Send Remainder
                      </button>
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-primary">
                        <Ban className="w-4 h-4" /> Cancel Plan
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
          ← Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, null, 8, 9, 10].map((page, i) =>
            page === null ? (
              <span key={i} className="px-2 text-muted-foreground">...</span>
            ) : (
              <button
                key={i}
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
          )}
        </div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
