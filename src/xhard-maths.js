// Challenge-level IMO questions (SOF IMO Achievers level). Since 2026-10-12 these are the whole maths bank.
// Grade 1 works at class 2–3 level, grade 4 at class 5–6 level. Every question needs at least two steps.
{
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (...a) => a.reduce((x, y) => x / gcd(x, y) * y);
const sopt = (ans, cands) => { const out = [String(ans)]; for (const c of cands) { if (c == null) continue; const s = String(c); if (out.length < 4 && !out.includes(s) && !/NaN|undefined|Infinity/.test(s)) out.push(s); } return out.length === 4 ? out : null; };
const fr = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const digs = n => String(n).split("").map(Number);
const dsum = n => digs(n).reduce((a, b) => a + b, 0);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const WORDNUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const POSW = ["first", "second", "third", "fourth", "fifth"];
const GIRLS = ["Riya", "Meera", "Tara", "Zoya", "Anya", "Sara"], BOYS = ["Aman", "Kabir", "Ishaan", "Arjun", "Dev", "Rohan"];
const ROM2 = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const rom = n => { let s = ""; for (const [v, r] of ROM2) while (n >= v) { s += r; n -= v; } return s; };
const romAdd = n => { let s = ""; for (const [v, r] of [[1000, "M"], [500, "D"], [100, "C"], [50, "L"], [10, "X"], [5, "V"], [1, "I"]]) while (n >= v) { s += r; n -= v; } return s; };
// Grade 1 clock words (quarter hours) and grade 4 clock formats.
const say = t => { t = ((t % 720) + 720) % 720; const h = Math.floor(t / 60) || 12, m = t % 60, nh = h % 12 + 1; return m === 0 ? `${h} o'clock` : m === 15 ? `quarter past ${h}` : m === 30 ? `half past ${h}` : m === 45 ? `quarter to ${nh}` : `${h}:${String(m).padStart(2, "0")}`; };
const durW = d => [Math.floor(d / 60) ? `${Math.floor(d / 60)} hour${Math.floor(d / 60) > 1 ? "s" : ""}` : "", d % 60 ? `${d % 60} minutes` : ""].filter(Boolean).join(" ");
const clk = t => ({ t: "clock", h: Math.floor(((t % 720) + 720) % 720 / 60), m: t % 60 });
const t12 = t => { t = ((t % 1440) + 1440) % 1440; const h = Math.floor(t / 60), m = t % 60; return `${(h + 11) % 12 + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };
const t24 = t => { t = ((t % 1440) + 1440) % 1440; return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
const hm = d => d < 60 ? `${d} min` : d % 60 ? `${Math.floor(d / 60)} h ${d % 60} min` : `${d / 60} h`;

// fam(n, f): call f(E) until it has produced n new questions (or gives up). E returns true when a question was added.
function runner(Q) {
  const seen = new Set();
  const E = (q, o, e, v, extra) => {
    if (!o || o.length !== 4) return false;
    o = o.map(String);
    if (new Set(o).size < 4 || o.some(x => /NaN|undefined|Infinity|^-|−\d/.test(x))) return false;
    const key = q + "|" + o[0] + "|" + JSON.stringify((extra && extra.qv) || "");
    if (seen.has(key)) return false;
    seen.add(key); Q("top", q, o, e, v, extra); return true;
  };
  return (n, f) => { let c = 0; for (let t = 0; t < n * 12 && c < n; t++) if (f(E)) c++; return c; };
}

// A row of friends with clues; returns a puzzle whose clues fit exactly one order.
function seatPuzzle(n) {
  const kids = pickN(KIDS, n), row = mix(kids), P = perms(kids), pos = (p, x) => p.indexOf(x), clues = [];
  for (let t = 0; t < 40 && clues.length < n + 2; t++) {
    const kind = ri(0, 5), [x, y] = pickN(kids, 2); let c;
    if (kind === 0) { const [a, b] = pos(row, x) < pos(row, y) ? [x, y] : [y, x]; c = [`${a} sits somewhere to the left of ${b}.`, p => pos(p, a) < pos(p, b)]; }
    else if (kind === 1) { const nx = Math.abs(pos(row, x) - pos(row, y)) === 1; c = [nx ? `${x} sits next to ${y}.` : `${x} does not sit next to ${y}.`, p => (Math.abs(pos(p, x) - pos(p, y)) === 1) === nx]; }
    else if (kind === 2) { const left = ri(0, 1), e = left ? row[0] : row[n - 1]; c = [`${e} sits at the ${left ? "left" : "right"} end.`, p => left ? p[0] === e : p[n - 1] === e]; }
    else if (kind === 3) { const i = ri(0, n - 2), a = row[i], b = row[i + 1]; c = [`${b} sits just to the right of ${a}.`, p => pos(p, b) === pos(p, a) + 1]; }
    else if (kind === 4) { const i = ri(1, n - 2), a = row[i - 1], m = row[i], b = row[i + 1]; c = [`${m} sits between ${a} and ${b}, next to both.`, p => Math.abs(pos(p, m) - pos(p, a)) === 1 && Math.abs(pos(p, m) - pos(p, b)) === 1]; }
    else { const m = row[ri(1, n - 2)]; c = [`${m} does not sit at either end.`, p => pos(p, m) > 0 && pos(p, m) < n - 1]; }
    if (clues.some(k => k[0] === c[0])) continue;
    const ok = P.filter(p => clues.every(k => k[1](p))), after = ok.filter(p => c[1](p)).length;
    if (after === ok.length) continue;
    clues.push(c);
    if (after === 1) return { row, clues: clues.map(k => k[0]) };
  }
  return null;
}
function seatQ(E, n) {
  const z = seatPuzzle(n); if (!z || z.clues.length < 3) return false;
  const j = ri(0, n - 1), ans = z.row[j];
  if (z.clues.some(c => c.startsWith(`${ans} sits at the`))) return false;
  const where = j === 0 ? "at the left end" : j === n - 1 ? "at the right end" : n % 2 && j === (n - 1) / 2 ? "in the middle" : `${POSW[j]} from the left`;
  return E(`${WORDNUM[n][0].toUpperCase() + WORDNUM[n].slice(1)} friends, ${z.row.slice().sort().slice(0, -1).join(", ")} and ${z.row.slice().sort().pop()}, sit in a row on a bench. Left and right are as you look at them.\n${z.clues.join("\n")}\nWho sits ${where}?`, [ans, ...pickN(z.row.filter(k => k !== ans), 3)],
    `Try the clues one by one and move the friends until every clue is true. Only one order works: ${z.row.join(", ")} (left to right). So ${ans} sits ${where}.`, C(...z.row.map((k, i) => ["🪑", k, POSW[i], i === j])));
}

X[1].imo = Q => {
  const fam = runner(Q);

  // 1. Three-step stock problems with regrouping.
  fam(14, E => {
    const [th, ic] = pick(THINGS), a = ri(420, 780), b = ri(105, 189), c = ri(106, 199), d = ri(57, 148), ans = a - b - c + d;
    return E(`A shop had ${a} ${th}. It sold ${b} in the morning and ${c} in the afternoon. In the evening ${d} more ${th} arrived. How many ${th} does the shop have now?`, nums(ans, [a - b - c, a - b - c - d, ans + 10]),
      `Step 1: ${a} − ${b} = ${a - b}. Step 2: ${a - b} − ${c} = ${a - b - c}. Step 3: ${a - b - c} + ${d} = ${ans}.`, F([ic, `${a} − ${b}`, `${a - b}`], ["", `− ${c}`, `${a - b - c}`], ["", `+ ${d}`, `${ans}`, 1]));
  });

  // 2. Groups, then take away, then share.
  const PACKS = [["boxes", "pencils", "broken"], ["packets", "biscuits", "broken"], ["trays", "eggs", "cracked"], ["bags", "oranges", "rotten"], ["boxes", "crayons", "broken"], ["baskets", "mangoes", "rotten"]];
  fam(14, E => {
    const [box, th, bad] = pick(PACKS), g = ri(3, 7), n = ri(4, 9), m = ri(2, 5), tot = g * n, k0 = tot % m, k = k0 + m * ri(k0 ? 0 : 1, 2);
    if (k < 2 || tot - k < m * 2) return false;
    const e = (tot - k) / m;
    return E(`There are ${g} ${box} with ${n} ${th} in each. ${k} of the ${th} are ${bad}. The good ${th} are shared equally among ${m} children. How many ${th} does each child get?`, nums(e, [Number.isInteger(tot / m) ? tot / m : e + 2, tot - k, e - 1]),
      `Step 1: ${g} × ${n} = ${tot} ${th}. Step 2: ${tot} − ${k} ${bad} = ${tot - k} good ones. Step 3: ${tot - k} ÷ ${m} = ${e} each.`, F(["", `${g} × ${n}`, `${tot}`], ["", `− ${k}`, `${tot - k}`], ["", `÷ ${m}`, `${e} each`, 1]));
  });

  // 3. "Times as many" and "more than double".
  fam(12, E => {
    const [p, q] = pickN(KIDS, 2), [th] = pick(THINGS), a = ri(6, 19), m = ri(2, 4), x = ri(2, 9);
    if (ri(0, 1)) { const r = m * a, ans = r + a; return E(`${p} has ${m === 2 ? "twice" : m + " times"} as many ${th} as ${q}. ${q} has ${a} ${th}. How many ${th} do they have altogether?`, nums(ans, [r, a + m, ans + a]), `${p} has ${m} × ${a} = ${r}. Altogether: ${r} + ${a} = ${ans}.`, F(["", q, `${a}`], ["", p, `${m} × ${a} = ${r}`], ["", "Altogether", `${ans}`, 1])); }
    const r = 2 * a + x, ans = r + a;
    return E(`${q} has ${a} ${th}. ${p} has ${x} more than double what ${q} has. How many ${th} do they have altogether?`, nums(ans, [r, 3 * a, 2 * a + a + 2 * x]), `Double ${a} is ${2 * a}. ${x} more is ${r}, so ${p} has ${r}. Altogether: ${r} + ${a} = ${ans}.`, F(["", "Double " + a, `${2 * a}`], ["", `+ ${x}`, `${r}`], ["", `+ ${a}`, `${ans}`, 1]));
  });

  // 4. Missing number in a two-operation sentence.
  fam(15, E => {
    const a = ri(2, 9), x = ri(3, 12), b = ri(3, 25), kind = ri(0, 3);
    let q, ans = x, w, st;
    if (kind === 0) { const c = a * x + b; q = `${a} × ☐ + ${b} = ${c}`; w = [c - b, Math.floor(c / a), x + 1]; st = [`${c} − ${b}`, c - b, `${c - b} ÷ ${a}`, x]; }
    else if (kind === 1) { const c = a * x - b; if (c <= 2) return false; q = `☐ × ${a} − ${b} = ${c}`; w = [c + b, (c - b) / a, x - 1]; st = [`${c} + ${b}`, c + b, `${c + b} ÷ ${a}`, x]; }
    else if (kind === 2) { const s = a * x, c = ri(2, s - 2), b2 = s - c; q = `${a} × ☐ = ${b2} + ${c}`; w = [s, x + 2, x - 1]; st = [`${b2} + ${c}`, s, `${s} ÷ ${a}`, x]; }
    else { ans = x * a; const c = x + b; q = `☐ ÷ ${a} + ${b} = ${c}`; w = [x, c * a, ans + a]; st = [`${c} − ${b}`, x, `${x} × ${a}`, ans]; }
    return E(`What number goes in the box?\n${q}`, nums(ans, w), `Work backwards. ${st[0]} = ${st[1]}. Then ${st[2]} = ${st[3]}.`, F(["", st[0], String(st[1])], ["", st[2], String(st[3]), 1]));
  });

  // 5. Both sides must be equal.
  fam(12, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const p = ri(60, 95), q2 = ri(11, 29), r = p - q2, b = ri(15, r - 10), ans = r - b; return E(`What number goes in the box?\n☐ + ${b} = ${p} − ${q2}`, nums(ans, [r + b, p - b, ans + 10]), `First work out the right side: ${p} − ${q2} = ${r}. Then ☐ = ${r} − ${b} = ${ans}.`, F(["", `${p} − ${q2}`, `${r}`], ["", `${r} − ${b}`, `${ans}`, 1])); }
    if (kind === 1) { const s = ri(11, 25), t = ri(5, 19), r = s + t, a = ri(r + 8, 95), ans = a - r; return E(`What number goes in the box?\n${a} − ☐ = ${s} + ${t}`, nums(ans, [a + r, a - s, ans + 1]), `Right side: ${s} + ${t} = ${r}. ${a} − ☐ = ${r}, so ☐ = ${a} − ${r} = ${ans}.`, F(["", `${s} + ${t}`, `${r}`], ["", `${a} − ${r}`, `${ans}`, 1])); }
    const a = ri(4, 9), b = ri(6, 9), p = a * b, c = ri(9, p - 5), ans = p - c;
    return E(`What number goes in the box?\n${a} × ${b} = ☐ + ${c}`, nums(ans, [p + c, p, ans + 1]), `Left side: ${a} × ${b} = ${p}. ☐ + ${c} = ${p}, so ☐ = ${p} − ${c} = ${ans}.`, F(["", `${a} × ${b}`, `${p}`], ["", `${p} − ${c}`, `${ans}`, 1]));
  });

  // 6. Two-rule and interleaved patterns.
  fam(15, E => {
    const kind = ri(0, 3); let seq, ans, why, w;
    if (kind === 0) {
      const a = ri(1, 9), p = ri(2, 5), b = ri(30, 60), q = ri(2, 6), len = ri(6, 7), all = [];
      for (let i = 0; i < 9; i++) all.push(i % 2 ? b - q * ((i - 1) / 2) : a + p * (i / 2));
      seq = all.slice(0, len); ans = all[len]; w = [all[len + 1], ans + 1, ans - 1, all[len - 2]];
      why = `Two patterns take turns. 1st, 3rd, 5th … numbers: ${a}, ${a + p}, ${a + 2 * p} … (+${p} each time). 2nd, 4th, 6th … numbers: ${b}, ${b - q}, ${b - 2 * q} … (−${q} each time). The next number belongs to the ${len % 2 ? "second" : "first"} pattern.`;
    } else if (kind === 1) {
      const s = ri(2, 15), a = ri(5, 9), b = ri(2, a - 2), all = [s];
      for (let i = 1; i < 12; i++) all.push(all[i - 1] + (i % 2 ? a : -b));
      ans = all[9];
      return E(`Look at the pattern: ${all.slice(0, 5).join(", ")}, …\nWhat is the 10th number?`, nums(ans, [all[8], all[10], ans + a]), `The rule is +${a}, −${b}, +${a}, −${b} … Keep going: ${all.slice(0, 10).join(", ")}. The 10th number is ${ans}.`, { t: "seq", items: all.slice(5, 10).map(String), hl: 4 });
    } else if (kind === 2) {
      const s = ri(1, 9), d0 = ri(1, 4), k = ri(1, 3); seq = [s]; let d = d0;
      for (let i = 1; i < 6; i++) { seq.push(seq[i - 1] + d); d += k; }
      ans = seq.pop(); const last = seq[4] - seq[3]; w = [seq[4] + last, ans + 1, ans + k];
      why = `The jumps grow by ${k} each time: ${seq.slice(1).map((v, i) => "+" + (v - seq[i])).join(", ")}, so the next jump is +${last + k}.`;
    } else {
      const s = ri(2, 5), c = ri(1, 4); seq = [s];
      for (let i = 1; i < 7; i++) seq.push(i % 2 ? seq[i - 1] * 2 : seq[i - 1] + c);
      ans = seq.pop(); w = [seq[5] + c, seq[5] * 2 + c, ans + 2];
      why = `The rules take turns: ×2, then +${c}, then ×2, then +${c} … The next step is ×2.`;
    }
    return E(`What comes next?\n${seq.join(", ")}, ☐`, nums(ans, w), `${why} So the answer is ${ans}.`, { t: "seq", items: [...seq.slice(-4), ans].map(String), hl: 4 });
  });

  // 7. Matchstick patterns.
  const STICK = [["squares", 4, 3], ["triangles", 3, 2], ["hexagons", 6, 5], ["pentagons", 5, 4]];
  fam(12, E => {
    const [sh, first, add] = pick(STICK), one = sh.slice(0, -1), n = ri(6, 15), ans = first + add * (n - 1);
    const intro = `1 ${one} needs ${first} matchsticks. 2 ${sh} in a row (sharing a side) need ${first + add}. 3 ${sh} in a row need ${first + 2 * add}.`;
    if (ri(0, 1)) return E(`${intro}\nHow many matchsticks are needed for ${n} ${sh} in a row?`, nums(ans, [first * n, add * n, ans + add]), `Each new ${one} adds only ${add} sticks because it shares a side. ${n} ${sh}: ${first} + ${add} × ${n - 1} = ${first} + ${add * (n - 1)} = ${ans}.`, F(["", `1st ${one}`, `${first}`], ["", `+ ${add} × ${n - 1}`, `${add * (n - 1)}`], ["", `${n} ${sh}`, `${ans}`, 1]));
    return E(`${intro}\nHow many ${sh} in a row can be made with ${ans} matchsticks?`, nums(n, [Math.floor(ans / first), Math.floor(ans / add), n + 1]), `The first ${one} uses ${first} sticks, leaving ${ans} − ${first} = ${ans - first}. Each extra ${one} uses ${add}: ${ans - first} ÷ ${add} = ${n - 1}. So 1 + ${n - 1} = ${n} ${sh}.`, F(["", `${ans} − ${first}`, `${ans - first}`], ["", `÷ ${add}`, `${n - 1} more`], ["", "In all", `${n}`, 1]));
  });

  // 8. Magic squares.
  const LO = [2, 7, 6, 9, 5, 1, 4, 3, 8], LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  fam(14, E => {
    let g = LO.slice(); const rot = a => [6, 3, 0, 7, 4, 1, 8, 5, 2].map(i => a[i]);
    for (let r = ri(0, 3); r > 0; r--) g = rot(g);
    if (ri(0, 1)) g = [2, 1, 0, 5, 4, 3, 8, 7, 6].map(i => g[i]);
    const k = ri(1, 3), c = ri(0, 12); g = g.map(v => v * k + c);
    const S = g[0] + g[1] + g[2], t = ri(0, 8), hide = new Set([t, ...pickN(range(0, 8).filter(i => i !== t), ri(2, 3))]);
    const full = LINES.find(L => L.every(i => !hide.has(i))), use = LINES.find(L => L.includes(t) && L.every(i => i === t || !hide.has(i)));
    if (!full || !use || full.includes(t)) return false;
    const [o1, o2] = use.filter(i => i !== t), ans = g[t], show = g.map((v, i) => i === t ? "☐" : hide.has(i) ? "?" : String(v));
    const grid = [0, 1, 2].map(r => show.slice(r * 3, r * 3 + 3).join("  |  ")).join("\n");
    return E(`In this magic square every row, column and diagonal adds up to the same total. Some numbers are hidden (?). What number goes in ☐?\n${grid}`, nums(ans, [S - g[o1], ans + k, S, ans - 1]),
      `Find a line with no gaps: ${full.map(i => g[i]).join(" + ")} = ${S}. So every line adds to ${S}. The line through ☐ also has ${g[o1]} and ${g[o2]}: ${S} − ${g[o1]} − ${g[o2]} = ${ans}.`, F(["", "Full line", `${full.map(i => g[i]).join(" + ")} = ${S}`], ["", `${S} − ${g[o1]} − ${g[o2]}`, `${ans}`, 1]));
  });

  // 9. Find the rule (two operations).
  const RULES = [
    [(a, b) => a * b + 1, "multiply the two numbers, then add 1", (a, b) => `${a} × ${b} + 1`],
    [(a, b) => a * b - 1, "multiply the two numbers, then take away 1", (a, b) => `${a} × ${b} − 1`],
    [(a, b) => (a + b) * 2, "add the two numbers, then double", (a, b) => `(${a} + ${b}) × 2`],
    [(a, b) => a * 2 + b, "double the first number, then add the second", (a, b) => `${a} × 2 + ${b}`],
    [(a, b) => a * b + a, "multiply the two numbers, then add the first number", (a, b) => `${a} × ${b} + ${a}`],
    [(a, b) => a * a + b, "multiply the first number by itself, then add the second", (a, b) => `${a} × ${a} + ${b}`],
    [(a, b) => a * b - a, "multiply the two numbers, then take away the first number", (a, b) => `${a} × ${b} − ${a}`],
  ];
  fam(14, E => {
    const [f, rule, show] = pick(RULES), pr = Array.from({ length: 3 }, () => [ri(2, 9), ri(2, 9)]);
    if (new Set(pr.map(p => p.slice().sort().join())).size < 3 || RULES.some(([g]) => g !== f && pr.slice(0, 2).every(([a, b]) => g(a, b) === f(a, b)))) return false;
    const [a, b] = pr[2], ans = f(a, b);
    return E(`Find the rule, then the missing number.\n${pr[0][0]} and ${pr[0][1]} → ${f(...pr[0])}\n${pr[1][0]} and ${pr[1][1]} → ${f(...pr[1])}\n${a} and ${b} → ?`, nums(ans, mix(RULES.filter(([g]) => g !== f).map(([g]) => g(a, b)).concat([a * b, a + b]))),
      `The rule is: ${rule}. Check: ${show(...pr[0])} = ${f(...pr[0])} and ${show(...pr[1])} = ${f(...pr[1])}. So ${show(a, b)} = ${ans}.`, F(["", `${pr[0][0]}, ${pr[0][1]}`, `${show(...pr[0])} = ${f(...pr[0])}`], ["", `${a}, ${b}`, `${show(a, b)} = ${ans}`, 1]));
  });

  // 10. Fewest coins and notes.
  const DEN = [50, 20, 10, 5, 2, 1];
  const greedy = x => { const out = []; for (const d of DEN) { const c = Math.floor(x / d); if (c) out.push([d, c]); x -= c * d; } return out; };
  fam(14, E => {
    const kind = ri(0, 1), cost = ri(13, 96), x = kind ? 100 - cost : ri(38, 189), used = greedy(x), n = used.reduce((s, u) => s + u[1], 0);
    if (n < 4) return false;
    const note = "(Coins: ₹1, ₹2, ₹5, ₹10. Notes: ₹20, ₹50.)";
    const q = kind ? `A toy costs ₹${cost}. Riya pays with a ₹100 note. The shopkeeper gives her the change using the fewest coins and notes. How many coins and notes does she get? ${note}` : `What is the smallest number of coins and notes needed to make exactly ₹${x}? ${note}`;
    return E(q, nums(n, [n + 1, n - 1, n + 2]), `${kind ? `Change = ₹100 − ₹${cost} = ₹${x}. ` : ""}Always use the biggest note or coin that fits: ${used.map(([d, c]) => `${c} × ₹${d}`).join(" + ")} = ₹${x}. That is ${n} coins and notes.`, C(...used.map(([d, c]) => [d >= 20 ? "💵" : "🪙", `₹${d}`, `× ${c}`]), ["", "Total", `${n}`, 1]));
  });

  // 11. How many ways to pay.
  const ways = (n, ds) => { const out = []; const go = (rest, i, acc) => { if (rest === 0) { out.push(acc); return; } if (i >= ds.length) return; for (let k = Math.floor(rest / ds[i]); k >= 0; k--) go(rest - k * ds[i], i + 1, k ? [...acc, [ds[i], k]] : acc); }; go(n, 0, []); return out; };
  const COINSETS = [[5, 2, 1], [10, 5, 2], [5, 2], [10, 5, 1], [2, 1], [10, 2]];
  fam(12, E => {
    const ds = pick(COINSETS), n = ri(6, 25), W = ways(n, ds);
    if (W.length < 3 || W.length > 9) return false;
    const list = W.map(w => w.map(([d, k]) => `${k} × ₹${d}`).join(" + "));
    return E(`In how many different ways can you make ₹${n} using only ${ds.map(d => `₹${d}`).join(", ").replace(/, (₹\d+)$/, " and $1")} coins? (You may use a coin many times, or not at all.)`, nums(W.length, [W.length - 1, W.length + 1, W.length + 2]),
      `Start with as many of the biggest coin as possible, then use one fewer each time. The ways are: ${list.join("; ")}. That is ${W.length} ways.`, C(...list.slice(0, 6).map((s, i) => ["🪙", `Way ${i + 1}`, s]), ["", "Total", `${W.length} ways`, 1]));
  });

  // 12. Balances with three objects.
  const FRUIT = [["🍉", "watermelon", "watermelons"], ["🍍", "pineapple", "pineapples"], ["🥭", "mango", "mangoes"], ["🍎", "apple", "apples"], ["🍓", "strawberry", "strawberries"], ["🍒", "cherry", "cherries"]];
  const fn = (f, n) => `${n} ${n === 1 ? f[1] : f[2]}`;
  fam(14, E => {
    const [i, j, k] = pickN([0, 1, 2, 3, 4, 5], 3).sort((a, b) => a - b), A = FRUIT[i], B = FRUIT[j], Cc = FRUIT[k], x = ri(2, 4), y = ri(2, 4), p = ri(1, 3), q = ri(1, 2), ans = p * x * y + q * y;
    return E(`1 ${A[0]} ${A[1]} weighs the same as ${x} ${B[0]} ${B[2]}. 1 ${B[0]} ${B[1]} weighs the same as ${y} ${Cc[0]} ${Cc[2]}. How many ${Cc[2]} weigh the same as ${fn(A, p)} and ${fn(B, q)} together?`, nums(ans, [p * x + q, p * x * y, (p + q) * x * y]),
      `${fn(A, p)} = ${p} × ${x} = ${p * x} ${B[2]}. Add the ${fn(B, q)}: ${p * x + q} ${B[2]}. Each ${B[1]} = ${y} ${Cc[2]}, so ${p * x + q} × ${y} = ${ans} ${Cc[2]}.`, F([A[0], fn(A, p), `${p * x} ${B[2]}`], [B[0], `+ ${q}`, `${p * x + q} ${B[2]}`], [Cc[0], `× ${y}`, `${ans} ${Cc[2]}`, 1]));
  });

  // 13. Ages.
  fam(15, E => {
    const kind = ri(0, 3), [p, q] = pickN(KIDS, 2), g = pick(GIRLS), b0 = pick(BOYS);
    if (kind === 0) { const m = ri(2, 3), b = ri(2, 6), k = ri(2, 5), ans = m * (b + k) - k; return E(`In ${k} years, ${g} will be ${m === 2 ? "twice" : "three times"} as old as her brother. Her brother is ${b} years old now. How old is ${g} now?`, nums(ans, [m * b, m * (b + k), m * (b + k) + k]), `In ${k} years the brother will be ${b} + ${k} = ${b + k}. ${g} will then be ${m} × ${b + k} = ${m * (b + k)}. Now she is ${k} years younger: ${m * (b + k)} − ${k} = ${ans}.`, F(["🧒", `Brother in ${k} years`, `${b + k}`], ["👧", `${g} then`, `${m * (b + k)}`], ["", `${g} now`, `${ans}`, 1])); }
    if (kind === 1) { const a = ri(5, 9), f = ri(30, 40), c = a + ri(3, 15), ans = f + c - a; return E(`${b0} is ${a} years old and his father is ${f}. How old will his father be when ${b0} is ${c}?`, nums(ans, [f + c, f - a, ans + 1]), `${b0} has to grow ${c} − ${a} = ${c - a} years. His father grows ${c - a} years too: ${f} + ${c - a} = ${ans}.`, F(["🧒", `${a} → ${c}`, `+${c - a} years`], ["👨", `${f} + ${c - a}`, `${ans}`, 1])); }
    if (kind === 2) { const y = ri(3, 9), d = ri(2, 6), s = 2 * y + d; return E(`The ages of two sisters add up to ${s} years. The elder sister is ${d} years older than the younger one. How old is the younger sister?`, nums(y, [s - d, y + d, Math.floor(s / 2)]), `Take away the difference first: ${s} − ${d} = ${s - d}. Now both are equal: ${s - d} ÷ 2 = ${y}. Check: ${y} + ${y + d} = ${s}.`, F(["", `${s} − ${d}`, `${s - d}`], ["", `÷ 2`, `${y}`, 1], ["", "Elder", `${y + d}`])); }
    const x = ri(2, 8), d = ri(2, 6), ans = x + 3 + d + 4;
    return E(`3 years ago ${p} was ${x} years old. ${q} is ${d} years older than ${p}. How old will ${q} be 4 years from now?`, nums(ans, [x + d + 4, x + 3 + d, x + d]), `${p} now: ${x} + 3 = ${x + 3}. ${q} now: ${x + 3} + ${d} = ${x + 3 + d}. In 4 years: ${x + 3 + d} + 4 = ${ans}.`, F(["", `${p} now`, `${x + 3}`], ["", `${q} now`, `${x + 3 + d}`], ["", "In 4 years", `${ans}`, 1]));
  });

  // 14. Elapsed time with quarter hours.
  fam(15, E => {
    const s = ri(1, 9) * 60 + 15 * ri(0, 3), d = 15 * ri(5, 14), e = s + d, kind = ri(0, 2), H = Math.floor(d / 60), M = d % 60;
    const steps = `${say(s)} + ${H} hour${H > 1 ? "s" : ""} = ${say(s + H * 60)}${M ? `, then + ${M} minutes = ${say(e)}` : ""}`;
    if (kind === 0) return E(`A film starts at ${say(s)}. It lasts ${durW(d)}. At what time does it end?`, sopt(say(e), [say(e + 60), say(e - 15), say(e + 15), say(s + H * 60)]), `Add the hours first, then the minutes: ${steps}.`, clk(e));
    if (kind === 1) return E(`A train reached the station at ${say(e)}. The journey took ${durW(d)}. At what time did the train start?`, sopt(say(s), [say(s + 60), say(s - 15), say(s + 30), say(e - H * 60)]), `Count back from ${say(e)}: take away ${H} hour${H > 1 ? "s" : ""}${M ? ` and ${M} minutes` : ""}. Check: ${steps}.`, clk(s));
    return E(`A cricket match began at ${say(s)} and ended at ${say(e)}. How long did it last?`, sopt(durW(d), [durW(d + 60), durW(d - 30), durW(d + 15), durW(d - 15)]), `From ${say(s)}: ${steps}. So it lasted ${durW(d)}.`, clk(e));
  });

  // 15. Calendar.
  fam(15, E => {
    const kind = ri(0, 2), w = ri(0, 6);
    if (kind === 0) { const d1 = ri(1, 9), d2 = d1 + ri(10, 21), diff = d2 - d1, r = diff % 7, ans = DAYS[(w + r) % 7]; return E(`The ${ord(d1)} of a month is a ${DAYS[w]}. What day of the week is the ${ord(d2)} of the same month?`, sopt(ans, [DAYS[(w + r + 1) % 7], DAYS[(w + r + 6) % 7], DAYS[w], DAYS[(w + 2) % 7], DAYS[(w + 3) % 7]]), `${d2} − ${d1} = ${diff} days later. ${diff} days = ${Math.floor(diff / 7)} week${diff >= 14 ? "s" : ""} and ${r} day${r === 1 ? "" : "s"}. After whole weeks it is ${DAYS[w]} again, then count ${r} more: ${ans}.`, { t: "seq", items: range(0, r).map(j => DAYS[(w + j) % 7].slice(0, 3)), hl: r }); }
    if (kind === 1) { const L = pick([30, 31]), ans = DAYS[(w + L - 1) % 7]; return E(`A month has ${L} days. Its 1st day is a ${DAYS[w]}. What day of the week is its last day?`, sopt(ans, [DAYS[(w + L) % 7], DAYS[(w + L - 2) % 7], DAYS[w]]), `The last day is the ${L}th, which is ${L - 1} days after the 1st. ${L - 1} = 4 weeks and ${L - 29} day${L - 29 > 1 ? "s" : ""}. ${L - 29} day${L - 29 > 1 ? "s" : ""} after ${DAYS[w]} is ${ans}.`, { t: "seq", items: range(0, L - 29).map(j => DAYS[(w + j) % 7].slice(0, 3)), hl: L - 29 }); }
    const L = pick([28, 29, 30, 31]), t = ri(0, 6), dates = range(1, L).filter(d => (w + d - 1) % 7 === t), ans = dates.length;
    return E(`A month has ${L} days and starts on a ${DAYS[w]}. How many ${DAYS[t]}s are there in that month?`, nums(ans, [ans === 5 ? 4 : 5, 3, 6]), `The first ${DAYS[t]} is the ${ord(dates[0])}. Add 7 each time: ${dates.join(", ")}. That is ${ans} ${DAYS[t]}s.`, C(...dates.map(d => ["📅", String(d), DAYS[t].slice(0, 3)])));
  });

  // 16. Counting squares, rectangles and triangles.
  fam(14, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const w = ri(2, 5), h = ri(2, Math.min(3, w)), parts = range(0, h - 1).map(i => [i + 1, (w - i) * (h - i)]), ans = parts.reduce((s, p) => s + p[1], 0); return E(`How many squares are there in this ${h} by ${w} grid? (Count the bigger squares too.)`, nums(ans, [w * h, ans + 1, ans - 2]), `Count each size: ${parts.map(([s, c]) => `${s}×${s} squares: ${c}`).join(", ")}. Total: ${parts.map(p => p[1]).join(" + ")} = ${ans}.`, { t: "rect", w, h, grid: 1, unit: "" }, { qv: { t: "rect", w, h, grid: 1, unit: "" } }); }
    if (kind === 1) { const w = ri(4, 7), ans = w * (w + 1) / 2; return E(`How many rectangles are there in this strip? (Squares are rectangles too.)`, nums(ans, [w, w + 1, ans - 1]), `Rectangles 1 box long: ${w}. 2 boxes long: ${w - 1}. … ${w} boxes long: 1. Total: ${range(1, w).reverse().join(" + ")} = ${ans}.`, { t: "strip", m: w }, { qv: { t: "strip", m: w } }); }
    const m = ri(4, 6), ans = m * (m + 1) / 2;
    return E(`How many triangles are there in this figure?`, nums(ans, [m, m + 1, ans - 1]), `Triangles made of 1 part: ${m}. 2 parts side by side: ${m - 1}. … all ${m} parts: 1. Total: ${range(1, m).reverse().join(" + ")} = ${ans}.`, { t: "tri", m }, { qv: { t: "tri", m } });
  });

  // 17. Place-value riddles.
  const THREE = range(100, 999), dd = n => new Set(digs(n)).size === 3;
  fam(15, E => {
    const s = ri(5, 24), conds = [
      ["whose digits are all odd and all different", n => dd(n) && digs(n).every(d => d % 2), n => digs(n).every(d => d % 2)],
      ["whose digits are all even and all different", n => dd(n) && digs(n).every(d => d % 2 === 0), n => digs(n).every(d => d % 2 === 0)],
      [`whose digits add up to ${s}`, n => dsum(n) === s, n => dsum(n) === s + 1],
      [`whose digits are all different and add up to ${s}`, n => dd(n) && dsum(n) === s, n => dsum(n) === s],
      ["that is even and has all different digits", n => dd(n) && n % 2 === 0, n => n % 2 === 0],
      ["that is odd and has all different digits", n => dd(n) && n % 2 === 1, n => n % 2 === 1],
    ];
    const [txt, ok, relax] = pick(conds), big = ri(0, 1), cand = THREE.filter(ok), rel = THREE.filter(relax);
    if (cand.length < 3) return false;
    const ans = big ? cand[cand.length - 1] : cand[0], alt = big ? rel[rel.length - 1] : rel[0];
    return E(`What is the ${big ? "largest" : "smallest"} 3-digit number ${txt}?`, nums(ans, [alt, big ? cand[cand.length - 2] : cand[1], big ? cand[cand.length - 3] : cand[2]]),
      `${big ? "Make the hundreds digit as big as possible, then the tens digit, then the ones digit" : "Make the hundreds digit as small as possible (it cannot be 0), then the tens digit, then the ones digit"}, always keeping the rule. That gives ${ans} (digits ${digs(ans).join(", ")}${/add up/.test(txt) ? `, sum ${dsum(ans)}` : ""}).`, { t: "seq", items: digs(ans).map(String), hl: 0 });
  });

  // 18. Who sits where.
  fam(14, E => seatQ(E, 4));

  // 19. Order by comparing.
  const REL = [["taller", "shorter", "tallest", "shortest"], ["heavier", "lighter", "heaviest", "lightest"], ["older", "younger", "oldest", "youngest"]];
  fam(14, E => {
    const [mo, le, most, least] = pick(REL), o = pickN(KIDS, 4);
    const clues = mix([0, 1, 2].map(i => ri(0, 1) ? `${o[i]} is ${mo} than ${o[i + 1]}.` : `${o[i + 1]} is ${le} than ${o[i]}.`));
    const [idx, s] = pick([[0, `the ${most}`], [1, `the second ${most}`], [2, `the second ${least}`], [3, `the ${least}`]]);
    return E(`${clues.join(" ")}\nWho is ${s}?`, [o[idx], ...o.filter((_, i) => i !== idx)], `Put them in order from ${most} to ${least}: ${o.join(", ")}. So ${s} is ${o[idx]}.`, F(...o.map((k, i) => ["", k, i === 0 ? most : i === 3 ? least : "", i === idx])));
  });

  // 20. Handshakes and combinations.
  fam(15, E => {
    const kind = ri(0, 3), n = ri(4, 8);
    if (kind === 0) { const ans = n * (n - 1) / 2; return E(`${n} friends meet at a party. Each friend shakes hands with every other friend once. How many handshakes are there?`, nums(ans, [n * (n - 1), n * n, ans + 1]), `The first friend shakes ${n - 1} hands, the next shakes ${n - 2} new hands, and so on: ${range(1, n - 1).reverse().join(" + ")} = ${ans}.`, C(...range(1, n - 1).reverse().map((v, i) => ["🤝", `Friend ${i + 1}`, `${v} new`]), ["", "Total", `${ans}`, 1])); }
    if (kind === 1) { const ans = n * (n - 1); return E(`${n} friends each send one card to every other friend. How many cards are sent in all?`, nums(ans, [n * (n - 1) / 2, n * n, ans - 1]), `Each friend sends ${n - 1} cards. ${n} × ${n - 1} = ${ans}. (A card from A to B and a card from B to A are 2 different cards.)`, F(["✉️", "Each sends", `${n - 1}`], ["", `${n} × ${n - 1}`, `${ans}`, 1])); }
    if (kind === 2) { const ans = n * (n - 1) / 2; return E(`In a football contest, ${n} teams each play every other team once. How many matches are played?`, nums(ans, [n * (n - 1), n * 2, ans + n]), `Team 1 plays ${n - 1} matches, team 2 plays ${n - 2} new ones, and so on: ${range(1, n - 1).reverse().join(" + ")} = ${ans}.`, F(["⚽", `${n} teams`, ""], ["", range(1, n - 1).reverse().join(" + "), `${ans}`, 1])); }
    const zero = ri(0, 1), ds = (zero ? [0] : []).concat(pickN([1, 2, 3, 4, 5, 6, 7, 8, 9], ri(3, 4) - zero)).sort(), k = ds.length, ans = zero ? (k - 1) * (k - 1) : k * (k - 1);
    return E(`How many different 2-digit numbers can be made using the digits ${ds.join(", ")} if a digit cannot be used twice in the same number?`, nums(ans, [k * k, k * (k - 1) + (zero ? 0 : 1), ans - 1]), `${zero ? `The tens digit cannot be 0, so it has ${k - 1} choices. The ones digit can be any of the other ${k - 1} digits (0 is allowed there). ${k - 1} × ${k - 1} = ${ans}.` : `The tens digit has ${k} choices. The ones digit has the other ${k - 1}. ${k} × ${k - 1} = ${ans}.`}`, F(["", "Tens", `${zero ? k - 1 : k} choices`], ["", "Ones", `${k - 1} choices`], ["", "Numbers", `${ans}`, 1]));
  });

  // 21. Counting odd, even and multiples.
  fam(14, E => {
    const kind = ri(0, 2), a = ri(11, 60), b = a + ri(15, 40);
    if (kind === 0) { const L = range(a + 1, b - 1).filter(x => x % 2), ans = L.length; return E(`How many odd numbers are there between ${a} and ${b}?`, nums(ans, [Math.floor((b - a) / 2) + 1, ans + 1, b - a - 1]), `"Between" leaves out ${a} and ${b}. The odd numbers are ${L[0]}, ${L[1]}, … ${L[L.length - 1]}. Count in twos: ${ans} numbers.`, { t: "numline", from: a, to: b, mark: L[L.length - 1], every: 5 }); }
    if (kind === 1) { const L = range(a, b).filter(x => x % 2 === 0), ans = L.length; return E(`How many even numbers are there from ${a} to ${b}? (Count ${a} and ${b} too if they are even.)`, nums(ans, [Math.floor((b - a) / 2), ans + 1, ans - 1]), `The even numbers go ${L[0]}, ${L[1]}, … ${L[L.length - 1]}. (${L[L.length - 1]} − ${L[0]}) ÷ 2 + 1 = ${ans}.`, { t: "numline", from: a, to: b, mark: L[L.length - 1], every: 5 }); }
    const m = pick([3, 4, 5, 6]), L = range(a, b).filter(x => x % m === 0), ans = L.length;
    return E(`How many numbers from ${a} to ${b} are in the ${m} times table?`, nums(ans, [Math.floor((b - a) / m), ans + 1, Math.floor(b / m)]), `The first one is ${L[0]} (${L[0] / m} × ${m}) and the last is ${L[L.length - 1]} (${L[L.length - 1] / m} × ${m}). From ${L[0] / m} to ${L[L.length - 1] / m} there are ${ans} numbers.`, C(...L.slice(0, 4).map(x => ["", String(x), ""]), ["", "…", ""], ["", String(L[L.length - 1]), `${ans} in all`, 1]));
  });

  // 22. Digit riddles.
  fam(14, E => {
    if (ri(0, 1)) { const d = ri(1, 9), n = ri(3, 9) * 10 + ri(0, 9), L = range(1, n).filter(x => String(x).includes(d)), ans = range(1, n).reduce((s, x) => s + digs(x).filter(y => y === d).length, 0);
      return E(`Ravi writes all the numbers from 1 to ${n}. How many times does he write the digit ${d}?`, nums(ans, [L.length === ans ? ans - 1 : L.length, Math.floor(n / 10), ans + 1]), `Ones place: ${range(1, n).filter(x => x % 10 === d).length} times. Tens place: ${range(1, n).filter(x => Math.floor(x / 10) === d).length} times${d * 11 <= n ? ` (${d}${d} counts twice)` : ""}. Total ${ans}.`, C(...L.slice(0, 8).map(x => ["", String(x), ""]), ["", "Total", `${ans}`, 1])); }
    const s = ri(3, 16), L = range(10, 99).filter(x => dsum(x) === s), ans = L.length;
    return E(`How many 2-digit numbers have digits that add up to ${s}?`, nums(ans, [ans + 1, ans - 1, s]), `List them in order: ${L.join(", ")}. That is ${ans} numbers.`, C(...L.map(x => ["", String(x), ""]), ["", "Total", `${ans}`, 1]));
  });

  // 23. Heads and legs.
  const HL = [["hens", "cows", 2, 4, "heads", "legs", "a farm", "On"], ["bicycles", "tricycles", 2, 3, "cycles", "wheels", "a shop", "In"], ["ducks", "goats", 2, 4, "heads", "legs", "a field", "In"], ["cars", "bikes", 4, 2, "vehicles", "wheels", "a car park", "In"]];
  fam(14, E => {
    const [A, B, la, lb, hd, lg, place, prep] = pick(HL), na = ri(2, 9), nb = ri(2, 9), h = na + nb, L = na * la + nb * lb;
    const lo = Math.min(la, lb), ask = la > lb ? A : B, ans = la > lb ? na : nb;
    return E(`${prep} ${place} there are only ${A} and ${B}. There are ${h} ${hd} and ${L} ${lg} in all. How many ${ask} are there?`, nums(ans, [h - ans, Math.floor(L / Math.max(la, lb)), ans + 1]),
      `If all ${h} had ${lo} ${lg}, that would be ${h} × ${lo} = ${h * lo}. There are ${L} − ${h * lo} = ${L - h * lo} extra ${lg}. Each of the ${ask} has ${Math.abs(la - lb)} extra, so ${L - h * lo} ÷ ${Math.abs(la - lb)} = ${ans} ${ask}.`, F(["", `${h} × ${lo}`, `${h * lo}`], ["", `${L} − ${h * lo}`, `${L - h * lo} extra`], ["", `÷ ${Math.abs(la - lb)}`, `${ans} ${ask}`, 1]));
  });

  // 24. Positions in a row.
  fam(14, E => {
    const [p, q] = pickN(KIDS, 2), l = ri(5, 14), r = ri(5, 14), n = l + r - 1, k = ri(2, 4), kind = ri(0, 2), right = ri(0, 1);
    if (kind === 0) { if (r - k < 1) return false; const ansL = l + k, ansR = r - k; const ask = right ? "right" : "left", ans = right ? ansR : ansL; return E(`In a row of children, ${p} is ${ord(l)} from the left and ${ord(r)} from the right. ${q} is ${k} places to the right of ${p}. What is ${q}'s position from the ${ask}?`, sopt(ord(ans), [ord(right ? ansL : ansR), ord(ans + 1), ord(ans - 1), ord(ans + 2)]), `Moving ${k} places right adds ${k} to the position from the left and takes ${k} from the position from the right. From the left: ${l} + ${k} = ${l + k}. From the right: ${r} − ${k} = ${r - k}. So ${q} is ${ord(ans)} from the ${ask}.`, F(["", p, `${ord(l)} L, ${ord(r)} R`], ["", `${k} places right`, ""], ["", q, `${ord(ans)} from ${ask}`, 1])); }
    if (kind === 1) { const j = ri(2, 5); return E(`${p} is ${ord(l)} from the left and ${ord(r)} from the right in a row. ${j} more children join the row at the left end. What is ${p}'s position from the left now, and how many children are in the row?`, sopt(`${ord(l + j)}; ${n + j} children`, [`${ord(l)}; ${n + j} children`, `${ord(l + j)}; ${n + j + 1} children`, `${ord(l + j)}; ${n} children`, `${ord(r + j)}; ${n + j} children`]), `Before: ${l} + ${r} − 1 = ${n} children. ${j} join on the left, so ${p} moves to ${l} + ${j} = ${ord(l + j)} from the left, and there are ${n} + ${j} = ${n + j} children.`, F(["", "Row", `${n}`], ["", `+ ${j} on left`, `${n + j}`], ["", p, `${ord(l + j)} from left`, 1])); }
    const t = ri(4, 12), ans = n - t + 1;
    if (t >= n) return false;
    return E(`${p} is ${ord(l)} from the left and ${ord(r)} from the right in a row. ${q} is ${ord(t)} from the left in the same row. What is ${q}'s position from the right?`, sopt(ord(ans), [ord(n - t), ord(ans + 1), ord(r), ord(l + r - t)]), `First find the number of children: ${l} + ${r} − 1 = ${n}. Then ${q} from the right: ${n} − ${t} + 1 = ${ans}.`, F(["", "Children", `${l} + ${r} − 1 = ${n}`], ["", `${n} − ${t} + 1`, `${ord(ans)}`, 1]));
  });

  // 25. Sum and difference.
  const SD = [["A pencil and a rubber", "the pencil", "the rubber", "pencil"], ["A bat and a ball", "the bat", "the ball", "bat"], ["A pen and a notebook", "the notebook", "the pen", "notebook"], ["A cap and a toy", "the toy", "the cap", "toy"]];
  fam(12, E => {
    const [both, big, small, bw] = pick(SD), y = ri(4, 30), d = ri(2, 15) * (ri(0, 1) ? 1 : 2), s = 2 * y + d, ans = y + d;
    return E(`${both} cost ₹${s} together. ${cap1(big)} costs ₹${d} more than ${small}. How much does ${big} cost?`, nums(ans, [y, s - d, Math.floor(s / 2)], rupees), `Take away the extra first: ₹${s} − ₹${d} = ₹${s - d}. That is 2 equal parts, so ${small} costs ₹${s - d} ÷ 2 = ₹${y}. ${cap1(big)} costs ₹${y} + ₹${d} = ₹${ans}.`, F(["", `${s} − ${d}`, `${s - d}`], ["", "÷ 2", `₹${y}`], ["", bw, `₹${ans}`, 1]));
  });

  // 26. Measurement (m and cm, L and mL).
  fam(15, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const m = ri(2, 5), c = pick([15, 20, 25, 30, 35, 40, 45]), p = ri(2, Math.floor(100 * m / c) - 1), ans = 100 * m - p * c; return E(`A ribbon is ${m} m long. Meera cuts ${p} pieces from it, each ${c} cm long. How many centimetres of ribbon are left?`, nums(ans, [m * 10 - p * c > 0 ? m * 10 - p * c : ans + 100, p * c, ans + c]), `${m} m = ${100 * m} cm. Pieces: ${p} × ${c} = ${p * c} cm. Left: ${100 * m} − ${p * c} = ${ans} cm.`, F(["📏", `${m} m`, `${100 * m} cm`], ["✂️", `${p} × ${c}`, `${p * c} cm`], ["", "Left", `${ans} cm`, 1])); }
    if (kind === 1) { const a = ri(1, 4), b = ri(15, 85), c = ri(1, 3), d = ri(100 - b + 5, 95), cm = b + d, ans = `${a + c + 1} m ${cm - 100} cm`; return E(`Add these lengths: ${a} m ${b} cm + ${c} m ${d} cm`, sopt(ans, [`${a + c} m ${cm} cm`, `${a + c} m ${cm - 100} cm`, `${a + c + 1} m ${cm - 90} cm`, `${a + c + 2} m ${cm - 100} cm`]), `Centimetres: ${b} + ${d} = ${cm} cm = 1 m ${cm - 100} cm. Metres: ${a} + ${c} + 1 = ${a + c + 1} m. Total: ${ans}.`, F(["", `${b} + ${d} cm`, `1 m ${cm - 100} cm`], ["", `${a} + ${c} + 1`, `${a + c + 1} m`], ["", "Total", ans, 1])); }
    const L = ri(2, 5), mug = pick([200, 250, 500]), k = ri(2, 3), ans = k * L * 1000 / mug;
    return E(`A bucket holds ${L} litres of water. A mug holds ${mug} mL. How many mugs of water are needed to fill ${k} buckets?`, nums(ans, [L * 1000 / mug, k * L, ans + k]), `1 litre = 1000 mL, so 1 bucket = ${L * 1000} mL = ${L * 1000 / mug} mugs (${L * 1000} ÷ ${mug}). ${k} buckets: ${k} × ${L * 1000 / mug} = ${ans} mugs.`, F(["🪣", `${L} L`, `${L * 1000} mL`], ["", `÷ ${mug}`, `${L * 1000 / mug} mugs`], ["", `× ${k}`, `${ans} mugs`, 1]));
  });

  // 27. Fractions of a collection.
  fam(12, E => {
    const [p, q] = pickN(KIDS, 2);
    if (ri(0, 1)) { const n = 8 * ri(2, 8), a = n / 4, rest = n - a, b = rest / 2, ans = rest - b; return E(`${p} had ${n} sweets. ${p} ate a quarter of them and then gave half of the rest to ${q}. How many sweets does ${p} have left?`, nums(ans, [n / 2, n - a, n - a - n / 2]), `A quarter of ${n} is ${n} ÷ 4 = ${a}. Rest: ${n} − ${a} = ${rest}. Half of ${rest} is ${b}. Left: ${rest} − ${b} = ${ans}.`, F(["🍬", `${n} ÷ 4`, `ate ${a}`], ["", `${n} − ${a}`, `${rest}`], ["", `half of ${rest}`, `${ans} left`, 1])); }
    const n = 6 * ri(2, 9), a = n / 3, rest = n - a, ans = rest / 2;
    return E(`There were ${n} children in a park. One third of them went home. Half of those who stayed went to the swings. How many children went to the swings?`, nums(ans, [n / 2, n / 3, n / 6]), `One third of ${n} is ${a}, so ${n} − ${a} = ${rest} stayed. Half of ${rest} is ${ans}.`, F(["", `${n} ÷ 3`, `${a} went home`], ["", `${n} − ${a}`, `${rest} stayed`], ["", `${rest} ÷ 2`, `${ans}`, 1]));
  });

  // 28. Compare expressions.
  fam(12, E => {
    const mk = () => { const k = ri(0, 4), a = ri(3, 9), b = ri(3, 9), c = ri(2, 15); return k === 0 ? [`${a} × ${b}`, a * b] : k === 1 ? [`${a} × ${b} − ${c}`, a * b - c] : k === 2 ? [`${a * b} ÷ ${a} + ${c}`, b + c] : k === 3 ? [`${a} + ${a} + ${a} + ${b}`, 3 * a + b] : [`${10 * a} − ${b} × ${c % 5 + 2}`, 10 * a - b * (c % 5 + 2)]; };
    const ex = Array.from({ length: 4 }, mk), vals = ex.map(x => x[1]);
    if (new Set(vals).size < 4 || vals.some(v => v <= 0) || new Set(ex.map(x => x[0].replace(/\d+/g, ""))).size < 3) return false;
    const big = ri(0, 1), t = big ? Math.max(...vals) : Math.min(...vals), i = vals.indexOf(t);
    return E(`Which of these has the ${big ? "greatest" : "smallest"} value? (Do × and ÷ before + and −.)`, [ex[i][0], ...ex.filter((_, j) => j !== i).map(x => x[0])], `Work out each one: ${ex.map(x => `${x[0]} = ${x[1]}`).join("; ")}. The ${big ? "greatest" : "smallest"} is ${t}.`, { t: "bars", items: ex.map((x, j) => [String.fromCharCode(65 + j), x[1]]), hl: i });
  });

  // 29. Regrouping place value.
  fam(14, E => {
    const h = ri(2, 7), t = ri(11, 25), o = ri(11, 29), ans = h * 100 + t * 10 + o;
    if (ans > 999) return false;
    if (ri(0, 1)) return E(`Which number is ${h} hundreds + ${t} tens + ${o} ones?`, nums(ans, [h * 100 + t + o, ans + 100, ans - 10]), `${h} hundreds = ${h * 100}. ${t} tens = ${t * 10}. ${o} ones = ${o}. Add them: ${h * 100} + ${t * 10} + ${o} = ${ans}.`, F(["", `${h} hundreds`, `${h * 100}`], ["", `${t} tens`, `${t * 10}`], ["", `${o} ones`, `${o}`], ["", "Total", `${ans}`, 1]));
    const hh = Math.floor(ans / 100) - 1, rest = ans - hh * 100, oo = ans % 10, tt = (rest - oo) / 10;
    return E(`Fill in the box: ${ans} = ${hh} hundreds + ☐ tens + ${oo} one${oo === 1 ? "" : "s"}`, nums(tt, [Math.floor(ans / 10) % 10, tt + 1, tt - 10]), `${hh} hundreds = ${hh * 100}. ${ans} − ${hh * 100} − ${oo} = ${tt * 10}, and ${tt * 10} is ${tt} tens.`, F(["", `${ans} − ${hh * 100} − ${oo}`, `${tt * 10}`], ["", `${tt * 10} ÷ 10`, `${tt} tens`, 1]));
  });

  // 30. Gaps and posts.
  fam(14, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const g = pick([2, 3, 4, 5, 10]), n = ri(4, 12), d = g * n, ans = n + 1; return E(`Trees are planted along one side of a ${d} m long road, one every ${g} m. There is a tree at the start and one at the end. How many trees are there?`, nums(ans, [n, n - 1, ans + 1]), `There are ${d} ÷ ${g} = ${n} gaps. With a tree at both ends, trees = gaps + 1 = ${ans}.`, { t: "seq", items: ["🌳", `${g} m`, "🌳", "…", "🌳"], hl: 4 }); }
    if (kind === 1) { const g = pick([2, 3, 4, 5]), n = ri(6, 15), d = g * n; return E(`Flower pots are placed all around a round pond, ${g} m apart. The path around the pond is ${d} m long. How many pots are there?`, nums(n, [n + 1, n - 1, d]), `In a closed circle the number of pots equals the number of gaps: ${d} ÷ ${g} = ${n}. (There is no extra pot because the last gap ends at the first pot.)`, C(["🪴", `${d} ÷ ${g}`, `${n} gaps = ${n} pots`, 1])); }
    const p = ri(4, 9), t = ri(2, 6), ans = (p - 1) * t;
    return E(`It takes ${t} minutes to make one cut in a log. How long will it take to cut the log into ${p} pieces?`, nums(ans, [p * t, (p + 1) * t, ans + 1]), `${p} pieces need only ${p} − 1 = ${p - 1} cuts. ${p - 1} × ${t} = ${ans} minutes.`, F(["🪵", `${p} pieces`, `${p - 1} cuts`], ["", `${p - 1} × ${t}`, `${ans} minutes`, 1]));
  });

  // 31. Snail in a well.
  const CLIMB = [["A snail", "a wall"], ["A frog", "a well"], ["An ant", "a pole"], ["A monkey", "a greased pole"]];
  fam(10, E => {
    const [who, what] = pick(CLIMB), u = ri(3, 6), s = ri(1, u - 2), H = ri(u + 4, 20), net = u - s, ans = Math.ceil((H - u) / net) + 1;
    if (Math.ceil(H / net) === ans) return false;
    return E(`${who} climbs ${what} ${H} m high. Each day it climbs up ${u} m, and each night it slips down ${s} m. On which day does it reach the top?`, sopt(`Day ${ans}`, [`Day ${Math.ceil(H / net)}`, `Day ${ans - 1}`, `Day ${ans + 1}`, `Day ${ans + 2}`]), `Each full day and night it goes up ${u} − ${s} = ${net} m. On the last day it climbs ${u} m and does not slip back. After ${ans - 1} day${ans - 1 > 1 ? "s" : ""} and nights it is at ${(ans - 1) * net} m. On day ${ans} it climbs ${u} m to reach ${(ans - 1) * net + u} m, which is at least ${H} m.`, F(["🌙", `${ans - 1} × ${net}`, `${(ans - 1) * net} m`], ["☀️", `+ ${u}`, `${(ans - 1) * net + u} m ≥ ${H} m`], ["", "Top", `Day ${ans}`, 1]));
  });

  // 32. Repeating patterns.
  const PAT = [["🔴", "🔵", "🟢", "🟡", "🟣"], ["⭐", "🌙", "☀️", "☁️", "⚡"], ["A", "B", "C", "D", "E"], ["🍎", "🍌", "🍇", "🍊", "🍓"]];
  const UNITS = ["ABB", "AAB", "ABC", "ABCC", "AABC", "ABBC", "ABCD", "AABB"];
  fam(14, E => {
    const set = pick(PAT), u = pick(UNITS).split("").map(c => set["ABCD".indexOf(c)]), n = ri(17, 50), L = u.length, r = (n - 1) % L;
    const shown = Array.from({ length: L * 2 + 1 }, (_, i) => u[i % L]).join(" ");
    if (ri(0, 1)) { const ans = u[r]; return E(`This pattern keeps repeating:\n${shown} …\nWhat is the ${ord(n)} item?`, [ans, ...set.filter(x => x !== ans).slice(0, 4).filter((x, i, a) => i < 3)], `The pattern repeats every ${L} items. ${n} = ${L} × ${Math.floor((n - 1) / L)} + ${r + 1}, so the ${ord(n)} item is the same as item ${r + 1} of the pattern: ${ans}.`, { t: "seq", items: u, hl: r }); }
    const ic = pick([...new Set(u)]), per = u.filter(x => x === ic).length, full = Math.floor(n / L), part = u.slice(0, n % L).filter(x => x === ic).length, ans = full * per + part;
    return E(`This pattern keeps repeating:\n${shown} …\nHow many times does ${ic} appear in the first ${n} items?`, nums(ans, [full * per, Math.round(n / L), ans + 1]), `Each group of ${L} has ${per} ${ic}. ${n} items = ${full} full groups and ${n % L} more. ${full} × ${per} = ${full * per}, plus ${part} in the extra ${n % L}: ${ans}.`, { t: "seq", items: u, hl: u.indexOf(ic) });
  });

  // 33. Paying with notes and coins.
  fam(12, E => {
    const [p] = pickN(KIDS, 1), a = ri(2, 4), b = ri(2, 5), c = ri(3, 9), have = a * 50 + b * 20 + c * 5, cost = ri(60, have - 15), ans = have - cost;
    return E(`${p} has ${a} notes of ₹50, ${b} notes of ₹20 and ${c} coins of ₹5. ${p} buys a book for ₹${cost}. How much money is left?`, nums(ans, [a * 50 + b * 20 + c - cost, have - cost + 10, have], rupees), `Money: ${a} × 50 = ₹${a * 50}, ${b} × 20 = ₹${b * 20}, ${c} × 5 = ₹${c * 5}. Total ₹${have}. Left: ₹${have} − ₹${cost} = ₹${ans}.`, F(["💵", "Has", `₹${have}`], ["📕", "Spends", `₹${cost}`], ["", "Left", `₹${ans}`, 1]));
  });

  // 34. Saving every day vs every week.
  fam(12, E => {
    const [p, q] = pickN(KIDS, 2), d = ri(3, 9), w = ri(10, 40), k = ri(2, 4), A = 7 * d * k, B = w * k;
    if (A === B) return false;
    const more = A > B ? p : q, ans = Math.abs(A - B);
    return E(`${p} saves ₹${d} every day. ${q} saves ₹${w} every week. After ${k} weeks, who has saved more, and by how much?`, sopt(`${more}, by ₹${ans}`, [`${more === p ? q : p}, by ₹${ans}`, `${more}, by ₹${Math.abs(d * k - B) || ans + 7}`, `${more}, by ₹${ans + 7}`, `${more}, by ₹${Math.abs(7 * d - w)}`]), `In 1 week ${p} saves 7 × ₹${d} = ₹${7 * d}. In ${k} weeks: ${p} ₹${A}, ${q} ${k} × ₹${w} = ₹${B}. Difference: ₹${ans}, so ${more} has saved more.`, F(["", p, `₹${A}`], ["", q, `₹${B}`], ["", more, `+₹${ans}`, 1]));
  });
};

