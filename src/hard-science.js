// Olympiad-level NSO questions, following the SOF NSO syllabus for classes 1 and 4
// (logical reasoning, science topics and an achievers-style application section).
// Authored rows are [emoji, question, answer, [three wrong options], explanation].
const AUTH = (Q, rows) => rows.forEach(([em, q, a, w, e]) => Q("top", q, [a, ...w], e, C([em, a, "✓", 1])));
const byGroup = groups => Object.entries(groups).flatMap(([k, arr]) => arr.map(x => [x, k]));
const plain = groups => Object.fromEntries(Object.entries(groups).map(([k, arr]) => [k, arr.map(x => Array.isArray(x) ? x[1] : x)]));

// "Taller than" puzzles: a hidden order, clues for each neighbouring pair, then a question.
const ORDER_REL = [["taller", "tallest", "shortest"], ["heavier", "heaviest", "lightest"], ["older", "oldest", "youngest"], ["faster", "fastest", "slowest"]];
function orderQs(Q, n, size) {
  for (let k = 0; k < n; k++) {
    const kids = pickN(KIDS, size), [more, most, least] = pick(ORDER_REL);   // kids[0] is the most
    const clues = mix(kids.slice(0, -1).map((p, i) => `${p} is ${more} than ${kids[i + 1]}.`));
    const ask = size === 3 ? pick([0, 2]) : pick([0, size - 1, 1, size - 2]);
    const word = ask === 0 ? `the ${most}` : ask === size - 1 ? `the ${least}` : ask === 1 ? `the second ${most}` : `the second ${least}`;
    Q("top", `${clues.join(" ")} Who is ${word}?`, [kids[ask], ...kids.filter((_, i) => i !== ask).slice(0, 3)],
      `Put them in order from ${most} to ${least}: ${kids.join(" → ")}. So ${kids[ask]} is ${word}.`, F(...kids.map((p, i) => ["", p, i === 0 ? most : i === size - 1 ? least : "", i === ask])));
  }
}
// Emoji patterns for young children.
const PAT_SETS = [["🍎", "🍌", "🍇", "🍓"], ["🐶", "🐱", "🐰", "🐸"], ["🌞", "🌙", "⭐", "☁️"], ["🌸", "🍃", "🌳", "🌵"], ["🚗", "🚌", "🚲", "✈️"]];
const PAT_RULES = ["ABB", "AAB", "ABC", "AABB", "ABCC", "ABAC", "ABCB"];
function patternQs(Q, n) {
  for (let k = 0; k < n; k++) {
    const set = pick(PAT_SETS), rule = pick(PAT_RULES), len = rule.length, map = mix(set), start = ri(0, len - 1);
    const seq = Array.from({ length: len * 2 + 1 }, (_, i) => map["ABCD".indexOf(rule[(start + i) % len])]);
    const shown = seq.slice(0, -1), ans = seq[seq.length - 1];
    Q("top", `What comes next in the pattern?\n${shown.join(" ")} __`, [ans, ...set.filter(x => x !== ans)],
      `The pattern repeats in groups of ${len}: ${seq.slice(0, len).join(" ")}. Keep repeating it and the next one is ${ans}.`, { t: "seq", items: seq.slice(-len - 1), hl: len });
  }
}
// Leg-counting puzzles.
const LEGGED = ANIMALS.filter(a => a.legs != null && a.legs > 0 && !["frog", "kangaroo"].includes(a.n));
function legQs(Q, n) {
  for (let k = 0; k < n; k++) {
    const [a, b] = pickN(LEGGED.filter(x => x.legs !== 4 || R() < .5), 2); if (!b || a.legs === b.legs) continue;
    const na = ri(2, 4), nb = ri(1, 3), ans = na * a.legs + nb * b.legs, pl = (m, x) => m > 1 ? (x.n === "sheep" || x.n === "fish" ? x.n : x.n === "mouse" ? "mice" : x.n.endsWith("y") ? x.n.slice(0, -1) + "ies" : x.n + "s") : x.n;
    Q("top", `How many legs do ${na} ${pl(na, a)} and ${nb} ${pl(nb, b)} have altogether?`, nums(ans, [na * a.legs + nb, (na + nb) * a.legs, ans + 2]),
      `${cap1(an(a.n))} has ${a.legs} legs and ${an(b.n)} has ${b.legs} legs. ${na} × ${a.legs} + ${nb} × ${b.legs} = ${na * a.legs} + ${nb * b.legs} = ${ans}.`, C([a.e, `${na} × ${a.legs}`, `${na * a.legs} legs`], [b.e, `${nb} × ${b.legs}`, `${nb * b.legs} legs`], ["", "Total", `${ans}`, 1]));
  }
}

