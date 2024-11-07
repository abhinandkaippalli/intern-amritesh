const Department = require("../models/department.model");

async function createDepartment(req, res) {
  const { name, description } = req.body;

  try {
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) return res.status(400).json({ message: "Department already exists" });

    const department = new Department({ name, description });
    await department.save();
    res.json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getDepartments(req, res) {
  try {
    let departments;
    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ _id: req.user._id }).populate("department");
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      departments = [employee.department];
    } else {
      departments = await Department.find();
    }
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateDepartment(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updatedDepartment) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department updated successfully", department: updatedDepartment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteDepartment(req, res) {
  const { id } = req.params;

  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };
