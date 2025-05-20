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

  // Funções para carregar os dados dos gráficos
  async function carregarDadosGanhos() {
    try {
      const response = await fetch('/api/ganhos');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      
      const dados = await response.json();
      
      if (!Array.isArray(dados)) {
        console.error("API não retornou um array:", dados);
        return;
      }

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
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `R$ ${context.raw.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
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
      console.error("Erro ao carregar dados de ganhos:", error);
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
      
      // Preparar dados para o gráfico
      const ganhosData = [];
      const gastosData = [];
      
      semanas.forEach(semana => {
        const ganho = dadosGanhos.find(g => g.semana === semana)?.total || 0;
        const gasto = dadosGastos.find(g => g.semana === semana)?.total || 0;
        
        ganhosData.push(ganho);
        gastosData.push(gasto);
      });

      const ctx = document.getElementById('grafico-ganho-gasto').getContext('2d');
      
      if (window.ganhoGastoChart) window.ganhoGastoChart.destroy();
      
      window.ganhoGastoChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: semanas.map(semana => `Semana ${semana}`),
          datasets: [
            {
              label: 'Ganhos',
              data: ganhosData,
              backgroundColor: 'rgba(0, 128, 0, 0.2)',
              borderColor: 'rgba(0, 128, 0, 1)',
              borderWidth: 3,
              tension: 0.1
            },
            {
              label: 'Gastos',
              data: gastosData,
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderColor: 'rgba(255, 0, 0, 1)',
              borderWidth: 3,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
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
      console.error("Erro ao carregar dados de ganhos e gastos:", error);
    }
  }

  function ajustarTamanhoGraficos() {
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(canvas => {
      const parentHeight = canvas.parentElement.clientHeight;
      const maxHeight = Math.min(parentHeight, 350);
      canvas.style.maxHeight = `${maxHeight}px`;
    });
  }

  // Carregar dados ao iniciar a página
  Promise.allSettled([
    carregarDadosGanhos(),
    carregarDadosGanhoGasto()
  ]).then(() => {
    console.log('Tentativas de carregamento concluídas');
    ajustarTamanhoGraficos();
  }).catch(error => {
    console.error('Erro geral ao carregar os dados:', error);
  });

  window.addEventListener('resize', ajustarTamanhoGraficos);
});