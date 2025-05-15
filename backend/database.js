const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite");

// cria tabelas se não existirem
//unir gastos -> novos_gastos
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS ganhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    semana INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    semana INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS novos_gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    preco REAL NOT NULL,
    tipo TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS novos_ganhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    tipo TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS investimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    semana INTEGER NOT NULL
  )`);
});

module.exports = db;
