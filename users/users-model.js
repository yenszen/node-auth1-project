const db = require("../database/db-config");

function addUser(user) {
  return db("users").insert(user);
}

module.exports = {
  addUser
};
