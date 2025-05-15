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

// Inserir novos gastos no banco
app.post("/api/gastos", (req, res) => {
  const { preco, tipo } = req.body;

  if (typeof preco !== "number" || preco <= 0 || !tipo || typeof tipo !== "string") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const query = `INSERT INTO novos_gastos (preco, tipo) VALUES (?, ?)`;
  db.run(query, [preco, tipo], function (err) {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

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

// Obter valores agrupados por semana para gastos
app.get("/api/gastos", (req, res) => {
  const query = `SELECT tipo, SUM(preco) AS total FROM novos_gastos GROUP BY tipo ORDER BY tipo`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados de novos_gastos:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para obter o histórico de gastos
app.get("/api/novos_gastos", (req, res) => {
  const query = `SELECT id, preco, tipo FROM novos_gastos ORDER BY id DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados de novos_gastos:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

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

// Rota para excluir um gasto
app.delete('/api/novos_gastos/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM novos_gastos WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao excluir do banco de dados:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Gasto excluído com sucesso.' });
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
    
    // Use sua chave da RapidAPI
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
      }
    };
    
    const url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${symbols}`;
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error(`Erro na API Yahoo: Status ${response.status}`);
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
    console.error("Erro ao buscar dados do Yahoo Finance:", error);
    
    // Retornar um array vazio em vez de erro 500 para permitir o fallback
    res.json([]);
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
    console.error("Erro ao buscar cotação do Finnhub:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar perfil da empresa via Finnhub
app.get("/api/stocks/finnhub/stock/profile2", async (req, res) => {
  try {
    const { symbol } = req.query;
    const cacheKey = `finnhub_profile_${symbol}`;
    
    // Verificar cache
    if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
      return res.json(apiCache[cacheKey].data);
    }
    
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    
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
    console.error("Erro ao buscar perfil da empresa do Finnhub:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar métricas fundamentais via Finnhub
app.get("/api/stocks/finnhub/stock/metric", async (req, res) => {
  try {
    const { symbol, metric } = req.query;
    const cacheKey = `finnhub_metric_${symbol}_${metric}`;
    
    // Verificar cache
    if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
      return res.json(apiCache[cacheKey].data);
    }
    
    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=${metric}&token=${FINNHUB_API_KEY}`;
    
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
    console.error("Erro ao buscar métricas do Finnhub:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;