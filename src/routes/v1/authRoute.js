// const { registerUser } = require("../../controllers/userController");
const passport = require("passport");
const express = require("express");
const router = express.Router();
const registerUser = () => {};
router.get("/user/register", registerUser);

router.get(
  "/user/google",
  passport.authenticate("google-user", {
    scope: ["profile email"],
    prompt: "select_account",
    state: true,
  })
);

router.get(
  "/user/google/callback",
  passport.authenticate("google-user", {
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`,
  }),
  (req, res) => {
    // Successful authentication, redirect home.

    // res.json()
    // console.log('passport =>authenticate ',  req)
    console.log("admin user =====> authenticate", req.user);
    if (req.user.role === "admin") {
      res.redirect(`${process.env.FRONTEND_BASE_URL}`);
    } else {
      res.redirect(`${process.env.FRONTEND_BASE_URL}`);
    }

    // res.redirect(`${process.env.FRONTEND_BASE_URL}/admin/dashboard`)

    // if (req.user.role === 'admin') {
    //   res.redirect(`${process.env.FRONTEND_BASE_URL}/admin/dashboard`)
    // } else {
    //   console.log('user is not logged in')
    // }
    // res.redirect('exp://192.168.0.110:8081')
  }
);

router.get("/check/user", async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
    return next();
  } else {
    res.json("Not authorized");
    console.log("Not auth");
  }
});

router.get("/user/logout", (req, res, next) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.json("Logged out");
  });
  req.session.destroy(function (err) {
    if (!err) {
      res
        .status(200)
        .clearCookie("connect.sid", { path: "/" })
        .json({ status: "Success" });
    } else {
      // handle error case...
    }
  });
});

module.exports = router;
