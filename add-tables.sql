-- Add new tables and migrate data
-- Run this script to add eco_challenges, drive_registrations, and separate admin/user tables

-- Create eco_challenges table
CREATE TABLE IF NOT EXISTS eco_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  progress INT DEFAULT 0,
  image VARCHAR(500)
);

-- Create drive_registrations table
CREATE TABLE IF NOT EXISTS drive_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  drive_id INT NOT NULL,
  registration_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (drive_id) REFERENCES cleanup_drive(id) ON DELETE CASCADE
);

-- Create separate admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE,
  admin_level VARCHAR(50) DEFAULT 'standard',
  permissions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create separate regular_users table (optional - can keep users as is and use role field)
-- For now, we'll keep the existing users table and use the role field to distinguish

-- Insert eco challenges data
INSERT IGNORE INTO eco_challenges (id, title, description, progress, image) VALUES
(1, 'No Plastic Week', 'Avoid using plastic for one full week.', 0, '/uploads/challenges/no_plastic_week.jpg'),
(2, 'Plant a Tree', 'Plant at least one tree this week.', 0, '/uploads/challenges/plant_tree.jpg'),
(4, 'Participate in Cleanup Drive', 'Join a local cleanup drive this week.', 0, '/uploads/challenges/cleanup_drive.jpg'),
(5, 'Switch Off Lights', 'Practice energy saving by switching off lights when not in use throughout the week.', 0, '/uploads/challenges/switch_off_lights.jpg'),
(6, 'Use Public Transport', 'Commit to using public transport or carpooling at least 7 times this week.', 0, '/uploads/challenges/public_transport.jpeg'),
(7, 'Recycle Weekly Waste', 'Segregate and recycle household waste for the entire week.', 0, '/uploads/challenges/recycle_waste.jpg'),
(8, 'Save Water Weekly', 'Save water', 0, NULL),
(9, 'Bike to Work', 'Use a bicycle for commuting at least 3 times this week.', 0, NULL);

-- Insert drive registrations data
INSERT IGNORE INTO drive_registrations (id, user_id, drive_id, registration_time) VALUES
(1, 1, 1, '2026-03-31 10:25:14'),
(2, 3, 1, '2026-03-31 10:25:54'),
(3, 3, 1, '2026-04-05 18:37:01'),
(4, 3, 1, '2026-04-05 18:37:26'),
(5, 3, 1, '2026-04-17 08:41:47'),
(6, 3, 2, '2026-04-17 08:41:51'),
(7, 3, 2, '2026-04-17 10:15:44');

-- Insert admin users (users with role 'admin')
INSERT IGNORE INTO admin_users (user_id, admin_level, permissions)
SELECT user_id, 'standard', 'full_access'
FROM users
WHERE role = 'admin';

-- Add user progress tracking table for challenges
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  challenge_id INT NOT NULL,
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES eco_challenges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_challenge (user_id, challenge_id)
);