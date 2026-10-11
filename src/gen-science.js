// NSO (Science) generators for grades 1 and 4. Facts live in small tables; each template asks about one fact.

// name, emoji, baby, home, sound, move, legs, gives
const ANIMALS = [
  ["dog", "🐕", "puppy", "kennel", "bark", "walk", 4], ["cat", "🐈", "kitten", "", "mew", "walk", 4],
  ["cow", "🐄", "calf", "cowshed", "moo", "walk", 4, "milk"], ["goat", "🐐", "kid", "", "bleat", "walk", 4, "milk"],
  ["sheep", "🐑", "lamb", "", "baa", "walk", 4, "wool"], ["horse", "🐎", "foal", "stable", "neigh", "walk", 4],
  ["hen", "🐔", "chick", "coop", "cluck", "walk", 2, "eggs"], ["duck", "🦆", "duckling", "", "quack", "", 2, "eggs"],
  ["lion", "🦁", "cub", "den", "roar", "walk", 4], ["elephant", "🐘", "calf", "", "trumpet", "walk", 4],
  ["frog", "🐸", "tadpole", "", "croak", "hop", 4], ["sparrow", "🐦", "", "nest", "chirp", "fly", 2],
  ["bee", "🐝", "", "hive", "buzz", "fly", 6, "honey"], ["spider", "🕷️", "", "web", "", "crawl", 8],
  ["rabbit", "🐇", "", "burrow", "", "hop", 4], ["snake", "🐍", "", "", "hiss", "crawl", 0],
  ["mouse", "🐭", "", "", "squeak", "walk", 4], ["owl", "🦉", "owlet", "", "hoot", "fly", 2],
  ["pig", "🐖", "piglet", "sty", "grunt", "walk", 4], ["fish", "🐟", "", "", "", "swim", 0],
  ["kangaroo", "🦘", "joey", "", "", "hop"], ["butterfly", "🦋", "caterpillar", "", "", "fly", 6],
  ["earthworm", "🪱", "", "", "", "crawl", 0], ["snail", "🐌", "", "", "", "crawl", 0],
  ["eagle", "🦅", "", "", "", "fly", 2], ["dolphin", "🐬", "", "", "", "swim", 0],
  ["tiger", "🐅", "cub", "", "", "walk", 4], ["bear", "🐻", "cub", "", "", "walk", 4], ["camel", "🐫", "", "", "", "walk", 4],
  ["ant", "🐜", "", "", "", "", 6],
].map(([n, e, baby, home, sound, move, legs, gives]) => ({ n, e, baby, home, sound, move, legs, gives }));
const A = n => ANIMALS.find(a => a.n === n);
const an = w => (/^[aeiou]/i.test(w) ? "an " : "a ") + w;
const card = (a, sub, ok) => [a.e, cap1(a.n), sub || "", ok];

const FRUITS = [["🍎", "apple"], ["🍌", "banana"], ["🥭", "mango"], ["🍇", "grapes"], ["🍊", "orange"], ["🍍", "pineapple"], ["🍉", "watermelon"], ["🍓", "strawberry"], ["🍐", "pear"], ["🍒", "cherry"], ["🥝", "kiwi"], ["🍑", "peach"]];
const VEGS = [["🥕", "carrot"], ["🥔", "potato"], ["🧅", "onion"], ["🧄", "garlic"], ["🥬", "spinach"], ["🥦", "broccoli"], ["🍠", "sweet potato"], ["🌶️", "chilli"]];
const HEALTHY = [["🥛", "milk"], ["🍎", "apple"], ["🥕", "carrot"], ["🥚", "egg"], ["🍌", "banana"], ["🥗", "salad"], ["🍲", "dal"], ["🥜", "nuts"]];
const JUNK = [["🍟", "chips"], ["🍬", "candy"], ["🥤", "cola"], ["🍩", "doughnut"], ["🍭", "lollipop"], ["🍫", "chocolate bar"]];
const LIVING = [["🌳", "tree"], ["🐕", "dog"], ["🐦", "bird"], ["🌻", "sunflower"], ["🐟", "fish"], ["👶", "baby"], ["🦋", "butterfly"], ["🌱", "plant"], ["🐜", "ant"], ["🐄", "cow"]];
const NONLIVING = [["🪨", "stone"], ["🪑", "chair"], ["🚗", "car"], ["⚽", "ball"], ["📘", "book"], ["✏️", "pencil"], ["☕", "cup"], ["🧸", "teddy bear"], ["⏰", "clock"], ["🚲", "bicycle"]];
const SENSES = [["👀", "eyes", "see"], ["👂", "ears", "hear"], ["👃", "nose", "smell"], ["👅", "tongue", "taste"], ["✋", "skin", "feel touch"]];
const TRANSPORT = { land: [["🚗", "car"], ["🚌", "bus"], ["🚆", "train"], ["🚲", "bicycle"], ["🛵", "scooter"], ["🚚", "truck"]], water: [["🚢", "ship"], ["⛵", "sailboat"], ["⛴️", "ferry"], ["🛶", "canoe"]], air: [["✈️", "aeroplane"], ["🚁", "helicopter"], ["🎈", "hot-air balloon"]] };
const MATERIAL = [["🚪", "door", "wood"], ["🏏", "cricket bat", "wood"], ["🪟", "window pane", "glass"], ["🪞", "mirror", "glass"], ["🔑", "key", "metal"], ["🪙", "coin", "metal"], ["📖", "book", "paper"], ["📰", "newspaper", "paper"], ["👕", "shirt", "cloth"], ["🧦", "socks", "cloth"], ["🎈", "balloon", "rubber"], ["🛞", "tyre", "rubber"], ["🪥", "toothbrush", "plastic"]];
const FLOATS = [["🍃", "leaf"], ["🪶", "feather"], ["⛵", "paper boat"], ["🪵", "piece of wood"], ["⚽", "plastic ball"], ["🧽", "sponge"]];
const SINKS = [["🪨", "stone"], ["🪙", "coin"], ["🔑", "key"], ["🔩", "iron nail"], ["🥄", "steel spoon"]];
const PETS = [["🐕", "dog"], ["🐈", "cat"], ["🦜", "parrot"], ["🐠", "goldfish"]], FARM = [["🐄", "cow"], ["🐐", "goat"], ["🐑", "sheep"], ["🐔", "hen"], ["🐖", "pig"]], WILD = [["🦁", "lion"], ["🐅", "tiger"], ["🐻", "bear"], ["🐺", "wolf"], ["🦊", "fox"], ["🦓", "zebra"], ["🦒", "giraffe"]];

