document.addEventListener('DOMContentLoaded', function() {
  // Configuração das partículas no cabeçalho
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
        },
        "opacity": {
          "value": 0.5,
          "random": false,
        },
        "size": {
          "value": 3,
          "random": true,
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
      },
      "retina_detect": true
    });
  }

  // Controle da Sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const settingsLink = document.getElementById('settings-link');
  const closeSidebar = document.querySelector('.close-sidebar');
  
  // Abrir sidebar ao clicar no ícone de configurações
  if (settingsLink) {
    settingsLink.addEventListener('click', function() {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });
  }
  
  // Fechar sidebar ao clicar no X
  if (closeSidebar) {
    closeSidebar.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
  
  // Fechar sidebar ao clicar no overlay
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Rolagem suave para o histórico
  const historicoLink = document.getElementById('historico-link');
  const historicoSection = document.getElementById('historico-section');
  
  if (historicoLink && historicoSection) {
    historicoLink.addEventListener('click', function(e) {
      e.preventDefault();
      historicoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  // Modal de ajuda
  const helpLink = document.getElementById('help-link');
  const helpModal = document.getElementById('help-modal');
  const closeModal = document.querySelector('.close-modal');
  
  if (helpLink && helpModal) {
    helpLink.addEventListener('click', function() {
      helpModal.style.display = 'block';
    });
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      helpModal.style.display = 'none';
    });
  }
  
  // Fechar modal ao clicar fora dele
  window.addEventListener('click', function(event) {
    if (event.target === helpModal) {
      helpModal.style.display = 'none';
    }
  });

  // Tema escuro
  const themeToggle = document.getElementById('themeToggle');
  
  if (themeToggle) {
    // Verificar se há uma preferência salva
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar tema inicial
    if (darkMode) {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
    }
    
    // Alternar tema
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('darkMode', 'false');
      }
    });
  }

  // Formulário para adicionar gastos
  const formGasto = document.getElementById('formGasto');
  if (formGasto) {
    formGasto.addEventListener('submit', async function (e) {
      e.preventDefault();
      const valor = parseFloat(document.getElementById('preco').value);
      const tipo = document.getElementById('tipo').value.trim();

      if (isNaN(valor) || valor <= 0 || !tipo) {
        showNotification('Erro', 'Por favor, preencha todos os campos corretamente.', 'error');
        return;
      }

      try {
        const response = await fetch('/api/gastos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ valor, tipo })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao enviar os dados.");
        }

        document.getElementById('preco').value = '';
        document.getElementById('tipo').value = '';
        
        showNotification('Sucesso', 'Gasto registrado com sucesso!', 'success');
        
        // Atualizar gráficos e tabela
        await Promise.all([
          carregarGastosPizza(),
          carregarDadosGastos(),
          carregarDadosGanhoGasto(),
          carregarHistoricoGastos()
        ]);
        
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        showNotification('Erro', error.message, 'error');
      }
    });
  }

  // Função para mostrar notificações
  function showNotification(title, message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-header">
        <strong>${title}</strong>
        <button type="button" class="close">&times;</button>
      </div>
      <div class="notification-body">
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
    
    notification.querySelector('.close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  }

  async function carregarGastosPizza() {
    try {
      const res = await fetch('/api/gastos?group=semana');
      
      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
      }
      
      const dados = await res.json();
      
      // Verificar se dados é um array
      if (!Array.isArray(dados)) {
        console.error("API não retornou um array:", dados);
        return;
      }
      
      if (dados.length === 0) {
        console.log("Nenhum dado de gastos encontrado para o gráfico de pizza.");
        return;
      }

      // Calcular o total de gastos
      const totalGastos = dados.reduce((acc, item) => acc + item.total, 0);

      // Calcular porcentagens
      const porcentagens = dados.map(item => ((item.total / totalGastos) * 100).toFixed(2));

      const ctx = document.getElementById('pizzaGastos').getContext('2d');
      
      const cores = [
        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', 
        '#6f42c1', '#fd7e14', '#20c9a6', '#5a5c69', '#858796'
      ];
      
      if (window.pizzaChart) window.pizzaChart.destroy();
      
      window.pizzaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dados.map(item => `Semana ${item.semana} (${porcentagens[dados.indexOf(item)]}%)`),
          datasets: [{
            data: dados.map(item => item.total),
            backgroundColor: dados.map((_, idx) => cores[idx % cores.length]),
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const valor = context.raw;
                  const porcentagem = porcentagens[context.dataIndex];
                  return `R$ ${valor.toFixed(2)} (${porcentagem}%)`;
                }
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
      const response = await fetch('/api/gastos?group=semana');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      
      const dados = await response.json();
      
      // Verificar se dados é um array
      if (!Array.isArray(dados)) {
        console.error("API não retornou um array:", dados);
        return;
      }

      const ctx = document.getElementById('grafico-gastos').getContext('2d');
      
      if (window.gastosChart) window.gastosChart.destroy();
      
      window.gastosChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dados.map(item => `Semana ${item.semana}`),
          datasets: [{
            label: 'Gastos',
            data: dados.map(item => item.total),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3
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
      
      if (!responseGanhos.ok) {
        throw new Error(`Erro na API de ganhos: ${responseGanhos.status}`);
      }
      
      const dadosGanhos = await responseGanhos.json();
      
      if (!Array.isArray(dadosGanhos)) {
        console.error("API de ganhos não retornou um array:", dadosGanhos);
        return;
      }

      const responseGastos = await fetch('/api/gastos?group=semana');
      
      if (!responseGastos.ok) {
        throw new Error(`Erro na API de gastos: ${responseGastos.status}`);
      }
      
      const dadosGastos = await responseGastos.json();
      
      if (!Array.isArray(dadosGastos)) {
        console.error("API de gastos não retornou um array:", dadosGastos);
        return;
      }

      const semanas = [...new Set([
        ...dadosGanhos.map(g => g.semana), 
        ...dadosGastos.map(g => g.semana)
      ])].sort((a, b) => a - b);
      
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
          maintainAspectRatio: false,
          scales: {
            y: { 
              beginAtZero: true,
              grid: {
                drawBorder: true,
                color: (context) => context.tick.value === 0 ? '#2196F3' : '#e5e5e5',
                lineWidth: (context) => context.tick.value === 0 ? 2 : 1
              },
              ticks: {
                callback: function(value) {
                  return `R$ ${value}`;
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao carregar o gráfico de comparação:', error);
    }
  }

  async function carregarHistoricoGastos() {
    try {
      const res = await fetch('/api/gastos/historico');
      const dados = await res.json();

      const tbody = document.querySelector('#historicoGastos tbody');
      if (!tbody) {
        console.error('Elemento #historicoGastos tbody não encontrado.');
        return;
      }

      tbody.innerHTML = '';

      dados.forEach(gasto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>R$ ${gasto.valor.toFixed(2)}</td>
          <td>${gasto.tipo}</td>
          <td>${gasto.semana ? `Semana ${gasto.semana}` : 'Semana não definida'}</td>
          <td>
            <span class="btn-excluir" data-id="${gasto.id}">
              <i class="fas fa-trash-alt"></i>
            </span>
          </td>
        `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          if (confirm('Tem certeza que deseja excluir este gasto?')) {
            try {
              await excluirGasto(id);
              await Promise.all([
                carregarGastosPizza(),
                carregarDadosGastos(),
                carregarDadosGanhoGasto(),
                carregarHistoricoGastos()
              ]);
            } catch (error) {
              console.error('Erro ao excluir gasto:', error);
            }
          }
        });
      });
    } catch (error) {
      console.error('Erro ao carregar o histórico de gastos:', error);
    }
  }

  async function excluirGasto(id) {
    const res = await fetch(`/api/gastos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Erro ao excluir o gasto.');
    }
    return true;
  }

  function ajustarTamanhoGraficos() {
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(canvas => {
      const parentHeight = canvas.parentElement.clientHeight;
      const maxHeight = Math.min(parentHeight, 350);
      canvas.style.maxHeight = `${maxHeight}px`;
    });
  }

  Promise.allSettled([
    carregarGastosPizza().catch(err => console.error("Erro em carregarGastosPizza:", err)),
    carregarDadosGastos().catch(err => console.error("Erro em carregarDadosGastos:", err)),
    carregarDadosGanhoGasto().catch(err => console.error("Erro em carregarDadosGanhoGasto:", err)),
    carregarHistoricoGastos().catch(err => console.error("Erro em carregarHistoricoGastos:", err))
  ]).then(() => {
    console.log('Tentativas de carregamento concluídas');
    ajustarTamanhoGraficos();
  }).catch(error => {
    console.error('Erro geral ao carregar os dados:', error);
  });

  window.addEventListener('resize', ajustarTamanhoGraficos);

  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.maxWidth = '100vw';
  document.documentElement.style.maxWidth = '100vw';
});
