# 📚 Prontuário Escolar Web

Sistema web desenvolvido como projeto acadêmico com o objetivo de facilitar a comunicação entre escola e responsáveis, além de organizar informações dos alunos.

---

## 🎯 Objetivo

Desenvolver um sistema web utilizando:

* Backend com Node.js
* Banco de dados MariaDB
* Frontend com HTML, CSS e JavaScript
* Controle de versão com Git/GitHub

---

## 👥 Perfis de Usuário

### 👨‍💼 Admin

* Criar, editar e excluir:

  * Professores
  * Responsáveis
  * Alunos
* Controle total do sistema

---

### 👨‍🏫 Professor

* Gerenciar alunos
* Registrar:

  * Ocorrências
  * Rotina
  * Observações
* Responder mensagens dos responsáveis

---

### 👨‍👩‍👧 Responsável (Pai/Mãe)

* Visualizar informações do filho
* Acompanhar:

  * Ocorrências
  * Rotina
* Enviar mensagens para o professor

---

## 🧱 Estrutura do Projeto

```
prontuario-escolar/
│
├── backend/
│   ├── config/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── index.html
    ├── dashboard.html
    ├── script.js
    └── style.css
```

---

## ⚙️ Tecnologias Utilizadas

* Node.js
* Express
* MariaDB
* HTML
* CSS
* JavaScript
* Git e GitHub

---

## 🚀 Como Executar o Projeto

---

# 💻 🔵 LINUX (Toolbox / Fedora / Ubuntu)

## 1. Clonar o projeto

```bash
git clone https://github.com/Renan-Damalio/Pi1.git
cd Pi1
```

---

## 2. Instalar dependências

```bash
cd backend
npm install
```

---

## 3. Iniciar o banco de dados

```bash
mysqld --datadir=$HOME/mysql-data \
--socket=$HOME/mysql-data/mysql.sock \
--pid-file=$HOME/mysql-data/mysql.pid \
--skip-networking
```

⚠️ Deixe esse terminal aberto

---

## 4. Iniciar o backend

Em outro terminal:

```bash
cd backend
node server.js
```

---

## 5. Iniciar o frontend

Em outro terminal:

```bash
cd frontend
python3 -m http.server 5500
```

---

## 6. Acessar no navegador

```
http://localhost:5500
```

---

# 🪟 🟢 WINDOWS

## 1. Clonar o projeto

```bash
git clone https://github.com/Renan-Damalio/Pi1.git
cd Pi1
```

---

## 2. Instalar dependências

```bash
cd backend
npm install
```

---

## 3. Instalar e iniciar MariaDB

* Instale o MariaDB no Windows
* Inicie o serviço normalmente

---

## 4. Configurar conexão

No arquivo `config/db.js`, use:

```js
host: "localhost",
user: "root",
password: "",
database: "prontuario_escolar"
```

---

## 5. Rodar backend

```bash
node server.js
```

---

## 6. Rodar frontend

```bash
cd frontend
npx serve
```

OU abrir com Live Server (VS Code)

---

## 7. Acessar

```
http://localhost:3000 (API)
http://localhost:5500 (Frontend)
```

---

## 🗄️ Banco de Dados

### Criar banco:

```sql
CREATE DATABASE prontuario_escolar;
USE prontuario_escolar;
```

---

### Inserir dados iniciais:

```sql
INSERT INTO usuarios (nome,email,senha,tipo) VALUES
('Admin','admin@email.com','123','admin'),
('Professor João','prof@email.com','123','professor'),
('Pai Maria','pai@email.com','123','responsavel');

INSERT INTO alunos (nome,data_nascimento,turma) VALUES
('Aluno Teste','2020-01-01','Berçário 2');
```

---

## 🔐 Login padrão

```
Email: admin@email.com
Senha: 123
```

---

## 📌 Funcionalidades

* Login de usuários
* Cadastro de alunos
* Registro de ocorrências
* Controle de rotina
* Sistema de chat
* Controle de usuários (admin)

---

## ⚠️ Observações

* Não subir:

  * node_modules
  * .env
  * mysql-data

* Utilizar `.gitignore`

---

## 📈 Próximas melhorias

* Interface com abas (estilo navegador)
* Controle de permissões por usuário
* Dashboard personalizado
* Melhorias visuais (UI/UX)

---

## 👨‍💻 Autor

Projeto desenvolvido para a disciplina:

**PJI110 - Projeto Integrador em Computação I**

---

## 📄 Licença

Este projeto é acadêmico e de uso educacional.
