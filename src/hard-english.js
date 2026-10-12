// Olympiad-level IEO questions, following the SOF IEO syllabus for classes 1 and 4
// (word and structure knowledge, reading, spoken and written expression, achievers).
// Authored rows reuse AUTH from hard-science.js: [emoji, question, answer, [three wrong], explanation].

// Reading passages: [title, passage, [[question, answer, [wrong x3], explanation], ...]]
function passageQs(Q, list) {
  list.forEach(([title, text, qs]) => qs.forEach(([q, a, w, e]) =>
    Q("top", `Read the passage, then answer.\n\n${text}\n\n${q}`, [a, ...w], e, C(["📖", title, ""], ["", a, "✓", 1]))));
}
// Options that are the same words in a different order.
function shuffles(words, n) {
  const out = new Set([words.join(" ")]); let guard = 0;
  while (out.size < n + 1 && guard++ < 200) out.add(mix(words).join(" "));
  return [...out].slice(1);
}
const lcFirst = ws => /^(The|My|We|Birds|Fish|Frogs|A)$/.test(ws[0]) ? [ws[0].toLowerCase(), ...ws.slice(1)] : ws;
// Sentence helpers
const VERB_FRAMES = [["go", "went", "to the park"], ["eat", "ate", "an apple"], ["drink", "drank", "a glass of milk"], ["sing", "sang", "a song"], ["write", "wrote", "a letter"], ["see", "saw", "a rainbow"], ["swim", "swam", "in the pool"], ["draw", "drew", "a tree"], ["fly", "flew", "a kite"], ["buy", "bought", "a new pen"], ["catch", "caught", "the ball"], ["ride", "rode", "a bicycle"], ["throw", "threw", "the ball"], ["make", "made", "a card"], ["bring", "brought", "her lunch"], ["take", "took", "a photo"], ["give", "gave", "a gift"], ["wear", "wore", "a red cap"]];
const pastOf = v => (PAST.irr.find(x => x[0] === v) || [])[1];
const third = v => (PAST.irr.find(x => x[0] === v) || [])[2] || pastOf(v);