// Short authored questions: [difficulty, question, [right, wrong, wrong, wrong], explanation, cards]
const S1 = [
  ["medium", "Which part of a plant holds it firmly in the soil?", ["Root", "Leaf", "Flower", "Fruit"], "Roots spread under the soil and hold the plant firmly so wind can't knock it over.", { t: "plant", hl: "root" }],
  ["medium", "Which part of a plant makes food?", ["Leaf", "Root", "Stem", "Seed"], "Green leaves use sunlight, air and water to make food for the whole plant.", { t: "plant", hl: "leaf" }],
  ["medium", "Which part of a plant carries water from the roots to the leaves?", ["Stem", "Flower", "Seed", "Fruit"], "The stem is like a pipe. It carries water up from the roots to the leaves.", { t: "plant", hl: "stem" }],
  ["hard", "Which part of a plant turns into a fruit?", ["Flower", "Root", "Leaf", "Stem"], "After a flower blooms, it slowly turns into a fruit with seeds inside.", { t: "plant", hl: "flower" }],
  ["medium", "What grows into a new plant?", ["Seed", "Stone", "Leaf", "Petal"], "A seed has a tiny baby plant inside. With water, air and warmth it grows into a new plant.", F(["🌰", "Seed", ""], ["🌱", "Sprout", ""], ["🌳", "Plant", "", 1])],
  ["easy", "When can we see the Sun in the sky?", ["In the day", "At night", "Never", "Only when it rains"], "The Sun lights up the sky during the day. At night our side of the Earth faces away from it.", C(["☀️", "Day", "Sun", 1], ["🌙", "Night", "Moon and stars"])],
  ["easy", "What do we see in the sky at night?", ["Moon and stars", "Rainbow", "Sun", "Clouds of smoke"], "At night the sky is dark, and we can see the Moon and twinkling stars.", C(["🌙", "Moon", "night", 1], ["⭐", "Stars", "night", 1], ["☀️", "Sun", "day"])],
  ["medium", "In which direction does the Sun rise?", ["East", "West", "North", "South"], "The Sun rises in the east every morning and sets in the west in the evening.", F(["🌅", "East", "rises", 1], ["☀️", "Sky", "noon"], ["🌇", "West", "sets"])],
  ["hard", "Which of these is a star?", ["The Sun", "The Moon", "The Earth", "A cloud"], "The Sun is a star. It is the closest star to us, so it looks much bigger and brighter than other stars.", C(["☀️", "Sun", "a star", 1], ["🌙", "Moon", "no light of its own"], ["🌍", "Earth", "a planet"])],
  ["easy", "In which season do we use an umbrella the most?", ["Rainy season", "Winter", "Summer", "Spring"], "In the rainy season it rains a lot, so an umbrella keeps us dry.", C(["🌧️", "Rainy", "umbrella", 1], ["❄️", "Winter", "sweater"], ["☀️", "Summer", "cap"])],
  ["easy", "When do we wear woollen sweaters?", ["Winter", "Summer", "Rainy season", "Spring"], "Wool keeps our body warm, so we wear sweaters when it is cold in winter.", C(["❄️", "Winter", "sweater", 1], ["☀️", "Summer", "cotton"])],
  ["medium", "Which clothes keep us cool in summer?", ["Cotton clothes", "Woollen clothes", "Raincoats", "Leather jackets"], "Cotton lets air pass through and soaks up sweat, so it keeps us cool in hot weather.", C(["👕", "Cotton", "summer", 1], ["🧶", "Wool", "winter"], ["🧥", "Raincoat", "rain"])],
  ["medium", "We can fly a kite well when it is ___.", ["Windy", "Raining", "Very still", "Night"], "Moving air (wind) pushes the kite up and keeps it flying.", F(["🌬️", "Wind", "moving air", 1], ["🪁", "Kite", "flies"])],
  ["hard", "When do we see a rainbow?", ["When the Sun shines during rain", "At midnight", "When it snows", "When it is very dark"], "Sunlight passing through raindrops splits into seven colours, making a rainbow.", F(["☀️", "Sunlight", ""], ["🌧️", "Raindrops", ""], ["🌈", "Rainbow", "", 1])],
  ["easy", "What do we need to breathe?", ["Air", "Sand", "Juice", "Stones"], "Air is all around us. We breathe it in through our nose all the time.", F(["🌬️", "Air", "", 1], ["👃", "Nose", "breathe in"])],
  ["medium", "Where do we get rain from?", ["Clouds", "Trees", "Mountains", "The Sun"], "Tiny water drops collect in clouds. When the drops get heavy they fall as rain.", F(["☁️", "Clouds", ""], ["🌧️", "Rain", "", 1])],
  ["medium", "What happens to water when it gets very cold?", ["It turns into ice", "It turns into air", "It turns into sand", "It becomes hot"], "When water becomes very cold it freezes into solid ice.", F(["💧", "Water", ""], ["❄️", "Very cold", ""], ["🧊", "Ice", "", 1])],
  ["easy", "Where should we cross the road?", ["At the zebra crossing", "Anywhere", "In the middle of traffic", "Behind a bus"], "The zebra crossing is the safe place to cross. Look right, left and right again first.", C(["🦓", "Zebra crossing", "safe", 1], ["🚗", "Busy road", "unsafe"])],
  ["medium", "Why should we not touch switches with wet hands?", ["We can get an electric shock", "The switch gets dirty", "It makes noise", "The light turns blue"], "Water lets electricity pass through. Touching switches with wet hands can give a shock.", C(["💧", "Wet hands", "danger", 1], ["🔌", "Switch", ""])],
  ["easy", "When should we wash our hands?", ["Before eating", "Only once a week", "Never", "Only after sleeping"], "Washing hands with soap before eating removes germs that can make us sick.", F(["🧼", "Soap", ""], ["🙌", "Clean hands", ""], ["🍽️", "Eat", "", 1])],
  ["medium", "What should we wear when riding a bicycle?", ["A helmet", "A raincoat", "A scarf", "Sunglasses only"], "A helmet protects our head if we fall.", C(["⛑️", "Helmet", "protects head", 1], ["🚲", "Bicycle", ""])],
  ["hard", "Which of these should we NOT play with?", ["Matchsticks", "A ball", "Building blocks", "A skipping rope"], "Matchsticks can start a fire and burn us. They are not toys.", C(["🔥", "Matchsticks", "danger", 1], ["⚽", "Ball", "safe"], ["🧱", "Blocks", "safe"])],
  ["easy", "How many times should we brush our teeth every day?", ["Two", "One", "Five", "None"], "Brush in the morning and at night, two times every day.", C(["🌅", "Morning", "brush", 1], ["🌙", "Night", "brush", 1])],
  ["medium", "Which of these is a tree?", ["Mango", "Grass", "Money plant", "Rose"], "A tree is big and has a thick, strong trunk. A mango tree is a tree. A rose is a shrub and grass is a herb.", C(["🌳", "Mango", "tree", 1], ["🌹", "Rose", "shrub"], ["🌿", "Grass", "herb"])],
  ["hard", "A plant with a weak stem that climbs up with support is a ___.", ["Climber", "Tree", "Shrub", "Cactus"], "Climbers like the money plant and grapevine have weak stems, so they climb on walls or sticks.", C(["🌿", "Climber", "needs support", 1], ["🌳", "Tree", "strong trunk"])],
  ["hard", "Which plant can grow in a hot desert with very little water?", ["Cactus", "Lotus", "Rose", "Rice"], "A cactus stores water in its thick stem and has spines instead of leaves, so it loses very little water.", C(["🌵", "Cactus", "desert", 1], ["🪷", "Lotus", "pond"])],
  ["medium", "Which plant grows in water?", ["Lotus", "Cactus", "Mango tree", "Neem tree"], "The lotus grows in ponds. Its leaves float on the water.", C(["🪷", "Lotus", "water", 1], ["🌵", "Cactus", "desert"])],
  ["hard", "Which part of the potato plant do we eat?", ["Stem", "Root", "Leaf", "Flower"], "A potato grows under the soil, but it is actually a swollen stem. Look for the 'eyes' that sprout.", C(["🥔", "Potato", "stem", 1], ["🥕", "Carrot", "root"], ["🥬", "Spinach", "leaf"])],
  ["medium", "Which part of the carrot plant do we eat?", ["Root", "Stem", "Leaf", "Flower"], "The orange carrot grows under the soil. It is the root of the plant.", C(["🥕", "Carrot", "root", 1], ["🥬", "Spinach", "leaf"])],
  ["medium", "Which part of the spinach plant do we eat?", ["Leaves", "Roots", "Flowers", "Seeds"], "We cook and eat the green leaves of spinach.", C(["🥬", "Spinach", "leaves", 1], ["🥕", "Carrot", "root"])],
  ["hard", "Which part of the cauliflower plant do we eat?", ["Flower", "Root", "Stem", "Seed"], "The white head of the cauliflower is a bunch of flowers.", C(["🥦", "Cauliflower", "flower", 1], ["🥕", "Carrot", "root"])],
  ["medium", "Peas are which part of the plant?", ["Seeds", "Roots", "Leaves", "Flowers"], "The green peas inside the pod are seeds.", C(["🫛", "Peas", "seeds", 1], ["🥬", "Spinach", "leaves"])],
  ["medium", "Which organ helps us think?", ["Brain", "Stomach", "Lungs", "Teeth"], "The brain is inside the head. It helps us think, learn and remember.", C(["🧠", "Brain", "think", 1], ["❤️", "Heart", "pumps blood"], ["🫁", "Lungs", "breathe"])],
  ["hard", "Which organ helps us breathe?", ["Lungs", "Heart", "Brain", "Stomach"], "Our lungs fill with air when we breathe in.", C(["🫁", "Lungs", "breathe", 1], ["❤️", "Heart", "pumps blood"])],
  ["medium", "Which body part helps us chew food?", ["Teeth", "Ears", "Eyes", "Hair"], "Our teeth bite and chew food into small pieces.", C(["🦷", "Teeth", "chew", 1], ["👂", "Ears", "hear"])],
  ["easy", "Which body part do we use to hold a pencil?", ["Hand", "Foot", "Nose", "Ear"], "We hold things and write with our hands and fingers.", C(["✋", "Hand", "hold", 1], ["🦶", "Foot", "walk"])],
  ["hard", "What gives our body its shape?", ["Bones", "Hair", "Nails", "Blood"], "Bones join together to make the skeleton, which gives our body its shape and keeps it upright.", C(["🦴", "Bones", "shape", 1], ["💅", "Nails", ""])],
];

