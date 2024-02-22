require("dotenv").config();
const env = {
  db: {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  },
};
// console.log(env);
module.exports = env;
