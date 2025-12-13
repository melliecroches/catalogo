// =================================================================
// CONFIGURAÇÕES DA LOJA
// =================================================================
const CONFIG = {
    telefone: '5555',    // Seu WhatsApp (somente números)
    nomeLoja: 'Melliê Crochês', // Nome da Loja
    instagram: 'melliecroches'  // Seu usuário do Instagram (sem @)
};

// Função auxiliar para formatar dinheiro (R$) profissionalmente
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Tenta pegar o que está salvo no navegador. Se não tiver nada, cria um array vazio.
let carrinho = JSON.parse(localStorage.getItem('carrinho_compras')) || [];

// =================================================================
// INICIALIZAÇÃO DINÂMICA (CRIA SEÇÕES E BOTÕES SOZINHO)
// =================================================================
function inicializarLoja() {
    if (typeof produtos === 'undefined') return;

    const categoriasUnicas = [...new Set(produtos.map(p => p.categoria))];
    const menuContainer = document.getElementById('menu-container');
    const mainContainer = document.getElementById('catalogo-principal');

    categoriasUnicas.forEach(catId => {
        // 1. Cria Botão do Menu (Mantive igual)
        if (!document.querySelector(`button[onclick="filtrarColecao('${catId}')"]`)) {
            const nomeBotao = NOMES_CATEGORIAS[catId] 
                ? NOMES_CATEGORIAS[catId].replace(/^[^\w\s]+/, '').trim()
                : catId.charAt(0).toUpperCase() + catId.slice(1);

            const btn = document.createElement('button');
            btn.className = 'btn-menu';
            btn.innerText = nomeBotao;
            btn.setAttribute('onclick', `filtrarColecao('${catId}')`);
            menuContainer.appendChild(btn);
        }

        // 2. Cria a Seção no HTML (ATUALIZADO PARA LEGENDA NUMERADA)
        if (!document.getElementById(catId)) {
            const section = document.createElement('section');
            section.id = catId;
            section.className = 'colecao';

            const tituloBonito = NOMES_CATEGORIAS[catId] || (catId.charAt(0).toUpperCase() + catId.slice(1));
            
            // LÓGICA NOVA: Cria a legenda numerada
            let htmlLegenda = '';
            if (CORES_COLECAO[catId]) {
                const itensLegenda = CORES_COLECAO[catId].map((corObj, index) => {
                    // Adicionei um 'title' para o nome aparecer se passar o mouse em cima (opcional, mas útil)
                    return `
                        <span class="cor-bolinha-numerada" style="background-color: ${corObj.hex};" title="${corObj.nome}">
                            ${index + 1}
                        </span>
                    `;
                }).join('');
                
                htmlLegenda = `<div class="paleta-colecao">${itensLegenda}</div>`;
            }

            section.innerHTML = `
                <div class="cabecalho-colecao">
                    <h2>${tituloBonito}</h2>
                    ${htmlLegenda} 
                </div>
            `;
            
            mainContainer.appendChild(section);
        }
    });
}

// Função que gera as opções do <select> baseada na categoria
function gerarOpcoesCores(paletaId, labelPadrao = 'Escolha a Cor') {
    // Agora busca a paleta pelo ID passado (paletaId)
    const listaCores = CORES_COLECAO[paletaId]; 

    if (listaCores && listaCores.length > 0) {
        return listaCores.map((corObj, index) => 
            `<option value="${corObj.nome}">${index + 1}. ${corObj.nome}</option>`
        ).join('');
    } 
    
    // Fallback se não encontrar a paleta
    return `<option value="Padrão">Cor Única / Padrão</option>`;
}
// =================================================================
// FUNÇÃO PARA GERAR O HTML DOS PRODUTOS
// (A variável 'produtos' vem do arquivo produtos.js, carregado antes)
// =================================================================

