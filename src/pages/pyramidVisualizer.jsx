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
const RANK_IDX = Object.fromEntries(RANK_KEYS.map((k, i) => [k, i])); // O(1) lookup umesto indexOf
const TOP_RANK = "diamond";
const DIAMOND_B = 5;
const MAX_ITER = 20;

// ─── RANK PARTICLE KONFIGURACIJA ─────────────────────────────────────────────
// Particle animacije SAMO za diamond i presidental — ostali su preskupi za 600 čvorova
const RANK_CFG = {
  none: null,
  rising: null,
  teamLeader: null,
  golden: null,
  silver: null,
  platinum: null,
  elite: null,
  presidental: { type: "burst", count: 10, color: "#f472b6" },
  diamond: { type: "triOrbit", count: 14, color: "#c084fc" },
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
    // cx/cy = centar NODE-a unutar canvas-a (canvas je veći za PAD sa svake strane)
    const PAD_C = 36;
    const cx = PAD_C + NW / 2, cy = PAD_C + NH / 2;
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

  const PAD = 36;
  const CW = NW + PAD * 2, CH = NH + PAD * 2;
  return (
    <foreignObject
      x={x - PAD} y={y - PAD}
      width={CW} height={CH}
      style={{ overflow: "visible", pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        width={CW} height={CH}
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
  const i = RANK_IDX[cur] ?? -1;
  return i >= 0 && i < RANK_KEYS.length - 1 ? RANK_KEYS[i + 1] : null;
}

// Per-child diferencijal: bonus = Σ max(0, myPct - childPct) × subtotal(child)
function runBonusPass(childrenOf, roots, ptsOf, rankOf) {
  const results = new Map(), subtotals = new Map();
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

      let subPts = myPts;
      for (const cid of children) subPts += subtotals.get(cid);
      subtotals.set(id, subPts);

      let bonus = 0;
      const diamondChildren = [], childBreakdown = [];
      for (const cid of children) {
        const cRank = rankOf.get(cid), cPct = RANKS[cRank]?.bonusPct ?? 0;
        const cSub = subtotals.get(cid);
        if (myRank === TOP_RANK && cRank === TOP_RANK) {
          const b = (DIAMOND_B / 100) * cSub;
          bonus += b;
          diamondChildren.push({ id: cid, subtotal: cSub, bonus: b });
          childBreakdown.push({ id: cid, cRank, cPct, cSub, diff: DIAMOND_B, earned: Math.round(b * 10000) / 10000, isDiamond: true });
        } else {
          const diff = Math.max(0, myPct - cPct), b = (diff / 100) * cSub;
          bonus += b;
          childBreakdown.push({ id: cid, cRank, cPct, cSub, diff, earned: Math.round(b * 10000) / 10000, isDiamond: false });
        }
      }

      results.set(id, {
        subtotalPoints: subPts,
        bonusPoints: Math.round(bonus * 10000) / 10000,
        childBreakdown, diamondChildren,
      });
    }
  }
  return results;
}

function computeBonuses(users) {
  const childrenOf = new Map(), ptsOf = new Map(), parentOf = new Map(), roots = [];
  for (const u of users) {
    childrenOf.set(u.id, []);
    ptsOf.set(u.id, u.directPoints ?? 0);
    parentOf.set(u.id, u.invitedBy ?? null);
  }
  for (const u of users) {
    if (u.invitedBy && childrenOf.has(u.invitedBy)) childrenOf.get(u.invitedBy).push(u.id);
    else roots.push(u.id);
  }

  const rankOf = new Map();
  for (const u of users) rankOf.set(u.id, assignRank(u.directPoints ?? 0));

  // BFS top-down: dete ne sme biti viši rang od roditelja
  function applyRankCap() {
    const queue = [...roots];
    while (queue.length > 0) {
      const id = queue.shift();
      const pid = parentOf.get(id);
      if (pid && rankOf.has(pid)) {
        const pi = RANK_IDX[rankOf.get(pid)];
        const ci = RANK_IDX[rankOf.get(id)];
        if (ci > pi) rankOf.set(id, rankOf.get(pid));
      }
      for (const cid of childrenOf.get(id)) queue.push(cid);
    }
  }

  let iteration = 0, passResults;

  while (iteration < MAX_ITER) {
    iteration++;
    applyRankCap();
    passResults = runBonusPass(childrenOf, roots, ptsOf, rankOf);
    // Rank = assignRank(subtotalPoints) — zbir cele mreže
    let changed = false;
    for (const u of users) {
      const r = passResults.get(u.id);
      const subtotal = r?.subtotalPoints ?? (u.directPoints ?? 0);
      const rawIdx = RANK_IDX[assignRank(subtotal)];
      const pid = parentOf.get(u.id);
      const capIdx = pid && rankOf.has(pid) ? RANK_IDX[rankOf.get(pid)] : RANK_KEYS.length - 1;
      const newRank = RANK_KEYS[Math.min(rawIdx, capIdx)];
      if (newRank !== rankOf.get(u.id)) { rankOf.set(u.id, newRank); changed = true; }
    }
    if (!changed) break;
  }

  const enriched = new Map();
  for (const u of users) {
    const r = passResults.get(u.id);
    const subtotal = r?.subtotalPoints ?? (u.directPoints ?? 0);
    const bonusPts = r?.bonusPoints ?? 0;
    const myRank = rankOf.get(u.id);
    const pid = parentOf.get(u.id);
    const rawRank = assignRank(subtotal);
    const cappedByParent = rawRank !== myRank && pid != null;
    const next = getNextRank(myRank);
    const curMin = RANKS[myRank]?.minPts ?? 0;
    const nextMin = next ? (RANKS[next]?.minPts ?? 0) : subtotal;
    const ptsToNext = next ? Math.max(0, nextMin - subtotal) : 0;
    const progress = next ? Math.min(1, (subtotal - curMin) / Math.max(1, nextMin - curMin)) : 1;

    enriched.set(u.id, {
      rank: myRank, rankPct: RANKS[myRank]?.bonusPct ?? 0, rankMinPts: curMin,
      username: u.username ?? u.id,
      directPoints: u.directPoints ?? 0,
      subtotalPoints: subtotal,
      bonusPoints: bonusPts,
      childBreakdown: r?.childBreakdown ?? [],
      diamondChildren: r?.diamondChildren ?? [],
      nextRank: next, nextRankLabel: next ? RANKS[next]?.label : null,
      nextRankMinPts: next ? nextMin : null,
      ptsToNextRank: Math.round(ptsToNext * 100) / 100,
      progress,
      cappedByParent,
      parentRank: pid ? rankOf.get(pid) : null,
      rawRankIfUncapped: cappedByParent ? rawRank : null,
    });
  }

  return { results: enriched, rankOf, childrenOf, roots, iterations: iteration };
}

// ─── PODRAZUMEVANI KORISNICI ──────────────────────────────────────────────────
const DEFAULT_USERS = [
  { id: "alice", username: "Alice", directPoints: 4800, invitedBy: null },
  { id: "bob", username: "Bob", directPoints: 3400, invitedBy: "alice" },
  { id: "carol", username: "Carol", directPoints: 1100, invitedBy: "alice" },
  { id: "dave", username: "Dave", directPoints: 2200, invitedBy: "alice" },
  { id: "mike", username: "Mike", directPoints: 570, invitedBy: "bob" },
  { id: "sarah", username: "Sarah", directPoints: 280, invitedBy: "bob" },
  { id: "tom", username: "Tom", directPoints: 900, invitedBy: "bob" },
  { id: "eve", username: "Eve", directPoints: 100, invitedBy: "carol" },
  { id: "ivan", username: "Ivan", directPoints: 450, invitedBy: "carol" },
  { id: "frank", username: "Frank", directPoints: 60, invitedBy: "mike" },
  { id: "grace", username: "Grace", directPoints: 200, invitedBy: "mike" },
  { id: "henry", username: "Henry", directPoints: 80, invitedBy: "sarah" },
  { id: "irene", username: "Irene", directPoints: 150, invitedBy: "dave" },
  { id: "jack", username: "Jack", directPoints: 700, invitedBy: "dave" },
  { id: "kate", username: "Kate", directPoints: 30, invitedBy: "frank" },
  { id: "liam", username: "Liam", directPoints: 120, invitedBy: "frank" },
  { id: "mia", username: "Mia", directPoints: 90, invitedBy: "grace" },
  { id: "noah", username: "Noah", directPoints: 55, invitedBy: "tom" },
  { id: "olivia", username: "Olivia", directPoints: 310, invitedBy: "jack" },
  { id: "peter", username: "Peter", directPoints: 40, invitedBy: "jack" },
];

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const NW = 190, NH = 72, HGAP = 56, VGAP = 12;

function buildSubtree(id, childrenOf) {
  var ch = (childrenOf.get(id) || []).map(function (c) { return buildSubtree(c, childrenOf); });
  var h = NH;
  if (ch.length) {
    h = 0;
    for (var i = 0; i < ch.length; i++) h += ch[i].h + (i > 0 ? VGAP : 0);
    if (h < NH) h = NH;
  }
  return { id: id, h: h, children: ch };
}

function flattenSubtree(node, col, top, nodes, edges) {
  var cx = col * (NW + HGAP);
  var cy = top + (node.h - NH) / 2;
  nodes.push({ id: node.id, x: cx, y: cy });
  var childTop = top;
  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i];
    var ccx = (col + 1) * (NW + HGAP);
    var ccy = childTop + (child.h - NH) / 2;
    edges.push({ x1: cx + NW, y1: cy + NH / 2, x2: ccx, y2: ccy + NH / 2 });
    flattenSubtree(child, col + 1, childTop, nodes, edges);
    childTop += child.h + VGAP;
  }
}

