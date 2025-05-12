const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Lista de tipos válidos
const tiposValidos = ["ganhos", "gastos", "investimentos"];

// Inserir valor no banco
app.post("/api/:tipo", (req, res) => {
  const { tipo } = req.params;
  const { valor, semana } = req.body;

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  if (typeof valor !== "number" || valor <= 0 || typeof semana !== "number" || semana <= 0) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const query = `INSERT INTO ${tipo} (valor, semana) VALUES (?, ?)`;
  db.run(query, [valor, semana], function (err) {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Obter valores agrupados por semana
app.get("/api/:tipo", (req, res) => {
  const { tipo } = req.params;

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  const query = `SELECT semana, SUM(valor) AS total FROM ${tipo} GROUP BY semana ORDER BY semana`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obter valores agrupados por semana para gastos
app.get("/api/gastos", (req, res) => {
  const query = `SELECT semana, SUM(valor) AS total FROM gastos GROUP BY semana ORDER BY semana`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota para excluir um registro
app.delete('/api/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  const query = `DELETE FROM ${tipo} WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao excluir do banco de dados:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Registro excluído com sucesso.' });
  });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});