G[1].nso = Q => {
  S1.forEach(([d, q, o, e, v]) => Q(d, q, o, e, v));
  const babies = ANIMALS.filter(a => a.baby).map(a => a.baby);
  ANIMALS.filter(a => a.baby).forEach(a => {
    const common = ["puppy", "kitten", "calf", "cub", "chick", "duckling", "piglet"].includes(a.baby);
    Q(common ? "easy" : "medium", `A baby ${a.n} is called ${an("___")}.`.replace("an ___", "a ___"), words(a.baby, babies), `Baby animals have special names. A baby ${a.n} is called ${an(a.baby)}.`, C(card(a, a.baby, 1), ...pickN(ANIMALS.filter(b => b.baby && b.baby !== a.baby), 2).map(b => card(b, b.baby))));
  });
  const homes = ANIMALS.filter(a => a.home).map(a => a.home);
  ANIMALS.filter(a => a.home).forEach(a => {
    Q(["nest", "kennel", "hive", "web"].includes(a.home) ? "easy" : "medium", `What is the home of ${an(a.n)} called?`, words(a.home, homes), `${cap1(an(a.n))} lives in ${an(a.home)}.`, C(card(a, a.home, 1), ...pickN(ANIMALS.filter(b => b.home && b.home !== a.home), 2).map(b => card(b, b.home))));
  });
  const sounds = ANIMALS.filter(a => a.sound).map(a => a.sound);
  ANIMALS.filter(a => a.sound).forEach(a => {
    const easy = ["bark", "mew", "moo", "roar", "quack", "buzz", "hiss"].includes(a.sound);
    Q(easy ? "easy" : "medium", `What sound does ${an(a.n)} make?`, words(a.sound, sounds), `${cap1(an(a.n))} makes a "${a.sound}" sound.`, C(card(a, a.sound, 1), ...pickN(ANIMALS.filter(b => b.sound && b.sound !== a.sound), 2).map(b => card(b, b.sound))));
    if (!easy) Q("hard", `Which animal ${a.sound === "baa" ? "says baa" : a.sound + "s"}?`, words(cap1(a.n), ANIMALS.filter(b => b.sound && b.sound !== a.sound).map(b => cap1(b.n))), `${cap1(an(a.n))} makes a "${a.sound}" sound.`, C(card(a, a.sound, 1)));
  });
  const MOVE = { fly: "fly", swim: "swim", hop: "hop", crawl: "crawl" };
  for (const m in MOVE) {
    const yes = ANIMALS.filter(a => a.move === m), no = ANIMALS.filter(a => a.move && a.move !== m && !(m === "swim" && a.n === "duck"));
    yes.forEach(a => {
      Q(m === "fly" || m === "swim" ? "easy" : "medium", `Which animal can ${m}?`, [cap1(a.n), ...pickN(no, 3).map(b => cap1(b.n))], `${cap1(an(a.n))} can ${m}.${m === "fly" ? " It has wings." : m === "swim" ? " It lives in water and has fins or flippers." : ""}`, C(card(a, m + "s", 1)));
      Q("medium", `How does ${an(a.n)} move?`, [`It ${m}s`, ...["walks", "flies", "swims", "hops", "crawls"].filter(x => !x.startsWith(m.slice(0, 3))).slice(0, 3).map(x => "It " + x)], `${cap1(an(a.n))} ${m === "fly" ? "flies" : m + "s"} from place to place.`, C(card(a, m === "fly" ? "flies" : m + "s", 1)));
    });
  }
  ANIMALS.filter(a => a.legs !== undefined).forEach(a => Q("medium", `How many legs does ${an(a.n)} have?`, nums(a.legs, [2, 4, 6, 8, 0].filter(x => x !== a.legs)), `${cap1(an(a.n))} has ${a.legs === 0 ? "no" : a.legs} legs.${a.legs === 6 ? " All insects have 6 legs." : a.legs === 8 ? " Spiders have 8 legs, so they are not insects." : ""}`, C(card(a, `${a.legs} legs`, 1))));
  for (const [legs, txt] of [[8, "8 legs"], [6, "6 legs"], [0, "no legs"]]) ANIMALS.filter(a => a.legs === legs).forEach(a =>
    Q("hard", `Which animal has ${txt}?`, [cap1(a.n), ...pickN(ANIMALS.filter(b => b.legs !== undefined && b.legs !== legs), 3).map(b => cap1(b.n))], `${cap1(an(a.n))} has ${txt}.`, C(card(a, txt, 1))));
  ANIMALS.filter(a => a.gives).forEach(a => Q("easy", `Which animal gives us ${a.gives}?`, [cap1(a.n), ...pickN(ANIMALS.filter(b => !b.gives && b.legs !== undefined), 3).map(b => cap1(b.n))], `We get ${a.gives} from ${an(a.n)}.`, F(card(a, ""), ["", a.gives, "", 1])));
  // Fruits and vegetables.
  FRUITS.forEach(f => Q("easy", "Which of these is a fruit?", [cap1(f[1]), ...pickN(VEGS, 3).map(v => cap1(v[1]))], `${cap1(an(f[1]))} is a fruit. It is sweet and grows from a flower.`, C([...f, "fruit", 1])));
  VEGS.forEach(v => Q("easy", "Which of these is a vegetable?", [cap1(v[1]), ...pickN(FRUITS, 3).map(f => cap1(f[1]))], `${cap1(v[1])} is a vegetable.`, C([...v, "vegetable", 1])));
  VEGS.forEach(v => Q("medium", "Which of these is NOT a fruit?", [cap1(v[1]), ...pickN(FRUITS, 3).map(f => cap1(f[1]))], `${cap1(v[1])} is a vegetable. The others are fruits.`, C([...v, "vegetable", 1])));
  HEALTHY.forEach(h => Q("easy", "Which food is good for our health?", [cap1(h[1]), ...pickN(JUNK, 3).map(j => cap1(j[1]))], `${cap1(h[1])} gives our body what it needs to grow. Chips, candy and cola are junk food.`, C([...h, "healthy", 1], ...pickN(JUNK, 2).map(j => [...j, "junk"]))));
  JUNK.forEach(j => Q("medium", "Which food should we eat only a little of?", [cap1(j[1]), ...pickN(HEALTHY, 3).map(h => cap1(h[1]))], `${cap1(j[1])} has lots of sugar, salt or oil and very little goodness. Eat it only once in a while.`, C([...j, "junk", 1], ...pickN(HEALTHY, 2).map(h => [...h, "healthy"]))));
  // Living and non-living.
  LIVING.forEach(l => Q("easy", "Which of these is a living thing?", [cap1(l[1]), ...pickN(NONLIVING, 3).map(n => cap1(n[1]))], `Living things grow, breathe and need food and water. ${cap1(an(l[1]))} does all of these.`, C([...l, "living", 1], ...pickN(NONLIVING, 2).map(n => [...n, "non-living"]))));
  NONLIVING.forEach(n => Q("medium", "Which of these is NOT a living thing?", [cap1(n[1]), ...pickN(LIVING, 3).map(l => cap1(l[1]))], `${cap1(an(n[1]))} does not grow, eat or breathe, so it is non-living.`, C([...n, "non-living", 1], ...pickN(LIVING, 2).map(l => [...l, "living"]))));
  // Senses.
  SENSES.forEach(([e, part, act]) => {
    Q(part === "skin" ? "medium" : "easy", `Which body part do we use to ${act === "feel touch" ? "feel touch" : act}?`, words(cap1(part), SENSES.map(s => cap1(s[1]))), `We ${act === "feel touch" ? "feel touch, heat and cold" : act} with our ${part}.`, C(...SENSES.map(s => [s[0], cap1(s[1]), s[2], s[1] === part])));
    if (part !== "skin") Q("easy", `What do we do with our ${part}?`, [cap1(act), ...SENSES.filter(s => s[1] !== part && s[1] !== "skin").map(s => cap1(s[2]))], `Our ${part} help${part === "nose" || part === "tongue" ? "s" : ""} us ${act}.`, C([e, cap1(part), act, 1]));
  });
  // Transport.
  for (const [where, list] of Object.entries(TRANSPORT)) list.forEach(t => {
    const others = Object.entries(TRANSPORT).filter(([w]) => w !== where).flatMap(([, l]) => l);
    Q(where === "land" ? "medium" : "easy", where === "land" ? "Which of these moves on roads or land?" : where === "water" ? "Which of these moves on water?" : "Which of these flies in the air?", [cap1(t[1]), ...pickN(others, 3).map(o => cap1(o[1]))], `${cap1(an(t[1]))} is ${where} transport.`, C([...t, where, 1], ...pickN(others, 2).map(o => [...o, Object.entries(TRANSPORT).find(([, l]) => l.includes(o))[0]])));
  });
  // Materials, floating and sinking, kinds of animals.
  const mats = [...new Set(MATERIAL.map(m => m[2]))];
  MATERIAL.forEach(([e, o, m]) => Q("medium", `${cap1(an(o))} is usually made of ___.`, words(cap1(m), mats.map(cap1)), `${cap1(an(o))} is usually made of ${m}.`, C([e, cap1(o), m, 1])));
  FLOATS.forEach(f => Q("medium", "Which of these will float on water?", [cap1(f[1]), ...pickN(SINKS, 3).map(s => cap1(s[1]))], `Light things like ${an(f[1])} float. Heavy things like stones, coins and iron sink.`, C([...f, "floats", 1], ...pickN(SINKS, 2).map(s => [...s, "sinks"]))));
  SINKS.forEach(s => Q("hard", "Which of these will sink in water?", [cap1(s[1]), ...pickN(FLOATS, 3).map(f => cap1(f[1]))], `${cap1(an(s[1]))} is heavy for its size, so it sinks.`, C([...s, "sinks", 1], ...pickN(FLOATS, 2).map(f => [...f, "floats"]))));
  WILD.forEach(w => Q("easy", "Which of these is a wild animal?", [cap1(w[1]), ...pickN([...PETS, ...FARM], 3).map(p => cap1(p[1]))], `${cap1(an(w[1]))} lives in the forest or grassland, not with people. It is a wild animal.`, C([...w, "wild", 1])));
  PETS.forEach(p => Q("easy", "Which of these can be kept as a pet at home?", [cap1(p[1]), ...pickN(WILD, 3).map(w => cap1(w[1]))], `${cap1(an(p[1]))} is a pet. Lions, tigers and bears are wild animals.`, C([...p, "pet", 1])));
  FARM.forEach(f => Q("medium", "Which of these is a farm animal?", [cap1(f[1]), ...pickN(WILD, 3).map(w => cap1(w[1]))], `Farmers keep ${f[1] === "sheep" ? "sheep" : f[1] + "s"} on farms for milk, eggs, wool or meat.`, C([...f, "farm", 1])));
  const INSECTS = ["ant", "bee", "butterfly"], NOT_INS = ["spider", "earthworm", "snail"];
  INSECTS.forEach(i => Q("hard", "Which of these is an insect?", [cap1(i), ...NOT_INS.map(cap1)], `Insects have 6 legs. ${cap1(an(i))} has 6 legs. A spider has 8, and earthworms and snails have none.`, C(card(A(i), "6 legs", 1), card(A("spider"), "8 legs"), card(A("snail"), "no legs"))));
  ["hen", "sparrow", "owl", "eagle", "duck"].forEach(b => Q("hard", "Which of these is a bird?", [cap1(b), "Bat", "Butterfly", "Bee"], `Birds have feathers, wings and a beak, and they lay eggs. ${cap1(an(b))} is a bird. A bat can fly but has fur, not feathers.`, C(card(A(b), "feathers", 1), ["🦇", "Bat", "fur, not a bird"])));
};

