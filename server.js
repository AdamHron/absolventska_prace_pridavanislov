const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // Slouží HTML, JS apod.

// Globální middleware na chyby
app.use((err, req, res, next) => {
  console.error("Globalní chyba:", err);
  res.status(500).send("Něco se pokazilo.");
});

app.post("/pridat", (req, res) => {
  console.log("Přišel požadavek na /pridat s daty:", req.body);

  const noveSlovo = req.body; // tady musíš mít tuhle definici

  const filePath = path.join(__dirname, "public", "lekce-data.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Chyba při čtení souboru:", err);
      return res.status(500).send("Chyba při čtení souboru.");
    }

    let words = [];
    try {
      words = JSON.parse(data);
    } catch (e) {
      console.error("Chyba při parsování slovíček:", e);
      return res.status(500).send("Chyba při parsování slovíček.");
    }

    words.push(noveSlovo);

    fs.writeFile(filePath, JSON.stringify(words, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Chyba při zápisu do souboru:", err);
        return res.status(500).send("Chyba při zápisu do souboru.");
      }
      console.log("Slovo bylo úspěšně přidáno.");
      res.send("Slovo úspěšně přidáno.");
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
