const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      // "http://localhost:3000",
      "https://admiring-jang-94e13e.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  io.emit("welcome", "Hej din fitta");

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id:${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} Disconnected`);
  });

  socket.on("new_user", (data) => {
    console.log(data);
    socket.to(data.room).emit("get_users", data);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("server running");
});
