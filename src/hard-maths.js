// Olympiad-level IMO questions (logical reasoning, mathematical reasoning, everyday maths, achievers).
const AL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
const MIRROR_OK = new Set("AHIMOTUVWXY".split(""));

H[1].imo = Q => {
  // Two-step word problems.
  for (let k = 0; k < 24; k++) {
    const [thing, i] = pick(THINGS), p = pick(KIDS), a = ri(21, 48), b = ri(11, 29), c = ri(10, Math.min(a + b - 5, 35)), ans = a + b - c;
    Q("top", `${p} had ${a} ${thing}. ${p} got ${b} more and then gave away ${c}. How many ${thing} does ${p} have now?`, nums(ans, [a + b, a - c, ans + 10]), `First add: ${a} + ${b} = ${a + b}. Then take away: ${a + b} − ${c} = ${ans}.`, F([i, `${a} + ${b}`, `${a + b}`], ["", `${a + b} − ${c}`, `${ans}`, 1]));
  }
  for (let k = 0; k < 16; k++) {
    const [p, q] = pickN(KIDS, 2), [thing] = pick(THINGS), a = ri(35, 89), b = ri(12, a - 8);
    Q("top", `${p} has ${a} ${thing}. ${q} has ${b} ${thing}. How many more ${thing} does ${p} have than ${q}?`, nums(a - b, [a + b, a - b + 10, a - b - 1]), `"How many more" means find the difference: ${a} − ${b} = ${a - b}.`, F(["", p, `${a}`], ["", q, `${b}`], ["", "Difference", `${a - b}`, 1]));
  }
  // Ranking in a row.
  for (let k = 0; k < 24; k++) {
    const l = ri(2, 9), r = ri(2, 9), n = l + r - 1, p = pick(KIDS);
    if (k % 3 === 2) { const a = ri(1, 4), b = ri(a + 3, 12); Q("top", `In a line, ${p} is ${ord(a)} and Dev is ${ord(b)} from the front. How many children are standing between them?`, nums(b - a - 1, [b - a, b - a + 1, b + a]), `Between the ${ord(a)} and ${ord(b)} places are places ${a + 1} to ${b - 1}. That is ${b} − ${a} − 1 = ${b - a - 1} children.`, { t: "seq", items: Array.from({ length: b - a + 1 }, (_, j) => String(a + j)), hl: 0 }); }
    else Q("top", `In a row of children, ${p} is ${ord(l)} from the left and ${ord(r)} from the right. How many children are in the row?`, nums(n, [l + r, l + r + 1, Math.abs(l - r) || 1]), `Add both places and subtract 1, because ${p} was counted twice: ${l} + ${r} − 1 = ${n}.`, { t: "count", n, i: "🧒" });
  }
  // Number puzzles.
  for (let k = 0; k < 24; k++) {
    const t = ri(1, 8), u = ri(0, 9); if (t === u) continue; const n = t * 10 + u;
    if (k % 2) Q("top", `I am a 2-digit number. My tens digit is ${t}. My ones digit is ${u > t ? `${u - t} more` : `${t - u} less`} than my tens digit. Who am I?`, nums(n, [u * 10 + t, t * 10 + (u > t ? u - t : t + (t - u)) % 10, n + 10]), `Tens digit = ${t}. Ones digit = ${t} ${u > t ? "+" : "−"} ${Math.abs(u - t)} = ${u}. The number is ${n}.`, { t: "place", n });
    else { const lo = Math.floor(n / 10) * 10; Q("top", `I am between ${lo} and ${lo + 10}. The sum of my digits is ${t + u}. Who am I?`, nums(n, [u * 10 + t, n + 1, n - 1].filter(x => x !== n)), `Numbers between ${lo} and ${lo + 10} have tens digit ${t}. ${t} + ${u} = ${t + u}, so the ones digit is ${u}. The number is ${n}.`, { t: "place", n }); }
  }
  // Tens and ones in disguise.
  for (let k = 0; k < 20; k++) {
    const vals = [], labels = [];
    while (vals.length < 4) { const t = ri(1, 6), o = ri(0, 25), v = t * 10 + o; if (!vals.includes(v)) { vals.push(v); labels.push(`${t} ten${t > 1 ? "s" : ""} ${o} ones`); } }
    const big = k % 2 === 0, ai = vals.indexOf(big ? Math.max(...vals) : Math.min(...vals));
    Q("top", `Which is the ${big ? "biggest" : "smallest"}?`, [labels[ai], ...labels.filter((_, j) => j !== ai)], `Change each into a number: ${labels.map((l, j) => `${l} = ${vals[j]}`).join(", ")}. The ${big ? "biggest" : "smallest"} is ${vals[ai]}.`, { t: "bars", items: vals.map(v => [String(v), v]), hl: ai });
  }
  // Patterns with two-step rules and letters.
  for (let k = 0; k < 30; k++) {
    let seq, why;
    const kind = k % 5;
    if (kind === 0) { const s = ri(1, 9), a = ri(2, 5), b = ri(1, a - 1); seq = [s]; for (let i = 1; i < 7; i++) seq.push(seq[i - 1] + (i % 2 ? a : -b)); why = `The rule is +${a}, then −${b}, again and again.`; }
    else if (kind === 1) { const s = ri(1, 5); seq = [s]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + i); why = "The jumps grow by 1 each time: +1, +2, +3, +4, +5."; }
    else if (kind === 2) { const s = ri(0, 4), st = ri(2, 4); seq = Array.from({ length: 5 }, (_, i) => AL[s + i * st]); why = `Skip ${st - 1} letter${st > 2 ? "s" : ""} each time.`; }
    else if (kind === 3) { const s = ri(20, 25), st = ri(2, 3); seq = Array.from({ length: 5 }, (_, i) => AL[s - i * st]); why = `The letters go backwards, ${st} steps at a time.`; }
    else { const s = ri(1, 3); seq = [s]; for (let i = 1; i < 5; i++) seq.push(seq[i - 1] * 2); why = "Each number is double the one before."; }
    const ans = seq[seq.length - 1], shown = seq.slice(0, -1).join(", ") + ", __";
    const opts = typeof ans === "string" ? [ans, AL[(AL.indexOf(ans) + 1) % 26], AL[(AL.indexOf(ans) + 25) % 26], AL[(AL.indexOf(ans) + 2) % 26]] : nums(ans, [ans + 1, ans - 1, ans + 2]);
    Q("top", `What comes next? ${shown}`, opts, `${why} So the next one is ${ans}.`, { t: "seq", items: seq.map(String).slice(-5), hl: Math.min(seq.length, 5) - 1 });
  }
  // Time and calendar.
  for (let k = 0; k < 24; k++) {
    const kind = k % 4;
    if (kind === 0) { const h = ri(1, 12), d = ri(2, 6), e = (h + d - 1) % 12 + 1; Q("top", `What time will it be ${d} hours after ${h} o'clock?`, [`${e} o'clock`, `${(e % 12) + 1} o'clock`, `${(e + 10) % 12 + 1} o'clock`, `${h + d} o'clock`].filter((x, i, a) => a.indexOf(x) === i).concat([`${(e + 2) % 12 + 1} o'clock`]).slice(0, 4), `Count ${d} hours forward from ${h}: the short hand moves to ${e}. After 12 the clock starts again at 1.`, { t: "clock", h: e, m: 0 }); }
    else if (kind === 1) { const m = ri(0, 11), d = ri(2, 5), ans = MONTHS[(m + d) % 12]; Q("top", `Which month comes ${d} months after ${MONTHS[m]}?`, words(ans, MONTHS, [MONTHS[m]]), `Count forward ${d} months from ${MONTHS[m]}: ${Array.from({ length: d }, (_, j) => MONTHS[(m + j + 1) % 12]).join(", ")}.`, { t: "seq", items: Array.from({ length: d + 1 }, (_, j) => MONTHS[(m + j) % 12].slice(0, 3)), hl: d }); }
    else if (kind === 2) { const t = ri(0, 6), ans = DAYS[t]; Q("top", `The day after tomorrow is ${DAYS[(t + 2) % 7]}. What day is today?`, words(ans, DAYS, [DAYS[(t + 2) % 7]]), `Today → tomorrow → day after tomorrow. Go back 2 days from ${DAYS[(t + 2) % 7]}: ${DAYS[(t + 1) % 7]}, then ${ans}.`, { t: "seq", items: [0, 1, 2].map(j => DAYS[(t + j) % 7].slice(0, 3)), hl: 0, rule: "+1" }); }
    else { const t = ri(0, 6), ans = DAYS[(t + 6) % 7]; Q("top", `Today is ${DAYS[t]}. What day was it yesterday's yesterday?`, words(DAYS[(t + 5) % 7], DAYS, [DAYS[t]]), `Yesterday's yesterday is 2 days ago. 2 days before ${DAYS[t]} is ${DAYS[(t + 5) % 7]}.`, { t: "seq", items: [5, 6, 0].map(j => DAYS[(t + j) % 7].slice(0, 3)), hl: 0, rule: "+1" }); }
  }
  // Money.
  const SHOP = [["pencil", 6], ["rubber", 4], ["sharpener", 5], ["notebook", 15], ["sticker sheet", 25], ["ruler", 8]];
  for (let k = 0; k < 24; k++) {
    const [[a, pa], [b, pb]] = pickN(SHOP, 2), na = ri(2, 3), nb = ri(1, 3), cost = na * pa + nb * pb;
    if (k % 2) Q("top", `A ${a} costs ₹${pa} and a ${b} costs ₹${pb}. What is the cost of ${na} ${a}s and ${nb} ${b}${nb > 1 ? "s" : ""}?`, nums(cost, [pa + pb, na * pa, cost + pb], rupees), `${na} × ₹${pa} = ₹${na * pa} and ${nb} × ₹${pb} = ₹${nb * pb}. Total: ₹${cost}.`, F(["", `${na} ${a}s`, `₹${na * pa}`], ["", `${nb} ${b}${nb > 1 ? "s" : ""}`, `₹${nb * pb}`], ["", "Total", `₹${cost}`, 1]));
    else { const have = cost < 50 ? 50 : 100; Q("top", `Meera has ₹${have}. She buys ${na} ${a}s at ₹${pa} each and ${nb} ${b}${nb > 1 ? "s" : ""} at ₹${pb} each. How much money is left?`, nums(have - cost, [cost, have - na * pa, have - cost + 10], rupees), `She spends ${na} × ₹${pa} + ${nb} × ₹${pb} = ₹${cost}. Left: ₹${have} − ₹${cost} = ₹${have - cost}.`, F(["💰", "Has", `₹${have}`], ["", "Spends", `₹${cost}`], ["", "Left", `₹${have - cost}`, 1])); }
  }
  // Odd one out among numbers.
  for (let k = 0; k < 20; k++) {
    const kind = k % 3; let set, odd, why;
    if (kind === 0) { const u = ri(1, 9); set = pickN([1, 2, 3, 4, 5, 6, 7, 8, 9], 4).map(t => t * 10 + u); odd = set[3] + (u < 9 ? 1 : -1); set = [set[0], set[1], set[2]]; why = `${set.join(", ")} all end in ${u}.`; }
    else if (kind === 1) { set = pickN(Array.from({ length: 45 }, (_, i) => i * 2 + 10), 3); odd = ri(5, 49) * 2 + 1; why = `${set.join(", ")} are even numbers. ${odd} is odd.`; }
    else { const m = pick([5, 10]); set = pickN(Array.from({ length: 19 }, (_, i) => (i + 1) * m), 3); odd = set[0] + (m === 5 ? 2 : 5); why = `${set.join(", ")} are all in the ${m} times table.`; }
    if (set.includes(odd)) continue;
    Q("top", `Which number is the odd one out? ${mix([...set, odd]).join(", ")}`, [odd, ...set], `${why} ${odd} does not follow the rule.`, C(...set.map(x => ["", String(x), "follows rule"]), ["", String(odd), "odd one", 1]));
  }
  // Missing digits and numbers.
  for (let k = 0; k < 24; k++) {
    if (k % 2) { const a = ri(21, 69), b = ri(11, 29), s = a + b, d = Math.floor(a / 10); Q("top", `What digit goes in the box? ☐${a % 10} + ${b} = ${s}`, nums(d, [d + 1, d - 1, Math.floor(s / 10)]), `${s} − ${b} = ${a}, so the missing digit is ${d}.`, F(["", `${s} − ${b}`, `${a}`], ["", "Missing digit", `${d}`, 1])); }
    else { const b = ri(11, 39), c = ri(12, 49), a = b + c; Q("top", `Which number goes in the blank? __ − ${b} = ${c}`, nums(a, [c - b > 0 ? c - b : c + 1, a + 10, a - 10]), `Work backwards: the number is ${c} + ${b} = ${a}. Check: ${a} − ${b} = ${c}.`, F(["", `${c} + ${b}`, `${a}`, 1], ["", "Check", `${a} − ${b} = ${c}`])); }
  }
  // Number analogies.
  for (let k = 0; k < 20; k++) {
    const kind = k % 4, a = ri(2, 9), b = ri(2, 9); if (a === b) continue;
    const f = kind === 0 ? x => x * 2 : kind === 1 ? x => x + 10 : kind === 2 ? x => x * x : x => x * 10 + x, name = ["double it", "add 10", "multiply it by itself", "write the digit twice"][kind];
    Q("top", `Find the missing number. ${a} : ${f(a)} :: ${b} : ?`, nums(f(b), [f(b) + 1, f(a) + b - a > 0 ? f(a) + b - a : f(b) + 2, b * 2 === f(b) ? b + 10 : b * 2]), `The rule is "${name}": ${a} → ${f(a)}. So ${b} → ${f(b)}.`, F(["", `${a} → ${f(a)}`, name], ["", `${b} → ${f(b)}`, "", 1]));
  }
  // Shapes, solids and combinations.
  const SOL = [["cube", "🧊", 6, 0, 8], ["cuboid", "📦", 6, 0, 8], ["cylinder", "🥫", 2, 1, 0], ["cone", "🍦", 1, 1, 1], ["sphere", "⚽", 0, 1, 0]];
  SOL.forEach(([s, e, flat, curved, corners]) => {
    Q("top", `How many flat faces does a ${s} have?`, nums(flat, [flat + 1, flat + 2, curved]), `A ${s} has ${flat} flat face${flat === 1 ? "" : "s"}${curved ? " and 1 curved surface" : ""}.`, C([e, cap1(s), `${flat} flat`, 1]));
    Q("top", `How many corners does a ${s} have?`, nums(corners, [corners + 1, corners + 2, 4]), `A ${s} has ${corners === 0 ? "no corners" : corners === 1 ? "1 corner (its pointed tip)" : corners + " corners"}.`, C([e, cap1(s), `${corners} corners`, 1]));
  });
  ["cube", "cylinder", "cone", "sphere"].forEach(s => { const r = SOL.find(x => x[0] === s), rolls = r[3] > 0, slides = r[2] > 0; Q("top", `Which solid can both roll and slide?`, ["Cylinder", "Cube", "Sphere", "Cuboid"], "A cylinder rolls on its curved surface and slides on its flat faces. A sphere only rolls; a cube and cuboid only slide.", C(["🥫", "Cylinder", "rolls + slides", 1], ["⚽", "Sphere", "rolls"], ["🧊", "Cube", "slides"])); });
  for (let k = 0; k < 16; k++) {
    const t = ri(1, 4), s = ri(1, 4), ans = t * 3 + s * 4;
    Q("top", `How many corners do ${t} triangle${t > 1 ? "s" : ""} and ${s} square${s > 1 ? "s" : ""} have in all?`, nums(ans, [t + s, (t + s) * 4, ans - 1]), `Each triangle has 3 corners and each square has 4. ${t} × 3 + ${s} × 4 = ${t * 3} + ${s * 4} = ${ans}.`, F(["🔺", `${t} × 3`, `${t * 3}`], ["⬛", `${s} × 4`, `${s * 4}`], ["", "In all", `${ans}`, 1]));
  }
  for (let k = 0; k < 12; k++) {
    const a = ri(2, 4), b = ri(2, 4);
    Q("top", `Tara has ${a} different shirts and ${b} different skirts. How many different outfits of one shirt and one skirt can she make?`, nums(a * b, [a + b, a * b + 1, a + b + 1]), `Each of the ${a} shirts can go with each of the ${b} skirts: ${a} × ${b} = ${a * b} outfits.`, { t: "array", r: a, c: b, i: "👗", cap: `${a} shirts × ${b} skirts = ${a * b}` });
  }
  // Measurement.
  for (let k = 0; k < 20; k++) {
    if (k % 2) { const a = ri(6, 15), d = ri(2, 8); Q("top", `A pencil is ${a} cm long. A pen is ${d} cm longer than the pencil. What is their total length?`, nums(2 * a + d, [a + d, 2 * a, a + 2 * d]).map(x => x + " cm"), `Pen = ${a} + ${d} = ${a + d} cm. Total = ${a} + ${a + d} = ${2 * a + d} cm.`, F(["✏️", "Pencil", `${a} cm`], ["🖊️", "Pen", `${a + d} cm`], ["", "Total", `${2 * a + d} cm`, 1])); }
    else { const x = ri(2, 4), y = ri(2, 3); Q("top", `1 apple weighs the same as ${x} strawberries. How many strawberries weigh the same as ${y} apples?`, nums(x * y, [x + y, x * y + x, x * y - 1]), `Each apple balances ${x} strawberries, so ${y} apples balance ${y} × ${x} = ${x * y} strawberries.`, { t: "array", r: y, c: x, i: "🍓", cap: `${y} apples = ${x * y} strawberries` }); }
  }
  // Pictographs.
  const PIC = [["🍎", "apples"], ["🍪", "cookies"], ["🎈", "balloons"]];
  for (let k = 0; k < 20; k++) {
    const [e, nm] = pick(PIC), key = 2, days = ["Mon", "Tue", "Wed"], cnt = days.map(() => ri(1, 5)), qd = ri(0, 2), total = k % 2;
    const ans = total ? cnt.reduce((a, b) => a + b) * key : cnt[qd] * key;
    Q("top", total ? `Each ${e} stands for ${key} ${nm}. How many ${nm} were sold in all three days?` : `Each ${e} stands for ${key} ${nm}. How many ${nm} were sold on ${days[qd]}?`, nums(ans, [ans / key, ans + key, ans - key]),
      total ? `Count all the pictures: ${cnt.join(" + ")} = ${cnt.reduce((a, b) => a + b)}. Each is ${key}, so ${cnt.reduce((a, b) => a + b)} × ${key} = ${ans}.` : `${days[qd]} has ${cnt[qd]} pictures. Each is ${key}, so ${cnt[qd]} × ${key} = ${ans}.`,
      C(...days.map((d, j) => ["", d, e.repeat(cnt[j]), !total && j === qd])), { qv: C(...days.map((d, j) => ["", d, e.repeat(cnt[j])])) });
  }
  // Letter coding.
  for (let k = 0; k < 16; k++) {
    const w = pick(["BAD", "CAB", "BED", "ACE", "DEAF", "FACE", "BEAD", "CAGE", "HIDE", "ABE"].filter(x => x !== "ABE")), sum = w.split("").reduce((a, c) => a + AL.indexOf(c) + 1, 0);
    Q("top", `If A = 1, B = 2, C = 3 and so on, what is the total of the letters in ${w}?`, nums(sum, [sum + 1, sum - 1, w.length * 3]), `${w.split("").map(c => `${c} = ${AL.indexOf(c) + 1}`).join(", ")}. Total: ${w.split("").map(c => AL.indexOf(c) + 1).join(" + ")} = ${sum}.`, F(...w.split("").map(c => ["", c, String(AL.indexOf(c) + 1)]), ["", "Total", String(sum), 1]));
  }
  // Greatest / smallest numbers with conditions.
  [["the greatest 2-digit number", 99], ["the smallest 2-digit number", 10], ["the greatest 2-digit number with different digits", 98], ["the smallest 2-digit number with different digits", 10], ["the greatest 2-digit even number", 98], ["the smallest 2-digit odd number", 11], ["the greatest 2-digit odd number", 99], ["the smallest 3-digit number", 100]].forEach(([d, v]) =>
    Q("top", `What is ${d}?`, nums(v, [v === 99 ? 98 : 99, v === 10 ? 11 : 10, v + 1 > 100 ? 90 : v === 100 ? 999 : v + 1]), `${cap1(d)} is ${v}.`, { t: "place", n: Math.min(v, 99) }));
  for (let k = 0; k < 12; k++) {
    const ds = pickN([1, 2, 3, 4, 5, 6, 7, 8, 9], 3), big = k % 2 === 0, s = ds.slice().sort((a, b) => a - b), ans = big ? s[2] * 10 + s[1] : s[0] * 10 + s[1];
    Q("top", `Using the digits ${ds.join(", ")} (each only once), what is the ${big ? "greatest" : "smallest"} 2-digit number you can make?`, nums(ans, [big ? s[1] * 10 + s[2] : s[1] * 10 + s[0], big ? s[2] * 10 + s[0] : s[0] * 10 + s[2], s[2] * 100 + s[1] * 10 + s[0]]), `For the ${big ? "greatest" : "smallest"}, put the ${big ? "biggest" : "smallest"} digit in the tens place and the next ${big ? "biggest" : "smallest"} in the ones place: ${ans}.`, { t: "place", n: ans });
  }
  // Counting between.
  for (let k = 0; k < 12; k++) { const a = ri(11, 70), b = a + ri(4, 15); Q("top", `How many numbers are there between ${a} and ${b}?`, nums(b - a - 1, [b - a, b - a + 1, b - a - 2]), `The numbers between are ${a + 1} to ${b - 1}. That is ${b} − ${a} − 1 = ${b - a - 1} numbers (don't count ${a} and ${b} themselves).`, { t: "numline", from: a, to: b, mark: a + 1 }); }
};

