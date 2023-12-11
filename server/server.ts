import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import "dotenv/config";
import { ClientToServerEvents, ServerToClientEvents } from "./interfaces";

const app: Express = express();
app.use(cors());
const server = createServer(app);
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Socket.IO server!");
});

server.listen(port, () => {
  console.log("SERVER IS RUNNING");
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // Join room
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // Leave room
  socket.on("leave_room", (data) => {
    socket.leave(data);
  });

  // Send & receive messages
  socket.on("send_message", (data) => {
    socket.to(data.chatroom_id.toString()).emit("receive_message", data);

    socket.broadcast.emit("global_new_message", data);
  });

  // Send & receive typing signal
  socket.on("send_typing", (data) => {
    socket.to(data.chatroom_id).emit("receive_typing", data);
  });

  // Send new contact
  socket.on("send_new_contact", (data) => {
    socket.broadcast.emit("receive_new_contact", data);
  });
});
