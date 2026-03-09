import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  city_country: string;
  username: string;
}

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  loginError: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  birthDate: string;
  address: string;
  cityCountry: string;
  username: string;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isLoggedIn: false,
  token: null,
  user: null,
  profile: null,
  session: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  loginError: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!session;
  const token = session?.access_token ?? null;
  const isAdmin = false; // TODO: implement role checking

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile(data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
      return false;
    }
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoginError(null);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    });
    if (error) {
      setLoginError(error.message);
      return false;
    }
    if (!authData.user) {
      setLoginError("Registracija nije uspela.");
      return false;
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      birth_date: data.birthDate,
      address: data.address,
      city_country: data.cityCountry,
      username: data.username,
    });
    if (profileError) {
      setLoginError(profileError.message);
      return false;
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, user, profile, session, login, register, logout, loginError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