const NSO1 = [
  ["🌱", "A seed is watered and kept in a dark cupboard for two weeks. What will most likely happen?", "It sprouts, but the young plant is pale yellow and weak", ["It grows into a strong green plant", "It turns into a stone", "Nothing ever happens to it"], "A seed can sprout using the food stored inside it. But a green plant needs sunlight to make more food, so in the dark it grows pale and weak."],
  ["🐸", "Which animal lives both on land and in water?", "Frog", ["Fish", "Cow", "Sparrow"], "A frog lays eggs in water and its tadpoles live in water. Grown frogs can also hop about on land."],
  ["🦇", "Which animal gives birth to babies (does not lay eggs) and can also fly?", "Bat", ["Sparrow", "Butterfly", "Eagle"], "Birds and butterflies lay eggs. A bat is a mammal: it gives birth to babies and feeds them milk, yet it can fly."],
  ["🐬", "Which animal lives in water but comes up to breathe air?", "Dolphin", ["Fish", "Octopus", "Crab"], "Fish, octopus and crabs breathe in water with gills. A dolphin has lungs, so it must come up to the surface to breathe air."],
  ["🌵", "Which plant stores water in its thick, fleshy stem and grows in the desert?", "Cactus", ["Lotus", "Mango tree", "Money plant"], "A cactus stores water in its stem. Its leaves are spines, so it loses very little water in the hot desert."],
  ["🪷", "Which plant has broad leaves that float on water?", "Lotus", ["Cactus", "Neem", "Rose"], "The lotus grows in ponds. Its big, flat leaves float on the water."],
  ["🥕", "We eat the ___ of a carrot and the ___ of spinach.", "root, leaves", ["stem, roots", "leaves, flowers", "fruit, stem"], "A carrot is the root of the plant. In spinach we eat the green leaves."],
  ["🎋", "Which of these do we get from the stem of a plant?", "Sugar from sugarcane", ["Rice", "Apple", "Peas"], "Sugarcane is a thick, juicy stem. Its juice is used to make sugar. Rice and peas are seeds; an apple is a fruit."],
  ["🍅", "Which of these is really a fruit, though many people call it a vegetable?", "Tomato", ["Potato", "Carrot", "Spinach"], "A tomato grows from a flower and has seeds inside, so it is a fruit. A potato is a stem, a carrot is a root and spinach is leaves."],
  ["🔊", "Which of these is NOT a need of all living things?", "Toys", ["Food", "Water", "Air"], "Every living thing needs food, water and air to stay alive. Toys are nice, but not needed to live."],
  ["🚗", "A toy car can move and make sounds. Why is it still a non-living thing?", "It cannot grow, eat or breathe", ["It has wheels", "It is made of plastic", "It is very small"], "Living things grow, eat, breathe and have young ones. A toy car moves only when a battery or a hand moves it."],
  ["🌳", "Which living thing cannot move from one place to another on its own?", "Tree", ["Dog", "Fish", "Bird"], "Plants are living, but they stay fixed in one place with their roots. Animals can move about."],
  ["☁️", "Which of these is NOT a living thing?", "Cloud", ["Mushroom", "Ant", "Grass"], "A cloud can move and change size, but it does not eat, breathe or have babies. Mushrooms, ants and grass are all living."],
  ["✋", "Ravi touched a hot pan by mistake. Which sense organ felt the heat?", "Skin", ["Eyes", "Nose", "Tongue"], "Our skin feels heat, cold, touch and pain."],
  ["👃", "How can we tell that milk has gone sour without tasting it?", "By smelling it with the nose", ["By looking at the glass", "By listening to it", "By touching the glass"], "Sour milk smells bad. The nose warns us before we taste it."],
  ["🦷", "How many milk teeth does a young child usually have?", "20", ["32", "10", "28"], "Children have 20 milk teeth. Later they fall out and up to 32 permanent teeth grow."],
  ["🪥", "Which habit keeps our teeth healthy?", "Brushing twice a day", ["Eating sweets at bedtime", "Drinking cola every day", "Biting pencils"], "Brushing in the morning and at night removes food and germs that cause cavities."],
  ["🧼", "Why should we wash our hands with soap before eating?", "To remove germs that can make us ill", ["To make our hands soft", "To make the food sweet", "To keep our hands warm"], "Germs on our hands can get into food and our mouth. Soap and water wash them away."],
  ["🚸", "Where is the safest place to cross a busy road?", "At the zebra crossing", ["Between parked cars", "At a sharp turn", "Anywhere, if you run fast"], "Drivers expect people at a zebra crossing. Look left, right and left again before crossing."],
  ["🚦", "What does a red traffic light tell cars to do?", "Stop", ["Go", "Go faster", "Turn around"], "Red means stop, yellow means get ready and green means go."],
  ["🔥", "If your clothes catch fire, what should you do?", "Stop, drop and roll", ["Run as fast as you can", "Jump up and down", "Open all the windows"], "Running fans the flames. Stopping, dropping to the ground and rolling smothers the fire."],
  ["⚽", "Which of these is safe for a child to play with?", "A ball", ["A matchbox", "A sharp knife", "An electric plug"], "Matches, knives and electric plugs can burn, cut or give a shock."],
  ["🤧", "Which of these is a good habit?", "Covering your mouth when you sneeze", ["Spitting on the road", "Throwing wrappers on the floor", "Sleeping very late every night"], "Covering a sneeze stops germs from spreading to other people."],
  ["🌬️", "We cannot see air. How do we know air is around us?", "We feel it when the wind blows", ["It has a bright colour", "It smells of roses", "We can hold it in our hands"], "Air has no colour, but we can feel moving air (wind) and see it move leaves and kites."],
  ["🎈", "What fills a balloon when we blow into it?", "Air", ["Water", "Sand", "Light"], "Our breath is air. Air takes up space, so the balloon swells."],
  ["🪁", "Which of these needs moving air (wind) to work?", "A kite", ["A torch", "A book", "A spoon"], "A kite flies only when the wind lifts it."],
  ["🐫", "Which animal can live for many days without drinking water?", "Camel", ["Dog", "Hen", "Cow"], "A camel can go for many days without water. That helps it live in the hot desert."],
  ["🧊", "What turns water into ice in a freezer?", "Cold", ["Heat", "Wind", "Light"], "When water becomes very cold, it freezes into solid ice."],
  ["👕", "On which kind of day do wet clothes dry the fastest?", "A sunny, windy day", ["A rainy day", "A cold, still day", "A cloudy, still day"], "The Sun's heat and moving air make water evaporate (go into the air) faster."],
  ["🏞️", "Which of these is a natural source of water?", "River", ["Tap", "Water tank", "Bottle"], "Rivers, lakes, rain and the sea are natural. Taps and tanks are made by people."],
  ["🚰", "Why should we not waste water?", "Clean water is limited", ["Water is made in factories", "Water never runs out", "Water makes us ill"], "Only a small part of Earth's water is clean enough to drink, so we must save it."],
  ["🧣", "In which season do we wear woollen clothes?", "Winter", ["Summer", "Rainy season", "Spring"], "Wool keeps our body warm in the cold winter."],
  ["☂️", "In which season do we need an umbrella and a raincoat the most?", "Rainy season", ["Summer", "Winter", "Spring"], "It rains a lot in the rainy (monsoon) season."],
  ["🌈", "When are we most likely to see a rainbow?", "When the Sun shines just after rain", ["At midnight", "On a foggy night", "Inside a dark room"], "Sunlight shining through tiny raindrops splits into seven colours and makes a rainbow."],
  ["☀️", "Which is the star nearest to the Earth?", "The Sun", ["The Moon", "The Pole Star", "Mars"], "The Sun is a star. It is the closest star to us, which is why it looks so big and bright."],
  ["🌕", "Why does the Moon look bright at night?", "It reflects the Sun's light", ["It has its own light", "It is on fire", "It has big bulbs on it"], "The Moon has no light of its own. Sunlight bounces off it, like light off a mirror."],
  ["🌙", "Which of these does NOT give out its own light?", "The Moon", ["The Sun", "A firefly", "A candle flame"], "The Sun, a firefly and a flame make their own light. The Moon only reflects sunlight."],
  ["🌍", "Why do we have day and night?", "The Earth keeps spinning", ["The Sun switches off", "Clouds cover the Sun", "The Moon hides the Sun"], "As the Earth spins, the side facing the Sun has day and the other side has night."],
  ["🕛", "When is your shadow the shortest on a sunny day?", "At noon", ["Early morning", "In the evening", "At sunset"], "At noon the Sun is high overhead, so shadows are short. In the morning and evening the Sun is low and shadows are long."],
  ["🦎", "Which animal can change the colour of its skin to hide?", "Chameleon", ["Dog", "Cow", "Hen"], "A chameleon changes colour to match its surroundings so enemies cannot see it."],
  ["🦩", "Which bird cannot fly but can run very fast?", "Ostrich", ["Sparrow", "Eagle", "Parrot"], "The ostrich is the biggest bird. It is too heavy to fly but runs very fast."],
  ["🦘", "Which animal carries its baby in a pouch?", "Kangaroo", ["Elephant", "Monkey", "Cow"], "A baby kangaroo (joey) grows inside a pouch on its mother's belly."],
  ["🐻", "Which animal sleeps through the cold winter?", "Bear", ["Cow", "Hen", "Horse"], "Some bears sleep for most of winter in their dens. This long winter sleep is called hibernation."],
  ["🐜", "Which of these is an insect?", "Ant", ["Spider", "Earthworm", "Snail"], "Insects have 6 legs. A spider has 8 legs, and earthworms and snails have none."],
  ["🐫", "Which animal is called the 'ship of the desert'?", "Camel", ["Horse", "Elephant", "Donkey"], "A camel carries people and loads across hot sand, like a ship crosses the sea."],
  ["🐘", "Which animal uses its trunk to pick up food and drink water?", "Elephant", ["Giraffe", "Rhinoceros", "Horse"], "An elephant's trunk is its long nose. It can lift food and suck up water."],
  ["🥚", "Which group has ONLY animals that lay eggs?", "Hen, snake, frog", ["Cow, hen, dog", "Cat, duck, goat", "Horse, sparrow, lizard"], "Hens, snakes and frogs all lay eggs. Cows, dogs, cats, goats and horses give birth to babies."],
  ["🌿", "Which group has ONLY plant-eating animals?", "Cow, goat, rabbit", ["Lion, cow, goat", "Tiger, deer, horse", "Rabbit, wolf, sheep"], "Cows, goats and rabbits eat only plants. Lions, tigers and wolves eat meat."],
  ["🪑", "Which group has ONLY non-living things?", "Chair, stone, pencil", ["Chair, ant, stone", "Tree, pencil, cup", "Book, bird, ball"], "Ants, trees and birds are living. A chair, a stone and a pencil are not."],
  ["🌿", "Which of these plants is a climber?", "Money plant", ["Mango tree", "Rose", "Grass"], "A climber has a weak stem and climbs up a support, like a money plant."],
  ["👕", "Which plant gives us fibre to make soft clothes?", "Cotton", ["Neem", "Sugarcane", "Mango"], "Cotton fibre from the cotton plant is spun into thread for clothes."],
  ["🫘", "Which of these do we eat as a pulse (dal)?", "Moong", ["Mango", "Carrot", "Ginger"], "Moong is a seed we cook as dal. Pulses give us protein."],
  ["🔇", "Which of these does a plant NOT need to grow?", "Noise", ["Sunlight", "Water", "Air"], "Plants need sunlight, water, air and soil. Noise does not help them grow."],
  ["🍂", "The leaves of a plant kept in a dark room for many days turn ___.", "yellow", ["dark green", "blue", "red"], "Without sunlight a plant cannot make its green colour, so the leaves turn yellow."],
  ["👕", "Why do we wear cotton clothes in summer?", "They soak up sweat and keep us cool", ["They keep us very warm", "They stop rain", "They make us shine"], "Cotton is light and soaks up sweat, so we feel cool on hot days."],
  ["🧊", "Which kind of house is made of blocks of ice?", "Igloo", ["Tent", "Hut", "Houseboat"], "In very cold, snowy places people once built igloos from blocks of hard snow and ice."],
  ["⛺", "Which house can be folded and carried from place to place?", "Tent", ["Igloo", "Brick house", "Stilt house"], "A tent is made of cloth and poles, so it can be packed and carried."],
  ["🏠", "Which house is built on tall poles to stay above flood water?", "Stilt house", ["Igloo", "Tent", "Caravan"], "In places with heavy rain and floods, houses are raised on poles called stilts."],
  ["🛶", "Which house floats on water?", "Houseboat", ["Igloo", "Hut", "Stilt house"], "A houseboat is a boat that people live in, like the houseboats on Dal Lake in Kashmir."],
  ["🧭", "Which instrument shows which way the wind is blowing?", "Wind vane", ["Thermometer", "Clock", "Weighing scale"], "A wind vane turns with the wind and points in the direction the wind comes from."],
  ["🥵", "Why do we feel very thirsty on a hot day?", "Our body loses water as sweat", ["Hot air is full of water", "The Sun makes us hungry", "We stop breathing"], "We sweat to cool down. We must drink water to replace what we lose."],
  ["🌗", "Which of these seems to change its shape from night to night during a month?", "The Moon", ["The Sun", "The Earth", "A star"], "We see a different part of the sunlit Moon each night, so it looks round, half or thin like a curve."],
  ["🐝", "Bees help plants by ___.", "carrying pollen from flower to flower", ["eating their roots", "making their leaves", "watering them"], "As bees collect nectar, pollen sticks to them and they carry it to other flowers. This helps make fruits and seeds."],
  ["🐄", "Which group shows things we get from animals?", "Milk, wool, honey", ["Milk, cotton, rice", "Wool, wheat, eggs", "Honey, sugar, jute"], "Milk comes from cows, wool from sheep and honey from bees. Cotton, rice, wheat, sugar and jute come from plants."],
  ["🦴", "Which body part is hard and gives our body its shape?", "Bones", ["Blood", "Hair", "Skin"], "Bones join to make a skeleton that holds us up and gives our body its shape."],
  ["🫁", "Which body part do we use to breathe?", "Lungs", ["Stomach", "Heart", "Brain"], "Our lungs take in air when we breathe in and let it out when we breathe out."],
  ["🍽️", "Why do we need food?", "To get energy to work and play", ["To feel sleepy", "To make us cold", "To change our hair colour"], "Food gives us energy and helps us grow and stay healthy."],
  ["🌡️", "Which thing measures how hot or cold it is?", "Thermometer", ["Ruler", "Clock", "Weighing scale"], "A thermometer measures temperature."],
  ["🌊", "Most of the Earth's surface is covered by ___.", "water", ["sand", "ice", "forests"], "About three-fourths of the Earth's surface is water: oceans, seas, rivers and lakes."],
  ["🍯", "Which animal makes honey?", "Honeybee", ["Butterfly", "Ant", "Spider"], "Honeybees collect nectar from flowers and turn it into honey in their hive."],
  ["🐣", "What comes out of a hen's egg?", "A chick", ["A duckling", "A kitten", "A puppy"], "A hen sits on her eggs to keep them warm, and a chick hatches out."],
  ["🦉", "Which bird stays awake at night and sleeps in the day?", "Owl", ["Crow", "Sparrow", "Hen"], "Owls can see well in the dark, so they hunt at night."],
];

