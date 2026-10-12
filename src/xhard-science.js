// Challenge-level NSO (science) questions: the whole NSO bank since the "still too easy" feedback.
// Grade 1 aims at SOF NSO Achievers with class 2–3 content, grade 4 at class 5–6 content.
// Everything lives inside one function so its names cannot clash with the other generator files.
(() => {
// ---------- helpers ----------
// Authored rows: [emoji, question, answer, [three wrong], explanation, optional viz].
const xAuth = (Q, rows) => rows.forEach(([em, q, a, w, e, v]) => Q("top", q, [a, ...w], e, v || C([em, a, "✓ answer", 1])));
// Odd one out rows: [emoji, odd, [three others], what the three share, what the odd one is].
const xOdd = (Q, rows) => rows.forEach(([em, odd, three, grp, why]) => {
  const all = [odd, ...three].slice().sort();
  Q("top", `Find the odd one out:\n${all.join(", ")}`, [odd, ...three], `${three.join(", ")} are all ${grp}. ${odd} is ${why}, so it is the odd one out.`,
    C(...three.map(t => ["", t, grp]), [em, odd, why, 1]));
});
// Analogy rows: [emoji, "A : B :: C : ___", answer, [three wrong], explanation].
const xAna = (Q, rows) => rows.forEach(([em, q, a, w, e]) => Q("top", q, [a, ...w], e, F(["", q.split("::")[0].trim(), "first pair"], [em, q.split("::")[1].replace("___", a).trim(), "same link", 1])));
// Assertion–Reason, with the four standard options in a fixed order. k: 0 both true and R explains A,
// 1 both true but R does not explain A, 2 A true and R false, 3 A false and R true.
const AR_OPTS = ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is NOT the correct explanation of A", "A is true, but R is false", "A is false, but R is true"];
const xAR = (Q, rows) => rows.forEach(([em, a, r, k, e]) => {
  const ta = k !== 3, tr = k !== 2;
  Q("top", `Assertion (A): ${a}\nReason (R): ${r}\nChoose the correct option.`, [AR_OPTS[k], ...AR_OPTS.filter((_, i) => i !== k)], e,
    C([em, "Assertion", ta ? "✓ true" : "✗ false", ta], ["", "Reason", tr ? (k === 0 ? "✓ true, explains A" : "✓ true") : "✗ false", tr && k === 0]), { order: AR_OPTS });
});
// "Which of the statements are correct?" sts: [[text, true/false, the correct fact if false], ...].
const ROMAN = ["(i)", "(ii)", "(iii)", "(iv)"];
const subLabel = (mask, n) => {
  const ids = ROMAN.slice(0, n).filter((_, i) => mask >> i & 1);
  if (!ids.length) return "None of them";
  if (ids.length === n) return n === 2 ? "Both (i) and (ii)" : `All ${n === 3 ? "three" : "four"}`;
  if (ids.length === 1) return `Only ${ids[0]}`;
  return `Only ${ids.slice(0, -1).join(", ")} and ${ids[ids.length - 1]}`;
};
const bits = x => { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; };
function xMS(Q, intro, sts, em) {
  const n = sts.length; let mask = 0; sts.forEach((s, i) => { if (s[1]) mask |= 1 << i; });
  const others = []; for (let m = 0; m < 1 << n; m++) if (m !== mask) others.push(m);
  const wrong = mix(others).sort((a, b) => bits(a ^ mask) - bits(b ^ mask)).slice(0, 3);
  Q("top", `${intro}\n${sts.map((s, i) => `${ROMAN[i]} ${s[0]}`).join("\n")}`, [subLabel(mask, n), ...wrong.map(m => subLabel(m, n))],
    sts.map((s, i) => `${ROMAN[i]} ${s[1] ? "is correct." : "is wrong: " + s[2]}`).join(" "),
    C(...sts.map((s, i) => [i === 0 ? em : "", ROMAN[i], s[1] ? "✓ correct" : "✗ wrong", s[1]])));
}
// Statement banks: pick k facts from one topic, n times.
function xBank(Q, bank, n, k, em) {
  for (let j = 0; j < n; j++) {
    const sts = pickN(bank, k);
    if (sts.every(s => s[1]) && R() < .6) continue;   // keep "all correct" from being too common
    xMS(Q, pick(["Which of these statements is/are correct?", "Read the statements. Which of them is/are correct?"]), sts, em);
  }
}
// Matching: rows [[left, right], ...]. P, Q, R, S on the left; 1–4 on the right.
const LET = ["P", "Q", "R", "S"];
function xMatch(Q, rows, n, title, em) {
  for (let j = 0; j < n; j++) {
    const four = pickN(rows, 4);
    if (new Set(four.map(r => r[1])).size < 4 || new Set(four.map(r => r[0])).size < 4) continue;
    const right = mix(four.map(r => r[1])), num = four.map(r => right.indexOf(r[1]) + 1);
    const code = a => a.map((x, i) => `${LET[i]}-${x}`).join(", ");
    const swaps = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], wr = pickN(swaps, 2).map(([a, b]) => { const c = num.slice(); [c[a], c[b]] = [c[b], c[a]]; return code(c); });
    const rot = num.map((_, i) => num[(i + 1) % 4]);
    Q("top", `Match ${title}.\n${four.map((r, i) => `${LET[i]}. ${r[0]}`).join("\n")}\n${right.map((r, i) => `${i + 1}. ${r}`).join("\n")}`,
      [code(num), ...wr, code(rot)], `The correct pairs are: ${four.map(r => `${r[0]} – ${r[1]}`).join("; ")}.`, C(...four.map((r, i) => [i === 0 ? em : "", `${LET[i]}-${num[i]}`, `${r[0]} – ${r[1]}`, 1])));
  }
}
// "Which group has ONLY ...?" yes / no lists.
function xOnly(Q, n, what, yes, no, em, whyNo) {
  for (let j = 0; j < n; j++) {
    const good = pickN(yes, 3), bad = [0, 1, 2].map(() => { const g = pickN(yes, 2); return [...g, pick(no)]; });
    const fmt = g => cap1(g.slice().sort().join(", "));
    const opts = [fmt(good), ...bad.map(fmt)]; if (new Set(opts).size < 4) continue;
    const odd = bad.map(b => b[2]);
    Q("top", `Which group has ONLY ${what}?`, opts, `${fmt(good)}: all are ${what}. ${[...new Set(odd)].map(cap1).join(", ")} ${new Set(odd).size > 1 ? "are" : "is"} not, because ${whyNo}`,
      C([em, fmt(good), "✓ all of them", 1], ...[...new Set(odd)].map(o => ["", cap1(o), "✗ not one of them"])));
  }
}
const XKIDS = ["Riya", "Aman", "Neha", "Kabir", "Tara", "Dev", "Meera", "Arjun", "Zoya", "Ishan", "Anya", "Rohan"];

// ================= GRADE 1 =================
const X1 = [
  // Living and non-living
  ["🔥", "A fire grows bigger, moves and needs air. Still, it is NOT a living thing. Why?", "It cannot breathe, feel or have young ones", ["It is too hot to be alive", "It is not green", "It has no legs"], "Living things breathe, feel, grow from inside and have young ones like themselves. A fire only spreads while it has fuel and air."],
  ["🪑", "Which of these was once a part of a living thing but is now non-living?", "A wooden chair", ["A stone", "A plastic bottle", "A sleeping cat"], "Wood comes from a tree, which was living. Once it is cut and made into a chair, it cannot grow or breathe any more."],
  ["🌰", "A dry seed in a packet does not move, eat or grow. Why do we still call it living?", "It can grow into a new plant when it gets water, air and warmth", ["It is brown in colour", "It is very small", "It came from a shop"], "A seed has a tiny baby plant resting inside it. With water, air and warmth it wakes up and grows."],
  ["🌳", "Which of these is NOT true for ALL living things?", "They move from place to place", ["They need food", "They grow", "They breathe"], "Plants are living but stay fixed in one place. All living things need food, grow and breathe."],
  ["🍄", "Which of these CANNOT make its own food and does not eat other animals either?", "Mushroom", ["Grass", "Neem tree", "Money plant"], "A mushroom is not a green plant. It has no green colour to make food, so it takes food from dead and rotting things."],
  ["🤖", "A robot can walk, talk and play games. Which reason shows it is non-living?", "It cannot grow or have baby robots by itself", ["It is made in a factory in many colours", "It is very clever", "It can be switched on"], "Living things grow and make young ones like themselves. A robot does neither on its own."],
  ["🌿", "Which group has ONLY living things?", "Moss, mushroom, earthworm", ["Moss, cloud, earthworm", "Mushroom, river, ant", "Fire, grass, snail"], "Moss, mushrooms and earthworms all grow, breathe and reproduce. Clouds, rivers and fire are non-living."],
  ["🦠", "Which tiny living things cause diseases like cold and cough and can be seen only with a microscope?", "Germs", ["Seeds", "Pebbles", "Sand grains"], "Germs are too small to see with our eyes, but they are living and can make us ill."],
  // Plants
  ["🥔", "A potato and ginger both grow under the soil. Which part of the plant are they?", "Stem", ["Root", "Leaf", "Fruit"], "A potato has 'eyes' (buds) and ginger has buds too. Buds grow only on stems, so both are underground stems, not roots."],
  ["🥕", "In which pair do we eat the SAME part of the plant?", "Radish and beetroot", ["Radish and potato", "Spinach and cauliflower", "Peas and carrot"], "Radish and beetroot are both roots. A potato is a stem, spinach is leaves, cauliflower is a flower and peas are seeds."],
  ["🥦", "Which of these is the flower part of a plant that we eat?", "Broccoli", ["Cabbage", "Lettuce", "Turnip"], "Broccoli (like cauliflower) is a bunch of tiny flower buds. Cabbage and lettuce are leaves and turnip is a root."],
  ["🍠", "Sweet potato and potato sound alike. Which is correct?", "Sweet potato is a root, potato is a stem", ["Both are roots", "Both are stems", "Sweet potato is a stem, potato is a root"], "A sweet potato is a swollen root. A potato is a swollen underground stem with buds called eyes."],
  ["🎋", "Farmers usually grow new sugarcane plants from ___.", "pieces of the stem", ["seeds", "leaves", "roots"], "Each piece of sugarcane stem has buds at its joints. Planted in soil, the buds grow into new plants."],
  ["🥔", "A potato kept in a dark cupboard for weeks grows small shoots from its 'eyes'. The eyes are really ___.", "buds", ["seeds", "roots", "flowers"], "The eyes of a potato are buds. Buds can grow into new shoots, which is why we plant potato pieces to grow potatoes."],
  ["🌱", "Which of these is NOT needed for a seed to start sprouting?", "Sunlight", ["Water", "Air", "Warmth"], "Seeds sprout even in the dark, using food stored inside them. They need water, air and warmth. Light is needed later, to make food."],
  ["🫘", "Riya kept bean seeds in three jars: A on dry cotton, B on wet cotton, C under a lot of boiled water (no air). In which jar will the seeds sprout?", "Only B", ["Only A", "Only C", "All three"], "Seeds need water AND air to sprout. A has no water and C has no air. Only B has both."],
  ["🍃", "Aman covered part of a leaf with black paper for a few days. The covered part turned pale. Why?", "That part did not get sunlight", ["That part did not get water", "Black paper is poisonous", "The leaf became old"], "Leaves need sunlight to stay green and make food. The covered part got no light."],
  ["🍉", "Which of these is a creeper (spreads along the ground) and not a climber?", "Watermelon", ["Money plant", "Grapevine", "Pea plant"], "A watermelon plant has a weak stem that spreads along the ground. The others climb up a support."],
  ["🌳", "Which of these plants is a tree, not a shrub?", "Coconut", ["Rose", "Hibiscus", "Tulsi"], "A coconut palm is tall with one thick, woody trunk. Rose, hibiscus and tulsi are shrubs: bushy with many woody stems."],
  ["🥥", "Coir, used for ropes and mats, is made from ___.", "the husk of the coconut fruit", ["the leaves of jute", "the wool of sheep", "the bark of a mango tree"], "The thick, hairy husk around a coconut gives coir fibre."],
  ["🌸", "Cloves (laung) that we use as a spice are ___.", "dried flower buds", ["dried seeds", "pieces of root", "pieces of bark"], "Cloves are flower buds picked before they open and dried in the Sun."],
  ["🪵", "Cinnamon (dalchini) comes from which part of a plant?", "The bark of the stem", ["The root", "The flower", "The seed"], "Cinnamon is the dried inner bark of the cinnamon tree."],
  ["🌬️", "In which pair are BOTH seeds carried away by the wind?", "Cotton and dandelion", ["Coconut and lotus", "Mango and pea", "Xanthium and coconut"], "Cotton and dandelion seeds are light and hairy, so the wind carries them. Coconut and lotus are carried by water."],
  ["🫛", "Dry pea pods burst open with a pop. How does this help the plant?", "It throws the seeds away from the parent plant", ["It makes the seeds sweeter", "It keeps the seeds inside", "It makes the plant taller"], "When the pods burst, seeds are thrown away so the young plants are not crowded under the parent."],
  ["🌳", "Why is it good for seeds to be carried far away from the parent plant?", "So young plants are not crowded and get enough light, water and space", ["So the parent plant can rest", "So the seeds become heavier", "So birds go hungry"], "If all seeds fell under the parent, the young plants would fight for light, water and space."],
  ["🌵", "Why does a cactus have spines instead of broad leaves?", "Spines lose very little water and keep animals away", ["Spines make more food than leaves", "Spines help it float", "Spines catch rain like cups"], "Broad leaves lose a lot of water. Thin spines lose very little, and they also protect the cactus from thirsty animals."],
  ["🌾", "Which group has ONLY cereals (grains)?", "Rice, wheat, maize", ["Rice, peas, wheat", "Maize, gram, rice", "Wheat, moong, maize"], "Rice, wheat and maize are cereals. Peas, gram and moong are pulses."],
  ["🫘", "Which of these gives us oil for cooking?", "Groundnut (peanut) seeds", ["Potato", "Spinach", "Cauliflower"], "We crush seeds like groundnut, mustard and sunflower to get cooking oil."],
  ["🍌", "Banana plants are big, but they are NOT trees. Why?", "Their 'trunk' is soft, not woody", ["They have no leaves", "They grow in water", "They have no fruit"], "A tree has a hard, woody trunk. The banana's 'trunk' is made of soft, rolled-up leaf bases."],
  ["🪷", "A lotus leaf has a waxy top. What happens to water drops on it?", "They roll off and the leaf stays dry", ["They soak in at once", "They make the leaf sink", "They turn into ice"], "The waxy coat does not let water stick, so drops roll off. This keeps the leaf from rotting."],
  ["🌻", "A sunflower plant kept near a window bends towards it. What is the plant looking for?", "Sunlight", ["Fresh water", "Cold air", "Sound"], "Stems bend towards light so that the leaves get more sunlight to make food."],
  ["🍅", "Which of these is a fruit because it has seeds inside, even though we call it a vegetable?", "Brinjal", ["Potato", "Spinach", "Radish"], "Brinjal grows from a flower and has many seeds, so it is a fruit. Potato is a stem, spinach is leaves and radish is a root."],
  // Animals
  ["🐋", "Which water animal gives birth to babies and feeds them milk?", "Whale", ["Octopus", "Crab", "Starfish"], "A whale is a mammal. It breathes air with lungs, gives birth to babies and feeds them milk."],
  ["🥚", "Which group has ONLY animals that hatch from eggs?", "Crocodile, penguin, butterfly", ["Crocodile, bat, butterfly", "Penguin, whale, snake", "Tortoise, dolphin, hen"], "Crocodiles, penguins and butterflies lay eggs. Bats, whales and dolphins give birth to babies."],
  ["🐸", "A grown-up frog breathes through its lungs on land. Through which part can it also breathe in water?", "Its moist skin", ["Its gills", "Its tail", "Its long tongue"], "An adult frog takes in air through its thin, wet skin when it is under water. Only tadpoles have gills."],
  ["🐛", "Which baby animal looks very different from its parent?", "Caterpillar", ["Calf", "Foal", "Kitten"], "A caterpillar looks nothing like a butterfly. It turns into a pupa and then into a butterfly. A calf, foal and kitten look like small copies of their parents."],
  ["🐍", "Which animal moves by crawling but HAS a backbone?", "Snake", ["Earthworm", "Snail", "Caterpillar"], "A snake has a long backbone with many small bones. Earthworms, snails and caterpillars have no backbone."],
  ["🪱", "Which of these animals has NO bones at all?", "Earthworm", ["Snake", "Fish", "Frog"], "An earthworm's body is soft with no bones. Snakes, fish and frogs all have a backbone."],
  ["🦆", "Why does a duck not get soaked even after swimming for a long time?", "Its feathers are oily and keep water out", ["It swims only on sunny days", "It has no feathers", "It drinks all the water"], "Ducks spread oil from a gland near the tail over their feathers, so water rolls off."],
  ["🐧", "Which bird cannot fly but is a very good swimmer?", "Penguin", ["Ostrich", "Duck", "Kingfisher"], "Penguins use their wings like flippers to swim. An ostrich cannot fly but cannot swim well either, and ducks can fly."],
  ["🐎", "Which of these animals does NOT chew the cud?", "Horse", ["Cow", "Goat", "Buffalo"], "Cows, goats and buffaloes swallow grass, then bring it back to the mouth to chew again (chewing the cud). Horses do not."],
  ["🐀", "A rat keeps gnawing on hard things. Why?", "Its front teeth keep growing all its life", ["It has no teeth", "It is always angry", "Its teeth are made of wood"], "Rats and squirrels have front teeth that never stop growing. Gnawing wears them down."],
  ["🦂", "Which of these is NOT an insect?", "Scorpion", ["Ant", "Honeybee", "Grasshopper"], "Insects have 6 legs. A scorpion has 8 legs, like a spider."],
  ["🐜", "How many legs and how many body parts does an insect have?", "6 legs and 3 body parts", ["8 legs and 2 body parts", "6 legs and 2 body parts", "4 legs and 3 body parts"], "An insect's body has a head, a thorax (middle) and an abdomen, with 6 legs on the thorax. Spiders have 8 legs and 2 body parts."],
  ["🦉", "An owl turns its whole head to look around. Why?", "Its eyes cannot move in their sockets", ["It has no neck", "It cannot hear", "Its eyes are on its back"], "An owl's big eyes are fixed in place, so it turns its head (very far) to look around."],
  ["🦇", "Which animal finds its food in the dark by listening to the echoes of its own squeaks?", "Bat", ["Owl", "Eagle", "Crow"], "A bat makes high squeaks. The echoes bouncing back from insects tell it where they are."],
  ["🐫", "What does a camel store in its hump?", "Fat", ["Water", "Milk", "Air"], "The hump stores fat. The camel uses it for energy when there is little food. It does not store water in its hump."],
  ["🐫", "Why does a camel have long, thick eyelashes?", "To keep sand out of its eyes", ["To look beautiful", "To see in the dark", "To keep its eyes wet"], "In sandstorms, the long eyelashes stop sand from blowing into its eyes."],
  ["🐟", "A fish dies soon after it is taken out of water, even though air has oxygen. Why?", "Its gills can take oxygen only from water", ["Air is too cold for it", "It cannot see in air", "It gets too hungry"], "Gills take in oxygen that is dissolved in water. In air, the gills dry and stick together, so the fish cannot breathe."],
  ["🦎", "Which animal has scales but is NOT a fish?", "Lizard", ["Frog", "Hen", "Cat"], "Lizards and snakes have dry scales. A frog has smooth, moist skin."],
  ["🦢", "Which bird flies to India from very cold countries every winter?", "Siberian crane", ["Peacock", "House crow", "Sparrow"], "Siberian cranes fly thousands of kilometres to escape the freezing winter. This journey is called migration."],
  ["🐦", "Which bird does NOT build its own nest but lays its eggs in a crow's nest?", "Cuckoo (koel)", ["Weaver bird", "Tailor bird", "Sparrow"], "The koel (cuckoo) lays its eggs in a crow's nest, and the crow hatches and feeds the koel chicks."],
  ["🪺", "Which bird stitches leaves together with fibre to make its nest?", "Tailor bird", ["Weaver bird", "Woodpecker", "Cuckoo"], "The tailor bird pokes holes in leaves with its beak and stitches them with fibres, like a tailor."],
  ["🪹", "Which bird weaves a hanging nest from strips of grass?", "Weaver bird", ["Tailor bird", "Koel", "Pigeon"], "The weaver bird knots and weaves grass strips into a hanging nest with a long entrance."],
  ["🐄", "Which group shows ONLY animals that chew the cud?", "Cow, goat, camel", ["Cow, horse, goat", "Camel, dog, sheep", "Goat, rabbit, cow"], "Cows, goats, camels, sheep and buffaloes chew the cud. Horses, dogs and rabbits do not."],
  ["🐻", "Which group has ONLY animals that eat both plants and animals?", "Bear, crow, hen", ["Bear, cow, crow", "Lion, crow, hen", "Deer, bear, rabbit"], "Bears, crows and hens eat both plant food and small animals or insects. Cows and deer eat only plants; lions eat only meat."],
  ["🐝", "Which insect lives in big groups with a queen and makes a home of wax?", "Honeybee", ["Housefly", "Mosquito", "Butterfly"], "Honeybees live in a hive with one queen and many workers. They make the comb from wax."],
  ["🐛", "Silk cloth is made from threads spun by ___.", "the silkworm, the caterpillar of the silk moth", ["spiders", "honeybees", "sheep"], "The silkworm spins a cocoon from one long silk thread. The cocoons are boiled and the threads are taken out."],
  ["🐍", "Which animal grows by shedding its old skin from time to time?", "Snake", ["Cow", "Hen", "Rabbit"], "A snake's skin does not grow with it, so it wriggles out of the old skin and a new one is underneath."],
  ["🐢", "Which animal lives in water AND comes on land to lay its eggs?", "Turtle", ["Fish", "Whale", "Octopus"], "Turtles swim in the sea but come to the beach to lay eggs in the sand."],
  ["🐘", "An elephant flaps its big ears on hot days. Why?", "To cool its body", ["To hear better", "To fly", "To scare the Sun"], "Big ears have many blood vessels. Flapping them cools the blood and helps the elephant stay cool."],
  ["🐿️", "Which animal collects and stores nuts to eat later?", "Squirrel", ["Cow", "Lion", "Frog"], "Squirrels hide nuts and seeds to eat later, and some forgotten nuts grow into new trees."],
  ["🦒", "How does a long neck help a giraffe?", "It reaches leaves high up on trees", ["It swims faster", "It digs burrows", "It catches fish"], "With its long neck, a giraffe eats leaves that other animals cannot reach."],
  ["🐄", "Which animal gives us milk, and its dung is used to make fuel cakes and manure?", "Cow", ["Hen", "Horse", "Sheep"], "Cow dung is dried to make fuel cakes or used in biogas and compost."],
  ["🐂", "Which animal helps people carry loads in snowy mountains?", "Yak", ["Camel", "Elephant", "Cow"], "The yak has long thick hair and lives in cold mountains like Ladakh. It carries loads and gives milk."],
  // Human body and needs
  ["🏃", "When you run fast, which two organs work harder?", "Heart and lungs", ["Teeth and nails", "Stomach and eyes", "Ears and nose"], "Running muscles need more oxygen. The lungs breathe faster to take it in and the heart beats faster to carry it in the blood."],
  ["🦴", "Which is the longest bone in our body?", "Thigh bone", ["Backbone", "A rib", "Skull"], "The thigh bone (femur) runs from the hip to the knee. It is the longest and strongest bone."],
  ["🧍", "Our backbone is made of many small bones instead of one long bone. Why?", "So we can bend and twist", ["So it is lighter than air", "So it can break easily", "So it can grow hair"], "Many small bones joined together let the back bend forward, backward and sideways."],
  ["🥭", "Which two sense organs help you check whether a mango is ripe WITHOUT tasting it?", "Eyes and nose", ["Ears and tongue", "Tongue and nose", "Ears and eyes"], "Your eyes see its yellow colour and your nose smells its sweet smell."],
  ["🤧", "When you have a blocked nose, food seems to have less taste. Why?", "Smell helps us enjoy the taste of food", ["The tongue stops working", "Food changes its colour", "Our teeth become weak"], "Much of the flavour we notice comes from smell. With a blocked nose, food tastes dull."],
  ["🍎", "Riya bites an apple with her ___ and then chews it with her ___.", "incisors, molars", ["molars, incisors", "canines, incisors", "molars, canines"], "Flat, sharp front teeth (incisors) bite and cut. Broad back teeth (molars) grind and chew."],
  ["🦷", "Which teeth are pointed and help us tear food?", "Canines", ["Incisors", "Molars", "Milk teeth"], "Canines are the pointed teeth next to the incisors. They tear tough food."],
  ["🍬", "Why can sticky sweets cause holes (cavities) in teeth?", "Germs feed on the sugar and make acid that eats the teeth", ["Sugar is very hard", "Sweets are too cold", "Sweets make teeth grow"], "Sugar left on teeth feeds germs. The acid they make slowly dissolves the hard covering of the teeth."],
  ["🍚", "Which group has ONLY energy-giving foods?", "Rice, chapati, potato", ["Rice, egg, spinach", "Milk, fish, dal", "Carrot, orange, guava"], "Rice, chapati and potato are rich in carbohydrates, which give energy."],
  ["🫘", "Which group has ONLY body-building foods?", "Dal, egg, paneer", ["Dal, rice, egg", "Paneer, sugar, fish", "Egg, potato, milk"], "Dal, eggs, paneer, fish and milk are rich in protein, which builds the body. Rice, sugar and potato give energy."],
  ["🥗", "Fruits and green vegetables are called protective foods because they ___.", "help keep us safe from diseases", ["protect us from rain", "make us very fat", "give us the most energy"], "They give vitamins and minerals that help the body fight diseases."],
  ["🌅", "Why should we not skip breakfast?", "The body needs energy after the long night without food", ["Breakfast makes us sleepy", "Food in the morning is bad", "Our teeth need rest"], "We do not eat for many hours at night. Breakfast gives the energy to study and play."],
  ["🏔️", "Why do houses in places with heavy rain or snow have sloping roofs?", "So rain and snow slide off easily", ["So birds can sit on them", "So the house looks taller", "So the Sun cannot reach them"], "Water or snow on a flat roof would collect and leak or press the roof down. A sloping roof lets it slide off."],
  ["👳", "Why do people in hot deserts wear loose, light-coloured clothes and cover their heads?", "To stay cool and protect themselves from the hot Sun", ["To stay warm", "To keep rain away", "To look different"], "Light colours take in less heat, loose clothes let air move, and a turban shields the head from the Sun."],
  ["👕", "Why are light-coloured clothes better in summer than dark ones?", "They take in less heat from sunlight", ["They are heavier", "They make their own cool air", "They do not get dirty"], "Dark colours soak up more of the Sun's heat. Light colours send more of it back."],
  ["🧶", "How do woollen clothes keep us warm?", "Air trapped in the wool stops our body heat from escaping", ["Wool makes its own heat", "Wool is very heavy", "Wool is always black"], "Wool fibres trap a lot of air, and air does not let heat pass easily, so our body heat stays in."],
  ["🧥", "Which material is best for a raincoat?", "Plastic or rubber-coated cloth", ["Cotton", "Wool", "Paper"], "A raincoat must not let water through. Plastic and rubber are waterproof."],
  ["🧱", "Why do mud houses with thick walls stay cool on hot days?", "Thick mud walls let heat in very slowly", ["Mud is wet all the time", "Mud makes cold air", "Mud houses have no doors"], "Thick mud walls take a long time to heat up, so the inside stays cool in the day."],
  // Safety and good habits
  ["🩸", "A friend's nose starts bleeding. What is the right first aid?", "Make them sit, lean forward and pinch the soft part of the nose", ["Make them lie flat and tilt the head back", "Make them run to the doctor", "Put a hot towel on the face"], "Leaning forward stops blood from going down the throat. Pinching the soft part of the nose for about 10 minutes stops the bleeding."],
  ["🐕", "A dog bites your friend. What should be done first?", "Wash the wound with soap and running water and go to a doctor", ["Tie a tight cloth and wait", "Put mud on it", "Ignore it if it is small"], "Washing removes germs from the dog's saliva. A doctor decides about injections, as dog bites can spread rabies."],
  ["⛈️", "Where is the safest place to be during a thunderstorm with lightning?", "Inside a building, away from windows", ["Under a tall tree", "In an open field", "On the rooftop"], "Lightning often strikes tall things like trees and people in open ground. A closed building is safest."],
  ["🔥", "A room is filling with smoke from a fire. How should you move out?", "Crawl low near the floor to the exit", ["Stand up and run", "Hide under the bed", "Open the cupboard"], "Smoke rises, so the cleaner air is near the floor. Crawl out and cover your nose."],
  ["🛗", "Why should we NOT use a lift during a fire or an earthquake?", "The power may fail and we could get trapped", ["Lifts are too slow", "Lifts are only for adults", "Lifts make noise"], "Use the stairs. A lift can stop between floors if the electricity goes off."],
  ["🫨", "What should you do if an earthquake starts while you are in class?", "Drop, take cover under a strong desk and hold on", ["Run to the window", "Use the lift", "Stand near a tall cupboard"], "Things can fall during shaking. Getting under a strong desk protects your head."],
  ["🔌", "What is the safe way to pull out an electric plug?", "Switch off, then hold the plug (not the wire) with dry hands", ["Pull the wire with wet hands", "Pull it while it is on", "Use a metal spoon"], "Pulling the wire can damage it, and wet hands or metal can give a shock."],
  ["🦟", "Which habit stops mosquitoes from breeding near our home?", "Not letting water collect in pots, tyres and coolers", ["Keeping lights on at night", "Eating more sweets", "Playing in the sun"], "Mosquitoes lay eggs in still water. No still water means no new mosquitoes."],
  ["🍉", "Why should we not eat cut fruit kept uncovered at roadside stalls?", "Flies sit on it and leave germs", ["It is too sweet", "It loses its colour", "It becomes very hard"], "Flies sit on dirt and then on food, carrying germs that cause stomach illness."],
  ["📺", "Why should we not watch a screen from very close for a long time?", "It strains our eyes", ["It makes our ears weak", "It makes us taller", "It cleans our eyes"], "Looking at a bright screen up close for long tires the eyes. Take breaks and sit at a distance."],
  ["💊", "Why should medicines be taken only when a doctor or parent gives them?", "The wrong medicine or amount can harm us", ["Medicines are very sweet", "Medicines are toys", "Medicines are never useful"], "Each medicine is for a certain illness and a certain amount. Taking it without help can be dangerous."],
  ["🏊", "Which is a safety rule at a swimming pool?", "Swim only when an adult or lifeguard is watching", ["Run fast around the pool", "Push friends into deep water", "Dive into shallow water"], "Pool floors are slippery and deep water is dangerous. Always swim with an adult around."],
  // Air and water
  ["🍾", "An 'empty' bottle is pushed upside down into a tub of water. Water does not fill it. Why?", "The bottle has air in it, and air takes up space", ["Water is afraid of bottles", "The bottle is too cold", "Water cannot move"], "The 'empty' bottle is full of air. The air has nowhere to go, so water cannot enter."],
  ["🧱", "When a dry brick is dropped into a bucket of water, bubbles come out. This shows that ___.", "the brick had air in its tiny spaces", ["the brick is melting", "water is boiling", "the brick is alive"], "Water enters the tiny holes in the brick and pushes the air out as bubbles."],
  ["🕯️", "A burning candle is covered with a glass jar. After some time it goes out. Why?", "The air (oxygen) in the jar gets used up", ["The jar becomes too heavy", "The wax turns to water", "The light cannot get out"], "A flame needs air to keep burning. Once the oxygen in the jar is used up, the flame dies."],
  ["👕", "Why do wet clothes dry faster when spread out than when folded?", "More of the cloth is open to the air", ["Folded clothes are heavier", "Spread clothes get colder", "Folding adds water"], "Water evaporates from the surface. Spreading the cloth gives a bigger surface for water to escape into the air."],
  ["🥛", "A glass of ice-cold water gets tiny drops on the OUTSIDE. Where do the drops come from?", "Water vapour in the air turns into drops on the cold glass", ["Water leaks out through the glass", "The ice melts through the glass", "The drops come from the table"], "Air has invisible water vapour. When it touches the cold glass, it cools and turns into water drops."],
  ["🍽️", "The same amount of water is kept in a plate, a glass and a narrow bottle in the Sun. Which dries first?", "The water in the plate", ["The water in the glass", "The water in the bottle", "All dry at the same time"], "The plate spreads the water out, so more of it touches the air and evaporates faster."],
  ["🧂", "Which of these does NOT dissolve in water?", "Chalk powder", ["Salt", "Sugar", "Lemon juice"], "Chalk powder makes the water cloudy and slowly settles at the bottom. Salt and sugar dissolve, and lemon juice mixes in."],
  ["🏞️", "Muddy water is left still in a glass for a few hours. What happens?", "Mud settles at the bottom and clearer water stays on top", ["The mud floats to the top", "The water turns into ice", "Nothing at all changes"], "Mud is heavier than water, so it slowly sinks and settles down."],
  ["🚰", "What is the best way to make muddy pond water safer to drink at home?", "Let it settle, filter it and then boil it", ["Only let it settle", "Add sugar to it", "Keep it in the fridge"], "Settling and filtering remove mud. Boiling kills the germs that filtering cannot remove."],
  ["❄️", "Which of these is NOT water in solid form?", "Dew", ["Hail", "Snow", "Ice"], "Dew is drops of liquid water. Hail, snow and ice are solid water."],
  ["🌿", "Dew drops on grass in the early morning come from ___.", "water vapour in the air that cooled at night", ["rain that fell at noon", "water given by the roots", "the Moon"], "At night the grass cools. Water vapour in the air touching it turns into tiny drops."],
  ["🌊", "Most of Earth's water is NOT fit for drinking because ___.", "it is salty sea water", ["it is too cold", "it is frozen in fridges", "it is too blue"], "Almost all of Earth's water is in seas and oceans, and it is salty."],
  ["🌧️", "Rivers, lakes, ponds and wells all get their water mainly from ___.", "rain (and melting snow)", ["taps", "the Moon", "the soil itself"], "Rain and melting snow fill rivers and lakes and soak into the ground to fill wells."],
  ["🌬️", "Which machine uses moving air to make electricity?", "Wind turbine (windmill)", ["Ceiling fan", "Mixer", "Torch"], "Wind turns the big blades of a wind turbine, which runs a generator to make electricity."],
  ["🎈", "A balloon is tied tightly and kept in hot sunlight. It may burst. Why?", "The air inside expands when it gets hot", ["The air inside turns to water", "The balloon grows like a plant", "Sunlight makes holes in it"], "Air spreads out (expands) when heated. The balloon gets more and more stretched and can burst."],
  ["💨", "Which shows that moving air can push things?", "A sailboat moving across a lake", ["A stone lying still", "A book on a table", "A bulb glowing"], "Wind pushes against the sail and moves the boat."],
  // Weather and the sky
  ["🌅", "Your shadow is long and falls towards the WEST. What time of day is it?", "Morning", ["Noon", "Evening", "Midnight"], "In the morning the Sun is low in the east, so shadows are long and point west."],
  ["🌇", "At what time of day does your shadow fall towards the EAST?", "Evening", ["Morning", "Noon", "Midnight"], "In the evening the Sun is in the west, so shadows point the opposite way, to the east."],
  ["🪟", "Which of these will NOT make a dark shadow in sunlight?", "A clear glass sheet", ["A book", "A stone", "A wooden box"], "Light passes through clear glass, so it does not block much light. Shadows form when light is blocked."],
  ["🌙", "Why does the Moon look bigger than the stars, even though stars are much bigger?", "The Moon is much closer to us", ["The Moon is a big star", "The Moon is made of light", "Stars are tiny dots"], "Stars are huge but very, very far away. The Moon is much nearer, so it looks bigger."],
  ["⭐", "Why can't we see stars during the day?", "The bright sunlight hides them", ["Stars sleep in the day", "Stars go behind the Earth", "Stars switch off"], "Stars are in the sky all the time. In the day the Sun is so bright that we cannot see them."],
  ["🧭", "You stand facing the rising Sun. Which direction is on your LEFT?", "North", ["South", "West", "East"], "The Sun rises in the east. Facing east, your left hand points north and your right hand points south."],
  ["🌑", "Why can't people live on the Moon?", "There is no air or water there", ["It is made of cheese", "It is too small to stand on", "It is too bright"], "We need air to breathe and water to drink. The Moon has neither."],
  ["🌕", "About how many days pass from one full Moon to the next?", "About 29 to 30 days", ["About 1 day", "About 7 days", "About 365 days"], "The Moon goes through all its shapes in about 29½ days, close to a month."],
  ["🌞", "In which season are the days the longest and nights the shortest in India?", "Summer", ["Winter", "Spring", "They are always equal"], "In summer the Sun rises early and sets late, so days are long."],
  ["🌧️", "Which instrument measures how much rain has fallen?", "Rain gauge", ["Thermometer", "Wind vane", "Weighing scale"], "A rain gauge collects rain in a container with a scale to read the amount."],
  ["🌈", "If the Sun is in the west and it is raining in the east, where should you look for a rainbow?", "Towards the east", ["Towards the west, at the Sun", "Straight down", "Behind a cloud in the west"], "A rainbow always appears on the side of the sky opposite to the Sun, with the Sun behind you."],
  ["🌈", "Which colour is NOT one of the seven colours of a rainbow?", "Pink", ["Indigo", "Orange", "Violet"], "The rainbow colours are violet, indigo, blue, green, yellow, orange and red (VIBGYOR). Pink is not one of them."],
  ["☁️", "Which kind of clouds usually bring heavy rain?", "Thick, dark clouds", ["Thin, white clouds", "Pink clouds at sunset", "No clouds"], "Dark clouds are thick with lots of water drops that block sunlight. They often bring rain."],
  ["🌫️", "On a foggy winter morning, why is it hard to see far?", "Tiny water drops float in the air near the ground", ["The Sun has gone away", "The air has turned to ice", "Our eyes stop working in winter"], "Fog is a cloud close to the ground, made of tiny water drops that block our view."],
  ["🌍", "We cannot feel the Earth moving, but it spins all the time. What does its spinning give us?", "Day and night", ["Rain and snow", "Seasons only", "Tides only"], "As the Earth spins, our side faces the Sun (day) and then turns away from it (night)."],
  ["☀️", "Why does the Sun look so much bigger and brighter than other stars?", "It is the star nearest to us", ["It is the biggest star of all", "It is a planet", "It is made of fire only"], "The Sun is a medium-sized star. It looks big and bright because it is much closer than any other star."],
  // Measuring
  ["✋", "Riya measured a table and found it 8 hand spans long. Her father found it 5 hand spans long. Why are the answers different?", "Her father's hand span is longer", ["The table changed its size", "Riya counted wrongly", "Her father's span is shorter"], "A longer span fits fewer times. Body measures change from person to person, so we use a ruler or tape."],
  ["📏", "Which is the best tool to measure the length of a playground?", "A measuring tape", ["A 15 cm ruler", "A weighing balance", "A clock"], "A long measuring tape can measure long distances quickly and correctly."],
  ["⚖️", "In a balance, a pumpkin goes down and a melon goes up. What does this show?", "The pumpkin is heavier", ["The melon is heavier", "Both weigh the same", "The pumpkin is smaller"], "The heavier side of a balance goes down."],
  ["🧺", "Which unit is best to measure the weight of a watermelon?", "Kilogram", ["Metre", "Litre", "Centimetre"], "Weight is measured in grams and kilograms. A watermelon weighs a few kilograms."],
  ["🥛", "Which unit is used to measure how much milk is in a bottle?", "Litre", ["Kilometre", "Kilogram", "Centimetre"], "Liquids are measured in litres and millilitres."],
  ["📏", "Riya's ruler is broken at the start, so it begins at the 1 cm mark. A pencil reaches from the 1 cm mark to the 8 cm mark. How long is the pencil?", "7 cm", ["8 cm", "9 cm", "1 cm"], "Count the gap, not the end mark: 8 − 1 = 7 cm. Always start from 0, or subtract the starting mark."],
];

const X1_ODD = [
  ["🦇", "Bat", ["Sparrow", "Eagle", "Parrot"], "birds", "a mammal that gives birth to babies"],
  ["🦈", "Shark", ["Whale", "Dolphin", "Seal"], "mammals that breathe air with lungs", "a fish that breathes with gills"],
  ["🥕", "Carrot", ["Potato", "Ginger", "Sugarcane"], "stems we eat", "a root"],
  ["🕷️", "Spider", ["Ant", "Butterfly", "Bee"], "insects with 6 legs", "not an insect (it has 8 legs)"],
  ["🐦‍⬛", "Crow", ["Penguin", "Ostrich", "Emu"], "birds that cannot fly", "a bird that can fly"],
  ["🐸", "Frog", ["Snake", "Lizard", "Crocodile"], "animals with dry, scaly skin", "an animal with smooth, moist skin"],
  ["♨️", "Steam", ["Ice", "Snow", "Hail"], "water in solid form", "water as a gas"],
  ["🌙", "Moon", ["Sun", "Firefly", "Candle flame"], "things that give their own light", "only reflecting sunlight"],
  ["🥭", "Mango", ["Rose", "Hibiscus", "Tulsi"], "shrubs", "a tree"],
  ["🐑", "Wool", ["Cotton", "Jute", "Coir"], "fibres from plants", "a fibre from an animal"],
  ["🥚", "Egg", ["Curd", "Paneer", "Butter"], "made from milk", "not made from milk"],
  ["🔦", "Torch", ["Kite", "Windmill", "Sailboat"], "things that work with the wind", "not worked by the wind"],
  ["🫛", "Peas", ["Rice", "Wheat", "Maize"], "cereals (grains)", "a pulse"],
  ["🦜", "Parrot", ["Eagle", "Owl", "Hawk"], "birds that hunt other animals", "a bird that eats fruits and seeds"],
  ["🐎", "Horse", ["Cow", "Goat", "Buffalo"], "animals that chew the cud", "an animal that does not chew the cud"],
  ["🐄", "Cow", ["Hen", "Duck", "Crow"], "animals that hatch from eggs", "an animal that gives birth to babies"],
  ["🪱", "Earthworm", ["Fish", "Snake", "Frog"], "animals with a backbone", "an animal without bones"],
  ["🍅", "Tomato", ["Spinach", "Cabbage", "Lettuce"], "leaves we eat", "a fruit"],
  ["🐳", "Whale", ["Octopus", "Starfish", "Crab"], "sea animals that do not breathe air", "a mammal that breathes air"],
  ["🧊", "Ice", ["Milk", "Juice", "Oil"], "liquids", "a solid"],
  ["🦀", "Crab", ["Tiger", "Fox", "Wolf"], "wild animals of the land", "an animal living in water"],
  ["🌵", "Cactus", ["Lotus", "Water lily", "Hydrilla"], "water plants", "a desert plant"],
  ["👃", "Nose", ["Heart", "Lungs", "Stomach"], "organs inside the body", "a sense organ on the outside"],
  ["🌳", "Neem", ["Money plant", "Grapevine", "Pea plant"], "climbers", "a tree"],
  ["🧲", "Magnet", ["Thermometer", "Rain gauge", "Wind vane"], "instruments for measuring the weather", "not a weather instrument"],
  ["🦘", "Kangaroo", ["Lion", "Tiger", "Leopard"], "big cats", "an animal that carries its baby in a pouch"],
];

const X1_ANA = [
  ["🐟", "Earthworm : moist skin :: Fish : ___", "gills", ["lungs", "fins", "scales"], "An earthworm breathes through its moist skin. In the same way, a fish breathes through its gills."],
  ["🐻", "Snake : scales :: Bear : ___", "fur", ["feathers", "shell", "spines"], "A snake's body is covered with scales. A bear's body is covered with fur."],
  ["🥬", "Carrot : root :: Cabbage : ___", "leaves", ["root", "stem", "flower"], "We eat the root of a carrot and the leaves of a cabbage."],
  ["🎋", "Ginger : stem :: Turnip : ___", "root", ["stem", "leaf", "flower"], "Ginger is an underground stem. A turnip is a swollen root."],
  ["🌧️", "Thermometer : temperature :: Rain gauge : ___", "rainfall", ["wind", "weight", "time"], "A thermometer measures temperature. A rain gauge measures how much rain fell."],
  ["🐻‍❄️", "Camel : desert :: Polar bear : ___", "icy polar region", ["rainforest", "desert", "pond"], "A camel is suited to the hot desert. A polar bear is suited to the icy polar regions."],
  ["🧊", "Melting : ice to water :: Freezing : ___", "water to ice", ["water to steam", "steam to water", "ice to steam"], "Melting turns solid ice into liquid water. Freezing does the opposite: water into ice."],
  ["🦷", "Incisors : cutting :: Molars : ___", "grinding", ["tearing", "cutting", "tasting"], "Incisors cut food. Molars grind and chew it."],
  ["🐝", "Bee : honey :: Silkworm : ___", "silk", ["wool", "milk", "wax"], "Bees make honey. Silkworms spin silk."],
  ["🫁", "Heart : pumping blood :: Lungs : ___", "breathing", ["thinking", "digesting food", "seeing"], "The heart pumps blood and the lungs help us breathe."],
  ["🌱", "Seed : plant :: Egg : ___", "chick", ["nest", "feather", "seed"], "A seed grows into a plant. An egg hatches into a chick."],
  ["🦋", "Tadpole : frog :: Caterpillar : ___", "butterfly", ["spider", "moth ball", "frog"], "A tadpole grows into a frog. A caterpillar grows into a butterfly."],
  ["🦆", "Duck : webbed feet :: Eagle : ___", "sharp claws (talons)", ["webbed feet", "fins", "flippers"], "Webbed feet help a duck swim. Sharp talons help an eagle catch its prey."],
  ["🌲", "Cotton : plant :: Wool : ___", "animal", ["plant", "rock", "factory"], "Cotton comes from a plant. Wool comes from an animal (sheep)."],
];

// Statement banks for grade 1: [statement, true?, correct fact when false].
const B1_LIFE = [
  ["A potato is an underground stem.", true],
  ["A carrot is an underground stem.", false, "A carrot is a root."],
  ["Seeds need sunlight to start sprouting.", false, "Seeds need water, air and warmth to sprout; they can sprout in the dark."],
  ["Mushrooms are green plants that make their own food.", false, "Mushrooms are not green and cannot make their own food."],
  ["Plants are living things even though they cannot walk.", true],
  ["Cotton seeds are carried by the wind.", true],
  ["A banana plant is a tree because it is very big.", false, "A banana plant has a soft, non-woody stem, so it is not a tree."],
  ["A money plant is a climber.", true],
  ["Leaves of a plant kept in the dark for many days turn yellow.", true],
  ["Coconuts are carried by water to new places.", true],
  ["We eat the flowers of cauliflower.", true],
  ["Rice and wheat are pulses.", false, "Rice and wheat are cereals; pulses are things like dal, gram and peas."],
  ["A cactus stores water in its thick stem.", true],
  ["Roots of a plant grow towards light.", false, "Roots grow down into the soil; stems grow towards light."],
];
const B1_ANIMAL = [
  ["A bat gives birth to babies.", true],
  ["A whale breathes with gills.", false, "A whale breathes air with lungs."],
  ["A spider is an insect.", false, "A spider has 8 legs, so it is not an insect."],
  ["A camel stores water in its hump.", false, "The hump stores fat."],
  ["Penguins are birds that cannot fly.", true],
  ["A snake has a backbone.", true],
  ["An earthworm has a backbone.", false, "An earthworm has no bones."],
  ["A horse chews the cud.", false, "Cows and goats chew the cud; horses do not."],
  ["Ducks have oily feathers.", true],
  ["A tadpole breathes with gills.", true],
  ["A koel (cuckoo) builds a big nest of its own.", false, "The koel lays its eggs in a crow's nest."],
  ["A crocodile hatches from an egg.", true],
  ["A dolphin is a fish.", false, "A dolphin is a mammal that breathes air."],
  ["An ant has 6 legs.", true],
];
const B1_BODY = [
  ["The thigh bone is the longest bone in our body.", true],
  ["Canines are used for grinding food.", false, "Molars grind food; canines tear it."],
  ["Our heart beats faster when we run.", true],
  ["A child has 32 milk teeth.", false, "A child has 20 milk teeth."],
  ["Dal and eggs are body-building foods.", true],
  ["Rice and potato are mainly body-building foods.", false, "Rice and potato are energy-giving foods."],
  ["The skull protects the brain.", true],
  ["We should tilt the head back when the nose bleeds.", false, "We should lean forward and pinch the soft part of the nose."],
  ["Woollen clothes trap air and keep body heat in.", true],
  ["Dark clothes keep us cooler in summer than light ones.", false, "Light-coloured clothes keep us cooler; dark ones take in more heat."],
  ["We should stay under a tall tree during lightning.", false, "Tall trees attract lightning; go inside a building."],
  ["Still water in coolers lets mosquitoes breed.", true],
  ["The tongue helps us taste food.", true],
];
const B1_WORLD = [
  ["Air takes up space.", true],
  ["Air has no weight at all.", false, "Air has weight, though it is very light."],
  ["Dew is water in solid form.", false, "Dew is liquid water drops."],
  ["Hail is water in solid form.", true],
  ["Sea water is salty.", true],
  ["Wet clothes dry faster on a still, cloudy day than on a sunny, windy day.", false, "They dry faster on a sunny, windy day."],
  ["A candle needs air to keep burning.", true],
  ["The Moon gives out its own light.", false, "The Moon only reflects sunlight."],
  ["The Sun is a star.", true],
  ["Shadows are longest at noon.", false, "Shadows are shortest at noon and longest in the morning and evening."],
  ["The Sun sets in the west.", true],
  ["A rainbow appears on the same side of the sky as the Sun.", false, "A rainbow appears on the side opposite to the Sun."],
  ["Salt dissolves in water.", true],
  ["Chalk powder dissolves completely in water.", false, "Chalk powder does not dissolve; it settles down."],
  ["We see stars in the day too, if we look hard.", false, "Bright sunlight hides the stars in the day."],
];
const X1B = [
  ["🪴", "Riya keeps two same-sized plants in sunlight. She waters pot A every day and never waters pot B. What is she testing?", "Whether plants need water", ["Whether plants need sunlight", "Whether plants need soil", "Whether plants need air"], "Everything is the same for both pots except water. So any difference shows the effect of water. This is a fair test."],
  ["🐐", "In which of these animals does the baby grow inside the mother's body?", "Goat", ["Duck", "Snake", "Crocodile"], "A goat gives birth to a kid. Ducks, snakes and crocodiles lay eggs and the babies grow inside the eggs."],
  ["🌹", "A rose plant has thorns on its stem. How do the thorns help it?", "They keep away animals that might eat it", ["They make food", "They soak up water", "They help it climb fast"], "Sharp thorns hurt animals that try to eat the stem and leaves."],
  ["🐝", "Bees visit flowers mainly to collect ___.", "nectar and pollen", ["water and soil", "seeds and leaves", "wax and oil"], "Bees drink sweet nectar to make honey and gather pollen as food. While doing this, they carry pollen from flower to flower."],
  ["🦅", "Which bird eats dead animals and helps keep the surroundings clean?", "Vulture", ["Parrot", "Sparrow", "Pigeon"], "Vultures feed on dead animals. Without them, dead bodies would rot and spread germs."],
  ["🐙", "Guess who I am: I have 8 arms, no bones, and I squirt ink to escape from enemies.", "Octopus", ["Starfish", "Jellyfish", "Crab"], "An octopus has eight arms with suckers. It squirts dark ink to hide and escape."],
  ["🦎", "Guess who I am: I can change my colour, my eyes move separately, and I catch insects with a long sticky tongue.", "Chameleon", ["Frog", "Snake", "Tortoise"], "A chameleon can look in two directions at once and changes colour to match its mood and surroundings."],
  ["🐋", "Guess who I am: I am the largest animal that has ever lived. I live in the sea but breathe air.", "Blue whale", ["Shark", "Octopus", "Elephant"], "The blue whale is bigger than any dinosaur. It is a mammal and comes up to breathe air."],
  ["🐌", "Guess who I am: I move very slowly, carry my shell house on my back, and come out on rainy days.", "Snail", ["Tortoise", "Crab", "Earthworm"], "A snail likes damp places. Its soft body hides inside its shell when it is dry or in danger."],
  ["🍄", "Guess what I am: I grow on dead wood and damp soil, I am not green, and I look like a little umbrella.", "Mushroom", ["Fern", "Moss", "Grass"], "A mushroom is a fungus. It is not green and gets food from dead and rotting things."],
  ["🍵", "Which part of the tea plant is used to make tea?", "Leaves", ["Roots", "Flowers", "Seeds"], "Young tea leaves are picked, dried and processed to make tea."],
  ["🌼", "Mustard oil is made from which part of the mustard plant?", "Seeds", ["Leaves", "Roots", "Flowers"], "Tiny mustard seeds are crushed to get oil. The leaves are cooked as saag."],
  ["📄", "Paper is made mainly from ___.", "wood and bamboo", ["stone", "plastic", "wool"], "Wood and bamboo are made into a pulp, which is pressed and dried into paper. Saving paper saves trees."],
  ["🌲", "Pine trees in snowy hills are cone-shaped with needle-like leaves. How does this help them?", "Snow slides off easily", ["They catch more rain", "They grow fruits faster", "They keep animals warm"], "The sloping shape and thin needles do not let heavy snow pile up and break the branches."],
  ["🍈", "Seeds of which fruit are often spread by birds and animals that eat the fruit?", "Guava", ["Cotton", "Coconut", "Pea"], "Animals eat the guava and drop the hard seeds far away in their droppings. Cotton goes by wind, coconut by water and pea pods burst."],
  ["🌾", "Which of these crops needs the MOST water to grow?", "Rice", ["Cactus", "Millet (bajra)", "Mustard"], "Rice is grown in fields filled with standing water. Millet and mustard need much less water."],
  ["🦘", "How does a kangaroo's long, thick tail help it?", "It helps it balance while hopping", ["It helps it swim", "It stores water", "It keeps its baby warm"], "The strong tail acts like a third leg for balance and support."],
  ["👁️", "Why do we blink our eyes many times a minute?", "To keep the eyes moist and clean", ["To see colours", "To hear better", "To make tears salty"], "Each blink spreads tears over the eye, washing away dust and keeping it wet."],
  ["🥶", "Why do we shiver when we feel very cold?", "Shivering muscles make heat to warm the body", ["Shivering cools the body", "Shivering helps us sleep", "Shivering makes us hungry"], "Quick small movements of muscles produce heat."],
  ["🥵", "How does sweating help us on a hot day?", "Sweat dries from the skin and cools the body", ["Sweat makes the body warmer", "Sweat gives us energy", "Sweat stops us from breathing"], "When sweat evaporates, it takes heat away from the skin."],
  ["🔆", "When you come into bright sunlight, the black dot (pupil) in the middle of your eye becomes ___.", "smaller", ["bigger", "red", "green"], "The pupil gets smaller in bright light to let in less light and protect the eye. In dim light it gets bigger."],
  ["☠️", "Which sign on a bottle tells us that it contains poison?", "A skull and crossbones", ["A green tick", "A smiling face", "A red heart"], "The skull and crossbones means danger. Never touch or taste such things."],
  ["✂️", "What is the safe way to walk with a pair of scissors?", "Hold the closed blades pointing down", ["Hold them open and pointing up", "Run with them", "Wave them in the air"], "Closed blades pointing down cannot poke anyone if you trip."],
  ["🍬", "A stranger near school offers you sweets and a ride. What should you do?", "Say no, move away and tell a teacher or parent", ["Take the sweets and go", "Go quietly with them", "Keep it a secret"], "Never go with or take things from strangers. Always tell a trusted adult."],
  ["🐟", "Fish can live under water because water has ___ dissolved in it.", "air (oxygen)", ["sugar", "sand", "light"], "Fish use their gills to take in the oxygen dissolved in water."],
  ["🚢", "A steel spoon sinks in water, but a huge steel ship floats. Why?", "The ship's hollow, wide shape is full of air and pushes aside a lot of water", ["The ship is lighter than the spoon", "Sea water is magnetic", "Ships have wheels"], "The shape matters. The ship's hollow body pushes aside a lot of water, and that water pushes it up."],
  ["⚖️", "Which is heavier: 1 kg of cotton or 1 kg of iron?", "Both weigh the same", ["1 kg of iron", "1 kg of cotton", "It depends on the colour"], "1 kg is 1 kg. Cotton just takes up much more space than iron of the same weight."],
  ["🏺", "Why does water in a clay pot (matka) stay cool in summer?", "Water seeps through tiny pores and evaporates, taking heat away", ["Clay makes ice", "The pot is painted red", "Clay is always cold"], "Evaporation from the outer surface cools the pot and the water inside."],
  ["🤒", "A wet cloth on the forehead helps to bring down a high fever. How?", "The water evaporates and takes away heat from the skin", ["The cloth makes heat", "Water enters the body", "The cloth blocks germs"], "Evaporating water carries heat away from the skin, cooling it."],
  ["🪐", "Which of these is NOT a planet?", "Moon", ["Mars", "Venus", "Saturn"], "The Moon goes round the Earth. It is a satellite, not a planet."],
  ["☀️", "Which planet is closest to the Sun?", "Mercury", ["Venus", "Earth", "Mars"], "The order from the Sun is Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune."],
  ["📏", "Which of these is the longest?", "1 metre", ["99 cm", "90 cm", "50 cm"], "1 metre = 100 cm, which is longer than 99 cm."],
  ["🌞", "Suppose 'Sun' is called 'Moon', 'Moon' is called 'Star' and 'Star' is called 'Cloud'. What would shine in the day sky?", "Moon", ["Sun", "Star", "Cloud"], "The Sun shines in the day. In this code the Sun is called 'Moon'."],
  ["🕯️", "Which of these gives us BOTH light and heat?", "A candle flame", ["The Moon", "A mirror", "A glass window"], "A flame makes its own light and heat. The Moon and a mirror only reflect light."],
  ["🪟", "Through which of these can we see things clearly?", "Clear glass", ["Frosted glass", "Wood", "Butter paper"], "Clear glass lets almost all light through. Frosted glass and butter paper let some light through but things look blurred."],
  ["😎", "Why should we never look straight at the Sun?", "Its strong light can harm our eyes", ["It makes us sneeze forever", "It changes our eye colour", "It is too far"], "Sunlight is so strong that looking at it can damage the eyes, even with dark glasses."],
  ["🕯️", "A candle flame always points upwards, even if you tilt the candle. Why?", "Hot air rises and carries the flame up", ["The wax pushes it up", "The Moon pulls it", "Cold air rises"], "Air around the flame gets hot and lighter, so it rises and pulls the flame upward."],
  ["🐄", "Which animal gives birth to young ones and lives mainly on land?", "Cow", ["Dolphin", "Hen", "Crocodile"], "A cow gives birth to a calf on land. A dolphin gives birth in water, and hens and crocodiles lay eggs."],
  ["🌳", "Which of these is NOT a use of trees?", "They make plastic", ["They give shade", "They give fruit and wood", "They give homes to birds"], "Trees give shade, food, wood and homes. Plastic is made in factories, mostly from petroleum."],
  ["🫁", "We breathe in fresh air with oxygen. What do we breathe out more of?", "Carbon dioxide", ["Oxygen only", "Smoke", "Steam"], "Our body uses oxygen and gives out carbon dioxide, which leaves when we breathe out."],
];

// ================= GRADE 4 =================
const X4 = [
  // Plants: photosynthesis, transport, transpiration
  ["🌑", "A potted plant was kept in a dark room for 48 hours. A leaf was then boiled in spirit and tested with iodine. What will you see?", "No blue-black colour, because the leaf has no starch", ["Blue-black colour, because starch is present", "The leaf turns bright green", "The leaf turns red"], "In the dark the plant cannot make food and uses up the starch it had. No starch means no blue-black colour with iodine."],
  ["🍀", "A leaf with green and white patches (variegated leaf) is kept in sunlight and then tested with iodine. Which parts turn blue-black?", "Only the parts that were green", ["Only the white parts", "The whole leaf", "No part of the leaf"], "Only green parts have chlorophyll, so only they make starch. This shows chlorophyll is needed for photosynthesis."],
  ["🔬", "Why is a plant kept in the dark for two days before a starch-test experiment?", "To use up (remove) the starch already present in its leaves", ["To make the leaves grow bigger", "To make the leaves greener", "To kill the plant's germs"], "Destarching makes sure that any starch found later was made during the experiment."],
  ["⬛", "A strip of black paper is clipped on both sides of a leaf and the plant is kept in sunlight. The iodine test shows the covered strip has no starch. What does this prove?", "Light is needed for photosynthesis", ["Water is needed for photosynthesis", "Chlorophyll is made in the dark", "Leaves breathe through black paper"], "The covered part was the same as the rest in every way except light. So the missing starch shows light is needed."],
  ["🫙", "A potted plant is kept in a sealed glass jar along with a chemical that soaks up all the carbon dioxide. After some hours in sunlight, its leaves show no starch. Why?", "Carbon dioxide is needed to make food", ["Plants need oxygen to make food", "The jar blocked all light", "The chemical killed the roots"], "Without carbon dioxide, the leaves cannot make glucose and starch, even in sunlight."],
  ["🍃", "What are the raw materials that a leaf uses in photosynthesis?", "Carbon dioxide and water", ["Oxygen and water", "Glucose and oxygen", "Carbon dioxide and oxygen"], "Leaves combine carbon dioxide (from air) and water (from roots) using sunlight and chlorophyll to make glucose, and give out oxygen."],
  ["🌵", "In a cactus, which part does most of the photosynthesis?", "The green stem", ["The spines", "The roots", "The flowers"], "A cactus's leaves are spines, so its thick green stem has the chlorophyll and makes food."],
  ["💧", "Which tissue carries water up a plant, and which carries food to all parts?", "Xylem carries water; phloem carries food", ["Phloem carries water; xylem carries food", "Xylem carries both", "Roots carry food; leaves carry water"], "Xylem tubes take water and minerals up from the roots. Phloem carries food made in the leaves to all parts."],
  ["🌹", "A white flower's stalk is kept in water with red ink. After a few hours the petals have red streaks. What does this show?", "The stem carries water up to the flower", ["Flowers make red ink", "Petals soak up colour from the air", "The roots are not needed by plants"], "The coloured water travelled up the xylem of the stalk to the petals."],
  ["🛍️", "A plastic bag is tied over a leafy branch of a potted plant in sunlight. Water drops collect inside the bag. Which process does this show?", "Transpiration", ["Photosynthesis", "Germination", "Pollination"], "Leaves give out water vapour through stomata. Inside the bag it cools and turns into drops."],
  ["🔄", "How is transpiration useful to a plant?", "It helps pull water up from the roots and cools the plant", ["It makes seeds", "It gives the plant oxygen to breathe", "It stops roots from growing"], "As water evaporates from leaves, more water is pulled up from the roots, like sucking through a straw. Evaporation also cools the leaves."],
  ["🍂", "Why do most stomata lie on the LOWER surface of the leaf?", "Less water is lost, as the lower side gets less direct sunlight", ["So rain can enter them", "So insects cannot see them", "So the leaf is heavier underneath"], "The upper surface faces the hot Sun. Keeping most pores underneath cuts down water loss."],
  ["🍁", "Some trees shed all their leaves in the dry season. How does this help them?", "It reduces water loss when water is scarce", ["It helps them make more food", "It helps them attract insects", "It makes their roots longer"], "Leaves lose water through transpiration. With no leaves, the tree loses very little water in dry months."],
  ["🌳", "Banyan trees have roots hanging down from their branches. What is their job?", "They support the heavy, spreading branches (prop roots)", ["They catch insects", "They make seeds", "They store honey"], "Prop roots grow down to the soil and act like pillars that hold up the wide branches."],
  ["🌊", "Mangrove plants growing in salty, muddy swamps have roots that grow UP out of the mud. Why?", "To take in air, because the waterlogged mud has little oxygen", ["To catch fish", "To store salt", "To climb other trees"], "These breathing roots (pneumatophores) have pores that take in air from above the mud."],
  ["🪢", "Cuscuta (amarbel) is a yellow, leafless plant that winds around other plants. How does it get food?", "It is a parasite that takes food from the host plant", ["It makes food by photosynthesis", "It catches insects", "It gets food from dead matter"], "Cuscuta has no chlorophyll. It sends special roots into the host plant and takes its food."],
  ["🍄", "How is a mushroom different from a pitcher plant in getting food?", "A mushroom takes food from dead matter; a pitcher plant makes food and also digests insects", ["Both make all their food by photosynthesis", "Both are parasites", "A mushroom catches insects; a pitcher plant eats dead matter"], "Mushrooms are saprophytes (no chlorophyll). The pitcher plant is green and makes food, but traps insects for nitrogen."],
  ["🪨", "Lichens growing on rocks are a partnership between ___.", "an alga and a fungus", ["a moss and a fern", "two kinds of bacteria", "a plant and an insect"], "The alga makes food by photosynthesis and the fungus gives shelter and water. Both gain."],
  ["🫛", "The tendrils of a pea plant, which help it climb, are modified ___.", "leaflets (parts of the leaf)", ["roots", "flowers", "fruits"], "In the pea plant, some leaflets become thin, coiling tendrils that wind around a support."],
  // Germination and reproduction
  ["🌱", "Which is NOT needed for most seeds to germinate?", "Soil", ["Water", "Air", "Suitable warmth"], "Seeds germinate on wet cotton or paper too. They need water, air and a suitable temperature, not soil."],
  ["🧊", "Three sets of moist seeds: A kept in a fridge, B kept at room temperature, C under boiled water with an oil layer on top. Which set germinates?", "Only B", ["Only A", "Only C", "A and B"], "A is too cold, C gets no air (boiling removed it and oil keeps new air out). Only B has water, air and warmth."],
  ["🫘", "Which part of a seed grows into the root of the young plant?", "Radicle", ["Plumule", "Cotyledon", "Seed coat"], "The radicle grows down into the root. The plumule grows up into the shoot."],
  ["🫘", "What is the job of the cotyledons in a bean seed?", "They store food for the growing baby plant", ["They become the root", "They make pollen", "They protect the flower"], "Cotyledons (seed leaves) are full of stored food that the seedling uses until it can make its own."],
  ["🌽", "Which of these seeds has only ONE cotyledon (a monocot)?", "Maize", ["Bean", "Pea", "Gram"], "Maize, wheat and rice are monocots. Bean, pea and gram split into two halves: they are dicots."],
  ["🌸", "Pollination is the transfer of ___.", "pollen from an anther to a stigma", ["seeds from a fruit to the soil", "water from roots to leaves", "nectar from flower to bee"], "Pollen from the anther (male part) must reach the stigma (female part) before seeds can form."],
  ["🌸", "After fertilisation, the ___ becomes the seed and the ___ becomes the fruit.", "ovule, ovary", ["ovary, ovule", "petal, sepal", "anther, stigma"], "The ovules inside the ovary turn into seeds, and the ovary swells to form the fruit."],
  ["🍃", "Which plant can grow new plants from buds on the edges of its leaves?", "Bryophyllum", ["Potato", "Rose", "Ginger"], "Bryophyllum leaves have buds along their notches. When a leaf falls on moist soil, new plants grow from them."],
  ["🌿", "Ferns and mosses do not make seeds. How do they reproduce?", "By spores", ["By eggs", "By stem cuttings only", "By pollen grains"], "Spores are tiny, light cells formed under fern leaves or in moss capsules. They grow into new plants."],
  ["🎆", "The fruit of the balsam plant bursts when touched and throws seeds away. Which other plant spreads seeds the same way?", "Castor", ["Coconut", "Drumstick", "Xanthium"], "Castor fruits also burst open when dry. Coconut floats on water, drumstick seeds have wings, and xanthium sticks to animals."],
  ["🥥", "How does the fibrous husk help a coconut spread to new islands?", "It traps air, so the fruit floats on sea water", ["It makes the coconut sticky", "It helps birds carry it", "It makes it explode"], "The light, air-filled husk lets coconuts float for long distances and grow on new shores."],
  ["🍁", "Seeds of drumstick and maple have wing-like parts. How are they spread?", "By wind", ["By water", "By animals eating them", "By bursting"], "Wings let the seeds glide far from the parent plant in the wind."],
  // Animals
  ["🦋", "In the life cycle of a butterfly, which stage eats the most and grows fastest?", "Larva (caterpillar)", ["Pupa", "Egg", "Adult"], "The caterpillar eats leaves all day and grows quickly. The pupa does not eat at all."],
  ["🦟", "Why does spreading a thin layer of kerosene on stagnant water kill mosquito larvae?", "The oil layer stops the larvae from breathing air at the surface", ["Kerosene is food for them", "It makes the water hot", "It turns the water into ice"], "Mosquito larvae hang at the surface and breathe air through a tube. The oil layer blocks this."],
  ["🪳", "Which insect grows WITHOUT a pupa stage (egg → nymph → adult)?", "Cockroach", ["Butterfly", "Housefly", "Mosquito"], "A young cockroach (nymph) looks like a small adult without wings. Butterflies, houseflies and mosquitoes have a pupa stage."],
  ["🦎", "Which cold-blooded animal lays eggs with a shell on land?", "Lizard", ["Frog", "Fish", "Bat"], "Reptiles like lizards lay shelled eggs on land. Frogs and fish lay jelly-covered eggs in water, and a bat gives birth to babies."],
  ["🦇", "Which group has ONLY mammals?", "Bat, whale, porcupine", ["Bat, penguin, whale", "Shark, dolphin, seal", "Whale, ostrich, rat"], "Bats, whales and porcupines feed their young on milk and have hair. Penguins and ostriches are birds; a shark is a fish."],
  ["🐢", "Which of these is a reptile?", "Turtle", ["Salamander", "Toad", "Eel"], "Turtles have dry, scaly skin and lay shelled eggs on land. Salamanders and toads are amphibians; an eel is a fish."],
  ["🐠", "Which of these is a true fish?", "Sea horse", ["Starfish", "Jellyfish", "Cuttlefish"], "A sea horse has gills, fins and a backbone: it is a fish. Starfish, jellyfish and cuttlefish have no backbone."],
  ["🐟", "Which of these is a true fish?", "Catfish", ["Silverfish", "Shellfish", "Crayfish"], "A catfish is a fish with whisker-like feelers. A silverfish is an insect; shellfish and crayfish are not fish."],
  ["🐬", "Which pair of animals find things by echoes of the sounds they make (echolocation)?", "Bats and dolphins", ["Owls and cats", "Eagles and owls", "Sharks and crabs"], "Bats and dolphins send out high-pitched sounds and listen for the echoes."],
  ["🐦", "Why do birds have hollow bones?", "To keep the body light for flying", ["To store water", "To make their songs louder", "To keep warm"], "Hollow bones with air spaces are strong but light, which makes flying easier."],
  ["🪱", "An earthworm breathes through its moist skin. What happens if its skin dries out?", "It cannot breathe and may die", ["It breathes faster", "It grows gills", "It grows lungs"], "Oxygen can pass only through a wet skin. That is why earthworms stay in damp soil."],
  ["🦨", "Which of these is NOT an example of camouflage?", "A skunk spraying a bad smell", ["A stick insect looking like a twig", "A chameleon changing colour to match leaves", "A polar bear's white fur in the snow"], "Camouflage means blending in with the surroundings. A skunk's spray is a defence, not hiding."],
  ["🦊", "The fennec fox of the hot desert has very large ears. How do they mainly help it?", "They give off extra body heat and help it hear prey", ["They store fat", "They help it swim", "They keep sand out of the eyes"], "Big ears with many blood vessels lose heat quickly, keeping the fox cool, and catch faint sounds of prey."],
  ["🦀", "Which animal has no backbone but has a hard covering outside its body?", "Crab", ["Snake", "Frog", "Tortoise"], "A crab has a hard outer covering (exoskeleton) and no backbone. A tortoise has a shell AND a backbone."],
  ["🐸", "Frogs bury themselves in mud during the hot, dry summer and stay inactive. This is called ___.", "aestivation (summer sleep)", ["hibernation", "migration", "camouflage"], "Hibernation is the winter sleep. Escaping hot, dry weather by sleeping is aestivation."],
  ["🐝", "Which is an example where BOTH partners gain?", "Bees and flowering plants", ["Lice on a dog", "A lion hunting a deer", "Cuscuta on a tree"], "Bees get nectar and the flowers get pollinated. Lice and cuscuta harm their host; a lion eats the deer."],
  ["🦁", "The Gir forest in Gujarat is the only natural home of ___.", "Asiatic lions", ["Bengal tigers", "Snow leopards", "One-horned rhinos"], "Asiatic lions are found in the wild only in and around Gir National Park."],
  ["🦏", "Kaziranga National Park in Assam is famous for protecting the ___.", "one-horned rhinoceros", ["Asiatic lion", "snow leopard", "Bengal tiger only"], "Kaziranga has the largest number of Indian one-horned rhinoceroses in the world."],
  ["🐅", "Project Tiger, to save tigers in India, was started in ___.", "1973", ["1947", "1999", "1985"], "Project Tiger began in 1973 to protect tigers and their forests through tiger reserves."],
  // Food chains and ecosystems
  ["⚡", "About how much of the energy at one level of a food chain passes on to the next level?", "About 10%", ["About 90%", "About 50%", "All of it"], "Most energy is used for living or lost as heat. Only about 10% is stored in the body and passed on."],
  ["⛓️", "Why do food chains usually have only 4 or 5 levels?", "Energy becomes too little at each higher level", ["Animals do not like long chains", "Producers stop making food", "Decomposers eat the top animals"], "Since only about 10% passes on at each step, little energy is left for the top levels."],
  ["🦅", "Vultures and hyenas eat the flesh of dead animals. They are called ___.", "scavengers", ["decomposers", "producers", "herbivores"], "Scavengers eat dead animals. Decomposers (bacteria and fungi) break down dead matter into simple substances."],
  ["🦠", "Which pair are both decomposers?", "Bacteria and fungi", ["Vulture and hyena", "Algae and moss", "Bacteria and algae"], "Bacteria and fungi break down dead plants and animals. Algae and moss are producers; vultures are scavengers."],
  ["☀️", "Which of these is a NON-living (abiotic) part of a pond ecosystem?", "Sunlight", ["Algae", "Bacteria", "Frog"], "Sunlight, water, air, soil and temperature are abiotic. Algae, bacteria and frogs are living (biotic)."],
  ["🐍", "In a grassland, all the snakes are killed. Which is MOST likely to happen first?", "The number of rats and frogs will increase", ["The grass will grow much more", "Eagles will increase", "Frogs will disappear"], "Snakes eat rats and frogs. With no snakes, these animals multiply, and then they eat more grass and insects."],
  // Food and digestion
  ["🥔", "Which food will turn blue-black when a drop of iodine solution is added?", "Boiled potato", ["Egg white", "Sugar solution", "Butter"], "Iodine turns blue-black with starch. Potato is rich in starch."],
  ["📄", "How can you test a food for fat?", "Rub it on paper: a greasy, see-through patch shows fat", ["Add iodine: it turns blue-black", "Add salt: it turns red", "Heat it: it turns to ice"], "Fat leaves an oily, translucent patch on paper. Iodine tests for starch."],
  ["🧪", "A food turns violet when copper sulphate and caustic soda solutions are added. Which nutrient does it have?", "Protein", ["Starch", "Fat", "Vitamin C"], "This colour test (violet/purple) shows protein, for example in egg white or milk."],
  ["🍋", "A child has bleeding gums and cuts that heal slowly. Which foods should be added to the diet?", "Amla, oranges and lemons", ["Rice and potatoes", "Butter and ghee", "Sugar and sweets"], "These are signs of scurvy, caused by lack of vitamin C. Citrus fruits and amla are rich in vitamin C."],
  ["🧂", "A person has a swollen neck (goitre). What should be added to the diet?", "Iodised salt", ["More sugar", "More fat", "More rice"], "Goitre is caused by lack of iodine. Iodised salt supplies it."],
  ["🥬", "A child is often tired, short of breath and looks pale (anaemia). Which foods help most?", "Green leafy vegetables and jaggery (rich in iron)", ["Chips and cola", "Plain rice only", "Butter and cream"], "Anaemia is often caused by lack of iron. Iron is needed to make haemoglobin, which carries oxygen."],
  ["🦵", "A child has soft bones and bent legs. Which disease is it and what does the child need?", "Rickets; vitamin D (sunlight) and calcium", ["Scurvy; vitamin C", "Goitre; iodine", "Night blindness; vitamin A"], "Rickets is caused by lack of vitamin D, which the body needs to use calcium for strong bones."],
  ["🍚", "A child has a swollen belly, thin arms and legs and swollen feet, caused by too little protein. This disease is ___.", "Kwashiorkor", ["Scurvy", "Beriberi", "Goitre"], "Kwashiorkor is caused by lack of protein. Marasmus is caused by lack of overall food and energy."],
  ["🍙", "People who eat mainly polished white rice may suffer from beriberi. Why?", "Polishing removes the outer layer, which has vitamin B1", ["Polished rice has too much iron", "Polished rice has too much fat", "Polished rice has iodine"], "The bran layer of rice has vitamin B1 (thiamine). Lack of it causes beriberi, which weakens nerves and muscles."],
  ["🩸", "Which vitamin is needed for blood to clot when we get a cut?", "Vitamin K", ["Vitamin A", "Vitamin C", "Vitamin D"], "Vitamin K, found in green leafy vegetables, helps blood clot."],
  ["🧈", "Which nutrient gives the MOST energy from one gram?", "Fats", ["Carbohydrates", "Proteins", "Vitamins"], "One gram of fat gives about twice as much energy as one gram of carbohydrate or protein."],
  ["🍽️", "The digestion of starch starts in the ___ and the digestion of protein starts in the ___.", "mouth; stomach", ["stomach; mouth", "small intestine; mouth", "mouth; large intestine"], "Saliva starts breaking starch in the mouth. The stomach's juices start digesting proteins."],
  ["🔍", "The inner wall of the small intestine has millions of finger-like villi. What do they do?", "Increase the surface for absorbing digested food", ["Grind food into small bits", "Make saliva", "Store urine"], "Villi give a huge surface area, so digested food passes quickly into the blood."],
  ["🟤", "Which organ helps digestion even though food does NOT pass through it?", "Liver", ["Stomach", "Small intestine", "Food pipe"], "The liver makes bile, which flows into the small intestine to help digest fats. Food never enters the liver."],
  ["🧪", "Why does our stomach make hydrochloric acid?", "To kill germs in food and help digest proteins", ["To make food sweet", "To dissolve our teeth", "To absorb water"], "The acid kills many germs and gives the right conditions for stomach juices to digest proteins."],
  ["🗣️", "Why should we not talk or laugh while swallowing food?", "Food may enter the windpipe and make us choke", ["Food becomes cold", "Food goes to the lungs to be digested", "Our teeth stop working"], "A flap called the epiglottis covers the windpipe when we swallow. Talking can open it and let food slip in."],
  ["📏", "Which is the longest part of the alimentary canal?", "Small intestine", ["Large intestine", "Food pipe", "Stomach"], "The small intestine is about 6–7 metres long in an adult, coiled up to fit in the belly."],
  ["🦷", "Which type of teeth is NOT present in the set of 20 milk teeth?", "Premolars", ["Incisors", "Canines", "Molars"], "Milk teeth have incisors, canines and molars. Premolars come only with permanent teeth."],
  ["🍓", "Jams and jellies do not spoil quickly mainly because they contain a lot of ___.", "sugar", ["water", "salt", "air"], "A lot of sugar pulls water out of germs, so they cannot grow."],
  ["🥛", "What is pasteurisation of milk?", "Heating milk to about 70 °C for a short time and then cooling it quickly", ["Freezing milk into ice", "Adding salt to milk", "Boiling milk for many hours"], "This kills most harmful germs without spoiling the taste. It was devised by Louis Pasteur."],
  ["🍟", "Packets of chips are filled with nitrogen gas. Why?", "To stop the oil in the chips from going bad (rancid)", ["To make the chips taste salty", "To make the packet heavier", "Because nitrogen is a food"], "Oxygen makes oily food rancid. Nitrogen does not react, so the chips stay fresh and crisp."],
  ["🥬", "Cooking spinach in a lot of water and throwing that water away wastes ___.", "vitamins and minerals", ["fat", "roughage only", "starch only"], "Many vitamins and minerals dissolve in the cooking water and are lost when it is thrown away."],
  // Human body
  ["🦴", "Which joints in our body CANNOT move?", "The joints between the bones of the skull", ["The knee joint", "The shoulder joint", "The neck joint"], "Skull bones are joined firmly (fixed joints) to protect the brain. Only the lower jaw moves."],
  ["👂", "Which part of our body is made of cartilage, which is softer than bone?", "The outer ear", ["The thigh", "The skull", "The teeth"], "Cartilage is firm but bendable. It is found in the outer ear, the tip of the nose and between joints."],
  ["💪", "When the biceps muscle in the upper arm contracts, the arm ___.", "bends at the elbow", ["straightens", "turns at the shoulder", "stays still"], "Muscles work in pairs. The biceps pulls to bend the arm; the triceps pulls to straighten it."],
  ["❤️", "Which muscle keeps working all our life without getting tired?", "Heart muscle", ["Biceps", "Thigh muscle", "Tongue muscle"], "Cardiac (heart) muscle contracts about 70 times a minute without resting."],
  ["🩸", "Which blood vessels carry blood AWAY from the heart to the body?", "Arteries", ["Veins", "Capillaries only", "Nerves"], "Arteries carry blood away from the heart; veins bring it back. Capillaries are tiny vessels between them."],
  ["⌚", "We can feel our pulse at the wrist. What is the pulse?", "The throbbing of an artery each time the heart beats", ["The movement of bones", "Air moving in the lungs", "Food moving in the stomach"], "Each heartbeat pushes blood into the arteries, which throb. Counting it tells us the heart rate."],
  ["🫁", "When we breathe IN, the diaphragm ___ and the chest ___.", "moves down; expands", ["moves up; gets smaller", "moves down; gets smaller", "does not move; expands"], "The diaphragm flattens (moves down) and the ribs move up and out, so the chest gets bigger and air rushes in."],
  ["👃", "Why is it better to breathe through the nose than the mouth?", "Hairs and mucus in the nose trap dust and germs", ["The nose makes oxygen", "The mouth has no air", "The nose warms food"], "The nose filters the air and also warms and moistens it before it reaches the lungs."],
  ["🫁", "In the tiny air sacs of the lungs, what happens?", "Oxygen enters the blood and carbon dioxide leaves it", ["Food is digested", "Urine is made", "Blood is made"], "Air sacs (alveoli) have thin walls covered with capillaries, where gases are exchanged."],
  ["🧠", "Which part of the brain keeps our body balanced when we walk or ride a cycle?", "Cerebellum", ["Cerebrum", "Spinal cord", "Skull"], "The cerebellum at the back of the brain controls balance and smooth movements. The cerebrum is for thinking and memory."],
  ["🔥", "You pull your hand away from a hot pan even before you feel the pain. This is ___.", "a reflex action controlled by the spinal cord", ["a voluntary action by the cerebrum", "an action of the stomach", "a habit learnt in school"], "Reflexes are quick, automatic actions. The spinal cord sends the message to move without waiting for the brain to think."],
  ["👂", "The smallest bone in the human body is found in the ___.", "ear", ["toe", "nose", "finger"], "The stapes (stirrup), one of three tiny bones in the middle ear, is the smallest bone."],
  ["🫘", "Where is urine stored before it is passed out of the body?", "Urinary bladder", ["Kidneys", "Large intestine", "Stomach"], "Kidneys make urine, which flows through two tubes to the bladder, where it is stored."],
  ["🩺", "Which instrument do doctors use to listen to heartbeats and breathing sounds?", "Stethoscope", ["Thermometer", "Barometer", "Microscope"], "A stethoscope carries the faint sounds of the heart and lungs to the doctor's ears."],
  ["🧴", "Which organ removes some water, salts and a little urea from our body as sweat?", "Skin", ["Lungs", "Stomach", "Heart"], "Sweat glands in the skin give out sweat, which also helps cool the body."],
  // Matter and materials
  ["🔥", "In which pair are BOTH changes irreversible?", "Ripening of a mango and burning of wood", ["Melting of ice and burning of wood", "Folding paper and rusting of iron", "Dissolving salt and cooking rice"], "A ripe mango cannot become raw again, and ash cannot become wood. Melting, folding and dissolving can be reversed."],
  ["🕯️", "When a candle burns, which changes take place?", "Both a reversible change (melting wax) and an irreversible change (burning wax)", ["Only a reversible change", "Only an irreversible change", "No change at all"], "Melted wax can set again (reversible), but wax that burns turns into gases and soot (irreversible)."],
  ["🔩", "An iron nail kept in boiled water with an oil layer on top does not rust. Why?", "Rusting needs both air and water; the oil keeps air out", ["Boiled water is too hot to rust iron", "Oil turns iron into steel", "Iron never rusts in water"], "Boiling removes air from water and the oil layer stops new air from dissolving. Without oxygen, iron does not rust."],
  ["🛡️", "Iron is coated with a layer of zinc to stop rusting. What is this called?", "Galvanisation", ["Crystallisation", "Evaporation", "Sublimation"], "Zinc keeps air and moisture away from the iron. Galvanised iron is used for buckets and roofs."],
  ["🧲", "A mixture has sand, salt and iron filings. Which is the right order to separate them?", "Use a magnet, then dissolve in water and filter, then evaporate the water", ["Evaporate first, then use a magnet, then filter", "Filter first, then use a magnet", "Use a sieve, then a magnet, then winnow"], "The magnet pulls out iron. Salt dissolves but sand does not, so filtering leaves sand behind. Evaporating the filtrate gives the salt."],
  ["🧈", "Butter is separated from curd by ___.", "churning", ["filtration", "magnet", "winnowing"], "When curd is churned fast, the lighter fat (butter) collects together and floats to the top."],
  ["🛢️", "Oil and water are poured into a glass and left still. How can they be separated?", "Let them form layers and pour off (or drain) one layer", ["Use a magnet", "Use a filter paper", "Dissolve them in more water"], "Oil does not mix with water and floats on top, so the layers can be separated by decanting or a separating funnel."],
  ["☕", "More sugar dissolves in hot tea than in cold tea. This shows that ___.", "more of a solid dissolves in water at a higher temperature", ["sugar melts in hot tea", "hot tea has less water", "sugar turns into gas"], "Solubility of most solids increases when the liquid is heated."],
  ["🥤", "A solution in which no more solute can dissolve at that temperature is called ___.", "a saturated solution", ["an empty solution", "a dilute solution", "a mixture of gases"], "When a solution is saturated, extra solute just settles at the bottom."],
  ["🍬", "A hot, saturated sugar solution is left to cool. What happens?", "Some sugar comes out as crystals", ["It turns into steam", "It becomes more sweet", "Nothing happens at all"], "Cold water can hold less sugar than hot water, so the extra sugar forms crystals."],
  ["🫧", "Naphthalene balls kept in a cupboard get smaller and smaller without leaving any liquid. This is ___.", "sublimation", ["melting", "evaporation", "condensation"], "Sublimation is when a solid turns directly into a gas. Camphor and naphthalene do this."],
  ["💨", "Why can a gas be squeezed (compressed) easily, but a solid cannot?", "Gas particles have large spaces between them", ["Gas particles are larger", "Gases are heavier than solids", "Solid particles move faster"], "In gases particles are far apart, so pushing them closer is easy. In solids they are packed tightly."],
  ["🚆", "Why are small gaps left between rails of a railway track?", "Rails expand in summer heat and need space", ["To save iron", "To let rain drain", "To make a sound"], "Metals expand when heated. Without gaps, the rails would bend on very hot days."],
  ["🍳", "Why are the handles of cooking pans made of plastic or wood?", "They are poor conductors of heat", ["They are good conductors of heat", "They are very heavy", "They melt easily"], "Plastic and wood do not let heat pass easily, so the handle stays cool enough to hold."],
  ["✏️", "Which non-metal is a good conductor of electricity?", "Graphite (pencil 'lead')", ["Sulphur", "Rubber", "Glass"], "Most non-metals are poor conductors, but graphite conducts electricity."],
  ["🧲", "Which of these metals is NOT attracted by a magnet?", "Aluminium", ["Iron", "Nickel", "Cobalt"], "Iron, nickel and cobalt are magnetic. Aluminium, copper, gold and silver are not."],
  ["🧲", "Where is the magnetic pull of a bar magnet the strongest?", "At its two ends (poles)", ["In the middle", "Equally everywhere", "Only on the painted side"], "Iron filings cling mostly to the ends of a bar magnet, where the poles are."],
  ["🔨", "A magnet can lose its magnetism if it is ___.", "heated, hammered or dropped often", ["kept with a keeper", "kept in a box", "cleaned with a dry cloth"], "Heat and rough handling disturb the arrangement inside a magnet and weaken it."],
  ["🧪", "You have two identical-looking bars. One is a magnet and the other is plain iron. Which test proves a bar is a magnet?", "It repels one end of a known magnet", ["It attracts a known magnet", "It is heavy", "It is shiny"], "A magnet and plain iron both show attraction. Only a magnet can repel another magnet, so repulsion is the sure test."],
  ["📜", "Butter paper, frosted glass and oiled paper let some light pass but we cannot see clearly through them. They are ___.", "translucent", ["transparent", "opaque", "luminous"], "Translucent materials let some light through. Transparent ones let us see clearly; opaque ones block light."],
  // Force, work and energy
  ["🛝", "Why is it easier to push a heavy box up a long ramp than to lift it straight up?", "A ramp needs less effort, spread over a longer distance", ["A ramp makes the box lighter", "A ramp removes gravity", "A ramp has no friction"], "An inclined plane lets us use a smaller force, but we have to move the load a longer distance."],
  ["🔩", "A screw is really another simple machine wrapped around a rod. Which one?", "Inclined plane", ["Pulley", "Wheel and axle", "Lever"], "The thread of a screw is a long ramp (inclined plane) wound round and round."],
  ["🚪", "Why is a door handle placed far from the hinges?", "A force applied far from the hinge turns the door more easily", ["It looks nicer", "The hinges are weak", "It keeps the door locked"], "The farther from the turning point (hinge) we push, the less force is needed to turn the door."],
  ["🛞", "Why do tyres have deep grooves (treads)?", "To increase grip (friction) on the road", ["To make the tyre lighter", "To reduce friction to zero", "To make noise"], "Treads grip the road and push water away, so vehicles do not skid."],
  ["⚙️", "Ball bearings in a cycle's wheel reduce friction because they ___.", "replace sliding with rolling", ["make the wheel heavier", "stick parts together", "increase the grip"], "Rolling friction is much smaller than sliding friction."],
  ["👟", "Which of these is a DISADVANTAGE of friction?", "Soles of shoes wear out", ["We can walk without slipping", "We can write with a pencil", "Brakes can stop a cycle"], "Friction helps us walk, write and stop. But it also wears out shoe soles and machine parts."],
  ["🪶", "A feather and a coin are dropped together inside a tube from which all air is removed. What happens?", "They fall together and land at the same time", ["The coin lands first", "The feather lands first", "The feather floats up"], "Without air, there is no air resistance, so gravity makes all objects fall at the same rate."],
  ["👩‍🚀", "An astronaut of mass 60 kg goes to the Moon. What is her mass there?", "60 kg, but she weighs about one-sixth as much", ["10 kg", "360 kg", "0 kg"], "Mass is the amount of matter and does not change. Weight depends on gravity, which on the Moon is about one-sixth of Earth's."],
  ["🧱", "In which of these is NO work done, in the scientific sense?", "Pushing hard against a wall that does not move", ["Lifting a bag onto a shelf", "Pulling a cart along a road", "Climbing stairs"], "In science, work is done only when a force moves an object. The wall does not move, so no work is done."],
  ["🔦", "Which energy changes take place in a torch when it is switched on?", "Chemical energy → electrical energy → light (and heat) energy", ["Light → chemical → electrical", "Electrical → chemical → sound", "Heat → light → chemical"], "The cells store chemical energy. It becomes electrical energy, and the bulb changes it into light and some heat."],
  ["🏞️", "In a hydroelectric power station, which energy change happens?", "Energy of water stored high up → energy of moving water → electrical energy", ["Electrical → heat → light", "Chemical → light", "Sound → electrical"], "Water stored behind a dam has potential energy. As it falls it moves fast and turns turbines that generate electricity."],
  ["🌿", "Green plants change ___ energy into ___ energy stored in food.", "light; chemical", ["chemical; light", "heat; sound", "electrical; chemical"], "In photosynthesis, sunlight's energy is stored as chemical energy in glucose and starch."],
  ["🔊", "In which medium does sound travel FASTEST?", "Steel", ["Air", "Water", "Vacuum"], "Sound travels fastest in solids, slower in liquids, slower still in gases, and not at all in a vacuum."],
  ["🎸", "A guitar string is made tighter. What happens to its sound?", "The pitch becomes higher", ["The pitch becomes lower", "The sound stops", "The sound becomes slower"], "A tighter string vibrates faster (higher frequency), so the pitch rises."],
  ["🏔️", "You shout near a big cliff and hear your voice again. This is ___.", "an echo, caused by sound reflecting off the cliff", ["sound being absorbed", "light being reflected", "sound travelling in a vacuum"], "Sound bounces back from large, hard surfaces. We hear it again as an echo if the surface is far enough."],
  ["📢", "The loudness of sound is measured in ___.", "decibels (dB)", ["hertz only", "metres", "kilograms"], "Loudness is measured in decibels. Sounds above about 80 dB can harm our ears."],
  ["📷", "What is the image formed in a pinhole camera like?", "Upside down (inverted)", ["Upright and larger", "Upright and the same", "Coloured differently"], "Light travels in straight lines. Rays from the top of the object pass through the hole and reach the bottom of the screen."],
  ["🪞", "You raise your RIGHT hand in front of a plane mirror. Your image appears to raise its ___.", "left hand", ["right hand", "both hands", "no hand"], "A plane mirror swaps left and right (lateral inversion), but keeps the image upright and the same size."],
  ["📐", "A ray of light hits a plane mirror making an angle of 30° with the mirror's surface. What is the angle of reflection?", "60°", ["30°", "90°", "120°"], "Angles are measured from the normal (a line at 90° to the mirror). 90° − 30° = 60° angle of incidence, so the angle of reflection is also 60°."],
  ["🔴", "A red ball and a blue ball are held in sunlight. What colour are their shadows?", "Both shadows are dark", ["Red and blue", "Both red", "Both blue"], "A shadow is just the region where light is blocked, so it is always dark, whatever the object's colour."],
  ["🌈", "When white light passes through a glass prism, it splits into seven colours. This is called ___.", "dispersion", ["reflection", "absorption", "evaporation"], "Each colour bends by a different amount in the prism, so white light spreads out into VIBGYOR."],
  ["🎨", "A disc painted with the seven rainbow colours is spun very fast. What colour does it look?", "Nearly white", ["Black", "Red", "Rainbow-striped"], "The eye mixes the colours of the fast-spinning disc, and together they look white (Newton's colour disc)."],
  ["🥢", "A pencil kept slanting in a glass of water looks bent at the surface. Why?", "Light bends when it passes from water into air", ["Water bends the pencil", "Light stops in water", "The pencil gets wet"], "This bending of light at the boundary of two materials is called refraction."],
  ["💡", "In an electric bulb, the thin coil that glows is made of ___.", "tungsten", ["copper", "plastic", "glass"], "Tungsten can get white-hot without melting, so it glows brightly."],
  ["🔌", "Why do houses have a fuse or circuit breaker?", "It cuts off the current when too much flows, preventing fires", ["It makes bulbs brighter", "It stores electricity", "It saves water"], "Too much current heats wires. A fuse wire melts (or a breaker trips) and breaks the circuit."],
  ["🔋", "Two cells are placed in a torch. How should they be joined?", "The positive end of one touches the negative end of the other", ["Positive to positive", "Negative to negative", "Side by side, not touching"], "Joining + to − adds up their pushes. Wrong joining makes the torch fail."],
  ["🥄", "There is a gap in a circuit with a cell and a bulb. Which pair of objects will BOTH make the bulb glow when placed in the gap?", "A steel spoon and aluminium foil", ["An eraser and a steel spoon", "A glass bangle and a key", "A plastic scale and a coin"], "Metals are conductors and complete the circuit. Erasers, glass and plastic are insulators."],
  ["🧲", "How can an electromagnet be made stronger?", "By winding more turns of wire around the iron core", ["By using a plastic core", "By removing the cell", "By using fewer turns of wire"], "More turns of wire (and more current) make the electromagnet stronger."],
  // Environment
  ["🌡️", "Which gas is mainly responsible for global warming?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Helium"], "Carbon dioxide traps heat in the atmosphere (greenhouse effect). Burning fuels and cutting forests add more of it."],
  ["🧊", "CFCs once used in old refrigerators and sprays damage the ___.", "ozone layer", ["soil", "sea water", "rocks"], "CFCs break down ozone high in the atmosphere, letting more harmful UV rays reach Earth."],
  ["🌧️", "Acid rain is caused mainly by which gases from factories and vehicles?", "Sulphur dioxide and nitrogen oxides", ["Oxygen and nitrogen", "Water vapour and oxygen", "Helium and neon"], "These gases dissolve in rain to make acids that harm buildings, plants and lakes. The Taj Mahal's marble is affected by them."],
  ["♻️", "Among the 3Rs, which one is best for the environment?", "Reduce", ["Reuse", "Recycle", "All are exactly the same"], "Using less in the first place means less waste and less energy used. Reuse comes next, and recycling still uses energy."],
  ["🪱", "In vermicomposting, kitchen waste is turned into manure with the help of ___.", "red worms (earthworms)", ["houseflies", "plastic", "salt"], "Red worms eat the waste and give out rich compost called vermicompost."],
  ["🐟", "Too much fertiliser washes into a pond. Algae grow wildly and later many fish die. Why do the fish die?", "Dead algae rot and bacteria use up the oxygen in the water", ["The water becomes too salty", "The fish eat the fertiliser", "The water becomes too cold"], "When the algae die, decomposers use up dissolved oxygen, so fish suffocate."],
  ["⛽", "Why is CNG a better fuel for vehicles than petrol or diesel?", "It burns more cleanly and gives out fewer harmful gases", ["It is a renewable fuel", "It is made from water", "It gives out no carbon dioxide"], "CNG produces less smoke and fewer polluting gases, though it is still a fossil fuel."],
  ["🏠", "What is rainwater harvesting?", "Collecting and storing rainwater for later use", ["Growing crops in the rain", "Making artificial rain", "Pumping out groundwater"], "Rooftop rainwater can be stored in tanks or sent into the ground to refill wells."],
  ["📕", "The Red Data Book is a record of ___.", "endangered plants and animals", ["polluted rivers", "famous scientists", "rainfall in India"], "It lists species that are in danger of dying out, so they can be protected."],
  ["🌳", "In the Chipko movement, people hugged trees to ___.", "stop them from being cut down", ["measure their height", "pick their fruits", "get shade"], "Villagers in the Himalayas, many of them women, hugged trees to protect forests from being felled."],
  ["🏞️", "Which of these protects animals in their own natural home?", "A national park", ["A zoo", "A museum", "A pet shop"], "National parks and wildlife sanctuaries protect animals and plants in their natural habitat."],
  // Earth and universe
  ["🌍", "The Sun appears to rise in the east because the Earth rotates from ___.", "west to east", ["east to west", "north to south", "south to north"], "As the Earth spins west to east, places in the east see the Sun first, and the Sun seems to move from east to west."],
  ["🍂", "Which of these is caused by the Earth's revolution together with the tilt of its axis?", "Change of seasons", ["Day and night", "Sunrise in the east", "Shadows"], "Day and night come from rotation. Seasons come from going around the Sun with a tilted axis."],
  ["🕛", "When it is noon in India, what is the time roughly on the opposite side of the Earth?", "Around midnight", ["Also noon", "Around sunrise", "Around 3 p.m."], "The opposite side faces away from the Sun, so it is night there."],
  ["🌑", "At which phase is the Moon between the Earth and the Sun?", "New moon", ["Full moon", "First quarter", "Last quarter"], "At new moon, the sunlit side of the Moon faces away from us, so we cannot see it."],
  ["🌘", "A solar eclipse can happen only on a ___ day.", "new moon", ["full moon", "half moon", "any"], "Only at new moon can the Moon come between the Sun and the Earth."],
  ["🌓", "Why don't we have a solar and a lunar eclipse every month?", "The Moon's orbit is tilted to the Earth's orbit", ["The Moon stops moving", "The Sun is too far", "Clouds always block them"], "Usually the Moon passes a little above or below the line joining Sun and Earth, so no shadow falls."],
  ["🌕", "We always see the same face of the Moon. Why?", "It takes the same time to spin once as to go round the Earth", ["It does not spin at all", "The other face is always dark", "The Earth does not spin"], "The Moon turns once on its axis in about 27 days, the same time it takes to go round the Earth."],
  ["🌔", "What does 'waxing Moon' mean?", "The lit part grows each night from new moon to full moon", ["The lit part shrinks each night", "The Moon becomes bigger in size", "The Moon is covered with wax"], "After new moon, we see more of the Moon's sunlit side every night until full moon."],
  ["🔥", "Which planet is the hottest?", "Venus", ["Mercury", "Mars", "Jupiter"], "Mercury is closer to the Sun, but Venus has a very thick carbon dioxide atmosphere that traps heat."],
  ["🔄", "On which planet does the Sun rise in the west, because it spins the opposite way?", "Venus", ["Mars", "Mercury", "Jupiter"], "Venus rotates in the opposite direction to most planets."],
  ["🪐", "Which planet is so light for its size that it would float in a giant tub of water?", "Saturn", ["Jupiter", "Earth", "Mars"], "Saturn's density is less than water's, mainly because it is made of hydrogen and helium."],
  ["🌀", "The Great Red Spot, a giant storm bigger than the Earth, is on ___.", "Jupiter", ["Mars", "Saturn", "Venus"], "This huge storm has been watched on Jupiter for well over 150 years."],
  ["🌋", "Olympus Mons, the largest volcano in the solar system, is on ___.", "Mars", ["Venus", "Earth", "Mercury"], "Olympus Mons on Mars is about two and a half times as tall as Mount Everest."],
  ["☄️", "The asteroid belt lies between the orbits of ___.", "Mars and Jupiter", ["Earth and Mars", "Jupiter and Saturn", "Venus and Earth"], "Thousands of rocky bodies called asteroids go round the Sun between Mars and Jupiter."],
  ["⭐", "Why do stars twinkle but planets do not?", "Stars are so far that they look like points; planets look like tiny discs", ["Planets have no light at all", "Stars are moving very fast", "Planets are hotter"], "Light from a point-like star is easily disturbed by moving air. A planet's light comes from a small disc and stays steadier."],
  ["☀️", "About how long does sunlight take to reach the Earth?", "About 8 minutes", ["About 8 seconds", "About 8 hours", "About 8 days"], "Light travels about 3 lakh km every second, and the Sun is about 15 crore km away, so it takes about 8 minutes."],
  ["✨", "Which constellation is used to find the Pole Star?", "Ursa Major (Saptarishi)", ["Orion", "Leo", "Scorpius"], "The two pointer stars of the Saptarishi line up towards the Pole Star."],
  ["🧭", "Why does the Pole Star seem to stay fixed in the sky?", "It lies almost straight above the Earth's North Pole, along its axis", ["It does not exist", "It moves with the Earth", "It is the closest star"], "As the Earth spins, stars seem to circle the point above its axis. The Pole Star is almost exactly there, so it hardly moves."],
  ["🌋", "Which layer of the Earth is liquid?", "Outer core", ["Crust", "Inner core", "Upper crust"], "The outer core is molten iron and nickel. The inner core is solid because of the huge pressure."],
  ["🌏", "Which is the thickest layer of the Earth?", "Mantle", ["Crust", "Inner core", "Outer core"], "The mantle is nearly 2,900 km thick. The crust is only about 5–70 km thick."],
  ["🌦️", "In which layer of the atmosphere do clouds, rain and weather happen?", "Troposphere", ["Stratosphere", "Mesosphere", "Exosphere"], "The troposphere is the lowest layer. It has most of the air and water vapour."],
  ["✈️", "Jet aeroplanes often fly in the lower stratosphere. Why?", "It is free of clouds and stormy weather", ["It has more oxygen", "There is no gravity there", "It is the hottest layer"], "Above the weather of the troposphere, the air is calm, giving a smoother flight."],
  ["🌠", "Most meteors (shooting stars) burn up in the ___.", "mesosphere", ["troposphere", "crust", "ozone hole"], "Rocks from space rub against the air of the mesosphere and burn up, making streaks of light."],
  ["💨", "Which gas makes up the largest part of air?", "Nitrogen", ["Oxygen", "Carbon dioxide", "Water vapour"], "Air is about 78% nitrogen and about 21% oxygen."],
  ["📅", "Why is there a leap year (366 days) every four years?", "The Earth takes about 365¼ days to go round the Sun", ["The Moon takes 366 days to go round the Earth", "The Earth spins faster in leap years", "February grows longer in summer"], "The extra quarter day each year adds up to one whole day in four years, added as 29 February."],
  ["⚖️", "On about which dates are day and night nearly equal all over the world?", "21 March and 23 September", ["21 June and 22 December", "1 January and 1 July", "15 August and 26 January"], "These are the equinoxes, when the Sun is overhead at the equator."],
  ["🦘", "When it is summer in India, which season is it in Australia?", "Winter", ["Summer", "Spring", "Rainy season"], "India is in the northern half of the Earth and Australia in the southern half. When one half leans towards the Sun, the other leans away."],
  ["☀️", "If the Earth stopped spinning but kept going round the Sun, what would happen?", "Each place would have about six months of day and six months of night", ["There would be no day at all", "Day and night would be of 12 hours each", "The Earth would have no seasons and no night"], "With no spinning, a place would face the Sun for half the trip round the Sun and face away for the other half."],
];

