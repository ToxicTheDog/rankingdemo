import React, { createContext, useContext, useState } from "react";

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
  addUser: (user: Omit<RankedUser, "id">) => void;
  updateUser: (id: string, user: Omit<RankedUser, "id">) => void;
  deleteUser: (id: string) => void;
}

const initialUsers: RankedUser[] = [
  { id: "1", name: "Marko Petrović", description: "Ekspert za forex tržište sa 12 godina iskustva. Specijalizovan za price action i smart money koncepte.", score: 98, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marko", specialty: "Forex", students: 342 },
  { id: "2", name: "Ana Jovanović", description: "Profesionalni trader kripto tržišta. Fokus na tehničku analizu i swing trading strategije.", score: 95, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", specialty: "Kripto", students: 278 },
  { id: "3", name: "Nikola Đorđević", description: "Mentor za berzu i akcije. Fundamentalna analiza i dugoročno investiranje.", score: 91, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikola", specialty: "Akcije", students: 215 },
  { id: "4", name: "Jelena Nikolić", description: "Specijalista za commodities i futures tržište. Risk management ekspert.", score: 87, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jelena", specialty: "Commodities", students: 156 },
  { id: "5", name: "Stefan Ilić", description: "Day trader sa fokusom na indekse. Scalping i intraday strategije.", score: 82, imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stefan", specialty: "Indeksi", students: 189 },
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
