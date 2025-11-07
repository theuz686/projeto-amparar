// ========================================
// LOJA VIRTUAL - PROJETO AMPARAR
// ========================================

// CONFIGURAÇÕES
const NUMERO_WHATSAPP = '5581995277562'; // ALTERE PARA O NÚMERO DA LOJA
const VALOR_FRETE = 10.00;

// PRODUTOS
const produtos = [
    {
        id: 1,
        nome: 'Camisa Amparar',
        descricao: 'Camisa de algodão de alta qualidade com logo do Projeto Amparar',
        preco: 40.00,
        emoji: '👕',
        imagem: 'images-loja/camisa-amparar.png'
    },
    {
        id: 2,
        nome: 'Caneca branca Amparar',
        descricao: 'Caneca cerâmica com design exclusivo do Projeto Amparar',
        preco: 30.00,
        emoji: '☕',
        imagem: 'images-loja/caneca-amparar.png'
    },
    {
        id: 3,
        nome: 'Chaveiro Amparar',
        descricao: 'Chaveiro em acrílico com logo do Projeto Amparar',
        preco: 4.00,
        emoji: '🔑',
        imagem: 'images-loja/chaveiro-amparar.png'
    },
    {
        id: 4,
        nome: 'Livro Amparar',
        descricao: 'Livro sobre histórias de mulheres apoiadas pelo Projeto Amparar',
        preco: 35.00,
        emoji: '📚',
        imagem: 'images-loja/livro-vaninha.png'
    },
    {
        id: 5,
        nome: 'Garrafa termica Amparar',
        descricao: 'Garrafa térmica reutilizável com logo do Projeto Amparar',
        preco: 85.00,
        emoji: '🧴',
        imagem: 'images-loja/garrafa-termica.png'
    },
    {
        id: 6,
        nome: 'Espelho De Bolso Amparar',
        descricao: 'Espelho de bolso compacto com design do Projeto Amparar',
        preco: 12.00,
        emoji: '🪞',
        imagem: 'images-loja/espelho-bolso.png'
    }
];

// CARRINHO
let carrinho = {
    itens: [],
    
    adicionar(id, quantidade = 1) {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;
        
        const itemExistente = this.itens.find(i => i.id === id);
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            this.itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                quantidade: quantidade,
                emoji: produto.emoji
            });
        }
        
        this.salvar();
        this.atualizarContagem();
    },
    
    remover(id) {
        this.itens = this.itens.filter(i => i.id !== id);
        this.salvar();
        this.atualizarContagem();
    },
    
    atualizar(id, quantidade) {
        const item = this.itens.find(i => i.id === id);
        if (item) {
            item.quantidade = Math.max(1, quantidade);
            this.salvar();
            this.atualizarContagem();
        }
    },
    
    limpar() {
        this.itens = [];
        this.salvar();
        this.atualizarContagem();
    },
    
    getSubtotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    },
    
    getTotal() {
        return this.getSubtotal() + VALOR_FRETE;
    },
    
    salvar() {
        localStorage.setItem('amparar_carrinho', JSON.stringify(this.itens));
    },
    
    carregar() {
        const dados = localStorage.getItem('amparar_carrinho');
        this.itens = dados ? JSON.parse(dados) : [];
        this.atualizarContagem();
    },
    
    atualizarContagem() {
        const elemento = document.getElementById('cartCount');
        if (elemento) {
            elemento.textContent = this.itens.length;
        }
    }
};

// PEDIDO ATUAL
let pedidoAtual = null;

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    carrinho.carregar();
    renderizarProdutos();
    configurarFormulario();
});

// ========================================
// RENDERIZAÇÃO DE PRODUTOS
// ========================================

