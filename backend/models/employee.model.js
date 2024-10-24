const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department' }, 
  role: { type: String, enum: ['admin', 'manager', 'employee'], required: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
