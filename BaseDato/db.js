const MySQL = require("mysql2/promise"); 
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost'
}