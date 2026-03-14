import { useQuote } from "@/contexts/QuoteContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, ArrowLeft } from "lucide-react";

const Step3Success = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const totalMembers = data.ageGroups.reduce((s, g) => s + g.count, 0);

  return (
    <div className="p-6 lg:p-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mt-8">
        <CheckCircle className="w-10 h-10 text-primary" />
      </div>

      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3">
        Company has been <span className="text-primary">successfully onboarded!</span>
      </h2>
      <p className="text-muted-foreground text-sm mb-10 max-w-md">
        You've selected {totalMembers} people for the company's health insurance coverage. Does this include you?
      </p>

      {/* Yes / No */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10">
        <button
          onClick={() => updateData({ includesSelf: true })}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            data.includesSelf === true ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/40"
          }`}
        >
          <Users className="w-6 h-6 mb-2 text-foreground" />
          <p className="font-bold text-foreground">Yes</p>
          <p className="text-xs text-muted-foreground">I am included or want to include myself</p>
        </button>
        <button
          onClick={() => updateData({ includesSelf: false })}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            data.includesSelf === false ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/40"
          }`}
        >
          <Users className="w-6 h-6 mb-2 text-foreground" />
          <p className="font-bold text-foreground">No</p>
          <p className="text-xs text-muted-foreground">It's for employees only</p>
        </button>
      </div>

      <Button
        onClick={() => setCurrentStep(4)}
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-16 py-3 w-full max-w-md mb-3"
      >
        Continue
      </Button>
      <Button
        variant="outline"
        onClick={() => setCurrentStep(2)}
        className="rounded-full px-16 py-3 w-full max-w-md flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
    </div>
  );
};

export default Step3Success;