const X4_AR = [
  ["🌑", "Leaves of a plant kept in the dark for two days do not turn blue-black with iodine.", "Light is needed for photosynthesis, which makes starch.", 0, "In the dark, no starch is made and the old starch gets used up. So R explains A."],
  ["🧊", "Ice floats on water.", "Ice is denser (heavier for its size) than water.", 2, "Ice floats because it is LESS dense than water. Water expands when it freezes."],
  ["🌙", "The Moon shines brightly at night.", "The Moon is a star.", 2, "The Moon shines by reflecting sunlight. It is a natural satellite, not a star."],
  ["🦇", "Bats are birds.", "Bats can fly.", 3, "Bats can fly, but they are mammals: they have fur and feed their babies milk."],
  ["🐋", "Whales breathe through lungs.", "Whales are mammals.", 0, "All mammals breathe air with lungs, so R explains A."],
  ["🕷️", "A spider is not an insect.", "A spider has eight legs and two body parts.", 0, "Insects have six legs and three body parts, so R explains why a spider is not an insect."],
  ["🔌", "Copper is used to make electric wires.", "Copper is a good conductor of electricity.", 0, "Wires must let current pass easily, which copper does."],
  ["🍳", "Handles of pressure cookers are made of plastic.", "Plastic is a good conductor of heat.", 2, "Plastic is a POOR conductor of heat; that is why it is used for handles."],
  ["🔥", "Venus is the hottest planet.", "Venus is the planet closest to the Sun.", 2, "Venus is the hottest because of its thick carbon dioxide atmosphere. Mercury is the closest planet."],
  ["🌍", "Day and night occur on the Earth.", "The Earth revolves around the Sun.", 1, "Both are true, but day and night are caused by the Earth's ROTATION, not its revolution."],
  ["🍂", "We have different seasons in a year.", "The Earth's axis is tilted as it revolves around the Sun.", 0, "The tilt makes each half of the Earth get more or less direct sunlight at different times of the year."],
  ["🌵", "The leaves of a cactus are changed into spines.", "Spines reduce the loss of water.", 0, "Spines have very little surface, so little water is lost. R explains A."],
  ["🩺", "Kidneys are excretory organs.", "Kidneys filter urea and extra salts out of the blood.", 0, "Excretion means removing wastes, which the kidneys do by making urine."],
  ["🔩", "Rusting of iron is a reversible change.", "Rust is a new substance with different properties.", 3, "Rusting forms a new substance, so it is an irreversible change."],
  ["☕", "Sugar dissolves faster in hot water.", "Sugar does not dissolve in cold water.", 2, "Sugar does dissolve in cold water, only more slowly."],
  ["🍄", "Mushrooms are decomposers.", "Mushrooms make their own food by photosynthesis.", 2, "Mushrooms have no chlorophyll. They get food by breaking down dead matter."],
  ["🐸", "A frog is an amphibian.", "Frogs lay eggs in water, and adult frogs can live on land as well as in water.", 0, "Amphibians spend part of their life in water and part on land, so R explains A."],
  ["🛏️", "A thick blanket keeps us warm in winter.", "A blanket produces heat of its own.", 2, "A blanket does not make heat. It traps air and stops our body heat from escaping."],
  ["🎨", "Iron gates and grills should be painted.", "Paint keeps air and moisture away from the iron.", 0, "Rusting needs air and moisture, so the paint layer prevents rust."],
  ["🧭", "A freely hanging magnet comes to rest in the north–south direction.", "The Earth behaves like a giant magnet.", 0, "The Earth's magnetism pulls the poles of the magnet towards north and south."],
  ["🐧", "Penguins cannot fly.", "Penguins are mammals.", 2, "Penguins are birds. Their wings are flippers used for swimming."],
  ["🌘", "A lunar eclipse happens on a full moon night.", "At full moon, the Earth is between the Sun and the Moon.", 0, "Only then can the Earth's shadow fall on the Moon."],
  ["🪐", "Planets twinkle like stars.", "Planets are much closer to the Earth than stars.", 3, "Planets usually do NOT twinkle, because they are close enough to look like tiny discs."],
  ["⭐", "The Pole Star seems to stay in one place in the sky.", "It lies almost directly above the Earth's North Pole, along its axis.", 0, "As the Earth spins, the point above its axis does not seem to move."],
  ["👁️", "Night blindness is a deficiency disease.", "It is caused by lack of vitamin C.", 2, "Night blindness is caused by lack of vitamin A. Lack of vitamin C causes scurvy."],
  ["🥛", "Milk is pasteurised before packing.", "Heating kills most harmful germs.", 0, "Pasteurisation heats milk to kill germs, so it stays safe longer."],
  ["🪱", "Earthworms are called the farmer's friends.", "They loosen the soil and their droppings make it fertile.", 0, "Loose soil lets air and water reach roots, and worm castings add nutrients."],
  ["🏛️", "We can hear an echo in a large, empty hall.", "Sound is reflected from hard surfaces.", 0, "An echo is reflected sound, and a large, empty hall has hard walls far enough away."],
  ["🪴", "Insect-eating plants like the pitcher plant are producers.", "They have chlorophyll and make food by photosynthesis.", 0, "Even though they trap insects for nitrogen, they make their own food, so they are producers."],
  ["🧂", "Salt can be separated from salt water by filtration.", "Salt dissolves completely in water.", 3, "Dissolved salt passes through filter paper. It is separated by evaporation."],
  ["🐟", "A fish dies if it is kept out of water for long.", "Its gills cannot take oxygen from air.", 0, "In air the gills collapse and dry, so the fish cannot get oxygen."],
  ["🥢", "A pencil kept in a glass of water looks bent.", "Light travels in a straight line.", 1, "Both are true, but the bending is due to refraction, the bending of light from water to air."],
  ["🌾", "Green plants are called producers.", "Green plants give out oxygen.", 1, "Both are true, but plants are producers because they MAKE FOOD by photosynthesis."],
  ["🧶", "Woollen clothes keep us warm.", "Wool traps air, which is a poor conductor of heat.", 0, "The trapped air stops body heat from escaping."],
  ["🐻", "Hibernating animals can go without food for weeks.", "They use the fat stored in their bodies slowly.", 0, "During hibernation the body slows down and lives on stored fat."],
  ["🌊", "We cannot drink sea water directly.", "Sea water has a lot of dissolved salts.", 0, "Salty water makes the body lose water, so it is not fit to drink."],
  ["🌫️", "Water drops form on the outside of a glass of iced water.", "The glass is leaking.", 2, "The drops come from water vapour in the air condensing on the cold glass."],
  ["⚖️", "An object weighs less on the Moon than on the Earth.", "The Moon's gravity is weaker than the Earth's.", 0, "Weight is the pull of gravity, and the Moon's pull is about one-sixth of Earth's."],
];

