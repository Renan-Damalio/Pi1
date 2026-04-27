const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { nome, data_nascimento, turma, responsavel, responsavel_id } = req.body;

  // Log para você ver no terminal do VSCode o que está chegando
  console.log("Recebido do frontend:", { nome, data_nascimento, turma, responsavel, responsavel_id });

  db.query(
    "INSERT INTO alunos (nome, data_nascimento, turma, responsavel, responsavel_id) VALUES (?,?,?,?,?)",
    [nome, data_nascimento, turma, responsavel, responsavel_id],
    (err) => {
      if (err) {
        // Isso vai imprimir o erro EXATO no terminal onde o servidor está rodando
        console.error("Erro do MySQL:", err); 
        
        // Devolvemos a mensagem de erro formatada para o navegador
        return res.status(500).json({ message: "Erro no banco: " + err.message });
      }
      res.json({ message: "Aluno criado com sucesso!" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM alunos", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// BUSCAR UM ÚNICO ALUNO PELO ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM alunos WHERE id = ?", 
    [req.params.id], 
    (err, result) => {
      if (err) return res.status(500).json(err);
      
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ message: "Aluno não encontrado" });
      }
    }
  );
});

router.put("/:id", (req, res) => {
  const { nome, data_nascimento, turma, responsavel, responsavel_id } = req.body;

  db.query(
    "UPDATE alunos SET nome=?,data_nascimento=?,turma=?, responsavel=?, responsavel_id=? WHERE id=?",
    [nome, data_nascimento, turma, responsavel, responsavel_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Atualizado" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM alunos WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Excluído" });
  });
});

module.exports = router;