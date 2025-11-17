// ====================================================================
// FUNÇÕES UTILITÁRIAS E DE MÁSCARA
// ====================================================================

// Remove tudo, exceto dígitos. Essencial para validação e máscaras.
function cleanDigits(value) {
    return value ? value.replace(/\D/g, '') : '';
}

// Aplica a máscara de CPF: XXX.XXX.XXX-XX (11 dígitos)
function maskCPF(e) {
    let value = cleanDigits(e.target.value).substring(0, 11);
    let maskedValue = value;
    
    // Aplica a máscara: 123.456.789-00
    if (value.length > 9) {
        maskedValue = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        maskedValue = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (value.length > 3) {
        maskedValue = value.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    }

    e.target.value = maskedValue;
}

// Aplica a máscara de Telefone: (XX) 9XXXX-XXXX (11 dígitos com DDD)
function maskTelefone(e) {
    let value = cleanDigits(e.target.value).substring(0, 11);
    let maskedValue = value;
    
    // Aplica a máscara: (XX) 9XXXX-XXXX
    if (value.length > 2) {
        maskedValue = `(${value.substring(0, 2)}) `;
    }
    
    if (value.length > 7) { 
        maskedValue += `${value.substring(2, 7)}-${value.substring(7, 11)}`;
    } else if (value.length > 2) {
        maskedValue += value.substring(2, 7);
    }

    e.target.value = maskedValue;
}

// ====================================================================
// VALIDAÇÕES ESPECÍFICAS
// ====================================================================

// Validação: Telefone deve ter EXATAMENTE 11 dígitos (após limpeza)
function isValidPhone(phone) {
    const cleanedPhone = cleanDigits(phone);
    return cleanedPhone.length === 11;
}

// Validação: E-mail deve ter EXATAMENTE o domínio @gmail.com
function isValidEmail(email) {
    // Regex para garantir que o e-mail termina com @gmail.com, case insensitive
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    return emailRegex.test(email);
}

// Validação: CPF deve ter EXATAMENTE 11 dígitos (após limpeza)
function isValidCPF(cpf) {
    const cleanedCPF = cleanDigits(cpf);
    return cleanedCPF.length === 11;
}

// ====================================================================
// LÓGICA PRINCIPAL DO FORMULÁRIO (EXISTENTE, COM MELHORIAS)
// ====================================================================

// Variáveis globais para o formulário
let currentFormType = null;

// Inicialização específica para a página de cadastros
document.addEventListener("DOMContentLoaded", function() {
    // Presume que esta lógica carrega os elementos dos formulários (amparada, acolhida, etc.)
    if (window.location.pathname.includes("cadastros.html")) {
        initializeCadastroPage();
    }
});

function initializeCadastroPage() {
    setupFormSubmission();
    setupFileUpload();
    setupMasksAndEvents(); // NOVO: Inicializa as máscaras
}

// NOVO: Configura os listeners de 'input' para as máscaras de CPF e Telefone
function setupMasksAndEvents() {
    const form = document.getElementById("formCadastro");
    if (form) {
        const cpfInput = form.querySelector("#cpf");
        const telefoneInput = form.querySelector("#telefone");
        
        // Aplica as máscaras
        if (cpfInput) {
            cpfInput.addEventListener('input', maskCPF);
        }
        if (telefoneInput) {
            telefoneInput.addEventListener('input', maskTelefone);
        }
    }
}

// Mostrar formulário específico
function mostrarFormulario(tipo) {
    currentFormType = tipo;
    
    const formularioSection = document.getElementById("formularioCadastro");
    const tituloFormulario = document.getElementById("tituloFormulario");
    const descricaoFormulario = document.getElementById("descricaoFormulario");
    const tipoCadastroInput = document.getElementById("tipoCadastro");
    
    // Configurar título e descrição baseado no tipo
    const configs = {
        "amparada": {
            titulo: "Cadastro de Amparada",
            descricao: "Para mulheres diagnosticadas com câncer de mama que precisam de suporte integral.",
            cor: "#EF4444"
        },
        "acolhida": {
            titulo: "Cadastro de Acolhida",
            descricao: "Para mulheres em situação de vulnerabilidade social que necessitam de apoio.",
            cor: "#3B82F6"
        },
        "voluntaria": {
            titulo: "Cadastro de Voluntária",
            descricao: "Para profissionais e colaboradores que desejam contribuir com o projeto.",
            cor: "#10B981"
        }
    };
    
    const config = configs[tipo];
    if (config) {
        tituloFormulario.textContent = config.titulo;
        descricaoFormulario.textContent = config.descricao;
        tipoCadastroInput.value = tipo;
        
        // Alterar cor do header
        const adminHeader = document.querySelector(".admin-header");
        if (adminHeader) {
            adminHeader.style.backgroundColor = config.cor;
        }
    }
    
    // Mostrar/ocultar campos específicos
    mostrarCamposEspecificos(tipo);
    
    // Mostrar formulário
    formularioSection.classList.remove("hidden");
    
    // Scroll suave para o formulário
    smoothScrollTo(formularioSection);
    
    // Limpar formulário
    document.getElementById("formCadastro").reset();
    tipoCadastroInput.value = tipo;
}

// Mostrar campos específicos baseado no tipo (Função mantida)
function mostrarCamposEspecificos(tipo) {
    const camposAmparadaAcolhida = document.getElementById("camposAmparadaAcolhida");
    const camposVoluntaria = document.getElementById("camposVoluntaria");
    const uploadLaudo = document.getElementById("uploadLaudo");
    
    // Ocultar todos os campos específicos primeiro
    camposAmparadaAcolhida.classList.add("hidden");
    camposVoluntaria.classList.add("hidden");
    uploadLaudo.classList.add("hidden");
    
    // Remover required de todos os campos específicos
    const allSpecificInputs = document.querySelectorAll("#camposAmparadaAcolhida input, #camposAmparadaAcolhida textarea, #camposVoluntaria input, #camposVoluntaria select, #camposVoluntaria textarea, #uploadLaudo input");
    allSpecificInputs.forEach(input => {
        input.removeAttribute("required");
    });
    
    // Mostrar campos específicos baseado no tipo
    if (tipo === "amparada" || tipo === "acolhida") {
        camposAmparadaAcolhida.classList.remove("hidden");
        
        // Adicionar required aos campos obrigatórios
        document.getElementById("numeroSid").setAttribute("required", "");
        document.getElementById("dataNascimento").setAttribute("required", "");
        
        // Para amparadas, mostrar upload de laudo
        if (tipo === "amparada") {
            uploadLaudo.classList.remove("hidden");
            document.getElementById("laudoMedico").setAttribute("required", "");
        }
    } else if (tipo === "voluntaria") {
        camposVoluntaria.classList.remove("hidden");
        
        // Adicionar required aos campos obrigatórios
        document.getElementById("areaAtuacao").setAttribute("required", "");
    }
}

// Cancelar cadastro (Função mantida)
function cancelarCadastro() {
    const formularioSection = document.getElementById("formularioCadastro");
    formularioSection.classList.add("hidden");
    
    // Limpar formulário
    document.getElementById("formCadastro").reset();
    currentFormType = null;
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Configurar submissão do formulário (Função mantida)
function setupFormSubmission() {
    const form = document.getElementById("formCadastro");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }
}

// Manipular submissão do formulário (Função mantida)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    // Omitindo a busca por 'btnSubmit' e funções de loading/API pois não foram fornecidas.
    // Você deve manter a implementação original dessas funções se existirem.
    
    // Validar formulário
    if (!validateForm(form)) {
        // Se a validação falhar, a mensagem já é exibida em validateForm
        return;
    }
    
    // ... RESTANTE DA LÓGICA DE SUBMISSÃO (API, Upload, etc.) ...
    
    /*
    // EXEMPLO DE COMO A LÓGICA DE SUBMISSÃO CONTINUARIA:
    setLoading(submitBtn, true);
    try {
        // Preparar dados do formulário
        const formData = new FormData(form);
        const data = {};
        
        // Converter FormData para objeto, removendo máscara de CPF e Telefone
        for (let [key, value] of formData.entries()) {
            if (key === "cpf" || key === "telefone") {
                data[key] = cleanDigits(value); // Remove a máscara antes de enviar
            } else if (key !== "laudoMedico") {
                data[key] = value;
            }
        }
        
        // ... Lógica de upload de arquivo (mantida) ...

        // Enviar dados para a API (mantida)
        const endpoint = `/cadastros/${currentFormType}`;
        const result = await apiRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data)
        });
        
        // Sucesso (mantido)
        showMessage("Cadastro realizado com sucesso! Nossa equipe entrará em contato em breve.", "success");
        form.reset();
        document.getElementById("formularioCadastro").classList.add("hidden");
        currentFormType = null;
        window.scrollTo({ top: 0, behavior: "smooth" });
        
    } catch (error) {
        console.error("Erro ao enviar cadastro:", error);
        showMessage("Erro ao enviar cadastro. Verifique os dados e tente novamente.", "error");
    } finally {
        setLoading(submitBtn, false);
    }
    */
}

