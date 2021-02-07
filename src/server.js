import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as socketIO from "socket.io";

import config from "../config.json";

import {} from "./rooms.js";
import {
  root,
  login,
  makeRoom,
  room,
  rooms,
  joinRoom,
  logAgain,
} from "./middlewares.js";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.Server(app);
const io = new socketIO.Server(server);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("frontend"));

app.get("/", root);
app.post("/relog", logAgain);
app.post("/login", login);
app.post("/make-room", makeRoom);
app.get("/room", room);
app.get("/rooms", rooms);
app.post("/join-room", joinRoom);
app.get("/join-room", joinRoom);

io.on("connection", socketHandler);

const PORT = process.env.PORT || config.port;
server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
