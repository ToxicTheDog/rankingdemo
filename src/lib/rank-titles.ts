/**
 * RANK TITLE SYSTEM
 * 
 * Rank titles are assigned based on user score.
 * Each title has a label, color, and animation class.
 * 
 * 🎨 TO CUSTOMIZE:
 *   - Change thresholds: adjust `minScore` values
 *   - Change labels: edit `label` strings
 *   - Change colors: edit tailwind classes in `color` and `bg`
 *   - Change animations: edit `animation` class names (defined in index.css)
 *   - Add new ranks: add entries to RANK_TITLES array (keep sorted by minScore DESC)
 */

export interface RankTitleConfig {
  label: string;
  minScore: number;
  color: string;       // text color class
  bg: string;          // background class
  border: string;      // border class
  animation: string;   // CSS animation class (defined in index.css)
  icon: string;        // emoji or symbol
}

/* ── Sorted highest → lowest. First match wins. ── */
export const RANK_TITLES: RankTitleConfig[] = [
  { label: "Champion",  minScore: 95, color: "text-yellow-400",  bg: "bg-yellow-400/15", border: "border-yellow-400/40", animation: "rank-title-champion",  icon: "👑" },
  { label: "Destroyer",  minScore: 90, color: "text-red-500",     bg: "bg-red-500/15",    border: "border-red-500/40",    animation: "rank-title-destroyer",  icon: "🔥" },
  { label: "Goddess",   minScore: 85, color: "text-purple-400",  bg: "bg-purple-400/15", border: "border-purple-400/40", animation: "rank-title-goddess",   icon: "✨" },
  { label: "Master",    minScore: 75, color: "text-blue-400",    bg: "bg-blue-400/15",   border: "border-blue-400/40",   animation: "rank-title-master",    icon: "⚡" },
  { label: "VIP",       minScore: 60, color: "text-gold",        bg: "bg-gold/15",       border: "border-gold/40",       animation: "rank-title-vip",       icon: "💎" },
  { label: "Elite",     minScore: 40, color: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/40", animation: "rank-title-elite",   icon: "🏆" },
  { label: "Beginner",  minScore: 0,  color: "text-muted-foreground", bg: "bg-muted",    border: "border-border",        animation: "",                     icon: "🌱" },
];

/** Get the rank title config for a given score */
export function getRankTitle(score: number): RankTitleConfig {
  return RANK_TITLES.find((r) => score >= r.minScore) || RANK_TITLES[RANK_TITLES.length - 1];
}