function renderizarProdutos() {
    const container = document.getElementById('produtosList');
    if (!container) return;
    
    container.innerHTML = produtos.map(produto => `
        <div class="produto-card">
            <div class="produto-imagem">
                ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}">` : produto.emoji}
            </div>
            <div class="produto-info">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-descricao">${produto.descricao}</p>
                <p class="produto-preco">R$ ${produto.preco.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

// ========================================
// FUNÇÕES DO CARRINHO
// ========================================

function adicionarAoCarrinho(id) {
    carrinho.adicionar(id);
    alert('Produto adicionado ao carrinho!');
}

function abrirCarrinho() {
    document.getElementById('produtosSection').style.display = 'none';
    document.getElementById('carrinhoSection').style.display = 'block';
    renderizarCarrinho();
    window.scrollTo(0, 0);
}

function voltarProdutos() {
    document.getElementById('carrinhoSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'none';
    document.getElementById('produtosSection').style.display = 'block';
    window.scrollTo(0, 0);
}

function renderizarCarrinho() {
    const vazio = document.getElementById('carrinhoVazio');
    const conteudo = document.getElementById('carrinhoConteudo');
    
    if (carrinho.itens.length === 0) {
        vazio.style.display = 'block';
        conteudo.style.display = 'none';
        return;
    }
    
    vazio.style.display = 'none';
    conteudo.style.display = 'block';
    
    const tbody = document.getElementById('carrinhoItens');
    tbody.innerHTML = carrinho.itens.map(item => `
        <tr>
            <td>${item.emoji} ${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>
                <div class="controle-quantidade">
                    <button onclick="carrinho.atualizar(${item.id}, ${item.quantidade - 1}); renderizarCarrinho();">-</button>
                    <input type="number" value="${item.quantidade}" readonly>
                    <button onclick="carrinho.atualizar(${item.id}, ${item.quantidade + 1}); renderizarCarrinho();">+</button>
                </div>
            </td>
            <td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="carrinho.remover(${item.id}); renderizarCarrinho();">
                    Remover
                </button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('subtotal').textContent = `R$ ${carrinho.getSubtotal().toFixed(2)}`;
    document.getElementById('frete').textContent = `R$ ${VALOR_FRETE.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${carrinho.getTotal().toFixed(2)}`;
}

// ========================================
// CHECKOUT
// ========================================

function irCheckout() {
    if (carrinho.itens.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    document.getElementById('carrinhoSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
    renderizarResumo();
    window.scrollTo(0, 0);
}

function voltarCarrinho() {
    document.getElementById('checkoutSection').style.display = 'none';
    document.getElementById('carrinhoSection').style.display = 'block';
    window.scrollTo(0, 0);
}

function renderizarResumo() {
    const container = document.getElementById('resumoPedido');
    let html = '';
    
    carrinho.itens.forEach(item => {
        html += `
            <div class="item-pedido">
                <span>${item.emoji} ${item.nome} (${item.quantidade}x)</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
        `;
    });
    
    html += `
        <div class="total-pedido">
            <span>Total:</span>
            <span>R$ ${carrinho.getTotal().toFixed(2)}</span>
        </div>
    `;
    
    container.innerHTML = html;
}

function configurarFormulario() {
    const form = document.getElementById('formCheckout');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processarPedido();
    });
    
    // Máscara de telefone
    const telefone = document.getElementById('telefone');
    if (telefone) {
        telefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            if (value.length >= 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            if (value.length >= 10) value = `${value.substring(0, 10)}-${value.substring(10)}`;
            e.target.value = value;
        });
    }
    
    // Máscara de CEP
    const cep = document.getElementById('cep');
    if (cep) {
        cep.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            if (value.length >= 5) value = `${value.substring(0, 5)}-${value.substring(5)}`;
            e.target.value = value;
        });
    }
}

function processarPedido() {
    const form = document.getElementById('formCheckout');
    
    pedidoAtual = {
        id: 'PED-' + Date.now(),
        timestamp: new Date(),
        cliente: {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value
        },
        endereco: {
            rua: document.getElementById('endereco').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cep: document.getElementById('cep').value
        },
        itens: [...carrinho.itens],
        subtotal: carrinho.getSubtotal(),
        frete: VALOR_FRETE,
        total: carrinho.getTotal(),
        pagamento: document.querySelector('input[name="pagamento"]:checked').value
    };
    
    // Salvar pedido
    let pedidos = JSON.parse(localStorage.getItem('amparar_pedidos') || '[]');
    pedidos.push(pedidoAtual);
    localStorage.setItem('amparar_pedidos', JSON.stringify(pedidos));
    
    // Mostrar modal de sucesso
    mostrarSucesso();
}

function mostrarSucesso() {
    document.getElementById('checkoutSection').style.display = 'none';
    
    const modal = document.getElementById('modalSucesso');
    const mensagem = document.getElementById('mensagemSucesso');
    const btnNota = document.getElementById('btnBaixarNota');
    
    mensagem.textContent = `Pedido #${pedidoAtual.id} realizado com sucesso! Você receberá uma confirmação no WhatsApp.`;
    
    if (pedidoAtual.pagamento === 'dinheiro') {
        btnNota.style.display = 'block';
    } else {
        btnNota.style.display = 'none';
    }
    
    modal.classList.add('active');
    
    // Enviar automaticamente para WhatsApp após 1 segundo
    setTimeout(() => {
        enviarWhatsApp();
    }, 1000);
}

function novosProdutos() {
    document.getElementById('modalSucesso').classList.remove('active');
    carrinho.limpar();
    document.getElementById('produtosSection').style.display = 'block';
    document.getElementById('formCheckout').reset();
    window.scrollTo(0, 0);
}

// ========================================
// NOTA FISCAL
// ========================================

function gerarNotaFiscal() {
    if (!pedidoAtual) return;
    
    const elemento = document.createElement('div');
    elemento.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e91e63; padding-bottom: 20px;">
                <h1 style="color: #e91e63; margin: 0;">NOTA FISCAL</h1>
                <p style="margin: 5px 0; color: #666;">Projeto Amparar</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #e91e63; margin-bottom: 10px;">Número do Pedido</h3>
                <p style="font-size: 18px; font-weight: bold;">${pedidoAtual.id}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div>
                    <h3 style="color: #e91e63; margin-bottom: 10px;">Dados do Cliente</h3>
                    <p><strong>Nome:</strong> ${pedidoAtual.cliente.nome}</p>
                    <p><strong>Email:</strong> ${pedidoAtual.cliente.email}</p>
                    <p><strong>Telefone:</strong> ${pedidoAtual.cliente.telefone}</p>
                </div>
                <div>
                    <h3 style="color: #e91e63; margin-bottom: 10px;">Endereço de Entrega</h3>
                    <p>${pedidoAtual.endereco.rua}, ${pedidoAtual.endereco.numero}</p>
                    ${pedidoAtual.endereco.complemento ? `<p>${pedidoAtual.endereco.complemento}</p>` : ''}
                    <p>${pedidoAtual.endereco.bairro}</p>
                    <p>${pedidoAtual.endereco.cidade}, ${pedidoAtual.endereco.estado}</p>
                    <p>${pedidoAtual.endereco.cep}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #e91e63; margin-bottom: 10px;">Itens do Pedido</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5e6ff; border-bottom: 2px solid #e91e63;">
                            <th style="padding: 10px; text-align: left;">Produto</th>
                            <th style="padding: 10px; text-align: center;">Quantidade</th>
                            <th style="padding: 10px; text-align: right;">Preço Unit.</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidoAtual.itens.map(item => `
                            <tr style="border-bottom: 1px solid #ecf0f1;">
                                <td style="padding: 10px;">${item.emoji} ${item.nome}</td>
                                <td style="padding: 10px; text-align: center;">${item.quantidade}</td>
                                <td style="padding: 10px; text-align: right;">R$ ${item.preco.toFixed(2)}</td>
                                <td style="padding: 10px; text-align: right;">R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="background-color: #f5e6ff; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>R$ ${pedidoAtual.subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Frete:</span>
                    <span>R$ ${pedidoAtual.frete.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #27ae60; border-top: 2px solid #e91e63; padding-top: 10px;">
                    <span>TOTAL:</span>
                    <span>R$ ${pedidoAtual.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
                <p>Obrigado por apoiar o Projeto Amparar! 💗</p>
                <p>Sua compra ajuda a financiar nossos projetos de apoio a mulheres com câncer de mama.</p>
            </div>
        </div>
    `;
    
    const opt = {
        margin: 10,
        filename: `nota-fiscal-${pedidoAtual.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(elemento).save();
}

// ========================================
// WHATSAPP
// ========================================

function enviarWhatsApp() {
    if (!pedidoAtual) return;
    
    let mensagem = `*🛍️ NOVO PEDIDO - PROJETO AMPARAR*\n\n`;
    mensagem += `*Número do Pedido:* ${pedidoAtual.id}\n`;
    mensagem += `*Data:* ${formatarData(pedidoAtual.timestamp)}\n`;
    mensagem += `*Hora:* ${formatarHora(pedidoAtual.timestamp)}\n\n`;
    
    mensagem += `*👤 DADOS DO CLIENTE:*\n`;
    mensagem += `*Nome:* ${pedidoAtual.cliente.nome}\n`;
    mensagem += `*Telefone:* ${pedidoAtual.cliente.telefone}\n`;
    mensagem += `*Email:* ${pedidoAtual.cliente.email}\n\n`;
    
    mensagem += `*📍 ENDEREÇO DE ENTREGA:*\n`;
    mensagem += `${pedidoAtual.endereco.rua}, ${pedidoAtual.endereco.numero}\n`;
    if (pedidoAtual.endereco.complemento) {
        mensagem += `${pedidoAtual.endereco.complemento}\n`;
    }
    mensagem += `${pedidoAtual.endereco.bairro}\n`;
    mensagem += `${pedidoAtual.endereco.cidade}, ${pedidoAtual.endereco.estado}\n`;
    mensagem += `CEP: ${pedidoAtual.endereco.cep}\n\n`;
    
    mensagem += `*🛒 ITENS DO PEDIDO:*\n`;
    pedidoAtual.itens.forEach(item => {
        mensagem += `${item.emoji} ${item.nome}\n`;
        mensagem += `   Quantidade: ${item.quantidade}\n`;
        mensagem += `   Valor unitário: R$ ${item.preco.toFixed(2)}\n`;
        mensagem += `   Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
    });
    
    mensagem += `*💰 RESUMO FINANCEIRO:*\n`;
    mensagem += `Subtotal: R$ ${pedidoAtual.subtotal.toFixed(2)}\n`;
    mensagem += `Frete: R$ ${pedidoAtual.frete.toFixed(2)}\n`;
    mensagem += `*TOTAL: R$ ${pedidoAtual.total.toFixed(2)}*\n\n`;
    
    mensagem += `*💳 FORMA DE PAGAMENTO:*\n`;
    mensagem += `${pedidoAtual.pagamento === 'dinheiro' ? '💵 Dinheiro na Entrega' : '📱 Pix'}\n\n`;
    
    mensagem += `---\n`;
    mensagem += `Obrigado por apoiar o Projeto Amparar! 💗\n`;
    mensagem += `Sua compra ajuda a financiar nossos projetos de apoio a mulheres com câncer de mama.`;
    
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// ========================================
// UTILITÁRIOS
// ========================================

function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarHora(data) {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

