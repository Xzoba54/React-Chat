import dotenv from "dotenv";
import express, { Express, Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { Server, Socket } from "socket.io";
import helmet from "helmet";

import { AuthRouter } from "./routes/auth.route";
import { UserRouter } from "./routes/user.route";
import { ChatRouter } from "./routes/chat.route";
import { MessageRouter } from "./routes/message.route";

import { CLIENT_ORIGIN_URL, PORT } from "./utils/getEnv";

dotenv.config();
const app: Express = express();

export interface AuthRequest extends Request {
  id: string;
}

const isProd = process.env.NODE_ENV == "production";

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: CLIENT_ORIGIN_URL,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: isProd ? "same-origin" : "cross-origin" },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.dirname(__dirname) + "/public"));

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export const io = new Server(server, {
  cors: {
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: CLIENT_ORIGIN_URL,
  },
});

export const usersOnline: Map<string, Socket> = new Map();

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.auth.id;
  if (userId) {
    socket.join(userId);
    usersOnline.set(userId, socket);
  }

  socket.on("join-chat", (chatId: string) => {
    socket.join(chatId);
  });

  socket.on("disconnect", () => {
    for (const [id, userSocket] of usersOnline) {
      if (userSocket.id === socket.id) {
        usersOnline.delete(id);
        break;
      }
    }
  });
});
