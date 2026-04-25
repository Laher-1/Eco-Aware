// controllers/taskController.js
const fs = require("fs");
const path = require("path");

const cleanupFile = path.join(__dirname, "..", "cleanup.json");

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

  fs.readFile(cleanupFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });

    let drives = [];
    try {
      drives = JSON.parse(data);
    } catch (e) {
      drives = [];
    }

    const newDrive = {
      id: drives.length + 1,
      title,
      date,
      time,
      location: location || "Location not specified"
    };
    drives.push(newDrive);

    fs.writeFile(cleanupFile, JSON.stringify(drives, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "File write error" });
      res.json({ success: true, message: "Drive scheduled successfully!", id: newDrive.id });
    });
  });
};

// ✅ Fetch scheduled drives
const getScheduledDrives = (req, res) => {
  fs.readFile(cleanupFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "File error" });

    let drives = [];
    try {
      drives = JSON.parse(data);
    } catch (e) {
      drives = [];
    }

    drives.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

    res.json({ drives });
  });
};

module.exports = { scheduleDrive, getScheduledDrives };
