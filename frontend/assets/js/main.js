// Gráfico de ganhos
const ctxGanhos = document.getElementById('grafico-ganhos').getContext('2d');
const graficoGanhos = new Chart(ctxGanhos, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Ganhos',
      data: [],
      backgroundColor: 'rgba(0, 128, 0, 0.7)',
      borderColor: 'rgba(0, 128, 0, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'top',
        rotation: -90,
        formatter: (value) => `R$ ${value.toFixed(2)}`,
        color: '#000',
        font: {
          weight: 'bold' ,
          size: 8
        }
      },
      title: {
        display: true,
        text: 'Ganhos por semana',
        font: {
          size: 18,
          weight: 'bold',
          //altura do titulo
          lineHeight: 3.5
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: { beginAtZero: true },
      x: {
        ticks: {
          maxRotation: 90, // Rotação máxima de 90 graus
          minRotation: 90  // Rotação mínima de 90 graus
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});

// Gráfico de gastos
const ctxGastos = document.getElementById('grafico-gastos').getContext('2d');
const graficoGastos = new Chart(ctxGastos, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Gastos',
      data: [],
      backgroundColor: 'rgba(255, 0, 0, 0.7)', // Vermelho
      borderColor: 'rgba(255, 0, 0, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico se ajuste ao tamanho do container
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'top',
        rotation: -90,
        formatter: (value) => `R$ ${value.toFixed(2)}`,
        color: '#000',
        font: {
          weight: 'bold',
          size: 8
        }
      },
      title: {
        display: true,
        text: 'Gastos por semana',
        font: {
          size: 18,
          weight: 'bold',
          //altura do titulo
          lineHeight: 3.5
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: { beginAtZero: true },
      x: {
        ticks: {
          maxRotation: 90, // Rotação máxima de 90 graus
          minRotation: 90  // Rotação mínima de 90 graus
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});

// Gráfico de investimentos
const ctxInvestimentos = document.getElementById('grafico-investimentos').getContext('2d');
const graficoInvestimentos = new Chart(ctxInvestimentos, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Investimentos',
      data: [],
      backgroundColor: 'rgba(0, 0, 255, 0.7)', // Azul
      borderColor: 'rgba(0, 0, 255, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico se ajuste ao tamanho do container
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'top',
        rotation: -90,
        formatter: (value) => `R$ ${value.toFixed(2)}`,
        color: '#000',
        font: {
          weight: 'bold',
          size: 8
        }
      },
      title: {
        display: true,
        text: 'Investimentos por semana',
        font: {
          size: 18,
          weight: 'bold',
          //altura do titulo
          lineHeight: 3.5
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: { beginAtZero: true },
      x: {
        ticks: {
          maxRotation: 90, // Rotação máxima de 90 graus
          minRotation: 90  // Rotação mínima de 90 graus
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});

// Gráfico de diferença entre ganhos e gastos
const ctxGanhoGasto = document.getElementById('grafico-ganho-gasto').getContext('2d');
const graficoGanhoGasto = new Chart(ctxGanhoGasto, {
  type: 'bar',
  data: {
    labels: [], // Semanas
    datasets: [{
      label: 'Diferença (Ganhos - Gastos)',
      data: [],
      backgroundColor: [], // Cores dinâmicas (verde ou vermelho)
      borderColor: [],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico se ajuste ao tamanho do container
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: { enabled: true },
      datalabels: {
        display: false // Desativa os números no topo das barras
      },
      title: {
        display: true,
        text: 'Diferença entre Ganhos e Gastos por Semana',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: true,
          color: (context) => context.tick.value === 0 ? 'blue' : '#e5e5e5', // Linha azul na margem 0
          lineWidth: (context) => context.tick.value === 0 ? 2 : 1 // Linha azul mais grossa
        }
      },
      x: {
        ticks: {
          maxRotation: 90, // Rotação máxima de 90 graus
          minRotation: 90  // Rotação mínima de 90 graus
        }
      }
    }
  },
  plugins: [ChartDataLabels] // O plugin ainda está ativo, mas desativado para este gráfico
});

// Função para ajustar o tamanho do gráfico dinamicamente
function ajustarTamanhoDoGrafico(chartBox) {
  chartBox.style.height = '100%'; // Ajusta a altura do container para 100%
  chartBox.style.width = '100%';  // Ajusta a largura do container para 100%
}

// Aplicar a função para todos os gráficos
ajustarTamanhoDoGrafico(document.getElementById('grafico1'));
ajustarTamanhoDoGrafico(document.getElementById('grafico2'));
ajustarTamanhoDoGrafico(document.getElementById('grafico3'));
ajustarTamanhoDoGrafico(document.getElementById('grafico4'));

// Função para carregar dados de ganhos
async function carregarDadosGanhos() {
  try {
    const response = await fetch('http://localhost:3000/api/ganhos');
    const dados = await response.json();

    graficoGanhos.data.labels = [];
    graficoGanhos.data.datasets[0].data = [];

    dados.forEach(item => {
      graficoGanhos.data.labels.push(`Semana ${item.semana}`);
      graficoGanhos.data.datasets[0].data.push(item.total);
    });

    graficoGanhos.update();
  } catch (error) {
    console.error("Erro ao carregar dados de ganhos:", error);
  }
}

// Função para carregar dados de gastos
async function carregarDadosGastos() {
  try {
    const response = await fetch('http://localhost:3000/api/gastos');

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const dados = await response.json();

    graficoGastos.data.labels = [];
    graficoGastos.data.datasets[0].data = [];

    dados.forEach(item => {
      graficoGastos.data.labels.push(`Semana ${item.semana}`);
      graficoGastos.data.datasets[0].data.push(item.total);
    });

    graficoGastos.update();
  } catch (error) {
    console.error("Erro ao carregar dados de gastos:", error);
  }
}

// Função para carregar dados de investimentos
async function carregarDadosInvestimentos() {
  try {
    const response = await fetch('http://localhost:3000/api/investimentos');
    const dados = await response.json();

    graficoInvestimentos.data.labels = [];
    graficoInvestimentos.data.datasets[0].data = [];

    dados.forEach(item => {
      graficoInvestimentos.data.labels.push(`Semana ${item.semana}`);
      graficoInvestimentos.data.datasets[0].data.push(item.total);
    });

    graficoInvestimentos.update();
  } catch (error) {
    console.error("Erro ao carregar dados de investimentos:", error);
  }
}

// Função para carregar dados de diferença entre ganhos e gastos
async function carregarDadosGanhoGasto() {
  try {
    const responseGanhos = await fetch('http://localhost:3000/api/ganhos');
    
    if (!responseGanhos.ok) {
      throw new Error(`Erro na API de ganhos: ${responseGanhos.status} ${responseGanhos.statusText}`);
    }

    const dadosGanhos = await responseGanhos.json();
    console.log("[LOG] Dados recebidos de /api/ganhos:", dadosGanhos);

    const responseGastos = await fetch('http://localhost:3000/api/gastos?group=semana');
    
    if (!responseGastos.ok) {
      throw new Error(`Erro na API de gastos: ${responseGastos.status} ${responseGastos.statusText}`);
    }

    const dadosGastos = await responseGastos.json();
    console.log("[LOG] Dados recebidos de /api/gastos?group=semana:", dadosGastos);

    const ganhosPorSemana = {};
    const gastosPorSemana = {};

    dadosGanhos.forEach(item => {
      ganhosPorSemana[item.semana] = item.total;
    });

    dadosGastos.forEach(item => {
      gastosPorSemana[item.semana] = item.total;
    });

    const semanas = Array.from(new Set([...Object.keys(ganhosPorSemana), ...Object.keys(gastosPorSemana)]))
      .map(Number)
      .sort((a, b) => a - b);

    const diferencas = [];
    const cores = [];

    semanas.forEach(semana => {
      const ganho = ganhosPorSemana[semana] || 0;
      const gasto = gastosPorSemana[semana] || 0;
      const diferenca = ganho - gasto;

      diferencas.push(diferenca);
      cores.push(diferenca >= 0 ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)');
    });

    graficoGanhoGasto.data.labels = semanas.map(semana => `Semana ${semana}`);
    graficoGanhoGasto.data.datasets[0].data = diferencas;
    graficoGanhoGasto.data.datasets[0].backgroundColor = cores;

    graficoGanhoGasto.update();
  } catch (error) {
    console.error("[ERRO] Erro ao carregar dados de diferença entre ganhos e gastos:", error);
    graficoGanhoGasto.data.labels = [];
    graficoGanhoGasto.data.datasets[0].data = [];
    graficoGanhoGasto.update();
  }
}

// Função para excluir um registro do banco de dados
async function excluirRegistro(tipo, id) {
  try {
    const response = await fetch(`http://localhost:3000/api/${tipo}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir: ${response.status} ${response.statusText}`);
    }

    console.log(`Registro de ${tipo} com ID ${id} excluído com sucesso.`);
  } catch (error) {
    console.error('Erro ao excluir o registro:', error);
  }
}

// Função para carregar o histórico de valores com mais robustez
async function carregarHistorico() {
  try {
    const tabelaBody = document.querySelector('#historicoTabela tbody');
    tabelaBody.innerHTML = '';

    // Função auxiliar para carregar dados com tratamento de erro
    async function carregarDadosTipo(tipo) {
      try {
        const response = await fetch(`http://localhost:3000/api/${tipo}`);
        if (!response.ok) {
          console.warn(`Erro ao buscar dados de ${tipo}: ${response.status} ${response.statusText}`);
          return [];
        }
        
        const dados = await response.json();
        return Array.isArray(dados) ? dados : [];
        
      } catch (error) {
        console.warn(`Erro ao processar dados de ${tipo}:`, error);
        return [];
      }
    }

    // Primeiro buscar os tipos padrão
    const tipos = ['ganhos', 'investimentos'];
    
    for (const tipo of tipos) {
      const dados = await carregarDadosTipo(tipo);
      dados.sort((a, b) => b.semana - a.semana);

      dados.forEach(item => {
        const linha = document.createElement('tr');

        const valorTd = document.createElement('td');
        valorTd.textContent = `R$ ${item.total.toFixed(2)}`;
        linha.appendChild(valorTd);

        const tipoTd = document.createElement('td');
        tipoTd.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        linha.appendChild(tipoTd);

        const semanaTd = document.createElement('td');
        semanaTd.textContent = `Semana ${item.semana}`;
        linha.appendChild(semanaTd);

        const acaoTd = document.createElement('td');
        const lixeira = document.createElement('span');
        lixeira.classList.add('material-icons', 'icone-lixeira');
        lixeira.textContent = 'delete';
        lixeira.addEventListener('click', async () => {
          if (confirm('Tem certeza que deseja excluir este registro?')) {
            await excluirRegistro(tipo, item.id);
            await carregarHistorico(); // Atualiza o histórico após exclusão
          }
        });
        acaoTd.appendChild(lixeira);
        linha.appendChild(acaoTd);

        tabelaBody.appendChild(linha);
      });
    }

    // Agora buscar os gastos
    try {
      const responseGastos = await fetch(`http://localhost:3000/api/gastos/historico`);
      if (!responseGastos.ok) {
        throw new Error(`Erro ao buscar histórico de gastos: ${responseGastos.status} ${responseGastos.statusText}`);
      }
      
      const dadosGastos = await responseGastos.json();
      
      if (!Array.isArray(dadosGastos)) {
        console.error("API de histórico de gastos não retornou um array:", dadosGastos);
        return;
      }
      
      dadosGastos.forEach(item => {
        const linha = document.createElement('tr');

        const valorTd = document.createElement('td');
        valorTd.textContent = `R$ ${item.valor.toFixed(2)}`;
        linha.appendChild(valorTd);

        const tipoTd = document.createElement('td');
        tipoTd.textContent = `Gastos (${item.tipo})`;
        linha.appendChild(tipoTd);

        const semanaTd = document.createElement('td');
        semanaTd.textContent = `Semana ${item.semana}`;
        linha.appendChild(semanaTd);

        const acaoTd = document.createElement('td');
        const lixeira = document.createElement('span');
        lixeira.classList.add('material-icons', 'icone-lixeira');
        lixeira.textContent = 'delete';
        lixeira.addEventListener('click', async () => {
          if (confirm('Tem certeza que deseja excluir este registro?')) {
            await excluirRegistro('gastos', item.id);
            await carregarHistorico(); // Atualiza o histórico após exclusão
          }
        });
        acaoTd.appendChild(lixeira);
        linha.appendChild(acaoTd);

        tabelaBody.appendChild(linha);
      });
    } catch (error) {
      console.error("Erro ao carregar o histórico de gastos:", error);
    }
    
  } catch (error) {
    console.error('Erro geral ao carregar o histórico:', error);
  }
}

// Função para enviar dados do formulário
document.getElementById('dadosForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const valor = parseFloat(document.getElementById('valor').value);
  const semana = parseInt(document.getElementById('semana').value);
  const tipo = document.getElementById('tipo').value;
  const tipoGasto = document.getElementById('tipoGasto')?.value; // Campo opcional para gastos

  if (isNaN(valor) || isNaN(semana) || !tipo) {
    document.getElementById('erroMsg').textContent = 'Preencha todos os campos corretamente.';
    return;
  }

  try {
    const body = { valor, semana };
    if (tipo === "gastos") {
      body.tipoGasto = tipoGasto || "Gasto obrigatório";
    }

    const response = await fetch(`http://localhost:3000/api/${tipo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar os dados.');
    }

    document.getElementById('erroMsg').textContent = '';
    alert('Dados enviados com sucesso!');
    document.getElementById('dadosForm').reset();

    // Atualiza os gráficos e o histórico
    carregarDadosGanhos();
    carregarDadosGastos();
    carregarDadosInvestimentos();
    carregarDadosGanhoGasto();
    carregarHistorico();
  } catch (error) {
    console.error('Erro ao enviar os dados:', error);
    document.getElementById('erroMsg').textContent = 'Erro ao enviar os dados.';
  }
});

// Carregar dados ao carregar a página com tratamento de erro
window.addEventListener('DOMContentLoaded', () => {
  // Adicionar tratamento de erro para cada função
  Promise.allSettled([
    carregarDadosGanhos().catch(err => console.error("Erro em carregarDadosGanhos:", err)),
    carregarDadosGastos().catch(err => console.error("Erro em carregarDadosGastos:", err)),
    carregarDadosInvestimentos().catch(err => console.error("Erro em carregarDadosInvestimentos:", err)),
    carregarDadosGanhoGasto().catch(err => console.error("Erro em carregarDadosGanhoGasto:", err)),
    carregarHistorico().catch(err => console.error("Erro em carregarHistorico:", err))
  ]).then(results => {
    console.log("Tentativas de carregamento concluídas", 
      results.map((r, i) => `${i}: ${r.status}`).join(', '));
  });
});