import { useState, useMemo, useRef, useCallback, useEffect, memo } from "react";

// ─── KONFIGURACIJA ────────────────────────────────────────────────────────────
const RANKS = {
  none: { label: "Bez ranga", bonusPct: 0, minPts: 0, color: "#4a5568", dim: "#1a1f2e" },
  rising: { label: "Rising Leader", bonusPct: 10, minPts: 75, color: "#68d391", dim: "#0f2a1a" },
  teamLeader: { label: "Team Leader", bonusPct: 15, minPts: 150, color: "#4dc0b5", dim: "#0a2020" },
  golden: { label: "Golden Leader", bonusPct: 20, minPts: 300, color: "#f6c90e", dim: "#221e00" },
  silver: { label: "Silver Leader", bonusPct: 25, minPts: 600, color: "#94a3b8", dim: "#151d2a" },
  platinum: { label: "Platinum Leader", bonusPct: 30, minPts: 1200, color: "#7dd3fc", dim: "#061520" },
  elite: { label: "Elite Leader", bonusPct: 35, minPts: 2000, color: "#f97316", dim: "#200d00" },
  presidental: { label: "Presidental Leader", bonusPct: 40, minPts: 3500, color: "#f472b6", dim: "#200a15" },
  diamond: { label: "Diamond Leader", bonusPct: 45, minPts: 5000, color: "#c084fc", dim: "#130820" },
};
const RANK_KEYS = Object.keys(RANKS);
const RANK_TIERS = Object.entries(RANKS).filter(([, v]) => v.minPts > 0).sort(([, a], [, b]) => b.minPts - a.minPts);
const TOP_RANK = "diamond";
const DIAMOND_B = 5;
const MAX_ITER = 20;

// ─── RANK PARTICLE KONFIGURACIJA ─────────────────────────────────────────────
// Svaki rang ima jedinstven vizuelni jezik:
//   rising      → sitne čestice koje plutaju gore (mehurići)
//   teamLeader  → 2 orbite u suprotnim smerovima
//   golden      → zlatne zvezde koje osciluju po veličini
//   silver      → srebrni bljesak (sparkle) koji svetluca
//   platinum    → rotirajući prsten sa tačkama
//   elite       → narandžasti plamenovi koji se penju
//   presidental → eksplozija zvezda iz centra
//   diamond     → 3 ukrštene orbite + veći dijamanti
const RANK_CFG = {
  none: null,
  rising: { type: "bubbles", count: 7, color: "#68d391" },
  teamLeader: { type: "dualOrbit", count: 8, color: "#4dc0b5" },
  golden: { type: "stars", count: 8, color: "#f6c90e" },
  silver: { type: "sparkle", count: 10, color: "#94a3b8" },
  platinum: { type: "ringDots", count: 10, color: "#7dd3fc" },
  elite: { type: "flames", count: 8, color: "#f97316" },
  presidental: { type: "burst", count: 12, color: "#f472b6" },
  diamond: { type: "triOrbit", count: 16, color: "#c084fc" },
};

