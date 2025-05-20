const db = require('../database'); // Corrigido o caminho para o arquivo database.js

function obterGastos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM gastos', [], (err, rows) => { // Alterado para usar a tabela "gastos"
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function inserirGasto(valor, tipo) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO gastos (valor, tipo) VALUES (?, ?)', [valor, tipo], function(err) { // Alterado para usar a tabela "gastos"
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

module.exports = { obterGastos, inserirGasto };
