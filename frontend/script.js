// Login
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
      } else {
        alert("Login inválido");
      }
    });
}
// Sistema de permissões e restrições
function verificarAcessoAdmin() {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) return; 

    const user = JSON.parse(userStr);
    const urlAtual = window.location.pathname.toLowerCase();
    const tipoUsuario = user.tipo.toLowerCase(); 

    const paginasExclusivasAdmin = [
        "listausuarios", 
        "cadastrarusuario", 
        "editarusuario"
    ];

    const paginasBloqueadasResponsavel = [
        "listaalunos",
        "cadastraraluno",
        "editaraluno",
        "cadastraraviso",
        "registrareventos"
    ];

    const bloqueioAdmin = paginasExclusivasAdmin.some(pagina => urlAtual.includes(pagina));
    
    if (bloqueioAdmin) {
        if (tipoUsuario !== "admin" && tipoUsuario !== "administrador") {
            window.location.href = "acessoNegado.html";
            return; 
        }
    }

    const bloqueioResponsavel = paginasBloqueadasResponsavel.some(pagina => urlAtual.includes(pagina));
    
    if (bloqueioResponsavel) {
        if (tipoUsuario === "responsável" || tipoUsuario === "responsavel") {
            window.location.href = "acessoNegado.html";
        }
    }
}

// Função para carregar o nome do usuário no Dashboard
function carregarBoasVindas() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return; 

    const user = JSON.parse(userStr);
    const titulo = document.getElementById("mensagemBoasVindas");
    
    if (titulo) {
        const primeiroNome = user.nome.split(" ")[0]; 
        titulo.innerText = `Bem-vindo(a), ${primeiroNome}!`;
    }
}

function toggleVisibilidadeSenha() {
  const inputSenha = document.getElementById("usuarioSenha");
  const btnToggle = document.getElementById("btnToggleSenha");
  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnToggle.innerText = "🔒";
  } else {
    inputSenha.type = "password";
    btnToggle.innerText = "👁️";
  }
}

const SENHAS_COMUNS_FRONT = ["12345678", "123456789", "password", "senha123", "admin123", "123456", "qwertyui", "mudar123", "senha", "abcdefgh"];

function validarForcaSenha() {
  const senha = document.getElementById("usuarioSenha").value;
  const btnSalvar = document.getElementById("btnSalvar");
  const barraForca = document.getElementById("barraForca");
  const labelForca = document.getElementById("labelForca");

  // Regras
  const temTamanho = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  const naoComum = !SENHAS_COMUNS_FRONT.includes(senha.toLowerCase());

  // Atualizar Checklist UI
  atualizarItemChecklist("req-tamanho", temTamanho, "Mínimo de 8 caracteres (12+ ideal)");
  atualizarItemChecklist("req-maiuscula", temMaiuscula, "Pelo menos 1 letra maiúscula");
  atualizarItemChecklist("req-minuscula", temMinuscula, "Pelo menos 1 letra minúscula");
  atualizarItemChecklist("req-numero", temNumero, "Pelo menos 1 número");
  atualizarItemChecklist("req-especial", temEspecial, "Pelo menos 1 caractere especial (!@#$%^&*)");
  atualizarItemChecklist("req-comum", naoComum, "Não pode ser senha comum/vazada");

  // Cálculo de Força
  let pontuacao = 0;
  if (senha.length >= 12) pontuacao += 2;
  else if (temTamanho) pontuacao += 1;
  if (temMaiuscula) pontuacao += 1;
  if (temMinuscula) pontuacao += 1;
  if (temNumero) pontuacao += 1;
  if (temEspecial) pontuacao += 2;

  let percentual = Math.min(100, (pontuacao / 7) * 100);
  barraForca.style.width = percentual + "%";

  if (percentual < 40) {
    barraForca.className = "progress-bar bg-danger";
    labelForca.innerText = "Fraca";
    labelForca.className = "text-danger";
  } else if (percentual < 80) {
    barraForca.className = "progress-bar bg-warning";
    labelForca.innerText = "Média";
    labelForca.className = "text-warning";
  } else {
    barraForca.className = "progress-bar bg-success";
    labelForca.innerText = "Forte";
    labelForca.className = "text-success";
  }

  // Habilitar ou desabilitar botão de envio
  const valido = temTamanho && temMaiuscula && temMinuscula && temNumero && temEspecial && naoComum;
  if (valido) {
    btnSalvar.removeAttribute("disabled");
  } else {
    btnSalvar.setAttribute("disabled", "true");
  }
}

