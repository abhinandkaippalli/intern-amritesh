const Task = require("../models/Task.model");
const Employee = require("../models/employee.model");

async function createTask(req, res) {
  const { employeeEmail, taskDescription, deadline } = req.body;

  try {
    const employee = await Employee.findOne({ email: employeeEmail });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const task = new Task({ employeeEmail, taskDescription, deadline });
    await task.save();
    res.json({ message: "Task assigned successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { taskDescription, deadline, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskDescription, deadline, status },
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getTasks(req, res) {
  try {
    const tasks =
      req.user.role === "employee"
        ? await Task.find({ employeeEmail: req.user.email })
        : await Task.find();
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { createTask, updateTask, deleteTask, getTasks };
