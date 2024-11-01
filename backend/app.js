const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");

mongoose.connect(process.env.MONGODB_CONNECT);

const app = express();
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

app.use("/auth", authRoutes);
app.use("/departments", departmentRoutes);
app.use("/employees", employeeRoutes);
app.use("/tasks", taskRoutes);

app.listen(8001, () => console.log("Server is running on port 8001"));

module.exports = app;
