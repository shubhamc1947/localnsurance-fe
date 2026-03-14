import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import envlop from "@/assets/envlop.png"
import AuthSidebar from "@/components/auth/AuthSidebar";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);
    navigate("/reset-password");
  };

  const handleResend = () => {
    console.log("Resend OTP requested");
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AuthSidebar />

      <div className="flex-1 flex items-start justify-start p-8 pt-32 pl-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Email icon */}
          <div className="mb-6 text-4xl">
            <img src={envlop} alt="Email" className="w-16 h-16" />

          </div>

          <h1 className="font-display text-4xl font-bold mb-2">
            <span className="text-primary ">Reset</span>{" "}
            <span className="text-foreground">your password</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            We sent a code to <span className="font-semibold text-foreground">amir@stealthstartup.com</span>
          </p>

          <form onSubmit={handleContinue} className="space-y-8">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-20 h-20 text-3xl font-bold rounded-xl border-2 border-border bg-card first:rounded-l-xl last:rounded-r-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              className="w-full rounded-full h-12 text-sm font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Continue
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full rounded-full h-12 text-sm font-medium border-border text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to the log in
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button type="button" onClick={handleResend} className="text-accent font-medium hover:underline">
                Click to resend
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;
