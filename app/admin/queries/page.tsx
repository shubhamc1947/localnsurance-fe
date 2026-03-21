"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Send } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bestTime: string | null;
  message: string | null;
  status: string;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QueriesResponse {
  queries: ContactQuery[];
  totalPages: number;
  total: number;
}

const statusColor = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "NEW":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-600 border-orange-200";
    case "RESOLVED":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function AdminQueriesPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState("IN_PROGRESS");

  const { data, isLoading } = useQuery<QueriesResponse>({
    queryKey: ["admin-contact-queries", currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/queries?${params}`);
      if (!res.ok) throw new Error("Failed to fetch queries");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; status: string; response?: string }) => {
      const res = await fetch("/api/admin/queries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update query");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Query updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-contact-queries"] });
      setRespondDialogOpen(false);
      setSelectedQuery(null);
      setResponseText("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update query");
    },
  });

  const queries = data?.queries ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleRespond = (query: ContactQuery) => {
    setSelectedQuery(query);
    setResponseText(query.response || "");
    setResponseStatus(query.status === "NEW" ? "IN_PROGRESS" : query.status);
    setRespondDialogOpen(true);
  };

  const handleSubmitResponse = () => {
    if (!selectedQuery) return;
    updateMutation.mutate({
      id: selectedQuery.id,
      status: responseStatus,
      response: responseText.trim() || undefined,
    });
  };

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Contact Queries</h1>
        <p className="text-muted-foreground mt-1">
          View and respond to contact queries from visitors.
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
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            All Contact Queries
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading queries...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Best Time</TableHead>
                  <TableHead className="max-w-[200px]">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-sm text-muted-foreground py-12"
                    >
                      No contact queries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  queries.map((query) => (
                    <TableRow key={query.id} className="hover:bg-secondary/30">
                      <TableCell>
                        <span className="font-medium text-foreground">{query.name}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {query.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {query.phone || "\u2014"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {query.bestTime || "\u2014"}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-muted-foreground truncate">
                          {query.message || "\u2014"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(query.status)}>
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleRespond(query)}
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          <Send className="w-3.5 h-3.5" /> Respond
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Respond Dialog */}
      <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Query</DialogTitle>
            <DialogDescription>
              {selectedQuery ? `From ${selectedQuery.name} (${selectedQuery.email})` : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4 mt-2">
              {selectedQuery.message && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Original Message</p>
                  <p className="text-sm text-foreground">{selectedQuery.message}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Update Status</label>
                <Select value={responseStatus} onValueChange={setResponseStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <button
                onClick={handleSubmitResponse}
                disabled={updateMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                ) : (
                  <><Send className="w-4 h-4" /> Update Query</>
                )}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
