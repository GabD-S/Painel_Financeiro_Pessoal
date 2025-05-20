require('dotenv').config();
const app = require("./app");
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

// Inserir valor no banco (para ganhos, gastos e investimentos)
app.post("/api/:tipo", (req, res) => {
  const { tipo } = req.params;
  const { valor, semana, tipoGasto } = req.body;

  if (!["ganhos", "gastos", "investimentos"].includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  if (typeof valor !== "number" || valor <= 0 || typeof semana !== "number" || semana <= 0) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  let query;
  let params;

  if (tipo === "gastos") {
    query = `INSERT INTO gastos (valor, semana, tipo) VALUES (?, ?, ?)`;
    params = [valor, semana, tipoGasto || "Gasto obrigatório"];
  } else {
    query = `INSERT INTO ${tipo} (valor, semana) VALUES (?, ?)`;
    params = [valor, semana];
  }

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Obter valores agrupados por semana para o gráfico de pizza
app.get("/api/gastos", (req, res) => {
  const groupBy = req.query.group || 'semana';

  let query;
  if (groupBy === 'semana') {
    query = `SELECT semana, SUM(valor) as total FROM gastos GROUP BY semana ORDER BY semana`;
  } else {
    return res.status(400).json({ error: "Parâmetro de agrupamento inválido" });
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro na consulta", details: err.message });
    }
    res.json(rows || []);
  });
});

// Obter o histórico de gastos
app.get("/api/gastos/historico", (req, res) => {
  const query = `SELECT id, valor, tipo, semana FROM gastos ORDER BY id DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Obter valores agrupados por semana para ganhos, gastos e investimentos
app.get("/api/:tipo", (req, res) => {
  const { tipo } = req.params;

  if (!["ganhos", "gastos", "investimentos"].includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  let query;

  if (tipo === "gastos") {
    query = `SELECT semana, SUM(valor) AS total FROM gastos GROUP BY semana ORDER BY semana`;
  } else {
    query = `SELECT semana, SUM(valor) AS total FROM ${tipo} GROUP BY semana ORDER BY semana`;
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
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
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Registro excluído com sucesso.' });
  });
});

// Configuração da porta e inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});