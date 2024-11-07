const Theater = require("../models/Theater");

exports.getCinemas = async (req, res) => {
  try {
    const cinemas = await Theater.find();
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cinemas" });
  }
};
