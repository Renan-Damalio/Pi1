const mysql = require("mysql2");

const connection = mysql.createConnection({
  user: "renan",
  password: "",
  database: "prontuario_escolar",
  socketPath: "/sysroot/home/renan/mysql-data/mysql.sock"
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao banco MariaDB!");
  }
});

module.exports = connection;