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
    const dadosGanhos = await responseGanhos.json();

    const responseGastos = await fetch('http://localhost:3000/api/gastos');
    const dadosGastos = await responseGastos.json();

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
    console.error("Erro ao carregar dados de diferença entre ganhos e gastos:", error);
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

// Função para carregar o histórico de valores
async function carregarHistorico() {
  try {
    const tipos = ['ganhos', 'gastos', 'investimentos'];
    const tabelaBody = document.querySelector('#historicoTabela tbody');
    tabelaBody.innerHTML = '';

    for (const tipo of tipos) {
      const response = await fetch(`http://localhost:3000/api/${tipo}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${tipo}`);
      }

      const dados = await response.json();

      // Ordenar os dados por semana decrescente (mais recentes primeiro)
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
  } catch (error) {
    console.error('Erro ao carregar o histórico:', error);
  }
}

// Função para enviar dados do formulário
document.getElementById('dadosForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  const valor = parseFloat(document.getElementById('valor').value);
  const semana = parseInt(document.getElementById('semana').value);
  const tipo = document.getElementById('tipo').value;

  if (isNaN(valor) || isNaN(semana) || !tipo) {
    document.getElementById('erroMsg').textContent = 'Preencha todos os campos corretamente.';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/${tipo}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ valor, semana }),
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

// Carregar dados ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  carregarDadosGanhos();
  carregarDadosGastos();
  carregarDadosInvestimentos();
  carregarDadosGanhoGasto();
  carregarHistorico();
});