const RankParticles = memo(({ x, y, rank }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const cfg = RANK_CFG[rank];
    if (!cfg) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const col = cfg.color;

    // --- Helper: hex to rgba ---
    function rgba(hex, a) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    // --- Inicijalizacija čestica po tipu ---
    let pts = [];

    if (cfg.type === "bubbles") {
      pts = Array.from({ length: cfg.count }, () => ({
        x: cx + (Math.random() - 0.5) * (NW * 0.7),
        y: cy + (Math.random() - 0.5) * (NH * 0.4) + NH * 0.1,
        vy: -(0.3 + Math.random() * 0.5),
        r: 2 + Math.random() * 3,
        alpha: 0.5 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        baseX: 0,
      }));
      pts.forEach(p => { p.baseX = p.x; });
    } else if (cfg.type === "dualOrbit") {
      pts = Array.from({ length: cfg.count }, (_, i) => ({
        i, angle: (i / cfg.count) * Math.PI * 2,
        orbit: i % 2 === 0 ? 1 : -1,
        r: i % 2 === 0 ? 32 : 22,
        size: 2.5 + (i % 2) * 1.5,
        alpha: 0.7,
        phase: Math.random() * Math.PI * 2,
      }));
    } else if (cfg.type === "stars") {
      pts = Array.from({ length: cfg.count }, (_, i) => ({
        angle: (i / cfg.count) * Math.PI * 2,
        r: 28 + Math.sin(i) * 10,
        size: 3.5 + Math.random() * 2,
        alpha: 0.6 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.004,
        pulse: Math.random() * Math.PI * 2,
      }));
    } else if (cfg.type === "sparkle") {
      pts = Array.from({ length: cfg.count }, (_, i) => ({
        angle: (i / cfg.count) * Math.PI * 2 + Math.random() * 0.5,
        r: 20 + Math.random() * 22,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.006,
        twinkleSpeed: 1.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    } else if (cfg.type === "ringDots") {
      pts = Array.from({ length: cfg.count }, (_, i) => ({
        angle: (i / cfg.count) * Math.PI * 2,
        size: 2.5,
        alpha: 0.75,
        phase: i / cfg.count * Math.PI * 2,
      }));
    } else if (cfg.type === "flames") {
      pts = Array.from({ length: cfg.count }, () => ({
        x: cx + (Math.random() - 0.5) * NW * 0.6,
        y: cy + NH * 0.25,
        vy: -(0.6 + Math.random() * 1.0),
        vx: (Math.random() - 0.5) * 0.3,
        life: Math.random(),
        maxLife: 0.6 + Math.random() * 0.4,
        size: 3 + Math.random() * 4,
        alpha: 0.7 + Math.random() * 0.3,
      }));
    } else if (cfg.type === "burst") {
      pts = Array.from({ length: cfg.count }, (_, i) => ({
        angle: (i / cfg.count) * Math.PI * 2,
        r: 10,
        targetR: 28 + Math.random() * 16,
        size: 3 + Math.random() * 2,
        alpha: 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.008,
        expanding: true,
      }));
    } else if (cfg.type === "triOrbit") {
      // 3 orbite: unutrašnja (dijamanti), srednja (dots), spoljna (dijamanti)
      pts = Array.from({ length: cfg.count }, (_, i) => ({
        orbitIdx: i % 3,
        angle: (i / cfg.count) * Math.PI * 2,
        r: [18, 30, 42][i % 3],
        speed: [0.018, -0.012, 0.009][i % 3],
        size: [2.5, 2, 3.5][i % 3],
        alpha: [0.8, 0.6, 0.9][i % 3],
        phase: Math.random() * Math.PI * 2,
        shape: [1, 0, 1][i % 3], // 1=diamond, 0=dot
      }));
    }

    // --- Draw helpers ---
    function drawStar(ctx, sx, sy, size) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const a2 = ((i * 4 + 2) * Math.PI / 5) - Math.PI / 2;
        if (i === 0) ctx.moveTo(sx + Math.cos(a) * size, sy + Math.sin(a) * size);
        else ctx.lineTo(sx + Math.cos(a) * size, sy + Math.sin(a) * size);
        ctx.lineTo(sx + Math.cos(a2) * size * 0.38, sy + Math.sin(a2) * size * 0.38);
      }
      ctx.closePath();
      ctx.fill();
    }
    function drawDiamond(ctx, sx, sy, size) {
      ctx.beginPath();
      ctx.moveTo(sx, sy - size * 1.4);
      ctx.lineTo(sx + size, sy);
      ctx.lineTo(sx, sy + size * 1.4);
      ctx.lineTo(sx - size, sy);
      ctx.closePath();
      ctx.fill();
    }
    function drawSparkle(ctx, sx, sy, size) {
      // 4-pointed cross sparkle
      for (let arm = 0; arm < 4; arm++) {
        const a = arm * Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(a) * size * 2, sy + Math.sin(a) * size * 2);
        ctx.lineWidth = size * 0.6;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    let t = 0;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;
      ctx.fillStyle = col;
      ctx.strokeStyle = col;

      if (cfg.type === "bubbles") {
        for (const p of pts) {
          p.y += p.vy;
          p.x = p.baseX + Math.sin(t * 1.5 + p.phase) * 4;
          if (p.y < cy - NH * 0.6) { p.y = cy + NH * 0.25; p.x = p.baseX = cx + (Math.random() - 0.5) * NW * 0.65; }
          const fade = Math.max(0, (cy - p.y) / (NH * 0.7));
          ctx.globalAlpha = p.alpha * fade;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          // Hollow bubble look
          ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
          ctx.globalAlpha = p.alpha * fade * 0.25;
          ctx.fillStyle = col; ctx.fill();
        }
      } else if (cfg.type === "dualOrbit") {
        for (const p of pts) {
          p.angle += 0.012 * p.orbit;
          const rx = p.orbit === 1 ? p.r : p.r * 1.1;
          const ry = p.r * 0.45;
          const px = cx + Math.cos(p.angle) * rx;
          const py = cy + Math.sin(p.angle) * ry;
          const flicker = 0.5 + 0.5 * Math.sin(t * 3 + p.phase);
          ctx.globalAlpha = p.alpha * (0.5 + 0.5 * flicker);
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fill();
          // Tail
          const tailAngle = p.angle - 0.15 * p.orbit;
          const tx = cx + Math.cos(tailAngle) * rx;
          const ty = cy + Math.sin(tailAngle) * ry;
          ctx.globalAlpha = p.alpha * 0.25;
          ctx.beginPath(); ctx.arc(tx, ty, p.size * 0.6, 0, Math.PI * 2); ctx.fill();
        }
      } else if (cfg.type === "stars") {
        for (const p of pts) {
          p.angle += p.speed;
          const px = cx + Math.cos(p.angle) * p.r;
          const py = cy + Math.sin(p.angle) * p.r * 0.5;
          const sz = p.size * (0.7 + 0.3 * Math.sin(t * 2 + p.pulse));
          ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.abs(Math.sin(t + p.phase)));
          ctx.fillStyle = col;
          drawStar(ctx, px, py, sz);
          // Glow dot below star
          ctx.globalAlpha = 0.2;
          ctx.beginPath(); ctx.arc(px, py, sz * 1.8, 0, Math.PI * 2); ctx.fill();
        }
      } else if (cfg.type === "sparkle") {
        for (const p of pts) {
          p.angle += p.speed;
          p.twinklePhase += p.twinkleSpeed * 0.016;
          const px = cx + Math.cos(p.angle) * p.r;
          const py = cy + Math.sin(p.angle) * p.r * 0.5;
          const tw = (Math.sin(p.twinklePhase) + 1) / 2;
          ctx.globalAlpha = tw * 0.85;
          ctx.fillStyle = col; ctx.strokeStyle = col;
          drawSparkle(ctx, px, py, p.size * (0.5 + tw * 0.5));
        }
      } else if (cfg.type === "ringDots") {
        // Rotirajući prsten sa svetlucavim tačkama
        const ringAngle = t * 0.6;
        ctx.globalAlpha = 0.25;
        ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
        for (const p of pts) {
          const a = p.angle + ringAngle;
          const px = cx + Math.cos(a) * 35;
          const py = cy + Math.sin(a) * 35 * 0.5;
          const bright = (Math.sin(a * 2 + t * 2) + 1) / 2;
          ctx.globalAlpha = 0.3 + bright * 0.6;
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(px, py, p.size * (0.7 + bright * 0.6), 0, Math.PI * 2); ctx.fill();
        }
      } else if (cfg.type === "flames") {
        for (const p of pts) {
          p.y += p.vy;
          p.x += p.vx;
          p.life += 0.02;
          if (p.life > p.maxLife) {
            p.life = 0;
            p.x = cx + (Math.random() - 0.5) * NW * 0.55;
            p.y = cy + NH * 0.25;
            p.vy = -(0.6 + Math.random() * 1.0);
            p.vx = (Math.random() - 0.5) * 0.3;
          }
          const prog = p.life / p.maxLife;
          const fadeA = prog < 0.3 ? prog / 0.3 : 1 - (prog - 0.3) / 0.7;
          // color: orange → yellow → transparent
          const r = 249, g = Math.round(115 + 140 * prog), b = 22;
          ctx.globalAlpha = fadeA * 0.8;
          ctx.fillStyle = `rgb(${r},${Math.min(255, g)},${b})`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * (1 - prog * 0.5), p.size * 1.5 * (1 - prog * 0.3), 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (cfg.type === "burst") {
        for (const p of pts) {
          if (p.expanding) {
            p.r += 0.5;
            if (p.r >= p.targetR) { p.expanding = false; }
          } else {
            p.r -= 0.3;
            if (p.r <= 10) { p.r = 10; p.targetR = 28 + Math.random() * 16; p.expanding = true; }
          }
          p.angle += p.speed;
          const px = cx + Math.cos(p.angle) * p.r;
          const py = cy + Math.sin(p.angle) * p.r * 0.55;
          const flicker = 0.5 + 0.5 * Math.sin(t * 4 + p.phase);
          ctx.globalAlpha = p.alpha * flicker;
          ctx.fillStyle = col;
          drawStar(ctx, px, py, p.size * (0.7 + flicker * 0.5));
        }
      } else if (cfg.type === "triOrbit") {
        const speeds = [0.018, -0.012, 0.009];
        for (const p of pts) {
          p.angle += speeds[p.orbitIdx];
          const px = cx + Math.cos(p.angle) * p.r;
          const py = cy + Math.sin(p.angle) * p.r * 0.5;
          const pulse = 0.6 + 0.4 * Math.sin(t * 3 + p.phase);
          ctx.globalAlpha = p.alpha * pulse;
          ctx.fillStyle = col;
          if (p.shape === 1) {
            drawDiamond(ctx, px, py, p.size);
            // Inner glow
            ctx.globalAlpha = p.alpha * pulse * 0.3;
            ctx.beginPath(); ctx.arc(px, py, p.size * 2, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [rank]);

  const cfg = RANK_CFG[rank];
  if (!cfg) return null;

  const PAD = 52;
  return (
    <foreignObject
      x={x - PAD} y={y - PAD}
      width={NW + PAD * 2} height={NH + PAD * 2}
      style={{ overflow: "visible", pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        width={NW + PAD * 2}
        height={NH + PAD * 2}
        style={{ display: "block", pointerEvents: "none" }}
      />
    </foreignObject>
  );
});

// ─── ENGINE ───────────────────────────────────────────────────────────────────
function assignRank(totalPts) {
  for (const [key, r] of RANK_TIERS) if (totalPts >= r.minPts) return key;
  return "none";
}
function getNextRank(cur) {
  const i = RANK_KEYS.indexOf(cur);
  return i >= 0 && i < RANK_KEYS.length - 1 ? RANK_KEYS[i + 1] : null;
}

function runBonusPass(childrenOf, roots, ptsOf, rankOf) {
  const results = new Map(), subtotals = new Map(), maxPctBelow = new Map();
  const stack = roots.map(id => ({ id, phase: 0 }));

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const { id, phase } = frame;
    if (phase === 0) {
      frame.phase = 1;
      const ch = childrenOf.get(id);
      for (let i = ch.length - 1; i >= 0; i--) stack.push({ id: ch[i], phase: 0 });
    } else {
      stack.pop();
      const myRank = rankOf.get(id), myPct = RANKS[myRank]?.bonusPct ?? 0;
      const myPts = ptsOf.get(id), children = childrenOf.get(id);

      let subPts = myPts, maxPctChild = 0;
      for (const cid of children) {
        subPts += subtotals.get(cid);
        maxPctChild = Math.max(maxPctChild, maxPctBelow.get(cid));
      }
      subtotals.set(id, subPts);

      let effectivePct = 0, bonusPoints = 0, bonusRule = "differential";
      let diamondChildBonus = 0;
      const diamondChildren = [];

      if (myRank === TOP_RANK) {
        let ndPts = myPts, maxND = 0;
        for (const cid of children) {
          if (rankOf.get(cid) === TOP_RANK) {
            const b = (DIAMOND_B / 100) * subtotals.get(cid);
            diamondChildBonus += b;
            diamondChildren.push({ id: cid, pts: subtotals.get(cid), bonus: b });
          } else { ndPts += subtotals.get(cid); maxND = Math.max(maxND, maxPctBelow.get(cid)); }
        }
        effectivePct = Math.max(0, myPct - maxND);
        bonusPoints = (effectivePct / 100) * ndPts + diamondChildBonus;
        bonusRule = diamondChildren.length > 0 ? "diamond-split" : "differential";
      } else {
        effectivePct = Math.max(0, myPct - maxPctChild);
        bonusPoints = (effectivePct / 100) * subPts;
      }

      results.set(id, {
        subtotalPoints: subPts, maxPctBelowMe: maxPctChild,
        myEffectivePct: effectivePct,
        bonusPoints: Math.round(bonusPoints * 10000) / 10000,
        bonusRule, diamondChildren,
      });
      maxPctBelow.set(id, Math.max(myPct, maxPctChild));
    }
  }
  return results;
}

function computeBonuses(users) {
  const childrenOf = new Map(), ptsOf = new Map(), roots = [];
  for (const u of users) {
    childrenOf.set(u.id, []);
    ptsOf.set(u.id, u.directPoints ?? 0);
  }
  for (const u of users) {
    if (u.invitedBy && childrenOf.has(u.invitedBy)) childrenOf.get(u.invitedBy).push(u.id);
    else roots.push(u.id);
  }

  // Početni rangovi = samo direktni poeni
  const rankOf = new Map();
  for (const u of users) rankOf.set(u.id, assignRank(u.directPoints ?? 0));

  let iteration = 0, passResults;

  // Ponavljaj dok se rangovi ne stabilizuju
  while (iteration < MAX_ITER) {
    iteration++;
    passResults = runBonusPass(childrenOf, roots, ptsOf, rankOf);
    let changed = false;
    for (const u of users) {
      const r = passResults.get(u.id);
      const total = (u.directPoints ?? 0) + (r?.bonusPoints ?? 0);
      const newRank = assignRank(total);
      if (newRank !== rankOf.get(u.id)) { rankOf.set(u.id, newRank); changed = true; }
    }
    if (!changed) break;
  }

  // Obogaćujemo rezultate
  const enriched = new Map();
  for (const u of users) {
    const r = passResults.get(u.id);
    const totalPts = (u.directPoints ?? 0) + (r?.bonusPoints ?? 0);
    const myRank = rankOf.get(u.id);
    const next = getNextRank(myRank);
    const curMin = RANKS[myRank]?.minPts ?? 0;
    const nextMin = next ? (RANKS[next]?.minPts ?? 0) : totalPts;
    const ptsToNext = next ? Math.max(0, nextMin - totalPts) : 0;
    const progress = next ? Math.min(1, (totalPts - curMin) / Math.max(1, nextMin - curMin)) : 1;

    enriched.set(u.id, {
      rank: myRank, rankPct: RANKS[myRank]?.bonusPct ?? 0, rankMinPts: curMin,
      directPoints: u.directPoints ?? 0,
      bonusPoints: r?.bonusPoints ?? 0,
      totalPtsForRank: Math.round(totalPts * 100) / 100,
      subtotalPoints: r?.subtotalPoints ?? 0,
      maxPctBelowMe: r?.maxPctBelowMe ?? 0,
      myEffectivePct: r?.myEffectivePct ?? 0,
      bonusRule: r?.bonusRule ?? "differential",
      diamondChildren: r?.diamondChildren ?? [],
      nextRank: next, nextRankLabel: next ? RANKS[next]?.label : null,
      nextRankMinPts: next ? nextMin : null,
      ptsToNextRank: Math.round(ptsToNext * 100) / 100,
      progress,
    });
  }

  return { results: enriched, rankOf, childrenOf, roots, iterations: iteration };
}

// ─── PODRAZUMEVANI PODACI ─────────────────────────────────────────────────────
const DEFAULT_USERS = [
  { id: "alice", directPoints: 4800, invitedBy: null },
  { id: "bob", directPoints: 3400, invitedBy: "alice" },
  { id: "carol", directPoints: 1100, invitedBy: "alice" },
  { id: "mike", directPoints: 570, invitedBy: "bob" },
  { id: "sarah", directPoints: 280, invitedBy: "bob" },
  { id: "eve", directPoints: 100, invitedBy: "carol" },
  { id: "frank", directPoints: 60, invitedBy: "mike" },
];

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const NW = 240, NH = 86, HGAP = 70, VGAP = 16;

function treeLayout(id, childrenOf) {
  const ch = childrenOf.get(id) ?? [];
  if (!ch.length) return { id, subtreeH: NH, cy: NH / 2, children: [] };
  const cl = ch.map(c => treeLayout(c, childrenOf));
  let curY = 0;
  for (const c of cl) { c.y = curY; curY += c.subtreeH + VGAP; }
  const totalH = curY - VGAP;
  return { id, subtreeH: Math.max(NH, totalH), cy: totalH / 2, children: cl };
}

function flattenTree(node, absX, absY, nodes, edges) {
  const myY = absY + node.cy - NH / 2;
  nodes.push({ id: node.id, x: absX, y: myY });
  const childX = absX + NW + HGAP;
  for (const child of node.children) {
    const cAbsY = absY + node.cy - node.subtreeH / 2 + child.y;
    const cMY = cAbsY + child.cy;
    edges.push({ x1: absX + NW, y1: myY + NH / 2, x2: childX, y2: cMY });
    flattenTree(child, childX, cAbsY, nodes, edges);
  }
}

// ─── SVG ČVOR ─────────────────────────────────────────────────────────────────
function NodeRect({ x, y, id, rankOf, results, selected, onSelect }) {
  const myRank = rankOf.get(id) ?? "none";
  const rank = RANKS[myRank] ?? RANKS.none;
  const b = results.get(id);
  const isSel = selected === id;
  const isDia = myRank === TOP_RANK;
  const prog = b?.progress ?? 0;
  const bonus = b?.bonusPoints ?? 0;
  const total = b?.totalPtsForRank ?? 0;

  return (
    <g onClick={e => { e.stopPropagation(); onSelect(id); }} style={{ cursor: "pointer" }}>
      {/* Particle animacije po rangu */}
      <RankParticles x={x} y={y} rank={myRank} nodeW={NW} nodeH={NH} />

      {/* Animirani glow za sve rangove iznad none */}
      {myRank !== "none" && (
        <rect
          x={x - 8} y={y - 8} width={NW + 16} height={NH + 16} rx={17}
          fill={rank.color}
          className={`rank-glow-${myRank}`}
          style={{
            filter: `blur(${myRank === "diamond" ? 14 :
              myRank === "presidental" ? 11 :
                myRank === "elite" ? 10 :
                  myRank === "platinum" ? 9 :
                    myRank === "silver" ? 8 :
                      myRank === "golden" ? 9 :
                        myRank === "teamLeader" ? 7 : 6
              }px)`
          }}
        />
      )}
      {isSel && (
        <rect x={x - 4} y={y - 4} width={NW + 8} height={NH + 8} rx={14}
          fill="none" stroke={rank.color} strokeWidth={2} opacity={0.35}
          style={{ filter: "blur(6px)" }} />
      )}
      <rect x={x} y={y} width={NW} height={NH} rx={10}
        fill={isSel ? rank.dim : "#0d1117"}
        stroke={isSel ? rank.color : "#21262d"} strokeWidth={isSel ? 1.5 : 1} />

      {/* Leva traka */}
      <rect x={x} y={y + 10} width={3} height={NH - 20} rx={2} fill={rank.color} />

      {/* Ikonica */}
      {isDia
        ? <rect x={x + 13} y={y + 22} width={11} height={11} rx={2} fill={rank.color} opacity={0.9} transform={`rotate(45,${x + 18.5},${y + 27.5})`} />
        : <circle cx={x + 19} cy={y + 27} r={5} fill={rank.color} opacity={0.85} />}

      {/* Ime */}
      <text x={x + 34} y={y + 22} fill="#e6edf3" fontSize={13} fontWeight={700} fontFamily="monospace">
        {id.length > 15 ? id.slice(0, 15) + "…" : id}
      </text>

      {/* Rang */}
      <text x={x + 34} y={y + 37} fill={rank.color} fontSize={10} fontFamily="monospace" opacity={0.9}>
        {rank.label}  {rank.bonusPct}%
      </text>

      {/* Poeni: direktni + bonus = ukupno */}
      <text x={x + 34} y={y + 51} fill="#484f58" fontSize={9} fontFamily="monospace">
        {b?.directPoints ?? 0} + {bonus} = {total} pts
      </text>

      {/* Bonus (desno) */}
      <text x={x + NW - 10} y={y + 34} fill={bonus > 0 ? "#3fb950" : "#30363d"}
        fontSize={13} fontWeight={700} fontFamily="monospace" textAnchor="end">
        +{bonus}
      </text>

      {/* Progres bara */}
      <rect x={x + 8} y={y + NH - 13} width={NW - 16} height={4} rx={2} fill="#1c2128" />
      <rect x={x + 8} y={y + NH - 13} width={Math.max(0, (NW - 16) * prog)} height={4} rx={2}
        fill={b?.nextRank ? (RANKS[b.nextRank]?.color ?? rank.color) : rank.color} opacity={0.75} />
    </g>
  );
}

const IS = { background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: "7px 10px", color: "#e6edf3", fontSize: 12, fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ id: "", pts: "", parent: "" });
  const [transform, setTransform] = useState({ x: 40, y: 40, scale: 0.85 });
  const svgRef = useRef(null);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const { results, rankOf, childrenOf, roots, nodes, edges, canvasW, canvasH, iterations } = useMemo(() => {
    const { results, rankOf, childrenOf, roots, iterations } = computeBonuses(users);
    const allNodes = [], allEdges = [];
    let offsetY = 40;
    for (const rid of roots) {
      const layout = treeLayout(rid, childrenOf);
      flattenTree(layout, 40, offsetY, allNodes, allEdges);
      offsetY += layout.subtreeH + 80;
    }
    const cW = allNodes.length ? Math.max(...allNodes.map(n => n.x)) + NW + 60 : 600;
    const cH = allNodes.length ? Math.max(...allNodes.map(n => n.y)) + NH + 60 : 400;
    return { results, rankOf, childrenOf, roots, nodes: allNodes, edges: allEdges, canvasW: cW, canvasH: cH, iterations };
  }, [users]);

  const totalBonus = useMemo(() => { let t = 0; for (const r of results.values()) t += r.bonusPoints; return t; }, [results]);
  const sel = selected ? results.get(selected) : null;
  const selUser = selected ? users.find(u => u.id === selected) : null;
  const selRank = sel ? (RANKS[sel.rank] ?? RANKS.none) : null;

  // Pan
  const onMouseDown = useCallback(e => {
    if (e.target.closest("g")) return;
    isPanning.current = true; lastMouse.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = "grabbing";
  }, []);
  const onMouseMove = useCallback(e => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMouse.current.x, dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);
  const onMouseUp = useCallback(e => { isPanning.current = false; if (e.currentTarget) e.currentTarget.style.cursor = "grab"; }, []);

  // Zoom
  const onWheel = useCallback(e => {
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.12 : 0.89;
    setTransform(t => {
      const s = Math.min(2.5, Math.max(0.1, t.scale * f));
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { ...t, scale: s };
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      return { scale: s, x: mx - (mx - t.x) * (s / t.scale), y: my - (my - t.y) * (s / t.scale) };
    });
  }, []);
  useEffect(() => {
    const el = svgRef.current; if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const zoomTo = f => setTransform(t => ({ ...t, scale: Math.min(2.5, Math.max(0.1, t.scale * f)) }));
  const resetView = () => setTransform({ x: 40, y: 40, scale: 0.85 });
  const fitView = () => {
    const el = svgRef.current; if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const s = Math.min((width - 80) / canvasW, (height - 80) / canvasH, 1);
    setTransform({ x: 40, y: 40, scale: s });
  };

  const addUser = () => {
    const id = form.id.trim().toLowerCase();
    if (!id || users.find(u => u.id === id)) return;
    setUsers(u => [...u, { id, directPoints: parseInt(form.pts) || 0, invitedBy: form.parent || null }]);
    setForm({ id: "", pts: "", parent: "" });
  };
  const removeUser = id => { setUsers(u => u.filter(x => x.id !== id && x.invitedBy !== id)); if (selected === id) setSelected(null); };
  const updatePts = (id, val) => setUsers(u => u.map(x => x.id === id ? { ...x, directPoints: parseInt(val) || 0 } : x));

  const previewRank = form.pts ? assignRank(parseInt(form.pts) || 0) : null;

  return (
    <div style={{ height: "100vh", background: "#010409", fontFamily: "'IBM Plex Mono','Courier New',monospace", color: "#e6edf3", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        *{box-sizing:border-box}
        input,select{outline:none}
        input:focus,select:focus{border-color:#3fb950!important}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#21262d;border-radius:4px}

        @keyframes glow-rising      { 0%,100%{opacity:0.08} 50%{opacity:0.18} }
        @keyframes glow-teamLeader  { 0%,100%{opacity:0.09} 50%{opacity:0.22} }
        @keyframes glow-golden      { 0%,100%{opacity:0.12} 50%{opacity:0.32} }
        @keyframes glow-silver      { 0%,100%{opacity:0.10} 50%{opacity:0.24} }
        @keyframes glow-platinum    { 0%,100%{opacity:0.13;transform:scale(1)}    60%{opacity:0.30;transform:scale(1.01)} }
        @keyframes glow-elite       { 0%,100%{opacity:0.10} 40%{opacity:0.35} 80%{opacity:0.18} }
        @keyframes glow-presidental { 0%,100%{opacity:0.14} 50%{opacity:0.38} }
        @keyframes glow-diamond     { 0%,100%{opacity:0.18;transform:scale(1)} 50%{opacity:0.50;transform:scale(1.03)} }

        .rank-glow-rising      { animation: glow-rising      3.0s ease-in-out infinite; }
        .rank-glow-teamLeader  { animation: glow-teamLeader  2.6s ease-in-out infinite; }
        .rank-glow-golden      { animation: glow-golden      2.4s ease-in-out infinite; }
        .rank-glow-silver      { animation: glow-silver      2.8s ease-in-out infinite; }
        .rank-glow-platinum    { animation: glow-platinum    2.2s ease-in-out infinite; }
        .rank-glow-elite       { animation: glow-elite       1.6s ease-in-out infinite; }
        .rank-glow-presidental { animation: glow-presidental 2.0s ease-in-out infinite; }
        .rank-glow-diamond     { animation: glow-diamond     1.8s ease-in-out infinite; }
      `}</style>

      {/* ZAGLAVLJE */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", gap: 20, flexShrink: 0, background: "#0d1117" }}>
        {/* Nazad dugme */}
        <a href="/admin" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, color: "#8b949e", fontSize: 11, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "#3fb950"; e.currentTarget.style.color = "#e6edf3"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "#30363d"; e.currentTarget.style.color = "#8b949e"; }}>
          ← Nazad na početnu
        </a>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#3fb950", textTransform: "uppercase" }}>Network Marketing Sistem — v5</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#e6edf3" }}>Mapa Mreže · Iterativni Rang</div>
        </div>
        <div style={{ fontSize: 10, color: "#484f58", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ color: "#3fb950" }}>●</span> Stabilizovano za <span style={{ color: "#e6edf3", fontWeight: 700 }}>{iterations}</span> iteracija
        </div>
        <div style={{ fontSize: 10, color: "#8b949e", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#c084fc" }}>💎</span> Diamond→Diamond: fiksnih <span style={{ color: "#c084fc", fontWeight: 700 }}>5%</span>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 9, color: "#484f58", textTransform: "uppercase", letterSpacing: 2 }}>Ukupni bonusi</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#3fb950" }}>{totalBonus.toFixed(2)} pts</div>
        </div>
      </div>

      {/* LEGENDA */}
      <div style={{ padding: "7px 20px", borderBottom: "1px solid #21262d", background: "#0d1117", display: "flex", gap: 12, overflowX: "auto", flexShrink: 0, alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "#30363d", whiteSpace: "nowrap" }}>RANG (direktni+bonus ≥):</span>
        {RANK_KEYS.filter(k => k !== "none").map(k => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <div style={{ width: 6, height: 6, borderRadius: k === TOP_RANK ? 1 : "50%", background: RANKS[k].color, transform: k === TOP_RANK ? "rotate(45deg)" : "none", flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: RANKS[k].color }}>{RANKS[k].label}</span>
            <span style={{ fontSize: 9, color: "#30363d" }}>{RANKS[k].minPts}+</span>
            <span style={{ fontSize: 9, color: "#484f58" }}>({RANKS[k].bonusPct}%)</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 9, color: "#21262d", whiteSpace: "nowrap" }}>
          čvor: direktni + bonus = ukupno · ─ progres ka sledećem rangu
        </div>
      </div>

      {/* SADRŽAJ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* SVG MAPA */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <svg ref={svgRef} width="100%" height="100%"
            style={{ cursor: "grab", background: "#010409", display: "block" }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onClick={() => setSelected(null)}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"
                patternTransform={`translate(${transform.x % 40} ${transform.y % 40}) scale(${transform.scale})`}>
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0d1117" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
              {edges.map((e, i) => {
                const mx = (e.x1 + e.x2) / 2;
                return <path key={i} d={`M${e.x1} ${e.y1} C${mx} ${e.y1},${mx} ${e.y2},${e.x2} ${e.y2}`}
                  fill="none" stroke="#21262d" strokeWidth={1.5} />;
              })}
              {nodes.map(n => (
                <NodeRect key={n.id} x={n.x} y={n.y} id={n.id}
                  rankOf={rankOf} results={results}
                  selected={selected} onSelect={setSelected} />
              ))}
            </g>
          </svg>

          {/* Zoom */}
          <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            {[{ l: "+", a: () => zoomTo(1.25), t: "Uvećaj" }, { l: "−", a: () => zoomTo(0.8), t: "Umanji" }, { l: "⊡", a: fitView, t: "Uklopi sve" }, { l: "↺", a: resetView, t: "Resetuj" }].map(b => (
              <button key={b.l} onClick={b.a} title={b.t}
                style={{ width: 36, height: 36, background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}
                onMouseOver={e => e.currentTarget.style.borderColor = "#3fb950"}
                onMouseOut={e => e.currentTarget.style.borderColor = "#30363d"}>
                {b.l}
              </button>
            ))}
            <div style={{ fontSize: 10, color: "#484f58", textAlign: "center" }}>{Math.round(transform.scale * 100)}%</div>
          </div>
          <div style={{ position: "absolute", bottom: 20, left: 20, fontSize: 10, color: "#21262d" }}>
            Skrol = zoom · Vuci = pomeraj · Klikni = detalji
          </div>
        </div>

        {/* DESNI PANEL */}
        <div style={{ width: 285, borderLeft: "1px solid #21262d", background: "#0d1117", overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>

          {/* Inspektor */}
          {sel && selUser ? (
            <div style={{ background: "#161b22", border: `1.5px solid ${selRank.color}44`, borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: selRank.color, letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>Inspektor</div>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{selUser.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: selRank.color, fontWeight: 700 }}>{selRank.label}</div>
                  <div style={{ fontSize: 9, color: "#484f58" }}>{selRank.bonusPct}% bonus</div>
                </div>
              </div>

              {sel.bonusRule === "diamond-split" && (
                <div style={{ background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: 8, padding: "7px 10px", marginBottom: 10, fontSize: 10, color: "#c084fc" }}>
                  💎 Diamond pravilo aktivno
                  {sel.diamondChildren.map(dc => (
                    <div key={dc.id} style={{ marginTop: 3, color: "#a855f7" }}>· {dc.id}: 5% × {dc.pts}pts = +{dc.bonus.toFixed(2)}</div>
                  ))}
                </div>
              )}

              {/* Pregled poena */}
              <div style={{ background: "#0d1117", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#484f58" }}>Direktni poeni</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#e6edf3" }}>{sel.directPoints}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#484f58" }}>+ Bonus poeni</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#3fb950" }}>+{sel.bonusPoints}</span>
                </div>
                <div style={{ borderTop: "1px solid #21262d", paddingTop: 5, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#e6edf3", fontWeight: 700 }}>= Ukupno za rang</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: selRank.color }}>{sel.totalPtsForRank}</span>
                </div>
                <div style={{ fontSize: 9, color: "#30363d", marginTop: 4 }}>
                  Min za {selRank.label}: {sel.rankMinPts} pts
                </div>
              </div>

              {/* Bonus kalkulacija */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Kako se računa bonus</div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#484f58" }}>Tvoj rang %</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: selRank.color }}>{sel.rankPct}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#484f58" }}>
                    Max % ispod
                    <span style={{ display: "block", fontSize: 9, color: "#30363d" }}>
                      (najviši % već uzet od nekog ispod)
                    </span>
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f85149" }}>−{sel.maxPctBelowMe}%</span>
                </div>
                <div style={{ borderTop: "1px solid #21262d", paddingTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#e6edf3", fontWeight: 700 }}>
                    Efektivni %
                    <span style={{ display: "block", fontSize: 9, color: "#30363d", fontWeight: 400 }}>
                      ({sel.rankPct}% − {sel.maxPctBelowMe}% = {sel.myEffectivePct}%)
                    </span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#e3b341" }}>{sel.myEffectivePct}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#484f58" }}>Poeni podstabla</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#8b949e" }}>× {sel.subtotalPoints}</span>
                </div>
                <div style={{ borderTop: "1px solid #21262d", paddingTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#e6edf3", fontWeight: 700 }}>= Bonus</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#3fb950" }}>+{sel.bonusPoints}</span>
                </div>
              </div>

              {/* Progres ka sledećem rangu */}
              {sel.nextRank ? (
                <div style={{ borderTop: "1px solid #21262d", paddingTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#484f58" }}>Do: {sel.nextRankLabel}</span>
                    <span style={{ fontSize: 10, color: RANKS[sel.nextRank]?.color }}>još {sel.ptsToNextRank} pts</span>
                  </div>
                  <div style={{ background: "#21262d", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: RANKS[sel.nextRank]?.color, width: `${sel.progress * 100}%`, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                    <span style={{ fontSize: 9, color: "#30363d" }}>{sel.rankMinPts} pts</span>
                    <span style={{ fontSize: 9, color: "#30363d" }}>{sel.nextRankMinPts} pts</span>
                  </div>
                </div>
              ) : (
                <div style={{ borderTop: "1px solid #21262d", paddingTop: 10, textAlign: "center", fontSize: 11, color: "#c084fc" }}>
                  👑 Maksimalni rang dostignut!
                </div>
              )}

              {/* Uredi */}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #21262d", display: "flex", gap: 8 }}>
                <input type="number" key={selUser.id} defaultValue={selUser.directPoints}
                  onBlur={e => updatePts(selUser.id, e.target.value)}
                  placeholder="Direktni poeni" style={{ ...IS, flex: 1, background: "#0d1117" }} />
                <button onClick={() => removeUser(selUser.id)}
                  style={{ background: "rgba(248,81,73,0.1)", color: "#f85149", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 8, padding: "6px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  Ukloni
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, textAlign: "center", color: "#30363d", fontSize: 11 }}>
              Klikni čvor za detalje
            </div>
          )}

          {/* Dodaj člana */}
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Dodaj Člana</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input placeholder="Korisničko ime" value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addUser()}
                style={{ ...IS, background: "#0d1117" }} />
              <select value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} style={{ ...IS, background: "#0d1117" }}>
                <option value="">Bez roditelja (koren)</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.id} ({results.get(u.id)?.totalPtsForRank ?? 0} pts)</option>)}
              </select>
              <input type="number" placeholder="Direktni poeni" value={form.pts}
                onChange={e => setForm(f => ({ ...f, pts: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addUser()}
                style={{ ...IS, background: "#0d1117" }} />
              {/* Preview ranga */}
              {previewRank && (() => {
                const pr = RANKS[previewRank];
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", background: "#0d1117", border: `1px solid ${pr.color}44`, borderRadius: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: previewRank === TOP_RANK ? 1 : "50%", background: pr.color, flexShrink: 0, transform: previewRank === TOP_RANK ? "rotate(45deg)" : "none" }} />
                    <span style={{ fontSize: 10, color: pr.color }}>{pr.label} ({pr.bonusPct}%)</span>
                    <span style={{ fontSize: 9, color: "#484f58", marginLeft: "auto" }}>početni rang</span>
                  </div>
                );
              })()}
              <button onClick={addUser} style={{ background: "#238636", color: "#f0f6fc", border: "1px solid #2ea043", borderRadius: 8, padding: "8px 16px", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                + Dodaj
              </button>
            </div>
          </div>

          {/* Statistika */}
          <div style={{ background: "rgba(63,185,80,0.03)", border: "1px solid rgba(63,185,80,0.12)", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>Statistika</div>
            {[
              ["Ukupno članova", users.length, "#8b949e"],
              ["Direktnih poena", users.reduce((s, u) => s + (u.directPoints ?? 0), 0), "#8b949e"],
              ["Ukupni bonusi", totalBonus.toFixed(2), "#3fb950"],
              ["Iteracija", iterations, "#484f58"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#484f58" }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
