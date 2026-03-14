import { useQuote } from "@/contexts/QuoteContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, Users, DollarSign, Settings, ClipboardList, User } from "lucide-react";
import { useState } from "react";

const roles = [
  { id: "ceo", label: "I'm the CEO/Founder", desc: "I lead the company and make executive decisions, including purchasing insurance.", icon: Building2 },
  { id: "hr", label: "I'm the HR Director", desc: "I manage employee welfare and benefits, including health insurance.", icon: Users },
  { id: "cfo", label: "I'm the CFO/Finance Director", desc: "I oversee financial planning and manage the budget for company expenses.", icon: DollarSign },
  { id: "ops", label: "I'm the Operations Manager", desc: "I ensure smooth daily operations and manage resources, including insurance.", icon: Settings },
  { id: "admin", label: "I'm the Administrative Manager", desc: "I handle administrative tasks, including the organization of employee benefits.", icon: ClipboardList },
  { id: "other", label: "Other", desc: "", icon: User },
];

const Step1Admin = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [selectedRole, setSelectedRole] = useState(data.role);

  const handleNext = () => {
    updateData({ role: selectedRole });
    setCurrentStep(2);
  };

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        <span className="text-primary">Let's Get Started</span> with Plan Administrator
      </h2>

      {/* Name & Email row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">First name</label>
          <Input
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Amir"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Last name</label>
          <Input
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder="Kerim"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Email address</label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="amir@stealthstartup.com"
            className="border-border"
          />
        </div>
      </div>

      {/* Location row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Country of residence</label>
          <Select value={data.country} onValueChange={(v) => updateData({ country: v })}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">State</label>
          <Select value={data.state} onValueChange={(v) => updateData({ state: v })}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mo">Missouri</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
              <SelectItem value="il">Illinois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Postal code</label>
          <Input
            value={data.postalCode}
            onChange={(e) => updateData({ postalCode: e.target.value })}
            placeholder="90005"
            className="border-border"
          />
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Select Your Role in the Company</label>
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-dashed border-border">
            <p className="text-sm font-medium text-foreground">Which of the following best describes your position?</p>
          </div>
          <div className="divide-y divide-border">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    isSelected ? "bg-accent/5" : ""
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${isSelected ? "text-accent" : "text-foreground"}`}>
                      {role.label}
                    </span>
                    {role.desc && (
                      <span className={`text-xs hidden md:block ${isSelected ? "text-accent" : "text-muted-foreground"}`}>
                        {role.desc}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1Admin;
