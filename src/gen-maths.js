// IMO (Maths) generators for grades 1 and 4.
const ICONS = ["🍎", "⭐", "🎈", "🐟", "🌸", "🍪", "🚗", "🐥"];
const ICON_NAMES = { "🍎": "apples", "⭐": "stars", "🎈": "balloons", "🐟": "fish", "🌸": "flowers", "🍪": "cookies", "🚗": "cars", "🐥": "chicks" };
const KIDS = ["Riya", "Aman", "Meera", "Kabir", "Tara", "Ishaan", "Zoya", "Arjun", "Anya", "Dev", "Sara", "Rohan"];
const THINGS = [["apples", "🍎"], ["balloons", "🎈"], ["pencils", "✏️"], ["stars", "⭐"], ["fish", "🐟"], ["cookies", "🍪"], ["flowers", "🌸"], ["toy cars", "🚗"], ["marbles", "🔵"], ["books", "📘"]];
const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = ",,twenty,thirty,forty,fifty,sixty,seventy,eighty,ninety".split(",");
const name99 = n => n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
const name999 = n => (n >= 100 ? ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " : "") : "") + (n % 100 || n === 0 ? name99(n % 100) : "");
const nameBig = n => (n >= 1000 ? name99(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " : "") : "") + (n % 1000 ? name999(n % 1000) : "");
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ROM = [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const roman = n => { let s = ""; const parts = []; for (const [v, r] of ROM) { let c = 0; while (n >= v) { s += r; n -= v; c++; } if (c) parts.push([r.repeat(c), v * c]); } return { s, parts }; };
const rupees = x => "₹" + N(x);
const ord = n => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
const factors = n => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };

G[1].imo = Q => {
  // Addition: within 10 is easy, bridging 10 is medium.
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
    const s = a + b, i = pick(ICONS);
    if (s <= 10) Q("easy", `What is ${a} + ${b}?`, nums(s), `Put ${a} and ${b} together and count them all. ${a} + ${b} = ${s}.`, { t: "add", a, b, i });
    else Q("medium", `What is ${a} + ${b}?`, nums(s), `Make 10 first: ${a} + ${10 - a} = 10. Then add the ${b - (10 - a)} left over: 10 + ${b - (10 - a)} = ${s}.`, { t: "add", a, b, i });
  }
  // Subtraction.
  for (let a = 3; a <= 10; a++) for (let b = 1; b < a; b++) {
    const i = pick(ICONS);
    Q("easy", `What is ${a} − ${b}?`, nums(a - b), `Start with ${a}, take away ${b}, and count what is left: ${a - b}.`, { t: "sub", a, b, i });
  }
  for (let a = 11; a <= 18; a++) for (let b = a - 9; b <= 9; b++) {
    if (b < 2) continue;
    Q("medium", `What is ${a} − ${b}?`, nums(a - b), `Start at ${a} on the number line and jump back ${b} steps. You land on ${a - b}.`, { t: "numline", from: a - b - 1, to: a + 1, start: a, jumps: [-b] });
  }
  // Number order.
  for (let n = 1; n <= 40; n++) {
    Q("easy", `Which number comes just after ${n}?`, nums(n + 1, [n - 1, n + 10]), `Count on one more: after ${n} comes ${n + 1}.`, { t: "numline", from: Math.max(0, n - 3), to: Math.max(0, n - 3) + 7, start: n, jumps: [1] });
    if (n > 1) Q("easy", `Which number comes just before ${n}?`, nums(n - 1, [n + 1, n - 10]), `Count back one: just before ${n} is ${n - 1}.`, { t: "numline", from: Math.max(0, n - 4), to: Math.max(0, n - 4) + 7, start: n, jumps: [-1] });
  }
  for (let n = 31; n <= 98; n += 2) Q("medium", `Which number comes between ${n - 1} and ${n + 1}?`, nums(n, [n + 2, n - 2, n + 10]), `${n} sits right in the middle of ${n - 1} and ${n + 1}.`, { t: "numline", from: n - 4, to: n + 3, mark: n });
  // Counting pictures.
  for (const i of ICONS) for (let n = 3; n <= 12; n += ri(1, 3)) {
    Q("easy", `How many ${ICON_NAMES[i]} are there?`, nums(n), `Touch each one as you count: 1, 2, 3 … ${n}. There are ${n}.`, { t: "count", n, i }, { qv: { t: "count", n, i, plain: 1 } });
  }
  // Shapes.
  const SH = [["triangle", 3], ["square", 4], ["rectangle", 4]];
  SH.forEach(([s, n]) => {
    Q("easy", `How many sides does a ${s} have?`, nums(n, [n - 1, n + 1, n + 2]), `Count the straight sides of a ${s}: ${n}.`, { t: "shape", name: s });
    Q("easy", `How many corners does a ${s} have?`, nums(n, [n - 1, n + 1, n + 2]), `Count the corners (the dots): a ${s} has ${n}.`, { t: "shape", name: s });
  });
  Q("easy", "How many corners does a circle have?", ["0", "1", "2", "4"], "A circle is perfectly round. It has no corners and no straight sides.", { t: "shape", name: "circle" });
  Q("medium", "Which shape has 3 sides?", ["Triangle", "Square", "Circle", "Rectangle"], "Tri means three. A triangle has 3 sides and 3 corners.", { t: "shape", name: "triangle" });
  Q("medium", "Which shape has 4 equal sides?", ["Square", "Rectangle", "Triangle", "Circle"], "A square has 4 sides that are all the same length. A rectangle has 2 long and 2 short sides.", { t: "shape", name: "square" });
  // Clocks.
  for (let h = 1; h <= 12; h++) {
    const nx = h % 12 + 1, pv = (h + 10) % 12 + 1;
    Q("easy", "What time does this clock show?", [`${h} o'clock`, `${nx} o'clock`, `${pv} o'clock`, `12 o'clock`].filter((x, k, a) => a.indexOf(x) === k).concat(["6 o'clock", "9 o'clock"]).filter((x, k, a) => a.indexOf(x) === k).slice(0, 4),
      `The long hand points to 12, so it is an exact hour. The short hand points to ${h}, so it is ${h} o'clock.`, { t: "clock", h, m: 0 }, { qv: { t: "clock", h, m: 0 } });
    Q("medium", "What time does this clock show?", [`half past ${h}`, `half past ${nx}`, `${h} o'clock`, `${nx} o'clock`],
      `The long hand points to 6, so it is half past. The short hand has just passed ${h}, so it is half past ${h}.`, { t: "clock", h, m: 30 }, { qv: { t: "clock", h, m: 30 } });
  }
  // Biggest / smallest.
  for (let k = 0; k < 16; k++) {
    const small = k < 8, set = pickN(Array.from({ length: small ? 20 : 89 }, (_, i) => i + (small ? 1 : 10)), 4), big = Math.max(...set), sm = Math.min(...set);
    const hi = R() < .5;
    const ans = hi ? big : sm;
    Q(small ? "easy" : "medium", `Which is the ${hi ? "biggest" : "smallest"} number?`, [ans, ...set.filter(x => x !== ans)], small ? `Count up from 1: the ${hi ? "last" : "first"} one you reach is ${ans}.` : `Compare the tens digit first. ${ans} has the ${hi ? "most" : "fewest"} tens${set.some(x => x !== ans && Math.floor(x / 10) === Math.floor(ans / 10)) ? ", and then compare the ones" : ""}.`, { t: "bars", items: set.map(x => [String(x), x]), hl: set.indexOf(ans) });
  }
  // Tens and ones.
  for (let k = 0; k < 24; k++) {
    const n = ri(21, 98); if (n % 10 === 0 || Math.floor(n / 10) === n % 10) continue;
    const t = Math.floor(n / 10), u = n % 10;
    if (k % 3 === 0) Q("medium", `How many tens are there in ${n}?`, nums(t, [u, n, t + 1]), `${n} is ${t} tens and ${u} ones. Each tall stick is one ten.`, { t: "place", n });
    else if (k % 3 === 1) Q("medium", `How many ones are there in ${n}?`, nums(u, [t, n, u + 1]), `${n} is ${t} tens and ${u} ones. The small squares are the ones.`, { t: "place", n });
    else Q("medium", `${t} tens and ${u} ones make which number?`, [n, u * 10 + t, t + u, t * 100 + u], `${t} tens is ${t * 10}. Add ${u} ones: ${t * 10} + ${u} = ${n}.`, { t: "place", n });
  }
  // 10 more / 10 less.
  for (let k = 0; k < 24; k++) {
    const n = ri(12, 88), more = k % 2 === 0, ans = more ? n + 10 : n - 10;
    Q("medium", `Which number is 10 ${more ? "more" : "less"} than ${n}?`, nums(ans, [more ? n + 1 : n - 1, more ? n - 10 : n + 10]), `${more ? "Adding" : "Taking away"} 10 changes only the tens digit: ${n} ${more ? "+" : "−"} 10 = ${ans}.`, { t: "numline", from: Math.floor(Math.min(n, ans) / 10) * 10, to: Math.floor(Math.min(n, ans) / 10) * 10 + 20, start: n, jumps: [more ? 10 : -10], every: 2 });
  }
  // Two-digit sums and differences.
  for (let k = 0; k < 30; k++) {
    const a = ri(11, 79), b = ri(1, 9);
    if (a % 10 + b < 10) Q("medium", `What is ${a} + ${b}?`, nums(a + b, [a + b + 10]), `Only the ones change: ${a % 10} + ${b} = ${a % 10 + b}. So ${a} + ${b} = ${a + b}.`, { t: "numline", from: a - 1, to: a + b + 1, start: a, jumps: [b] });
  }
  for (let k = 0; k < 60; k++) {
    const a = ri(11, 69), b = ri(11, 29), s = a + b, carry = a % 10 + b % 10 >= 10;
    const a1 = Math.floor(a / 10), a0 = a % 10, b1 = Math.floor(b / 10), b0 = b % 10;
    Q(carry ? "hard" : "medium", `What is ${a} + ${b}?`, nums(s, [carry ? s - 10 : s + 10, a1 + b1 + a0 + b0]),
      `Add the tens: ${a1 * 10} + ${b1 * 10} = ${(a1 + b1) * 10}. Add the ones: ${a0} + ${b0} = ${a0 + b0}. Put them together: ${s}.`,
      F(["", `${a1 * 10} + ${b1 * 10}`, `${(a1 + b1) * 10}`], ["", `${a0} + ${b0}`, `${a0 + b0}`], ["", "Total", `${s}`, 1]));
  }
  for (let k = 0; k < 60; k++) {
    const a = ri(31, 99), b = ri(11, a - 5), d = a - b, borrow = a % 10 < b % 10;
    const a1 = Math.floor(a / 10), a0 = a % 10, b1 = Math.floor(b / 10), b0 = b % 10;
    if (!borrow) Q("medium", `What is ${a} − ${b}?`, nums(d, [d + 10, a1 - b1 + a0 - b0]), `Take away the tens: ${a1 * 10} − ${b1 * 10} = ${(a1 - b1) * 10}. Take away the ones: ${a0} − ${b0} = ${a0 - b0}. Together: ${d}.`,
      F(["", `${a1 * 10} − ${b1 * 10}`, `${(a1 - b1) * 10}`], ["", `${a0} − ${b0}`, `${a0 - b0}`], ["", "Answer", `${d}`, 1]));
    else Q("hard", `What is ${a} − ${b}?`, nums(d, [d + 10, Math.abs(a1 - b1) * 10 + Math.abs(a0 - b0)]), `${a0} is smaller than ${b0}, so borrow 1 ten: ${a} becomes ${a1 - 1} tens and ${a0 + 10} ones. Ones: ${a0 + 10} − ${b0} = ${a0 + 10 - b0}. Tens: ${(a1 - 1) * 10} − ${b1 * 10} = ${(a1 - 1 - b1) * 10}. Answer: ${d}.`,
      F(["", "Borrow", `${a1 - 1} tens, ${a0 + 10} ones`], ["", `${a0 + 10} − ${b0}`, `${a0 + 10 - b0}`], ["", `${(a1 - 1) * 10} − ${b1 * 10}`, `${(a1 - 1 - b1) * 10}`], ["", "Answer", `${d}`, 1]));
  }
  // Skip counting.
  for (let k = 0; k < 40; k++) {
    const hard = k % 2 === 1, step = hard ? pick([3, 4, -2, -5, -10]) : pick([2, 5, 10]);
    const start = step > 0 ? ri(0, 6) * (step === 10 ? 10 : step) : ri(6, 9) * Math.abs(step), seq = Array.from({ length: 5 }, (_, i) => start + i * step), miss = ri(1, 4);
    if (seq.some(x => x < 0)) continue;
    const shown = seq.map((x, i) => i === miss ? "__" : x).join(", ");
    Q(hard ? "hard" : "medium", `Find the missing number: ${shown}`, nums(seq[miss], [seq[miss] + 1, seq[miss] - 1, seq[miss] + step]), `Each number is ${Math.abs(step)} ${step > 0 ? "more" : "less"} than the one before it. So the missing number is ${seq[miss]}.`, { t: "seq", items: seq.map(String), hl: miss, rule: (step > 0 ? "+" : "−") + Math.abs(step) });
  }
  // Word problems.
  for (let k = 0; k < 40; k++) {
    const [thing, i] = pick(THINGS), [p, q] = pickN(KIDS, 2);
    if (k % 2) { const a = ri(3, 9), b = ri(2, 9); Q("medium", `${p} has ${a} ${thing}. ${q} gives ${p} ${b} more. How many ${thing} does ${p} have now?`, nums(a + b, [Math.abs(a - b)]), `"More" means add. ${a} + ${b} = ${a + b}.`, { t: "add", a, b, i }); }
    else { const a = ri(6, 15), b = ri(2, a - 1); Q("medium", `${p} had ${a} ${thing}. ${p} gave ${b} to ${q}. How many ${thing} are left with ${p}?`, nums(a - b, [a + b]), `"Gave away" means take away. ${a} − ${b} = ${a - b}.`, { t: "sub", a, b, i }); }
  }
  for (let k = 0; k < 24; k++) {
    const [thing] = pick(THINGS), a = ri(12, 45), b = ri(11, 40), s = a + b;
    Q("hard", `A shop has ${a} ${thing} on one shelf and ${b} ${thing} on another shelf. How many ${thing} are there in all?`, nums(s, [s - 10, s + 10]), `"In all" means add: tens ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${(Math.floor(a / 10) + Math.floor(b / 10)) * 10}, ones ${a % 10} + ${b % 10} = ${a % 10 + b % 10}. Total ${s}.`,
      F(["", `${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10}`, `${(Math.floor(a / 10) + Math.floor(b / 10)) * 10}`], ["", `${a % 10} + ${b % 10}`, `${a % 10 + b % 10}`], ["", "In all", `${s}`, 1]));
  }
  // Equal groups.
  for (let r = 2; r <= 5; r++) for (let c = 2; c <= 5; c++) {
    const [thing, i] = pick(THINGS);
    Q("hard", `There are ${r} plates with ${c} ${thing} on each plate. How many ${thing} are there in all?`, nums(r * c, [r + c, r * c + c]), `${r} groups of ${c}: count in ${c}s ${r} times. ${Array(r).fill(c).join(" + ")} = ${r * c}.`, { t: "array", r, c, i });
  }
  // Half and double.
  for (let n = 2; n <= 20; n += 2) Q("medium", `What is half of ${n}?`, nums(n / 2, [n, n * 2, n / 2 + 2]), `Half means 2 equal groups. ${n} shared into 2 groups gives ${n / 2} in each.`, { t: "array", r: 2, c: n / 2, i: pick(ICONS), cap: `${n} in 2 equal groups = ${n / 2} each` });
  for (let n = 2; n <= 9; n++) Q("medium", `What is double ${n}?`, nums(n * 2, [n + 1, n + 2]), `Double means two times the same number: ${n} + ${n} = ${n * 2}.`, { t: "add", a: n, b: n, i: pick(ICONS) });
  // Money.
  for (const v of [2, 5, 10]) for (let n = 2; n <= 6; n++) {
    const p = pick(KIDS);
    Q("hard", `${p} has ${n} coins of ₹${v}. How much money is that?`, nums(n * v, [n + v, n * v - v, n * v + v], rupees), `Count in ${v}s, one jump for each coin: ${Array.from({ length: n }, (_, i) => (i + 1) * v).join(", ")}. That is ₹${n * v}.`, { t: "numline", from: 0, to: n * v, step: v, start: 0, jumps: Array(n).fill(v) });
  }
  for (let k = 0; k < 10; k++) {
    const a = ri(1, 3), b = ri(1, 3), s = a * 10 + b * 5;
    Q("hard", `How much money is ${a} note${a > 1 ? "s" : ""} of ₹10 and ${b} coin${b > 1 ? "s" : ""} of ₹5?`, nums(s, [a + b, s + 5, s - 5], rupees), `₹10 × ${a} = ₹${a * 10} and ₹5 × ${b} = ₹${b * 5}. Together: ₹${s}.`, F(["💵", `${a} × ₹10`, `₹${a * 10}`], ["🪙", `${b} × ₹5`, `₹${b * 5}`], ["", "Total", `₹${s}`, 1]));
  }
  // Days of the week.
  DAYS.forEach((d, i) => {
    for (const n of [1, 2, 3, 5]) {
      const ans = DAYS[(i + n) % 7], seq = Array.from({ length: n + 1 }, (_, j) => DAYS[(i + j) % 7].slice(0, 3));
      Q(n <= 2 ? "medium" : "hard", `Today is ${d}. Which day will it be ${n === 1 ? "tomorrow" : `after ${n} days`}?`, words(ans, DAYS, [d]), `Count ${n} day${n > 1 ? "s" : ""} forward from ${d}: ${seq.slice(1).join(", ")}. It will be ${ans}.`, { t: "seq", items: seq, hl: n, rule: "+1" });
    }
    const y = DAYS[(i + 6) % 7];
    Q("hard", `Today is ${d}. Which day was it yesterday?`, words(y, DAYS, [d]), `Yesterday is one day back. The day before ${d} is ${y}.`, { t: "seq", items: [y.slice(0, 3), d.slice(0, 3)], hl: 0, rule: "+1" });
  });
  // Missing addend.
  for (let k = 0; k < 30; k++) {
    const b = ri(2, 9), c = ri(b + 2, 18), a = c - b;
    Q("hard", `Which number goes in the blank? __ + ${b} = ${c}`, nums(a, [c + b, c]), `Think: what plus ${b} makes ${c}? Count back ${b} from ${c}: ${c} − ${b} = ${a}.`, { t: "numline", from: a - 1, to: c + 1, start: a, jumps: [b], mark: c });
  }
  // Number names.
  for (let k = 0; k < 30; k++) {
    const n = ri(21, 99); if (n % 10 === 0 || n % 11 === 0) continue;
    const rev = (n % 10) * 10 + Math.floor(n / 10);
    if (k % 2) Q("medium", `Which number is "${name99(n)}"?`, [n, rev, Math.floor(n / 10) * 100 + n % 10, n + 1], `${cap1(name99(n))} means ${Math.floor(n / 10)} tens and ${n % 10} one${n % 10 === 1 ? "" : "s"}: ${n}.`, { t: "place", n });
    else Q("hard", `How do we write ${n} in words?`, [name99(n), name99(rev), name99(n + 1 === rev ? n + 2 : n + 1), name99(n - 10)], `${n} has ${Math.floor(n / 10)} tens (${TENS[Math.floor(n / 10)]}) and ${n % 10} ones (${ONES[n % 10]}): ${name99(n)}.`, { t: "place", n });
  }
  // Odd and even.
  for (let k = 0; k < 20; k++) {
    const ev = ri(1, 25) * 2, odds = pickN(Array.from({ length: 25 }, (_, i) => i * 2 + 1), 3), wantEven = k % 2 === 0;
    if (wantEven) Q("medium", "Which is an even number?", [ev, ...odds], `Even numbers end in 0, 2, 4, 6 or 8. ${ev} ends in ${ev % 10}, so it is even.`, C(["", `${ev}`, "even", 1], ...odds.map(o => ["", `${o}`, "odd"])));
    else { const od = odds[0], evs = pickN(Array.from({ length: 25 }, (_, i) => i * 2 + 2), 3); Q("medium", "Which is an odd number?", [od, ...evs], `Odd numbers end in 1, 3, 5, 7 or 9. ${od} ends in ${od % 10}, so it is odd.`, C(["", `${od}`, "odd", 1], ...evs.map(o => ["", `${o}`, "even"]))); }
  }
  // Ordinal position.
  const FRUIT = [["🍎", "apple"], ["🍌", "banana"], ["🍇", "grapes"], ["🍓", "strawberry"], ["🍊", "orange"], ["🍐", "pear"], ["🥭", "mango"]];
  for (let k = 0; k < 30; k++) {
    const row = pickN(FRUIT, 5), pos = ri(1, 5), right = k % 2 === 1, idx = right ? 5 - pos : pos - 1, ans = row[idx];
    Q("hard", `Look at the row. Which fruit is ${ord(pos)} from the ${right ? "right" : "left"}?`, [ans[1], ...row.filter(f => f !== ans).slice(0, 3).map(f => f[1])],
      `Start counting from the ${right ? "right" : "left"} end: ${Array.from({ length: pos }, (_, j) => row[right ? 4 - j : j][1]).join(", ")}. The ${ord(pos)} is the ${ans[1]}.`,
      C(...row.map((f, j) => [f[0], f[1], right ? ord(5 - j) : ord(j + 1), j === idx])), { qv: C(...row.map(f => [f[0], "", ""])), k: 0 });
  }
  // Greater / less signs.
  for (let k = 0; k < 20; k++) {
    let a = ri(10, 99), b = ri(10, 99); if (a === b) b++;
    const s = a > b ? ">" : "<";
    Q("hard", `Which sign goes in the blank? ${a} __ ${b}`, [s, s === ">" ? "<" : ">", "=", "+"], `${Math.max(a, b)} is bigger than ${Math.min(a, b)}. The open side of the sign always faces the bigger number, so ${a} ${s} ${b}.`, { t: "bars", items: [[String(a), a], [String(b), b]], hl: a > b ? 0 : 1 }, { k: 1 });
  }
};

G[4].imo = Q => {
  const PL = ["ones", "tens", "hundreds", "thousands", "ten thousands", "lakhs"];
  // Place value.
  for (let k = 0; k < 60; k++) {
    const len = k < 25 ? 4 : ri(5, 6), digits = pickN([1, 2, 3, 4, 5, 6, 7, 8, 9], len), n = digits.join(""), i = ri(0, len - 2), p = len - 1 - i, d = digits[i];
    const vals = [0, 1, 2, 3, 4, 5].slice(0, len).map(x => d * 10 ** x);
    Q(len === 4 ? "easy" : "medium", `What is the place value of ${d} in ${N(+n)}?`, [d * 10 ** p, ...pickN(vals.filter(v => v !== d * 10 ** p), 3)].map(N), `${d} is in the ${PL[p]} place, so its value is ${d} × ${N(10 ** p)} = ${N(d * 10 ** p)}.`, { t: "pv", n, i });
  }
  // Addition and subtraction with column method.
  for (let k = 0; k < 50; k++) {
    const a = ri(1000, 6999), b = ri(1000, 2999), s = a + b;
    const carry = String(a).split("").some((x, j) => +x + +String(b)[j] >= 10);
    Q(carry ? "medium" : "easy", `What is ${N(a)} + ${N(b)}?`, nums(s, [s - 10, s + 100, s - 1000]), `Add column by column from the ones${carry ? ", carrying 1 whenever a column adds up to 10 or more" : ""}. ${N(a)} + ${N(b)} = ${N(s)}.`, { t: "sum", rows: [String(a), "+ " + b], ans: String(s) });
  }
  for (let k = 0; k < 40; k++) {
    const zeros = k % 3 === 0, a = zeros ? ri(2, 9) * 1000 : ri(3000, 9999), b = ri(1000, a - 500), d = a - b;
    Q(zeros ? "hard" : "medium", `What is ${N(a)} − ${N(b)}?`, nums(d, [d + 10, d - 100, d + 1000]), `Subtract column by column from the ones, borrowing when the top digit is smaller${zeros ? ". With zeros, borrow from the thousands all the way down" : ""}. Check: ${N(d)} + ${N(b)} = ${N(a)}.`, { t: "sum", rows: [String(a), "− " + b], ans: String(d) });
  }
  // Successor / predecessor.
  for (let k = 0; k < 20; k++) {
    const n = ri(1, 9) * 10000 - (k % 2 ? 1 : 0) + (k % 4 === 0 ? ri(1, 900) : 0), after = k % 2 === 1;
    const ans = after ? n + 1 : n - 1;
    Q("easy", `Which number comes just ${after ? "after" : "before"} ${N(n)}?`, nums(ans, [after ? n - 1 : n + 1, ans + 10, ans - 10]), `${after ? "Add" : "Subtract"} 1: ${N(n)} ${after ? "+" : "−"} 1 = ${N(ans)}.`, F(["", N(n), ""], ["", after ? "+1" : "−1", ""], ["", N(ans), "", 1]));
  }
  // Multiplication.
  for (let k = 0; k < 80; k++) {
    const tier = k < 25 ? "easy" : k < 55 ? "medium" : "hard";
    const a = tier === "easy" ? ri(12, 49) : tier === "medium" ? ri(102, 499) : ri(12, 49), b = tier === "hard" ? ri(12, 29) : ri(2, 9), p = a * b;
    let v, e;
    if (tier === "hard") { const b1 = Math.floor(b / 10) * 10, b0 = b % 10; v = F(["", `${a} × ${b1}`, N(a * b1)], ["", `${a} × ${b0}`, N(a * b0)], ["", "Total", N(p), 1]); e = `Split ${b} into ${b1} + ${b0}. ${a} × ${b1} = ${N(a * b1)} and ${a} × ${b0} = ${N(a * b0)}. Add: ${N(p)}.`; }
    else { const parts = String(a).split("").map((x, j, arr) => +x * 10 ** (arr.length - 1 - j)).filter(Boolean); v = F(...parts.map(x => ["", `${N(x)} × ${b}`, N(x * b)]), ["", "Total", N(p), 1]); e = `Break ${a} into ${parts.map(N).join(" + ")}, multiply each part by ${b}, then add: ${parts.map(x => N(x * b)).join(" + ")} = ${N(p)}.`; }
    Q(tier, `What is ${a} × ${b}?`, nums(p, [p + b, p - 10 * (b < 10 ? 1 : 0) - (b < 10 ? 0 : a), p + a]), e, v);
  }
  // Division.
  for (let k = 0; k < 70; k++) {
    const tier = k < 20 ? "easy" : k < 45 ? "medium" : "hard", b = ri(2, 9);
    if (tier === "hard") {
      const q = ri(12, 99), r = ri(1, b - 1), a = q * b + r;
      Q("hard", `What is the remainder when ${a} is divided by ${b}?`, nums(r, [b, r + 1, 0]), `${b} × ${q} = ${b * q}, which is the biggest multiple of ${b} not more than ${a}. ${a} − ${b * q} = ${r} is left over.`, F(["", `${a} ÷ ${b}`, ""], ["", `${b} × ${q} = ${b * q}`, ""], ["", "Left over", `${r}`, 1]));
    } else {
      const q = tier === "easy" ? ri(11, 19) : ri(21, 99), a = q * b;
      Q(tier, `What is ${N(a)} ÷ ${b}?`, nums(q, [q + 1, q - 1, q + 10]), `Division asks: ${b} times what makes ${N(a)}? Since ${b} × ${q} = ${N(a)}, the answer is ${q}.`, F(["", `${N(a)} ÷ ${b}`, ""], ["", `${b} × ? = ${N(a)}`, ""], ["", "?", `${q}`, 1]));
    }
  }
  // Fractions.
  for (let k = 0; k < 30; k++) {
    const d = pick([2, 3, 4, 5, 6, 8, 10]), n = ri(1, d - 1), total = d * ri(2, 9), ans = total / d * n;
    Q("medium", `What is ${n}/${d} of ${total}?`, nums(ans, [total / d, total - ans, ans + total / d]), `Split ${total} into ${d} equal parts. Each part is ${total / d}. Take ${n} part${n > 1 ? "s" : ""}: ${n} × ${total / d} = ${ans}.`, { t: "frac", n, d, total });
  }
  for (let k = 0; k < 24; k++) {
    const d = ri(5, 10), ns = pickN(Array.from({ length: d - 1 }, (_, i) => i + 1), 4), big = k % 2 === 0, ans = big ? Math.max(...ns) : Math.min(...ns);
    Q("easy", `Which fraction is the ${big ? "biggest" : "smallest"}?`, [ans, ...ns.filter(x => x !== ans)].map(x => `${x}/${d}`), `All have the same ${d} equal parts, so compare the top numbers. ${ans}/${d} has the ${big ? "most" : "fewest"} parts.`, { t: "frac", n: ans, d });
  }
  for (let k = 0; k < 20; k++) {
    const nn = pick([1, 2, 3]), dd = pick([2, 3, 4, 5].filter(x => x > nn)), m = ri(2, 4), ans = `${nn * m}/${dd * m}`;
    const wrongs = [`${nn * m}/${dd * m + 1}`, `${nn + m}/${dd + m}`, `${nn * m + 1}/${dd * m}`];
    Q("hard", `Which fraction is equal to ${nn}/${dd}?`, [ans, ...wrongs], `Multiply the top and bottom by the same number. ${nn}/${dd} = ${nn} × ${m} / ${dd} × ${m} = ${ans}. The shaded part stays the same size.`, { t: "frac", n: nn * m, d: dd * m });
  }
  // Perimeter and area.
  for (let k = 0; k < 50; k++) {
    const w = ri(3, 12), h = ri(2, w - 1);
    if (k < 15) Q("easy", `A rectangle is ${w} cm long and ${h} cm wide. What is its perimeter?`, nums(2 * (w + h), [w * h, w + h, 2 * w + h]).map(x => x + " cm"), `Perimeter is the distance all around: ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} cm.`, { t: "rect", w, h });
    else if (k < 30) Q("medium", `What is the area of a rectangle ${w} cm long and ${h} cm wide?`, nums(w * h, [2 * (w + h), w + h, w * h + w]).map(x => x + " sq cm"), `Area counts the unit squares inside: ${h} rows of ${w} = ${w} × ${h} = ${w * h} square cm.`, { t: "rect", w, h, grid: w * h <= 80 ? 1 : 0 });
    else if (k < 38) { const s = ri(3, 15); Q("medium", `What is the perimeter of a square with side ${s} cm?`, nums(4 * s, [s * s, 2 * s, 4 * s + 4]).map(x => x + " cm"), `A square has 4 equal sides: 4 × ${s} = ${4 * s} cm.`, { t: "rect", w: s, h: s }); }
    else { const P = 2 * (w + h); Q("hard", `A rectangle has a perimeter of ${P} cm. Its length is ${w} cm. What is its width?`, nums(h, [P - w, P / 2, w - h > 0 && w - h !== h ? w - h : h + 2]).map(x => x + " cm"), `Length + width is half the perimeter: ${P} ÷ 2 = ${P / 2}. So width = ${P / 2} − ${w} = ${h} cm.`, { t: "rect", w, h }); }
  }
  // Rounding.
  for (let k = 0; k < 45; k++) {
    const to = k < 15 ? 10 : k < 30 ? 100 : 1000, tier = to === 10 ? "easy" : to === 100 ? "medium" : "hard";
    let n = to === 10 ? ri(11, 999) : to === 100 ? ri(101, 9999) : ri(1001, 99999); if (n % to === 0) n++;
    const lo = Math.floor(n / to) * to, hi = lo + to, ans = n - lo >= to / 2 ? hi : lo;
    Q(tier, `Round ${N(n)} to the nearest ${to === 10 ? "ten" : to === 100 ? "hundred" : "thousand"}.`, [ans, ans === hi ? lo : hi, Math.round(n / (to / 10)) * (to / 10) === ans ? ans + to * 2 : Math.round(n / (to / 10)) * (to / 10), ans === hi ? hi + to : lo - to].map(N),
      `${N(n)} lies between ${N(lo)} and ${N(hi)}. The halfway mark is ${N(lo + to / 2)}, and ${N(n)} is ${n >= lo + to / 2 ? "on or past" : "before"} it, so it rounds ${ans === hi ? "up" : "down"} to ${N(ans)}.`, { t: "numline", from: lo, to: hi, step: to / 10, every: 5, mark: n });
  }
  // Roman numerals.
  for (let k = 0; k < 40; k++) {
    const n = k < 20 ? ri(4, 39) : ri(40, 100), r = roman(n), tier = n < 40 ? "medium" : "hard";
    const v = F(...r.parts.map(([s, x]) => ["", s, String(x)]), ["", r.s, String(n), 1]);
    if (k % 2) Q(tier, `What is the Roman numeral ${r.s} in numbers?`, nums(n, [n + 2, n - 2, n + 10]), `Break it into parts: ${r.parts.map(([s, x]) => `${s} = ${x}`).join(", ")}. Add them: ${n}.`, v);
    else Q(tier, `How is ${n} written in Roman numerals?`, [r.s, roman(n + 1).s, roman(Math.max(1, n - 1)).s, roman(n + 10 > 100 ? n - 10 : n + 10).s], `${n} = ${r.parts.map(([, x]) => x).join(" + ")} = ${r.parts.map(([s]) => s).join(" + ")} = ${r.s}.`, v);
  }
  // Time and measurement.
  for (let h = 2; h <= 9; h++) Q("easy", `How many minutes are there in ${h} hours?`, nums(h * 60, [h * 100, h * 30, h * 60 + 60]), `1 hour = 60 minutes, so ${h} hours = ${h} × 60 = ${h * 60} minutes.`, F(["⏰", "1 hour", "60 min"], ["", `× ${h}`, ""], ["", `${h * 60} min`, "", 1]));
  for (let w = 2; w <= 8; w++) Q("easy", `How many days are there in ${w} weeks?`, nums(w * 7, [w * 5, w * 10, w * 7 + 7]), `1 week = 7 days, so ${w} weeks = ${w} × 7 = ${w * 7} days.`, F(["📅", "1 week", "7 days"], ["", `× ${w}`, ""], ["", `${w * 7} days`, "", 1]));
  const UNITS = [["metres", "centimetres", 100], ["kilometres", "metres", 1000], ["kilograms", "grams", 1000], ["litres", "millilitres", 1000]];
  for (let k = 0; k < 32; k++) {
    const [big, small, f] = UNITS[k % 4], n = ri(2, 9);
    if (k < 16) Q(k < 8 ? "easy" : "medium", `How many ${small} are there in ${n} ${big}?`, nums(n * f, [n * f / 10, n * f * 10, n * 100 === n * f ? n * 1000 : n * 100]), `1 ${big.slice(0, -1)} = ${N(f)} ${small}, so ${n} ${big} = ${n} × ${N(f)} = ${N(n * f)} ${small}.`, F(["", `1 ${big.slice(0, -1)}`, `${N(f)} ${small}`], ["", `× ${n}`, ""], ["", `${N(n * f)}`, small, 1]));
    else { const m = ri(5, f === 100 ? 95 : 950), tot = n * f + m; Q("hard", `${n} ${big} ${m} ${small} = how many ${small}?`, nums(tot, [n * 100 + m === tot ? n * 1000 + m : n * 100 + m, n * 10 + m, tot + f]), `${n} ${big} = ${N(n * f)} ${small}. Add the ${m}: ${N(n * f)} + ${m} = ${N(tot)} ${small}.`, F(["", `${n} ${big}`, `${N(n * f)}`], ["", `+ ${m}`, small], ["", N(tot), small, 1])); }
  }
  for (let k = 0; k < 20; k++) {
    const sh = ri(1, 10), sm = pick([0, 15, 30, 45]), dh = ri(1, 2), dm = pick([15, 20, 30, 40, 45]);
    let em = sm + dm, eh = sh + dh; if (em >= 60) { em -= 60; eh++; }
    const fmtT = (h, m) => `${(h - 1) % 12 + 1}:${String(m).padStart(2, "0")}`;
    const ans = fmtT(eh, em);
    Q("hard", `A class starts at ${fmtT(sh, sm)} and lasts ${dh} hour${dh > 1 ? "s" : ""} ${dm} minutes. When does it end?`, [ans, fmtT(eh, (em + 30) % 60 === em ? em : (em + 30) % 60), fmtT(eh - 1, em), fmtT(eh + 1, em)].filter((x, i, a) => a.indexOf(x) === i).concat([fmtT(eh, (em + 15) % 60)]).filter((x, i, a) => a.indexOf(x) === i).slice(0, 4),
      `Add the hours first: ${fmtT(sh, sm)} + ${dh} h = ${fmtT(sh + dh, sm)}. Then add ${dm} minutes${sm + dm >= 60 ? ", which crosses into the next hour" : ""}: ${ans}.`, F(["🕒", fmtT(sh, sm), "start"], ["", `+${dh} h`, fmtT(sh + dh, sm)], ["", `+${dm} min`, ans, 1]));
  }
  // Patterns.
  for (let k = 0; k < 40; k++) {
    const tier = k < 14 ? "easy" : k < 28 ? "medium" : "hard"; let seq, rule;
    if (tier === "easy") { const s = ri(3, 30), st = ri(3, 25); seq = Array.from({ length: 5 }, (_, i) => s + i * st); rule = "+" + st; }
    else if (tier === "medium") { const s = ri(1, 6), m = pick([2, 3]); seq = Array.from({ length: 5 }, (_, i) => s * m ** i); rule = "×" + m; }
    else if (k % 2) { const s = ri(1, 5); seq = Array.from({ length: 5 }, (_, i) => (s + i) ** 2); rule = "squares"; }
    else { const s = ri(1, 10); seq = [s]; for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + i); rule = "+1, +2, +3…"; }
    const ans = seq[4];
    Q(tier, `What comes next? ${seq.slice(0, 4).join(", ")}, __`, nums(ans, [seq[3] + (seq[3] - seq[2]), ans + 1, ans - 1]),
      rule === "squares" ? `These are square numbers: ${seq.map((x, i) => `${Math.sqrt(x)}×${Math.sqrt(x)}`).slice(0, 4).join(", ")}. Next is ${Math.sqrt(ans)} × ${Math.sqrt(ans)} = ${ans}.` : rule.startsWith("+1") ? `The gap grows by 1 each time: +1, +2, +3, then +4. ${seq[3]} + 4 = ${ans}.` : `The rule is ${rule} each time. ${seq[3]} ${rule[0]} ${rule.slice(1)} = ${ans}.`,
      { t: "seq", items: seq.map(String), hl: 4, rule: rule.length > 4 ? "" : rule });
  }
  // Multiples and factors.
  for (let k = 0; k < 30; k++) {
    const m = ri(3, 12);
    if (k % 2 === 0) {
      const ans = m * ri(3, 12), w = []; while (w.length < 3) { const c = ri(10, 140); if (c % m && !w.includes(c)) w.push(c); }
      Q("medium", `Which of these is a multiple of ${m}?`, [ans, ...w], `A multiple of ${m} is in the ${m} times table. ${m} × ${ans / m} = ${ans}.`, C(["", `${ans}`, `${m} × ${ans / m}`, 1], ...w.map(x => ["", `${x}`, `not in the ${m} table`])));
    } else {
      const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 60, 72]), fs = factors(n), non = []; while (non.length < 1) { const c = ri(3, n - 1); if (n % c) non.push(c); }
      Q("hard", `Which number is NOT a factor of ${n}?`, [non[0], ...pickN(fs.filter(f => f > 1 && f < n), 3)], `Factors of ${n} divide it exactly: ${fs.join(", ")}. ${non[0]} is not in the list (${n} ÷ ${non[0]} leaves a remainder).`, C(...fs.map(f => ["", `${f}`, ""]), ["", `${non[0]}`, "not a factor", 1]));
    }
  }
  // Money.
  const ITEMS = [["pen", "🖊️"], ["notebook", "📒"], ["eraser", "🧽"], ["toy car", "🚗"], ["ice cream", "🍦"], ["pencil box", "🧰"]];
  for (let k = 0; k < 40; k++) {
    const [it, e] = pick(ITEMS), price = ri(6, 45), n = ri(3, 9), cost = price * n;
    if (k % 2 === 0) Q("medium", `One ${it} costs ₹${price}. What is the cost of ${n} ${it}s?`, nums(cost, [price + n, cost - price, cost + price], rupees), `Cost of ${n} = ${n} × ₹${price} = ₹${cost}.`, F([e, `1 ${it}`, `₹${price}`], ["", `× ${n}`, ""], ["", "Total", `₹${cost}`, 1]));
    else { const note = cost < 100 ? 100 : cost < 200 ? 200 : 500; Q("hard", `Meera buys ${n} ${it}s at ₹${price} each and pays with a ₹${note} note. How much change does she get?`, nums(note - cost, [note - price * (n - 1), cost, note - cost + 10], rupees), `Cost = ${n} × ₹${price} = ₹${cost}. Change = ₹${note} − ₹${cost} = ₹${note - cost}.`, F([e, "Cost", `₹${cost}`], ["💵", "Paid", `₹${note}`], ["", "Change", `₹${note - cost}`, 1])); }
  }
  // Angles.
  for (const deg of [30, 45, 60, 75, 90, 120, 135, 150, 180]) {
    const ans = deg < 90 ? "Acute angle" : deg === 90 ? "Right angle" : deg < 180 ? "Obtuse angle" : "Straight angle";
    Q("easy", `What kind of angle is this?`, ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"].sort((a, b) => (b === ans) - (a === ans)), `${deg}° is ${deg < 90 ? "less than 90°, so it is acute" : deg === 90 ? "exactly 90°, a square corner" : deg < 180 ? "more than 90° but less than 180°, so it is obtuse" : "exactly 180°, a straight line"}.`, { t: "angle", deg }, { qv: { t: "angle", deg } });
  }
  // Decimals.
  for (let k = 0; k < 24; k++) {
    const a = ri(105, 899) / 100, b = ri(105, 499) / 100, s = Math.round((a + b) * 100) / 100, f = x => x.toFixed(2);
    if (k % 2) Q("hard", `What is ${f(a)} + ${f(b)}?`, [s, s + 0.1, s - 1, s + 1].map(f), `Line up the decimal points and add like whole numbers, then put the point back: ${f(a)} + ${f(b)} = ${f(s)}.`, { t: "sum", rows: [f(a), "+ " + f(b)], ans: f(s) });
    else { const t = ri(3, 8) / 10, opts = [t, t - 0.05, t - 0.01, t - 0.1].map(v => String(+v.toFixed(2))); Q("hard", "Which decimal is the biggest?", opts, `Compare the tenths digit first. ${opts[0]} = ${(+opts[0]).toFixed(2)} has the most tenths. ${opts[2]} looks bigger because it has more digits, but ${(+opts[2]).toFixed(2)} is less than ${(+opts[0]).toFixed(2)}.`, C(...opts.map((o, j) => ["", o, `= ${(+o).toFixed(2)}`, j === 0]))); }
  }
  // Bar graph reading.
  const BL = [["Mon", "Tue", "Wed", "Thu"], ["Red", "Blue", "Green", "Pink"], ["Apples", "Mangoes", "Kiwis", "Plums"]];
  for (let k = 0; k < 30; k++) {
    const labels = pick(BL), vals = pickN([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 4), items = labels.map((l, i) => [l, vals[i]]), mx = vals.indexOf(Math.max(...vals)), mn = vals.indexOf(Math.min(...vals));
    const kind = k % 3;
    if (kind === 0) Q("medium", "Look at the bar graph. Which bar is the tallest?", [labels[mx], ...labels.filter((_, i) => i !== mx)], `${labels[mx]} has the tallest bar, with ${vals[mx]}.`, { t: "bars", items, hl: mx }, { qv: { t: "bars", items } });
    else if (kind === 1) { const t = vals.reduce((a, b) => a + b); Q("hard", "Look at the bar graph. What is the total of all the bars?", nums(t, [t - vals[0], t + 2, t - 3]), `Add every bar: ${vals.join(" + ")} = ${t}.`, { t: "bars", items }, { qv: { t: "bars", items } }); }
    else { const d = vals[mx] - vals[mn]; Q("hard", `How many more is ${labels[mx]} than ${labels[mn]}?`, nums(d, [vals[mx] + vals[mn], d + 1, d - 1]), `${labels[mx]} is ${vals[mx]} and ${labels[mn]} is ${vals[mn]}. Difference: ${vals[mx]} − ${vals[mn]} = ${d}.`, { t: "bars", items, hl: mx }, { qv: { t: "bars", items } }); }
  }
  // Number names.
  for (let k = 0; k < 20; k++) {
    const n = ri(10, 99) * 1000 + ri(1, 9) * 100 + ri(0, 9);
    const th = Math.floor(n / 1000), hu = Math.floor(n % 1000 / 100), te = Math.floor(n % 100 / 10), on = n % 10;
    Q(k % 2 ? "medium" : "hard", `Which number is "${nameBig(n)}"?`, [n, n + 90, n - hu * 100 + te * 100 - te * 10 + hu * 10 === n ? n + 900 : n - hu * 100 + te * 100 - te * 10 + hu * 10, n + 10000 > 99999 ? n - 10000 : n + 10000].map(N), `${cap1(nameBig(n))} means ${th} thousands, ${hu} hundreds, ${te} tens and ${on} ones = ${N(n)}.`, F(["", "Thousands", `${th}`], ["", "Hundreds", `${hu}`], ["", "Tens", `${te}`], ["", "Ones", `${on}`], ["", N(n), "", 1]));
  }
  // Largest / smallest from digits.
  for (let k = 0; k < 24; k++) {
    const ds = pickN([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4), big = k % 2 === 0, sorted = ds.slice().sort((a, b) => a - b);
    let ans;
    if (big) ans = +sorted.slice().reverse().join("");
    else { const nz = sorted.find(x => x > 0), rest = sorted.slice(); rest.splice(rest.indexOf(nz), 1); ans = +[nz, ...rest].join(""); }
    const alt = +ds.join("") === ans ? +ds.slice().reverse().join("") : +ds.join("");
    Q("hard", `What is the ${big ? "largest" : "smallest"} 4-digit number made using ${ds.join(", ")} once each?`, nums(ans, [alt, big ? ans - 9 : ans + 9, big ? +sorted.slice(0, 2).reverse().concat(sorted.slice(2).reverse()).join("") : ans + 90].filter(x => x >= 1000)),
      big ? `Put the biggest digit first and keep going down: ${sorted.slice().reverse().join(", ")} gives ${N(ans)}.` : `A 4-digit number can't start with 0. Put the smallest non-zero digit first, then the rest from smallest to biggest: ${N(ans)}.`, { t: "seq", items: String(ans).split(""), hl: 0 });
  }
};
