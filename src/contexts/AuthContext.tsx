import React, { createContext, useContext, useState, useEffect } from "react";
import { authLogin, authRegister, type AuthResponse } from "@/lib/api";

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: AuthResponse["user"] | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
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
  logout: () => {},
  loginError: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState<AuthResponse["user"] | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const isLoggedIn = !!token;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await authLogin({ email, password });
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch (err: any) {
      setLoginError(err.message || "Greška pri prijavi");
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await authRegister({ email, password, name });
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch (err: any) {
      setLoginError(err.message || "Greška pri registraciji");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, token, user, login, register, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};
