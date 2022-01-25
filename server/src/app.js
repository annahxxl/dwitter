import express from "express";
import "express-async-errors";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { initSocket } from "./connections/socket.js";
import authRouter from "./routers/auth.js";
import tweetsRouter from "./routers/tweets.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/auth", authRouter);
app.use("/tweets", tweetsRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

const server = app.listen(config.host.port, () => {
  console.log(`✅ Server is running on ${config.host.port}`);
});

initSocket(server);
