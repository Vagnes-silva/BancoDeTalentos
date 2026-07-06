// ============================================================
// BANCO DE DADOS INICIAL (10 candidatos) - PÚBLICO
// ============================================================
const candidatosPublicos = [
    { id: 1, 
        nome: "Carlos Almeida", 
        telefone: "(11) 98765-4321", 
        email: "carlos.almeida@email.com", 
        endereco: "Rua das Flores", 
        numero: "123", cidade: "São Paulo", 
        estado: "SP", 
        experiencia: "5 anos como jardineiro em condomínios residenciais e áreas verdes.", 
        cargo: "jardineiro" 
    },

    { id: 2, 
        nome: "Mariana Costa", 
        telefone: "(21) 91234-5678", 
        email: "mariana.costa@email.com", 
        endereco: "Av. Atlântica", 
        numero: "456", 
        cidade: "Rio de Janeiro", 
        estado: "RJ", 
        experiencia: "8 anos atuando como diarista e organizadora de eventos.", 
        cargo: "diarista"
    },

    { id: 3, 
        nome: "Roberto Nunes", 
        telefone: "(31) 98877-6655", 
        email: "roberto.nunes@email.com", endereco: "Rua da Pintura", 
        numero: "789", 
        cidade: "Belo Horizonte", 
        estado: "MG", 
        experiencia: "10 anos de experiência em pintura residencial e industrial.",
        cargo: "pintor" 
    },

    { id: 4, 
        nome: "Fernanda Lima", 
        telefone: "(41) 99988-7766", 
        email: "fernanda.lima@email.com", endereco: "Rua dos Desenvolvedores", numero: "101", 
        cidade: "Curitiba", 
        estado: "PR", 
        experiencia: "6 anos com React, Vue.js e TypeScript. Front-end em e-commerces.", cargo: "desenvolvedor front-end" 
    },


    { id: 5, 
        nome: "André Souza", 
        telefone: "(51) 97766-5544", 
        email: "andre.souza@email.com", 
        endereco: "Av. Back-end", 
        numero: "202", 
        cidade: "Porto Alegre", 
        estado: "RS", 
        experiencia: "7 anos com Node.js, Python, bancos SQL e NoSQL. APIs RESTful.", 
        cargo: "desenvolvedor back-end" 
    },

    { id: 6, 
        nome: "Patrícia Mendes", 
        telefone: "(61) 95544-3322", 
        email: "patricia.mendes@email.com", endereco: "Quadra 3", 
        numero: "Conjunto 4", 
        cidade: "Brasília", 
        estado: "DF", 
        experiencia: "9 anos como fullstack, atuando com React, Node e banco de dados", cargo: "desenvolvedor fullstack" 
    },

    { id: 7, 
        nome: "Jorge Ferreira", 
        telefone: "(71) 98833-2211", 
        email: "jorge.ferreira@email.com", endereco: "Rua da Tinta", 
        numero: "555", 
        cidade: "Salvador", 
        estado: "BA", 
        experiencia: "12 anos em pintura automotiva e decoração de interiores.", cargo: "pintor" 
    },

    { id: 8, 
        nome: "Elaine Santos", 
        telefone: "(81) 97722-1100", email: "elaine.santos@email.com", 
        endereco: "Rua da Costura", 
        numero: "303", 
        cidade: "Recife", 
        estado: "PE", 
        experiencia: "15 anos como costureira, modelagem e alta costura.", 
        cargo: "costureira" 
    },

    { id: 9, 
        nome: "Ricardo Oliveira", 
        telefone: "(85) 96611-0099", 
        email: "ricardo.oliveira@email.com", endereco: "Rua do Verde", 
        numero: "707", 
        cidade: "Fortaleza", 
        estado: "CE", 
        experiencia: "4 anos em jardinagem e paisagismo, com certificação em botânica", 
        cargo: "jardineiro" 
    },

    { id: 10, 
        nome: "Tatiane Rocha", 
        telefone: "(92) 95500-8877", 
        email: "tatiane.rocha@email.com", endereco: "Rua dos Devs", 
        numero: "808", 
        cidade: "Manaus", 
        estado: "AM", 
        experiencia: "5 anos com Angular, Vue.js e TypeScript. Experiência em UX/UI.", 
        cargo: "desenvolvedor front-end" 
    }
];

// ============================================================
// GERENCIAMENTO DE USUÁRIOS
// ============================================================
const USERS_KEY = 'usuarios_db';
const SESSION_KEY = 'usuario_logado';
const CANDIDATOS_KEY = 'candidatos_geral';

function carregarUsuarios() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return {};
        }
    }
    return {};
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

function getUsuarioLogado() {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const usuarios = carregarUsuarios();
    return usuarios[email] ? email : null;
}

function setUsuarioLogado(email) {
    localStorage.setItem(SESSION_KEY, email);
}

function clearUsuarioLogado() {
    localStorage.removeItem(SESSION_KEY);
}

// ============================================================
// GERENCIAMENTO DE CANDIDATOS
// ============================================================
function carregarTodosCandidatos() {
    const stored = localStorage.getItem(CANDIDATOS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return JSON.parse(JSON.stringify(candidatosPublicos));
        }
    }
    salvarTodosCandidatos(candidatosPublicos);
    return JSON.parse(JSON.stringify(candidatosPublicos));
}

function salvarTodosCandidatos(lista) {
    localStorage.setItem(CANDIDATOS_KEY, JSON.stringify(lista));
}

function gerarNovoId(lista) {
    if (lista.length === 0) return 1;
    const ids = lista.map(c => c.id);
    return Math.max(...ids) + 1;
}

function buscarCandidatoPorEmail(email, lista) {
    if (!email) return null;
    return lista.find(function(c) { return c.email === email; }) || null;
}