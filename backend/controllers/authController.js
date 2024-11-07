const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config");

async function signup(req, res) {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  if (!["admin", "manager", "employee"].includes(role)) {
    return res.status(400).json({ error: true, message: "Invalid role" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword, role });
  await user.save();

  return res.json({ error: false, user, message: "Registration successful" });
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, userInfo.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid password" });

    const accessToken = jwt.sign({ _id: userInfo._id, role: userInfo.role }, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ _id: userInfo._id, role: userInfo.role }, REFRESH_TOKEN_SECRET, { expiresIn: "1h" });

    req.session.refreshToken = refreshToken;

    res.json({
      error: false,
      user: { fullName: userInfo.fullName, email: userInfo.email, role: userInfo.role },
      accessToken,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
}

function refreshToken(req, res) {
  const { refreshToken } = req.session;
  if (!refreshToken) return res.status(403).json({ message: "Refresh token not found, please login again" });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token expired or invalid:", err);
      req.session.destroy();
      res.clearCookie("connect.sid");
      return res.status(403).json({ message: "Invalid or expired refresh token, please login again" });
    }

    const newAccessToken = jwt.sign({ _id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    res.json({ accessToken: newAccessToken });
  });
}

module.exports = { signup, login, logout, refreshToken };
