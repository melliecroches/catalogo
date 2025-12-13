// Tenta pegar o que está salvo no navegador. Se não tiver nada, cria um array vazio.
let carrinho = JSON.parse(localStorage.getItem('carrinho_compras')) || [];

// =================================================================
// FUNÇÃO PARA GERAR O HTML DOS PRODUTOS
// (A variável 'produtos' vem do arquivo produtos.js, carregado antes)
// =================================================================

function renderizarCatalogo() {
    // Verifica se a lista de produtos foi carregada corretamente
    if (typeof produtos === 'undefined') {
        console.error("Erro: O arquivo produtos.js não foi carregado!");
        return;
    }

    produtos.forEach(produto => {
        // Encontra a seção correta (verao, classicos, etc)
        const secaoDestino = document.getElementById(produto.categoria);
        
        if (secaoDestino) {
            // Cria o HTML das opções de cores
            let opcoesCores = produto.cores.map(cor => `<option value="${cor}">${cor}</option>`).join('');

            // Cria o card HTML
            const cardHTML = `
                <div class="brinco-card">
                    <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
                    <div class="card-detalhes">
                        <h3>${produto.nome}</h3>
                        <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                        
                        <label for="cor-${produto.id}">Cor:</label>
                        <select id="cor-${produto.id}">
                            ${opcoesCores}
                        </select>

                        <label for="qtd-${produto.id}">Qtd:</label>
                        <input type="number" id="qtd-${produto.id}" value="1" min="1" max="100" class="input-quantidade">

                        <button class="adicionar-carrinho" data-nome="${produto.nome}" data-preco="${produto.preco}">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            `;
            secaoDestino.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}


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
    // -----------------------------------------------------------
    // NSalva o estado atual do carrinho no navegador
    // Sempre que essa função rodar (adicionar, remover, alterar), ele salva.
    localStorage.setItem('carrinho_compras', JSON.stringify(carrinho));
    // -----------------------------------------------------------

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

// =================================================================
// 3. INICIALIZAÇÃO (CARREGA TUDO NA ORDEM CERTA)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Primeiro desenhamos os produtos na tela
    renderizarCatalogo();
    
    // 2. Iniciamos o filtro (começa misturado)
    filtrarColecao('todos');

    // 3. ATIVAR BOTÕES "ADICIONAR AO CARRINHO"
    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', function() {
            const nome = this.getAttribute('data-nome');
            const precoUnitario = parseFloat(this.getAttribute('data-preco'));
            
            const cardDetalhes = this.closest('.card-detalhes'); 
            const selectCor = cardDetalhes.querySelector('select'); 
            const corSelecionada = selectCor ? selectCor.value : 'Padrão';
            
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
            
            // --- MELHORIA: Feedback Visual no Botão (Sem alerta chato) ---
            const textoOriginal = this.innerText; // Guarda o texto original
            this.innerText = "✓ Adicionado!";     // Muda o texto
            this.style.backgroundColor = "#25d366"; // Muda para verde (sucesso)
            
            // Depois de 1.5 segundos, volta ao normal
            setTimeout(() => {
                this.innerText = textoOriginal;
                this.style.backgroundColor = ""; // Volta a cor do CSS
            }, 1500);

            mostrarToast(`${nome} adicionado com sucesso!`);
        });
    });

    // 4. ATIVAR LIGHTBOX (ZOOM NA IMAGEM)
    // (Mesma lógica: precisamos reativar pois as imagens são novas)
    const lightbox = document.getElementById('lightbox');
    const imagemDestaque = document.getElementById('imagem-destaque');
    const imagensProdutos = document.querySelectorAll('.brinco-card img');

    imagensProdutos.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'flex';
            imagemDestaque.src = this.src;
        });
    });

    // Atualiza carrinho caso tenha sobrado algo (se implementar localStorage depois)
    atualizarCarrinhoHTML();
});

// ----------------------------------------------------
// FUNÇÕES DO MODAL (CHECKOUT) E WHATSAPP
// ----------------------------------------------------

function abrirModalCheckout() {
    if (carrinho.length === 0) {
        mostrarToast("Seu carrinho está vazio!");
        return;
    }
    document.getElementById('modal-checkout').style.display = 'block';
}

function fecharModalCheckout() {
    document.getElementById('modal-checkout').style.display = 'none';
}

// Função que troca os campos (Uber vs Retirada)
function alternarEntrega() {
    const tipo = document.querySelector('input[name="tipo_entrega"]:checked').value;
    const divUber = document.getElementById('campos-endereco-uber');
    const divRetirada = document.getElementById('info-retirada');

    if (tipo === 'uber') {
        divUber.classList.remove('escondido');
        divRetirada.classList.add('escondido');
    } else {
        divUber.classList.add('escondido');
        divRetirada.classList.remove('escondido');
    }
}

