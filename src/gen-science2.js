// More NSO templates shared by both grades: animal sizes, coverings, habitats, plant types, light, food groups, habits.
const SIZES = [["🐘", "elephant"], ["🐎", "horse"], ["🐕", "dog"], ["🐈", "cat"], ["🐇", "rabbit"], ["🐭", "mouse"], ["🐜", "ant"]];
const COVER = [["🐦", "sparrow", "feathers"], ["🐔", "hen", "feathers"], ["🐟", "fish", "scales"], ["🐍", "snake", "scales"], ["🐕", "dog", "fur (hair)"], ["🐻", "bear", "fur (hair)"], ["🐢", "tortoise", "a hard shell"], ["🦔", "porcupine", "sharp spines"]];
const HABITAT = { water: [["🐟", "fish"], ["🐋", "whale"], ["🐬", "dolphin"], ["🐙", "octopus"], ["🦀", "crab"], ["🪼", "jellyfish"]], trees: [["🐒", "monkey"], ["🐿️", "squirrel"], ["🐨", "koala"], ["🦥", "sloth"]], land: [["🦁", "lion"], ["🐄", "cow"], ["🐘", "elephant"], ["🐎", "horse"], ["🦓", "zebra"], ["🐫", "camel"]] };
const LIGHT = { natural: [["☀️", "the Sun"], ["⭐", "stars"], ["🪲", "a firefly"], ["⚡", "lightning"]], "man-made": [["💡", "a bulb"], ["🔦", "a torch"], ["🕯️", "a candle"], ["🏮", "a lantern"]] };
const DAIRY = [["🥛", "milk"], ["🧀", "cheese"], ["🧈", "butter"], ["🥣", "curd"], ["🍦", "ice cream"]], NOTDAIRY = [["🍎", "apple"], ["🍞", "bread"], ["🥕", "carrot"], ["🍚", "rice"], ["🥜", "peanuts"]];
const WATERSRC = { natural: ["river", "lake", "rain", "sea", "spring"], "made by people": ["tap", "water tank", "bottle", "swimming pool"] };
const PLANTTYPE = { tree: ["mango", "neem", "banyan", "coconut", "peepal"], shrub: ["rose", "hibiscus", "tulsi", "jasmine"], herb: ["mint", "coriander", "grass", "wheat"], climber: ["money plant", "grapevine", "pea plant"], creeper: ["pumpkin", "watermelon", "strawberry"] };
const PT_DESC = { tree: "big and tall with a thick, woody trunk", shrub: "smaller than a tree, with many hard, woody stems", herb: "small and soft with a green, tender stem", climber: "weak-stemmed and climbs up a support", creeper: "weak-stemmed and spreads along the ground" };
const HABITS = [
  ["We should drink plenty of ___ every day.", ["Water", "Cola", "Coffee", "Juice with sugar"], "Our body needs lots of clean water to stay healthy.", "💧"],
  ["When we sneeze, we should ___.", ["Cover our nose and mouth", "Sneeze on others", "Laugh loudly", "Close our eyes only"], "Covering our nose and mouth stops germs from spreading to others.", "🤧"],
  ["Where should we throw rubbish?", ["In a dustbin", "On the road", "In the river", "Under the bed"], "Rubbish goes in the dustbin to keep our home and town clean.", "🗑️"],
  ["Why should we cut our nails regularly?", ["So dirt and germs don't collect under them", "So they grow faster", "So we can't write", "To change their colour"], "Dirt and germs collect under long nails and can get into our food.", "💅"],
  ["How many hours should a young child sleep at night?", ["About 10 hours", "About 2 hours", "About 20 hours", "No sleep is needed"], "Children need about 9 to 11 hours of sleep to grow and stay active.", "😴"],
  ["Which of these keeps our body fit and strong?", ["Playing outdoors", "Watching TV all day", "Eating only sweets", "Sleeping all day"], "Running, jumping and playing make our muscles and heart strong.", "🏃"],
  ["We should take a bath ___.", ["Every day", "Once a month", "Only on holidays", "Never"], "A daily bath keeps our skin clean and free of germs.", "🛁"],
  ["Why do we wash fruits before eating them?", ["To remove dirt and germs", "To make them sweeter", "To change their colour", "To make them bigger"], "Fruits can carry dust and germs from the market. Washing removes them.", "🍎"],
];

