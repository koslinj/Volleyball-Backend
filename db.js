const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const client = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: true
});

module.exports = { client }
