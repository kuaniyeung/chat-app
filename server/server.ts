import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import "dotenv/config";
import { ClientToServerEvents, ServerToClientEvents } from "./interfaces";

const app: Express = express();
app.use(cors());
const server = createServer(app);
const port = 3000;
const hostname = "0.0.0.0";

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Socket.IO server!");
});

server.listen(port, hostname, (err?: Error) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log("SERVER IS RUNNING");
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
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

    console.log(data);

    socket.broadcast.emit("global_new_message", data);
  });

  // Send & receive new added chatrooms
  socket.on("send_new_chatroom", (data) => {
    socket.broadcast.emit("global_receive_new_chatroom", data);
  });

  // Send & receive typing signal
  socket.on("send_typing", (data) => {
    socket.to(data.chatroom_id).emit("receive_typing", data);
  });

  // Send & receive new contact
  socket.on("send_new_contact", (data) => {
    socket.broadcast.emit("receive_new_contact", data);
  });
});
