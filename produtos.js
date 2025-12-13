// ARQUIVO: produtos.js
// Este arquivo serve apenas como Banco de Dados dos produtos.

// Mapa para transformar o ID da categoria em um Nome Bonito na tela
const NOMES_CATEGORIAS = {
    'verao': '✨ Coleção Verão 2024',
    'classicos': '💍 Clássicos e Elegantes',
    'festas': '🥂 Linha Festas & Luxo', // Exemplo futuro
    'prata': '💎 Prata 925'            // Exemplo futuro
};

const CORES_COLECAO = {
    'verao': [
        { nome: "Dourado Solar", hex: "#FFD700" },
        { nome: "Laranja Pôr do Sol", hex: "#FF8C00" },
        { nome: "Turquesa Mar", hex: "#40E0D0" },
        { nome: "Rosa Hibisco", hex: "#FF69B4" }
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
        nome: "Brinco Lua Flor",
        preco: 45.00, // Preço ajustado para customizado
        imagem: "imagens/brinco-mar.jpg",
        categoria: "verao", 
        // NOVO: Define os campos de cor que o cliente deve escolher
        camposCor: [
            { id: "miolo", label: "Cor do Miolo", paleta: "verao" },
            { id: "petalas", label: "Cor das Pétalas", paleta: "verao" }
        ],
        descricao: "Brinco Flor customizável. Escolha a cor do miolo e das pétalas para criar seu estilo único.",
        tamanho: "5cm de diâmetro",
        // ... (fotosExtras)
    },
    // O Brinco Estrela (ID 2) continua usando o sistema antigo de cor única da coleção:
    {
        id: 2,
        nome: "Brinco Estrela",
        preco: 39.90,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "verao",
        // SEM o campo 'camposCor', ele usa o sistema padrão (Cor Única da Coleção)
        // ...
    },
    {
        id: 3,
        nome: "Argola Clássica",
        preco: 55.00,
        imagem: "imagens/brinco-mar.jpg",
        categoria: "verao", // Se quiser mudar a seção, mude aqui para "classicos"
        cores: ["Ouro 18k", "Prata 925"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 4,
        nome: "Brinco Gota",
        preco: 42.00,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "verao",
        cores: ["Azul", "Verde", "Vermelho"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 5,
        nome: "Brinco Pérola",
        preco: 60.00,
        imagem: "imagens/brinco-mar.jpg",
        categoria: "verao",
        cores: ["Branca", "Creme"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 6,
        nome: "Brinco Coração",
        preco: 25.00,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "verao",
        cores: ["Dourado", "Prateado"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 7,
        nome: "Brinco Ouro Puro",
        preco: 30.00,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "classicos",
        cores: ["Dourado", "Prateado"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 8,
        nome: "Brinco Jardim",
        preco: 45.00,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "classicos",
        cores: ["Dourado", "Prateado"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 9,
        nome: "Brinco Coral",
        preco: 90.00,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "prata",
        cores: ["Dourado", "Prateado"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    },
    {
        id: 10,
        nome: "Brinco Barco",
        preco: 80.00,
        imagem: "imagens/brinco-sol.jpg",
        categoria: "festas",
        cores: ["Dourado", "Prateado"],
        descricao: "Um brinco leve e radiante, banhado a ouro 18k. Perfeito para iluminar seu look de verão.",
        tamanho: "4.5cm de altura",
        fotosExtras: [
            "imagens/estrela_modelo.jpg", // Foto na orelha
            "imagens/estrela_detalhe.jpg" // Foto de perto
        ]
    }
];