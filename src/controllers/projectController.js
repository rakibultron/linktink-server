const { Project } = require("../db/models/index");

const createProject = async (req, res) => {
  try {
    const { project_name, project_by } = req.body;

    const project = await Project.create({ project_name, project_by });
    res.json(project);
  } catch (error) {}
};
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {}
};

module.exports = { createProject, getProjects };
