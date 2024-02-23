const { Sequelize, DataTypes } = require("sequelize");
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

const User = require("./user")(sequelize, DataTypes);
const Project = require("./project")(sequelize, DataTypes);
const ShortLink = require("./shortlink")(sequelize, DataTypes);
const Click = require("./click")(sequelize, DataTypes);

User.hasMany(Project, { foreignKey: "project_by" });
Project.belongsTo(User, { foreignKey: "project_by" });

Project.hasMany(ShortLink, { foreignKey: "project_id" });
ShortLink.belongsTo(Project, { foreignKey: "project_id" });

ShortLink.hasMany(Click, { foreignKey: "shortlink_id" });
Click.belongsTo(ShortLink, { foreignKey: "shortlink_id" });

module.exports = { sequelize, User, Project, ShortLink, Click };
