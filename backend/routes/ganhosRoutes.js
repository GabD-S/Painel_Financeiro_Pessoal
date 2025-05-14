const express = require('express');
const router = express.Router();
const { listarGanhos, adicionarGanho } = require('../controllers/ganhosController');

router.get('/', listarGanhos);
router.post('/', adicionarGanho);

module.exports = router;