// ---------- Grade 4 ----------
const DIET = { herbivore: ["cow", "deer", "goat", "rabbit", "elephant", "giraffe", "horse", "zebra", "camel", "sheep"], carnivore: ["lion", "tiger", "wolf", "leopard", "eagle", "shark", "crocodile", "cheetah"], omnivore: ["bear", "crow", "human", "pig", "monkey", "hen"] };
const BIRTH = { eggs: ["hen", "duck", "snake", "crocodile", "frog", "fish", "turtle", "sparrow", "lizard", "butterfly"], babies: ["cow", "dog", "cat", "human", "elephant", "whale", "bat", "monkey", "rabbit", "dolphin"] };
const BREATHE = [["fish", "gills"], ["tadpole", "gills"], ["earthworm", "moist skin"], ["cockroach", "air holes (spiracles)"], ["grasshopper", "air holes (spiracles)"], ["whale", "lungs"], ["dolphin", "lungs"], ["dog", "lungs"], ["human", "lungs"], ["sparrow", "lungs"]];
const EATEN = { root: ["carrot", "radish", "beetroot", "turnip", "sweet potato"], stem: ["potato", "ginger", "sugarcane"], leaf: ["spinach", "cabbage", "lettuce", "mint", "coriander"], flower: ["cauliflower", "broccoli"], seed: ["peas", "wheat", "rice", "mustard", "beans"], fruit: ["mango", "apple", "tomato", "brinjal", "cucumber"] };
const DISPERSE = { wind: ["dandelion", "cotton", "maple"], water: ["coconut", "lotus"], animals: ["xanthium (burr)", "burdock"], bursting: ["balsam", "castor"] };
const NUTRI = { carbohydrates: ["rice", "bread", "potato", "chapati", "sugar"], proteins: ["dal (pulses)", "eggs", "paneer", "soybean", "fish"], fats: ["butter", "ghee", "cooking oil", "cream"] };
const VITAMINS = [["Vitamin C", "scurvy (bleeding gums)", "oranges and lemons"], ["Vitamin D", "rickets (soft bones)", "sunlight and milk"], ["Vitamin A", "night blindness", "carrots and papaya"], ["Vitamin B1", "beriberi", "whole grains"], ["Iodine", "goitre", "iodised salt"], ["Iron", "anaemia", "spinach and jaggery"], ["Calcium", "weak bones and teeth", "milk and curd"]];
const ORGANS = [["❤️", "heart", "pumping blood around the body"], ["🫁", "lungs", "breathing"], ["🧠", "brain", "controlling the body and thinking"], ["🫃", "stomach", "digesting food"], ["🫘", "kidneys", "cleaning the blood and making urine"], ["✋", "skin", "protecting the body and sensing touch"], ["🦴", "skeleton", "giving the body its shape and support"]];
const TEETH = [["incisors", "cut and bite food", "front, flat and sharp"], ["canines", "tear food", "pointed, next to incisors"], ["premolars", "crush food", "behind canines"], ["molars", "grind and chew food", "broad, at the back"]];
const STATES = { solid: ["stone", "ice", "wood", "coin", "book"], liquid: ["water", "milk", "oil", "juice", "honey"], gas: ["air", "steam", "oxygen", "carbon dioxide"] };
const CHANGES = [["melting", "solid to liquid", "ice cream turning runny on a hot day"], ["freezing", "liquid to solid", "water becoming ice in the freezer"], ["evaporation", "liquid to gas", "wet clothes drying in the sun"], ["condensation", "gas to liquid", "water drops on the outside of a cold glass"]];
const PLANETS = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
const PFACTS = [["the largest planet", 4], ["the smallest planet", 0], ["called the Red Planet", 3], ["famous for its bright rings", 5], ["the hottest planet", 1], ["the planet we live on", 2], ["the farthest planet from the Sun", 7], ["the closest planet to the Sun", 0], ["called the Blue Planet", 2]];
const COND = { conductors: ["copper", "iron", "aluminium", "silver", "a steel spoon"], insulators: ["rubber", "plastic", "wood", "glass", "paper"] };
const MAGNET = { yes: ["an iron nail", "a steel pin", "iron filings", "a steel paper clip"], no: ["a wooden stick", "a plastic ruler", "paper", "a rubber band", "a copper wire", "aluminium foil", "glass"] };
const MACHINES = [["lever", ["seesaw", "bottle opener", "crowbar"]], ["pulley", ["flagpole rope", "well for drawing water", "crane"]], ["wheel and axle", ["doorknob", "steering wheel", "screwdriver handle"]], ["inclined plane", ["ramp", "slide", "sloping road"]], ["wedge", ["knife", "axe", "nail tip"]], ["screw", ["jar lid", "bolt", "spiral staircase"]]];
const INSTR = [["thermometer", "to measure temperature", "🌡️"], ["weighing balance", "to measure mass (weight)", "⚖️"], ["measuring tape", "to measure length", "📏"], ["stethoscope", "to listen to the heartbeat", "🩺"], ["rain gauge", "to measure rainfall", "🌧️"], ["compass", "to find direction", "🧭"], ["clock", "to tell the time", "⏰"]];
const ENERGY = { renewable: ["sunlight", "wind", "flowing water"], "non-renewable": ["coal", "petrol", "natural gas"] };

