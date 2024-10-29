const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  employeeEmail: { type: String, required: true },
  taskDescription: { type: String, required: true },
  deadline: { type: Date, required: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
