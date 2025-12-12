let carrinho = []; // Array principal para armazenar os itens

// ----------------------------------------------------
// FUNÇÃO NOVIDADE: Altera a Quantidade no Carrinho
// ----------------------------------------------------

function alterarQuantidadeCarrinho(inputElement, index) {
    let novaQuantidade = parseInt(inputElement.value);

    // Valida: Garante que a quantidade é pelo menos 1 e é um número
    if (isNaN(novaQuantidade) || novaQuantidade < 1) {
        novaQuantidade = 1;
        inputElement.value = 1; // Corrige o valor no campo
    }

    const item = carrinho[index];
    
    // 1. Atualiza a quantidade
    item.quantidade = novaQuantidade;
    
    // 2. Recalcula o total do item (Preço Unitário * Nova Quantidade)
    item.precoTotalItem = item.precoUnitario * novaQuantidade;

    // 3. Atualiza o HTML completo do carrinho para refletir o novo total
    atualizarCarrinhoHTML();
}


// ----------------------------------------------------
// FUNÇÕES DE EXIBIÇÃO E LÓGICA DO CARRINHO
// ----------------------------------------------------

function atualizarCarrinhoHTML() {
    const lista = document.getElementById('lista-carrinho');
    const totalItensSpan = document.getElementById('total-itens');
    const valorTotalSpan = document.getElementById('valor-total');
    let totalValor = 0;
    let totalUnidades = 0;

    lista.innerHTML = ''; 

    if (carrinho.length === 0) {
        lista.innerHTML = '<li>Seu pedido está vazio.</li>';
        document.getElementById('finalizar-compra').disabled = true;
    } else {
        document.getElementById('finalizar-compra').disabled = false;
        
        carrinho.forEach((item, index) => {
            const li = document.createElement('li');
            
            // 💡 ATENÇÃO: Adicionamos o campo de INPUT aqui
            li.innerHTML = `
                <div class="item-detalhes">
                    ${item.nome} (${item.cor}) 
                    <p class="item-subtotal">R$ ${item.precoTotalItem.toFixed(2)}</p>
                </div>
                <div class="item-controles">
                    <input type="number" value="${item.quantidade}" min="1" 
                           class="input-qtd-carrinho" 
                           data-index="${index}" 
                           onchange="alterarQuantidadeCarrinho(this, ${index})">
                    <button class="remover-item" data-index="${index}">X</button>
                </div>
            `;
            lista.appendChild(li);
            
            // Atualiza os totais
            totalValor += item.precoTotalItem;
            totalUnidades += item.quantidade;
        });

        // Adiciona evento de remoção
        document.querySelectorAll('.remover-item').forEach(button => {
            button.addEventListener('click', function() {
                removerItemCarrinho(parseInt(this.getAttribute('data-index')));
            });
        });
    }

    // Atualiza os totais na lateral
    totalItensSpan.textContent = totalUnidades; 
    valorTotalSpan.textContent = totalValor.toFixed(2);
}

function removerItemCarrinho(index) {
    carrinho.splice(index, 1); 
    atualizarCarrinhoHTML(); 
}

// Escuta o clique nos botões "Adicionar"
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', function() {
            const nome = this.getAttribute('data-nome');
            const precoUnitario = parseFloat(this.getAttribute('data-preco'));
            
            const cardDetalhes = this.closest('.card-detalhes'); 
            const selectCor = cardDetalhes.querySelector('select'); 
            const corSelecionada = selectCor ? selectCor.value : 'Cor Padrão';
            
            const inputQtd = cardDetalhes.querySelector('.input-quantidade');
            const quantidade = parseInt(inputQtd.value) || 1; 
            
            const item = {
                nome: nome,
                cor: corSelecionada,
                precoUnitario: precoUnitario, 
                quantidade: quantidade, 
                precoTotalItem: precoUnitario * quantidade
            };
            
            carrinho.push(item);
            atualizarCarrinhoHTML();
        });
    });

    atualizarCarrinhoHTML();
});

// ----------------------------------------------------
// FUNÇÕES DO MODAL (CHECKOUT) E WHATSAPP
// ----------------------------------------------------

function abrirModalCheckout() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione pelo menos um brinco.");
        return;
    }
    document.getElementById('modal-checkout').style.display = 'block';
}

function fecharModalCheckout() {
    document.getElementById('modal-checkout').style.display = 'none';
}

