const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  category: String, 
  price: Number,
});

module.exports = mongoose.model("Food", foodSchema);