const X4_ODD = [
  ["🐋", "Whale", ["Shark", "Sea horse", "Catfish"], "fish that breathe with gills", "a mammal that breathes with lungs"],
  ["🐢", "Tortoise", ["Crab", "Snail", "Prawn"], "animals without a backbone", "an animal with a backbone"],
  ["🪳", "Cockroach", ["Butterfly", "Mosquito", "Housefly"], "insects with a pupa stage", "an insect without a pupa stage"],
  ["🫛", "Pea", ["Maize", "Wheat", "Rice"], "monocot seeds", "a dicot seed (two cotyledons)"],
  ["🍠", "Sweet potato", ["Potato", "Ginger", "Arbi (colocasia)"], "underground stems", "a root"],
  ["🍃", "Bryophyllum", ["Fern", "Moss", "Mushroom"], "things that reproduce by spores", "a plant that grows from leaf buds"],
  ["🧲", "Aluminium", ["Iron", "Nickel", "Cobalt"], "magnetic metals", "not attracted by a magnet"],
  ["✏️", "Graphite", ["Rubber", "Glass", "Plastic"], "insulators", "a conductor of electricity"],
  ["🔥", "Burning paper", ["Melting wax", "Freezing water", "Dissolving sugar"], "reversible changes", "an irreversible change"],
  ["🍋", "Scurvy", ["Rickets", "Night blindness", "Beriberi"], "diseases caused by lack of vitamins A, B1 and D", "caused by lack of vitamin C"],
  ["🧂", "Goitre", ["Scurvy", "Rickets", "Beriberi"], "vitamin deficiency diseases", "a mineral (iodine) deficiency disease"],
  ["🦠", "Malaria", ["Scurvy", "Goitre", "Anaemia"], "deficiency diseases", "an infection spread by mosquitoes"],
  ["🪐", "Uranus", ["Mercury", "Venus", "Mars"], "rocky planets", "a gas giant"],
  ["🌙", "Moon", ["Sun", "Sirius", "Pole Star"], "stars", "a natural satellite"],
  ["🔨", "Wheelbarrow", ["Scissors", "Seesaw", "Pliers"], "first-class levers (fulcrum in the middle)", "a second-class lever (load in the middle)"],
  ["🍽️", "Tongs", ["Nutcracker", "Bottle opener", "Wheelbarrow"], "second-class levers", "a third-class lever (effort in the middle)"],
  ["🫁", "Lungs", ["Stomach", "Liver", "Small intestine"], "organs of the digestive system", "an organ of the respiratory system"],
  ["❤️", "Heart", ["Kidneys", "Skin", "Lungs"], "organs that remove wastes from the body", "the pump of the circulatory system"],
  ["🦴", "Cartilage", ["Femur", "Skull", "Ribs"], "bones", "a softer, bendable tissue"],
  ["🌫️", "Condensation", ["Melting", "Evaporation", "Boiling"], "changes that need heat to be given", "a change that happens on cooling"],
  ["🌬️", "Wind energy", ["Coal", "Petroleum", "Natural gas"], "non-renewable fossil fuels", "a renewable source"],
  ["🍌", "Banana peel", ["Plastic bag", "Glass bottle", "Aluminium can"], "non-biodegradable wastes", "biodegradable waste"],
  ["🌦️", "Troposphere", ["Mantle", "Crust", "Core"], "layers inside the Earth", "a layer of the atmosphere"],
  ["🐍", "Python", ["Frog", "Toad", "Salamander"], "amphibians", "a reptile"],
  ["🦇", "Bat", ["Penguin", "Ostrich", "Kiwi"], "birds", "a mammal"],
  ["🫘", "Pulses", ["Rice", "Wheat", "Potato"], "foods rich in carbohydrates", "rich in protein"],
  ["🧪", "Iodine", ["Butter", "Ghee", "Groundnut oil"], "foods rich in fat", "a chemical used to test for starch"],
  ["🔊", "Vacuum", ["Air", "Water", "Steel"], "media through which sound travels", "a space where sound cannot travel"],
  ["🪷", "Lotus", ["Cactus", "Aloe vera", "Babool (acacia)"], "plants suited to dry places", "a water plant"],
  ["🌿", "Cuscuta", ["Mango", "Neem", "Grass"], "green plants that make their own food", "a parasite plant with no chlorophyll"],
];

