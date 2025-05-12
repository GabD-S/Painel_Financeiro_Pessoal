const express = require('express');
const router = express.Router();
const db = require('../database'); // Caminho para o arquivo que conecta ao banco

// GET: retorna todos os ganhos
router.get('/', async (req, res) => {
  try {
    const rows = await db.all('SELECT valor FROM ganhos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar ganhos.' });
  }
});

// POST: insere um novo ganho
router.post('/', async (req, res) => {
  const { valor } = req.body;
  try {
    await db.run('INSERT INTO ganhos (valor) VALUES (?)', [valor]);
    res.status(201).json({ message: 'Ganho inserido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao inserir ganho.' });
  }
});

module.exports = router;