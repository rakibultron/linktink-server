const {
  createShortLink,
  getShortLinks,
} = require("../../controllers/shortLinkController");
const express = require("express");
const router = express.Router();

router.get("/", getShortLinks);
router.post("/", createShortLink);

module.exports = router;
