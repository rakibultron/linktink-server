const {
  createShortLink,
  getShortLinks,
  getShortLinkAnalytics,
} = require("../../controllers/shortLinkController");
const express = require("express");
const router = express.Router();

router.get("/", getShortLinks);
router.get("/analytics/:id", getShortLinkAnalytics);
router.post("/", createShortLink);

module.exports = router;