const S4 = [
  ["medium", "How many teeth does an adult have?", ["32", "20", "28", "36"], "Children have 20 milk teeth. Adults have 32 permanent teeth.", C(["🧒", "Milk teeth", "20"], ["🧑", "Permanent teeth", "32", 1])],
  ["hard", "How many milk teeth does a child have?", ["20", "32", "24", "16"], "Children have 20 milk teeth. They fall out and are replaced by 32 permanent teeth.", C(["🧒", "Milk teeth", "20", 1], ["🧑", "Permanent", "32"])],
  ["hard", "How many bones are there in an adult human body?", ["206", "300", "106", "26"], "A baby is born with about 300 bones. Some join together as we grow, leaving 206 in an adult.", C(["👶", "Baby", "about 300"], ["🧑", "Adult", "206", 1])],
  ["hard", "Which bones protect the heart and lungs?", ["Ribs", "Skull", "Backbone", "Thigh bone"], "The ribs form a cage around the chest that protects the heart and lungs.", C(["🦴", "Ribs", "heart and lungs", 1], ["💀", "Skull", "brain"])],
  ["medium", "Which bone protects the brain?", ["Skull", "Ribs", "Backbone", "Hip bone"], "The skull is a hard bony box that protects the brain.", C(["💀", "Skull", "brain", 1], ["🦴", "Ribs", "heart and lungs"])],
  ["medium", "Day and night happen because the Earth ___.", ["spins on its axis", "goes around the Moon", "stops moving at night", "moves closer to the Sun"], "The Earth spins once every 24 hours. The side facing the Sun has day, and the other side has night.", F(["🌍", "Earth spins", "rotation"], ["🌗", "Day and night", "every 24 h", 1])],
  ["hard", "How long does the Earth take to go around the Sun once?", ["About 365 days", "24 hours", "30 days", "7 days"], "One trip around the Sun is called a revolution. It takes about 365 days, which is one year.", F(["🌍", "Earth", ""], ["☀️", "around Sun", ""], ["📅", "365 days", "1 year", 1])],
  ["medium", "What is the Moon?", ["Earth's natural satellite", "A star", "A planet", "A comet"], "The Moon goes around the Earth, so it is Earth's natural satellite. It has no light of its own.", F(["🌍", "Earth", ""], ["🌕", "Moon", "satellite", 1])],
  ["hard", "Why do we see different shapes (phases) of the Moon?", ["We see different amounts of its sunlit half", "The Moon changes size", "Clouds cover parts of it", "The Moon makes its own light"], "Half the Moon is always lit by the Sun. As it moves around the Earth, we see more or less of that lit half.", F(["🌑", "New", ""], ["🌓", "Half", ""], ["🌕", "Full", "", 1])],
  ["medium", "At what temperature does pure water boil?", ["100 °C", "0 °C", "50 °C", "212 °C"], "Pure water boils at 100 °C and freezes at 0 °C.", F(["🧊", "0 °C", "freezes"], ["💧", "Water", ""], ["♨️", "100 °C", "boils", 1])],
  ["hard", "Put the water cycle in order: clouds form, rain falls, water evaporates.", ["Evaporates → clouds form → rain falls", "Rain falls → evaporates → clouds form", "Clouds form → evaporates → rain falls", "Rain falls → clouds form → evaporates"], "The Sun heats water so it evaporates. The vapour cools and forms clouds (condensation). Then rain falls back down.", F(["☀️", "Evaporation", ""], ["☁️", "Condensation", ""], ["🌧️", "Rain", "", 1])],
  ["medium", "Which gas do plants take in to make food?", ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], "In photosynthesis, leaves take in carbon dioxide and give out oxygen.", F(["💨", "CO₂ in", "", 1], ["🍃", "Leaf", ""], ["🫧", "O₂ out", ""])],
  ["medium", "Which gas do we need to breathe in to stay alive?", ["Oxygen", "Carbon dioxide", "Smoke", "Helium"], "We breathe in oxygen and breathe out carbon dioxide.", F(["🫧", "Oxygen in", "", 1], ["🫁", "Lungs", ""], ["💨", "CO₂ out", ""])],
  ["hard", "Why do leaves look green?", ["They contain chlorophyll", "They are painted by rain", "They contain sugar", "They reflect blue light"], "Leaves have a green pigment called chlorophyll. It traps sunlight to make food.", C(["🍃", "Chlorophyll", "green pigment", 1])],
  ["medium", "Which animal is adapted to live in very cold polar regions?", ["Polar bear", "Camel", "Lizard", "Peacock"], "A polar bear has thick white fur and a layer of fat that keep it warm in the snow.", C(["🐻‍❄️", "Polar bear", "thick fur, fat", 1], ["🐫", "Camel", "desert"])],
  ["medium", "What helps a duck swim easily?", ["Webbed feet", "Sharp claws", "Long tail", "A hump"], "A duck's toes are joined by skin (webbed). They push water like paddles.", C(["🦆", "Duck", "webbed feet", 1])],
  ["hard", "Which animal can live both on land and in water?", ["Frog", "Fish", "Cow", "Eagle"], "Frogs are amphibians. They breathe with lungs on land and through their moist skin in water.", C(["🐸", "Frog", "amphibian", 1], ["🐟", "Fish", "water only"])],
  ["medium", "A thermometer is used to measure ___.", ["Temperature", "Length", "Weight", "Time"], "A thermometer tells how hot or cold something is.", C(["🌡️", "Thermometer", "temperature", 1])],
  ["hard", "Which of these causes air pollution?", ["Smoke from vehicles", "Planting trees", "Riding a bicycle", "Solar panels"], "Smoke from vehicles and factories adds harmful gases to the air.", C(["🚗", "Vehicle smoke", "pollutes", 1], ["🌳", "Trees", "clean air"])],
  ["medium", "Which of these helps reduce pollution?", ["Using public transport", "Burning garbage", "Cutting trees", "Throwing plastic in rivers"], "Buses and trains carry many people at once, so fewer cars are on the road and less smoke is made.", C(["🚌", "Public transport", "less smoke", 1], ["🔥", "Burning garbage", "more smoke"])],
  ["hard", "What should you do first if someone gets a small burn?", ["Hold it under cool running water", "Put ice cream on it", "Rub it hard", "Cover it with butter"], "Cool running water for a few minutes stops the burn getting worse. Then tell an adult.", F(["🔥", "Small burn", ""], ["🚰", "Cool water", "", 1], ["🧑‍⚕️", "Tell an adult", ""])],
  ["medium", "Friction is a force that ___.", ["slows down moving things", "makes things float", "pulls things to the Earth", "attracts iron"], "Friction acts between two surfaces rubbing together and slows motion. Rough surfaces have more friction.", F(["⚽", "Rolling ball", ""], ["🟫", "Rough ground", ""], ["🛑", "Slows down", "", 1])],
  ["hard", "Why are tyres made with grooves?", ["To increase friction and grip the road", "To make them lighter", "To make them look nice", "To hold air"], "Grooves increase friction with the road, so the tyres grip better and don't slip.", C(["🛞", "Grooved tyre", "more grip", 1])],
  ["medium", "Opening a drawer is an example of a ___.", ["Pull", "Push", "Neither", "Magnetic force"], "We pull the handle towards us to open a drawer.", C(["🗄️", "Drawer", "pull", 1])],
  ["medium", "Kicking a football is an example of a ___.", ["Push", "Pull", "Friction", "Neither"], "Kicking moves the ball away from us, which is a push.", C(["⚽", "Kick", "push", 1])],
  ["hard", "Which of these is a luminous object (makes its own light)?", ["A burning candle", "The Moon", "A mirror", "A book"], "Luminous objects make their own light. The Moon and mirrors only reflect light.", C(["🕯️", "Candle", "luminous", 1], ["🌕", "Moon", "reflects"])],
  ["medium", "What do we call animals that are active at night?", ["Nocturnal", "Herbivores", "Aquatic", "Amphibians"], "Animals like owls and bats sleep in the day and are active at night. They are nocturnal.", C(["🦉", "Owl", "nocturnal", 1], ["🦇", "Bat", "nocturnal", 1])],
  ["hard", "Which part of the plant takes in water and minerals from the soil?", ["Roots", "Leaves", "Flowers", "Fruits"], "Tiny root hairs soak up water and minerals from the soil.", { t: "plant", hl: "root" }],
  ["medium", "Which part of a flower becomes the fruit?", ["Ovary", "Petal", "Sepal", "Stem"], "After pollination, the ovary of the flower grows into a fruit, and the ovules become seeds.", F(["🌸", "Flower", ""], ["🫛", "Ovary grows", ""], ["🍎", "Fruit", "", 1])],
  ["hard", "Bees help flowers by carrying ___ from one flower to another.", ["Pollen", "Water", "Soil", "Leaves"], "Bees carry pollen between flowers. This pollination helps flowers make seeds and fruits.", F(["🌼", "Flower", ""], ["🐝", "Bee carries pollen", "", 1], ["🌸", "Flower", ""])],
];

