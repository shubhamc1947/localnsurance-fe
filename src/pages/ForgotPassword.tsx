import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthSidebar from "@/components/auth/AuthSidebar";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock — will be replaced with backend API
    console.log("Password reset requested for:", email);
    navigate("/verify-otp");
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AuthSidebar />

      {/* Right Content */}
      <div className="flex-1 flex items-start justify-start p-8 pt-48 pl-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <h1 className="font-display text-4xl font-bold mb-2">
            <span className="text-primary italic">Reset</span>{" "}
            <span className="text-foreground">your password</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Enter the email address you used to register with
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your email</label>
              <Input
                type="email"
                placeholder="amir@stealthstartup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-card border-0 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/login")}
                className="rounded-full px-8 h-12 text-sm font-medium border-border text-muted-foreground flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to the sign in
              </Button>
              <Button
                type="submit"
                className="rounded-full px-8 h-12 text-sm font-medium bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
              >
                Send instructions
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