function buildLayout(roots, childrenOf) {
  var allNodes = [], allEdges = [];
  var offsetY = 0;
  for (var i = 0; i < roots.length; i++) {
    var tree = buildSubtree(roots[i], childrenOf);
    flattenSubtree(tree, 0, offsetY, allNodes, allEdges);
    offsetY += tree.h + NH * 1.5;
  }
  var maxX = 0, maxY = 0;
  for (var j = 0; j < allNodes.length; j++) {
    if (allNodes[j].x > maxX) maxX = allNodes[j].x;
    if (allNodes[j].y > maxY) maxY = allNodes[j].y;
  }
  return { nodes: allNodes, edges: allEdges, cW: maxX + NW + 60, cH: maxY + NH + 60 };
}

// ─── NODE KOMPONENTA ──────────────────────────────────────────────────────────
function NodeCard(props) {
  var x = props.x, y = props.y, id = props.id;
  var results = props.results, rankOf = props.rankOf;
  var selected = props.selected, onSelect = props.onSelect;
  var users = props.users, highlightedIds = props.highlightedIds;

  var myRank = rankOf.get(id) || "none";
  var rank = RANKS[myRank] || RANKS.none;
  var b = results.get(id);
  var u = null;
  for (var i = 0; i < users.length; i++) { if (users[i].id === id) { u = users[i]; break; } }
  var name = u ? (u.username || u.id) : id;
  var disp = name.length > 14 ? name.slice(0, 13) + "..." : name;
  var isSel = selected === id;
  var hl = highlightedIds ? highlightedIds.has(id) : false;
  var bonus = b ? b.bonusPoints : 0;
  var sub = b ? b.subtotalPoints : 0;
  var prog = b ? b.progress : 0;
  var direct = b ? b.directPoints : 0;
  var isCapped = b ? b.cappedByParent : false;

  return (
    <g onClick={function (e) { e.stopPropagation(); onSelect(id); }} style={{ cursor: "pointer" }}>
      {(myRank === "diamond" || myRank === "presidental") && (
        <rect x={x - 8} y={y - 8} width={NW + 16} height={NH + 16} rx={14}
          fill={rank.color}
          style={{ opacity: myRank === "diamond" ? 0.25 : 0.15, filter: "blur(" + (myRank === "diamond" ? 14 : 9) + "px)" }} />
      )}
      {hl && !isSel && (
        <rect x={x - 3} y={y - 3} width={NW + 6} height={NH + 6} rx={11}
          fill="none" stroke="#f6c90e" strokeWidth={2} />
      )}
      {isSel && (
        <rect x={x - 3} y={y - 3} width={NW + 6} height={NH + 6} rx={11}
          fill={rank.color} style={{ opacity: 0.08 }} />
      )}
      {isSel && (
        <rect x={x - 3} y={y - 3} width={NW + 6} height={NH + 6} rx={11}
          fill="none" stroke={rank.color} strokeWidth={2} />
      )}
      <rect x={x} y={y} width={NW} height={NH} rx={8}
        fill="#0d1117"
        stroke={hl ? "#f6c90e66" : isSel ? rank.color : "#1e2a3a"}
        strokeWidth={isSel ? 1.5 : 1} />
      {/* Leva traka */}
      <rect x={x} y={y + 8} width={3} height={NH - 16} rx={1.5} fill={rank.color} />
      {/* Ikonice */}
      {myRank === "diamond"
        ? <rect x={x + 10} y={y + 14} width={9} height={9} rx={1} fill={rank.color} opacity={0.9}
          transform={"rotate(45," + (x + 14.5) + "," + (y + 18.5) + ")"} />
        : <circle cx={x + 14} cy={y + 18} r={4} fill={rank.color} opacity={0.85} />
      }
      {/* Ime */}
      <text x={x + 26} y={y + 20} fill={hl ? "#f6c90e" : "#e6edf3"} fontSize={12} fontWeight="bold" fontFamily="monospace">{disp}</text>
      {/* Rang */}
      <text x={x + 26} y={y + 32} fill={rank.color} fontSize={8} fontFamily="monospace" opacity={0.9}>
        {rank.label} {rank.bonusPct}%{isCapped ? " ⚠" : ""}
      </text>
      {/* Direktni / Mreža */}
      <text x={x + 26} y={y + 44} fill="#3a4555" fontSize={8} fontFamily="monospace">
        {"dir: " + direct + "  mreza: " + sub.toLocaleString()}
      </text>
      {/* Bonus */}
      <text x={x + NW - 8} y={y + 32} fill={bonus > 0 ? "#3fb950" : "#30363d"} fontSize={11}
        fontWeight="bold" fontFamily="monospace" textAnchor="end">
        {"+" + bonus}
      </text>
      {/* Progres bara */}
      <rect x={x + 4} y={y + NH - 9} width={NW - 8} height={3} rx={1.5} fill="#1c2128" />
      {prog > 0 && (
        <rect x={x + 4} y={y + NH - 9} width={Math.max(0, (NW - 8) * prog)} height={3} rx={1.5}
          fill={b && b.nextRank && RANKS[b.nextRank] ? RANKS[b.nextRank].color : rank.color} opacity={0.75} />
      )}
    </g>
  );
}

