const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',  // Ganti dengan host database Anda
    user: 'root',       // Username MySQL
    password: '',       // Password MySQL
    database: 'pti_db' // Nama database
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;
