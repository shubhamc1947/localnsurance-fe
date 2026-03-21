"use client";

import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const categories = [
  "General Support",
  "Coverage Questions",
  "Billing and Payments",
  "Account Management",
  "Technical Support",
];

interface SupportTicket {
  id: string;
  urgent: boolean;
  category: string;
  message: string;
  response: string | null;
  status: string;
  createdAt: string;
}

export default function Support() {
  const [isUrgent, setIsUrgent] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("General Support");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["my-support-tickets"],
    queryFn: async () => {
      const res = await fetch("/api/support?limit=10");
      if (!res.ok) return { tickets: [] };
      return res.json();
    },
  });

  const tickets: SupportTicket[] = ticketsData?.tickets || [];

  const submitMutation = useMutation({
    mutationFn: async (data: { urgent: boolean; category: string; message: string }) => {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit support request");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Support request submitted successfully!");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["my-support-tickets"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit support request");
    },
  });

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    submitMutation.mutate({
      urgent: isUrgent,
      category: selectedCategory,
      message: message.trim(),
    });
  };

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

  return (
    <div className="p-8 max-w-[1000px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Submit a Request for Support</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Please fill out the form below with the details of your request, and one of our support team members will get back to you as soon as possible.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-primary/10 rounded-xl px-5 py-4 max-w-sm">
          <Info className="w-8 h-8 text-primary mt-0.5 shrink-0" />
          <p className="text-sm font-semibold text-foreground">
            The response to your question will be sent to the email address linked to your account
          </p>
        </div>
      </div>

      {/* Urgent? */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Is this request urgent?</p>
        <div className="flex items-center gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              onClick={() => setIsUrgent(val)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isUrgent === val
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                isUrgent === val ? "bg-primary border-primary" : "border-border"
              }`}>
                {isUrgent === val && <span className="text-primary-foreground text-xs">&#10003;</span>}
              </div>
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">How would you categorize this request?</p>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                selectedCategory === cat ? "bg-primary border-primary" : "border-border"
              }`}>
                {selectedCategory === cat && <span className="text-primary-foreground text-xs">&#10003;</span>}
              </div>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Personalized message</p>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder=""
          className="min-h-[160px] bg-secondary/50 border-0 resize-none"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={submitMutation.isPending}
        className="bg-accent text-accent-foreground px-16 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
          </span>
        ) : (
          "Send"
        )}
      </button>

      {/* My Tickets */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">My Tickets</h2>
        {ticketsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-secondary/30 rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">You have no support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-secondary/30 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{ticket.category}</span>
                      {ticket.urgent && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                          Urgent
                        </span>
                      )}
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {ticket.response && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Reply from support:</p>
                    <p className="text-sm text-blue-900">{ticket.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
