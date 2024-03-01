const {
  createProject,
  getProjects,
  getProjectAnalytics,
  deleteProject,
} = require("../../controllers/projectController");
const express = require("express");
const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.get("/analytics/:id", getProjectAnalytics);
module.exports = router;
