const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");
const fetch = require("node-fetch"); // Certifique-se de instalar: npm install node-fetch

// Verificação de variáveis de ambiente
if (!process.env.RAPIDAPI_KEY) {
  console.warn("AVISO: RAPIDAPI_KEY não definida no .env, usando valor padrão");
}

if (!process.env.FINNHUB_API_KEY) {
  console.warn("AVISO: FINNHUB_API_KEY não definida no .env, usando valor padrão");
}

// Defina as chaves API com fallback
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '4cb796c328mshf6c0a6194a7c762p1fe876jsn3e85a1fa0f6c';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd0j35shr01ql09hpspc0d0j35shr01ql09hpspcg';

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Lista de tipos válidos
const tiposValidos = ["ganhos", "gastos", "investimentos"];

/*
// Inserir novos gastos no banco
app.post("/api/gastos", (req, res) => {
  const { preco, tipo } = req.body;

  if (typeof preco !== "number" || preco <= 0 || !tipo || typeof tipo !== "string") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const query = `INSERT INTO gastos (valor, tipo) VALUES (?, ?)`;
  db.run(query, [preco, tipo], function (err) {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});
*/

// Inserir valor no banco
app.post("/api/:tipo", (req, res) => {
  const { tipo } = req.params;
  const { valor, semana } = req.body;

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  if (typeof valor !== "number" || valor <= 0 || typeof semana !== "number" || semana <= 0) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const query = `INSERT INTO ${tipo} (valor, semana) VALUES (?, ?)`;
  db.run(query, [valor, semana], function (err) {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});


/*
// Obter valores agrupados por tipo para gastos
app.get("/api/gastos", (req, res) => {
  const query = `SELECT tipo, SUM(valor) AS total FROM gastos GROUP BY tipo ORDER BY tipo`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados de gastos:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
*/



// Obter valores agrupados por semana
app.get("/api/:tipo", (req, res) => {
  const { tipo } = req.params;

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  const query = `SELECT semana, SUM(valor) AS total FROM ${tipo} GROUP BY semana ORDER BY semana`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});




// Rota para obter o histórico de gastos e investimentos
app.get("/api/gastos/historico", (req, res) => {
  const query = `
    SELECT id, valor, tipo, semana, 'gastos' AS origem FROM gastos
    UNION ALL
    SELECT id, valor, 'Investimento' AS tipo, semana, 'investimentos' AS origem FROM investimentos
    ORDER BY semana DESC, id DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados de histórico:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para excluir um registro
app.delete('/api/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  const query = `DELETE FROM ${tipo} WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao excluir do banco de dados:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Registro excluído com sucesso.' });
  });
});

// API Cache para reduzir chamadas externas
const apiCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

// Rota proxy para Yahoo Finance
app.get("/api/stocks/yahoo/:symbols", async (req, res) => {
  try {
    const { symbols } = req.params;
    const cacheKey = `yahoo_${symbols}`;
    
    // Verificar cache
    if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
      return res.json(apiCache[cacheKey].data);
    }
    
    // Use sua chave da RapidAPI com o host correto
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
      }
    };
    
    // URL correta para a API do Yahoo Finance via RapidAPI
    const url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${symbols}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Armazenar no cache
    apiCache[cacheKey] = {
      timestamp: Date.now(),
      data: data
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar cotação (quote) via Finnhub
app.get("/api/stocks/finnhub/quote", async (req, res) => {
  try {
    const { symbol } = req.query;
    const cacheKey = `finnhub_quote_${symbol}`;
    
    // Verificar cache
    if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
      return res.json(apiCache[cacheKey].data);
    }
    
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API Finnhub: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Armazenar no cache
    apiCache[cacheKey] = {
      timestamp: Date.now(),
      data: data
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;