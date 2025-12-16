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
        imagem: "imagens/florescer/f01_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "miolo", label: "Cor do Miolo", paleta: "florescer" },
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Prepare-se para se apaixonar pelo nosso Brinco Flor Encantada! Esta peça exala elegância e fineza. Este brinco deslumbrante e irresistível é a escolha perfeita para adicionar um toque de sofisticação e beleza ao seu visual.",
        tamanho: "3,5 cm",
        fotosExtras: [
            "imagens/florescer/f01_2.jpg"
        ]
    },
    {
        id: 2,
        nome: "Brinco Girassol",
        preco: 10.00,
        imagem: "imagens/florescer/f02_1.jpg",
        categoria: "florescer", 
        descricao: "Deixe a energia radiante dos girassóis iluminarem o seu dia com nosso Brinco Girassol! Seu design vívido e vibrante é perfeito para adicionar um toque de sol e felicidade ao seu visual.",
        tamanho: "2,4 cm",
        fotosExtras: [
            "imagens/florescer/f02_2.jpg"
        ]
    },
    {
        id: 3,
        nome: "Brinco Pétalas de Cristal",
        preco: 18.00,
        imagem: "imagens/florescer/f03_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Encante-se com a beleza sutil do nosso Brinco Pétala de Cristal! Suas delicadas pétalas de crochê parecem ser feitas de cristal. É uma escolha perfeita para quem busca um toque de brilho e glamour discreto em qualquer ocasião.",
        tamanho: "2,6 cm",
        fotosExtras: [
            "imagens/florescer/f03_2.jpg"
        ]
    },
    {
        id: 4,
        nome: "Brinco Flor Majestosa",
        preco: 25.00,
        imagem: "imagens/florescer/f04_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Destaque-se com a grandiosidade do Brinco Flor Majestosa! Seu design imponente e refinado o tornam único. Aposte nesta peça para expressar sua confiança e estilo.",
        tamanho: "4,2 cm",
        fotosExtras: [
            "imagens/florescer/f04_2.jpg"
        ]
    },
    {
        id: 5,
        nome: "Brinco Flor Delicata",
        preco: 18.00,
        imagem: "imagens/florescer/f05_1.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Descubra o charme do nosso Brinco Flor Delicata! Este acessório suave e gracioso adiciona delicadeza a qualquer look. Perfeito para mulheres que valorizam a beleza nos detalhes.",
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
        imagem: "imagens/florescer/f06.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Deixe sua beleza florescer com o Brinco Flor Harmonia. Com suas pétalas vazadas, este brinco combina leveza e frescor, oferecendo um visual suave e natural que complementa qualquer estilo.",
        tamanho: "3 cm"
    },
    {
        id: 7,
        nome: "Brinco Dupla Floral",
        preco: 10.00,
        imagem: "imagens/florescer/f07.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "flor1", label: "Cor da Flor Superior", paleta: "florescer" },
            { id: "flor2", label: "Cor da Flor Inferior", paleta: "florescer" }
        ],
        descricao: "Viva a experiência de um visual inovador com o Brinco Dupla Floral. As flores interligadas criam um visual dinâmico e ousado, perfeito para quem quer ir além do convencional.",
        tamanho: "5 cm"
    },
    {
        id: 8,
        nome: "Brinco Flor Lumina",
        preco: 18.00,
        imagem: "imagens/florescer/f08.jpg",
        categoria: "florescer", 
        camposCor: [
            { id: "miolo", label: "Cor do Miolo", paleta: "florescer" },
            { id: "petalas", label: "Cor das Pétalas", paleta: "florescer" }
        ],
        descricao: "Experimente a elegância sutil com o Brinco Flor Lumina. Seus contornos delicados e o design inspirado em um esboço artístico trazem um toque de luminosidade e charme. Ideal para iluminar seu look com um toque sofisticado e único.",
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
        descricao: "Adicione um toque de romance ao seu visual com o Brinco A Rosa. Ideal para eventos especiais ou para destacar seu estilo no dia a dia, trazendo charme a qualquer look.",
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
        descricao: "O Brinco O Cravo destaca seu estilo. Seu design marcante oferece versatilidade e um toque vibrante e moderno a qualquer look, garantindo que você se sinta confiante e única.",
        tamanho: "4 cm"
    },
];