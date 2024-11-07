const express = require("express");
const Theater = require("../models/Theater");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch theaters" });
  }
});

module.exports = router;
