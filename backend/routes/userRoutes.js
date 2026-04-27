const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LOGIN
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email=? AND senha=?",
    [email, senha],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        res.json({ user: result[0] });
      } else {
        res.status(401).json({ message: "Erro login" });
      }
    }
  );
});


// CRUD USUÁRIOS (ADMIN)
router.post("/", (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  db.query(
    "INSERT INTO usuarios (nome,email,senha,tipo) VALUES (?,?,?,?)",
    [nome, email, senha, tipo],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Usuário criado" });
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
  db.query("SELECT id, nome, email, tipo FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    
    if (result.length > 0) {
      res.json(result[0]); 
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  });
});

router.put("/:id", (req, res) => {
  const { nome, email, tipo, senha } = req.body;

  if (senha) {
    db.query(
      "UPDATE usuarios SET nome=?, email=?, tipo=?, senha=? WHERE id=?",
      [nome, email, tipo, senha, req.params.id],
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