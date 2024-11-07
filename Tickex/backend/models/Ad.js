const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  link: { type: String }  //  a link to the ad
});

module.exports = mongoose.model("Ad", adSchema);
