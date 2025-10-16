// Configurações globais
const API_BASE_URL = 'http://localhost:5000/api';

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function( ) {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    setupMobileMenu();
    setupModalPix();
    setupFormValidation();
    
    // Adicionar estilos do modal se não existirem
    if (!document.querySelector('#modalStyles')) {
        addModalStyles();
    }
}

// Configuração do menu mobile
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Configuração do modal PIX
function setupModalPix() {
    const modal = document.getElementById('modalPix');
    if (modal) {
        // Fechar modal ao clicar no overlay
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                fecharPix();
            }
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                fecharPix();
            }
        });
    }
}

// Mostrar modal PIX
function mostrarPix() {
    const modal = document.getElementById('modalPix');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal PIX
function fecharPix() {
    const modal = document.getElementById('modalPix');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Adicionar estilos do modal dinamicamente
function addModalStyles() {
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .modal.hidden {
            display: none;
        }
        
        .modal-content {
            background: white;
            border-radius: var(--border-radius-lg);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--sombra-hover);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--cinza-claro);
            background-color: var(--rosa-suave);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--rosa-escuro);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--cinza-medio);
            padding: 0.25rem;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            background-color: var(--cinza-claro);
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .pix-info {
            text-align: center;
        }
        
        .pix-key {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--rosa-principal);
            background-color: var(--rosa-suave);
            padding: 1rem;
            border-radius: var(--border-radius);
            margin: 1rem 0;
            border: 2px dashed var(--rosa-principal);
        }
        
        .pix-name {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--cinza-texto);
            margin: 1rem 0;
        }
        
        .pix-description {
            color: var(--cinza-medio);
            font-style: italic;
            margin-top: 1.5rem;
        }
    `;
    document.head.appendChild(style);
}

// Configuração de validação de formulários
function setupFormValidation() {
    // Máscara para telefone
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            e.target.value = value;
        });
    });
    
    // Validação de email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function(e) {
            const email = e.target.value;
            if (email && !isValidEmail(email)) {
                showMessage('Por favor, insira um e-mail válido.', 'error');
                e.target.focus();
            }
        });
    });
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

// Validar telefone
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Mostrar mensagens de feedback
function showMessage(message, type = 'info') {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast message-${type}`;
    messageDiv.textContent = message;
    
    // Adicionar estilos inline
    messageDiv.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 600;
        z-index: 10001;
        max-width: 300px;
        box-shadow: var(--sombra-hover);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Cores baseadas no tipo
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#10B981';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#EF4444';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#F59E0B';
            break;
        default:
            messageDiv.style.backgroundColor = '#3B82F6';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 5000);
}

// Adicionar animações para mensagens
if (!document.querySelector('#messageAnimations')) {
    const style = document.createElement('style');
    style.id = 'messageAnimations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Função para upload de arquivos
async function uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

// Função para formatar data
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para formatar telefone para exibição
function formatPhone(phone) {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

// Função para capitalizar primeira letra
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Função para loading state
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
        if (element.tagName === 'BUTTON') {
            element.dataset.originalText = element.textContent;
            element.textContent = 'Carregando...';
        }
    } else {
        element.classList.remove('loading');
        element.disabled = false;
        if (element.tagName === 'BUTTON' && element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
            delete element.dataset.originalText;
        }
    }
}

// Função para scroll suave
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Exportar funções para uso global
window.mostrarPix = mostrarPix;
window.fecharPix = fecharPix;
window.showMessage = showMessage;
window.apiRequest = apiRequest;
window.uploadFile = uploadFile;
window.formatDate = formatDate;
window.formatPhone = formatPhone;
window.capitalize = capitalize;
window.setLoading = setLoading;
window.smoothScrollTo = smoothScrollTo;
