const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite");

// cria tabelas se não existirem
db.serialize(() => {
  db.run(`create table if not exists ganhos (
    id integer primary key autoincrement,
    valor real not null,
    semana integer not null
  )`);

  db.run(`create table if not exists gastos (
    id integer primary key autoincrement,
    valor real not null,
    semana integer not null
  )`);

  db.run(`create table if not exists investimentos (
    id integer primary key autoincrement,
    valor real not null,
    semana integer not null
  )`);
});

module.exports = db;