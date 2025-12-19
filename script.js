// =================================================================
// CONFIGURAÇÕES GERAIS
// =================================================================
const CONFIG = {
    telefone: '5584996140526',    // SEU WHATSAPP AQUI (DDD + Número)
    nomeLoja: 'Melliê Crochês',
    instagram: 'melliecroches'
};

// Variável global para controle de produtos exibidos
let produtosAtuais = [];

// =================================================================
// 1. INICIALIZAÇÃO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa com todos os produtos
    produtosAtuais = [...produtos]; 
    
    inicializarSidebar();
    renderizarProdutos(produtosAtuais);
    atualizarContadorCarrinho();
});

// Preenche a barra lateral com as categorias
function inicializarSidebar() {
    const listaSidebar = document.getElementById('lista-categorias-sidebar');
    if (!listaSidebar) return;

    listaSidebar.innerHTML = ''; 

    // 1. Botão "Ver Tudo"
    const itemTudo = document.createElement('li');
    itemTudo.textContent = 'Ver Tudo';
    itemTudo.classList.add('ativo'); 
    itemTudo.onclick = () => {
        ativarItemSidebar(itemTudo);
        filtrarCategoria('tudo');
        fecharMenuMobile(); // Fecha o menu ao clicar (no celular)
    };
    listaSidebar.appendChild(itemTudo);

    // 2. Categorias Dinâmicas (baseado nos produtos)
    const categoriasUnicas = [...new Set(produtos.map(p => p.categoria))];

    categoriasUnicas.forEach(catId => {
        const li = document.createElement('li');
        
        // Tenta pegar nome bonito, senão usa o ID mesmo
        const nomeExibicao = (typeof NOMES_CATEGORIAS !== 'undefined' && NOMES_CATEGORIAS[catId]) 
                             ? NOMES_CATEGORIAS[catId] 
                             : catId.charAt(0).toUpperCase() + catId.slice(1);

        li.textContent = nomeExibicao;
        
        li.onclick = () => {
            ativarItemSidebar(li);
            filtrarCategoria(catId);
            fecharMenuMobile(); // Fecha o menu ao clicar
        };

        listaSidebar.appendChild(li);
    });
}

// Muda a cor do item selecionado na sidebar
function ativarItemSidebar(itemClicado) {
    const todosItens = document.querySelectorAll('#lista-categorias-sidebar li');
    todosItens.forEach(li => li.classList.remove('ativo'));
    itemClicado.classList.add('ativo');
}

// =================================================================
// 2. MENU MOBILE (ABRIR E FECHAR GAVETA)
// =================================================================

function abrirMenuMobile() {
    document.getElementById('sidebar-menu').classList.add('aberta');
    document.getElementById('overlay-menu').classList.add('ativo');
}

function fecharMenuMobile() {
    document.getElementById('sidebar-menu').classList.remove('aberta');
    document.getElementById('overlay-menu').classList.remove('ativo');
}

// =================================================================
// 3. LÓGICA DE FILTROS E BUSCA
// =================================================================

function filtrarCategoria(categoria) {
    const titulo = document.getElementById('titulo-categoria-atual');
    const inputBusca = document.getElementById('campo-busca');
    const containerPaleta = document.getElementById('sidebar-paleta-container');
    const divPaleta = document.getElementById('sidebar-paleta-cores');
    
    // Reseta campos
    inputBusca.value = '';
    document.getElementById('select-ordenacao').value = 'padrao';

    if (categoria === 'tudo') {
        titulo.textContent = 'Todas as Peças';
        produtosAtuais = [...produtos];
        containerPaleta.classList.add('escondido'); // Esconde paleta em "Ver Tudo"
    } else {
        const nomeCat = (typeof NOMES_CATEGORIAS !== 'undefined' && NOMES_CATEGORIAS[categoria]) 
                        ? NOMES_CATEGORIAS[categoria] : categoria;
        titulo.textContent = nomeCat;
        produtosAtuais = produtos.filter(p => p.categoria === categoria);

        // Mostra a paleta de cores na sidebar se a categoria tiver
        if (typeof CORES_COLECAO !== 'undefined' && CORES_COLECAO[categoria]) {
            divPaleta.innerHTML = ''; 
            CORES_COLECAO[categoria].forEach(cor => {
                const bolinha = document.createElement('div');
                bolinha.className = 'bolinha-cor';
                bolinha.style.backgroundColor = cor.hex;
                bolinha.title = cor.nome; 
                divPaleta.appendChild(bolinha);
            });
            containerPaleta.classList.remove('escondido');
        } else {
            containerPaleta.classList.add('escondido');
        }
    }

    renderizarProdutos(produtosAtuais);
}