const IEO1 = [
  ["🙏", "Your friend gives you a birthday gift. What should you say?", "Thank you!", ["Sorry!", "Goodbye!", "Excuse me!"], "We say \"Thank you\" when someone gives us something or helps us."],
  ["😔", "You bump into someone by mistake. What should you say?", "Sorry!", ["Thank you!", "Well done!", "Good night!"], "We say \"Sorry\" when we make a mistake or hurt someone."],
  ["🙋", "You want to pass through a group of people. What should you say?", "Excuse me, please.", ["Thank you.", "Good morning.", "Congratulations!"], "\"Excuse me\" is a polite way to ask people to let you pass or to get someone's attention."],
  ["🌅", "You meet your teacher at 8 o'clock in the morning. How do you greet her?", "Good morning, ma'am.", ["Good night, ma'am.", "Good evening, ma'am.", "Goodbye, ma'am."], "We say \"Good morning\" before noon. \"Good night\" is said before going to sleep."],
  ["🌙", "What do you say to your parents before going to sleep?", "Good night!", ["Good morning!", "Good afternoon!", "Happy birthday!"], "\"Good night\" is said when we leave at night or go to bed."],
  ["🏆", "Your friend wins a race. What should you say?", "Well done! Congratulations!", ["Sorry about that.", "Get well soon.", "Excuse me."], "We congratulate people when they win or do something great."],
  ["🤒", "Your friend is ill. What can you say?", "Get well soon!", ["Happy birthday!", "Well done!", "Good luck in the race!"], "We say \"Get well soon\" to someone who is sick."],
  ["✏️", "You need to borrow a pencil. What is the most polite way to ask?", "May I borrow your pencil, please?", ["Give me your pencil.", "Pencil, now!", "I am taking your pencil."], "\"May I … please?\" is the polite way to ask for something."],
  ["❓", "Which sentence is an asking sentence?", "Where is my bag?", ["My bag is red.", "Pick up your bag.", "What a big bag it is!"], "An asking sentence (question) ends with a question mark (?)."],
  ["🔠", "Which sentence is written correctly?", "My name is Riya.", ["my name is Riya.", "My name is riya.", "my name is riya"], "A sentence starts with a capital letter, names start with a capital letter, and a sentence ends with a full stop."],
  ["🔠", "Which sentence is written correctly?", "We went to Delhi on Monday.", ["we went to delhi on monday.", "We went to delhi on Monday.", "We went to Delhi on monday"], "Start with a capital letter. Names of places and days (Delhi, Monday) also start with capitals. End with a full stop."],
  ["❗", "Which mark should come at the end of this sentence?  What a beautiful flower", "!", [".", "?", ","], "This sentence shows surprise or strong feeling, so it ends with an exclamation mark (!)."],
  ["🧺", "Choose the correct word: Riya ___ two pet rabbits.", "has", ["have", "is", "are"], "With he, she, it or one person's name we use \"has\". With I, you, we and they we use \"have\"."],
  ["🧺", "Choose the correct word: We ___ a big garden.", "have", ["has", "is", "am"], "With we, you, they and I we use \"have\"."],
  ["🎒", "Choose the correct word: This bag belongs to me. It is ___ bag.", "my", ["mine", "me", "I"], "\"My\" comes before a noun: my bag. \"Mine\" stands alone: The bag is mine."],
  ["🎒", "Choose the correct word: This book belongs to Aman. It is ___ book.", "his", ["her", "him", "he"], "Aman is a boy, so we say \"his book\"."],
  ["🏠", "Choose the correct word: The children are playing in ___ garden.", "their", ["there", "they", "them"], "\"Their\" shows that something belongs to them."],
  ["🐘", "Which word describes the elephant?  The huge elephant drank water.", "huge", ["elephant", "drank", "water"], "A describing word (adjective) tells us more about a noun. \"Huge\" tells us about the elephant."],
  ["🏃", "Which is the action word in this sentence?  The little girl runs to school.", "runs", ["little", "girl", "school"], "An action word (verb) tells what someone does. The girl runs."],
  ["🌳", "Which is the naming word in this sentence?  The tall tree is green.", "tree", ["tall", "is", "green"], "A naming word (noun) names a person, animal, place or thing: tree."],
  ["🧒", "Which word can take the place of \"Raju and I\"?", "We", ["They", "He", "You"], "When we talk about ourselves and someone else together, we use \"we\"."],
  ["🐄", "Choose the correct sentence.", "The cows are in the field.", ["The cows is in the field.", "The cow are in the field.", "The cows am in the field."], "Many cows → are. One cow → is."],
  ["🧸", "Choose the correct sentence.", "These are my toys.", ["This are my toys.", "These is my toys.", "That are my toys."], "\"These\" is used for many things near us, and goes with \"are\"."],
  ["🐣", "Fill in the blank: The baby birds ___ hungry.", "are", ["is", "am", "has"], "\"Birds\" means more than one, so we use \"are\"."],
  ["📚", "Fill in the blank: The books are ___ the bag. (They are inside it.)", "in", ["on", "under", "at"], "\"In\" means inside something."],
  ["🛏️", "Fill in the blank: The cat is hiding ___ the bed. (It is below it.)", "under", ["on", "in", "over"], "\"Under\" means below something."],
  ["🔤", "Which word comes first in alphabetical order?", "ant", ["bat", "cat", "dog"], "Look at the first letter: a comes before b, c and d."],
  ["🔤", "Which word comes first in alphabetical order?", "bell", ["boat", "bus", "bird"], "All start with b, so look at the second letter: e comes before i, o and u."],
  ["🔤", "Which word comes last in alphabetical order?", "zebra", ["yak", "wolf", "lion"], "z is the last letter of the alphabet."],
  ["🍎", "How many vowels are there in the word ORANGE?", "3", ["2", "4", "1"], "O, A and E are vowels. R, N and G are consonants."],
  ["🔡", "Which letter is a vowel?", "u", ["b", "k", "m"], "The vowels are a, e, i, o and u."],
  ["🧩", "Which word can be made from the letters of TEACHER?", "cheat", ["chair", "teeth", "tiger"], "TEACHER has t, e, a, c, h, e, r. CHEAT uses c, h, e, a, t. The others need letters (i, g, or a second t) that are not there."],
  ["🔁", "Which word reads the same backwards?", "noon", ["moon", "soon", "spoon"], "NOON backwards is still NOON."],
  ["🐶", "Which is the correct plural?  one puppy → two ___", "puppies", ["puppys", "puppyes", "puppy"], "When a word ends in a consonant + y, change y to i and add es: puppies."],
  ["🦊", "Which is the correct plural?  one fox → two ___", "foxes", ["foxs", "foxies", "fox"], "Words ending in x take es: foxes."],
  ["🐭", "Which is the correct plural?  one mouse → three ___", "mice", ["mouses", "mices", "mouse"], "Mouse has a special plural: mice."],
  ["👶", "Which word is the opposite of \"asleep\"?", "awake", ["tired", "happy", "lazy"], "Asleep means sleeping. Awake means not sleeping."],
  ["🚪", "Which word is the opposite of \"push\"?", "pull", ["shut", "hold", "kick"], "We push a door away from us and pull it towards us."],
  ["🌞", "Which word means the same as \"glad\"?", "happy", ["sad", "angry", "sleepy"], "Glad and happy mean almost the same thing."],
  ["🐜", "Which word means the same as \"tiny\"?", "very small", ["very big", "very fast", "very old"], "Tiny means very, very small."],
  ["🍰", "Choose the word that fits: I ate ___ apple and ___ banana.", "an, a", ["a, an", "an, an", "a, a"], "Apple starts with a vowel sound (an apple). Banana starts with a consonant (a banana)."],
  ["🐝", "Which word is spelt correctly?", "butterfly", ["buterfly", "butterfyl", "buttarfly"], "B-U-T-T-E-R-F-L-Y: butterfly."],
  ["🎨", "Which group has only colour words?", "red, blue, green", ["red, ball, green", "blue, sky, cat", "pink, run, black"], "Red, blue and green are all colours."],
  ["🗓️", "Which day comes after Tuesday?", "Wednesday", ["Monday", "Thursday", "Sunday"], "The days go Monday, Tuesday, Wednesday, Thursday …"],
  ["🐓", "Which one is a female?", "hen", ["cock", "bull", "king"], "A hen is a female bird. A cock is male."],
];

