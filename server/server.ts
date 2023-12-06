import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import "dotenv/config";

const app: Express = express();
app.use(cors());
const server = createServer(app);
const port = process.env.PORT;

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket)=> {
//     socket.on("join_room", (data) => {
//       socket.join(data);
//     });

//       socket.on("send_message", (data) => {
//         socket.to(data.room).emit("receive_message", data);
//       });
// })

server.listen(port, () => {
  console.log("SERVER IS RUNNING");
});

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
