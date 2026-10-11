# Olympiad Practice Desk

A one-hour timed practice test for grades 1 and 4 covering IMO (Maths), NSO (Science) and IEO (English), with a picture explanation after every answer.

- `index.html` is the whole site, with no build step. Vercel serves it as a static site.
- `src/bank.js` holds the question bank. In each question the first option is the correct one, and options are shuffled at runtime.
- `src/app.html` is the page template. To rebuild, run `python3 build.py`, which puts `src/bank.js` in place of `/*BANK*/`.