const IEO1_PASSAGES = [
  ["Tom's dog", "Tom has a little dog. Its name is Bruno. Bruno is brown with a white tail. Every evening Tom and Bruno go to the park. Bruno likes to run after the ball. When they come home, Bruno drinks water and sleeps on his mat.", [
    ["What is the name of Tom's dog?", "Bruno", ["Tom", "Brownie", "Tommy"], "The passage says: \"Its name is Bruno.\""],
    ["What colour is Bruno's tail?", "White", ["Brown", "Black", "Red"], "Bruno is brown with a white tail."],
    ["When do Tom and Bruno go to the park?", "Every evening", ["Every morning", "At night", "On Sundays only"], "\"Every evening Tom and Bruno go to the park.\""],
    ["Where does Bruno sleep?", "On his mat", ["On Tom's bed", "In the park", "Under a tree"], "\"Bruno … sleeps on his mat.\""],
  ]],
  ["The red kite", "Meena made a kite with red paper. She tied a long string to it. On a windy day she went up to the roof with her brother Ravi. The kite flew high in the sky. Suddenly the string broke and the kite got stuck on a tall tree. Meena was sad, but Ravi helped her make a new one.", [
    ["What colour was Meena's kite?", "Red", ["Blue", "Yellow", "Green"], "She made the kite with red paper."],
    ["Who went to the roof with Meena?", "Her brother Ravi", ["Her mother", "Her friend", "Her teacher"], "She went up to the roof with her brother Ravi."],
    ["Why did the kite get stuck on the tree?", "The string broke", ["It started raining", "Ravi let go of it", "The kite was too heavy"], "\"Suddenly the string broke and the kite got stuck on a tall tree.\""],
    ["How did Meena feel when she lost her kite?", "Sad", ["Happy", "Angry", "Sleepy"], "The passage says Meena was sad."],
  ]],
  ["The ant and the dove", "An ant went to a river to drink water. It slipped and fell in. A dove sitting on a tree saw it. She dropped a leaf into the water. The ant climbed onto the leaf and was saved. A few days later, a hunter tried to catch the dove. The ant bit his foot, the hunter shouted, and the dove flew away.", [
    ["Why did the ant go to the river?", "To drink water", ["To swim", "To find food", "To meet the dove"], "\"An ant went to a river to drink water.\""],
    ["How did the dove save the ant?", "She dropped a leaf into the water", ["She picked it up in her beak", "She called the hunter", "She dried the river"], "The ant climbed onto the leaf the dove dropped."],
    ["How did the ant help the dove?", "It bit the hunter's foot", ["It built her a nest", "It gave her food", "It hid her under a leaf"], "The hunter shouted when the ant bit him, so the dove flew away."],
    ["What does this story teach us?", "Help others and they will help you", ["Never drink water", "Always stay at home", "Birds cannot fly"], "The dove helped the ant, and later the ant helped the dove."],
  ]],
];

