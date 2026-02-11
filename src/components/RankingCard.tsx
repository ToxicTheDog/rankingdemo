import { RankedUser } from "@/contexts/RankingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users } from "lucide-react";

interface RankingCardProps {
  user: RankedUser;
  rank: number;
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return { border: "border-yellow-500/60 shadow-yellow-500/20 shadow-lg", icon: <Trophy className="h-6 w-6 text-yellow-500" />, badge: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" };
    case 2:
      return { border: "border-slate-400/60 shadow-slate-400/20 shadow-lg", icon: <Medal className="h-6 w-6 text-slate-400" />, badge: "bg-slate-400/15 text-slate-400 border-slate-400/30" };
    case 3:
      return { border: "border-amber-700/60 shadow-amber-700/20 shadow-lg", icon: <Award className="h-6 w-6 text-amber-700" />, badge: "bg-amber-700/15 text-amber-700 border-amber-700/30" };
    default:
      return { border: "border-border", icon: null, badge: "bg-muted text-muted-foreground border-border" };
  }
};

const RankingCard = ({ user, rank }: RankingCardProps) => {
  const style = getRankStyle(rank);

  return (
    <Card className={`transition-all hover:scale-[1.02] hover:shadow-xl ${style.border}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${style.badge}`}>
          {rank}
        </div>

        <Avatar className="h-14 w-14">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold">{user.name}</h3>
            {style.icon}
          </div>
          <p className="truncate text-sm text-muted-foreground">{user.description}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{user.specialty}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" /> {user.students} studenata
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-2xl font-bold">{user.score}</div>
          <div className="text-xs text-muted-foreground">ocena</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingCard;
