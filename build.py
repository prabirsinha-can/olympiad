from pathlib import Path
# Builds the single-file site: the page template plus the hand-written bank and the question generators.
GEN = ["gen-common.js", "gen-maths.js", "gen-science.js", "gen-science2.js", "gen-english.js"]
a = Path("src/app.html").read_text(); b = Path("src/bank.js").read_text()
g = "\n".join(Path("src/" + f).read_text() for f in GEN)
Path("index.html").write_text(a.replace("/*BANK*/", b).replace("/*GEN*/", g))
