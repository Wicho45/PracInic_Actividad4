// const MySQL = require("mysql2/promise"); 
// require('dotenv').config();

// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost'
// }

const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Prainic1',
  database: process.env.DB_NAME || 'praini',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
