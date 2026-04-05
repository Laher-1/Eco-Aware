const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'ecoaware.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to SQLite at", dbPath);
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS footprint_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    footprint REAL,
    user_id INTEGER,
    eco_points INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cleanup_drive (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    time TEXT
  )`);
});

module.exports = db;