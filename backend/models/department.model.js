const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Department", departmentSchema);
