const express = require("express");
const { authenticateToken, authorizeRole } = require("../utilities/auth");
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const router = express.Router();

// Department routes
router.post("/", authenticateToken, authorizeRole("admin"), createDepartment);
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin", "manager", "employee"),
  getDepartments
);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateDepartment);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteDepartment
);

module.exports = router;
