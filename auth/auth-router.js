const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

const router = express.Router();

router.post("/register", async (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  try {
    const saved = await Users.addUser(user);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${user.username}` });
    } else {
      res.status(401).json({ message: "You shall not pass!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
