import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuoteProvider } from "@/contexts/QuoteContext";
import Index from "./pages/Index.tsx";
import GetQuote from "./pages/GetQuote.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import VerifyOTP from "./pages/VerifyOTP.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PasswordResetSuccess from "./pages/PasswordResetSuccess.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import MembersOverview from "./pages/dashboard/MembersOverview.tsx";
import InsuranceTree from "./pages/dashboard/InsuranceTree.tsx";
import BillsPayment from "./pages/dashboard/BillsPayment.tsx";
import Support from "./pages/dashboard/Support.tsx";
import EditProfile from "./pages/dashboard/EditProfile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuoteProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/get-quote" element={<GetQuote />} />
            <Route path="/get-quote/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/members" replace />} />
              <Route path="members" element={<MembersOverview />} />
              <Route path="insurance-tree" element={<InsuranceTree />} />
              <Route path="bills" element={<BillsPayment />} />
              <Route path="support" element={<Support />} />
              <Route path="profile" element={<EditProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QuoteProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
