require("dotenv").config();
const env = require("./envConfig");

const { db } = env;

module.exports = {
  development: db.development,
  test: {
    // Test environment configuration
  },
  production: {
    // Production environment configuration
  },
};