function atualizarItemChecklist(elementId, condicao, texto) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (condicao) {
    el.innerHTML = `✅ ${texto}`;
    el.className = "text-success fw-bold";
  } else {
    el.innerHTML = `❌ ${texto}`;
    el.className = "text-danger";
  }
}

// Cadastro de usuarios
function cadastrarUsuario() {
  const nome = document.getElementById("usuarioNome").value
  const email = document.getElementById("usuarioEmail").value
  const senha = document.getElementById("usuarioSenha").value
  const tipo = document.getElementById("usuarioTipo").value

  if (!nome || !email || !senha || !tipo) {
    alert("Por favor, preencha todos os campos do usuário!");
    return;
  }

  if (!email.includes("@")) {
    alert("Por favor, insira um e-mail válido!");
    return;
  }

  fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, tipo })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao cadastrar usuário");
      }
      return data;
    })
    .then(data => {
      alert(data.message);
      document.getElementById("usuarioNome").value = "";
      document.getElementById("usuarioEmail").value = "";
      document.getElementById("usuarioSenha").value = "";
      document.getElementById("btnSalvar").setAttribute("disabled", "true");
      validarForcaSenha();
    })
    .catch(err => {
      alert("Erro: " + err.message);
    })
}


// Cadastro de alunos
function cadastrarAluno() {
  const nome = document.getElementById("alunoNome").value;
  const data_nascimento = document.getElementById("alunoData").value;
  const turma = document.getElementById("alunoTurma").value;

  const selectResponsavel = document.getElementById("alunoResponsavel");
  const responsavel_id = selectResponsavel.value;
  const consentimentoCheckbox = document.getElementById("alunoConsentimento");
  const consentimento_parental = consentimentoCheckbox ? consentimentoCheckbox.checked : false;

  if (!nome || !data_nascimento || !turma || !responsavel_id) {
    alert("Erro: Todos os campos do aluno são obrigatórios!");
    return;
  }

  if (!consentimento_parental) {
    alert("Erro LGPD: É obrigatório obter o consentimento explícito do responsável legal antes de coletar os dados da criança!");
    return;
  }

  const responsavel_nome = selectResponsavel.options[selectResponsavel.selectedIndex].text;

  fetch("http://localhost:3000/api/alunos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      data_nascimento,
      turma,
      responsavel: responsavel_nome,
      responsavel_id: responsavel_id,
      consentimento_parental: true
    })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro no servidor");
      return data;
    })
    .then(data => {
      alert(data.message);
      window.location.href = "listaAlunos.html";
    })
    .catch(err => {
      console.error("Erro na requisição:", err);
      alert(err.message);
    });
}

