const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
