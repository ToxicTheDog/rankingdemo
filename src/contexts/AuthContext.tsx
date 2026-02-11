import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_EMAIL = "admin@ranking.com";
const ADMIN_PASSWORD = "admin123";

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isLoggedIn: false,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