const NSO4 = [
  ["🍽️", "In which part of the digestive system is the digestion of food completed?", "Small intestine", ["Stomach", "Mouth", "Large intestine"], "Digestion starts in the mouth and continues in the stomach. It is completed in the small intestine, where digested food goes into the blood."],
  ["💧", "Where is most of the water absorbed from undigested food?", "Large intestine", ["Small intestine", "Food pipe", "Mouth"], "The large intestine takes water back from the leftover food before it leaves the body as waste."],
  ["➡️", "Which is the correct path of food in our body?", "Mouth → food pipe → stomach → small intestine → large intestine", ["Mouth → stomach → food pipe → small intestine → large intestine", "Mouth → food pipe → large intestine → stomach → small intestine", "Mouth → small intestine → stomach → food pipe → large intestine"], "Food is chewed in the mouth, goes down the food pipe to the stomach, then to the small intestine and finally the large intestine."],
  ["👅", "Which liquid in the mouth starts the digestion of food?", "Saliva", ["Bile", "Blood", "Urine"], "Saliva wets food and starts breaking down starch, which is why chewed rice starts to taste sweet."],
  ["🫃", "Which tube carries food from the mouth to the stomach?", "Food pipe (oesophagus)", ["Windpipe", "Small intestine", "Blood vessel"], "The food pipe carries food down to the stomach. The windpipe carries air to the lungs."],
  ["🟤", "Which organ makes bile, which helps digest fats?", "Liver", ["Heart", "Lungs", "Kidney"], "The liver is the largest gland in the body. It makes bile."],
  ["🍚", "Which nutrient is the main source of energy for our body?", "Carbohydrates", ["Vitamins", "Minerals", "Water"], "Rice, bread and potatoes are rich in carbohydrates, which give us energy."],
  ["💪", "Which nutrient builds and repairs the body (body-building food)?", "Proteins", ["Carbohydrates", "Fats", "Roughage"], "Proteins from dal, eggs, milk and paneer help us grow and repair the body."],
  ["🥬", "Roughage (fibre) in our food helps us to ___.", "pass out undigested food easily", ["get quick energy", "build strong muscles", "see better at night"], "Roughage does not give energy, but it keeps food moving through the intestines and prevents constipation."],
  ["⚖️", "What is a balanced diet?", "Food with all nutrients in the right amounts", ["Food with only fruits", "Food with only proteins", "Food with lots of fat and sugar"], "A balanced diet has carbohydrates, proteins, fats, vitamins, minerals, roughage and water in the right amounts."],
  ["🫙", "Pickles are kept from spoiling mainly by adding ___.", "salt and oil", ["water", "ice", "milk"], "Salt and oil stop the growth of germs, so pickles last for months."],
  ["🦷", "How many permanent teeth does an adult usually have?", "32", ["20", "28", "36"], "Adults have up to 32 permanent teeth, including the wisdom teeth."],
  ["🦷", "What is the hard, white outer layer of a tooth called?", "Enamel", ["Gum", "Root", "Pulp"], "Enamel is the hardest substance in our body. It protects the tooth."],
  ["🌿", "What is the process by which green plants make their own food?", "Photosynthesis", ["Respiration", "Digestion", "Evaporation"], "Using sunlight, chlorophyll, water and carbon dioxide, green leaves make food. This is photosynthesis."],
  ["🫧", "Which gas do plants take in from the air to make food?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Hydrogen"], "Leaves take in carbon dioxide through tiny pores and use it to make food."],
  ["🌬️", "Which gas do plants give out during photosynthesis?", "Oxygen", ["Carbon dioxide", "Nitrogen", "Smoke"], "Plants release oxygen while making food. That is the oxygen we breathe."],
  ["🍃", "Leaves are green because they contain ___.", "chlorophyll", ["starch", "water", "oxygen"], "Chlorophyll is a green pigment that traps sunlight for making food."],
  ["🕳️", "What are the tiny pores on a leaf through which plants exchange gases and lose water?", "Stomata", ["Veins", "Roots", "Petals"], "Stomata are tiny openings mostly on the underside of leaves."],
  ["💦", "What is the loss of water from the leaves of a plant called?", "Transpiration", ["Germination", "Pollination", "Photosynthesis"], "Plants lose extra water as water vapour from their leaves. This is transpiration."],
  ["🪴", "Why does the pitcher plant trap and eat insects?", "The soil it grows in lacks nitrogen", ["It has no leaves at all", "It cannot get any water", "It grows in total darkness"], "Pitcher plants grow in soil poor in nitrogen. They get it by digesting insects."],
  ["🪤", "Which of these is an insect-eating plant?", "Venus flytrap", ["Cactus", "Lotus", "Money plant"], "The Venus flytrap snaps its leaves shut on insects and digests them."],
  ["🌵", "Why are the leaves of a cactus changed into spines?", "To reduce the loss of water", ["To make food faster", "To soak up rain", "To help it float"], "Spines have very little surface, so little water is lost. They also protect the cactus from animals."],
  ["🪷", "The stem of a lotus is hollow and light. How does this help the plant?", "It helps the plant float on water", ["It helps it store sand", "It helps it catch insects", "It helps it grow in deserts"], "Air spaces in the hollow stem keep the lotus afloat."],
  ["🍄", "A mushroom has no chlorophyll. How does it get its food?", "From dead and rotting matter", ["By photosynthesis", "By catching insects", "From sunlight alone"], "Mushrooms are fungi. They take food from dead, decaying material."],
  ["🌱", "Which part of a plant carries water from the roots to the leaves?", "Stem", ["Flower", "Fruit", "Seed"], "The stem has thin tubes that carry water up from the roots to the leaves."],
  ["🌸", "Which part of a flower grows into a fruit?", "Ovary", ["Petal", "Sepal", "Stem"], "After pollination, the ovary of the flower grows into the fruit and the ovules become seeds."],
  ["🪟", "A potted plant kept near a window bends towards it. Why?", "Plants grow towards light", ["Plants like fresh air", "The window is cold", "Plants grow away from walls"], "Stems grow towards sunlight so the leaves get more light to make food."],
  ["🐍", "Which of these is a cold-blooded animal (its body temperature changes with its surroundings)?", "Snake", ["Dog", "Cow", "Sparrow"], "Reptiles like snakes and lizards are cold-blooded. Birds and mammals keep a steady body temperature."],
  ["🐻‍❄️", "Polar bears have thick white fur and a layer of fat. How does this help them?", "It keeps them warm and hidden in the snow", ["It helps them breathe underwater", "It helps them run fast in deserts", "It helps them climb trees"], "Fur and fat keep the bear warm, and white fur blends with snow."],
  ["🐫", "Which feature helps a camel live in the desert?", "It can go without water for many days", ["It has gills", "It sleeps through winter in water", "It eats only meat"], "Camels drink a lot at once and lose very little water, and their wide feet do not sink in sand."],
  ["🌾", "In the food chain Grass → Grasshopper → Frog → Snake, which is the producer?", "Grass", ["Grasshopper", "Frog", "Snake"], "A producer makes its own food. Green plants like grass are producers."],
  ["🦁", "In the food chain Grass → Deer → Lion, the lion is a ___.", "secondary consumer", ["producer", "primary consumer", "decomposer"], "The deer eats the producer (grass), so it is a primary consumer. The lion eats the deer, so it is a secondary consumer."],
  ["🍄", "Which living things break down dead plants and animals?", "Decomposers (bacteria and fungi)", ["Producers", "Herbivores", "Carnivores"], "Decomposers break dead things into simple substances that return to the soil."],
  ["⛓️", "Which of these is a correct food chain?", "Grass → Rabbit → Fox", ["Fox → Grass → Rabbit", "Rabbit → Grass → Fox", "Grass → Fox → Rabbit"], "A food chain starts with a plant. The rabbit eats grass and the fox eats the rabbit."],
  ["🐦", "Why does a woodpecker have a strong, pointed beak?", "To drill holes in tree bark to find insects", ["To crack hard nuts", "To catch fish", "To suck nectar"], "A woodpecker hammers into bark with its chisel-like beak to reach insects inside."],
  ["🦅", "Which bird has a sharp, hooked beak and strong claws (talons) to catch its prey?", "Eagle", ["Duck", "Sparrow", "Hen"], "Birds of prey like eagles tear meat with hooked beaks and grip prey with talons."],
  ["🦆", "Ducks have webbed feet. These help them to ___.", "swim", ["climb trees", "dig burrows", "catch insects in the air"], "The skin between the toes pushes water back like a paddle."],
  ["🦋", "Which animal grows through the stages egg → larva → pupa → adult?", "Butterfly", ["Frog", "Hen", "Cat"], "A butterfly's larva is the caterpillar and its pupa is the chrysalis. A frog goes egg → tadpole → frog."],
  ["🐧", "Which of these is NOT a mammal?", "Penguin", ["Whale", "Bat", "Dolphin"], "A penguin is a bird that lays eggs. Whales, bats and dolphins are mammals that feed their babies milk."],
  ["🐻", "What are animals that eat both plants and animals called?", "Omnivores", ["Herbivores", "Carnivores", "Producers"], "Bears, crows and humans eat both plant and animal food, so they are omnivores."],
  ["🦤", "Which of these animals is extinct (no longer alive anywhere)?", "Dodo", ["Tiger", "Peacock", "Rhinoceros"], "The dodo bird died out hundreds of years ago. Tigers and rhinos are endangered but still alive."],
  ["🐅", "Which is the national animal of India?", "Tiger", ["Lion", "Elephant", "Peacock"], "The Bengal tiger is India's national animal. The peacock is the national bird."],
  ["🦴", "How many bones are there in an adult human body?", "206", ["106", "306", "32"], "A baby is born with about 300 bones; some join together, leaving 206 in an adult."],
  ["🫀", "Which bones protect the heart and the lungs?", "The rib cage", ["The skull", "The thigh bone", "The kneecap"], "The ribs form a cage around the chest that protects the heart and lungs."],
  ["🧠", "Which bone protects the brain?", "Skull", ["Rib cage", "Backbone", "Hip bone"], "The skull is a hard box of bone around the brain."],
  ["🚪", "The joint at our knee lets the leg move only back and forth, like a door. What is it called?", "Hinge joint", ["Ball and socket joint", "Pivot joint", "Fixed joint"], "Knees and elbows are hinge joints. They bend in one direction, like a door on its hinges."],
  ["💪", "Which joint lets our arm move in a full circle at the shoulder?", "Ball and socket joint", ["Hinge joint", "Fixed joint", "Gliding joint"], "The round end of the arm bone sits in a cup-shaped socket, so the arm can turn in all directions."],
  ["🫘", "Which organs clean the blood and make urine?", "Kidneys", ["Lungs", "Liver", "Heart"], "The two kidneys filter waste out of the blood and make urine."],
  ["🧥", "Which is the largest organ of the human body?", "Skin", ["Liver", "Brain", "Heart"], "The skin covers the whole body, so it is our largest organ."],
  ["👂", "Apart from hearing, which sense organ also helps us keep our balance?", "Ears", ["Eyes", "Nose", "Tongue"], "The inner ear has fluid-filled tubes that tell the brain if we are tilting, so we stay balanced."],
  ["😮‍💨", "Which gas is there more of in the air we breathe out than in the air we breathe in?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Hydrogen"], "Our body uses oxygen and makes carbon dioxide, which we breathe out."],
  ["🧱", "Which state of matter has a fixed shape and a fixed volume?", "Solid", ["Liquid", "Gas", "Water vapour"], "A solid like a brick keeps its shape and size. Liquids take the shape of the container, and gases spread out."],
  ["💨", "Which state of matter has no fixed shape and no fixed volume?", "Gas", ["Solid", "Liquid", "Ice"], "A gas spreads out to fill whatever space it is in."],
  ["🥄", "Sugar seems to disappear when stirred into water. Why?", "It dissolves in water", ["It melts into steam", "It sinks and hides", "It turns into salt"], "Sugar breaks into tiny bits that spread through the water. The water tastes sweet, so the sugar is still there."],
  ["⏳", "Which of these does NOT dissolve in water?", "Sand", ["Salt", "Sugar", "Glucose"], "Sand settles at the bottom. Salt, sugar and glucose dissolve."],
  ["🧂", "How can we get salt back from salty water?", "By evaporating the water", ["By filtering it", "By using a magnet", "By sieving it"], "When the water is heated or left in the Sun, it evaporates and salt is left behind."],
  ["🧲", "How can iron pins mixed with sand be separated quickly?", "By using a magnet", ["By adding water", "By heating it", "By winnowing"], "A magnet pulls the iron pins out and leaves the sand behind."],
  ["🌾", "Farmers separate light husk from heavier grain with the help of wind. What is this called?", "Winnowing", ["Sieving", "Filtering", "Churning"], "In winnowing the wind blows the light husk away, while the heavier grain falls in a heap."],
  ["🧊", "Why does ice float on water?", "Ice is lighter than the same amount of water", ["Ice is heavier than water", "Ice has air bubbles only on top", "Water pushes ice down"], "Water expands when it freezes, so a cube of ice weighs less than the same-size cube of water. That is why it floats."],
  ["🧴", "Which of these is a man-made material?", "Plastic", ["Wood", "Cotton", "Wool"], "Plastic is made in factories. Wood and cotton come from plants and wool comes from sheep."],
  ["🫸", "What do we call a push or a pull on an object?", "Force", ["Energy", "Work", "Speed"], "Pushing a door or pulling a cart uses force."],
  ["🍎", "Which force pulls everything towards the Earth?", "Gravity", ["Friction", "Magnetic force", "Muscular force"], "Gravity is why a ball thrown up comes back down."],
  ["⚽", "Which force makes a rolling ball slow down and stop?", "Friction", ["Gravity alone", "Magnetic force", "Wind"], "Friction between the ball and the ground works against the motion."],
  ["🧽", "Why is it harder to walk on a wet, soapy floor than on a dry one?", "There is less friction on the soapy floor", ["There is more friction on the soapy floor", "Gravity is stronger there", "The floor is magnetic"], "Soap makes the floor smooth and slippery. Less friction means our feet slide."],
  ["💡", "What energy change happens in an electric bulb?", "Electrical energy to light and heat", ["Light to electrical energy", "Heat to sound", "Sound to light"], "A glowing bulb gives light and also gets hot."],
  ["🔆", "What do solar panels change sunlight into?", "Electricity", ["Wind", "Water", "Coal"], "Solar cells turn light from the Sun into electrical energy."],
  ["🧲", "What happens when the north poles of two magnets are brought close?", "They push each other away", ["They pull each other together", "Nothing happens", "Both magnets break"], "Like poles repel and unlike poles attract."],
  ["🧭", "A bar magnet hung freely by a thread always comes to rest pointing ___.", "north and south", ["east and west", "up and down", "towards the Sun"], "This is why a compass needle, a small magnet, shows directions."],
  ["🔇", "Sound cannot travel through ___.", "empty space (vacuum)", ["air", "water", "wood"], "Sound needs something to travel through. In space there is no air, so there is no sound."],
  ["⛈️", "We see lightning before we hear thunder. Why?", "Light travels much faster than sound", ["Sound travels faster than light", "Thunder happens later", "Our eyes are closer to the sky"], "Both happen together, but light reaches us almost at once while sound takes longer."],
  ["🏭", "Which of these causes air pollution?", "Smoke from vehicles and factories", ["Planting trees", "Riding a bicycle", "Using solar power"], "Smoke adds harmful gases and dust to the air."],
  ["♻️", "What are the 3 Rs for saving the environment?", "Reduce, Reuse, Recycle", ["Read, Write, Repeat", "Run, Rest, Relax", "Rain, River, Road"], "Use less, use things again, and turn waste into new things."],
  ["🛡️", "Which layer of gas high above the Earth protects us from harmful ultraviolet rays of the Sun?", "Ozone layer", ["Oxygen layer", "Cloud layer", "Smoke layer"], "The ozone layer absorbs most of the Sun's harmful UV rays."],
  ["🪓", "What is the cutting down of forests on a large scale called?", "Deforestation", ["Afforestation", "Irrigation", "Germination"], "Deforestation destroys animal homes and causes soil erosion. Planting trees is afforestation."],
  ["🍌", "Which of these wastes rots away easily (is biodegradable)?", "Fruit peels", ["Plastic bag", "Glass bottle", "Aluminium can"], "Bacteria and fungi break down fruit peels, but plastic and glass stay for hundreds of years."],
  ["🚰", "Which of these saves water?", "Turning off the tap while brushing", ["Washing the car with a running hose", "Leaving a dripping tap", "Bathing with a full bucket and shower together"], "Turning off the tap while brushing can save many litres every day."],
  ["🌍", "About how long does the Earth take to go once around the Sun?", "365 days", ["24 hours", "30 days", "7 days"], "One trip around the Sun (a revolution) takes about 365¼ days: one year."],
  ["🌀", "About how long does the Earth take to spin once on its axis?", "24 hours", ["365 days", "12 hours", "1 week"], "One spin (rotation) takes about 24 hours: one day and night."],
  ["🌗", "Day and night are caused by the Earth's ___.", "rotation", ["revolution", "gravity", "tilt alone"], "As the Earth rotates, places turn towards the Sun (day) and away from it (night)."],
  ["🍂", "Why do we have seasons?", "The Earth is tilted as it goes around the Sun", ["The Sun gets bigger and smaller", "The Moon blocks the Sun", "The Earth stops spinning"], "Because of the tilt, each part of the Earth gets more direct sunlight at one time of year and less at another."],
  ["🌑", "During a solar eclipse, what comes between the Sun and the Earth?", "The Moon", ["Mars", "A cloud", "Venus"], "The Moon blocks the Sun and casts its shadow on the Earth."],
  ["🌘", "During a lunar eclipse, what comes between the Sun and the Moon?", "The Earth", ["Mars", "Venus", "A comet"], "The Earth's shadow falls on the Moon."],
  ["🌕", "About how long does the Moon take to go once around the Earth?", "About a month", ["About a day", "About a week", "About a year"], "The Moon goes around the Earth in about 27 days, close to a month."],
  ["☀️", "What is the Sun?", "A star", ["A planet", "A moon", "A comet"], "The Sun is a medium-sized star made of very hot gases."],
  ["🌋", "On which layer of the Earth do we live?", "Crust", ["Core", "Mantle", "Outer core"], "The crust is the thin rocky outer layer. Below it are the mantle and the core."],
  ["🌅", "At 8 o'clock in the morning, in which direction does your shadow fall?", "West", ["East", "North", "South"], "The Sun rises in the east, so in the morning shadows point the opposite way, towards the west."],
  ["⭐", "Which star helps travellers find the north direction at night?", "Pole Star", ["The Sun", "Sirius", "Shooting star"], "The Pole Star stays almost still in the northern sky."],
  ["✨", "What is a group of stars that forms a pattern in the sky called?", "Constellation", ["Galaxy", "Comet", "Orbit"], "Ursa Major (the Great Bear) and Orion are constellations."],
  ["🛰️", "What is the Earth's only natural satellite?", "The Moon", ["The Sun", "Mars", "The International Space Station"], "The Moon goes around the Earth naturally. Space stations are man-made satellites."],
  ["🌡️", "Normal human body temperature is about ___.", "37 °C", ["27 °C", "47 °C", "100 °C"], "A healthy body stays near 37 °C (98.6 °F). Higher than that is a fever."],
  ["🔋", "Which of these is a good conductor of electricity?", "Copper wire", ["Rubber band", "Plastic ruler", "Wooden stick"], "Metals like copper let electricity pass easily, which is why wires are made of copper."],
  ["🥛", "Curd is made from milk with the help of ___.", "bacteria", ["salt", "sunlight", "ice"], "Good bacteria (lactobacillus) turn milk into curd."],
  ["🦟", "Which disease is spread by the bite of a female Anopheles mosquito?", "Malaria", ["Chickenpox", "Cold", "Scurvy"], "Malaria germs pass into the blood when an infected Anopheles mosquito bites."],
  ["🍋", "Lemon juice tastes sour because it is ___.", "acidic", ["salty", "sweet", "bitter"], "Lemons contain citric acid. Acids taste sour."],
  ["🌫️", "Water vapour in the air cools high up and forms tiny drops that we see as ___.", "clouds", ["smoke", "snowmen", "rainbows"], "When water vapour cools it condenses into tiny droplets, which gather to form clouds."],
  ["🌊", "Which is the correct order in the water cycle?", "Evaporation → condensation → rain", ["Evaporation → rain → condensation", "Condensation → evaporation → rain", "Rain → condensation → evaporation"], "The Sun evaporates water, the vapour condenses into clouds, and then it falls as rain."],
];

