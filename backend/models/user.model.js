const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee",
    required: true,
  },
  department: { type: Schema.Types.ObjectId, ref: "Department" },
});

module.exports = mongoose.model("User", userSchema);
