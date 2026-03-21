"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  Users,
  Building2,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* ---------- Interfaces ---------- */

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName: string | null;
  companyId: string | null;
  quoteStatus: string;
  employeeCount: number;
  status: string;
  createdAt: string;
}

interface EmployeeRecord {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  onboardingStatus: string;
  onboardingComplete: boolean;
  personalDetailsFilled: boolean;
  createdAt: string;
}

interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName: string | null;
  status: string;
  createdAt: string;
}

/* ---------- Helpers ---------- */

const quoteStatusColor = (status: string) => {
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

const onboardingStatusColor = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "PENDING":
      return "bg-orange-50 text-orange-600 border-orange-200";
    case "CANCELED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

/* ---------- Sub-components ---------- */

function CompanyAdminsTab({ searchTerm }: { searchTerm: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ users: AdminUser[]; totalPages: number; total: number }>({
    queryKey: ["admin-users-admins", currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        type: "admins",
      });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch admins");
      return res.json();
    },
  });

  const { data: employeesData, isLoading: employeesLoading } = useQuery<{
    employees: EmployeeRecord[];
  }>({
    queryKey: ["admin-company-employees", expandedUserId],
    queryFn: async () => {
      if (!expandedUserId) return { employees: [] };
      const expandedUser = users.find((u) => u.id === expandedUserId);
      const companyName = expandedUser?.companyName || "";
      const params = new URLSearchParams({
        type: "employees",
        limit: "100",
        search: companyName,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      return res.json();
    },
    enabled: !!expandedUserId,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const employees = employeesData?.employees ?? [];

  return (
    <>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            Company Admins
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading admins...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Quote Status</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
                      No company admins found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <Fragment key={user.id}>
                      <TableRow className="hover:bg-secondary/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {user.firstName?.charAt(0) ?? ""}
                                {user.lastName?.charAt(0) ?? ""}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {user.firstName} {user.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {user.companyName ?? "--"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={quoteStatusColor(user.quoteStatus)}>
                            {user.quoteStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{user.employeeCount}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.employeeCount > 0 && (
                            <button
                              onClick={() =>
                                setExpandedUserId(expandedUserId === user.id ? null : user.id)
                              }
                              className="p-1 rounded hover:bg-secondary transition-colors flex items-center gap-1 text-sm text-primary font-medium"
                            >
                              {expandedUserId === user.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                              <span className="hidden sm:inline">
                                {expandedUserId === user.id ? "Hide" : "View"}
                              </span>
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedUserId === user.id && (
                        <TableRow key={`${user.id}-employees`}>
                          <TableCell colSpan={7} className="bg-secondary/20 p-0">
                            <div className="px-6 py-4">
                              <p className="text-sm font-semibold text-foreground mb-3">
                                Employees of {user.companyName}
                              </p>
                              {employeesLoading ? (
                                <div className="flex items-center gap-2 py-4">
                                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                  <span className="text-sm text-muted-foreground">Loading employees...</span>
                                </div>
                              ) : employees.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-2">No employees found.</p>
                              ) : (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Onboarding</TableHead>
                                      <TableHead>Personal Details</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {employees.map((emp) => (
                                      <TableRow key={emp.id} className="hover:bg-secondary/30">
                                        <TableCell className="font-medium text-foreground">
                                          {emp.fullName}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                          {emp.email}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant="outline"
                                            className={onboardingStatusColor(emp.onboardingStatus)}
                                          >
                                            {emp.onboardingStatus}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {emp.personalDetailsFilled ? (
                                            <Badge
                                              variant="outline"
                                              className="bg-green-50 text-green-700 border-green-200"
                                            >
                                              Yes
                                            </Badge>
                                          ) : (
                                            <Badge
                                              variant="outline"
                                              className="bg-muted text-muted-foreground border-border"
                                            >
                                              No
                                            </Badge>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}

function EmployeesTab({ searchTerm }: { searchTerm: string }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<{
    employees: EmployeeRecord[];
    totalPages: number;
    total: number;
  }>({
    queryKey: ["admin-users-employees", currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        type: "employees",
      });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      return res.json();
    },
  });

  const employees = data?.employees ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            All Employees
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading employees...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead>Personal Details</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-12">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => (
                    <TableRow key={emp.id} className="hover:bg-secondary/30">
                      <TableCell className="font-medium text-foreground">{emp.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.companyName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={onboardingStatusColor(emp.onboardingStatus)}>
                          {emp.onboardingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {emp.personalDetailsFilled ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}

function PlatformAdminsTab({ searchTerm }: { searchTerm: string }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<{
    users: PlatformUser[];
    totalPages: number;
    total: number;
  }>({
    queryKey: ["admin-users-platform", currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        type: "platform",
      });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch platform admins");
      return res.json();
    },
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            Platform Admins
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading platform admins...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-12">
                      No platform admins found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-purple-700">
                              {user.firstName?.charAt(0) ?? ""}
                              {user.lastName?.charAt(0) ?? ""}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          SUPER ADMIN
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}

/* ---------- Pagination ---------- */

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        Next &rarr;
      </button>
    </div>
  );
}

/* ---------- Main Page ---------- */

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("admins");

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all user accounts across the platform.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="admins">Company Admins</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="platform">Platform Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <CompanyAdminsTab searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeesTab searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="platform">
          <PlatformAdminsTab searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
