const { Sequelize } = require("sequelize");
const { Project, ShortLink, Click } = require("../db/models/index");
const { sequelize } = require("../db/models/index");
const { format, parseISO } = require("date-fns");

const createProject = async (req, res) => {
  try {
    const { project_name, project_by } = req.body;

    const projectCreated = await Project.create(
      {
        project_name,
        project_by,
      },
      {
        include: [{ model: ShortLink, include: [{ model: Click }] }],
      }
    );

    const project = await Project.findOne({
      where: { id: projectCreated.id },
      include: [{ model: ShortLink, include: [{ model: Click }] }],
    });
    console.log({ project });

    // Function to count short links and clicks
    function countShortLinksAndClicks(project) {
      const projectName = project.project_name;
      const shortLinkCount = project.shortlinks.length;
      const totalClicks = project.shortlinks.reduce(
        (total, shortlink) => total + shortlink.clicks.length,
        0
      );

      return {
        id: project.id,
        project_name: projectName,
        shortlink_count: shortLinkCount,
        total_clicks: totalClicks,
      };
    }

    const shortAndClickCount = countShortLinksAndClicks(project);

    res.json(shortAndClickCount);
  } catch (error) {
    console.log(error);
  }
};

const getProjects = async (req, res) => {
  try {
    const { id } = req.user;

    const projects = await Project.findAll({
      where: { project_by: id },
      include: [{ model: ShortLink, include: [{ model: Click }] }],
    });

    // Function to count short links and clicks
    function countShortLinksAndClicks(projects) {
      return projects.map((project) => {
        const projectName = project.project_name;
        const shortLinkCount = project.shortlinks.length;
        const totalClicks = project.shortlinks.reduce(
          (total, shortlink) => total + shortlink.clicks.length,
          0
        );

        return {
          id: project.id,
          project_name: projectName,
          shortlink_count: shortLinkCount,
          total_clicks: totalClicks,
        };
      });
    }

    // Calculate short link and click count for each project
    const shortAndClickCount = countShortLinksAndClicks(projects);

    res.json(shortAndClickCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const getProjectAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    //   Total clicks
    const clicksData = await Project.findOne({
      where: {
        id,
      },
      include: [{ model: ShortLink, include: [{ model: Click }] }],
    }).then((data) => {
      const jsondata = data.toJSON();
      return jsondata;
    });

    const clicksFound = await Project.findAll({
      where: {
        id,
      },
      raw: true,
      nest: true,
      include: [{ model: ShortLink, include: [{ model: Click }] }],
    });

    //   Chart

    //   LOcations
    const cities = await Click.count({
      include: [
        {
          model: ShortLink,
          where: { project_id: id },
        },
      ],
      attributes: ["city"],
      group: ["city"],
    });
    const countries = await Click.count({
      include: [
        {
          model: ShortLink,
          where: { project_id: id },
        },
      ],
      attributes: ["country"],
      group: ["country"],
    });
    //   Devices
    const devices = await Click.count({
      include: [
        {
          model: ShortLink,
          where: { project_id: id },
        },
      ],
      attributes: ["device"],
      group: ["device"],
    });
    //   Browsers
    const browsers = await Click.count({
      include: [
        {
          model: ShortLink,
          where: { project_id: id },
        },
      ],
      attributes: ["browser"],
      group: ["browser"],
    });
    //   Os
    const operating_systems = await Click.count({
      include: [
        {
          model: ShortLink,
          where: { project_id: id },
        },
      ],
      attributes: ["os"],
      group: ["os"],
    });

    //   Date wise clicks

    function countClicksByDate(clicksData) {
      const dateAndClick = [];
      //   clicksData.toJSON();

      // Iterate through clicksData to count the clicks for each unique date
      clicksData.forEach((data) => {
        // console.log(data.shortlinks.clicks.created_at);
        let clickDate = data.shortlinks && data.shortlinks.clicks.created_at;

        //   const dateStr = new D;
        //   const parsedDate = parseISO(dateStr);

        //   const formattedDate = format(parsedDate, "dd, MMM, yyyy");

        // if (clickDate) {
        //   // clickDate.toString();
        //   const date = parseISO(clickDate);
        //   console.log({ date });
        // }
        //   Get the createdAt date of Shortlinks
        if (clickDate) {
          //   const date = new Date(clickDate).toISOString();
          const date = format(clickDate, "MMMM d, yyyy");

          // Extract date from createdAt
          const existingDate = dateAndClick.find((item) => item.date === date); // Check if date already exists in dateAndClick
          if (existingDate) {
            existingDate.count++; // If the date exists, increment the count
          } else {
            dateAndClick.push({ date, count: 1 }); // If the date does not exist, push it to dateAndClick with count 1
          }
        }
      });

      return dateAndClick;
    }

    const clicksByDate = countClicksByDate(clicksFound);
    //   Response
    // console.log({ totalClicks });

    //   Click count func

    const countClicks = (data) => {
      let clicks = 0;
      data.shortlinks.map((shortlink) => {
        clicks += shortlink.clicks.length;
      });

      return clicks;
      //   console.log({ data });
    };
    const clicks = countClicks(clicksData);

    //   Rsponse
    res.json({
      clicks,
      cities,
      countries,
      devices,
      operating_systems,
      browsers,
      clicksByDate,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.destroy({
      where: { id },
    });
    console.log({ deleted });
    // res.json(deleted);
    if (deleted) {
      res.json(id);
    }
  } catch (error) {}
};
module.exports = {
  createProject,
  getProjects,
  deleteProject,
  getProjectAnalytics,
};