// Carregar Usuarios
function carregarUsuarios() {
  fetch("http://localhost:3000/api/users")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("listaUsuarios");
      if (lista) lista.innerHTML = "";

      data.forEach(usuario => {
        if (lista) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
         <td class="align-middle">${usuario.nome}</td>
        <td class="align-middle">${usuario.email}</td>
        <td class="align-middle">********</td>
        <td class="align-middle">${usuario.tipo}</td>
        <td class="text-center">
            <div class="d-flex justify-content-center">
                <button class="btn btn-sm btn-acao btn-editar me-2" 
                        onclick="editarUsuario(${usuario.id})">
                    Editar
                </button>
                
                <button class="btn btn-sm btn-acao btn-excluir" 
                        onclick="excluirUsuario(${usuario.id}, '${usuario.nome}')">
                    Excluir
                </button>
            </div>
        </td>`;
          lista.appendChild(tr);
        }
      });
    })
    .catch(err => console.error("Erro ao carregar usuarios:", err));
}

// Excluir Usuario
function excluirUsuario(id, nome) {
  if (confirm(`Tem certeza que deseja excluir o usuário ${nome}?`)) {

    fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir no servidor");
        return res.json();
      })
      .then(data => {
        alert(data.message || "Usuário excluído com sucesso!");

        carregarUsuarios();
      })
      .catch(err => {
        console.error("Erro:", err);
        alert("Não foi possível excluir o usuario. Verifique a conexão com a API.");
      });
  }
}

function editarUsuario(id) {
  window.location.href = `editarUsuario.html?id=${id}`;
}

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (userId && document.getElementById("editUserNome")) {
  window.onload = function () {
    buscarDadosDoUsuario(userId);
  };
}


function buscarDadosDoUsuario(id) {
  fetch(`http://localhost:3000/api/users/${id}`)
    .then(res => res.json())
    .then(usuario => {
      const dados = Array.isArray(usuario) ? usuario[0] : usuario;

      document.getElementById("editUserId").value = dados.id;
      document.getElementById("editUserNome").value = dados.nome;
      document.getElementById("editUserEmail").value = dados.email;
      document.getElementById("editUserTipo").value = dados.tipo;
    })
    .catch(err => console.error("Erro ao buscar usuário:", err));
}

function salvarEdicaoUsuario() {
  const id = document.getElementById("editUserId").value;
  const nome = document.getElementById("editUserNome").value;
  const email = document.getElementById("editUserEmail").value;
  const tipo = document.getElementById("editUserTipo").value;
  const senha = document.getElementById("editUserSenha").value;

  const dadosAtualizados = { nome, email, tipo };
  if (senha) dadosAtualizados.senha = senha;

  fetch(`http://localhost:3000/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados)
  })
    .then(res => res.json())
    .then(data => {
      alert("Usuário atualizado com sucesso!");
      window.location.href = "listaUsuarios.html";
    })
    .catch(err => alert("Erro ao atualizar dados."));
}


// Carregar Alunos
function carregarAlunos() {
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("listaAlunos");
      if (lista) lista.innerHTML = "";

      data.forEach(aluno => {
        if (lista) {
          const consentimentoBadge = aluno.consentimento_parental 
            ? `<span class="badge bg-success">Consentido (LGPD)</span>` 
            : `<span class="badge bg-warning text-dark">Pendente</span>`;
          const tr = document.createElement("tr");
          tr.innerHTML = `
        <td class="align-middle">${aluno.nome}</td>
        <td class="align-middle">${aluno.turma}</td>
        <td class="align-middle">${aluno.responsavel}</td>
        <td class="align-middle text-center">${consentimentoBadge}</td>
        <td class="text-center">
            <div class="d-flex justify-content-center">
                <button class="btn btn-sm btn-acao btn-editar me-2" 
                        onclick="editarAluno(${aluno.id})">
                    Editar
                </button>
                
                <button class="btn btn-sm btn-acao btn-excluir" 
                        onclick="excluirAluno(${aluno.id}, '${aluno.nome}')">
                    Excluir
                </button>
                 <button class="btn btn-sm btn-acao btn-historico" 
                        onclick="historicoAluno(${aluno.id}, '${aluno.nome}')">
                    Histórico
                </button>
            </div>
        </td>`;
          lista.appendChild(tr);
        }
      });
    })
    .catch(err => console.error("Erro ao carregar alunos:", err));
}

// Excluir Aluno
function excluirAluno(id, nome) {
  if (confirm(`Tem certeza que deseja excluir o aluno ${nome}?`)) {

    fetch(`http://localhost:3000/api/alunos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir no servidor");
        return res.json();
      })
      .then(data => {
        alert(data.message || "Aluno excluído com sucesso!");

        carregarAlunos();
      })
      .catch(err => {
        console.error("Erro:", err);
        alert("Não foi possível excluir o aluno. Verifique a conexão com a API.");
      });
  }
}

//Carrega os alunos na tela Eventos e Ocorrencias
function carregarAlunosEventos() {
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(alunos => {
      const select = document.getElementById("selectAlunosRegistrar");
      if (!select) return;

      select.innerHTML = '<option value="">Carregando alunos...</option>';

      alunos.forEach(aluno => {
        const option = document.createElement("option");
        option.value = aluno.id;
        option.innerText = aluno.nome;
        select.appendChild(option);
      });

      console.log("Alunos carregados:", alunos);
    })
    .catch(err => console.error("Erro ao carregar alunos:", err));
}

