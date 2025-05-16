// Script para configurações de tema e interatividade

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu lateral
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeSidebar = document.querySelector('.close-sidebar');
    const settingsIcon = document.getElementById('settingsIcon');
    const themeToggle = document.getElementById('themeToggle');

    // Abrir menu pelo ícone de menu
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    // Abrir menu pelo ícone de configurações
    settingsIcon.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    // Função para fechar o menu lateral
    function closeSidebarFunction() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Eventos para fechar o menu
    closeSidebar.addEventListener('click', closeSidebarFunction);
    overlay.addEventListener('click', closeSidebarFunction);

    // Alternar entre temas claro e escuro
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        
        // Salvar preferência de tema no localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Verificar tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Efeitos de animação ao passar o mouse sobre os gráficos
    const chartBoxes = document.querySelectorAll('.chart-box');
    chartBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'translateY(-10px)';
            box.style.boxShadow = '0 1vw 2vw rgba(0, 123, 255, 0.3)';
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'translateY(0)';
            box.style.boxShadow = '0 0.5vw 1vw rgba(0, 0, 0, 0.1)';
        });
    });

    // Adicionar efeito de pulsação ao botão ao passar o mouse
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('mouseenter', () => {
        submitButton.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
    });
    
    submitButton.addEventListener('mouseleave', () => {
        submitButton.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
    });

    // Aplicar classes de animação aos itens do histórico
    const addAnimationToHistory = () => {
        const rows = document.querySelectorAll('#historicoTabela tbody tr');
        rows.forEach((row, index) => {
            row.classList.add('animate__animated', 'animate__fadeInUp');
            row.style.animationDelay = `${index * 0.1}s`;
        });
    };

    // Observar quando a tabela é atualizada
    const observeTableChanges = () => {
        const targetNode = document.querySelector('#historicoTabela tbody');
        if (!targetNode) return;
        
        const observer = new MutationObserver(addAnimationToHistory);
        observer.observe(targetNode, { childList: true });
    };

    observeTableChanges();
    
    console.log('Theme.js carregado com sucesso');
});