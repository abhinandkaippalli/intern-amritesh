require("dotenv").config();
const cors = require("cors");
const config = require("./config.json");
const mongoose = require("mongoose");


mongoose.connect(config.connectionString);
const bcrypt = require("bcryptjs");

const User = require("./models/user.model");

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ data: "hlo" });
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

//signup
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({ error: true, message: "Full name required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password,
  });
  await user.save();
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

app.get("/get-user", authenticateToken, async (req, res) => {
  console.log(req.user);  // Log the decoded user info from the token
  const userId = req.user.user._id;  // Extract _id from req.user.user

  try {
    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
      return res.status(401).json({ error: true, message: "User not found" });
    }

    return res.json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message: "User details retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (password !== userInfo.password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const accessToken = jwt.sign(
    { user: userInfo },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );

  return res.json({
    error: false,
    user: userInfo,
    accessToken,
    message: "Login successful",
  });
});

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});

module.exports = app;