// Grade 4 statement banks: [statement, true?, correct fact when false].
const B4_PLANT = [
  ["Plants give out oxygen during photosynthesis.", true],
  ["Plants take in carbon dioxide only at night.", false, "Plants take in carbon dioxide for photosynthesis in the daytime."],
  ["Xylem carries water from the roots to the leaves.", true],
  ["Phloem carries water from the roots to the leaves.", false, "Phloem carries food; xylem carries water."],
  ["Most stomata are on the lower surface of a leaf.", true],
  ["Seeds need sunlight to germinate.", false, "Seeds need water, air and warmth; light is not needed to germinate."],
  ["The radicle grows into the root.", true],
  ["The ovary of a flower becomes the fruit.", true],
  ["Ferns reproduce by seeds.", false, "Ferns reproduce by spores."],
  ["Cuscuta is a parasite plant.", true],
  ["Mushrooms make food by photosynthesis.", false, "Mushrooms have no chlorophyll; they feed on dead matter."],
  ["Maize is a monocot.", true],
  ["Food is stored in leaves mainly as starch.", true],
  ["Transpiration helps pull water up the stem.", true],
  ["The pitcher plant traps insects because it cannot make food.", false, "It makes food, but traps insects to get nitrogen."],
];
const B4_ANIMAL = [
  ["A bat is a mammal.", true],
  ["A penguin is a mammal.", false, "A penguin is a bird."],
  ["Whales breathe with lungs.", true],
  ["A spider has six legs.", false, "A spider has eight legs."],
  ["A cockroach has no pupa stage.", true],
  ["A butterfly's pupa eats a lot of leaves.", false, "The larva (caterpillar) eats; the pupa does not feed."],
  ["A sea horse is a fish.", true],
  ["A starfish is a fish.", false, "A starfish has no backbone; it is not a fish."],
  ["Frogs aestivate in hot, dry summers.", true],
  ["Snakes are warm-blooded.", false, "Snakes are cold-blooded reptiles."],
  ["Earthworms breathe through their moist skin.", true],
  ["Bats and dolphins use echolocation.", true],
  ["A crab has a backbone.", false, "A crab has no backbone; it has a hard outer shell."],
  ["Birds have hollow bones.", true],
  ["Only about 10% of energy passes to the next level of a food chain.", true],
];
const B4_BODY = [
  ["Arteries carry blood away from the heart.", true],
  ["Veins carry blood away from the heart.", false, "Veins carry blood back to the heart."],
  ["Red blood cells carry oxygen.", true],
  ["Platelets fight germs.", false, "White blood cells fight germs; platelets help blood clot."],
  ["The cerebellum controls balance.", true],
  ["Reflex actions are controlled by the spinal cord.", true],
  ["The knee has a ball and socket joint.", false, "The knee has a hinge joint."],
  ["The skull bones are joined by fixed joints.", true],
  ["Digestion of starch starts in the stomach.", false, "Digestion of starch starts in the mouth."],
  ["Digestion is completed in the small intestine.", true],
  ["The liver makes bile.", true],
  ["Kidneys make urine.", true],
  ["The smallest bone of the body is in the ear.", true],
  ["When we breathe in, the diaphragm moves up.", false, "When we breathe in, the diaphragm moves down."],
];
const B4_FOOD = [
  ["Lack of vitamin A causes night blindness.", true],
  ["Lack of vitamin C causes rickets.", false, "Lack of vitamin C causes scurvy; lack of vitamin D causes rickets."],
  ["Lack of iodine causes goitre.", true],
  ["Lack of iron causes anaemia.", true],
  ["Lack of vitamin B1 causes beriberi.", true],
  ["Kwashiorkor is caused by lack of fat.", false, "Kwashiorkor is caused by lack of protein."],
  ["Iodine solution turns blue-black with starch.", true],
  ["Iodine solution turns blue-black with fat.", false, "Fat is tested by the oily patch it leaves on paper."],
  ["Fats give more energy per gram than carbohydrates.", true],
  ["Roughage gives us a lot of energy.", false, "Roughage gives no energy; it helps food move through the intestines."],
  ["Our skin makes vitamin D in sunlight.", true],
  ["Pickles are preserved with salt and oil.", true],
  ["Refrigeration kills all germs in food.", false, "Cold only slows down the growth of germs."],
];
const B4_MATTER = [
  ["Burning of paper is an irreversible change.", true],
  ["Melting of wax is an irreversible change.", false, "Melting of wax is reversible; the wax can set again."],
  ["Rusting needs both air and moisture.", true],
  ["Camphor sublimes.", true],
  ["Sand dissolves in water.", false, "Sand is insoluble in water."],
  ["Salt can be got back from salt water by evaporation.", true],
  ["Filtration can separate salt from salt water.", false, "Dissolved salt passes through a filter; evaporation is needed."],
  ["Gases can be compressed easily.", true],
  ["Metals expand on heating.", true],
  ["Aluminium is attracted by a magnet.", false, "Aluminium is not magnetic."],
  ["Graphite conducts electricity.", true],
  ["Butter paper is transparent.", false, "Butter paper is translucent."],
  ["More sugar dissolves in hot water than in cold water.", true],
  ["Galvanised iron has a coating of zinc.", true],
];
const B4_FORCE = [
  ["Friction always acts against motion.", true],
  ["Ball bearings increase friction.", false, "Ball bearings reduce friction by rolling."],
  ["Mass of an object is the same on the Moon and the Earth.", true],
  ["Weight of an object is the same on the Moon and the Earth.", false, "Weight on the Moon is about one-sixth of that on Earth."],
  ["Sound cannot travel through a vacuum.", true],
  ["Sound travels faster in air than in steel.", false, "Sound travels faster in solids like steel."],
  ["Light travels in straight lines.", true],
  ["A pinhole camera gives an upright image.", false, "A pinhole camera gives an inverted (upside-down) image."],
  ["A plane mirror image is laterally inverted.", true],
  ["Angle of incidence equals angle of reflection.", true],
  ["A pair of scissors is a first-class lever.", true],
  ["A pair of tongs is a second-class lever.", false, "Tongs are a third-class lever (effort in the middle)."],
  ["A screw is a modified inclined plane.", true],
  ["Rubber is a good conductor of electricity.", false, "Rubber is an insulator."],
  ["An electric fan changes electrical energy into motion.", true],
  ["A fuse wire melts when too much current flows.", true],
];
const B4_SPACE = [
  ["Day and night are caused by the Earth's rotation.", true],
  ["Seasons are caused by the Earth's rotation.", false, "Seasons are caused by revolution with a tilted axis."],
  ["A solar eclipse happens on a new moon day.", true],
  ["A lunar eclipse happens on a new moon day.", false, "A lunar eclipse happens on a full moon night."],
  ["Venus is the hottest planet.", true],
  ["Mercury is the hottest planet.", false, "Venus is the hottest planet."],
  ["Jupiter is the largest planet.", true],
  ["The Sun is a star.", true],
  ["Sunlight takes about 8 minutes to reach the Earth.", true],
  ["The outer core of the Earth is liquid.", true],
  ["The crust is the thickest layer of the Earth.", false, "The mantle is the thickest layer; the crust is the thinnest."],
  ["Most of the air is oxygen.", false, "Most of the air (about 78%) is nitrogen."],
  ["The ozone layer is in the stratosphere.", true],
  ["Weather happens in the troposphere.", true],
  ["The asteroid belt lies between Mars and Jupiter.", true],
  ["Stars twinkle; planets usually do not.", true],
];
const B4_ENV = [
  ["Carbon dioxide is a greenhouse gas.", true],
  ["CFCs protect the ozone layer.", false, "CFCs damage the ozone layer."],
  ["Bacteria and fungi are decomposers.", true],
  ["Vultures are decomposers.", false, "Vultures are scavengers."],
  ["Plastic is non-biodegradable.", true],
  ["Coal is a renewable source of energy.", false, "Coal is a non-renewable fossil fuel."],
  ["Solar energy is renewable.", true],
  ["Deforestation can cause soil erosion.", true],
  ["Acid rain is caused by oxygen and nitrogen in the air.", false, "Acid rain is caused by sulphur dioxide and nitrogen oxides."],
  ["Sunlight is an abiotic factor of an ecosystem.", true],
  ["A zoo protects animals in their natural habitat.", false, "A zoo keeps animals outside their natural home; national parks protect them in it."],
  ["The Red Data Book lists endangered species.", true],
];

