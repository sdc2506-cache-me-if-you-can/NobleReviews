require("dotenv").config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'reviews_db'
});

module.exports = connection;