const IEO4 = [
  ["🗣️", "Your friend says, \"I won the first prize in the quiz!\" What is the best reply?", "Congratulations! That's wonderful.", ["Never mind, better luck next time.", "I am sorry to hear that.", "Please excuse me."], "We congratulate someone on good news."],
  ["📞", "You pick up a phone call for your father. What is the polite thing to say?", "Please hold on, I'll call him.", ["What do you want?", "He is busy, go away.", "Call later, bye."], "A polite reply asks the caller to wait and fetches the person."],
  ["🙋", "You did not hear what your teacher said. What should you say?", "Pardon, ma'am? Could you please repeat that?", ["What? Say it again.", "I don't care.", "Speak louder, now!"], "\"Pardon?\" or \"Could you please repeat that?\" is the polite way."],
  ["🎂", "How should you invite a friend to your birthday party?", "Would you like to come to my birthday party on Sunday?", ["You must come to my party.", "Come to my party or else.", "My party is Sunday. Bye."], "\"Would you like to …?\" is a polite invitation."],
  ["❓", "Which sentence is an interrogative sentence?", "Have you finished your homework?", ["Finish your homework now.", "I have finished my homework.", "What a lot of homework!"], "An interrogative sentence asks a question and ends with a question mark."],
  ["📢", "Which sentence is an imperative sentence (a command or request)?", "Please close the door.", ["The door is closed.", "Is the door closed?", "How heavy the door is!"], "An imperative sentence gives an order, a request or advice."],
  ["😲", "Which sentence is an exclamatory sentence?", "What a beautiful garden this is!", ["This is a beautiful garden.", "Is this a beautiful garden?", "Water the garden."], "An exclamatory sentence shows strong feeling and ends with \"!\"."],
  ["📝", "Which sentence is correctly punctuated?", "\"Where are you going?\" asked Mother.", ["\"Where are you going\" asked Mother?", "Where are you going? asked Mother.", "\"Where are you going.\" asked Mother?"], "The question mark belongs inside the quotation marks, right after the question."],
  ["📝", "Which sentence uses the apostrophe correctly?", "This is Riya's pencil box.", ["This is Riyas' pencil box.", "This is Riyas pencil box.", "This is Riya pencil's box."], "To show that one person owns something we add 's: Riya's."],
  ["📝", "Which sentence uses commas correctly?", "I bought pens, pencils, erasers and a ruler.", ["I bought, pens pencils erasers and a ruler.", "I bought pens pencils, erasers, and, a ruler.", "I, bought pens pencils erasers and a ruler."], "Commas separate items in a list. The last two are joined by \"and\"."],
  ["🏷️", "Which is an abstract noun (a feeling or idea that cannot be touched)?", "honesty", ["honest", "teacher", "table"], "Honesty is a quality, not a thing we can touch. \"Honest\" is an adjective."],
  ["🏷️", "What kind of noun is \"herd\" in \"a herd of cattle\"?", "Collective noun", ["Proper noun", "Abstract noun", "Material noun"], "A collective noun names a group: a herd of cattle."],
  ["🏷️", "Which word is a proper noun?", "Mumbai", ["city", "river", "school"], "A proper noun is the name of a particular person, place or thing, and starts with a capital letter."],
  ["📏", "Choose the correct word: Mount Everest is the ___ mountain in the world.", "highest", ["higher", "high", "most high"], "We compare it with all the mountains in the world, so we use the superlative: highest."],
  ["📏", "Choose the correct word: This box is ___ than that one.", "heavier", ["heaviest", "heavy", "more heavier"], "Comparing two things takes the comparative form. Never use \"more\" with an -er word."],
  ["📏", "Choose the correct word: Riya is the ___ of the two sisters.", "taller", ["tallest", "tall", "most tall"], "With only two people we use the comparative (taller), even with \"the\"."],
  ["⏰", "Choose the correct word: She has been living here ___ 2020.", "since", ["for", "from", "by"], "\"Since\" is used with a point in time (2020). \"For\" is used with a length of time (for six years)."],
  ["🧑‍🏫", "Choose the correct word: Neither the teacher nor the students ___ in the class.", "were", ["was", "is", "has"], "With \"neither … nor\", the verb agrees with the nearer subject (students), so \"were\"."],
  ["📦", "Choose the correct word: Each of the boys ___ a prize.", "gets", ["get", "are getting", "have got"], "\"Each\" is singular, so the verb is singular: gets."],
  ["🐶", "Choose the correct word: The dog wagged ___ tail.", "its", ["it's", "it", "its'"], "\"Its\" shows belonging. \"It's\" means \"it is\"."],
  ["🗣️", "Change to reported speech: Riya said, \"I am hungry.\"", "Riya said that she was hungry.", ["Riya said that I am hungry.", "Riya said that she is hungry now.", "Riya says that I was hungry."], "In reported speech \"I\" becomes \"she\" and \"am\" becomes \"was\"."],
  ["🔁", "Which sentence is in the passive voice?", "The letter was written by Aman.", ["Aman wrote the letter.", "Aman is writing a letter.", "Aman will write a letter."], "In the passive voice the thing acted on (the letter) comes first, with \"was … by\"."],
  ["🧩", "Choose the correct question tag: You are coming to the party, ___?", "aren't you", ["are you", "isn't it", "don't you"], "A positive sentence takes a negative tag with the same helping verb: are → aren't you."],
  ["🧩", "Choose the correct question tag: She can't swim, ___?", "can she", ["can't she", "does she", "isn't she"], "A negative sentence takes a positive tag: can't → can she."],
  ["🔤", "Which word has a silent letter?", "knife", ["kite", "kind", "kitten"], "The k in knife is not spoken."],
  ["🔤", "Which word has a silent letter?", "listen", ["lesson", "lemon", "little"], "The t in listen is silent."],
  ["➕", "Which suffix makes a noun from the adjective \"kind\"?", "-ness (kindness)", ["-ful (kindful)", "-ly (kindly)", "-er (kinder)"], "Adding -ness makes a noun: kindness. \"Kindly\" is an adverb and \"kinder\" a comparative."],
  ["➕", "Which word is formed correctly by adding \"-ful\"?", "beautiful", ["beautyful", "beautifull", "beautefull"], "Change y to i before adding -ful: beauty → beautiful. -ful has only one l."],
  ["🐝", "Which word is the odd one out?", "Quickly", ["Happy", "Brave", "Clever"], "Happy, brave and clever are adjectives. Quickly is an adverb."],
  ["📚", "Which word is the odd one out?", "Swim", ["Courage", "Honesty", "Friendship"], "Courage, honesty and friendship are abstract nouns. Swim is a verb."],
  ["🦁", "What is the female of \"lion\"?", "lioness", ["lionet", "she-lion", "lionella"], "Lion → lioness, like tiger → tigress."],
  ["🐣", "What is the young one of a goat called?", "kid", ["calf", "cub", "foal"], "A young goat is a kid. A cub is a young lion or bear, a foal a young horse."],
  ["🔊", "Which is the correct sound? A donkey ___.", "brays", ["neighs", "bleats", "grunts"], "Donkeys bray, horses neigh, goats bleat and pigs grunt."],
  ["🧭", "Which word is a synonym of \"enormous\"?", "huge", ["tiny", "noisy", "quick"], "Enormous means very big, which is the same as huge."],
  ["🧭", "Which word is an antonym of \"ancient\"?", "modern", ["old", "historic", "broken"], "Ancient means very old; modern means new or of today."],
  ["✍️", "Fill in both blanks: When I ___ home, my mother ___ dinner.", "reached, was cooking", ["reach, cooked", "reaching, cooks", "reached, cooking"], "One action (reaching) happened while another was going on (was cooking)."],
  ["✍️", "Fill in both blanks: She ___ her homework before she ___ out to play.", "finished, went", ["finishes, go", "finishing, went", "finished, goes"], "Both actions happened in the past, so both verbs are in the past tense."],
  ["🌧️", "Choose the correct word: If it rains tomorrow, we ___ stay at home.", "will", ["would", "did", "were"], "For a likely future result we use \"will\": If it rains, we will stay home."],
];