// Grade 4 matching tables.
const M4 = [
  ["nutrient lacking (P–S) with the disease (1–4)", "🥗", [["Vitamin A", "night blindness"], ["Vitamin B1", "beriberi"], ["Vitamin C", "scurvy"], ["Vitamin D", "rickets"], ["Iodine", "goitre"], ["Iron", "anaemia"], ["Protein", "kwashiorkor"]]],
  ["the joint (P–S) with where it is found (1–4)", "🦴", [["Ball and socket joint", "shoulder"], ["Hinge joint", "elbow"], ["Pivot joint", "neck (turning the head)"], ["Fixed joint", "bones of the skull"], ["Gliding joint", "small bones of the wrist"]]],
  ["the part of blood (P–S) with its job (1–4)", "🩸", [["Red blood cells", "carry oxygen"], ["White blood cells", "fight germs"], ["Platelets", "help blood clot"], ["Plasma", "carries digested food and wastes"]]],
  ["the organ (P–S) with its body system (1–4)", "🫀", [["Heart", "circulatory system"], ["Lungs", "respiratory system"], ["Kidneys", "excretory system"], ["Brain", "nervous system"], ["Stomach", "digestive system"], ["Femur", "skeletal system"]]],
  ["the device (P–S) with its energy change (1–4)", "⚡", [["Solar cell", "light → electrical"], ["Electric fan", "electrical → motion"], ["Microphone", "sound → electrical"], ["Loudspeaker", "electrical → sound"], ["Electric iron", "electrical → heat"], ["Battery (cell)", "chemical → electrical"]]],
  ["the mixture (P–S) with the way to separate it (1–4)", "🧪", [["Iron filings and sand", "magnet"], ["Husk and grain", "winnowing"], ["Salt from sea water", "evaporation"], ["Butter from curd", "churning"], ["Chalk powder and water", "filtration"], ["Small stones in rice", "handpicking"], ["Bran from flour", "sieving"]]],
  ["the planet (P–S) with its feature (1–4)", "🪐", [["Mercury", "closest to the Sun"], ["Venus", "hottest planet"], ["Mars", "largest volcano, Olympus Mons"], ["Jupiter", "largest planet"], ["Saturn", "less dense than water"], ["Uranus", "spins lying on its side"], ["Neptune", "farthest from the Sun"]]],
  ["the layer of the atmosphere (P–S) with its feature (1–4)", "🌍", [["Troposphere", "weather and clouds"], ["Stratosphere", "ozone layer"], ["Mesosphere", "meteors burn up"], ["Thermosphere", "auroras (polar lights)"], ["Exosphere", "outermost layer, merging into space"]]],
  ["the plant (P–S) with the part that grows new plants (1–4)", "🌱", [["Potato", "stem (eyes)"], ["Bryophyllum", "leaf buds"], ["Sweet potato", "root"], ["Ginger", "underground stem (rhizome)"], ["Fern", "spores"]]],
  ["the instrument (P–S) with what it measures (1–4)", "🌡️", [["Anemometer", "wind speed"], ["Barometer", "air pressure"], ["Rain gauge", "rainfall"], ["Hygrometer", "humidity"], ["Seismograph", "earthquakes"], ["Clinical thermometer", "body temperature"]]],
  ["the animal (P–S) with the feature that suits its home (1–4)", "🐾", [["Camel", "wide, padded feet for sand"], ["Polar bear", "thick layer of fat"], ["Fish", "gills and fins"], ["Duck", "webbed feet"], ["Eagle", "hooked beak and talons"], ["Frog", "moist skin for breathing in water"]]],
  ["the teeth (P–S) with their main job (1–4)", "🦷", [["Incisors", "cutting and biting"], ["Canines", "tearing"], ["Premolars", "crushing"], ["Molars", "grinding"]]],
];
const M1 = [
  ["the animal (P–S) with its body covering (1–4)", "🐾", [["Porcupine", "sharp spines"], ["Tortoise", "hard shell"], ["Snake", "dry scales"], ["Frog", "smooth, moist skin"], ["Hen", "feathers"], ["Bear", "fur"]]],
  ["the plant (P–S) with the part we eat (1–4)", "🥗", [["Radish", "root"], ["Potato", "stem"], ["Spinach", "leaves"], ["Cauliflower", "flowers"], ["Peas", "seeds"], ["Mango", "fruit"]]],
  ["the instrument (P–S) with its use (1–4)", "🧰", [["Thermometer", "measures temperature"], ["Rain gauge", "measures rainfall"], ["Wind vane", "shows wind direction"], ["Stethoscope", "listens to the heartbeat"], ["Magnifying glass", "makes things look bigger"], ["Compass", "shows north"]]],
  ["the animal (P–S) with its special body part (1–4)", "🦆", [["Woodpecker", "chisel-like beak to drill bark"], ["Duck", "webbed feet to swim"], ["Elephant", "trunk to pick up food"], ["Giraffe", "long neck to reach leaves"], ["Eagle", "sharp claws to grip prey"], ["Camel", "hump to store fat"]]],
];

