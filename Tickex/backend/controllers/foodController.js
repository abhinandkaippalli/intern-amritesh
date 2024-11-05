const Booking = require("../models/Booking");

exports.addFood = async (req, res) => {
  const { bookingId, foodItems } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.food = booking.food.concat(foodItems);

    await booking.save();
    res.json({ message: "Food added to booking" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Failed to add food" });
  }
};
