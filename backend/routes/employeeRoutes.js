const express = require("express");
const { authenticateToken, authorizeRole } = require("../utilities/auth");
const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
} = require("../controllers/employeeController");

const router = express.Router();

// Employee routes
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin", "manager"),
  createEmployee
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "manager"),
  updateEmployee
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "manager"),
  deleteEmployee
);
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin", "manager"),
  getAllEmployees
);

module.exports = router;
