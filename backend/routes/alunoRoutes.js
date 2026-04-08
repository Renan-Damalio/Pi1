const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { nome, data_nascimento, turma } = req.body;

  db.query(
    "INSERT INTO alunos (nome,data_nascimento,turma) VALUES (?,?,?)",
    [nome, data_nascimento, turma],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Aluno criado" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM alunos", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.put("/:id", (req, res) => {
  const { nome, data_nascimento, turma } = req.body;

  db.query(
    "UPDATE alunos SET nome=?,data_nascimento=?,turma=? WHERE id=?",
    [nome, data_nascimento, turma, req.params.id],
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