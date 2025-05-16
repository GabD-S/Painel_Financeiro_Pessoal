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

  // Formulário para adicionar gastos
  const formGasto = document.getElementById('formGasto');
  if (formGasto) {
    formGasto.addEventListener('submit', async function (e) {
      e.preventDefault();
      const preco = parseFloat(document.getElementById('preco').value);
      const tipo = document.getElementById('tipo').value.trim();

      if (isNaN(preco) || preco <= 0 || !tipo) {
        showNotification('Erro', 'Por favor, preencha todos os campos corretamente.', 'error');
        return;
      }

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
    // Criando elementos de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const notificationContent = `
      <div class="notification-header">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${title}</span>
        <i class="fas fa-times close-notification"></i>
      </div>
      <div class="notification-body">
        <p>${message}</p>
      </div>
    `;
    
    notification.innerHTML = notificationContent;
    
    // Adicionando ao corpo do documento
    document.body.appendChild(notification);
    
    // Mostrando a notificação com animação
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Removendo após 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
    
    // Permitindo fechar a notificação
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      });
    }
  }

  async function carregarGastosPizza() {
    try {
      const res = await fetch('/api/gastos');
      const dados = await res.json();

      const ctx = document.getElementById('pizzaGastos').getContext('2d');
      
      // Cores para o gráfico de pizza
      const cores = [
        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', 
        '#6f42c1', '#fd7e14', '#20c9a6', '#5a5c69', '#858796'
      ];
      
      if (window.pizzaChart) window.pizzaChart.destroy();
      
      window.pizzaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dados.map(item => item.tipo),
          datasets: [{
            data: dados.map(item => item.total),
            backgroundColor: dados.map((_, idx) => cores[idx % cores.length]),
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverBorderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 12,
                  family: "'Montserrat', sans-serif",
                  weight: '500'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 14,
                family: "'Montserrat', sans-serif",
                weight: '600'
              },
              bodyFont: {
                size: 13,
                family: "'Montserrat', sans-serif"
              },
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const formattedValue = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(value);
                  return formattedValue;
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
      const response = await fetch('/api/gastos');
      const dados = await response.json();

      // Transformar dados para gráfico de linha
      const processedData = processarDadosGastos(dados);

      const ctx = document.getElementById('grafico-gastos').getContext('2d');
      
      if (window.gastosChart) window.gastosChart.destroy();
      
      window.gastosChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: processedData.labels,
          datasets: [{
            label: 'Gastos',
            data: processedData.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 1
              },
              ticks: {
                callback: function(value) {
                  return `R$ ${value.toLocaleString('pt-BR')}`;
                },
                font: {
                  family: "'Montserrat', sans-serif",
                  weight: '500'
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: "'Montserrat', sans-serif",
                  weight: '500'
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 14,
                family: "'Montserrat', sans-serif",
                weight: '600'
              },
              bodyFont: {
                size: 13,
                family: "'Montserrat', sans-serif"
              },
              padding: 12,
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  return `R$ ${value.toLocaleString('pt-BR')}`;
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao carregar o gráfico de gastos:', error);
    }
  }

  // Função auxiliar para processar dados do gráfico de gastos
  function processarDadosGastos(dados) {
    // Aqui podemos transformar ou agregar os dados conforme necessário
    // Por exemplo, agrupar por mês ou semana, calcular médias, etc.
    
    return {
      labels: dados.map(item => item.tipo),
      data: dados.map(item => item.total)
    };
  }

  async function carregarDadosGanhoGasto() {
    try {
      const responseGanhos = await fetch('/api/ganhos');
      const dadosGanhos = await responseGanhos.json();

      const responseGastos = await fetch('/api/gastos');
      const dadosGastos = await responseGastos.json();

      // Preparar dados para gráfico de comparação
      const { labels, ganhos, gastos, diferencas } = prepararDadosComparacao(dadosGanhos, dadosGastos);

      const ctx = document.getElementById('grafico-ganho-gasto').getContext('2d');
      
      if (window.ganhoGastoChart) window.ganhoGastoChart.destroy();
      
      window.ganhoGastoChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ganhos',
              data: ganhos,
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 2,
              borderRadius: 5
            },
            {
              label: 'Gastos',
              data: gastos,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 2,
              borderRadius: 5
            },
            {
              label: 'Balanço',
              data: diferencas,
              type: 'line',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 3,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: 'rgb(54, 162, 235)',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                callback: function(value) {
                  return `R$ ${value.toLocaleString('pt-BR')}`;
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.raw;
                  const formattedValue = `R$ ${value.toLocaleString('pt-BR')}`;
                  return `${label}: ${formattedValue}`;
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

  // Função auxiliar para preparar dados de comparação
  function prepararDadosComparacao(dadosGanhos, dadosGastos) {
    // Exemplo simplificado - ajuste conforme necessário com seus dados reais
    const semanas = [...new Set([...dadosGanhos.map(g => g.semana), ...dadosGastos.map(g => g.semana)])];
    
    const ganhos = [];
    const gastos = [];
    const diferencas = [];
    
    semanas.forEach(semana => {
      const ganho = dadosGanhos.find(g => g.semana === semana)?.total || 0;
      const gasto = dadosGastos.find(g => g.semana === semana)?.total || 0;
      
      ganhos.push(ganho);
      gastos.push(gasto);
      diferencas.push(ganho - gasto);
    });
    
    return {
      labels: semanas.map(s => `Semana ${s}`),
      ganhos,
      gastos,
      diferencas
    };
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
          <td>R$ ${gasto.preco.toFixed(2)}</td>
          <td>${gasto.tipo}</td>
          <td>
            <span class="btn-excluir" data-id="${gasto.id}">
              <i class="fas fa-trash-alt"></i>
            </span>
          </td>
        `;
        tbody.appendChild(tr);
        
        // Adiciona animação de entrada
        setTimeout(() => {
          tr.style.opacity = '1';
          tr.style.transform = 'translateY(0)';
        }, 50);
      });

      // Adiciona evento de exclusão aos botões
      document.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', async function () {
          const id = this.getAttribute('data-id');
          
          // Animação de confirmação
          this.innerHTML = '<i class="fas fa-question"></i>';
          this.classList.add('confirming');
          
          // Timer para volta ao estado original se não houver segunda confirmação
          const confirmeTimeout = setTimeout(() => {
            this.innerHTML = '<i class="fas fa-trash-alt"></i>';
            this.classList.remove('confirming');
          }, 2000);
          
          // Segunda confirmação para excluir
          this.addEventListener('click', async function secondClick(e) {
            e.stopPropagation();
            clearTimeout(confirmeTimeout);
            
            // Animação de loading
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
              await excluirGasto(id);
              
              // Animação de remoção da linha
              const row = this.closest('tr');
              row.style.opacity = '0';
              row.style.transform = 'translateX(100%)';
              
              setTimeout(() => {
                carregarHistoricoGastos(); // Recarrega a tabela após exclusão
              }, 300);
              
              showNotification('Sucesso', 'Gasto excluído com sucesso!', 'success');
              
              // Atualizar gráficos
              await Promise.all([
                carregarGastosPizza(),
                carregarDadosGastos(),
                carregarDadosGanhoGasto()
              ]);
            } catch (error) {
              console.error('Erro ao excluir gasto:', error);
              showNotification('Erro', 'Não foi possível excluir o gasto.', 'error');
              this.innerHTML = '<i class="fas fa-trash-alt"></i>';
            }
            
            // Remove o evento de segunda confirmação
            this.removeEventListener('click', secondClick);
          }, { once: true });
        });
      });
    } catch (error) {
      console.error('Erro ao carregar o histórico de gastos:', error);
      showNotification('Erro', 'Não foi possível carregar o histórico de gastos.', 'error');
    }
  }

  async function excluirGasto(id) {
    const res = await fetch(`/api/novos_gastos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Erro ao excluir o gasto.');
    }
    return true;
  }

  // Carregar todos os dados ao inicializar a página
  Promise.all([
    carregarGastosPizza(),
    carregarDadosGastos(),
    carregarDadosGanhoGasto(),
    carregarHistoricoGastos()
  ]).then(() => {
    console.log('Todos os dados carregados com sucesso!');
  }).catch(error => {
    console.error('Erro ao carregar os dados:', error);
    showNotification('Erro', 'Houve um problema ao carregar os dados.', 'error');
  });

  // Adicione no final do arquivo CSS para as notificações
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      padding: 0;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
      overflow: hidden;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification-header {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      color: white;
      font-weight: 600;
    }
    
    .notification.success .notification-header {
      background-color: #4caf50;
    }
    
    .notification.error .notification-header {
      background-color: #f44336;
    }
    
    .notification-header i {
      margin-right: 8px;
    }
    
    .notification-header .close-notification {
      margin-left: auto;
      cursor: pointer;
    }
    
    .notification-body {
      padding: 15px;
    }
    
    .notification-body p {
      margin: 0;
      font-size: 0.9rem;
    }
    
    .confirming {
      background-color: #ffeb3b !important;
      color: #333 !important;
    }
    
    tr {
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    }
  `;
  document.head.appendChild(style);
});

// Função para controlar o tamanho dos gráficos e evitar expansão infinita
function ajustarTamanhoGraficos() {
  // Obtém todos os elementos canvas
  const canvasElements = document.querySelectorAll('canvas');
  
  // Define altura máxima para cada canvas
  canvasElements.forEach(canvas => {
    const parentHeight = canvas.parentElement.clientHeight;
    const maxHeight = Math.min(parentHeight, 350);
    canvas.style.maxHeight = `${maxHeight}px`;
  });
}

// Executar ao carregar e quando a janela for redimensionada
window.addEventListener('load', ajustarTamanhoGraficos);
window.addEventListener('resize', ajustarTamanhoGraficos);

// Garantir que o body não expanda além do necessário
document.body.style.overflowX = 'hidden';
document.documentElement.style.overflowX = 'hidden';

// Definir tamanho máximo para o corpo do documento
document.body.style.maxWidth = '100vw';
document.documentElement.style.maxWidth = '100vw';
