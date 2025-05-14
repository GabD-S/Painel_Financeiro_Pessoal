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
  const { preco, tipo } = req.body;

  console.log("Recebido no back-end:", req.body); // Adicionado para depuração

  // Validação básica
  if (typeof preco !== "number" || isNaN(preco) || !tipo || typeof tipo !== "string") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    await inserirGasto(preco, tipo);
    res.status(201).send();
  } catch (error) {
    console.error("Erro ao inserir gasto:", error.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = { listarGastos, adicionarGasto };
