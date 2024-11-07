const express = require("express");
const { addFood } = require("../controllers/foodController");
const Food = require("../models/Food"); 

const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

router.post("/add-to-booking", auth, addFood);

module.exports = router;
