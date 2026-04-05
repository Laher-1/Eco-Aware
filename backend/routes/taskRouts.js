const express = require("express");
const router = express.Router();

const {scheduleDrive, getScheduledDrives} = require("../controllers/taskController");

router.post("/schedule-drive",scheduleDrive);
router.get("/scheduled-drives",getScheduledDrives);

module.exports = router;