const routes = require("./routes/v1");
const express = require("express");
const helmet = require("helmet");
var morgan = require("morgan");
const cors = require("cors");
const app = express();
require("./config/envConfig");

app.use(morgan("tiny"));

app.use(express.json());
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

// v1 api routes
app.use("/v1", routes);

app.get("/", (req, res) => {
  res.send("girlsglitter server its running");
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
