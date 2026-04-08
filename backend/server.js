const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const userRoutes = require("./routes/userRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const ocorrenciaRoutes = require("./routes/ocorrenciaRoutes");
const rotinaRoutes = require("./routes/rotinaRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/ocorrencias", ocorrenciaRoutes);
app.use("/api/rotinas", rotinaRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});