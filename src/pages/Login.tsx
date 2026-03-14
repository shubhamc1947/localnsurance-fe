import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthSidebar from "@/components/auth/AuthSidebar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login — will be replaced with backend API
    console.log("Login attempt:", { email });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AuthSidebar />

      {/* Right Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* HI THERE! */}
          <div className="flex items-end gap-6 mb-12">
            <h1 className="font-display text-7xl font-extrabold leading-none tracking-tight">
              <span className="text-primary">HI </span>
              <span className="bg-gradient-to-r from-primary via-destructive to-accent bg-clip-text text-transparent">
                THERE!
              </span>
            </h1>
            <div className="pb-2">
              <p className="text-foreground font-display font-semibold text-lg">Welcome to localsurance.</p>
              <p className="text-foreground font-display font-semibold text-lg">Our management dashboard.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-muted-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-card border-0 rounded-lg text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="rounded-full px-8 h-12 text-sm font-medium border-border text-muted-foreground bg-[#F6F6F6]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="rounded-full px-12 h-12 text-sm font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Log in
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
