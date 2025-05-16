// Script para gerenciar tema e interações da UI na página de Meus Ganhos
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu lateral
    const settingsIcon = document.getElementById('settingsIcon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeSidebar = document.querySelector('.close-sidebar');
    const themeToggle = document.getElementById('themeToggle');

    // Configurar o tema salvo (se houver)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Abrir menu de configurações
    if (settingsIcon) {
        settingsIcon.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }

    // Função para fechar o menu lateral
    function closeSidebarFunction() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Eventos para fechar o menu
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunction);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebarFunction);
    }

    // Alternar entre temas claro e escuro
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            
            // Salvar preferência no localStorage
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Efeitos de animação ao passar o mouse sobre os gráficos
    const chartBoxes = document.querySelectorAll('.chart-box');
    chartBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'translateY(-10px)';
            box.style.boxShadow = '0 1rem 2rem rgba(0, 123, 255, 0.3)';
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'translateY(0)';
            box.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.1)';
        });
    });

    // Adicionar efeito ao botão
    const submitButton = document.querySelector('form button');
    if (submitButton) {
        submitButton.addEventListener('mouseenter', () => {
            submitButton.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
        });
        
        submitButton.addEventListener('mouseleave', () => {
            submitButton.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
        });
    }

    console.log('theme_meuganhos.js carregado e configurado com sucesso');
});