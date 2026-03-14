import { useState } from "react";
import { MoreHorizontal, BarChart3, ChevronDown, FileText, Mail, ListChecks, ClipboardCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import avatarImg from "@/assets/testimonial-avatar.jpg";

type NodeStatus = "ACTIVE" | "PENDING" | "CANCELED";

interface TreeNode {
  id: string;
  name: string;
  role: string;
  flag: string;
  avatar: string;
  status: NodeStatus;
  daysUntilEnd?: number;
  hasDocuments?: boolean;
  documentName?: string;
  documentDate?: string;
  steps?: { label: string; done: boolean }[];
  children?: TreeNode[];
  actionLabel?: string;
}

const treeData: TreeNode = {
  id: "root",
  name: "Cameron Williamson",
  role: "Vice President - Marketing",
  flag: "🇫🇷",
  avatar: avatarImg,
  status: "PENDING",
  actionLabel: "View Details",
  steps: [
    { label: "Signed Up", done: true },
    { label: "Email Confirmed", done: true },
    { label: "Onboarding Pending", done: false },
  ],
  children: [
    {
      id: "c1",
      name: "Floyd Miles",
      role: "Vice President",
      flag: "🇫🇷",
      avatar: avatarImg,
      status: "ACTIVE",
      daysUntilEnd: 156,
      actionLabel: "View Plan Details",
      hasDocuments: true,
      documentName: "Floyd Plan Documents",
      documentDate: "Created On January 01, 2022",
      children: [
        {
          id: "c1-1",
          name: "Cameron Williamson",
          role: "Vice President - Marketing",
          flag: "🇫🇷",
          avatar: avatarImg,
          status: "PENDING",
          actionLabel: "View Details",
          steps: [
            { label: "Signed Up", done: true },
            { label: "Email Confirmed", done: true },
            { label: "Onboarding Pending", done: false },
          ],
        },
        {
          id: "c1-2",
          name: "Cameron Williamson",
          role: "Vice President - Marketing",
          flag: "🇫🇷",
          avatar: avatarImg,
          status: "CANCELED",
          actionLabel: "Assign new Plan",
        },
      ],
    },
    {
      id: "c2",
      name: "Cameron Williamson",
      role: "Vice President - Marketing",
      flag: "🇫🇷",
      avatar: avatarImg,
      status: "CANCELED",
      actionLabel: "Assign new Plan",
    },
    {
      id: "c3",
      name: "Jacob Jones",
      role: "Vice President",
      flag: "🇫🇷",
      avatar: avatarImg,
      status: "ACTIVE",
      daysUntilEnd: 156,
      actionLabel: "View Plan Details",
      hasDocuments: true,
      documentName: "Jacob Plan Documents",
      documentDate: "Created On January 01, 2022",
    },
  ],
};

const statusColors: Record<NodeStatus, string> = {
  ACTIVE: "bg-green-50 text-green-600 border-green-200",
  PENDING: "bg-orange-50 text-orange-500 border-orange-200",
  CANCELED: "bg-red-50 text-red-500 border-red-200",
};

const actionColors: Record<string, string> = {
  "View Details": "bg-accent text-accent-foreground",
  "View Plan Details": "bg-accent text-accent-foreground",
  "Assign new Plan": "bg-accent text-accent-foreground",
};

function TreeCard({ node }: { node: TreeNode }) {
  return (
    <div className="flex flex-col items-center">
      {/* Days badge */}
      {node.daysUntilEnd && (
        <div className="flex items-center gap-2 mb-2 bg-primary/5 rounded-full px-3 py-1">
          <span className="text-xs text-primary">Days until plan ends:</span>
          <span className="text-xs font-bold text-primary-foreground bg-primary rounded px-2 py-0.5">{node.daysUntilEnd}</span>
        </div>
      )}

      {/* Card */}
      <div className="bg-background border border-border rounded-xl p-4 w-[280px] shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src={node.avatar} alt={node.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                {node.flag} {node.name}
              </p>
              <p className="text-xs text-muted-foreground">{node.role}</p>
            </div>
          </div>
          <button className="text-muted-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <button className={`px-4 py-1.5 rounded-lg text-xs font-medium ${actionColors[node.actionLabel || ""]}`}>
            {node.actionLabel}
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[node.status]}`}>
            {node.status}
          </span>
        </div>

        {/* Steps */}
        {node.steps && (
          <div className="flex items-center gap-4 pt-3 border-t border-dashed border-border">
            {node.steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.done ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {i === 0 ? <ClipboardCheck className="w-4 h-4" /> : i === 1 ? <Mail className="w-4 h-4" /> : <ListChecks className="w-4 h-4" />}
                </div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[60px]">{step.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Documents */}
        {node.hasDocuments && (
          <div className="flex items-center gap-3 pt-3 border-t border-dashed border-border mt-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">{node.documentName}</p>
              <p className="text-[10px] text-muted-foreground">{node.documentDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InsuranceTree() {
  const [department, setDepartment] = useState("all");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Company insurance <span className="text-primary">Plan Tree:</span>
        </h1>
        <div className="flex items-center gap-3">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[200px] rounded-full">
              <SelectValue placeholder="Select A Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select A Department</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium">
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="overflow-auto pb-10">
        <div className="flex flex-col items-center gap-8 min-w-[900px]">
          {/* Root */}
          <TreeCard node={treeData} />

          {/* Connector lines */}
          <div className="w-px h-8 border-l-2 border-dashed border-border" />

          {/* Children row */}
          {treeData.children && (
            <div className="relative">
              {/* Horizontal connector */}
              <div className="absolute top-0 left-[140px] right-[140px] h-px border-t-2 border-dashed border-border" />
              
              <div className="flex items-start gap-12">
                {treeData.children.map((child) => (
                  <div key={child.id} className="flex flex-col items-center">
                    <div className="w-px h-8 border-l-2 border-dashed border-border" />
                    <TreeCard node={child} />

                    {/* Sub-children */}
                    {child.children && (
                      <>
                        <div className="w-px h-8 border-l-2 border-dashed border-border" />
                        <div className="flex items-start gap-8">
                          {child.children.map((subChild) => (
                            <div key={subChild.id} className="flex flex-col items-center">
                              <div className="w-px h-8 border-l-2 border-dashed border-border" />
                              <TreeCard node={subChild} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