G[4].nso = Q => {
  S4.forEach(([d, q, o, e, v]) => Q(d, q, o, e, v));
  const em = n => (A(n) || {}).e || "🐾";
  for (const [kind, list] of Object.entries(DIET)) list.forEach(a => {
    const others = Object.entries(DIET).filter(([k]) => k !== kind).flatMap(([, l]) => l);
    Q(kind === "herbivore" ? "easy" : kind === "carnivore" ? "medium" : "hard", `Which of these is ${an(kind)}?`, [cap1(a), ...pickN(others, 3).map(cap1)], `${cap1(kind)}s eat ${kind === "herbivore" ? "only plants" : kind === "carnivore" ? "only other animals" : "both plants and animals"}. ${cap1(an(a))} is ${an(kind)}.`, C([em(a), cap1(a), kind, 1], ["🌿", "Herbivore", "plants"], ["🥩", "Carnivore", "meat"], ["🍽️", "Omnivore", "both"]));
    Q(kind === "omnivore" ? "medium" : "easy", `${cap1(an(a))} is a/an ___.`, ["herbivore", "carnivore", "omnivore", "insectivore"].sort((x, y) => (y === kind) - (x === kind)), `${cap1(an(a))} eats ${kind === "herbivore" ? "plants" : kind === "carnivore" ? "other animals" : "both plants and animals"}, so it is ${an(kind)}.`, C([em(a), cap1(a), kind, 1]));
  });
  for (const [kind, list] of Object.entries(BIRTH)) list.forEach(a => {
    const tricky = ["whale", "bat", "dolphin"].includes(a);
    Q(tricky ? "hard" : "medium", kind === "eggs" ? "Which of these animals lays eggs?" : "Which of these animals gives birth to babies?", [cap1(a), ...pickN(BIRTH[kind === "eggs" ? "babies" : "eggs"], 3).map(cap1)], kind === "eggs" ? `${cap1(an(a))} lays eggs, and its young hatch from them.` : `${cap1(an(a))} gives birth to babies and feeds them milk.${tricky ? ` Even though it ${a === "bat" ? "flies" : "lives in water"}, it is a mammal.` : ""}`, C([em(a), cap1(a), kind === "eggs" ? "lays eggs" : "gives birth", 1]));
  });
  const organs = [...new Set(BREATHE.map(b => b[1]))];
  BREATHE.forEach(([a, o]) => Q(["whale", "dolphin", "earthworm", "tadpole"].includes(a) ? "hard" : "medium", `How does ${an(a)} breathe?`, words(`Through ${o}`, organs.map(x => "Through " + x)), `${cap1(an(a))} breathes through ${o}.${a === "whale" || a === "dolphin" ? " It lives in water but comes up to the surface to breathe air." : ""}`, C([em(a), cap1(a), o, 1])));
  const parts = Object.keys(EATEN);
  for (const [part, list] of Object.entries(EATEN)) list.forEach(p => Q(part === "stem" || p === "tomato" || p === "cucumber" || p === "brinjal" ? "hard" : "medium", `When we eat ${p}, which part of the plant are we eating?`, words(cap1(part), parts.map(cap1)), `In ${p} we eat the ${part}.${part === "stem" ? " It grows underground or tall, but it has buds (eyes) or nodes, which roots don't." : ""}`, C(["🌱", cap1(p), part, 1], ...pickN(Object.entries(EATEN).filter(([k]) => k !== part), 2).map(([k, l]) => ["", cap1(l[0]), k]))));
  const ways = Object.keys(DISPERSE);
  for (const [w, list] of Object.entries(DISPERSE)) list.forEach(p => Q("hard", `How are the seeds of ${p} spread?`, words(`By ${w}`, ways.map(x => "By " + x)), `${cap1(p)} seeds are spread by ${w}.${w === "wind" ? " They are light or have hairs or wings." : w === "water" ? " They float." : w === "animals" ? " They have hooks that stick to fur." : " The pods burst open and throw them out."}`, C(["🌱", cap1(p), w, 1])));
  for (const [n, list] of Object.entries(NUTRI)) list.forEach(f => {
    const others = Object.entries(NUTRI).filter(([k]) => k !== n).flatMap(([, l]) => l);
    Q("medium", `Which food is rich in ${n}?`, [cap1(f), ...pickN(others, 3).map(cap1)], `${cap1(f)} is rich in ${n}, which ${n === "carbohydrates" ? "give us energy" : n === "proteins" ? "help us grow and repair the body" : "give us lots of energy and keep us warm"}.`, C(["🍽️", cap1(f), n, 1], ...pickN(Object.entries(NUTRI).filter(([k]) => k !== n), 2).map(([k, l]) => ["", cap1(l[0]), k])));
  });
  VITAMINS.forEach(([v, dis, src]) => {
    Q("hard", `Lack of which nutrient causes ${dis}?`, words(v, VITAMINS.map(x => x[0])), `${v} deficiency causes ${dis}. We get ${v} from ${src}.`, F(["❌", `No ${v}`, ""], ["🤒", dis, "", 1], ["✅", "Fix", src]));
    Q("medium", `Which of these is a good source of ${v}?`, [cap1(src), ...pickN(VITAMINS.filter(x => x[0] !== v).map(x => cap1(x[2])), 3)], `${cap1(src)} give${src.endsWith("s") || src.includes(" and ") ? "" : "s"} us ${v}.`, C(["🥗", cap1(src), v, 1]));
  });
  ORGANS.forEach(([e, o, job]) => {
    Q("easy", `Which part of the body is used for ${job}?`, words(cap1(o), ORGANS.map(x => cap1(x[1]))), `The ${o} ${o === "lungs" || o === "kidneys" ? "are" : "is"} used for ${job}.`, C([e, cap1(o), job, 1]));
    Q("medium", `What is the main job of the ${o}?`, words(cap1(job), ORGANS.map(x => cap1(x[2]))), `The main job of the ${o} is ${job}.`, C([e, cap1(o), job, 1]));
  });
  TEETH.forEach(([t, job, where]) => {
    Q("medium", `Which teeth ${job}?`, words(cap1(t), TEETH.map(x => cap1(x[0]))), `${cap1(t)} (${where}) ${job}.`, C(...TEETH.map(x => ["🦷", cap1(x[0]), x[1], x[0] === t])));
    Q("hard", `What is the main job of the ${t}?`, words(cap1(job), TEETH.map(x => cap1(x[1]))), `${cap1(t)} are ${where}. They ${job}.`, C(...TEETH.map(x => ["🦷", cap1(x[0]), x[1], x[0] === t])));
  });
  for (const [st, list] of Object.entries(STATES)) list.forEach(x => {
    const others = Object.entries(STATES).filter(([k]) => k !== st).flatMap(([, l]) => l);
    Q("easy", `Which of these is a ${st}?`, [cap1(x), ...pickN(others, 3).map(cap1)], `${cap1(x)} is a ${st}. ${st === "solid" ? "Solids keep their own shape." : st === "liquid" ? "Liquids flow and take the shape of their container." : "Gases spread out to fill all the space they get."}`, C(["🧊", "Solid", "fixed shape", st === "solid"], ["💧", "Liquid", "flows", st === "liquid"], ["💨", "Gas", "fills space", st === "gas"]));
  });
  CHANGES.forEach(([c, what, ex]) => {
    Q("medium", `What is the change from ${what} called?`, words(cap1(c), CHANGES.map(x => cap1(x[0]))), `${cap1(c)} is the change from ${what}, like ${ex}.`, F(["", what.split(" to ")[0], ""], ["", cap1(c), "", 1], ["", what.split(" to ")[1], ""]));
    Q("hard", `${cap1(ex)} is an example of ___.`, words(cap1(c), CHANGES.map(x => cap1(x[0]))), `That is ${c}: a change from ${what}.`, F(["", what.split(" to ")[0], ""], ["", cap1(c), "", 1], ["", what.split(" to ")[1], ""]));
  });
  PFACTS.forEach(([f, i]) => Q("medium", `Which planet is ${f}?`, words(PLANETS[i], PLANETS), `${PLANETS[i]} is ${f}.`, { t: "planets", hl: i }));
  PLANETS.forEach((p, i) => Q(i === 0 || i === 2 ? "easy" : "hard", `Counting from the Sun, which planet is number ${i + 1}?`, words(p, PLANETS), `In order from the Sun: ${PLANETS.slice(0, i + 1).join(", ")}. So planet ${i + 1} is ${p}.`, { t: "planets", hl: i }));
  for (const [k, list] of Object.entries(COND)) list.forEach(x => Q("medium", `Which of these is a good ${k === "conductors" ? "conductor" : "insulator"} of electricity?`, [cap1(x), ...pickN(COND[k === "conductors" ? "insulators" : "conductors"], 3).map(cap1)], k === "conductors" ? `${cap1(x)} is a metal, so electricity flows through it easily.` : `${cap1(x)} does not let electricity pass, so it keeps us safe from shocks.`, C(["⚡", cap1(x), k.slice(0, -1), 1])));
  MAGNET.yes.forEach(x => Q("medium", "Which of these will a magnet pull (attract)?", [cap1(x), ...pickN(MAGNET.no, 3).map(cap1)], `Magnets attract things made of iron or steel, like ${x}.`, C(["🧲", cap1(x), "attracted", 1])));
  MAGNET.no.forEach(x => Q(x.includes("copper") || x.includes("aluminium") ? "hard" : "medium", "Which of these will a magnet NOT attract?", [cap1(x), ...pickN(MAGNET.yes, 3).map(cap1)], `Magnets attract only iron, steel, nickel and cobalt. ${cap1(x)} is not attracted${x.includes("copper") || x.includes("aluminium") ? ", even though it is a metal" : ""}.`, C(["🧲", cap1(x), "not attracted", 1])));
  const mnames = MACHINES.map(m => m[0]);
  MACHINES.forEach(([m, ex]) => ex.forEach(x => Q("hard", `${cap1(an(x))} is an example of which simple machine?`, words(cap1(m), mnames.map(cap1)), `${cap1(an(x))} works as ${an(m)}.`, m === "lever" ? { t: "lever" } : C(["⚙️", cap1(m), x, 1]))));
  INSTR.forEach(([i, use, e]) => {
    Q(i === "rain gauge" || i === "stethoscope" ? "hard" : "easy", `What is ${an(i)} used for?`, words(cap1(use), INSTR.map(x => cap1(x[1]))), `${cap1(an(i))} is used ${use}.`, C([e, cap1(i), use, 1]));
    Q("medium", `Which instrument is used ${use}?`, words(cap1(i), INSTR.map(x => cap1(x[0]))), `We use ${an(i)} ${use}.`, C([e, cap1(i), use, 1]));
  });
  for (const [k, list] of Object.entries(ENERGY)) list.forEach(x => Q("hard", `Which of these is a ${k} source of energy?`, [cap1(x), ...ENERGY[k === "renewable" ? "non-renewable" : "renewable"].map(cap1)], k === "renewable" ? `${cap1(x)} will never run out, so it is renewable.` : `${cap1(x)} took millions of years to form and will run out, so it is non-renewable.`, C(["⚡", cap1(x), k, 1])));
};
