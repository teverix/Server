const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// Banco SQLite
const db = new sqlite3.Database("./database.db");

// Cria tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS nomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE
  )
`);

// Rota para adicionar nome (opcional, pra teste)
app.post("/add", (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }

  db.run(
    "INSERT INTO nomes (nome) VALUES (?)",
    [nome.toLowerCase()],
    function (err) {
      if (err) {
        return res.json({ sucesso: false, mensagem: "Nome já existe" });
      }
      res.json({ sucesso: true, id: this.lastID });
    }
  );
});

// Rota principal: verificar se nome existe
app.get("/existe/:nome", (req, res) => {
  const nome = req.params.nome.toLowerCase();

  db.get(
    "SELECT * FROM nomes WHERE nome = ?",
    [nome],
    (err, row) => {
      if (row) {
        res.json({ existe: true });
      } else {
        res.json({ existe: false });
      }
    }
  );
});

// Porta dinâmica (Render exige isso)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
