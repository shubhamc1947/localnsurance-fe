"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Loader2,
  Building2,
  Power,
  PowerOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Company {
  id: string;
  name: string;
  ownerName: string;
  plan: string;
  employeeCount: number;
  status: string;
  isActive: boolean;
  createdAt: string;
}

interface CompaniesResponse {
  companies: Company[];
  totalPages: number;
  total: number;
}

const statusColor = (status?: string | null) => {
  if (!status) return "bg-muted text-muted-foreground border-border";
  switch (status.toUpperCase()) {
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

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update company status");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      toast.success(
        variables.isActive ? "Company enabled successfully" : "Company disabled successfully"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { data, isLoading } = useQuery<CompaniesResponse>({
    queryKey: ["admin-companies", currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
      });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/admin/companies?${params}`);
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    },
  });

  const companies = data?.companies ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Companies</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor all registered companies on the platform.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            All Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading companies...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Quote Status</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-sm text-muted-foreground py-12"
                    >
                      No companies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow
                      key={company.id}
                      className={`hover:bg-secondary/30 ${!company.isActive ? "opacity-50" : ""}`}
                    >
                      <TableCell className="font-medium text-foreground">
                        {company.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.ownerName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.plan}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {company.employeeCount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColor(company.status)}
                        >
                          {company.status || "DRAFT"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            company.isActive
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {company.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-secondary transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() =>
                                toggleMutation.mutate({
                                  id: company.id,
                                  isActive: !company.isActive,
                                })
                              }
                            >
                              {company.isActive ? (
                                <>
                                  <PowerOff className="w-4 h-4 text-red-500" />
                                  <span className="text-red-600">Disable Policy</span>
                                </>
                              ) : (
                                <>
                                  <Power className="w-4 h-4 text-green-500" />
                                  <span className="text-green-600">Enable Policy</span>
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            &larr; Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .reduce<(number | null)[]>((acc, page, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== undefined && page - arr[idx - 1] > 1) {
                  acc.push(null);
                }
                acc.push(page);
                return acc;
              }, [])
              .map((page, i) =>
                page === null ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
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
              )}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
