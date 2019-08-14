const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// app vai guardar as variáveis da aplicação
const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-avaor.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

// para o servidor entender JSON
app.use(express.json());

// aceitar o envio de arquivos
app.use(express.urlencoded({ extended: true }));

app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

// importando o arquivo de rotas
app.use(require("./routes"));

// porta que irá rodar
server.listen(3333);
