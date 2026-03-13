import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { authRegister } from "@/lib/api";           // tvoja originalna funkcija iz main branch-a
import { apiRequest } from "@/lib/apiClient";
import { TEST_TOKEN, testUser } from "@/lib/testData";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: string;
  imageUrl?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isLoggedIn: false,
  token: null,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => { },
  loginError: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (localStorage.getItem("testMode") === "true") return TEST_TOKEN;
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<UserData | null>(() => {
    if (localStorage.getItem("testMode") === "true") return testUser;
    return null;
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "admin";

  // Restore session
  useEffect(() => {
    const isTestMode = localStorage.getItem("testMode") === "true";
    if (isTestMode) {
      setLoading(false);
      console.log("✅ TEST MODE AKTIVIRAN – odmah logged in (bez refresh-a)");
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    apiRequest("/auth/me")
      .then((res) => {
        setUser(res.user || res.data?.user);
        setToken(storedToken);
      })
      .catch(() => {
        console.warn("Backend nedostupan → prelazim u test mode");
        localStorage.setItem("testMode", "true");
        setUser(testUser);
        setToken(TEST_TOKEN);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await apiRequest("/auth/login", "post", { mail: email, password });
      const t = res.token;
      const u = res.user;
      localStorage.setItem("token", t);
      localStorage.removeItem("testMode");
      setUser(u);
      setToken(t);
      return true;
    } catch {
      console.log("🔄 Backend nedostupan → TEST MODE AKTIVIRAN");
      localStorage.setItem("testMode", "true");
      localStorage.setItem("token", TEST_TOKEN);
      // Set both synchronously so React batches the update
      setUser(testUser);
      setToken(TEST_TOKEN);
      return true;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    setLoginError(null);
    try {
      await authRegister(data);
      return true;
    } catch (err: any) {
      setLoginError(err.message || "Greška pri registraciji");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("testMode");
    setToken(null);
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      isAdmin,
      isLoggedIn,
      token,
      user,
      login,
      register,
      logout,
      loginError,
    }),
    [isAdmin, isLoggedIn, token, user, loginError]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};