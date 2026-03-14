import { useQuote } from "@/contexts/QuoteContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Employee } from "@/types/quote";

const Step4Employees = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [showPersonalizedMsg, setShowPersonalizedMsg] = useState(true);
  const [csvUrl, setCsvUrl] = useState("");

  // Initialize with at least one employee
  const employees = data.employees.length > 0
    ? data.employees
    : [{ id: "1", fullName: "", email: "", personalizedMessage: "" }];

  const updateEmployee = (index: number, partial: Partial<Employee>) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], ...partial };
    updateData({ employees: updated });
  };

  const addEmployee = () => {
    const newEmp: Employee = {
      id: String(employees.length + 1),
      fullName: "",
      email: "",
      personalizedMessage: "",
    };
    updateData({ employees: [...employees, newEmp] });
  };

  const handleSendInvites = () => {
    // Future: API call to send invites
    setCurrentStep(5);
  };

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-2">
        Add employees
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-2xl">
        They will receive an email to complete the necessary information. You can add employees one at a time by typing the email and pressing Tab/Enter.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Employee forms */}
        <div className="lg:col-span-2 space-y-4">
          {employees.map((emp, i) => (
            <div key={emp.id} className="border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Employee {i + 1}</span>
                </div>
                {i === 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Add personalized message</span>
                    <Switch checked={showPersonalizedMsg} onCheckedChange={setShowPersonalizedMsg} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Full name</label>
                  <Input
                    value={emp.fullName}
                    onChange={(e) => updateEmployee(i, { fullName: e.target.value })}
                    placeholder="Kyle"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email address</label>
                  <Input
                    type="email"
                    value={emp.email}
                    onChange={(e) => updateEmployee(i, { email: e.target.value })}
                    placeholder="Fisher"
                    className="border-border"
                  />
                </div>
              </div>

              {showPersonalizedMsg && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Personalized message</label>
                  <Textarea
                    value={emp.personalizedMessage || ""}
                    onChange={(e) => updateEmployee(i, { personalizedMessage: e.target.value })}
                    className="border-border min-h-[60px]"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary/40" />
              <span className="text-sm text-muted-foreground">Employee {employees.length + 1}</span>
            </div>
            <Button
              onClick={addEmployee}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 flex items-center gap-2"
            >
              Add employers <UserPlus className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(3)}
              className="rounded-full px-8 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </div>
        </div>

        {/* Right - CSV Upload */}
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-foreground" />
              <span className="font-semibold text-sm text-foreground">Upload CSV</span>
            </div>

            <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-8 text-center mb-4">
              <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-primary">Select a CSV file to upload</p>
              <p className="text-xs text-muted-foreground">or drag and drop it here</p>
            </div>

            <p className="text-xs text-muted-foreground mb-2">Or upload from URL</p>
            <Input
              value={csvUrl}
              onChange={(e) => setCsvUrl(e.target.value)}
              placeholder="Add File URL"
              className="border-border"
            />
          </div>

          <Button
            onClick={handleSendInvites}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-3"
          >
            Send email invites
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Employees;
