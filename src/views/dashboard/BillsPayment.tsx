"use client";

import { useState } from "react";
import { Search, Filter, ArrowDownUp, ChevronDown, Info, Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

type InvoiceStatus = "PAID" | "UNPAID" | "DRAFT";

interface Invoice {
  id: string;
  quoteId: string;
  number: string;
  date: string;
  status: InvoiceStatus;
  coveragePlan: string;
  employeesInsured: number;
  total: number;
}

interface EmployeePlan {
  name: string;
  plan: string;
  price: string | null;
  status?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToEmployeePlan(emp: any): EmployeePlan {
  return {
    name: emp.fullName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unknown",
    plan: emp.planName || emp.plan || "BASIC",
    price: emp.annualCost != null ? `$${Number(emp.annualCost).toLocaleString()}` : null,
    status: emp.status === "PENDING" ? "PENDING" : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToInvoice(inv: any): Invoice {
  return {
    id: inv.id,
    quoteId: inv.quoteId || "",
    number: inv.invoiceNumber || inv.number || `#${inv.id?.slice(0, 4) || "0000"}`,
    date: new Date(inv.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: (inv.status || "DRAFT").toUpperCase() as InvoiceStatus,
    coveragePlan: inv.coveragePlan || "BASIC PLAN",
    employeesInsured: inv.employeeCount || 0,
    total: inv.amount || 0,
  };
}

const statusColors: Record<InvoiceStatus, string> = {
  PAID: "bg-green-50 text-green-600 border-green-200",
  UNPAID: "bg-orange-50 text-orange-500 border-orange-200",
  DRAFT: "bg-muted text-muted-foreground border-border",
};

type TabFilter = "all" | "unpaid" | "draft";

export default function BillsPayment() {
  const { user, latestQuote } = useAuth();
  const company = user?.companies?.[0] as { id: string; legalName?: string } | undefined;
  const companyId = company?.id;
  const companyName = company?.legalName || "";
  const quoteStatus = latestQuote?.status || "DRAFT";

  const [activeTab, setActiveTab] = useState<TabFilter>("unpaid");
  const [plaidOpen, setPlaidOpen] = useState(false);

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", companyId],
    queryFn: async () => {
      const res = await fetch(`/api/invoices?companyId=${companyId}`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json();
    },
    enabled: !!companyId,
  });

  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ["employees-bills", companyId],
    queryFn: async () => {
      const res = await fetch(`/api/employees?companyId=${companyId}&limit=100`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      return res.json();
    },
    enabled: !!companyId,
  });

  const paymentMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });
      if (!res.ok) throw new Error("Payment failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Payment initiated successfully!");
      setPlaidOpen(false);
    },
    onError: () => {
      toast.error("Payment failed. Please try again.");
    },
  });

  const invoices: Invoice[] = (invoicesData?.invoices || invoicesData || []).map(mapToInvoice);
  const employees: EmployeePlan[] = (employeesData?.employees || []).map(mapToEmployeePlan);

  const filteredInvoices = activeTab === "all"
    ? invoices
    : invoices.filter((inv) => (inv.status || "").toLowerCase() === activeTab);

  const allCount = invoices.length;
  const unpaidCount = invoices.filter((inv) => inv.status === "UNPAID").length;
  const draftCount = invoices.filter((inv) => inv.status === "DRAFT").length;

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All invoices", count: allCount },
    { key: "unpaid", label: "Unpaid", count: unpaidCount },
    { key: "draft", label: "Draft", count: draftCount },
  ];

  return (
    <div className="p-8 max-w-[1200px]">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Invoices:</h1>

      {/* Contract Info */}
      <div className="bg-background border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-lg">📄</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {companyName || "Your Company"} & Localsurance
              </p>
              <p className="text-xs text-muted-foreground">Health Insurance Contract</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quoteStatus === "ACTIVE" && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            )}
            {quoteStatus === "SUBMITTED" && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-500 border border-orange-200">
                <Clock className="w-3.5 h-3.5" /> Pending Verification
              </span>
            )}
            {quoteStatus === "DRAFT" && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                <AlertCircle className="w-3.5 h-3.5" /> Draft
              </span>
            )}
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-start gap-8 border-t border-border pt-4 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground">Employees</p>
            <p className="text-sm font-medium text-foreground">{employees.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-sm font-medium text-green-600">{employees.filter(e => !e.status).length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-sm font-medium text-accent">{employees.filter(e => e.status === "PENDING").length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Invoices</p>
            <p className="text-sm font-medium text-foreground">{invoices.length}</p>
          </div>
          <div className="ml-auto bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 max-w-xs">
            <p className="text-xs text-primary">
              The invoice and final price will be ready as soon as all members have filled in the necessary information
            </p>
          </div>
        </div>
      </div>

      {/* Employee Plans + Summary */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Employees */}
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Employees</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Plan</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {employeesLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-sm text-muted-foreground">No employees found.</td>
                </tr>
              ) : employees.map((emp, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={emp.name} size="sm" />
                      <span className="text-sm font-medium text-foreground">{emp.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {emp.status ? (
                      <span className="bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium">{emp.status}</span>
                    ) : (
                      <span className="text-sm font-bold text-foreground">{emp.plan}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {emp.price ? (
                      <span className="text-sm font-semibold text-foreground">{emp.price}</span>
                    ) : (
                      <span className="bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium">PENDING</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-background border border-border rounded-xl p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Invoice Summary</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Payment Schedule:</p>
              <p className="text-sm font-semibold text-foreground">{latestQuote?.selectedPlan ? "Annual Schedule" : "\u2014"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Due Date:</p>
              <p className="text-sm font-semibold text-foreground">{latestQuote?.planStartDate ? new Date(latestQuote.planStartDate).toLocaleDateString("en-US", { month: "long" }) : "\u2014"}</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Next Bill:</p>
              <p className="text-2xl font-bold text-foreground">
                {unpaidCount > 0
                  ? `$${invoices.filter(i => i.status === "UNPAID").reduce((sum, i) => sum + i.total, 0).toLocaleString()}`
                  : "$0"}
              </p>
            </div>
            {quoteStatus === "ACTIVE" ? (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-200 px-6 py-2.5 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Paid
              </span>
            ) : quoteStatus === "SUBMITTED" ? (
              <span className="flex items-center gap-1.5 bg-orange-50 text-orange-500 border border-orange-200 px-6 py-2.5 rounded-full text-sm font-medium cursor-not-allowed">
                <Clock className="w-4 h-4" /> Payment Pending Verification
              </span>
            ) : quoteStatus === "DRAFT" ? (
              <span className="flex items-center gap-1.5 bg-muted text-muted-foreground border border-border px-6 py-2.5 rounded-full text-sm font-medium cursor-not-allowed">
                <AlertCircle className="w-4 h-4" /> Complete Onboarding First
              </span>
            ) : (
              <button
                onClick={() => setPlaidOpen(true)}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Make a Payment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Search & Tabs */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Enter invoice number"
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded ${activeTab === tab.key ? "bg-primary-foreground/20" : "bg-muted"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground ml-auto">
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowDownUp className="w-4 h-4" /> Newest First <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Number</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Coverage Plan:</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Employees Insuranced:</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Total:</th>
            </tr>
          </thead>
          <tbody>
            {invoicesLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading invoices...</p>
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">No invoices found.</td>
              </tr>
            ) : filteredInvoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-sm font-semibold text-foreground">{inv.number}</td>
                <td className="p-4 text-sm text-muted-foreground">{inv.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-foreground">{inv.coveragePlan}</td>
                <td className="p-4 text-sm text-foreground">{inv.employeesInsured}</td>
                <td className="p-4 text-sm font-semibold text-foreground">${inv.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plaid Modal */}
      <Dialog open={plaidOpen} onOpenChange={setPlaidOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background text-lg">⊞</span>
              </div>
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground">S</div>
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-primary">🏛</div>
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Localsurance <span className="text-primary">uses Plaid to retrieve your data</span> to offer these services
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">Data you will share</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground">Account Holder Information</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground">Transaction History</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            By clicking "Continue" you agree Plaid can use this info to provide its service. See our Privacy Policy
          </p>
          <button
            onClick={() => {
              const unpaidInvoice = invoices.find((inv) => inv.status === "UNPAID");
              if (unpaidInvoice && unpaidInvoice.quoteId) {
                paymentMutation.mutate(unpaidInvoice.quoteId);
              } else {
                toast.error("No unpaid invoices found.");
                setPlaidOpen(false);
              }
            }}
            disabled={paymentMutation.isPending}
            className="w-full bg-accent text-accent-foreground py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {paymentMutation.isPending ? "Processing..." : "Continue"}
          </button>
          <button className="text-sm text-primary text-center mt-2 hover:underline">
            Learn more about Plaid
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
