const express = require("express");
const { authenticateToken, authorizeRole } = require("../utilities/auth");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../controllers/taskController");

const router = express.Router();

// Task routes
router.post(
  "/",
  authenticateToken,
  authorizeRole("manager", "admin"),
  createTask
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "manager"),
  updateTask
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "manager"),
  deleteTask
);
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin", "manager", "employee"),
  getTasks
);

module.exports = router;