function renderizarCatalogo() {
    if (typeof produtos === 'undefined') return;

    produtos.forEach(produto => {
        const secaoDestino = document.getElementById(produto.categoria);
        
        if (secaoDestino) {
            // O código 'controlesCorHTML' é totalmente descartado aqui
            
            // O restante do card HTML é alterado para ser mais simples
            const cardHTML = `
                <div class="brinco-card" data-id="${produto.id}">
                    <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" onclick="abrirProduto(${produto.id})">
                    <div class="card-detalhes">
                        <h3 onclick="abrirProduto(${produto.id})" style="cursor: pointer; text-decoration: underline;">
                            ${produto.nome}
                        </h3>
                        <p class="preco">${formatarMoeda(produto.preco)}</p>
                        
                        <button class="adicionar-carrinho" onclick="abrirProduto(${produto.id})">
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
                    <p class="item-subtotal">${formatarMoeda(item.precoTotalItem)}</p>
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
    // Remove o "R$" e o espaço, deixando só o número (ex: 1.250,00)
    valorTotalSpan.textContent = formatarMoeda(totalValor).replace('R$', '').trim();
}

// ----------------------------------------------------
// FUNÇÃO: Limpar o Carrinho Inteiro
// ----------------------------------------------------
function limparCarrinhoCompleto() {
    // 1. Confirmação (Opcional, mas altamente recomendada para evitar cliques acidentais)
    const confirmar = confirm("Tem certeza que deseja remover todos os itens do pedido?");
    
    if (confirmar) {
        // 2. Reseta o array do carrinho
        carrinho = [];
        
        // 3. Atualiza o HTML (que também salva o localStorage vazio)
        atualizarCarrinhoHTML();
        
        // 4. Feedback visual
        mostrarToast("Carrinho limpo! 🗑️");
        
        // Garante que a mensagem de "Item removido" (toast de desfazer) suma
        const toast = document.getElementById("toast");
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.className = toast.className.replace("mostrar", "");
    }
}

// =================================================================
// LÓGICA DE REMOÇÃO COM "DESFAZER" (UNDO)
// =================================================================

// Variáveis temporárias para guardar o que foi apagado
let itemRemovidoTemp = null;
let indiceRemovidoTemp = null;
let toastTimeout = null; // Para controlar o tempo do aviso

function removerItemCarrinho(index) {
    // 1. Salva os dados antes de apagar (Backup)
    itemRemovidoTemp = carrinho[index];
    indiceRemovidoTemp = index;

    // 2. Remove do array e atualiza a tela
    carrinho.splice(index, 1); 
    atualizarCarrinhoHTML(); 

    // 3. Mostra o aviso com botão de Desfazer
    mostrarToastDesfazer();
}

function mostrarToastDesfazer() {
    const toast = document.getElementById("toast");
    
    // Injetamos HTML com o botão dentro da mensagem
    toast.innerHTML = `
        Item removido. 
        <button onclick="desfazerRemocao()">↩ Desfazer</button>
    `;
    
    toast.className = "mostrar";

    // Limpa qualquer timer anterior para não sumir rápido demais se clicar várias vezes
    if (toastTimeout) clearTimeout(toastTimeout);

    // Esconde depois de 4 segundos
    toastTimeout = setTimeout(function(){ 
        toast.className = toast.className.replace("mostrar", ""); 
    }, 4000);
}

function desfazerRemocao() {
    if (itemRemovidoTemp) {
        // 1. Coloca o item de volta EXATAMENTE onde estava (splice com 0 remove nada e insere)
        carrinho.splice(indiceRemovidoTemp, 0, itemRemovidoTemp);
        
        // 2. Atualiza a tela
        atualizarCarrinhoHTML();

        // 3. Feedback visual que deu certo
        const toast = document.getElementById("toast");
        toast.innerHTML = "✓ Recuperado!"; // Tira o botão e mostra sucesso
        
        // Esconde mais rápido (1.5s)
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.className = toast.className.replace("mostrar", "");
        }, 1500);

        // 4. Limpa o backup
        itemRemovidoTemp = null;
        indiceRemovidoTemp = null;
    }
}

// =================================================================
// 3. INICIALIZAÇÃO (CARREGA TUDO NA ORDEM CERTA)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. PRIMEIRO: Cria as abas e seções baseado no que existe no produtos.js
    inicializarLoja(); 

    // 2. SEGUNDO: Desenha os cards dentro das seções que acabamos de criar
    renderizarCatalogo();
    
    // 3. Inicia o filtro (começa misturado)
    filtrarColecao('todos');

    // 5. ATIVAR LIGHTBOX (ZOOM NA IMAGEM)
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
        resumoProdutos += `- ${item.quantidade}x ${item.nome} (${item.cor}) - ${formatarMoeda(item.precoTotalItem)}\n`;
        valorTotal += item.precoTotalItem;
    });
    
    // 4. Cria a mensagem final (ATUALIZADO COM O NOME DA LOJA)
    let mensagemCompleta = 
        `*NOVO PEDIDO - ${CONFIG.nomeLoja.toUpperCase()}*\n\n` +  // Usa o nome da config
        `👤 *Cliente:* ${nome}\n` + 
        `📱 *WhatsApp:* ${telefone}\n\n` + 
        `--------------------------------\n` +
        `*🛒 ITENS DO PEDIDO:*\n` + 
        resumoProdutos + 
        `\n💰 *TOTAL PRODUTOS: ${formatarMoeda(valorTotal)}*\n` + // Já usando a formatação nova
        `--------------------------------\n\n` +
        `${textoEndereco}\n\n` +
        `_Aguardo confirmação para pagamento._`;

    // 5. Envia (ATUALIZADO COM O TELEFONE DA CONFIG)
    const mensagemCodificada = encodeURIComponent(mensagemCompleta);
    
    // Aqui usamos o telefone que está lá no topo do arquivo
    const linkWhatsapp = `https://wa.me/${CONFIG.telefone}?text=${mensagemCodificada}`;
    
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

// =================================================================
// FUNCIONALIDADE: BUSCA POR TEXTO (SEARCH)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const campoBusca = document.getElementById('campo-busca');
    const msgSemResultados = document.getElementById('mensagem-sem-resultados');

    campoBusca.addEventListener('input', function() {
        const termo = this.value.toLowerCase().trim(); // Texto digitado (minúsculo)
        const todosCards = document.querySelectorAll('.brinco-card');
        let encontrouAlgum = false;

        // 1. Se começou a digitar, força o modo "Ver Tudo"
        // para procurar no site inteiro, não só na aba atual
        if (termo.length > 0) {
            filtrarColecao('todos');
            // Esconde o título "Todos os Brincos" para focar na busca
            const tituloTodos = document.getElementById('cabecalho-todos');
            if(tituloTodos) tituloTodos.classList.add('escondido');
        } else {
            // Se limpou a busca, mostra o título de volta
            const tituloTodos = document.getElementById('cabecalho-todos');
            if(tituloTodos) tituloTodos.classList.remove('escondido');
        }

        // 2. Passa por cada produto e decide se mostra ou esconde
        todosCards.forEach(card => {
            const nomeProduto = card.querySelector('h3').innerText.toLowerCase();
            
            if (nomeProduto.includes(termo)) {
                card.style.display = ''; // Volta ao padrão do CSS (flex)
                encontrouAlgum = true;
            } else {
                card.style.display = 'none'; // Esconde
            }
        });

        // 3. Mostra mensagem se não achou nada
        if (!encontrouAlgum && termo.length > 0) {
            msgSemResultados.classList.remove('escondido');
        } else {
            msgSemResultados.classList.add('escondido');
        }
    });
});

// =================================================================
// CORREÇÃO VISUAL: AJUSTE DO TOPO (HEADER)
// =================================================================

function ajustarTopoBody() {
    const header = document.querySelector('header');
    if (header) {
        // Pega a altura real do header e adiciona 20px de respiro
        const alturaHeader = header.offsetHeight;
        document.body.style.paddingTop = (alturaHeader + 20) + 'px';
        
        // Ajusta também a posição do carrinho lateral para não bater no header
        const carrinho = document.getElementById('carrinho-lateral');
        if (carrinho && window.innerWidth > 768) {
            carrinho.style.top = (alturaHeader + 20) + 'px';
            carrinho.style.height = `calc(100vh - ${alturaHeader + 20}px)`;
        }
    }
}

// Roda a função quando a página carrega
window.addEventListener('load', ajustarTopoBody);

// Roda de novo se a pessoa girar a tela ou redimensionar
window.addEventListener('resize', ajustarTopoBody);

// =================================================================
// ATUALIZAR RODAPÉ AUTOMATICAMENTE (CONFIG CENTRALIZADA)
// =================================================================
function atualizarLinksRodape() {
    // 1. Atualiza o Link do Instagram
    const btnInsta = document.getElementById('link-instagram');
    if (btnInsta) {
        btnInsta.href = `https://instagram.com/${CONFIG.instagram}`;
    }

    // 2. Atualiza o Link do WhatsApp do Rodapé
    const btnWhats = document.getElementById('link-whatsapp-footer');
    if (btnWhats) {
        // Cria um link que já abre com um "Oi"
        btnWhats.href = `https://wa.me/${CONFIG.telefone}?text=Olá! Vim pelo catálogo da ${encodeURIComponent(CONFIG.nomeLoja)}.`;
    }

    // 3. Atualiza o Copyright com o Ano Atual e Nome da Loja
    const txtCopy = document.getElementById('texto-copyright');
    if (txtCopy) {
        const anoAtual = new Date().getFullYear();
        txtCopy.innerHTML = `© ${anoAtual} ${CONFIG.nomeLoja}.`;
    }
}

// Adicione esta chamada dentro do evento 'DOMContentLoaded' que já existe
// Ou apenas adicione este ouvinte solto no final do arquivo:
document.addEventListener('DOMContentLoaded', atualizarLinksRodape);

// =================================================================
// BOTÃO VOLTAR AO TOPO (SCROLL) - VERSÃO SEGURA
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const botaoTopo = document.getElementById("btn-topo");

    if (botaoTopo) {
        // 1. Monitora a rolagem da tela
        window.addEventListener('scroll', () => {
            // Se rolou mais de 300px para baixo, mostra o botão
            if (window.scrollY > 300) {
                botaoTopo.classList.add("mostrar");
            } else {
                botaoTopo.classList.remove("mostrar");
            }
        });
    }
});

