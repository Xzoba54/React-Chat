import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { Server, Socket } from "socket.io";
import { Request } from "express";

import { AuthRouter } from "./routes/auth.route";
import { UserRouter } from "./routes/user.route";
import { ChatRouter } from "./routes/chat.route";
import { MessageRouter } from "./routes/message.route";

dotenv.config();
const app: Express = express();

export interface AuthRequest extends Request {
  id: string;
}

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: process.env.CLIENT_ORIGIN_URL,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.dirname(__dirname) + "/public"));

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);

const server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Listening on port ${process.env.PORT || 5001}`);
});

export const io = new Server(server, {
  cors: {
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: process.env.CLIENT_ORIGIN_URL,
  },
});

interface Message {
  content: string;
  type: string;
  senderId: string;
}

export const usersOnline: Map<string, Socket> = new Map();

io.on("connection", (socket: Socket) => {
  socket.join(socket.handshake.auth.id);
  usersOnline.set(socket.handshake.auth.id, socket);

  socket.on("join-chat", (chatId: string) => {
    socket.join(chatId);
  });

  socket.on("disconnect", () => {
    for (const user of usersOnline) {
      if (user[1].id === socket.id) {
        usersOnline.delete(user[0]);
        break;
      }
    }
  });
});
