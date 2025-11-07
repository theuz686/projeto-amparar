// A senha secreta para acesso ao painel
const CORRECT_PASSWORD = "amparar2025"; 

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos da página
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const dashboardContent = document.getElementById('dashboard-content');
    const errorMessage = document.getElementById('error-message');

    // --- 1. LÓGICA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o recarregamento da página (comportamento padrão do form)
            
            const passwordInput = document.getElementById('password');
            const enteredPassword = passwordInput.value;
            
            if (enteredPassword === CORRECT_PASSWORD) {
                // Senha correta: Esconde login e mostra dashboard
                loginScreen.style.display = 'none'; 
                dashboardContent.style.display = 'block'; 
                
                // Chama a função para desenhar o gráfico
                initializeSalesChart(); 

            } else {
                // Senha incorreta: Mostra mensagem de erro
                errorMessage.style.display = 'block'; 
                passwordInput.value = ''; // Limpa o campo da senha
                passwordInput.focus(); // Foca novamente no campo
            }
        });
    }

    // --- 2. FUNÇÃO DO GRÁFICO (CHAMADA APENAS APÓS O LOGIN) ---
    function initializeSalesChart() {
        // Dados de vendas (Ajuste estes dados com seus valores reais)
        const salesData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], 
            datasets: [{
                label: 'Total de Vendas',
                // Dados de exemplo:
                data: [15, 20, 25, 28, 35, 40, 42, 55, 65, 70, 85, 95], 
                
                backgroundColor: 'rgba(238, 75, 142, 0.1)', // Cor de preenchimento suave
                borderColor: '#EE4B8E', // Cor principal da linha (rosa)
                borderWidth: 3,
                fill: true,
                tension: 0.3 // Suaviza as curvas
            }]
        };

        const salesConfig = {
            type: 'line', 
            data: salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(0, 0, 0, 0.05)' } 
                    },
                    x: { 
                        grid: { display: false } 
                    }
                }
            }
        };

        // Renderiza o Gráfico no elemento Canvas
        const ctx = document.getElementById('salesChart');
        if (ctx) { 
            new Chart(ctx.getContext('2d'), salesConfig);
        }
    }
});