X[4].imo = Q => {
  const fam = runner(Q);

  // 1. Bells ringing together (LCM).
  fam(14, E => {
    const [a, b, c] = pickN([4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30], 3).sort((x, y) => x - y), L = lcm(a, b, c);
    if (L > 180 || L === c || L === a * b * c) return false;
    const s = ri(7, 10) * 60 + pick([0, 15, 30]);
    if (ri(0, 1)) return E(`Three bells ring every ${a}, ${b} and ${c} minutes. They ring together at ${t12(s)}. When will they next ring together?`, sopt(t12(s + L), [t12(s + lcm(a, b)), t12(s + a + b + c), t12(s + L + 60), t12(s + 2 * L)]), `They ring together after the LCM of ${a}, ${b} and ${c}, which is ${L} minutes (${hm(L)}). ${t12(s)} + ${hm(L)} = ${t12(s + L)}.`, F(["🔔", `LCM(${a}, ${b}, ${c})`, `${L} min`], ["", t12(s), `+ ${hm(L)}`], ["", "Together", t12(s + L), 1]));
    const hrs = ri(4, 8), ans = Math.floor(hrs * 60 / L) + 1;
    return E(`Three lights flash every ${a}, ${b} and ${c} minutes. They flash together at ${t12(s)}. How many times will they flash together from ${t12(s)} to ${t12(s + hrs * 60)}, counting the first time?`, nums(ans, [ans - 1, ans + 1, Math.floor(hrs * 60 / c)]), `They flash together every LCM(${a}, ${b}, ${c}) = ${L} minutes. ${hrs} hours = ${hrs * 60} minutes. ${hrs * 60} ÷ ${L} = ${Math.floor(hrs * 60 / L)} more times after the first, so ${ans} in all.`, F(["💡", "LCM", `${L} min`], ["", `${hrs * 60} ÷ ${L}`, `${Math.floor(hrs * 60 / L)}`], ["", "+ first", `${ans}`, 1]));
  });

  // 2. Cutting into the longest equal pieces (HCF).
  fam(14, E => {
    const h = pick([4, 5, 6, 8, 9, 12, 15, 18]), m = pickN(range(2, 9), ri(2, 3)).sort((x, y) => x - y);
    if (gcd(...[m.reduce((x, y) => gcd(x, y))]) !== 1 || m.reduce((x, y) => gcd(x, y)) !== 1) return false;
    const L = m.map(x => x * h), tot = m.reduce((s, x) => s + x, 0), words = L.map(x => `${x} m`).join(L.length === 3 ? ", " : " and ").replace(/, (\d+ m)$/, " and $1");
    if (ri(0, 1)) return E(`Ropes of lengths ${words} are cut into pieces that are all the same length, with nothing left over. The pieces are as long as possible. How many pieces are there in all?`, nums(tot, [h, tot * 2, L.reduce((s, x) => s + x) / m[0]]), `The piece length is the HCF of ${L.join(", ")}, which is ${h} m. Pieces: ${L.map(x => `${x} ÷ ${h} = ${x / h}`).join(", ")}. Total: ${tot}.`, F(["🧵", "HCF", `${h} m`], ...L.map(x => ["", `${x} ÷ ${h}`, `${x / h}`]), ["", "Total", `${tot}`, 1]));
    const small = factors(h).filter(f => f > 1 && f < h);
    return E(`A shopkeeper has ${words} of cloth. He wants to cut all of it into equal pieces with nothing left over. What is the greatest possible length of each piece?`, sopt(`${h} m`, [`${small.length ? small[small.length - 1] : h * 2} m`, `${L[0]} m`, `${lcm(...L) > 999 ? h * 3 : lcm(...L)} m`, `${h * 2} m`, `${h + 1} m`]), `The length must divide every piece exactly, and be as large as possible: that is the HCF. ${L.map(x => `${x} = ${x / h} × ${h}`).join(", ")}. HCF = ${h} m.`, C(...L.map(x => ["", `${x} m`, `${x / h} × ${h}`]), ["", "HCF", `${h} m`, 1]));
  });

  // 3. Remainder problems (LCM + r, HCF of differences).
  fam(12, E => {
    if (ri(0, 1)) { const ds = pickN([4, 6, 8, 9, 10, 12, 15], 3).sort((x, y) => x - y), L = lcm(...ds), r = ri(1, ds[0] - 1); if (L > 400) return false; return E(`What is the smallest number that leaves a remainder of ${r} when divided by ${ds[0]}, by ${ds[1]} and by ${ds[2]}?`, nums(L + r, [L, L - r, 2 * L + r]), `A number that ${ds.join(", ")} all divide exactly is the LCM: ${L}. Add the remainder: ${L} + ${r} = ${L + r}. Check: ${L + r} ÷ ${ds[2]} = ${Math.floor((L + r) / ds[2])} remainder ${r}.`, F(["", `LCM(${ds.join(", ")})`, `${L}`], ["", `+ ${r}`, `${L + r}`, 1])); }
    const h = ri(7, 19), a = h * ri(3, 9), b = h * ri(10, 15), r = ri(2, h - 1);
    if (gcd(a, b) !== h) return false;
    return E(`What is the greatest number that divides ${a + r} and ${b + r} and leaves a remainder of ${r} each time?`, nums(h, [gcd(a + r, b + r), r, h * 2]), `Take away the remainder: ${a + r} − ${r} = ${a} and ${b + r} − ${r} = ${b}. The answer must divide both exactly: HCF(${a}, ${b}) = ${h}. It is bigger than ${r}, so it works.`, F(["", `${a + r} − ${r}`, `${a}`], ["", `${b + r} − ${r}`, `${b}`], ["", "HCF", `${h}`, 1]));
  });

  // 4. Fractions with unlike denominators.
  fam(14, E => {
    if (ri(0, 2)) {
      const [b, d] = pickN([2, 3, 4, 5, 6, 8, 10, 12], 2), a = ri(1, b - 1), c = ri(1, d - 1), L = lcm(b, d), n = a * L / b + c * L / d;
      if (n >= L || gcd(a, b) > 1 || gcd(c, d) > 1 || b === d) return false;
      const [p, q] = pickN(KIDS, 2), ans = fr(L - n, L);
      return E(`${p} ate ${a}/${b} of a cake and ${q} ate ${c}/${d} of it. What fraction of the cake is left?`, sopt(ans, [fr(n, L), `${b + d - a - c}/${b + d}`, fr(L - n + 1, L), fr(L - n - 1 || L - n + 2, L)]), `Use the same denominator ${L}: ${a}/${b} = ${a * L / b}/${L} and ${c}/${d} = ${c * L / d}/${L}. Eaten: ${n}/${L}. Left: ${L}/${L} − ${n}/${L} = ${L - n}/${L}${fr(L - n, L) !== `${L - n}/${L}` ? ` = ${ans}` : ""}.`, { t: "frac", n: L - n, d: L });
    }
    const pool = [[1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [5, 8], [7, 8], [7, 10], [7, 12], [5, 12], [2, 5], [4, 7], [5, 7], [3, 8], [5, 9], [7, 9]];
    const four = pickN(pool, 4), v = four.map(([a, b]) => a / b);
    if (new Set(v).size < 4) return false;
    const big = ri(0, 1), t = big ? Math.max(...v) : Math.min(...v), i = v.indexOf(t), s = four.map(([a, b]) => `${a}/${b}`);
    const L = lcm(...four.map(x => x[1]));
    if (L > 120) return false;
    return E(`Which fraction is the ${big ? "greatest" : "smallest"}?`, [s[i], ...s.filter((_, j) => j !== i)], `Change them to the same denominator ${L}: ${four.map(([a, b]) => `${a}/${b} = ${a * L / b}/${L}`).join(", ")}. The ${big ? "greatest" : "smallest"} is ${s[i]}.`, { t: "bars", items: four.map(([a, b]) => [`${a}/${b}`, Math.round(a / b * 100)]), hl: i });
  });

  // 5. Fraction of a quantity in two steps.
  const FRS = [[1, 3], [1, 4], [2, 5], [1, 5], [3, 8], [1, 6], [2, 3], [3, 4]];
  fam(14, E => {
    const [a, b] = pick(FRS), [c, d] = pick(FRS), T = lcm(b, d) * b * ri(1, 4) * 5;
    const s1 = T * a / b, rest = T - s1, s2 = rest * c / d, left = rest - s2;
    if (!Number.isInteger(s2) || left <= 0 || T > 9000) return false;
    const p = pick(GIRLS);
    if (ri(0, 1)) return E(`${p} had ₹${N(T)}. ${p} spent ${a}/${b} of it on books and then ${c}/${d} of the remaining money on a bag. How much money is left?`, nums(left, [T - s1 - T * c / d, rest, s2], rupees), `Books: ${a}/${b} of ₹${N(T)} = ₹${N(s1)}. Remaining: ₹${N(rest)}. Bag: ${c}/${d} of ₹${N(rest)} = ₹${N(s2)}. Left: ₹${N(rest)} − ₹${N(s2)} = ₹${N(left)}.`, F(["📚", `${a}/${b} of ${N(T)}`, `₹${N(s1)}`], ["🎒", `${c}/${d} of ${N(rest)}`, `₹${N(s2)}`], ["", "Left", `₹${N(left)}`, 1]));
    return E(`${p} spent ${a}/${b} of her money on a dress and ${c}/${d} of what remained on shoes. She now has ₹${N(left)} left. How much money did she have at first?`, nums(T, [rest, left * b, left * d], rupees), `After the dress, ${b - a}/${b} remained. After the shoes, ${d - c}/${d} of that remained, so ₹${N(left)} is ${d - c}/${d} of ₹${N(rest)}: ₹${N(left)} ÷ ${d - c} × ${d} = ₹${N(rest)}. That is ${b - a}/${b} of the start: ₹${N(rest)} ÷ ${b - a} × ${b} = ₹${N(T)}.`, F(["", "Left", `₹${N(left)}`], ["", `÷ ${d - c} × ${d}`, `₹${N(rest)}`], ["", `÷ ${b - a} × ${b}`, `₹${N(T)}`, 1]));
  });

  // 6. Decimals and money.
  const rs = p => `₹${(p / 100).toFixed(2)}`;
  const DITEMS = ["pen", "notebook", "ruler", "file", "marker", "glue stick"];
  fam(14, E => {
    const [x, y] = pickN(DITEMS, 2), pa = ri(8, 40) * 100 + pick([25, 50, 75]), pb = ri(15, 60) * 100 + pick([25, 50, 75]), na = ri(2, 4), nb = ri(2, 3), cost = na * pa + nb * pb, paid = cost < 20000 ? 20000 : 50000, ans = paid - cost;
    if (cost >= 50000) return false;
    return E(`A ${x} costs ${rs(pa)} and a ${y} costs ${rs(pb)}. Kabir buys ${na} ${x}s and ${nb} ${y}s and pays with a ₹${paid / 100} note. How much change does he get?`, nums(ans, [paid - na * pa - pb, ans + 100, ans - 50], rs), `${na} × ${rs(pa)} = ${rs(na * pa)}. ${nb} × ${rs(pb)} = ${rs(nb * pb)}. Total ${rs(cost)}. Change: ₹${paid / 100}.00 − ${rs(cost)} = ${rs(ans)}.`, F(["", `${na} ${x}s`, rs(na * pa)], ["", `${nb} ${y}s`, rs(nb * pb)], ["", "Change", rs(ans), 1]));
  });

  // 7. Unitary method.
  const UNIT = [["pens", "₹", "cost"], ["kg of rice", "₹", "cost"], ["notebooks", "₹", "cost"]];
  fam(14, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const [it] = pick(UNIT), u = ri(7, 48), a = ri(3, 9), b = ri(11, 25); if (a === b) return false; return E(`${a} ${it} cost ₹${a * u}. What will ${b} ${it} cost?`, nums(b * u, [a * u + b, b * u + u, a * u * b / 2 | 0], rupees), `First find 1: ₹${a * u} ÷ ${a} = ₹${u}. Then ${b} × ₹${u} = ₹${b * u}.`, F(["", `${a} ${it}`, `₹${a * u}`], ["", "1", `₹${u}`], ["", `${b} ${it}`, `₹${N(b * u)}`, 1])); }
    if (kind === 1) { const k = ri(9, 18), a = ri(3, 9), b = ri(10, 20); return E(`A car uses ${a} litres of petrol to travel ${a * k} km. How many litres will it need to travel ${b * k} km?`, nums(b, [b * k / a | 0, b + a, b - 1]), `1 litre takes the car ${a * k} ÷ ${a} = ${k} km. ${b * k} ÷ ${k} = ${b} litres.`, F(["⛽", `${a} L`, `${a * k} km`], ["", "1 L", `${k} km`], ["", `${b * k} km`, `${b} L`, 1])); }
    const per = ri(3, 8), m = ri(4, 9), d = ri(3, 7), m2 = ri(10, 15);
    return E(`${m} machines make ${N(m * per * d * 10)} toys in ${d} days. How many toys will ${m2} machines make in ${d + 2} days?`, nums(m2 * per * (d + 2) * 10, [m2 * per * d * 10, m * per * (d + 2) * 10, m2 * per * (d + 2) * 10 + 100]), `1 machine in 1 day: ${N(m * per * d * 10)} ÷ ${m} ÷ ${d} = ${per * 10} toys. ${m2} machines in ${d + 2} days: ${per * 10} × ${m2} × ${d + 2} = ${N(m2 * per * (d + 2) * 10)}.`, F(["", "1 machine, 1 day", `${per * 10}`], ["", `× ${m2} × ${d + 2}`, `${N(m2 * per * (d + 2) * 10)}`, 1]));
  });

  // 8. Speed, distance and time.
  fam(15, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const v = ri(3, 8) * 10, t1 = ri(2, 4), T2 = ri(5, 13), d2 = v * T2 / 2, mins = T2 * 30; return E(`A car travels ${v * t1} km in ${t1} hours. At the same speed, how long will it take to travel ${d2} km?`, sopt(hm(mins), [hm(Math.floor(T2 / 2) * 60 + 50), hm(mins + 30), hm(mins - 30), hm(mins + 60)]), `Speed = ${v * t1} ÷ ${t1} = ${v} km/h. Time = ${d2} ÷ ${v} = ${T2 / 2} hours = ${hm(mins)}.${T2 % 2 ? " (Half an hour is 30 minutes, not 50!)" : ""}`, F(["🚗", "Speed", `${v} km/h`], ["", `${d2} ÷ ${v}`, `${T2 / 2} h`], ["", "Time", hm(mins), 1])); }
    if (kind === 1) { const v = pick([40, 48, 60, 72, 80]), k = ri(5, 18), mins = 15 * k, D = v * mins / 60, s = ri(6, 11) * 60 + pick([0, 15, 30, 45]); if (!Number.isInteger(D)) return false; return E(`A bus leaves at ${t12(s)} and travels ${D} km at ${v} km per hour. At what time does it arrive?`, sopt(t12(s + mins), [t12(s + mins + 30), t12(s + Math.floor(D / v) * 60 + D % v), t12(s + mins - 15), t12(s + mins + 60)]), `Time = ${D} ÷ ${v} hours = ${hm(mins)} (because ${v} km takes 60 minutes, ${D} km takes ${D} ÷ ${v} × 60 = ${mins} minutes). ${t12(s)} + ${hm(mins)} = ${t12(s + mins)}.`, F(["🚌", t12(s), "leaves"], ["", `${D} ÷ ${v}`, hm(mins)], ["", "Arrives", t12(s + mins), 1])); }
    const m = ri(2, 9) * 50, ans = m * 60 / 1000;
    return E(`A cyclist covers ${m} metres every minute. What is the speed in km per hour?`, nums(ans, [ans * 10, m / 10, ans + 6], x => x + " km/h"), `In 1 hour (60 minutes): ${m} × 60 = ${N(m * 60)} m. ${N(m * 60)} m ÷ 1000 = ${ans} km. So ${ans} km/h.`, F(["🚴", "1 min", `${m} m`], ["", "60 min", `${N(m * 60)} m`], ["", "Speed", `${ans} km/h`, 1]));
  });

  // 9. Averages.
  fam(15, E => {
    const kind = ri(0, 3);
    if (kind === 0) { const A = ri(15, 40), x = ri(5, 60), rest = 5 * A - x; if (rest % 4 || rest <= 0) return false; const ans = rest / 4; return E(`The average of 5 numbers is ${A}. One of the numbers is ${x}. What is the average of the other 4 numbers?`, nums(ans, [A, (5 * A + x) / 4 | 0, ans + 5]), `Total of 5 numbers = 5 × ${A} = ${5 * A}. Take away ${x}: ${5 * A - x}. Average of 4 = ${5 * A - x} ÷ 4 = ${ans}.`, F(["", `5 × ${A}`, `${5 * A}`], ["", `− ${x}`, `${rest}`], ["", "÷ 4", `${ans}`, 1])); }
    if (kind === 1) { const M = ri(60, 80), M2 = M + ri(2, 4), need = 5 * M2 - 4 * M; if (need > 100) return false; return E(`Riya's average in 4 tests is ${M}. What must she score in the 5th test so that her average for all 5 tests becomes ${M2}?`, nums(need, [M2, M2 + (M2 - M), 5 * M2 - 4 * M2 + 4]), `She needs a total of 5 × ${M2} = ${5 * M2}. She has 4 × ${M} = ${4 * M}. Needed: ${5 * M2} − ${4 * M} = ${need}.`, F(["", "Need total", `${5 * M2}`], ["", "Has", `${4 * M}`], ["", "5th test", `${need}`, 1])); }
    if (kind === 2) { const a = ri(5, 25) * 2 + 1, n = ri(6, 15), L = a + 2 * (n - 1), ans = (a + L) / 2; return E(`What is the average of all the odd numbers from ${a} to ${L}?`, nums(ans, [ans + 1, ans - 1, (L - a) / 2]), `The numbers are equally spaced, so the average is halfway between the first and last: (${a} + ${L}) ÷ 2 = ${ans}.`, { t: "numline", from: a, to: L, mark: ans, every: 2 }); }
    const n = ri(20, 40), A = ri(9, 12), B = A + 1, ans = (n + 1) * B - n * A;
    return E(`The average age of ${n} students is ${A} years. When the teacher's age is included, the average becomes ${B} years. How old is the teacher?`, nums(ans, [B, n + B, ans - B]), `Students' total = ${n} × ${A} = ${n * A}. With the teacher: ${n + 1} × ${B} = ${(n + 1) * B}. Teacher = ${(n + 1) * B} − ${n * A} = ${ans} years.`, F(["", `${n} × ${A}`, `${n * A}`], ["", `${n + 1} × ${B}`, `${(n + 1) * B}`], ["", "Teacher", `${ans}`, 1]));
  });

  // 10. Ratio.
  fam(12, E => {
    const p = ri(2, 7), q = ri(2, 9), u = ri(4, 25);
    if (gcd(p, q) !== 1 || p === q) return false;
    const [A, B] = pickN(KIDS, 2), kind = ri(0, 2);
    if (kind === 0) return E(`₹${N((p + q) * u * 10)} is shared between ${A} and ${B} in the ratio ${p} : ${q}. How much does ${B} get?`, nums(q * u * 10, [p * u * 10, (p + q) * u * 10 / 2 | 0, q * u * 10 + u * 10], rupees), `Total parts = ${p} + ${q} = ${p + q}. 1 part = ₹${N((p + q) * u * 10)} ÷ ${p + q} = ₹${u * 10}. ${B} gets ${q} × ₹${u * 10} = ₹${N(q * u * 10)}.`, F(["", "Parts", `${p + q}`], ["", "1 part", `₹${u * 10}`], ["", B, `₹${N(q * u * 10)}`, 1]));
    if (kind === 1) return E(`In a school, the ratio of boys to girls is ${p} : ${q}. There are ${q * u} girls. How many students are there in all?`, nums((p + q) * u, [p * u, q * u + p, (p + q) * u + u]), `${q} parts = ${q * u} girls, so 1 part = ${u}. Total = ${p + q} parts = ${(p + q) * u} students.`, F(["", `${q} parts`, `${q * u}`], ["", "1 part", `${u}`], ["", `${p + q} parts`, `${(p + q) * u}`, 1]));
    if (p <= q) return false;
    return E(`The ratio of ${A}'s stamps to ${B}'s stamps is ${p} : ${q}. ${A} has ${(p - q) * u} more stamps than ${B}. How many stamps do they have together?`, nums((p + q) * u, [(p - q) * u * 2, p * u, (p + q) * u + p - q]), `The difference is ${p} − ${q} = ${p - q} part${p - q > 1 ? "s" : ""} = ${(p - q) * u}, so 1 part = ${u}. Together: ${p + q} parts = ${(p + q) * u}.`, F(["", `${p - q} part${p - q > 1 ? "s" : ""}`, `${(p - q) * u}`], ["", "1 part", `${u}`], ["", `${p + q} parts`, `${(p + q) * u}`, 1]));
  });

  // 11. Percentages.
  fam(15, E => {
    const kind = ri(0, 3);
    if (kind === 0) { const p = pick([10, 20, 25, 50, 40]), q = pick([10, 20, 25, 50, 75]), n = pick([400, 800, 1200, 1600, 2000, 2400]), mid = n * q / 100, ans = mid * p / 100; if (!Number.isInteger(ans)) return false; return E(`What is ${p}% of ${q}% of ${N(n)}?`, nums(ans, [n * (p + q) / 100, mid, ans * 10]), `${q}% of ${N(n)} = ${N(mid)}. Then ${p}% of ${N(mid)} = ${N(ans)}.`, F(["", `${q}% of ${N(n)}`, N(mid)], ["", `${p}% of ${N(mid)}`, N(ans), 1])); }
    if (kind === 1) { const P = ri(4, 30) * 100, d = pick([10, 20, 25, 30]), e = pick([10, 20]), s1 = P * (100 - d) / 100, ans = s1 * (100 - e) / 100; if (!Number.isInteger(ans)) return false; return E(`A jacket costs ₹${N(P)}. The shop gives ${d}% off, and then a further ${e}% off the new price. What is the final price?`, nums(ans, [P * (100 - d - e) / 100, s1, ans + 100], rupees), `${d}% of ₹${N(P)} = ₹${N(P * d / 100)}, so the new price is ₹${N(s1)}. ${e}% of ₹${N(s1)} = ₹${N(s1 * e / 100)}. Final: ₹${N(ans)}. (It is not the same as ${d + e}% off!)`, F(["🧥", "Price", `₹${N(P)}`], ["", `− ${d}%`, `₹${N(s1)}`], ["", `− ${e}%`, `₹${N(ans)}`, 1])); }
    if (kind === 2) { const n = pick([20, 25, 40, 50, 60]), g = pick([20, 30, 35, 40, 45, 55, 60, 65]), girls = n * g / 100; if (!Number.isInteger(girls)) return false; return E(`There are ${n} students in a class and ${g}% of them are girls. How many boys are there?`, nums(n - girls, [girls, 100 - g, n - girls + 1]), `${g}% of ${n} = ${g}/100 × ${n} = ${girls} girls. Boys: ${n} − ${girls} = ${n - girls}.`, F(["👧", `${g}% of ${n}`, `${girls}`], ["👦", `${n} − ${girls}`, `${n - girls}`, 1])); }
    const tot = pick([20, 25, 40, 50, 80]), sc = ri(Math.ceil(tot / 2), tot - 1), ans = sc * 100 / tot; if (!Number.isInteger(ans)) return false;
    return E(`Aman scored ${sc} out of ${tot} in a test. What is his score as a percentage?`, nums(ans, [sc, ans - 5, 100 - ans], x => x + "%"), `Make the total 100: ${sc}/${tot} = ${sc * 100 / tot}/100 (multiply top and bottom by ${100 / tot}). So it is ${ans}%.`, F(["", `${sc}/${tot}`, `× ${100 / tot}`], ["", `${ans}/100`, `${ans}%`, 1]));
  });

  // 12. L-shapes (composite area and perimeter).
  fam(14, E => {
    const W = ri(8, 16), H = ri(6, 12), w = ri(2, W - 3), h = ri(2, H - 3);
    if (ri(0, 1)) { const ans = W * H - w * h; return E(`A rectangular card is ${W} cm long and ${H} cm wide. A rectangle ${w} cm by ${h} cm is cut out from one corner. What is the area of the card that is left?`, nums(ans, [W * H, W * H - (w + h), ans + w], x => x + " sq cm"), `Whole card: ${W} × ${H} = ${W * H} sq cm. Cut piece: ${w} × ${h} = ${w * h} sq cm. Left: ${W * H} − ${w * h} = ${ans} sq cm.`, { t: "rect", w: W, h: H }); }
    const ans = 2 * (W + H);
    return E(`A rectangular card is ${W} cm long and ${H} cm wide. A rectangle ${w} cm by ${h} cm is cut out from one corner. What is the perimeter of the L-shaped card that is left?`, nums(ans, [ans - 2 * (w + h), ans + 2 * (w + h), ans - (w + h)], x => x + " cm"), `Cutting a corner moves two sides inward but does not change their total length. The perimeter stays 2 × (${W} + ${H}) = ${ans} cm.`, { t: "rect", w: W, h: H });
  });

  // 13. Paths and fences around gardens.
  fam(14, E => {
    const L = ri(12, 40), B = ri(8, L - 2), p = ri(1, 3), kind = ri(0, 2);
    if (kind === 0) { const ans = (L + 2 * p) * (B + 2 * p) - L * B; return E(`A garden is ${L} m long and ${B} m wide. A path ${p} m wide runs all around it, outside the garden. What is the area of the path?`, nums(ans, [(L + p) * (B + p) - L * B, 2 * (L + B) * p, ans + 4 * p * p], x => N(x) + " sq m"), `Outer rectangle: (${L} + ${2 * p}) × (${B} + ${2 * p}) = ${L + 2 * p} × ${B + 2 * p} = ${(L + 2 * p) * (B + 2 * p)} sq m. Garden: ${L * B} sq m. Path: ${(L + 2 * p) * (B + 2 * p)} − ${L * B} = ${ans} sq m.`, { t: "rect", w: L + 2 * p, h: B + 2 * p, unit: "m" }); }
    if (kind === 1) { const ans = L * B - (L - 2 * p) * (B - 2 * p); return E(`A park is ${L} m long and ${B} m wide. A path ${p} m wide runs along the inside of its edge. What is the area of the path?`, nums(ans, [L * B - (L - p) * (B - p), 2 * (L + B) * p, ans - 4 * p * p], x => N(x) + " sq m"), `Inner rectangle: (${L} − ${2 * p}) × (${B} − ${2 * p}) = ${(L - 2 * p) * (B - 2 * p)} sq m. Path: ${L * B} − ${(L - 2 * p) * (B - 2 * p)} = ${ans} sq m.`, { t: "rect", w: L, h: B, unit: "m" }); }
    const g = ri(2, 4), rate = ri(12, 40), len = 2 * (L + B) - g, ans = len * rate;
    return E(`A field is ${L} m long and ${B} m wide. A fence is put all around it, leaving a gap of ${g} m for a gate. Fencing costs ₹${rate} per metre. What is the total cost?`, nums(ans, [2 * (L + B) * rate, (L + B - g) * rate, L * B * rate], rupees), `Perimeter = 2 × (${L} + ${B}) = ${2 * (L + B)} m. Minus the gate: ${len} m. Cost: ${len} × ₹${rate} = ₹${N(ans)}.`, F(["", "Perimeter", `${2 * (L + B)} m`], ["", `− ${g} m gate`, `${len} m`], ["", `× ₹${rate}`, `₹${N(ans)}`, 1]));
  });

  // 14. Volume and cubes.
  fam(15, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const s = pick([2, 3, 4, 5]), a = ri(2, 6), b = ri(2, 5), c = ri(2, 4), ans = a * b * c; return E(`How many cubes of side ${s} cm can be packed into a box ${a * s} cm long, ${b * s} cm wide and ${c * s} cm high?`, nums(ans, [a * b * c * s * s, a * b * c * s * s * s / s | 0, ans + a * b]), `Along the length: ${a * s} ÷ ${s} = ${a}. Width: ${b * s} ÷ ${s} = ${b}. Height: ${c * s} ÷ ${s} = ${c}. Cubes: ${a} × ${b} × ${c} = ${ans}.`, F(["📦", "Length", `${a}`], ["", "Width", `${b}`], ["", "Height", `${c}`], ["", "Cubes", `${ans}`, 1])); }
    if (kind === 1) { const n = ri(3, 6), k = pick([0, 1, 2]), vals = [(n - 2) ** 3, 6 * (n - 2) ** 2, 12 * (n - 2)], ans = vals[k], why = [`Cubes with no paint are hidden inside: a ${n - 2} × ${n - 2} × ${n - 2} block = ${ans}.`, `Each face has a ${n - 2} × ${n - 2} middle part with one painted face. 6 faces × ${(n - 2) ** 2} = ${ans}.`, `Cubes with 2 painted faces lie along the edges, but not at the corners: ${n - 2} on each of the 12 edges. 12 × ${n - 2} = ${ans}.`][k]; return E(`A cube of side ${n} cm is painted on all its faces and then cut into 1 cm cubes. How many small cubes have ${k === 0 ? "no face" : k === 1 ? "exactly one face" : "exactly two faces"} painted?`, nums(ans, vals.filter((_, j) => j !== k).concat([8, n ** 3 - 8])), why, C(["🧊", "3 faces", "8"], ["", "2 faces", `${vals[2]}`, k === 2], ["", "1 face", `${vals[1]}`, k === 1], ["", "0 faces", `${vals[0]}`, k === 0])); }
    const L = ri(4, 12) * 10, B = ri(3, 8) * 10, H = ri(3, 9) * 10, V = L * B * H, frac = pick([[1, 1], [1, 2], [3, 4]]), ans = V / 1000 * frac[0] / frac[1];
    if (!Number.isInteger(ans)) return false;
    return E(`A tank is ${L} cm long, ${B} cm wide and ${H} cm deep. How many litres of water are in it when it is ${frac[0] === frac[1] ? "full" : `${frac[0]}/${frac[1]} full`}? (1 litre = 1000 cubic cm)`, nums(ans, [V / 1000, V / 100 * frac[0] / frac[1] | 0, ans + 10]), `Volume = ${L} × ${B} × ${H} = ${N(V)} cubic cm = ${N(V / 1000)} litres.${frac[0] === frac[1] ? "" : ` ${frac[0]}/${frac[1]} of ${N(V / 1000)} = ${N(ans)} litres.`}`, F(["", `${L} × ${B} × ${H}`, `${N(V)} cu cm`], ["", "÷ 1000", `${N(V / 1000)} L`], ["", "Water", `${N(ans)} L`, 1]));
  });

  // 15. Angles.
  fam(15, E => {
    const kind = ri(0, 3), deg = x => x + "°";
    if (kind === 0) { const k = ri(2, 4), Cc = ri(4, 16) * 5; if ((180 - Cc) % (k + 1)) return false; const B = (180 - Cc) / (k + 1), A = k * B; return E(`In triangle ABC, angle C = ${Cc}°, and angle A is ${k} times angle B. What is angle A?`, nums(A, [B, 180 - Cc, A + B / 2 | 0], deg), `A + B = 180° − ${Cc}° = ${180 - Cc}°. A is ${k} parts and B is 1 part: ${k + 1} parts = ${180 - Cc}°, so B = ${B}° and A = ${k} × ${B}° = ${A}°.`, F(["", "A + B", `${180 - Cc}°`], ["", `÷ ${k + 1}`, `B = ${B}°`], ["", `× ${k}`, `A = ${A}°`, 1])); }
    if (kind === 1) { const k = ri(2, 4), c = ri(1, 6) * 10, x = (180 - c) / (k + 1); if (!Number.isInteger(x)) return false; const big = k * x + c; return E(`Two angles together make a straight line. One angle is ${c}° more than ${k} times the other. What is the larger angle?`, nums(big, [x, 180 - x - c, k * x], deg), `Angles on a straight line add up to 180°. Small + (${k} × small + ${c}°) = 180°, so ${k + 1} × small = ${180 - c}° and small = ${x}°. Larger = ${k} × ${x}° + ${c}° = ${big}°.`, { t: "angle", deg: big }); }
    if (kind === 2) { const V = ri(4, 30) * 4, b = (180 - V) / 2; return E(`In an isosceles triangle, the angle between the two equal sides is ${V}°. What is each of the other two angles?`, nums(b, [180 - V, V, V / 2], deg), `The other two angles are equal and add up to 180° − ${V}° = ${180 - V}°. Each is ${180 - V}° ÷ 2 = ${b}°.`, { t: "angle", deg: b }); }
    const a = ri(5, 13) * 5, b = ri(5, 13) * 5, ext = a + b; if (ext >= 180) return false;
    return E(`One side of a triangle is extended. The outside angle formed is ${ext}°. One of the two inside angles opposite to it is ${a}°. What is the other one?`, nums(b, [180 - ext, 180 - a, ext - 180 + a > 0 ? ext - 180 + a : b + 10], deg), `The outside angle equals the sum of the two opposite inside angles. ${ext}° − ${a}° = ${b}°. (Check: the third inside angle is 180° − ${ext}° = ${180 - ext}°, and ${a} + ${b} + ${180 - ext} = 180.)`, { t: "angle", deg: ext });
  });

  // 16. Clock-hand angles.
  fam(15, E => {
    const h = ri(1, 11), m = pick([10, 20, 30, 40, 50, 0 + 30]);
    let a = Math.abs(30 * h - 5.5 * m); a = Math.min(a, 360 - a);
    let w = Math.abs(30 * h - 6 * m); w = Math.min(w, 360 - w);
    if (a === 0 || a === w) return false;
    return E(`What is the smaller angle between the hour hand and the minute hand of a clock at ${h}:${String(m).padStart(2, "0")}?`, nums(a, [w, 360 - a, a + 15], x => x + "°"),
      `Minute hand: ${m} × 6° = ${6 * m}° from 12. Hour hand: ${h} × 30° + ${m} × ½° = ${30 * h + m / 2}° from 12 (it moves ½° every minute). Difference: ${Math.abs(30 * h + m / 2 - 6 * m)}°${Math.abs(30 * h + m / 2 - 6 * m) > 180 ? `, and the smaller angle is 360° − ${Math.abs(30 * h + m / 2 - 6 * m)}° = ${a}°` : ""}. Answer ${a}°.`, { t: "clock", h, m });
  });

  // 17. Divisibility with a missing digit.
  fam(15, E => {
    const d = pick([3, 4, 6, 9, 11]), len = ri(4, 5), ds = Array.from({ length: len }, (_, i) => i ? ri(0, 9) : ri(1, 9)), pos = d === 4 ? len - 2 : ri(1, len - 2);
    const val = x => +ds.map((v, i) => i === pos ? x : v).join(""), cands = range(0, 9).filter(x => val(x) % d === 0);
    if (!cands.length || cands.length > 4) return false;
    const shown = ds.map((v, i) => i === pos ? "☐" : v).join(""), big = cands.length > 1 && ri(0, 1), ans = big ? cands[cands.length - 1] : cands[0];
    const rule = { 3: "the sum of its digits is a multiple of 3", 9: "the sum of its digits is a multiple of 9", 4: "the number formed by its last two digits is a multiple of 4", 6: "it is even and the sum of its digits is a multiple of 3", 11: "the difference between the sums of alternate digits is 0 or a multiple of 11" }[d];
    const q = cands.length === 1 ? `Which digit must go in the box so that ${shown} is divisible by ${d}?` : `What is the ${big ? "greatest" : "smallest"} digit that can go in the box so that ${shown} is divisible by ${d}?`;
    return E(q, nums(ans, [...cands.filter(x => x !== ans), (ans + 1) % 10, (ans + 3) % 10, Math.abs(ans - 2)]), `A number is divisible by ${d} when ${rule}. Trying 0 to 9, ${cands.length > 1 ? `the digits that work are ${cands.join(", ")}` : "only one digit works"}. ${cands.length > 1 ? `The ${big ? "greatest" : "smallest"} is ${ans}` : `Only ${ans} works`}: ${N(val(ans))} ÷ ${d} = ${N(val(ans) / d)}.`, { t: "pv", n: String(val(ans)), i: pos });
  });

  // 18. Digits used for page numbers.
  const pageDigits = n => n < 10 ? n : n < 100 ? 9 + 2 * (n - 9) : n < 1000 ? 189 + 3 * (n - 99) : 2889 + 4 * (n - 999);
  fam(14, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const n = ri(100, 480), ans = pageDigits(n); return E(`How many digits are needed to number the pages of a book from 1 to ${n}?`, nums(ans, [3 * n, ans - 9, 189 + 3 * (n - 100)]), `Pages 1–9: 9 digits. Pages 10–99: 90 × 2 = 180 digits. Pages 100–${n}: ${n - 99} × 3 = ${3 * (n - 99)} digits. Total: 9 + 180 + ${3 * (n - 99)} = ${N(ans)}.`, F(["", "1–9", "9"], ["", "10–99", "180"], ["", `100–${n}`, `${3 * (n - 99)}`], ["", "Total", N(ans), 1])); }
    if (kind === 1) { const n = ri(100, 480), D = pageDigits(n); return E(`A total of ${N(D)} digits were used to number the pages of a book, starting from page 1. How many pages does the book have?`, nums(n, [Math.floor(D / 3), n - 1, n + 9]), `Pages 1–99 use 9 + 180 = 189 digits. ${N(D)} − 189 = ${D - 189} digits are left for 3-digit pages: ${D - 189} ÷ 3 = ${(D - 189) / 3} pages. 99 + ${(D - 189) / 3} = ${n}.`, F(["", "1–99", "189 digits"], ["", `${D - 189} ÷ 3`, `${(D - 189) / 3} pages`], ["", "Pages", `${n}`, 1])); }
    const d = ri(1, 9), n = ri(100, 300), ans = range(1, n).reduce((s, x) => s + digs(x).filter(y => y === d).length, 0);
    const o = range(1, n).filter(x => x % 10 === d).length, t = range(1, n).filter(x => Math.floor(x / 10) % 10 === d).length, hh = range(1, n).filter(x => Math.floor(x / 100) === d).length;
    return E(`How many times is the digit ${d} written when all the numbers from 1 to ${n} are written down?`, nums(ans, [o + t, ans - 1, ans + 10]), `Count place by place. Ones place: ${o}. Tens place: ${t}. Hundreds place: ${hh}. Total: ${o} + ${t} + ${hh} = ${ans}.`, F(["", "Ones", `${o}`], ["", "Tens", `${t}`], ["", "Hundreds", `${hh}`], ["", "Total", `${ans}`, 1]));
  });

  // 19. Series with two rules.
  fam(15, E => {
    const kind = ri(0, 5); let seq, ans, why, w;
    if (kind === 0) { const a = ri(2, 9), p = ri(3, 9), b = ri(1, 3), all = []; for (let i = 0; i < 9; i++) all.push(i % 2 ? b * 2 ** ((i - 1) / 2) : a + p * (i / 2)); const len = ri(7, 8); seq = all.slice(0, len); ans = all[len]; w = [all[len - 1] * 2, all[len - 2] + p * 2, ans + 1, ans * 2]; why = `Two series take turns. Odd places: ${a}, ${a + p}, ${a + 2 * p} … (+${p}). Even places: ${b}, ${2 * b}, ${4 * b} … (×2).`; }
    else if (kind === 1) { const s = ri(2, 6), c = ri(1, 5); seq = [s]; for (let i = 1; i < 7; i++) seq.push(i % 2 ? seq[i - 1] * 3 : seq[i - 1] - c); ans = seq.pop(); w = [seq[5] - c, seq[5] * 2, ans + c]; why = `The rules take turns: ×3, then −${c}.`; }
    else if (kind === 2) { const s = ri(1, 9); seq = [s]; for (let i = 1; i < 7; i++) seq.push(seq[i - 1] + i * i); ans = seq.pop(); w = [seq[5] + 25, seq[5] + 35, ans + 1]; why = "The jumps are square numbers: +1, +4, +9, +16, +25, so next is +36."; }
    else if (kind === 3) { const k = ri(1, 4); seq = range(k, k + 5).map(n => n * (n + 1)); ans = seq.pop(); w = [ans - 2, seq[4] + (seq[4] - seq[3]), ans + 2]; why = `Each term is n × (n + 1): ${range(k, k + 4).map(n => `${n}×${n + 1}`).join(", ")}, so next is ${k + 5}×${k + 6}.`; }
    else if (kind === 4) { const s = ri(0, 3); const idx = [s]; for (let i = 1; i < 6; i++) idx.push(idx[i - 1] + i); seq = idx.map(i => AL[i]); ans = seq.pop(); const ai = idx[5]; w = [AL[ai - 1], AL[ai + 1], AL[idx[4] + 4]]; why = `The gaps grow: +1, +2, +3, +4, so next is +5. ${seq[4]} + 5 letters = ${ans}.`; if (ai > 25) return false; }
    else { const s = ri(2, 4), c = ri(1, 2); seq = [s]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] * 2 + (i % 2 ? c : -c)); ans = seq.pop(); w = [seq[4] * 2, seq[4] * 2 - c, ans + 2]; why = `Double and add ${c}, then double and take away ${c}, in turns.`; }
    return E(`What comes next?\n${seq.join(", ")}, ☐`, typeof ans === "string" ? sopt(ans, w) : nums(ans, w), `${why} The answer is ${ans}.`, { t: "seq", items: [...seq.slice(-4), ans].map(String), hl: 4 });
  });

  // 20. Coding with mixed rules.
  const CW5 = ["BRAIN", "CHAIR", "PLANT", "TIGER", "MOUSE", "CLOUD", "WATER", "STONE", "GRAPE", "LEMON", "SHIRT", "BREAD", "TRAIN", "HOUSE", "LIGHT", "SMILE", "FROG", "DUCK", "MILK", "BOAT", "KING"];
  const sh = (c, k) => AL[(AL.indexOf(c) + k + 26) % 26];
  const CODES = [
    [w => w.split("").map((c, i) => sh(c, i % 2 ? -1 : 1)).join(""), "the 1st, 3rd, 5th … letters move 1 forward and the 2nd, 4th … letters move 1 back"],
    [w => w.split("").reverse().map(c => sh(c, 1)).join(""), "the word is written backwards and then every letter moves 1 forward"],
    [w => w.split("").map(c => AL[25 - AL.indexOf(c)]).join(""), "every letter is swapped with its opposite letter (A↔Z, B↔Y, C↔X …)"],
    [w => w.split("").map((c, i) => sh(c, i + 1)).join(""), "the 1st letter moves 1 forward, the 2nd moves 2, the 3rd moves 3, and so on"],
    [w => w.split("").map(c => sh(c, 2)).reverse().join(""), "every letter moves 2 forward and the word is written backwards"],
  ];
  fam(15, E => {
    const [w1, w2] = pickN(CW5, 2), r = ri(0, CODES.length - 1), [f, rule] = CODES[r], ans = f(w2);
    const others = CODES.filter((_, i) => i !== r).map(([g]) => g(w2)).concat([w2.split("").map(c => sh(c, 1)).join(""), ans.split("").reverse().join("")]);
    return E(`In a certain code, ${w1} is written as ${f(w1)}. How is ${w2} written in that code?`, sopt(ans, mix(others)), `Compare ${w1} with ${f(w1)}: ${rule}. Do the same to ${w2}: ${ans}.`, F(["", w1, f(w1)], ["", "same rule", ""], ["", w2, ans, 1]));
  });

  // 21. Calendar across months and years (real dates).
  const MD = y => [31, y % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dow = (y, m, d) => DAYS[(new Date(Date.UTC(y, m, d)).getUTCDay() + 6) % 7];
  const dn = (y, m, d) => Date.UTC(y, m, d) / 864e5;
  fam(15, E => {
    const y = ri(2021, 2030);
    if (ri(0, 2)) {
      const m1 = ri(0, 9), m2 = Math.min(11, m1 + ri(1, 3)), d1 = ri(1, MD(y)[m1]), d2 = ri(1, MD(y)[m2]), diff = dn(y, m2, d2) - dn(y, m1, d1), r = diff % 7, ans = dow(y, m2, d2), w0 = DAYS.indexOf(dow(y, m1, d1));
      const mids = range(m1 + 1, m2 - 1);
      const leap = y % 4 === 0 && m1 <= 1 && m2 >= 2;
      return E(`If ${d1} ${MONTHS[m1]} ${y} is a ${dow(y, m1, d1)}, what day of the week is ${d2} ${MONTHS[m2]} ${y}?`, sopt(ans, [DAYS[(w0 + r + 1) % 7], DAYS[(w0 + r + 6) % 7], DAYS[(w0 + r + 2) % 7], DAYS[(w0 + r + 5) % 7]]),
        `Count the days: rest of ${MONTHS[m1]} = ${MD(y)[m1]} − ${d1} = ${MD(y)[m1] - d1}${mids.map(m => `, ${MONTHS[m]} = ${MD(y)[m]}`).join("")}, then ${d2} days of ${MONTHS[m2]}. Total ${diff} days${leap ? ` (${y} is a leap year, so February has 29 days)` : ""}. ${diff} = ${Math.floor(diff / 7)} weeks + ${r} day${r === 1 ? "" : "s"}. ${r} day${r === 1 ? "" : "s"} after ${dow(y, m1, d1)} is ${ans}.`, { t: "seq", items: range(0, r).map(j => DAYS[(w0 + j) % 7].slice(0, 3)), hl: r });
    }
    const m = ri(0, 11), d = ri(1, m === 1 ? 28 : MD(y)[m]), diff = dn(y + 1, m, d) - dn(y, m, d), ans = dow(y + 1, m, d), w0 = DAYS.indexOf(dow(y, m, d)), lp = diff === 366 ? (m <= 1 ? y : y + 1) : 0;
    return E(`If ${d} ${MONTHS[m]} ${y} is a ${dow(y, m, d)}, what day of the week is ${d} ${MONTHS[m]} ${y + 1}?`, sopt(ans, [DAYS[w0], DAYS[(w0 + (diff === 366 ? 1 : 2)) % 7], DAYS[(w0 + 6) % 7], DAYS[(w0 + 3) % 7]]),
      `From ${d} ${MONTHS[m]} ${y} to ${d} ${MONTHS[m]} ${y + 1} is ${diff} days${lp ? `, because 29 February ${lp} falls in between` : ", because no 29 February falls in between"}. ${diff} = 52 weeks + ${diff - 364} day${diff === 365 ? "" : "s"}, so the day moves ${diff - 364} forward: ${ans}.`, { t: "seq", items: range(0, diff - 364).map(j => DAYS[(w0 + j) % 7].slice(0, 3)), hl: diff - 364 });
  });

  // 22. Clocks that gain or lose.
  fam(12, E => {
    const g = pick([2, 3, 4, 5, 6]), gain = ri(0, 1), s = ri(5, 9) * 60, hrs = ri(4, 12), real = s + hrs * 60, sg = gain ? 1 : -1, shown = real + sg * g * hrs;
    return E(`A clock ${gain ? "gains" : "loses"} ${g} minutes every hour. It is set to the correct time at ${t12(s)}. What time will it show when the correct time is ${t12(real)} the same day?`, sopt(t12(shown), [t12(real - sg * g * hrs), t12(real + sg * g), t12(shown + sg * g), t12(real)]),
      `From ${t12(s)} to ${t12(real)} is ${hrs} hours. In ${hrs} hours the clock ${gain ? "gains" : "loses"} ${hrs} × ${g} = ${g * hrs} minutes. It shows ${t12(real)} ${gain ? "+" : "−"} ${g * hrs} min = ${t12(shown)}.`, F(["🕰️", `${hrs} h`, `${gain ? "+" : "−"}${g * hrs} min`], ["", "Shows", t12(shown), 1]));
  });

  // 23. Roman numerals.
  fam(14, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const a = ri(14, 99), b = ri(3, 9), c = ri(10, 99), ans = a * b - c; if (ans <= 0) return false; return E(`What is ${rom(a)} × ${rom(b)} − ${rom(c)}? (Give the answer in ordinary numbers.)`, nums(ans, [a * b + c, (a + 10) * b - c, ans - 10]), `${rom(a)} = ${a}, ${rom(b)} = ${b}, ${rom(c)} = ${c}. ${a} × ${b} = ${a * b}. ${a * b} − ${c} = ${ans}.`, F(["", rom(a), `${a}`], ["", `× ${rom(b)}`, `${a * b}`], ["", `− ${rom(c)}`, `${ans}`, 1])); }
    if (kind === 1) { const x = ri(1000, 2999), y = ri(140, 990), ans = x - y; return E(`What is ${rom(x)} − ${rom(y)}? (Give the answer in Roman numerals.)`, sopt(rom(ans), [rom(ans + 10), rom(ans - 100), rom(ans + 1), rom(ans - 9)]), `${rom(x)} = ${x} and ${rom(y)} = ${y}. ${x} − ${y} = ${ans} = ${rom(ans)}.`, F(["", rom(x), `${x}`], ["", rom(y), `${y}`], ["", rom(ans), `${ans}`, 1])); }
    const n = ri(400, 2999), r = rom(n), bad = romAdd(n); if (bad === r) return false;
    return E(`Which is the correct Roman numeral for ${n}?`, sopt(r, [bad, rom(n + 10), rom(n - 1), rom(n + 100)]), `Break ${n} into thousands, hundreds, tens and ones: ${digs(n).map((d, i, a) => d * 10 ** (a.length - 1 - i)).filter(Boolean).map(v => `${v} = ${rom(v)}`).join(", ")}. Together: ${r}. (Use subtraction for 4s and 9s, e.g. 900 = CM, 40 = XL.)`, F(...digs(n).map((d, i, a) => d * 10 ** (a.length - 1 - i)).filter(Boolean).map(v => ["", `${v}`, rom(v)]), ["", `${n}`, r, 1]));
  });

  // 24. Ages with two conditions.
  fam(14, E => {
    const [A, B] = pickN(KIDS, 2);
    if (ri(0, 1)) { const s0 = ri(2, 7), m = ri(4, 7), k = ri(3, 8), son = s0 + k, fa = m * s0 + k, S = son + fa; return E(`The ages of a father and his son add up to ${S} years. ${k} years ago, the father was ${m} times as old as the son. How old is the father now?`, nums(fa, [m * son, S - fa, fa - k]), `${k} years ago their ages added up to ${S} − ${2 * k} = ${S - 2 * k}. The father was ${m} parts and the son 1 part: ${m + 1} parts = ${S - 2 * k}, so 1 part = ${s0}. Father then: ${m * s0}. Now: ${m * s0} + ${k} = ${fa}.`, F(["", `${k} yrs ago total`, `${S - 2 * k}`], ["", `÷ ${m + 1}`, `son ${s0}`], ["", "Father now", `${m * s0} + ${k} = ${fa}`, 1])); }
    const b = ri(3, 15), m = ri(3, 4), n = 2; const t = b * (m - n) / (n - 1), a = m * b;
    if (t < 2 || t > 30) return false;
    return E(`${A} is ${m} times as old as ${B}. After ${t} years, ${A} will be twice as old as ${B}. How old is ${B} now?`, nums(b, [t, a, b + t]), `Now: ${A} = ${m} × ${B}. In ${t} years: ${m} × ${B} + ${t} = 2 × (${B} + ${t}), so ${m - 2 > 1 ? `${m - 2} × ${B} = ${t}, and ${B} = ${t} ÷ ${m - 2}` : `${B} = ${t}`}. ${B} is ${b} now. Check: ${a} + ${t} = ${a + t} and 2 × ${b + t} = ${2 * (b + t)}.`, F(["", B, `${b}`], ["", A, `${a}`], ["", `In ${t} years`, `${a + t} = 2 × ${b + t}`, 1]));
  });

  // 25. Work and time.
  const WP = [];
  for (let a = 3; a <= 40; a++) for (let b = a + 1; b <= 60; b++) if ((a * b) % (a + b) === 0) WP.push([a, b, a * b / (a + b)]);
  fam(14, E => {
    const [a, b, t] = pick(WP), [p, q] = pickN(KIDS, 2), kind = ri(0, 2);
    if (kind === 0) return E(`${p} can paint a fence in ${a} days. ${q} can paint it in ${b} days. How many days will they take if they work together?`, nums(t, [(a + b) / 2 | 0, a + b, b - a], x => x + (x === 1 ? " day" : " days")), `In 1 day ${p} paints 1/${a} and ${q} paints 1/${b}. Together: 1/${a} + 1/${b} = ${b / gcd(a * b, a + b) === 1 ? "" : ""}${(a + b) / gcd(a * b, a + b)}/${a * b / gcd(a * b, a + b)} = 1/${t} of the fence each day. So they take ${t} days.`, F(["", p, `1/${a} per day`], ["", q, `1/${b} per day`], ["", "Together", `1/${t} → ${t} days`, 1]));
    if (kind === 1) return E(`Pipe A fills a tank in ${a} hours. Pipes A and B together fill it in ${t} hours. How long would pipe B take alone?`, nums(b, [a - t, a + t, a * t], x => x + (x === 1 ? " hour" : " hours")), `Together they fill 1/${t} per hour. A fills 1/${a}. B fills 1/${t} − 1/${a} = 1/${b}. So B alone takes ${b} hours.`, F(["", "Together", `1/${t}`], ["", "− A", `1/${a}`], ["", "B", `1/${b} → ${b} h`, 1]));
    const m1 = ri(6, 24), d1 = ri(6, 30), m2 = pick(factors(m1 * d1).filter(x => x > m1 && x <= 60 && x !== d1)); if (!m2) return false;
    const ans = m1 * d1 / m2;
    return E(`${m1} workers can build a wall in ${d1} days. How many days will ${m2} workers take to build the same wall?`, nums(ans, [d1 * m2 / m1 | 0, d1 - (m2 - m1) > 0 ? d1 - (m2 - m1) : ans + 2, ans + 1], x => x + (x === 1 ? " day" : " days")), `The work is ${m1} × ${d1} = ${m1 * d1} worker-days. More workers means fewer days: ${m1 * d1} ÷ ${m2} = ${ans} days.`, F(["👷", `${m1} × ${d1}`, `${m1 * d1} worker-days`], ["", `÷ ${m2}`, `${ans} days`, 1]));
  });

  // 26. Consecutive numbers.
  fam(14, E => {
    const kind = ri(0, 3);
    if (kind === 0) { const x = ri(20, 300), S = 3 * x; return E(`The sum of three consecutive numbers is ${N(S)}. What is the largest of them?`, nums(x + 1, [x, x + 2, S / 3 + 3]), `The middle number is ${N(S)} ÷ 3 = ${x}. The numbers are ${x - 1}, ${x}, ${x + 1}. The largest is ${x + 1}.`, { t: "seq", items: [x - 1, x, x + 1].map(String), hl: 2 }); }
    if (kind === 1) { const x = ri(10, 150) * 2, S = 4 * x + 12; return E(`The sum of four consecutive even numbers is ${S}. What is the smallest of them?`, nums(x, [S / 4, x + 2, x - 2]), `Write them as n, n + 2, n + 4, n + 6. Sum = 4n + 12 = ${S}, so 4n = ${S - 12} and n = ${x}. The numbers are ${x}, ${x + 2}, ${x + 4}, ${x + 6}.`, { t: "seq", items: [x, x + 2, x + 4, x + 6].map(String), hl: 0 }); }
    if (kind === 2) { const x = ri(10, 120) * 2 + 1, S = 5 * x; return E(`The sum of five consecutive odd numbers is ${S}. What is the largest of them?`, nums(x + 4, [x, x + 2, x + 5]), `The middle number is ${S} ÷ 5 = ${x}. The numbers are ${x - 4}, ${x - 2}, ${x}, ${x + 2}, ${x + 4}. The largest is ${x + 4}.`, { t: "seq", items: [x - 4, x - 2, x, x + 2, x + 4].map(String), hl: 4 }); }
    const n = ri(20, 80), ans = n * (n + 1) / 2;
    return E(`What is 1 + 2 + 3 + … + ${n}?`, nums(ans, [n * n / 2 | 0, n * (n - 1) / 2, ans + n]), `Pair the first and last: 1 + ${n} = ${n + 1}, 2 + ${n - 1} = ${n + 1}, … There are ${n} numbers, so the sum is ${n} × ${n + 1} ÷ 2 = ${N(ans)}.`, F(["", `1 + ${n}`, `${n + 1}`], ["", `${n} × ${n + 1} ÷ 2`, N(ans), 1]));
  });

  // 27. Cryptarithm-lite.
  fam(12, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const X2 = ri(5, 9), Y = ri(2, X2 - 1), S = 11 * (X2 + Y), d = X2 - Y, ans = 10 * X2 + Y; return E(`AB and BA are two 2-digit numbers made from the digits A and B. AB + BA = ${S}, and A is ${d} more than B. What is the number AB?`, nums(ans, [10 * Y + X2, ans + 9, ans - 9]), `AB + BA = 11 × (A + B), so A + B = ${S} ÷ 11 = ${X2 + Y}. With A − B = ${d}: A = (${X2 + Y} + ${d}) ÷ 2 = ${X2} and B = ${Y}. AB = ${ans}.`, F(["", "A + B", `${X2 + Y}`], ["", "A − B", `${d}`], ["", "AB", `${ans}`, 1])); }
    if (kind === 1) { const t = ri(1, 9), u = ri(0, 9), m = ri(3, 9), n = 10 * t + u, p = n * m; if (p < 100) return false; const pd = digs(p), ti = pd.length - 2, sols = []; for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) { const pp = pd.slice(); pp[ti] = b; if ((10 * t + a) * m === +pp.join("")) sols.push([a, b]); } if (sols.length !== 1) return false; const v = pd[ti], shownP = pd.map((x, i) => i === ti ? "△" : x).join(""), ans = u + v; return E(`In this multiplication, ☐ and △ are digits:\n${t}☐ × ${m} = ${shownP}\nWhat is ☐ + △?`, nums(ans, [u, v, ans + 1, Math.abs(u - v)]), `The last digit of ${t}☐ × ${m} must be ${pd[pd.length - 1]}. Trying digits, only ${n} × ${m} = ${p} fits. So ☐ = ${u} and △ = ${v}, and ☐ + △ = ${ans}.`, F(["", `${n} × ${m}`, `${p}`], ["", "☐ + △", `${u} + ${v} = ${ans}`, 1])); }
    const a = ri(1, 7), b = ri(a + 1, 9), s = a + b, diff = 9 * (b - a), ans = 10 * a + b;
    return E(`A 2-digit number has digits that add up to ${s}. When its digits are reversed, the new number is ${diff} more than the original. What is the original number?`, nums(ans, [10 * b + a, ans + 9, ans - 9]), `Reversing changes the number by 9 × (difference of digits). ${diff} ÷ 9 = ${b - a}, so the ones digit is ${b - a} more than the tens digit. Digits add to ${s}: tens = (${s} − ${b - a}) ÷ 2 = ${a}, ones = ${b}. Number: ${ans}. Check: ${10 * b + a} − ${ans} = ${diff}.`, F(["", "Sum", `${s}`], ["", "Difference", `${b - a}`], ["", "Number", `${ans}`, 1]));
  });

  // 28. Multi-step problems with large numbers.
  fam(14, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const a = ri(150, 300) * 100 + ri(0, 99) * 10, b = ri(25, 70) * 100 + ri(0, 99) + 1, ans = a - 3 * b; if (ans <= 0) return false; return E(`A warehouse had ${N(a)} kg of rice. On Monday it sold ${N(b)} kg, and on Tuesday it sold twice as much as on Monday. How much rice is left?`, nums(ans, [a - 2 * b, a - b, ans + 1000]), `Tuesday: 2 × ${N(b)} = ${N(2 * b)} kg. Sold in all: ${N(b)} + ${N(2 * b)} = ${N(3 * b)} kg. Left: ${N(a)} − ${N(3 * b)} = ${N(ans)} kg.`, F(["", "Mon", N(b)], ["", "Tue", N(2 * b)], ["", "Left", N(ans), 1])); }
    if (kind === 1) { const x = ri(12, 99) * 25, d = ri(5, 7), bx = pick([25, 50]), tot = x * d; if (tot % bx) return false; const ans = tot / bx; return E(`A factory makes ${N(x)} toys a day. It works ${d} days a week. All the toys made in a week are packed in boxes of ${bx}. How many boxes are needed?`, nums(ans, [x / bx | 0, ans + d, tot]), `Toys in a week: ${N(x)} × ${d} = ${N(tot)}. Boxes: ${N(tot)} ÷ ${bx} = ${N(ans)}.`, F(["🧸", `${N(x)} × ${d}`, N(tot)], ["📦", `÷ ${bx}`, N(ans), 1])); }
    const s = ri(2000, 6000), bx = ri(25, 48), per = ri(12, 30), g = ri(500, 1800), ans = s + bx * per - g;
    return E(`A library had ${N(s)} books. It bought ${bx} boxes with ${per} books in each box, and then gave away ${N(g)} books to a village school. How many books does the library have now?`, nums(ans, [s + bx * per, s + bx + per - g, ans - 100]), `New books: ${bx} × ${per} = ${N(bx * per)}. ${N(s)} + ${N(bx * per)} = ${N(s + bx * per)}. Then ${N(s + bx * per)} − ${N(g)} = ${N(ans)}.`, F(["📚", `${bx} × ${per}`, N(bx * per)], ["", `+ ${N(s)}`, N(s + bx * per)], ["", `− ${N(g)}`, N(ans), 1]));
  });

  // 29. Making a number divisible.
  fam(14, E => {
    const d = pick([7, 11, 12, 13, 15, 17, 19, 23, 24, 25]), kind = ri(0, 3);
    if (kind === 0) { const n = ri(1000, 9999), r = n % d; if (!r) return false; const ans = d - r; return E(`What is the smallest number that must be added to ${N(n)} so that the sum is exactly divisible by ${d}?`, nums(ans, [r, d, ans + 1]), `${N(n)} ÷ ${d} = ${Math.floor(n / d)} remainder ${r}. We need ${d} − ${r} = ${ans} more to reach the next multiple, ${N(n + ans)}.`, F(["", `${N(n)} ÷ ${d}`, `rem ${r}`], ["", `${d} − ${r}`, `${ans}`, 1])); }
    if (kind === 1) { const n = ri(1000, 9999), r = n % d; if (!r) return false; return E(`What is the smallest number that must be subtracted from ${N(n)} so that the result is exactly divisible by ${d}?`, nums(r, [d - r, d, r + 1]), `${N(n)} ÷ ${d} = ${Math.floor(n / d)} remainder ${r}. Take away the remainder: ${N(n)} − ${r} = ${N(n - r)}, which is ${Math.floor(n / d)} × ${d}.`, F(["", `${N(n)} ÷ ${d}`, `rem ${r}`], ["", "Subtract", `${r}`, 1])); }
    if (kind === 2) { const r = 9999 % d, ans = 9999 - r; return E(`What is the largest 4-digit number that is exactly divisible by ${d}?`, nums(ans, [9999 - (d - r), ans - d, 9999]), `9999 ÷ ${d} = ${Math.floor(9999 / d)} remainder ${r}. 9999 − ${r} = ${N(ans)}.`, F(["", `9999 ÷ ${d}`, `rem ${r}`], ["", `9999 − ${r}`, N(ans), 1])); }
    const r = 10000 % d, ans = r ? 10000 + d - r : 10000; return E(`What is the smallest 5-digit number that is exactly divisible by ${d}?`, nums(ans, [10000 + r, ans + d, 10000 - r]), `10000 ÷ ${d} = ${Math.floor(10000 / d)} remainder ${r}.${r ? ` Add ${d} − ${r} = ${d - r}: 10000 + ${d - r} = ${N(ans)}.` : " So 10000 itself works."}`, F(["", `10000 ÷ ${d}`, `rem ${r}`], ["", "Answer", N(ans), 1]));
  });

  // 30. Directions with five walks.
  const DIRS = ["North", "East", "South", "West"];
  fam(12, E => {
    const r0 = ri(0, 3), D = k => DIRS[(r0 + k) % 4], a = ri(6, 20), c = ri(2, a - 2), b = ri(8, 25), d = ri(2, 20);
    if (b === d) return false;
    const net = b - d, dir = net > 0 ? D(1) : D(3), dist = Math.abs(net), p = pick(KIDS);
    return E(`${p} walks ${a} m ${D(0)}, then ${b} m ${D(1)}, then ${c} m ${D(2)}, then ${d} m ${D(3)}, and finally ${a - c} m ${D(2)}. How far is ${p} from the starting point, and in which direction?`, sopt(`${dist} m ${dir}`, [`${dist} m ${net > 0 ? D(3) : D(1)}`, `${b + d} m ${dir}`, `${a + dist} m ${dir}`, `${dist} m ${D(0)}`]),
      `${D(0)}–${D(2)}: ${a} m one way, then ${c} + ${a - c} = ${a} m back, so these cancel. ${D(1)}–${D(3)}: ${b} m ${D(1)} and ${d} m ${D(3)}, so ${p} ends ${dist} m ${dir} of the start.`, C(["🧭", `${D(0)}/${D(2)}`, "cancel"], ["", `${b} − ${d}`, `${dist} m`], ["", "Answer", `${dist} m ${dir}`, 1]));
  });

  // 31. Who sits where (five friends).
  fam(14, E => seatQ(E, 5));

  // 32. Profit and loss.
  const PL = [["mangoes", "rotten"], ["eggs", "broken"], ["glasses", "broken"], ["bananas", "spoilt"]];
  fam(12, E => {
    const [it, bad] = pick(PL), n = ri(3, 12) * 10, c = ri(5, 25), k = ri(3, 15), s = c + ri(1, 8), P = (n - k) * s - n * c, Y = n * (s - c);
    if (P === 0 || Y === Math.abs(P)) return false;
    const say2 = v => v > 0 ? `Profit of ₹${N(v)}` : `Loss of ₹${N(-v)}`;
    return E(`A shopkeeper buys ${n} ${it} at ₹${c} each. ${k} of them are ${bad}. He sells the rest at ₹${s} each. What is his profit or loss?`, sopt(say2(P), [say2(-P), say2(Y), say2(P + k * s * (P > 0 ? 1 : -1)), say2(-Y)]), `Cost: ${n} × ₹${c} = ₹${N(n * c)}. He sells ${n} − ${k} = ${n - k} at ₹${s}: ₹${N((n - k) * s)}. ${P > 0 ? `Profit: ₹${N((n - k) * s)} − ₹${N(n * c)} = ₹${N(P)}.` : `Loss: ₹${N(n * c)} − ₹${N((n - k) * s)} = ₹${N(-P)}.`}`, F(["", "Cost", `₹${N(n * c)}`], ["", "Sale", `₹${N((n - k) * s)}`], ["", P > 0 ? "Profit" : "Loss", `₹${N(Math.abs(P))}`, 1]));
  });

  // 33. Primes.
  fam(12, E => {
    const kind = ri(0, 2);
    if (kind === 0) { const a = ri(20, 90), b = a + ri(15, 30), L = range(a + 1, b - 1).filter(isPrime); return E(`How many prime numbers are there between ${a} and ${b}?`, nums(L.length, [L.length + 1, L.length - 1, range(a + 1, b - 1).filter(x => x % 2).length]), `Check the odd numbers between ${a} and ${b} for factors. The primes are ${L.join(", ")}. That is ${L.length}.`, C(...L.map(x => ["", String(x), "prime"]))); }
    if (kind === 1) { const a = ri(10, 60), b = a + ri(10, 18), L = range(a + 1, b - 1).filter(isPrime); if (L.length < 2) return false; const ans = L.reduce((s, x) => s + x, 0); return E(`What is the sum of all the prime numbers between ${a} and ${b}?`, nums(ans, [ans - L[0], ans + (L[L.length - 1] + 2), ans + 1]), `The primes between ${a} and ${b} are ${L.join(", ")}. Sum: ${L.join(" + ")} = ${ans}.`, C(...L.map(x => ["", String(x), ""]), ["", "Sum", `${ans}`, 1])); }
    const n = ri(50, 200), ans = range(2, n - 1).filter(isPrime).pop(), nxt = range(ans + 1, n - 1);
    return E(`What is the largest prime number less than ${n}?`, nums(ans, [nxt.filter(x => x % 2).pop() || ans + 2, ans - 2, n - 1]), `Check downward from ${n - 1}: ${nxt.reverse().slice(0, 4).map(x => `${x} = ${factors(x)[1]} × ${x / factors(x)[1]}`).join(", ")}${nxt.length > 4 ? ", …" : ""}. ${ans} has no factors other than 1 and itself, so it is prime.`, C(["", String(ans), "prime", 1]));
  });

  // 34. Order of operations with brackets.
  fam(14, E => {
    if (ri(0, 1)) { const b = ri(8, 20), c = ri(2, b - 3), k = b - c, a = k * ri(2, 9), d = ri(2, 6), e = ri(2, 9), f = ri(5, 12), g = ri(1, f - 2), ans = a / k * d + e * (f - g); return E(`What is ${a} ÷ (${b} − ${c}) × ${d} + ${e} × (${f} − ${g})?`, nums(ans, [Number.isInteger(a / (k * d)) ? a / (k * d) + e * (f - g) : ans + 6, (a / k * d + e) * (f - g), ans + e]), `Brackets first: ${b} − ${c} = ${k} and ${f} − ${g} = ${f - g}. Then ÷ and × from left to right: ${a} ÷ ${k} = ${a / k}, × ${d} = ${a / k * d}; ${e} × ${f - g} = ${e * (f - g)}. Finally add: ${a / k * d} + ${e * (f - g)} = ${ans}.`, F(["", "Brackets", `${k}, ${f - g}`], ["", "÷ and ×", `${a / k * d}, ${e * (f - g)}`], ["", "Add", `${ans}`, 1])); }
    const a = ri(5, 30), b = ri(5, 30), c = ri(2, 6), d = ri(3, 9), e = pick(factors(d * d).filter(x => x > 1 && x < d * d)); if (!e) return false;
    const ans = (a + b) * c - d * d / e; if (ans <= 0) return false;
    return E(`What is (${a} + ${b}) × ${c} − ${d} × ${d} ÷ ${e}?`, nums(ans, [a + b * c - d * d / e, ((a + b) * c - d * d) / e | 0, ans + d]), `Brackets: ${a} + ${b} = ${a + b}. × ${c} = ${(a + b) * c}. ${d} × ${d} = ${d * d}, ÷ ${e} = ${d * d / e}. Then ${(a + b) * c} − ${d * d / e} = ${ans}.`, F(["", `(${a} + ${b}) × ${c}`, `${(a + b) * c}`], ["", `${d} × ${d} ÷ ${e}`, `${d * d / e}`], ["", "Subtract", `${ans}`, 1]));
  });

  // 35. 24-hour time across midnight.
  fam(12, E => {
    const s = ri(18, 23) * 60 + pick([5, 15, 20, 35, 40, 50, 55]), d = ri(5, 10) * 60 + pick([10, 25, 35, 45, 50]), e = s + d;
    if (ri(0, 1)) return E(`A night bus leaves at ${t24(s)} and reaches its stop at ${t24(e)} the next morning. How long is the journey?`, sopt(hm(d), [hm(d + 60), hm(d - 60), hm(1440 - d), hm(d + 10)]), `From ${t24(s)} to midnight (24:00) is ${hm(1440 - s)}. From 00:00 to ${t24(e)} is ${hm(e - 1440)}. Total: ${hm(d)}.`, F(["🚌", t24(s), "→ 24:00"], ["", hm(1440 - s), `+ ${hm(e - 1440)}`], ["", "Journey", hm(d), 1]));
    return E(`A flight leaves at ${t24(s)} and the flight takes ${hm(d)}. At what time does it land (24-hour clock)?`, sopt(t24(e), [t24(e + 60), t24(e - 60), `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`, t24(e + 10)]), `${t24(s)} + ${hm(d)} = ${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}, which is past 24:00. Take away 24 hours: ${t24(e)} the next day.`, F(["✈️", t24(s), `+ ${hm(d)}`], ["", "Past midnight", `− 24 h`], ["", "Lands", t24(e), 1]));
  });

  // 36. Tiling a floor.
  fam(12, E => {
    const s = pick([20, 25, 40, 50]), L = ri(3, 9), B = ri(2, L), nl = 100 * L / s, nb = 100 * B / s;
    if (!Number.isInteger(nl) || !Number.isInteger(nb)) return false;
    const ans = nl * nb;
    if (ri(0, 1)) return E(`A room is ${L} m long and ${B} m wide. How many square tiles of side ${s} cm are needed to cover the floor?`, nums(ans, [L * B * 100 / s, nl + nb, ans * 2]), `Change metres to cm: ${L} m = ${100 * L} cm, ${B} m = ${100 * B} cm. Tiles along the length: ${100 * L} ÷ ${s} = ${nl}. Along the width: ${100 * B} ÷ ${s} = ${nb}. Total: ${nl} × ${nb} = ${N(ans)}.`, F(["", "Length", `${nl} tiles`], ["", "Width", `${nb} tiles`], ["", "Total", N(ans), 1]));
    const pr = ri(15, 60);
    return E(`A hall floor is ${L} m by ${B} m. It is covered with square tiles of side ${s} cm that cost ₹${pr} each. What is the cost of the tiles?`, nums(ans * pr, [L * B * pr, (ans + nl) * pr, ans * pr + 100], rupees), `Tiles: (${100 * L} ÷ ${s}) × (${100 * B} ÷ ${s}) = ${nl} × ${nb} = ${N(ans)}. Cost: ${N(ans)} × ₹${pr} = ₹${N(ans * pr)}.`, F(["", "Tiles", N(ans)], ["", `× ₹${pr}`, `₹${N(ans * pr)}`, 1]));
  });

  // 37. Counting squares and rectangles in grids.
  fam(12, E => {
    if (ri(0, 1)) { const w = ri(3, 6), h = ri(2, Math.min(4, w)), parts = range(0, h - 1).map(i => [i + 1, (w - i) * (h - i)]), ans = parts.reduce((s, p) => s + p[1], 0); return E(`How many squares of all sizes are there in a ${h} × ${w} grid?`, nums(ans, [w * h, ans - parts[parts.length - 1][1], ans + h]), `Count each size: ${parts.map(([s, c]) => `${s}×${s}: ${c}`).join(", ")}. Total ${ans}.`, { t: "rect", w, h, grid: 1, unit: "" }, { qv: { t: "rect", w, h, grid: 1, unit: "" } }); }
    const w = ri(2, 5), h = ri(2, 3), cw = w * (w + 1) / 2, ch = h * (h + 1) / 2, ans = cw * ch;
    return E(`How many rectangles of all sizes (including squares) are there in a ${h} × ${w} grid?`, nums(ans, [cw + ch, w * h, ans - w * h]), `A rectangle is fixed by choosing 2 of the ${w + 1} vertical lines (${cw} ways) and 2 of the ${h + 1} horizontal lines (${ch} ways). ${cw} × ${ch} = ${ans}.`, { t: "rect", w, h, grid: 1, unit: "" }, { qv: { t: "rect", w, h, grid: 1, unit: "" } });
  });

  // 38. Mixed units with decimals.
  const MU = [["km", "m"], ["kg", "g"], ["L", "mL"]];
  fam(12, E => {
    const [big, sm] = pick(MU), A = ri(1, 9) * 1000 + pick([250, 500, 750]), B = ri(105, 950), Cc = ri(5, 95) * 10, ans = A + B + Cc;
    return E(`Find the total in ${sm}: ${A / 1000} ${big} + ${B} ${sm} + ${Cc / 1000} ${big}`, nums(ans, [ans - Cc + Cc / 10, A + B + Cc * 10, ans - 1000], x => N(x) + " " + sm), `1 ${big} = 1000 ${sm}. ${A / 1000} ${big} = ${N(A)} ${sm} and ${Cc / 1000} ${big} = ${Cc} ${sm}. Total: ${N(A)} + ${B} + ${Cc} = ${N(ans)} ${sm}.`, F(["", `${A / 1000} ${big}`, `${N(A)} ${sm}`], ["", `${Cc / 1000} ${big}`, `${Cc} ${sm}`], ["", "Total", `${N(ans)} ${sm}`, 1]));
  });
};
}
