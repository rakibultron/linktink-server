const { Sequelize } = require("sequelize");
const env = require("../../config/envConfig");
const { db } = env;

let sequelize;

if (process.env.APP_STATUS == "DEV") {
  sequelize = new Sequelize(db.development);
}

try {
  sequelize.authenticate();
  console.log("Database Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = { sequelize };
