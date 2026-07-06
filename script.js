// ============================================================
// FUNÇÕES PARA MOSTRAR/OCULTAR SENHA
// ============================================================
function toggleSenha() {
    var input = document.getElementById('loginSenha');
    var icone = document.getElementById('iconeOlho');
    if (input.type === 'password') {
        input.type = 'text';
        icone.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icone.className = 'fas fa-eye';
    }
}

function toggleConfirmSenha() {
    var input = document.getElementById('loginConfirmSenha');
    var icone = document.getElementById('iconeOlhoConfirm');
    if (input.type === 'password') {
        input.type = 'text';
        icone.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icone.className = 'fas fa-eye';
    }
}

// ============================================================
// DOM Elements
// ============================================================
const visitanteSection = document.getElementById('visitanteSection');
const cadastroSection = document.getElementById('cadastroSection');
const grid = document.getElementById('candidatesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultCount = document.getElementById('resultCount');

const formTitle = document.getElementById('formTitle');
const btnCancelarCadastro = document.getElementById('btnCancelarCadastro');
const btnCadastrar = document.getElementById('btnCadastrar');
const feedbackMsg = document.getElementById('feedbackMsg');

const nomeInput = document.getElementById('nome');
const telefoneInput = document.getElementById('telefone');
const emailInput = document.getElementById('email');
const enderecoInput = document.getElementById('endereco');
const numeroInput = document.getElementById('numero');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const experienciaInput = document.getElementById('experiencia');
const cargoInput = document.getElementById('cargo');

const headerUser = document.getElementById('headerUser');
const btnLoginHeader = document.getElementById('btnLoginHeader');
const btnLogout = document.getElementById('btnLogout');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalError = document.getElementById('modalError');
const modalSuccess = document.getElementById('modalSuccess');
const loginEmail = document.getElementById('loginEmail');
const loginSenha = document.getElementById('loginSenha');
const loginConfirmSenha = document.getElementById('loginConfirmSenha');
const confirmSenhaGroup = document.getElementById('confirmSenhaGroup');
const senhaGroup = document.getElementById('senhaGroup');
const btnModalAction = document.getElementById('btnModalAction');
const btnModalCancel = document.getElementById('btnModalCancel');
const toggleAuthMode = document.getElementById('toggleAuthMode');

let isLoginMode = true;
let usuarioAtual = null;
let listaCandidatos = [];
let candidatoDoUsuario = null;

// ============================================================
// FUNÇÃO PARA MOSTRAR FEEDBACK
// ============================================================
function mostrarFeedback(mensagem, tipo) {
    feedbackMsg.textContent = mensagem;
    feedbackMsg.className = 'feedback-msg ' + tipo;
}

// ============================================================
// FUNÇÃO PARA RENDERIZAR CANDIDATOS (APENAS PARA VISITANTES)
// ============================================================
function renderCandidates(lista, termo) {
    termo = termo || '';
    const termoLower = termo.trim().toLowerCase();
    let filtered = [];

    if (termoLower === '') {
        grid.innerHTML = `
            <div class="welcome-message">
                <div class="icon">🔎</div>
                <h2>Nenhum candidato exibido</h2>
                <p>Digite um termo no campo acima e clique em "Pesquisar" para encontrar profissionais.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.6;">Exemplo: jardineiro, front-end, São Paulo, Maria...</p>
                <p style="font-size: 0.85rem; margin-top: 0.8rem; opacity: 0.5;">💡 Para cadastrar novos candidatos, faça login ou crie uma conta.</p>
            </div>
        `;
        resultCount.textContent = '0 candidatos';
        return;
    }

    filtered = lista.filter(function(c) {
        const searchable = (c.nome + ' ' + c.telefone + ' ' + c.email + ' ' + c.endereco + ' ' + c.numero + ' ' + c.cidade + ' ' + c.estado + ' ' + c.experiencia + ' ' + c.cargo).toLowerCase();
        return searchable.includes(termoLower);
    });

    resultCount.textContent = filtered.length + ' candidato' + (filtered.length !== 1 ? 's' : '');

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-result">
                <div style="font-size:3rem;margin-bottom:0.5rem;">🙁</div>
                <h2 style="color:#0b2a4a;">Nenhum profissional encontrado</h2>
                <p style="font-size:1rem;opacity:0.8;">Não encontramos resultados para "<strong>${termo.trim()}</strong>"</p>
                <p style="font-size:0.85rem;margin-top:0.5rem;opacity:0.6;">Tente buscar por nome, cargo, cidade ou área de atuação</p>
            </div>
        `;
        return;
    }

    let html = '';
    for (var i = 0; i < filtered.length; i++) {
        var c = filtered[i];
        var iniciais = c.nome.split(' ').map(function(p) { return p[0]; }).join('').substring(0, 2).toUpperCase();
        var cargoDisplay = c.cargo.charAt(0).toUpperCase() + c.cargo.slice(1);
        var enderecoCompleto = c.endereco + ', ' + c.numero + ' - ' + c.cidade + '/' + c.estado;

        html += `
            <div class="candidate-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="candidate-name">${c.nome}</span>
                    <span style="background: #dce5f0; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #0b2a4a; font-size: 1.1rem;">${iniciais}</span>
                </div>
                <span class="candidate-role">${cargoDisplay}</span>
                
                <div class="candidate-detail"><strong>📞 Telefone</strong> <span>${c.telefone || 'Não informado'}</span></div>
                <div class="candidate-detail"><strong>✉️ E-mail</strong> <span>${c.email || 'Não informado'}</span></div>
                <div class="candidate-detail"><strong>📍 Endereço</strong> <span>${enderecoCompleto || 'Não informado'}</span></div>
                <div class="candidate-detail" style="border-bottom: none; padding-bottom: 0;"><strong>💼 Experiência</strong> <span>${c.experiencia || 'Não informada'}</span></div>
                <span class="candidate-id">#${c.id} · ${cargoDisplay}</span>
            </div>
        `;
    }

    grid.innerHTML = html;
}

// ============================================================
// FUNÇÃO PARA CARREGAR DADOS DO USUÁRIO NO FORMULÁRIO
// ============================================================
function carregarDadosUsuarioNoForm() {
    if (candidatoDoUsuario) {
        formTitle.innerHTML = '<span>✏️</span> Editar meu cadastro';
        btnCadastrar.textContent = '💾 Atualizar';
        nomeInput.value = candidatoDoUsuario.nome || '';
        telefoneInput.value = candidatoDoUsuario.telefone || '';
        emailInput.value = candidatoDoUsuario.email || '';
        enderecoInput.value = candidatoDoUsuario.endereco || '';
        numeroInput.value = candidatoDoUsuario.numero || '';
        cidadeInput.value = candidatoDoUsuario.cidade || '';
        estadoInput.value = candidatoDoUsuario.estado || '';
        experienciaInput.value = candidatoDoUsuario.experiencia || '';
        cargoInput.value = candidatoDoUsuario.cargo || '';
    } else {
        formTitle.innerHTML = '<span>➕</span> Cadastrar novo candidato';
        btnCadastrar.textContent = '💾 Cadastrar';
        nomeInput.value = '';
        telefoneInput.value = '';
        emailInput.value = usuarioAtual || '';
        enderecoInput.value = '';
        numeroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';
        experienciaInput.value = '';
        cargoInput.value = '';
    }
    cadastroSection.className = 'cadastro-section visible';
}

// ============================================================
// FUNÇÃO PARA SALVAR CANDIDATO (CADASTRAR/ATUALIZAR)
// ============================================================
function salvarCandidato() {
    if (!usuarioAtual) {
        mostrarFeedback('❌ Faça login para cadastrar candidatos!', 'erro');
        return;
    }

    var nome = nomeInput.value.trim();
    var telefone = telefoneInput.value.trim();
    var email = emailInput.value.trim();
    var endereco = enderecoInput.value.trim();
    var numero = numeroInput.value.trim();
    var cidade = cidadeInput.value.trim();
    var estado = estadoInput.value;
    var cargo = cargoInput.value.trim();

    if (!nome) { mostrarFeedback('❌ O campo Nome é obrigatório!', 'erro');
        nomeInput.focus(); return; }
    if (!telefone) { mostrarFeedback('❌ O campo Telefone é obrigatório!', 'erro');
        telefoneInput.focus(); return; }
    if (!email) { mostrarFeedback('❌ O campo E-mail é obrigatório!', 'erro');
        emailInput.focus(); return; }
    if (!email.includes('@') || !email.includes('.')) {
        mostrarFeedback('❌ Digite um e-mail válido!', 'erro');
        emailInput.focus();
        return;
    }
    if (!endereco) { mostrarFeedback('❌ O campo Rua/Avenida é obrigatório!', 'erro');
        enderecoInput.focus(); return; }
    if (!numero) { mostrarFeedback('❌ O campo Número é obrigatório!', 'erro');
        numeroInput.focus(); return; }
    if (!cidade) { mostrarFeedback('❌ O campo Cidade é obrigatório!', 'erro');
        cidadeInput.focus(); return; }
    if (!estado) { mostrarFeedback('❌ Selecione um Estado!', 'erro');
        estadoInput.focus(); return; }
    if (!cargo) { mostrarFeedback('❌ O campo Cargo é obrigatório!', 'erro');
        cargoInput.focus(); return; }

    var index = listaCandidatos.findIndex(function(c) { return c.email === email; });

    if (index !== -1 && candidatoDoUsuario && candidatoDoUsuario.email === email) {
        // ATUALIZAÇÃO
        listaCandidatos[index].nome = nome;
        listaCandidatos[index].telefone = telefone;
        listaCandidatos[index].endereco = endereco;
        listaCandidatos[index].numero = numero;
        listaCandidatos[index].cidade = cidade;
        listaCandidatos[index].estado = estado;
        listaCandidatos[index].experiencia = experienciaInput.value.trim();
        listaCandidatos[index].cargo = cargo;
        salvarTodosCandidatos(listaCandidatos);
        candidatoDoUsuario = listaCandidatos[index];
        mostrarFeedback('✅ Cadastro atualizado com sucesso!', 'sucesso');
    } else if (index === -1) {
        // NOVO CADASTRO
        var novoCandidato = {
            id: gerarNovoId(listaCandidatos),
            nome: nome,
            telefone: telefone,
            email: email,
            endereco: endereco,
            numero: numero,
            cidade: cidade,
            estado: estado,
            experiencia: experienciaInput.value.trim(),
            cargo: cargo
        };
        listaCandidatos.push(novoCandidato);
        salvarTodosCandidatos(listaCandidatos);
        candidatoDoUsuario = novoCandidato;
        mostrarFeedback('✅ Cadastro realizado com sucesso! Clique em "Sair" para visualizar a pesquisa.', 'sucesso');
    } else {
        mostrarFeedback('❌ Este e-mail já está cadastrado por outro usuário!', 'erro');
        return;
    }

    // Mantém os dados no formulário - NÃO limpa mais
    carregarDadosUsuarioNoForm();
}

// ============================================================
// FUNÇÃO PARA ATUALIZAR INTERFACE
// ============================================================
function atualizarInterface(abrirCadastroAposLogin) {
    usuarioAtual = getUsuarioLogado();
    listaCandidatos = carregarTodosCandidatos();
    
    if (usuarioAtual) {
        // USUÁRIO LOGADO: Esconde pesquisa, mostra cadastro
        headerUser.textContent = '👤 ' + usuarioAtual;
        btnLoginHeader.style.display = 'none';
        btnLogout.style.display = 'inline-block';
        
        visitanteSection.classList.add('hidden');
        
        candidatoDoUsuario = buscarCandidatoPorEmail(usuarioAtual, listaCandidatos);
        
        // Sempre carrega os dados (se existir) ou mostra formulário vazio
        carregarDadosUsuarioNoForm();
        
    } else {
        // VISITANTE: Mostra pesquisa com mensagem inicial
        headerUser.textContent = '';
        btnLoginHeader.style.display = 'inline-block';
        btnLogout.style.display = 'none';
        candidatoDoUsuario = null;
        
        visitanteSection.classList.remove('hidden');
        cadastroSection.className = 'cadastro-section';
        
        // Limpa a busca e mostra mensagem inicial
        searchInput.value = '';
        renderCandidates(listaCandidatos, '');
    }
}

// ============================================================
// FUNÇÕES DE PESQUISA
// ============================================================
function performSearch() {
    var term = searchInput.value;
    renderCandidates(listaCandidatos, term);
}

function clearFilter() {
    searchInput.value = '';
    renderCandidates(listaCandidatos, '');
    searchInput.focus();
}

// ============================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================
function abrirModal(mode) {
    isLoginMode = (mode === 'login');
    modalOverlay.className = 'modal-overlay active';
    document.body.style.overflow = 'hidden';

    if (isLoginMode) {
        modalTitle.textContent = 'Login';
        modalSubtitle.textContent = 'Entre com suas credenciais para acessar o sistema';
        btnModalAction.textContent = 'Entrar';
        toggleAuthMode.textContent = 'Não tem conta? Cadastre-se';
        confirmSenhaGroup.style.display = 'none';
        senhaGroup.style.display = 'block';
        loginConfirmSenha.value = '';
    } else {
        modalTitle.textContent = 'Cadastro';
        modalSubtitle.textContent = 'Crie sua conta para começar a gerenciar candidatos';
        btnModalAction.textContent = 'Cadastrar';
        toggleAuthMode.textContent = 'Já tem conta? Faça login';
        confirmSenhaGroup.style.display = 'block';
        senhaGroup.style.display = 'block';
    }

    modalError.className = 'error-msg';
    modalError.textContent = '';
    modalSuccess.className = 'success-msg';
    modalSuccess.textContent = '';
    loginEmail.value = '';
    loginSenha.value = '';
    loginConfirmSenha.value = '';
    setTimeout(function() { loginEmail.focus(); }, 100);
}

function fecharModal() {
    modalOverlay.className = 'modal-overlay';
    document.body.style.overflow = '';
}

function handleAuth() {
    var email = loginEmail.value.trim();
    var senha = loginSenha.value;
    var confirmSenha = loginConfirmSenha.value;
    var usuarios = carregarUsuarios();

    modalError.className = 'error-msg';
    modalError.textContent = '';
    modalSuccess.className = 'success-msg';
    modalSuccess.textContent = '';

    if (!email || !senha) {
        modalError.textContent = 'Preencha todos os campos!';
        modalError.className = 'error-msg show';
        return;
    }

    if (isLoginMode) {
        if (!usuarios[email]) {
            modalError.textContent = 'Usuário não encontrado! Cadastre-se primeiro.';
            modalError.className = 'error-msg show';
            return;
        }
        if (usuarios[email] !== senha) {
            modalError.textContent = 'Senha incorreta! Tente novamente.';
            modalError.className = 'error-msg show';
            return;
        }
        setUsuarioLogado(email);
        fecharModal();
        atualizarInterface(false);
        modalSuccess.textContent = 'Login realizado com sucesso! Seus dados estão carregados.';
        modalSuccess.className = 'success-msg show';
        setTimeout(function() {
            modalSuccess.className = 'success-msg';
        }, 3000);
    } else {
        if (usuarios[email]) {
            modalError.textContent = 'Este e-mail já está cadastrado! Faça login.';
            modalError.className = 'error-msg show';
            return;
        }
        if (senha !== confirmSenha) {
            modalError.textContent = 'As senhas não coincidem!';
            modalError.className = 'error-msg show';
            return;
        }
        if (senha.length < 4) {
            modalError.textContent = 'A senha deve ter pelo menos 4 caracteres!';
            modalError.className = 'error-msg show';
            return;
        }
        usuarios[email] = senha;
        salvarUsuarios(usuarios);
        setUsuarioLogado(email);
        fecharModal();
        atualizarInterface(true);
        modalSuccess.textContent = 'Cadastro realizado com sucesso! Preencha os dados do seu candidato.';
        modalSuccess.className = 'success-msg show';
        setTimeout(function() {
            modalSuccess.className = 'success-msg';
        }, 3000);
    }
}

function logout() {
    if (confirm('Deseja realmente sair?')) {
        clearUsuarioLogado();
        usuarioAtual = null;
        candidatoDoUsuario = null;
        listaCandidatos = carregarTodosCandidatos();
        
        headerUser.textContent = '';
        btnLoginHeader.style.display = 'inline-block';
        btnLogout.style.display = 'none';
        
        visitanteSection.classList.remove('hidden');
        cadastroSection.className = 'cadastro-section';
        
        // Limpa o feedback
        feedbackMsg.textContent = '';
        feedbackMsg.className = 'feedback-msg';
        
        searchInput.value = '';
        renderCandidates(listaCandidatos, '');
        mostrarFeedback('Você saiu da sua conta. Agora pode pesquisar todos os candidatos.', 'sucesso');
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
btnLoginHeader.addEventListener('click', function() { abrirModal('login'); });
btnLogout.addEventListener('click', logout);

btnModalAction.addEventListener('click', handleAuth);
btnModalCancel.addEventListener('click', fecharModal);
toggleAuthMode.addEventListener('click', function() {
    abrirModal(isLoginMode ? 'cadastro' : 'login');
});

modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) fecharModal();
});

loginEmail.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        loginSenha.focus();
    }
});
loginSenha.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!isLoginMode) {
            loginConfirmSenha.focus();
        } else {
            handleAuth();
        }
    }
});
loginConfirmSenha.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleAuth();
    }
});

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
    }
});
clearBtn.addEventListener('click', clearFilter);

btnCancelarCadastro.addEventListener('click', function() {
    cadastroSection.className = 'cadastro-section';
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback-msg';
});
btnCadastrar.addEventListener('click', salvarCandidato);

// Event listener para os botões de mostrar/ocultar senha
document.getElementById('toggleSenha').addEventListener('click', toggleSenha);
document.getElementById('toggleConfirmSenha').addEventListener('click', toggleConfirmSenha);

var formInputs = document.querySelectorAll('#cadastroSection input, #cadastroSection textarea, #cadastroSection select');
for (var k = 0; k < formInputs.length; k++) {
    formInputs[k].addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            salvarCandidato();
        }
    });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
window.addEventListener('load', function() {
    // Garantir que ninguém fique logado ao carregar a página
    clearUsuarioLogado();
    usuarioAtual = null;
    candidatoDoUsuario = null;
    listaCandidatos = carregarTodosCandidatos();
    
    // Visitante: mostrar pesquisa e mensagem inicial (sem candidatos)
    visitanteSection.classList.remove('hidden');
    cadastroSection.className = 'cadastro-section';
    
    headerUser.textContent = '';
    btnLoginHeader.style.display = 'inline-block';
    btnLogout.style.display = 'none';
    
    // Mostra a mensagem "Nenhum candidato exibido"
    renderCandidates(listaCandidatos, '');
});