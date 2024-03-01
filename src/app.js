const RedisStore = require("connect-redis").default;
const session = require("express-session");
const routes = require("./routes/v1");
const passport = require("passport");
const express = require("express");
const helmet = require("helmet");
const redis = require("redis");
var morgan = require("morgan");
const cors = require("cors");

var device = require("express-device");
const requestIp = require("request-ip");
const expressip = require("express-ip");

const { Click, ShortLink } = require("./db/models/index");

const app = express();
var useragent = require("express-useragent");
const { makeClick } = require("./controllers/clickController");

require("./config/auth/authConfig");
app.use(morgan("tiny"));
app.use(useragent.express());
app.use(express.json());
// app.set("trust proxy", true);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
    methods: ["GET", "PATCH", "PUT", "POST", "DELETE", "OPTIONS"],
  })
);

// set security HTTP headers
app.use(helmet());

// Connect to MongoDB

//   Session
let redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient
  .connect()
  .then((res) => console.log("redis is connected 💾"))
  .catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: process.env.REDIS_PREFIX,
  ttl: 86400 * 365, //for changing default 24h time to live
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  })
);

// This is the basic express session({..}) initialization.
app.use(passport.initialize());
// init passport on every route call.
app.use(passport.session());

// v1 api routes
app.use("/v1", routes);

app.get("/", (req, res) => {
  res.send("linktink server its running");
});

app.use(expressip().getIpInfoMiddleware);
app.use(device.capture());

app.get("/:id", makeClick);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
