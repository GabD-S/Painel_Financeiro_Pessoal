const { obterGastos, inserirGasto } = require('../services/gastosService');

async function listarGastos(req, res) {
  try {
    const dados = await obterGastos();
    res.json(dados);
  } catch (error) {
    console.error("Erro ao listar gastos:", error.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

async function adicionarGasto(req, res) {
  const { valor, tipo } = req.body;

  // Validação básica
  if (typeof valor !== "number" || isNaN(valor) || !tipo || typeof tipo !== "string") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    await inserirGasto(valor, tipo);
    res.status(201).send();
  } catch (error) {
    console.error("Erro ao inserir gasto:", error.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = { listarGastos, adicionarGasto };
