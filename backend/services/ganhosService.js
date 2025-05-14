const db = require('../database');

function obterGanhos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM novos_ganhos', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function inserirGanho(valor, tipo) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO novos_ganhos (valor, tipo) VALUES (?, ?)', [valor, tipo], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

module.exports = { obterGanhos, inserirGanho };