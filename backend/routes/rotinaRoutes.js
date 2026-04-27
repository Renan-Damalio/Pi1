const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { aluno_id, descricao, data_registro, aluno } = req.body;

  db.query(
    "INSERT INTO rotinas (aluno_id,descricao,data_registro,aluno) VALUES (?,?,?,?)",
    [aluno_id, descricao, data_registro, aluno],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Rotina criada" });
    }
  );
});

router.get("/:aluno_id", (req, res) => {
  db.query(
    "SELECT * FROM rotinas WHERE aluno_id=?",
    [req.params.aluno_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM rotinas", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;