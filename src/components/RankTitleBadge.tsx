/**
 * RankTitleBadge — Shows the rank title (Beginner, Elite, VIP, etc.)
 * next to a user's score. Includes per-rank animations.
 * 
 * Usage: <RankTitleBadge score={95} />
 * 
 * To customize ranks, edit src/lib/rank-titles.ts
 * To customize animations, edit index.css "Rank Title Animations"
 */

import { cn } from "@/lib/utils";
import { getRankTitle } from "@/lib/rank-titles";

interface RankTitleBadgeProps {
  score: number;
  className?: string;
  showIcon?: boolean;
}

const RankTitleBadge = ({ score, className, showIcon = true }: RankTitleBadgeProps) => {
  const rank = getRankTitle(score);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-semibold",
        rank.bg, rank.border, rank.color,
        rank.animation,
        className,
      )}
    >
      {showIcon && <span className="rank-title-icon">{rank.icon}</span>}
      {rank.label}
    </span>
  );
};

export default RankTitleBadge;
