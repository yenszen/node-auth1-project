const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const restricted = require("../auth/restricted-middleware");

const usersRouter = require("../users/users-router");
const authRouter = require("../auth/auth-router");

const server = express();

const sessionConfig = {
  name: "mysession",
  secret: "can't tell you that",
  cookie: {
    maxAge: 1000 * 60,
    secure: false, // true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require("../database/db-config"), // configured instance of knex
    tablename: "sessions", // table that will store sessions inside the db, name it anything you want
    sidfieldname: "sid", // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  })
};

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/auth", authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;
