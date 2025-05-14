const db = require('../database'); // Corrigido o caminho para o arquivo database.js

function obterGastos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM novos_gastos', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function inserirGasto(preco, tipo) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO novos_gastos (preco, tipo) VALUES (?, ?)', [preco, tipo], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

module.exports = { obterGastos, inserirGasto };
