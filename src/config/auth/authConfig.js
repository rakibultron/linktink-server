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
      console.log({ profile });

      try {
        const { name, given_name, family_name, email } = profile._json;
        console.log({ name, given_name, family_name, email });

        const user = await User.findOne({
          where: { oauth_id: profile.id },
        });

        if (user) {
          done(null, user);
        } else {
          const newUser = await User.create({
            first_name: given_name,
            last_name: family_name,
            email: email,
            oauth_id: profile.id,
            full_name: name,
          });
          done(null, newUser);
        }
      } catch (error) {
        console.log({ error });
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
