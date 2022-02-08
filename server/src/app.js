import express from "express";
import "express-async-errors";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { sequelize } from "./db.js";
import { initSocket } from "./connections/socket.js";
import authRouter from "./routers/auth.js";
import tweetsRouter from "./routers/tweets.js";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/tweets", tweetsRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize.sync().then(() => {
  console.log("✅ Successful DB connection");
  const server = app.listen(config.port, () => {
    console.log(`✅ Server is running on ${config.port} - ${new Date()}`);
  });
  initSocket(server);
});
