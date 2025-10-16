// Lógica específica para formulários de cadastro

// Variáveis globais para o formulário
let currentFormType = null;

// Inicialização específica para a página de cadastros
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("cadastros.html")) {
        initializeCadastroPage();
    }
});

function initializeCadastroPage() {
    setupFormSubmission();
    setupFileUpload();
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

// Mostrar campos específicos baseado no tipo
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

// Cancelar cadastro
function cancelarCadastro() {
    const formularioSection = document.getElementById("formularioCadastro");
    formularioSection.classList.add("hidden");
    
    // Limpar formulário
    document.getElementById("formCadastro").reset();
    currentFormType = null;
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Configurar submissão do formulário
function setupFormSubmission() {
    const form = document.getElementById("formCadastro");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }
}

// Manipular submissão do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById("btnSubmit");
    
    // Validar formulário
    if (!validateForm(form)) {
        return;
    }
    
    // Mostrar loading
    setLoading(submitBtn, true);
    
    try {
        // Preparar dados do formulário
        const formData = new FormData(form);
        const data = {};
        
        // Converter FormData para objeto
        for (let [key, value] of formData.entries()) {
            if (key !== "laudoMedico") { // Arquivo será tratado separadamente
                data[key] = value;
            }
        }
        
        // Upload do arquivo se necessário
        let arquivoUrl = null;
        const laudoFile = form.querySelector("#laudoMedico")?.files[0];
        if (laudoFile && currentFormType === "amparada") {
            try {
                const uploadResult = await uploadFile(laudoFile, "/upload/laudo");
                arquivoUrl = uploadResult.url;
                data.laudoMedicoUrl = arquivoUrl;
            } catch (uploadError) {
                showMessage("Erro ao fazer upload do laudo médico. Tente novamente.", "error");
                setLoading(submitBtn, false);
                return;
            }
        }
        
        // Enviar dados para a API
        const endpoint = `/cadastros/${currentFormType}`;
        const result = await apiRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data)
        });
        
        // Sucesso
        showMessage("Cadastro realizado com sucesso! Nossa equipe entrará em contato em breve.", "success");
        
        // Limpar e ocultar formulário
        form.reset();
        document.getElementById("formularioCadastro").classList.add("hidden");
        currentFormType = null;
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: "smooth" });
        
    } catch (error) {
        console.error("Erro ao enviar cadastro:", error);
        showMessage("Erro ao enviar cadastro. Verifique os dados e tente novamente.", "error");
    } finally {
        setLoading(submitBtn, false);
    }
}

// Validar formulário
function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.focus();
            showMessage(`O campo "${field.previousElementSibling.textContent.replace("*", "").trim()}" é obrigatório.`, "error");
            return false;
        }
    });
    
    // Validações específicas
    const telefone = form.querySelector("#telefone").value;
    if (telefone && !isValidPhone(telefone)) {
        showMessage("Por favor, insira um telefone válido no formato (83) 99999-9999.", "error");
        form.querySelector("#telefone").focus();
        return false;
    }
    
    const email = form.querySelector("#email").value;
    if (email && !isValidEmail(email)) {
        showMessage("Por favor, insira um e-mail válido.", "error");
        form.querySelector("#email").focus();
        return false;
    }
    
    // Validar data de nascimento (não pode ser futura)
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
    
    // Validar arquivo de laudo para amparadas
    if (currentFormType === "amparada") {
        const laudoFile = form.querySelector("#laudoMedico")?.files[0];
        if (laudoFile) {
            if (!validateFile(laudoFile)) {
                return false;
            }
        }
    }
    
    return isValid;
}

// Configurar upload de arquivo
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

// Validar arquivo
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

// Função para validar telefone (reutilizada do main.js)
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Função para validar email (reutilizada do main.js)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Exportar funções para uso global
window.mostrarFormulario = mostrarFormulario;
window.cancelarCadastro = cancelarCadastro;
