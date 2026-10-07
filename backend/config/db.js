const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prontuario_escolar",
  //socketPath: "/sysroot/home/renan/mysql-data/mysql.sock"

  // Adicione esta linha para ajudar o driver a negociar o handshake
  authSwitchHandler: ({ pluginName, data }, cb) => {
    if (pluginName === 'auth_gssapi_client') {
      return cb(null, Buffer.alloc(0));
    }
    cb(new Error(`Plugin de autenticação desconhecido: ${pluginName}`));
  }

});



connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao banco MariaDB!");
  }
});

module.exports = connection;