const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee', required: true }, // Added role field
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
