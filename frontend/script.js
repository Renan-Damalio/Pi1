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
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("usuarioNome").value = "";
      document.getElementById("usuarioEmail").value = "";
      document.getElementById("usuarioSenha").value = "";
    })
}


// Cadastro de alunos
function cadastrarAluno() {
  const nome = document.getElementById("alunoNome").value;
  const data_nascimento = document.getElementById("alunoData").value
  const turma = document.getElementById("alunoTurma").value
  const responsavel = document.getElementById("alunoResponsavel").value;

  if (!nome || !data_nascimento || !turma || !responsavel) {
    alert("Erro: Todos os campos do aluno são obrigatórios!");
    return; 
  }

  fetch("http://localhost:3000/api/alunos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, data_nascimento, turma,  })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      carregarAlunos(); 
    })
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
    window.onload = function() {
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
          const tr = document.createElement("tr");
          tr.innerHTML = `
         <td class="align-middle">${aluno.nome}</td>
        <td class="align-middle">${aluno.turma}</td>
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
function carregarAlunosOcorrenciaEventos() {
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
            
            console.log("Alunos carregados:", apenasAlunos);
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
                option.value = usuario.id;
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


// Carregar alunos chat
function carregarAlunosChat() {
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(data => {     
      const lista = document.getElementById("listaAlunosChat");
      const select = document.getElementById("selectAlunos");

      if (lista) {
        lista.innerHTML = ""; 

        data.forEach(aluno => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td class="align-middle">${aluno.nome}</td>
              <td class="align-middle">${aluno.turma}</td>
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
        data.forEach(aluno => {
          const opt = document.createElement("option");
          opt.value = aluno.id;
          opt.innerText = aluno.nome;
          select.appendChild(opt);
        });
      }
    })
    .catch(err => console.error("Erro ao carregar alunos:", err));
}


// Ocorrências 
function registrarOcorrencia() {
  const aluno_id = document.getElementById("selectAlunos").value;
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
    body: JSON.stringify({ aluno_id, descricao, data_ocorrencia })
  }).then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("descricaoEventos").value = " ";  
    })
    .catch(err => console.error("Error:", err));

}

//rotinas
function registrarRotina() {
  const aluno_id = document.getElementById("selectAlunos").value;
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
    body: JSON.stringify({ aluno_id, descricao, data_registro })
  }).then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("descricaoEventos").value = " "; 
    })
    .catch(err => console.error("Error:", err));

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

// Inicializa a lista ao abrir a página
window.onload = function () {
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
        carregarAlunosOcorrenciaEventos();
    }
};
