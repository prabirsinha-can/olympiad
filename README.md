# Olympiad Practice Desk

A one-hour timed practice test for grades 1 and 4 covering IMO (Maths), NSO (Science) and IEO (English), with a picture explanation after every answer.

- Each subject has a bank of 300 questions per grade (120 easy, 120 medium, 60 hard), so 1,800 in total.
- Every test draws 10 questions per subject: 4 easy, 4 medium, then 2 hard. Questions the browser has already seen are skipped until a level runs out.
- `index.html` is the whole site, with no build step for hosting. Vercel serves it as a static site.

## Source

- `src/app.html` is the page: layout, timers, quiz flow and the picture renderers.
- `src/bank.js` holds the hand-written questions.
- `src/gen-*.js` build the rest of each bank from small fact and word tables (`gen-maths.js`, `gen-science.js`, `gen-science2.js`, `gen-english.js`). In every question the first option is the right one, and options are shuffled at runtime.
- `src/gen-common.js` builds each 300-question pool with a fixed seed, so the bank is the same on every load.

To rebuild after editing anything in `src/`, run `python3 build.py`.