function enviarPedidoWhatsapp() {
    // 1. Pega os dados básicos
    const nome = document.getElementById('nome-cliente').value;
    const telefone = document.getElementById('whatsapp-cliente').value;
    const tipoEntrega = document.querySelector('input[name="tipo_entrega"]:checked').value;
    
    // Validação básica
    if (!nome || !telefone) {
        alert("Por favor, preencha seu Nome e WhatsApp.");
        return;
    }

    // 2. Monta o texto do Endereço baseado na escolha
    let textoEndereco = "";
    
    if (tipoEntrega === 'uber') {
        const rua = document.getElementById('end-rua').value;
        const numero = document.getElementById('end-numero').value;
        const bairro = document.getElementById('end-bairro').value;
        const cidade = document.getElementById('end-cidade').value;

        if (!rua || !numero || !bairro) {
            alert("Para entrega, precisamos do endereço completo (Rua, Número e Bairro).");
            return;
        }
        textoEndereco = `📍 *ENTREGA (Uber Flash)*\nEndereço: ${rua}, ${numero} - ${bairro}, ${cidade}`;
    
    } else {
        textoEndereco = `🛍️ *RETIRADA NO LOCAL*\n(Cliente irá buscar)`;
    }

    // 3. Monta a lista de produtos
    let resumoProdutos = "";
    let valorTotal = 0;
    
    carrinho.forEach(item => {
        resumoProdutos += `- ${item.quantidade}x ${item.nome} (${item.cor}) - R$ ${item.precoTotalItem.toFixed(2)}\n`;
        valorTotal += item.precoTotalItem;
    });
    
    // 4. Cria a mensagem final bonitona
    let mensagemCompleta = 
        `*NOVO PEDIDO - SITE*\n\n` + 
        `👤 *Cliente:* ${nome}\n` + 
        `📱 *WhatsApp:* ${telefone}\n\n` + 
        `--------------------------------\n` +
        `*🛒 ITENS DO PEDIDO:*\n` + 
        resumoProdutos + 
        `\n💰 *TOTAL PRODUTOS: R$ ${valorTotal.toFixed(2)}*\n` +
        `--------------------------------\n\n` +
        `${textoEndereco}\n\n` +
        `_Aguardo confirmação para pagamento._`;

    // 5. Envia
    const mensagemCodificada = encodeURIComponent(mensagemCompleta);
    const SEU_NUMERO_WHATSAPP = '55555'; // <--- MUDE SEU NÚMERO AQUI
    const linkWhatsapp = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${mensagemCodificada}`;
    
    window.open(linkWhatsapp, '_blank');
    fecharModalCheckout();
    
    // Limpa tudo
    carrinho = [];
    localStorage.setItem('carrinho_compras', JSON.stringify(carrinho)); // Limpa memória
    document.getElementById('nome-cliente').value = '';
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
// FUNCIONALIDADE: FILTRO DE COLEÇÕES (UNIFICADO)
// ----------------------------------------------------

function filtrarColecao(categoriaId) {
    const mainContainer = document.getElementById('catalogo-principal');
    const todasColecoes = document.querySelectorAll('.colecao');
    const botoes = document.querySelectorAll('.btn-menu');
    
    // 1. Atualiza o visual dos botões do menu (quem fica branco/ativo)
    botoes.forEach(btn => {
        btn.classList.remove('ativo');
        
        // Verifica se o botão clicado corresponde à categoria atual
        if (btn.getAttribute('onclick').includes(categoriaId)) {
            btn.classList.add('ativo');
        }
    });

    // 2. Lógica de Mostrar/Esconder
    if (categoriaId === 'todos') {
        // MODO MISTURADO:
        // Adiciona classe ao Main para ativar o CSS especial (display: contents)
        // Isso faz os produtos se misturarem visualmente e esconde os títulos das coleções
        mainContainer.classList.add('modo-misturado');
        
        // Garante que todas as seções estejam visíveis no HTML
        todasColecoes.forEach(col => col.classList.remove('escondido'));
        
    } else {
        // MODO COLEÇÃO ESPECÍFICA:
        // Remove o modo misturado (volta ao layout normal separado por blocos)
        mainContainer.classList.remove('modo-misturado');
        
        // Esconde as coleções que não foram escolhidas
        todasColecoes.forEach(col => {
            if (col.id === categoriaId) {
                col.classList.remove('escondido');
            } else {
                col.classList.add('escondido');
            }
        });
    }
}

// Inicia a página no modo misturado ("Ver Tudo")
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

// Função auxiliar para mostrar o Toast
function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.innerText = mensagem; // Define o texto (ex: "Brinco Lua adicionado!")
    toast.className = "mostrar"; // Adiciona a classe que torna visível
    
    // Depois de 3 segundos (3000ms), remove a classe para sumir
    setTimeout(function(){ 
        toast.className = toast.className.replace("mostrar", ""); 
    }, 3000);
}