// ─── EDGES ────────────────────────────────────────────────────────────────────
function EdgesLayer(props) {
  var edges = props.edges;
  return (
    <g>
      {edges.map(function (e, i) {
        var mx = (e.x1 + e.x2) / 2;
        return (
          <path key={i}
            d={"M" + e.x1 + "," + e.y1 + " C" + mx + "," + e.y1 + " " + mx + "," + e.y2 + " " + e.x2 + "," + e.y2}
            fill="none" stroke="#1e2d40" strokeWidth={1.5} />
        );
      })}
    </g>
  );
}

// ─── INSPEKTOR ────────────────────────────────────────────────────────────────
function Inspector(props) {
  var id = props.id, results = props.results, users = props.users;
  var onUpdatePts = props.onUpdatePts, onRemove = props.onRemove;

  if (!id) {
    return (
      <div style={{ padding: 20, color: "#30363d", fontSize: 11, textAlign: "center", paddingTop: 50 }}>
        Klikni na cvor za detalje
      </div>
    );
  }

  var b = results.get(id);
  var u = null;
  for (var i = 0; i < users.length; i++) { if (users[i].id === id) { u = users[i]; break; } }
  if (!b || !u) return null;

  var rank = RANKS[b.rank] || RANKS.none;
  var selRank = rank;

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #21262d", paddingBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, color: rank.color, letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>Inspektor</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#e6edf3" }}>{u.username || u.id}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: rank.color, fontWeight: 700 }}>{rank.label}</div>
            <div style={{ fontSize: 9, color: "#484f58" }}>{rank.bonusPct}% bonus</div>
          </div>
        </div>
      </div>

      {/* Bodovi */}
      <div style={{ background: "#080e17", borderRadius: 8, padding: 10 }}>
        <IRow label="Rang %" val={rank.bonusPct + "%"} color={rank.color} />
        <IRow label="Maks % ispod" val={(b.cappedByParent ? b.parentRank ? (RANKS[b.parentRank] ? RANKS[b.parentRank].bonusPct : "?") + "%" : "—" : "—")} />
        <IRow label="Efektivni %" val={rank.bonusPct + "%"} color={rank.color} />
        <div style={{ borderTop: "1px solid #161b22", margin: "7px 0" }} />
        <IRow label="Direktni poeni" val={b.directPoints} />
        <IRow label="Poeni podstabla" val={b.subtotalPoints.toLocaleString()} color={rank.color} big />
        <IRow label="Zaradjena bonus" val={"+" + b.bonusPoints} color="#3fb950" big />
      </div>

      {/* Uredi poene */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="number"
          defaultValue={u.directPoints}
          key={id}
          onBlur={function (e) { onUpdatePts(id, e.target.value); }}
          style={{ flex: 1, background: "#080e17", border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3", fontFamily: "monospace", fontSize: 12, padding: "6px 10px" }}
        />
        <button onClick={function () { onRemove(id); }}
          style={{ padding: "6px 12px", background: "#3d0000", border: "1px solid #7f1d1d", borderRadius: 6, color: "#f87171", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>
          Ukloni
        </button>
      </div>

      {/* Progres */}
      {b.nextRank && RANKS[b.nextRank] && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#484f58", marginBottom: 4 }}>
            <span>{rank.label}</span>
            <span style={{ color: RANKS[b.nextRank].color }}>{b.nextRankLabel} (jos {b.ptsToNextRank})</span>
          </div>
          <div style={{ background: "#1c2128", borderRadius: 3, height: 5, overflow: "hidden" }}>
            <div style={{ width: (b.progress * 100) + "%", height: "100%", background: RANKS[b.nextRank].color, borderRadius: 3 }} />
          </div>
        </div>
      )}
      {!b.nextRank && (
        <div style={{ textAlign: "center", fontSize: 11, color: rank.color }}>Maksimalni rang!</div>
      )}

      {/* Child breakdown */}
      {b.childBreakdown && b.childBreakdown.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            Zarada po deci ({rank.bonusPct}% rank)
          </div>
          {b.childBreakdown.map(function (c) {
            var cu = null;
            for (var i = 0; i < users.length; i++) { if (users[i].id === c.id) { cu = users[i]; break; } }
            var cc = RANKS[c.cRank] || RANKS.none;
            return (
              <div key={c.id} style={{ background: "#080e17", borderRadius: 6, padding: "6px 9px", marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ color: cc.color, fontSize: 10, fontWeight: 700 }}>
                    {cu ? (cu.username || cu.id) : c.id}{c.isDiamond ? " 💎" : ""}
                  </span>
                  <span style={{ color: "#3fb950", fontSize: 11, fontWeight: 800 }}>+{c.earned}</span>
                </div>
                <div style={{ fontSize: 9, color: "#484f58" }}>
                  mreza: {c.cSub.toLocaleString()} &nbsp;·&nbsp;
                  {c.isDiamond
                    ? "tantijema 5%"
                    : (rank.bonusPct + "%-" + c.cPct + "%=" + c.diff + "%")
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IRow(props) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
      <span style={{ fontSize: 10, color: "#484f58" }}>{props.label}</span>
      <span style={{ fontSize: props.big ? 14 : 12, fontWeight: props.big ? 800 : 600, color: props.color || "#e6edf3" }}>{props.val}</span>
    </div>
  );
}

// ─── DODAJ FORMA ──────────────────────────────────────────────────────────────
function AddForm(props) {
  var users = props.users, results = props.results, onAdd = props.onAdd;
  var [form, setForm] = useState({ id: "", pts: "", parent: "" });

  var previewRank = form.pts ? assignRank(parseInt(form.pts) || 0) : null;
  var previewRankObj = previewRank ? RANKS[previewRank] : null;

  function handleAdd() {
    var id = form.id.trim().toLowerCase();
    if (!id) return;
    for (var i = 0; i < users.length; i++) { if (users[i].id === id) return; }
    onAdd({ id: id, username: form.id.trim(), directPoints: parseInt(form.pts) || 0, invitedBy: form.parent || null });
    setForm({ id: "", pts: "", parent: "" });
  }

  var IS = { background: "#080e17", border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3", fontFamily: "monospace", fontSize: 11, padding: "6px 9px", width: "100%" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Dodaj clana</div>
      <input placeholder="Korisnicko ime" value={form.id}
        onChange={function (e) { setForm(function (f) { return Object.assign({}, f, { id: e.target.value }); }); }}
        style={IS} />
      <select value={form.parent}
        onChange={function (e) { setForm(function (f) { return Object.assign({}, f, { parent: e.target.value }); }); }}
        style={Object.assign({}, IS, { cursor: "pointer" })}>
        <option value="">Bez roditelja (koren)</option>
        {users.map(function (u) {
          var r = results.get(u.id);
          return <option key={u.id} value={u.id}>{u.username || u.id} ({r ? r.subtotalPoints : 0} pts)</option>;
        })}
      </select>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="number" placeholder="Direktni poeni" value={form.pts}
          onChange={function (e) { setForm(function (f) { return Object.assign({}, f, { pts: e.target.value }); }); }}
          style={Object.assign({}, IS, { flex: 1 })} />
        {previewRankObj && (
          <span style={{ fontSize: 9, color: previewRankObj.color, whiteSpace: "nowrap" }}>{previewRankObj.label}</span>
        )}
      </div>
      <button onClick={handleAdd}
        style={{ padding: "8px", background: form.id ? "#0d4a1f" : "#111", border: "1px solid " + (form.id ? "#1a7a35" : "#21262d"), borderRadius: 7, color: form.id ? "#3fb950" : "#484f58", fontSize: 12, fontWeight: 700, cursor: form.id ? "pointer" : "default", fontFamily: "monospace" }}>
        + Dodaj
      </button>
    </div>
  );
}

// ─── RANK STATS ───────────────────────────────────────────────────────────────
function RankStats(props) {
  var results = props.results;
  var counts = {};
  RANK_KEYS.forEach(function (k) { counts[k] = 0; });
  results.forEach(function (r) { if (counts[r.rank] !== undefined) counts[r.rank]++; });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>Rangovi</div>
      {[...RANK_KEYS].reverse().map(function (k) {
        var rk = RANKS[k];
        if (!counts[k]) return null;
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: k === TOP_RANK ? 1 : "50%", background: rk.color, transform: k === TOP_RANK ? "rotate(45deg)" : "none", flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: rk.color, flex: 1 }}>{rk.label}</span>
            <span style={{ fontSize: 10, color: "#e6edf3", fontWeight: 700 }}>{rk.bonusPct}%</span>
            <span style={{ fontSize: 9, color: "#484f58", width: 20, textAlign: "right" }}>{counts[k]}</span>
            {k === TOP_RANK && (
              <span style={{ fontSize: 8, color: "#7c3aed" }}>+5▼</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── USER TREE VIEW ───────────────────────────────────────────────────────────
// Gradi layout samo za podstablo odabranog korisnika + pretke
function buildUserTreeLayout(focusId, childrenOf, parentOf) {
  // Prikupi podstablo
  var subtreeIds = {};
  subtreeIds[focusId] = true;
  var q = [focusId];
  while (q.length) {
    var cur = q.shift();
    var ch = childrenOf.get(cur) || [];
    for (var i = 0; i < ch.length; i++) {
      subtreeIds[ch[i]] = true;
      q.push(ch[i]);
    }
  }

  // Preci
  var ancestors = [];
  var p = parentOf.get(focusId);
  while (p) { ancestors.unshift(p); p = parentOf.get(p); }

  // Privremeni childrenOf samo za podstablo
  var subChildren = new Map();
  var ids = Object.keys(subtreeIds);
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var orig = childrenOf.get(id) || [];
    subChildren.set(id, orig.filter(function (c) { return subtreeIds[c]; }));
  }

  // Layout podstabla počev od kolone ancestors.length
  var subNodes = [], subEdges = [];
  var tree = buildSubtree(focusId, subChildren);
  flattenSubtree(tree, ancestors.length, 0, subNodes, subEdges);

  // Nađi Y fokus čvora
  var focusNode = null;
  for (var i = 0; i < subNodes.length; i++) {
    if (subNodes[i].id === focusId) { focusNode = subNodes[i]; break; }
  }
  var ancY = focusNode ? focusNode.y + (focusNode ? 0 : 0) : 0;

  // Dodaj pretke u linearni lanac lijevo
  for (var i = 0; i < ancestors.length; i++) {
    var ax = i * (NW + HGAP);
    var ay = ancY;
    subNodes.push({ id: ancestors[i], x: ax, y: ay });
    if (i > 0) {
      subEdges.push({ x1: (i - 1) * (NW + HGAP) + NW, y1: ay + NH / 2, x2: ax, y2: ay + NH / 2 });
    }
  }
  // Edge od zadnjeg pretka do focus čvora
  if (ancestors.length > 0 && focusNode) {
    subEdges.push({
      x1: (ancestors.length - 1) * (NW + HGAP) + NW, y1: ancY + NH / 2,
      x2: focusNode.x, y2: focusNode.y + NH / 2,
    });
  }

  var maxX = 0, maxY = 0;
  for (var i = 0; i < subNodes.length; i++) {
    if (subNodes[i].x > maxX) maxX = subNodes[i].x;
    if (subNodes[i].y > maxY) maxY = subNodes[i].y;
  }

  return { nodes: subNodes, edges: subEdges, cW: maxX + NW + 60, cH: maxY + NH + 60 };
}

// ─── CANVAS ───────────────────────────────────────────────────────────────────
function Canvas(props) {
  var nodes = props.nodes, edges = props.edges, cW = props.cW, cH = props.cH;
  var results = props.results, rankOf = props.rankOf;
  var selected = props.selected, onSelect = props.onSelect;
  var highlightedIds = props.highlightedIds, users = props.users;

  var [tx, setTx] = useState({ x: 40, y: 40, s: 1 });
  var [vpW, setVpW] = useState(1200);
  var [vpH, setVpH] = useState(700);
  var vpRef = useRef(null);
  var panRef = useRef(null);
  var fittedKey = useRef(null);

  // Resize observer
  useEffect(function () {
    if (!vpRef.current) return;
    function upd() {
      if (vpRef.current) {
        var r = vpRef.current.getBoundingClientRect();
        setVpW(r.width);
        setVpH(r.height);
      }
    }
    upd();
    window.addEventListener("resize", upd);
    return function () { window.removeEventListener("resize", upd); };
  }, []);

  // Auto-fit kad se promijene nodes
  var fitKey = nodes.length + "_" + cW + "_" + cH;
  useEffect(function () {
    if (!cW || !cH || !vpW || !vpH) return;
    if (fittedKey.current === fitKey) return;
    fittedKey.current = fitKey;
    var s = Math.min(vpW / (cW + 80), vpH / (cH + 80), 1.2);
    s = Math.max(0.05, s);
    setTx({ x: (vpW - cW * s) / 2, y: 30, s: s });
  }, [fitKey, vpW, vpH]);

  // Wheel
  useEffect(function () {
    var el = vpRef.current;
    if (!el) return;
    function onWheel(e) {
      e.preventDefault();
      var f = e.deltaY < 0 ? 1.12 : 0.89;
      var rect = el.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      setTx(function (t) {
        return { x: mx - (mx - t.x) * f, y: my - (my - t.y) * f, s: Math.max(0.05, Math.min(5, t.s * f)) };
      });
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return function () { el.removeEventListener("wheel", onWheel); };
  }, []);

  function onMouseDown(e) {
    if (e.button !== 0) return;
    panRef.current = { x: e.clientX - tx.x, y: e.clientY - tx.y };
  }
  function onMouseMove(e) {
    var pan = panRef.current;
    if (!pan) return;
    setTx(function (t) { return { s: t.s, x: e.clientX - pan.x, y: e.clientY - pan.y }; });
  }
  function onMouseUp() { panRef.current = null; }

  // Virtualizacija
  var safeS = tx.s || 1;
  var MARGIN = 300;
  var vx0 = (-tx.x - MARGIN) / safeS, vy0 = (-tx.y - MARGIN) / safeS;
  var vx1 = (-tx.x + vpW + MARGIN) / safeS, vy1 = (-tx.y + vpH + MARGIN) / safeS;
  var vNodes = nodes.filter(function (n) { return n.x + NW >= vx0 && n.x <= vx1 && n.y + NH >= vy0 && n.y <= vy1; });
  var vEdges = edges.filter(function (e) {
    return (e.x1 >= vx0 && e.x1 <= vx1 && e.y1 >= vy0 && e.y1 <= vy1) ||
      (e.x2 >= vx0 && e.x2 <= vx1 && e.y2 >= vy0 && e.y2 <= vy1);
  });

  function fitView() {
    var s = Math.min(vpW / (cW + 80), vpH / (cH + 80), 1.2);
    s = Math.max(0.05, s);
    setTx({ x: (vpW - cW * s) / 2, y: 30, s: s });
  }

  var btnStyle = { width: 34, height: 34, background: "#0d1117", border: "1px solid #21262d", borderRadius: 7, color: "#8b949e", fontSize: 16, cursor: "pointer", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div ref={vpRef}
      style={{ flex: 1, overflow: "hidden", position: "relative", cursor: "grab" }}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onClick={function () { onSelect(null); }}>

      {/* Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"
            patternTransform={"translate(" + (tx.x % 40) + " " + (tx.y % 40) + ") scale(" + tx.s + ")"}>
            <path d="M40 0L0 0 0 40" fill="none" stroke="#0a0e15" strokeWidth={0.8} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Čvorovi */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        onClick={function () { onSelect(null); }}>
        <g transform={"translate(" + tx.x + "," + tx.y + ") scale(" + tx.s + ")"}>
          <EdgesLayer edges={vEdges} />
          {vNodes.map(function (n) {
            return (
              <NodeCard key={n.id} x={n.x} y={n.y} id={n.id}
                results={results} rankOf={rankOf}
                selected={selected} onSelect={onSelect}
                users={users} highlightedIds={highlightedIds} />
            );
          })}
        </g>
      </svg>

      {/* Zoom */}
      <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", flexDirection: "column", gap: 5 }}>
        <button style={btnStyle} onClick={function () { setTx(function (t) { return { s: Math.min(5, t.s * 1.25), x: t.x, y: t.y }; }); }}>+</button>
        <button style={btnStyle} onClick={function () { setTx(function (t) { return { s: Math.max(0.05, t.s * 0.8), x: t.x, y: t.y }; }); }}>−</button>
        <button style={btnStyle} onClick={fitView}>⊡</button>
        <button style={btnStyle} onClick={function () { setTx({ x: 40, y: 40, s: 1 }); }}>↺</button>
        <div style={{ textAlign: "center", fontSize: 9, color: "#30363d" }}>{Math.round(safeS * 100)}%</div>
      </div>

      <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 9, color: "#21262d" }}>
        Skrol = zoom · Vuci = pomeraj · Klikni = detalji · {vNodes.length}/{nodes.length}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  var [users, setUsers] = useState(DEFAULT_USERS);
  var [selected, setSelected] = useState(null);
  var [searchQ, setSearchQ] = useState("");
  var [userSearch, setUserSearch] = useState("");
  var [focusId, setFocusId] = useState(null);
  var [showSugg, setShowSugg] = useState(false);

  // Engine
  var computed = useMemo(function () {
    return computeBonuses(users);
  }, [users]);
  var results = computed.results;
  var rankOf = computed.rankOf;
  var childrenOf = computed.childrenOf;
  var roots = computed.roots;
  var iterations = computed.iterations;

  // ParentOf mapa
  var parentOf = useMemo(function () {
    var m = new Map();
    for (var i = 0; i < users.length; i++) m.set(users[i].id, users[i].invitedBy || null);
    return m;
  }, [users]);

  var totalBonus = useMemo(function () {
    var t = 0;
    results.forEach(function (r) { t += r.bonusPoints; });
    return t;
  }, [results]);

  // Full network layout
  var fullLayout = useMemo(function () {
    return buildLayout(roots, childrenOf);
  }, [roots, childrenOf]);

  // User tree layout
  var userLayout = useMemo(function () {
    if (!focusId) return null;
    return buildUserTreeLayout(focusId, childrenOf, parentOf);
  }, [focusId, childrenOf, parentOf]);

  // Suggestions za user search
  var suggestions = useMemo(function () {
    var q = userSearch.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return users.filter(function (u) {
      return (u.username || u.id).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
  }, [userSearch, users]);

  // Global search highlight
  var highlightedIds = useMemo(function () {
    var q = searchQ.trim().toLowerCase();
    if (!q) return new Set();
    var s = new Set();
    for (var i = 0; i < users.length; i++) {
      if ((users[i].username || users[i].id).toLowerCase().indexOf(q) !== -1) s.add(users[i].id);
    }
    return s;
  }, [searchQ, users]);

  // Aktivan layout
  var layout = userLayout || fullLayout;

  // CRUD
  function handleAdd(u) {
    setUsers(function (prev) { return prev.concat([u]); });
  }
  function handleRemove(id) {
    setUsers(function (prev) { return prev.filter(function (u) { return u.id !== id && u.invitedBy !== id; }); });
    if (selected === id) setSelected(null);
  }
  function handleUpdatePts(id, val) {
    setUsers(function (prev) {
      return prev.map(function (u) { return u.id === id ? Object.assign({}, u, { directPoints: parseInt(val) || 0 }) : u; });
    });
  }

  return (
    <div style={{ height: "100vh", background: "#010409", fontFamily: "monospace", color: "#e6edf3", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        input, select { outline: none; }
        input:focus, select:focus { border-color: #3fb950 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #21262d; border-radius: 4px; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* ── NAVBAR ── */}
      <div style={{ flexShrink: 0, borderBottom: "1px solid #161b22", background: "#0d1117", padding: "0 16px", height: 44, display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 2, textTransform: "uppercase" }}>Network Marketing Sistem</div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.5 }}>Mapa Mreze</div>
        </div>

        {/* Diamond pravilo info */}
        <div style={{ marginLeft: 12, fontSize: 9, color: "#7c3aed", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#c084fc" }}>◆</span>
          <span><b>Diamond pravilo:</b> fiksnih 5% izmedju dva Diamond</span>
        </div>

        <div style={{ marginLeft: "auto", marginRight: 12 }}>
          <button onClick={function () { window.location.replace("/admin"); }}
            style={{ backgroundColor: "rgba(13, 17, 23, 0.1)", borderRadius: 6, color: "#e6edf3", fontFamily: "monospace", fontSize: 11, padding: "5px 10px", width: "fit-content" }}>
            Dashboard
          </button>
        </div>

        {/* User search */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input
            value={userSearch}
            onChange={function (e) { setUserSearch(e.target.value); setShowSugg(true); if (!e.target.value) setFocusId(null); }}
            onFocus={function () { setShowSugg(true); }}
            placeholder="Trazi korisnika..."
            style={{ background: "#010409", border: "1px solid #30363d", borderRadius: 6, color: "#e6edf3", fontFamily: "monospace", fontSize: 11, padding: "5px 10px", width: 200 }}
          />
          {focusId && (
            <button onClick={function () { setFocusId(null); setUserSearch(""); }}
              style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#484f58", cursor: "pointer", fontSize: 13, padding: 0 }}>
              ✕
            </button>
          )}
          {showSugg && suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0d1117", border: "1px solid #21262d", borderRadius: 7, zIndex: 100, marginTop: 3, overflow: "hidden" }}>
              {suggestions.map(function (u) {
                var r = results.get(u.id);
                var rk = r ? (RANKS[r.rank] || RANKS.none) : RANKS.none;
                return (
                  <div key={u.id}
                    style={{ padding: "7px 11px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #161b22" }}
                    onMouseDown={function () {
                      setFocusId(u.id);
                      setUserSearch(u.username || u.id);
                      setSelected(u.id);
                      setShowSugg(false);
                    }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{u.username || u.id}</span>
                    <span style={{ fontSize: 9, color: rk.color }}>{rk.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global highlight search */}
        <input
          value={searchQ}
          onChange={function (e) { setSearchQ(e.target.value); }}
          placeholder="Oznaci cvorove..."
          style={{ background: "#010409", border: "1px solid #21262d", borderRadius: 6, color: "#e6edf3", fontFamily: "monospace", fontSize: 11, padding: "5px 10px", width: 160 }}
        />

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", borderLeft: "1px solid #21262d", paddingLeft: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, color: "#484f58", letterSpacing: 1 }}>UKUPNI BONUS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#3fb950" }}>{totalBonus.toFixed(2) + " pts"}</div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Canvas */}
        <Canvas
          nodes={layout.nodes} edges={layout.edges}
          cW={layout.cW} cH={layout.cH}
          results={results} rankOf={rankOf}
          selected={selected} onSelect={function (id) { setSelected(id); setShowSugg(false); }}
          highlightedIds={highlightedIds} users={users} />

        {/* Desni panel */}
        <div style={{ width: 280, flexShrink: 0, borderLeft: "1px solid #161b22", background: "#080e17", overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Inspektor */}
          <div style={{ borderBottom: "1px solid #161b22" }}>
            <Inspector
              id={selected} results={results} users={users}
              onUpdatePts={handleUpdatePts} onRemove={handleRemove} />
          </div>

          {/* Dodaj forma */}
          <div style={{ padding: 14, borderBottom: "1px solid #161b22" }}>
            <AddForm users={users} results={results} onAdd={handleAdd} />
          </div>

          {/* Rank stats */}
          <div style={{ padding: 14, borderBottom: "1px solid #161b22" }}>
            <RankStats results={results} />
          </div>

          {/* Global stats */}
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 9, color: "#484f58", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Statistika mreze</div>
            <IRow label="Ukupno clanova" val={users.length} />
            <IRow label="Direktni poeni" val={users.reduce(function (s, u) { return s + (u.directPoints || 0); }, 0).toLocaleString()} />
            <IRow label="Iteracije" val={iterations} />
          </div>
        </div>
      </div>
    </div>
  );
}
