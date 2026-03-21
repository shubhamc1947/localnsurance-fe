"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  activeQuotes: number;
  totalRevenue: number;
  recentQuotes: {
    id: string;
    companyName: string;
    plan: string;
    status: string;
    cost: number;
    createdAt: string;
  }[];
}

const statusColor = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "DRAFT":
      return "bg-muted text-muted-foreground border-border";
    case "SUBMITTED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "EXPIRED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
  });

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers ?? 0,
      subtitle: "Registered accounts",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Companies",
      value: data?.totalCompanies ?? 0,
      subtitle: "Active organizations",
      icon: Building2,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Active Quotes",
      value: data?.activeQuotes ?? 0,
      subtitle: "Currently active",
      icon: FileText,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `$${(data?.totalRevenue ?? 0).toLocaleString()}`,
      subtitle: "Lifetime earnings",
      icon: DollarSign,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your platform activity and metrics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Recent Quotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data?.recentQuotes || data.recentQuotes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground py-12"
                  >
                    No recent quotes found.
                  </TableCell>
                </TableRow>
              ) : (
                data.recentQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-secondary/30">
                    <TableCell className="font-medium text-foreground">
                      {quote.companyName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{quote.plan}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ${quote.cost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColor(quote.status)}
                      >
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
