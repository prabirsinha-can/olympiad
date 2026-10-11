// Shared helpers for the question generators.
// Each generator pushes questions into easy / medium / hard lists. The pool is built with a fixed seed,
// so the same 300 questions per subject exist on every load; which 10 a child sees is random per run.
// A question is { d, q, o, e, v, qv, k }: o[0] is the right answer, d is "easy" | "medium" | "hard".

let R = Math.random;
function seeded(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
const pick = a => a[Math.floor(R() * a.length)];
const mix = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickN = (a, n) => mix(a).slice(0, n);
const N = v => Number(v).toLocaleString("en-IN");
const cap1 = s => s[0].toUpperCase() + s.slice(1);

// Numeric options: the answer plus three distinct, non-negative near misses.
function nums(ans, extra = [], fmt = N) {
  const out = [ans], seen = new Set([ans]);
  const tryAdd = c => { if (out.length < 4 && Number.isInteger(c) && c >= 0 && !seen.has(c)) { seen.add(c); out.push(c); } };
  extra.forEach(tryAdd);
  const step = ans >= 1000 ? 100 : ans >= 100 ? 10 : 1;
  [1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 20, -20].forEach(k => tryAdd(ans + k * step));
  return out.map(fmt);
}
// Word options: the answer plus three others from a pool (excluding anything in `not`).
function words(ans, pool, not = []) {
  const bad = new Set([ans, ...not].map(s => String(s).toLowerCase()));
  const uniq = [...new Set(pool)].filter(w => !bad.has(String(w).toLowerCase()));
  return [ans, ...pickN(uniq, 3)];
}

const G = { 1: {}, 4: {} };   // G[grade][subject] = generator(add)
function buildPool(grade, subj, hand, target = { easy: 120, medium: 120, hard: 60 }) {
  R = seeded(grade * 1000 + subj.length * 97 + subj.charCodeAt(0));
  const tiers = { easy: [], medium: [], hard: [] }, keys = new Set();
  const add = (d, q) => {
    q.d = d; q.o = q.o.map(String);
    // Same question with the same answer counts once, even if the wrong options differ.
    const key = q.q + "|" + q.o[0] + "|" + JSON.stringify(q.qv || "");
    if (keys.has(key) || new Set(q.o).size !== 4) return;
    keys.add(key); tiers[d].push(q);
  };
  hand.forEach(q => add(q.d || "medium", q));
  const handN = { easy: tiers.easy.length, medium: tiers.medium.length, hard: tiers.hard.length };
  G[grade][subj]((d, q, o, e, v, extra) => add(d, Object.assign({ q, o, e, v }, extra || {})));
  const pool = { avail: { easy: tiers.easy.length, medium: tiers.medium.length, hard: tiers.hard.length } };
  for (const d in tiers) {
    const fixed = tiers[d].slice(0, handN[d]), rest = mix(tiers[d].slice(handN[d]));
    pool[d] = fixed.concat(rest).slice(0, target[d]).map((q, i) => ({ ...q, id: `${grade}${subj}${d[0]}${i}` }));
  }
  R = Math.random;
  return pool;
}