// ---------- reasoning templates ----------
// Hidden order with mixed "more"/"less" clues.
const XREL = [["taller", "shorter", "tallest", "shortest"], ["heavier", "lighter", "heaviest", "lightest"], ["older", "younger", "oldest", "youngest"], ["faster", "slower", "fastest", "slowest"]];
function xOrder(Q, n, size) {
  for (let j = 0; j < n; j++) {
    const kids = pickN(XKIDS, size), [more, less, most, least] = pick(XREL);   // kids[0] is the most
    const clues = mix(kids.slice(0, -1).map((p, i) => R() < .5 ? `${p} is ${more} than ${kids[i + 1]}.` : `${kids[i + 1]} is ${less} than ${p}.`));
    const ask = pick([1, size - 2, 1, size - 2, 0, size - 1]);
    const word = ask === 0 ? `the ${most}` : ask === size - 1 ? `the ${least}` : ask === 1 ? `the second ${most}` : ask === size - 2 ? `the second ${least}` : `in the middle`;
    const others = kids.filter((_, i) => i !== ask);
    Q("top", `${clues.join(" ")}\nWho is ${word}?`, [kids[ask], ...pickN(others, 3)],
      `Turn every clue into "${more} than": ${kids.slice(0, -1).map((p, i) => `${p} > ${kids[i + 1]}`).join(", ")}. So from ${most} to ${least}: ${kids.join(", ")}. ${kids[ask]} is ${word}.`,
      F(...kids.map((p, i) => ["", p, i === 0 ? most : i === size - 1 ? least : `${i + 1}${["st", "nd", "rd"][i] || "th"}`, i === ask])));
  }
}
// Grade 1 patterns: the Nth item, a missing middle item, and growing numbers.
const XPSETS = [["🍎", "🍌", "🍇", "🍓"], ["🐶", "🐱", "🐰", "🐸"], ["🌞", "🌙", "⭐", "☁️"], ["🌸", "🍃", "🌳", "🌵"], ["🔺", "🟦", "🟡", "⬛"], ["🐟", "🦀", "🐙", "🐚"]];
const XPRULES = ["ABC", "ABCD", "AABC", "ABBC", "ABCB", "AABB", "ABCC"];
const ORD = k => k + (k % 10 === 1 && k !== 11 ? "st" : k % 10 === 2 && k !== 12 ? "nd" : k % 10 === 3 && k !== 13 ? "rd" : "th");
function xPattern(Q, n) {
  for (let j = 0; j < n; j++) {
    const set = mix(pick(XPSETS)), rule = pick(XPRULES), L = rule.length, at = i => set["ABCD".indexOf(rule[i % L])];
    const shown = Array.from({ length: L * 2 }, (_, i) => at(i));
    if (j % 3 === 0) {
      const N = ri(L * 3 + 1, 20), ans = at(N - 1), r = (N - 1) % L + 1;
      Q("top", `The pattern keeps repeating:\n${shown.join(" ")} ...\nWhat will be the ${ORD(N)} picture?`, [ans, ...set.filter(x => x !== ans)],
        `The pattern repeats every ${L} pictures: ${shown.slice(0, L).join(" ")}. ${N} = ${L} × ${Math.floor((N - 1) / L)} + ${r}, so the ${ORD(N)} picture is the same as picture number ${r}: ${ans}.`, { t: "seq", items: shown.slice(0, L).concat([ans]), hl: L });
    } else if (j % 3 === 1) {
      const pos = ri(L, L * 2 - 1), ans = shown[pos], show = shown.slice(); show[pos] = "__";
      Q("top", `Which picture is missing in the pattern?\n${show.join(" ")}`, [ans, ...set.filter(x => x !== ans)],
        `The group ${shown.slice(0, L).join(" ")} repeats. The blank is at the same place in the second group as ${ans} in the first group.`, { t: "seq", items: shown, hl: pos });
    } else {
      const a = ri(1, 4), d = ri(1, 3), terms = [a]; for (let k = 0; k < 6; k++) terms.push(terms[k] + d + k);
      const ans = terms[6];
      Q("top", `A creeper had ${terms[0]} leaves on day 1, ${terms[1]} on day 2, ${terms[2]} on day 3 and ${terms[3]} on day 4. If it keeps growing in the same way, how many leaves will it have on day 7?`, nums(ans, [terms[4], terms[5], ans + 1]),
        `The jumps grow by one each day: +${d}, +${d + 1}, +${d + 2}, then +${d + 3}, +${d + 4}, +${d + 5}. Day 5: ${terms[4]}, day 6: ${terms[5]}, day 7: ${ans}.`, { t: "seq", items: terms.map(String), hl: 6 });
    }
  }
}
// Leg puzzles: one animal's count is known, find the other.
const XLEGS = [["hen", "hens", 2, "🐔"], ["duck", "ducks", 2, "🦆"], ["cow", "cows", 4, "🐄"], ["dog", "dogs", 4, "🐕"], ["goat", "goats", 4, "🐐"], ["ant", "ants", 6, "🐜"], ["beetle", "beetles", 6, "🪲"], ["spider", "spiders", 8, "🕷️"]];
function xLegs(Q, n) {
  for (let j = 0; j < n; j++) {
    const [a, b] = pickN(XLEGS, 2); if (a[2] === b[2]) continue;
    const na = ri(1, 3), nb = ri(2, 5), tot = na * a[2] + nb * b[2];
    Q("top", `In a garden there ${na > 1 ? "are" : "is"} ${na} ${na > 1 ? a[1] : a[0]} and some ${b[1]}. Together they have ${tot} legs. How many ${b[1]} are there?`, nums(nb, [nb + 1, Math.floor(tot / b[2]), na]),
      `${na} ${na > 1 ? a[1] + " have" : a[0] + " has"} ${na} × ${a[2]} = ${na * a[2]} legs. The ${b[1]} have ${tot} − ${na * a[2]} = ${nb * b[2]} legs. Each ${b[0]} has ${b[2]} legs, so ${nb * b[2]} ÷ ${b[2]} = ${nb} ${b[1]}.`,
      C([a[3], `${na} × ${a[2]}`, `${na * a[2]} legs`], [b[3], `${nb} × ${b[2]}`, `${nb * b[2]} legs`, 1], ["", "Total", `${tot} legs`]));
  }
}
// Positions in a row.
const XROW = [["🐶", "Dog"], ["🐱", "Cat"], ["🐰", "Rabbit"], ["🐸", "Frog"], ["🐵", "Monkey"], ["🐼", "Panda"], ["🦊", "Fox"], ["🐯", "Tiger"], ["🐷", "Pig"], ["🐮", "Cow"]];
function xRow(Q, n) {
  for (let j = 0; j < n; j++) {
    const row = pickN(XROW, 6), nm = i => row[i][1], intro = `Six animals stand in a row, from left to right:\n${row.map(r => r.join(" ")).join(", ")}\n`;
    const t = j % 4; let q, ans, e;
    if (t === 0) { const i = ri(0, 3), k = 2; ans = i + k; q = `Which animal is ${ORD(k)} to the right of the ${nm(i)}?`; e = `Start at the ${nm(i)} and count ${k} places to the right: ${row.slice(i + 1, i + k + 1).map(r => r[1]).join(", ")}. So it is the ${nm(ans)}.`; }
    else if (t === 1) { const k = ri(2, 5); ans = 6 - k; q = `Which animal is ${ORD(k)} from the right end?`; e = `Counting from the right end: ${row.slice().reverse().slice(0, k).map(r => r[1]).join(", ")}. The ${ORD(k)} is the ${nm(ans)}.`; }
    else if (t === 2) { const a = ri(2, 5); ans = a - 2; q = `Which animal is 2nd to the left of the animal that is ${ORD(a + 1)} from the left?`; e = `The ${ORD(a + 1)} from the left is the ${nm(a)}. Two places to its left is the ${nm(ans)}.`; }
    else { const a = ri(0, 3); ans = a + 1; q = `Which animal is exactly in the middle of the ${nm(a)} and the ${nm(a + 2)}?`; e = `The ${nm(a)} and the ${nm(a + 2)} have one animal between them: the ${nm(ans)}.`; }
    Q("top", intro + q, [nm(ans), ...pickN(row.map(r => r[1]).filter(x => x !== nm(ans)), 3)], e, C(...row.map((r, i) => [r[0], r[1], `${i + 1} from left`, i === ans])));
  }
}
// Measuring with chains of units, and balances.
const XMEAS = [
  ["glass", "glasses", "jug", "jugs", "bucket", "buckets", "🥛", "of water fill"],
  ["eraser", "erasers", "pencil", "pencils", "ribbon", "ribbons", "📏", "long is"],
  ["🍋 lemon", "🍋 lemons", "🍎 apple", "🍎 apples", "🍍 pineapple", "🍍 pineapples", "⚖️", "balance"],
  ["🥚 egg", "🥚 eggs", "🥭 mango", "🥭 mangoes", "🍉 watermelon", "🍉 watermelons", "⚖️", "balance"],
];
function xMeasure(Q, n) {
  for (let j = 0; j < n; j++) {
    const [s, sp, m, mp, b, bp, em, verb] = pick(XMEAS), a = ri(2, 5), c = ri(2, 4), k = ri(1, 3), ans = a * c * k;
    let q;
    if (verb === "of water fill") q = `1 jug fills ${a} glasses. 1 bucket fills ${c} jugs. How many glasses of water fill ${k === 1 ? "1 bucket" : k + " buckets"}?`;
    else if (verb === "long is") q = `A pencil is as long as ${a} erasers. A ribbon is as long as ${c} pencils. How many erasers long ${k === 1 ? "is 1 ribbon" : `are ${k} ribbons put end to end`}?`;
    else q = `On a balance, 1 ${m} weighs the same as ${a} ${sp}, and 1 ${b} weighs the same as ${c} ${mp}. How many ${sp} will balance ${k === 1 ? "1 " + b : k + " " + bp}?`;
    Q("top", q, nums(ans, [a * c, a + c + k, ans + a]), `1 ${b.replace(/^\S+ /, "")} = ${c} ${mp.replace(/^\S+ /, "")} = ${c} × ${a} = ${a * c} ${sp.replace(/^\S+ /, "")}.${k > 1 ? ` For ${k}: ${k} × ${a * c} = ${ans}.` : ""}`,
      F(["", `1 ${b.replace(/^\S+ /, "")}`, `${c} ${mp.replace(/^\S+ /, "")}`], ["", `${c} × ${a}`, `${a * c} ${sp.replace(/^\S+ /, "")}`], [em, `× ${k}`, String(ans), 1]));
  }
}
// Sun, shadows and facing directions.
const XDIRS = ["north", "east", "south", "west"];
const SIDE_OPTS = ["In front of her", "Behind her", "To her left", "To her right"];
function xShadow(Q) {
  [["morning", 1], ["evening", 3]].forEach(([time, sun]) => XDIRS.forEach((f, fi) => {
    const sh = (sun + 2) % 4, rel = (sh - fi + 4) % 4, ans = ["In front of her", "To her right", "Behind her", "To her left"][rel];
    Q("top", `On a sunny ${time}, Meera stands facing ${f}. Where will her shadow fall?`, [ans, ...SIDE_OPTS.filter(x => x !== ans)],
      `In the ${time} the Sun is in the ${XDIRS[sun]}, so shadows fall towards the ${XDIRS[sh]}. Facing ${f}, the ${XDIRS[sh]} side is ${ans.toLowerCase()}.`,
      C(["☀️", "Sun", XDIRS[sun]], ["👧", "Meera faces", f], ["🌑", "Shadow", XDIRS[sh], 1]), { order: SIDE_OPTS });
  }));
  const TURNS = [["left", "left", "left"], ["right", "left", "left"], ["left", "right", "right"], ["right", "right", "right"]];
  [["rising", 1], ["setting", 3]].forEach(([st, start]) => TURNS.forEach(ts => {
    let d = start; ts.forEach(t => d = (d + (t === "right" ? 1 : 3)) % 4);
    const say = ts.map((t, i) => (i ? "then " : "") + `turns ${t}`).join(", ");
    Q("top", `Kabir stands facing the ${st} Sun. He ${say}. Which direction is he facing now?`, [cap1(XDIRS[d]), ...XDIRS.filter((_, i) => i !== d).map(cap1)],
      `The ${st} Sun is in the ${XDIRS[start]}. Each right turn moves one step clockwise (N → E → S → W) and each left turn one step back. He ends up facing ${XDIRS[d]}.`,
      F(["☀️", `Starts facing ${XDIRS[start]}`, ""], ...ts.map(t => ["", `turn ${t}`, ""]), ["🧭", cap1(XDIRS[d]), "now", 1]));
  }));
}

