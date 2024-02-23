const { Click } = require("../db/models/index");

const makeClick = async (req, res) => {
  try {
    const { shortlink_id } = req.body;

    const clicked = await Click.create({
      //   ip_address: "nothing",
      shortlink_id,
    });

    res.json(clicked);
  } catch (error) {
    res.json(error);
  }
};

const getClicks = async (req, res) => {
  try {
    const clicks = await Click.findAll();
    res.json(clicks);
  } catch (error) {}
};
module.exports = { makeClick, getClicks };
