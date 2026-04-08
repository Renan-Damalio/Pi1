const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { aluno_id, descricao, data_ocorrencia } = req.body;

  db.query(
    "INSERT INTO ocorrencias (aluno_id,descricao,data_ocorrencia) VALUES (?,?,?)",
    [aluno_id, descricao, data_ocorrencia],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Ocorrência criada" });
    }
  );
});

router.get("/:aluno_id", (req, res) => {
  db.query(
    "SELECT * FROM ocorrencias WHERE aluno_id=?",
    [req.params.aluno_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

module.exports = router;