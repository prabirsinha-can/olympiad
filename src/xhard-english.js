// Challenge-level IEO questions (the whole English bank once X[grade].ieo exists).
// Grade 1 works at SOF IEO Achievers level with class 2–3 content; grade 4 with class 5–6 content.
// Everything lives inside one function scope so the names here never clash with the other generator files.
(() => {
  // ---------- shared helpers ----------
  // Authored rows: [emoji, question, answer, [three wrong], explanation, card subtitle?]
  const AX = (Q, rows) => rows.forEach(([em, q, a, w, e, tag]) => Q("top", q, [a, ...w], e, C([em, a, tag || "✓ correct", 1])));
  // A sentence for the "sentence" viz: punctuation becomes its own word.
  const spaced = s => s.replace(/([,.!?])(?=\s|$)/g, " $1").replace(/\s+/g, " ").trim();
  const wordAt = (s, w) => spaced(s).split(" ").findIndex(x => x.toLowerCase() === w.toLowerCase());
  // Grade 1 "which word is wrong" rows: [sentence, wrong word, [other words from it], corrected sentence, fixed word, explanation]
  const WRONGW = (Q, rows) => rows.forEach(([s, bad, others, fixed, good, e]) =>
    Q("top", `Which word is used wrongly in this sentence?\n${s}`, [bad, ...others], e, sent(spaced(fixed), wordAt(fixed, good.split(" ").pop()), `${bad} → ${good}`)));
  // Grade 4 error spotting: [part A, part B, part C, index of error (3 = no error), corrected sentence, explanation]
  const ERR_OPTS = ["(A)", "(B)", "(C)", "(D) No error"];
  const ERR4 = (Q, rows) => rows.forEach(([a, b, c, k, fixed, e]) =>
    Q("top", `Find the part of the sentence that has an error.\n(A) ${a}\n(B) ${b}\n(C) ${c}\n(D) No error`, [ERR_OPTS[k], ...ERR_OPTS.filter((_, i) => i !== k)], e,
      C(...[a, b, c].map((p, i) => ["", ERR_OPTS[i], p, i === k]), ["✅", k === 3 ? "Correct as it is" : "Correct sentence", fixed]), { order: ERR_OPTS }));
  // Spelling rows: [word, [three misspellings]]; asked both ways.
  function spellQs(Q, rows, n) {
    pickN(rows, n).forEach(([w, bad], k) => {
      if (k % 2 === 0) Q("top", "Which word is spelt correctly?", [w, ...bad], `The correct spelling is ${w.toUpperCase().split("").join("-")}.`, C(["✍️", w, "correct", 1], ["", bad[0], "wrong"]));
      else {
        const others = pickN(rows.filter(r => r[0] !== w), 3).map(r => r[0]), b = pick(bad);
        Q("top", "Which word is spelt INCORRECTLY?", [b, ...others], `"${b}" is wrong. The correct spelling is "${w}". The other three words are spelt correctly.`, vs(b, w, "wrong", "correct"));
      }
    });
  }
  // Word-order options: move one word or swap two neighbours (tempting near misses), never an allowed order.
  function nearOrders(words, allowed, n) {
    const ok = new Set(allowed.map(a => a.join(" "))), out = new Set(); let g = 0;
    while (out.size < n && g++ < 400) {
      // The first word stays put, so a moved word can never turn the sentence into a question or hint by its capital.
      const w = words.slice(), i = ri(1, w.length - 2);
      if (R() < .5) [w[i], w[i + 1]] = [w[i + 1], w[i]];
      else { const [x] = w.splice(i, 1); w.splice(ri(1, w.length), 0, x); }
      const s = w.join(" "); if (!ok.has(s)) out.add(s);
    }
    return [...out];
  }
  const fixCaps = (s, keep) => cap1(s.split(" ").map((x, i) => i === 0 ? x : keep.has(x) ? x : x.toLowerCase()).join(" "));
  const HE = { Riya: "she", Aman: "he", Meera: "she", Kabir: "he", Tara: "she", Ishaan: "he", Zoya: "she", Arjun: "he", Anya: "she", Dev: "he", Sara: "she", Rohan: "he" };
  const NAMES_ = Object.keys(HE);

  // ======================================================================
  // GRADE 1
  // ======================================================================
  const G1 = [
    // Nouns
    ["🏰", "Which word in this sentence is a proper noun?\nLast week my uncle took us to see the Red Fort.", "Red Fort", ["uncle", "week", "us"], "A proper noun is the special name of one particular person, place or thing. 'Red Fort' is the name of one special place, so it starts with capital letters.", "name of a place"],
    ["🐄", "How many naming words (nouns) are there in this sentence?\nThe farmer gave his cow some grass and water.", "4", ["3", "5", "2"], "The nouns are farmer, cow, grass and water. 'Gave' is an action word and 'his' and 'some' are not naming words.", "farmer, cow, grass, water"],
    ["🎒", "How many naming words (nouns) are there in this sentence?\nRiya put her books, pens and a ruler in her bag.", "5", ["4", "6", "3"], "The nouns are Riya, books, pens, ruler and bag. 'Her' is a pronoun, not a noun.", "Riya, books, pens, ruler, bag"],
    ["🐑", "Fill in the blank: The shepherd took his ___ of sheep up the hill.", "flock", ["herd", "swarm", "bunch"], "A group of sheep (or birds) is a flock. A herd is a group of cows, and a swarm is a group of bees.", "a flock of sheep"],
    ["🐝", "Fill in the blank: A ___ of bees chased the bear away.", "swarm", ["flock", "pack", "bunch"], "A group of bees is called a swarm.", "a swarm of bees"],
    ["🔑", "Which group word is used correctly?", "a bunch of keys", ["a herd of birds", "a flock of cows", "a swarm of flowers"], "We say a bunch of keys (or flowers or grapes), a flock of birds and a herd of cows.", "group word"],
    ["📅", "Which of these is a proper noun?", "January", ["month", "winter", "holiday"], "'January' is the name of one particular month, so it is a proper noun and starts with a capital letter. 'Month', 'winter' and 'holiday' are common nouns.", "name of a month"],
    // Pronouns
    ["✏️", "Fill in the blank: This pencil is not yours. It is ___.", "mine", ["my", "me", "I"], "'Mine' stands alone at the end: It is mine. 'My' must have a noun after it (my pencil).", "stands alone"],
    ["👟", "Fill in the blank: These are Riya's shoes. The shoes are ___.", "hers", ["her", "she", "her's"], "'Hers' stands alone: The shoes are hers. It never has an apostrophe.", "no apostrophe"],
    ["🐈", "Fill in the blank: The cat licked ___ paw.", "its", ["it's", "it", "their"], "'Its' shows that the paw belongs to the cat. 'It's' is short for 'it is'.", "belongs to it"],
    ["🎨", "Fill in the blank: Rohan made the birthday card all by ___.", "himself", ["hisself", "herself", "him"], "Rohan is a boy, so we use 'himself'. 'Hisself' is not a real word.", "Rohan → himself"],
    ["🧹", "Fill in the blank: We cleaned the whole room by ___.", "ourselves", ["ourself", "themselves", "us"], "'We' goes with 'ourselves' (more than one person, so -selves).", "we → ourselves"],
    ["🛒", "Which sentence is correct?", "Amit and I went to the market.", ["Me and Amit went to the market.", "Amit and me went to the market.", "I and Amit went to the market."], "Use 'I' when you are one of the people doing the action, and name the other person first: Amit and I went.", "others first, then I"],
    ["🍬", "Fill in the blank: Mother gave the sweets to Riya and ___.", "me", ["I", "mine", "myself"], "After 'to' we use 'me'. Check by removing Riya: Mother gave the sweets to me.", "to … me"],
    ["🤕", "Fill in the blank: The children hurt ___ while playing.", "themselves", ["theirselves", "themself", "himself"], "'The children' means many, so we use 'themselves'. 'Theirselves' is not a real word.", "many → themselves"],
    ["🍽️", "Which pronoun can take the place of the words in capitals?\nMother called MEENA AND ME for lunch.", "us", ["we", "them", "our"], "Meena and me = us. After an action word (called) we use 'us', not 'we'.", "Meena and me → us"],
    ["👜", "Fill in the blank: Is this bag ___ or Aman's?", "yours", ["your", "you", "your's"], "'Yours' stands alone, like 'Aman's'. It never has an apostrophe.", "stands alone"],
    ["🎪", "Which pronoun can take the place of the words in capitals?\nRAVI AND HIS SISTER are going to the fair.", "They", ["We", "Them", "He"], "Ravi and his sister are two people doing the action, so we use 'They'. 'Them' is used after an action word.", "two people → they"],
    // Verbs and tenses
    ["👶", "Fill in the blank: Look! The baby ___ at you.", "is smiling", ["smiles", "smiled", "will smile"], "'Look!' tells us it is happening right now, so we use is + -ing: is smiling.", "happening now"],
    ["🏖️", "Fill in the blank: My grandparents ___ to Goa next month.", "will go", ["went", "have gone", "goes"], "'Next month' is in the future, so we use 'will go'.", "next month → future"],
    ["⛄", "Fill in the blank: Yesterday the children ___ a snowman.", "built", ["builded", "build", "building"], "'Build' is a special verb: build → built. 'Builded' is not a word.", "build → built"],
    ["🪥", "Fill in the blank: Riya ___ her teeth twice a day.", "brushes", ["brush", "brushs", "brushing"], "With one person (Riya) we add -es to words ending in sh: brush → brushes.", "sh → -es"],
    ["🌅", "Fill in the blank: The sun ___ in the east every day.", "rises", ["rise", "rose", "rised"], "'Every day' shows something that always happens, so we use the present: the sun rises.", "always true"],
    ["🏫", "Which sentence is correct?", "We did not go to school yesterday.", ["We did not went to school yesterday.", "We do not went to school yesterday.", "We not go to school yesterday."], "After 'did not' the action word goes back to its simple form: did not go (not 'did not went').", "did not + go"],
    ["🥭", "Fill in the blank: ___ she like mangoes?", "Does", ["Do", "Is", "Are"], "With he, she or one person we ask questions with 'Does': Does she like mangoes?", "she → does"],
    ["📚", "Fill in the blank: There ___ many books on the shelf.", "are", ["is", "has", "am"], "'Many books' are more than one, so we use 'are'.", "many → are"],
    ["🥛", "Fill in the blank: There ___ a lot of milk in the jug.", "is", ["are", "have", "were"], "Milk cannot be counted one by one, so we treat it as one thing: There is a lot of milk.", "milk → is"],
    ["🦓", "Fill in the blank: My friends and I ___ at the zoo yesterday.", "were", ["was", "are", "is"], "'My friends and I' means many people, and 'yesterday' is in the past, so we use 'were'.", "many + past → were"],
    ["🐕", "Fill in the blank: The dog ___ hungry, so it barked loudly.", "was", ["were", "is", "are"], "'Barked' tells us it happened in the past, and the dog is one animal, so we use 'was'.", "one + past → was"],
    ["🎤", "Which word is the helping verb in this sentence?\nThe girls are singing a song.", "are", ["singing", "girls", "song"], "'Are' helps the main action word 'singing'. Together they make 'are singing'.", "helps 'singing'"],
    ["🐾", "Fill in both blanks: I ___ a cat and my cousins ___ two dogs.", "have, have", ["has, have", "have, has", "has, has"], "We say 'I have' and 'they have'. 'Has' is used only with he, she, it or one person or thing.", "I have / they have"],
    ["⚾", "Fill in the blank: Ravi ___ the ball over the wall.", "threw", ["throwed", "thrown", "throws to"], "'Throw' is a special verb: throw → threw. 'Thrown' needs has or have before it.", "throw → threw"],
    ["💭", "Fill in the blank: Last night I ___ a strange dream.", "had", ["have", "has", "haved"], "'Last night' is in the past. The past of have is had.", "have → had"],
    ["🏛️", "Which sentence tells about something that will happen?", "We shall visit the museum on Friday.", ["We visited the museum last Friday.", "We visit the museum every Friday.", "We were visiting the museum when it rained."], "'Shall visit' tells about the future. The others tell about the past or about a habit.", "shall → future"],
    ["💡", "Fill in the blank: Meera ___ a story when the lights went out.", "was reading", ["is reading", "reads", "were reading"], "She was in the middle of reading when the lights went out, so we use 'was reading' (one person, past).", "in the middle of it"],
    ["☁️", "Fill in the blank: Look at those dark clouds! It ___ rain soon.", "is going to", ["was going to", "has", "did"], "We see the clouds now, so we can tell what will happen next: It is going to rain.", "about to happen"],
    // Articles
    ["⏳", "Fill in the blank: I waited for ___ hour at the station.", "an", ["a", "many", "some"], "The h in 'hour' is silent, so the word begins with a vowel sound: an hour.", "silent h"],
    ["🌕", "Fill in the blank: ___ moon looks bright tonight.", "The", ["A", "An", "Some"], "There is only one moon, so we say 'the moon'.", "only one"],
    ["☂️", "Choose the correct words: ___ umbrella, ___ uniform, ___ hour", "an, a, an", ["an, an, an", "a, a, an", "an, a, a"], "An umbrella (vowel sound), a uniform ('you' sound), an hour (silent h). The SOUND decides, not the letter.", "listen to the sound"],
    ["🦄", "Choose the correct words: ___ egg, ___ unicorn, ___ honest man, ___ cap", "an, a, an, a", ["an, an, a, a", "a, a, an, a", "an, an, an, a"], "An egg, a unicorn ('you' sound), an honest man (silent h), a cap.", "sound decides"],
    ["🐘", "Fill in the blanks: I saw ___ elephant. ___ elephant was very big.", "an, The", ["a, The", "an, An", "the, An"], "We use 'a' or 'an' the first time we talk about something, and 'the' when we talk about it again.", "first an, then the"],
    ["🕌", "Fill in the blank: We went to see ___ Taj Mahal last year.", "the", ["a", "an", "some"], "There is only one Taj Mahal and it is a famous building, so we say 'the Taj Mahal'.", "famous building"],
    // Prepositions
    ["🎂", "Fill in the blank: My birthday is ___ 5th May.", "on", ["in", "at", "to"], "We use 'on' with dates and days: on 5th May, on Monday. We use 'in' with months alone: in May.", "on + date"],
    ["🌇", "Fill in the blank: We go for a walk ___ the evening.", "in", ["on", "at", "by"], "We say in the morning, in the afternoon, in the evening, but at night.", "in the evening"],
    ["🕗", "Fill in the blank: School begins ___ 8 o'clock.", "at", ["in", "on", "to"], "We use 'at' with an exact time: at 8 o'clock.", "at + time"],
    ["🍰", "Fill in the blank: Share the cake ___ the three friends.", "among", ["between", "on", "at"], "'Between' is for two. 'Among' is for three or more.", "3 or more → among"],
    ["🪑", "Fill in the blank: The ball is lying ___ the two chairs.", "between", ["among", "in", "at"], "'Between' is used for two things.", "2 → between"],
    ["🌉", "Fill in the blank: We walked ___ the bridge to reach the other side of the river.", "across", ["into", "between", "among"], "'Across' means from one side to the other side.", "side to side"],
    ["🚂", "Fill in the blank: The train passed ___ a long, dark tunnel.", "through", ["among", "between", "on"], "'Through' means going in at one end and out at the other.", "in one end, out the other"],
    ["🤒", "Fill in the blank: Kabir has been ill ___ Monday.", "since", ["for", "at", "on"], "'Since' tells us when something started: since Monday. 'For' tells how long: for three days.", "since + starting day"],
    ["👧", "Fill in the blank: Riya is sitting ___ Meena and Tara.", "between", ["among", "in", "at"], "Riya has one friend on each side, two people, so we use 'between'.", "2 people → between"],
    // Conjunctions
    ["🌧️", "Fill in the blank: I wanted to play outside, ___ it was raining.", "but", ["so", "because", "or"], "'But' joins two ideas that go against each other: I wanted to play, but it was raining.", "but → opposite"],
    ["⏰", "Fill in the blank: Hurry up, ___ you will be late.", "or", ["and", "but", "because"], "'Or' here means 'if not': Hurry up, or (if you don't) you will be late.", "or = if not"],
    ["🥪", "Fill in the blank: Raju was very hungry, ___ he ate two sandwiches.", "so", ["but", "or", "because"], "'So' tells us what happened as a result: he was hungry, so he ate.", "so → result"],
    ["🥪", "Fill in the blank: Raju ate two sandwiches ___ he was very hungry.", "because", ["so", "but", "or"], "'Because' gives the reason: he ate because he was hungry.", "because → reason"],
    ["👀", "Fill in the blank: I could not see the board ___ I was sitting at the back.", "because", ["but", "or", "so"], "Sitting at the back is the reason, so we use 'because'.", "reason"],
    // Adjectives
    ["🐱", "Choose the correct order: She has a ___ cat.", "cute little white", ["white little cute", "little cute white", "white cute little"], "Describing words go in order: what we think (cute) → size (little) → colour (white).", "opinion → size → colour"],
    ["👜", "Choose the correct order: He bought a ___ bag.", "big new red", ["red new big", "new red big", "red big new"], "The order is size (big) → age (new) → colour (red).", "size → age → colour"],
    ["📖", "Fill in the blank: This is the ___ book I have ever read.", "best", ["better", "goodest", "most good"], "Good → better → best. We compare it with every book ever read, so we use 'best'.", "good → better → best"],
    ["🐘", "Fill in the blank: An elephant is ___ than a horse.", "heavier", ["heavyer", "more heavy", "heaviest"], "With 'than' we compare two things. Heavy → heavier (y changes to i).", "y → ier"],
    ["👭", "Fill in the blank: Riya is the ___ of the two sisters.", "younger", ["youngest", "young", "most young"], "With only TWO people we use the -er word, even after 'the'.", "two → -er"],
    ["🍶", "Fill in the blank: There is not ___ water in the bottle.", "much", ["many", "few", "lots"], "We use 'much' for things we cannot count, like water. 'Many' is for things we can count.", "can't count → much"],
    ["✏️", "Fill in the blank: How ___ pencils do you have?", "many", ["much", "more", "lot"], "Pencils can be counted, so we ask 'How many?'", "can count → many"],
    ["👗", "How many describing words (adjectives) are there in this sentence?\nThe tall girl wore a long blue dress.", "3", ["2", "4", "1"], "The describing words are tall, long and blue.", "tall, long, blue"],
    ["🏃", "Fill in the blank: Of all the boys in the class, Sam runs the ___.", "fastest", ["faster", "most fast", "fast"], "Sam is compared with ALL the boys, so we use the -est form: fastest.", "all → -est"],
    ["🛣️", "Fill in the blank: This road is ___ than that one.", "more dangerous", ["dangerouser", "most dangerous", "more dangerouser"], "Long describing words take 'more' instead of -er: more dangerous. Never use both.", "long word → more"],
    // Adverbs
    ["🎶", "Which sentence has a word that tells HOW something was done?", "She sang sweetly.", ["She sang yesterday.", "She sang there.", "She sang a sweet song."], "'Sweetly' tells how she sang. 'Yesterday' tells when, 'there' tells where, and 'sweet' describes the song.", "how → sweetly"],
    ["🤫", "Fill in the blank: The baby is sleeping. Please talk ___.", "softly", ["soft", "softer", "softness"], "'Softly' tells HOW to talk, so we use the -ly word.", "how → -ly"],
    ["🏃", "Fill in the blank: The runner was quick. He ran ___.", "quickly", ["quick", "quicker", "quickness"], "To tell how he ran, we use 'quickly'.", "how → quickly"],
    ["👵", "Which word tells WHEN we will visit?\nWe will visit Grandma tomorrow.", "tomorrow", ["visit", "Grandma", "will"], "'Tomorrow' tells us when.", "when?"],
    ["📝", "Fill in the blank: She did ___ in the test and got full marks.", "well", ["good", "goodly", "nice"], "'Well' tells how she did. 'Good' describes a thing: a good test.", "did well"],
    // Plurals and gender
    ["🐑", "Fill in the blank: One sheep, many ___.", "sheep", ["sheeps", "sheepes", "shoop"], "'Sheep' stays the same for one or many.", "same for many"],
    ["🐂", "Fill in the blank: One ox, two ___.", "oxen", ["oxes", "oxs", "oxens"], "'Ox' has a special plural: oxen.", "ox → oxen"],
    ["🐭", "Which plural is NOT correct?", "mouse → mouses", ["tooth → teeth", "knife → knives", "baby → babies"], "The plural of mouse is mice. The other three are correct.", "mouse → mice"],
    ["🍂", "Fill in the blank: One leaf, two ___.", "leaves", ["leafs", "leafes", "leavs"], "Many words ending in f change f to v and add -es: leaf → leaves.", "f → ves"],
    ["🧒", "Fill in the blank: The ___ are playing in the park.", "children", ["childs", "childrens", "child"], "The plural of child is children. 'Childrens' is wrong because children is already plural.", "child → children"],
    ["👨‍👩", "Which pair is correct (male → female)?", "uncle → aunt", ["nephew → nephewess", "king → princess", "lion → lionest"], "Uncle → aunt. (Nephew → niece, king → queen, lion → lioness.)", "male → female"],
    ["🐴", "The female of 'horse' is ___.", "mare", ["horsess", "pony", "foal"], "A female horse is a mare. A foal is a baby horse, and a pony is a small kind of horse.", "female horse"],
    ["👨", "Fill in the blank: My mother's brother is my ___.", "uncle", ["nephew", "cousin", "aunt"], "Your mother's or father's brother is your uncle.", "mother's brother"],
    ["👦", "Fill in the blank: My aunt's son is my ___.", "cousin", ["nephew", "brother", "uncle"], "The son or daughter of your aunt or uncle is your cousin.", "aunt's child"],
    // Opposites and same meanings
    ["🚉", "Which word is the opposite of 'arrive'?", "leave", ["reach", "come", "enter"], "To arrive is to come to a place. To leave is to go away from it.", "arrive ↔ leave"],
    ["🧠", "Which word is the opposite of 'remember'?", "forget", ["recall", "remind", "know"], "If you do not remember something, you forget it. 'Recall' means the same as remember.", "remember ↔ forget"],
    ["🏊", "Which word is the opposite of 'deep'?", "shallow", ["low", "thin", "wide"], "Deep water goes far down. Shallow water does not.", "deep ↔ shallow"],
    ["🙇", "Which word is the opposite of 'polite'?", "rude", ["kind", "gentle", "quiet"], "A polite person speaks nicely. A rude person does not.", "polite ↔ rude"],
    ["📕", "Which word is the opposite of 'borrow'?", "lend", ["take", "keep", "buy"], "You borrow something from someone. They lend it to you.", "borrow ↔ lend"],
    ["🏯", "Which word is the opposite of 'ancient'?", "modern", ["old", "broken", "huge"], "Ancient means very, very old. Modern means new, of today.", "ancient ↔ modern"],
    ["🚀", "Which word means the same as 'rapid'?", "quick", ["slow", "careful", "rough"], "Rapid means very fast, the same as quick.", "rapid = quick"],
    ["🧺", "Which word means the same as 'tidy'?", "neat", ["messy", "dirty", "tiny"], "A tidy room is neat. 'Messy' is the opposite. 'Tiny' only looks a little like 'tidy'.", "tidy = neat"],
    ["📣", "Which word means the same as 'shout'?", "yell", ["whisper", "mumble", "hum"], "To shout and to yell both mean to speak very loudly. 'Whisper' is the opposite.", "shout = yell"],
    ["😨", "Which word means the same as 'afraid'?", "scared", ["brave", "angry", "tired"], "Afraid and scared both mean full of fear.", "afraid = scared"],
    ["🎁", "Which word means the same as 'gift'?", "present", ["wish", "price", "card"], "A gift and a present are the same thing.", "gift = present"],
    // Homophones (sound the same)
    ["⚽", "Fill in the blanks: We ___ the match by ___ goals.", "won, two", ["one, two", "won, too", "one, too"], "'Won' is the past of win. 'Two' is the number 2. One, won and too, two sound alike but mean different things.", "won + two"],
    ["🏠", "Fill in the blanks: ___ going to ___ grandmother's house.", "They're, their", ["Their, there", "There, their", "They're, there"], "'They're' = they are. 'Their' means belonging to them.", "they are + belongs"],
    ["🌊", "Fill in the blanks: From the beach I can ___ the waves of the ___.", "see, sea", ["sea, see", "see, see", "sea, sea"], "We see with our eyes. The sea is the big salty water.", "see + sea"],
    ["✍️", "Fill in the blanks: Please ___ your name on the ___ side of the page.", "write, right", ["right, write", "write, write", "right, right"], "We write with a pen. 'Right' is a side (the opposite of left).", "write + right"],
    ["🧑‍🎓", "Fill in the blanks: The ___ boy in our class ___ every answer.", "new, knew", ["knew, new", "new, new", "knew, knew"], "'New' is the opposite of old. 'Knew' is the past of know.", "new + knew"],
    ["🍐", "Fill in the blanks: I ate a ___ and bought a ___ of socks.", "pear, pair", ["pair, pear", "pear, pear", "pair, pair"], "A pear is a fruit. A pair means two things that go together.", "pear + pair"],
    ["🔔", "Fill in the blanks: I ___ the bell, so I came ___.", "heard, here", ["herd, here", "heard, hear", "herd, hear"], "'Heard' is the past of hear. 'Here' means this place. A herd is a group of cows.", "heard + here"],
    // Punctuation and capitals
    ["🔠", "Which sentence is written correctly?", "On Sunday, Riya and I visited Aunt Meena in Pune.", ["On sunday, Riya and i visited Aunt Meena in Pune.", "On Sunday, riya and I visited aunt Meena in pune.", "On Sunday, Riya and I visited Aunt Meena in pune."], "Days (Sunday), names (Riya, Aunt Meena), places (Pune) and the word 'I' always begin with capital letters.", "capitals for names"],
    ["☔", "Which is written correctly?", "It is raining. Take your umbrella.", ["It is raining take your umbrella.", "it is raining. take your umbrella.", "It is raining, Take your umbrella."], "These are two sentences. Each one starts with a capital letter and ends with a full stop.", "two sentences"],
    ["🍇", "Which sentence uses commas correctly?", "I bought apples, bananas, grapes and pears.", ["I bought apples bananas grapes, and, pears.", "I bought, apples bananas grapes and pears.", "I, bought apples, bananas grapes and pears."], "In a list we put commas between the things, and 'and' before the last one.", "commas in a list"],
    ["❓", "Which of these should end with a question mark?", "Can you help me", ["Please help me", "I can help you", "What a help you are"], "'Can you help me?' asks something, so it needs a question mark.", "asks something"],
    ["🔡", "Which words need capital letters?\nmy friend lives in kolkata.", "my and kolkata", ["friend and lives", "only kolkata", "only my"], "'My' begins the sentence and 'Kolkata' is the name of a city: My friend lives in Kolkata.", "first word + place name"],
    ["🚫", "Which is the correct short form of 'do not'?", "don't", ["dont", "do'nt", "don,t"], "The apostrophe (') takes the place of the missing letter o: do not → don't.", "' replaces o"],
    ["🙋", "Which is the correct short form of 'I am'?", "I'm", ["Im", "I'am", "Iam"], "I am → I'm. The apostrophe takes the place of the missing a.", "' replaces a"],
    ["🌧️", "Fill in the blank: ___ raining outside, so stay in.", "It's", ["Its", "It", "Its'"], "'It's' is short for 'it is': It is raining.", "it's = it is"],
    // Kinds of sentences
    ["🧂", "What kind of sentence is this?\nPlease pass me the salt.", "An order or request", ["A question", "A statement", "An exclamation"], "It asks someone to do something, so it is a request (an order said politely).", "asks someone to do"],
    ["🗼", "What kind of sentence is this?\nWhat a tall tower this is!", "An exclamation", ["A question", "An order or request", "A statement"], "It shows surprise and ends with '!', so it is an exclamation, even though it starts with 'What'.", "shows strong feeling"],
    ["🎹", "Change into a question: Riya is playing the piano.", "Is Riya playing the piano?", ["Riya is playing the piano?", "Is playing Riya the piano?", "Does Riya playing the piano?"], "To make a question, move the helping word 'is' to the front: Is Riya playing …?", "move 'is' to the front"],
    ["🍦", "Change into a question: They like ice cream.", "Do they like ice cream?", ["Does they like ice cream?", "They like ice cream?", "Are they like ice cream?"], "With they, we start the question with 'Do': Do they like ice cream?", "they → do"],
    ["🎸", "Make this sentence negative: She plays the guitar.", "She does not play the guitar.", ["She does not plays the guitar.", "She not plays the guitar.", "She do not play the guitar."], "Use 'does not' with she, and the action word loses its -s: does not play.", "does not + play"],
    ["🏖️", "Make this sentence negative: We went to the beach.", "We did not go to the beach.", ["We did not went to the beach.", "We do not went to the beach.", "We not went to the beach."], "Use 'did not' for the past, then the simple action word: did not go.", "did not + go"],
    // Word building
    ["🔓", "Which word means the opposite of 'lock'?", "unlock", ["dislock", "relock", "lockless"], "Adding 'un-' gives the opposite: unlock. 'Relock' means lock again.", "un- = opposite"],
    ["🤷", "What does 'careless' mean?", "without care", ["full of care", "taking care again", "very careful"], "'-less' means without. 'Careless' means without care.", "-less = without"],
    ["📝", "Which word means 'to write again'?", "rewrite", ["unwrite", "writer", "writeless"], "'Re-' means again: rewrite = write again.", "re- = again"],
    ["🧸", "Fill in the blank: The broken toy cannot be played with. It is ___.", "useless", ["useful", "unuse", "reuse"], "Something with no use is useless (-less = without).", "no use → useless"],
    ["🌟", "Which word is spelt correctly?", "hopeful", ["hopefull", "hopful", "hopeefull"], "When we add '-ful' it has only ONE l: hope + ful = hopeful.", "-ful has one l"],
    ["😊", "Which word does NOT use 'un-' to make its opposite?", "like", ["happy", "kind", "tidy"], "The opposite of like is DISlike. We say unhappy, unkind and untidy.", "like → dislike"],
    ["🦁", "What is the opposite of 'fearless'?", "fearful", ["unfearless", "disfear", "fearness"], "Fearless means without fear. Fearful means full of fear.", "-less ↔ -ful"],
    ["🖌️", "A person who teaches is a teacher. A person who paints is a ___.", "painter", ["paintor", "painteer", "paintist"], "We add -er: paint → painter, teach → teacher.", "add -er"],
    // Odd one out by kind of word
    ["🦋", "Which word is NOT an action word?", "beautiful", ["jump", "write", "laugh"], "Jump, write and laugh are actions. 'Beautiful' is a describing word.", "describing word"],
    ["🎵", "Which is the odd one out?\nrun, sing, happy, dance", "happy", ["run", "sing", "dance"], "Run, sing and dance are action words. 'Happy' is a describing word.", "describing word"],
    ["🧩", "Which is the odd one out?\nquickly, slowly, softly, lovely", "lovely", ["quickly", "slowly", "softly"], "Quickly, slowly and softly tell how something is done. 'Lovely' ends in -ly but describes a thing: a lovely dress.", "describing word"],
    ["👥", "Which is the odd one out?\nhe, she, Riya, they", "Riya", ["he", "she", "they"], "He, she and they are pronouns. 'Riya' is a naming word (proper noun).", "naming word"],
    ["📍", "Which is the odd one out?\nin, on, under, and", "and", ["in", "on", "under"], "In, on and under tell position. 'And' is a joining word.", "joining word"],
    ["🧺", "Which is the odd one out?\nmine, yours, hers, my", "my", ["mine", "yours", "hers"], "Mine, yours and hers can stand alone (It is mine). 'My' always needs a noun after it (my book).", "needs a noun after it"],
    // Analogies
    ["🐝", "Bird : nest :: bee : ___", "hive", ["kennel", "stable", "burrow"], "A bird lives in a nest; a bee lives in a hive.", "home"],
    ["🐱", "Puppy : dog :: kitten : ___", "cat", ["cow", "sheep", "hen"], "A puppy grows into a dog; a kitten grows into a cat.", "young → grown-up"],
    ["🎤", "Write : wrote :: sing : ___", "sang", ["sung", "singed", "sings"], "Wrote is the past of write; sang is the past of sing.", "past tense"],
    ["🦶", "Tooth : teeth :: foot : ___", "feet", ["foots", "feets", "footes"], "One tooth, many teeth; one foot, many feet.", "plural"],
    ["⏰", "Hot : cold :: early : ___", "late", ["soon", "fast", "before"], "Hot is the opposite of cold; early is the opposite of late.", "opposites"],
    ["👍", "Good : better :: bad : ___", "worse", ["badder", "worst", "more bad"], "Good → better, bad → worse (comparing two).", "comparing two"],
    ["🐴", "Cow : moo :: horse : ___", "neigh", ["roar", "bray", "hiss"], "A cow moos and a horse neighs. A donkey brays.", "sounds"],
    ["👂", "Eye : see :: ear : ___", "hear", ["here", "smell", "talk"], "We see with our eyes and hear with our ears. 'Here' sounds the same but means 'this place'.", "what it does"],
    // Spoken English
    ["🏅", "Your teacher says, \"Well done! You got full marks.\" What should you reply?", "Thank you, ma'am.", ["Sorry, ma'am.", "Excuse me, ma'am.", "You're welcome, ma'am."], "When someone praises you, say 'Thank you'. 'You're welcome' is the reply to a thank you.", "praise → thank you"],
    ["🤝", "Your friend says, \"Thank you for helping me.\" What should you reply?", "You're welcome.", ["Thank you too.", "Sorry.", "Excuse me."], "When someone thanks you, reply 'You're welcome' or 'It's my pleasure'.", "thanks → you're welcome"],
    ["🖊️", "You want to know the price of a pen at a shop. Which is the most polite?", "Excuse me, how much does this pen cost?", ["Tell me the price of the pen.", "How much is the pen? Quick!", "Pen price?"], "Start with 'Excuse me' and ask in a full, gentle sentence.", "polite question"],
    ["🤧", "Your friend sneezes. What do you say?", "Bless you!", ["Thank you!", "Well done!", "Excuse me!"], "We say 'Bless you!' when someone sneezes. The person who sneezed may say 'Excuse me'.", "sneeze → bless you"],
    ["🚪", "You are late for class. What should you say to your teacher at the door?", "May I come in, ma'am?", ["Can I come?", "I am coming in.", "Open the door, ma'am."], "'May I come in?' politely asks for permission.", "ask permission"],
    ["👵", "Grandma asks, \"How are you, dear?\" What is the best reply?", "I am fine, thank you. How are you?", ["I am six years old.", "I am going to school.", "Yes, I am."], "Answer the question and politely ask her back.", "answer + ask back"],
    ["🍚", "Riya: \"Would you like some more rice?\"\nAman: \"___\"", "No, thank you. I am full.", ["No, I don't want your rice.", "Yes, I like rice yesterday.", "I am rice, thank you."], "To say no politely, say 'No, thank you' and give a reason.", "polite no"],
    ["🐶", "Your friend's pet dog is lost. What is the kindest thing to say?", "I'm so sorry. Let me help you look for it.", ["That's funny!", "Congratulations!", "Good for you."], "We show we care and offer to help.", "show you care"],
    ["👋", "You meet a new classmate. What is the best thing to say first?", "Hello! My name is Tara. What's your name?", ["Go away, I'm busy.", "What is my name?", "Goodbye, see you!"], "Greet them, tell your name and ask theirs.", "greet + introduce"],
    ["🍽️", "You want to leave the dinner table before the others. What should you say?", "May I please be excused?", ["I am leaving now.", "Bye, I'm done.", "Move, I want to go."], "'May I please be excused?' politely asks to leave.", "ask to leave"],
    ["📒", "Teacher: \"Where is your homework?\"\nRiya: \"___\"", "I am sorry, ma'am. I left it at home.", ["It is your homework.", "I am fine, thank you.", "Yes, it is."], "Say sorry and give the honest reason.", "sorry + reason"],
    ["⏱️", "Your friend says, \"I'm sorry I'm late.\" What is the best reply?", "It's all right. Come in.", ["You're welcome.", "Congratulations!", "Thank you."], "When someone says sorry, we can say 'It's all right' or 'No problem'.", "accept a sorry"],
    ["⚽", "You want your friend to pass you the ball. Which is the most polite?", "Could you please pass me the ball?", ["Give me the ball!", "Ball, now!", "You pass ball."], "'Could you please …?' is a polite way to ask.", "could you please"],
    // More grammar challenges
    ["🍪", "Fill in the blanks: There is ___ juice in the jug, and there are ___ biscuits on the plate.", "a little, a few", ["a few, a little", "a few, a few", "a little, a little"], "Use 'a little' for things we cannot count (juice) and 'a few' for things we can count (biscuits).", "little: juice / few: biscuits"],
    ["🏪", "Which sentence is correct?", "The shop was closed on Sunday.", ["The shops was closed on Sunday.", "We was late on Sunday.", "You was right on Sunday."], "'Was' goes with one person or thing (the shop). With many, and with we and you, we use 'were'.", "one → was"],
    ["🙌", "Which sentence is correct?", "Everybody is here.", ["Everybody are here.", "Everybody am here.", "Everybody were here now."], "'Everybody' means every single person, so it takes 'is'.", "everybody → is"],
    ["💇", "Which sentence is correct?", "My sister has long hair.", ["My sister have long hair.", "My sisters has long hair.", "My sister having long hair."], "One sister → has. Many sisters → have.", "one → has"],
    ["🚌", "Fill in the blanks: I usually ___ to school by bus, but yesterday I ___.", "go, walked", ["went, walk", "go, walk", "goes, walked"], "'Usually' shows a habit (go). 'Yesterday' is the past (walked).", "habit + past"],
    ["💐", "Fill in the blank: The flowers in the vase ___ fresh.", "are", ["is", "was", "has"], "Who is fresh? The flowers (many), not the vase. So we use 'are'.", "flowers → are"],
    ["🖍️", "Fill in the blank: The box of crayons ___ on the desk.", "is", ["are", "were", "have"], "What is on the desk? The box (one). So we use 'is'.", "box → is"],
    ["📏", "Which of these is an order (command)?", "Stand in a straight line.", ["Are you standing in a line?", "We stood in a line.", "What a long line!"], "An order tells someone what to do.", "tells what to do"],
    ["🐶", "Fill in the blank: The puppy is ___; we bought it last week.", "ours", ["our", "us", "we"], "'Ours' stands alone at the end: The puppy is ours.", "stands alone"],
    ["🔇", "Which word has a silent letter?", "write", ["wet", "wind", "wool"], "In 'write' the w is not spoken.", "silent w"],
    ["👍", "Which word has a silent letter?", "thumb", ["thump", "drum", "plum"], "In 'thumb' the b is not spoken.", "silent b"],
    ["📖", "Which word comes FIRST in a dictionary?\nplant, plate, plan, plane", "plan", ["plane", "plant", "plate"], "All start with p-l-a. 'Plan' is the shortest and all the others begin with 'plan', so it comes first.", "plan → plane → plant → plate"],
    ["📖", "Which word comes LAST in a dictionary?\nstar, stamp, start, stand", "start", ["star", "stamp", "stand"], "The order is stamp, stand, star, start. 'Star' comes before 'start' because it is shorter.", "stamp → stand → star → start"],
    ["🐕", "Fill in the blank: Our dog had a ___ of six puppies.", "litter", ["herd", "flock", "swarm"], "A group of puppies or kittens born together is a litter.", "a litter of puppies"],
    ["😃", "Which word is the name of a feeling?", "joy", ["jump", "joyful", "jolly"], "'Joy' is a naming word for a feeling. 'Joyful' and 'jolly' are describing words.", "feeling noun"],
    ["🛋️", "Fill in the blank: The cat is hiding ___ the sofa, so we cannot see it.", "behind", ["on", "above", "beside"], "If it is behind the sofa, the sofa blocks our view.", "behind = at the back"],
    ["🏃", "Which is the action word (verb) in this sentence?\nThe happy children ran home quickly.", "ran", ["happy", "home", "quickly"], "'Ran' is what the children did. 'Happy' describes them, and 'quickly' tells how.", "what they did"],
    ["🧒", "Which word can be used for BOTH a boy and a girl?", "child", ["son", "niece", "king"], "A child can be a boy or a girl. Son and king are boys; niece is a girl.", "boy or girl"],
    ["👩‍🏫", "Which word can be used for BOTH a man and a woman?", "teacher", ["actress", "waiter", "uncle"], "A teacher can be a man or a woman.", "man or woman"],
    ["🎩", "Which word means the opposite of 'appear'?", "disappear", ["unappear", "reappear", "inappear"], "'Dis-' makes the opposite: disappear. 'Reappear' means appear again.", "dis- = opposite"],
    ["🎮", "Fill in the blank: Do you want to play outside ___ stay at home?", "or", ["and", "but", "because"], "'Or' gives a choice between two things.", "or = choice"],
  ];

  const G1_WRONG = [
    ["The childrens are playing in the garden.", "childrens", ["playing", "are", "garden"], "The children are playing in the garden.", "children", "'Children' is already plural, so it never takes an s."],
    ["She don't like milk.", "don't", ["She", "like", "milk"], "She doesn't like milk.", "doesn't", "With she we use 'doesn't' (does not)."],
    ["My father go to the office by bus.", "go", ["father", "office", "bus"], "My father goes to the office by bus.", "goes", "With one person (my father) the action word takes -es: goes."],
    ["I has two brothers.", "has", ["I", "two", "brothers"], "I have two brothers.", "have", "We always say 'I have'."],
    ["Yesterday we goes to the zoo.", "goes", ["Yesterday", "we", "zoo"], "Yesterday we went to the zoo.", "went", "'Yesterday' is in the past, so go → went."],
    ["The birds is singing on the tree.", "is", ["birds", "singing", "tree"], "The birds are singing on the tree.", "are", "'Birds' means many, so we use 'are'."],
    ["He is the most tallest boy in the class.", "most", ["tallest", "boy", "class"], "He is the tallest boy in the class.", "tallest", "'Tallest' already means 'most tall'. We never use 'most' with an -est word."],
    ["There are five mouses in the box.", "mouses", ["There", "five", "box"], "There are five mice in the box.", "mice", "The plural of mouse is mice."],
    ["Riya and me are best friends.", "me", ["Riya", "are", "friends"], "Riya and I are best friends.", "I", "The people doing the action are 'Riya and I'. Check: 'I am best friends' sounds right, 'me am' does not."],
    ["She is an good doctor.", "an", ["She", "good", "doctor"], "She is a good doctor.", "a", "The word after 'an' is 'good', which starts with a consonant sound, so we use 'a'."],
    ["The dog wagged it's tail.", "it's", ["dog", "wagged", "tail"], "The dog wagged its tail.", "its", "'It's' means 'it is'. To show belonging we write 'its'."],
    ["We was very happy to see Grandpa.", "was", ["We", "happy", "Grandpa"], "We were very happy to see Grandpa.", "were", "With we, you and they we use 'were'."],
    ["Aman catched the ball with one hand.", "catched", ["Aman", "ball", "hand"], "Aman caught the ball with one hand.", "caught", "Catch is a special verb: catch → caught."],
    ["Sara is more taller than her brother.", "more", ["taller", "than", "brother"], "Sara is taller than her brother.", "taller", "'Taller' already means 'more tall', so we do not add 'more'."],
  ];

  const G1_PASSAGES = [
    ["A new friend", "A new family moved into the house next to ours. Their little boy, Kabir, stood alone at the gate and watched us play. My sister Mira waved at him, but he looked down at his shoes. The next day, Mira took her football and knocked on his door. Soon Kabir was laughing and running with us. Now he comes to play every evening.", [
      ["Why did Kabir look down at his shoes when Mira waved?", "He felt shy", ["He wanted new shoes", "He was angry with Mira", "He was looking for his ball"], "Kabir was new and stood alone. Looking down when someone waves shows he felt shy."],
      ["What did Mira do the next day?", "She took her football to Kabir's house", ["She waved at him from the gate", "She asked her mother to call Kabir", "She played alone at home"], "\"The next day, Mira took her football and knocked on his door.\""],
      ["In the passage, the word 'alone' means ___", "by himself", ["with friends", "very happy", "far away"], "Kabir stood alone, with nobody else."],
      ["Which word best describes Mira?", "friendly", ["shy", "lazy", "rude"], "She waved and then went to his house to play. That is friendly."],
      ["Which is the best title for the passage?", "A New Friend", ["My New Shoes", "The Lost Football", "Moving House"], "The story is about how Kabir became their friend."],
    ]],
    ["The thirsty plant", "Tara forgot to water her money plant for a whole week. Its leaves became dry and yellow, and they drooped towards the floor. Tara felt sorry. She gave it water and moved the pot near the window. In a few days, the leaves stood up again and turned green.", [
      ["Why did the leaves turn yellow?", "The plant got no water for a week", ["Tara moved it near the window", "It got too much sunlight", "Tara cut its leaves"], "Tara forgot to water it for a whole week."],
      ["In the passage, 'drooped' means ___", "hung down", ["grew taller", "fell off", "turned green"], "The leaves drooped towards the floor, so they hung down. Later they 'stood up again'."],
      ["What did Tara do to help the plant? Choose the full answer.", "She watered it and moved it near the window", ["She only watered it", "She only moved it near the window", "She bought a new plant"], "She did two things: gave it water and moved the pot near the window."],
      ["How did Tara feel when she saw the plant?", "Sorry", ["Proud", "Excited", "Sleepy"], "\"Tara felt sorry.\""],
      ["What does the story teach us?", "Plants need care to stay healthy", ["Plants never need water", "Windows are bad for plants", "Yellow leaves are pretty"], "The plant got sick without water and became healthy again with care."],
    ]],
    ["Grandpa's glasses", "Grandpa could not find his glasses anywhere. He looked under the bed, behind the sofa and inside the cupboard. \"I can't read the newspaper without them,\" he sighed. Little Anya giggled and pointed at his head. The glasses were sitting on top of his hair all along!", [
      ["Where were the glasses?", "On top of Grandpa's head", ["Under the bed", "Inside the cupboard", "Behind the sofa"], "\"The glasses were sitting on top of his hair all along!\""],
      ["Why did Anya giggle?", "She could see the glasses on Grandpa's head", ["Grandpa told a joke", "She had hidden the glasses", "The newspaper was funny"], "She pointed at his head because she could see the glasses there."],
      ["Why did Grandpa want his glasses?", "To read the newspaper", ["To watch TV", "To find Anya", "To go for a walk"], "He said he could not read the newspaper without them."],
      ["Grandpa 'sighed'. This tells us he felt ___", "tired and unhappy", ["very excited", "full of joy", "sleepy and hungry"], "People sigh when they are tired of looking for something or feel unhappy."],
      ["In the passage, 'all along' means ___", "the whole time", ["for a long walk", "just now", "far away"], "The glasses were on his head the whole time he was searching."],
    ]],
    ["The zoo trip", "On Friday, Class 2 went to the zoo. First, they saw the elephants taking a bath. Then they watched the monkeys swinging from branch to branch. After lunch, it started to drizzle, so they hurried to the reptile house. There they saw a huge python curled up behind the glass. Before going home, every child bought a small toy animal.", [
      ["What did the children see first?", "Elephants taking a bath", ["Monkeys swinging", "A huge python", "Toy animals"], "\"First, they saw the elephants taking a bath.\""],
      ["Why did they hurry to the reptile house?", "It started to drizzle", ["The python was escaping", "They wanted lunch", "The monkeys chased them"], "\"It started to drizzle, so they hurried to the reptile house.\""],
      ["In the passage, 'drizzle' means ___", "to rain lightly", ["to rain very heavily", "to become very hot", "to get dark"], "A drizzle is light rain with tiny drops."],
      ["What did the children do just before going home?", "Bought small toy animals", ["Had lunch", "Saw the python", "Watched the monkeys"], "\"Before going home, every child bought a small toy animal.\""],
      ["In 'curled up behind the glass', the word 'behind' is a ___", "position word (preposition)", ["naming word (noun)", "action word (verb)", "describing word (adjective)"], "'Behind' tells us where the python was, so it is a position word."],
    ]],
    ["The proud peacock", "A peacock lived near a pond. Every morning he spread his beautiful feathers and said, \"Look at me! Nobody is as handsome as I am.\" One day, a crane landed next to him. \"Your feathers are lovely,\" said the crane, \"but can you fly above the clouds like me?\" The peacock tried, but he could only reach the top of a small tree. From that day, he stopped boasting.", [
      ["Why did the peacock spread his feathers every morning?", "To show off his beauty", ["To dry them in the sun", "To fly above the clouds", "To scare the crane"], "He spread them and said, \"Look at me!\" He wanted to show off."],
      ["What could the crane do that the peacock could not?", "Fly above the clouds", ["Swim in the pond", "Spread lovely feathers", "Climb a small tree"], "The peacock could only reach the top of a small tree."],
      ["In the passage, 'boasting' means ___", "talking proudly about yourself", ["crying loudly", "flying very high", "eating too much"], "Saying \"Nobody is as handsome as I am\" is boasting."],
      ["Which word is the opposite of 'handsome'?", "ugly", ["pretty", "proud", "lovely"], "Handsome means good-looking. The opposite is ugly."],
      ["What does the story teach us?", "Do not be proud; everyone is good at something", ["Peacocks can fly very high", "Never live near a pond", "Cranes are always kind"], "The peacock was beautiful, but the crane could fly higher. Each was good at something."],
    ]],
    ["Here comes the rain (a poem)", "The clouds are grey, the wind is cold, / The trees are swaying, young and old. / Pitter-patter on the pane, / Hurray, hurray, here comes the rain!", [
      ["What is the poem about?", "The coming of rain", ["A cold winter night", "A windy beach", "Old trees"], "The last line says, \"here comes the rain!\""],
      ["Which two words rhyme in the poem?", "cold, old", ["grey, trees", "wind, pane", "patter, rain"], "Cold and old end with the same sound, -old."],
      ["In the poem, 'pitter-patter' is the sound of ___", "raindrops falling", ["feet running", "wind blowing", "a bird singing"], "The raindrops go pitter-patter on the window."],
      ["How does the poet feel about the rain?", "Happy", ["Scared", "Angry", "Bored"], "'Hurray, hurray' shows the poet is happy."],
      ["In the poem, 'pane' means ___", "the glass of a window", ["a pain in the body", "a cooking pan", "a page of a book"], "'Pane' sounds like 'pain', but here it is the glass in a window."],
    ]],
  ];

  const SPELL_G1 = [["because", ["becuase", "becaus", "becouse"]], ["friend", ["freind", "frend", "friand"]], ["beautiful", ["beautifull", "beatiful", "beutiful"]], ["people", ["peeple", "poeple", "peopel"]], ["Wednesday", ["Wensday", "Wednesdy", "Wedensday"]], ["February", ["Febuary", "Februry", "Febrary"]], ["answer", ["anser", "answar", "ansewr"]], ["tomorrow", ["tommorow", "tomorow", "tommorrow"]], ["school", ["scool", "skool", "shcool"]], ["library", ["libary", "librery", "liberry"]], ["busy", ["bizzy", "buisy", "busey"]], ["enough", ["enuf", "enogh", "enouf"]], ["minute", ["minit", "minnute", "minut"]], ["island", ["iland", "ilsand", "islend"]], ["whistle", ["wistle", "whisle", "whisstle"]], ["sugar", ["shugar", "suger", "sugur"]], ["cousin", ["cuzin", "cousen", "cosin"]], ["breakfast", ["brekfast", "breakfest", "braekfast"]], ["different", ["diffrent", "diferent", "differant"]], ["favourite", ["favourate", "favrouite", "faverite"]], ["knife", ["nife", "kinfe", "knief"]], ["laugh", ["laff", "lauph", "larf"]]];

  // Jumbled sentences: [words, other correct orders]
  const JUMBLE1 = [
    ["My little brother is afraid of the dark", []],
    ["The children were playing football in the rain", []],
    ["Grandma is knitting a warm sweater for me", []],
    ["We will visit the zoo next Sunday", ["Next Sunday we will visit the zoo", "We will visit the zoo Sunday next"]],
    ["The baby elephant drank water from the river", []],
    ["The clever crow dropped pebbles into the pot", []],
    ["Please switch off the fan when you leave", ["When you leave please switch off the fan", "Switch off the fan please when you leave", "Switch off the fan when you leave please"]],
    ["Aman did not finish his homework yesterday", ["Yesterday Aman did not finish his homework"]],
    ["The tall giraffe ate leaves from the tree", []],
    ["My father reads the newspaper every morning", ["Every morning my father reads the newspaper"]],
    ["Where did you put my new pencil box", []],
    ["The farmer sold fresh vegetables at the market", ["At the market the farmer sold fresh vegetables"]],
    ["Our teacher told us a funny story", []],
    ["The puppy is hiding under the old bed", ["Under the old bed the puppy is hiding"]],
    ["Riya brushes her teeth before going to bed", ["Before going to bed Riya brushes her teeth"]],
    ["Why are you crying in the corner", []],
  ];
  const KEEP1 = new Set(["Riya", "Aman", "Sunday", "Grandma"]);

  const OPP_G1 = [["arrive", "leave"], ["remember", "forget"], ["borrow", "lend"], ["polite", "rude"], ["ancient", "modern"], ["shallow", "deep"], ["narrow", "wide"], ["whisper", "shout"], ["tame", "wild"], ["smooth", "rough"], ["sharp", "blunt"], ["loose", "tight"], ["float", "sink"], ["entrance", "exit"], ["accept", "refuse"], ["cheap", "costly"], ["heavy", "light"], ["brave", "cowardly"], ["praise", "scold"], ["frown", "smile"]];
  const PLURAL_G1 = [["child", "children"], ["mouse", "mice"], ["tooth", "teeth"], ["foot", "feet"], ["goose", "geese"], ["man", "men"], ["woman", "women"], ["ox", "oxen"], ["leaf", "leaves"], ["knife", "knives"], ["wolf", "wolves"], ["half", "halves"], ["potato", "potatoes"], ["baby", "babies"]];
  const YOUNG = [["cat", "kitten"], ["dog", "puppy"], ["cow", "calf"], ["hen", "chick"], ["goat", "kid"], ["horse", "foal"], ["sheep", "lamb"], ["lion", "cub"], ["frog", "tadpole"], ["duck", "duckling"]];
  const WORDKIND = {
    "naming words (nouns)": ["teacher", "garden", "pencil", "river", "mountain", "window", "kitchen", "elephant"],
    "action words (verbs)": ["write", "climb", "borrow", "bring", "forget", "carry", "eat", "sing"],
    "describing words (adjectives)": ["brave", "tiny", "noisy", "honest", "lazy", "gentle", "huge", "clever"],
    "words that tell how (adverbs)": ["quickly", "softly", "loudly", "gently", "happily", "slowly", "bravely", "carefully"],
  };
  const REFLEX = [["Riya", "herself", ["hisself", "himself", "herselves"]], ["Aman", "himself", ["hisself", "herself", "themselves"]], ["The children", "themselves", ["theirselves", "themself", "ourselves"]], ["We", "ourselves", ["ourself", "themselves", "ourselfs"]], ["I", "myself", ["meself", "mineself", "ourselves"]], ["The kitten", "itself", ["itsself", "himself", "itselves"]]];
  const REFLEX_FR = [["hurt ___ while climbing the tree.", 1], ["looked at ___ in the mirror.", 1], ["taught ___ to ride a bicycle.", 0], ["made ___ a sandwich.", 0], ["enjoyed ___ at the party.", 0]];
  const COMP_G1 = [["tall", "taller", "tallest"], ["short", "shorter", "shortest"], ["clever", "cleverer", "cleverest"], ["young", "younger", "youngest"], ["happy", "happier", "happiest"], ["busy", "busier", "busiest"], ["wise", "wiser", "wisest"], ["good", "better", "best", 1], ["careful", "more careful", "most careful", 1], ["thin", "thinner", "thinnest"]];

  X[1].ieo = Q => {
    AX(Q, G1);
    WRONGW(Q, G1_WRONG);
    passageQs(Q, G1_PASSAGES);
    spellQs(Q, SPELL_G1, 15);
    // Jumbled sentences of 6–8 words; wrong options are near misses.
    pickN(JUMBLE1, 15).forEach(([s, alts]) => {
      const q = s.includes("Where") || s.includes("Why") ? "?" : ".";
      const ws = s.split(" ").map((x, i) => i === 0 && !KEEP1.has(x) ? x.toLowerCase() : x);
      const allowed = [s, ...alts].map(a => a.split(" ").map((x, i) => i === 0 && !KEEP1.has(x) ? x.toLowerCase() : x));
      const wrong = nearOrders(ws, allowed.map(a => a.map(x => x.toLowerCase())).concat(allowed), 3).map(w => fixCaps(w, KEEP1) + q);
      if (wrong.length < 3) return;
      Q("top", `Arrange the words to make a correct sentence:\n${mix(ws).join(" / ")}`, [s + q, ...wrong], `The correct sentence is: "${s}${q}" It starts with a capital letter and ends with '${q}'.`, sent(spaced(s + q), 0, "starts here"));
    });
    // Tenses from time clues, one or two blanks
    const FR = VERB_FRAMES.filter(f => !["see", "bring"].includes(f[0]));
    const CLUE = [["Tomorrow", v => `will ${v[0]}`, "future"], ["Next week", v => `will ${v[0]}`, "future"], ["Last night", v => v[1], "past"], ["Two days ago", v => v[1], "past"], ["Every Sunday", v => sForm(v[0]), "habit"], ["Right now", v => `is ${ing(v[0])}`, "now"]];
    const forms = v => [`will ${v[0]}`, v[1], sForm(v[0]), `is ${ing(v[0])}`];
    for (let k = 0; k < 15; k++) {
      const p = pick(NAMES_), he = HE[p];
      if (k % 2 === 0) {
        const f = pick(FR), [c, fn, kind] = pick(CLUE), ans = fn(f);
        let w = forms(f).filter(x => x !== ans); if (kind === "future") w = w.filter(x => !x.startsWith("is "));
        while (w.length < 3) w.push(f[0]);
        Q("top", `Fill in the blank: ${c}, ${p} ___ ${f[2]}.`, [ans, ...w.slice(0, 3)], `'${c}' tells us the time (${kind}), so we use '${ans}'.`, sent(spaced(`${c}, ${p} ${ans} ${f[2]}.`), 2 + c.split(" ").length, kind));
      } else {
        const [f1, f2] = pickN(FR, 2), [c1, c2] = pickN(CLUE.filter((x, i) => i !== 1 && i !== 3), 2);
        const a1 = c1[1](f1), a2 = c2[1](f2); if (c1[2] === c2[2]) continue;
        const b1 = forms(f1).filter(x => x !== a1 && !(c1[2] === "future" && x.startsWith("is "))), b2 = forms(f2).filter(x => x !== a2 && !(c2[2] === "future" && x.startsWith("is ")));
        const wrong = [...new Set([`${b1[0]}, ${a2}`, `${a1}, ${b2[0]}`, `${b1[1]}, ${b2[1]}`, `${b1[0]}, ${b2[0]}`])].slice(0, 3);
        Q("top", `Fill in both blanks:\n${c1[0]}, ${p} ___ ${f1[2]}, and ${c2[0][0].toLowerCase() + c2[0].slice(1)} ${he} ___ ${f2[2]}.`, [`${a1}, ${a2}`, ...wrong], `'${c1[0]}' needs the ${c1[2]} form (${a1}) and '${c2[0][0].toLowerCase() + c2[0].slice(1)}' needs the ${c2[2]} form (${a2}).`, F(["", c1[0], a1, 1], ["", c2[0], a2, 1]));
      }
    }
    // Reflexive pronouns
    const refl = [];
    REFLEX.forEach(([s, r, w]) => REFLEX_FR.forEach(([fr, any]) => { if (s === "The kitten" && !any) return; refl.push([s, r, w, fr]); }));
    pickN(refl, 12).forEach(([s, r, w, fr]) => Q("top", `Fill in the blank: ${s} ${fr}`, [r, ...w], `'${s}' goes with '${r}'.${w[0].match(/hisself|theirselves|ourself|meself|itsself/) ? ` '${cap1(w[0])}' is not a real word.` : ""}`, vs(s, r, "who", "-self word")));
    // Comparing two or all
    const cmp = [];
    COMP_G1.forEach(([a, c, s, irr]) => {
      const badC = irr ? (c.startsWith("more") ? c + "er" : "more " + c) : "more " + c, badS = irr ? (s.startsWith("most") ? s + "est" : "most " + s) : "most " + s;
      cmp.push([`Riya is the ___ of the two sisters. (${a})`, c, [s, badC, a], "Only TWO sisters are compared, so we use the -er (comparing) form, even after 'the'."]);
      cmp.push([`Riya is the ___ girl in her whole class. (${a})`, s, [c, badS, a], "She is compared with ALL the girls in the class, so we use the -est (most) form."]);
      cmp.push([`Riya is ___ than her cousin Meena. (${a})`, c, [s, badC, a], "'Than' compares two people, so we use the comparing form."]);
    });
    pickN(cmp, 12).forEach(([q, a, w, e]) => Q("top", `Fill in the blank: ${q}`, [a, ...w], e, F(["", w[2], "one"], ["", a, q.includes("class") ? "all" : "two", 1])));
    // Analogies, matching, odd one out, statements
    analogyQs(Q, OPP_G1, 8, (a, b) => `"${cap1(a)}" is the opposite of "${b}"`);
    analogyQs(Q, PLURAL_G1, 8, (a, b) => `The plural of "${a}" is "${b}"`);
    analogyQs(Q, PAST.irr.slice(0, 30).map(([v, p]) => [v, p]), 8, (a, b) => `The past tense of "${a}" is "${b}"`);
    analogyQs(Q, GENDER.filter(g => g[2] !== "hard").map(([m, f]) => [m, f]), 8, (a, b) => `The female of "${a}" is "${b}"`);
    analogyQs(Q, YOUNG, 6, (a, b) => `The young one of a ${a} is called a ${b}`);
    matchQs(Q, YOUNG, 6, "animal – young one");
    oddQs(Q, WORDKIND, 12, "Which word is the odd one out?");
    stateQs(Q, [
      ...rowFacts(PLURAL_G1, (a, b) => `The plural of "${a}" is "${b}".`),
      ...rowFacts(YOUNG, (a, b) => `The young one of a ${a} is a ${b}.`),
      ...rowFacts(OPP_G1, (a, b) => `The opposite of "${a}" is "${b}".`),
    ], 10);
  };

  // ======================================================================
  // GRADE 4
  // ======================================================================
  const G4 = [
    // Perfect and perfect continuous tenses
    ["🚉", "Fill in the blank: By the time we reached the station, the train ___.", "had left", ["has left", "will have left", "leaves"], "Two past actions: the train left first, then we reached. The earlier one takes the past perfect: had left.", "earlier past → had + V3"],
    ["🏫", "Fill in the blank: She ___ in this school since 2019.", "has been studying", ["is studying", "was studying", "studies"], "An action that began in the past (2019) and is still going on takes the present perfect continuous with 'since'.", "since → has been -ing"],
    ["📒", "Fill in the blank: I ___ my homework already, so I can go out now.", "have finished", ["had finished", "will finish", "was finishing"], "A finished action whose result matters now ('so I can go out now') takes the present perfect.", "result now → have + V3"],
    ["⚽", "Fill in the blank: They ___ football for two hours when it started to rain.", "had been playing", ["have been playing", "are playing", "will be playing"], "An action that went on for a time BEFORE another past action takes the past perfect continuous.", "before a past event → had been -ing"],
    ["🏢", "Fill in the blank: By next March, my father ___ in this company for ten years.", "will have worked", ["has worked", "had worked", "will work"], "'By next March' looks back from a future point: future perfect (will have + V3).", "by a future time → will have V3"],
    ["🌧️", "Which sentence is in the present perfect continuous tense?", "It has been raining since morning.", ["It had been raining since morning.", "It is raining since morning.", "It has rained since morning."], "Has/have + been + -ing is the present perfect continuous. 'It is raining since morning' is a common error.", "has been + -ing"],
    ["🪟", "Fill in the blank: Look! Someone ___ the window.", "has broken", ["had broken", "breaks", "was broken"], "We can see the result now, so we use the present perfect: has broken.", "result visible now"],
    ["🤝", "Fill in the blank: I ___ him for years; we were in the same school.", "have known", ["am knowing", "know", "was knowing"], "'Know' is not used in the -ing form. For a state lasting till now we use the present perfect: have known.", "state till now"],
    ["🎭", "Fill in the blank: When we entered the hall, the show ___.", "had already started", ["has already started", "already starts", "will already start"], "The show started before we entered (both in the past), so the earlier action takes 'had started'.", "earlier past"],
    ["🔑", "Fill in the blank: Ravi ___ his keys, so he cannot open the door now.", "has lost", ["had lost", "loses", "was losing"], "The loss affects the present ('cannot open the door now'), so we use the present perfect.", "past action, present result"],
    ["📊", "Change into the past perfect: She completes the project.", "She had completed the project.", ["She has completed the project.", "She completed the project.", "She had complete the project."], "Past perfect = had + past participle (completed).", "had + V3"],
    ["🎉", "Name the tense: By evening, the guests will have arrived.", "Future perfect", ["Future continuous", "Present perfect", "Past perfect"], "Will have + past participle is the future perfect.", "will have + V3"],
    ["👶", "Name the tense: The baby had been crying for an hour before she fell asleep.", "Past perfect continuous", ["Past continuous", "Present perfect continuous", "Past perfect"], "Had been + -ing is the past perfect continuous.", "had been + -ing"],
    ["🗾", "Fill in the blank: My sister ___ to Japan twice, and she loved it both times.", "has been", ["has gone", "had went", "is going"], "'Has been to' means visited and came back. 'Has gone to' means she is still there, so it cannot happen 'twice'.", "been = went and came back"],
    ["🤐", "Fill in the blank: He ___ a single word since he came in.", "has not spoken", ["did not speak", "had not spoke", "has not spoke"], "With 'since' we use the present perfect; the past participle of speak is spoken.", "since → has not V3"],
    ["🔔", "Fill in the blank: We ___ dinner when the doorbell rang.", "were having", ["are having", "have had", "will have"], "An action in progress (having dinner) interrupted by a shorter past action (the bell rang) takes the past continuous.", "in progress → were -ing"],
    // Voice
    ["📜", "Change into the passive voice: Who wrote this poem?", "By whom was this poem written?", ["Who was written this poem?", "By whom this poem was written?", "Who has been written this poem by?"], "'Who' becomes 'By whom', and the question keeps the question order: was + subject + V3.", "who → by whom"],
    ["🚪", "Change into the passive voice: Close the door.", "Let the door be closed.", ["The door is closed.", "Let the door closed.", "The door should closed."], "A command becomes 'Let + object + be + V3'.", "let … be + V3"],
    ["🌍", "Change into the passive voice: People speak English all over the world.", "English is spoken all over the world.", ["English was spoken all over the world.", "English is speaking all over the world.", "English has spoken all over the world."], "Simple present → is/are + V3. 'By people' is usually dropped because it adds nothing.", "is + V3"],
    ["👮", "Change into the active voice: The thief was caught by the police.", "The police caught the thief.", ["The police had caught the thief.", "The police catches the thief.", "The thief caught the police."], "Was caught (simple past passive) → caught (simple past active). The doer (police) becomes the subject.", "was + V3 → V2"],
    ["⛈️", "Which sentence is in the passive voice?", "The match has been cancelled due to rain.", ["The players have cancelled the match.", "It has been raining all day.", "The match is going to be exciting."], "Has been + past participle (cancelled), with the match receiving the action, is passive.", "been + V3"],
    ["📅", "Change into the passive voice: You must finish the work by Friday.", "The work must be finished by Friday.", ["The work must finished by Friday.", "The work must be finish by Friday.", "The work must have finished by Friday."], "Modal + be + past participle: must be finished.", "must be + V3"],
    // Reported speech
    ["🛍️", "Change into indirect speech: Riya said, \"I am going to the market.\"", "Riya said that she was going to the market.", ["Riya said that she is going to the market.", "Riya said that I was going to the market.", "Riya said that she will go to the market."], "'I' becomes 'she' and 'am going' moves back to 'was going' after 'said'.", "am → was"],
    ["🙏", "Change into indirect speech: He said to me, \"Please help me.\"", "He requested me to help him.", ["He told me that please help him.", "He requested me to help me.", "He said me to help him."], "A request becomes 'requested + to + verb'. 'Me' (the speaker) becomes 'him'.", "please → requested"],
    ["☀️", "Change into indirect speech: The teacher said, \"The earth goes round the sun.\"", "The teacher said that the earth goes round the sun.", ["The teacher said that the earth went round the sun.", "The teacher said that the earth had gone round the sun.", "The teacher said that the earth is going round the sun."], "A universal truth does not change its tense in reported speech.", "truths stay present"],
    ["🕰️", "Change into indirect speech: Mother said to me, \"Where have you been?\"", "Mother asked me where I had been.", ["Mother asked me where had I been.", "Mother said to me where I have been.", "Mother asked me where have you been."], "Questions become statements: where + subject + verb. 'Have been' moves back to 'had been'.", "asked + where I had been"],
    ["📆", "Change into indirect speech: She said, \"I will come tomorrow.\"", "She said that she would come the next day.", ["She said that she will come tomorrow.", "She said that she would come tomorrow.", "She said that she would came the next day."], "Will → would, and 'tomorrow' → 'the next day'.", "tomorrow → the next day"],
    ["🚶", "Change into indirect speech: Aman said to his friend, \"Are you coming with me?\"", "Aman asked his friend if he was coming with him.", ["Aman asked his friend if he is coming with me.", "Aman asked his friend was he coming with him.", "Aman told his friend that are you coming with him."], "A yes/no question uses 'asked … if'. Are → was, you → he, me → him.", "asked if"],
    ["🏃", "Change into indirect speech: The coach said to the players, \"Don't stop running.\"", "The coach told the players not to stop running.", ["The coach told the players don't stop running.", "The coach told the players that not stop running.", "The coach asked the players that they do not stop running."], "A negative command becomes 'told … not to + verb'.", "don't → not to"],
    ["🔄", "Change into direct speech: She said that she had finished her work.", "She said, \"I have finished my work.\"", ["She said, \"I had finished her work.\"", "She said, \"She has finished her work.\"", "She said, \"I finished her work.\""], "Going back to direct speech: she → I, her → my, had finished → have finished.", "had → have"],
    ["🌅", "Change into indirect speech: He said, \"What a beautiful sunset!\"", "He exclaimed that it was a very beautiful sunset.", ["He exclaimed what a beautiful sunset.", "He said that what a beautiful sunset it is.", "He asked that it was a beautiful sunset."], "Exclamations become 'exclaimed that …' and 'what a' is replaced by 'very'.", "exclaimed that"],
    ["🏊", "Change into indirect speech: Ravi said, \"I can swim.\"", "Ravi said that he could swim.", ["Ravi said that he can swam.", "Ravi said that he could swam.", "Ravi said that I could swim."], "Can → could, and the main verb stays in its base form (swim).", "can → could"],
    // Modals
    ["📚", "Fill in the blank: You ___ not shout in the library. It is against the rules.", "must", ["might", "would", "need"], "'Must not' shows that something is not allowed.", "must not = not allowed"],
    ["👕", "Fill in the blank: You ___ wear the uniform on Saturdays; it is optional.", "need not", ["must not", "should", "must"], "'Need not' means it is not necessary. 'Must not' would mean it is forbidden.", "not necessary"],
    ["🖊️", "Fill in the blank: ___ I borrow your pen, please?", "May", ["Must", "Would", "Ought"], "'May I …?' is the polite way to ask for permission.", "permission"],
    ["🤒", "Fill in the blank: He looks very pale. He ___ be ill.", "must", ["ought", "need", "dare"], "'Must' here shows a strong guess based on what we see. 'Ought' would need 'to'.", "strong guess"],
    ["🏊", "Fill in the blank: When I was five, I ___ swim, but now I can.", "couldn't", ["can't", "mustn't", "shouldn't"], "The past of 'can' is 'could'. 'Couldn't' = was not able to.", "past ability"],
    ["🌥️", "Fill in the blank: It is very cloudy. It ___ rain this evening.", "may", ["ought", "need", "dare"], "'May' shows something is possible.", "possibility"],
    ["🩺", "Fill in the blank: You had better ___ a doctor about that cough.", "see", ["to see", "seeing", "saw"], "'Had better' is followed by the base form of the verb, without 'to'.", "had better + V1"],
    // Conditionals
    ["🐦", "Fill in the blank: If I ___ a bird, I would fly over the mountains.", "were", ["am", "will be", "had"], "For an imaginary situation we use 'If I were …, I would …'.", "imaginary → were"],
    ["🧊", "Fill in the blank: If you heat ice, it ___.", "melts", ["melted", "would melt", "had melted"], "A scientific fact uses the present in both parts: If you heat ice, it melts.", "fact → present"],
    ["🚆", "Fill in the blank: If she had left earlier, she ___ the train.", "would have caught", ["would catch", "will catch", "had caught"], "If + had + V3 (past, did not happen) → would have + V3.", "had V3 → would have V3"],
    ["📝", "Fill in the blank: Unless you work hard, you ___ pass.", "will not", ["will", "would", "did not"], "'Unless' means 'if not': If you do not work hard, you will not pass.", "unless = if not"],
    ["☔", "Which sentence is correct?", "If it rains, we will stay at home.", ["If it will rain, we will stay at home.", "If it rained, we will stay at home.", "If it rains, we would stayed at home."], "If + present, will + verb. We do not use 'will' in the if-part.", "if + present, will"],
    ["⌛", "Fill in the blank: I would help you if I ___ more time.", "had", ["have", "will have", "would have"], "Would + verb in one part goes with the past (had) in the if-part.", "would … if + past"],
    // Question tags
    ["🚶", "Choose the correct question tag: Let's go for a walk, ___?", "shall we", ["will we", "don't we", "let we"], "Sentences beginning with 'Let's' take the tag 'shall we?'", "let's → shall we"],
    ["🎈", "Choose the correct question tag: Nobody came to the party, ___?", "did they", ["didn't they", "did he", "didn't he"], "'Nobody' is negative, so the tag is positive, and it takes 'they'.", "nobody → did they"],
    ["🤗", "Choose the correct question tag: I am your best friend, ___?", "aren't I", ["amn't I", "isn't I", "don't I"], "The tag for 'I am' is 'aren't I?'", "I am → aren't I"],
    ["📖", "Choose the correct question tag: He hardly ever studies, ___?", "does he", ["doesn't he", "is he", "isn't he"], "'Hardly' makes the sentence negative, so the tag is positive.", "hardly → positive tag"],
    ["👥", "Choose the correct question tag: Everyone has arrived, ___?", "haven't they", ["hasn't he", "hasn't it", "have they"], "'Everyone' takes 'they' in the tag; the sentence is positive, so the tag is negative.", "everyone → they"],
    ["🪟", "Choose the correct question tag: Open the window, ___?", "will you", ["do you", "don't you", "are you"], "A request or command takes 'will you?'", "command → will you"],
    ["🥛", "Choose the correct question tag: There is no milk left, ___?", "is there", ["isn't there", "is it", "isn't it"], "'No milk' makes the sentence negative, and 'there' is repeated in the tag.", "there … is there"],
    ["🙋", "Choose the correct question tag: Few people knew the answer, ___?", "did they", ["didn't they", "knew they", "do they"], "'Few' means 'almost none', so the sentence is negative and the tag is positive.", "few → positive tag"],
    // Agreement
    ["🥭", "Fill in the blank: The quality of these mangoes ___ excellent.", "is", ["are", "were", "have"], "The subject is 'quality' (singular), not 'mangoes'.", "quality → is"],
    ["🍞", "Fill in the blank: Bread and butter ___ my favourite breakfast.", "is", ["are", "were", "have been"], "'Bread and butter' is one dish, so it takes a singular verb.", "one dish → is"],
    ["🏏", "Fill in the blank: Neither the captain nor the players ___ happy with the result.", "were", ["was", "is", "has"], "With neither … nor, the verb agrees with the nearer subject: players → were.", "nearer subject"],
    ["📰", "Fill in the blank: The news ___ very shocking.", "was", ["were", "are", "have been"], "'News' looks plural but is singular.", "news → singular"],
    ["✂️", "Fill in the blank: A pair of scissors ___ lying on the table.", "was", ["were", "are", "have been"], "The subject is 'a pair' (one), so the verb is singular.", "a pair → was"],
    // Articles
    ["⚖️", "Choose the correct option: ___ honesty is ___ best policy.", "(no article), the", ["The, the", "An, a", "The, a"], "Abstract nouns used in general take no article: Honesty. 'Best' is a superlative, so it takes 'the'.", "no article + the best"],
    ["🌍", "Fill in the blanks: She is ___ European, but her husband is ___ Indian.", "a, an", ["an, an", "an, a", "a, a"], "'European' starts with a 'you' sound (consonant) → a. 'Indian' starts with a vowel sound → an.", "sound decides"],
    ["🤲", "Fill in the blanks: ___ rich should help ___ poor.", "The, the", ["A, a", "The, a", "(no article), (no article)"], "'The + adjective' means a whole group of people: the rich, the poor.", "the + adjective = group"],
    ["👦", "Fill in the blank: He is ___ only child of his parents.", "the", ["an", "a", "(no article)"], "'Only' makes him one particular person, so we use 'the'.", "the only"],
    ["🏛️", "Fill in the blank: My uncle is ___ MP from Kerala.", "an", ["a", "(no article)", "any"], "MP is read 'em-pee', which begins with a vowel sound.", "em-pee → an"],
    ["🚂", "Fill in the blanks: We travelled by ___ train to ___ Shimla.", "(no article), (no article)", ["the, the", "a, the", "the, (no article)"], "'By train' (means of travel) takes no article, and names of towns take no article.", "by train, to Shimla"],
    // Prepositions after words
    ["💰", "Fill in the blank: He was accused ___ stealing the money.", "of", ["for", "with", "about"], "We say 'accused of'.", "accused of"],
    ["🍵", "Fill in the blank: I prefer tea ___ coffee.", "to", ["than", "from", "with"], "We say 'prefer A to B'. 'Than' is used after comparative words like 'better'.", "prefer … to"],
    ["🤫", "Fill in the blank: The teacher insisted ___ complete silence.", "on", ["for", "at", "about"], "We say 'insist on'.", "insist on"],
    ["👜", "Fill in the blank: This bag is superior ___ that one.", "to", ["than", "from", "over"], "Words ending in -ior (superior, inferior, senior, junior) take 'to', not 'than'.", "superior to"],
    ["🎓", "Fill in the blank: He is senior ___ me by two years.", "to", ["than", "from", "over"], "Senior and junior take 'to'.", "senior to"],
    ["🏆", "Fill in the blank: She congratulated me ___ my success.", "on", ["for", "at", "with"], "We congratulate someone on something.", "congratulate on"],
    ["🍔", "Fill in the blank: We must abstain ___ junk food.", "from", ["of", "with", "against"], "We say 'abstain from' (keep away from).", "abstain from"],
    ["📏", "Fill in the blank: Everyone must comply ___ the rules.", "with", ["to", "for", "by"], "We say 'comply with'.", "comply with"],
    ["🎮", "Fill in the blank: He is addicted ___ video games.", "to", ["with", "of", "for"], "We say 'addicted to'.", "addicted to"],
    ["💨", "Fill in the blank: The room was full ___ smoke.", "of", ["with", "by", "from"], "We say 'full of' (but 'filled with').", "full of"],
    ["📋", "Fill in the blank: I was not aware ___ the new rules.", "of", ["about", "with", "for"], "The correct phrase is 'aware of'.", "aware of"],
    ["💬", "Fill in the blank: My opinion differs ___ yours.", "from", ["than", "to", "by"], "We say 'differ from'.", "differ from"],
    // Phrasal verbs
    ["🎤", "Fill in the blank: The meeting was ___ because the chief guest was ill.", "called off", ["called on", "called up", "called for"], "'Call off' means cancel. 'Call on' means visit; 'call up' means phone.", "call off = cancel"],
    ["🐕", "Fill in the blank: Please ___ my dog while I am away.", "look after", ["look into", "look up", "look for"], "'Look after' means take care of.", "look after = care for"],
    ["🔍", "Fill in the blank: The police are ___ the matter.", "looking into", ["looking after", "looking up to", "looking out"], "'Look into' means investigate.", "look into = investigate"],
    ["💪", "Fill in the blank: Don't ___ now; keep trying!", "give up", ["give out", "give away", "give off"], "'Give up' means stop trying.", "give up = stop trying"],
    ["🚗", "Fill in the blank: Our car ___ on the highway, so we called a mechanic.", "broke down", ["broke up", "broke into", "broke out"], "'Break down' means stop working (for machines).", "break down = stop working"],
    ["👵", "Fill in the blank: Riya ___ her grandmother; they have the same smile.", "takes after", ["takes off", "takes over", "takes up"], "'Take after' means look or behave like an older relative.", "take after = resemble"],
    ["🧂", "Fill in the blank: We ran ___ sugar, so I went to the shop.", "out of", ["into", "over", "away with"], "'Run out of' means use up completely.", "run out of = use up"],
    ["😤", "Fill in the blank: I cannot put ___ his rude behaviour any longer.", "up with", ["off", "on", "out"], "'Put up with' means tolerate.", "put up with = tolerate"],
    ["⏸️", "Fill in the blank: Let's ___ the trip until the rain stops.", "put off", ["put on", "put up", "put out"], "'Put off' means postpone.", "put off = postpone"],
    ["✈️", "Fill in the blank: The plane ___ on time.", "took off", ["took after", "took up", "took in"], "'Take off' means leave the ground (for a plane).", "take off = leave the ground"],
    ["🛍️", "Fill in the blank: She ___ an old friend at the market.", "came across", ["came off", "came over", "came up"], "'Come across' means meet or find by chance.", "come across = meet by chance"],
    ["🔥", "Fill in the blank: Fire ___ in the building at midnight.", "broke out", ["broke down", "broke in", "broke up"], "'Break out' means start suddenly (fire, war, disease).", "break out = start suddenly"],
    ["🌟", "Fill in the blank: I look ___ to my teacher; she is my role model.", "up", ["after", "into", "over"], "'Look up to' means admire and respect.", "look up to = admire"],
    // Idioms and proverbs
    ["🕯️", "What does 'to burn the midnight oil' mean?", "to work or study late into the night", ["to waste fuel", "to cook late at night", "to go to sleep very early"], "In old times people studied by oil lamps late at night.", "idiom"],
    ["⚡", "What does 'a bolt from the blue' mean?", "a complete surprise", ["a flash of lightning", "a bright sunny day", "a carefully planned event"], "Lightning from a clear blue sky would be completely unexpected.", "idiom"],
    ["🐈", "What does 'to let the cat out of the bag' mean?", "to reveal a secret", ["to set a pet free", "to make a mess", "to cause trouble on purpose"], "It means to tell a secret, usually by mistake.", "idiom"],
    ["🚣", "What does 'to be in the same boat' mean?", "to be in the same difficult situation", ["to travel together", "to be best friends", "to be fond of sailing"], "People in the same boat face the same problem.", "idiom"],
    ["🧵", "Which proverb fits? Riya kept putting off her project and then had to stay up all night to finish it.", "A stitch in time saves nine", ["All that glitters is not gold", "Too many cooks spoil the broth", "Barking dogs seldom bite"], "Doing a job early saves much more work later.", "proverb"],
    ["📘", "Complete the proverb: Don't judge a book by its ___.", "cover", ["title", "pages", "price"], "Don't judge someone or something only by how it looks.", "proverb"],
    ["✨", "What does 'All that glitters is not gold' mean?", "Things that look attractive may not be valuable", ["Gold is always shiny", "Only gold can glitter", "Shiny things are always costly"], "Something that looks good on the outside may not be good.", "proverb"],
    ["🤝", "Which proverb means 'working together makes a task easier'?", "Many hands make light work", ["Too many cooks spoil the broth", "Empty vessels make the most noise", "Haste makes waste"], "'Too many cooks spoil the broth' means almost the opposite: too many people can ruin a job.", "proverb"],
    ["🍃", "What does 'to turn over a new leaf' mean?", "to change one's behaviour for the better", ["to start reading a new book", "to plant a tree", "to sweep the garden"], "It means to make a fresh start and behave better.", "idiom"],
    ["🌳", "What does 'to beat about the bush' mean?", "to avoid coming to the point", ["to hunt in a forest", "to work very hard", "to defeat an enemy"], "It means talking around a subject without saying the main thing.", "idiom"],
    ["👂", "What does 'to be all ears' mean?", "to listen very carefully", ["to have big ears", "to hear nothing", "to be very noisy"], "If you are all ears, you are listening eagerly.", "idiom"],
    ["🥁", "What does 'Empty vessels make the most noise' mean?", "People who know little often talk the most", ["Empty pots are noisy", "Hungry people are loud", "Noise fills empty rooms"], "Those with little knowledge often boast loudly.", "proverb"],
    // Homonyms
    ["🌲", "In which sentence does 'bark' mean the outer covering of a tree?", "The bark of this old oak is rough.", ["The bark of the dog woke me up.", "Dogs bark at strangers.", "I heard a loud bark outside."], "'Bark' has two meanings: the sound a dog makes and the hard outer layer of a tree.", "same word, two meanings"],
    ["🦇", "In which sentence does 'bat' mean an animal?", "A bat hung upside down in the cave.", ["He hit the ball with his bat.", "It is my turn to bat.", "She bought a new cricket bat."], "A bat (animal) sleeps hanging upside down.", "same word, two meanings"],
    ["🌸", "Which word means both 'a season' and 'to jump suddenly'?", "spring", ["summer", "leap", "autumn"], "Spring is a season, and to spring means to jump.", "spring"],
    ["🌿", "Which word means both 'part of a tree' and 'one office of a bank'?", "branch", ["trunk", "root", "leaf"], "A branch grows from a tree; a bank also has many branches.", "branch"],
    ["🏦", "Which word fits both blanks?\nThe ___ of the river was muddy. / I keep my money in the ___.", "bank", ["shore", "side", "purse"], "'Bank' means the land beside a river and also a place for money.", "bank"],
    ["🐻", "Which word fits both blanks?\nI can't ___ this noise any more. / A brown ___ lives in the forest.", "bear", ["bare", "stand", "tolerate"], "'Bear' means tolerate and is also an animal. 'Stand' fits only the first blank.", "bear"],
    // Confusables
    ["🌡️", "Fill in the blank: The cold weather did not ___ the match.", "affect", ["effect", "infect", "afect"], "'Affect' is a verb (to change something). 'Effect' is usually a noun (a result).", "affect = verb"],
    ["💊", "Fill in the blank: The new rule had a good ___ on the students.", "effect", ["affect", "efect", "infect"], "After 'a good' we need a noun: effect.", "effect = noun"],
    ["👖", "Fill in the blank: My belt is too ___; I need a smaller one.", "loose", ["lose", "lost", "loss"], "'Loose' means not tight. 'Lose' means to misplace.", "loose = not tight"],
    ["🎟️", "Fill in the blank: Hold them carefully. Don't ___ your tickets.", "lose", ["loose", "loss", "lost"], "'Lose' is the verb meaning misplace.", "lose = misplace"],
    ["😴", "Fill in the blank: The dog likes to ___ in the sun all afternoon.", "lie", ["lay", "laid", "lain"], "'Lie' means to rest flat (no object). 'Lay' means to put something down.", "lie = rest"],
    ["🍽️", "Fill in the blank: Please ___ the plates on the table.", "lay", ["lie", "lain", "lied"], "'Lay' needs an object: lay the plates.", "lay + object"],
    ["💡", "Fill in the blank: Can you give me some ___ about my project?", "advice", ["advise", "advices", "advises"], "'Advice' (with c) is the noun and has no plural.", "advice = noun"],
    ["🌂", "Fill in the blank: I would ___ you to take an umbrella.", "advise", ["advice", "advising", "advices"], "'Advise' (with s) is the verb.", "advise = verb"],
    ["🧑‍💼", "Fill in the blank: The ___ of our school spoke at the assembly.", "principal", ["principle", "principel", "princible"], "The head of a school is the principal. A principle is a rule or belief.", "principal = head"],
    ["🧭", "Fill in the blank: Honesty is an important ___ in life.", "principle", ["principal", "principel", "principals"], "A principle is a rule or belief we live by.", "principle = rule"],
    ["🖇️", "Fill in the blank: We buy pens, paper and envelopes at the ___ shop.", "stationery", ["stationary", "station", "statuary"], "Stationery (with e, like envelopes) means writing materials. Stationary means not moving.", "stationery = paper, pens"],
    ["🚦", "Fill in the blank: The car remained ___ at the red signal.", "stationary", ["stationery", "station", "stationer"], "Stationary (with a) means not moving.", "stationary = still"],
    ["🎉", "Fill in the blank: Everyone ___ Riya came to the party; she was ill.", "except", ["accept", "expect", "excepted"], "'Except' means 'but not'. 'Accept' means to take or agree to.", "except = but not"],
    ["💌", "Fill in the blank: Please ___ my apology.", "accept", ["except", "expect", "access"], "'Accept' means to receive or agree to.", "accept = receive"],
    ["🎒", "Fill in the blank: ___ bag is this on the bench?", "Whose", ["Who's", "Whom", "Who"], "'Whose' asks who owns something. 'Who's' means 'who is'.", "whose = belonging"],
    ["🌲", "Fill in the blank: We walked ___ the thick forest.", "through", ["threw", "though", "thorough"], "'Through' means from one end to the other. 'Threw' is the past of throw.", "through"],
    // Word formation
    ["🦁", "What is the noun form of 'brave'?", "bravery", ["bravely", "braver", "bravest"], "Bravery is the quality of being brave. Bravely is an adverb.", "brave → bravery"],
    ["⚠️", "What is the adjective form of 'danger'?", "dangerous", ["dangerously", "endanger", "dangers"], "Danger + -ous = dangerous. Endanger is a verb.", "-ous → adjective"],
    ["💪", "What is the verb form of 'strong'?", "strengthen", ["strength", "strongly", "stronger"], "To strengthen means to make strong. 'Strength' is the noun.", "-en → verb"],
    ["⏳", "Fill in the blank with the correct form of 'patient': She showed great ___ while waiting.", "patience", ["patients", "patiently", "patientness"], "We need a noun after 'great': patience. 'Patients' are sick people.", "noun → patience"],
    ["🛋️", "Which suffix turns 'comfort' into an adjective?", "-able (comfortable)", ["-ness (comfortness)", "-ment (comfortment)", "-ly (comfortly)"], "Comfort + -able = comfortable.", "-able → adjective"],
    ["🍎", "What is the opposite of 'mature'?", "immature", ["unmature", "inmature", "dismature"], "Words starting with m often take 'im-': immature, impossible, impolite.", "im- before m"],
    ["🗣️", "Which word is spelt correctly?", "argument", ["arguement", "argumant", "arguemant"], "Argue drops its e before -ment: argument.", "argue → argument"],
    ["🧑‍⚖️", "What is the noun form of 'decide'?", "decision", ["decidement", "decidation", "decisive"], "Decide → decision. 'Decisive' is an adjective.", "decide → decision"],
    // Clauses and joining
    ["🔔", "Fill in the blank: No sooner had the bell rung ___ the children ran out.", "than", ["when", "then", "that"], "'No sooner' is always followed by 'than'.", "no sooner … than"],
    ["🚆", "Fill in the blank: Hardly had we reached the station ___ the train left.", "when", ["than", "then", "while"], "'Hardly' and 'scarcely' are followed by 'when'.", "hardly … when"],
    ["🧓", "Combine into one sentence: He is very weak. He cannot walk.", "He is too weak to walk.", ["He is too weak that he cannot walk.", "He is so weak to walk.", "He is very weak to walk."], "too + adjective + to + verb. (Or: He is so weak that he cannot walk.)", "too … to"],
    ["🏅", "Combine into one sentence: The girl won the prize. She is my cousin.", "The girl who won the prize is my cousin.", ["The girl which won the prize is my cousin.", "The girl won the prize who is my cousin.", "The girl whom won the prize is my cousin."], "Use 'who' for people when they are the subject of the clause. Keep the clause right after 'the girl'.", "who for people"],
    ["🧗", "Fill in the blank: Walk carefully ___ you should fall.", "lest", ["unless", "until", "so"], "'Lest' means 'so that … not', and is followed by 'should'.", "lest … should"],
    ["🤒", "Fill in the blank: ___ he was ill, he attended the meeting.", "Though", ["Because", "Unless", "Since"], "Being ill and still attending are opposite ideas, so we use 'though'.", "contrast"],
    ["🏠", "What kind of clause are the words in capitals?\nI know WHERE HE LIVES.", "Noun clause", ["Adjective clause", "Adverb clause", "Main clause"], "The clause answers 'know what?', so it works as the object, like a noun.", "answers 'what?'"],
    ["🔴", "Fill in the blank: The house ___ roof is red belongs to my uncle.", "whose", ["which", "who's", "whom"], "'Whose' shows belonging: the house's roof.", "whose = of which"],
    ["💃", "Fill in the blank: Not only did she sing, ___ she also danced.", "but", ["and", "so", "nor"], "'Not only' pairs with 'but also'.", "not only … but also"],
    // Sentence improvement
    ["👔", "Improve the part in capitals: He is senior THAN ME.", "to me", ["from me", "over me", "No improvement"], "Senior takes 'to', not 'than'.", "senior to"],
    ["🚂", "Improve the part in capitals: She HAS GONE to Delhi last week.", "went", ["had gone", "has been", "No improvement"], "'Last week' is a finished past time, so we use the simple past, not the present perfect.", "last week → went"],
    ["🐄", "Improve the part in capitals: The cattle IS GRAZING in the field.", "are grazing", ["was grazing", "grazes", "No improvement"], "'Cattle' is always plural.", "cattle → are"],
    ["🏃", "Improve the part in capitals: Unless you DO NOT HURRY, you will miss the bus.", "hurry", ["will not hurry", "did not hurry", "No improvement"], "'Unless' already means 'if not', so we do not add another 'not'.", "unless = if not"],
    ["🗒️", "Improve the part in capitals: Let us DISCUSS ABOUT the plan.", "discuss", ["discuss on", "discussing about", "No improvement"], "'Discuss' already means 'talk about', so no preposition follows it.", "discuss (no about)"],
    ["👧", "Improve the part in capitals: Each of the girls HAS DONE her homework.", "No improvement", ["have done", "have did", "has did"], "'Each' is singular, so 'has done' is already correct.", "already correct"],
    ["🚶", "Improve the part in capitals: He insisted TO GO alone.", "on going", ["for going", "to going", "No improvement"], "'Insist' is followed by 'on' + -ing.", "insist on -ing"],
    // Two-blank fills
    ["📕", "Fill in both blanks: She ___ the book on the table and ___ down to rest.", "laid, lay", ["lay, laid", "laid, laid", "lay, lay"], "Laid = put something down (past of lay). Lay = rested (past of lie).", "laid it / lay down"],
    ["📚", "Fill in both blanks: If he ___ harder, he ___ passed.", "had worked, would have", ["worked, would have", "had worked, will have", "has worked, would"], "Past condition that did not happen: If + had + V3, would have + V3.", "had … would have"],
    ["🏠", "Fill in both blanks: Neither Riya ___ her brothers ___ at home.", "nor, were", ["nor, was", "or, were", "or, was"], "Neither pairs with nor. The verb agrees with the nearer subject (brothers → were).", "neither … nor"],
    ["🏋️", "Fill in both blanks: He ___ to the gym every day, but at the moment he ___ at home with a cold.", "goes, is staying", ["go, stay", "is going, stays", "went, staying"], "A habit takes the simple present (goes); 'at the moment' takes the present continuous (is staying).", "habit / right now"],
    ["🏅", "Fill in both blanks: She is ___ honest girl and ___ pride of her school.", "an, the", ["a, the", "an, a", "the, an"], "An honest (silent h). 'The pride of' refers to one particular thing.", "an + the"],
    ["🚉", "Fill in both blanks: The train ___ before we ___ the station.", "had left, reached", ["left, had reached", "has left, reach", "had left, had reached"], "The earlier action takes had + V3 (had left); the later one takes the simple past (reached).", "earlier → had V3"],
    ["🧑‍🤝‍🧑", "Fill in both blanks: I ___ him since we ___ children.", "have known, were", ["know, were", "have known, are", "knew, have been"], "Since + past time (we were children); the main clause takes the present perfect.", "have known since …"],
    // Written and spoken expression
    ["✉️", "A formal letter begins 'Dear Sir'. Which closing is correct?", "Yours faithfully", ["Yours lovingly", "Your faithfully", "Yours Faithfuly"], "With 'Dear Sir/Madam' we close with 'Yours faithfully' (capital Y only, no apostrophe).", "Dear Sir → Yours faithfully"],
    ["🤒", "You are writing to your Principal for two days' leave. Which is the best opening line?", "I am writing to request leave for two days as I am suffering from high fever.", ["Hey! I won't come to school tomorrow.", "I am sick so I won't come, OK?", "Give me two days' leave because I am ill."], "A formal letter is polite, clear and gives the reason.", "formal and polite"],
    ["📌", "A notice is usually written to ___", "give information to a large group of people", ["share news with a close friend", "tell a story", "thank a relative"], "A notice is short, formal and meant for many readers.", "notice = for many"],
    ["🚌", "Which detail is NOT needed in a school notice about a picnic?", "The names of every student's parents", ["Date and time of the picnic", "Place of the picnic", "Name and post of the person issuing it"], "A notice gives what, when, where and who issued it.", "what, when, where, who"],
    ["♟️", "Your friend has lost the final of a chess tournament. What is the most suitable thing to say?", "Hard luck! You played really well, and you'll win next time.", ["Congratulations on losing!", "I knew you would lose.", "Chess is a boring game anyway."], "Comfort and encourage your friend.", "kind words"],
    ["🪙", "A shopkeeper gives you ten rupees less in change. What is the best thing to say?", "Excuse me, I think you've given me ten rupees less.", ["You're cheating me!", "Give my money back now.", "Your maths is terrible."], "Point out the mistake politely without blaming.", "polite and clear"],
    ["💌", "Which is the most suitable reply to a formal invitation you cannot attend?", "Thank you for your kind invitation. I regret that I will not be able to attend owing to a prior engagement.", ["Can't come. Sorry.", "I don't want to come to your function.", "Maybe I'll come, maybe not."], "A formal reply thanks the host, regrets, and gives a reason.", "thank + regret + reason"],
    ["🔊", "Your neighbour plays loud music late at night. Which is the most polite request?", "Could you please lower the volume after ten? My grandmother can't sleep.", ["Stop that noise right now!", "Your music is terrible.", "I will call the police if you don't stop."], "'Could you please …' with a reason is polite.", "could you please"],
    ["🐕", "Which is the best 'Subject' line for a letter to the editor about stray dogs?", "Subject: Menace of stray dogs in our locality", ["Subject: Dear Editor", "Subject: Yours faithfully", "Subject: My name is Riya"], "The subject line states the topic of the letter briefly.", "states the topic"],
    ["🪟", "A: \"Would you mind opening the window?\"\nB: \"___\"", "Not at all. I'll do it right away.", ["Yes, I would mind. I'll do it.", "No, I mind.", "Yes, open it yourself."], "'Would you mind …?' means 'Is it a problem for you?' 'Not at all' means 'No problem, I will.'", "not at all = happy to"],
    ["✏️", "A: \"I'm sorry I broke your pencil.\"\nB: \"___\"", "That's all right. I have another one.", ["You're welcome.", "Congratulations!", "Same to you."], "When someone apologises, we can accept kindly: That's all right.", "accept an apology"],
    ["🏢", "Which sentence is the most formal?", "Kindly inform us of your decision at the earliest.", ["Let us know what you decide, okay?", "Tell us soon what you want.", "So, what's your plan?"], "'Kindly inform us … at the earliest' is formal written English.", "formal tone"],
    // Odd one out and analogies
    ["🧩", "Which word is NOT a noun?", "beautify", ["beauty", "brotherhood", "kindness"], "'Beautify' is a verb (to make beautiful). The others are nouns.", "verb"],
    ["🧩", "Which is the odd one out?\nfriendly, lovely, quickly, lonely", "quickly", ["friendly", "lovely", "lonely"], "Friendly, lovely and lonely are adjectives that end in -ly. Quickly is an adverb.", "adverb"],
    ["🧩", "Which is the odd one out?\nbouquet, galaxy, fleet, island", "island", ["bouquet", "galaxy", "fleet"], "A bouquet (of flowers), a galaxy (of stars) and a fleet (of ships) are collective nouns.", "not a group"],
    ["🎼", "Author : book :: composer : ___", "music", ["painting", "poem", "statue"], "An author creates a book; a composer creates music.", "creator : creation"],
    ["🐸", "Hen : chick :: frog : ___", "tadpole", ["cub", "kid", "foal"], "A chick is a young hen; a tadpole is a young frog.", "young one"],
    ["🔪", "Pen : write :: knife : ___", "cut", ["sharp", "kitchen", "metal"], "A pen is used to write; a knife is used to cut.", "tool : use"],
    ["⚖️", "Kilometre : distance :: kilogram : ___", "weight", ["length", "volume", "time"], "Kilometre measures distance; kilogram measures weight (mass).", "unit : quantity"],
    ["🦉", "Brave : bravery :: wise : ___", "wisdom", ["wiseness", "wisely", "wiser"], "Bravery is the noun of brave; wisdom is the noun of wise.", "adjective : noun"],
    ["🐘", "Lion : roar :: elephant : ___", "trumpet", ["bray", "howl", "hiss"], "Lions roar and elephants trumpet.", "animal : sound"],
  ];

  const G4_ERR = [
    ["Each of the students", "have submitted", "the project on time.", 1, "Each of the students has submitted the project on time.", "'Each' is singular, so it takes 'has'."],
    ["One of my friends", "are going", "to London next week.", 1, "One of my friends is going to London next week.", "The subject is 'one', so the verb is singular: is going."],
    ["He did not", "went to school", "because he was ill.", 1, "He did not go to school because he was ill.", "After 'did not' we use the base form: go."],
    ["The teacher, along with her students,", "were present", "at the function.", 1, "The teacher, along with her students, was present at the function.", "With 'along with', the verb agrees with the first subject (the teacher)."],
    ["She is", "more cleverer", "than her brother.", 1, "She is cleverer than her brother.", "Never use 'more' with an -er word."],
    ["I have been", "living in Pune", "since five years.", 2, "I have been living in Pune for five years.", "'Five years' is a length of time, so we use 'for'."],
    ["If I was you,", "I would apologise", "to her at once.", 0, "If I were you, I would apologise to her at once.", "In imaginary conditions we use 'If I were'."],
    ["Neither of the two answers", "is correct,", "so try again.", 3, "Neither of the two answers is correct, so try again.", "'Neither' is singular, so 'is' is right. The sentence has no error."],
    ["The furniture", "in this room", "are very old.", 2, "The furniture in this room is very old.", "'Furniture' is uncountable and takes a singular verb."],
    ["He is one of those boys", "who always", "comes late.", 2, "He is one of those boys who always come late.", "'Who' refers to 'boys' (plural), so the verb is 'come'."],
    ["Hardly had I", "reached home", "than it began to rain.", 2, "Hardly had I reached home when it began to rain.", "'Hardly' is followed by 'when', not 'than'."],
    ["My father gave me", "an useful", "piece of advice.", 1, "My father gave me a useful piece of advice.", "'Useful' begins with a 'you' sound, so we use 'a'."],
    ["She has", "returned back", "from Mumbai.", 1, "She has returned from Mumbai.", "'Return' already means 'come back', so 'back' is extra."],
    ["We discussed about", "the problem", "for an hour.", 0, "We discussed the problem for an hour.", "'Discuss' is not followed by 'about'."],
    ["The boys", "were playing cricket", "when it started to rain.", 3, "The boys were playing cricket when it started to rain.", "The past continuous (were playing) with a shorter past action (started) is correct. No error."],
    ["Mathematics", "are my", "favourite subject.", 1, "Mathematics is my favourite subject.", "'Mathematics' ends in s but is singular."],
    ["Neither Ravi", "nor his friends", "was invited.", 2, "Neither Ravi nor his friends were invited.", "The verb agrees with the nearer subject: friends → were."],
    ["The police", "has arrested", "the thief.", 1, "The police have arrested the thief.", "'Police' is always plural."],
  ];

  const G4_PASSAGES = [
    ["A rainy holiday (cloze)", "Last summer, my family went (1) a trip to Ooty. We had been planning it (2) months. As soon as we reached, it (3) to rain heavily. Instead of feeling disappointed, we sat by the window, sipping hot tea and (4) the mist roll over the hills. It turned out to be (5) most peaceful holiday we had ever had.", [
      ["Choose the word for blank (1).", "on", ["for", "in", "at"], "We say 'go on a trip'."],
      ["Choose the word for blank (2).", "for", ["since", "from", "by"], "'Months' is a length of time, so we use 'for'."],
      ["Choose the word for blank (3).", "began", ["begins", "has begun", "beginning"], "The story is in the past, so we use the simple past: began."],
      ["Choose the word for blank (4).", "watching", ["watch", "to watching", "watches"], "It must match 'sipping': sipping hot tea and watching the mist."],
      ["Choose the word for blank (5).", "the", ["a", "an", "one"], "'Most peaceful … we had ever had' is a superlative, so it takes 'the'."],
    ]],
    ["The seed vault", "In the frozen mountains of Norway lies a remarkable vault. Inside, over a million packets of seeds from almost every country are stored at minus eighteen degrees Celsius. Scientists call it a 'doomsday vault' because it is meant to protect the world's crops from disasters such as floods, wars or disease. If a variety of rice or wheat is ever wiped out somewhere, its seeds can be taken from the vault and planted again. In 2015, researchers working in Syria became the first to take seeds out, after war damaged their own seed bank.", [
      ["Why are the seeds most likely kept at such a low temperature?", "To keep them usable for a very long time", ["To stop scientists from taking them", "To make them grow faster", "Because Norway has no electricity"], "The vault must keep seeds safe for years so they can be planted later. Cold keeps them from spoiling."],
      ["In the passage, 'remarkable' means ___", "extraordinary", ["ordinary", "secret", "ancient"], "Remarkable means worth noticing, unusual."],
      ["Why is it called a 'doomsday vault'?", "It is meant to protect crops in case of disasters", ["It was built on a dangerous mountain", "It is opened only on one day a year", "It stores seeds of poisonous plants"], "\"It is meant to protect the world's crops from disasters.\""],
      ["What can we infer about the researchers' own seed bank in Syria?", "It had been damaged and could not supply the seeds they needed", ["It was bigger than the vault in Norway", "It had never stored any seeds", "It was in the frozen mountains of Norway"], "They took seeds out of the vault after war damaged their own seed bank."],
      ["In the passage, 'wiped out' means ___", "destroyed completely", ["cleaned carefully", "planted again", "dried in the sun"], "If a crop is wiped out, none of it is left."],
    ]],
    ["The letter", "Grandfather's hands trembled as he opened the envelope. For forty years he had waited to hear from Hamid, the friend he had left behind in Lahore. The letter was short. Hamid wrote that he was well, that his grandchildren loved cricket, and that he still kept the kite Grandfather had made for him when they were boys. Grandfather read it twice, then folded it carefully and placed it in his shirt pocket, close to his heart. That evening, for the first time in years, he asked me to help him make a kite.", [
      ["Why did Grandfather's hands tremble?", "He was deeply moved to hear from his old friend", ["He was cold", "He was angry with Hamid", "He was afraid of the postman"], "He had waited forty years for this letter; he was full of emotion."],
      ["What does the kite show about Hamid?", "He still treasured their childhood friendship", ["He wanted to sell the kite", "He loved flying kites more than cricket", "He had forgotten Grandfather"], "Keeping a kite for so many years shows how much the friendship meant to him."],
      ["Why did Grandfather place the letter close to his heart?", "It was very precious to him", ["His pocket was the only safe place", "He wanted to post it back", "He did not like it"], "Keeping it close to his heart shows how much it meant to him."],
      ["What is the tone of the passage?", "Warm and emotional", ["Humorous", "Angry", "Scientific"], "The passage is about love, memory and old friendship."],
      ["In 'the friend he had left behind in Lahore', 'had left' is in the ___ tense.", "past perfect", ["present perfect", "simple past", "past continuous"], "Had + past participle is the past perfect."],
    ]],
    ["Plastic in the ocean", "Every year, millions of tonnes of plastic find their way into the oceans. Sea turtles mistake floating bags for jellyfish, and seabirds feed bottle caps to their chicks. Plastic does not rot like paper or food; instead, it breaks into tiny pieces called microplastics, which are now found even in the fish we eat. Cleaning the oceans is hard and expensive. The simplest solution, therefore, begins at home: refuse single-use plastic, reuse what we can, and recycle the rest.", [
      ["Why do sea turtles eat plastic bags?", "They think the bags are jellyfish", ["They like the taste of plastic", "Their chicks feed them bags", "There is no other food in the sea"], "\"Sea turtles mistake floating bags for jellyfish.\""],
      ["What are microplastics?", "Tiny pieces that plastic breaks into", ["Plastic made from fish", "Very small bottles", "A kind of jellyfish"], "Plastic \"breaks into tiny pieces called microplastics\"."],
      ["In the passage, the word 'rot' is closest in meaning to ___", "decay", ["float", "melt", "shine"], "Paper and food rot, which means they decay and break down naturally."],
      ["What is the writer's main purpose?", "To persuade readers to reduce their use of plastic", ["To describe how turtles swim", "To explain how plastic is made", "To advertise a cleaning company"], "The passage ends by telling readers what they should do."],
      ["The word 'therefore' in the passage shows ___", "a result or conclusion", ["a contrast", "an order of time", "an example"], "Because cleaning is hard, THEREFORE the solution begins at home."],
    ]],
    ["A dreamer who touched the sky", "As a little girl in Karnal, Kalpana Chawla loved to watch aeroplanes from the roof of her house. People told her that engineering was not for girls, but she studied aeronautical engineering anyway and later moved to the United States for higher studies. In 1997, she became the first woman of Indian origin to go into space. Sadly, on her second mission in 2003, the space shuttle Columbia broke apart while returning to Earth, and all seven astronauts lost their lives. Today, schools, hostels and scholarships are named after her, inspiring young people to follow their dreams.", [
      ["What made Kalpana interested in flying as a child?", "Watching aeroplanes from her roof", ["Her father was a pilot", "A visit to the United States", "Reading about Columbia"], "She loved to watch aeroplanes from the roof of her house."],
      ["What does the passage suggest about Kalpana's character?", "She was determined and did not give up", ["She was easily discouraged", "She disliked studying", "She wanted only to be famous"], "People said engineering was not for girls, but she studied it anyway."],
      ["Which statement is TRUE according to the passage?", "She lost her life during her second space mission", ["She went into space for the first time in 2003", "She studied medicine in Karnal", "Columbia broke apart while taking off"], "Her second mission was in 2003; Columbia broke apart while RETURNING to Earth."],
      ["In the last line, 'inspiring' means ___", "encouraging", ["frightening", "confusing", "warning"], "Her story encourages young people to follow their dreams."],
      ["Which is the best title for the passage?", "A Dreamer Who Touched the Sky", ["The History of Aeroplanes", "Life in Karnal", "How Space Shuttles Work"], "The passage is about Kalpana Chawla's dream and life."],
    ]],
    ["Let the calf decide", "Two farmers came to the village court, each claiming that a young calf was his. The wise headman listened to both of them and said, \"Let the calf decide.\" He asked each farmer to bring his own cow and tie her at opposite ends of the field. Then the calf was set free. Without a moment's hesitation, it ran straight to one of the cows and began to drink her milk. The headman smiled. \"The calf has spoken,\" he said, and gave it to the owner of that cow. The other farmer hung his head and walked away.", [
      ["How did the headman find out the real owner?", "He let the calf go to its own mother", ["He asked the villagers", "He checked the farmers' papers", "He gave the calf to the richer farmer"], "A calf runs to its mother, and the mother's owner owns the calf."],
      ["'Without a moment's hesitation' means ___", "immediately, without stopping to think", ["very slowly", "after a long wait", "with great fear"], "To hesitate is to pause before doing something."],
      ["Why did the other farmer hang his head?", "He was ashamed because his lie was exposed", ["He was very tired", "He was looking for his cow", "He had a headache"], "He had falsely claimed the calf, and now everyone knew."],
      ["Which quality does the headman show?", "Wisdom", ["Greed", "Cruelty", "Laziness"], "He solved the problem in a clever, fair way."],
      ["In 'it ran straight to one of the cows', the word 'straight' is ___", "an adverb", ["an adjective", "a noun", "a preposition"], "'Straight' tells HOW the calf ran, so it is an adverb here."],
    ]],
  ];

  // Active → passive over several tenses
  const PASV = [ // subject, as object, plural subject?, base, s-form, past, past participle, object, plural object?
    ["Riya", "Riya", 0, "write", "writes", "wrote", "written", "the letter", 0],
    ["She", "her", 0, "clean", "cleans", "cleaned", "cleaned", "the windows", 1],
    ["The gardener", "the gardener", 0, "water", "waters", "watered", "watered", "the plants", 1],
    ["They", "them", 1, "build", "build", "built", "built", "the bridge", 0],
    ["He", "him", 0, "paint", "paints", "painted", "painted", "the gate", 0],
    ["The cat", "the cat", 0, "catch", "catches", "caught", "caught", "the mice", 1],
    ["My mother", "my mother", 0, "bake", "bakes", "baked", "baked", "the cakes", 1],
    ["The boys", "the boys", 1, "break", "break", "broke", "broken", "the window", 0],
    ["We", "us", 1, "sing", "sing", "sang", "sung", "the national anthem", 0],
    ["The chef", "the chef", 0, "cook", "cooks", "cooked", "cooked", "the meal", 0],
    ["Aman", "Aman", 0, "throw", "throws", "threw", "thrown", "the ball", 0],
    ["The teacher", "the teacher", 0, "check", "checks", "checked", "checked", "the answer sheets", 1],
    ["I", "me", 2, "draw", "draw", "drew", "drawn", "the pictures", 1],
    ["The children", "the children", 1, "eat", "eat", "ate", "eaten", "the sweets", 1],
  ];
  const TENSE_P = ["simple present", "simple past", "present continuous", "past continuous", "present perfect", "simple future"];
  function passiveQs(Q, n) {
    for (let k = 0; k < n * 3 && n > 0; k++) {
      const [S, O, sp, v, v3s, v2, v3, obj, op] = pick(PASV), t = k % 6;
      const be = sp === 2 ? "am" : sp ? "are" : "is", was = sp === 1 ? "were" : "was", have = sp ? "have" : "has";
      const act = [sp ? v : v3s, v2, `${be} ${ing(v)}`, `${was} ${ing(v)}`, `${have} ${v3}`, `will ${v}`][t];
      const auxF = pl => [pl ? "are" : "is", pl ? "were" : "was", pl ? "are being" : "is being", pl ? "were being" : "was being", pl ? "have been" : "has been", "will be"];
      const aux = auxF(op), wrongNum = auxF(!op);
      const P = (a, part = v3, by = O) => `${cap1(obj)} ${a} ${part} by ${by}.`;
      const ans = P(aux[t]);
      const cands = [P(aux[(t + 1) % 6]), P(aux[(t + 5) % 6]), P(aux[t], v2 !== v3 ? v2 : ing(v)), wrongNum[t] !== aux[t] ? P(wrongNum[t]) : P(aux[(t + 2) % 6])];
      if (O !== S && /^(She|He|They|We|I)$/.test(S)) cands.push(P(aux[t], v3, S.toLowerCase() === "i" ? "I" : S.toLowerCase()));
      if (t === 2 || t === 3) cands.push(P(aux[t].replace(" being", "")));
      const wrong = [...new Set(cands)].filter(x => x !== ans);
      if (wrong.length < 3) continue;
      Q("top", `Change into the passive voice:\n${S} ${act} ${obj}.`, [ans, ...pickN(wrong, 3)], `The verb is in the ${TENSE_P[t]} tense, so the passive uses '${aux[t]} + past participle' (${v3}). '${cap1(obj)}' is ${op ? "plural" : "singular"}, and the doer comes after 'by'${O !== S && O !== S.toLowerCase() ? ` as '${O}'` : ""}.`, F(["", "Active", `${S} ${act} ${obj}.`], ["", "Passive", ans, 1]));
      if (--n === 0) break;
    }
  }

  // Agreement traps: [sentence with ___, answer, [wrong], rule]
  const SVA4 = [
    ["Each of the boys ___ a new bicycle.", "has", ["have", "are having", "were having"], "'Each' is singular."],
    ["Every student in the class ___ passed.", "has", ["have", "are", "were"], "'Every' is singular."],
    ["One of my cousins ___ in Canada.", "lives", ["live", "are living", "have lived"], "The subject is 'one', which is singular."],
    ["Either of the two roads ___ to the station.", "leads", ["lead", "are leading", "have led"], "'Either of' is singular."],
    ["The captain, as well as his players, ___ tired.", "was", ["were", "are", "have been"], "With 'as well as', the verb agrees with the first subject (the captain)."],
    ["The students, along with their teacher, ___ gone on a trip.", "have", ["has", "is", "was"], "With 'along with', the verb agrees with the first subject (the students)."],
    ["Either Riya or her brothers ___ coming today.", "are", ["is", "was", "has"], "With either … or, the verb agrees with the nearer subject (brothers)."],
    ["Neither the boys nor their sister ___ at home.", "is", ["are", "were", "have"], "With neither … nor, the verb agrees with the nearer subject (sister)."],
    ["A number of students ___ absent today.", "are", ["is", "was", "has"], "'A number of' means 'many', so the verb is plural."],
    ["The number of students in our class ___ forty.", "is", ["are", "were", "have"], "'The number' is one figure, so the verb is singular."],
    ["Many a student ___ failed this test.", "has", ["have", "are", "were"], "'Many a' is followed by a singular noun and a singular verb."],
    ["My trousers ___ torn.", "are", ["is", "was", "has"], "Trousers, scissors and spectacles are always plural."],
    ["The box of chocolates ___ on the shelf.", "is", ["are", "were", "have"], "The subject is 'box', not 'chocolates'."],
    ["Physics ___ my favourite subject.", "is", ["are", "were", "have"], "Subjects like physics and mathematics are singular."],
    ["Both Riya and Aman ___ good at chess.", "are", ["is", "was", "has"], "Two subjects joined by 'both … and' take a plural verb."],
    ["Nobody in the class ___ the answer.", "knows", ["know", "are knowing", "have known"], "'Nobody' is singular."],
    ["The cattle ___ grazing in the field.", "are", ["is", "was", "has"], "'Cattle' is always plural."],
    ["Ten kilometres ___ a long distance to walk.", "is", ["are", "were", "have"], "An amount of distance, money or time is treated as one: singular verb."],
  ];

  // Synonyms/antonyms: [word, synonym, antonym]
  const SYNANT = [["abundant", "plentiful", "scarce"], ["diligent", "hardworking", "lazy"], ["feeble", "weak", "strong"], ["hostile", "unfriendly", "friendly"], ["vacant", "empty", "occupied"], ["timid", "shy", "bold"], ["conceal", "hide", "reveal"], ["humble", "modest", "arrogant"], ["rigid", "stiff", "flexible"], ["prosperity", "wealth", "poverty"], ["renowned", "famous", "unknown"], ["brief", "short", "lengthy"], ["gloomy", "dismal", "cheerful"], ["courteous", "polite", "rude"], ["genuine", "real", "fake"], ["expand", "enlarge", "shrink"], ["praise", "commend", "criticise"], ["ascend", "climb", "descend"], ["victory", "triumph", "defeat"], ["frequent", "common", "rare"], ["enormous", "huge", "tiny"], ["optimistic", "hopeful", "pessimistic"], ["cautious", "careful", "reckless"], ["generous", "charitable", "stingy"], ["permanent", "lasting", "temporary"], ["obey", "follow", "defy"], ["ancient", "old", "modern"]];
  // One-word substitutes: [meaning, word, [tempting wrong]]
  const OWS4 = [
    ["an animal that eats both plants and flesh", "omnivore", ["herbivore", "carnivore", "insectivore"]],
    ["an animal that eats only plants", "herbivore", ["omnivore", "carnivore", "insectivore"]],
    ["a person who travels on foot", "pedestrian", ["passenger", "pilgrim", "commuter"]],
    ["a person who can speak two languages", "bilingual", ["bimonthly", "biannual", "multilingual"]],
    ["a person who always looks on the bright side", "optimist", ["pessimist", "realist", "egoist"]],
    ["a person who always expects the worst", "pessimist", ["optimist", "atheist", "realist"]],
    ["a decision agreed to by everyone", "unanimous", ["anonymous", "unilateral", "uniform"]],
    ["handwriting that cannot be read", "illegible", ["eligible", "invisible", "inaudible"]],
    ["a sound that cannot be heard", "inaudible", ["illegible", "invisible", "inedible"]],
    ["something that is fit to be eaten", "edible", ["audible", "eligible", "legible"]],
    ["a plant or animal that no longer exists", "extinct", ["endangered", "extant", "exotic"]],
    ["a disease that spreads by touch", "contagious", ["infectious", "chronic", "fatal"]],
    ["a book or letter by a writer whose name is not known", "anonymous", ["unanimous", "autonomous", "synonymous"]],
    ["the life story of a person written by someone else", "biography", ["autobiography", "bibliography", "geography"]],
    ["the life story of a person written by that person", "autobiography", ["biography", "bibliography", "memorandum"]],
    ["a place where bees are kept", "apiary", ["aviary", "aquarium", "nursery"]],
    ["a place where birds are kept", "aviary", ["apiary", "aquarium", "hangar"]],
    ["a person who gives generously to help others", "philanthropist", ["philatelist", "misanthrope", "pessimist"]],
    ["a person who collects stamps", "philatelist", ["philanthropist", "numismatist", "botanist"]],
    ["a list of things to be discussed at a meeting", "agenda", ["minutes", "memo", "calendar"]],
    ["a person who cannot read or write", "illiterate", ["illegible", "ignorant", "innocent"]],
    ["something that cannot be avoided", "inevitable", ["invincible", "invisible", "incredible"]],
    ["a speech made without any preparation", "extempore", ["eloquent", "monologue", "dialogue"]],
    ["a person who offers to work without pay", "volunteer", ["employee", "mercenary", "trainee"]],
    ["one who cannot be defeated", "invincible", ["invisible", "inevitable", "invaluable"]],
  ];
  const IDIOMS4 = [["to bury the hatchet", "to make peace"], ["to keep one's fingers crossed", "to hope for a good result"], ["to face the music", "to accept the results of one's actions"], ["to call it a day", "to stop working for the day"], ["to have a chip on one's shoulder", "to hold a grudge"], ["to take something with a pinch of salt", "to not believe it completely"], ["at the eleventh hour", "at the last moment"], ["to add fuel to the fire", "to make a bad situation worse"], ["to pull someone's leg", "to tease someone playfully"], ["to see the light of day", "to come into existence"], ["to sit on the fence", "to avoid taking sides"], ["to go the extra mile", "to make more effort than expected"]];
  const SPELL_G4 = [["accommodate", ["accomodate", "acommodate", "accommadate"]], ["necessary", ["neccessary", "necesary", "necessery"]], ["committee", ["comittee", "committe", "commitee"]], ["conscience", ["concience", "conscence", "consciense"]], ["occurrence", ["occurence", "ocurrence", "occurrance"]], ["rhythm", ["rythm", "rhythym", "rhytm"]], ["privilege", ["priviledge", "privelege", "privilage"]], ["pronunciation", ["pronounciation", "pronunsiation", "pronunciasion"]], ["maintenance", ["maintainance", "maintenence", "maintanance"]], ["embarrass", ["embarass", "embarras", "embaress"]], ["guarantee", ["garantee", "guarentee", "guarantie"]], ["millennium", ["millenium", "milennium", "millenniam"]], ["definitely", ["definately", "definitly", "defenitely"]], ["mischievous", ["mischievious", "mischevous", "mischeivous"]], ["receipt", ["reciept", "receit", "recipt"]], ["colleague", ["collegue", "colleage", "coleague"]], ["foreign", ["foriegn", "foreing", "forein"]], ["cemetery", ["cemetary", "cemetry", "semetery"]], ["exaggerate", ["exagerate", "exaggarate", "exxagerate"]], ["parallel", ["paralel", "parralel", "parallell"]], ["vacuum", ["vaccum", "vacume", "vacuume"]], ["questionnaire", ["questionaire", "questionnair", "quesionnaire"]], ["possession", ["posession", "possesion", "posesion"]], ["recommend", ["reccommend", "recomend", "reccomend"]]];
  // Arrange the parts: [parts in order, other acceptable orders as index lists]
  const PARTS6 = [
    [["When the bell rang", "the students", "who had been waiting", "rushed out of", "the classroom", "in excitement"], [[1, 2, 3, 4, 5, 0], [1, 2, 0, 3, 4, 5], [0, 1, 2, 5, 3, 4], [1, 2, 5, 3, 4, 0]]],
    [["The old woman", "who lives", "next door to us", "has a beautiful garden", "full of roses"], [[0, 2, 1, 3, 4], [0, 1, 3, 4, 2]]],
    [["Although he was", "very tired", "after the long journey", "he went", "straight to the hospital", "to meet his friend"], [[3, 4, 5, 0, 1, 2], [0, 2, 1, 3, 4, 5], [3, 4, 5, 0, 2, 1], [0, 1, 2, 3, 5, 4]]],
    [["The farmer", "was delighted", "to see", "that the rain", "had saved", "his crops"], []],
    [["If you want", "to do well", "in the examination", "you must", "start revising", "from today"], [[3, 4, 5, 0, 1, 2], [0, 1, 2, 3, 5, 4], [3, 5, 4, 0, 1, 2], [0, 2, 1, 3, 4, 5]]],
    [["The book", "that you lent me", "last week", "was so interesting", "that I finished it", "in two days"], [[0, 1, 3, 2, 4, 5]]],
    [["Not only", "did she win", "the race", "but she also", "broke the school record"], []],
    [["My grandfather", "who is seventy years old", "still goes", "for a long walk", "every morning"], [[4, 0, 1, 2, 3], [0, 1, 2, 4, 3], [0, 1, 4, 2, 3]]],
    [["The scientist", "explained", "to the curious children", "how rainbows", "are formed"], [[0, 1, 3, 4, 2], [0, 2, 1, 3, 4]]],
    [["As soon as", "the guests arrived", "the hosts", "welcomed them", "with garlands"], [[2, 3, 4, 0, 1]]],
    [["The tiger", "that escaped", "from the zoo", "was finally caught", "near the river", "by the forest guards"], [[0, 1, 2, 3, 5, 4], [0, 1, 2, 4, 3, 5], [0, 2, 1, 3, 4, 5], [0, 2, 1, 4, 3, 5], [0, 2, 1, 3, 5, 4]]],
    [["Hardly had", "the match begun", "when it", "started", "to pour"], []],
    [["The children", "were told", "not to swim", "in the river", "because of", "the strong current"], [[0, 1, 2, 4, 5, 3], [0, 1, 3, 2, 4, 5]]],
    [["She was", "so tired", "after the match", "that she fell asleep", "as soon as", "she reached home"], [[0, 1, 3, 2, 4, 5], [0, 2, 1, 3, 4, 5], [0, 1, 3, 4, 5, 2]]],
    [["The teacher", "asked the students", "to submit", "their projects", "before Friday"], []],
    [["The man", "whose car", "was stolen", "went to", "the police station", "to report it"], []],
  ];
  const NOUNFORM = [["decide", "decision"], ["arrive", "arrival"], ["refuse", "refusal"], ["deny", "denial"], ["please", "pleasure"], ["succeed", "success"], ["choose", "choice"], ["believe", "belief"], ["prove", "proof"], ["grow", "growth"], ["laugh", "laughter"], ["free", "freedom"], ["wise", "wisdom"], ["brave", "bravery"], ["able", "ability"]];
  const TENSE4 = ["Present perfect", "Present perfect continuous", "Past perfect", "Past perfect continuous", "Future continuous", "Future perfect", "Past continuous"];

  X[4].ieo = Q => {
    AX(Q, G4);
    ERR4(Q, G4_ERR);
    passageQs(Q, G4_PASSAGES);
    spellQs(Q, SPELL_G4, 15);
    passiveQs(Q, 15);
    pickN(SVA4, 15).forEach(([s, a, w, why]) => Q("top", `Fill in the blank: ${s}`, [a, ...w], why, sent(spaced(s.replace("___", a)), wordAt(s.replace("___", a), a), "verb")));
    // Synonyms / antonyms, with the opposite as the tempting trap
    // Words in the same cluster are close enough in meaning to confuse, so they never appear together.
    const CLUSTER = [["hostile", "courteous", "generous"], ["timid", "humble", "cautious"], ["brief", "enormous", "expand"], ["abundant", "prosperity", "vacant"], ["gloomy", "optimistic"], ["ancient", "permanent"]];
    const far = w => SYNANT.filter(x => x[0] !== w && !CLUSTER.some(c => c.includes(w) && c.includes(x[0])));
    pickN(SYNANT, 15).forEach(([w, s, a]) => {
      const others = pickN(far(w), 2).map(x => pick([x[1], x[2]]));
      Q("top", `Choose the word closest in meaning to '${w}'.`, [s, a, ...others], `'${cap1(w)}' means ${s}. '${cap1(a)}' is its opposite.`, vs(w, s, "", "same meaning"));
    });
    pickN(SYNANT, 15).forEach(([w, s, a]) => {
      const others = pickN(far(w), 2).map(x => pick([x[1], x[2]]));
      Q("top", `Choose the word most nearly OPPOSITE in meaning to '${w}'.`, [a, s, ...others], `'${cap1(w)}' means ${s}, so its opposite is '${a}'.`, vs(w, a, "", "opposite"));
    });
    pickN(OWS4, 15).forEach(([d, w, bad]) => Q("top", `Choose the one word for: ${d}.`, [w, ...bad], `The one word for ${d} is '${w}'. Be careful: '${bad[0]}' means something different.`, C(["💡", w, d, 1], ["", bad[0], "not this"])));
    matchQs(Q, OWS4.map(([d, w]) => [w, d]), 4, "word – meaning");
    const im = IDIOMS4.map(i => i[1]);
    IDIOMS4.forEach(([i, m]) => Q("top", `What does the idiom '${i}' mean?`, words(m, im), `'${cap1(i)}' means ${m}.`, F(["💬", i, ""], ["💡", m, "", 1])));
    matchQs(Q, IDIOMS4, 4, "idiom – meaning");
    // Arrange 5–6 parts
    pickN(PARTS6, 15).forEach(([parts, alts]) => {
      const n = parts.length, L = "PQRSTU".slice(0, n), order = mix([...Array(n).keys()]);
      const code = idx => idx.map(pi => L[order.indexOf(pi)]).join(""), base = [...Array(n).keys()], ans = code(base);
      const bad = new Set([ans, ...alts.map(code)]), wrong = new Set(); let g = 0;
      while (wrong.size < 3 && g++ < 300) {
        const p = base.slice();
        if (g < 60) { const i = ri(0, n - 2); [p[i], p[i + 1]] = [p[i + 1], p[i]]; if (R() < .5) { const j = ri(0, n - 2); [p[j], p[j + 1]] = [p[j + 1], p[j]]; } }
        else mix(p).forEach((x, i) => p[i] = x);
        const c = code(p); if (!bad.has(c)) wrong.add(c);
      }
      Q("top", `Arrange the parts to make a meaningful sentence:\n${order.map((pi, i) => `${L[i]}: ${parts[pi]}`).join("\n")}`, [ans, ...wrong], `The sentence is: "${parts.join(" ")}." That is ${ans}.`, F(...parts.map((p, i) => ["", L[order.indexOf(i)], p, i === n - 1])));
    });
    // Name the tense
    const FR = VERB_FRAMES.filter(f => !["see", "bring"].includes(f[0]));
    for (let k = 0; k < 14; k++) {
      const [v, , obj] = pick(FR), sub = pick(["He", "She", "They", "We", "Riya", "The children"]), pl = /They|We|children/.test(sub), t = k % 7;
      const s = [`${pl ? "have" : "has"} ${third(v)}`, `${pl ? "have" : "has"} been ${ing(v)}`, `had ${third(v)}`, `had been ${ing(v)}`, `will be ${ing(v)}`, `will have ${third(v)}`, `${pl ? "were" : "was"} ${ing(v)}`][t];
      const near = [[1, 2, 5], [0, 3, 6], [0, 3, 5], [1, 2, 6], [5, 6, 1], [0, 2, 4], [3, 4, 1]][t];
      Q("top", `Name the tense of the verb in this sentence:\n${sub} ${s} ${obj}.`, [TENSE4[t], ...near.map(i => TENSE4[i])], `'${s}' is the ${TENSE4[t].toLowerCase()} tense.`, sent(spaced(`${sub} ${s} ${obj}.`), sub.split(" ").length, TENSE4[t].toLowerCase()));
    }
    analogyQs(Q, NOUNFORM, 10, (a, b) => `The noun form of "${a}" is "${b}"`);
    stateQs(Q, [
      ...rowFacts(OWS4.map(([d, w]) => [w, d]), (a, b) => `"${cap1(a)}" means ${b}.`),
      ...rowFacts(IDIOMS4, (a, b) => `"${cap1(a)}" means ${b}.`),
      ...rowFacts(NOUNFORM, (a, b) => `The noun form of "${a}" is "${b}".`),
    ], 10);
  };
})();