const moreNSO = (Q, g) => {
  const lo = g === 1;
  // Sizes.
  for (let k = 0; k < 40; k++) {
    const set = pickN(SIZES, 4), order = set.map(s => SIZES.indexOf(s)), big = k % 2 === 0, idx = big ? order.indexOf(Math.min(...order)) : order.indexOf(Math.max(...order)), ans = set[idx];
    Q(big ? "easy" : lo ? "medium" : "easy", `Which of these animals is the ${big ? "biggest" : "smallest"}?`, [cap1(ans[1]), ...set.filter(s => s !== ans).map(s => cap1(s[1]))], `From biggest to smallest: ${SIZES.filter(s => set.includes(s)).map(s => s[1]).join(", ")}. The ${big ? "biggest" : "smallest"} is the ${ans[1]}.`, C(...SIZES.filter(s => set.includes(s)).map(s => [...s, "", s === ans])));
  }
  const covers = [...new Set(COVER.map(c => c[2]))];
  COVER.forEach(([e, a, c]) => Q(lo && (c === "a hard shell" || c === "sharp spines") ? "medium" : "easy", `What covers the body of ${an(a)}?`, words(cap1(c), covers.map(cap1)), `${cap1(an(a))} has ${c} on its body. Birds have feathers, fish and snakes have scales, and many animals have fur.`, C([e, cap1(a), c, 1])));
  for (const [h, list] of Object.entries(HABITAT)) list.forEach(a => {
    const others = Object.entries(HABITAT).filter(([k]) => k !== h).flatMap(([, l]) => l);
    Q(h === "water" ? "easy" : "medium", h === "water" ? "Which animal lives in water?" : h === "trees" ? "Which animal spends most of its life in trees?" : "Which animal lives on land?", [cap1(a[1]), ...pickN(others, 3).map(o => cap1(o[1]))], `${cap1(an(a[1]))} lives ${h === "water" ? "in water" : h === "trees" ? "in trees, with strong arms or claws for climbing" : "on land"}.`, C([...a, h, 1]));
  });
  for (const [k, list] of Object.entries(LIGHT)) list.forEach(l => {
    const other = LIGHT[k === "natural" ? "man-made" : "natural"];
    Q(k === "natural" ? (lo ? "medium" : "easy") : (lo ? "hard" : "medium"), `Which of these is a ${k} source of light?`, [cap1(l[1]), ...pickN(other, 3).map(o => cap1(o[1]))], k === "natural" ? `${cap1(l[1])} gives light without anyone making it, so it is natural.` : `${cap1(l[1])} is made by people, so it is a man-made source of light.`, C([...l, k, 1]));
  });
  DAIRY.forEach(d => Q("easy", "Which of these do we get from milk?", [cap1(d[1]), ...pickN(NOTDAIRY, 3).map(n => cap1(n[1]))], `${cap1(d[1])} is made from milk. Foods made from milk are called dairy foods.`, F(["🥛", "Milk", ""], [...d, "", 1])));
  for (const [k, list] of Object.entries(WATERSRC)) list.forEach(w => Q(k === "natural" ? "easy" : "medium", `Which of these is a ${k === "natural" ? "natural source of water" : "source of water made by people"}?`, [cap1(w), ...pickN(WATERSRC[k === "natural" ? "made by people" : "natural"], 3).map(cap1)], `${cap1(an(w))} ${k === "natural" ? "is made by nature" : "is made by people"}.`, C(["💧", cap1(w), k, 1])));
  const types = Object.keys(PLANTTYPE);
  for (const [t, list] of Object.entries(PLANTTYPE)) list.forEach(p => Q(lo ? "hard" : "medium", `${cap1(an(p))}${p.endsWith("plant") ? "" : " plant"} is a ___.`, words(t, types), `${cap1(an(p))}${p.endsWith("plant") ? "" : " plant"} is ${an(t)}: it is ${PT_DESC[t]}.`, C(["🌱", cap1(p), t, 1])));
  HABITS.forEach(([q, o, e, em]) => Q(lo ? "easy" : "easy", q, o, e, C([em, o[0], "good habit", 1])));
  ["cow", "goat", "rabbit", "deer", "elephant", "horse"].forEach(a => Q(lo ? "hard" : "easy", "Which of these animals eats only plants?", [cap1(a), "Lion", "Tiger", "Wolf"], `${cap1(an(a))} eats grass and leaves. Lions, tigers and wolves eat other animals.`, C([(A(a) || {}).e || "🦌", cap1(a), "plants", 1])));
  ["lion", "tiger", "wolf"].forEach(a => Q(lo ? "hard" : "easy", "Which of these animals eats other animals?", [cap1(a), "Cow", "Goat", "Rabbit"], `${cap1(an(a))} hunts and eats other animals.`, C([(A(a) || {}).e || "🐺", cap1(a), "meat", 1])));
  Q("hard", "Which bird cannot fly?", ["Ostrich", "Sparrow", "Eagle", "Parrot"], "The ostrich is too heavy to fly, but it can run very fast.", C(["🐦", "Ostrich", "runs fast", 1]));
  Q("hard", "Which bird cannot fly but is an excellent swimmer?", ["Penguin", "Pigeon", "Crow", "Owl"], "Penguins use their wings like flippers to swim in cold seas.", C(["🐧", "Penguin", "swims", 1]));
  Q(lo ? "hard" : "medium", "Which animal sleeps through the cold winter (hibernates)?", ["Bear", "Cow", "Hen", "Dog"], "Some bears sleep through winter in their dens, living on the fat stored in their bodies.", C(["🐻", "Bear", "hibernates", 1]));
  Q("hard", "Which animal can change its colour to hide?", ["Chameleon", "Cow", "Elephant", "Sparrow"], "A chameleon changes colour to match its surroundings and hide from enemies.", C(["🦎", "Chameleon", "changes colour", 1]));
  Q(lo ? "medium" : "easy", "Which animal is awake at night and sleeps in the day?", ["Owl", "Hen", "Cow", "Butterfly"], "Owls are nocturnal. Their big eyes help them see in the dark.", C(["🦉", "Owl", "awake at night", 1]));
  Q(lo ? "medium" : "easy", "Which animal can live in the desert for many days without water?", ["Camel", "Frog", "Fish", "Duck"], "A camel stores fat in its hump and loses very little water.", C(["🐫", "Camel", "desert", 1]));
  ANIMALS.filter(a => a.gives).forEach(a => Q("easy", `What do we get from ${an(a.n)}?`, words(cap1(a.gives), ["Milk", "Eggs", "Wool", "Honey", "Silk", "Leather"]).filter((x, i, arr) => !(x.toLowerCase() === "milk" && ["cow", "goat"].includes(a.n) && i > 0)), `We get ${a.gives} from ${an(a.n)}.`, F(card(a, ""), ["", a.gives, "", 1])));
  if (!lo) {
    // Grade 4 also gets the grade 1 baby, home and sense questions as easy warm-ups.
    const babies = ANIMALS.filter(a => a.baby).map(a => a.baby);
    ANIMALS.filter(a => a.baby).forEach(a => Q("easy", `What is the young one of ${an(a.n)} called?`, words(a.baby, babies), `The young one of ${an(a.n)} is called ${an(a.baby)}.`, C(card(a, a.baby, 1))));
    const homes = ANIMALS.filter(a => a.home).map(a => a.home);
    ANIMALS.filter(a => a.home).forEach(a => Q("easy", `Where does ${an(a.n)} live?`, words(cap1(an(a.home)), homes.map(h => cap1(an(h)))), `${cap1(an(a.n))} lives in ${an(a.home)}.`, C(card(a, a.home, 1))));
    MATERIAL.forEach(([e, o, m]) => Q("easy", `${cap1(an(o))} is usually made of ___.`, words(cap1(m), [...new Set(MATERIAL.map(x => cap1(x[2])))]), `${cap1(an(o))} is usually made of ${m}.`, C([e, cap1(o), m, 1])));
    ["ant", "bee", "butterfly"].forEach(i => Q("easy", "Which of these is an insect?", [cap1(i), "Spider", "Earthworm", "Snail"], `Insects have 6 legs and 3 body parts. ${cap1(an(i))} is an insect. A spider has 8 legs.`, C(card(A(i), "6 legs", 1), card(A("spider"), "8 legs"))));
  }
};
const _g1nso = G[1].nso, _g4nso = G[4].nso;
G[1].nso = Q => { _g1nso(Q); moreNSO(Q, 1); };
G[4].nso = Q => { _g4nso(Q); moreNSO(Q, 4); };
