# Olympiad Practice Desk

A one-hour timed practice test for grades 1 and 4 covering IMO (Maths), NSO (Science) and IEO (English), with a picture explanation after every answer.

- Each subject has a bank of 300 challenge-level questions per grade, so 1,800 in total. Grade 1 questions are pitched at SOF Achievers level with class 2–3 content, and grade 4 at Achievers level with class 5–6 content, across the whole SOF syllabus.
- Every test draws 10 questions per subject from that bank. Questions the browser has already seen are skipped until the bank runs out.
- `index.html` is the whole site, with no build step for hosting. Vercel serves it as a static site.

## Source

- `src/app.html` is the page: layout, timers, quiz flow and the picture renderers.
- `src/bank.js` holds the hand-written questions.
- `src/gen-*.js` build the medium questions from small fact and word tables (`gen-maths.js`, `gen-science.js`, `gen-science2.js`, `gen-english.js`).
- `src/xhard-*.js` build the challenge questions that make up the live banks (`xhard-maths.js`, `xhard-science.js`, `xhard-english.js`). When a challenge generator exists for a subject, `buildPool` uses only it.
- `src/hard-*.js` and `src/gen-*.js` hold the earlier, easier generators; their tables and helpers are reused by the challenge files.
- In every question the first option is the right one. Options are shuffled at runtime, except for questions with a fixed option order, such as two-statement questions.
- `src/gen-common.js` builds each 300-question pool with a fixed seed, so the bank is the same on every load.

To rebuild after editing anything in `src/`, run `python3 build.py`.
