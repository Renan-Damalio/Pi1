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
function carregarAlunos() {
  fetch("http://localhost:3000/api/alunos")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("listaAlunos");
      lista.innerHTML = "";

      data.forEach(aluno => {
        const li = document.createElement("li");
        li.innerText = aluno.nome;
        lista.appendChild(li);
      });
    });
}