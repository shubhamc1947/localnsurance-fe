"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, MessageCircleQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface SupportTicket {
  id: string;
  userId: string;
  email: string;
  userName: string;
  urgent: boolean;
  category: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketsResponse {
  tickets: SupportTicket[];
  totalPages: number;
  total: number;
}

const statusColor = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "OPEN":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-600 border-orange-200";
    case "RESOLVED":
      return "bg-green-50 text-green-700 border-green-200";
    case "CLOSED":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function AdminSupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery<TicketsResponse>({
    queryKey: ["admin-support-tickets", currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/support?${params}`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
  });

  const tickets = data?.tickets ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all support requests from users.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageCircleQuestion className="w-5 h-5 text-muted-foreground" />
            All Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading tickets...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Urgent</TableHead>
                  <TableHead className="max-w-[250px]">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground py-12"
                    >
                      No support tickets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-secondary/30">
                      <TableCell>
                        <span className="font-medium text-foreground">{ticket.userName}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.category}
                      </TableCell>
                      <TableCell>
                        {ticket.urgent ? (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <p className="text-sm text-muted-foreground truncate">{ticket.message}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {new Date(ticket.createdAt).toLocaleDateString()}
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
