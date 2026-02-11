import React, { createContext, useContext, useState } from "react";

export interface RankedUser {
  id: string;
  name: string;
  description: string;
  score: number;
  imageUrl: string;
}

interface RankingContextType {
  users: RankedUser[];
  addUser: (user: Omit<RankedUser, "id">) => void;
  updateUser: (id: string, user: Omit<RankedUser, "id">) => void;
  deleteUser: (id: string) => void;
}

const initialUsers: RankedUser[] = [
  { id: "1", name: "Marko Petrović", description: "Full-stack developer sa 8 godina iskustva", score: 98, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marko" },
  { id: "2", name: "Ana Jovanović", description: "UI/UX dizajnerka i frontend specijalista", score: 95, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { id: "3", name: "Nikola Đorđević", description: "Backend inženjer i DevOps entuzijasta", score: 91, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikola" },
  { id: "4", name: "Jelena Nikolić", description: "Data scientist i ML inženjerka", score: 87, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jelena" },
  { id: "5", name: "Stefan Ilić", description: "Mobile developer - React Native & Flutter", score: 82, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stefan" },
];

const RankingContext = createContext<RankingContextType>({
  users: [],
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
});

export const useRanking = () => useContext(RankingContext);

export const RankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<RankedUser[]>(initialUsers);

  const addUser = (user: Omit<RankedUser, "id">) => {
    setUsers((prev) => [...prev, { ...user, id: crypto.randomUUID() }]);
  };

  const updateUser = (id: string, data: Omit<RankedUser, "id">) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <RankingContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </RankingContext.Provider>
  );
};
