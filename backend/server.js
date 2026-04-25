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
  db.query("SELECT user_id, name, email, role FROM users ORDER BY user_id", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
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
  db.query("SELECT * FROM eco_challenges ORDER BY id", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// ✅ Add challenge
app.post("/api/add-challenge", upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/challenges/${req.file.filename}` : null;

  db.query(
    "INSERT INTO eco_challenges (title, description, image) VALUES (?, ?, ?)",
    [title, description, image],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, message: "Challenge added successfully!" });
    }
  );
});

// ✅ Delete challenge
app.delete("/api/delete-challenge/:id", (req, res) => {
  const challengeId = parseInt(req.params.id);

  db.query("DELETE FROM eco_challenges WHERE id = ?", [challengeId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Challenge not found" });
    res.json({ success: true, message: "Challenge deleted successfully!" });
  });
});

// ✅ Get user challenge progress
app.get("/api/challenges/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id);

  // Get user's eco points and completed challenges from users table
  db.query("SELECT eco_points, completed_challenges FROM users WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    res.json({
      ecopoints: user.eco_points || 0,
      nooftaskscompleted: user.completed_challenges || 0
    });
  });
});

// ✅ Save user challenge progress
app.post("/api/challenges", (req, res) => {
  const { user_id, ecopoints, nooftaskscompleted } = req.body;

  db.query(
    "UPDATE users SET eco_points = ?, completed_challenges = ? WHERE user_id = ?",
    [ecopoints, nooftaskscompleted, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
      res.json({ success: true });
    }
  );
});

// ✅ Get user carbon footprint
app.get("/api/footprint/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id);

  db.query(
    "SELECT footprint FROM footprint_results WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.json({ footprint: null });
      res.json({ footprint: results[0].footprint });
    }
  );
});

// ✅ Get scheduled drives
app.get("/api/scheduled-drives", (req, res) => {
  db.query("SELECT * FROM cleanup_drive ORDER BY date", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ drives: results });
  });
});

// ✅ Register for drive
app.post("/api/register-drive", (req, res) => {
  const { drive_id, user_id } = req.body;

  if (!drive_id || !user_id) {
    return res.status(400).json({ error: "Missing drive_id or user_id" });
  }

  // Check if already registered
  db.query(
    "SELECT * FROM drive_registrations WHERE user_id = ? AND drive_id = ?",
    [user_id, drive_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ error: "Already registered" });
      }

      // Register for the drive
      db.query(
        "INSERT INTO drive_registrations (user_id, drive_id) VALUES (?, ?)",
        [user_id, drive_id],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Database error" });

          res.json({
            success: true,
            message: "Registered successfully!",
            registration: {
              id: result.insertId,
              user_id: parseInt(user_id),
              drive_id: parseInt(drive_id)
            }
          });
        }
      );
    }
  );
});

// ✅ Get drive registrations
app.get("/api/drive-registrations", (req, res) => {
  db.query(
    `SELECT dr.*, u.name as user_name, u.email, cd.title as drive_title, cd.date, cd.time
     FROM drive_registrations dr
     JOIN users u ON dr.user_id = u.user_id
     JOIN cleanup_drive cd ON dr.drive_id = cd.id
     ORDER BY dr.registration_time DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// ✅ Join drive (alternative endpoint)
app.post("/api/join-drive", (req, res) => {
  const { user_id, drive_id } = req.body;

  if (!user_id || !drive_id) {
    return res.status(400).json({ error: "Missing user_id or drive_id" });
  }

  // Check if already registered
  db.query(
    "SELECT * FROM drive_registrations WHERE user_id = ? AND drive_id = ?",
    [user_id, drive_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ error: "Already registered for this drive" });
      }

      // Register for the drive
      db.query(
        "INSERT INTO drive_registrations (user_id, drive_id) VALUES (?, ?)",
        [user_id, drive_id],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Database error" });

          res.json({
            message: "Joined successfully",
            registration: {
              id: result.insertId,
              user_id: parseInt(user_id),
              drive_id: parseInt(drive_id),
              registration_time: new Date()
            }
          });
        }
      );
    }
  );
});



// ✅ User record
app.post("/api/user-record", (req, res) => {
  const { user_id, name } = req.body;

  if (!user_id && !name) {
    return res.status(400).json({ error: "Missing user_id or name" });
  }

  // Find user
  const userQuery = user_id
    ? "SELECT * FROM users WHERE user_id = ?"
    : "SELECT * FROM users WHERE name = ?";

  const userParam = user_id || name;

  db.query(userQuery, [userParam], (err, userResults) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResults[0];

    // Get user's footprint results
    db.query(
      "SELECT * FROM footprint_results WHERE user_id = ? ORDER BY id DESC",
      [user.user_id],
      (err, footprintResults) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ user, results: footprintResults });
      }
    );
  });
});

// ✅ Save calculator result with EcoPoints
app.post("/api/saveResult", (req, res) => {
  const { footprint, user_id, ecoPoints } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  db.query(
    "INSERT INTO footprint_results (footprint, user_id, eco_points) VALUES (?, ?, ?)",
    [parseFloat(footprint), parseInt(user_id), parseInt(ecoPoints)],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, message: "Result and EcoPoints saved successfully!" });
    }
  );
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