// Metodo para carregar os responsáveis na tela de cadastro de alunos
function carregarResponsaveis() {
  fetch("http://localhost:3000/api/users")
    .then(res => res.json())
    .then(usuarios => {
      const select = document.getElementById("alunoResponsavel");
      if (!select) return;

      select.innerHTML = '<option value="">Selecione um responsável</option>';

      const apenasResponsaveis = usuarios.filter(u => u.tipo.toLowerCase() === "responsável");

      apenasResponsaveis.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.id
        option.innerText = usuario.nome;
        select.appendChild(option);
      });

      console.log("Responsáveis carregados:", apenasResponsaveis);
    })
    .catch(err => console.error("Erro ao carregar responsáveis:", err));
}

function editarAluno(id) {
  window.location.href = `editarAluno.html?id=${id}`;
}

function buscarDadosDoAluno(id) {
  fetch(`http://localhost:3000/api/alunos/${id}`)
    .then(res => res.json())
    .then(aluno => {
      const dados = Array.isArray(aluno) ? aluno[0] : aluno;

      document.getElementById("editAlunoId").value = dados.id;
      document.getElementById("editAlunoNome").value = dados.nome;
      document.getElementById("editAlunoData").value = dados.data_nascimento;
      document.getElementById("editAlunoTurma").value = dados.turma;
      document.getElementById("editAlunoResponsavel").value = dados.responsavel;
    })
    .catch(err => console.error("Erro ao buscar aluno:", err));
}

function salvarEdicaoAluno() {
  const id = document.getElementById("editAlunoId").value;
  const nome = document.getElementById("editAlunoNome").value;
  const data_nascimento = document.getElementById("editAlunoData").value;
  const turma = document.getElementById("editAlunoTurma").value;
  const responsavel = document.getElementById("editAlunoResponsavel").value;

  const dadosAtualizados = { nome, data_nascimento, turma, responsavel };


  fetch(`http://localhost:3000/api/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados)
  })
    .then(res => res.json())
    .then(data => {
      alert("Usuário atualizado com sucesso!");
      window.location.href = "listaAluno.html";
    })
    .catch(err => alert("Erro ao atualizar dados."));
}


// Carregar alunos chat (Com filtro de Responsável)
function carregarAlunosChat() {
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("listaAlunosChat");
      const select = document.getElementById("selectAlunos");

      
      const user = JSON.parse(localStorage.getItem("user"));
      const isResponsavel = user.tipo.toLowerCase() === "responsável" || user.tipo.toLowerCase() === "responsavel";

      let alunosParaMostrar = data; 
      
      if (isResponsavel) {
         alunosParaMostrar = data.filter(aluno => aluno.responsavel_id == user.id || aluno.responsavel === user.nome);
      }
      
      if (lista) {
        lista.innerHTML = "";
        alunosParaMostrar.forEach(aluno => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td class="align-middle">${aluno.nome}</td>
              <td class="align-middle">${aluno.turma}</td>
              <td class="align-middle">${aluno.responsavel}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-acao btn-editar me-2" onclick="verChat(${aluno.id})">
                  Abrir Chat
                </button>
              </td>`;
          lista.appendChild(tr);
        });
      }

      if (select) {
        select.innerHTML = '<option value="">Selecione um aluno</option>';
        alunosParaMostrar.forEach(aluno => {
          const opt = document.createElement("option");
          opt.value = aluno.id;
          opt.innerText = aluno.nome;
          select.appendChild(opt);
        });
      }
    })
    .catch(err => console.error("Erro ao carregar alunos no chat:", err));
}


// Ocorrências 
function registrarOcorrencia() {
  const selectAluno = document.getElementById("selectAlunosRegistrar");
  const aluno_id = selectAluno.value; 
  const aluno_nome = selectAluno.options[selectAluno.selectedIndex].text; 
  const descricao = document.getElementById("descricaoEventos").value;
  const data_ocorrencia = new Date().toISOString().split('T')[0];

  if (!aluno_id || !descricao) {

    return alert("Preencha todos os campos!");

  }

  fetch("http://localhost:3000/api/ocorrencias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ aluno_id, descricao, data_ocorrencia, aluno: aluno_nome })
  }).then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("descricaoEventos").value = " ";
    })
    .catch(err => console.error("Error:", err));

}

