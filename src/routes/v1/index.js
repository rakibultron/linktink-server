const express = require("express");
const router = express.Router();

const test = require("./testRoute");
const defaultRoutes = [
  {
    path: "/test",
    route: test,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
