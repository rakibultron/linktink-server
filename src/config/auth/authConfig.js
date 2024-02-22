const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { User } = require("../../db/models");

passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_BASE_URL}/v1/auth/user/google/callback`,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // console.log({ profile });
        const user = await User.findOne({
          where: { email: profile._json.email },
        });
        if (!user) {
          const newUser = await User.create({
            first_name: profile.displayName,
            last_name: "Doe",
            email: profile._json.email,
          });

          done(null, newUser);
        } else {
          done(null, user);
        }
      } catch (error) {
        console.log({ error });
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});