// Neighbour-pair rows from the existing fact tables.
const youngRows = ANIMALS.filter(a => a.baby).map(a => [a.n, a.baby]);
const homeRows = ANIMALS.filter(a => a.home).map(a => [a.n, a.home]);
const soundRows = ANIMALS.filter(a => a.sound).map(a => [a.n, a.sound]);
const senseRows = SENSES.map(([, o, s]) => [o, s]);

H[1].nso = Q => {
  AUTH(Q, NSO1);
  // Logical reasoning
  orderQs(Q, 34, 3);
  patternQs(Q, 34);
  legQs(Q, 24);
  analogyQs(Q, youngRows, 14, (a, b) => `The young one of ${an(a)} is called ${an(b)}`);
  analogyQs(Q, homeRows, 12, (a, b) => `${cap1(an(a))} lives in ${an(b)}`);
  analogyQs(Q, soundRows, 12, (a, b) => `${cap1(an(a))} makes a sound called "${b}"`);
  // Classification and matching over the science tables
  oddQs(Q, { "living things": plain({ x: LIVING }).x, "non-living things": plain({ x: NONLIVING }).x }, 12);
  oddQs(Q, { "fruits": plain({ x: FRUITS }).x, "vegetables": plain({ x: VEGS }).x }, 10);
  oddQs(Q, Object.fromEntries(Object.entries(plain(TRANSPORT)).map(([k, v]) => [`${k} transport`, v])), 10, "Which one does NOT belong with the others?");
  oddQs(Q, { "animals that live in water": plain(HABITAT).water, "animals that live on trees": plain(HABITAT).trees, "animals that live on land": plain(HABITAT).land }, 10, "Which animal does NOT belong with the others?");
  oddQs(Q, { "plant-eaters": DIET.herbivore, "meat-eaters": DIET.carnivore }, 10, "Which animal is the odd one out?");
  oddQs(Q, { "natural sources of light": plain(LIGHT).natural, "man-made sources of light": plain(LIGHT)["man-made"] }, 8, "Which one does NOT belong with the others?");
  matchQs(Q, youngRows, 10, "animal – young one");
  matchQs(Q, homeRows, 10, "animal – home");
  matchQs(Q, senseRows, 6, "sense organ – what it does", (l, r) => `${cap1(l)} – ${r}`);
  stateQs(Q, [...rowFacts(youngRows, (a, b) => `The young one of ${an(a)} is called ${an(b)}.`), ...rowFacts(homeRows, (a, b) => `${cap1(an(a))} lives in ${an(b)}.`)], 16);
};

