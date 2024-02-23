const { ShortLink, Project } = require("../db/models/index");

const createShortLink = async (req, res) => {
  try {
    const { origina_url, shortened_url, project_id } = req.body;

    const shortlink = await ShortLink.create({
      origina_url,
      shortened_url,
      project_id,
    });

    res.json(shortlink);
  } catch (error) {}
};
const getShortLinks = async (req, res) => {
  try {
    const shortlinks = await ShortLink.findAll({
      include: [{ model: Project }],
    });
    res.json(shortlinks);
  } catch (error) {
    res.json(error);
  }
};

module.exports = { createShortLink, getShortLinks };
