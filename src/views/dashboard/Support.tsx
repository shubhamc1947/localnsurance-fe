"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const categories = [
  "General Support",
  "Coverage Questions",
  "Billing and Payments",
  "Account Management",
  "Technical Support",
];

export default function Support() {
  const [isUrgent, setIsUrgent] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("General Support");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    toast.success("Support request submitted successfully!");
    setMessage("");
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
                {isUrgent === val && <span className="text-primary-foreground text-xs">✓</span>}
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
                {selectedCategory === cat && <span className="text-primary-foreground text-xs">✓</span>}
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
        className="bg-accent text-accent-foreground px-16 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Send
      </button>
    </div>
  );
}
