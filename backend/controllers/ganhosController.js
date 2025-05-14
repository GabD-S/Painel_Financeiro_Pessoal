const { obterGanhos, inserirGanho } = require('../services/ganhosService');

async function listarGanhos(req, res) {
  try {
    const dados = await obterGanhos();
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function adicionarGanho(req, res) {
  try {
    const { valor, tipo } = req.body;
    if (!valor || !tipo) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    const id = await inserirGanho(valor, tipo);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarGanhos, adicionarGanho };