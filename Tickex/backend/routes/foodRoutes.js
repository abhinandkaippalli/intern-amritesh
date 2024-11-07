const express = require("express");
const { addFood } = require("../controllers/foodController");
const Food = require("../models/Food");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch all available food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

// Add selected food items to a booking
router.post("/add-to-booking", auth, addFood);

module.exports = router;