// ---------- grade 4 reasoning templates ----------
const CWORDS = ["PLANT", "SEED", "ROOT", "LEAF", "STEM", "MOON", "STAR", "SOIL", "RAIN", "LUNG", "BONE", "HEART", "CELL", "WIND", "IRON", "SALT", "MILK", "CLOUD"];
const shiftW = (w, k) => w.split("").map(c => String.fromCharCode((c.charCodeAt(0) - 65 + k + 26) % 26 + 65)).join("");
const oppW = w => w.split("").map(c => String.fromCharCode(155 - c.charCodeAt(0))).join("");
const revW = w => w.split("").reverse().join("");
function xCoding(Q, n) {
  for (let j = 0; j < n; j++) {
    const [w1, w2] = pickN(CWORDS, 2), t = j % 4;
    let enc, name, wrong;
    if (t === 0) { const k = pick([1, 2, -1, 3]); enc = w => shiftW(w, k); name = `each letter is moved ${Math.abs(k)} place${Math.abs(k) > 1 ? "s" : ""} ${k > 0 ? "forward" : "back"} in the alphabet`; wrong = [shiftW(w2, k + 1), shiftW(w2, -k), revW(shiftW(w2, k))]; }
    else if (t === 1) { enc = oppW; name = "each letter is replaced by its opposite letter (A↔Z, B↔Y, C↔X, ...)"; wrong = [shiftW(w2, 1), revW(oppW(w2)), shiftW(oppW(w2), 1)]; }
    else if (t === 2) { const k = pick([1, 2]); enc = w => revW(shiftW(w, k)); name = `the letters are written in reverse order and each is moved ${k} place${k > 1 ? "s" : ""} forward`; wrong = [shiftW(w2, k), revW(w2), revW(shiftW(w2, k + 1))]; }
    else { enc = w => w.split("").map(c => c.charCodeAt(0) - 64).join("-"); name = "each letter is written as its position in the alphabet (A = 1, B = 2, ...)"; wrong = [w2.split("").map(c => c.charCodeAt(0) - 63).join("-"), w2.split("").map(c => 91 - c.charCodeAt(0)).join("-"), revW(w2).split("").map(c => c.charCodeAt(0) - 64).join("-")]; }
    Q("top", `In a certain code, ${w1} is written as ${enc(w1)}. How is ${w2} written in that code?`, [enc(w2), ...wrong],
      `In this code ${name}. ${w1} → ${enc(w1)}, so ${w2} → ${enc(w2)}.`, F(["", w1, enc(w1)], ["🔐", w2, enc(w2), 1]));
  }
}
function xSeries(Q, n) {
  for (let j = 0; j < n; j++) {
    const t = j % 4;
    if (t === 0) {
      const k = ri(2, 5), s = ri(0, 25 - 5 * k), L = i => String.fromCharCode(65 + s + i * k), ans = L(5);
      Q("top", `What comes next in the series?\n${[0, 1, 2, 3, 4].map(L).join(", ")}, ?`, [ans, String.fromCharCode(65 + s + 5 * k - 1), String.fromCharCode(65 + s + 5 * k + 1 > 90 ? 65 + s + 5 * k - 2 : 65 + s + 5 * k + 1), L(4)],
        `Each letter moves ${k} places forward: +${k} each time. After ${L(4)} comes ${ans}.`, { t: "seq", items: [0, 1, 2, 3, 4, 5].map(L), hl: 5 });
    } else if (t === 1) {
      const a = ri(2, 9), d = ri(1, 4), terms = [a]; for (let k = 0; k < 5; k++) terms.push(terms[k] + d + 2 * k);
      Q("top", `What comes next in the series?\n${terms.slice(0, 5).join(", ")}, ?`, nums(terms[5], [terms[4] + d + 6, terms[4] + d + 7, terms[4] + 2 * d]),
        `The differences go up by 2: +${d}, +${d + 2}, +${d + 4}, +${d + 6}, so next is +${d + 8}: ${terms[4]} + ${d + 8} = ${terms[5]}.`, { t: "seq", items: terms.map(String), hl: 5 });
    } else if (t === 2) {
      const a = ri(1, 4), c = pick([1, -1, 2]), terms = [a]; for (let k = 0; k < 5; k++) terms.push(terms[k] * 2 + c);
      if (terms.some(x => x <= 0) || terms[1] === terms[0]) continue;
      Q("top", `What comes next in the series?\n${terms.slice(0, 5).join(", ")}, ?`, nums(terms[5], [terms[4] * 2, terms[4] + (terms[4] - terms[3]), terms[5] + 1]),
        `Each number is doubled and then ${c > 0 ? c + " is added" : -c + " is taken away"}: ${terms[4]} × 2 ${c > 0 ? "+" : "−"} ${Math.abs(c)} = ${terms[5]}.`, { t: "seq", items: terms.map(String), hl: 5 });
    } else {
      const a = ri(1, 6), d = ri(2, 4), b = ri(5, 15), e = pick([5, 10]), terms = [a, b, a + d, b + e, a + 2 * d, b + 2 * e, a + 3 * d];
      Q("top", `What comes next in the series?\n${terms.slice(0, 6).join(", ")}, ?`, nums(terms[6], [b + 3 * e, terms[5] + d, terms[6] + 1]),
        `Two series are mixed. Odd places: ${a}, ${a + d}, ${a + 2 * d} (+${d} each). Even places: ${b}, ${b + e}, ${b + 2 * e} (+${e} each). The 7th term is in the odd series: ${a + 2 * d} + ${d} = ${terms[6]}.`, { t: "seq", items: terms.map(String), hl: 6 });
    }
  }
}
function xRank(Q, n) {
  for (let j = 0; j < n; j++) {
    const [p, q2] = pickN(XKIDS, 2), t = j % 3;
    if (t === 0) {
      const L = ri(5, 20), Rt = ri(5, 20), N = L + Rt - 1;
      Q("top", `In a row of children, ${p} is ${ORD(L)} from the left end and ${ORD(Rt)} from the right end. How many children are in the row?`, nums(N, [L + Rt, L + Rt - 2, L + Rt + 1]),
        `${p} is counted twice (once from each end). Total = ${L} + ${Rt} − 1 = ${N}.`, F(["", `${L - 1} children`, "left of " + p], ["🧒", p, "counted once", 1], ["", `${Rt - 1} children`, "right of " + p]));
    } else if (t === 1) {
      const N = ri(20, 45), L = ri(4, N - 4), ans = N - L + 1;
      Q("top", `There are ${N} children in a row. ${p} is ${ORD(L)} from the left end. What is ${p}'s position from the right end?`, nums(ans, [N - L, N - L + 2, L]).map(x => isNaN(x) ? x : ORD(+x)),
        `Position from right = total − position from left + 1 = ${N} − ${L} + 1 = ${ans}.`, F(["", `${L - 1} before`, ""], ["🧒", p, `${ORD(ans)} from right`, 1], ["", `${ans - 1} after`, ""]));
    } else {
      const a = ri(4, 10), c = a + ri(3, 9), b = ri(5, 15), N = c + b - 1;
      Q("top", `In a row, ${p} is ${ORD(a)} from the left and ${q2} is ${ORD(b)} from the right. When they swap places, ${p} becomes ${ORD(c)} from the left. How many children are in the row?`, nums(N, [N + 1, N - 1, a + b - 1]),
        `After swapping, ${p} stands where ${q2} stood. So that place is ${ORD(c)} from the left and ${ORD(b)} from the right. Total = ${c} + ${b} − 1 = ${N}.`, C(["🔁", `${q2}'s old place`, `${ORD(c)} from left, ${ORD(b)} from right`], ["", "Total", `${c} + ${b} − 1 = ${N}`, 1]));
    }
  }
}
const D8 = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
const VEC = [[0, 1], [1, 0], [0, -1], [-1, 0]];
function xDirection(Q, n) {
  for (let j = 0; j < n; j++) {
    const who = pick(XKIDS), legs = ri(3, 4); let d = ri(0, 3), x = 0, y = 0; const steps = [];
    for (let k = 0; k < legs; k++) {
      let turn = "";
      if (k) { turn = pick(["right", "left"]); d = (d + (turn === "right" ? 1 : 3)) % 4; }
      const m = ri(2, 9); x += VEC[d][0] * m; y += VEC[d][1] * m;
      steps.push(k ? `turns ${turn} and walks ${m} m` : `walks ${m} m towards the ${XDIRS[d]}`);
    }
    const story = `${who} ${steps[0]}, then ${steps.slice(1).join(", then ")}.`;
    const t = j % 3;
    if (t === 0) {
      if (!x && !y) continue;
      const ang = Math.round((Math.atan2(x, y) * 180 / Math.PI + 360) % 360), ans = x && y ? D8[[1, 3, 5, 7][(x > 0 ? (y > 0 ? 0 : 1) : (y > 0 ? 3 : 2))]] : D8[Math.round(ang / 45) % 8];
      const ai = D8.indexOf(ans), wr = [D8[(ai + 4) % 8], D8[(ai + 2) % 8], D8[(ai + 6) % 8]];
      Q("top", `${story}\nIn which direction is ${who} now from the starting point?`, [ans, ...wr],
        `Add up the moves: ${Math.abs(x)} m ${x >= 0 ? "east" : "west"} and ${Math.abs(y)} m ${y >= 0 ? "north" : "south"} overall. So ${who} is to the ${ans.toLowerCase()} of the start.`,
        C(["🏁", "Start", "0, 0"], ["🧭", "East–west", `${Math.abs(x)} m ${x >= 0 ? "east" : "west"}`], ["", "North–south", `${Math.abs(y)} m ${y >= 0 ? "north" : "south"}`], ["📍", ans, "from start", 1]));
    } else if (t === 1) {
      Q("top", `${story}\nWhich direction is ${who} facing at the end?`, [cap1(XDIRS[d]), ...XDIRS.filter((_, i) => i !== d).map(cap1)],
        `Follow each turn: right turns go clockwise (N → E → S → W), left turns go the other way. The last walk is towards the ${XDIRS[d]}.`, C(["🧭", cap1(XDIRS[d]), "facing now", 1]));
    } else {
      if (x && y) continue;
      const dist = Math.abs(x) + Math.abs(y), walked = steps.reduce((s, st) => s + +st.match(/(\d+) m/)[1], 0);
      if (!dist) continue;
      Q("top", `${story}\nHow far is ${who} from the starting point now?`, nums(dist, [walked, dist + 2, Math.abs(dist - 2)]).map(v => v + " m"),
        `The moves in opposite directions cancel. Overall ${who} is ${Math.abs(x)} m ${x >= 0 ? "east" : "west"} and ${Math.abs(y)} m ${y >= 0 ? "north" : "south"} of the start, so the distance is ${dist} m (not the ${walked} m walked).`, C(["📍", `${dist} m`, "from start", 1], ["🚶", `${walked} m`, "walked in all"]));
    }
  }
}
const hm = t => { t = ((t % 720) + 720) % 720; const h = Math.floor(t / 60) || 12, m = t % 60; return `${h}:${String(m).padStart(2, "0")}`; };
function xClock(Q, n) {
  for (let j = 0; j < n; j++) {
    const s = ri(1, 11) * 60 + pick([0, 10, 15, 20, 25, 35, 40, 45, 50]), act = 720 - s;
    const opts = [hm(act), hm(s), hm(780 - s), hm(Math.floor(s / 60) * 60 + (60 - s % 60) % 60)];
    if (new Set(opts).size < 4) continue;
    Q("top", `A wall clock is seen in a mirror. The mirror image shows the time ${hm(s)}. What is the actual time?`, opts,
      `For a clock seen in a mirror, actual time = 11:60 − mirror time (or 12:00 − mirror time when it is on the hour). 11:60 − ${hm(s)} = ${hm(act)}. Check: ${hm(s)} + ${hm(act)} add up to 12 hours.`, C(["🪞", "Mirror shows", hm(s)], ["🕰️", "Real time", hm(act), 1]));
  }
}
const MIRROR_SAME = ["MOM", "WOW", "TOOT", "OTTO", "MUM", "TOT", "AHA"], MIRROR_NO = ["NOON", "DAD", "BOB", "EYE", "SOS", "POP", "KAYAK", "LEVEL", "DEED"];
const WATER_SAME = ["BOX", "HIDE", "CODE", "DICE", "BIKE", "ECHO", "DOCK", "HOOK", "OXIDE", "CHECK"], WATER_NO = ["MOON", "TOWN", "SEED", "COAT", "WAVE", "BAND", "FISH", "RAIN"];
function xMirrorWords(Q, n) {
  for (let j = 0; j < n; j++) {
    const water = j % 2 === 1, ans = pick(water ? WATER_SAME : MIRROR_SAME), wr = pickN(water ? WATER_NO : MIRROR_NO, 3);
    Q("top", water ? "Which word will look EXACTLY the same in its water image (as when reflected in still water below it)?" : "Which word will look EXACTLY the same in a mirror placed beside it (a vertical mirror)?", [ans, ...wr],
      water ? `In a water image the top and bottom swap, but the order of letters stays. ${ans} uses only letters that are the same when flipped top to bottom (B, C, D, E, H, I, K, O, X), so it looks the same. The others have letters like M, N, S, T, W or A that change.`
        : `A side mirror reverses the order of letters and flips each letter left to right. ${ans} reads the same backwards AND uses only letters with a left–right mirror line (A, H, I, M, O, T, U, V, W, X, Y). Words like NOON or DAD read the same backwards but N, D, B, E, S and P flip.`,
      C(["🪞", ans, "same image", 1], ...wr.map(w => ["", w, "changes"])));
  }
}
const VENN_CTX = [["play cricket", "play football", "students in a class"], ["like mangoes", "like apples", "children at a party"], ["have a pet dog", "have a pet cat", "families on a street"], ["read comics", "read science magazines", "students in a school club"]];
function xVenn(Q, n) {
  for (let j = 0; j < n; j++) {
    const [la, lb, who] = pick(VENN_CTX), both = ri(3, 9), oa = ri(3, 12), ob = ri(3, 12), none = pick([0, 0, ri(2, 6)]), T = both + oa + ob + none, a = oa + both, b = ob + both;
    const t = j % 2;
    const facts = `There are ${T} ${who}. ${a} ${la} and ${b} ${lb}. ${none ? `${none} are in neither group.` : "Each one is in at least one of the two groups."}`;
    if (t === 0) Q("top", `${facts}\nHow many ${la} and also ${lb}?`, nums(both, [a + b - T, oa, ob]),
      `Those who do at least one = ${T} − ${none} = ${T - none}. Both = ${a} + ${b} − ${T - none} = ${both}.`, { t: "venn", la: cap1(la), lb: cap1(lb), a: [String(oa)], m: [String(both)], b: [String(ob)], hl: String(both) });
    else Q("top", `${facts}\nHow many ONLY ${la}?`, nums(oa, [a, both, ob]),
      `Both = ${a} + ${b} − ${T - none} = ${both}. Only "${la}" = ${a} − ${both} = ${oa}.`, { t: "venn", la: cap1(la), lb: cap1(lb), a: [String(oa)], m: [String(both)], b: [String(ob)], hl: String(oa) });
  }
}
const CHAINS = [["Grass", "Grasshopper", "Frog", "Snake", "Eagle"], ["Algae", "Small fish", "Big fish", "Crocodile"], ["Leaves", "Caterpillar", "Sparrow", "Hawk"], ["Grass", "Mouse", "Snake", "Eagle"], ["Grains", "Rat", "Snake", "Peacock"], ["Plants", "Insects", "Frog", "Snake", "Hawk"], ["Grass", "Deer", "Tiger"]];
const CPL = { Grass: "grass", Algae: "algae", Leaves: "leaves", Grains: "grains", Plants: "plants", Grasshopper: "grasshoppers", Frog: "frogs", Snake: "snakes", Eagle: "eagles", "Small fish": "small fish", "Big fish": "big fish", Crocodile: "crocodiles", Caterpillar: "caterpillars", Sparrow: "sparrows", Hawk: "hawks", Mouse: "mice", Rat: "rats", Peacock: "peacocks", Insects: "insects", Deer: "deer", Tiger: "tigers" };
const LEVEL = ["producer", "primary consumer", "secondary consumer", "tertiary consumer"];
function xChain(Q, n) {
  for (let j = 0; j < n; j++) {
    const ch = pick(CHAINS), s = ch.join(" → "), t = j % 4, pad = ["Mushroom", "Bacteria", "Vulture"];
    const fromChain = ans => [ans, ...pickN(ch.filter(x => x !== ans).concat(ch.length < 4 ? pad : []), 3)];
    if (t === 0) {
      const k = ri(1, Math.min(3, ch.length - 1));
      Q("top", `Look at the food chain:\n${s}\nWhich organism is the ${LEVEL[k]}?`, fromChain(ch[k]),
        `The chain starts with the producer (${ch[0]}). Then come the primary consumer (${ch[1]}), secondary consumer (${ch[2]})${ch[3] ? ` and tertiary consumer (${ch[3]})` : ""}. So the ${LEVEL[k]} is the ${ch[k]}.`, F(...ch.map((x, i) => ["", x, LEVEL[i] || "top consumer", i === k])));
    } else if (t === 1) {
      const k = ri(1, ch.length - 2), A = CPL[ch[k - 1]], B = CPL[ch[k + 1]], less = k - 1 === 0 ? "less" : "fewer";
      const ans = `More ${A} and fewer ${B}`;
      Q("top", `In the food chain ${s}, suppose all the ${CPL[ch[k]]} are removed. What happens first?`, [ans, `${cap1(less)} ${A} and more ${B}`, `More ${A} and more ${B}`, `${cap1(less)} ${A} and fewer ${B}`],
        `Nothing eats the ${A} any more, so ${k - 1 === 0 ? "it grows more" : "they increase"}. The ${B} lose their food, so they decrease.`, F(["⬆️", ch[k - 1], "no longer eaten", 1], ["❌", ch[k], "removed"], ["⬇️", ch[k + 1], "loses food", 1]));
    } else if (t === 2) {
      const top = ch[ch.length - 1];
      Q("top", `In the food chain ${s}, which organism gets the LEAST energy from the Sun's energy stored by the producer?`, fromChain(top),
        `Only about 10% of energy passes on at each step, so the organism at the end, the ${top}, gets the least.`, F(...ch.map((x, i) => ["", x, i ? `${[100, 10, 1, 0.1, 0.01][i]}%` : "100%", i === ch.length - 1])));
    } else {
      const top = ch[ch.length - 1];
      Q("top", `A harmful pesticide that does not break down gets into the ${ch[0].toLowerCase()} in the food chain ${s}. Which organism will finally have the MOST pesticide in its body?`, fromChain(top),
        `Each animal eats many of the ones below it, so the poison collects more and more up the chain (biomagnification). The ${top}, at the top, gets the most.`, F(...ch.map((x, i) => ["", x, "☠".repeat(i + 1), i === ch.length - 1])));
    }
  }
}
const LEVERS = {
  first: { mid: "fulcrum", list: ["seesaw", "pair of scissors", "pair of pliers", "crowbar", "beam balance", "claw hammer pulling a nail"] },
  second: { mid: "load", list: ["nutcracker", "bottle opener", "wheelbarrow", "lemon squeezer"] },
  third: { mid: "effort", list: ["pair of tongs", "pair of tweezers", "fishing rod", "human forearm", "broom while sweeping"] },
};
function xLever(Q, n) {
  const cls = Object.keys(LEVERS);
  for (let j = 0; j < n; j++) {
    const c = pick(cls), [x, y] = pickN(LEVERS[c].list, 2), oth = cls.filter(k => k !== c);
    if (j % 2 === 0) {
      const wr = [pick(LEVERS[oth[0]].list), pick(LEVERS[oth[1]].list), pick(LEVERS[pick(oth)].list)];
      if (new Set(wr).size < 3) continue;
      Q("top", `Which of these is a lever of the SAME class as ${an(x)}?`, [cap1(y), ...wr.map(cap1)],
        `${cap1(an(x))} is a ${c}-class lever: the ${LEVERS[c].mid} is in the middle. ${cap1(an(y))} is also ${c}-class. (First class: fulcrum in the middle; second: load in the middle; third: effort in the middle.)`,
        C(["⚙️", cap1(x), `${c} class`], ["", cap1(y), `${c} class`, 1]));
    } else {
      const opts = ["The fulcrum", "The load", "The effort"], ans = cap1("the " + LEVERS[c].mid);
      Q("top", `In ${an(x)} used as a lever, which of these lies BETWEEN the other two?`, [ans, ...opts.filter(o => o !== ans), "All three are at one point"],
        `${cap1(an(x))} is a ${c}-class lever, so the ${LEVERS[c].mid} lies between the other two.`, C(["⚙️", cap1(x), `${c}-class lever`, 1], ["", "Middle", LEVERS[c].mid]));
    }
  }
}

