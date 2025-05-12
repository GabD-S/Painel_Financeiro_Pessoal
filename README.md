
# 💸 Painel Financeiro Pessoal

![badge-html](https://img.shields.io/badge/HTML-5-orange?logo=html5)
![badge-css](https://img.shields.io/badge/CSS-3-blue?logo=css3)
![badge-js](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![badge-node](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![badge-sqlite](https://img.shields.io/badge/SQLite-Banco%20de%20Dados-blue?logo=sqlite)

> Um painel interativo para controle de ganhos, gastos e investimentos, com gráficos e formulário de inserção de dados. Ideal para quem deseja visualizar e organizar finanças de forma clara e prática.

---

## 📸 Prévia do Projeto

<!-- Adicione aqui uma imagem do painel principal -->
<p align="center">
  <img src="IMAGENS/captura-principal.png" alt="Captura de tela do painel" width="700"/>
</p>

---

## 🧩 Funcionalidades

- Registro de **ganhos, gastos e investimentos** com formulário intuitivo.
- Gráficos interativos (pizza, barra e linha) para visualização clara.
- Armazenamento local com **SQLite**.
- Página separada para análise de gastos por tipo.
- Interface com layout responsivo estilo **dashboard moderno**.

---

## 📂 Estrutura do Projeto

```bash
.
├── index.html               # Página principal com gráficos de ganhos e diferença
├── meus_gastos.html         # Página com gráfico de pizza e formulário de gastos
├── public/
│   ├── style.css            # Estilo geral da interface
│   ├── script.js            # Scripts para interação com os gráficos
│   └── meus_gastos.js       # Script da página de gastos
├── backend/
│   ├── server.js            # Servidor Express e rotas
│   └── db.js                # Conexão com SQLite
├── banco/
│   └── painel.db            # Banco de dados local
└── README.md
```

---

## 📈 Gráficos Utilizados

- **Gráfico de Barras:** ganhos por semana.
- **Gráfico de Linha:** diferença entre ganhos e gastos.
- **Gráfico de Pizza:** proporção dos tipos de gastos.

<!-- Espaço para uma imagem com todos os gráficos -->
<p align="center">
  <img src="IMAGENS/graficos-exemplo.png" alt="Exemplo de gráficos" width="700"/>
</p>

---

## 💾 Tecnologias

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Banco de Dados:** SQLite

---

## 🚀 Como Rodar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/painel-financeiro.git
   ```
2. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
3. Inicie o servidor:
   ```bash
   node server.js
   ```
4. Acesse `index.html` no navegador para iniciar o painel.

---

## 📌 Licença

Este projeto está licenciado sob a [Licença MIT](./LICENSE).

---

## 📬 Contato

Desenvolvido por **Seu Nome**  
[LinkedIn](https://linkedin.com/in/seu-perfil) • [Portfólio](https://seuportfolio.com)
