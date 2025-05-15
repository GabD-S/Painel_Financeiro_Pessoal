// controllers/btcController.js
const btcService = require("../services/btcService");

const getAll = async (req, res) => {
    const compras = await btcService.getAll();
    res.json(compras);
};

const addCompra = async (req, res) => {
    const { data, quantidade, preco } = req.body;
    const novaCompra = await btcService.addCompra({ data, quantidade, preco });
    res.status(201).json(novaCompra);
};

const deleteCompra = async (req, res) => {
    const { id } = req.params;
    await btcService.deleteCompra(id);
    res.sendStatus(204);
};

module.exports = { getAll, addCompra, deleteCompra };
