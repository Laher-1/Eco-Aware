-- Migration Script: Import data from JSON files to MySQL
-- Run this script to populate the database with existing data

-- Insert users data
INSERT IGNORE INTO users (user_id, name, email, password, role) VALUES
(1, 'laher', 'laher@gmail.com', '$2b$10$/BMfBYw0QftnqxSxI/XEO.3h7i8Ra6h1T.ZKtAIpKVp3jtBp.AJD2', 'admin'),
(2, 'John', 'john@gmail.com', '$2b$10$b7Q37eIXxvRmoZihqg8QS.g8r4zDP317SeXYwy3jezELrHA8l8Cjm', 'user'),
(3, 'xyz', 'xyz@gmail.com', '$2b$10$CxmSvTQSYeak49J95EjFd.ITACFhs6QVHw3nywM0sCer4phjzdCuG', 'user'),
(4, 'abc', 'abc@gmail.com', '$2b$10$0Fnt.zg8WvW.FfzTyT.jIex4AW9i0berMIX/TrK/HyINMg0XRrjH6', 'user'),
(5, 'Test User', 'test@gmail.com', '$2b$10$7nm2dM.YHxbc4roOHOFeSeYvtolmMfoudmxJPlbj0LKnEE3ni2z66', 'user'),
(6, 'ketki', 'ketki@gmail.com', '$2b$10$RLpEWlEB5zON9/eP9gy30ufgk4Kiyt6Q0.Etn9q1.tytgVHzCleMq', 'user'),
(7, 'nandini', 'nandini@gmail.com', '$2b$10$0FEInoHOtLgdxOsXQjz.7.yCTquRKK9/3CviLeHn8T0rTnFBpugZW', 'admin');

-- Insert footprint results data
INSERT IGNORE INTO footprint_results (id, footprint, user_id, eco_points) VALUES
(1, 85.5, 5, 4),
(2, 92.3, 5, 3),
(3, 78.1, 5, 5),
(4, 203.0, 3, 1),
(5, 140.0, 3, 2),
(6, 137.0, 1, 2),
(7, 150.0, 1, 2),
(8, 138.0, 3, 2);

-- Insert cleanup drive data
INSERT IGNORE INTO cleanup_drive (id, title, date, time) VALUES
(1, 'Marine Drive', '2026-06-15', '08:00:00'),
(2, 'juhu beach', '2026-05-15', '08:00:00'),
(3, 'Ganga River banks', '2026-07-12', '08:00:00');