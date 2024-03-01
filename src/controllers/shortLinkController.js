const { ShortLink, Click } = require("../db/models/index");
const { format } = require("date-fns");
const ShortUniqueId = require("short-unique-id");
const createShortLink = async (req, res) => {
  try {
    // const uuid = nanoid(10);

    const { randomUUID } = new ShortUniqueId({ length: 8 });
    const uuid = randomUUID();
    const { origina_url, project_id } = req.body;

    const shortlink = await ShortLink.create({
      origina_url,
      shortened_url: process.env.BACKEND_BASE_URL + "/" + uuid,
      uuid: uuid,
      project_id,
    });

    const { click_count, shortened_url } = shortlink;

    res.json({
      original_url: origina_url,
      shortened_url,
      total_clicks: click_count,
    });
  } catch (error) {}
};

const getShortLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const shortlinkFound = await ShortLink.findOne({
      where: { id },
      include: [{ model: Click }],
    });

    const { clicks } = shortlinkFound;
    const totalClicks = clicks.length;

    const countOccurrences = (data, property) => {
      const counts = {};
      data.forEach((item) => {
        counts[item[property]] = (counts[item[property]] || 0) + 1;
      });
      return Object.keys(counts).map((key) => ({
        [property]: key,
        count: counts[key],
      }));
    };

    const cities = countOccurrences(clicks, "city");
    const browsers = countOccurrences(clicks, "browser");
    const devices = countOccurrences(clicks, "device");
    const countries = countOccurrences(clicks, "country");
    const operatingSystems = countOccurrences(clicks, "os");
    const createdAt = countOccurrences(clicks, "created_at").map((item) => ({
      date: format(item.created_at, "MMMM d, yyyy"),
      count: item.count,
    }));

    res.json({
      clicks: totalClicks,
      operating_systems: operatingSystems,
      cities,
      browsers,
      devices,
      countries,

      clicksByDate: createdAt,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getShortLinks = async (req, res) => {
  try {
    const { project_id } = req.query;

    const shortlinks = await ShortLink.findAll({
      where: { project_id },
      include: [{ model: Click }],
    });

    // Function to count short links and clicks
    function countShortlinkClicks(shortLinks) {
      return shortLinks.map((shortLink) => {
        // const projectName = shortLink.id;
        const shortLicnkClicks = shortLink.clicks.length;
        // const totalClicks = project.shortlinks.reduce(
        //   (total, shortlink) => total + shortlink.clicks.length,
        //   0
        // );

        return {
          id: shortLink.id,
          original_url: shortLink.origina_url,
          shortened_url: shortLink.shortened_url,
          total_clicks: shortLicnkClicks,
        };
      });
    }

    // Calculate short link and click count for each project
    const shortlinkClickCount = countShortlinkClicks(shortlinks);
    res.json(shortlinkClickCount);
  } catch (error) {
    res.json(error);
  }
};

module.exports = { createShortLink, getShortLinks, getShortLinkAnalytics };
