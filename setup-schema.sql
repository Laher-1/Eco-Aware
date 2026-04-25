-- EcoAware Database Schema
-- Run this script to set up the database tables

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS footprint_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  footprint DECIMAL(10,2),
  user_id INT,
  eco_points INT
);

CREATE TABLE IF NOT EXISTS cleanup_drive (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  date DATE,
  time TIME
);

-- Insert sample data (optional)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@ecoaware.com', '$2b$10$n7AdhxocP0EFOMTFDKQDTu69tfKSF.kQG3Wc2UWPVx1G8izseGknK', 'admin'),
('Test User', 'user@ecoaware.com', '$2b$10$n7AdhxocP0EFOMTFDKQDTu69tfKSF.kQG3Wc2UWPVx1G8izseGknK', 'user');