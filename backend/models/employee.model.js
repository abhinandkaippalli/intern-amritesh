const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["employee", "manager", "admin"],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
