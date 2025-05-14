document.getElementById('formGanho').addEventListener('submit', async function(e) {
  e.preventDefault();
  const valor = parseFloat(document.getElementById('valor').value);
  const tipo = document.getElementById('tipo').value || 'Não classificado';

  await fetch('/api/novos_ganhos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor, tipo })
  });

  document.getElementById('valor').value = '';
  document.getElementById('tipo').value = '';
  carregarGanhosPizza();
  carregarDadosGanhos();
  carregarDadosGanhoGasto();
});

async function carregarGanhosPizza() {
  const res = await fetch('/api/novos_ganhos');
  const dados = await res.json();

  const tipos = {};
  dados.forEach(g => {
    tipos[g.tipo] = (tipos[g.tipo] || 0) + g.valor;
  });

  const ctx = document.getElementById('pizzaGanhos').getContext('2d');
  if (window.pizzaGanhosChart) window.pizzaGanhosChart.destroy();
  window.pizzaGanhosChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(tipos),
      datasets: [{
        data: Object.values(tipos),
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Descrição dos Ganhos',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      }
    }
  });
}

async function carregarDadosGanhos() {
  const res = await fetch('/api/ganhos');
  const dados = await res.json();

  const ctx = document.getElementById('grafico-ganhos').getContext('2d');
  if (window.ganhosChart) window.ganhosChart.destroy();
  window.ganhosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dados.map(item => `Semana ${item.semana}`),
      datasets: [{
        label: 'Ganhos',
        data: dados.map(item => item.total),
        backgroundColor: 'rgba(0, 128, 0, 0.7)',
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Ganhos por Semana',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      }
    }
  });
}

async function carregarDadosGanhoGasto() {
  const responseGanhos = await fetch('/api/ganhos');
  const dadosGanhos = await responseGanhos.json();

  const responseGastos = await fetch('/api/gastos');
  const dadosGastos = await responseGastos.json();

  const semanas = [...new Set([...dadosGanhos.map(g => g.semana), ...dadosGastos.map(g => g.semana)])];
  const diferencas = semanas.map(semana => {
    const ganho = dadosGanhos.find(g => g.semana === semana)?.total || 0;
    const gasto = dadosGastos.find(g => g.semana === semana)?.total || 0;
    return ganho - gasto;
  });

  const ctx = document.getElementById('grafico-ganho-gasto').getContext('2d');
  if (window.ganhoGastoChart) window.ganhoGastoChart.destroy();
  window.ganhoGastoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: semanas.map(s => `Semana ${s}`),
      datasets: [{
        label: 'Diferença (Ganhos - Gastos)',
        data: diferencas,
        backgroundColor: diferencas.map(d => d >= 0 ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)'),
        borderColor: diferencas.map(d => d >= 0 ? 'rgba(0, 128, 0, 1)' : 'rgba(255, 0, 0, 1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Diferença entre Ganhos e Gastos',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      }
    }
  });
}

window.onload = async () => {
  await carregarGanhosPizza();
  await carregarDadosGanhos();
  await carregarDadosGanhoGasto();
};