// ---------- registry ----------
X[1].nso = Q => {
  xAuth(Q, X1);
  xAuth(Q, X1B);
  xOdd(Q, X1_ODD);
  xAna(Q, X1_ANA);
  xBank(Q, B1_LIFE, 9, 3, "🌱");
  xBank(Q, B1_ANIMAL, 9, 3, "🐾");
  xBank(Q, B1_BODY, 8, 3, "🧍");
  xBank(Q, B1_WORLD, 9, 3, "🌦️");
  M1.forEach(([title, em, rows]) => xMatch(Q, rows, 5, title, em));
  xOnly(Q, 3, "animals that lay eggs", ["hen", "crow", "snake", "lizard", "crocodile", "tortoise", "penguin", "frog", "ostrich", "duck", "butterfly"], ["bat", "whale", "dolphin", "rat", "rabbit", "kangaroo", "monkey"], "🥚", "they give birth to babies.");
  xOnly(Q, 3, "insects", ["ant", "honeybee", "housefly", "mosquito", "butterfly", "grasshopper", "cockroach", "ladybird"], ["spider", "scorpion", "centipede", "earthworm", "snail"], "🐜", "an insect has 6 legs and 3 body parts.");
  xOnly(Q, 3, "birds that cannot fly", ["ostrich", "penguin", "emu", "kiwi"], ["sparrow", "crow", "eagle", "parrot", "peacock", "duck"], "🐧", "they can fly.");
  xOnly(Q, 3, "roots that we eat", ["carrot", "radish", "beetroot", "turnip", "sweet potato"], ["potato", "ginger", "sugarcane", "cabbage", "brinjal"], "🥕", "potato, ginger and sugarcane are stems, cabbage is leaves and brinjal is a fruit.");
  xOrder(Q, 12, 4);
  xPattern(Q, 15);
  xLegs(Q, 12);
  xRow(Q, 14);
  xMeasure(Q, 12);
  xShadow(Q);
};

X[4].nso = Q => {
  xAuth(Q, X4);
  xAR(Q, X4_AR);
  xOdd(Q, X4_ODD);
  xBank(Q, B4_PLANT, 8, 3, "🌿");
  xBank(Q, B4_ANIMAL, 8, 3, "🐾");
  xBank(Q, B4_BODY, 8, 4, "🫀");
  xBank(Q, B4_FOOD, 7, 3, "🥗");
  xBank(Q, B4_MATTER, 8, 3, "🧪");
  xBank(Q, B4_FORCE, 8, 4, "⚙️");
  xBank(Q, B4_SPACE, 8, 3, "🪐");
  xBank(Q, B4_ENV, 7, 3, "♻️");
  M4.forEach(([title, em, rows]) => xMatch(Q, rows, 4, title, em));
  xCoding(Q, 12);
  xSeries(Q, 12);
  xRank(Q, 12);
  xDirection(Q, 15);
  xClock(Q, 10);
  xMirrorWords(Q, 10);
  xVenn(Q, 10);
  xChain(Q, 15);
  xLever(Q, 12);
  xOrder(Q, 8, 5);
};
})();
