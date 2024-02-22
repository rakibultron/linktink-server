const express = require("express");
const router = express.Router();

router.get("/hello", async (req, res) => {
  res.json("test route");
});

module.exports = router;