H[4].imo = Q => {
  // Place value puzzles.
  for (let k = 0; k < 20; k++) {
    const d = ri(2, 9), p1 = ri(3, 4), p2 = ri(0, 2), digits = Array.from({ length: 5 }, () => ri(0, 9).toString());
    digits[0] = String(ri(1, 9)); for (let i = 0; i < 5; i++) if (+digits[i] === d) digits[i] = String((d + 1) % 10 || 1);
    digits[4 - p1] = String(d); digits[4 - p2] = String(d); if (digits[0] === "0") digits[0] = "1";
    const n = digits.join(""), diff = d * 10 ** p1 - d * 10 ** p2;
    if ((n.match(new RegExp(d, "g")) || []).length !== 2) continue;
    Q("top", `What is the difference between the place values of the two ${d}s in ${N(+n)}?`, nums(diff, [0, d * 10 ** p1 + d * 10 ** p2, d * 10 ** (p1 - 1) - d * 10 ** p2 || d]), `The ${d}s stand for ${N(d * 10 ** p1)} and ${N(d * 10 ** p2)}. Difference: ${N(d * 10 ** p1)} − ${N(d * 10 ** p2)} = ${N(diff)}.`, { t: "pv", n, i: 4 - p1 });
  }
  for (let k = 0; k < 16; k++) {
    const ds = pickN([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 5), kind = k % 4, all = perms(ds).filter(p => p[0] !== 0).map(p => +p.join(""));
    const cand = kind === 0 ? all.filter(x => x % 2 === 0) : kind === 1 ? all.filter(x => x % 2 === 1) : kind === 2 ? all.filter(x => x % 5 === 0) : all;
    if (!cand.length) continue;
    const big = kind !== 3, ans = big ? Math.max(...cand) : Math.min(...cand), label = ["largest even", "largest odd", "largest number divisible by 5", "smallest"][kind];
    const wrong = [Math.max(...all), Math.min(...all), ...all.filter(x => x !== ans).slice(0, 5)].filter(x => x !== ans);
    Q("top", `Using ${ds.join(", ")} once each, what is the ${label} 5-digit number?`, nums(ans, wrong), kind === 3 ? `Put the smallest non-zero digit first, then the rest in increasing order: ${N(ans)}.` : `The last digit must be ${kind === 0 ? "even" : kind === 1 ? "odd" : "0 or 5"}. Choose the smallest such digit for the ones place so the bigger digits stay in front: ${N(ans)}.`, { t: "seq", items: String(ans).split(""), hl: 4 });
  }
  // Multi-step money.
  const ITEMS4 = [["notebook", 45], ["pen", 18], ["compass set", 120], ["water bottle", 85], ["story book", 150], ["pencil case", 65]];
  for (let k = 0; k < 24; k++) {
    const [[a, pa], [b, pb]] = pickN(ITEMS4, 2), na = ri(2, 5), nb = ri(2, 4), cost = na * pa + nb * pb, paid = Math.ceil((cost + 1) / 100) * 100 + (k % 3 === 0 ? 500 : 0);
    Q("top", `Ravi buys ${na} ${a}s at ₹${pa} each and ${nb} ${b}s at ₹${pb} each. He pays ₹${N(paid)}. How much change does he get?`, nums(paid - cost, [paid - na * pa, paid - cost - 10, cost]).map(x => "₹" + x), `Cost = ${na} × ₹${pa} + ${nb} × ₹${pb} = ₹${na * pa} + ₹${nb * pb} = ₹${N(cost)}. Change = ₹${N(paid)} − ₹${N(cost)} = ₹${N(paid - cost)}.`, F(["", "Cost", "₹" + N(cost)], ["💵", "Paid", "₹" + N(paid)], ["", "Change", "₹" + N(paid - cost), 1]));
  }
  // Time intervals across noon.
  const fmt12 = m => { const h = Math.floor(m / 60), mm = m % 60; return `${(h + 11) % 12 + 1}:${String(mm).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };
  const dur = m => `${Math.floor(m / 60)} h ${m % 60} min`;
  for (let k = 0; k < 24; k++) {
    const s = ri(7, 11) * 60 + pick([5, 10, 15, 20, 25, 35, 40, 45, 50]), d = ri(2, 5) * 60 + pick([5, 10, 15, 25, 35, 40, 50]), e = s + d;
    if (k % 2) Q("top", `A train leaves at ${fmt12(s)} and reaches at ${fmt12(e)}. How long is the journey?`, [dur(d), dur(d + 60), dur(d - 60), dur(d + 10)], `From ${fmt12(s)} to ${fmt12(e)}: count whole hours, then the extra minutes. The journey takes ${dur(d)}.`, F(["🚆", fmt12(s), "leaves"], ["", `+ ${dur(d)}`, ""], ["", fmt12(e), "arrives", 1]));
    else Q("top", `A play starts at ${fmt12(s)} and lasts ${dur(d)}. When does it end?`, [fmt12(e), fmt12(e + 60), fmt12(e - 30), fmt12(e).replace(/am|pm/, x => x === "am" ? "pm" : "am")], `${fmt12(s)} + ${Math.floor(d / 60)} h = ${fmt12(s + Math.floor(d / 60) * 60)}, then + ${d % 60} min = ${fmt12(e)}.`, F(["🎭", fmt12(s), "start"], ["", `+ ${dur(d)}`, ""], ["", fmt12(e), "end", 1]));
  }
  // Calendar.
  for (let k = 0; k < 24; k++) {
    const d1 = ri(1, 10), w = ri(0, 6), d2 = d1 + ri(5, 20), ans = DAYS[(w + d2 - d1) % 7], m = pick(MONTHS);
    if (k % 3 === 2) { const mi = ri(0, 10), days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], a = ri(10, 25), b = ri(3, 20), tot = days[mi] - a + 1 + b; Q("top", `How many days are there from ${a} ${MONTHS[mi]} to ${b} ${MONTHS[mi + 1]}, counting both days? (Not a leap year.)`, nums(tot, [tot - 1, tot + 1, tot - 2]), `${MONTHS[mi]} has ${days[mi]} days. From ${a} to ${days[mi]} is ${days[mi] - a + 1} days, plus ${b} days of ${MONTHS[mi + 1]}: ${days[mi] - a + 1} + ${b} = ${tot}.`, F(["📅", MONTHS[mi], `${days[mi] - a + 1} days`], ["📅", MONTHS[mi + 1], `${b} days`], ["", "Total", `${tot}`, 1])); }
    else Q("top", `If ${d1} ${m} is a ${DAYS[w]}, what day of the week is ${d2} ${m}?`, words(ans, DAYS), `${d2} − ${d1} = ${d2 - d1} days later.${d2 - d1 >= 7 ? ` ${d2 - d1} = ${Math.floor((d2 - d1) / 7)} week${d2 - d1 >= 14 ? "s" : ""} and ${(d2 - d1) % 7} day${(d2 - d1) % 7 === 1 ? "" : "s"}. A whole week brings back the same day.` : ""} ${(d2 - d1) % 7} days after ${DAYS[w]} is ${ans}.`, { t: "seq", items: Array.from({ length: (d2 - d1) % 7 + 1 }, (_, j) => DAYS[(w + j) % 7].slice(0, 3)), hl: (d2 - d1) % 7, rule: "+1" });
  }
  // Coding-decoding.
  const CW = ["PEN", "BAG", "CAT", "DOG", "SUN", "MAP", "BOOK", "TREE", "FISH", "LAMP", "KITE", "GOLD", "MILK", "SHIP"];
  for (let k = 0; k < 30; k++) {
    const kind = k % 3, [w1, w2] = pickN(CW, 2);
    if (kind === 0) { const sh = pick([1, 2, -1]), enc = w => w.split("").map(c => AL[(AL.indexOf(c) + sh + 26) % 26]).join(""), ans = enc(w2); Q("top", `If ${w1} is written as ${enc(w1)}, how is ${w2} written in the same code?`, [ans, w2.split("").map(c => AL[(AL.indexOf(c) - sh + 26) % 26]).join(""), w2.split("").map(c => AL[(AL.indexOf(c) + sh * 2 + 26) % 26]).join(""), ans.split("").reverse().join("")].filter((x, i, a) => a.indexOf(x) === i).concat([ans.slice(1) + ans[0]]).slice(0, 4), `Each letter moves ${Math.abs(sh)} place${Math.abs(sh) > 1 ? "s" : ""} ${sh > 0 ? "forward" : "back"} in the alphabet (${w1[0]} → ${enc(w1)[0]}). So ${w2} → ${ans}.`, F(["", w1, enc(w1)], ["", `${sh > 0 ? "+" : "−"}${Math.abs(sh)} each`, ""], ["", w2, ans, 1])); }
    else if (kind === 1) { const v = w => w.split("").reduce((a, c) => a + AL.indexOf(c) + 1, 0); Q("top", `If ${w1} = ${v(w1)} (adding letter positions A = 1 … Z = 26), what is ${w2}?`, nums(v(w2), [v(w2) + 2, v(w2) - 3, v(w1)]), `${w2.split("").map(c => `${c} = ${AL.indexOf(c) + 1}`).join(", ")}. Sum = ${v(w2)}.`, F(...w2.split("").map(c => ["", c, String(AL.indexOf(c) + 1)]), ["", "Sum", String(v(w2)), 1])); }
    else { const enc = w => w.split("").reverse().join(""); Q("top", `If ${w1} is coded as ${enc(w1)}, how is ${w2} coded?`, [enc(w2), w2, enc(w2).slice(1) + enc(w2)[0], w2.slice(1) + w2[0]].filter((x, i, a) => a.indexOf(x) === i).length === 4 ? [enc(w2), w2, enc(w2).slice(1) + enc(w2)[0], w2.slice(1) + w2[0]] : [enc(w2), w2, w2 + "S", enc(w2) + "S"], `The letters are written in reverse order. ${w2} → ${enc(w2)}.`, F(["", w1, enc(w1)], ["", "reverse", ""], ["", w2, enc(w2), 1])); }
  }
  // Letter and number series.
  for (let k = 0; k < 30; k++) {
    const kind = k % 6; let seq, why;
    if (kind === 0) { const s = ri(0, 5), st = ri(3, 4); seq = Array.from({ length: 6 }, (_, i) => AL[s + i * st]).slice(0, 5); why = `Each letter is ${st} places after the one before.`; }
    else if (kind === 1) { const s = ri(0, 4); seq = Array.from({ length: 5 }, (_, i) => AL[s + i] + AL[25 - s - i]); why = "The first letter moves forward and the second moves backward by one each time."; }
    else if (kind === 2) { const s = ri(1, 3); seq = [s]; for (let i = 1; i < 5; i++) seq.push(seq[i - 1] * 2 + 1); why = "Each number is doubled and then 1 is added."; }
    else if (kind === 3) { seq = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].slice(ri(0, 4)).slice(0, 5); why = "These are prime numbers (numbers with exactly two factors)."; }
    else if (kind === 4) { const a = ri(1, 3), b = ri(1, 4); seq = [a, b]; for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]); seq = seq.slice(0, 6); why = "Each number is the sum of the two before it."; }
    else { const s = ri(1, 4); seq = Array.from({ length: 5 }, (_, i) => (s + i) ** 2 + 1); why = "Square numbers plus 1."; }
    const ans = seq[seq.length - 1], shown = seq.slice(0, -1).join(", ") + ", __";
    let opts;
    if (typeof ans === "string") { const sh = x => x.split("").map(c => AL[(AL.indexOf(c) + 1) % 26]).join(""); opts = [ans, sh(ans), ans.split("").reverse().join(""), sh(sh(ans))]; }
    else opts = nums(ans, [ans + 1, ans - 1, ans + 2]);
    if (new Set(opts).size < 4) continue;
    Q("top", `What comes next? ${shown}`, opts, `${why} So the next term is ${ans}.`, { t: "seq", items: seq.slice(-5).map(String), hl: 4 });
  }
  // Ranking.
  for (let k = 0; k < 20; k++) {
    const n = ri(25, 50), t = ri(5, n - 5), p = pick(KIDS);
    if (k % 2) Q("top", `In a class of ${n} students, ${p} is ${ord(t)} from the top. What is ${p}'s rank from the bottom?`, nums(n - t + 1, [n - t, n - t + 2, t]), `Rank from bottom = total − rank from top + 1 = ${n} − ${t} + 1 = ${n - t + 1}.`, F(["", "Total", `${n}`], ["", "From top", `${t}`], ["", "From bottom", `${n - t + 1}`, 1]));
    else { const b = ri(5, 20); Q("top", `${p} is ${ord(t > 20 ? 14 : t)} from the front and ${ord(b)} from the back of a queue. How many people are in the queue?`, nums((t > 20 ? 14 : t) + b - 1, [(t > 20 ? 14 : t) + b, (t > 20 ? 14 : t) + b + 1, Math.abs((t > 20 ? 14 : t) - b)]), `Add both positions and subtract 1 (${p} is counted twice): ${t > 20 ? 14 : t} + ${b} − 1 = ${(t > 20 ? 14 : t) + b - 1}.`, F(["", "Front", ord(t > 20 ? 14 : t)], ["", "Back", ord(b)], ["", "Total", String((t > 20 ? 14 : t) + b - 1), 1])); }
  }
  // Direction sense.
  const DIR = ["North", "East", "South", "West"];
  for (let k = 0; k < 24; k++) {
    const a = ri(3, 12), b = ri(2, 9), start = ri(0, 3), turn = pick(["right", "left"]), t = turn === "right" ? 1 : 3;
    const d1 = DIR[start], d2 = DIR[(start + t) % 4];
    if (k % 2) Q("top", `Asha walks ${a} m towards the ${d1}. She turns ${turn} and walks ${b} m. Which direction is she facing now?`, words(d2, DIR, [d2]), `Facing ${d1}, a ${turn} turn makes her face ${d2}.`, C(["🧭", d1, "first"], ["↪️", `turn ${turn}`, ""], ["", d2, "now", 1]));
    else Q("top", `Asha walks ${a} m ${d1}, turns ${turn} and walks ${b} m, then turns ${turn} again and walks ${a} m. How far is she from where she started?`, nums(b, [a, a + b, 2 * a + b]).map(x => x + " m"), `The first and last walks (${a} m each) cancel out because she ends up facing the opposite way. She is only ${b} m from the start.`, C(["⬆️", `${a} m ${d1}`, ""], ["➡️", `${b} m ${d2}`, "", 1], ["⬇️", `${a} m back`, ""]));
  }
  // Fractions in words.
  for (let k = 0; k < 24; k++) {
    if (k % 2) { const d = pick([6, 8, 10, 12]), a = ri(1, d / 2 - 1), b = ri(1, d - a - 1), left = d - a - b; Q("top", `Riya ate ${a}/${d} of a pizza and Aman ate ${b}/${d} of it. What fraction of the pizza is left?`, [`${left}/${d}`, `${a + b}/${d}`, `${left}/${d * 2}`, `${a + b}/${d * 2}`].filter((x, i, arr) => arr.indexOf(x) === i).concat([`${left + 1}/${d}`]).slice(0, 4), `They ate ${a}/${d} + ${b}/${d} = ${a + b}/${d}. Left: ${d}/${d} − ${a + b}/${d} = ${left}/${d}.`, { t: "frac", n: left, d }); }
    else { const d = pick([3, 4, 5, 6, 8]), n = ri(2, d - 1), part = ri(3, 9), whole = d * part, given = n * part; Q("top", `${n}/${d} of a number is ${given}. What is the number?`, nums(whole, [given * n, given + d, whole + part]), `${n} parts are ${given}, so 1 part is ${given} ÷ ${n} = ${part}. The whole has ${d} parts: ${d} × ${part} = ${whole}.`, { t: "frac", n, d, total: whole }); }
  }
  // Area / perimeter reasoning.
  for (let k = 0; k < 20; k++) {
    const w = ri(4, 12), h = ri(3, w - 1);
    if (k % 2) Q("top", `The area of a rectangle is ${w * h} sq cm and its length is ${w} cm. What is its perimeter?`, nums(2 * (w + h), [w + h, w * h, 2 * w + h]).map(x => x + " cm"), `Width = area ÷ length = ${w * h} ÷ ${w} = ${h} cm. Perimeter = 2 × (${w} + ${h}) = ${2 * (w + h)} cm.`, { t: "rect", w, h });
    else { const s = ri(3, 10); Q("top", `A square and a rectangle have the same perimeter. The square has side ${s} cm and the rectangle is ${s + 2} cm long. How wide is the rectangle?`, nums(s - 2, [s, s + 2, 2 * s - 2]).map(x => x + " cm"), `Square perimeter = 4 × ${s} = ${4 * s} cm. Rectangle: 2 × (${s + 2} + width) = ${4 * s}, so ${s + 2} + width = ${2 * s}, width = ${s - 2} cm.`, { t: "rect", w: s + 2, h: s - 2 }); }
  }
  // Conversions and comparison.
  for (let k = 0; k < 20; k++) {
    const [big, small, f] = pick([["kg", "g", 1000], ["L", "mL", 1000], ["km", "m", 1000]]), b = ri(2, 6), base = b * f;
    const vals = [base + 500, base + 50, base + 5, base + 55];
    const labels = [`${b} ${big} 500 ${small}`, `${N(base + 50)} ${small}`, `${b} ${big} 5 ${small}`, `${b} ${big} 55 ${small}`];
    const want = k % 2 === 0, ai = want ? 0 : 2;
    Q("top", `Which is the ${want ? "greatest" : "smallest"}?`, [labels[ai], ...labels.filter((_, i) => i !== ai)], `Change everything to ${small}: ${labels.map((l, i) => `${l} = ${N(vals[i])} ${small}`).join("; ")}. The ${want ? "greatest" : "smallest"} is ${labels[ai]}.`, { t: "bars", items: vals.map((v, i) => [String(i + 1), v]), hl: ai });
  }
  // Roman numeral arithmetic.
  for (let k = 0; k < 16; k++) { const a = ri(11, 49), b = ri(11, 49), s = a + b; Q("top", `What is ${roman(a).s} + ${roman(b).s}? (Answer in Roman numerals.)`, [roman(s).s, roman(s + 1).s, roman(s - 10).s, roman(s + 10).s], `${roman(a).s} = ${a} and ${roman(b).s} = ${b}. ${a} + ${b} = ${s} = ${roman(s).s}.`, F(["", roman(a).s, String(a)], ["", roman(b).s, String(b)], ["", roman(s).s, String(s), 1])); }
  // Clock angles and mirror time.
  for (let h = 1; h <= 6; h++) Q("top", `What is the smaller angle between the hands of a clock at ${h} o'clock?`, nums(h * 30, [h * 5, h * 15, 180 - h * 30 || 90]).map(x => x + "°"), `The 12 hour marks are 360° ÷ 12 = 30° apart. At ${h} o'clock the hands are ${h} marks apart: ${h} × 30° = ${h * 30}°.`, { t: "clock", h, m: 0 });
  for (let k = 0; k < 12; k++) { const h = ri(1, 11), m = pick([0, 15, 30, 45]), tot = 720 - (h * 60 + m), rh = Math.floor(tot / 60), rm = tot % 60, f = (H, M) => `${(H + 11) % 12 + 1}:${String(M).padStart(2, "0")}`; Q("top", `A clock seen in a mirror shows ${f(h, m)}. What is the real time?`, [f(rh, rm), f(h, m), f(12 - h, m), f(rh, (rm + 30) % 60)].filter((x, i, a) => a.indexOf(x) === i).concat([f(rh + 1, rm)]).slice(0, 4), `For a mirror clock, real time = 12:00 − time seen. 12:00 − ${f(h, m)} = ${f(rh, rm)}.`, { t: "clock", h: rh, m: rm }); }
  ["MOM", "WOW", "TOOT", "OTTO", "AHA", "TOT"].forEach(w => { const bad = pickN(["BOB", "DAD", "NOON", "POP", "SEES", "KAYAK", "CIVIC"], 3); Q("top", "Which word looks exactly the same in a mirror held beside it?", [w, ...bad], `${w} reads the same both ways and every letter (${[...new Set(w)].join(", ")}) looks the same when flipped. Letters like B, D, N, P, S, K, C change in a mirror.`, C(["🪞", w, "same", 1])); });
  // Order of operations and missing digits.
  for (let k = 0; k < 20; k++) {
    const b = ri(2, 9), a = b * ri(3, 12), c = ri(2, 6), d = ri(5, 30), e = ri(1, 9), ans = a / b * c + d - e;
    Q("top", `What is ${a} ÷ ${b} × ${c} + ${d} − ${e}?`, nums(ans, [a / (b * c) === Math.floor(a / (b * c)) ? a / (b * c) + d - e : ans + 7, ans + 2 * e, ans - d]), `Do ÷ and × first, left to right: ${a} ÷ ${b} = ${a / b}, × ${c} = ${a / b * c}. Then + and −: ${a / b * c} + ${d} − ${e} = ${ans}.`, F(["", `${a} ÷ ${b}`, `${a / b}`], ["", `× ${c}`, `${a / b * c}`], ["", `+ ${d} − ${e}`, `${ans}`, 1]));
  }
  for (let k = 0; k < 20; k++) {
    const n = ri(102, 249), m = ri(3, 9), p = n * m, t = Math.floor(n / 10) % 10, shown = String(n).replace(/(\d)(\d)(\d)/, (_, x, y, z) => `${x}☐${z}`);
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(dg => (Math.floor(n / 100) * 100 + dg * 10 + n % 10) * m === p).length !== 1) continue;
    Q("top", `Find the missing digit: ${shown} × ${m} = ${N(p)}`, nums(t, [t + 1, t - 1, (t + 5) % 10]), `${N(p)} ÷ ${m} = ${n}, so the missing digit is ${t}.`, F(["", `${N(p)} ÷ ${m}`, String(n)], ["", "Missing digit", String(t), 1]));
  }
  // Factors and multiples.
  const lcm = (a, b) => { let m = Math.max(a, b); while (m % a || m % b) m++; return m; };
  for (let k = 0; k < 24; k++) {
    const kind = k % 3;
    if (kind === 0) { const [a, b] = pickN([2, 3, 4, 5, 6, 8, 9, 10, 12], 2), l = lcm(a, b); if (l === Math.max(a, b)) continue; Q("top", `What is the smallest number that is a multiple of both ${a} and ${b}?`, nums(l, [a * b === l ? l * 2 : a * b, l + a, Math.max(a, b)]), `Multiples of ${a}: ${Array.from({ length: l / a }, (_, i) => a * (i + 1)).join(", ")}. The first one also in the ${b} table is ${l}.`, C(["", `${a} table`, `…, ${l}`], ["", `${b} table`, `…, ${l}`], ["", "Common", String(l), 1])); }
    else if (kind === 1) { const n = pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 48]), f = factors(n); Q("top", `How many factors does ${n} have?`, nums(f.length, [f.length - 2, f.length + 1, f.length - 1]), `Factors of ${n}: ${f.join(", ")}. That is ${f.length} factors.`, C(...f.map(x => ["", String(x), ""]))); }
    else { const n = pick([12, 15, 18, 20, 24, 28]), f = factors(n), s = f.reduce((a, b) => a + b); Q("top", `What is the sum of all the factors of ${n}?`, nums(s, [s - n, s - 1, s + n]), `Factors of ${n}: ${f.join(" + ")} = ${s}.`, C(...f.map(x => ["", String(x), ""]), ["", "Sum", String(s), 1])); }
  }
  // Ages and balances.
  for (let k = 0; k < 20; k++) {
    if (k % 2) { const b = ri(3, 8), m = ri(2, 4), y = ri(2, 6); Q("top", `Riya is ${m} times as old as her brother, who is ${b} years old. How old will Riya be after ${y} years?`, nums(m * b + y, [m * b, (b + y) * m, b + y]), `Riya now = ${m} × ${b} = ${m * b}. After ${y} years: ${m * b} + ${y} = ${m * b + y}.`, F(["🧒", "Brother", `${b}`], ["👧", "Riya now", `${m * b}`], ["", `+${y} years`, `${m * b + y}`, 1])); }
    else { const a = ri(2, 4), mg = ri(2, 3), o = ri(3, 6); const appl = a * 2; Q("top", `${appl} apples weigh the same as ${mg} mangoes, and 1 mango weighs the same as ${o} oranges. How many oranges weigh the same as ${appl} apples?`, nums(mg * o, [mg + o, appl * o, mg * o + o]), `${appl} apples = ${mg} mangoes = ${mg} × ${o} = ${mg * o} oranges.`, F(["🍎", `${appl} apples`, ""], ["🥭", `${mg} mangoes`, ""], ["🍊", `${mg * o} oranges`, "", 1])); }
  }
  // Counting figures.
  for (let m = 2; m <= 6; m++) Q("top", `How many triangles are there in this figure?`, nums(m * (m + 1) / 2, [m, m + 1, m * m]), `Count triangles made of 1 part, 2 parts, … up to ${m} parts: ${Array.from({ length: m }, (_, i) => m - i).join(" + ")} = ${m * (m + 1) / 2}.`, { t: "tri", m }, { qv: { t: "tri", m } });
  for (let m = 2; m <= 6; m++) Q("top", `How many rectangles are there in this strip?`, nums(m * (m + 1) / 2, [m, m + 1, 2 * m]), `Rectangles 1 box long: ${m}, 2 boxes: ${m - 1}, … ${m} boxes: 1. Total ${Array.from({ length: m }, (_, i) => m - i).join(" + ")} = ${m * (m + 1) / 2}.`, { t: "strip", m }, { qv: { t: "strip", m } });
  for (let n = 2; n <= 4; n++) { const s = Array.from({ length: n }, (_, i) => (i + 1) ** 2).reduce((a, b) => a + b); Q("top", `How many squares are there in a ${n} × ${n} grid?`, nums(s, [n * n, s - 1, s + n]), `Count squares of each size: ${Array.from({ length: n }, (_, i) => `${i + 1}×${i + 1}: ${(n - i) ** 2}`).join(", ")}. Total ${s}.`, { t: "rect", w: n, h: n, grid: 1, unit: "" }, { qv: { t: "rect", w: n, h: n, grid: 1, unit: "" } }); }
  // Estimation.
  for (let k = 0; k < 12; k++) { const a = ri(120, 899), b = ri(120, 899), ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100; Q("top", `Estimate ${a} + ${b} by rounding each number to the nearest hundred.`, nums(ra + rb, [a + b, ra + rb + 100, ra + rb - 100]), `${a} → ${ra} and ${b} → ${rb}. Estimate: ${ra} + ${rb} = ${N(ra + rb)}.`, F(["", `${a} → ${ra}`, ""], ["", `${b} → ${rb}`, ""], ["", "Estimate", N(ra + rb), 1])); }
  // Combinations.
  for (let k = 0; k < 10; k++) { const a = ri(2, 5), b = ri(2, 4), c = ri(2, 3); Q("top", `A café offers ${a} sandwiches, ${b} drinks and ${c} desserts. How many different meals of one sandwich, one drink and one dessert are possible?`, nums(a * b * c, [a + b + c, a * b + c, a * b * c + 1]), `Multiply the choices: ${a} × ${b} × ${c} = ${a * b * c}.`, F(["🥪", String(a), ""], ["🥤", `× ${b}`, ""], ["🍨", `× ${c}`, `= ${a * b * c}`, 1])); }
  // Data handling with a key of 5.
  for (let k = 0; k < 16; k++) {
    const labels = ["Mon", "Tue", "Wed", "Thu"], cnt = labels.map(() => ri(2, 8)), key = pick([5, 10]), i1 = ri(0, 3), i2 = (i1 + ri(1, 3)) % 4, diff = Math.abs(cnt[i1] - cnt[i2]) * key;
    if (!diff) continue;
    Q("top", `Each 📘 stands for ${key} books borrowed. How many more books were borrowed on ${cnt[i1] > cnt[i2] ? labels[i1] : labels[i2]} than on ${cnt[i1] > cnt[i2] ? labels[i2] : labels[i1]}?`, nums(diff, [diff / key, diff + key, Math.max(cnt[i1], cnt[i2]) * key]), `Difference in pictures: ${Math.abs(cnt[i1] - cnt[i2])}. Each is ${key} books: ${Math.abs(cnt[i1] - cnt[i2])} × ${key} = ${diff}.`, C(...labels.map((l, j) => ["", l, "📘".repeat(cnt[j]), j === i1 || j === i2])), { qv: C(...labels.map((l, j) => ["", l, "📘".repeat(cnt[j])])) });
  }
};