// Busca por texto
document.getElementById('campo-busca').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const titulo = document.getElementById('titulo-categoria-atual');
    
    if (termo === '') {
        titulo.textContent = 'Todas as Peças';
        produtosAtuais = [...produtos];
    } else {
        titulo.textContent = `Buscando por: "${termo}"`;
        produtosAtuais = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    }
    
    renderizarProdutos(produtosAtuais);
});

// Ordenação (Menor Preço, Maior Preço)
function aplicarOrdenacao() {
    const tipo = document.getElementById('select-ordenacao').value;
    
    if (tipo === 'menor-preco') {
        produtosAtuais.sort((a, b) => a.preco - b.preco);
    } else if (tipo === 'maior-preco') {
        produtosAtuais.sort((a, b) => b.preco - a.preco);
    } else {
        // Ordenação padrão (por ID)
        produtosAtuais.sort((a, b) => a.id - b.id);
    }

    renderizarProdutos(produtosAtuais);
}

// Desenha os cards na tela
function renderizarProdutos(lista) {
    const container = document.getElementById('catalogo-principal');
    const msgErro = document.getElementById('mensagem-sem-resultados');
    const contador = document.getElementById('contador-produtos');
    
    container.innerHTML = '';

    if (contador) {
        contador.textContent = `${lista.length} produtos`;
    }

    if (lista.length === 0) {
        msgErro.classList.remove('escondido');
        return;
    } else {
        msgErro.classList.add('escondido');
    }

    lista.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Clique no card abre o modal de detalhes
        card.onclick = (e) => {
            if(e.target.tagName === 'BUTTON') return; 
            abrirModalProduto(produto);
        };

        // Lógica para mostrar o preço antigo e o selo de "Novo Preço"
        const temDesconto = produto.precoAnterior && produto.precoAnterior > produto.preco;
        
        const seloHTML = temDesconto ? `<div class="tag-desconto">Novo Preço</div>` : '';
        
        const precoHTML = temDesconto 
            ? `<span class="preco-antigo">${formatarMoeda(produto.precoAnterior)}</span> ${formatarMoeda(produto.preco)}`
            : formatarMoeda(produto.preco);

        card.innerHTML = `
            ${seloHTML}
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            <h3>${produto.nome}</h3>
            <span class="price">${precoHTML}</span>
            <button class="btn-ver-detalhes" onclick="abrirModalProdutoId(${produto.id})">Ver Detalhes</button>
        `;

        container.appendChild(card);
    });
}

// Helper para abrir modal pelo ID
function abrirModalProdutoId(id) {
    const prod = produtos.find(p => p.id === id);
    if(prod) abrirModalProduto(prod);
}

// =================================================================
// 4. CARRINHO E CHECKOUT
// =================================================================

let carrinho = JSON.parse(localStorage.getItem('carrinho_mellie')) || [];

function adicionarAoCarrinho() {
    if (!produtoAtualModal) return;

    let corSelecionada = 'Padrão';

    if (produtoAtualModal.camposCor && produtoAtualModal.camposCor.length > 0) {

        // Verifica se escolheu todas as cores
        for (const campo of produtoAtualModal.camposCor) {
            if (!coresSelecionadasModal[campo.label]) {
                alert(`⚠️ Selecione a cor de: ${campo.label}`);
                return;
            }
        }

        // Monta texto final
        corSelecionada = Object.entries(coresSelecionadasModal)
            .map(([parte, cor]) => `${parte}: ${cor}`)
            .join(' / ');
    }

    const qtd = parseInt(document.getElementById('qtd-selecionada').textContent);
    
    const item = {
        id: produtoAtualModal.id,
        nome: produtoAtualModal.nome,
        preco: produtoAtualModal.preco,
        imagem: produtoAtualModal.imagem,
        cor: corSelecionada,
        qtd: qtd
    };

    // Verifica se já tem esse item igual no carrinho
    const existente = carrinho.find(i => i.id === item.id && i.cor === item.cor);
    if (existente) {
        existente.qtd += qtd;
    } else {
        carrinho.push(item);
    }

    salvarCarrinho();
    mostrarToast("Item adicionado à sacola!");
    fecharModalProduto();
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const count = carrinho.reduce((total, item) => total + item.qtd, 0);
    document.getElementById('contador-carrinho').textContent = count;
}

function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    abrirModalCheckout(); 
    atualizarContadorCarrinho();
}

