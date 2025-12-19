// ARQUIVO: produtos.js
// Este arquivo serve apenas como Banco de Dados dos produtos.

// Mapa para transformar o ID da categoria em um Nome Bonito na tela
const NOMES_CATEGORIAS = {
    'florescer': 'Coleção Florescer 2024',
    'classicos': '💍 Clássicos e Elegantes',
    'festas': '🥂 Linha Festas & Luxo', // Exemplo futuro
    'prata': '💎 Prata 925'            // Exemplo futuro
};

const CORES_COLECAO = {
    'florescer': [
        { nome: "Bordô", hex: "#670730" },
        { nome: "Vermelho", hex: "#bd0508" },
        { nome: "Terracota", hex: "#9e2519" },
        { nome: "Castanha", hex: "#be835e" },
        { nome: "Pêssego", hex: "#fbb4a6" },
        { nome: "Porcelana", hex: "#e2d7ce" },
        { nome: "Chiclete", hex: "#efa7cb" },
        { nome: "Canário", hex: "#fecb00" },
        { nome: "Azul BIC", hex: "#015eb9" },
        { nome: "Militar", hex: "#595b3d" }
    ],
    'classicos': [
        { nome: "Preto Onix", hex: "#000000" },
        { nome: "Prata Lunar", hex: "#C0C0C0" },
        { nome: "Off-White", hex: "#F5F5F5" }
    ],
    // Se uma categoria não tiver cores definidas aqui, o produto ficará como "Cor Única"
};

const produtos = [
    {
        id: 1,
        nome: "Brinco Flor Encantada",
        preco: 22.00,
        precoAnterior: 25.00,
        imagem: "imagens/florescer/f01_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "miolo", label: "Cor do Miolo", paleta: "florescer" },
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Encante-se com o Brinco Flor Encantada: uma peça elegante e delicada para trazer sofisticação ao seu visual.",
        tamanho: "3,5 cm",
        fotosExtras: [
            "imagens/florescer/f01_2.jpg"
        ]
    },
    {
        id: 2,
        nome: "Brinco Girassol",
        preco: 10.00,
        precoAnterior: 15.00,
        imagem: "imagens/florescer/f02_1.jpg",
        categoria: "florescer", 
        descricao: "Deixe a energia dos girassóis iluminar o seu dia com o Brinco Girassol, trazendo vividez e alegria.",
        tamanho: "2,4 cm",
        fotosExtras: [
            "imagens/florescer/f02_2.jpg"
        ]
    },
    {
        id: 3,
        nome: "Brinco Pétalas de Cristal",
        preco: 18.00,
        precoAnterior: 20.00,
        imagem: "imagens/florescer/f03_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor da Flor", paleta: "florescer" }
        ],
        descricao: "Encante-se com o Brinco Pétala de Cristal, delicado como cristal e perfeito para um brilho discreto em qualquer ocasião.",
        tamanho: "2,6 cm",
        fotosExtras: [
            "imagens/florescer/f03_2.jpg"
        ]
    },
    {
        id: 4,
        nome: "Brinco Flor Majestosa",
        preco: 25.00,
        precoAnterior: 28.00,
        imagem: "imagens/florescer/f04_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor da Flor", paleta: "florescer" }
        ],
        descricao: "Destaque-se com o Brinco Flor Majestosa, uma peça imponente e refinada para expressar confiança e estilo.",
        tamanho: "4,2 cm",
        fotosExtras: [
            "imagens/florescer/f04_2.jpg"
        ]
    },
    {
        id: 5,
        nome: "Brinco Flor Delicata",
        preco: 18.00,
        precoAnterior: 20.00,
        imagem: "imagens/florescer/f05_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor da Flor", paleta: "florescer" }
        ],
        descricao: "Descubra o Brinco Flor Delicata, um acessório suave e gracioso que traz delicadeza e beleza aos detalhes.",
        tamanho: "3,5 cm",
        fotosExtras: [
            "imagens/florescer/f05_2.jpg",
            "imagens/florescer/f05_3.jpg"
        ]
    },
    {
        id: 6,
        nome: "Brinco Flor Harmonia",
        preco: 20.00,
        precoAnterior: 22.00,
        imagem: "imagens/florescer/f06.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor da Flor", paleta: "florescer" }
        ],
        descricao: "Deixe sua beleza florescer com o Brinco Flor Harmonia, leve e natural, com pétalas vazadas que encantam.",
        tamanho: "3 cm"
    },
    {
        id: 7,
        nome: "Brinco Dupla Floral",
        preco: 10.00,
        precoAnterior: 15.00,
        imagem: "imagens/florescer/f07.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "flor1", label: "Cor da Flor Superior", paleta: "florescer" },
            { id: "flor2", label: "Cor da Flor Inferior", paleta: "florescer" }
        ],
        descricao: "Viva um visual inovador com o Brinco Dupla Floral, flores interligadas que criam um estilo ousado e moderno.",
        tamanho: "5 cm"
    },
    {
        id: 8,
        nome: "Brinco Flor Lumina",
        preco: 18.00,
        precoAnterior: 20.00,
        imagem: "imagens/florescer/f08.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "miolo", label: "Cor do Miolo", paleta: "florescer" },
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Experimente a elegância do Brinco Flor Lumina, com design delicado e artístico que ilumina seu look.",
        tamanho: "3,5 cm"
    },
    {
        id: 9,
        nome: "Brinco A Rosa",
        preco: 28.00,
        imagem: "imagens/florescer/f09.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Adicione um toque de romance ao seu visual com o Brinco A Rosa, ideal para trazer um charme ao seu look.",
        tamanho: "3,5cm"
    },
    {
        id: 10,
        nome: "Brinco O Cravo",
        preco: 35.00,
        imagem: "imagens/florescer/f10.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" },
            { id: "detalhes-borda", label: "Cor dos Detalhes da Borda", paleta: "florescer" }
        ],
        descricao: "O Brinco O Cravo destaca seu estilo com design marcante, versátil e moderno, para um look confiante e único.",
        tamanho: "4 cm"
    },
];