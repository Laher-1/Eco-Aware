// controllers/taskController.js
const db = require("../config/db");

// ✅ Schedule a drive
const scheduleDrive = (req, res) => {
  let { title, date, time, location } = req.body;

  // Normalize time to HH:MM:SS
  if (time && time.length === 5) {
    time = time + ":00";
  }

  // Normalize date if sent as MM/DD/YYYY
  if (date && date.includes("/")) {
    const [month, day, year] = date.split("/");
    date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  db.query(
    "INSERT INTO cleanup_drive (title, date, time) VALUES (?, ?, ?)",
    [title, date, time],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, message: "Drive scheduled successfully!", id: result.insertId });
    }
  );
};

// ✅ Fetch scheduled drives
const getScheduledDrives = (req, res) => {
  db.query("SELECT * FROM cleanup_drive ORDER BY date ASC, time ASC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ drives: results });
  });
};

module.exports = { scheduleDrive, getScheduledDrives };
