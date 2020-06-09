const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

const router = express.Router();

router.post("/register", (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Database error" });
    });
});

module.exports = router;
