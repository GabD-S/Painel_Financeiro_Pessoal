const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite");

// Criar tabelas necessárias
db.serialize(() => {
  // Tabela de ganhos
  db.run(`CREATE TABLE IF NOT EXISTS ganhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    semana INTEGER NOT NULL
  )`);

  // Tabela de investimentos
  db.run(`CREATE TABLE IF NOT EXISTS investimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    semana INTEGER NOT NULL
  )`);

  // Tabela de gastos
  db.run(`CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    semana INTEGER DEFAULT 1,
    tipo TEXT DEFAULT 'Gasto obrigatório'
  )`);
});

module.exports = db;
