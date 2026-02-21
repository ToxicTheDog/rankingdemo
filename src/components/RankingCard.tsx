import { RankedUser } from "@/contexts/RankingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users } from "lucide-react";
import RankBadge from "@/components/RankBadge";
import RankTitleBadge from "@/components/RankTitleBadge";

interface RankingCardProps {
  user: RankedUser;
  rank: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2: return <Medal className="h-5 w-5 text-slate-400" />;
    case 3: return <Award className="h-5 w-5 text-amber-700" />;
    default: return null;
  }
};

const getRankBorder = (rank: number) => {
  switch (rank) {
    case 1: return "border-yellow-500/60 shadow-yellow-500/20 shadow-lg";
    case 2: return "border-slate-400/60 shadow-slate-400/20 shadow-lg";
    case 3: return "border-amber-700/60 shadow-amber-700/20 shadow-lg";
    default: return "border-border";
  }
};

const RankingCard = ({ user, rank }: RankingCardProps) => {
  return (
    <Card className={`transition-all hover:scale-[1.02] hover:shadow-xl ${getRankBorder(rank)}`}>
      <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
        <RankBadge rank={rank} size="md" />

        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold sm:text-lg">{user.name}</h3>
            {getRankIcon(rank)}
          </div>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">{user.description}</p>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">{user.specialty}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" /> {user.students} studenata
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right flex flex-col items-end gap-1">
          <div className="text-xl font-bold sm:text-2xl">{user.score}</div>
          <RankTitleBadge score={user.score} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingCard;
