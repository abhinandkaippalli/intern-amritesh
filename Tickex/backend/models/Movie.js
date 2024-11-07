const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  genres: [String],
  languages: [String],
  formats: [String],
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  duration: String,
  cast: [{ name: String, role: String }],
  is_premier: { type: Boolean, default: false }, // New field to mark if a movie is premier
  showtimes: [
    {
      date: String,
      times: [
        {
          time: String,
          seats: [
            {
              seatNumber: String,
              isBooked: { type: Boolean, default: false },
              bookedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
              },
            },
          ],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);
