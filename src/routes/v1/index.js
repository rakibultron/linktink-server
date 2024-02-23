const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const projectRoute = require("./projectRoute");

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
