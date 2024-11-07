const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");

async function createEmployee(req, res) {
  const { fullName, email, password, department, role } = req.body;

  if (!fullName || !email || !password || !department || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({ fullName, email, password: hashedPassword, department, role });
    await employee.save();
    res.json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateEmployee(req, res) {
  const { id } = req.params;
  const { fullName, email, department, role } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id, { fullName, email, department, role }, { new: true, runValidators: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteEmployee(req, res) {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getAllEmployees(req, res) {
  try {
    const employees = await Employee.find().populate("department");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

module.exports = { createEmployee, updateEmployee, deleteEmployee, getAllEmployees };
