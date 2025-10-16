document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("admin.html")) {
        initializeAdminPage();
    }
});

const ADMIN_PASSWORD = "amparar2025"; // Senha de acesso ao painel

function initializeAdminPage() {
    const loginForm = document.getElementById("loginForm");
    const adminDashboard = document.getElementById("adminDashboard");
    const adminLogin = document.getElementById("adminLogin");
    const logoutBtn = document.getElementById("logoutBtn");

    // Verifica se já está logado (simulação)
    if (sessionStorage.getItem("adminLoggedIn") === "true") {
        adminLogin.classList.add("hidden");
        adminDashboard.classList.remove("hidden");
        loadDashboardStats();
    } else {
        adminLogin.classList.remove("hidden");
        adminDashboard.classList.add("hidden");
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const passwordInput = document.getElementById("adminPassword");
            if (passwordInput.value === ADMIN_PASSWORD) {
                sessionStorage.setItem("adminLoggedIn", "true");
                adminLogin.classList.add("hidden");
                adminDashboard.classList.remove("hidden");
                loadDashboardStats();
                showMessage("Login administrativo realizado com sucesso!", "success");
            } else {
                showMessage("Senha incorreta. Tente novamente.", "error");
                passwordInput.value = "";
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            sessionStorage.removeItem("adminLoggedIn");
            adminLogin.classList.remove("hidden");
            adminDashboard.classList.add("hidden");
            showMessage("Logout realizado com sucesso.", "info");
            // Limpar listas
            document.getElementById("listaCadastros").classList.add("hidden");
            document.getElementById("relatorioAniversariantes").classList.add("hidden");
        });
    }
}

async function loadDashboardStats() {
    try {
        const stats = await apiRequest("/admin/stats");
        document.getElementById("totalCadastros").textContent = stats.total_cadastros;
        document.getElementById("totalAmparadas").textContent = stats.amparadas;
        document.getElementById("totalAcolhidas").textContent = stats.acolhidas;
        document.getElementById("totalVoluntarias").textContent = stats.voluntarias;
    } catch (error) {
        showMessage("Erro ao carregar estatísticas do dashboard.", "error");
        console.error("Erro ao carregar stats:", error);
    }
}

async function carregarCadastros(tipo) {
    const tabelaCadastrosBody = document.getElementById("tabelaCadastrosBody");
    const listaCadastrosDiv = document.getElementById("listaCadastros");
    const relatorioAniversariantesDiv = document.getElementById("relatorioAniversariantes");

    // Ocultar relatório de aniversariantes
    relatorioAniversariantesDiv.classList.add("hidden");

    try {
        const cadastros = await apiRequest(`/admin/cadastros/${tipo}`);
        tabelaCadastrosBody.innerHTML = ""; // Limpa a tabela

        if (cadastros.length === 0) {
            tabelaCadastrosBody.innerHTML = `<tr><td colspan="4">Nenhum cadastro de ${tipo} encontrado.</td></tr>`;
        } else {
            cadastros.forEach(cadastro => {
                const row = tabelaCadastrosBody.insertRow();
                row.insertCell(0).textContent = cadastro.nomeCompleto;
                row.insertCell(1).textContent = capitalize(cadastro.tipoCadastro);
                row.insertCell(2).textContent = formatPhone(cadastro.telefone) + (cadastro.email ? ` / ${cadastro.email}` : "");
                
                const actionsCell = row.insertCell(3);
                const viewBtn = document.createElement("button");
                viewBtn.textContent = "Ver Detalhes";
                viewBtn.className = "btn btn-sm btn-info";
                viewBtn.onclick = () => verDetalhesCadastro(cadastro);
                actionsCell.appendChild(viewBtn);

                const editBtn = document.createElement("button");
                editBtn.textContent = "Editar";
                editBtn.className = "btn btn-sm btn-warning ml-2";
                editBtn.onclick = () => editarCadastro(cadastro);
                actionsCell.appendChild(editBtn);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Excluir";
                deleteBtn.className = "btn btn-sm btn-danger ml-2";
                deleteBtn.onclick = () => excluirCadastro(cadastro.id, tipo);
                actionsCell.appendChild(deleteBtn);
            });
        }
        listaCadastrosDiv.classList.remove("hidden");
    } catch (error) {
        showMessage(`Erro ao carregar cadastros de ${tipo}.`, "error");
        console.error("Erro ao carregar cadastros:", error);
    }
}

