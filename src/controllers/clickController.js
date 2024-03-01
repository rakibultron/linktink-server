const { Click, ShortLink } = require("../db/models/index");
const geoip = require("geoip-lite");
const countries = require("i18n-iso-countries");
const ip = require("ip");
const DeviceDetector = require("node-device-detector");
var UAparser = require("ua-parser-js");

const makeClick = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = req.headers["user-agent"];

    const userAgentInfo = req.useragent;

    //   let real_ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    //   if (real_ip === "::1") real_ip = "127.0.0.1";
    //   let clientIp = real_ip.match(/\d+/g).join(".");

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    var geo = geoip.lookup(ip);
    // var fetch_res = await fetch(`https://ipapi.co/${ip}/json/`);
    // var fetch_data = await fetch_res.json();
    // const { city, country_name } = fetch_data;
    const { browser, os } = userAgentInfo;
    let parser = new UAparser(agent);

    const country = countries.getName(geo.country, "en");
    const deviceDetector = new DeviceDetector();
    const device_info = deviceDetector.detect(agent);
    let parserResults = parser.getResult();

    function deviceCaseConverter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const deviceType = deviceCaseConverter(device_info.device.type);

    const shortlink = await ShortLink.findOne({
      where: { uuid: id },
      raw: true,
    });

    console.log({ country });

    const isClicked = await Click.findOne({
      where: { ip_address: ip, shortlink_id: shortlink.id },
    });

    if (!isClicked) {
      await Click.create({
        ip_address: ip,
        shortlink_id: shortlink.id,
        country: country,
        city: geo.city,
        device: deviceType,
        os: os,
        browser: browser,
      });
    }

    //   res.json({ os: device_info.os.name });

    if (!shortlink) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }
    res.redirect(shortlink.origina_url);
    // res.json({
    //   country,
    //   city: geo.city,
    //   browser,
    //   os,
    //   device: deviceType,
    // });

    // res.json({ geo, device_info, parserResults });
    //   res.json({
    //     ip,
    //     fetch_data,
    //     deviceType,
    //     agent,
    //     geo,
    //     parserResults,
    //     userAgentInfo,
    //   });

    //   res.json({ ip, browser, os, city, country_name, device_info: result, agent });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
};

const getClicks = async (req, res) => {
  try {
    const clicks = await Click.findAll();
    res.json(clicks);
  } catch (error) {}
};

module.exports = { makeClick, getClicks };
