document.getElementById('formGasto').addEventListener('submit', async function (e) {
  e.preventDefault();
  const preco = parseFloat(document.getElementById('preco').value);
  const tipo = document.getElementById('tipo').value.trim();

  if (isNaN(preco) || preco <= 0 || !tipo) {
    console.error("Dados inválidos: Preço ou Tipo estão incorretos.");
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  console.log("Enviando dados:", { preco, tipo }); // Adicionado para depuração

  try {
    const response = await fetch('/api/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preco, tipo })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao enviar os dados.");
    }

    document.getElementById('preco').value = '';
    document.getElementById('tipo').value = '';
    carregarGastosPizza();
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    alert(error.message);
  }
});

async function carregarGastosPizza() {
  try {
    const res = await fetch('/api/gastos');
    const dados = await res.json();

    console.log("Dados recebidos para o gráfico de pizza:", dados); // Adicionado para depuração

    const tipos = {};
    dados.forEach(g => {
      tipos[g.tipo] = g.total;
    });

    const ctx = document.getElementById('pizzaGastos').getContext('2d');
    if (window.pizzaChart) window.pizzaChart.destroy();
    window.pizzaChart = new Chart(ctx, {
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
            text: 'Descrição dos Gastos',
            font: {
              size: 18,
              weight: 'bold'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao carregar o gráfico de pizza:', error);
  }
}

async function carregarDadosGastos() {
  try {
    const response = await fetch('/api/gastos');
    const dados = await response.json();

    const ctx = document.getElementById('grafico-gastos').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dados.map(item => `Semana ${item.semana}`),
        datasets: [{
          label: 'Gastos',
          data: dados.map(item => item.total),
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } catch (error) {
    console.error('Erro ao carregar o gráfico de gastos:', error);
  }
}

async function carregarDadosGanhoGasto() {
  try {
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
    new Chart(ctx, {
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
        maintainAspectRatio: false
      }
    });
  } catch (error) {
    console.error('Erro ao carregar o gráfico de diferença:', error);
  }
}

async function carregarHistoricoGastos() {
  try {
    const res = await fetch('/api/novos_gastos');
    const dados = await res.json();

    const tbody = document.querySelector('#historicoGastos tbody');
    if (!tbody) {
      console.error('Elemento #historicoGastos tbody não encontrado.');
      return;
    }

    tbody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    dados.forEach(gasto => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${gasto.preco.toFixed(2)}</td>
        <td>${gasto.tipo}</td>
        <td>
          <span class="material-icons btn-excluir" data-id="${gasto.id}">delete</span>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Adiciona evento de exclusão aos botões
    document.querySelectorAll('.btn-excluir').forEach(button => {
      button.addEventListener('click', async function () {
        const id = this.getAttribute('data-id');
        if (confirm('Tem certeza que deseja excluir este gasto?')) {
          await excluirGasto(id);
          carregarHistoricoGastos(); // Recarrega a tabela após exclusão
        }
      });
    });
  } catch (error) {
    console.error('Erro ao carregar o histórico de gastos:', error);
  }
}

async function excluirGasto(id) {
  try {
    const res = await fetch(`/api/novos_gastos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Erro ao excluir o gasto.');
    }
    alert('Gasto excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir o gasto:', error);
  }
}

window.onload = async () => {
  await carregarGastosPizza();
  await carregarDadosGastos();
  await carregarDadosGanhoGasto();
  await carregarHistoricoGastos();
};
