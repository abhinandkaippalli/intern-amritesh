const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/user.model");
const { authenticateToken } = require("./utilities");

const app = express();
const config = require("./config.json");

// MongoDB 
mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());

// CORS with credentials (allow cookies)
app.use(
  cors({
    origin: "http://localhost:5000", 
    credentials: true, 
  })
);

// Session 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({ mongoUrl: config.connectionString }), 
  })
);

app.get("/", (req, res) => {
  res.json({ data: "API is running..." });
});

// Signup 
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  req.session.refreshToken = refreshToken; // Store refresh token in session

  return res.json({
    error: false,
    user,
    accessToken,
    refreshToken,
    message: "Registration successful",
  });
});

// Login 
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, userInfo.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const accessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  const refreshToken = jwt.sign({ user: userInfo }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  req.session.refreshToken = refreshToken;

  return res.json({
    error: false,
    user: userInfo,
    accessToken,
    refreshToken,
    message: "Login successful",
  });
});

// Refresh Token 
app.post("/refresh-token", (req, res) => {
  const refreshToken = req.session.refreshToken; 
  if (!refreshToken) return res.status(403).json({ message: "No refresh token found in session" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });

    res.json({
      accessToken: newAccessToken,
    });
  });
});

// Get User 
app.get("/get-user", authenticateToken, async (req, res) => {
  const userId = req.user.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout 
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});

module.exports = app;
