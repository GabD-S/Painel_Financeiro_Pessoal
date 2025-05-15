require('dotenv').config();
const app = require("./app");

//essa buceta tem um problema dependendo de qual requisição voce chama primeiro funciona somente ela
// soluções pensados: mudar a tabela de forma a fundir novos_gastos e gastos, e requerir diferentes coisas para os graficos
//fazer uma condicional que desliga uma enquanto liga a outra

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Lista de tipos válidos
const tiposValidos = ["ganhos", "gastos", "investimentos"];

// Inserir novos gastos no banco
app.post("/api/gastos", (req, res) => {
  const { preco, tipo } = req.body;

  if (typeof preco !== "number" || preco <= 0 || !tipo || typeof tipo !== "string") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const query = `INSERT INTO novos_gastos (preco, tipo) VALUES (?, ?)`;
  db.run(query, [preco, tipo], function (err) {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

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

// Obter valores agrupados por semana para gastos
app.get("/api/gastos", (req, res) => {
  const query = `SELECT tipo, SUM(preco) AS total FROM novos_gastos GROUP BY tipo ORDER BY tipo`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados de novos_gastos:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para obter o histórico de gastos
app.get("/api/novos_gastos", (req, res) => {
  const query = `SELECT id, preco, tipo FROM novos_gastos ORDER BY id DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados de novos_gastos:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
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

// Rota para excluir um gasto
app.delete('/api/novos_gastos/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM novos_gastos WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao excluir do banco de dados:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Gasto excluído com sucesso.' });
  });
});

// Configuração da porta e inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});