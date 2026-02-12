import { useState } from "react";
import { useRanking } from "@/contexts/RankingContext";
import RankingCard from "@/components/RankingCard";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Trophy, Users, Star, Search, Filter } from "lucide-react";

const Mentori = () => {
  const { users } = useRanking();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("Svi");

  const specialties = ["Svi", ...Array.from(new Set(users.map((u) => u.specialty)))];

  const filtered = [...users]
    .sort((a, b) => b.score - a.score)
    .filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.description.toLowerCase().includes(search.toLowerCase());
      const matchFilter = activeFilter === "Svi" || u.specialty === activeFilter;
      return matchSearch && matchFilter;
    });

  const topMentor = filtered[0];
  const totalStudents = users.reduce((sum, u) => sum + u.students, 0);
  const avgScore = users.length ? Math.round(users.reduce((sum, u) => sum + u.score, 0) / users.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-900/5" />
        <div className="container relative mx-auto px-4 py-14 text-center md:py-20">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold md:text-4xl">
            <TrendingUp className="h-9 w-9 text-emerald-500" />
            Rang Lista Mentora
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Naši najbolji mentori rangirani po oceni studenata. Pronađi idealnog mentora za svoju trading karijeru.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{users.length}</div>
              <div className="text-xs text-muted-foreground">Mentora</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{totalStudents}</div>
              <div className="text-xs text-muted-foreground">Ukupno studenata</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{avgScore}</div>
              <div className="text-xs text-muted-foreground">Prosečna ocena</div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Top mentor spotlight */}
        {topMentor && (
          <Card className="mb-8 overflow-hidden border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
            <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-emerald-500/30">
                  <AvatarImage src={topMentor.imageUrl} alt={topMentor.name} />
                  <AvatarFallback className="text-xl">{topMentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-lg">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <Badge className="mb-2 bg-emerald-500/15 text-emerald-600 border-emerald-500/30">#1 Mentor</Badge>
                <h2 className="text-2xl font-bold">{topMentor.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-md">{topMentor.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                  <Badge variant="secondary">{topMentor.specialty}</Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {topMentor.students} studenata
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
                    <Star className="h-3.5 w-3.5 fill-emerald-500" /> {topMentor.score}/100
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-500">{topMentor.score}</div>
                <div className="text-xs text-muted-foreground">ocena</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pretraži mentore..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {specialties.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={activeFilter === s ? "default" : "outline"}
                className={activeFilter === s ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                onClick={() => setActiveFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Prikazano {filtered.length} od {users.length} mentora
        </p>

        {/* Ranking list */}
        <div className="space-y-4">
          {filtered.map((user, i) => (
            <RankingCard key={user.id} user={user} rank={i + 1} />
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Nema mentora koji odgovaraju pretrazi.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mentori;
