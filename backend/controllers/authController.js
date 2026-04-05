const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "..", "users.json");

// REGISTER
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("Register attempt:", { name, email, role });

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "File error" });

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      user_id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role
    };
    users.push(newUser);

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ message: "File write error" });

      // ✅ Encode cookie payload in Base64
      const payload = JSON.stringify({ user_id: newUser.user_id, name, email, role });
      const base64Payload = Buffer.from(payload).toString("base64");

      res.cookie("user", base64Payload, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      res.json({ success: true, message: "User registered successfully!", user: { user_id: newUser.user_id, name, email, role } });
    });
  });
};


// LOGIN
exports.login = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  fs.readFile(usersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "File error" });

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }

    const user = users.find(u => u.email === email && u.role === role);
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    // ✅ Encode cookie payload in Base64
    const payload = JSON.stringify({ user_id: user.user_id, name: user.name, email: user.email, role: user.role });
    const base64Payload = Buffer.from(payload).toString("base64");

    res.cookie("user", base64Payload, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    res.json({
      success: true,
      user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role }
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

