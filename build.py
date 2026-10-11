from pathlib import Path
a = Path("src/app.html").read_text(); b = Path("src/bank.js").read_text()
Path("index.html").write_text(a.replace("/*BANK*/", b))
