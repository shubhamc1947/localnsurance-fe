"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneDialCode?: string | null;
  phone?: string | null;
  country?: string | null;
  state?: string | null;
  postalCode?: string | null;
  jobRole?: string | null;
  createdAt: string;
  updatedAt: string;
  companies?: unknown[];
}

interface LatestQuote {
  id: string;
  status: string;
  selectedPlan?: string | null;
  totalCost?: number | null;
  planStartDate?: string | null;
  planholderInfo?: unknown;
  spouseInfo?: unknown;
  dependants?: unknown[];
}

interface AuthContextType {
  user: User | null;
  latestQuote: LatestQuote | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [latestQuote, setLatestQuote] = useState<LatestQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setLatestQuote(data.latestQuote || null);
      } else {
        setUser(null);
        setLatestQuote(null);
      }
    } catch {
      setUser(null);
      setLatestQuote(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setLatestQuote(null);
    router.push("/login");
  };

  const register = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error || "Registration failed");
    }

    setUser(responseData.user);
    return responseData;
  };

  return (
    <AuthContext.Provider value={{ user, latestQuote, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
