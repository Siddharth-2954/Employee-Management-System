const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: "Error creating user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token with expiration
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role, 
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response
    res.status(200).json({ 
      success: true,
      token,
      role: user.role, 
      username: user.username,
      userId: user._id
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Verify token route
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ 
    message: "Token is valid",
    user: {
      role: req.user.role,
      username: req.user.username,
      userId: req.user.userId
    }
  });
});

// Logout route
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