// Validar formulário (ATUALIZADA com CPF e Validação de E-mail)
function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;
    
    // 1. Validação de campos obrigatórios (mantida)
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            isValid = false;
            field.focus();
            showMessage(`O campo "${field.previousElementSibling.textContent.replace("*", "").trim()}" é obrigatório.`, "error");
            return false;
        }
    }
    
    // 2. Validações de CPF, Telefone e E-mail
    const cpf = form.querySelector("#cpf")?.value || "";
    const telefone = form.querySelector("#telefone")?.value || "";
    const email = form.querySelector("#email")?.value || "";

    // Validação de CPF (11 dígitos)
    if (cpf && !isValidCPF(cpf)) {
        showMessage("Por favor, insira um CPF válido com exatamente 11 dígitos.", "error");
        form.querySelector("#cpf").focus();
        return false;
    }

    // Validação de Telefone (11 dígitos com DDD)
    if (telefone && !isValidPhone(telefone)) {
        showMessage("Por favor, insira um telefone válido com exatamente 11 dígitos (DDD + número).", "error");
        form.querySelector("#telefone").focus();
        return false;
    }
    
    // Validação de E-mail (Somente @gmail.com)
    if (email && !isValidEmail(email)) {
        showMessage("Por favor, insira um e-mail válido com o domínio exclusivo @gmail.com.", "error");
        form.querySelector("#email").focus();
        return false;
    }
    
    // Validar data de nascimento (não pode ser futura) (mantida)
    const dataNascimento = form.querySelector("#dataNascimento")?.value;
    if (dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        if (nascimento > hoje) {
            showMessage("A data de nascimento não pode ser no futuro.", "error");
            form.querySelector("#dataNascimento").focus();
            return false;
        }
    }
    
    // Validar arquivo de laudo para amparadas (mantida)
    if (currentFormType === "amparada") {
        const laudoFile = form.querySelector("#laudoMedico")?.files[0];
        if (laudoFile) {
            if (!validateFile(laudoFile)) {
                return false;
            }
        }
    }
    
    return true;
}

// Configurar upload de arquivo (Função mantida)
function setupFileUpload() {
    const fileInput = document.getElementById("laudoMedico");
    if (fileInput) {
        fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                validateFile(file);
            }
        });
    }
}

// Validar arquivo (Função mantida)
function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    
    if (file.size > maxSize) {
        showMessage("O arquivo deve ter no máximo 5MB.", "error");
        document.getElementById("laudoMedico").value = "";
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showMessage("Apenas arquivos PDF, JPG ou PNG são permitidos.", "error");
        document.getElementById("laudoMedico").value = "";
        return false;
    }
    
    return true;
}

// Exportar funções para uso global (mantida)
window.mostrarFormulario = mostrarFormulario;
window.cancelarCadastro = cancelarCadastro;

