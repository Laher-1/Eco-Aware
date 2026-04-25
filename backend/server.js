require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const multer = require('multer');

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRouts");

const app = express();

// ✅ Enable CORS with credentials so cookies can be shared
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/challenges/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

// ✅ Existing routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

// ✅ Get current user from cookie
app.get("/api/current-user", (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) return res.json({});
  try {
    const decoded = Buffer.from(userCookie, 'base64').toString();
    const user = JSON.parse(decoded);
    res.json(user);
  } catch (err) {
    res.json({});
  }
});

// ✅ Get all users
app.get("/api/all-users", (req, res) => {
  const usersFile = path.join(__dirname, "users.json");
  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }
    res.json(users);
  });
});

// ✅ Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("user");
  res.json({ success: true });
});

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

// ✅ Get challenges
app.get("/api/challenges", (req, res) => {
  const challengesFile = path.join(__dirname, "challenges.json");
  fs.readFile(challengesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let challenges = [];
    try {
      challenges = JSON.parse(data);
    } catch (e) {
      challenges = [];
    }
    res.json(challenges);
  });
});

// ✅ Add challenge
app.post("/api/add-challenge", upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/challenges/${req.file.filename}` : null;
  const challengesFile = path.join(__dirname, "challenges.json");
  fs.readFile(challengesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let challenges = [];
    try {
      challenges = JSON.parse(data);
    } catch (e) {
      challenges = [];
    }
    const newChallenge = {
      id: challenges.length + 1,
      title,
      description,
      progress: 0,
      image
    };
    challenges.push(newChallenge);
    fs.writeFile(challengesFile, JSON.stringify(challenges, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Challenge added successfully!" });
    });
  });
});

// ✅ Delete challenge
app.delete("/api/delete-challenge/:id", (req, res) => {
  const challengeId = parseInt(req.params.id);
  const challengesFile = path.join(__dirname, "challenges.json");
  fs.readFile(challengesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let challenges = [];
    try {
      challenges = JSON.parse(data);
    } catch (e) {
      challenges = [];
    }
    const index = challenges.findIndex(c => c.id === challengeId);
    if (index === -1) return res.status(404).json({ error: "Challenge not found" });
    challenges.splice(index, 1);
    fs.writeFile(challengesFile, JSON.stringify(challenges, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Challenge deleted successfully!" });
    });
  });
});

// ✅ Get user challenge progress
app.get("/api/challenges/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id);
  const usersFile = path.join(__dirname, "users.json");
  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }
    const user = users.find(u => u.user_id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({
      ecopoints: user.eco_points || 0,
      nooftaskscompleted: user.completed_challenges || 0
    });
  });
});

// ✅ Save user challenge progress
app.post("/api/challenges", (req, res) => {
  const { user_id, ecopoints, nooftaskscompleted } = req.body;
  const usersFile = path.join(__dirname, "users.json");
  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }
    const userIndex = users.findIndex(u => u.user_id === user_id);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    users[userIndex].eco_points = ecopoints;
    users[userIndex].completed_challenges = nooftaskscompleted;
    fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true });
    });
  });
});

// ✅ Get user carbon footprint
app.get("/api/footprint/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id);
  const footprintFile = path.join(__dirname, "footprint.json");
  fs.readFile(footprintFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let footprints = [];
    try {
      footprints = JSON.parse(data);
    } catch (e) {
      footprints = [];
    }
    const userFootprints = footprints.filter(f => f.user_id === userId);
    if (userFootprints.length === 0) return res.json({ footprint: null });
    // Get the latest by timestamp, fallback to ID for older entries
    const latest = userFootprints.sort((a,b) => {
      // Both have timestamps - sort by timestamp (newest first)
      if (a.calculated_at && b.calculated_at) {
        return new Date(b.calculated_at) - new Date(a.calculated_at);
      }
      // Only a has timestamp - a comes first (newer)
      if (a.calculated_at && !b.calculated_at) return -1;
      // Only b has timestamp - b comes first (newer)  
      if (!a.calculated_at && b.calculated_at) return 1;
      // Neither has timestamp - sort by ID (higher ID = more recent)
      return b.id - a.id;
    })[0];
    res.json({ footprint: latest.footprint });
  });
});

// ✅ Get scheduled drives
app.get("/api/scheduled-drives", (req, res) => {
  const cleanupFile = path.join(__dirname, "cleanup.json");
  fs.readFile(cleanupFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let drives = [];
    try {
      drives = JSON.parse(data);
    } catch (e) {
      drives = [];
    }
    res.json({ drives });
  });
});

// ✅ Register for drive
app.post("/api/register-drive", (req, res) => {
  const { drive_id, user_id } = req.body;
  const registrationsFile = path.join(__dirname, "registrations.json");
  fs.readFile(registrationsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let registrations = [];
    try {
      registrations = JSON.parse(data);
    } catch (e) {
      registrations = [];
    }
    const existing = registrations.find(r => r.drive_id == drive_id && r.user_id == user_id);
    if (existing) return res.status(400).json({ error: "Already registered" });
    const newReg = {
      id: registrations.length + 1,
      drive_id: parseInt(drive_id),
      user_id: parseInt(user_id)
    };
    registrations.push(newReg);
    fs.writeFile(registrationsFile, JSON.stringify(registrations, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Registered successfully!" });
    });
  });
});

// ✅ Get drive registrations
app.get("/api/drive-registrations", (req, res) => {
  const registrationsFile = path.join(__dirname, "registrations.json");
  fs.readFile(registrationsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let registrations = [];
    try {
      registrations = JSON.parse(data);
    } catch (e) {
      registrations = [];
    }
    res.json(registrations);
  });
});

// ✅ Join drive
app.post("/api/join-drive", (req, res) => {
  const { user_id, drive_id } = req.body;
  if (!user_id || !drive_id) return res.status(400).json({ error: "Missing user_id or drive_id" });

  const registrationsFile = path.join(__dirname, "registrations.json");
  fs.readFile(registrationsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let registrations = [];
    try {
      registrations = JSON.parse(data);
    } catch (e) {
      registrations = [];
    }
    const newRegistration = {
      id: registrations.length + 1,
      user_id: parseInt(user_id),
      drive_id: parseInt(drive_id),
      registration_time: new Date().toISOString()
    };
    registrations.push(newRegistration);
    fs.writeFile(registrationsFile, JSON.stringify(registrations, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Save error" });
      res.json({ message: "Joined successfully", registration: newRegistration });
    });
  });
});

// ✅ All users
app.get("/api/all-users", (req, res) => {
  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }
    res.json(users);
  });
});

// ✅ User record
app.post("/api/user-record", (req, res) => {
  const { user_id, name } = req.body;
  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }
    const user = users.find(u => u.user_id == user_id || u.name === name);
    if (!user) return res.status(404).json({ error: "User not found" });
    fs.readFile(footprintFile, "utf8", (err, data2) => {
      if (err) return res.status(500).json({ error: "File error" });
      let results = [];
      try {
        results = JSON.parse(data2);
      } catch (e) {
        results = [];
      }
      const userResults = results.filter(r => r.user_id == user.user_id);
      res.json({ user, results: userResults });
    });
  });
});

// ✅ Save calculator result with EcoPoints
app.post("/api/saveResult", (req, res) => {
  const { footprint, user_id, ecoPoints } = req.body;

  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  const footprintFile = path.join(__dirname, "footprint.json");
  fs.readFile(footprintFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });

    let results = [];
    try {
      results = JSON.parse(data);
    } catch (e) {
      results = [];
    }

    const newResult = {
      id: results.length + 1,
      footprint: parseFloat(footprint),
      user_id: parseInt(user_id),
      eco_points: parseInt(ecoPoints),
      calculated_at: new Date().toISOString()
    };
    results.push(newResult);

    fs.writeFile(footprintFile, JSON.stringify(results, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Result and EcoPoints saved successfully!" });
    });
  });
});

// ✅ Fetch monthly results
app.get("/api/monthlyResults", (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(calculated_on, '%Y-%m') AS month,
           AVG(footprint) AS avg_footprint,
           AVG(eco_points) AS avg_ecopoints,
           COUNT(*) AS entries
    FROM footprint_results
    GROUP BY month
    ORDER BY month DESC;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// ✅ Fetch all users
app.get("/api/users", (req, res) => {
  const sql = "SELECT user_id, name, email, role FROM users";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// ✅ Delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE user_id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "User deleted successfully!" });
  });
});

// ✅ Fetch single user record with stats
app.post("/api/user-record", (req, res) => {
  const { user_id, name } = req.body;
  const sql = `
    SELECT u.user_id, u.name, u.email, u.role,
           COALESCE(COUNT(c.challenge_id), 0) AS completed_challenges,
           COALESCE(SUM(c.points), 0) AS challenge_points,
           COALESCE(SUM(f.footprint), 0) AS carbon_reduced,
           COALESCE(SUM(f.eco_points), 0) AS eco_points,
           COALESCE(MAX(r.streak), 0) AS recycling_streak
    FROM users u
    LEFT JOIN user_challenges uc ON u.user_id = uc.user_id AND uc.completed = 1
    LEFT JOIN challenges c ON uc.challenge_id = c.challenge_id
    LEFT JOIN footprint_results f ON u.user_id = f.user_id
    LEFT JOIN recycling r ON u.user_id = r.user_id
    WHERE u.user_id = ? AND u.name = ?
    GROUP BY u.user_id, u.name, u.email, u.role;
  `;
  db.query(sql, [user_id, name], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  });
});

// ✅ Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("user");
  res.json({ success: true, message: "Logged out successfully" });
});

// ✅ Save quiz results
app.post("/api/quiz-results", (req, res) => {
  const { user_id, score, ecoPoints, quiz_time } = req.body;

  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  const sql = "INSERT INTO quiz_results (user_id, score, eco_points, quiz_time) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, score, ecoPoints, quiz_time], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

// ✅ Fetch quiz results for a user
app.get("/api/quiz-results/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM quiz_results WHERE user_id = ? ORDER BY quiz_time DESC";
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// ✅ Save challenge progress
app.post("/api/challenges", (req, res) => {
  const { user_id, ecopoints, nooftaskscompleted } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  const sql = `
    INSERT INTO challenges (user_id, ecopoints, nooftaskscompleted)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      ecopoints = VALUES(ecopoints),
      nooftaskscompleted = VALUES(nooftaskscompleted)
  `;

  db.query(sql, [user_id, ecopoints, nooftaskscompleted], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "Challenge progress saved!" });
  });
});

// ✅ Fetch challenge progress for a user
app.get("/api/challenges/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM challenges WHERE user_id = ?";
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows[0] || {});
  });
});

// ✅ Return current logged-in user from cookie/session
app.get("/api/current-user", (req, res) => {
  if (!req.cookies.user) {
    return res.json({});
  }

  try {
    // Decode Base64 back to JSON string
    const decoded = Buffer.from(req.cookies.user, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);

    const userId = parsed.user_id;
    const sql = "SELECT user_id, name, email, role FROM users WHERE user_id = ?";
    db.query(sql, [userId], (err, rows) => {
      if (err) {
        console.error("❌ Error fetching user:", err);
        return res.status(500).json({ error: err });
      }
      if (rows.length === 0) return res.json({});
      res.json(rows[0]); // return user object
    });
  } catch (error) {
    console.error("❌ Error decoding cookie:", error);
    return res.status(400).json({ error: "Invalid cookie data" });
  }
});


// ✅ Schedule a drive
app.post("/api/schedule-drive", (req, res) => {
  let { title, date, time } = req.body;

  // Normalize time to HH:MM:SS
  if (time && time.length === 5) {
    time = time + ":00";
  }

  // Normalize date if sent as MM/DD/YYYY
  if (date && date.includes("/")) {
    const [month, day, year] = date.split("/");
    date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const sql = "INSERT INTO cleanup_drive (title, date, time) VALUES (?, ?, ?)";
  db.query(sql, [title, date, time], (err, result) => {
    if (err) {
      console.error("❌ Error inserting drive:", err);
      return res.status(500).send("Error scheduling drive");
    }
    res.json({ success: true, message: "Drive scheduled successfully!", id: result.insertId });
  });
});

// ✅ Fetch scheduled drives
app.get("/api/scheduled-drives", (req, res) => {
  const sql = "SELECT * FROM cleanup_drive ORDER BY date ASC, time ASC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error fetching drives:", err);
      return res.status(500).json({ error: "Error fetching drives" });
    }
    res.json({ drives: rows });
  });
});

// ✅ Quiz Management Endpoints
// Get all quiz questions
app.get("/api/quiz", (req, res) => {
  const quizFile = path.join(__dirname, "quiz.json");
  fs.readFile(quizFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });
    let questions = [];
    try {
      questions = JSON.parse(data);
    } catch (e) {
      questions = [];
    }
    res.json(questions);
  });
});

// Add new quiz question
app.post("/api/quiz", (req, res) => {
  const { question, options, answer } = req.body;

  if (!question || !options || !answer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const quizFile = path.join(__dirname, "quiz.json");
  fs.readFile(quizFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });

    let questions = [];
    try {
      questions = JSON.parse(data);
    } catch (e) {
      questions = [];
    }

    const newQuestion = {
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
      question,
      options,
      answer
    };

    questions.push(newQuestion);

    fs.writeFile(quizFile, JSON.stringify(questions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Question added successfully!", question: newQuestion });
    });
  });
});

// Update quiz question
app.put("/api/quiz/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const { question, options, answer } = req.body;

  if (!question || !options || !answer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const quizFile = path.join(__dirname, "quiz.json");
  fs.readFile(quizFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });

    let questions = [];
    try {
      questions = JSON.parse(data);
    } catch (e) {
      questions = [];
    }

    const index = questions.findIndex(q => q.id === questionId);
    if (index === -1) return res.status(404).json({ error: "Question not found" });

    questions[index] = { id: questionId, question, options, answer };

    fs.writeFile(quizFile, JSON.stringify(questions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Question updated successfully!" });
    });
  });
});

// Delete quiz question
app.delete("/api/quiz/:id", (req, res) => {
  const questionId = parseInt(req.params.id);

  const quizFile = path.join(__dirname, "quiz.json");
  fs.readFile(quizFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });

    let questions = [];
    try {
      questions = JSON.parse(data);
    } catch (e) {
      questions = [];
    }

    const index = questions.findIndex(q => q.id === questionId);
    if (index === -1) return res.status(404).json({ error: "Question not found" });

    questions.splice(index, 1);

    fs.writeFile(quizFile, JSON.stringify(questions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Question deleted successfully!" });
    });
  });
});

// ✅ Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});