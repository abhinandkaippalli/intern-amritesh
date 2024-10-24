const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const User = require("./models/user.model");
const Employee = require('./models/employee.model');
const Department = require('./models/department.model');
const { authenticateToken } = require("./utilities");

const app = express();
const config = require("./config.json");

// MongoDB Connection
mongoose.connect(config.connectionString);


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
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({ mongoUrl: config.connectionString }), 
  })
);

app.get("/", (req, res) => {
  res.json({ data: "API is running..." });
});

// Signup 
app.post("/create-account", async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  if (!['admin', 'manager', 'employee'].includes(role)) {
    return res.status(400).json({ error: true, message: "Invalid role" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword, role });
  await user.save();

  return res.json({
    error: false,
    user,
    message: "Registration successful",
  });
});

// Login 
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, userInfo.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Make sure the role is part of the token payload
  const accessToken = jwt.sign({ _id: userInfo._id, role: userInfo.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  const refreshToken = jwt.sign({ _id: userInfo._id, role: userInfo.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "2h" });

  req.session.refreshToken = refreshToken;

  return res.json({
    error: false,
    user: {
      fullName: userInfo.fullName,
      email: userInfo.email,
      role: userInfo.role,  // Ensure role is included in response
    },
    accessToken,
    refreshToken,
    message: "Login successful",
  });
});

// Create Department (Admin Only)
app.post("/add-department", authenticateToken, async (req, res) => {
  const { name, description } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can create departments" });
  }

  try {
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = new Department({ name, description });
    await department.save();
    res.json({ message: "Department created successfully", department });
  } catch (error) {
    console.error("Error creating department:", error);  // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: error.message || error });
  }
});


// Refresh Token 
app.post("/refresh-token", (req, res) => {
  const refreshToken = req.session.refreshToken;
  if (!refreshToken) return res.status(403).json({ message: "No refresh token found in session" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // Ensure new token has _id and role
    const newAccessToken = jwt.sign({ _id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });

    res.json({
      accessToken: newAccessToken,
    });
  });
});

// Get User 
app.get("/get-user", authenticateToken, async (req, res) => {
  const userId = req.user._id;
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

// Add Employee
// Add Employee (Admin only)
app.post("/add-employee", authenticateToken, async (req, res) => {
  const { fullName, email, password, department, role } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can add employees" });
  }

  try {
    // Find the department by name
    const departmentRecord = await Department.findOne({ name: department });
    if (!departmentRecord) {
      return res.status(400).json({ message: "Department not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({
      fullName,
      email,
      password: hashedPassword,
      department: departmentRecord._id,  // Use the department's ObjectId
      role,
    });

    await employee.save();
    res.json({ message: "Employee added successfully", employee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message || error });
  }
});

// Edit Employee
app.put("/edit-employee/:id", authenticateToken, async (req, res) => {
  const { fullName, email, department, role } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can edit employees" });
  }

  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { fullName, email, department, role }, { new: true });
    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Delete Employee
app.delete("/delete-employee/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can delete employees" });
  }

  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Get All Employees
app.get("/employees", authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
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
