# Olympiad Practice Desk

A one-hour timed practice test for grades 1 and 4 covering IMO (Maths), NSO (Science) and IEO (English), with a picture explanation after every answer.

- Each subject has a bank of 300 questions per grade (60 medium, 240 hard), so 1,800 in total. Hard questions follow the SOF syllabus for each class at Olympiad level: logical reasoning, every science and English topic, and achievers-style multi-step problems.
- Every test draws 10 questions per subject: 2 medium, then 8 hard. Questions the browser has already seen are skipped until a level runs out.
- `index.html` is the whole site, with no build step for hosting. Vercel serves it as a static site.

## Source

- `src/app.html` is the page: layout, timers, quiz flow and the picture renderers.
- `src/bank.js` holds the hand-written questions.
- `src/gen-*.js` build the medium questions from small fact and word tables (`gen-maths.js`, `gen-science.js`, `gen-science2.js`, `gen-english.js`).
- `src/hard-*.js` build the hard, Olympiad-level questions (`hard-maths.js`, `hard-science.js`, `hard-english.js`).
- In every question the first option is the right one. Options are shuffled at runtime, except for questions with a fixed option order, such as two-statement questions.
- `src/gen-common.js` builds each 300-question pool with a fixed seed, so the bank is the same on every load.

To rebuild after editing anything in `src/`, run `python3 build.py`.
