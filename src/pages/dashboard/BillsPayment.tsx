import { useState } from "react";
import { Search, Filter, ArrowDownUp, ChevronDown, Info } from "lucide-react";
import avatarImg from "@/assets/testimonial-avatar.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type InvoiceStatus = "PAID" | "UNPAID" | "DRAFT";

interface Invoice {
  id: string;
  number: string;
  date: string;
  status: InvoiceStatus;
  coveragePlan: string;
  employeesInsured: number;
  total: number;
}

interface EmployeePlan {
  name: string;
  avatar: string;
  plan: string;
  price: string | null;
  status?: string;
}

const mockEmployees: EmployeePlan[] = [
  { name: "Cameron Williamson", avatar: avatarImg, plan: "PRO", price: null, status: "PENDING" },
  { name: "Luhutan Imir", avatar: avatarImg, plan: "BASIC", price: "$230" },
  { name: "Cameron Williamson", avatar: avatarImg, plan: "PRO", price: null, status: "PENDING" },
];

const mockInvoices: Invoice[] = [
  { id: "1", number: "#3674", date: "23.07.2023", status: "PAID", coveragePlan: "BASIC PLAN", employeesInsured: 12, total: 2830 },
  { id: "2", number: "#3674", date: "23.07.2023", status: "PAID", coveragePlan: "PRO PLAN", employeesInsured: 12, total: 2830 },
  { id: "3", number: "#3675", date: "15.08.2023", status: "UNPAID", coveragePlan: "BASIC PLAN", employeesInsured: 8, total: 1920 },
  { id: "4", number: "#3676", date: "01.09.2023", status: "DRAFT", coveragePlan: "PRO PLAN", employeesInsured: 5, total: 1250 },
];

const statusColors: Record<InvoiceStatus, string> = {
  PAID: "bg-green-50 text-green-600 border-green-200",
  UNPAID: "bg-orange-50 text-orange-500 border-orange-200",
  DRAFT: "bg-muted text-muted-foreground border-border",
};

type TabFilter = "all" | "unpaid" | "draft";

export default function BillsPayment() {
  const [activeTab, setActiveTab] = useState<TabFilter>("unpaid");
  const [plaidOpen, setPlaidOpen] = useState(false);

  const filteredInvoices = activeTab === "all"
    ? mockInvoices
    : mockInvoices.filter((inv) => inv.status.toLowerCase() === activeTab);

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All invoices", count: 54 },
    { key: "unpaid", label: "Unpaid", count: 14 },
    { key: "draft", label: "Draft", count: 2 },
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
                Stealth Startup & Localsurance <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded ml-2">#6475</span>
              </p>
              <p className="text-xs text-muted-foreground">St. 7 Attorney Woo, Jeju, South Korea</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex items-start gap-8 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Effective Date</p>
            <p className="text-sm font-medium text-foreground">March 23, 2024</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="text-sm font-medium text-foreground">March 16, 2028</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Renews In</p>
            <p className="text-sm font-medium text-foreground">20 Days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Performance</p>
            <p className="text-sm font-medium text-accent">In Progress 3/5</p>
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
              {mockEmployees.map((emp, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
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
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Summery Invoices</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Payment Schedule:</p>
              <p className="text-sm font-semibold text-foreground">Annual Schedule</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Due Date:</p>
              <p className="text-sm font-semibold text-foreground">March</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Next Bill:</p>
              <p className="text-2xl font-bold text-foreground">$840.20</p>
            </div>
            <button
              onClick={() => setPlaidOpen(true)}
              className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sell Bill
            </button>
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
            {filteredInvoices.map((inv) => (
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
            onClick={() => setPlaidOpen(false)}
            className="w-full bg-accent text-accent-foreground py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
          <button className="text-sm text-primary text-center mt-2 hover:underline">
            Learn more about Plaid
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
