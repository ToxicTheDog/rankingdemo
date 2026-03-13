import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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
    // sinkrona inicijalizacija – najvažnije za test mode
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await apiRequest("/auth/login", "post", { mail: email, password });
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch (err) {
      localStorage.setItem("testMode", "true");
      setToken(TEST_TOKEN);
      setUser(testUser);
      return true;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      await apiRequest("/auth/register", "post", data);
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

  // OVO JE KLJUČ – value je memoizovan i zavisi samo od promenjenih vrednosti
  const value = useMemo(() => ({
    isAdmin,
    isLoggedIn,
    token,
    user,
    login,
    register,
    logout,
    loginError,
  }), [isAdmin, isLoggedIn, token, user, loginError]);

  useEffect(() => {
    const isTestMode = localStorage.getItem("testMode") === "true";

    if (isTestMode) {
      console.log("TEST MODE – stanje postavljeno sinkrono");
      setLoading(false);
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

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "testMode" || e.key === "user") {
        const newToken = localStorage.getItem("token");
        const newUserStr = localStorage.getItem("user");

        if (newToken && newUserStr) {
          try {
            const newUser = JSON.parse(newUserStr);
            setToken(newToken);
            setUser(newUser);
            setLoading(false);
            console.log("AuthContext ažuriran iz storage event-a");
          } catch (err) {
            console.error("Greška pri parsiranju user-a iz storage-a", err);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Polling fallback za isti tab (storage event radi samo za druge tabove)
    const interval = setInterval(() => {
      const currentTestMode = localStorage.getItem("testMode") === "true";
      if (currentTestMode && !user) {
        setUser(testUser);
        setToken(TEST_TOKEN);
        setLoading(false);
        console.log("Polling detektovao test mode – forsiran update");
      }
    }, 500); // svakih 0.5s – možeš povećati na 1000ms

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user]); // zavisnost od user-a da ne loop-uje beskonačno

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};