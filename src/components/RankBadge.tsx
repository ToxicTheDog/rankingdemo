/**
 * RankBadge - Animated rank indicator component
 * 
 * Animations by rank:
 *   1st place → Gold particles floating around
 *   2nd place → Silver lightning/electric pulse
 *   3rd place → Bronze pulsing glow
 *   4th+ → Simple static badge
 * 
 * To customize:
 *   - Change RANK_CONFIG colors/labels below
 *   - Animation CSS is in index.css under "Rank Badge Animations"
 *   - Size controlled via `size` prop: "sm" | "md" | "lg"
 */

import { cn } from "@/lib/utils";

/* ── Easy-to-edit rank configuration ── */
export const RANK_CONFIG = {
  1: { label: "1", color: "text-yellow-500", bg: "bg-yellow-500/15", border: "border-yellow-500/40", glow: "shadow-yellow-500/30", animation: "rank-particles" },
  2: { label: "2", color: "text-slate-300", bg: "bg-slate-400/15", border: "border-slate-400/40", glow: "shadow-slate-400/30", animation: "rank-lightning" },
  3: { label: "3", color: "text-amber-600", bg: "bg-amber-600/15", border: "border-amber-600/40", glow: "shadow-amber-600/30", animation: "rank-pulse-glow" },
} as const;

const DEFAULT_RANK = { label: "", color: "text-muted-foreground", bg: "bg-muted", border: "border-border", glow: "", animation: "" };

type RankBadgeSize = "sm" | "md" | "lg";

const sizeMap: Record<RankBadgeSize, { wrapper: string; text: string; particleCount: number }> = {
  sm: { wrapper: "h-8 w-8", text: "text-xs", particleCount: 4 },
  md: { wrapper: "h-10 w-10", text: "text-sm", particleCount: 6 },
  lg: { wrapper: "h-14 w-14", text: "text-lg", particleCount: 8 },
};

interface RankBadgeProps {
  rank: number;
  size?: RankBadgeSize;
  className?: string;
}

const RankBadge = ({ rank, size = "md", className }: RankBadgeProps) => {
  const config = RANK_CONFIG[rank as keyof typeof RANK_CONFIG] || { ...DEFAULT_RANK, label: String(rank) };
  const sizeConfig = sizeMap[size];

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Glow ring for top 3 */}
      {rank <= 3 && (
        <div className={cn(
          "absolute inset-0 rounded-full opacity-60",
          config.animation === "rank-pulse-glow" && "animate-rank-pulse-glow",
          config.glow && `shadow-lg ${config.glow}`,
        )} />
      )}

      {/* Main badge circle */}
      <div className={cn(
        "relative z-10 flex items-center justify-center rounded-full border-2 font-bold",
        sizeConfig.wrapper, sizeConfig.text,
        config.bg, config.border, config.color,
      )}>
        {config.label || rank}
      </div>

      {/* Rank 1: Floating particles */}
      {rank === 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {Array.from({ length: sizeConfig.particleCount }).map((_, i) => (
            <span
              key={i}
              className="rank-particle absolute rounded-full bg-yellow-400"
              style={{
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                left: "50%",
                top: "50%",
                animationDelay: `${i * (2 / sizeConfig.particleCount)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Rank 2: Lightning bolts */}
      {rank === 2 && (
        <div className="absolute inset-[-4px] z-20 pointer-events-none">
          {[0, 90, 180, 270].map((deg) => (
            <span
              key={deg}
              className="rank-lightning-bolt absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${deg}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RankBadge;