//rotinas
function registrarRotina() {
    const selectAluno = document.getElementById("selectAlunosRegistrar");
    const aluno_id = selectAluno.value; 
    const aluno_nome = selectAluno.options[selectAluno.selectedIndex].text;     
    const descricao = document.getElementById("descricaoEventos").value;
    const data_registro = new Date().toISOString().split('T')[0];


  if (!aluno_id || !descricao) {

    return alert("Preencha todos os campos!");
  }


  fetch("http://localhost:3000/api/rotinas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ aluno_id, descricao, data_registro, aluno: aluno_nome })
  }).then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("descricaoEventos").value = " ";
    })
    .catch(err => console.error("Error:", err));

}

// Carregar Rotinas (Com filtro de Responsável)
function carregarEventosRotinas() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isResponsavel = user.tipo.toLowerCase() === "responsável" || user.tipo.toLowerCase() === "responsavel";
  
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(alunos => {
        
        const nomesDosFilhos = alunos
            .filter(a => a.responsavel_id == user.id || a.responsavel === user.nome)
            .map(a => a.nome);

        
        fetch("http://localhost:3000/api/rotinas")
            .then(res => res.json())
            .then(data => {
                const lista = document.getElementById("listaRotina");
                if (lista) lista.innerHTML = "";
                
                let rotinasParaMostrar = data;
                if (isResponsavel) {
                    rotinasParaMostrar = data.filter(rotina => nomesDosFilhos.includes(rotina.aluno));
                }

                rotinasParaMostrar.forEach(rotina => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td class="align-middle">${rotina.descricao}</td>
                        <td class="align-middle">${rotina.data_registro}</td>
                        <td class="align-middle">${rotina.aluno}</td>
                        <td class="align-middle text-green fw-bold">Rotina</td>`;      
                    lista.appendChild(tr);
                });
            });
    })
    .catch(err => console.error("Erro ao carregar rotinas:", err));
}

// Carregar Ocorrências (Com filtro de Responsável)
function carregarEventosOcorrencias() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isResponsavel = user.tipo.toLowerCase() === "responsável" || user.tipo.toLowerCase() === "responsavel";
  
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(alunos => {
        const nomesDosFilhos = alunos
            .filter(a => a.responsavel_id == user.id || a.responsavel === user.nome)
            .map(a => a.nome);

        fetch("http://localhost:3000/api/ocorrencias")
            .then(res => res.json())
            .then(data => {
                const lista = document.getElementById("listaOcorrencia");
                if (lista) lista.innerHTML = "";

                let ocorrenciasParaMostrar = data;
                if (isResponsavel) {
                    ocorrenciasParaMostrar = data.filter(ocorrencia => nomesDosFilhos.includes(ocorrencia.aluno));
                }

                ocorrenciasParaMostrar.forEach(ocorrencia => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td class="align-middle">${ocorrencia.descricao}</td>
                        <td class="align-middle">${ocorrencia.data_ocorrencia}</td>
                        <td class="align-middle">${ocorrencia.aluno}</td>
                        <td class="align-middle text-danger fw-bold">Ocorrência</td>`;      
                    lista.appendChild(tr);
                });
            });
    })
    .catch(err => console.error("Erro ao carregar ocorrencias:", err));
}


// CHAT
let alunoChatAtivo = null;

function verChat(alunoId) {
  alunoChatAtivo = alunoId;
  fetch(`http://localhost:3000/api/chat/${alunoId}`)
    .then(res => res.json())
    .then(mensagens => {
      const chatBox = document.getElementById("chatBox");
      chatBox.innerHTML = mensagens.map(m => `
            <div class="msg">
                <strong>${m.remetente_nome}:</strong> ${m.mensagem}
            </div>
        `).join("");
    })
}

// Metodo que envia mensagem
function enviarMensagem() {
  const user = JSON.parse(localStorage.getItem("user"));
  const mensagem = document.getElementById("msgChat").value;

  if (!alunoChatAtivo) return alert("Selecione um aluno na lista primeiro!");

  fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      aluno_id: alunoChatAtivo,
      remetente_id: user.id,
      mensagem: mensagem
    })
  }).then(() => {
    document.getElementById("msgChat").value = "";
    verChat(alunoChatAtivo); // Atualiza o chat
  });
}
function historicoAluno(id, nome) {
  
    window.location.href = `historicoAluno.html?id=${id}`;
}

