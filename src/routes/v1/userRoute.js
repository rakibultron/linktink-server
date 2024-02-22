const passport = require("passport");
const express = require("express");
const router = express.Router();

const { User } = require("../../db/models");

router.get("/", async (req, res) => {
  const users = await User.findAll({});
  res.json(users);
});

module.exports = router;
