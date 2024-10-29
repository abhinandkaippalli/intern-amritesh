const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const User = require("./models/user.model");
const Task = require("./models/Task.model");
const Department = require("./models/department.model");
const Employee = require("./models/employee.model");

const { authenticateToken, authorizeRole } = require("./utilities");

const app = express();
// const config = require("./config.json");

// MongoDB Connection
mongoose.connect(process.env.MONGODB_CONNECT);

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5000", credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECT }),
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Signup Route
app.post("/create-account", async (req, res) => {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  if (!["admin", "manager", "employee"].includes(role)) {
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

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, userInfo.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign({ _id: userInfo._id, role: userInfo.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ _id: userInfo._id, role: userInfo.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" });

    req.session.refreshToken = refreshToken;

    return res.json({
      error: false,
      user: {
        fullName: userInfo.fullName,
        email: userInfo.email,
        role: userInfo.role,
      },
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Refresh Token Route
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.session;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not found, please login again" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token expired or invalid:", err);
      req.session.destroy(); 
      res.clearCookie("connect.sid");
      return res.status(403).json({ message: "Invalid or expired refresh token, please login again" });
    }

    const newAccessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5s" } 
    );

    return res.json({ accessToken: newAccessToken });
  });
});


app.get("/departments", authenticateToken, authorizeRole("admin", "manager", "employee"), async (req, res) => {
  try {
    let departments;
    if (req.user.role === "employee") {
      // Employees only see their department
      const employee = await Employee.findOne({ _id: req.user._id }).populate("department");
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      departments = [employee.department];
    } else {
      // Admins and managers see all departments
      departments = await Department.find();
    }
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});
// Department Routes (Admin Only)
app.post("/departments", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = new Department({ name, description });
    await department.save();
    res.json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.put("/departments/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.delete("/departments/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

// Employee Routes (Admin and Manager)
app.post("/employees", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  const { fullName, email, password, department, role } = req.body;

  if (!fullName || !email || !password || !department || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the department exists
    const departmentRecord = await Department.findOne({ name: department });
    if (!departmentRecord) {
      return res.status(400).json({ message: "Department not found" });
    }

    // Create employee with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({
      fullName,
      email,
      password: hashedPassword,
      department: departmentRecord._id,
      role,
    });

    await employee.save();
    res.json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.put("/employees/:id", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  const { fullName, email, department, role } = req.body;

  // Validate request payload
  if (!fullName || !email || !department || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if department exists
    const departmentRecord = await Department.findOne({ name: department });
    if (!departmentRecord) {
      return res.status(400).json({ message: "Department not found." });
    }

    // Update employee with new data
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        department: departmentRecord._id,
        role,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.delete("/employees/:id", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

// Get Tasks (Admin, Manager, Employee)
app.get("/tasks", authenticateToken, authorizeRole("admin", "manager", "employee"), async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "employee") {
      // Employees only see their assigned tasks
      tasks = await Task.find({ employeeEmail: req.user.email });
    } else {
      // Admins and managers see all tasks
      tasks = await Task.find();
    }
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

// Task Assignment (Manager and Admin)
app.post("/tasks", authenticateToken, authorizeRole("manager", "admin"), async (req, res) => {
  const { employeeEmail, taskDescription, deadline } = req.body;

  try {
    const employee = await Employee.findOne({ email: employeeEmail });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const task = new Task({ employeeEmail, taskDescription, deadline });
    await task.save();
    res.json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.put("/tasks/:id", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  const { taskDescription, deadline, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskDescription, deadline, status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.delete("/tasks/:id", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

// Get All Employees (Admin and Manager)
app.get("/employees", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  try {
    const employees = await Employee.find().populate("department");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Get User Information
app.get("/get-user", authenticateToken, async (req, res) => {
  console.log("User ID from Token:", req.user._id);
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});
// Get the number of employees in each department
app.get("/departments/employee-count", authenticateToken, authorizeRole("admin", "manager"), async (req, res) => {
  try {
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: "employees", 
          localField: "_id",
          foreignField: "department",
          as: "employees",
        },
      },
      {
        $project: {
          name: 1,
          employeeCount: { $size: "$employees" },
        },
      },
    ]);

    res.json(departments);
  } catch (error) {
    console.error("Error fetching department employee count:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});
// Logout Route
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