function carregarHistoricoCompleto() {
    const params = new URLSearchParams(window.location.search);
    const alunoId = params.get('id');

    if (!alunoId) {
        document.getElementById("histNomeAluno").innerText = "⚠️ Aluno não selecionado";
        document.getElementById("histTurmaAluno").innerText = "Volte à lista e clique no botão Histórico.";
        return;
    }

    console.log("Iniciando busca do histórico para o Aluno ID:", alunoId);

    // 1. Busca os dados principais do aluno
    fetch(`http://localhost:3000/api/alunos/${alunoId}`)
        .then(res => {
            if (!res.ok) throw new Error("Erro na rota de alunos");
            return res.json();
        })
        .then(aluno => {
            console.log("Dados do aluno recebidos:", aluno);
            const dados = Array.isArray(aluno) ? aluno[0] : aluno;
            
            document.getElementById("histNomeAluno").innerText = dados.nome;
            document.getElementById("histTurmaAluno").innerText = dados.turma;
            
            // Calcula a idade 
            if (dados.data_nascimento) {
                const nasc = new Date(dados.data_nascimento);
                const hoje = new Date();
                const idade = hoje.getFullYear() - nasc.getFullYear();
                document.getElementById("histIdadeAluno").innerText = idade;
            }
        })
        .catch(err => console.error("Erro ao buscar Aluno:", err));

    const listaEventos = document.getElementById("listaEventosAluno");
    
    // 2. Busca Rotinas
    fetch(`http://localhost:3000/api/rotinas`)
        .then(res => res.json())
        .then(rotinas => {
            const minhasRotinas = rotinas.filter(r => r.aluno_id == alunoId);
            minhasRotinas.forEach(r => {
                const tr = `<tr>
                    <td class="align-middle">${r.data_registro}</td>
                    <td class="align-middle"><span class="badge bg-success">Rotina</span></td>
                    <td class="align-middle">${r.descricao}</td>
                </tr>`;
                listaEventos.innerHTML += tr;
            });
        })
        .catch(err => console.error("Erro ao buscar Rotinas:", err));

    // 3. Busca Ocorrências
    fetch(`http://localhost:3000/api/ocorrencias`)
        .then(res => res.json())
        .then(ocorrencias => {
            const minhasOcorrencias = ocorrencias.filter(o => o.aluno_id == alunoId);
            minhasOcorrencias.forEach(o => {
                const tr = `<tr>
                    <td class="align-middle">${o.data_ocorrencia}</td>
                    <td class="align-middle"><span class="badge bg-danger">Ocorrência</span></td>
                    <td class="align-middle">${o.descricao}</td>
                </tr>`;
                listaEventos.innerHTML += tr;
            });
        })
        .catch(err => console.error("Erro ao buscar Ocorrências:", err));

    // 4. Busca as Mensagens
    fetch(`http://localhost:3000/api/chat/${alunoId}`)
        .then(res => res.json())
        .then(mensagens => {
            const chatBox = document.getElementById("historicoMensagens");
            chatBox.innerHTML = mensagens.map(m => `
                <div class="msg p-2 mb-2 border-bottom">
                    <small class="text-primary fw-bold">${m.remetente_nome}</small><br>
                    <span>${m.mensagem}</span>
                </div>
            `).join("");
        })
        .catch(err => console.error("Erro ao buscar Chat:", err));
}

