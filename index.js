const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const dotenv = require("dotenv");
dotenv.config();
const URL = process.env.URL_FRONTEND;

app.use(
  cors({
    origin: URL,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Usuario actual: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data} `);
  });
  socket.on("send_message", (data) => {
    console.log("Mensaje recibido");
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log(`Usuario desconectado`, socket.id);
  });
});

server.listen(3001, () => {
  console.log("####################################");
  console.log("######## SERVIDOR CORRIENDO ########");
  console.log("####################################");
});