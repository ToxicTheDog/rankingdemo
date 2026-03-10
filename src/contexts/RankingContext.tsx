import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMentors, createMentor, updateMentor, deleteMentor, MentorData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface RankedUser {
  id: string;
  name: string;
  description: string;
  score: number;
  imageUrl: string;
  specialty: string;
  students: number;
}

interface RankingContextType {
  users: RankedUser[];
  loading: boolean;
  addUser: (user: Omit<RankedUser, "id">) => Promise<void>;
  updateUser: (id: string, user: Omit<RankedUser, "id">) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const RankingContext = createContext<RankingContextType>({
  users: [],
  loading: true,
  addUser: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
  refreshUsers: async () => {},
});

export const useRanking = () => useContext(RankingContext);

export const RankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getMentors();
      setUsers(res.data.map((m: MentorData) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        score: m.score,
        imageUrl: m.imageUrl,
        specialty: m.specialty,
        students: m.students,
      })));
    } catch (err) {
      console.error("Failed to fetch mentors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (user: Omit<RankedUser, "id">) => {
    if (!token) throw new Error("Niste ulogovani");
    const res = await createMentor(user, token);
    setUsers((prev) => [...prev, {
      id: res.data.id,
      name: res.data.name,
      description: res.data.description,
      score: res.data.score,
      imageUrl: res.data.imageUrl,
      specialty: res.data.specialty,
      students: res.data.students,
    }]);
  };

  const updateUserFn = async (id: string, data: Omit<RankedUser, "id">) => {
    if (!token) throw new Error("Niste ulogovani");
    const res = await updateMentor(id, data, token);
    setUsers((prev) => prev.map((u) => (u.id === id ? {
      id: res.data.id,
      name: res.data.name,
      description: res.data.description,
      score: res.data.score,
      imageUrl: res.data.imageUrl,
      specialty: res.data.specialty,
      students: res.data.students,
    } : u)));
  };

  const deleteUserFn = async (id: string) => {
    if (!token) throw new Error("Niste ulogovani");
    await deleteMentor(id, token);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <RankingContext.Provider value={{ users, loading, addUser, updateUser: updateUserFn, deleteUser: deleteUserFn, refreshUsers: fetchUsers }}>
      {children}
    </RankingContext.Provider>
  );
};
