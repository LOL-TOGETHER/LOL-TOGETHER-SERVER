const knex = require("knex");
const db = knex({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    database: "loltogether",
    password: process.env.DB_PASSWORD,
  },
});

module.exports = db;
