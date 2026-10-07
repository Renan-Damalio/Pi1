const express = require("express");
const router = express.Router();
const db = require("../config/db");
const crypto = require("crypto");
const registrarLog = require("../utils/logger");

// Função auxilar para hash SHA-256
function hashSenha(senha) {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

// LOGIN
router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const senhaHash = hashSenha(senha);

  db.query(
    "SELECT * FROM usuarios WHERE email=? AND (senha=? OR senha=?)",
    [email, senhaHash, senha],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        const user = result[0];
        
        // Se a senha estava em texto plano, atualiza para o hash automaticamente
        if (user.senha === senha) {
          db.query("UPDATE usuarios SET senha = ? WHERE id = ?", [senhaHash, user.id]);
        }

        const token = crypto.randomBytes(32).toString("hex");

        db.query(
          "UPDATE usuarios SET token = ? WHERE id = ?",
          [token, user.id],
          (updateErr) => {
            if (updateErr) return res.status(500).json(updateErr);
            user.token = token;
            delete user.senha; // Remove a senha do objeto retornado por segurança

            // Registrar Log de Auditoria
            const ipUsuario = req.ip || req.connection.remoteAddress;
            registrarLog(user.id, "LOGIN", `Usuário #${user.id}`, "Login realizado com sucesso", ipUsuario);

            res.json({ message: "Login realizado com sucesso", token, user });
          }
        );
      } else {
        res.status(401).json({ message: "Erro login" });
      }
    }
  );
});


const SENHAS_COMUNS = ["12345678", "123456789", "password", "senha123", "admin123", "123456", "qwertyui", "mudar123", "senha", "abcdefgh"];

function validarSenhaForte(senha) {
  if (!senha || senha.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
  if (!/[A-Z]/.test(senha)) return "A senha deve conter pelo menos uma letra maiúscula.";
  if (!/[a-z]/.test(senha)) return "A senha deve conter pelo menos uma letra minúscula.";
  if (!/[0-9]/.test(senha)) return "A senha deve conter pelo menos um número.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) return "A senha deve conter pelo menos um caractere especial (!@#$%^&*).";
  if (SENHAS_COMUNS.includes(senha.toLowerCase())) return "Esta senha é muito comum ou fraca. Escolha outra.";
  return null;
}

// CRUD USUÁRIOS (ADMIN)
router.post("/", (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  const erroSenha = validarSenhaForte(senha);
  if (erroSenha) {
    return res.status(400).json({ message: erroSenha });
  }

  const senhaHash = hashSenha(senha);

  db.query(
    "INSERT INTO usuarios (nome,email,senha,tipo) VALUES (?,?,?,?)",
    [nome, email, senhaHash, tipo],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // Registrar Log de Auditoria
      const ipUsuario = req.ip || req.connection.remoteAddress;
      registrarLog(1, "CRIOU_USUARIO", `Usuário #${result.insertId}`, `Criado usuário ${nome} (${tipo})`, ipUsuario);

      res.json({ message: "Usuário criado com senha criptografada" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// BUSCAR UM ÚNICO USUÁRIO 
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, nome, email, tipo, consentimento_lgpd FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    
    if (result.length > 0) {
      res.json(result[0]); 
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  });
});

// ATUALIZAR CONSENTIMENTO LGPD
router.put("/:id/consentimento", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE usuarios SET consentimento_lgpd = 1, data_consentimento_lgpd = NOW() WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Consentimento parental e LGPD aceito com sucesso!" });
    }
  );
});

router.put("/:id", (req, res) => {
  const { nome, email, tipo, senha } = req.body;

  if (senha) {
    const erroSenha = validarSenhaForte(senha);
    if (erroSenha) {
      return res.status(400).json({ message: erroSenha });
    }

    const senhaHash = hashSenha(senha);
    db.query(
      "UPDATE usuarios SET nome=?, email=?, tipo=?, senha=? WHERE id=?",
      [nome, email, tipo, senhaHash, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Usuário e senha atualizados com sucesso!" });
      }
    );
  } else {
    db.query(
      "UPDATE usuarios SET nome=?, email=?, tipo=? WHERE id=?",
      [nome, email, tipo, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Usuário atualizado com sucesso!" });
      }
    );
  }
});



router.delete("/:id", (req, res) => {
  db.query("DELETE FROM usuarios WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Excluído" });
  });
});

module.exports = router;