const IEO4_PASSAGES = [
  ["The honest woodcutter", "A poor woodcutter was cutting wood near a river when his axe slipped and fell into the water. He sat down and cried. A water fairy rose from the river with a golden axe and asked if it was his. \"No,\" he said. She brought a silver axe; again he said no. At last she brought his old iron axe, and he smiled and said, \"Yes, that is mine.\" Pleased with his honesty, the fairy gave him all three axes.", [
    ["Why did the woodcutter cry?", "His axe fell into the river", ["He was very hungry", "The fairy scolded him", "He hurt his hand"], "His axe slipped and fell into the water."],
    ["Which axe did the fairy bring first?", "A golden axe", ["A silver axe", "An iron axe", "A wooden axe"], "She first rose with a golden axe."],
    ["Why did the fairy give him all three axes?", "Because he was honest", ["Because he was poor", "Because he cried", "Because he was strong"], "She was pleased with his honesty."],
    ["What is the opposite of \"honest\"?", "dishonest", ["unhonest", "inhonest", "imhonest"], "The prefix dis- makes the opposite: dishonest."],
    ["Which word in the passage is a verb?", "slipped", ["poor", "golden", "river"], "\"Slipped\" is an action. Poor and golden are adjectives; river is a noun."],
  ]],
  ["Our friends the bees", "Bees are among the hardest-working insects. A honeybee visits hundreds of flowers in a day to collect nectar. Back in the hive, the nectar is turned into honey, which the bees store for the winter. While moving from flower to flower, bees carry pollen. This helps plants make fruits and seeds. Without bees, many of the fruits and vegetables we eat would be hard to grow.", [
    ["What do bees collect from flowers to make honey?", "Nectar", ["Pollen", "Leaves", "Water"], "Bees collect nectar and turn it into honey."],
    ["Why do bees store honey?", "To eat in the winter", ["To give to people", "To feed flowers", "To build the hive"], "They store it for the winter."],
    ["How do bees help plants?", "They carry pollen from flower to flower", ["They water the plants", "They eat harmful insects", "They make the soil soft"], "Carrying pollen helps plants make fruits and seeds."],
    ["The word \"hardest-working\" is in which degree of comparison?", "Superlative", ["Positive", "Comparative", "None of these"], "\"Hardest\" compares bees with all insects, so it is superlative."],
    ["What is the best title for the passage?", "Our friends the bees", ["How to make a hive", "Flowers of India", "Winter is coming"], "The whole passage is about bees and how they help us."],
  ]],
  ["The science fair", "On Friday, our school held its science fair. Kabir built a model of a volcano that really bubbled. Zoya showed how a plant bends towards light. My partner and I made a simple electric circuit that lit a bulb. The judges liked every project, but the first prize went to Zoya because she had recorded her plant's growth every day for a month.", [
    ["What did Kabir make?", "A model of a volcano", ["An electric circuit", "A plant project", "A paper rocket"], "Kabir built a model of a volcano."],
    ["Why did Zoya win the first prize?", "She recorded her plant's growth every day for a month", ["Her volcano bubbled", "Her bulb was the brightest", "She finished first"], "The last sentence gives the reason."],
    ["What did the writer's project do?", "Lit a bulb", ["Bubbled like a volcano", "Made a plant bend", "Measured rainfall"], "They made a circuit that lit a bulb."],
    ["Which word in the passage is a proper noun?", "Friday", ["school", "volcano", "judges"], "Friday is the name of a particular day, so it starts with a capital letter."],
  ]],
  ["The clever crow", "On a hot summer day, a thirsty crow flew around looking for water. At last it found a pot with a little water at the bottom, but its beak could not reach it. The crow looked around and saw some pebbles. One by one, it dropped the pebbles into the pot. Slowly the water rose to the top, and the crow drank happily and flew away.", [
    ["Why could the crow not drink the water at first?", "The water was too low in the pot", ["The pot was empty", "The water was dirty", "Another bird was drinking"], "There was only a little water at the bottom, out of reach."],
    ["What did the crow drop into the pot?", "Pebbles", ["Leaves", "Seeds", "Sticks"], "It dropped the pebbles one by one."],
    ["Which word in the passage is an adverb?", "slowly", ["thirsty", "pot", "pebbles"], "\"Slowly\" tells how the water rose."],
    ["What is the moral of the story?", "Where there is a will, there is a way", ["Slow and steady wins the race", "Never trust a stranger", "Pride comes before a fall"], "The crow did not give up and found a clever way."],
  ]],
];

// Sentences broken into parts P, Q, R, S for "arrange the parts" questions.
const PARTS4 = [
  ["The old man", "walked slowly", "to the market", "every morning"], ["My little sister", "loves to read", "stories about", "brave princesses"],
  ["After the rain", "the children", "went out", "to play football"], ["The hungry fox", "looked up at", "the bunch of grapes", "on the vine"],
  ["Our school bus", "leaves the gate", "at exactly", "seven o'clock"], ["The brave soldier", "saved the child", "from the river", "without any fear"],
  ["Every Sunday", "my grandmother", "makes hot parathas", "for breakfast"], ["The tired farmer", "sat under", "a shady tree", "to rest"],
  ["Before going to bed", "Riya brushes", "her teeth", "carefully"], ["The bright stars", "were shining", "in the dark", "night sky"],
];
const PARTS1 = [
  ["The cat", "is sleeping", "on the mat."], ["My mother", "cooks", "tasty food."], ["The birds", "are flying", "in the sky."], ["I", "go to school", "by bus."],
  ["The boy", "is kicking", "the ball."], ["We", "play", "in the park."], ["The sun", "rises", "in the east."], ["Riya", "drinks", "milk every day."],
];

