// const mysql = require('mysql2');
// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error conectando a la BD:', err);
//     return;
//   }
//   console.log('Conectado a MySQL');
// });

// module.exports = connection;

const mysql = require('mysql2');
require('dotenv').config();

// Crear conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prainic_db',
    port: process.env.DB_PORT || 3306
});

// Conectar a la base de datos
connection.connect((error) => {
    if (error) {
        console.error('Error conectando a la base de datos:', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;

