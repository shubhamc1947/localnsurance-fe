"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageCircleQuestion, Send } from "lucide-react";
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

interface SupportTicket {
  id: string;
  userId: string;
  email: string;
  userName: string;
  urgent: boolean;
  category: string;
  message: string;
  response: string | null;
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
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

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

  const replyMutation = useMutation({
    mutationFn: async (data: { id: string; response: string; status: string }) => {
      const res = await fetch(`/api/admin/support/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: data.response, status: data.status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send reply");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Reply sent successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
      setReplyDialogOpen(false);
      setSelectedTicket(null);
      setReplyText("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reply");
    },
  });

  const handleReply = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.response || "");
    setReplyDialogOpen(true);
  };

  const handleSubmitReply = () => {
    if (!selectedTicket || !replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    replyMutation.mutate({
      id: selectedTicket.id,
      response: replyText.trim(),
      status: "RESOLVED",
    });
  };

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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
                      <TableCell>
                        <button
                          onClick={() => handleReply(ticket)}
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          <Send className="w-3.5 h-3.5" /> Reply
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

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Support Ticket</DialogTitle>
            <DialogDescription>
              {selectedTicket
                ? `From ${selectedTicket.userName} (${selectedTicket.email})`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Category</p>
                  <p className="text-sm text-foreground">{selectedTicket.category}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className={statusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">User Message</p>
                <p className="text-sm text-foreground">{selectedTicket.message}</p>
              </div>
              {selectedTicket.response && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-medium text-blue-700 mb-1">Previous Reply</p>
                  <p className="text-sm text-blue-900">{selectedTicket.response}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the user..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <button
                onClick={handleSubmitReply}
                disabled={replyMutation.isPending || !replyText.trim()}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {replyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Reply
                  </>
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
