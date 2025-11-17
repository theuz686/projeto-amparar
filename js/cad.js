/**
 * Arquivo: cad.js
 * Descrição: Lógica de front-end para o formulário de cadastro (cadastro.html).
 * Controla a exibição condicional dos campos específicos para Amparadas, Acolhidas e Voluntárias.
 */

document.addEventListener('DOMContentLoaded', function() {
    const tipoCadastroSelect = document.getElementById('tipo_cadastro');
    const secaoAmparada = document.getElementById('secao_amparada');
    const secaoAcolhida = document.getElementById('secao_acolhida');
    const secaoVoluntaria = document.getElementById('secao_voluntaria');

    // Campos específicos de cada tipo
    const camposAmparada = [
        document.getElementById('amparada_sid'),
        document.getElementById('laudo_medico')
    ];
    const camposAcolhida = [
        document.getElementById('acolhida_sid'),
        document.getElementById('descricao_necessidades')
    ];
    const camposVoluntaria = [
        document.getElementById('area_atuacao'),
        document.getElementById('disponibilidade'),
        document.getElementById('telefone'), // Telefone e Email são obrigatórios para Voluntárias
        document.getElementById('email')
    ];

    // Função para resetar a visibilidade e o atributo 'required' de todos os campos específicos
    function resetCampos() {
        // Esconde todas as seções
        secaoAmparada.classList.add('hidden');
        secaoAcolhida.classList.add('hidden');
        secaoVoluntaria.classList.add('hidden');

        // Remove 'required' de todos os campos específicos
        [...camposAmparada, ...camposAcolhida, ...camposVoluntaria].forEach(campo => {
            if (campo) {
                campo.removeAttribute('required');
            }
        });

        // Remove 'required' dos campos comuns (telefone e email) que são obrigatórios apenas para Voluntárias
        document.getElementById('telefone').removeAttribute('required');
        document.getElementById('email').removeAttribute('required');
    }

    // Função principal para lidar com a mudança no tipo de cadastro
    function handleTipoCadastroChange() {
        const tipoSelecionado = tipoCadastroSelect.value;

        // 1. Reseta o estado
        resetCampos();

        // 2. Define a visibilidade e os campos obrigatórios com base no tipo selecionado
        let camposParaTornarObrigatorios = [];

        if (tipoSelecionado === 'amparada') {
            secaoAmparada.classList.remove('hidden');
            camposParaTornarObrigatorios = camposAmparada;
        } else if (tipoSelecionado === 'acolhida') {
            secaoAcolhida.classList.remove('hidden');
            camposParaTornarObrigatorios = camposAcolhida;
        } else if (tipoSelecionado === 'voluntaria') {
            secaoVoluntaria.classList.remove('hidden');
            camposParaTornarObrigatorios = camposVoluntaria;
        }

        // 3. Aplica 'required' aos campos da seção visível
        camposParaTornarObrigatorios.forEach(campo => {
            if (campo) {
                campo.setAttribute('required', 'required');
            }
        });
    }

    // Adiciona o listener de evento
    tipoCadastroSelect.addEventListener('change', handleTipoCadastroChange);

    // Executa a função na carga inicial para garantir o estado correto (caso o navegador mantenha o valor selecionado)
    handleTipoCadastroChange();
});
