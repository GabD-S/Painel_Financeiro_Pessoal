const express = require('express');
const router = express.Router();
const { listarGastos, adicionarGasto } = require('../controllers/gastosController');

router.get('/', listarGastos); // Rota para listar gastos
router.post('/', adicionarGasto); // Rota para adicionar um gasto

module.exports = router;