H[1].ieo = Q => {
  AUTH(Q, IEO1);
  passageQs(Q, IEO1_PASSAGES);
  // Correct sentence with is / am / are
  for (let k = 0; k < 20; k++) {
    const [s, be] = pick(BE), end = pick(BE_END), wrong = ["is", "am", "are"].filter(x => x !== be);
    Q("top", "Which sentence is correct?", [`${s} ${be} ${end}.`, ...wrong.map(w => `${s} ${w} ${end}.`), `${s[0].toLowerCase() + s.slice(1)} ${be} ${end}`],
      `With "${s}" we use "${be}". A sentence starts with a capital letter and ends with a full stop.`, sent(`${s} ${be} ${end} .`, s.split(" ").length, "✓"));
  }
  // Arrange the words
  PARTS1.forEach(p => { const words = p.join(" ").replace(".", "").split(" "); const wrong = shuffles(lcFirst(words), 3).map(x => x + "."); if (wrong.length < 3) return;
    Q("top", `Arrange the words to make a correct sentence:\n${mix(lcFirst(words)).join(" / ")}`, [words.join(" ") + ".", ...wrong.map(w => cap1(w))], `The correct order is: ${words.join(" ")}. A sentence tells who (${p[0]}) and what they do.`, sent(words.join(" ") + " .", 0, "starts here")); });
  SENT1.forEach(([s]) => { const words = s.replace(" .", "").split(" "); const wrong = shuffles(lcFirst(words), 3);
    Q("top", `Arrange the words to make a correct sentence:\n${mix(lcFirst(words)).join(" / ")}`, [words.join(" ") + ".", ...wrong.map(w => cap1(w) + ".")], `The correct order is: ${words.join(" ")}.`, sent(s, 0, "starts here")); });
  // Pronouns
  PRON.forEach(([n, p]) => Q("top", `Which pronoun can we use in place of "${n}"?`, [p, ...["He", "She", "It", "They"].filter(x => x !== p)], `"${n}" can be replaced by "${p}".`, vs(n, p, "naming word", "pronoun")));
  // Tenses
  for (let k = 0; k < 40; k++) {
    const [v, past, obj] = pick(VERB_FRAMES), p = pick(KIDS), kind = v === "see" ? 0 : k % 3;
    const forms = [past, v, sForm(v), ing(v)];
    if (kind === 0) Q("top", `Fill in the blank: Yesterday, ${p} ___ ${obj}.`, forms, `"Yesterday" means the action is over, so we use the past form: ${v} → ${past}.`, sent(`Yesterday , ${p} ${past} ${obj} .`, 3, "past"));
    else if (kind === 1) Q("top", `Fill in the blank: Every day, ${p} ___ ${obj}.`, [sForm(v), v, past, ing(v)], `"Every day" shows a habit. With one person's name we add -s or -es: ${sForm(v)}.`, sent(`Every day , ${p} ${sForm(v)} ${obj} .`, 4, "every day"));
    else Q("top", `Fill in the blank: Look! ${p} is ___ ${obj}.`, [ing(v), v, past, sForm(v)], `"Look!" shows it is happening now. After "is" we use the -ing form: ${ing(v)}.`, sent(`Look ! ${p} is ${ing(v)} ${obj} .`, 4, "now"));
  }
  // a / an pairs
  for (let k = 0; k < 16; k++) {
    const x = pick(AN_WORDS), y = pick(A_WORDS), first = k % 2, ans = first ? "An, a" : "A, an";
    Q("top", `Fill in the blanks: ___ ${first ? x : y} and ___ ${first ? y : x}.`, [ans, ...["An, a", "A, an", "An, an", "A, a"].filter(o => o !== ans)], `Use "an" before a vowel sound (${x}) and "a" before a consonant sound (${y}).`, vs(`an ${x}`, `a ${y}`));
  }
  // Plural in a sentence
  const oddPl = PLURAL1.odd.map(([s, p]) => [s, p, [s + "s", p + "s", s]]), esPl = PLURAL1.es.map(s => [s, s + "es", [s + "s", s + "ies", s]]);
  [...oddPl, ...esPl].forEach(([s, p, w]) => Q("top", `Fill in the blank: I saw three ___ in the picture.`, [p, ...w.filter(x => x !== p)].slice(0, 4), `One ${s}, many ${p}.`, vs(`one ${s}`, `three ${p}`)));
  // Opposites in a sentence
  const ADJ_OPP = OPP1.filter(([a]) => ["big", "hot", "happy", "fast", "tall", "old", "wet", "full"].includes(a));
  ADJ_OPP.forEach(([a, b]) => { Q("top", `Fill in the blank: The glass is not ${a}. ${a === "happy" ? "He" : "It"} is ___.`.replace("The glass", { big: "The box", hot: "The tea", happy: "Raju", fast: "The tortoise", tall: "The plant", old: "My bag", wet: "The towel", full: "The glass" }[a]), words(b, ADJ_OPP.map(x => x[1]).concat(ADJ_OPP.map(x => x[0])), [a]), `The opposite of "${a}" is "${b}".`, vs(a, b, "", "opposite")); });
  // Missing letters
  SPELL1.forEach(([e, w]) => { if (w.length < 5) return; const idx = [1, w.length - 2], gap = w.split("").map((c, i) => idx.includes(i) ? "_" : c).join(" "), ans = idx.map(i => w[i]).join(", ");
    const letters = "aeiourtnl".split(""), opts = new Set([ans]); let g = 0; while (opts.size < 4 && g++ < 50) opts.add(idx.map(i => R() < .4 ? w[i] : pick(letters.filter(l => "aeiou".includes(l) !== "aeiou".includes(w[i])))).join(", "));
    if (opts.size === 4) Q("top", `${e} Fill in the missing letters: ${gap}`, [...opts], `The word is ${w.toUpperCase()}.`, C([e, w.toUpperCase(), "", 1])); });
  // Odd one out, rhymes, analogies, matching
  oddQs(Q, CATS, 16, "Which word is the odd one out?");
  oddQs(Q, Object.fromEntries(Object.entries(RHYME).map(([k, v]) => [`words that rhyme with -${k}`, v])), 12, "Which word does NOT rhyme with the others?");
  analogyQs(Q, OPP1, 14, (a, b) => `"${cap1(a)}" is the opposite of "${b}"`);
  analogyQs(Q, PLURAL1.odd, 8, (a, b) => `The plural of "${a}" is "${b}"`);
  analogyQs(Q, SOUNDS1.map(([, a, s]) => [a, s]), 10, (a, b) => `${cap1(an(a))} ${b}`);
  analogyQs(Q, GENDER.filter(g => g[2] === "easy").map(([m, f]) => [m, f]), 10, (a, b) => `The female of "${a}" is "${b}"`);
  matchQs(Q, OPP1, 10, "word – opposite");
};

