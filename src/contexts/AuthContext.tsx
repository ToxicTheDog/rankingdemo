import React, { createContext, useContext, useState, useEffect } from "react";
import { authLogin, authRegister, authMe } from "@/lib/api";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  loginError: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  country: string;
  username: string;
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<UserData | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "admin";

  // Restore session from stored token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    authMe(storedToken)
      .then((res) => {
        setUser(res.user as UserData);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await authLogin({ mail: email, password });
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch (err: any) {
      setLoginError(err.message);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await authRegister({
        mail: data.email,
        fullName: data.fullName,
        password: data.password,
        phoneNumber: data.phone,
        date: data.birthDate,
        address: data.address,
        city: data.city,
        country: data.country,
        username: data.username,
      });
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch (err: any) {
      setLoginError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, token, user, login, register, logout, loginError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