H[4].nso = Q => {
  AUTH(Q, NSO4);
  // Logical reasoning
  orderQs(Q, 22, 5);
  for (let k = 0; k < 14; k++) {   // heads and legs
    const h = ri(8, 20), c = ri(2, h - 2), legs = 2 * (h - c) + 4 * c;
    Q("top", `A farm has some hens and some cows. Together they have ${h} heads and ${legs} legs. How many cows are there?`, nums(c, [h - c, legs / 4 | 0, c + 1]),
      `If all ${h} were hens there would be ${2 * h} legs. There are ${legs - 2 * h} extra legs, and each cow adds 2 extra legs. Cows = ${legs - 2 * h} ÷ 2 = ${c}.`, C(["🐄", "Cows", String(c), 1], ["🐔", "Hens", String(h - c)], ["", "Legs", `${4 * c} + ${2 * (h - c)} = ${legs}`]));
  }
  const vitRows = VITAMINS.map(([v, d]) => [v, d]), organRows = ORGANS.map(([, o, j]) => [o, j]), toothRows = TEETH.map(([t, j]) => [t, j]);
  const instrRows = INSTR.map(([i, u]) => [i, u.replace(/^to /, "")]), changeRows = CHANGES.map(([c, , ex]) => [c, ex]), machRows = MACHINES.flatMap(([m, ex]) => ex.map(x => [x, m]));
  const eatRows = byGroup(EATEN), dispRows = byGroup(DISPERSE);
  analogyQs(Q, vitRows, 12, (a, b) => `Lack of ${a} causes ${b}`);
  analogyQs(Q, instrRows, 10, (a, b) => `A ${a} is used to ${b}`);
  analogyQs(Q, BREATHE, 10, (a, b) => `${cap1(an(a))} breathes through ${b}`);
  analogyQs(Q, eatRows, 10, (a, b) => `In ${a} we eat the ${b}`);
  matchQs(Q, vitRows, 10, "nutrient – disease caused by its lack");
  matchQs(Q, organRows, 10, "organ – its job");
  matchQs(Q, toothRows, 6, "teeth – their job");
  matchQs(Q, instrRows, 10, "instrument – use");
  matchQs(Q, changeRows, 8, "change of state – example");
  matchQs(Q, machRows, 10, "example – simple machine");
  matchQs(Q, dispRows, 8, "seed – how it is spread");
  oddQs(Q, { herbivores: DIET.herbivore, carnivores: DIET.carnivore, omnivores: DIET.omnivore }, 12, "Which animal is the odd one out?");
  oddQs(Q, { "animals that lay eggs": BIRTH.eggs, "animals that give birth to babies": BIRTH.babies }, 10, "Which animal is the odd one out?");
  oddQs(Q, { conductors: COND.conductors, insulators: COND.insulators }, 8, "Which material is the odd one out?");
  oddQs(Q, { "attracted by a magnet": MAGNET.yes, "not attracted by a magnet": MAGNET.no }, 8, "Which object is the odd one out?");
  oddQs(Q, { "energy-giving foods (carbohydrates)": NUTRI.carbohydrates, "body-building foods (proteins)": NUTRI.proteins, "fats": NUTRI.fats }, 10, "Which food is the odd one out?");
  oddQs(Q, Object.fromEntries(Object.entries(EATEN).map(([k, v]) => [`we eat its ${k}`, v])), 10, "Which one is the odd one out (think of the part of the plant we eat)?");
  oddQs(Q, { solids: STATES.solid, liquids: STATES.liquid, gases: STATES.gas }, 8, "Which one is the odd one out?");
  stateQs(Q, [
    ...rowFacts(vitRows, (a, b) => `Lack of ${a} causes ${b}.`),
    ...rowFacts(organRows, (a, b) => `The ${a} ${a === "lungs" || a === "kidneys" ? "are" : "is"} mainly for ${b}.`),
    ...rowFacts(instrRows, (a, b) => `A ${a} is used to ${b}.`),
    ...rowFacts(BREATHE.filter(([a]) => !["dog", "human", "sparrow"].includes(a)), (a, b) => `${cap1(an(a))} breathes through ${b}.`),
  ], 30);
};
