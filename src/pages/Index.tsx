import { useRanking } from "@/contexts/RankingContext";
import RankingCard from "@/components/RankingCard";
import Header from "@/components/Header";
import { Trophy } from "lucide-react";

const Index = () => {
  const { users } = useRanking();
  const sorted = [...users].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Rang Lista
          </h1>
          <p className="mt-2 text-muted-foreground">Top korisnici rangirani po oceni</p>
        </div>

        <div className="space-y-4">
          {sorted.map((user, i) => (
            <RankingCard key={user.id} user={user} rank={i + 1} />
          ))}
          {sorted.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">Nema korisnika za prikaz.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