// 2. Ação de clicar para subir (Pode ficar fora pois é chamada pelo onclick do HTML)
function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// =================================================================
// FUNÇÕES DA PÁGINA DE DETALHES DO PRODUTO
// =================================================================

// ARQUIVO: script.js

function abrirProduto(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    if (!produto) return;

    // 1. Preenche textos básicos
    document.getElementById('detalhe-nome').innerText = produto.nome;
    document.getElementById('detalhe-preco').innerText = formatarMoeda(produto.preco);
    document.getElementById('detalhe-descricao').innerText = produto.descricao || "Sem descrição.";
    document.getElementById('detalhe-tamanho').innerText = produto.tamanho || "Único";
    document.getElementById('detalhe-categoria').innerText = NOMES_CATEGORIAS[produto.categoria] || produto.categoria;


    // 2. Preenche a Paleta de Bolinhas (ao lado da etiqueta da categoria)
    const divPaleta = document.getElementById('detalhe-paleta');
    
    // Se o produto for customizável (multiplas cores), usa a paleta da primeira cor como referência.
    // Se for cor única, usa a paleta da categoria (que é a cor única).
    const paletaPadrao = (produto.camposCor && produto.camposCor[0]) 
                            ? produto.camposCor[0].paleta 
                            : produto.categoria;
                            
    const listaCores = CORES_COLECAO[paletaPadrao];

    if (listaCores && listaCores.length > 0) {
        // Cria as bolinhas numeradas
        divPaleta.innerHTML = listaCores.map((corObj, index) => `
            <span class="cor-bolinha-numerada" 
                  style="background-color: ${corObj.hex};" 
                  title="${corObj.nome}">
                ${index + 1}
            </span>
        `).join('');
        divPaleta.style.display = 'flex';
    } else {
        divPaleta.innerHTML = '';
        divPaleta.style.display = 'none';
    }


    // 3. NOVO: Preenche os Controles de Cor (Múltiplos selects ou Select Único)
    const areaCompraDetalhe = document.querySelector('#tela-produto .area-compra-detalhe');
    const htmlControles = [];
    
    // 3A. Se tiver campos de cor customizados (Multiplas Cores):
    if (produto.camposCor && produto.camposCor.length > 0) {
        
        produto.camposCor.forEach(campo => {
            // Usa o ID único 'detalhe-miolo' ou 'detalhe-petalas'
            const opcoesHTML = gerarOpcoesCores(campo.paleta, campo.label);
            
            htmlControles.push(`
                <div style="margin-bottom: 15px;">
                    <label for="detalhe-${campo.id}">${campo.label}:</label>
                    <select id="detalhe-${campo.id}" style="width: 100%;" class="select-detalhe-cor">
                        ${opcoesHTML}
                    </select>
                </div>
            `);
        });
        
    } else {
        // 3B. Se for cor única (usa o select padrão antigo):
        // Usa o ID genérico 'detalhe-cor-unica'
        const opcoesHTML = gerarOpcoesCores(produto.categoria, 'Escolha a Cor');
        htmlControles.push(`
            <div style="margin-bottom: 15px;">
                <label for="detalhe-cor-unica">Escolha a Cor:</label>
                <select id="detalhe-cor-unica" style="width: 100%;" class="select-detalhe-cor">
                    ${opcoesHTML}
                </select>
            </div>
        `);
    }
    
    // Monta o HTML final com os campos de cor, QUANTIDADE e botão
    areaCompraDetalhe.innerHTML = `
        ${htmlControles.join('')}

        <div style="margin-bottom: 15px;">
            <label for="detalhe-qtd">Quantidade:</label>
            <input type="number" id="detalhe-qtd" value="1" min="1" class="input-quantidade" style="width: 100%;">
        </div>

        <button id="btn-add-detalhe" class="btn-comprar-grande">
            Adicionar ao Carrinho
        </button>
    `;
    
    // 4. Configura o Botão de Comprar Desta Tela
    // (Precisa ser reconfigurado porque trocamos o HTML interno da areaCompraDetalhe)
    const btnComprar = document.getElementById('btn-add-detalhe');
    
    // Remove eventos antigos clonando o botão
    const novoBtn = btnComprar.cloneNode(true);
    btnComprar.parentNode.replaceChild(novoBtn, btnComprar);
    
    // Adiciona o novo evento de compra. Passamos apenas o produto, pois a função
    // 'adicionarAoCarrinhoPelaTelaDetalhes' vai ler a cor/qtd diretamente da tela.
    novoBtn.addEventListener('click', () => {
        adicionarAoCarrinhoPelaTelaDetalhes(produto);
    });

    // 5. Imagens (código para carregar fotos extras)
    const imgPrincipal = document.getElementById('img-principal-detalhe');
    const divMiniaturas = document.getElementById('lista-miniaturas');
    imgPrincipal.src = produto.imagem;

    let todasFotos = [produto.imagem];
    if (produto.fotosExtras && produto.fotosExtras.length > 0) {
        todasFotos = todasFotos.concat(produto.fotosExtras);
    }
    // Garante que o container das miniaturas exista antes de preencher
    if(divMiniaturas) {
        divMiniaturas.innerHTML = todasFotos.map(fotoSrc => `
            <img src="${fotoSrc}" onclick="trocarFotoDetalhe(this.src)" class="${fotoSrc === produto.imagem ? 'ativa' : ''}">
        `).join('');
    }

    // 6. Abre a tela
    document.getElementById('tela-produto').classList.remove('escondido');
    document.body.style.overflow = 'hidden'; 
    
    // ⬇️ CORREÇÃO DEFINITIVA: FORÇA o display: none ⬇️
    const botaoTopo = document.getElementById("btn-topo");
    if (botaoTopo) {
        botaoTopo.style.display = 'none'; // Aplica o estilo inline mais forte
    }
}

