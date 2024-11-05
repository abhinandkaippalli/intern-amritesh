const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  showtime: { date: String, time: String },
  seats: [String],
  food: [
    {
      name: String,
      price: Number,
    },
  ],
  totalPrice: Number,
  paymentStatus: { type: Boolean, default: false },
  theater: { type: String },
  ticketType: { type: String, default: "M-Ticket" }, 
});

module.exports = mongoose.model("Booking", bookingSchema);