function abrirModalCheckout() {
    const modal = document.getElementById('modal-checkout');
    const lista = document.getElementById('lista-itens-carrinho');
    const totalEl = document.getElementById('valor-total-carrinho');
    const btnLimpar = document.getElementById('btn-limpar-tudo');
    
    lista.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding: 30px;">
                <p style="font-size: 2.5rem;">🛍️</p>
                <p style="color:#888;">Sua sacola está vazia.</p>
                <button onclick="fecharModalCheckout()" style="margin-top:15px; background:none; text-decoration:underline; cursor:pointer;">Continuar comprando</button>
            </div>
        `;
        if(btnLimpar) btnLimpar.style.display = 'none'; 
    } else {
        if(btnLimpar) btnLimpar.style.display = 'block'; 

        carrinho.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item-carrinho';
            div.innerHTML = `
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <span>${item.cor} • Qtd: ${item.qtd}</span>
                </div>
                <div style="display:flex; align-items:center;">
                    <span class="item-total">${formatarMoeda(item.preco * item.qtd)}</span>
                    <button class="btn-remover" onclick="removerDoCarrinho(${index})" style="color:#ff6b6b; border:none; background:none; font-size:1.2rem; margin-left:10px; cursor:pointer;">&times;</button>
                </div>
            `;
            lista.appendChild(div);
            total += item.preco * item.qtd;
        });
    }

    totalEl.textContent = formatarMoeda(total);
    modal.style.display = 'flex';
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    abrirModalCheckout(); 
    atualizarContadorCarrinho();
}

// =================================================================
// 5. MODAL DE PRODUTO COMPLETO
// =================================================================
let produtoAtualModal = null;
let coresSelecionadasModal = {};

function abrirModalProduto(produto) {
    coresSelecionadasModal = {};
    produtoAtualModal = produto;
    const modal = document.getElementById('modal-produto');
    const imgPrincipal = document.getElementById('modal-img');
    const galeriaContainer = document.getElementById('galeria-miniaturas');
    
    // 1. Imagem Principal
    imgPrincipal.src = produto.imagem;
    imgPrincipal.onclick = () => abrirLightbox(imgPrincipal.src);

    // 2. Galeria de Miniaturas
    galeriaContainer.innerHTML = ''; 
    let listaImagens = [produto.imagem];
    if (produto.fotosExtras && produto.fotosExtras.length > 0) {
        listaImagens = listaImagens.concat(produto.fotosExtras);
    }
    // Remove duplicatas
    listaImagens = [...new Set(listaImagens)];

    if (listaImagens.length > 1) { 
        listaImagens.forEach((fotoSrc) => {
            const thumb = document.createElement('img');
            thumb.src = fotoSrc;
            if (fotoSrc === imgPrincipal.src) thumb.classList.add('ativa');
            
            thumb.onclick = () => {
                imgPrincipal.src = fotoSrc;
                imgPrincipal.onclick = () => abrirLightbox(fotoSrc); 
                
                // Atualiza borda ativa
                document.querySelectorAll('.galeria img').forEach(img => img.classList.remove('ativa'));
                thumb.classList.add('ativa');
            };
            galeriaContainer.appendChild(thumb);
        });
    }

    // 3. Informações
    document.getElementById('modal-titulo').textContent = produto.nome;
    document.getElementById('modal-desc').textContent = produto.descricao || "Peça artesanal exclusiva.";
    
    const precoElemento = document.getElementById('modal-preco');
    if (produto.precoAnterior) {
        // Se houver preço anterior, mostra o antigo riscado + o novo
        precoElemento.innerHTML = `
            <span class="preco-antigo">${formatarMoeda(produto.precoAnterior)}</span>
            <span style="color: #d88ea3;">${formatarMoeda(produto.preco)}</span>
        `;
    } else {
        // Se não houver, mostra apenas o preço normal
        precoElemento.textContent = formatarMoeda(produto.preco);
    }

    document.getElementById('modal-tamanho').textContent = produto.tamanho ? `Tamanho aprox: ${produto.tamanho}` : '';
    document.getElementById('qtd-selecionada').textContent = '1';

    // 4. Cores e Paleta
    const containerCores = document.getElementById('container-opcoes-cores');
    containerCores.innerHTML = '';

    if (produto.camposCor && produto.camposCor.length > 0) {

        // Texto de instrução
        const instrucao = document.createElement('p');
        instrucao.textContent = 'Selecione a(s) cor(es):';
        instrucao.style.fontSize = '0.85rem';
        instrucao.style.fontWeight = '600';
        instrucao.style.marginTop = '15px';
        instrucao.style.marginBottom = '5px';
        instrucao.style.color = '#555';
        containerCores.appendChild(instrucao);

        // Para cada parte do produto (miolo, pétalas...)
        produto.camposCor.forEach(campo => {

            // Bloco de uma parte
            const bloco = document.createElement('div');
            bloco.style.marginBottom = '14px';

            // Título (ex: Cor do Miolo)
            const titulo = document.createElement('label');
            titulo.textContent = campo.label;
            titulo.style.display = 'block';
            titulo.style.fontSize = '0.85rem';
            titulo.style.fontWeight = '600';
            titulo.style.marginBottom = '6px';
            bloco.appendChild(titulo);

            // Linha das bolinhas
            const linhaBolinhas = document.createElement('div');
            linhaBolinhas.className = 'preview-cores-modal';

            // Pega as cores da paleta certa
            const cores =
                (typeof CORES_COLECAO !== 'undefined' && CORES_COLECAO[campo.paleta])
                    ? CORES_COLECAO[campo.paleta]
                    : [];

            cores.forEach(cor => {
                const bolinha = document.createElement('div');
                bolinha.className = 'bolinha-cor';
                bolinha.style.backgroundColor = cor.hex;
                bolinha.title = cor.nome;

                bolinha.onclick = () => {

                    // Remove seleção só desse grupo
                    linhaBolinhas.querySelectorAll('.bolinha-cor')
                        .forEach(b => b.classList.remove('selecionada'));

                    // Marca a clicada
                    bolinha.classList.add('selecionada');

                    // Salva a escolha dessa parte
                    coresSelecionadasModal[campo.label] = cor.nome;
                };

                linhaBolinhas.appendChild(bolinha);
            });

            bloco.appendChild(linhaBolinhas);
            containerCores.appendChild(bloco);
        });
    }


    modal.style.display = 'flex';
}

function mudarQtd(delta) {
    const span = document.getElementById('qtd-selecionada');
    let atual = parseInt(span.textContent);
    atual += delta;
    if (atual < 1) atual = 1;
    span.textContent = atual;
}

// =================================================================
// 6. UTILITÁRIOS (WhatsApp, Toast, Lightbox)
// =================================================================

function alternarEntrega() {
    const tipo = document.querySelector('input[name="entrega"]:checked').value;
    const divEnvio = document.getElementById('info-envio');
    const divRetirada = document.getElementById('info-retirada');

    if (tipo === 'envio') {
        divEnvio.classList.remove('escondido');
        divRetirada.classList.add('escondido');
    } else {
        divEnvio.classList.add('escondido');
        divRetirada.classList.remove('escondido');
    }
}

function enviarPedidoWhatsapp() {
    if (carrinho.length === 0) return alert("Sua sacola está vazia!");

    let mensagem = `Olá! Gostaria de fazer um pedido na ${CONFIG.nomeLoja}:\n\n`;
    
    let total = 0;
    carrinho.forEach(item => {
        const subtotal = item.preco * item.qtd;
        mensagem += `▪ ${item.qtd}x ${item.nome}\n   Cor: ${item.cor}\n   Valor: ${formatarMoeda(subtotal)}\n`;
        total += subtotal;
    });

    mensagem += `\n*TOTAL: ${formatarMoeda(total)}*\n`;

    const tipoEntrega = document.querySelector('input[name="entrega"]:checked').value;
    if (tipoEntrega === 'retirada') {
        mensagem += `\n📦 Entrega: RETIRADA NA UFRN`;
    } else {
        const rua = document.getElementById('end-rua').value;
        const numero = document.getElementById('end-numero').value;
        const bairro = document.getElementById('end-bairro').value;
        const cidade = document.getElementById('end-cidade').value;

        if (!rua || !numero || !bairro || !cidade) return alert("Por favor, preencha o endereço de entrega.");
        
        mensagem += `\n📦 Entrega: ENVIO`;
        mensagem += `\n📍 Endereço: ${rua}, ${numero} - ${bairro}, ${cidade}`;
    }
    limparCarrinho();
    const link = `https://wa.me/${CONFIG.telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
}

function salvarCarrinho() {
    localStorage.setItem('carrinho_mellie', JSON.stringify(carrinho));
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'mostrar';
    // Remove a classe após 3s para sumir
    setTimeout(() => { toast.className = toast.className.replace('mostrar', ''); }, 3000);
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
    if (event.target.classList.contains('lightbox')) {
        fecharLightbox();
    }
}

function fecharModalProduto() { document.getElementById('modal-produto').style.display = 'none'; }
function fecharModalCheckout() { document.getElementById('modal-checkout').style.display = 'none'; }

function abrirLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('imagem-destaque');
    img.src = src;
    lb.style.display = 'flex';
}
function fecharLightbox() { document.getElementById('lightbox').style.display = 'none'; }
