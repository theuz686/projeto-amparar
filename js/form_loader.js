/**
 * Arquivo: form_loader.js
 * Descrição: Script para carregar dinamicamente o formulário selecionado
 * (Amparada, Acolhida ou Voluntária) na área designada (form-area)
 * do arquivo cadastro_novo.html.
 */

const formArea = document.getElementById('form-area');

/**
 * Função para carregar o conteúdo de um arquivo HTML via Fetch API.
 * @param {string} filename O nome do arquivo HTML do formulário a ser carregado.
 */
function loadForm(filename) {
    // 1. Exibe a área do formulário
    formArea.style.display = 'block';

    // 2. Rola a página para a área do formulário
    formArea.scrollIntoView({ behavior: 'smooth' });

    // 3. Carrega o conteúdo do arquivo
    fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o formulário: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            // Insere o HTML do formulário na área
            formArea.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro:', error);
            formArea.innerHTML = '<p style="color: red;">Não foi possível carregar o formulário. Tente novamente.</p>';
        });
}

// A função loadForm é chamada diretamente nos botões do cadastro_novo.html (onclick="loadForm('...')")
// Não é necessário adicionar um event listener aqui.
