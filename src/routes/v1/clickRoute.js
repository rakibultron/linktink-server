const { makeClick, getClicks } = require("../../controllers/clickController");
const express = require("express");
const router = express.Router();

router.get("/", getClicks);
router.post("/", makeClick);

module.exports = router;
