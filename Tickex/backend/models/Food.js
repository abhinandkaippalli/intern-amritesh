const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  count: { type: Number, default: 0 } 
});

module.exports = mongoose.model("Food", foodSchema);
