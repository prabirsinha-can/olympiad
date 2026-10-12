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

const G = { 1: {}, 4: {} };   // G[grade][subject] = generator(add): the earlier, gentler questions
const H = { 1: {}, 4: {} };   // H[grade][subject] = generator(add): Olympiad-level questions
const X = { 1: {}, 4: {} };   // X[grade][subject] = generator(add): challenge-level questions (the whole bank since 2026-10-12)
// After the "too easy" feedback the bank keeps only the earlier hard questions (as medium)
// and adds Olympiad-level ones (as hard). Earlier easy and medium questions are dropped.
const TIER = { easy: null, medium: null, hard: "medium", top: "hard" };
// The kids found even the Olympiad-level mix too easy, so when a challenge generator exists the bank is
// built from it alone: 300 challenge questions, all tagged "hard".
function buildPool(grade, subj, hand, target) {
  const xmode = !!X[grade][subj];
  target = target || (xmode ? { medium: 0, hard: 300 } : { medium: 60, hard: 240 });
  R = seeded(grade * 1000 + subj.length * 97 + subj.charCodeAt(0));
  const tiers = { medium: [], hard: [] }, keys = new Set();
  const add = (d, q) => {
    d = TIER[d]; if (!d) return;
    q.d = d; q.o = q.o.map(String);
    // Same question with the same answer counts once, even if the wrong options differ.
    const key = q.q + "|" + q.o[0] + "|" + JSON.stringify(q.qv || "");
    if (keys.has(key) || new Set(q.o).size !== 4) return;
    keys.add(key); tiers[d].push(q);
  };
  if (!xmode) hand.forEach(q => add(q.d || "medium", q));
  const emit = (d, q, o, e, v, extra) => add(d, Object.assign({ q, o, e, v }, extra || {}));
  if (xmode) X[grade][subj](emit);
  else { G[grade][subj](emit); if (H[grade][subj]) H[grade][subj](emit); }
  const pool = { avail: { medium: tiers.medium.length, hard: tiers.hard.length } };
  for (const d in tiers) pool[d] = mix(tiers[d]).slice(0, target[d]).map((q, i) => ({ ...q, id: `${grade}${subj}${d[0]}${i}` }));
  R = Math.random;
  return pool;
}

// ---------- Olympiad-format templates over fact tables ----------
const STATE_OPTS = ["Only (i)", "Only (ii)", "Both (i) and (ii)", "Neither (i) nor (ii)"];
// rows: [[left, right], ...]. Asks which pair is (or is not) correctly matched.
function matchQs(Q, rows, n, what, show = (l, r) => `${cap1(l)} – ${r}`) {
  const ok = (l, r) => rows.some(x => x[0] === l && x[1] === r);
  for (let k = 0; k < n; k++) {
    const four = pickN(rows, 4); if (four.length < 4 || new Set(four.map(x => x[0])).size < 4) continue;
    const not = k % 2 === 1;
    let ans, wrongs;
    if (!not) { ans = four[0]; wrongs = [1, 2, 3].map(i => [four[i][0], four[i % 3 + 1][1]]); if (wrongs.some(([l, r]) => ok(l, r))) continue; }
    else { ans = [four[0][0], four[1][1]]; if (ok(ans[0], ans[1])) continue; wrongs = [four[1], four[2], four[3]]; }
    const fix = four.map(x => show(x[0], x[1]));
    Q("top", not ? `Which pair is NOT correctly matched (${what})?` : `Which pair is correctly matched (${what})?`, [show(ans[0], ans[1]), ...wrongs.map(([l, r]) => show(l, r))],
      `The correct pairs are: ${fix.join("; ")}.${not ? ` So "${show(ans[0], ans[1])}" is the wrong match.` : ""}`, C(...four.map((x, i) => ["", show(x[0], x[1]), not && i === 0 ? `not ${four[1][1]}` : "", not ? i === 0 : i === 0])));
  }
}
// facts: [[true sentence, false sentence], ...]. Two statements; pick which are correct.
function stateQs(Q, facts, n) {
  for (let k = 0; k < n; k++) {
    const [a, b] = pickN(facts, 2); if (!b) return;
    const ta = R() < .5, tb = R() < .5, s1 = ta ? a[0] : a[1], s2 = tb ? b[0] : b[1];
    const ans = ta && tb ? STATE_OPTS[2] : ta ? STATE_OPTS[0] : tb ? STATE_OPTS[1] : STATE_OPTS[3];
    Q("top", `Read the two statements.\n(i) ${s1}\n(ii) ${s2}\nWhich of them is correct?`, [ans, ...STATE_OPTS.filter(x => x !== ans)],
      `(i) is ${ta ? "correct." : `wrong. The fact is: ${a[0]}`} (ii) is ${tb ? "correct." : `wrong. The fact is: ${b[0]}`}`, C(["", "(i)", ta ? "✓ correct" : "✗ wrong", ta], ["", "(ii)", tb ? "✓ correct" : "✗ wrong", tb]), { order: STATE_OPTS });
  }
}
const rowFacts = (rows, say) => rows.map(([l, r]) => { const w = pick(rows.filter(x => x[1] !== r && x[0] !== l)); return w ? [say(l, r), say(l, w[1])] : null; }).filter(Boolean);
// "A : B :: C : ?"
function analogyQs(Q, rows, n, rel) {
  const ok = (l, r) => rows.some(x => x[0] === l && x[1] === r);
  for (let k = 0; k < n; k++) {
    const [a, b] = pickN(rows, 2); if (!b || a[1] === b[1]) continue;
    const others = [...new Set(rows.map(x => x[1]))].filter(x => x !== b[1] && x !== a[1] && !ok(b[0], x));
    Q("top", `${cap1(a[0])} : ${a[1]} :: ${cap1(b[0])} : ___`, [b[1], a[1], ...pickN(others, 2)], `${rel(a[0], a[1])}. In the same way, ${rel(b[0], b[1]).replace(/^./, c => c.toLowerCase())}.`, F(["", `${a[0]} → ${a[1]}`, ""], ["", `${b[0]} → ${b[1]}`, "same link", 1]));
  }
}
// groups: { label: [items] }. Three from one group and one from another.
function oddQs(Q, groups, n, intro = "Which is the odd one out?") {
  const labs = Object.keys(groups).filter(l => groups[l].length >= 3);
  for (let k = 0; k < n; k++) {
    const g = pick(labs), other = pick(Object.keys(groups).filter(l => l !== g)), three = pickN(groups[g], 3), odd = pick(groups[other]);
    if (three.includes(odd)) continue;
    Q("top", intro, [cap1(odd), ...three.map(cap1)], `${three.map(cap1).join(", ")} all belong to the group "${g}". ${cap1(odd)} belongs to "${other}", so it is the odd one out.`, C(...three.map(t => ["", cap1(t), g]), ["", cap1(odd), other, 1]));
  }
}
