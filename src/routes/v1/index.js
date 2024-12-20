const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const projectRoute = require("./projectRoute");
const shortLinkRoute = require("./shortLinkRoute");
const clickRoute = require("./clickRoute");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/projects",
    route: projectRoute,
  },
  {
    path: "/shortlinks",
    route: shortLinkRoute,
  },
  {
    path: "/clicks",
    route: clickRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
