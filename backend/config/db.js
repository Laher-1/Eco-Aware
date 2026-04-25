const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// MySQL connection configuration
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecoaware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release();
});

module.exports = db;

// Initialize tables
const initTables = () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(50)
    )`,

    `CREATE TABLE IF NOT EXISTS footprint_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      footprint DECIMAL(10,2),
      user_id INT,
      eco_points INT
    )`,

    `CREATE TABLE IF NOT EXISTS cleanup_drive (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      date DATE,
      time TIME
    )`
  ];

  queries.forEach((query, index) => {
    db.query(query, (err) => {
      if (err) {
        console.log(`Error creating table ${index + 1}:`, err.message);
      } else {
        console.log(`Table ${index + 1} created successfully`);
      }
    });
  });
};

// Initialize tables when connection is established
db.on('connect', () => {
  initTables();
});

module.exports = db;