function fecharTelaProduto() {
    document.getElementById('tela-produto').classList.add('escondido');
    document.body.style.overflow = ''; // Destrava a rolagem
    
    // ⬇️ REVERTE A CORREÇÃO: Remove o estilo display: none ⬇️
    const botaoTopo = document.getElementById("btn-topo");
    if (botaoTopo) {
        botaoTopo.style.display = ''; // Remove o estilo inline
        
        // E REVERTE A LÓGICA DE VISIBILIDADE (como estava antes)
        if (window.scrollY > 300) {
            botaoTopo.classList.add("mostrar");
        } else {
            botaoTopo.classList.remove("mostrar");
        }
    }
}

function trocarFotoDetalhe(src) {
    document.getElementById('img-principal-detalhe').src = src;
    
    // Atualiza borda da miniatura ativa
    document.querySelectorAll('.miniaturas img').forEach(img => {
        if(img.src.includes(src)) img.classList.add('ativa');
        else img.classList.remove('ativa');
    });
}

function adicionarAoCarrinhoPelaTelaDetalhes(produto) {
    const qtd = parseInt(document.getElementById('detalhe-qtd').value) || 1;
    let corSelecionada = ''; // Variável que vai para o carrinho

    // 1. Se o produto tem múltiplas cores (ex: Brinco Flor)
    if (produto.camposCor && produto.camposCor.length > 0) {
        let coresDetalhe = [];
        produto.camposCor.forEach(campo => {
            const selectElement = document.getElementById(`detalhe-${campo.id}`);
            // Formata: "Miolo: Azul / Pétalas: Verde"
            coresDetalhe.push(`${campo.label.split(' ')[0]}: ${selectElement.value}`);
        });
        corSelecionada = coresDetalhe.join(' / ');
    } else {
        // 2. Se o produto tem cor única (usa o select padrão)
        const selectElement = document.getElementById('detalhe-cor-unica');
        corSelecionada = selectElement ? selectElement.value : 'Padrão';
    }
    
    // 3. Cria o objeto e adiciona ao carrinho
    const novoItem = {
        nome: produto.nome,
        // O nome da cor agora pode ser "Miolo: Azul / Pétalas: Verde"
        cor: corSelecionada, 
        precoUnitario: produto.preco,
        quantidade: qtd,
        precoTotalItem: produto.preco * qtd
    };

    let itemExistente = carrinho.find(item => item.nome === novoItem.nome && item.cor === novoItem.cor);

    if (itemExistente) {
        itemExistente.quantidade += novoItem.quantidade;
        itemExistente.precoTotalItem = itemExistente.precoUnitario * itemExistente.quantidade;
    } else {
        carrinho.push(novoItem);
    }

    atualizarCarrinhoHTML();
    
    mostrarToast(`${produto.nome} adicionado!`);
    
    // ⬇️ NOVO COMPORTAMENTO: FECHAR A TELA APÓS ADICIONAR
    fecharTelaProduto(); // <--- Esta função já está definida (Linha 779)
}
