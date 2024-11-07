const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  category: String, 
  location: String,
  imageUrl: String,
});

module.exports = mongoose.model("Event", eventSchema);