// Avisos da semana
function carregarAvisos() {
    fetch("http://localhost:3000/api/avisos")
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById("listaAvisos");
            if (!lista) return;

            lista.innerHTML = ""; // Limpa a tabela antes de preencher

            data.forEach(aviso => {
                // 1. Formatar a data para o padrão brasileiro (DD/MM/YYYY)
                let dataFormatada = "Sem data";
                if (aviso.data_evento) {
                    // O timezone 'UTC' evita que a data volte 1 dia por causa do fuso horário
                    const dataObj = new Date(aviso.data_evento);
                    dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }

                // 2. Escolher a cor da etiqueta (Badge) com base no tipo de aviso
                let badgeClass = "bg-secondary"; // Cor padrão (cinza)
                const tipoLower = aviso.tipo.toLowerCase();
                
                if (tipoLower.includes("lição") || tipoLower.includes("licao")) badgeClass = "bg-primary"; // Azul
                else if (tipoLower.includes("trabalho")) badgeClass = "bg-warning text-dark"; // Amarelo
                else if (tipoLower.includes("feriado")) badgeClass = "bg-danger"; // Vermelho
                else if (tipoLower.includes("evento") || tipoLower.includes("festa")) badgeClass = "bg-success"; // Verde
                else if (tipoLower.includes("reunião") || tipoLower.includes("reuniao")) badgeClass = "bg-info text-dark"; // Azul claro

                // 3. Montar a linha da tabela
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td class="align-middle fw-bold text-secondary">${dataFormatada}</td>
                    <td class="align-middle"><span class="badge ${badgeClass}">${aviso.tipo}</span></td>
                    <td class="align-middle">
                        <span class="fw-bold text-dark" style="font-size: 1.1rem;">${aviso.titulo}</span><br>
                        <span class="text-muted">${aviso.descricao}</span><br>
                        <small class="text-primary fw-bold" style="font-size: 0.75rem;">Postado por: ${aviso.autor_nome}</small>
                    </td>
                    <td class="align-middle fw-bold">${aviso.turma}</td>
                    <td class="text-center align-middle">
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-sm btn-acao btn-excluir" onclick="excluirAviso(${aviso.id}, '${aviso.titulo}')">
                                Excluir
                            </button>
                        </div>
                    </td>
                `;
                lista.appendChild(tr);
            });
        })
        .catch(err => console.error("Erro ao carregar avisos:", err));
}

// Método que pega os dados do form e salva no banco
function cadastrarAviso() {
    const titulo = document.getElementById("avisoTitulo").value;
    const tipo = document.getElementById("avisoTipo").value;
    const data_evento = document.getElementById("avisoData").value;
    const turma = document.getElementById("avisoTurma").value;
    const descricao = document.getElementById("avisoDescricao").value;

    // Validação para impedir salvamento em branco
    if (!titulo || !tipo || !data_evento || !turma || !descricao) {
        alert("Por favor, preencha todos os campos para criar o aviso!");
        return;
    }

    // Pega o nome de quem está criando o aviso (Professor ou Admin)
    const user = JSON.parse(localStorage.getItem("user"));
    const autor_nome = user ? user.nome : "Sistema";

    fetch("http://localhost:3000/api/avisos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo,
            descricao,
            tipo,
            data_evento,
            turma,
            autor_nome
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Aviso criado com sucesso!");
        // Redireciona de volta para a lista após salvar
        window.location.href = "listaAvisos.html"; 
    })
    .catch(err => {
        console.error("Erro na requisição:", err);
        alert("Ocorreu um erro ao salvar o aviso.");
    });
}

// função de Excluir avisos 
function excluirAviso(id, titulo) {
    if (confirm(`Tem certeza que deseja excluir o aviso "${titulo}"?`)) {
        fetch(`http://localhost:3000/api/avisos/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao excluir no servidor");
            return res.json();
        })
        .then(data => {
            alert(data.message || "Aviso excluído com sucesso!");
            carregarAvisos(); // Atualiza a tabela na mesma hora!
        })
        .catch(err => {
            console.error("Erro:", err);
            alert("Não foi possível excluir o aviso.");
        });
    }
}

// Função ativada pelo clique do botão
/**/function alternarTamanhoFonte() {
  const htmlElement = document.documentElement;

  // Liga ou desliga a classe
  htmlElement.classList.toggle('fonte-ampliada');

  if (htmlElement.classList.contains('fonte-ampliada')) {
    localStorage.setItem('fonteAmpliada', 'true');
  } else {
    localStorage.setItem('fonteAmpliada', 'false');
  }
}

// Função que roda ao abrir a página para checar a preferência
function carregarPreferenciaFonte() {
  const fonteAmpliada = localStorage.getItem('fonteAmpliada');

  if (fonteAmpliada === 'true') {
    document.documentElement.classList.add('fonte-ampliada');
  }
}

