/* =========================================================
   PROJETO LOGIN — FASE 1 (SIMULAÇÃO, SEM BANCO DE DADOS)
   ---------------------------------------------------------
   Aqui o JavaScript:
   1. Valida os formulários (campos vazios, e-mail, senha).
   2. SIMULA o login com um usuário fixo.
   3. Guarda usuários "cadastrados" no localStorage do navegador.
   ========================================================= */

// ---------- Funções auxiliares ----------

function mostrarMensagem(texto, tipo) {
    const caixa = document.getElementById("mensagem");
    caixa.textContent = texto;
    caixa.className = "mensagem " + tipo; // "erro" ou "sucesso"
}

function emailValido(email) {
    // Expressão regular simples: algo@algo.algo
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function marcarInvalido(campo, invalido) {
    campo.classList.toggle("invalido", invalido);
}

// Botões "Mostrar / Ocultar" senha
document.querySelectorAll(".btn-mostrar").forEach(function (botao) {
    botao.addEventListener("click", function () {
        const campo = document.getElementById(botao.dataset.alvo);
        const escondida = campo.type === "password";
        campo.type = escondida ? "text" : "password";
        botao.textContent = escondida ? "Ocultar" : "Mostrar";
    });
});

// ---------- [FASE 2] Simulação de "banco de dados" ----------

const USUARIO_TESTE = { nome: "Aluno Teste", email: "aluno@escola.com", senha: "123456" };

function buscarUsuarios() {
    const salvos = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return [USUARIO_TESTE].concat(salvos);
}

// ---------- Página de LOGIN ----------

const formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function (evento) {
        evento.preventDefault(); // impede a página de recarregar

        const email = document.getElementById("email");
        const senha = document.getElementById("senha");

        marcarInvalido(email, !emailValido(email.value.trim()));
        marcarInvalido(senha, senha.value === "");

        if (!emailValido(email.value.trim()) || senha.value === "") {
            mostrarMensagem("Preencha um e-mail válido e a senha.", "erro");
            return;
        }

        // [FASE 2] Esta busca será feita pelo PHP no MySQL
        const usuario = buscarUsuarios().find(function (u) {
            return u.email === email.value.trim() && u.senha === senha.value;
        });

        if (usuario) {
            sessionStorage.setItem("usuarioLogado", usuario.nome);
            mostrarMensagem("Login realizado! Redirecionando...", "sucesso");
            setTimeout(function () { window.location.href = "painel.html"; }, 1000);
        } else {
            mostrarMensagem("E-mail ou senha incorretos.", "erro");
        }
    });
}

// ---------- Página de CADASTRO ----------

const formCadastro = document.getElementById("form-cadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const senha = document.getElementById("senha");
        const confirmar = document.getElementById("confirmar");

        // Validações
        if (nome.value.trim().length < 3) {
            marcarInvalido(nome, true);
            return mostrarMensagem("Informe seu nome (mínimo 3 letras).", "erro");
        }
        marcarInvalido(nome, false);

        if (!emailValido(email.value.trim())) {
            marcarInvalido(email, true);
            return mostrarMensagem("Informe um e-mail válido.", "erro");
        }
        marcarInvalido(email, false);

        if (senha.value.length < 6) {
            marcarInvalido(senha, true);
            return mostrarMensagem("A senha deve ter pelo menos 6 caracteres.", "erro");
        }
        marcarInvalido(senha, false);

        if (senha.value !== confirmar.value) {
            marcarInvalido(confirmar, true);
            return mostrarMensagem("As senhas não conferem.", "erro");
        }
        marcarInvalido(confirmar, false);

        // [FASE 2] Este cadastro será feito pelo PHP no MySQL
        const existe = buscarUsuarios().some(function (u) { return u.email === email.value.trim(); });
        if (existe) {
            return mostrarMensagem("Este e-mail já está cadastrado.", "erro");
        }

        const salvos = JSON.parse(localStorage.getItem("usuarios") || "[]");
        salvos.push({ nome: nome.value.trim(), email: email.value.trim(), senha: senha.value });
        localStorage.setItem("usuarios", JSON.stringify(salvos));

        mostrarMensagem("Cadastro realizado! Redirecionando para o login...", "sucesso");
        setTimeout(function () { window.location.href = "index.html"; }, 1500);
    });
}

// ---------- Página do PAINEL ----------

const nomeUsuario = document.getElementById("nome-usuario");

if (nomeUsuario) {
    const logado = sessionStorage.getItem("usuarioLogado");

    // Se ninguém fez login, volta para a tela de login
    if (!logado) {
        window.location.href = "index.html";
    } else {
        nomeUsuario.textContent = logado;
    }

    document.getElementById("btn-sair").addEventListener("click", function () {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
    });
}