function verDetalhesCadastro(cadastro) {
    let details = `
        <h3>Detalhes do Cadastro</h3>
        <p><strong>ID:</strong> ${cadastro.id}</p>
        <p><strong>Tipo:</strong> ${capitalize(cadastro.tipoCadastro)}</p>
        <p><strong>Nome Completo:</strong> ${cadastro.nomeCompleto}</p>
        <p><strong>Telefone:</strong> ${formatPhone(cadastro.telefone)}</p>
        <p><strong>E-mail:</strong> ${cadastro.email || "N/A"}</p>
        <p><strong>Endereço:</strong> ${cadastro.endereco}</p>
    `;

    if (cadastro.tipoCadastro === "amparada" || cadastro.tipoCadastro === "acolhida") {
        details += `
            <p><strong>Número SID:</strong> ${cadastro.numeroSid || "N/A"}</p>
            <p><strong>Data de Nascimento:</strong> ${formatDate(cadastro.dataNascimento)}</p>
            <p><strong>Necessidades Principais:</strong> ${cadastro.necessidadesPrincipais || "N/A"}</p>
        `;
        if (cadastro.tipoCadastro === "amparada" && cadastro.laudoMedicoUrl) {
            details += `<p><strong>Laudo Médico:</strong> <a href="${cadastro.laudoMedicoUrl}" target="_blank">Ver Laudo</a></p>`;
        }
    } else if (cadastro.tipoCadastro === "voluntaria") {
        details += `
            <p><strong>Área de Atuação:</strong> ${capitalize(cadastro.areaAtuacao) || "N/A"}</p>
            <p><strong>Disponibilidade:</strong> ${cadastro.disponibilidade || "N/A"}</p>
            <p><strong>Experiência:</strong> ${cadastro.experiencia || "N/A"}</p>
        `;
    }

    showMessage(details, "info"); // Usar showMessage para exibir detalhes em um modal ou toast
}

function editarCadastro(cadastro) {
    showMessage("Funcionalidade de edição em desenvolvimento.", "warning");
    console.log("Editar cadastro:", cadastro);
    // Implementar lógica de edição aqui, talvez abrindo um modal com o formulário preenchido
}

async function excluirCadastro(id, tipo) {
    if (confirm("Tem certeza que deseja excluir este cadastro?")) {
        try {
            await apiRequest(`/admin/cadastros/${tipo}/${id}`, { method: "DELETE" });
            showMessage("Cadastro excluído com sucesso!", "success");
            loadDashboardStats();
            carregarCadastros(tipo); // Recarrega a lista após exclusão
        } catch (error) {
            showMessage("Erro ao excluir cadastro.", "error");
            console.error("Erro ao excluir cadastro:", error);
        }
    }
}

async function gerarRelatorioAniversariantes() {
    const tabelaAniversariantesBody = document.getElementById("tabelaAniversariantesBody");
    const relatorioAniversariantesDiv = document.getElementById("relatorioAniversariantes");
    const listaCadastrosDiv = document.getElementById("listaCadastros");

    // Ocultar lista de cadastros
    listaCadastrosDiv.classList.add("hidden");

    try {
        const aniversariantes = await apiRequest("/admin/aniversariantes");
        tabelaAniversariantesBody.innerHTML = ""; // Limpa a tabela

        if (aniversariantes.length === 0) {
            tabelaAniversariantesBody.innerHTML = `<tr><td colspan="4">Nenhum aniversariante este mês.</td></tr>`;
        } else {
            aniversariantes.forEach(aniversariante => {
                const row = tabelaAniversariantesBody.insertRow();
                row.insertCell(0).textContent = aniversariante.nomeCompleto;
                row.insertCell(1).textContent = formatDate(aniversariante.dataNascimento);
                row.insertCell(2).textContent = capitalize(aniversariante.tipoCadastro);
                row.insertCell(3).textContent = formatPhone(aniversariante.telefone);
            });
        }
        relatorioAniversariantesDiv.classList.remove("hidden");
    } catch (error) {
        showMessage("Erro ao gerar relatório de aniversariantes.", "error");
        console.error("Erro ao gerar relatório de aniversariantes:", error);
    }
}

// Exportar funções para uso global
window.carregarCadastros = carregarCadastros;
window.gerarRelatorioAniversariantes = gerarRelatorioAniversariantes;
window.verDetalhesCadastro = verDetalhesCadastro;
window.editarCadastro = editarCadastro;
window.excluirCadastro = excluirCadastro;
