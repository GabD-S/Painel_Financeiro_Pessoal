const express = require('express');
const router = express.Router();
const { listarGastos, adicionarGasto } = require('../controllers/gastosController');

router.get('/', listarGastos);
router.post('/', adicionarGasto);

module.exports = router;
