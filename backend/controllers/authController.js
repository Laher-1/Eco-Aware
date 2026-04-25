const bcrypt = require("bcryptjs");
const db = require("../config/db");

// REGISTER
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("Register attempt:", { name, email, role });

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        const userId = result.insertId;

        // If user is admin, add to admin_users table
        if (role === 'admin') {
          db.query(
            "INSERT INTO admin_users (user_id, admin_level, permissions) VALUES (?, 'standard', 'full_access')",
            [userId],
            (err) => {
              if (err) console.log("Error adding to admin_users:", err);
            }
          );
        }

        // ✅ Encode cookie payload in Base64
        const payload = JSON.stringify({ user_id: userId, name, email, role });
        const base64Payload = Buffer.from(payload).toString("base64");

        res.cookie("user", base64Payload, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true
        });

        res.json({
          success: true,
          message: "User registered successfully!",
          user: { user_id: userId, name, email, role }
        });
      }
    );
  });
};


// LOGIN
exports.login = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const user = role ? results.find((u) => u.role === role) : results[0];

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Encode cookie payload in Base64
    const payload = JSON.stringify({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    const base64Payload = Buffer.from(payload).toString("base64");

    res.cookie("user", base64Payload, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};

// CURRENT USER
exports.currentUser = (req, res) => {
  if (!req.cookies || !req.cookies.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    // Decode Base64 back to JSON
    const decoded = Buffer.from(req.cookies.user, "base64").toString("utf8");
    const user = JSON.parse(decoded);

    res.json(user); // return user object directly
  } catch (err) {
    res.status(400).json({ message: "Invalid cookie data" });
  }
};

