document.addEventListener("DOMContentLoaded", () => {
    const tableBTC = document.querySelector("#table-btc tbody");
    const formBTC = document.getElementById("form-btc");
    const modalBTC = document.getElementById("modal-btc");
    const btnAddBTC = document.getElementById("btn-add-btc");
    const closeModalBtn = modalBTC.querySelector(".close-modal");
    const cancelBtn = modalBTC.querySelector(".btn-cancel");

    let btcData = [];

    const chartCtx = document.getElementById("investment-chart").getContext("2d");
    let pieChart = new Chart(chartCtx, {
        type: "pie",
        data: {
            labels: ["Bitcoin", "Ações", "Outros"],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ["#3498db", "#2ecc71", "#f1c40f"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });

    function formatMoney(value) {
        return `$${value.toFixed(2)}`;
    }

    function openModal() {
        modalBTC.style.display = "block";
    }

    function closeModal() {
        modalBTC.style.display = "none";
        formBTC.reset();
    }

    function calculateValues() {
        let totalInvestido = 0;
        let totalAtual = 0;

        btcData.forEach(item => {
            totalInvestido += item.quantidade * item.preco;
            totalAtual += item.quantidade * item.valorAtual;
        });

        const lucroTotal = totalAtual - totalInvestido;
        const margemMedia = totalInvestido > 0 ? (lucroTotal / totalInvestido) * 100 : 0;

        document.getElementById("total-investido").textContent = formatMoney(totalInvestido);
        document.getElementById("total-atual").textContent = formatMoney(totalAtual);
        document.getElementById("lucro-total").textContent = formatMoney(lucroTotal);
        document.getElementById("margem-media").textContent = margemMedia.toFixed(2) + "%";

        // Atualiza gráfico
        pieChart.data.datasets[0].data[0] = totalAtual;
        pieChart.update();
    }

    function addRow(data) {
        const tr = document.createElement("tr");

        const valorAtual = obterPrecoAtualBTC();
        const lucro = (valorAtual - data.preco) * data.quantidade;
        const margem = (valorAtual - data.preco) / data.preco * 100;

        tr.innerHTML = `
            <td>${data.data}</td>
            <td>${data.quantidade}</td>
            <td>${formatMoney(data.preco)}</td>
            <td>${formatMoney(valorAtual)}</td>
            <td>${margem.toFixed(2)}%</td>
            <td>${formatMoney(lucro)}</td>
            <td><button class="btn-delete"><i class="fas fa-trash"></i></button></td>
        `;

        tr.querySelector(".btn-delete").addEventListener("click", () => {
            btcData = btcData.filter(item => item !== data);
            tr.remove();
            calculateValues();
        });

        tableBTC.appendChild(tr);
        calculateValues();
    }

    function obterPrecoAtualBTC() {
        // Valor fixo ou simulável (pode ser substituído por uma API no futuro)
        return 65000; // valor atual simulado em USD
    }

    btnAddBTC.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    formBTC.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            data: document.getElementById("btc-date").value,
            quantidade: parseFloat(document.getElementById("btc-quantity").value),
            preco: parseFloat(document.getElementById("btc-price").value),
            valorAtual: obterPrecoAtualBTC()
        };

        btcData.push(data);
        addRow(data);
        closeModal();
    });

    // Ações - busca de ações disponíveis
    document.getElementById("search-stocks").addEventListener("input", function () {
        const term = this.value.toLowerCase();
        document.querySelectorAll("#table-stocks tbody tr").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
        });
    });

    // Função para buscar dados de ações via API do Yahoo Finance
    async function buscarDadosAcoes(symbols) {
        try {
            // Usamos nosso próprio backend como proxy
            const url = `/api/stocks/yahoo/${symbols.join(',')}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao buscar dados das ações:", error);
            return null;
        }
    }

    // Função alternativa para buscar dados via Finnhub
    async function buscarDadosAcoesFinnhub(symbol) {
        try {
            // Buscar preço atual via nosso backend
            const priceResponse = await fetch(`/api/stocks/finnhub/quote?symbol=${symbol}`);
            const priceData = await priceResponse.json();
            
            // Buscar informações da empresa
            const companyResponse = await fetch(`/api/stocks/finnhub/stock/profile2?symbol=${symbol}`);
            const companyData = await companyResponse.json();
            
            // Buscar métricas fundamentais
            const metricsResponse = await fetch(`/api/stocks/finnhub/stock/metric?symbol=${symbol}&metric=all`);
            const metricsData = await metricsResponse.json();
            
            return {
                symbol: symbol,
                preco: priceData.c, // preço atual
                nome: companyData.name,
                pl: metricsData.metric?.peNormalizedAnnual || 'N/A',
                dy: (metricsData.metric?.dividendYieldIndicatedAnnual || 0) * 100
            };
        } catch (error) {
            console.error(`Erro ao buscar dados para ${symbol}:`, error);
            return null;
        }
    }

    // Função para preencher a tabela com os dados obtidos das APIs
    async function preencherAcoesDisponiveis() {
        const tbody = document.querySelector("#table-stocks tbody");
        tbody.innerHTML = '<tr><td colspan="6" class="loading-text">Carregando dados de ações...</td></tr>';
        
        const simbolos = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JPM", "V", "WMT"];
        
        try {
            // Primeira tentativa: Yahoo Finance
            const dados = await buscarDadosAcoes(simbolos);
            
            if (dados && dados.length > 0) {
                tbody.innerHTML = '';
                dados.forEach(acao => {
                    adicionarLinhaAcao({
                        ticker: acao.symbol,
                        empresa: acao.shortName || acao.longName || acao.symbol,
                        preco: acao.regularMarketPrice || acao.currentPrice || 0,
                        pl: acao.trailingPE || acao.forwardPE || 'N/A',
                        dy: acao.dividendYield ? (acao.dividendYield * 100).toFixed(2) + '%' : '0%'
                    });
                });
                return; // Sucesso com Yahoo Finance
            }
            
            // Segunda tentativa: Finnhub
            tbody.innerHTML = '';
            const promessas = [];
            
            for (const simbolo of simbolos) {
                promessas.push(buscarDadosAcoesFinnhub(simbolo));
            }
            
            const resultados = await Promise.allSettled(promessas);
            const dadosValidos = resultados
                .filter(r => r.status === 'fulfilled' && r.value)
                .map(r => r.value);
            
            if (dadosValidos.length > 0) {
                dadosValidos.forEach(acao => {
                    adicionarLinhaAcao({
                        ticker: acao.symbol,
                        empresa: acao.nome || acao.symbol,
                        preco: acao.preco || 0,
                        pl: acao.pl || 'N/A',
                        dy: typeof acao.dy === 'number' ? acao.dy.toFixed(2) + '%' : acao.dy
                    });
                });
                return; // Sucesso com Finnhub
            }
            
            // Fallback: Usar dados estáticos
            throw new Error("Nenhum dado de API disponível");
            
        } catch (error) {
            console.error("Erro ao carregar dados de ações:", error);
            tbody.innerHTML = '';
            carregarDadosEstaticos();
        }
    }

    // Função para adicionar uma linha à tabela de ações
    function adicionarLinhaAcao(acao) {
        const tbody = document.querySelector("#table-stocks tbody");
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td>${acao.ticker}</td>
            <td>${acao.empresa}</td>
            <td>${formatMoney(parseFloat(acao.preco))}</td>
            <td>${typeof acao.pl === 'number' ? acao.pl.toFixed(2) : acao.pl}</td>
            <td>${acao.dy}</td>
            <td><button class="btn-add-stock"><i class="fas fa-plus"></i></button></td>
        `;
        
        tr.querySelector(".btn-add-stock").addEventListener("click", () => {
            // Aqui você pode implementar a lógica para adicionar esta ação à carteira
            alert(`Ação ${acao.ticker} adicionada à carteira!`);
        });
        
        tbody.appendChild(tr);
    }

    // Carregar dados estáticos apenas como fallback se as APIs falharem
    function carregarDadosEstaticos() {
        const acoes = [
            { ticker: "AAPL", empresa: "Apple Inc.", preco: 178.5, pl: 27.3, dy: "0.5%" },
            { ticker: "GOOGL", empresa: "Alphabet Inc.", preco: 134.8, pl: 25.1, dy: "0%" },
            { ticker: "AMZN", empresa: "Amazon.com", preco: 122.3, pl: 70.2, dy: "0%" },
            { ticker: "MSFT", empresa: "Microsoft Corp.", preco: 325.6, pl: 34.8, dy: "0.8%" },
            { ticker: "META", empresa: "Meta Platforms Inc.", preco: 302.7, pl: 28.3, dy: "0%" },
            { ticker: "TSLA", empresa: "Tesla Inc.", preco: 175.3, pl: 83.5, dy: "0%" },
            { ticker: "NVDA", empresa: "NVIDIA Corp.", preco: 405.2, pl: 95.4, dy: "0.1%" },
            { ticker: "JPM", empresa: "JPMorgan Chase & Co.", preco: 145.8, pl: 12.3, dy: "2.5%" },
            { ticker: "V", empresa: "Visa Inc.", preco: 230.4, pl: 31.2, dy: "0.8%" },
            { ticker: "WMT", empresa: "Walmart Inc.", preco: 60.1, pl: 25.7, dy: "1.5%" }
        ];

        acoes.forEach(acao => adicionarLinhaAcao(acao));
    }

    // Adicionar botão para atualizar dados manualmente
    const tableStocks = document.querySelector("#table-stocks");
    if (tableStocks) {
        // Encontra o elemento header da seção
        const panelHeader = document.querySelector(".panel-stocks .panel-header");
        if (panelHeader) {
            const refreshButton = document.createElement("button");
            refreshButton.className = "btn-refresh";
            refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
            refreshButton.style.marginLeft = "10px";
            refreshButton.addEventListener("click", preencherAcoesDisponiveis);
            
            // Adiciona ao final do panel-header
            panelHeader.appendChild(refreshButton);
        } else {
            console.warn("Cabeçalho da seção de ações não encontrado");
        }
    } else {
        console.warn("Tabela #table-stocks não encontrada");
    }

    // Carregar dados assim que a página carrega
    preencherAcoesDisponiveis();
});