// Verificação e exibição do Termo de Consentimento Parental (LGPD) para Responsáveis
function verificarConsentimentoLGPD() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return;

  const user = JSON.parse(userStr);
  const tipo = (user.tipo || "").toLowerCase();
  const isResponsavel = tipo === "responsável" || tipo === "responsavel";

  if (isResponsavel && !user.consentimento_lgpd) {
    if (document.getElementById("modalLGPDOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "modalLGPDOverlay";
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";

    overlay.innerHTML = `
      <div class="card shadow-lg border-0 p-4 p-md-5" style="max-width: 600px; width: 100%; border-radius: 12px; background-color: #ffffff;">
        <div class="text-center mb-3">
          <div style="font-size: 2.5rem;">🔒</div>
          <h4 class="fw-bold text-primary mt-2">Termo de Consentimento Parental - LGPD</h4>
          <p class="text-muted small">Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</p>
        </div>

        <div class="mb-3 text-secondary" style="font-size: 0.95rem; line-height: 1.5; max-height: 250px; overflow-y: auto; padding-right: 5px;">
          <p>
            Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>, a coleta, armazenamento e tratamento de dados pessoais de crianças e estudantes pelo Prontuário Escolar exigem o <strong>consentimento explícito e inequívoco dos pais ou responsáveis legais</strong> antes da coleta de qualquer dado.
          </p>
          <p>
            Ao prosseguir e aceitar estes termos, você autoriza formalmente a instituição e o sistema a registrar, processar e exibir informações educacionais, rotinas, ocorrências e comunicações relativas ao seu dependente.
          </p>
        </div>

        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" id="checkConsentimentoLGPD" onchange="toggleBotaoConsentimento()">
          <label class="form-check-input-label fw-bold texto-pequeno text-dark" for="checkConsentimentoLGPD" style="cursor: pointer; font-size: 0.9rem;">
            Li e concordo com os termos de consentimento parental e autorizo o tratamento de dados do meu dependente conforme a LGPD.
          </label>
        </div>

        <button id="btnAceitarLGPD" onclick="aceitarConsentimentoLGPD(${user.id})" class="btn btn-primary w-100 fw-bold py-2" style="border-radius: 8px;" disabled>
          Aceitar e Continuar
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
  }
}

function toggleBotaoConsentimento() {
  const checkbox = document.getElementById("checkConsentimentoLGPD");
  const btn = document.getElementById("btnAceitarLGPD");
  if (checkbox && btn) {
    btn.disabled = !checkbox.checked;
  }
}

function aceitarConsentimentoLGPD(userId) {
  fetch(`http://localhost:3000/api/users/${userId}/consentimento`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao registrar consentimento no servidor");
      return res.json();
    })
    .then(data => {
      const user = JSON.parse(localStorage.getItem("user"));
      user.consentimento_lgpd = 1;
      localStorage.setItem("user", JSON.stringify(user));

      const overlay = document.getElementById("modalLGPDOverlay");
      if (overlay) overlay.remove();

      alert(data.message || "Consentimento registrado com sucesso!");
    })
    .catch(err => {
      console.error("Erro:", err);
      alert("Erro ao registrar consentimento. Tente novamente.");
    });
}

// Inicializa a lista ao abrir a página
window.onload = function () {
  verificarAcessoAdmin();
  carregarBoasVindas();
  carregarPreferenciaFonte();
  verificarConsentimentoLGPD();


  if (document.getElementById("listaUsuarios")) {
    carregarUsuarios();
  }
  if (document.getElementById("listaAlunos")) {
    carregarAlunos();
  }
  if (document.getElementById("alunoResponsavel")) {
    carregarResponsaveis();
  }
  if (document.getElementById("listaAlunosChat")) {
    carregarAlunosChat();
  }
  if (document.getElementById("selectAlunosRegistrar")) {
    carregarAlunosEventos();
  }  
  if (document.getElementById("listaOcorrencia")) {
    carregarEventosOcorrencias();
  }
  if (document.getElementById("listaRotina")) {
    carregarEventosRotinas();
  }
  if (document.getElementById("histNomeAluno")) {
        carregarHistoricoCompleto();
    }
  if (document.getElementById("listaAvisos")) {
    carregarAvisos();
  }
};
