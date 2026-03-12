import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowRight } from "lucide-react";
import { useRanking } from "@/contexts/RankingContext";
import RankTitleBadge from "@/components/RankTitleBadge";
import { resolveImageUrl } from "@/lib/api";

const TopMentorsSection = () => {
  const { users } = useRanking();
  const topMentors = [...users].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 text-gold">Top mentori</Badge>
        <h2 className="text-3xl font-bold md:text-4xl">Upoznaj naše najbolje</h2>
        <p className="mt-3 text-muted-foreground">Iskusni profesionalci koji će te voditi kroz svet tradinga</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto stagger-children">
        {topMentors.map((mentor) => (
          <Card key={mentor.id} className="animate-scale-fade-in text-center transition-all hover:shadow-lg hover:border-gold/30">
            <CardContent className="p-6">
              <Avatar className="mx-auto h-20 w-20 mb-4">
                <AvatarImage src={resolveImageUrl(mentor.imageUrl)} alt={mentor.name} />
                <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{mentor.name}</h3>
              <Badge variant="secondary" className="mt-2 text-xs">{mentor.specialty}</Badge>
              <div className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {mentor.students} studenata
              </div>
              <div className="mt-2 text-2xl font-bold text-gold">{mentor.score}</div>
              <RankTitleBadge score={mentor.score} className="mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/mentori">
          <Button variant="outline" size="lg">
            Pogledaj sve mentore <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default TopMentorsSection;