function enviarPedidoWhatsapp() {
    const nome = document.getElementById('nome-cliente').value;
    const endereco = document.getElementById('endereco-cliente').value;
    const telefone = document.getElementById('whatsapp-cliente').value;
    
    if (!nome || !endereco || !telefone) {
        alert("Por favor, preencha todos os dados de contato!");
        return;
    }

    let resumoProdutos = ">>> ITENS DO PEDIDO:\n";
    let valorTotal = 0;
    
    carrinho.forEach(item => {
        // Formato para o WhatsApp: Quantidade x Nome (Cor) - Preço Total
        resumoProdutos += 
            `- ${item.quantidade}x ${item.nome} (${item.cor}) - R$ ${item.precoTotalItem.toFixed(2)}\n`;
        valorTotal += item.precoTotalItem;
    });
    
    let mensagemCompleta = 
        `*NOVO PEDIDO - CATÁLOGO VIRTUAL*\n\n` + 
        `*CLIENTE:*\n` + 
        `Nome: ${nome}\n` + 
        `Endereço: ${endereco}\n` + 
        `Tel: ${telefone}\n\n` + 
        resumoProdutos + 
        `\n*VALOR ESTIMADO TOTAL (sem frete): R$ ${valorTotal.toFixed(2)}*` +
        `\n\n_Aguardo seu retorno para acertar o frete e forma de pagamento._`;

    const mensagemCodificada = encodeURIComponent(mensagemCompleta);
    const SEU_NUMERO_WHATSAPP = '555555'; // ⚠️ RECONFIRME SEU NÚMERO AQUI
    const linkWhatsapp = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${mensagemCodificada}`;
    
    window.open(linkWhatsapp, '_blank');
    fecharModalCheckout();
    
    // Limpar o carrinho e campos após o envio
    carrinho = [];
    document.getElementById('nome-cliente').value = '';
    document.getElementById('endereco-cliente').value = '';
    document.getElementById('whatsapp-cliente').value = '';
    atualizarCarrinhoHTML();
}

// ----------------------------------------------------
// FUNCIONALIDADE: LIGHTBOX (IMAGEM TELA CHEIA)
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega todos os elementos necessários
    const lightbox = document.getElementById('lightbox');
    const imagemDestaque = document.getElementById('imagem-destaque');
    const imagensProdutos = document.querySelectorAll('.brinco-card img');

    // 2. Adiciona o evento de clique em CADA imagem de produto
    imagensProdutos.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'flex'; // Mostra o modal (flex para centralizar)
            imagemDestaque.src = this.src;   // Copia a foto clicada para o destaque
        });
    });
});

// 3. Função para fechar (chamada pelo HTML no onclick)
function fecharLightbox(event) {
    // Fecha se clicar no "X" OU se clicar no fundo preto (fora da imagem)
    if (event.target.id === 'lightbox' || event.target.classList.contains('fechar-btn')) {
        document.getElementById('lightbox').style.display = 'none';
    }
}

// ----------------------------------------------------
// FUNCIONALIDADE: NAVEGAÇÃO POR COLEÇÕES (MENU)
// ----------------------------------------------------

function filtrarColecao(categoriaId) {
    // 1. Pega todas as seções de coleção
    const todasColecoes = document.querySelectorAll('.colecao');
    
    // 2. Lógica de Mostrar/Esconder
    todasColecoes.forEach(colecao => {
        if (categoriaId === 'todos') {
            // Se for 'todos', remove a classe que esconde
            colecao.classList.remove('escondido');
        } else {
            // Se o ID da coleção for igual ao botão clicado, mostra. Senão, esconde.
            if (colecao.id === categoriaId) {
                colecao.classList.remove('escondido');
            } else {
                colecao.classList.add('escondido');
            }
        }
    });

    // 3. Atualiza o visual dos botões (deixa branco o que foi clicado)
    const botoes = document.querySelectorAll('.btn-menu');
    botoes.forEach(btn => {
        // Remove a classe 'ativo' de todos
        btn.classList.remove('ativo');
        
        // Verifica se o texto do botão ou onclick corresponde à categoria atual (truque simples)
        if (btn.getAttribute('onclick').includes(categoriaId)) {
            btn.classList.add('ativo');
        }
    });
}

// ----------------------------------------------------
// FUNCIONALIDADE: FILTRO DE COLEÇÕES (MISTURADO)
// ----------------------------------------------------

function filtrarColecao(categoriaId) {
    const mainContainer = document.getElementById('catalogo-principal');
    const todasColecoes = document.querySelectorAll('.colecao');
    
    // Atualiza botões do menu
    document.querySelectorAll('.btn-menu').forEach(btn => {
        btn.classList.remove('ativo');
        if (btn.getAttribute('onclick').includes(categoriaId)) {
            btn.classList.add('ativo');
        }
    });

    if (categoriaId === 'todos') {
        // MODO MISTURADO:
        // 1. Adiciona classe ao Main para ativar o CSS especial
        mainContainer.classList.add('modo-misturado');
        
        // 2. Garante que todas as seções estejam visíveis (mas sem headers, via CSS)
        todasColecoes.forEach(col => col.classList.remove('escondido'));
        
    } else {
        // MODO COLEÇÃO ESPECÍFICA:
        // 1. Remove o modo misturado (volta ao normal)
        mainContainer.classList.remove('modo-misturado');
        
        // 2. Esconde quem não é a escolhida e mostra a escolhida
        todasColecoes.forEach(col => {
            if (col.id === categoriaId) {
                col.classList.remove('escondido');
            } else {
                col.classList.add('escondido');
            }
        });
    }
}

// Inicia a página no modo misturado (opcional)
document.addEventListener('DOMContentLoaded', () => {
    filtrarColecao('todos');
});

// ----------------------------------------------------
// FUNCIONALIDADE: ABRIR/FECHAR CARRINHO NO MOBILE
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const carrinho = document.getElementById('carrinho-lateral');

    carrinho.addEventListener('click', (e) => {
        // Verifica se a tela é pequena (Mobile)
        if (window.innerWidth <= 768) {
            
            // Se clicar dentro do modal ou inputs, NÃO fecha (para conseguir digitar)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }

            // Alterna a classe que expande o carrinho
            carrinho.classList.toggle('expandido');
        }
    });
});