H[4].ieo = Q => {
  AUTH(Q, IEO4);
  passageQs(Q, IEO4_PASSAGES);
  // Arrange P Q R S
  PARTS4.forEach(parts => { const L = "PQRS", order = mix([0, 1, 2, 3]), shown = order.map((pi, i) => `${L[i]}: ${parts[pi]}`).join("\n");
    const code = idxs => idxs.map(pi => L[order.indexOf(pi)]).join(""), ans = code([0, 1, 2, 3]), wrong = new Set(); let g = 0;
    const alt = [code([3, 0, 1, 2]), code([1, 2, 3, 0])];   // moving a time phrase to the front can also make sense
    while (wrong.size < 3 && g++ < 100) { const c = code(mix([0, 1, 2, 3])); if (c !== ans && !alt.includes(c)) wrong.add(c); }
    Q("top", `Arrange the parts to make a meaningful sentence:\n${shown}`, [ans, ...wrong], `The sentence is: "${parts.join(" ")}." That is ${ans}.`, F(...parts.map((p, i) => ["", L[order.indexOf(i)], p, i === 3]))); });
  // Spot the error (subject–verb agreement and tense)
  SVA.forEach(([s, v, rest]) => {
    const plural = PLURAL_SUBJ.test(s), good = plural ? v : sForm(v), bad = plural ? sForm(v) : v;
    const opts = ["(A)", "(B)", "(C)", "No error"];
    Q("top", `Which part of the sentence has an error?\n(A) ${s} (B) ${bad} ${rest.split(" ")[0]} (C) ${rest.split(" ").slice(1).join(" ")}.`, ["(B)", "(A)", "(C)", "No error"], `"${s}" is ${plural ? "plural" : "singular"}, so the verb should be "${good}": ${s} ${good} ${rest}.`, sent(`${s} ${good} ${rest} .`, s.split(" ").length, "verb"), { order: opts });
    Q("top", `Which part of the sentence has an error?\n(A) ${s} (B) ${good} ${rest.split(" ")[0]} (C) ${rest.split(" ").slice(1).join(" ")}.`, ["No error", "(A)", "(B)", "(C)"], `The sentence is correct: "${s}" goes with "${good}".`, sent(`${s} ${good} ${rest} .`, s.split(" ").length, "✓"), { order: opts });
  });
  for (let k = 0; k < 16; k++) {
    const [v, past, obj] = pick(VERB_FRAMES), p = pick(KIDS), when = pick(["Last week", "Yesterday", "Two days ago", "Last Sunday"]);
    Q("top", `Which part of the sentence has an error?\n(A) ${when} (B) ${p} ${sForm(v)} (C) ${obj}.`, ["(B)", "(A)", "(C)", "No error"], `"${when}" is in the past, so the verb must be in the past tense: ${p} ${past} ${obj}.`, sent(`${when} ${p} ${past} ${obj} .`, when.split(" ").length + 1, "past"), { order: ["(A)", "(B)", "(C)", "No error"] });
  }
  // Name the tense
  const TENSES = ["Simple present", "Simple past", "Present continuous", "Past continuous", "Present perfect", "Simple future"];
  for (let k = 0; k < 36; k++) {
    const [v, past, obj] = pick(VERB_FRAMES.filter(f => f[0] !== "see")), sub = pick(["He", "She", "They", "We", "Riya", "The children"]), pl = /They|We|children/.test(sub), t = k % 6;
    const s = [pl ? `${v}` : sForm(v), past, `${pl ? "are" : "is"} ${ing(v)}`, `${pl ? "were" : "was"} ${ing(v)}`, `${pl ? "have" : "has"} ${third(v)}`, `will ${v}`][t];
    Q("top", `Name the tense of the verb in this sentence:\n${sub} ${s} ${obj}.`, [TENSES[t], ...pickN(TENSES.filter((_, i) => i !== t), 3)], `"${s}" is the ${TENSES[t].toLowerCase()} tense.`, sent(`${sub} ${s} ${obj} .`, sub.split(" ").length, TENSES[t].toLowerCase()));
  }
  // Degrees of comparison in sentences
  COMP.filter(([b]) => b !== "many" && b !== "little").forEach(([b, c, s, irr]) => {
    const wrongC = irr ? b + "er" : "more " + b, wrongS = irr ? "most " + c : "more " + c;
    Q("top", `Fill in the blank: This one is ___ than that one. (${b})`, [c, s, b, wrongC].filter((x, i, a) => a.indexOf(x) === i).concat([wrongS]).slice(0, 4), `Comparing two things takes the comparative: ${b} → ${c}.`, F(["", b, "positive"], ["", c, "comparative", 1], ["", s, "superlative"]));
    Q("top", `Fill in the blank: This is the ___ of all. (${b})`, [s, c, b, irr ? "most " + s : "most " + b].filter((x, i, a) => a.indexOf(x) === i).concat(["more " + s]).slice(0, 4), `Comparing with all the others takes the superlative: ${b} → ${s}.`, F(["", b, "positive"], ["", c, "comparative"], ["", s, "superlative", 1]));
  });
  // Homophones: which sentence uses the word correctly
  for (let k = 0; k < 20; k++) {
    const [good, ...bad] = pickN(HOMO, 4); if (new Set([good, ...bad].map(h => h[1])).size < 4) continue;
    Q("top", "In which sentence is the word in the blank used correctly?", [good[0].replace("___", good[1]), ...bad.map(h => h[0].replace("___", h[2]))], `"${good[1]}" is right in "${good[0].replace("___", good[1]).replace(/\.$/, "")}". The others need ${bad.map(h => `"${h[1]}"`).join(", ")}.`, vs(good[2], good[1], "sounds the same", "correct here"));
  }
  // Prefixes
  PREFIX.forEach(([w, p]) => Q("top", `Which prefix makes the opposite of "${w}"?`, [p, ...["un", "dis", "im", "il", "ir", "in"].filter(x => x !== p).slice(0, 3)], `${p} + ${w} = ${p}${w}.`, vs(w, p + w, "", "opposite")));
  // Spelling
  [...SPELL4].forEach((w, i) => { const bad = misspell(w); if (bad.length < 3) return;
    if (i % 2) Q("top", "Which word is spelt correctly?", [w, ...bad], `The correct spelling is ${w}.`, C(["✍️", w, "correct", 1]));
    else Q("top", "Which word is spelt INCORRECTLY?", [bad[0], ...pickN(SPELL4.filter(x => x !== w), 3)], `"${bad[0]}" should be spelt "${w}". The others are correct.`, vs(bad[0], w, "wrong", "correct")); });
  // Analogies, matching and statements over the word tables
  analogyQs(Q, SYN, 12, (a, b) => `"${cap1(a)}" means the same as "${b}"`);
  analogyQs(Q, ANT, 12, (a, b) => `"${cap1(a)}" is the opposite of "${b}"`);
  analogyQs(Q, COLL.map(([x, c]) => [x, c]), 12, (a, b) => `A group of ${a} is called a ${b}`);
  analogyQs(Q, GENDER.filter(g => g[2] !== "easy").map(([m, f]) => [m, f]), 12, (a, b) => `The female of "${a}" is "${b}"`);
  analogyQs(Q, PAST.irr.map(([v, p]) => [v, p]), 12, (a, b) => `The past tense of "${a}" is "${b}"`);
  analogyQs(Q, COMP.map(([b, , s]) => [b, s]), 8, (a, b) => `The superlative of "${a}" is "${b}"`);
  matchQs(Q, IDIOMS, 10, "idiom – meaning", (l, r) => `${cap1(l)} – ${r}`);
  matchQs(Q, OWS.map(([d, w]) => [w, d]), 10, "word – meaning", (l, r) => `${cap1(l)} – ${r}`);
  matchQs(Q, COLL.map(([x, c]) => [`a ${c} of`, x]), 8, "collective noun");
  stateQs(Q, [
    ...rowFacts(IDIOMS, (a, b) => `"${cap1(a)}" means "${b}".`),
    ...rowFacts(COLL.map(([x, c]) => [x, c]), (a, b) => `A group of ${a} is called a ${b}.`),
    ...rowFacts(PAST.irr.map(([v, p]) => [v, p]), (a, b) => `The past tense of "${a}" is "${b}".`),
  ], 24);
  // Kinds of nouns
  const NOUNS = { "abstract nouns": ["honesty", "kindness", "childhood", "bravery", "freedom", "happiness", "wisdom"], "proper nouns": ["Delhi", "Ganga", "Monday", "India", "Rahul", "January"], "collective nouns": ["herd", "flock", "team", "bunch", "crowd", "fleet"], "material nouns": ["gold", "wood", "cotton", "iron", "silver", "wool"] };
  oddQs(Q, NOUNS, 14, "Which noun is the odd one out?");
};
