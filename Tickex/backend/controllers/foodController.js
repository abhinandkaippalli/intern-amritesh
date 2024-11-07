const Booking = require("../models/Booking");

exports.addFood = async (req, res) => {
  const { bookingId, foodItems } = req.body; // `foodItems` should be an array of { _id, count } objects

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Iterate over foodItems to update quantity in the booking
    foodItems.forEach((newItem) => {
      const existingItem = booking.food.find(
        (item) => item._id.toString() === newItem._id
      );
      if (existingItem) {
        // Update count if item already exists
        existingItem.count += newItem.count;
      } else {
        // Add as a new item
        booking.food.push(newItem);
      }
    });

    await booking.save();
    res.json({ message: "Food added to booking", booking });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Failed to add food" });
  }
};
